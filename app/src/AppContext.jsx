import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { BRANDS, DEFAULT_POSTS } from './data.js';
import { loadFromCloud, savePosts, onAuthChange } from './firebase.js';

// ── Theme tokens (mirroring CSS vars, used for inline styles) ─────────────────
export const TH = {
  sbf: {
    bg: '#fbf5ec', surface: '#ffffff', soft: '#f4ecd8', softer: '#f9f1e0',
    sand: '#efe5cf', ink: '#2b1f12', text: '#1e1810', muted: '#7a6a55',
    dim: '#a8997f', line: '#e3d6b6', line2: '#cebd97',
    accent: '#d96c3b', accent2: '#3d6e54', accent3: '#e8b658',
    accentSoft: '#fadab9', accentBg: '#fbe8d3',
    pillarColors: { Useful: '#3d6e54', Trust: '#d96c3b', Reach: '#e8b658' },
  },
  gm: {
    bg: '#f4f0e6', surface: '#ffffff', soft: '#e8e1cf', softer: '#f0e9d6',
    sand: '#dfd5bd', ink: '#1a2532', text: '#15212c', muted: '#646b78',
    dim: '#9aa3b1', line: '#d4c9b0', line2: '#b8ab8c',
    accent: '#2c6e8a', accent2: '#c97132', accent3: '#e6b94a',
    accentSoft: '#c2ddea', accentBg: '#d8e8f0',
    pillarColors: {
      'שאלת שבוע': '#2c6e8a', 'סקר מקומי': '#e6b94a',
      'שאלת שבת': '#a78bfa', 'תמונות חיים': '#c97132', 'אירועים': '#c97132',
    },
  },
};

export const FAM_DISPLAY = "'DM Serif Display', 'Cormorant Garamond', Georgia, serif";
export const FAM_SANS    = "'Geist', 'Inter', system-ui, sans-serif";

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const [user,  setUser]    = useState(undefined); // undefined = loading, null = logged out
  const [brand, setBrand]   = useState('sbf');
  const [view,  setViewRaw] = useState('dashboard');
  const [isMobile,  setIsMobile]  = useState(() => window.innerWidth < 768);
  const [isTablet,  setIsTablet]  = useState(() => window.innerWidth >= 768 && window.innerWidth < 1100);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [posts, setPosts]   = useState({
    sbf: [...DEFAULT_POSTS.sbf],
    gm:  [...DEFAULT_POSTS.gm],
  });
  const [modal, setModal]   = useState(null);
  const [toast, setToast]   = useState(null); // { msg, color }
  const toastTimer = useRef(null);
  const saveTimer  = useRef(null);

  const t = TH[brand];
  const b = BRANDS[brand];

  // Apply brand theme to <html> data-brand attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand);
  }, [brand]);

  // Load from Firebase only after user is authenticated
  useEffect(() => {
    if (!user) return; // wait until logged in
    loadFromCloud().then(cloud => {
      if (cloud) {
        setPosts(prev => {
          const merged = { ...prev };
          for (const br in cloud) {
            if (merged[br] && Array.isArray(cloud[br])) {
              merged[br] = cloud[br];
            }
          }
          return merged;
        });
        const total = Object.values(cloud).flat().filter(p => p.id > 10000).length;
        if (total > 0) showToast(`☁️ Loaded ${total} post${total !== 1 ? 's' : ''} from cloud`, '#3d6e54');
      }
    });
  }, [user?.uid]); // re-run when the logged-in user changes

  function showToast(msg, color = '#3d6e54') {
    clearTimeout(toastTimer.current);
    setToast({ msg, color });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  function setView(name) {
    setViewRaw(name);
  }

  // Mutate posts + save to Firebase
  // savePosts is called outside the setPosts updater to avoid React
  // calling the updater twice (concurrent mode) which caused race conditions
  // where an older save could overwrite a newer one.
  function updatePosts(brand, updater) {
    let nextPosts;
    setPosts(prev => {
      const next = { ...prev, [brand]: updater(prev[brand]) };
      nextPosts = next;
      return next;
    });
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!nextPosts) return;
      savePosts(nextPosts).catch(e => {
        console.warn('Save failed:', e);
        showToast('⚠️ Save failed — check connection', '#d96c3b');
      });
    }, 50);
  }

  const scheduledCount = posts[brand]?.filter(p => p.status === 'scheduled').length ?? 0;

  const ctx = {
    user,
    brand, setBrand, view, setView,
    posts, setPosts, updatePosts,
    modal, setModal,
    toast, showToast,
    t, b, scheduledCount,
    isMobile, isTablet,
  };

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
}
