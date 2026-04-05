import React, { useState, useEffect } from 'react';

const CHOICES = [
  { id: 'fan',     label: 'Elegant Fan',    emoji: '🪁', beats: 'letter',  desc: 'A lady\'s subtle weapon' },
  { id: 'letter',  label: 'Love Letter',    emoji: '💌', beats: 'scandal', desc: 'Changes destinies' },
  { id: 'scandal', label: 'Gossip Scandal', emoji: '🗯️', beats: 'fan',    desc: 'Destroys reputations' },
];

const RESULTS = {
  win:  { label: 'You Win!',   emoji: '🎉', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  lose: { label: 'You Lose!',  emoji: '😔', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  tie:  { label: "It's a Tie", emoji: '🤝', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
};

const RockPaperScissors = ({ onComplete }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ win: 0, lose: 0, tie: 0 });
  const [totalScore, setTotalScore] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [rounds, setRounds] = useState(0);

  const play = (choice) => {
    if (animating) return;
    setAnimating(true);
    setPlayerChoice(choice);
    setCpuChoice(null);
    setResult(null);

    setTimeout(() => {
      const cpu = CHOICES[Math.floor(Math.random() * 3)];
      setCpuChoice(cpu);

      const player = CHOICES.find(c => c.id === choice);
      let r;
      if (player.id === cpu.id) r = 'tie';
      else if (player.beats === cpu.id) r = 'win';
      else r = 'lose';

      setResult(r);
      setScore(s => ({ ...s, [r]: s[r] + 1 }));
      const newRounds = rounds + 1;
      setRounds(newRounds);

      if (r === 'win') {
        const pts = 50;
        setTotalScore(t => {
          const ns = t + pts;
          if (newRounds >= 5) onComplete && onComplete(ns, { wins: score.win + 1, rounds: newRounds });
          return ns;
        });
      }

      setAnimating(false);
    }, 600);
  };

  const reset = () => {
    setPlayerChoice(null); setCpuChoice(null); setResult(null);
    setScore({ win:0, lose:0, tie:0 }); setTotalScore(0); setRounds(0);
  };

  const playerInfo = CHOICES.find(c => c.id === playerChoice);
  const cpuInfo = cpuChoice;
  const res = result ? RESULTS[result] : null;

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: 'linear-gradient(135deg,#1a0a0f,#0f0a1a)' }}>
      <h1 className="text-2xl font-black mb-1 text-center" style={{ color: '#f9a8d4', fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(249,168,212,0.4)' }}>
        🪶 Bridgerton Society Duel
      </h1>
      <p className="text-sm mb-5" style={{ color: 'rgba(249,168,212,0.5)', fontStyle: 'italic' }}>
        "A game of wit, charm, and subtlety"
      </p>

      {/* Score */}
      <div className="flex gap-4 mb-6">
        {[['🏆 Wins', score.win, '#10b981'], ['💔 Losses', score.lose, '#ef4444'], ['🤝 Ties', score.tie, '#f59e0b'], ['⭐ Points', totalScore, '#f9a8d4']].map(([l, v, c]) => (
          <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,168,212,0.15)' }}>
            <div className="text-xl font-black" style={{ color: c }}>{v}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Battle arena */}
      {(playerChoice || result) && (
        <div className="flex items-center justify-center gap-8 mb-6 w-full max-w-lg">
          {/* Player */}
          <div className="text-center flex-1">
            <div className="text-5xl mb-2 transition-all" style={{ filter: 'drop-shadow(0 0 12px rgba(249,168,212,0.6))' }}>
              {playerInfo?.emoji || '❓'}
            </div>
            <div className="text-sm font-bold" style={{ color: '#f9a8d4' }}>{playerInfo?.label || '...'}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>You</div>
          </div>

          <div className="text-2xl font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>VS</div>

          {/* CPU */}
          <div className="text-center flex-1">
            <div className="text-5xl mb-2" style={{ filter: animating ? 'blur(4px)' : 'none', transition: 'filter 0.3s' }}>
              {cpuInfo?.emoji || '🎭'}
            </div>
            <div className="text-sm font-bold" style={{ color: '#a78bfa' }}>{cpuInfo?.label || '...'}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Society</div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && res && (
        <div className="py-3 px-8 rounded-2xl mb-5 text-center bounce-in"
          style={{ background: res.bg, border: `1px solid ${res.color}44` }}>
          <span className="text-2xl">{res.emoji}</span>
          <span className="text-lg font-black ml-2" style={{ color: res.color }}>{res.label}</span>
        </div>
      )}

      {/* Choices */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {CHOICES.map(c => (
          <button key={c.id} onClick={() => play(c.id)} disabled={animating}
            className="flex flex-col items-center p-5 rounded-2xl transition-all"
            style={{
              background: playerChoice === c.id ? 'rgba(249,168,212,0.15)' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${playerChoice === c.id ? '#f9a8d4' : 'rgba(249,168,212,0.2)'}`,
              cursor: animating ? 'not-allowed' : 'pointer',
              transform: animating ? 'none' : undefined,
              minWidth: 110,
            }}
            onMouseEnter={e => { if (!animating) e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
            <span className="text-4xl mb-2">{c.emoji}</span>
            <span className="text-xs font-bold text-center" style={{ color: '#f9a8d4' }}>{c.label}</span>
            <span className="text-xs mt-1 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.desc}</span>
          </button>
        ))}
      </div>

      {/* Rules */}
      <div className="glass rounded-xl p-3 text-xs text-center mb-4 max-w-sm" style={{ borderColor: 'rgba(249,168,212,0.2)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>
          Fan beats Scandal · Letter beats Fan · Scandal beats Letter
        </p>
      </div>

      <button onClick={reset} className="px-6 py-2 rounded-xl text-sm font-medium"
        style={{ background: 'rgba(249,168,212,0.1)', border: '1px solid rgba(249,168,212,0.3)', color: '#f9a8d4' }}>
        🔄 Reset Match
      </button>
    </div>
  );
};

export default RockPaperScissors;
