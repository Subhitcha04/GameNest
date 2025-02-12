import React, { useState, useEffect, useRef } from 'react';
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
          </button>
        ))}
      </div>

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
    </div>
  );
};

export default StrangerNumberGame;