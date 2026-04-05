import React, { useState, useEffect } from 'react';

const CATEGORIES = {
  ENTRY_LEVEL: { label: '🌱 Entry', words: ['INTERN','RESUME','MEETING','JUNIOR','STARTUP','NETWORK','MENTOR','TRAINING','ONBOARD','CAREER'], color: '#10b981' },
  MID_MANAGER: { label: '💼 Manager', words: ['STRATEGY','LEADERSHIP','WORKFLOW','PROJECT','BUDGET','DEADLINE','TEAMWORK','PROPOSAL','ANALYSIS','REPORT'], color: '#f59e0b' },
  EXECUTIVE:   { label: '🏆 Executive', words: ['ACQUISITION','INNOVATION','SYNERGY','PORTFOLIO','ENTERPRISE','STAKEHOLDER','DISRUPTION','BENCHMARK','SCALABLE','PARADIGM'], color: '#ef4444' },
};

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const HangmanSVG = ({ wrong }) => {
  const parts = [
    <line key="head-top" x1="60" y1="20" x2="60" y2="0" stroke="currentColor" strokeWidth="3"/>,
    <circle key="head" cx="60" cy="30" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>,
    <line key="body" x1="60" y1="40" x2="60" y2="80" stroke="currentColor" strokeWidth="3"/>,
    <line key="larm" x1="60" y1="50" x2="40" y2="65" stroke="currentColor" strokeWidth="3"/>,
    <line key="rarm" x1="60" y1="50" x2="80" y2="65" stroke="currentColor" strokeWidth="3"/>,
    <line key="lleg" x1="60" y1="80" x2="40" y2="105" stroke="currentColor" strokeWidth="3"/>,
    <line key="rleg" x1="60" y1="80" x2="80" y2="105" stroke="currentColor" strokeWidth="3"/>,
  ];
  return (
    <svg width="120" height="130" style={{ color: '#ef4444' }}>
      {/* Gallows */}
      <line x1="10" y1="125" x2="110" y2="125" stroke="#64748b" strokeWidth="3"/>
      <line x1="30" y1="125" x2="30" y2="5" stroke="#64748b" strokeWidth="3"/>
      <line x1="30" y1="5" x2="60" y2="5" stroke="#64748b" strokeWidth="3"/>
      <line x1="60" y1="5" x2="60" y2="20" stroke="#64748b" strokeWidth="3"/>
      {parts.slice(0, wrong)}
    </svg>
  );
};

const CorporateHangman = ({ onComplete }) => {
  const [catKey, setCatKey] = useState('ENTRY_LEVEL');
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState(new Set());
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);

  const wrongLetters = [...guessed].filter(l => !word.includes(l));
  const wrongCount = wrongLetters.length;
  const revealed = word.split('').every(l => guessed.has(l));

  const init = (key = catKey) => {
    const words = CATEGORIES[key].words;
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setGuessed(new Set());
    setStatus('playing');
  };

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (status !== 'playing' || !word) return;
    if (revealed) {
      const pts = Math.max(10, 100 - wrongCount * 10);
      setScore(s => s + pts);
      setStatus('won');
      onComplete && onComplete(score + pts, { word });
    } else if (wrongCount >= MAX_WRONG) {
      setStatus('lost');
      onComplete && onComplete(score, { word });
    }
  }, [guessed]);

  const guess = (l) => {
    if (status !== 'playing' || guessed.has(l)) return;
    setGuessed(prev => new Set([...prev, l]));
  };

  const cat = CATEGORIES[catKey];

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-black gradient-text mb-4" style={{ fontFamily: 'Orbitron,sans-serif' }}>
        🏢 Corporate Hangman
      </h1>

      {/* Category */}
      <div className="flex gap-2 mb-6">
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => { setCatKey(k); init(k); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: catKey === k ? v.color : 'var(--bg-card)',
              color: catKey === k ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${catKey === k ? v.color : 'var(--border)'}`,
            }}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 w-full max-w-lg">
        {/* Hangman drawing */}
        <div className="flex justify-center mb-4">
          <HangmanSVG wrong={wrongCount} />
        </div>

        {/* Lives */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: MAX_WRONG }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < MAX_WRONG - wrongCount ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>

        {/* Word display */}
        <div className="flex justify-center gap-2 mb-2 flex-wrap">
          {word.split('').map((l, i) => (
            <div key={i} className="w-9 h-10 flex items-end justify-center pb-1 border-b-2"
              style={{ borderColor: cat.color }}>
              <span className="text-lg font-black" style={{ color: guessed.has(l) ? cat.color : 'transparent' }}>
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* Wrong letters */}
        {wrongLetters.length > 0 && (
          <p className="text-center text-sm mb-4" style={{ color: '#ef4444' }}>
            Wrong: {wrongLetters.join(', ')}
          </p>
        )}

        {/* Status */}
        {status === 'won' && (
          <div className="text-center py-3 rounded-xl mb-4 bounce-in" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="font-bold" style={{ color: '#10b981' }}>🎉 Promoted! You got it!</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Score: {score}</p>
          </div>
        )}
        {status === 'lost' && (
          <div className="text-center py-3 rounded-xl mb-4 bounce-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <p className="font-bold" style={{ color: '#ef4444' }}>💼 You're fired! The word was: {word}</p>
          </div>
        )}

        {/* Keyboard */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {ALPHABET.map(l => (
            <button key={l} onClick={() => guess(l)} disabled={guessed.has(l) || status !== 'playing'}
              className={`key-btn ${guessed.has(l) ? (word.includes(l) ? 'correct' : 'wrong') : ''}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="badge badge-purple">Score: {score}</span>
          <button onClick={() => init()} className="btn-neon text-xs px-4 py-2">New Word</button>
        </div>
      </div>
    </div>
  );
};

export default CorporateHangman;
