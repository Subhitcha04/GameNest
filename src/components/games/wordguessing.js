import React, { useState, useEffect } from 'react';

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
      </div>
    </div>
  );
};

export default InsidiousWordGame;
