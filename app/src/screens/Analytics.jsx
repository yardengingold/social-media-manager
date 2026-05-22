import { useState, useMemo } from 'react';
import { useApp } from '../AppContext.jsx';
import { BRANDS } from '../data.js';
import { Ico } from '../Icons.jsx';

// ── tiny helpers ──────────────────────────────────────────────────────────────
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function lerp(a, b, t) { return a + (b - a) * t; }

// ── SVG line chart ────────────────────────────────────────────────────────────
function LineChart({ series, labels, height = 140, t }) {
  const W = 100; // viewBox units (percentage)
  const H = height;
  const PAD = { top: 10, bottom: 24, left: 4, right: 4 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const allVals = series.flatMap(s => s.data);
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  function xAt(i) {
    return PAD.left + (i / (labels.length - 1)) * innerW;
  }
  function yAt(v) {
    return PAD.top + (1 - (v - minV) / range) * innerH;
  }

  function makePath(data) {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ');
  }
  function makeArea(data, color) {
    const line = makePath(data);
    const base = `L ${xAt(data.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;
    return line + ' ' + base;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height, display: 'block', overflow: 'visible' }}
      preserveAspectRatio="none"
    >
      <defs>
        {series.map(s => (
          <linearGradient key={s.id} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={s.color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={s.color} stopOpacity="0.02"/>
          </linearGradient>
        ))}
      </defs>

      {/* horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const y = PAD.top + frac * innerH;
        return (
          <line key={frac}
            x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y}
            stroke={t.border} strokeWidth="0.4" strokeDasharray="1.5 1.5"
          />
        );
      })}

      {/* area fills */}
      {series.map(s => (
        <path key={`area-${s.id}`}
          d={makeArea(s.data)}
          fill={`url(#grad-${s.id})`}
        />
      ))}

      {/* lines */}
      {series.map(s => (
        <path key={`line-${s.id}`}
          d={makePath(s.data)}
          fill="none" stroke={s.color} strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      ))}

      {/* dots on last point */}
      {series.map(s => {
        const last = s.data.length - 1;
        return (
          <circle key={`dot-${s.id}`}
            cx={xAt(last)} cy={yAt(s.data[last])}
            r="1.4" fill={s.color}
          />
        );
      })}

      {/* x-axis labels */}
      {labels.map((l, i) => (
        <text key={l}
          x={xAt(i)} y={H - 4}
          textAnchor="middle"
          fontSize="5"
          fill={t.muted}
          fontFamily="inherit"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

// ── SVG donut chart ───────────────────────────────────────────────────────────
function DonutChart({ slices, size = 120 }) {
  const total = slices.reduce((s, x) => s + x.val, 0);
  const cx = size / 2, cy = size / 2;
  const r = size * 0.36, ir = size * 0.22;
  let angle = -Math.PI / 2;

  const paths = slices.map(sl => {
    const sweep = (sl.val / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep);
    const y2 = cy + r * Math.sin(angle + sweep);
    const xi1 = cx + ir * Math.cos(angle);
    const yi1 = cy + ir * Math.sin(angle);
    const xi2 = cx + ir * Math.cos(angle + sweep);
    const yi2 = cy + ir * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`;
    angle += sweep;
    return { ...sl, d, pct: ((sl.val / total) * 100).toFixed(0) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity="0.9"/>
      ))}
    </svg>
  );
}

// ── posting heatmap ───────────────────────────────────────────────────────────
const HOUR_LABELS = ['6a','8a','10a','12p','2p','4p','6p','8p','10p'];
const HOURS       = [6, 8, 10, 12, 14, 16, 18, 20, 22];
const DOW_LABELS  = ['M','T','W','T','F','S','S'];

function buildHeatmap(posts) {
  // map[dow][hourBucket] = count
  const map = Array.from({ length: 7 }, () => Array(HOURS.length).fill(0));
  posts.forEach(p => {
    const d = p.scheduledAt ? new Date(p.scheduledAt) : null;
    if (!d || isNaN(d)) return;
    const dow = (d.getDay() + 6) % 7; // Mon=0
    const h = d.getHours();
    const bucket = HOURS.findIndex((hh, i) => {
      const next = HOURS[i + 1] || 24;
      return h >= hh && h < next;
    });
    if (bucket >= 0 && bucket < HOURS.length) map[dow][bucket]++;
  });
  return map;
}

function Heatmap({ posts, t, accent }) {
  const map   = useMemo(() => buildHeatmap(posts), [posts]);
  const maxV  = Math.max(...map.flat(), 1);
  const CELL  = 26;
  const GAP   = 4;
  const cols  = HOURS.length;
  const rows  = 7;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `28px repeat(${cols}, ${CELL}px)`, gap: GAP, minWidth: 0 }}>
        {/* header row */}
        <div/>
        {HOUR_LABELS.map(l => (
          <div key={l} style={{ fontSize: 10, color: t.muted, textAlign: 'center', fontWeight: 500 }}>{l}</div>
        ))}

        {/* data rows */}
        {DOW_LABELS.map((day, ri) => (
          <>
            <div key={`lbl-${ri}`} style={{
              fontSize: 10, color: t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
            }}>{day}</div>
            {HOURS.map((_, ci) => {
              const v = map[ri][ci];
              const alpha = v === 0 ? 0 : 0.12 + (v / maxV) * 0.75;
              return (
                <div key={`${ri}-${ci}`}
                  title={v ? `${v} post${v > 1 ? 's' : ''}` : ''}
                  style={{
                    width: CELL, height: CELL, borderRadius: 5,
                    background: v === 0
                      ? t.bg
                      : accent,
                    opacity: v === 0 ? 1 : alpha + 0.1,
                    border: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: v > 0 ? '#fff' : t.muted, fontWeight: 700,
                    cursor: v > 0 ? 'default' : undefined,
                    transition: 'opacity .1s',
                  }}
                >
                  {v > 0 ? v : ''}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

// ── KPI tile ──────────────────────────────────────────────────────────────────
function KpiTile({ icon, label, value, sub, subUp, t }) {
  return (
    <div style={{
      background: t.card, borderRadius: 14, border: `1px solid ${t.border}`,
      padding: '16px 20px', flex: '1 1 140px', minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <Ico n={icon} size={15} color={t.muted}/>
        <span style={{ fontSize: 11, color: t.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: t.text, lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 11, marginTop: 5, fontWeight: 600,
          color: subUp === false ? '#c0392b' : subUp ? '#2d7a4f' : t.muted,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          {subUp !== undefined && <Ico n={subUp ? 'trending-up' : 'trending-down'} size={11} color={subUp ? '#2d7a4f' : '#c0392b'}/>}
          {sub}
        </div>
      )}
    </div>
  );
}

// ── platform row ──────────────────────────────────────────────────────────────
function PlatRow({ plat }) {
  const isUp = plat.growth?.startsWith('+');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 0',
    }}>
      <span style={{ fontSize: 22, lineHeight: 1 }}>{plat.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{plat.name}</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{plat.posts} posts · {plat.eng} eng</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{plat.followers}</div>
        <div style={{
          fontSize: 11, fontWeight: 600, marginTop: 1,
          color: isUp ? '#2d7a4f' : '#c0392b',
          display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end',
        }}>
          <Ico n={isUp ? 'trending-up' : 'trending-down'} size={10} color={isUp ? '#2d7a4f' : '#c0392b'}/>
          {plat.growth}
        </div>
      </div>
    </div>
  );
}

// ── top post row ──────────────────────────────────────────────────────────────
function TopPostRow({ post, rank, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: rank === 1 ? accent : '#f0ede8',
        color: rank === 1 ? '#fff' : '#888',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800,
      }}>
        {rank}
      </div>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{post.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: '#1a1612',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {post.text}
        </div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{post.plat}</div>
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700, color: accent,
        flexShrink: 0,
      }}>
        {post.eng}
      </div>
    </div>
  );
}

// ── range selector ────────────────────────────────────────────────────────────
function RangeBtn({ label, active, onClick, t }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 20,
      border: active ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
      background: active ? t.accent + '15' : 'transparent',
      color: active ? t.accent : t.muted,
      cursor: 'pointer', fontSize: 12, fontWeight: 600,
    }}>
      {label}
    </button>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function AnalyticsScreen() {
  const { brand, posts, t, isMobile } = useApp();
  const bd = BRANDS[brand];
  const stats  = bd.stats;
  const platDs = bd.platforms_data;
  const topPs  = bd.topPosts;
  const donut  = bd.donut;
  const [range, setRange] = useState('7d');

  const brandPosts = posts[brand] || [];

  // build engagement series from engData
  const engData = bd.engData || {};
  const engSeries = useMemo(() => {
    return Object.entries(engData).map(([key, data]) => {
      const platInfo = platDs.find(p =>
        p.name.toLowerCase().includes(key) ||
        key === 'ig'  && p.name.includes('Instagram') ||
        key === 'fb'  && p.name.includes('Facebook') && !p.name.includes('Group') ||
        key === 'fbg' && p.name.includes('Group') ||
        key === 'li'  && p.name.includes('LinkedIn') ||
        key === 'wa'  && p.name.includes('WhatsApp')
      );
      return {
        id:    key,
        label: platInfo?.name || key.toUpperCase(),
        color: platInfo?.color || t.accent,
        data,
      };
    });
  }, [engData, platDs, t.accent]);

  // total followers from donut
  const totalFollowers = donut.reduce((s, d) => s + d.val, 0);
  const fmtFollowers = totalFollowers >= 1000
    ? (totalFollowers / 1000).toFixed(1) + 'K'
    : String(totalFollowers);

  // queued count
  const queuedCount = brandPosts.filter(p => (p.status || 'scheduled') === 'scheduled').length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text }}>Analytics</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.muted }}>
            {bd.name} · last 7 days
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['7d','30d','90d'].map(r => (
            <RangeBtn key={r} label={r} active={range === r} onClick={() => setRange(r)} t={t}/>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <KpiTile icon="users"      label="Followers"   value={fmtFollowers}        sub={platDs[0]?.growth}   subUp t={t}/>
        <KpiTile icon="activity"   label="Engagement"  value={stats.engagement}    sub="+1.8% vs last week"  subUp t={t}/>
        <KpiTile icon="eye"        label="Avg Reach"   value={`${(bd.reachData?.[0]?.reduce((a,b)=>a+b,0)/7/100).toFixed(1)}K`} sub="per post" t={t}/>
        <KpiTile icon="send"       label="Posts"       value={stats.posts}         sub={`${queuedCount} in queue`} t={t}/>
      </div>

      {/* chart + donut */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* engagement chart */}
        <div style={{
          flex: '1 1 340px', minWidth: 0,
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>Engagement</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {engSeries.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 3, borderRadius: 2, background: s.color }}/>
                  <span style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <LineChart series={engSeries} labels={WEEK_LABELS} height={148} t={t}/>
        </div>

        {/* audience split */}
        <div style={{
          flex: isMobile ? '1 1 auto' : '0 0 200px',
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: '18px 20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 14 }}>Audience</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <DonutChart slices={donut} size={110}/>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {donut.map(sl => (
                <div key={sl.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: sl.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, color: t.muted, flex: 1 }}>{sl.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>
                    {((sl.val / totalFollowers) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* platforms + top posts */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* platforms */}
        <div style={{
          flex: '1 1 220px',
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: '18px 20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 4 }}>Platforms</div>
          <div>
            {platDs.map((p, i) => (
              <>
                <PlatRow key={p.name} plat={p}/>
                {i < platDs.length - 1 && (
                  <div style={{ height: 1, background: t.border }}/>
                )}
              </>
            ))}
          </div>
        </div>

        {/* top posts */}
        <div style={{
          flex: '1 1 280px',
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>Top Posts</div>
            <span style={{ fontSize: 11, color: t.muted }}>by engagement</span>
          </div>
          <div>
            {topPs.map((p, i) => (
              <>
                <TopPostRow key={i} post={p} rank={i + 1} accent={t.accent}/>
                {i < topPs.length - 1 && <div style={{ height: 1, background: t.border }}/>}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* posting heatmap */}
      <div style={{
        background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
        padding: '18px 20px', marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Ico n="grid" size={14} color={t.accent}/>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>Posting Heatmap</div>
          <span style={{ fontSize: 11, color: t.muted, marginLeft: 4 }}>
            {brandPosts.length} scheduled posts
          </span>
        </div>
        {brandPosts.length > 0 ? (
          <Heatmap posts={brandPosts} t={t} accent={t.accent}/>
        ) : (
          <div style={{
            padding: '32px 0', textAlign: 'center',
            color: t.muted, fontSize: 13, fontStyle: 'italic',
          }}>
            No scheduled posts yet — schedule some to see your activity map.
          </div>
        )}
        {/* legend */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 12, justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: 10, color: t.muted }}>Less</span>
          {[0.1, 0.3, 0.55, 0.75, 0.95].map(a => (
            <div key={a} style={{
              width: 14, height: 14, borderRadius: 3,
              background: t.accent, opacity: a,
              border: `1px solid ${t.border}`,
            }}/>
          ))}
          <span style={{ fontSize: 10, color: t.muted }}>More</span>
        </div>
      </div>
    </div>
  );
}
