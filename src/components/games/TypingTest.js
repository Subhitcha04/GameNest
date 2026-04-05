import React, { useState, useEffect, useRef } from 'react';

<<<<<<< HEAD
const QUOTES = [
  "My name is Professor. And I have a plan.",
  "We are not criminals. We are a team.",
  "Bella Ciao is more than just a song. It is a rebellion.",
  "Trust is like a mirror. You can fix it if it is broken.",
  "Every plan has a weakness. And every weakness has a solution.",
  "We are not robbers. We are survivors.",
  "In this game, the one who takes risks wins.",
  "Unity is our greatest weapon against the system.",
  "The heist begins when fear ends and courage takes over.",
  "We came for the money. We stayed for the dream.",
];

const MoneyHeistTypingTest = ({ onComplete }) => {
  const [quote, setQuote] = useState('');
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mode, setMode] = useState('quote'); // quote | time
  const startRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const newQuote = () => {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(q);
    setInput('');
    setStarted(false);
    setDone(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(60);
    clearInterval(timerRef.current);
    startRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => { newQuote(); }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const calcStats = (currentInput, elapsed) => {
    const words = currentInput.trim().split(/\s+/).length;
    const minutes = elapsed / 60;
    const w = minutes > 0 ? Math.round(words / minutes) : 0;

    let correct = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === quote[i]) correct++;
    }
    const acc = currentInput.length > 0 ? Math.round((correct / currentInput.length) * 100) : 100;
    return { wpm: w, accuracy: acc };
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started) {
      setStarted(true);
      startRef.current = Date.now();
      if (mode === 'time') {
        timerRef.current = setInterval(() => {
          setTimeLeft(t => {
            if (t <= 1) {
              clearInterval(timerRef.current);
              const elapsed = 60;
              const { wpm: w, accuracy: a } = calcStats(val, elapsed);
              setWpm(w); setAccuracy(a); setDone(true);
              onComplete && onComplete(w, { wpm: w, accuracy: a });
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      }
    }

    setInput(val);
    const elapsed = (Date.now() - startRef.current) / 1000;
    const { wpm: w, accuracy: a } = calcStats(val, elapsed);
    setWpm(w); setAccuracy(a);

    if (mode === 'quote' && val === quote) {
      clearInterval(timerRef.current);
      setDone(true);
      onComplete && onComplete(w, { wpm: w, accuracy: a, time: Math.round(elapsed) });
    }
  };

  const renderQuote = () => quote.split('').map((ch, i) => {
    let color = 'var(--text-muted)';
    if (i < input.length) color = input[i] === ch ? '#10b981' : '#ef4444';
    const isCursor = i === input.length;
    return (
      <span key={i} style={{ color, borderBottom: isCursor ? '2px solid #a78bfa' : 'none' }}>
        {ch}
      </span>
    );
  });

  const progress = mode === 'quote' ? (input.length / Math.max(quote.length, 1)) * 100
                                     : ((60 - timeLeft) / 60) * 100;

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-black gradient-text mb-2" style={{ fontFamily: 'Orbitron,sans-serif' }}>
        💰 Money Heist Typing
      </h1>

      {/* Mode */}
      <div className="flex gap-2 mb-5">
        {[['quote','📝 Quote Mode'],['time','⏱ 60 Second']].map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); newQuote(); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: mode === m ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
              color: mode === m ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {l}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 w-full max-w-2xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[['⚡ WPM', wpm, '#a78bfa'], ['🎯 Accuracy', `${accuracy}%`, '#34d399'], ['⏱ Time', mode === 'time' ? `${timeLeft}s` : `${Math.round((Date.now() - (startRef.current||Date.now()))/1000)}s`, '#fbbf24']].map(([l, v, c]) => (
            <div key={l} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              <div className="text-xl font-black" style={{ color: c }}>{v}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
        </div>

        {/* Quote display */}
        <div className="text-lg leading-relaxed mb-4 p-4 rounded-xl font-mono"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', minHeight: 80, letterSpacing: '0.02em' }}>
          {renderQuote()}
        </div>

        {/* Input */}
        <textarea ref={inputRef} value={input} onChange={handleChange} disabled={done}
          placeholder={done ? '' : 'Start typing the quote above...'}
          className="gn-input resize-none font-mono text-base"
          rows={3}
          style={{ opacity: done ? 0.5 : 1 }}
        />

        {/* Completed */}
        {done && (
          <div className="mt-4 py-4 px-5 rounded-xl text-center bounce-in"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-lg font-black" style={{ color: '#10b981' }}>🎉 Mission Accomplished!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {wpm} WPM · {accuracy}% accuracy
            </p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={newQuote} className="btn-neon px-6 py-2 text-sm">
            {done ? '🔄 New Quote' : '⏭ Skip'}
=======
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
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MoneyHeistTypingTest;
=======
export default MoneyHeistTypingTest;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
