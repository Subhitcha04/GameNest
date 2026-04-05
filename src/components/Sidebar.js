import React from 'react';
import { User, Trophy, Gamepad2, LogOut, Home } from 'lucide-react';
import { loadStats } from '../utils/db';

const NAV = [
  { id: 'games',      icon: Gamepad2, label: 'Games' },
  { id: 'profile',    icon: User,     label: 'Profile' },
  { id: 'scoreboard', icon: Trophy,   label: 'Leaderboard' },
];

const Sidebar = ({ user, onLogout, onViewChange, activeView }) => {
  if (!user) return null;
  const stats = loadStats(user.username);

  return (
    <div className="fixed left-0 top-0 h-full flex flex-col z-50"
      style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-xl">🎮</span>
        <span className="font-black text-base gradient-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>GameNest</span>
      </div>

      {/* User */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff' }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.username}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>🔥 {stats.streak} day streak</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-bold" style={{ color: '#a78bfa' }}>{stats.gamesPlayed}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Played</div>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-bold" style={{ color: '#a78bfa' }}>{stats.totalScore}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => onViewChange(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeView === id ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(99,102,241,0.2))' : 'transparent',
              color: activeView === id ? 'var(--accent-light)' : 'var(--text-muted)',
              border: activeView === id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
