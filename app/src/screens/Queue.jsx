import { useState, useMemo } from 'react';
import { useApp } from '../AppContext.jsx';
import { PLATFORMS, PLAT_COLORS, PLAT_CHIP_LABELS, BRANDS } from '../data.js';
import { Ico, PlatIcon } from '../Icons.jsx';

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtDateTime(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function relativeTime(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';
  const now = new Date();
  const diff = d - now;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hrs  = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);

  if (diff < 0) {
    if (mins < 60)  return `${mins}m ago`;
    if (hrs  < 24)  return `${hrs}h ago`;
    return `${days}d ago`;
  }
  if (mins < 60)  return `in ${mins}m`;
  if (hrs  < 24)  return `in ${hrs}h`;
  if (days === 1) return 'tomorrow';
  return `in ${days}d`;
}

// ── delete-confirm mini-modal ─────────────────────────────────────────────────
function DeleteModal({ post, onConfirm, onCancel, t }) {
  const caption = post.text || post.caption || '';
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={onCancel}
    >
      <div style={{
        background: t.surface, borderRadius: 20, padding: 28, maxWidth: 380, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,.22)',
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: t.text }}>
          Delete post?
        </div>
        <div style={{
          fontSize: 13, color: t.muted, marginBottom: 22,
          background: t.softer, borderRadius: 10, padding: '10px 14px',
          borderLeft: `3px solid ${t.accent}`,
        }}>
          {(caption || '(no caption)').slice(0, 120)}{caption.length > 120 ? '…' : ''}
        </div>
        <p style={{ fontSize: 13, color: t.muted, marginBottom: 24 }}>
          This will permanently remove the post from your queue and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '9px 18px', borderRadius: 10, border: `1px solid ${t.line}`,
            background: 'transparent', color: t.text, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: '#c0392b', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    scheduled: { bg: '#e8f4ed', color: '#2d7a4f', label: 'Scheduled' },
    draft:     { bg: '#f5f0e8', color: '#8c6d3a', label: 'Draft'      },
    published: { bg: '#eef3f8', color: '#2c5f8a', label: 'Published'  },
  };
  const c = cfg[status] || cfg.scheduled;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600, letterSpacing: '.4px',
      padding: '3px 9px', borderRadius: 20,
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: c.color,
        flexShrink: 0,
      }}/>
      {c.label}
    </span>
  );
}

// ── single post card ──────────────────────────────────────────────────────────
function PostCard({ post, brand, onEdit, onDelete, onMarkPosted, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const platforms = Array.isArray(post.platforms) ? post.platforms : [];

  // Pillars is an array — find by label
  const pillarList = BRANDS[brand]?.pillars || [];
  const pillarCfg  = pillarList.find(p => p.label === post.pillar);
  const accentColor = pillarCfg?.color || t.accent;

  // Posts use `date` field; support legacy `scheduledAt` too
  const postDate = post.date || post.scheduledAt;
  const rel      = relativeTime(postDate);
  const caption  = post.text || post.caption || '';
  const hasImage = post.media?.length > 0;

  return (
    <div style={{
      background: t.surface,
      borderRadius: 16,
      border: `1px solid ${t.line}`,
      overflow: 'hidden',
      transition: 'box-shadow .15s',
    }}>
      <div style={{ display: 'flex', gap: 0 }}>

        {/* accent stripe */}
        <div style={{
          width: 4, flexShrink: 0,
          background: accentColor,
        }}/>

        {/* main content */}
        <div style={{ flex: 1, padding: '16px 18px' }}>

          {/* top row: date pill + status + menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {postDate && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: t.softer, borderRadius: 8, padding: '4px 10px',
                fontSize: 12, color: t.muted, fontWeight: 500,
                border: `1px solid ${t.line}`,
              }}>
                <Ico name="cal" size={13} c={t.muted}/>
                {fmtDateTime(postDate)}
                {rel && (
                  <span style={{ color: t.accent, fontWeight: 600 }}>{rel}</span>
                )}
              </div>
            )}
            <StatusBadge status={post.status || 'scheduled'}/>
            <div style={{ flex: 1 }}/>

            {/* kebab menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${t.line}`,
                  background: menuOpen ? t.softer : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.muted,
                }}
              >
                <Ico name="dot" size={16} c={t.muted}/>
              </button>
              {menuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)}/>
                  <div style={{
                    position: 'absolute', right: 0, top: 38,
                    background: t.surface, border: `1px solid ${t.line}`,
                    borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.14)',
                    zIndex: 100, minWidth: 160, padding: '6px 0', overflow: 'hidden',
                  }}>
                    {[
                      { icon: 'pen',   label: 'Edit',          action: () => { onEdit(post); setMenuOpen(false); } },
                      ...(post.status !== 'published' ? [
                        { icon: 'check', label: 'Mark as posted', action: () => { onMarkPosted(post); setMenuOpen(false); } },
                      ] : []),
                      { icon: 'trash', label: 'Delete',         action: () => { onDelete(post); setMenuOpen(false); }, danger: true },
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{
                        width: '100%', textAlign: 'left', padding: '9px 14px',
                        border: 'none', background: 'transparent',
                        color: item.danger ? '#c0392b' : t.text,
                        cursor: 'pointer', fontSize: 13,
                        display: 'flex', alignItems: 'center', gap: 9,
                        fontWeight: item.danger ? 600 : 500,
                      }}>
                        <Ico name={item.icon} size={14} c={item.danger ? '#c0392b' : t.muted}/>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* pillar + series tags */}
          {(post.pillar || post.series) && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {post.pillar && (
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '.3px',
                  padding: '2px 8px', borderRadius: 20,
                  background: accentColor + '22', color: accentColor,
                  textTransform: 'uppercase',
                }}>
                  {post.pillar}
                </span>
              )}
              {post.series && (
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                  background: t.softer, color: t.muted, border: `1px solid ${t.line}`,
                }}>
                  {post.series}
                </span>
              )}
            </div>
          )}

          {/* caption */}
          <p style={{
            fontSize: 14, lineHeight: 1.55, color: t.text,
            margin: 0, marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}>
            {caption || <span style={{ color: t.muted, fontStyle: 'italic' }}>No caption</span>}
          </p>

          {/* bottom row: platforms + image thumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {platforms.map(p => (
                <span key={p} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600,
                  padding: '3px 8px', borderRadius: 20,
                  background: (PLAT_COLORS[p] || t.accent) + '18',
                  color: PLAT_COLORS[p] || t.accent,
                }}>
                  <PlatIcon p={p} size={11} color={PLAT_COLORS[p] || t.accent}/>
                  {PLAT_CHIP_LABELS[p] || p.toUpperCase()}
                </span>
              ))}
            </div>
            <div style={{ flex: 1 }}/>
            {hasImage && post.media[0]?.dataUrl && (
              <div style={{
                width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                border: `1px solid ${t.line}`, flexShrink: 0,
              }}>
                <img
                  src={post.media[0].dataUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── empty state ───────────────────────────────────────────────────────────────
function EmptyState({ tab, t, onCompose }) {
  const msgs = {
    all:       { icon: 'inbox',   head: 'Queue is empty',         sub: 'Schedule your first post to get started.' },
    scheduled: { icon: 'clock',   head: 'Nothing scheduled yet',  sub: 'Use Compose to schedule posts ahead of time.' },
    draft:     { icon: 'edit',    head: 'No drafts',              sub: 'Save a post as a draft to find it here.' },
    published: { icon: 'check',   head: 'No published posts yet', sub: 'Posts you mark as published will appear here.' },
  };
  const m = msgs[tab] || msgs.all;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', gap: 16, textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: t.accent + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ico name={m.icon} size={28} c={t.accent}/>
      </div>
      <div style={{ fontWeight: 700, fontSize: 17, color: t.text }}>{m.head}</div>
      <div style={{ fontSize: 13, color: t.muted, maxWidth: 300 }}>{m.sub}</div>
      {tab !== 'published' && (
        <button onClick={onCompose} style={{
          marginTop: 4,
          padding: '10px 22px', borderRadius: 12,
          background: t.accent, color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600,
        }}>
          + New post
        </button>
      )}
    </div>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function QueueScreen() {
  const { brand, posts, updatePosts, t, setView, showToast } = useApp();
  const brandPosts = posts[brand] || [];

  const [activeTab, setActiveTab] = useState('all');
  const [sortAsc,   setSortAsc]   = useState(true);
  const [deletePending, setDeletePending] = useState(null);

  // counts
  const counts = useMemo(() => ({
    all:       brandPosts.length,
    scheduled: brandPosts.filter(p => (p.status || 'scheduled') === 'scheduled').length,
    draft:     brandPosts.filter(p => p.status === 'draft').length,
    published: brandPosts.filter(p => p.status === 'published').length,
  }), [brandPosts]);

  // filtered + sorted — use `date` field (with `scheduledAt` fallback)
  const visible = useMemo(() => {
    let list = activeTab === 'all'
      ? [...brandPosts]
      : brandPosts.filter(p => (p.status || 'scheduled') === activeTab);

    list.sort((a, b) => {
      const da = a.date || a.scheduledAt ? new Date(a.date || a.scheduledAt) : new Date(0);
      const db = b.date || b.scheduledAt ? new Date(b.date || b.scheduledAt) : new Date(0);
      return sortAsc ? da - db : db - da;
    });
    return list;
  }, [brandPosts, activeTab, sortAsc]);

  function handleEdit(post) {
    setView('compose');
  }

  function handleDeleteConfirm() {
    if (!deletePending) return;
    const id = deletePending.id;
    updatePosts(brand, prev => prev.filter(p => p.id !== id));
    showToast('Post deleted', '#c0392b');
    setDeletePending(null);
  }

  function handleMarkPosted(post) {
    updatePosts(brand, prev =>
      prev.map(p => p.id === post.id ? { ...p, status: 'published' } : p)
    );
    showToast('Marked as published ✓');
  }

  const TABS = [
    { key: 'all',       label: 'All'       },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'draft',     label: 'Drafts'    },
    { key: 'published', label: 'Published' },
  ];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text }}>
            Queue
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: t.muted }}>
            {counts.all} post{counts.all !== 1 ? 's' : ''} · {counts.scheduled} scheduled
          </p>
        </div>
        <button
          onClick={() => setView('compose')}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 12,
            background: t.accent, color: '#fff',
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
          }}
        >
          <Ico name="plus" size={15} c="#fff"/>
          New post
        </button>
      </div>

      {/* tab bar + sort toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        marginBottom: 20, flexWrap: 'wrap',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '7px 14px', borderRadius: 20,
              border: activeTab === tab.key
                ? `1.5px solid ${t.accent}`
                : `1px solid ${t.line}`,
              background: activeTab === tab.key ? t.accent + '15' : 'transparent',
              color: activeTab === tab.key ? t.accent : t.muted,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: activeTab === tab.key ? t.accent : t.line,
                color: activeTab === tab.key ? '#fff' : t.muted,
                borderRadius: 20, padding: '1px 6px', lineHeight: 1.5,
              }}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}

        <div style={{ flex: 1 }}/>

        {/* sort toggle */}
        <button
          onClick={() => setSortAsc(a => !a)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 10,
            border: `1px solid ${t.line}`,
            background: 'transparent', color: t.muted,
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}
          title="Toggle sort order"
        >
          <Ico name={sortAsc ? 'arrowUp' : 'arrowDown'} size={13} c={t.muted}/>
          {sortAsc ? 'Oldest first' : 'Newest first'}
        </button>
      </div>

      {/* post list */}
      {visible.length === 0 ? (
        <EmptyState tab={activeTab} t={t} onCompose={() => setView('compose')}/>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map(post => (
            <PostCard
              key={post.id}
              post={post}
              brand={brand}
              onEdit={handleEdit}
              onDelete={setDeletePending}
              onMarkPosted={handleMarkPosted}
              t={t}
            />
          ))}
        </div>
      )}

      {/* delete confirm */}
      {deletePending && (
        <DeleteModal
          post={deletePending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletePending(null)}
          t={t}
        />
      )}
    </div>
  );
}
