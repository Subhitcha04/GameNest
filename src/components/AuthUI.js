import React, { useState } from 'react';
import { loadStats } from '../utils/db';

const AuthUI = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    if (!username.trim()) return 'Username is required.';
    if (username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (isSignUp && !email.trim()) return 'Email is required.';
    if (isSignUp && !/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);

    // Simulate network delay for demo purposes
    await new Promise(r => setTimeout(r, 600));

    try {
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const url = isSignUp ? `${API}/auth/signup` : `${API}/auth/login`;
      const payload = isSignUp ? { username: username.trim(), emailOrPhone: email.trim(), password }
                               : { username: username.trim(), password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token || 'local-token';
        localStorage.setItem('authToken', token);
        const stats = loadStats(username.trim());
        onLogin({ username: username.trim(), token, joinedAt: stats.joinedAt });
        return;
      }
    } catch (_) {
      // Backend not available — use local auth
    }

    // Local fallback: store users in localStorage
    const usersRaw = localStorage.getItem('gn_users') || '{}';
    const users = JSON.parse(usersRaw);

    if (isSignUp) {
      if (users[username.trim()]) { setError('Username already taken.'); setLoading(false); return; }
      users[username.trim()] = { password, email: email.trim(), joinedAt: new Date().toISOString() };
      localStorage.setItem('gn_users', JSON.stringify(users));
    } else {
      if (!users[username.trim()] || users[username.trim()].password !== password) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }
    }

    const token = `local-${Date.now()}`;
    localStorage.setItem('authToken', token);
    const stats = loadStats(username.trim());
    onLogin({ username: username.trim(), token, joinedAt: users[username.trim()]?.joinedAt || stats.joinedAt });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--bg-primary)' }}>
      {/* bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🎮</span>
          <h1 className="text-3xl font-black gradient-text mt-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>GameNest</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your ultimate gaming hub</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden mb-6 p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['Login', 'Sign Up'].map((label, i) => (
              <button key={label} onClick={() => { setIsSignUp(i === 1); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: (i === 0 ? !isSignUp : isSignUp) ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                  color: (i === 0 ? !isSignUp : isSignUp) ? '#fff' : 'var(--text-muted)',
                }}>
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Username</label>
              <input className="gn-input" placeholder="e.g. gamer_pro" value={username}
                onChange={e => setUsername(e.target.value)} autoComplete="username" />
            </div>

            {isSignUp && (
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input className="gn-input" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>
            )}

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input className="gn-input pr-10" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-neon w-full py-3 text-base" disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '...' : isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsSignUp(p => !p); setError(''); }}
              style={{ color: 'var(--accent-light)', textDecoration: 'underline' }}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        <button onClick={onBack} className="mt-4 text-sm w-full text-center" style={{ color: 'var(--text-muted)' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthUI;
