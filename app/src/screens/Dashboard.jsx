import { useApp, FAM_DISPLAY, FAM_SANS } from '../AppContext.jsx';
import { Ico, PlatIcon } from '../Icons.jsx';
import { PEAK_TIMES, SUGGESTIONS, BRANDS } from '../data.js';

// ── Format helpers ─────────────────────────────────────────────────────────────
function fmtTime(d) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function fmtDay(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function timeUntil(d) {
  const diff = new Date(d) - new Date();
  if (diff <= 0) return 'now';
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `in ${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function GhostBtn({ t, children, icon, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', background: 'transparent', color: t.text,
      border: `1px solid ${t.line2}`, borderRadius: 10, cursor: 'pointer',
      fontFamily: FAM_SANS, fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 7, ...style,
    }}>
      {icon && <Ico name={icon} size={11} c={t.text} sw={2}/>}
      {children}
    </button>
  );
}

function SolidBtn({ t, children, icon, onClick, accent, small, style }) {
  const bg = accent || t.ink;
  return (
    <button onClick={onClick} style={{
      padding: small ? '7px 14px' : '10px 18px',
      background: bg, color: '#fff', border: 'none',
      borderRadius: 10, cursor: 'pointer', fontFamily: FAM_SANS,
      fontSize: small ? 12 : 13, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 7, ...style,
    }}>
      {icon && <Ico name={icon} size={small ? 11 : 13} c="#fff" sw={2.2}/>}
      {children}
    </button>
  );
}

// ── Hero: Next-up card ────────────────────────────────────────────────────────
function NextUpCard({ post, t, isHe }) {
  if (!post) return null;
  return (
    <div style={{
      padding: 26, background: t.accent, color: '#fff',
      borderRadius: 18, marginBottom: 18,
      position: 'relative', overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: post.media?.length ? '1fr 180px' : '1fr',
      gap: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${t.accent3} 0%, transparent 70%)`,
        opacity: .35, pointerEvents: 'none',
      }}/>

      <div style={{ position: 'relative', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <Ico name="bolt" size={14} c="#fff" sw={2.2}/>
          <span style={{ fontSize: 10.5, letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 700, opacity: .9 }}>
            {isHe ? 'הפוסט הבא שלכם' : 'Next from your queue'}
          </span>
          <span style={{ opacity: .6, fontSize: 11 }}>·</span>
          <span style={{ fontSize: 11.5, opacity: .9, fontVariantNumeric: 'tabular-nums' }}>
            {timeUntil(post.date)}
          </span>
        </div>

        <div style={{
          fontFamily: FAM_DISPLAY, fontSize: 22, lineHeight: 1.3,
          marginBottom: 16, letterSpacing: '-.015em',
        }}>
          "{post.text.slice(0, 140)}{post.text.length > 140 ? '…' : ''}"
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ico name="clock" size={12} c="#fff"/>
            {fmtDay(post.date)} · {fmtTime(post.date)}
          </span>
          <span style={{ display: 'flex', gap: 4 }}>
            {post.platforms.map(pl => (
              <span key={pl} style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'rgba(255,255,255,.2)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlatIcon p={pl} size={12} color="#fff"/>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── KPI Stat Tile ─────────────────────────────────────────────────────────────
function StatTile({ label, value, delta, big, tone = 'default', t }) {
  const bg    = tone === 'primary' ? t.ink : tone === 'quiet' ? t.softer : t.surface;
  const fg    = tone === 'primary' ? t.bg  : t.ink;
  const muted = tone === 'primary' ? '#a59a89' : t.muted;
  const deltaColor = tone === 'primary' ? t.accent3 : t.accent2;
  return (
    <div style={{
      padding: big ? '22px 24px' : '18px 18px',
      background: bg, color: fg, borderRadius: 14,
      border: tone === 'primary' ? 'none' : `1px solid ${t.line}`,
    }}>
      <div style={{ fontSize: 10.5, color: muted, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: FAM_DISPLAY, fontSize: big ? 44 : 32, lineHeight: 1, marginTop: 8, letterSpacing: '-.02em' }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: deltaColor, marginTop: 6, fontWeight: 500 }}>
        {delta}
      </div>
    </div>
  );
}

// ── 7-day week strip ──────────────────────────────────────────────────────────
function WeekStrip({ t, posts, brand }) {
  const today   = new Date();
  // Build Mon–Sun of current week
  const monday  = new Date(today);
  const dow     = today.getDay(); // 0=Sun
  monday.setDate(today.getDate() - ((dow + 6) % 7)); // go back to Monday
  monday.setHours(0, 0, 0, 0);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map((dayLabel, i) => {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        const isToday = dayDate.toDateString() === today.toDateString();

        const dayPosts = posts.filter(p => {
          const pd = new Date(p.date);
          return pd.toDateString() === dayDate.toDateString() && p.status !== 'published';
        });

        return (
          <div key={dayLabel} style={{
            padding: '12px 8px 10px',
            background: isToday ? t.accent : t.softer,
            color: isToday ? '#fff' : t.text,
            borderRadius: 10, minHeight: 110,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ fontSize: 10, opacity: isToday ? .9 : .6, fontWeight: 700, letterSpacing: '.1em' }}>
              {dayLabel.toUpperCase()}
            </div>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 20, lineHeight: 1, letterSpacing: '-.01em' }}>
              {dayDate.getDate()}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
              {dayPosts.slice(0, 2).map(p => {
                const pillarColors = t.pillarColors || {};
                const c = pillarColors[p.pillar] || (isToday ? 'rgba(255,255,255,.8)' : t.accent);
                const label = p.series || p.pillar || p.type || 'Post';
                return (
                  <div key={p.id} style={{
                    fontSize: 9.5, padding: '2px 5px', borderRadius: 4,
                    background: isToday ? 'rgba(255,255,255,.18)' : `${c}22`,
                    color: isToday ? '#fff' : c, fontWeight: 600,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.type === 'story' ? '◐ ' : ''}{label}
                  </div>
                );
              })}
              {dayPosts.length === 0 && (
                <div style={{ fontSize: 10, color: isToday ? 'rgba(255,255,255,.5)' : t.dim, marginTop: 'auto' }}>
                  + Add
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── AI Suggestions card ───────────────────────────────────────────────────────
function AiSuggestionsCard({ t, brand, isHe }) {
  const sugg = SUGGESTIONS[brand] || [];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ico name="sparkle" size={14} c={t.accent}/>
        <div style={{ fontFamily: FAM_DISPLAY, fontSize: 20, letterSpacing: '-.01em' }}>
          {isHe ? 'תובנות מהשבוע' : 'For your attention'}
        </div>
      </div>
      {sugg.map((s, i) => {
        const color = s.type === 'tip' ? t.accent : s.type === 'idea' ? t.accent2 : t.accent3;
        const iconName = s.type === 'tip' ? 'bolt' : s.type === 'idea' ? 'sparkle' : 'star';
        return (
          <div key={i} style={{
            padding: '12px 0',
            borderBottom: i < sugg.length - 1 ? `1px solid ${t.line}` : 'none',
            display: 'flex', gap: 11,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `${color}1f`, color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Ico name={iconName} size={13} c={color}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: t.text }}>{s.text}</div>
              <button style={{
                marginTop: 6, padding: 0, background: 'transparent', border: 'none',
                cursor: 'pointer', color, fontSize: 11.5, fontWeight: 600, fontFamily: FAM_SANS,
              }}>
                {s.action} →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Peak times widget ─────────────────────────────────────────────────────────
function PeakTimesWidget({ t, brand, isHe, onAnalytics }) {
  const peaks = PEAK_TIMES[brand] || [];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22, marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ico name="bolt" size={15} c={t.accent}/>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, letterSpacing: '-.01em' }}>
              {isHe ? 'הזמנים החזקים שלכם' : 'Your peak windows this week'}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 4, marginLeft: 23 }}>
            {isHe
              ? 'מבוסס על האינטראקציה שלכם ב-90 ימים האחרונים — לא נתונים גנריים'
              : 'Drawn from YOUR last 90 days of engagement — not generic best-times data'}
          </div>
        </div>
        <GhostBtn t={t} icon="chart" onClick={onAnalytics}>
          {isHe ? 'ראה גרף' : 'See heatmap'}
        </GhostBtn>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(peaks.length, 4)}, 1fr)`,
        gap: 10,
      }}>
        {peaks.map((peak, i) => {
          const c = (t.pillarColors || {})[peak.pillar] || t.accent;
          return (
            <div key={i} style={{
              padding: 16, background: t.softer, borderRadius: 12,
              border: `1px solid ${t.line}`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Accent bar on top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c }}/>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: c, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {peak.pillar}
                </span>
                <span style={{ fontFamily: FAM_DISPLAY, fontSize: 18, color: t.accent2, letterSpacing: '-.01em' }}>
                  {peak.lift}
                </span>
              </div>
              <div style={{ fontFamily: FAM_DISPLAY, fontSize: 24, lineHeight: 1.1, letterSpacing: '-.01em', marginBottom: 2 }}>
                {peak.day}
              </div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
                {peak.time}
              </div>
              <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5, marginBottom: 10, minHeight: 52 }}>
                {peak.why}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {peak.platforms.map(pl => (
                  <span key={pl} style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: t.surface, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${t.line}`,
                  }}>
                    <PlatIcon p={pl} size={11} color={t.muted}/>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Feature cards ─────────────────────────────────────────────────────────────
function FeatureCard({ t, bg, accentColor, icon, title, desc, cta, ctaIcon, onClick }) {
  return (
    <div style={{ padding: 22, background: bg, borderRadius: 16, border: `1px solid ${t.line}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${accentColor}1f`, color: accentColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>
        <Ico name={icon} size={20} c={accentColor}/>
      </div>
      <div style={{ fontFamily: FAM_DISPLAY, fontSize: 24, lineHeight: 1.1, letterSpacing: '-.01em', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
      <SolidBtn t={t} icon={ctaIcon} onClick={onClick} small>{cta}</SolidBtn>
    </div>
  );
}

// ── Upcoming post card (horizontal scroll) ────────────────────────────────────
function UpcomingCard({ p, t, brand, onClick }) {
  const isHe = brand === 'gm';
  const pillarColors = t.pillarColors || {};
  const c = pillarColors[p.pillar] || t.accent;
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, width: 240, padding: 14,
      background: t.surface, border: `1px solid ${t.line}`,
      borderRadius: 14, cursor: 'pointer', textAlign: 'left',
      fontFamily: FAM_SANS, color: t.text,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontSize: 9.5, padding: '3px 8px', borderRadius: 12,
          background: `${c}1f`, color: c, fontWeight: 700,
          letterSpacing: '.05em', textTransform: 'uppercase',
        }}>
          {p.pillar || p.series || 'Post'}{p.type === 'story' ? ' · STORY' : ''}
        </span>
        <span style={{ fontSize: 10.5, color: t.muted, fontWeight: 500 }}>
          {new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' })} {new Date(p.date).getDate()}
        </span>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: t.text, marginBottom: 10, minHeight: 56 }}>
        {p.text.slice(0, 110)}{p.text.length > 110 ? '…' : ''}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {p.platforms.map(pl => (
            <span key={pl} style={{
              width: 22, height: 22, borderRadius: 5,
              background: t.softer, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <PlatIcon p={pl} size={11} color={t.muted}/>
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: t.muted, fontVariantNumeric: 'tabular-nums' }}>
          {fmtTime(p.date)}
        </span>
      </div>
    </button>
  );
}

// ── Pillar progress — SBF only ────────────────────────────────────────────────
function PillarProgress({ t, brand, posts, onCompose }) {
  const b = BRANDS[brand];
  const pillars = b.pillars || [];

  // Count scheduled posts per pillar for this week
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const countMap = {};
  posts.filter(p => {
    const d = new Date(p.date);
    return d >= monday && d <= sunday && p.status === 'scheduled';
  }).forEach(p => {
    const pillarMatch = pillars.find(pl =>
      pl.types?.some(type => type.id === p.series)
    );
    if (pillarMatch) {
      countMap[pillarMatch.label] = (countMap[pillarMatch.label] || 0) + 1;
    }
  });

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22, marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, letterSpacing: '-.01em' }}>Your three pillars</div>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>
            The framework that's grown your engagement 23% this quarter
          </div>
        </div>
        <GhostBtn t={t} icon="edit" onClick={onCompose}>Plan one</GhostBtn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {pillars.map(p => {
          const c = (t.pillarColors || {})[p.label] || t.accent;
          const count = countMap[p.label] || 0;
          const target = 4;
          const pct = Math.min((count / target) * 100, 100);
          return (
            <div key={p.label} style={{ padding: 16, background: t.softer, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: t.muted, letterSpacing: '.1em', fontWeight: 700 }}>
                    {p.day?.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, marginTop: 4, letterSpacing: '-.01em', color: c }}>
                    {p.label}
                  </div>
                </div>
                <div style={{ fontFamily: FAM_DISPLAY, fontSize: 28, color: c, letterSpacing: '-.02em' }}>
                  {count}<span style={{ color: t.dim, fontSize: 18 }}>/{target}</span>
                </div>
              </div>
              <div style={{ height: 4, background: `${c}25`, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 2, transition: 'width .4s' }}/>
              </div>
              <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── GM weekly cadence ─────────────────────────────────────────────────────────
function GmCadence({ t }) {
  const pillars = BRANDS.gm.pillars || [];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22, marginBottom: 22 }}>
      <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, letterSpacing: '-.01em', marginBottom: 14, direction: 'rtl' }}>
        סדר שבועי של סטוריז
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, direction: 'rtl' }}>
        {pillars.map(p => (
          <div key={p.label} style={{ padding: 16, background: t.softer, borderRadius: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: t.muted, letterSpacing: '.06em', fontWeight: 700 }}>
              {p.day} · {p.slot}
            </div>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 19, marginTop: 4, letterSpacing: '-.01em', color: t.accent }}>
              {p.label}
            </div>
            <div style={{ fontSize: 11.5, color: t.muted, marginTop: 6, lineHeight: 1.4 }}>
              "{p.desc}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t, brand, posts, setView } = useApp();
  const isHe = brand === 'gm';
  const brandPosts = posts[brand] || [];
  const b = BRANDS[brand];

  const upcoming = brandPosts
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const next = upcoming[0];

  const scheduledCount = upcoming.length;

  return (
    <div>
      {/* Hero: Next up */}
      <NextUpCard post={next} t={t} isHe={isHe}/>

      {/* KPI stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
        <StatTile big label={isHe ? 'עוקבים' : 'Followers'}    value={b.stats.followers}   delta="+5.4% this week"     tone="primary" t={t}/>
        <StatTile     label={isHe ? 'אינטראקציה' : 'Engagement'} value={b.stats.engagement}  delta="+0.8 pp"             t={t}/>
        <StatTile     label={isHe ? 'טווח 7 ימים' : 'Reach (7d)'} value={brand === 'sbf' ? '12.3K' : '8.1K'} delta="+18%"  t={t}/>
        <StatTile     label={isHe ? 'בתור' : 'Queued'}           value={String(scheduledCount)} delta="next 7 days"    tone="quiet" t={t}/>
      </div>

      {/* This week + AI suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 22 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, letterSpacing: '-.01em' }}>
                {isHe ? 'השבוע' : "This week's plan"}
              </div>
              <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>
                {brand === 'sbf' ? '3 pillars · posts this week' : 'סדר שבועי קבוע · 4 סטוריז'}
              </div>
            </div>
            <GhostBtn t={t} icon="cal" onClick={() => setView('calendar')}>
              {isHe ? 'יומן' : 'Open calendar'}
            </GhostBtn>
          </div>
          <WeekStrip t={t} posts={brandPosts} brand={brand}/>
        </div>

        <AiSuggestionsCard t={t} brand={brand} isHe={isHe}/>
      </div>

      {/* Peak times */}
      <PeakTimesWidget t={t} brand={brand} isHe={isHe} onAnalytics={() => setView('analytics')}/>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
        <FeatureCard
          t={t} bg={t.surface} accentColor={t.accent} icon="sparkle"
          title={isHe ? 'תכננו את השבוע' : 'Plan a whole week'}
          desc={isHe
            ? 'תארו נושא ונייצר 7 ימים של תוכן + סטוריז, מתוזמן בשעות השיא'
            : "Tell us a theme. Get 7 days of drafts + stories, scheduled for your best times."}
          cta={isHe ? 'התחילו' : 'Start a plan'} ctaIcon="arrowR"
          onClick={() => setView('compose')}
        />
        <FeatureCard
          t={t} bg={t.softer} accentColor={t.accent2} icon="folder"
          title={isHe ? 'העלאה מרובה' : 'Bulk drop'}
          desc={isHe
            ? 'תיקייה של תמונות וסרטונים → AI מציע כיתובים, פילרים ותזמון'
            : 'A folder of photos + videos. AI suggests captions, pillars, and slots for each.'}
          cta={isHe ? 'בחרו תיקייה' : 'Open bulk drop'} ctaIcon="folder"
          onClick={() => setView('bulk')}
        />
      </div>

      {/* Coming up — horizontal scroll */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, letterSpacing: '-.01em' }}>
              {isHe ? 'תור פרסום' : 'Coming up'}
            </div>
            <button onClick={() => setView('queue')} style={{
              background: 'transparent', border: 'none', color: t.accent,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FAM_SANS,
            }}>
              {isHe ? 'תור מלא' : 'Full queue'} →
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {upcoming.slice(0, 8).map(p => (
              <UpcomingCard key={p.id} p={p} t={t} brand={brand} onClick={() => {}}/>
            ))}
          </div>
        </div>
      )}

      {/* Pillar progress (SBF) or weekly cadence (GM) */}
      {brand === 'sbf' && (
        <PillarProgress t={t} brand={brand} posts={brandPosts} onCompose={() => setView('compose')}/>
      )}
      {brand === 'gm' && (
        <GmCadence t={t}/>
      )}
    </div>
  );
}
