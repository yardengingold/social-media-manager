// ── Firebase persistence (ported from index.html) ──
const FIREBASE_URL = 'https://moya-social-default-rtdb.firebaseio.com';

function serializePosts(posts) {
  const out = {};
  for (const brand in posts) {
    out[brand] = posts[brand].map(p => ({
      ...p,
      date: p.date instanceof Date ? p.date.toISOString() : p.date,
      media: p.media || [],
    }));
  }
  return JSON.stringify(out);
}

function deserializePosts(json) {
  const raw = JSON.parse(json);
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
  if (!FIREBASE_URL) return;
  try {
    const res = await fetch(`${FIREBASE_URL}/posts.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: serializePosts(posts),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  } catch (e) {
    console.warn('Firebase save failed:', e);
    throw e;
  }
}

export async function loadFromCloud() {
  if (!FIREBASE_URL) return null;
  try {
    const res = await fetch(`${FIREBASE_URL}/posts.json`);
    const json = await res.text();
    if (json && json !== 'null') {
      return deserializePosts(json);
    }
    return null;
  } catch (e) {
    console.warn('Firebase load failed:', e);
    return null;
  }
}
