import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        "moya-social.firebaseapp.com",
  databaseURL:       "https://moya-social-default-rtdb.firebaseio.com",
  projectId:         "moya-social",
  storageBucket:     "moya-social.firebasestorage.app",
  messagingSenderId: "681412936420",
  appId:             "1:681412936420:web:95ce5c6ef76cc04b5d22f1",
  measurementId:     "G-LR12YDTKEK",
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db   = getDatabase(app);

// ── Auth helpers ──────────────────────────────────────────────────────────────
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return fbSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Data helpers ──────────────────────────────────────────────────────────────
function serializePosts(posts) {
  const out = {};
  for (const brand in posts) {
    out[brand] = posts[brand].map(p => ({
      ...p,
      date: p.date instanceof Date ? p.date.toISOString() : p.date,
      // Strip base64 dataUrls — they're too large for Firebase RTDB.
      // The image stays in memory for the current session via React state.
      media: (p.media || []).map(({ dataUrl: _omit, ...rest }) => rest),
    }));
  }
  return out;
}

function deserializePosts(raw) {
  for (const brand in raw) {
    if (!Array.isArray(raw[brand])) continue;
    raw[brand] = raw[brand].map(p => ({
      ...p,
      date: new Date(p.date),
      media: p.media || [],
    }));
  }
  return raw;
}

export async function savePosts(posts) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const postsRef = ref(db, 'posts');
  await set(postsRef, serializePosts(posts));
}

export async function loadFromCloud() {
  try {
    const postsRef = ref(db, 'posts');
    const snapshot = await get(postsRef);
    if (snapshot.exists()) {
      return deserializePosts(snapshot.val());
    }
    return null;
  } catch (e) {
    console.warn('Firebase load failed:', e);
    return null;
  }
}
