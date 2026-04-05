import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD

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
=======
import { RefreshCw, Clock, Star, Zap } from 'lucide-react';

const JokerMemoryGame = () => {
  // Joker-themed card sets with comic and movie references
  const CARD_SETS = {
    GOTHAM_CHAOS: {
      cards: [
        'BATMAN', 'HARLEY', 'RIDDLER', 'ARKHAM', 'JOKER', 
        'PENGUIN', 'TWOFACE', 'POISON', 'LAUGH', 'CHAOS'
      ],
      description: 'Gotham City Mayhem',
      difficulty: 1,
      color: '#6B21A8',
      backgroundImage: '/images/gotham.jpg'
    },
    DARK_KNIGHT: {
      cards: [
        'HEATH', 'PHOENIX', 'GOTHAM', 'ANARCHY', 'MADNESS', 
        'CRIME', 'SMILE', 'AGENT', 'CHAOS', 'DISCORD'
      ],
      description: 'Dark Knight Memories',
      difficulty: 2,
      color: '#DC2626',
      backgroundImage: '/images/dark-knight.jpg'
    },
    ULTIMATE_CHAOS: {
      cards: [
        'NIHILISM', 'PANDEMONIUM', 'DISRUPTION', 'SCHIZOID', 
        'PSYCHOSIS', 'BREAKDOWN', 'MAYHEM', 'LUNACY', 'CIRCUS', 'PANDORA'
      ],
      description: 'Absolute Chaos',
      difficulty: 3,
      color: '#1E40AF',
      backgroundImage: '/images/joker-chaos.jpg'
    }
  };

  // Game state management
  const [cardSet, setCardSet] = useState('GOTHAM_CHAOS');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStatus, setGameStatus] = useState('READY');
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Initialize game
  const initializeGame = (selectedCardSet = cardSet) => {
    const selectedSet = CARD_SETS[selectedCardSet].cards;
    
    // Duplicate cards and shuffle
    const shuffledCards = [...selectedSet, ...selectedSet]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        value: card,
        isFlipped: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameStatus('PLAYING');

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  // Initialize game on first render
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle card flip
  const handleCardFlip = (cardId) => {
    if (
      gameStatus !== 'PLAYING' || 
      flippedCards.length >= 2 || 
      matchedCards.some(card => card.id === cardId)
    ) return;

    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    );

    setCards(updatedCards);
    setFlippedCards([...flippedCards, cardId]);
    setMoves(prev => prev + 1);
  };

  // Check for card matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards.map(id => 
        cards.find(card => card.id === id)
      );

      setTimeout(() => {
        if (firstCard.value === secondCard.value) {
          // Match found
          setMatchedCards([...matchedCards, firstCard, secondCard]);
        } else {
          // No match, flip cards back
          const resetCards = cards.map(card => 
            flippedCards.includes(card.id) 
              ? { ...card, isFlipped: false } 
              : card
          );
          setCards(resetCards);
        }

        setFlippedCards([]);
      }, 1000);
    }

    // Check win condition
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameStatus('WON');
      clearInterval(timerRef.current);
    }
  }, [flippedCards]);

  // Card Design with Joker's Chaotic Style
  const CardComponent = ({ card, onFlip }) => {
    const cardStyles = {
      background: 'linear-gradient(135deg, #1A202C, #2D3748)',
      transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
      transition: 'transform 0.6s',
      backfaceVisibility: 'hidden',
      boxShadow: '0 10px 25px rgba(255,0,0,0.2)'
    };

    return (
      <div 
        className="relative w-full h-full perspective-1000 cursor-pointer group"
        onClick={() => onFlip(card.id)}
      >
        <div 
          className="absolute w-full h-full preserve-3d"
          style={cardStyles}
        >
          {/* Card Front (Hidden) */}
          <div 
            className="absolute w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              backgroundColor: card.isFlipped ? 'transparent' : '#1A202C',
              border: '2px solid #DC2626',
              backgroundImage: !card.isFlipped 
                ? 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, rgba(0,0,0,0.5) 100%)' 
                : 'none'
            }}
          >
            <span className="text-red-500 font-bold text-lg tracking-wider group-hover:scale-125 transition-transform">
              ?
            </span>
          </div>

          {/* Card Back (Revealed) */}
          <div 
            className="absolute w-full h-full bg-gray-900 rounded-lg flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              backgroundColor: '#2D3748',
              border: '2px solid #10B981',
              transform: card.isFlipped ? 'rotateY(0)' : 'rotateY(-180deg)',
            }}
          >
            <span className="text-green-400 font-bold text-2xl tracking-widest">
              {card.isFlipped ? card.value : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(45deg, #1A202C, #2C5282)',
        fontFamily: "'Comic Sans MS', cursive",
        backgroundImage: `url(${CARD_SETS[cardSet].backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Title Section */}
      <div className="text-center mb-6 bg-black/50 p-4 rounded-xl">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          Joker's Memory Mayhem
        </h1>
        <p className="text-gray-300">
          Chaos is a pure art form. Let's play!
        </p>
      </div>

      {/* Difficulty Selection with Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xl">
        {Object.keys(CARD_SETS).map(set => (
          <button
            key={set}
            onClick={() => {
              setCardSet(set);
              initializeGame(set);
            }}
            className={`
              px-4 py-2 rounded-lg flex items-center justify-center space-x-2
              transition-all duration-300 relative overflow-hidden
              ${cardSet === set 
                ? 'bg-red-600 text-white scale-110' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
            style={{
              backgroundImage: `url(${CARD_SETS[set].backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex items-center space-x-2">
              {set === 'GOTHAM_CHAOS' ? <Star /> :
               set === 'DARK_KNIGHT' ? <Zap /> :
               <Clock />}
              <span>{CARD_SETS[set].description}</span>
            </div>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
          </button>
        ))}
      </div>

<<<<<<< HEAD
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
=======
      {/* Game Grid with Responsive Layout */}
      <div 
        className="grid grid-cols-5 gap-4 bg-gray-800/70 p-6 rounded-xl shadow-2xl backdrop-blur-sm"
        style={{ width: '600px', height: '600px' }}
      >
        {cards.map(card => (
          <CardComponent 
            key={card.id} 
            card={card} 
            onFlip={handleCardFlip} 
          />
        ))}
      </div>

      {/* Game Info & Controls Grid */}
      <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-xl">
        <div className="bg-gray-800/70 p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="text-white text-xl">
            Moves: <span className="text-red-500">{moves}</span>
          </div>
        </div>
        <div className="bg-gray-800/70 p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="text-white text-xl">
            Time: <span className="text-green-500">{timer}s</span>
          </div>
        </div>
        <button
          onClick={() => initializeGame()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
        >
          <RefreshCw className="mr-2" /> Reset Game
        </button>
      </div>

      {/* Game Status */}
      {gameStatus === 'WON' && (
        <div className="mt-6 text-center bg-black/70 p-6 rounded-xl">
          <h2 className="text-3xl font-bold text-green-500">
            Chaos Conquered! 🃏
          </h2>
          <p className="text-gray-300">
            Moves: {moves} | Time: {timer}s
          </p>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default JokerMemoryGame;
=======
export default JokerMemoryGame;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
