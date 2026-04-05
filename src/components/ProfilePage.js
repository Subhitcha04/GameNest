import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Trophy, Zap, Gamepad2, Calendar, Star } from 'lucide-react';
import { loadStats, saveDescription, getTopScores, getScoresByUser } from '../utils/db';
import { games } from './games/gamesList';

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass rounded-2xl p-4 text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-xl font-black" style={{ color }}>{value}</div>
    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
  </div>
);

const ProfilePage = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [desc, setDesc] = useState('');
  const [editing, setEditing] = useState(false);
  const [recentScores, setRecentScores] = useState([]);

  useEffect(() => {
    if (!user) return;
    const s = loadStats(user.username);
    setStats(s);
    setDesc(s.description || '');
    const scores = getScoresByUser(user.username).slice(-10).reverse();
    setRecentScores(scores);
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    saveDescription(user.username, desc.trim());
    setStats(prev => ({ ...prev, description: desc.trim() }));
    setEditing(false);
  };

  const getFavoriteGameName = () => {
    if (!stats?.favoriteGame) return 'None yet';
    const g = games.find(x => x.id === stats.favoriteGame);
    return g ? `${g.emoji} ${g.name}` : stats.favoriteGame;
  };

  const getBadge = () => {
    const gp = stats?.gamesPlayed || 0;
    if (gp >= 50) return { label: 'Legend', color: '#f59e0b', icon: '👑' };
    if (gp >= 20) return { label: 'Pro', color: '#a78bfa', icon: '⚡' };
    if (gp >= 5)  return { label: 'Regular', color: '#34d399', icon: '🎮' };
    return { label: 'Newcomer', color: '#94a3b8', icon: '🌱' };
  };

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  const badge = getBadge();
  const initial = user.username[0]?.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <h1 className="text-3xl font-black gradient-text mb-6">My Profile</h1>

      {/* Header card */}
      <div className="glass rounded-2xl p-6 mb-5 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{user.username}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge" style={{ background: `${badge.color}22`, color: badge.color, border: `1px solid ${badge.color}44`, fontSize: '0.7rem' }}>
              {badge.icon} {badge.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={11} className="inline mr-1" />
              Joined {new Date(stats.joinedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-base">🔥</span>
            <span className="text-sm font-bold" style={{ color: '#f97316' }}>{stats.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🎮" label="Games Played"  value={stats.gamesPlayed}   color="#a78bfa" />
        <StatCard icon="⭐" label="Total Score"   value={stats.totalScore}    color="#fbbf24" />
        <StatCard icon="🔥" label="Best Streak"   value={`${stats.streak}d`}  color="#f97316" />
        <StatCard icon="🏆" label="Fav Category"  value={(games.find(g=>g.id===stats.favoriteGame)?.category)||'—'} color="#34d399" />
      </div>

      {/* About Me */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>About Me</h3>
          {!editing
            ? <button onClick={() => setEditing(true)} style={{ color: 'var(--accent-light)' }} className="flex items-center gap-1 text-sm"><Edit2 size={14}/> Edit</button>
            : <div className="flex gap-2">
                <button onClick={handleSave} className="btn-neon text-xs px-3 py-1 flex items-center gap-1"><Save size={12}/> Save</button>
                <button onClick={() => { setEditing(false); setDesc(stats.description || ''); }}
                  className="text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={12}/> Cancel
                </button>
              </div>
          }
        </div>
        {editing
          ? <textarea className="gn-input resize-none h-24" maxLength={300}
              value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Tell other players about yourself..." />
          : <p className="text-sm" style={{ color: desc ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {desc || 'No description yet. Click Edit to add one!'}
            </p>
        }
      </div>

      {/* Favorite game */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>🏆 Favorite Game</h3>
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getFavoriteGameName()}</p>
      </div>

      {/* Recent activity */}
      {recentScores.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
          <div className="space-y-2">
            {recentScores.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.gameName}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                    {new Date(s.playedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="badge badge-purple">+{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
