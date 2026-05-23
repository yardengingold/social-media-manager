import { useState } from 'react';
import { signIn } from '../firebase.js';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      // onAuthStateChanged in AppContext will handle the rest
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: '#fbf5ec',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
      padding: '24px',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 32px rgba(43,31,18,0.10)',
        border: '1px solid #e3d6b6',
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 28,
            color: '#2b1f12',
            letterSpacing: '-0.5px',
            marginBottom: 6,
          }}>
            Moya Social
          </div>
          <div style={{ fontSize: 14, color: '#7a6a55' }}>
            Sign in to continue
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2b1f12', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1.5px solid #e3d6b6',
                background: '#f9f1e0',
                fontSize: 15,
                color: '#1e1810',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2b1f12', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1.5px solid #e3d6b6',
                background: '#f9f1e0',
                fontSize: 15,
                color: '#1e1810',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fbe8d3',
              border: '1px solid #d96c3b',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#d96c3b',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 12,
              border: 'none',
              background: loading ? '#cebd97' : '#d96c3b',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
