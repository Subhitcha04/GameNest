import React, { useState, useEffect } from 'react';
import { getTopScores, loadAllScores } from '../utils/db';
import { games } from './games/gamesList';

const MEDALS = ['🥇', '🥈', '🥉'];

const Scoreboard = ({ user }) => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const top = getTopScores(selectedGame === 'all' ? null : selectedGame, 20);
    setEntries(top);
  }, [selectedGame]);

  const gameOptions = [{ id: 'all', name: 'All Games', emoji: '🏆' }, ...games];

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <h1 className="text-3xl font-black gradient-text mb-2">Leaderboard</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Top scores across all games</p>

      {/* Game filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {gameOptions.map(g => (
          <button key={g.id} onClick={() => setSelectedGame(g.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: selectedGame === g.id ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
              color: selectedGame === g.id ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {g.emoji} {g.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-bold uppercase tracking-wider"
          style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <div className="col-span-1">#</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-4">Game</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {entries.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No scores yet!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Play some games to appear here.</p>
          </div>
        ) : (
          entries.map((e, i) => {
            const isMe = user && e.username === user.username;
            const gameInfo = games.find(g => g.id === e.gameId);
            return (
              <div key={`${e.username}-${e.gameId}`}
                className="grid grid-cols-12 px-5 py-3 items-center transition-colors"
                style={{
                  borderBottom: i < entries.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none',
                  background: isMe ? 'rgba(124,58,237,0.08)' : 'transparent',
                }}>
                <div className="col-span-1 text-lg font-bold">
                  {i < 3 ? MEDALS[i] : <span style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
                </div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff' }}>
                      {e.username[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: isMe ? '#a78bfa' : 'var(--text-primary)' }}>
                      {e.username}{isMe && ' (You)'}
                    </span>
                  </div>
                </div>
                <div className="col-span-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {gameInfo ? `${gameInfo.emoji} ${gameInfo.name}` : e.gameName}
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-base font-black" style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--text-primary)' }}>
                    {e.score.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {entries.length > 0 && (
        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          Showing top {entries.length} all-time best scores per player per game
        </p>
      )}
    </div>
  );
};

export default Scoreboard;
