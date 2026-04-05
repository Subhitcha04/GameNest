import React, { useState, useEffect } from 'react';

<<<<<<< HEAD
const WORDS = [
  'DEMON','SPIRIT','HAUNTING','ASTRAL','PHANTOM',
  'SHADOW','DARKNESS','PARANORMAL','NIGHTMARE','POSSESSION',
];
const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const InsidiousWordGame = ({ onComplete }) => {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState(new Set());
  const [status, setStatus] = useState('playing');
  const [score, setScore] = useState(0);

  const wrongSet = new Set([...guessed].filter(l => !word.includes(l)));
  const wrongCount = wrongSet.size;

  const init = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    setGuessed(new Set());
    setStatus('playing');
  };

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (!word || status !== 'playing') return;
    const won = word.split('').every(l => guessed.has(l));
    if (won) {
      const pts = Math.max(10, 200 - wrongCount * 20);
      setScore(s => s + pts);
      setStatus('won');
      onComplete && onComplete(score + pts, { word, wrong: wrongCount });
    } else if (wrongCount >= MAX_WRONG) {
      setStatus('lost');
      onComplete && onComplete(score, { word });
    }
  }, [guessed]);

  const guess = (l) => {
    if (guessed.has(l) || status !== 'playing') return;
    setGuessed(prev => new Set([...prev, l]));
  };

  // SVG ghost drawing based on wrong count
  const GhostFace = ({ wrong }) => (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <svg viewBox="0 0 80 80" width="96" height="96">
        {/* Body */}
        <ellipse cx="40" cy="35" rx="22" ry="25" fill={wrong >= 1 ? '#6d28d9' : 'rgba(109,40,217,0.2)'} opacity={wrong >= 1 ? 0.8 : 0.3}/>
        {/* Tail */}
        {wrong >= 2 && <path d="M18 55 Q22 65 27 58 Q32 70 37 60 Q42 70 47 60 Q52 65 55 58 Q58 68 62 55" fill="none" stroke="#6d28d9" strokeWidth="2"/>}
        {/* Eyes */}
        <circle cx="33" cy="32" r={wrong >= 3 ? 4 : 2} fill="#ff0" opacity={wrong >= 3 ? 1 : 0.3}/>
        <circle cx="47" cy="32" r={wrong >= 3 ? 4 : 2} fill="#ff0" opacity={wrong >= 3 ? 1 : 0.3}/>
        {/* Mouth */}
        {wrong >= 4 && <path d="M33 42 Q40 48 47 42" stroke="#ff0" strokeWidth="2" fill="none"/>}
        {/* Aura */}
        {wrong >= 5 && <ellipse cx="40" cy="35" rx="26" ry="29" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>}
        {wrong >= 6 && <text x="28" y="16" fontSize="12" fill="#ef4444">BOO!</text>}
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: '#05000f' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/eerie.jpg')", backgroundSize: 'cover' }} />

      <h1 className="relative z-10 text-2xl font-black mb-4" style={{ color: '#dc2626', fontFamily: 'Orbitron,sans-serif', textShadow: '0 0 20px rgba(220,38,38,0.6)' }}>
        👻 Insidious Word Hunt
      </h1>

      <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-md" style={{ borderColor: 'rgba(109,40,217,0.4)' }}>
        {/* Ghost */}
        <GhostFace wrong={wrongCount} />

        {/* Lives */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({length: MAX_WRONG}).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < MAX_WRONG - wrongCount ? 1 : 0.15 }}>💀</span>
          ))}
        </div>

        {/* Word */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {word.split('').map((l, i) => (
            <div key={i} className="w-8 h-10 flex items-end justify-center pb-1 border-b-2"
              style={{ borderColor: guessed.has(l) ? '#a78bfa' : 'rgba(109,40,217,0.4)' }}>
              <span className="text-base font-black" style={{ color: guessed.has(l) ? '#a78bfa' : 'transparent', textShadow: '0 0 8px rgba(167,139,250,0.5)' }}>
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* Wrong */}
        {wrongSet.size > 0 && (
          <div className="text-center text-xs mb-3" style={{ color: '#ef4444' }}>
            Wrong: {[...wrongSet].join(', ')}
          </div>
        )}

        {/* Status */}
        {status === 'won' && (
          <div className="py-3 rounded-xl text-center mb-3 bounce-in" style={{ background: 'rgba(109,40,217,0.2)', border: '1px solid rgba(109,40,217,0.5)' }}>
            <p className="font-bold" style={{ color: '#a78bfa' }}>✨ You escaped the darkness!</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Score: {score}</p>
          </div>
        )}
        {status === 'lost' && (
          <div className="py-3 rounded-xl text-center mb-3 bounce-in" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)' }}>
            <p className="font-bold" style={{ color: '#ef4444' }}>💀 The spirits claimed you! It was: {word}</p>
          </div>
        )}

        {/* Keyboard */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {ALPHABET.map(l => (
            <button key={l} onClick={() => guess(l)}
              disabled={guessed.has(l) || status !== 'playing'}
              className={`key-btn ${guessed.has(l) ? (word.includes(l) ? 'correct' : 'wrong') : ''}`}
              style={{ fontFamily: 'monospace' }}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="badge badge-purple">Score: {score}</span>
          <button onClick={init} className="btn-neon text-xs px-4 py-2">
            {status !== 'playing' ? '👻 Play Again' : '🔄 New Word'}
          </button>
        </div>
=======
const InsidiousWordGame = () => {
  // Supernatural-themed words for the game
  const words = [
    'DEMON', 'SPIRIT', 'HAUNTING', 'ASTRAL',
    'POSSESSION', 'NIGHTMARE', 'DARKNESS',
    'PARANORMAL', 'PHANTOM', 'SHADOW',
  ];

  // Game State Variables
  const [selectedWord, setSelectedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameStatus, setGameStatus] = useState('playing'); // playing | won | lost
  const [wrongLetters, setWrongLetters] = useState(new Set());

  // Initialize the Game
  const initializeGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(randomWord);
    setGuessedLetters(new Set());
    setRemainingAttempts(6);
    setWrongLetters(new Set());
    setGameStatus('playing');
  };

  // Handle Letter Guess
  const handleLetterGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);

    if (selectedWord.includes(letter)) {
      setGuessedLetters(newGuessedLetters);
    } else {
      const newWrongLetters = new Set(wrongLetters);
      newWrongLetters.add(letter);
      setWrongLetters(newWrongLetters);
      setRemainingAttempts((prev) => prev - 1);
    }
  };

  // Check Game Status
  useEffect(() => {
    const wordCompleted = selectedWord
      .split('')
      .every((letter) => guessedLetters.has(letter));

    if (remainingAttempts === 0) {
      setGameStatus('lost');
    } else if (wordCompleted) {
      setGameStatus('won');
    }
  }, [guessedLetters, remainingAttempts, selectedWord]);

  // Render Word Display
  const renderWord = () =>
    selectedWord.split('').map((letter, index) => (
      <span
        key={index}
        className={`inline-block w-8 h-10 m-1 border-b-4 ${
          guessedLetters.has(letter)
            ? 'text-green-500 border-green-500'
            : 'text-gray-300 border-gray-500'
        }`}
      >
        {guessedLetters.has(letter) ? letter : '_'}
      </span>
    ));

  // Render Keyboard Buttons
  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map((letter) => (
      <button
        key={letter}
        onClick={() => handleLetterGuess(letter)}
        disabled={
          guessedLetters.has(letter) ||
          wrongLetters.has(letter) ||
          gameStatus !== 'playing'
        }
        className={`w-8 h-8 m-1 rounded text-white font-bold ${
          guessedLetters.has(letter)
            ? 'bg-green-600'
            : wrongLetters.has(letter)
            ? 'bg-red-600'
            : 'bg-gray-700 hover:bg-gray-600'
        } transition-colors`}
      >
        {letter}
      </button>
    ));
  };

  // Run the game initialization on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Background Effect */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/eerie.jpg')" }}
      />

      {/* Game Container */}
      <div className="relative z-10 bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-md w-full">
        {/* Game Title */}
        <h1 className="text-3xl font-bold mb-6 text-red-600">Insidious Word Hunt</h1>

        {/* Word Display */}
        <div className="mb-6 flex justify-center">{renderWord()}</div>

        {/* Game Status */}
        <div className="mb-4 text-lg">
          {gameStatus === 'playing' && (
            <p>Attempts Remaining: {remainingAttempts}</p>
          )}
          {gameStatus === 'won' && (
            <p className="text-green-500">You Escaped the Darkness!</p>
          )}
          {gameStatus === 'lost' && (
            <p className="text-red-500">The Spirits Claimed You...</p>
          )}
        </div>

        {/* Keyboard */}
        <div className="flex flex-wrap justify-center mb-6">{renderKeyboard()}</div>

        {/* Play Again / Restart Button */}
        <button
          onClick={initializeGame}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500 transition-colors"
        >
          {gameStatus !== 'playing' ? 'Play Again' : 'Restart'}
        </button>

        {/* Wrong Guesses */}
        {wrongLetters.size > 0 && (
          <div className="mt-4">
            <p>Wrong Guesses:</p>
            <div className="flex justify-center space-x-2">
              {[...wrongLetters].map((letter) => (
                <span key={letter} className="text-red-500">
                  {letter}
                </span>
              ))}
            </div>
          </div>
        )}
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
      </div>
    </div>
  );
};

export default InsidiousWordGame;
