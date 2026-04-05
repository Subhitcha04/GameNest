import React from 'react';
<<<<<<< HEAD
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
=======
import { User, Trophy, GamepadIcon, LogOut } from 'lucide-react';

const Sidebar = ({ user, onLogout, onViewChange, activeView }) => {
  if (!user) return null; // Don't render sidebar if no user

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/30 backdrop-blur-sm shadow-lg z-50 flex flex-col">
      {/* User Quick Info */}
      <div className="p-6 border-b border-blue-200 flex items-center space-x-4">
        <img 
          src={user.avatar || `/api/placeholder/64/64`}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-blue-900">{user.username}</h3>
          <button
            onClick={() => onViewChange('profile')}
            className="text-blue-600 text-sm hover:underline"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="mt-4 space-y-2 px-6">
        <button 
          onClick={() => onViewChange('profile')} 
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'profile' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button 
          onClick={() => onViewChange('games')} 
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'games' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <GamepadIcon className="w-4 h-4" />
          <span>Games</span>
        </button>
        
        <button 
          onClick={() => onViewChange('scoreboard')}
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'scoreboard' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Scoreboard</span>
        </button>

        <button 
          onClick={onLogout} 
          className="w-full px-4 py-2 rounded-md text-left text-red-600 font-medium hover:bg-red-50 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
