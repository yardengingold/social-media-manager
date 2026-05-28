import { useState, useEffect } from 'react';
import { useApp, FAM_DISPLAY, FAM_SANS } from '../AppContext.jsx';
import { Ico, PlatIcon } from '../Icons.jsx';
import { HOLIDAY_MAP } from '../data.js';

function fmtTime(d) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function navBtnStyle(t) {
  return {
    width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.line2}`,
    background: t.surface, color: t.muted, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FAM_SANS,
  };
}

function chipStyle(t, active) {
  return {
    padding: '5px 11px', borderRadius: 16,
    border: `1.5px solid ${active ? t.ink : t.line2}`,
    background: active ? t.ink : t.surface,
    color: active ? t.bg : t.muted,
    cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 11.5, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  };
}

// ── Post detail mini-modal ────────────────────────────────────────────────────
function PostDetailModal({ post, t, brand, onClose, onEdit }) {
  if (!post) return null;
  const pillarColors = t.pillarColors || {};
  const c = pillarColors[post.pillar] || t.accent;
  const statusColors = { scheduled: t.accent, draft: t.muted, published: t.accent2 };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.surface, borderRadius: 18, padding: 28,
        maxWidth: 520, width: '100%', border: `1px solid ${t.line}`,
        boxShadow: '0 24px 60px rgba(0,0,0,.18)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 12,
              background: `${statusColors[post.status]}1f`,
              color: statusColors[post.status],
              fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
            }}>{post.status}</span>
            {post.pillar && (
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 12,
                background: `${c}1f`, color: c, fontWeight: 700,
                letterSpacing: '.05em', textTransform: 'uppercase',
              }}>{post.pillar}</span>
            )}
            {post.type === 'story' && (
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 12,
                color: t.muted, border: `1px solid ${t.line2}`,
                fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase',
              }}>◐ Story</span>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: 'none',
            background: t.softer, cursor: 'pointer', color: t.muted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ico name="x" size={13}/>
          </button>
        </div>

        {/* Date & platforms */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: t.muted, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Ico name="clock" size={12} c={t.muted}/>
            {new Date(post.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {fmtTime(post.date)}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {post.platforms.map(pl => (
              <span key={pl} style={{
                width: 22, height: 22, borderRadius: 5,
                background: t.softer, display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <PlatIcon p={pl} size={11} color={t.muted}/>
              </span>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div style={{
          fontSize: 14, lineHeight: 1.65, color: t.text,
          fontFamily: FAM_DISPLAY, whiteSpace: 'pre-wrap',
          padding: '16px 20px', background: t.softer, borderRadius: 12,
          marginBottom: 20, maxHeight: 220, overflowY: 'auto',
        }}>
          {post.text}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { onEdit(post); onClose(); }} style={{
            flex: 1, padding: '10px 16px', background: t.ink, color: t.bg,
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontFamily: FAM_SANS, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <Ico name="pen" size={12} c={t.bg} sw={2}/> Edit post
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Month view ────────────────────────────────────────────────────────────────
function MonthView({ t, brand, year, month, posts, filter, onPostClick, setView }) {
  const today = new Date();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isHe = brand === 'gm';

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const dayLabels = isHe
    ? ["א'","ב'","ג'","ד'","ה'","ו'",'שבת']
    : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: t.softer }}>
        {dayLabels.map(d => (
          <div key={d} style={{
            padding: '12px 14px', fontSize: 10.5, color: t.muted,
            letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700,
          }}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((d, i) => {
          if (d === null) return (
            <div key={`empty-${i}`} style={{
              minHeight: 110, borderRight: `1px solid ${t.line}`,
              borderBottom: `1px solid ${t.line}`, background: t.softer,
            }}/>
          );

          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          const isFriday = i % 7 === 5;
          const holidayKey = `${year}-${month}-${d}`;
          const holidays = HOLIDAY_MAP[holidayKey] || [];

          const dayPosts = posts.filter(p => {
            const pd = new Date(p.date);
            const matchFilter = !filter || p.pillar === filter || p.series === filter;
            return pd.getFullYear() === year && pd.getMonth() === month && pd.getDate() === d && matchFilter;
          });

          return (
            <div key={`day-${d}`} style={{
              background: isToday ? t.accentBg : t.surface,
              padding: '10px 12px', minHeight: 110,
              borderRight: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{
                  fontFamily: FAM_DISPLAY, fontSize: 18, lineHeight: 1, letterSpacing: '-.02em',
                  color: isToday ? t.accent : t.text, fontWeight: isToday ? 700 : 400,
                }}>{d}</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {isFriday && brand === 'gm' && <span style={{ fontSize: 11 }}>🕯️</span>}
                  {holidays.slice(0, 1).map((h, hi) => (
                    <span key={hi} title={h.name} style={{ fontSize: 11 }}>{h.emoji}</span>
                  ))}
                </div>
              </div>
              {dayPosts.slice(0, 3).map(p => {
                const pillarColors = t.pillarColors || {};
                const c = pillarColors[p.pillar] || (p.series ? t.accent : t.accent);
                return (
                  <button key={p.id} onClick={() => onPostClick(p)} style={{
                    width: '100%', textAlign: 'left', fontFamily: FAM_SANS, cursor: 'pointer',
                    fontSize: 10, padding: '4px 7px', borderRadius: 6, marginBottom: 3,
                    background: p.status === 'draft' ? t.softer : `${c}1a`,
                    color: p.status === 'draft' ? t.muted : c,
                    fontWeight: 600, border: 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: c === t.muted ? t.muted : c, flexShrink: 0 }}/>
                    {p.type === 'story' && '◐ '}
                    {p.pillar || p.series || p.type || 'Post'}
                  </button>
                );
              })}
              {dayPosts.length > 3 && (
                <div style={{ fontSize: 9.5, color: t.muted, marginTop: 2 }}>+{dayPosts.length - 3} more</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────
function ListView({ t, posts, brand, onPostClick }) {
  const grouped = {};
  [...posts].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(p => {
    const key = new Date(p.date).toDateString();
    grouped[key] = grouped[key] || [];
    grouped[key].push(p);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Object.entries(grouped).map(([day, dayPosts]) => {
        const d = new Date(day);
        return (
          <div key={day} style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: FAM_DISPLAY, fontSize: 26, letterSpacing: '-.02em' }}>
                {d.getDate()}
              </div>
              <div style={{ fontSize: 12, color: t.muted, letterSpacing: '.05em' }}>
                {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })}
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: t.muted }}>
                {dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayPosts.map(p => {
                const pillarColors = t.pillarColors || {};
                const c = pillarColors[p.pillar] || t.accent;
                return (
                  <button key={p.id} onClick={() => onPostClick(p)} style={{
                    padding: 12, borderRadius: 10, background: t.softer,
                    border: `1px solid ${t.line}`, display: 'flex', gap: 12,
                    alignItems: 'center', cursor: 'pointer', fontFamily: FAM_SANS,
                    textAlign: 'left', color: t.text,
                  }}>
                    <div style={{ fontSize: 11, color: t.muted, fontVariantNumeric: 'tabular-nums', width: 64, flexShrink: 0 }}>
                      {fmtTime(p.date)}
                    </div>
                    <span style={{
                      fontSize: 9.5, padding: '3px 8px', borderRadius: 10,
                      background: `${c}1f`, color: c, fontWeight: 700,
                      letterSpacing: '.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>
                      {p.pillar || p.series || 'Post'}
                    </span>
                    <div style={{
                      flex: 1, fontSize: 12.5, lineHeight: 1.5,
                      minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.text}
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {p.platforms.map(pl => (
                        <span key={pl} style={{
                          width: 22, height: 22, borderRadius: 5, background: t.surface,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <PlatIcon p={pl} size={11} color={t.muted}/>
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Week view ─────────────────────────────────────────────────────────────────
function WeekView({ t, brand, year, month, posts, onPostClick }) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 14, padding: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
        {days.map((dayLabel, i) => {
          const dayDate = new Date(monday);
          dayDate.setDate(monday.getDate() + i);
          const isToday = dayDate.toDateString() === today.toDateString();

          const dayPosts = posts.filter(p => new Date(p.date).toDateString() === dayDate.toDateString());

          return (
            <div key={dayLabel} style={{ minHeight: 380 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: t.muted, fontWeight: 700, letterSpacing: '.1em' }}>
                  {dayLabel.toUpperCase()}
                </div>
                <div style={{ fontFamily: FAM_DISPLAY, fontSize: 22, color: isToday ? t.accent : t.text, letterSpacing: '-.02em' }}>
                  {dayDate.getDate()}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {dayPosts.map(p => {
                  const pillarColors = t.pillarColors || {};
                  const c = pillarColors[p.pillar] || t.accent;
                  return (
                    <button key={p.id} onClick={() => onPostClick(p)} style={{
                      padding: 8, background: `${c}10`,
                      borderLeft: `3px solid ${c}`, borderRadius: 6,
                      textAlign: 'left', cursor: 'pointer', border: `1px solid ${c}30`,
                      borderLeftWidth: 3, fontFamily: FAM_SANS,
                      display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                      <div style={{ fontSize: 10, color: c, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {fmtTime(p.date)}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>
                        {p.pillar || p.series || p.type || 'Post'}
                      </div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {p.platforms.slice(0, 4).map(pl => (
                          <span key={pl} style={{
                            width: 16, height: 16, borderRadius: 3, background: t.surface,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <PlatIcon p={pl} size={9} color={t.muted}/>
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Calendar screen ──────────────────────────────────────────────────────
export default function CalendarScreen() {
  const { t, brand, posts, setView, isMobile } = useApp();
  const isHe = brand === 'gm';

  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState('month');
  const [filter, setFilter]     = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const brandPosts = posts[brand] || [];
  const pillarColors = t.pillarColors || {};

  // Reset filter when brand switches so stale SBF filters don't hide GM posts
  useEffect(() => { setFilter(null); }, [brand]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              {MONTHS[month]}
            </div>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: '-.02em' }}>{year}</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button style={navBtnStyle(t)} onClick={prevMonth}><Ico name="chevL" size={13} c={t.muted}/></button>
            <button style={navBtnStyle(t)} onClick={nextMonth}><Ico name="chev"  size={13} c={t.muted}/></button>
          </div>
          <button onClick={goToday} style={{
            padding: '8px 14px', borderRadius: 8,
            background: t.surface, color: t.text,
            border: `1px solid ${t.line2}`, cursor: 'pointer',
            fontFamily: FAM_SANS, fontSize: 12, fontWeight: 500,
          }}>
            {isHe ? 'היום' : 'Today'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', padding: 4, background: t.surface, border: `1px solid ${t.line2}`, borderRadius: 10, gap: 2 }}>
            {[['month', isHe ? 'חודש' : 'Month'], ['week', isHe ? 'שבוע' : 'Week'], ['list', isHe ? 'רשימה' : 'List']].map(([k, lbl]) => (
              <button key={k} onClick={() => setViewMode(k)} style={{
                padding: '6px 12px', borderRadius: 6, border: 'none',
                background: viewMode === k ? t.ink : 'transparent',
                color: viewMode === k ? t.bg : t.muted,
                cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 11.5, fontWeight: 600,
              }}>{lbl}</button>
            ))}
          </div>
          <button onClick={() => setView('compose')} style={{
            padding: '10px 18px', background: t.ink, color: t.bg,
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontFamily: FAM_SANS, fontSize: 13, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <Ico name="plus" size={13} c={t.bg} sw={2.2}/>
            {isHe ? 'פוסט חדש' : 'Add post'}
          </button>
        </div>
      </div>

      {/* Pillar filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap', direction: 'ltr' }}>
        <span style={{ fontSize: 11, color: t.muted, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {isHe ? 'סינון:' : 'Filter:'}
        </span>
        <button onClick={() => setFilter(null)} style={chipStyle(t, filter === null)}>
          {isHe ? 'הכל' : 'All posts'}
        </button>
        {Object.entries(pillarColors).map(([p, c]) => (
          <button key={p} onClick={() => setFilter(filter === p ? null : p)} style={{
            ...chipStyle(t, filter === p),
            ...(filter === p ? { background: `${c}25`, borderColor: c, color: c } : {}),
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: c, display: 'inline-block' }}/>
            {p}
          </button>
        ))}
      </div>

      {/* Calendar views */}
      {viewMode === 'month' && (
        <div style={isMobile ? { overflowX: 'auto', marginInline: -16, paddingInline: 16, WebkitOverflowScrolling: 'touch' } : {}}>
          <div style={isMobile ? { minWidth: 520 } : {}}>
            <MonthView
              t={t} brand={brand} year={year} month={month}
              posts={brandPosts} filter={filter}
              onPostClick={setSelectedPost} setView={setView}
            />
          </div>
        </div>
      )}
      {viewMode === 'week' && (
        <div style={isMobile ? { overflowX: 'auto', marginInline: -16, paddingInline: 16, WebkitOverflowScrolling: 'touch' } : {}}>
          <div style={isMobile ? { minWidth: 520 } : {}}>
            <WeekView
              t={t} brand={brand} year={year} month={month}
              posts={brandPosts} onPostClick={setSelectedPost}
            />
          </div>
        </div>
      )}
      {viewMode === 'list' && (
        <ListView t={t} posts={brandPosts} brand={brand} onPostClick={setSelectedPost}/>
      )}

      {/* Post detail modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost} t={t} brand={brand}
          onClose={() => setSelectedPost(null)}
          onEdit={() => {/* wire to compose */}}
        />
      )}
    </div>
  );
}
