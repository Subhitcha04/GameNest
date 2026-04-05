<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useRef } from 'react';

const WORDS = [
  { word:'PIVOT',    hint:"Ross's moving furniture moment" },
  { word:'COFFEE',   hint:"Central Perk specialty" },
  { word:'LOBSTER',  hint:"Ross and Rachel's relationship status" },
  { word:'RACHEL',   hint:"The one with the fashion job" },
  { word:'MONICA',   hint:"Clean and competitive chef" },
  { word:'PHOEBE',   hint:"Singer of Smelly Cat" },
  { word:'CHANDLER', hint:"Could he BE any more sarcastic?" },
  { word:'ROSS',     hint:"On a BREAK paleontologist" },
  { word:'JOEY',     hint:"How you doin?" },
  { word:'CENTRAL',  hint:"The gang's favourite hangout place" },
  { word:'SMELLY',   hint:"___ Cat, the famous song" },
  { word:'HOLIDAY',  hint:"Armadillo visited during ___" },
];

const scramble = (w) => {
  let a = w.split('');
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const s = a.join('');
  return s === w ? scramble(w) : s;
};

const FriendsWordScramble = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [status, setStatus] = useState('playing'); // playing | over | win
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const order = useRef(WORDS.map((_, i) => i).sort(() => Math.random() - 0.5));

  const current = WORDS[order.current[index % order.current.length]];

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleWrong();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const loadWord = useCallback((i) => {
    const w = WORDS[order.current[i % order.current.length]];
    setScrambled(scramble(w.word));
    setInput('');
    setFeedback(null);
    startTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => { loadWord(0); return () => clearInterval(timerRef.current); }, []);

  const handleWrong = () => {
    setFeedback('wrong');
    setLives(l => {
      if (l <= 1) { setStatus('over'); clearInterval(timerRef.current); return 0; }
      return l - 1;
    });
    setTimeout(() => {
      setIndex(i => { loadWord(i + 1); return i + 1; });
    }, 800);
  };

  const submit = () => {
    if (status !== 'playing') return;
    const correct = input.trim().toUpperCase() === current.word;
    if (correct) {
      clearInterval(timerRef.current);
      setFeedback('correct');
      const pts = Math.max(10, 50 + timeLeft * 5);
      setScore(s => {
        const ns = s + pts;
        if (index + 1 >= WORDS.length) {
          setStatus('win');
          onComplete && onComplete(ns, { words: index + 1 });
        }
        return ns;
      });
      setTimeout(() => {
        setIndex(i => { loadWord(i + 1); return i + 1; });
      }, 700);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const restart = () => {
    order.current = WORDS.map((_,i) => i).sort(() => Math.random()-0.5);
    setIndex(0); setScore(0); setLives(3); setStatus('playing');
    loadWord(0);
  };

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-black gradient-text mb-4" style={{ fontFamily: 'Orbitron,sans-serif' }}>
        📝 Friends Word Scramble
      </h1>

      <div className="glass rounded-2xl p-6 w-full max-w-md">
        {/* Stats */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1">
            {Array.from({length:3}).map((_,i) => (
              <span key={i} className="text-xl" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: '#a78bfa' }}>{score}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: timeLeft <= 5 ? '#ef4444' : '#fbbf24' }}>{timeLeft}s</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Time</div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(timeLeft/20)*100}%`, background: timeLeft <= 5 ? '#ef4444' : 'linear-gradient(90deg,#7c3aed,#fbbf24)' }} />
        </div>

        {status === 'playing' && (
          <>
            {/* Scrambled */}
            <div className="text-center mb-2">
              <div className={`text-4xl font-black tracking-widest mb-1 transition-colors ${feedback === 'wrong' ? 'text-red-400' : feedback === 'correct' ? 'text-green-400' : 'text-white'}`}
                style={{ letterSpacing: '0.2em' }}>
                {scrambled}
              </div>
              <div className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                💡 {current.hint}
              </div>
            </div>

            {/* Progress */}
            <div className="text-xs text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              Word {Math.min(index + 1, WORDS.length)} of {WORDS.length}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input ref={inputRef} className="gn-input flex-1 text-center text-lg font-bold uppercase tracking-widest"
                value={input} onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Unscramble it!" maxLength={current?.word.length + 2} />
              <button onClick={submit} className="btn-neon px-4">✓</button>
            </div>
          </>
        )}

        {status === 'over' && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">😢</div>
            <h2 className="text-xl font-black" style={{ color: '#ef4444' }}>Game Over!</h2>
            <p className="text-lg mt-2" style={{ color: '#a78bfa' }}>Final score: {score}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Words solved: {index}</p>
            <button onClick={restart} className="btn-neon mt-4 px-8 py-2">Play Again</button>
          </div>
        )}

        {status === 'win' && (
          <div className="text-center py-6 bounce-in">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-black" style={{ color: '#10b981' }}>Amazing!</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All words solved!</p>
            <p className="text-lg font-bold mt-2" style={{ color: '#fbbf24' }}>Score: {score}</p>
            <button onClick={restart} className="btn-neon mt-4 px-8 py-2">Play Again</button>
          </div>
        )}
=======
import React, { useState, useEffect, useCallback } from 'react';

const FriendsWordScramble = () => {
  // Words related to Friends characters, catchphrases, and themes
  const wordList = [
    { word: 'PIVOT', hint: 'Moving furniture with Ross' },
    { word: 'HOWRU', hint: 'Chandler\'s classic greeting' },
    { word: 'COFFEE', hint: 'Central Perk\'s specialty' },
    { word: 'LOBSTER', hint: 'Ross and Rachel\'s relationship status' },
    { word: 'RACHEL', hint: 'The one with the fashion job' },
    { word: 'MONICA', hint: 'The clean and organized one' },
    { word: 'PHOEBE', hint: 'Quirky singer of "Smelly Cat"' },
    { word: 'CHANDLER', hint: 'Master of sarcastic jokes' },
    { word: 'ROSS', hint: 'Paleontologist dinosaur expert' },
    { word: 'JOEY', hint: '"How you doin\'?"' }
  ];

  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [gameStatus, setGameStatus] = useState('playing');

  // Scramble the letters of a word
  const scrambleWord = (word) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  // Initialize or reset the game
  const initializeGame = useCallback(() => {
    if (wordList.length === 0) {
      setGameStatus('lost');
      return;
    }

    const randomIndex = Math.floor(Math.random() * wordList.length);
    const randomWord = wordList[randomIndex];
    
    setCurrentWord(randomWord);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserGuess('');
    setGameStatus('playing');
    setAttempts(3);
  }, []);

  // Handle user guess submission
  const handleGuess = () => {
    if (!currentWord) return;

    if (userGuess.toUpperCase() === currentWord.word) {
      setScore(prev => prev + 1);
      initializeGame();
    } else {
      setAttempts(prev => prev - 1);
      
      if (attempts <= 1) {
        setGameStatus('lost');
      }
    }
  };

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle game status changes
  useEffect(() => {
    if (attempts === 0) {
      setGameStatus('lost');
    }
  }, [attempts]);

  // Render function with null checks
  const renderGame = () => {
    if (gameStatus === 'lost') {
      return (
        <div className="text-center">
          <h2 
            className="
              text-3xl mb-4 
              text-red-600 font-bold
            "
          >
            Game Over!
          </h2>
          <p className="text-xl mb-4">
            Your final score: {score}
          </p>
          <button
            onClick={initializeGame}
            className="
              bg-green-600 text-white 
              px-6 py-2 rounded-lg 
              hover:bg-green-700 
              transition-colors
            "
          >
            Play Again
          </button>
        </div>
      );
    }

    // Ensure currentWord is not null before rendering
    if (!currentWord) {
      return <div>Loading...</div>;
    }

    return (
      <>
        {/* Scrambled Word Display */}
        <div 
          className="
            text-3xl font-bold mb-6 
            tracking-widest text-blue-700
          "
        >
          {scrambledWord}
        </div>

        {/* Hint Display */}
        <div 
          className="
            italic text-gray-600 mb-4 
            text-lg px-4
          "
        >
          Hint: {currentWord.hint}
        </div>

        {/* Input Area */}
        <input 
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          className="
            w-full p-2 mb-4 
            border-2 border-purple-300 
            rounded-lg focus:outline-none 
            focus:border-purple-500
          "
          placeholder="Unscramble the word!"
        />

        {/* Attempts Remaining */}
        <div className="mb-4 text-gray-700">
          Attempts Remaining: {attempts}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleGuess}
          className="
            bg-purple-600 text-white 
            px-6 py-2 rounded-lg 
            hover:bg-purple-700 
            transition-colors
          "
        >
          Submit Guess
        </button>
      </>
    );
  };

  return (
    <div 
      className="
        min-h-screen bg-gradient-to-br 
        from-blue-100 to-purple-100 
        flex items-center justify-center 
        font-['Arial'] p-4
      "
    >
      <div 
        className="
          bg-white rounded-xl shadow-2xl 
          p-8 text-center max-w-md w-full
          border-4 border-yellow-400
        "
      >
        <h1 
          className="
            text-4xl mb-6 font-bold 
            text-transparent bg-clip-text 
            bg-gradient-to-r from-purple-600 to-pink-600
          "
        >
          Friends Word Scramble
        </h1>

        {renderGame()}

        {/* Score Display */}
        <div className="mt-4 text-gray-700">
          Score: {score}
        </div>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default FriendsWordScramble;
=======
export default FriendsWordScramble;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
