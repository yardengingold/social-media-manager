import { useState, useRef, useCallback } from 'react';
import { useApp } from '../AppContext.jsx';
import { PLATFORMS, PLAT_COLORS, PLAT_CHIP_LABELS, BRANDS, PEAK_TIMES } from '../data.js';
import { Ico, PlatIcon } from '../Icons.jsx';

// ── helpers ───────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MEDIA_TYPES = ['image/', 'video/'];
function isMedia(file) { return MEDIA_TYPES.some(t => file.type.startsWith(t)); }

// Recursively collect all media files from a FileSystemEntry (file or directory)
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
          readBatch(); // keep reading until empty batch
        }, () => resolve(results.flat()));
      }
      readBatch();
    } else {
      resolve([]);
    }
  });
}

// Extract all media files from a drop event, including folder contents
async function extractDroppedFiles(e) {
  const items = [...(e.dataTransfer.items || [])];
  if (items.length && items[0].webkitGetAsEntry) {
    const entries = items.map(i => i.webkitGetAsEntry()).filter(Boolean);
    const batches = await Promise.all(entries.map(collectFromEntry));
    return batches.flat();
  }
  // fallback: plain files (no folder support)
  return [...e.dataTransfer.files].filter(isMedia);
}

function localDatetimeValue(date) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// tomorrow 9 AM
function defaultSchedule() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

// ── AI caption stubs ──────────────────────────────────────────────────────────
const AI_STUBS = {
  sbf: [
    "Just listed! This stunning home checks every box on your wishlist. Swipe to see why buyers are falling in love 🏡",
    "The market is moving fast — and so are we. DM us to find out what homes like this are selling for right now.",
    "Your dream home doesn't have to stay a dream. Let's make it happen together. 📍 Morgan Hill, CA",
    "Behind every great listing is a great story. Here's one you'll want to hear. 🔑",
    "Curb appeal? ✅ Open floor plan? ✅ Prime location? ✅ Schedule your showing today.",
  ],
  gm: [
    "נכס חדש שנוסף לרשימה! כדאי לראות את זה לפני שאחרים יגיעו 🏡",
    "הבית הבא שלכם יכול להיות ממש כאן. צרו קשר עוד היום ונמצא יחד את ההזדמנות הנכונה.",
    "שוק הנדל\"ן בתנופה — ואנחנו כאן כדי לעזור לכם לנצל אותה. 📍",
    "כל נכס מספר סיפור. זה שלפניכם שווה האזנה. 🔑",
    "חיפשתם? מצאנו. בואו נדבר על הצעד הבא שלכם.",
  ],
};

function getAiStub(brand, index) {
  const pool = AI_STUBS[brand] || AI_STUBS.sbf;
  return pool[index % pool.length];
}

// Resize image to max 768px and return base64 (without data: prefix)
function resizeImage(dataUrl, maxSize = 768) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const resized = canvas.toDataURL('image/jpeg', 0.85);
      resolve(resized.split(',')[1]); // return base64 only
    };
    img.onerror = () => resolve(dataUrl.split(',')[1]);
    img.src = dataUrl;
  });
}

async function fetchAiCaption(dataUrl, mimeType, brand) {
  const imageData = await resizeImage(dataUrl);
  const res = await fetch('/api/ai-caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData, mimeType: 'image/jpeg', brand }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.caption;
}

// ── dropzone ──────────────────────────────────────────────────────────────────
function Dropzone({ onFiles, t }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(async e => {
    e.preventDefault();
    setDragging(false);
    const files = await extractDroppedFiles(e);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleChange = async e => {
    const files = [...e.target.files];
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? t.accent : t.border}`,
        borderRadius: 20,
        padding: '52px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? t.accent + '08' : t.card,
        transition: 'all .15s',
        userSelect: 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: t.accent + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Ico n="upload-cloud" size={26} color={t.accent}/>
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 6 }}>
        Drop files here
      </div>
      <div style={{ fontSize: 13, color: t.muted, marginBottom: 12 }}>
        or click to browse · JPG, PNG, GIF, MP4
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 18px', borderRadius: 10,
        background: t.accent, color: '#fff',
        fontSize: 13, fontWeight: 600, pointerEvents: 'none',
      }}>
        <Ico n="image" size={14} color="#fff"/>
        Choose files
      </div>
    </div>
  );
}

// ── per-item card ─────────────────────────────────────────────────────────────
function ItemCard({ item, index, brand, onChange, onRemove, t }) {
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const pillars = BRANDS[brand]?.pillars || {};
  const pillarList = Object.entries(pillars);

  async function handleAiSuggest() {
    setSuggestLoading(true);
    try {
      if (item.dataUrl && !isVideo) {
        const caption = await fetchAiCaption(item.dataUrl, item.file?.type || 'image/jpeg', brand);
        onChange({ caption });
      } else {
        // video or no dataUrl — fall back to stub
        onChange({ caption: getAiStub(brand, index) });
      }
    } catch (e) {
      console.warn('AI caption failed, using stub:', e);
      onChange({ caption: getAiStub(brand, index) });
    } finally {
      setSuggestLoading(false);
    }
  }

  const isVideo = item.file?.type?.startsWith('video/');

  return (
    <div style={{
      background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
      overflow: 'hidden',
    }}>
      {/* card header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: expanded ? `1px solid ${t.border}` : 'none',
        cursor: 'pointer',
      }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* thumbnail */}
        <div style={{
          width: 44, height: 44, borderRadius: 8, overflow: 'hidden',
          background: t.bg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${t.border}`,
        }}>
          {item.dataUrl ? (
            isVideo
              ? <Ico n="video" size={20} color={t.muted}/>
              : <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          ) : (
            <Ico n="image" size={20} color={t.muted}/>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: 13, color: t.text,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.file?.name || `File ${index + 1}`}
          </div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>
            {item.caption
              ? item.caption.slice(0, 60) + (item.caption.length > 60 ? '…' : '')
              : 'No caption yet'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico n={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={t.muted}/>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{
              width: 28, height: 28, borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ico n="x" size={14} color="#c0392b"/>
          </button>
        </div>
      </div>

      {/* expanded body */}
      {expanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: 16 }}>

            {/* preview */}
            <div style={{
              width: 100, height: 100, borderRadius: 10, overflow: 'hidden',
              background: t.bg, flexShrink: 0,
              border: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.dataUrl && !isVideo
                ? <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <Ico n={isVideo ? 'video' : 'image'} size={32} color={t.muted}/>
              }
            </div>

            {/* caption + pillar */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* AI suggest button */}
              <button
                onClick={handleAiSuggest}
                disabled={suggestLoading}
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  background: t.accent + '15', color: t.accent,
                  border: `1px solid ${t.accent}40`,
                  cursor: suggestLoading ? 'default' : 'pointer',
                  fontSize: 12, fontWeight: 600,
                  opacity: suggestLoading ? .7 : 1,
                }}
              >
                {suggestLoading
                  ? <><Ico n="loader" size={13} color={t.accent}/> Generating…</>
                  : <><Ico n="zap" size={13} color={t.accent}/> AI caption</>
                }
              </button>

              {/* caption textarea */}
              <textarea
                value={item.caption}
                onChange={e => onChange({ caption: e.target.value })}
                placeholder="Write a caption…"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px',
                  borderRadius: 10, border: `1px solid ${t.border}`,
                  background: t.bg, color: t.text,
                  fontSize: 13, lineHeight: 1.5, resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* pillar (SBF only) */}
              {pillarList.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: t.muted, alignSelf: 'center', marginRight: 2 }}>Pillar:</span>
                  {pillarList.map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => onChange({ pillar: item.pillar === key ? '' : key })}
                      style={{
                        padding: '4px 10px', borderRadius: 20,
                        border: `1.5px solid ${item.pillar === key ? p.color : t.border}`,
                        background: item.pillar === key ? p.color + '20' : 'transparent',
                        color: item.pillar === key ? p.color : t.muted,
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── shared settings panel ─────────────────────────────────────────────────────
function SharedSettings({ settings, onChange, brand, t }) {
  const peakTimes = PEAK_TIMES[brand] || [];
  const activePlats = settings.platforms;

  function togglePlat(p) {
    const next = activePlats.includes(p)
      ? activePlats.filter(x => x !== p)
      : [...activePlats, p];
    onChange({ platforms: next });
  }

  function handleUsePeak(pt) {
    const [h, m] = pt.time.split(':').map(Number);
    const d = settings.scheduledAt ? new Date(settings.scheduledAt) : defaultSchedule();
    d.setHours(h, m, 0, 0);
    onChange({ scheduledAt: d });
  }

  const brandPlatforms = BRANDS[brand]?.platforms || Object.keys(PLATFORMS);

  return (
    <div style={{
      background: t.card, borderRadius: 16,
      border: `1px solid ${t.border}`,
      padding: '20px',
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 16 }}>
        Shared settings
      </div>

      {/* platforms */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Platforms
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {brandPlatforms.map(p => {
            const active = activePlats.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlat(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 20,
                  border: `1.5px solid ${active ? PLAT_COLORS[p] : t.border}`,
                  background: active ? PLAT_COLORS[p] + '18' : 'transparent',
                  color: active ? PLAT_COLORS[p] : t.muted,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                <PlatIcon id={p} size={13}/>
                {PLAT_CHIP_LABELS[p] || p.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* date/time */}
      <div style={{ marginBottom: peakTimes.length ? 20 : 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Schedule (applies to all)
        </div>
        <input
          type="datetime-local"
          value={settings.scheduledAt ? localDatetimeValue(settings.scheduledAt) : ''}
          onChange={e => onChange({ scheduledAt: e.target.value ? new Date(e.target.value) : null })}
          style={{
            padding: '9px 12px', borderRadius: 10,
            border: `1px solid ${t.border}`,
            background: t.bg, color: t.text,
            fontSize: 13, fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      {/* peak times */}
      {peakTimes.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Peak times
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {peakTimes.map((pt, i) => (
              <button
                key={i}
                onClick={() => handleUsePeak(pt)}
                style={{
                  padding: '5px 11px', borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: t.bg, color: t.muted,
                  cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
                title={`Use ${pt.time}`}
              >
                <Ico n="clock" size={12} color={t.accent}/>
                {pt.time}
                <span style={{ color: t.accent, fontWeight: 600 }}>{pt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* action */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Action
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['scheduled', 'draft'].map(a => (
            <button
              key={a}
              onClick={() => onChange({ action: a })}
              style={{
                padding: '7px 16px', borderRadius: 10,
                border: `1.5px solid ${settings.action === a ? t.accent : t.border}`,
                background: settings.action === a ? t.accent + '15' : 'transparent',
                color: settings.action === a ? t.accent : t.muted,
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {a === 'scheduled' ? 'Schedule' : 'Save as draft'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function BulkDropScreen() {
  const { brand, updatePosts, t, setView, showToast } = useApp();

  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [settings, setSettings] = useState({
    platforms:   (BRANDS[brand]?.platforms || ['ig']).slice(0, 2),
    scheduledAt: defaultSchedule(),
    action:      'scheduled',
  });

  async function handleFiles(files) {
    setLoading(true);
    const newItems = await Promise.all(files.map(async (file, i) => ({
      id:      uid(),
      file,
      dataUrl: await readFile(file),
      caption: '',
      pillar:  '',
    })));
    setItems(prev => [...prev, ...newItems]);
    setLoading(false);
  }

  function updateItem(id, patch) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  async function handleAiAll() {
    const uncaptioned = items.filter(it => !it.caption);
    if (!uncaptioned.length) { showToast('All items already have captions'); return; }
    showToast(`✨ Generating ${uncaptioned.length} caption${uncaptioned.length > 1 ? 's' : ''}…`);
    await Promise.all(uncaptioned.map(async (it, i) => {
      const isVideo = it.file?.type?.startsWith('video/');
      try {
        const caption = (!isVideo && it.dataUrl)
          ? await fetchAiCaption(it.dataUrl, it.file?.type || 'image/jpeg', brand)
          : getAiStub(brand, i);
        setItems(prev => prev.map(x => x.id === it.id ? { ...x, caption } : x));
      } catch {
        setItems(prev => prev.map(x => x.id === it.id ? { ...x, caption: getAiStub(brand, i) } : x));
      }
    }));
    showToast('✨ AI captions done!');
  }

  function handleSubmit() {
    if (items.length === 0) {
      showToast('Add at least one file first', '#c0392b');
      return;
    }
    if (settings.platforms.length === 0) {
      showToast('Choose at least one platform', '#c0392b');
      return;
    }

    const newPosts = items.map(it => ({
      id:          uid(),
      caption:     it.caption,
      pillar:      it.pillar,
      platforms:   settings.platforms,
      scheduledAt: settings.action === 'draft' ? null : settings.scheduledAt,
      status:      settings.action === 'draft' ? 'draft' : 'scheduled',
      media:       [{ id: uid(), type: it.file.type, name: it.file.name, dataUrl: it.dataUrl }],
      createdAt:   new Date(),
    }));

    updatePosts(brand, prev => [...prev, ...newPosts]);
    showToast(`✓ ${newPosts.length} post${newPosts.length !== 1 ? 's' : ''} added to queue`);
    setView('queue');
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>

      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text }}>
          Bulk Drop
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted }}>
          Upload multiple files, write captions, and schedule them all at once.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* left column: dropzone + items */}
        <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* dropzone */}
          <Dropzone onFiles={handleFiles} t={t}/>

          {loading && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '16px', color: t.muted, fontSize: 13,
            }}>
              <Ico n="loader" size={16} color={t.accent}/>
              Loading files…
            </div>
          )}

          {/* item list header */}
          {items.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: -4,
            }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: t.text }}>
                {items.length} file{items.length !== 1 ? 's' : ''} ready
              </span>
              <button
                onClick={handleAiAll}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  background: t.accent + '15', color: t.accent,
                  border: `1px solid ${t.accent}40`,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                <Ico n="zap" size={13} color={t.accent}/>
                AI captions for all
              </button>
            </div>
          )}

          {/* items */}
          {items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              index={i}
              brand={brand}
              onChange={patch => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
              t={t}
            />
          ))}
        </div>

        {/* right column: shared settings + submit */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SharedSettings
            settings={settings}
            onChange={patch => setSettings(s => ({ ...s, ...patch }))}
            brand={brand}
            t={t}
          />

          {/* submit */}
          <button
            onClick={handleSubmit}
            disabled={items.length === 0}
            style={{
              width: '100%',
              padding: '13px 0', borderRadius: 12,
              background: items.length === 0 ? t.border : t.accent,
              color: items.length === 0 ? t.muted : '#fff',
              border: 'none', cursor: items.length === 0 ? 'default' : 'pointer',
              fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background .15s',
            }}
          >
            <Ico n={settings.action === 'draft' ? 'file-text' : 'send'} size={16} color={items.length === 0 ? t.muted : '#fff'}/>
            {settings.action === 'draft'
              ? `Save ${items.length || 0} draft${items.length !== 1 ? 's' : ''}`
              : `Schedule ${items.length || 0} post${items.length !== 1 ? 's' : ''}`
            }
          </button>

          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: 'transparent', color: t.muted,
                cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
