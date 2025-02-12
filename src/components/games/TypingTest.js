import React, { useState, useEffect, useRef } from 'react';

const MoneyHeistTypingTest = () => {
  // Money Heist-themed quotes
  const quotes = [
    "My name is Professor. And I have a plan.",
    "We are not criminals. We are a team.",
    "Bella Ciao is more than just a song. It's a rebellion.",
    "Trust is like a mirror. You can fix it if it's broken.",
    "Every plan has a weakness. And every weakness has a solution.",
    "We are not robbers. We are survivors.",
    "In this game, the one who takes risks wins.",
    "Unity is our greatest weapon."
  ];

  const [quote, setQuote] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const inputRef = useRef(null);

  // Start game setup
  const startGame = () => {
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(selectedQuote);
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    inputRef.current.focus();
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const currentInput = e.target.value;
    
    // Start timer on first character
    if (!startTime) {
      setStartTime(new Date());
    }

    setInput(currentInput);

    // Check if completed
    if (currentInput === quote) {
      const end = new Date();
      setEndTime(end);

      // Calculate WPM
      const minutes = (end - startTime) / 60000;
      const words = quote.split(' ').length;
      const calculatedWpm = Math.round(words / minutes);
      setWpm(calculatedWpm);

      // Calculate Accuracy
      const calculatedAccuracy = Math.round((quote.length / currentInput.length) * 100);
      setAccuracy(calculatedAccuracy);
    }
  };

  // Render character with color coding
  const renderCharacter = (quoteChar, inputChar, index) => {
    if (index < input.length) {
      return quoteChar === inputChar 
        ? 'text-green-500' 
        : 'text-red-500';
    }
    return 'text-gray-400';
  };

  // Render quote with character coloring
  const renderQuote = () => {
    return quote.split('').map((char, index) => (
      <span 
        key={index} 
        className={`transition-colors duration-100 ${renderCharacter(char, input[index], index)}`}
      >
        {char}
      </span>
    ));
  };

  // Initialize game on component mount
  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Money Heist Typing Challenge
        </h1>

        {/* Quote Display */}
        <div 
          className="mb-4 text-xl text-center p-4 bg-gray-800 rounded-lg min-h-[100px] flex items-center justify-center"
        >
          {renderQuote()}
        </div>

        {/* Input Area */}
        <input 
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Start typing the quote..."
          disabled={endTime}
        />

        {/* Results Area */}
        {endTime && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl mb-2 text-green-500">Mission Accomplished!</h2>
            <div className="flex justify-between">
              <div>
                <p>Words Per Minute:</p>
                <p className="text-2xl font-bold text-yellow-500">{wpm}</p>
              </div>
              <div>
                <p>Accuracy:</p>
                <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="mt-4 flex space-x-4 justify-center">
          <button 
            onClick={startGame}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoneyHeistTypingTest;