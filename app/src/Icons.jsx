// Inline SVG icon set — stroke-based, uniform 24×24 viewBox

export function Ico({ name, size = 16, c = 'currentColor', sw = 1.8 }) {
  const I = (path) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
  const M = {
    home:    I(<path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>),
    sun:     I(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>),
    cal:     I(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>),
    edit:    I(<><path d="M4 20h4l11-11-4-4L4 16z"/><path d="M14 6l4 4"/></>),
    list:    I(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>),
    chart:   I(<path d="M3 21h18M6 17V9M11 17V5M16 17v-7M21 17v-3"/>),
    bolt:    I(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>),
    plus:    I(<path d="M12 5v14M5 12h14"/>),
    sparkle: I(<path d="M12 3v6M12 15v6M3 12h6M15 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-5 5"/>),
    bell:    I(<><path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 21h4"/></>),
    chev:    I(<path d="M9 18l6-6-6-6"/>),
    chevD:   I(<path d="M6 9l6 6 6-6"/>),
    chevL:   I(<path d="M15 18l-6-6 6-6"/>),
    image:   I(<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></>),
    video:   I(<><rect x="3" y="6" width="14" height="12" rx="2"/><path d="M17 10l4-2v8l-4-2z"/></>),
    play:    I(<><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z" fill={c}/></>),
    eye:     I(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>),
    heart:   I(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>),
    arrowR:  I(<path d="M5 12h14M13 6l6 6-6 6"/>),
    arrowUp: I(<path d="M7 17 17 7M9 7h8v8"/>),
    arrowDown:I(<path d="M17 7 7 17M15 17H7V9"/>),
    clock:   I(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
    upload:  I(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></>),
    user:    I(<><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></>),
    search:  I(<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>),
    check:   I(<path d="M5 12l5 5L20 7"/>),
    pen:     I(<path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/>),
    repeat:  I(<><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></>),
    mic:     I(<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></>),
    flower:  I(<><circle cx="12" cy="12" r="2"/><path d="M12 2a4 4 0 0 0 0 8 4 4 0 0 0 0-8zM12 14a4 4 0 0 0 0 8 4 4 0 0 0 0-8zM2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0zM14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></>),
    inbox:   I(<><path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>),
    folder:  I(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>),
    moon:    I(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>),
    smile:   I(<><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>),
    x:       I(<path d="M18 6 6 18M6 6l12 12"/>),
    settings:I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
    msg:     I(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>),
    library: I(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
    trash:   I(<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/><path d="M10 11v6M14 11v6"/></>),
    refresh: I(<><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></>),
    dot:     I(<circle cx="12" cy="12" r="4" fill={c}/>),
    filter:  I(<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>),
    grip:    I(<><circle cx="9" cy="5" r="1.5" fill={c}/><circle cx="9" cy="12" r="1.5" fill={c}/><circle cx="9" cy="19" r="1.5" fill={c}/><circle cx="15" cy="5" r="1.5" fill={c}/><circle cx="15" cy="12" r="1.5" fill={c}/><circle cx="15" cy="19" r="1.5" fill={c}/></>),
    star:    I(<path d="m12 2 3 7 8 .5-6 5 2 8-7-4-7 4 2-8-6-5 8-.5z"/>),
    cmd:     I(<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3z"/>),
    hash:    I(<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>),
    tag:     I(<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>),
    globe:   I(<><circle cx="12" cy="12" r="9"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>),
    zap:     I(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>),
  };
  return M[name] || null;
}

// Platform SVG icons
export function PlatIcon({ p, size = 14, color = 'currentColor' }) {
  const w = { strokeWidth: 1.7 };
  const map = {
    ig:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill={color}/></svg>,
    fb:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><path d="M18 3h-3a4 4 0 0 0-4 4v3H8v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z"/></svg>,
    fbp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><circle cx="12" cy="8" r="3.5"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>,
    fbg: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5M14.5 19c.7-2.2 2.3-3.3 4-3.3"/></svg>,
    li:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7 10v8M7 7v.01M11 18v-5a2.5 2.5 0 0 1 5 0v5M11 10v8"/></svg>,
    wa:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...w}><path d="M21 11.5a8.5 8.5 0 1 1-3.6-6.95L21 4l-1.5 3.6A8.45 8.45 0 0 1 21 11.5z"/></svg>,
  };
  return map[p] || null;
}

// Brand lettermark
export function BrandMark({ brand, size = 32 }) {
  const map = {
    sbf: { bg: '#fadab9', fg: '#d96c3b', glyph: 'F' },
    gm:  { bg: '#c2ddea', fg: '#2c6e8a', glyph: 'ג' },
  };
  const m = map[brand] || map.sbf;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: m.bg, color: m.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Serif Display', Georgia, serif",
      fontSize: size * 0.45, flexShrink: 0, letterSpacing: '-.02em', fontWeight: 400,
    }}>{m.glyph}</div>
  );
}
