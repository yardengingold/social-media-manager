import { useState } from 'react';
import { useApp, FAM_DISPLAY, FAM_SANS } from './AppContext.jsx';
import { Ico, PlatIcon, BrandMark } from './Icons.jsx';
import { BRANDS } from './data.js';

// ── Shared button style helpers ───────────────────────────────────────────────
function iconBtnStyle(t) {
  return {
    width: 38, height: 38, borderRadius: 10,
    border: `1px solid ${t.line2}`, background: t.surface,
    color: t.text, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

// ── Side Nav (desktop / tablet) ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Today',    icon: 'sun' },
  { id: 'calendar',  label: 'Calendar', icon: 'cal' },
  { id: 'compose',   label: 'Compose',  icon: 'edit' },
  { id: 'bulk',      label: 'Bulk drop', icon: 'folder' },
  { id: 'queue',     label: 'Queue',    icon: 'list', showBadge: true },
  { id: 'stories',   label: 'Stories',  icon: 'star' },
  { id: 'inbox',     label: 'Inbox',    icon: 'inbox' },
  { id: 'library',   label: 'Library',  icon: 'library' },
  { id: 'analytics', label: 'Insights', icon: 'chart' },
];

export function SideNav({ collapsed = false }) {
  const { t, brand, setBrand, view, setView, scheduledCount } = useApp();

  return (
    <aside style={{
      width: collapsed ? 68 : 234, background: t.surface,
      borderRight: `1px solid ${t.line}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      padding: collapsed ? '20px 10px' : '20px 16px',
      height: '100%', overflowY: 'auto',
    }}>

      {/* App logo mark */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22,
        padding: collapsed ? 0 : '0 6px',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: t.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Ico name="flower" size={18} c="#fff" sw={1.8}/>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: FAM_DISPLAY, fontSize: 20, lineHeight: 1, letterSpacing: '-.01em', color: t.ink }}>
              Bloom
            </div>
            <div style={{ fontSize: 9.5, color: t.muted, marginTop: 2, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Social, well-tended
            </div>
          </div>
        )}
      </div>

      {/* Brand switcher */}
      {!collapsed && (
        <div style={{ padding: 10, background: t.softer, borderRadius: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: t.muted, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, paddingLeft: 4 }}>
            Working on
          </div>
          {['sbf', 'gm'].map(id => (
            <button key={id} onClick={() => setBrand(id)} style={{
              width: '100%', padding: '9px 10px', borderRadius: 10, marginBottom: 4,
              background: id === brand ? t.surface : 'transparent',
              border: id === brand ? `1px solid ${t.line2}` : '1px solid transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: FAM_SANS, boxShadow: id === brand ? '0 1px 0 rgba(0,0,0,.03)' : 'none',
            }}>
              <BrandMark brand={id} size={28}/>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>
                  {id === 'sbf' ? 'Sold By Fogel' : 'Givat Morgan'}
                </div>
                <div style={{ fontSize: 10, color: t.muted, marginTop: 1 }}>
                  {BRANDS[id].stats.followers} · {id === brand ? scheduledCount : BRANDS[id].stats.scheduled} queued
                </div>
              </div>
              {id === brand && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: t.accent, flexShrink: 0 }}/>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Collapsed brand dots */}
      {collapsed && (
        <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          {['sbf', 'gm'].map(id => (
            <button key={id} onClick={() => setBrand(id)} style={{
              padding: 4, background: 'transparent', border: 'none', cursor: 'pointer',
              borderRadius: 10,
              outline: id === brand ? `2px solid ${t.accent}` : 'none', outlineOffset: 2,
            }}>
              <BrandMark brand={id} size={30}/>
            </button>
          ))}
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(it => {
          const active = view === it.id;
          const badge  = it.showBadge ? scheduledCount : null;
          return (
            <button key={it.id} onClick={() => setView(it.id)} style={{
              width: '100%', padding: collapsed ? '9px 0' : '9px 12px', borderRadius: 10, marginBottom: 2,
              background: active ? t.soft : 'transparent',
              color: active ? t.ink : t.muted,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 11,
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontFamily: FAM_SANS, fontSize: 13, fontWeight: active ? 600 : 500,
              textAlign: 'left', position: 'relative',
            }}>
              <Ico name={it.icon} size={17} c={active ? t.accent : t.muted}/>
              {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
              {!collapsed && badge != null && badge > 0 && (
                <span style={{
                  background: t.accent, color: '#fff', fontSize: 10,
                  fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                }}>{badge}</span>
              )}
              {collapsed && badge != null && badge > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 8,
                  width: 8, height: 8, borderRadius: 4, background: t.accent,
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 8px 4px', borderTop: `1px solid ${t.line}`, marginTop: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: t.accent2, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11.5, fontWeight: 600, flexShrink: 0,
          }}>YF</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>Yarden Fogel</div>
            <div style={{ fontSize: 10, color: t.muted }}>Pro · 2 brands</div>
          </div>
          <button style={{
            marginLeft: 'auto', width: 26, height: 26, borderRadius: 6,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted,
          }}>
            <Ico name="settings" size={14}/>
          </button>
        </div>
      )}
    </aside>
  );
}

// ── Top Bar (desktop) ─────────────────────────────────────────────────────────
const GREETINGS = {
  dashboard: 'A good day to post',
  calendar:  'Your month',
  compose:   'Make something',
  bulk:      'Plan a batch',
  queue:     'In your queue',
  analytics: 'How it went',
  stories:   'Stories planner',
  inbox:     'Inbox',
  library:   'Content library',
};

export function TopBar() {
  const { t, view, setView } = useApp();
  const now = new Date();
  const dayStr  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <header style={{
      padding: '22px 32px 18px', display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', background: t.bg, gap: 16, flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: t.muted, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          {dayStr} · {dateStr}
        </div>
        <div style={{
          fontFamily: FAM_DISPLAY, fontSize: 'clamp(22px, 2.8vw, 38px)', lineHeight: 1.05,
          marginTop: 2, letterSpacing: '-.02em', color: t.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {GREETINGS[view] || view}.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button style={iconBtnStyle(t)} title="Search"><Ico name="search" size={15}/></button>
        <button style={{ ...iconBtnStyle(t), position: 'relative' }} title="Notifications" onClick={() => setView('inbox')}>
          <Ico name="bell" size={15}/>
          <span style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: 3, background: t.accent }}/>
        </button>
        <button
          onClick={() => setView('compose')}
          style={{
            padding: '10px 18px', background: t.ink, color: t.bg, border: 'none',
            borderRadius: 10, cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 13,
            fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
          }}
        >
          <Ico name="plus" size={13} c={t.bg} sw={2.2}/> New post
        </button>
      </div>
    </header>
  );
}

// ── Mobile Header ─────────────────────────────────────────────────────────────
export function MobileHeader() {
  const { t, brand, setBrand, b, setView } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      padding: '14px 16px', background: t.bg, borderBottom: `1px solid ${t.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0, position: 'relative', zIndex: 40,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: FAM_SANS, color: t.text,
      }}>
        <BrandMark brand={brand} size={34}/>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: FAM_DISPLAY, fontSize: 18, lineHeight: 1, color: t.ink }}>
            {brand === 'sbf' ? 'Fogel' : 'גבעת'}
          </div>
          <div style={{ fontSize: 10, color: t.muted, marginTop: 3, letterSpacing: '.06em' }}>
            {b.stats.followers} followers
          </div>
        </div>
        <Ico name="chevD" size={13} c={t.muted}/>
      </button>

      <button onClick={() => setView('inbox')} style={{ ...iconBtnStyle(t), position: 'relative' }}>
        <Ico name="bell" size={15} c={t.text}/>
        <span style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: 3, background: t.accent }}/>
      </button>

      {/* Brand dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 68, left: 16, right: 16,
          background: t.surface, borderRadius: 14, border: `1px solid ${t.line2}`,
          padding: 8, zIndex: 50, boxShadow: '0 18px 40px -10px rgba(0,0,0,.18)',
        }}>
          {['sbf', 'gm'].map(id => (
            <button key={id} onClick={() => { setBrand(id); setOpen(false); }} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: id === brand ? t.softer : 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, fontFamily: FAM_SANS,
            }}>
              <BrandMark brand={id} size={36}/>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>
                  {id === 'sbf' ? 'Sold By Fogel' : 'Givat Morgan'}
                </div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>{BRANDS[id].sub}</div>
              </div>
              {id === brand && <Ico name="check" size={15} c={t.accent}/>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ── Mobile Nav (bottom tab bar) ───────────────────────────────────────────────
const MOBILE_NAV = [
  { id: 'dashboard', label: 'Today',   icon: 'sun' },
  { id: 'calendar',  label: 'Cal',     icon: 'cal' },
  { id: 'compose',   label: '',        icon: 'plus', primary: true },
  { id: 'queue',     label: 'Queue',   icon: 'list' },
  { id: 'analytics', label: 'Stats',   icon: 'chart' },
];

export function MobileNav() {
  const { t, view, setView } = useApp();
  return (
    <nav style={{
      flexShrink: 0, background: t.surface, borderTop: `1px solid ${t.line}`,
      padding: '8px 8px env(safe-area-inset-bottom, 16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {MOBILE_NAV.map(it => {
        if (it.primary) return (
          <button key={it.id} onClick={() => setView(it.id)} style={{
            background: t.accent, color: '#fff', border: 'none', cursor: 'pointer',
            width: 52, height: 52, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 20px ${t.accent}55`, marginTop: -18,
          }}>
            <Ico name="plus" size={22} c="#fff" sw={2.4}/>
          </button>
        );
        const active = view === it.id;
        return (
          <button key={it.id} onClick={() => setView(it.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 10px', minWidth: 48, minHeight: 44,
            color: active ? t.ink : t.muted, fontFamily: FAM_SANS,
            justifyContent: 'center',
          }}>
            <Ico name={it.icon} size={19} c={active ? t.accent : t.muted}/>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
