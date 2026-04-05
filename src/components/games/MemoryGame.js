import React, { useState, useEffect, useRef } from 'react';

const SETS = {
  GOTHAM: {
    label: '🦇 Gotham', bg: '#1a0a2e',
    cards: ['BATMAN','HARLEY','RIDDLER','ARKHAM','JOKER','PENGUIN','TWOFACE','POISON']
  },
  DARK_KNIGHT: {
    label: '🎭 Dark Knight', bg: '#1a0a0a',
    cards: ['HEATH','PHOENIX','GOTHAM','ANARCHY','MADNESS','CRIME','SMILE','AGENT']
  },
  CHAOS: {
    label: '🃏 Chaos', bg: '#0a0a1a',
    cards: ['NIHILISM','PANDEMON','DISRUPT','SCHIZOID','PSYCHO','BREAKDOWN','MAYHEM','LUNACY']
  }
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const JokerMemoryGame = ({ onComplete }) => {
  const [setKey, setSetKey] = useState('GOTHAM');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | playing | won
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  const init = (key = setKey) => {
    const base = SETS[key].cards;
    const shuffled = shuffle([...base, ...base]).map((v, i) => ({ id: i, value: v, flipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setStatus('playing');
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    lockRef.current = false;
  };

  useEffect(() => { init(); }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      clearInterval(timerRef.current);
      setStatus('won');
      const score = Math.max(0, 1000 - moves * 10 - time * 2);
      onComplete && onComplete(score, { moves, time });
    }
  }, [matched]);

  const flip = (id) => {
    if (lockRef.current || status !== 'playing') return;
    if (matched.includes(id) || flipped.includes(id)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, id];
    setFlipped(next);
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (next.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = next.map(fid => cards.find(c => c.id === fid));
      setTimeout(() => {
        if (a.value === b.value) {
          setMatched(m => [...m, a.id, b.id]);
        } else {
          setCards(cs => cs.map(c => next.includes(c.id) ? { ...c, flipped: false } : c));
        }
        setFlipped([]);
        lockRef.current = false;
      }, 900);
    }
  };

  const set = SETS[setKey];
  const totalPairs = cards.length / 2;
  const matchedPairs = matched.length / 2;

  return (
    <div className="flex flex-col items-center p-4 fade-in min-h-screen" style={{ background: set.bg }}>
      <h1 className="text-2xl font-black mb-2" style={{ color: '#dc2626', fontFamily: 'Orbitron,sans-serif', textShadow: '0 0 20px rgba(220,38,38,0.5)' }}>
        🃏 Joker's Memory Mayhem
      </h1>

      {/* Set selector */}
      <div className="flex gap-2 mb-4">
        {Object.entries(SETS).map(([k, v]) => (
          <button key={k} onClick={() => { setSetKey(k); init(k); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: setKey === k ? '#dc2626' : 'rgba(255,255,255,0.07)',
              color: setKey === k ? '#fff' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${setKey === k ? '#dc2626' : 'rgba(255,255,255,0.15)'}`,
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        {[['🃏 Pairs', `${matchedPairs}/${totalPairs}`], ['⚡ Moves', moves], ['⏱ Time', `${time}s`]].map(([l, v]) => (
          <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-lg font-black" style={{ color: '#dc2626' }}>{v}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</div>
          </div>
        ))}
        <button onClick={() => init()} className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}>
          🔄 Reset
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(matchedPairs / totalPairs) * 100}%`, background: 'linear-gradient(90deg,#dc2626,#7c3aed)' }} />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-3" style={{ maxWidth: 480 }}>
        {cards.map(card => {
          const isMatched = matched.includes(card.id);
          const isFlipped = card.flipped || isMatched;
          return (
            <div key={card.id}
              onClick={() => flip(card.id)}
              className="relative cursor-pointer select-none"
              style={{ width: 100, height: 80, perspective: 600 }}>
              <div className="absolute inset-0 transition-transform duration-500"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                {/* Front (hidden) */}
                <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1a0a2e,#2d0a3a)', border: '2px solid rgba(220,38,38,0.3)' }}>
                  <span className="text-2xl font-black" style={{ color: '#dc2626' }}>?</span>
                </div>
                {/* Back (revealed) */}
                <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                    background: isMatched ? 'linear-gradient(135deg,#065f46,#047857)' : 'linear-gradient(135deg,#1e3a5f,#1e40af)',
                    border: `2px solid ${isMatched ? '#10b981' : '#3b82f6'}` }}>
                  <span className="text-xs font-black text-center px-1" style={{ color: isMatched ? '#6ee7b7' : '#93c5fd', fontSize: '0.65rem' }}>
                    {card.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Win overlay */}
      {status === 'won' && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center glass rounded-3xl p-10 bounce-in">
            <div className="text-5xl mb-3">🃏</div>
            <h2 className="text-3xl font-black mb-2" style={{ color: '#10b981' }}>Chaos Conquered!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Moves: {moves} · Time: {time}s</p>
            <p className="text-lg font-bold mt-2" style={{ color: '#fbbf24' }}>
              Score: {Math.max(0, 1000 - moves * 10 - time * 2)}
            </p>
            <button onClick={() => init()} className="btn-neon mt-5 px-8 py-3">Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JokerMemoryGame;
