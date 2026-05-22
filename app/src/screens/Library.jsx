import { useState, useRef, useCallback, useMemo } from 'react';
import { useApp } from '../AppContext.jsx';
import { BRANDS } from '../data.js';
import { Ico, PlatIcon } from '../Icons.jsx';

// ── uid ───────────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const MEDIA_TYPES = ['image/', 'video/'];
function isMedia(file) { return MEDIA_TYPES.some(t => file.type.startsWith(t)); }

function collectFromEntry(entry) {
  return new Promise(resolve => {
    if (entry.isFile) {
      entry.file(file => resolve(isMedia(file) ? [file] : []), () => resolve([]));
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const results = [];
      function readBatch() {
        reader.readEntries(async entries => {
          if (!entries.length) { resolve(results.flat()); return; }
          const batch = await Promise.all(entries.map(collectFromEntry));
          results.push(...batch);
          readBatch();
        }, () => resolve(results.flat()));
      }
      readBatch();
    } else {
      resolve([]);
    }
  });
}

async function extractDroppedFiles(e) {
  const items = [...(e.dataTransfer.items || [])];
  if (items.length && items[0].webkitGetAsEntry) {
    const entries = items.map(i => i.webkitGetAsEntry()).filter(Boolean);
    const batches = await Promise.all(entries.map(collectFromEntry));
    return batches.flat();
  }
  return [...e.dataTransfer.files].filter(isMedia);
}

// ── stub library data ─────────────────────────────────────────────────────────
const CAPTION_SEEDS_SBF = [
  { id: 'c1', label: 'Just Listed Hero', pillar: 'Listing', text: '🚨 JUST LISTED — Morgan Hill\n{beds} Bed · {baths} Bath · {feature}\nChef\'s kitchen, backyard built for California living.\nOpen house Sunday 1–4PM. DM for private tour. 🔑', tags: ['listing', 'morgan-hill'] },
  { id: 'c2', label: 'Client Testimonial', pillar: 'Client Love', text: '⭐️ Client Love\n"{quote}"\n— {name}, {city}\n\nThis is why I do what I do. 💙 #SoldByFogel #MorganHill', tags: ['testimonial', 'social-proof'] },
  { id: 'c3', label: 'Market Insight', pillar: 'Market Tips', text: '📊 Monday Market Insight\nBay Area inventory is down {pct}% this quarter — Morgan Hill remains the most accessible entry point in Santa Clara County.\nMedian days on market: {dom}. List-to-sale: {lts}%.\nDM me to talk strategy. 📲', tags: ['market', 'data'] },
  { id: 'c4', label: 'Behind the Deal', pillar: 'BTS', text: '🔑 Behind the Deal\nMy clients were outbid {n} times. We reworked their strategy — and on the very next offer we won. {pct}% over asking.\nWe stopped competing on price and started competing on terms. 💪\n#BehindTheDeal #SoldByFogel', tags: ['story', 'strategy'] },
  { id: 'c5', label: 'MH Local Love', pillar: 'MH Lifestyle', text: '💚 Morgan Hill Local Love\n{scene}\nThis is the lifestyle Morgan Hill offers — and why I\'m proud to call it home. 🌸\nWhere\'s your favorite local spot? ⬇️', tags: ['local', 'lifestyle', 'community'] },
  { id: 'c6', label: 'Buyer Tip', pillar: 'Education', text: '💡 Buyer Tip #{n}\n{tip}\n\nWant to learn more? DM me or drop a question below. 👇\n#FirstTimeBuyer #BayAreaRealEstate #SoldByFogel', tags: ['education', 'buyers'] },
];

const CAPTION_SEEDS_GM = [
  { id: 'c1', label: 'שבת שלום', pillar: 'שבת', text: 'שבת שלום לכל משפחות גבעת מורגן! 🕯️✨\nיהי רצון שתהיה השבת הזאת מלאה בשלום, אהבה ונחת.\nשבת שלום ומבורך לכולם 💙🤍', tags: ['שבת', 'קהילה'] },
  { id: 'c2', label: 'הזמנה לאירוע', pillar: 'אירועים', text: '📅 {event_name} — {date}\nמקום: {location}\nשעה: {time}\n\nכולם מוזמנים! תביאו את המשפחה 🎉\nהרשמה בלינק בביו.', tags: ['אירוע', 'הזמנה'] },
  { id: 'c3', label: 'ברוכים הבאים', pillar: 'קהילה', text: 'חדשים בבאי אריאה מישראל? 🇮🇱\nגבעת מורגן כאן בשבילכם! 🤝\nאנחנו קהילה של יותר מ-200 משפחות ישראליות.\nשלחו הודעה ונשמח לחבר אתכם! 💙', tags: ['קהילה', 'ברוכים הבאים'] },
  { id: 'c4', label: 'חג שמח', pillar: 'חגים', text: '🎉 {holiday} שמח מגבעת מורגן!\nשנה של בריאות, שמחה, ואהבה לכל המשפחות שלנו 🥂✨\nחג שמח! 💙🤍✡️', tags: ['חג', 'ברכות'] },
  { id: 'c5', label: 'עדכון קהילתי', pillar: 'עדכונים', text: '📣 עדכון קהילתי!\n{update}\n\nלפרטים נוספים — שלחו הודעה פרטית 📩\n#גבעתמורגן #קהילהישראלית', tags: ['עדכון', 'מידע'] },
];

const HASHTAG_SEEDS_SBF = [
  { id: 'h1', name: 'Core Brand', tags: ['SoldByFogel', 'MorganHill', 'BayAreaRealEstate', 'SantaClaraCounty', 'SiliconValleyHomes', 'CaliforniaRealEstate'] },
  { id: 'h2', name: 'Listings',   tags: ['JustListed', 'NewListing', 'HomesForSale', 'MorganHillHomes', 'OpenHouse', 'DreamHome', 'LuxuryLiving', 'ForSale'] },
  { id: 'h3', name: 'Buyers',     tags: ['FirstTimeBuyer', 'BuyersAgent', 'HomeBuyer', 'MoveToMorganHill', 'BayAreaBuyers', 'CaliforniaLiving', 'RelocationAgent'] },
  { id: 'h4', name: 'Market',     tags: ['RealEstateTips', 'MarketUpdate', 'HousingMarket', 'RealEstateInvesting', 'PropertyInvestment', 'RealEstateFacts'] },
  { id: 'h5', name: 'Lifestyle',  tags: ['MorganHillLife', 'SiliconValleyLife', 'CaliforniaDream', 'SuburbanLiving', 'FamilyHome', 'BayAreaLife', 'LocalLove'] },
];

const HASHTAG_SEEDS_GM = [
  { id: 'h1', name: 'ליבת הקהילה', tags: ['גבעתמורגן', 'קהילהישראלית', 'מורגןהיל', 'ישראלים_בקליפורניה', 'ישראליםבבייאריאה', 'עםישראלחי'] },
  { id: 'h2', name: 'שבת וחגים',   tags: ['שבתשלום', 'חגשמח', 'ראשהשנה', 'פסחשמח', 'חנוכהשמח', 'ישראל'] },
  { id: 'h3', name: 'אירועים',     tags: ['אירועקהילתי', 'ברביקיו', 'סעודתשבת', 'יוםהעצמאות', 'אירועמשפחתי'] },
  { id: 'h4', name: 'מידע שימושי', tags: ['ישראלים_בחול', 'חיים_בחול', 'קליפורניה', 'בייאריאה', 'סיליקוןואלי'] },
];

// ── copy to clipboard ─────────────────────────────────────────────────────────
async function copyText(text, showToast) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard ✓');
  } catch {
    showToast('Copy failed', '#c0392b');
  }
}

// ── MediaGrid tab ─────────────────────────────────────────────────────────────
function MediaGrid({ t, showToast }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleFiles = useCallback(async files => {
    const newItems = await Promise.all(
      [...files]
        .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
        .map(async f => ({
          id: uid(),
          name: f.name,
          type: f.type.startsWith('video/') ? 'video' : 'image',
          size: (f.size / 1024).toFixed(0) + ' KB',
          dataUrl: await readFile(f),
          addedAt: new Date(),
          tags: [],
        }))
    );
    setItems(prev => [...newItems, ...prev]);
  }, []);

  const visible = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div>
      {/* toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all','image','video'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 20,
              border: filter === f ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
              background: filter === f ? t.accent + '15' : 'transparent',
              color: filter === f ? t.accent : t.muted,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}>
              {f === 'all' ? `All (${items.length})` : f === 'image' ? `Photos (${items.filter(i=>i.type==='image').length})` : `Videos (${items.filter(i=>i.type==='video').length})`}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <button onClick={() => inputRef.current?.click()} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 10,
          background: t.accent, color: '#fff',
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
        }}>
          <Ico n="upload" size={13} color="#fff"/>
          Upload
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" style={{ display:'none' }}
          onChange={e => { handleFiles(e.target.files); e.target.value=''; }}/>
      </div>

      {/* drop zone (shown when empty) or grid */}
      {items.length === 0 ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={async e => { e.preventDefault(); setDragging(false); handleFiles(await extractDroppedFiles(e)); }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? t.accent : t.border}`,
            borderRadius: 16, padding: '56px 32px', textAlign: 'center',
            cursor: 'pointer', background: dragging ? t.accent+'08' : t.card,
            transition: 'all .15s',
          }}
        >
          <Ico n="image" size={32} color={t.muted} style={{ display: 'block', margin: '0 auto 12px' }}/>
          <div style={{ fontWeight: 600, color: t.muted, fontSize: 14 }}>Drop photos & videos here</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>or click to browse</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 10,
        }}>
          {/* add tile */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={async e => { e.preventDefault(); setDragging(false); handleFiles(await extractDroppedFiles(e)); }}
            onClick={() => inputRef.current?.click()}
            style={{
              aspectRatio: '1', borderRadius: 12,
              border: `2px dashed ${dragging ? t.accent : t.border}`,
              background: dragging ? t.accent + '08' : t.bg,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Ico n="plus" size={22} color={t.muted}/>
            <span style={{ fontSize: 11, color: t.muted }}>Add</span>
          </div>

          {visible.map(item => (
            <div key={item.id}
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              style={{
                aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                border: selected?.id === item.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
                cursor: 'pointer', position: 'relative', background: t.bg,
                transition: 'border-color .1s',
              }}
            >
              {item.type === 'image'
                ? <img src={item.dataUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : (
                  <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
                    <Ico n="video" size={28} color={t.muted}/>
                    <span style={{ fontSize: 10, color: t.muted }}>{item.size}</span>
                  </div>
                )
              }
              {/* hover overlay */}
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
                opacity: selected?.id === item.id ? 1 : 0,
                transition: 'opacity .15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <button onClick={e => { e.stopPropagation(); copyText(item.dataUrl, showToast); }} style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,.2)', color: '#fff',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Ico n="copy" size={11} color="#fff"/> Copy
                </button>
                <button onClick={e => { e.stopPropagation(); setItems(prev => prev.filter(i => i.id !== item.id)); setSelected(null); }} style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none',
                  background: 'rgba(192,57,43,.8)', color: '#fff',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Ico n="trash-2" size={11} color="#fff"/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Captions tab ──────────────────────────────────────────────────────────────
function CaptionsTab({ brand, t, showToast }) {
  const seeds = brand === 'gm' ? CAPTION_SEEDS_GM : CAPTION_SEEDS_SBF;
  const [captions, setCaptions] = useState(seeds);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');

  const filtered = useMemo(() =>
    captions.filter(c =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.text.toLowerCase().includes(search.toLowerCase()) ||
      c.pillar?.toLowerCase().includes(search.toLowerCase())
    ),
  [captions, search]);

  function startEdit(c) {
    setEditId(c.id);
    setEditText(c.text);
    setEditLabel(c.label);
  }

  function saveEdit(id) {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, text: editText, label: editLabel } : c));
    setEditId(null);
  }

  function addNew() {
    if (!newLabel.trim() || !newText.trim()) return;
    setCaptions(prev => [{ id: uid(), label: newLabel, pillar: '', text: newText, tags: [] }, ...prev]);
    setNewLabel(''); setNewText(''); setShowNew(false);
  }

  const rtl = brand === 'gm';

  return (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* search */}
        <div style={{
          flex: 1, minWidth: 180,
          display: 'flex', alignItems: 'center', gap: 8,
          background: t.bg, borderRadius: 10, padding: '7px 12px',
          border: `1px solid ${t.border}`,
        }}>
          <Ico n="search" size={14} color={t.muted}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={rtl ? 'חיפוש…' : 'Search captions…'}
            style={{ flex:1, background:'transparent', border:'none', color:t.text, fontSize:13, outline:'none', fontFamily:'inherit' }}
          />
        </div>
        <button onClick={() => setShowNew(n => !n)} style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'7px 14px', borderRadius:10,
          background: showNew ? t.accent+' 15' : t.accent, color:'#fff',
          border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
        }}>
          <Ico n="plus" size={13} color="#fff"/>
          {rtl ? 'חדש' : 'New caption'}
        </button>
      </div>

      {/* new caption form */}
      {showNew && (
        <div style={{
          background: t.bg, borderRadius: 14, border: `1.5px solid ${t.accent}40`,
          padding: '16px', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
            placeholder={rtl ? 'שם התבנית…' : 'Template name…'}
            style={{ padding:'8px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.card, color:t.text, fontSize:13, fontFamily:'inherit', outline:'none' }}
          />
          <textarea value={newText} onChange={e => setNewText(e.target.value)}
            placeholder={rtl ? 'טקסט הכיתוב…' : 'Caption text…'}
            rows={4}
            style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.card, color:t.text, fontSize:13, lineHeight:1.5, resize:'vertical', fontFamily:'inherit', outline:'none' }}
          />
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={() => setShowNew(false)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.muted, cursor:'pointer', fontSize:12 }}>
              {rtl ? 'ביטול' : 'Cancel'}
            </button>
            <button onClick={addNew} style={{ padding:'7px 16px', borderRadius:8, border:'none', background:t.accent, color:'#fff', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              {rtl ? 'שמור' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => (
          <div key={c.id} style={{
            background: t.card, borderRadius: 14, border: `1px solid ${t.border}`,
            padding: '14px 16px',
          }}>
            {editId === c.id ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                  style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, color:t.text, fontSize:13, fontFamily:'inherit', outline:'none', fontWeight:600 }}
                />
                <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={5}
                  style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, color:t.text, fontSize:13, lineHeight:1.5, resize:'vertical', fontFamily:'inherit', outline:'none' }}
                />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button onClick={() => setEditId(null)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.muted, cursor:'pointer', fontSize:12 }}>{rtl?'ביטול':'Cancel'}</button>
                  <button onClick={() => saveEdit(c.id)} style={{ padding:'6px 14px', borderRadius:8, border:'none', background:t.accent, color:'#fff', cursor:'pointer', fontSize:12, fontWeight:600 }}>{rtl?'שמור':'Save'}</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontWeight:700, fontSize:13, color:t.text, flex:1 }}>{c.label}</span>
                  {c.pillar && (
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:t.accent+'18', color:t.accent }}>
                      {c.pillar}
                    </span>
                  )}
                </div>
                <pre style={{
                  margin:0, padding:'10px 12px',
                  background:t.bg, borderRadius:8, border:`1px solid ${t.border}`,
                  fontSize:12, color:t.text, lineHeight:1.55,
                  whiteSpace:'pre-wrap', wordBreak:'break-word',
                  fontFamily:'inherit', direction: rtl ? 'rtl' : 'ltr',
                }}>{c.text}</pre>
                <div style={{ display:'flex', gap:8, marginTop:10, justifyContent:'flex-end' }}>
                  <button onClick={() => startEdit(c)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.muted, cursor:'pointer', fontSize:11, fontWeight:500 }}>
                    <Ico n="edit-2" size={11} color={t.muted}/>{rtl?'עריכה':'Edit'}
                  </button>
                  <button onClick={() => copyText(c.text, showToast)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, border:`1px solid ${t.accent}40`, background:t.accent+'10', color:t.accent, cursor:'pointer', fontSize:11, fontWeight:600 }}>
                    <Ico n="copy" size={11} color={t.accent}/>{rtl?'העתק':'Copy'}
                  </button>
                  <button onClick={() => setCaptions(prev => prev.filter(x => x.id !== c.id))} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, border:'1px solid #c0392b30', background:'#c0392b10', color:'#c0392b', cursor:'pointer', fontSize:11, fontWeight:500 }}>
                    <Ico n="trash-2" size={11} color="#c0392b"/>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HashtagSets tab ───────────────────────────────────────────────────────────
function HashtagsTab({ brand, t, showToast }) {
  const seeds = brand === 'gm' ? HASHTAG_SEEDS_GM : HASHTAG_SEEDS_SBF;
  const [sets, setSets] = useState(seeds);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTags, setNewTags] = useState('');
  const rtl = brand === 'gm';

  function copySet(tags) {
    const text = tags.map(t => `#${t}`).join(' ');
    copyText(text, showToast);
  }

  function deleteSet(id) { setSets(prev => prev.filter(s => s.id !== id)); }

  function addNew() {
    if (!newName.trim() || !newTags.trim()) return;
    const tags = newTags.split(/[,\s#]+/).map(t => t.replace(/^#/, '').trim()).filter(Boolean);
    setSets(prev => [{ id: uid(), name: newName, tags }, ...prev]);
    setNewName(''); setNewTags(''); setShowNew(false);
  }

  return (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <p style={{ margin:0, fontSize:13, color:t.muted }}>
          {rtl ? 'סטים מוכנים של האשטאגים — לחץ להעתקה' : 'Ready-made hashtag sets — click to copy the whole set'}
        </p>
        <button onClick={() => setShowNew(n => !n)} style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'7px 14px', borderRadius:10,
          background:t.accent, color:'#fff',
          border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
        }}>
          <Ico n="plus" size={13} color="#fff"/>
          {rtl ? 'סט חדש' : 'New set'}
        </button>
      </div>

      {showNew && (
        <div style={{
          background: t.bg, borderRadius: 14, border: `1.5px solid ${t.accent}40`,
          padding: '16px', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder={rtl ? 'שם הסט…' : 'Set name…'}
            style={{ padding:'8px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.card, color:t.text, fontSize:13, fontFamily:'inherit', outline:'none' }}
          />
          <textarea value={newTags} onChange={e => setNewTags(e.target.value)} rows={3}
            placeholder={rtl ? 'האשטאגים (מופרדים בפסיקים או רווחים)…' : 'Tags separated by commas or spaces…'}
            style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.card, color:t.text, fontSize:13, resize:'vertical', fontFamily:'inherit', outline:'none' }}
          />
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={() => setShowNew(false)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.muted, cursor:'pointer', fontSize:12 }}>
              {rtl ? 'ביטול' : 'Cancel'}
            </button>
            <button onClick={addNew} style={{ padding:'7px 16px', borderRadius:8, border:'none', background:t.accent, color:'#fff', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              {rtl ? 'שמור' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {sets.map(s => (
          <div key={s.id} style={{
            background: t.card, borderRadius: 14, border: `1px solid ${t.border}`,
            padding: '14px 16px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:13, color:t.text, flex:1 }}>{s.name}</span>
              <span style={{ fontSize:11, color:t.muted }}>{s.tags.length} tags</span>
              <button onClick={() => copySet(s.tags)} style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'5px 11px', borderRadius:8,
                border:`1px solid ${t.accent}40`, background:t.accent+'10', color:t.accent,
                cursor:'pointer', fontSize:11, fontWeight:600,
              }}>
                <Ico n="copy" size={11} color={t.accent}/>
                {rtl ? 'העתק הכל' : 'Copy all'}
              </button>
              <button onClick={() => deleteSet(s.id)} style={{
                width:28, height:28, borderRadius:8,
                border:`1px solid ${t.border}`, background:'transparent',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Ico n="trash-2" size={12} color="#c0392b"/>
              </button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {s.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => copyText(`#${tag}`, showToast)}
                  title="Click to copy"
                  style={{
                    padding:'4px 10px', borderRadius:20,
                    border:`1px solid ${t.border}`,
                    background: t.bg, color: t.accent,
                    cursor:'pointer', fontSize:12, fontWeight:500,
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const { brand, t, showToast } = useApp();
  const rtl = BRANDS[brand]?.rtl || false;

  const [tab, setTab] = useState('media');

  const TABS = [
    { key: 'media',    icon: 'image',    label: rtl ? 'מדיה'   : 'Media'    },
    { key: 'captions', icon: 'file-text',label: rtl ? 'כיתובים': 'Captions' },
    { key: 'hashtags', icon: 'hash',     label: rtl ? 'האשטאגים':'Hashtags' },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', direction: rtl ? 'rtl' : 'ltr' }}>

      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text }}>
          {rtl ? 'ספרייה' : 'Library'}
        </h1>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: t.muted }}>
          {rtl ? 'מדיה, כיתובים וסטי האשטאגים שמורים במקום אחד' : 'Your reusable media, captions and hashtag sets in one place'}
        </p>
      </div>

      {/* tab bar */}
      <div style={{
        display: 'flex', gap: 4,
        background: t.card, borderRadius: 14, padding: 4,
        border: `1px solid ${t.border}`,
        marginBottom: 24, width: 'fit-content',
      }}>
        {TABS.map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', borderRadius: 10,
            border: 'none',
            background: tab === tb.key ? t.accent : 'transparent',
            color: tab === tb.key ? '#fff' : t.muted,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            transition: 'background .12s, color .12s',
          }}>
            <Ico n={tb.icon} size={14} color={tab === tb.key ? '#fff' : t.muted}/>
            {tb.label}
          </button>
        ))}
      </div>

      {/* tab content */}
      {tab === 'media'    && <MediaGrid  t={t} showToast={showToast}/>}
      {tab === 'captions' && <CaptionsTab brand={brand} t={t} showToast={showToast}/>}
      {tab === 'hashtags' && <HashtagsTab brand={brand} t={t} showToast={showToast}/>}
    </div>
  );
}
