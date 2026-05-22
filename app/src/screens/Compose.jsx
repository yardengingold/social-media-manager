import { useState, useRef, useCallback } from 'react';
import { useApp, FAM_DISPLAY, FAM_SANS } from '../AppContext.jsx';
import { Ico, PlatIcon, BrandMark } from '../Icons.jsx';
import { BRANDS, PLATFORMS, PEAK_TIMES } from '../data.js';

// ── Platform preview cards ─────────────────────────────────────────────────────

function IGPreview({ t, brand, text, mediaFiles }) {
  const b = BRANDS[brand];
  const hasMedia = mediaFiles.length > 0;
  const firstFile = mediaFiles[0];
  return (
    <div style={{ background: '#fff', border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', padding: 2, background: 'linear-gradient(45deg,#fdda73,#d6249f,#285aeb)', flexShrink: 0 }}>
          <BrandMark brand={brand} size={28}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#000' }}>{b.handle.replace('@','')}</div>
          <div style={{ fontSize: 10, color: '#666' }}>Morgan Hill, California</div>
        </div>
        <div style={{ color: '#000', fontWeight: 700, letterSpacing: '.1em' }}>···</div>
      </div>
      {hasMedia && firstFile?.dataUrl ? (
        <img src={firstFile.dataUrl} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}/>
      ) : (
        <div style={{
          aspectRatio: '1/1', background: t.accentSoft,
          backgroundImage: `repeating-linear-gradient(135deg, ${t.line2} 0 1px, transparent 1px 16px)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.muted, fontFamily: 'ui-monospace,monospace', fontSize: 11, letterSpacing: '.15em',
        }}>ADD AN IMAGE</div>
      )}
      <div style={{ padding: '10px 14px 4px', display: 'flex', gap: 16, color: '#000' }}>
        <Ico name="heart" size={22} c="#000" sw={1.5}/>
        <Ico name="msg"   size={22} c="#000" sw={1.5}/>
        <Ico name="arrowR" size={22} c="#000" sw={1.5}/>
      </div>
      <div style={{ padding: '0 14px 14px', fontSize: 13, lineHeight: 1.5, color: '#000', direction: brand === 'gm' ? 'rtl' : 'ltr' }}>
        <span style={{ fontWeight: 600 }}>{b.handle.replace('@','')}</span>{' '}
        {text.slice(0, 125)}{text.length > 125 && <span style={{ color: '#8e8e8e' }}> ...more</span>}
      </div>
    </div>
  );
}

function WAPreview({ t, brand, text }) {
  return (
    <div style={{ background: '#0b141a', borderRadius: 14, padding: 18, minHeight: 200 }}>
      <div style={{ fontSize: 10, color: '#8c97a3', textAlign: 'center', marginBottom: 14 }}>Today</div>
      <div style={{
        background: '#005c4b', color: '#fff', borderRadius: 12, padding: 12,
        maxWidth: '88%', marginInlineStart: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,.3)',
      }}>
        <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap', direction: brand === 'gm' ? 'rtl' : 'ltr' }}>{text || '…'}</div>
        <div style={{ fontSize: 9.5, color: '#9bd0bf', textAlign: 'right', marginTop: 5 }}>14:23 ✓✓</div>
      </div>
    </div>
  );
}

function LIPreview({ t, text, mediaFiles }) {
  const hasMedia = mediaFiles.length > 0;
  const firstFile = mediaFiles[0];
  return (
    <div style={{ background: '#fff', border: `1px solid ${t.line}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0a66c2', color: '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>MF</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>Moshe Fogel</div>
          <div style={{ fontSize: 10.5, color: '#666' }}>Real Estate Broker · 18,400 followers</div>
          <div style={{ fontSize: 10.5, color: '#666' }}>1m · 🌎</div>
        </div>
      </div>
      <div style={{ padding: '0 16px 13px', fontSize: 13, color: '#000', lineHeight: 1.55 }}>
        {text.slice(0, 200)}{text.length > 200 && <span style={{ color: '#0a66c2', fontWeight: 600 }}> …see more</span>}
      </div>
      {hasMedia && firstFile?.dataUrl && (
        <img src={firstFile.dataUrl} alt="" style={{ width: '100%', aspectRatio: '1.91/1', objectFit: 'cover', display: 'block' }}/>
      )}
      <div style={{ display: 'flex', padding: '10px 16px', borderTop: '1px solid #eee', justifyContent: 'space-around', color: '#666', fontSize: 12, fontWeight: 500 }}>
        <span>👍 Like</span><span>💬 Comment</span><span>↻ Repost</span><span>↗ Send</span>
      </div>
    </div>
  );
}

function FBPreview({ t, brand, text, mediaFiles }) {
  const b = BRANDS[brand];
  const hasMedia = mediaFiles.length > 0;
  const firstFile = mediaFiles[0];
  return (
    <div style={{ background: '#fff', border: `1px solid ${t.line}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#1877f2', color: '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
          {brand === 'sbf' ? 'SF' : 'GM'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#050505' }}>{b.name}</div>
          <div style={{ fontSize: 11, color: '#65676b' }}>Just now · 🌎</div>
        </div>
      </div>
      <div style={{ padding: '0 15px 11px', fontSize: 13.5, color: '#050505', lineHeight: 1.5, direction: brand === 'gm' ? 'rtl' : 'ltr', whiteSpace: 'pre-wrap' }}>
        {text}
      </div>
      {hasMedia && firstFile?.dataUrl && (
        <img src={firstFile.dataUrl} alt="" style={{ width: '100%', aspectRatio: '5/4', objectFit: 'cover', display: 'block' }}/>
      )}
      <div style={{ padding: '11px 15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', color: '#65676b', fontSize: 12, fontWeight: 600 }}>
        <span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span>
      </div>
    </div>
  );
}

function PreviewCard({ t, brand, platform, text, mediaFiles }) {
  if (platform === 'ig') return <IGPreview t={t} brand={brand} text={text} mediaFiles={mediaFiles}/>;
  if (platform === 'wa') return <WAPreview t={t} brand={brand} text={text}/>;
  if (platform === 'li') return <LIPreview t={t} text={text} mediaFiles={mediaFiles}/>;
  return <FBPreview t={t} brand={brand} text={text} mediaFiles={mediaFiles}/>;
}

// ── Tool button ───────────────────────────────────────────────────────────────
function ToolBtn({ t, icon, label, highlighted, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 20,
      border: `1px solid ${highlighted ? t.accent : t.line2}`,
      background: highlighted ? `${t.accent}10` : t.surface,
      color: highlighted ? t.accent : t.muted,
      cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 11.5,
      display: 'flex', alignItems: 'center', gap: 7, fontWeight: 500,
    }}>
      <Ico name={icon} size={12} c={highlighted ? t.accent : t.muted}/>
      {label}
    </button>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ t, children }) {
  return (
    <div style={{ fontSize: 11, color: t.muted, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
      {children}
    </div>
  );
}

// ── Media thumbs ──────────────────────────────────────────────────────────────
function MediaStrip({ t, mediaFiles, onAdd, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
      {mediaFiles.map((m, i) => (
        <div key={m.id} style={{ width: 84, height: 84, position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.line2}` }}>
          {m.dataUrl ? (
            m.type === 'video'
              ? <video src={m.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted/>
              : <img src={m.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          ) : (
            <div style={{ width: '100%', height: '100%', background: t.softer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name={m.type === 'video' ? 'video' : 'image'} size={24} c={t.muted}/>
            </div>
          )}
          <button onClick={() => onRemove(m.id)} style={{
            position: 'absolute', top: 4, right: 4, width: 20, height: 20,
            borderRadius: 10, background: 'rgba(0,0,0,.6)', color: '#fff',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          }}>✕</button>
          <span style={{
            position: 'absolute', bottom: 4, left: 4, fontSize: 8,
            background: 'rgba(0,0,0,.55)', color: '#fff', padding: '2px 5px', borderRadius: 3,
            letterSpacing: '.06em',
          }}>
            {m.type === 'video' ? 'VID' : 'IMG'}
          </span>
        </div>
      ))}
      <button onClick={onAdd} style={{
        width: 84, height: 84, borderRadius: 10, border: `2px dashed ${t.line2}`,
        background: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.muted, flexDirection: 'column', gap: 4, fontFamily: FAM_SANS,
      }}>
        <Ico name="plus" size={18} c={t.muted}/>
        <span style={{ fontSize: 9.5 }}>Add</span>
      </button>
    </div>
  );
}

// ── Compose tip ───────────────────────────────────────────────────────────────
const PLATFORM_TIPS = {
  ig:  'IG: First line is what shows before "...more". Lead with the hook.',
  li:  'LinkedIn: First 200 chars show before "see more". Stats-heavy lines convert.',
  wa:  'WhatsApp: Keep it short. No hashtags. Links auto-preview.',
  fb:  'Facebook: First 3 lines visible before fold. Long captions perform on FB Pages.',
  fbp: 'Facebook Personal: First 3 lines visible before fold. Keep it human.',
  fbg: 'FB Group: Community-first tone. Ask a question to drive comments.',
};

// ── Main Compose screen ───────────────────────────────────────────────────────
export default function ComposeScreen({ editPost = null, onSaved }) {
  const { t, brand, posts, updatePosts, showToast, setView, isMobile } = useApp();
  const b = BRANDS[brand];
  const isHe = brand === 'gm';

  // Form state
  const [text,     setText]     = useState(editPost?.text || '');
  const [platforms, setPlatforms] = useState(editPost?.platforms || b.platforms.slice(0, 2));
  const [pillar,   setPillar]   = useState(editPost?.pillar || (brand === 'sbf' ? 'Useful' : null));
  const [subType,  setSubType]  = useState(editPost?.series || null);
  const [schedDate, setSchedDate] = useState(() => {
    if (editPost?.date) return new Date(editPost.date).toISOString().split('T')[0];
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [schedTime, setSchedTime] = useState(() => {
    if (editPost?.date) {
      const d = new Date(editPost.date);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
    return '09:00';
  });
  const [action,   setAction]   = useState('Schedule');
  const [mediaFiles, setMediaFiles] = useState(editPost?.media || []);
  const [activePreview, setActivePreview] = useState(platforms[0] || 'ig');
  const [aiPrompt, setAiPrompt] = useState('');

  const fileInputRef = useRef(null);

  // Toggle platform
  function togglePlatform(p) {
    const next = platforms.includes(p) ? platforms.filter(x => x !== p) : [...platforms, p];
    setPlatforms(next);
    if (!next.includes(activePreview) && next[0]) setActivePreview(next[0]);
  }

  // Handle file upload
  function handleFiles(files) {
    const arr = Array.from(files).slice(0, 10 - mediaFiles.length);
    arr.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setMediaFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: file.type.startsWith('video/') ? 'video' : 'image',
          name: file.name, dataUrl: e.target.result,
        }]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeMedia(id) {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  }

  // Get peak time hint for selected pillar
  const peakHint = PEAK_TIMES[brand]?.find(p => p.pillar === pillar) || PEAK_TIMES[brand]?.[0];

  function usePeakTime() {
    if (!peakHint) return;
    const dayMap = { Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:0 };
    const targetDow = dayMap[peakHint.day] ?? 1;
    const d = new Date();
    const diff = (targetDow - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    setSchedDate(d.toISOString().split('T')[0]);
    const [h, rest] = peakHint.time.split(':');
    const mins = rest?.replace(/\s?(AM|PM)/i, '') || '00';
    const hour = peakHint.time.includes('PM') && parseInt(h) !== 12
      ? String(parseInt(h) + 12).padStart(2, '0')
      : String(parseInt(h)).padStart(2, '0');
    setSchedTime(`${hour}:${mins.padStart(2,'0')}`);
  }

  // Submit
  function handleSubmit() {
    if (!text.trim())     { showToast('⚠️ Write a caption first', '#d96c3b'); return; }
    if (!platforms.length) { showToast('⚠️ Select at least one platform', '#d96c3b'); return; }

    const statusMap = { 'Schedule': 'scheduled', 'Save as Draft': 'draft', 'Post Now': 'published' };
    const status = statusMap[action] || 'scheduled';
    const date   = schedDate ? new Date(`${schedDate}T${schedTime || '09:00'}`) : new Date();

    if (editPost) {
      updatePosts(brand, prev => prev.map(p =>
        p.id === editPost.id
          ? { ...p, text, platforms, date, status, pillar, series: subType, media: mediaFiles }
          : p
      ));
      showToast('✅ Post updated!', '#3d6e54');
    } else {
      const newPost = {
        id: Date.now(), text, platforms, date, status,
        pillar, series: subType, type: 'post',
        emoji: b.brandEmoji, media: mediaFiles,
      };
      updatePosts(brand, prev => [...prev, newPost]);
      showToast(
        status === 'published' ? '🚀 Posted!' : status === 'draft' ? '💾 Draft saved!' : '✅ Scheduled!',
        '#3d6e54'
      );
    }

    // Reset form
    setText(''); setPlatforms(b.platforms.slice(0, 2));
    setMediaFiles([]); setAction('Schedule');
    setView('queue');
  }

  const sbfPillars = b.pillars || [];
  const activePillarDef = sbfPillars.find(p => p.label === pillar);
  const charLimit = PLATFORMS[activePreview]?.maxChars || 2200;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 20 : 28 }}>
      {/* ── LEFT: Composer ── */}
      <div>
        {/* AI ribbon */}
        <div style={{
          padding: '14px 16px', marginBottom: 18, borderRadius: 14,
          background: `linear-gradient(135deg, ${t.softer} 0%, ${t.accentSoft} 100%)`,
          border: `1px solid ${t.line}`, display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: t.surface, color: t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: `1px solid ${t.line2}`,
          }}>
            <Ico name="sparkle" size={16} c={t.accent}/>
          </div>
          <input
            value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
            placeholder={isHe ? 'תאר מה ליצור — "פוסט יום שלישי על שבועות"' : '"Write a Wed Trust post about my last close"'}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: FAM_SANS, fontSize: 13, color: t.text,
            }}
          />
          <button style={{
            padding: '7px 14px', background: t.ink, color: t.bg,
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: FAM_SANS, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {isHe ? 'צור' : 'Generate'}
          </button>
        </div>

        {/* SBF: Pillar selector */}
        {brand === 'sbf' && (
          <div style={{ marginBottom: 18 }}>
            <SectionLabel t={t}>Content pillar</SectionLabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {sbfPillars.map(p => {
                const isOn = pillar === p.label;
                const c = (t.pillarColors || {})[p.label] || t.accent;
                return (
                  <button key={p.label} onClick={() => { setPillar(p.label); setSubType(p.types?.[0]?.id || null); }} style={{
                    padding: '7px 13px', borderRadius: 18,
                    border: `1.5px solid ${isOn ? c : t.line2}`,
                    background: isOn ? `${c}15` : t.surface,
                    color: isOn ? c : t.muted,
                    cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 12, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                  }}>
                    <span style={{ fontSize: 9.5, opacity: .7, letterSpacing: '.06em' }}>
                      {p.day?.toUpperCase()}
                    </span>
                    {p.label}
                  </button>
                );
              })}
            </div>
            {activePillarDef?.types && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {activePillarDef.types.map(typ => {
                  const isOn = subType === typ.id;
                  return (
                    <button key={typ.id} onClick={() => setSubType(typ.id)} style={{
                      padding: '5px 11px', borderRadius: 6,
                      border: `1px solid ${isOn ? t.ink : t.line2}`,
                      background: isOn ? t.ink : 'transparent',
                      color: isOn ? t.bg : t.muted,
                      cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 11.5, fontWeight: 500,
                    }}>
                      {typ.icon} {typ.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Platforms */}
        <SectionLabel t={t}>{isHe ? 'פלטפורמות' : 'Posting to'}</SectionLabel>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {b.platforms.map(p => {
            const isOn = platforms.includes(p);
            const meta = PLATFORMS[p];
            return (
              <button key={p} onClick={() => togglePlatform(p)} style={{
                padding: '7px 13px', borderRadius: 20,
                border: `1.5px solid ${isOn ? t.accent : t.line2}`,
                background: isOn ? `${t.accent}15` : t.surface,
                color: isOn ? t.accent : t.muted,
                cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 12, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}>
                <PlatIcon p={p} size={13} color={isOn ? t.accent : t.muted}/>
                {meta?.short || p.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Media upload */}
        <SectionLabel t={t}>{isHe ? 'מדיה' : 'Media'}</SectionLabel>
        <input
          ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }}
          onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        <MediaStrip
          t={t} mediaFiles={mediaFiles}
          onAdd={() => fileInputRef.current?.click()}
          onRemove={removeMedia}
        />

        {/* Caption textarea */}
        <SectionLabel t={t}>{isHe ? 'כתבו...' : 'Write something'}</SectionLabel>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            dir={isHe ? 'rtl' : 'ltr'}
            placeholder={isHe ? 'כתבו את הפוסט שלכם כאן...' : 'Write your caption here…'}
            style={{
              width: '100%', minHeight: 200, padding: 20,
              background: t.surface, border: `1px solid ${t.line2}`, borderRadius: 14,
              fontFamily: FAM_DISPLAY, fontSize: 18, color: t.text, lineHeight: 1.55,
              resize: 'vertical', outline: 'none', letterSpacing: '-.005em',
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 14, right: 18,
            fontSize: 10.5, color: text.length > charLimit * .9 ? '#d96c3b' : t.muted,
            fontFamily: FAM_SANS, background: t.surface, padding: '2px 6px',
          }}>
            {text.length.toLocaleString()} / {charLimit.toLocaleString()}
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          <ToolBtn t={t} icon="sparkle" label={isHe ? '#האשטגים' : 'Hashtags'}/>
          <ToolBtn t={t} icon="library" label={isHe ? 'מהספרייה' : 'From library'}/>
          {brand === 'gm' && <ToolBtn t={t} icon="repeat" label="EN ⇄ HE" highlighted/>}
        </div>

        {/* Schedule strip */}
        <div style={{ padding: 18, background: t.surface, border: `1px solid ${t.line}`, borderRadius: 14 }}>
          {/* Peak time hint */}
          {peakHint && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: t.accentSoft, color: t.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ico name="bolt" size={14} c={t.accent}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>
                    {isHe ? `הזמן הטוב ביותר ל${pillar || ''}` : `Best time for ${pillar || 'this content'}`}
                  </div>
                  <div style={{ fontSize: 11, color: t.muted, marginTop: 2, lineHeight: 1.5 }}>
                    <span style={{ color: t.accent, fontWeight: 600 }}>{peakHint.day} · {peakHint.time}</span>
                    <span> — {peakHint.lift} engagement vs your average</span>
                  </div>
                </div>
                <button onClick={usePeakTime} style={{
                  padding: '7px 13px', background: 'transparent', color: t.text,
                  border: `1px solid ${t.line2}`, borderRadius: 10, cursor: 'pointer',
                  fontFamily: FAM_SANS, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  {isHe ? 'השתמש' : 'Use it'}
                </button>
              </div>
              <div style={{
                fontSize: 11, color: t.muted, lineHeight: 1.5,
                padding: '8px 12px', background: t.softer, borderRadius: 8,
                marginBottom: 12, display: 'flex', gap: 8,
              }}>
                <Ico name="sparkle" size={11} c={t.muted}/>
                <span>{peakHint.why}</span>
              </div>
            </>
          )}

          {/* Date / time / action / submit */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
              style={{
                padding: '9px 14px', background: t.surface, border: `1px solid ${t.line2}`,
                borderRadius: 8, fontFamily: FAM_SANS, fontSize: 12.5, color: t.text, outline: 'none',
              }}
            />
            <input
              type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)}
              style={{
                padding: '9px 14px', background: t.surface, border: `1px solid ${t.line2}`,
                borderRadius: 8, fontFamily: FAM_SANS, fontSize: 12.5, color: t.text, outline: 'none',
              }}
            />
            <select
              value={action} onChange={e => setAction(e.target.value)}
              style={{
                padding: '9px 14px', background: t.surface, border: `1px solid ${t.line2}`,
                borderRadius: 8, fontFamily: FAM_SANS, fontSize: 12.5, color: t.text, outline: 'none',
              }}
            >
              <option>Schedule</option>
              <option>Save as Draft</option>
              <option>Post Now</option>
            </select>
            <button onClick={handleSubmit} style={{
              marginLeft: 'auto', padding: '10px 18px', background: t.ink, color: t.bg,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: FAM_SANS, fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
            }}>
              {editPost ? (isHe ? 'עדכן' : 'Update post') : (isHe ? 'תזמן' : 'Schedule post')}
              <Ico name="arrowR" size={13} c={t.bg} sw={2.2}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Preview ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionLabel t={t}>{isHe ? 'תצוגה מקדימה' : 'How it looks'}</SectionLabel>
          <span style={{ fontSize: 10.5, color: t.muted, fontVariantNumeric: 'tabular-nums' }}>
            {text.length.toLocaleString()} / {charLimit.toLocaleString()}
          </span>
        </div>

        {/* Platform tab switcher */}
        {platforms.length > 0 && (
          <div style={{
            display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap',
            padding: 4, background: t.surface, border: `1px solid ${t.line}`,
            borderRadius: 10, width: 'fit-content',
          }}>
            {platforms.map(p => (
              <button key={p} onClick={() => setActivePreview(p)} style={{
                padding: '7px 12px', borderRadius: 7, border: 'none',
                background: activePreview === p ? t.softer : 'transparent',
                color: activePreview === p ? t.ink : t.muted,
                cursor: 'pointer', fontFamily: FAM_SANS, fontSize: 11.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <PlatIcon p={p} size={12} color={activePreview === p ? t.ink : t.muted}/>
                {PLATFORMS[p]?.short || p}
              </button>
            ))}
          </div>
        )}

        {/* Live preview */}
        {platforms.length > 0
          ? <PreviewCard t={t} brand={brand} platform={activePreview} text={text} mediaFiles={mediaFiles}/>
          : (
            <div style={{
              padding: 40, background: t.softer, borderRadius: 14, border: `1px dashed ${t.line2}`,
              textAlign: 'center', color: t.muted, fontSize: 13,
            }}>
              Select a platform to see a preview
            </div>
          )
        }

        {/* Platform tip */}
        {platforms.length > 0 && (
          <div style={{
            marginTop: 14, padding: '12px 14px', background: t.softer,
            borderRadius: 10, border: `1px solid ${t.line}`, display: 'flex', gap: 10,
          }}>
            <Ico name="eye" size={14} c={t.muted}/>
            <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.5 }}>
              {PLATFORM_TIPS[activePreview] || ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
