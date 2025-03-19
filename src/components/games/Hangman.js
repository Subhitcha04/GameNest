import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Briefcase, TrendingUp, Award } from 'lucide-react';

const CorporateHangman = () => {
  // Corporate-themed word categories
  const WORD_CATEGORIES = {
    ENTRY_LEVEL: {
      words: [
        'INTERN', 'RESUME', 'MEETING', 'JUNIOR', 'STARTUP', 
        'NETWORK', 'MENTOR', 'TRAINING', 'ONBOARD', 'CAREER'
      ],
      description: 'Entry-Level Challenges',
      difficulty: 1,
      color: '#3B82F6'
    },
    MID_MANAGER: {
      words: [
        'STRATEGY', 'LEADERSHIP', 'WORKFLOW', 'PROJECT', 'BUDGET', 
        'DEADLINE', 'TEAMWORK', 'PROPOSAL', 'ANALYSIS', 'REPORT'
      ],
      description: 'Mid-Management Puzzles',
      difficulty: 2,
      color: '#10B981'
    },
    EXECUTIVE: {
      words: [
        'ACQUISITION', 'INNOVATION', 'SYNERGY', 'PORTFOLIO', 'ENTERPRISE', 
        'STAKEHOLDER', 'DISRUPTION', 'BENCHMARK', 'SCALABLE', 'PARADIGM'
      ],
      description: 'C-Suite Word Challenge',
      difficulty: 3,
      color: '#EF4444'
    }
  };

  // State management
  const [category, setCategory] = useState('ENTRY_LEVEL');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [gameStatus, setGameStatus] = useState('READY');
  const [score, setScore] = useState(0);

  // Initialize game
  const initializeGame = (selectedCategory) => {
    const categoryWords = WORD_CATEGORIES[selectedCategory].words;
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    setWord(randomWord);
    setGuessedLetters(new Set());
    setRemainingGuesses(6);
    setGameStatus('PLAYING');
  };

  // Handle letter guess
  const handleLetterGuess = (letter) => {
    if (gameStatus !== 'PLAYING' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      setRemainingGuesses(prev => prev - 1);
    }

    // Check win/lose conditions
    checkGameStatus(newGuessedLetters);
  };

  // Check game status
  const checkGameStatus = (currentGuessedLetters) => {
    const wordCompleted = word.split('').every(letter => 
      currentGuessedLetters.has(letter)
    );

    if (wordCompleted) {
      setGameStatus('WON');
      setScore(prev => prev + word.length);
    } else if (remainingGuesses <= 0) {
      setGameStatus('LOST');
    }
  };

  // Render word progress
  const renderWordProgress = () => {
    return word.split('').map((letter, index) => (
      <span 
        key={index} 
        className="mx-1 text-2xl font-bold text-white"
        style={{
          borderBottom: '3px solid white',
          minWidth: '30px',
          display: 'inline-block',
          textAlign: 'center'
        }}
      >
        {guessedLetters.has(letter) ? letter : '_'}
      </span>
    ));
  };

  // Corporate Office Hangman Visualization
  const CorporateHangmanDrawing = () => {
    const stages = [
      // Base
      <rect 
        key="base" 
        x="50" 
        y="290" 
        width="200" 
        height="10" 
        fill="#4B5563" 
      />,
      // Vertical pole
      <rect 
        key="pole" 
        x="100" 
        y="50" 
        width="10" 
        height="240" 
        fill="#6B7280" 
      />,
      // Top horizontal
      <rect 
        key="top" 
        x="100" 
        y="50" 
        width="100" 
        height="10" 
        fill="#9CA3AF" 
      />,
      // Rope
      <line 
        key="rope" 
        x1="200" 
        y1="60" 
        x2="200" 
        y2="100" 
        stroke="#D1D5DB" 
        strokeWidth="3" 
      />,
      // Head (Tie)
      <path 
        key="head" 
        d="M190,100 L210,100 L200,120 Z" 
        fill="#1F2937" 
      />,
      // Body (Suit)
      <rect 
        key="body" 
        x="195" 
        y="120" 
        width="10" 
        height="100" 
        fill="#374151" 
      />,
      // Arms and hanging details
      <path 
        key="arms" 
        d="M170,150 L230,150 M200,170 L180,200 M200,170 L220,200" 
        stroke="#6B7280" 
        strokeWidth="3" 
        fill="none" 
      />
    ];

    return stages.slice(0, 6 - remainingGuesses);
  };

  // Render keyboard
  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleLetterGuess(letter)}
            disabled={guessedLetters.has(letter) || gameStatus !== 'PLAYING'}
            className={`
              w-10 h-10 rounded-lg text-lg font-bold transition-all
              ${guessedLetters.has(letter) 
                ? (word.includes(letter) ? 'bg-green-500' : 'bg-red-500')
                : 'bg-gray-200 hover:bg-gray-300'}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  // Initial game setup
  useEffect(() => {
    initializeGame(category);
  }, [category]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1E3A8A, #075985)',
        fontFamily: "'Arial', sans-serif"
      }}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Corporate Ladder Hangman
        </h1>
        <p className="text-gray-200">
          Climb the corporate word ladder, one letter at a time!
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex space-x-4 mb-6">
        {Object.keys(WORD_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              transition-all duration-300
              ${category === cat 
                ? 'bg-white text-blue-800 scale-110' 
                : 'bg-gray-700 text-white hover:bg-gray-600'}
            `}
          >
            {category === cat && (
              category === 'ENTRY_LEVEL' ? <Briefcase /> :
              category === 'MID_MANAGER' ? <TrendingUp /> :
              <Award />
            )}
            <span>{WORD_CATEGORIES[cat].description}</span>
          </button>
        ))}
      </div>

      {/* Game Area */}
      <div 
        className="bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col items-center"
        style={{ minWidth: '500px' }}
      >
        {/* Hangman SVG */}
        <svg width="300" height="300" className="mb-6">
          {CorporateHangmanDrawing()}
        </svg>

        {/* Word Progress */}
        <div className="mb-6 flex justify-center">
          {renderWordProgress()}
        </div>

        {/* Game Status */}
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-white">
            Remaining Attempts: {remainingGuesses}
          </p>
          {gameStatus === 'WON' && (
            <p className="text-green-400 font-bold">
              Congratulations! You've climbed the corporate ladder! 🏆
            </p>
          )}
          {gameStatus === 'LOST' && (
            <p className="text-red-400 font-bold">
              Game Over! The word was: {word}
            </p>
          )}
        </div>

        {/* Keyboard */}
        {renderKeyboard()}

        {/* Game Control Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => initializeGame(category)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            
          >
            <RefreshCw className="mr-2" /> Reset Game
          </button>
        </div>
      </div>

      {/* Score Display */}
      <div className="mt-4 text-white text-xl">
        Total Score: {score}
      </div>
    </div>
  );
};

export default CorporateHangman;