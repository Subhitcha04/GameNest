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
      </div>
    </div>
  );
};

export default FriendsWordScramble;