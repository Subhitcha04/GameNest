import React, { useState } from 'react';
import { games } from './games/gamesList';
import JokerMemoryGame from './games/MemoryGame';
import MoneyHeistTypingTest from './games/TypingTest';
import CorporateHangman from './games/Hangman';
import FriendsWordScramble from './games/WordScramble';
import RiverdaleticTacToe from './games/TicTacToe';
import StrangerNumberGame from './games/NumberGuessing';
import InsidiousWordGame from './games/wordguessing';
import SnakeGame from './games/ClassicSnake';
import QuizGame from './games/QuizGame';
import RockPaperScissors from './games/RockPaperScissors';
import { saveScore, updateStats, getHighScore } from '../utils/db';

const GAME_COMPONENTS = {
  memory:    JokerMemoryGame,
  typing:    MoneyHeistTypingTest,
  hangman:   CorporateHangman,
  scramble:  FriendsWordScramble,
  tictactoe: RiverdaleticTacToe,
  numguess:  StrangerNumberGame,
  wordguess: InsidiousWordGame,
  snake:     SnakeGame,
  quiz:      QuizGame,
  rps:       RockPaperScissors,
};

const DIFFICULTY_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const GameSelector = ({ user }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(games.map(g => g.category || 'Misc')))];

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
    setStartTime(Date.now());
  };

  const handleGoBack = () => {
    setSelectedGame(null);
    setStartTime(null);
  };

  const handleGameComplete = (score = 0, meta = {}) => {
    if (!user) return;
    const info = games.find(g => g.id === selectedGame);
    if (!info) return;
    saveScore(user.username, selectedGame, info.name, score, {
      ...meta,
      duration: startTime ? Math.round((Date.now() - startTime) / 1000) : 0,
    });
    updateStats(user.username, selectedGame, info.name, score);
  };

  if (selectedGame) {
    const GC = GAME_COMPONENTS[selectedGame];
    const info = games.find(g => g.id === selectedGame);
    return (
      <div className="relative min-h-screen fade-in">
        <div className="flex items-center gap-3 mb-4 px-1">
          <button onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            ← Back
          </button>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{info?.emoji} {info?.name}</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{info?.description}</p>
          </div>
          {user && (
            <div className="ml-auto badge badge-purple">
              Best: {getHighScore(user.username, selectedGame)}
            </div>
          )}
        </div>
        {GC ? <GC onComplete={handleGameComplete} onBack={handleGoBack} />
             : <div style={{ color: 'var(--text-muted)' }}>Game coming soon...</div>}
      </div>
    );
  }

  const filtered = filter === 'All' ? games : games.filter(g => (g.category || 'Misc') === filter);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text mb-1">Game Library</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a game and start playing</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: filter === c ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
              color: filter === c ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((game, i) => {
          const hs = user ? getHighScore(user.username, game.id) : 0;
          return (
            <div key={game.id} className="game-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => handleSelectGame(game.id)}>
              <div className="relative h-36 overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.95) 0%, transparent 60%)' }} />
                <div className="absolute top-2 right-2">
                  <span className="badge" style={{
                    background: `${DIFFICULTY_COLORS[game.difficulty] || '#7c3aed'}22`,
                    color: DIFFICULTY_COLORS[game.difficulty] || '#a78bfa',
                    border: `1px solid ${DIFFICULTY_COLORS[game.difficulty] || '#7c3aed'}44`,
                    fontSize: '0.65rem',
                  }}>{game.difficulty || 'Fun'}</span>
                </div>
                <div className="absolute bottom-2 left-3 text-2xl">{game.emoji}</div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{game.name}</h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{game.description}</p>
                <div className="flex items-center justify-between">
                  {hs > 0 && <span className="text-xs badge badge-orange">🏆 {hs}</span>}
                  <button className="btn-neon text-xs px-4 py-1.5 ml-auto">Play →</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameSelector;
