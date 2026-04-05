<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import axios from "axios";

const AuthUI = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const isTokenValid = (token) => typeof token === "string" && token.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    try {
      const url = isSignUp
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = isSignUp
        ? { username, emailOrPhone, password }
        : { username, password };

      const response = await axios.post(url, payload);

      if (!isSignUp) {
        const { token } = response.data;

        if (isTokenValid(token)) {
          localStorage.setItem("authToken", token);
          onLogin({ username, token });
        } else {
          setErrorMessage("Invalid token received!");
          return;
        }
      }

      setUsername("");
      setEmailOrPhone("");
      setPassword("");
      setErrorMessage("");
      setIsSignUp(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('./bluebg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
      }}
    >
      <style>
        {`
          .welcome-title {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 2rem;
            text-transform: uppercase;
            text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.4);
            animation: fadeSlideDown 2s ease-in-out, colorShift 3s ease-in-out infinite alternate;
          }

          @keyframes fadeSlideDown {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <h1 className="welcome-title">Welcome to GameNest</h1>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-10 bg-gray-200 rounded-full flex items-center">
            <div
              className={`absolute h-full w-1/2 bg-purple-600 rounded-full transition-transform ${
                isSignUp ? "translate-x-full" : "translate-x-0"
              }`}
            ></div>
            <button
              className={`w-1/2 text-center py-2 z-10 ${!isSignUp ? "text-white" : "text-gray-500"}`}
              onClick={() => { setIsSignUp(false); setErrorMessage(""); }}
            >
              Login
            </button>
            <button
              className={`w-1/2 text-center py-2 z-10 ${isSignUp ? "text-white" : "text-gray-500"}`}
              onClick={() => { setIsSignUp(true); setErrorMessage(""); }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </>
          )}

          {!isSignUp && (
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg focus:outline-none"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
      </div>
    </div>
  );
};

export default AuthUI;
