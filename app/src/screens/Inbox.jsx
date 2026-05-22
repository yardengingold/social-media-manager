import { useState, useMemo } from 'react';
import { useApp } from '../AppContext.jsx';
import { BRANDS } from '../data.js';
import { Ico, PlatIcon } from '../Icons.jsx';

// ── stub data ─────────────────────────────────────────────────────────────────
const INBOX_SBF = [
  {
    id: 1, platform: 'ig', name: 'Sarah M.',   avatar: '👩',
    preview: 'Hi Moshe! We saw your listing on Instagram and we\'re very interested. Are you available for a showing this weekend?',
    time: '2m ago', unread: true, hot: true, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'Hi Moshe! We saw your listing on Instagram and we\'re very interested. Are you available for a showing this weekend?', time: '2m ago' },
    ],
  },
  {
    id: 2, platform: 'fb', name: 'David & Lisa K.',   avatar: '👨',
    preview: 'We\'ve been following your posts for a while. We\'re ready to sell our home in Morgan Hill. Can we set up a call?',
    time: '18m ago', unread: true, hot: true, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'We\'ve been following your posts for a while. We\'re ready to sell our home in Morgan Hill. Can we set up a call?', time: '18m ago' },
    ],
  },
  {
    id: 3, platform: 'li', name: 'Jennifer T.',  avatar: '👩‍💼',
    preview: 'Loved your post about the 1031 exchange. Quick question — does this apply to out-of-state properties?',
    time: '1h ago', unread: true, hot: false, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'Loved your post about the 1031 exchange. Quick question — does this apply to out-of-state properties?', time: '1h ago' },
    ],
  },
  {
    id: 4, platform: 'ig', name: 'Carlos R.',    avatar: '🧑',
    preview: 'Is the Morgan Hill listing still available? Interested in the 4bed/3bath',
    time: '2h ago', unread: false, hot: false, starred: true, replied: true,
    thread: [
      { from: 'them', text: 'Is the Morgan Hill listing still available? Interested in the 4bed/3bath', time: '2h ago' },
      { from: 'me',   text: 'Yes, still available! Happy to schedule a private tour. What days work for you?', time: '1h 50m ago' },
      { from: 'them', text: 'This Saturday afternoon would be perfect!', time: '1h ago' },
    ],
  },
  {
    id: 5, platform: 'fbp', name: 'Mark A.',      avatar: '👴',
    preview: 'Great post on the market update! We\'re thinking about downsizing next year. Would love to chat.',
    time: '4h ago', unread: false, hot: false, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'Great post on the market update! We\'re thinking about downsizing next year. Would love to chat.', time: '4h ago' },
    ],
  },
  {
    id: 6, platform: 'li', name: 'Rachel G.',    avatar: '👩',
    preview: 'Do you work with investors looking to buy multifamily properties in the Bay Area?',
    time: '1d ago', unread: false, hot: false, starred: false, replied: true,
    thread: [
      { from: 'them', text: 'Do you work with investors looking to buy multifamily properties in the Bay Area?', time: '1d ago' },
      { from: 'me',   text: 'Absolutely! Multifamily is a big part of my investor work. Let\'s connect for a 15-min call. What\'s your timeline?', time: '23h ago' },
    ],
  },
  {
    id: 7, platform: 'ig', name: 'Priya N.',     avatar: '👩',
    preview: 'Love your content! Do you do buyer consultations? First-time buyer here 🙋',
    time: '2d ago', unread: false, hot: false, starred: true, replied: false,
    thread: [
      { from: 'them', text: 'Love your content! Do you do buyer consultations? First-time buyer here 🙋', time: '2d ago' },
    ],
  },
];

const INBOX_GM = [
  {
    id: 1, platform: 'wa', name: 'מיכל לוי',     avatar: '👩',
    preview: 'שלום! אנחנו משפחה חדשה שעברה לאזור מורגן היל מישראל. איך אפשר להצטרף לקהילה?',
    time: 'לפני 5 דקות', unread: true, hot: true, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'שלום! אנחנו משפחה חדשה שעברה לאזור מורגן היל מישראל. איך אפשר להצטרף לקהילה?', time: 'לפני 5 דקות' },
    ],
  },
  {
    id: 2, platform: 'fbg', name: 'יוסי כהן',    avatar: '👨',
    preview: 'מישהו יכול להמליץ על רופא ילדים דובר עברית באזור? הילדה שלי חולה ואנחנו לא יודעים למי לפנות',
    time: 'לפני 22 דקות', unread: true, hot: false, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'מישהו יכול להמליץ על רופא ילדים דובר עברית באזור? הילדה שלי חולה ואנחנו לא יודעים למי לפנות', time: 'לפני 22 דקות' },
    ],
  },
  {
    id: 3, platform: 'ig', name: 'שירה אברהם',   avatar: '👩‍🦱',
    preview: 'איזה פוסט יפה על השבת! תודה שיוצרים את הקהילה הזאת 💙',
    time: 'לפני שעה', unread: true, hot: false, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'איזה פוסט יפה על השבת! תודה שיוצרים את הקהילה הזאת 💙', time: 'לפני שעה' },
    ],
  },
  {
    id: 4, platform: 'wa', name: 'דני ורחל פרץ', avatar: '👨',
    preview: 'האם יש קבוצת ווטסאפ לסעודת שבת הקרובה? אנחנו רוצים לבוא',
    time: 'לפני 3 שעות', unread: false, hot: false, starred: true, replied: true,
    thread: [
      { from: 'them', text: 'האם יש קבוצת ווטסאפ לסעודת שבת הקרובה? אנחנו רוצים לבוא', time: 'לפני 3 שעות' },
      { from: 'me',   text: 'ברוכים הבאים! שלחתי לכם לינק לקבוצה. מחכים לראותכם! 🕯️', time: 'לפני שעתיים' },
    ],
  },
  {
    id: 5, platform: 'fbg', name: 'אורי שלום',   avatar: '🧑',
    preview: 'האם יש ספרייה דוברת עברית בסביבה? מחפש ספרים לילדים',
    time: 'לפני 5 שעות', unread: false, hot: false, starred: false, replied: false,
    thread: [
      { from: 'them', text: 'האם יש ספרייה דוברת עברית בסביבה? מחפש ספרים לילדים', time: 'לפני 5 שעות' },
    ],
  },
  {
    id: 6, platform: 'ig', name: 'נועה קציר',    avatar: '👩',
    preview: 'תודה על האירוע של יום העצמאות! הייתה חוויה מדהימה 🇮🇱',
    time: 'אתמול', unread: false, hot: false, starred: true, replied: true,
    thread: [
      { from: 'them', text: 'תודה על האירוע של יום העצמאות! הייתה חוויה מדהימה 🇮🇱', time: 'אתמול' },
      { from: 'me',   text: 'תודה ששיתפתם! אנחנו כבר עובדים על הבא 🎉', time: 'אתמול' },
    ],
  },
];

const QUICK_REPLIES_SBF = [
  'Thanks for reaching out! I\'d love to help. What\'s a good time for a quick call?',
  'Great question! Yes, this applies — DM me your details and I\'ll walk you through it.',
  'The property is still available! I can schedule a private showing. When works for you?',
  'Absolutely, happy to connect. My calendar link: calendly.com/sold-by-fogel 📅',
];

const QUICK_REPLIES_GM = [
  'שלום! ברוכים הבאים לגבעת מורגן 💙 שלחתי לך לינק לקבוצה',
  'תודה! נשמח שתצטרפו לאירוע הבא. הפרטים בביו 🎉',
  'כבר ממליצים! תשלח הודעה פרטית ונחבר אתכם 🙏',
  'מענין מאוד! בואו נדבר — שלח הודעה פרטית 📩',
];

// ── platform badge ────────────────────────────────────────────────────────────
const PLAT_LABEL = { ig: 'Instagram', fb: 'Facebook', fbp: 'FB Personal', fbg: 'FB Group', li: 'LinkedIn', wa: 'WhatsApp' };
const PLAT_COLOR = { ig: '#e1306c', fb: '#1877f2', fbp: '#1877f2', fbg: '#1877f2', li: '#0a66c2', wa: '#25d366' };

function PlatBadge({ platform }) {
  const color = PLAT_COLOR[platform] || '#888';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700,
      padding: '2px 7px', borderRadius: 20,
      background: color + '18', color,
    }}>
      <PlatIcon id={platform} size={10}/>
      {PLAT_LABEL[platform] || platform.toUpperCase()}
    </span>
  );
}

// ── thread message bubble ─────────────────────────────────────────────────────
function Bubble({ msg, accent, rtl }) {
  const isMe = msg.from === 'me';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: '78%',
        background: isMe ? accent : '#f0ede7',
        color: isMe ? '#fff' : '#1a1612',
        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '10px 14px',
        fontSize: 13, lineHeight: 1.5,
        direction: rtl ? 'rtl' : 'ltr',
      }}>
        {msg.text}
        <div style={{
          fontSize: 10, marginTop: 4, opacity: .65, textAlign: 'right',
        }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

// ── conversation thread panel ─────────────────────────────────────────────────
function ThreadPanel({ conv, brand, onClose, onReply, onTag, onStar, t, rtl }) {
  const [draft, setDraft] = useState('');
  const [showQuick, setShowQuick] = useState(false);
  const quickReplies = brand === 'gm' ? QUICK_REPLIES_GM : QUICK_REPLIES_SBF;

  function send() {
    if (!draft.trim()) return;
    onReply(conv.id, draft.trim());
    setDraft('');
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', direction: rtl ? 'rtl' : 'ltr',
    }}>
      {/* thread header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          width: 30, height: 30, borderRadius: 8,
          border: `1px solid ${t.border}`, background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ico n="arrow-left" size={14} color={t.muted}/>
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: t.accent + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {conv.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{conv.name}</div>
          <PlatBadge platform={conv.platform}/>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onTag(conv.id)}
            title="Toggle hot lead"
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${conv.hot ? '#e67e22' : t.border}`,
              background: conv.hot ? '#e67e2218' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}
          >
            🔥
          </button>
          <button
            onClick={() => onStar(conv.id)}
            title="Toggle star"
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${conv.starred ? '#f59e0b' : t.border}`,
              background: conv.starred ? '#f59e0b18' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}
          >
            ⭐
          </button>
        </div>
      </div>

      {/* thread messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        {conv.hot && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: '#fff3e0', borderRadius: 10, padding: '8px 12px',
            marginBottom: 14, fontSize: 12, color: '#e67e22', fontWeight: 600,
            border: '1px solid #f59e0b40',
          }}>
            🔥 Hot lead — follow up soon!
          </div>
        )}
        {conv.thread.map((msg, i) => (
          <Bubble key={i} msg={msg} accent={t.accent} rtl={rtl}/>
        ))}
      </div>

      {/* quick replies */}
      {showQuick && (
        <div style={{
          padding: '10px 18px', borderTop: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
          maxHeight: 180, overflowY: 'auto',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.muted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.4px' }}>
            Quick replies
          </div>
          {quickReplies.map((r, i) => (
            <button key={i} onClick={() => { setDraft(r); setShowQuick(false); }} style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 8,
              border: `1px solid ${t.border}`, background: t.bg,
              color: t.text, cursor: 'pointer', fontSize: 12, lineHeight: 1.4,
              direction: rtl ? 'rtl' : 'ltr',
            }}>
              {r}
            </button>
          ))}
        </div>
      )}

      {/* compose reply */}
      <div style={{
        padding: '12px 18px', borderTop: `1px solid ${t.border}`,
        flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <button
          onClick={() => setShowQuick(q => !q)}
          title="Quick replies"
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            border: `1px solid ${showQuick ? t.accent : t.border}`,
            background: showQuick ? t.accent + '15' : 'transparent',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ico n="zap" size={14} color={showQuick ? t.accent : t.muted}/>
        </button>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={rtl ? 'כתוב תשובה…' : 'Write a reply…'}
          rows={2}
          style={{
            flex: 1, padding: '9px 12px',
            borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.bg, color: t.text,
            fontSize: 13, lineHeight: 1.5, resize: 'none',
            fontFamily: 'inherit', outline: 'none',
            direction: rtl ? 'rtl' : 'ltr',
          }}
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: draft.trim() ? t.accent : t.border,
            border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .12s',
          }}
        >
          <Ico n="send" size={15} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ── conversation list item ────────────────────────────────────────────────────
function ConvRow({ conv, active, onClick, t }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px', cursor: 'pointer',
        background: active ? t.accent + '10' : conv.unread ? t.accent + '04' : 'transparent',
        borderLeft: active ? `3px solid ${t.accent}` : '3px solid transparent',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        transition: 'background .1s',
      }}
    >
      {/* avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: t.accent + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          {conv.avatar}
        </div>
        {conv.unread && (
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: '50%',
            background: t.accent, border: `2px solid ${t.card}`,
          }}/>
        )}
        {conv.hot && (
          <div style={{
            position: 'absolute', top: -2, right: -4,
            fontSize: 12, lineHeight: 1,
          }}>🔥</div>
        )}
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontWeight: conv.unread ? 700 : 600,
            fontSize: 13, color: t.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {conv.name}
          </span>
          <span style={{ fontSize: 10, color: t.muted, flexShrink: 0 }}>{conv.time}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 4 }}>
          <PlatBadge platform={conv.platform}/>
          {conv.starred && <span style={{ fontSize: 11 }}>⭐</span>}
          {conv.replied && (
            <span style={{ fontSize: 10, color: t.muted }}>↩ replied</span>
          )}
        </div>
        <div style={{
          fontSize: 12, color: conv.unread ? t.text : t.muted,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontWeight: conv.unread ? 500 : 400,
        }}>
          {conv.preview}
        </div>
      </div>
    </div>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function InboxScreen() {
  const { brand, t, showToast, isMobile } = useApp();
  const rtl = BRANDS[brand]?.rtl || false;

  const seedData = brand === 'gm' ? INBOX_GM : INBOX_SBF;
  const [convos, setConvos] = useState(seedData);
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter]   = useState('all');   // all | unread | hot | starred

  const activeConv = convos.find(c => c.id === activeId) || null;

  function openConv(id) {
    setActiveId(id);
    // mark as read
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
  }

  function handleReply(id, text) {
    setConvos(prev => prev.map(c =>
      c.id === id
        ? { ...c, replied: true, thread: [...c.thread, { from: 'me', text, time: rtl ? 'עכשיו' : 'just now' }] }
        : c
    ));
    showToast(rtl ? '✓ תשובה נשלחה' : '✓ Reply sent');
  }

  function handleTag(id) {
    setConvos(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = !c.hot;
      showToast(next ? (rtl ? '🔥 סומן כליד חם' : '🔥 Marked as hot lead') : (rtl ? 'הוסר תיוג' : 'Tag removed'));
      return { ...c, hot: next };
    }));
  }

  function handleStar(id) {
    setConvos(prev => prev.map(c =>
      c.id === id ? { ...c, starred: !c.starred } : c
    ));
  }

  const filtered = useMemo(() => {
    switch (filter) {
      case 'unread':  return convos.filter(c => c.unread);
      case 'hot':     return convos.filter(c => c.hot);
      case 'starred': return convos.filter(c => c.starred);
      default:        return convos;
    }
  }, [convos, filter]);

  const unreadCount  = convos.filter(c => c.unread).length;
  const hotCount     = convos.filter(c => c.hot).length;
  const starredCount = convos.filter(c => c.starred).length;

  const FILTERS = [
    { key: 'all',     label: rtl ? 'הכל'     : 'All',     count: convos.length },
    { key: 'unread',  label: rtl ? 'לא נקרא' : 'Unread',  count: unreadCount   },
    { key: 'hot',     label: rtl ? 'ליד חם'  : 'Hot leads',count: hotCount     },
    { key: 'starred', label: rtl ? 'מועדפים' : 'Starred', count: starredCount  },
  ];

  return (
    <div style={{
      maxWidth: 900, margin: '0 auto',
      display: 'flex', gap: 0,
      background: t.card,
      borderRadius: isMobile ? 14 : 20,
      border: `1px solid ${t.border}`,
      overflow: 'hidden',
      height: isMobile ? 'calc(100vh - 172px)' : 'calc(100vh - 120px)',
      minHeight: 400,
      direction: rtl ? 'rtl' : 'ltr',
    }}>

      {/* left: conversation list */}
      <div style={{
        width: isMobile ? (activeConv ? 0 : '100%') : 300,
        maxWidth: isMobile ? (activeConv ? 0 : '100%') : 300,
        minWidth: isMobile ? (activeConv ? 0 : '100%') : 300,
        flexShrink: 0,
        borderInlineEnd: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'max-width .18s ease, min-width .18s ease, width .18s ease',
      }}>
        {/* list header */}
        <div style={{ padding: '16px 16px 10px', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 10 }}>
            {rtl ? 'תיבת הודעות' : 'Inbox'}
            {unreadCount > 0 && (
              <span style={{
                marginInlineStart: 8, fontSize: 11, fontWeight: 700,
                padding: '2px 7px', borderRadius: 20,
                background: t.accent, color: '#fff',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '4px 10px', borderRadius: 20,
                border: filter === f.key ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                background: filter === f.key ? t.accent + '15' : 'transparent',
                color: filter === f.key ? t.accent : t.muted,
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {f.label}
                {f.count > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: filter === f.key ? t.accent : t.border,
                    color: filter === f.key ? '#fff' : t.muted,
                    borderRadius: 20, padding: '0 5px', lineHeight: 1.6,
                  }}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* conversation rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '48px 24px', textAlign: 'center',
              color: t.muted, fontSize: 13, fontStyle: 'italic',
            }}>
              {rtl ? 'אין הודעות' : 'No messages here'}
            </div>
          ) : filtered.map((c, i) => (
            <div key={c.id}>
              <ConvRow
                conv={c}
                active={activeId === c.id}
                onClick={() => openConv(c.id)}
                t={t}
              />
              {i < filtered.length - 1 && (
                <div style={{ height: 1, background: t.border, marginInlineStart: 68 }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* right: thread */}
      <div style={{
        flex: 1, minWidth: 0,
        display: activeConv ? 'flex' : 'flex',
        flexDirection: 'column',
      }}>
        {activeConv ? (
          <ThreadPanel
            conv={activeConv}
            brand={brand}
            onClose={() => setActiveId(null)}
            onReply={handleReply}
            onTag={handleTag}
            onStar={handleStar}
            t={t}
            rtl={rtl}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: t.muted, fontSize: 13, fontStyle: 'italic', gap: 12,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: t.accent + '15',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ico n="message-circle" size={26} color={t.accent}/>
            </div>
            {rtl ? 'בחר שיחה לצפייה' : 'Select a conversation'}
          </div>
        )}
      </div>
    </div>
  );
}
