import { useState, useMemo, useRef } from 'react';
import { useApp } from '../AppContext.jsx';
import { BRANDS, getISOWeek } from '../data.js';
import { Ico } from '../Icons.jsx';

// ── helpers ───────────────────────────────────────────────────────────────────
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Mon-first week starting from any date
function getWeekDates(refDate) {
  const d = new Date(refDate);
  const dow = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dow + 6) % 7)); // roll back to Monday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

function weekLabel(dates) {
  const s = dates[0], e = dates[6];
  if (s.getMonth() === e.getMonth()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}

function isoWeekKey(d) {
  return `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2,'0')}`;
}

// slot key: "2026-W21-1-am"  (weekkey-dow-slot)
function slotKey(weekKey, dow, slot) {
  return `${weekKey}-${dow}-${slot}`;
}

function isToday(date) {
  const t = new Date();
  return date.getDate()   === t.getDate() &&
         date.getMonth()  === t.getMonth() &&
         date.getFullYear() === t.getFullYear();
}

function isPast(date) {
  const t = new Date(); t.setHours(0,0,0,0);
  return date < t;
}

// ── template picker drawer ────────────────────────────────────────────────────
function TemplatePicker({ templates, onPick, onClose, t, rtl }) {
  const [search, setSearch] = useState('');
  const filtered = templates.filter(tp =>
    tp.name.toLowerCase().includes(search.toLowerCase()) ||
    tp.desc?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
        zIndex: 9000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: t.card, borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 560, maxHeight: '75vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 32px rgba(0,0,0,.18)',
          direction: rtl ? 'rtl' : 'ltr',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border }}/>
        </div>

        {/* header */}
        <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: t.text, flex: 1 }}>
            {rtl ? 'בחר תבנית' : 'Choose a template'}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 8,
            border: `1px solid ${t.border}`, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ico n="x" size={14} color={t.muted}/>
          </button>
        </div>

        {/* search */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: t.bg, borderRadius: 10, padding: '8px 12px',
            border: `1px solid ${t.border}`,
          }}>
            <Ico n="search" size={14} color={t.muted}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={rtl ? 'חיפוש…' : 'Search templates…'}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: t.text, fontSize: 13, outline: 'none',
                fontFamily: 'inherit', direction: rtl ? 'rtl' : 'ltr',
              }}
            />
          </div>
        </div>

        {/* template list */}
        <div style={{ overflowY: 'auto', padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* clear option */}
          <button
            onClick={() => onPick(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12,
              border: `1px solid ${t.border}`, background: 'transparent',
              cursor: 'pointer', textAlign: rtl ? 'right' : 'left',
            }}
          >
            <span style={{
              width: 36, height: 36, borderRadius: 10,
              background: t.bg, border: `1px dashed ${t.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>✕</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.muted }}>
                {rtl ? 'ריק' : 'Clear slot'}
              </div>
            </div>
          </button>

          {filtered.map(tp => (
            <button
              key={tp.id}
              onClick={() => onPick(tp)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12,
                border: `1.5px solid ${t.border}`,
                background: 'transparent', cursor: 'pointer',
                textAlign: rtl ? 'right' : 'left',
                transition: 'border-color .1s, background .1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = tp.color;
                e.currentTarget.style.background  = tp.color + '10';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.background  = 'transparent';
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: tp.color + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{tp.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tp.name}</div>
                {tp.desc && (
                  <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>{tp.desc}</div>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '.4px',
                padding: '2px 7px', borderRadius: 20,
                background: tp.color + '20', color: tp.color,
                textTransform: 'uppercase', flexShrink: 0,
              }}>
                {tp.slot?.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── single slot cell ──────────────────────────────────────────────────────────
function SlotCell({ template, slot, past, today, onClick, t }) {
  const filled = !!template;
  return (
    <button
      onClick={onClick}
      title={filled ? `${template.name} — click to change` : `Add ${slot.toUpperCase()} story`}
      style={{
        width: '100%', minHeight: 56, borderRadius: 10,
        border: filled
          ? `1.5px solid ${template.color}50`
          : `1.5px dashed ${past ? t.border + '80' : t.border}`,
        background: filled
          ? template.color + '15'
          : today ? t.accent + '06' : 'transparent',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, padding: '8px 6px',
        opacity: past && !filled ? .5 : 1,
        transition: 'all .12s',
      }}
    >
      {filled ? (
        <>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{template.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: template.color,
            textAlign: 'center', lineHeight: 1.3,
            maxWidth: '100%', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {template.name}
          </span>
        </>
      ) : (
        <Ico n="plus" size={16} color={past ? t.muted + '80' : t.muted}/>
      )}
    </button>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function StoriesScreen() {
  const { brand, t, isMobile } = useApp();
  const brandData   = BRANDS[brand];
  const templates   = brandData?.storyTemplates || [];
  const defaultWeek = brandData?.defaultStoryWeek || [];
  const rtl         = brandData?.rtl || false;
  const DAYS        = rtl ? DAYS_HE : DAYS_EN;

  // week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  const refDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(refDate), [refDate]);
  const weekKey   = useMemo(() => isoWeekKey(weekDates[0]), [weekDates]);

  // slots: { [slotKey]: templateId | null }
  const [slots, setSlots] = useState({});

  // picker state
  const [picker, setPicker] = useState(null); // { key, dow, slot }

  // build a template map
  const tmplMap = useMemo(() => {
    const m = {};
    templates.forEach(tp => { m[tp.id] = tp; });
    return m;
  }, [templates]);

  // get current template for a slot
  function getSlot(dow, slotName) {
    const key = slotKey(weekKey, dow, slotName);
    if (key in slots) {
      return slots[key] ? tmplMap[slots[key]] || null : null;
    }
    // fall back to defaultWeek
    const def = defaultWeek.find(d => d.dow === dow && d.slot === slotName);
    return def ? (tmplMap[def.template] || null) : null;
  }

  function setSlotTemplate(key, tp) {
    setSlots(prev => ({ ...prev, [key]: tp ? tp.id : null }));
  }

  function handleAiAutoFill() {
    const patch = {};
    defaultWeek.forEach(({ dow, slot, template }) => {
      patch[slotKey(weekKey, dow, slot)] = template;
    });
    setSlots(prev => ({ ...prev, ...patch }));
  }

  function handleClearWeek() {
    const patch = {};
    weekDates.forEach(date => {
      const dow = date.getDay();
      ['am', 'pm'].forEach(sl => {
        patch[slotKey(weekKey, dow, sl)] = null;
      });
    });
    setSlots(prev => ({ ...prev, ...patch }));
  }

  // count filled slots this week
  const filledCount = weekDates.reduce((sum, date) => {
    const dow = date.getDay();
    return sum
      + (getSlot(dow, 'am') ? 1 : 0)
      + (getSlot(dow, 'pm') ? 1 : 0);
  }, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', direction: rtl ? 'rtl' : 'ltr' }}>

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text }}>
            {rtl ? 'מתכנן סטוריז' : 'Stories Planner'}
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.muted }}>
            {filledCount} / 14 {rtl ? 'משבצות מלאות' : 'slots filled this week'}
          </p>
        </div>

        {/* AI auto-fill */}
        <button
          onClick={handleAiAutoFill}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 10,
            background: t.accent + '18', color: t.accent,
            border: `1px solid ${t.accent}40`,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          <Ico n="zap" size={14} color={t.accent}/>
          {rtl ? 'מילוי אוטומטי' : 'Auto-fill week'}
        </button>

        {/* clear */}
        <button
          onClick={handleClearWeek}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 14px', borderRadius: 10,
            border: `1px solid ${t.border}`,
            background: 'transparent', color: t.muted,
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}
        >
          <Ico n="trash-2" size={13} color={t.muted}/>
          {rtl ? 'נקה' : 'Clear'}
        </button>
      </div>

      {/* week nav */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 20,
      }}>
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${t.border}`, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ico n={rtl ? 'chevron-right' : 'chevron-left'} size={16} color={t.text}/>
        </button>

        <div style={{ fontWeight: 600, fontSize: 14, color: t.text, flex: 1, textAlign: 'center' }}>
          {weekLabel(weekDates)}
          {weekOffset === 0 && (
            <span style={{
              marginInlineStart: 8, fontSize: 11, fontWeight: 600,
              padding: '2px 8px', borderRadius: 20,
              background: t.accent + '20', color: t.accent,
            }}>
              {rtl ? 'השבוע' : 'This week'}
            </span>
          )}
        </div>

        <button
          onClick={() => setWeekOffset(w => w + 1)}
          style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${t.border}`, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ico n={rtl ? 'chevron-left' : 'chevron-right'} size={16} color={t.text}/>
        </button>

        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: 'transparent', color: t.muted,
              cursor: 'pointer', fontSize: 12, fontWeight: 500,
            }}
          >
            {rtl ? 'היום' : 'Today'}
          </button>
        )}
      </div>

      {/* grid */}
      <div style={{ overflowX: isMobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch', marginInline: isMobile ? -16 : 0, paddingInline: isMobile ? 16 : 0 }}>
      <div style={{
        background: t.card, borderRadius: 20, border: `1px solid ${t.border}`,
        overflow: 'hidden',
        minWidth: isMobile ? 600 : undefined,
      }}>

        {/* column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '56px repeat(7, 1fr)',
          borderBottom: `1px solid ${t.border}`,
        }}>
          {/* empty corner */}
          <div style={{ padding: '12px 8px', borderInlineEnd: `1px solid ${t.border}` }}/>

          {weekDates.map((date, i) => {
            const today = isToday(date);
            const past  = isPast(date);
            // For RTL (GM), Sunday is Shabbat = last in week array (index 6)
            // weekDates is always Mon-Sun (index 0-6, dow = [1,2,3,4,5,6,0])
            const dow = date.getDay();
            const dayLabel = rtl ? DAYS_HE[dow] : DAYS_EN[dow];

            return (
              <div
                key={i}
                style={{
                  padding: '10px 8px', textAlign: 'center',
                  borderInlineEnd: i < 6 ? `1px solid ${t.border}` : 'none',
                  background: today ? t.accent + '08' : 'transparent',
                }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 600, color: today ? t.accent : t.muted,
                  textTransform: 'uppercase', letterSpacing: '.5px',
                }}>
                  {dayLabel}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 700,
                  color: today ? t.accent : past ? t.muted : t.text,
                  marginTop: 2,
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: today ? t.accent : 'transparent',
                  color: today ? '#fff' : past ? t.muted : t.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '2px auto 0',
                }}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* AM row */}
        {['am', 'pm'].map((slotName, rowIdx) => (
          <div
            key={slotName}
            style={{
              display: 'grid',
              gridTemplateColumns: '56px repeat(7, 1fr)',
              borderBottom: rowIdx === 0 ? `1px solid ${t.border}` : 'none',
            }}
          >
            {/* row label */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderInlineEnd: `1px solid ${t.border}`,
              padding: '10px 4px',
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: t.muted,
                textTransform: 'uppercase', letterSpacing: '.8px',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}>
                {slotName === 'am' ? (rtl ? 'בוקר' : 'AM') : (rtl ? 'ערב' : 'PM')}
              </span>
            </div>

            {weekDates.map((date, i) => {
              const dow  = date.getDay();
              const key  = slotKey(weekKey, dow, slotName);
              const tmpl = getSlot(dow, slotName);
              const past = isPast(date);
              const today = isToday(date);

              return (
                <div
                  key={i}
                  style={{
                    padding: '8px 6px',
                    borderInlineEnd: i < 6 ? `1px solid ${t.border}` : 'none',
                    background: today ? t.accent + '04' : 'transparent',
                  }}
                >
                  <SlotCell
                    template={tmpl}
                    slot={slotName}
                    past={past}
                    today={today}
                    onClick={() => setPicker({ key, dow, slot: slotName })}
                    t={t}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>{/* end horizontal scroll wrapper */}

      {/* legend / template library */}
      <div style={{ marginTop: 28 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: t.text,
          marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Ico n="layers" size={15} color={t.accent}/>
          {rtl ? 'ספריית תבניות' : 'Template library'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {templates.map(tp => (
            <div
              key={tp.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 12,
                border: `1px solid ${tp.color}40`,
                background: tp.color + '12',
              }}
            >
              <span style={{ fontSize: 16 }}>{tp.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tp.color }}>
                  {tp.name}
                </div>
                {tp.desc && (
                  <div style={{ fontSize: 10, color: t.muted, marginTop: 1 }}>
                    {tp.desc}
                  </div>
                )}
              </div>
              <span style={{
                marginInlineStart: 4,
                fontSize: 10, fontWeight: 700,
                padding: '2px 6px', borderRadius: 20,
                background: tp.color + '25', color: tp.color,
                letterSpacing: '.4px', textTransform: 'uppercase',
              }}>
                {tp.slot?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* template picker drawer */}
      {picker && (
        <TemplatePicker
          templates={templates}
          rtl={rtl}
          t={t}
          onPick={tp => {
            setSlotTemplate(picker.key, tp);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
