<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  speed: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.5 + 0.2,
}));

const FEATURES = [
  { icon: '🎮', title: '10+ Mini Games', desc: 'From memory puzzles to typing races' },
  { icon: '🏆', title: 'Live Leaderboard', desc: 'Compete and climb the ranks' },
  { icon: '🔥', title: 'Daily Streaks', desc: 'Keep playing to maintain your streak' },
  { icon: '👤', title: 'Player Profiles', desc: 'Track your stats and favorites' },
];

const HomePage = ({ onGetStarted }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raf;
    const dots = PARTICLES.map(p => ({
      x: (p.x / 100) * canvas.width,
      y: (p.y / 100) * canvas.height,
      r: p.size,
      vy: p.speed * 0.3,
      opacity: p.opacity,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${d.opacity})`;
        ctx.fill();
        d.y -= d.vy;
        if (d.y < -10) d.y = canvas.height + 10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>GameNest</span>
        </div>
        <button onClick={onGetStarted} className="btn-neon text-sm">Sign In</button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
            <span>✨</span> Your Ultimate Gaming Hub
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="shimmer-text">Play. Compete.</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Dominate.</span>
          </h1>

          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-muted)' }}>
            Dive into a curated collection of themed mini-games. Track your progress,
            climb the leaderboard, and challenge your limits.
          </p>

          <button onClick={onGetStarted}
            className="btn-neon text-lg px-10 py-4 float"
            style={{ borderRadius: 50, letterSpacing: '0.08em' }}>
            Get Started →
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass glass-hover rounded-2xl p-5 text-center fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 text-center py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        GameNest © 2024 — Built for 5th Sem Project
      </footer>
    </div>
  );
};
=======
import React from 'react';

const HomePage = ({ onGetStarted }) => (
  <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
    <div className="absolute top-4 left-4 text-3xl font-bold text-blue-900">GameNest</div>
    <div className="text-center bg-white/30 backdrop-blur-sm p-12 rounded-xl shadow-lg">
      <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-6">
        Welcome to GameNest
      </h1>
      <p className="text-xl text-blue-900 mb-8 max-w-2xl mx-auto">
       Dive into a world of endless gaming fun! GameNest brings you a curated collection of engaging mini-games that challenge your skills, boost your reflexes, and provide hours of entertainment.
      </p>
      <button 
        onClick={onGetStarted}
        className="bg-red-500 text-blue-50 px-8 py-3 rounded-full text-xl hover:bg-red-600 transition-colors"
      >
        Get Started
      </button>
    </div>
  </div>
);
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919

export default HomePage;
