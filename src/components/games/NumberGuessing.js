import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD

const MODES = {
  EASY:   { label: '🌿 Hawkins Lab',    min:1, max:50,  guesses:10, color:'#3b82f6', bg:'#0a1628' },
  MEDIUM: { label: '🌀 Upside Down',   min:1, max:100, guesses:7,  color:'#8b5cf6', bg:'#160a28' },
  HARD:   { label: '💀 Demogorgon',    min:1, max:200, guesses:5,  color:'#ef4444', bg:'#280a0a' },
};

const StrangerNumberGame = ({ onComplete }) => {
  const [modeKey, setModeKey] = useState('EASY');
  const [secret, setSecret] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('idle');
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const mode = MODES[modeKey];
  const remaining = mode.guesses - history.length;

  const init = (key = modeKey) => {
    const m = MODES[key];
    setSecret(Math.floor(Math.random() * (m.max - m.min + 1)) + m.min);
    setInput('');
    setHistory([]);
    setStatus('playing');
    setTime(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  useEffect(() => { init(); }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const guess = () => {
    const n = parseInt(input);
    if (isNaN(n) || n < mode.min || n > mode.max) return;
    setInput('');

    const hint = n === secret ? 'correct' : n < secret ? 'too_low' : 'too_high';
    const entry = { n, hint, guessNum: history.length + 1 };
    const newHistory = [...history, entry];
    setHistory(newHistory);

    if (hint === 'correct') {
      clearInterval(timerRef.current);
      setStatus('won');
      const score = Math.max(10, 500 - (newHistory.length - 1) * 50 - time * 2);
      onComplete && onComplete(score, { guesses: newHistory.length, time });
    } else if (newHistory.length >= mode.guesses) {
      clearInterval(timerRef.current);
      setStatus('lost');
      onComplete && onComplete(0, { secret });
    }
  };

  const pct = secret > 0 ? ((secret - mode.min) / (mode.max - mode.min)) * 100 : 50;

  const HINT_STYLES = {
    correct: { icon: '✅', color: '#10b981', label: 'Correct!' },
    too_low: { icon: '⬆️', color: '#f59e0b', label: 'Too Low' },
    too_high: { icon: '⬇️', color: '#ef4444', label: 'Too High' },
  };

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: mode.bg }}>
      <h1 className="text-2xl font-black mb-2" style={{ color: mode.color, fontFamily: 'Orbitron,sans-serif', textShadow: `0 0 20px ${mode.color}66` }}>
        🔢 Stranger Things: Number Hunt
      </h1>

      {/* Mode selector */}
      <div className="flex gap-2 mb-5">
        {Object.entries(MODES).map(([k, m]) => (
          <button key={k} onClick={() => { setModeKey(k); init(k); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: modeKey === k ? m.color : 'rgba(255,255,255,0.06)',
              color: modeKey === k ? '#fff' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${modeKey === k ? m.color : 'rgba(255,255,255,0.15)'}`,
            }}>
            {m.label}
=======
import { RefreshCw, Clock, Star, Zap } from 'lucide-react';

const StrangerNumberGame = () => {
  // Game Difficulty Sets with Stranger Things References
  const GAME_MODES = {
    HAWKINS_EASY: {
      name: 'Hawkins Lab',
      description: 'Rookie Level',
      minNumber: 1,
      maxNumber: 50,
      maxGuesses: 10,
      backgroundImage: '/images/hawkins-lab.jpg',
      color: '#4A90E2'
    },
    UPSIDE_DOWN_MEDIUM: {
      name: 'Upside Down',
      description: 'Intermediate Challenge',
      minNumber: 1,
      maxNumber: 100,
      maxGuesses: 7,
      backgroundImage: '/images/upside-down.jpg',
      color: '#8E44AD'
    },
    DEMOGORGON_HARD: {
      name: 'Demogorgon Hunt',
      description: 'Extreme Difficulty',
      minNumber: 1,
      maxNumber: 200,
      maxGuesses: 5,
      backgroundImage: '/images/demogorgon.jpg',
      color: '#E74C3C'
    }
  };

  // State Management
  const [gameMode, setGameMode] = useState('HAWKINS_EASY');
  const [secretNumber, setSecretNumber] = useState(0);
  const [playerGuess, setPlayerGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('Enter your guess...');
  const [gameStatus, setGameStatus] = useState('READY');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Initialize Game
  const initializeGame = (selectedMode = gameMode) => {
    const mode = GAME_MODES[selectedMode];
    const randomNumber = Math.floor(
      Math.random() * (mode.maxNumber - mode.minNumber + 1) + mode.minNumber
    );

    setSecretNumber(randomNumber);
    setPlayerGuess('');
    setGuesses([]);
    setMessage('Enter your guess...');
    setGameStatus('PLAYING');
    setTimer(0);

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

  // Handle Guess Submission
  const handleGuess = () => {
    if (gameStatus !== 'PLAYING') return;

    const guess = parseInt(playerGuess);
    const mode = GAME_MODES[gameMode];

    // Validate guess
    if (isNaN(guess) || guess < mode.minNumber || guess > mode.maxNumber) {
      setMessage(`Please enter a number between ${mode.minNumber} and ${mode.maxNumber}`);
      return;
    }

    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setPlayerGuess('');

    if (guess === secretNumber) {
      setMessage('🎉 You cracked the code! Stranger things have happened...');
      setGameStatus('WON');
      clearInterval(timerRef.current);
    } else if (newGuesses.length >= mode.maxGuesses) {
      setMessage(`Game Over! The number was ${secretNumber}`);
      setGameStatus('LOST');
      clearInterval(timerRef.current);
    } else if (guess < secretNumber) {
      setMessage('🔬 Too low! Try a higher number...');
    } else {
      setMessage('🌀 Too high! Try a lower number...');
    }
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
        fontFamily: "'Stranger Things', sans-serif",
        backgroundImage: `url(${GAME_MODES[gameMode].backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Title Section */}
      <div className="text-center mb-6 bg-black/50 p-4 rounded-xl">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          Stranger Number Puzzle
        </h1>
        <p className="text-gray-300">
          Solve the mystery before the Demogorgon finds you!
        </p>
      </div>

      {/* Difficulty Selection Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xl">
        {Object.keys(GAME_MODES).map(mode => (
          <button
            key={mode}
            onClick={() => {
              setGameMode(mode);
              initializeGame(mode);
            }}
            className={`
              px-4 py-2 rounded-lg flex items-center justify-center space-x-2
              transition-all duration-300 relative overflow-hidden
              ${gameMode === mode 
                ? 'bg-red-600 text-white scale-110' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
            style={{
              backgroundImage: `url(${GAME_MODES[mode].backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex items-center space-x-2">
              {mode === 'HAWKINS_EASY' ? <Star /> :
               mode === 'UPSIDE_DOWN_MEDIUM' ? <Zap /> :
               <Clock />}
              <span>{GAME_MODES[mode].name}</span>
            </div>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
          </button>
        ))}
      </div>

<<<<<<< HEAD
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        {/* Info */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[['Range', `${mode.min}–${mode.max}`], ['Guesses Left', remaining], ['Time', `${time}s`]].map(([l, v]) => (
            <div key={l} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-lg font-black" style={{ color: mode.color }}>{v}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Secret number range visual */}
        {status !== 'idle' && history.length > 0 && (
          <div className="mb-4">
            <div className="h-2 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="absolute h-full w-1 rounded-full" style={{ left: `${pct}%`, background: mode.color, boxShadow: `0 0 8px ${mode.color}` }} />
              {/* narrowing hints */}
              {(() => {
                const lows  = history.filter(h => h.hint === 'too_low').map(h => h.n);
                const highs = history.filter(h => h.hint === 'too_high').map(h => h.n);
                const lo = lows.length ? Math.max(...lows) : mode.min;
                const hi = highs.length ? Math.min(...highs) : mode.max;
                const left = ((lo - mode.min) / (mode.max - mode.min)) * 100;
                const width = ((hi - lo) / (mode.max - mode.min)) * 100;
                return <div className="absolute h-full opacity-30 rounded-full" style={{ left: `${left}%`, width: `${width}%`, background: mode.color }} />;
              })()}
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span>{mode.min}</span><span>{mode.max}</span>
            </div>
          </div>
        )}

        {/* Status messages */}
        {status === 'won' && (
          <div className="py-3 rounded-xl text-center mb-4 bounce-in" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)' }}>
            <p className="font-black text-lg" style={{ color: '#10b981' }}>🎉 You found it: {secret}!</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>In {history.length} guess{history.length !== 1 ? 'es' : ''} · {time}s</p>
          </div>
        )}
        {status === 'lost' && (
          <div className="py-3 rounded-xl text-center mb-4 bounce-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <p className="font-black" style={{ color: '#ef4444' }}>💀 The Demogorgon wins! It was {secret}.</p>
          </div>
        )}

        {/* Input */}
        {status === 'playing' && (
          <div className="flex gap-2 mb-4">
            <input className="gn-input flex-1" type="number" placeholder={`Guess (${mode.min}–${mode.max})`}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guess()} />
            <button onClick={guess} className="btn-neon px-5">Go!</button>
          </div>
        )}

        {/* History */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...history].reverse().map((h, i) => {
            const hs = HINT_STYLES[h.hint];
            return (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl text-sm"
                style={{ background: `${hs.color}11`, border: `1px solid ${hs.color}33` }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Guess #{h.guessNum}: <strong>{h.n}</strong></span>
                <span style={{ color: hs.color }}>{hs.icon} {hs.label}</span>
              </div>
            );
          })}
        </div>

        <button onClick={() => init(modeKey)} className="btn-neon w-full mt-4 py-2">
          {status !== 'idle' ? '🔄 New Game' : '▶ Start'}
        </button>
      </div>
=======
      {/* Game Container */}
      <div 
        className="bg-gray-800/70 p-6 rounded-xl shadow-2xl backdrop-blur-sm w-full max-w-md"
      >
        {/* Game Message */}
        <div className="text-center mb-4">
          <p className="text-xl text-white">{message}</p>
        </div>

        {/* Input and Guess Button */}
        <div className="flex space-x-4 mb-4">
          <input 
            type="number" 
            value={playerGuess}
            onChange={(e) => setPlayerGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            className="flex-grow p-2 rounded bg-gray-700 text-white"
            placeholder="Enter your guess"
          />
          <button 
            onClick={handleGuess}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Guess
          </button>
        </div>

        {/* Guesses History */}
        <div className="mb-4">
          <p className="text-gray-300">
            Previous Guesses: {guesses.join(' | ')}
          </p>
          <p className="text-gray-300">
            Attempts Left: {GAME_MODES[gameMode].maxGuesses - guesses.length}
          </p>
        </div>

        {/* Game Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/70 p-2 rounded text-center">
            <span className="text-white">Time: {timer}s</span>
          </div>
          <button
            onClick={() => initializeGame()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center"
          >
            <RefreshCw className="mr-2" /> Reset Game
          </button>
        </div>
      </div>

      {/* Game Result */}
      {(gameStatus === 'WON' || gameStatus === 'LOST') && (
        <div className="mt-6 text-center bg-black/70 p-6 rounded-xl">
          <h2 className={`
            text-3xl font-bold 
            ${gameStatus === 'WON' ? 'text-green-500' : 'text-red-500'}
          `}>
            {gameStatus === 'WON' ? 'Mystery Solved!' : 'Game Over!'}
          </h2>
          <p className="text-gray-300">
            {gameStatus === 'WON' 
              ? `You guessed ${secretNumber} in ${guesses.length} attempts!` 
              : `The number was ${secretNumber}`}
          </p>
          <p className="text-gray-300">Time: {timer}s</p>
        </div>
      )}
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
    </div>
  );
};

<<<<<<< HEAD
export default StrangerNumberGame;
=======
export default StrangerNumberGame;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
