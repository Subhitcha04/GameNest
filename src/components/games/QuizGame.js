import React, { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  { q: "What is the main character's number in Squid Game?", opts: ['001','199','456','067'], ans: 2, pts: 100 },
  { q: "Which game is played FIRST in Squid Game?", opts: ['Tug of War','Red Light Green Light','Honeycomb','Marbles'], ans: 1, pts: 100 },
  { q: "What is the total prize money in Squid Game?", opts: ['₩38.5 billion','₩45.6 billion','₩55.7 billion','₩33.4 billion'], ans: 1, pts: 200 },
  { q: "Who is the mysterious old man (Player 001)?", opts: ['The Front Man','Sang-woo','Oh Il-nam','Jun-ho'], ans: 2, pts: 200 },
  { q: "What shape does Gi-hun choose in the Honeycomb game?", opts: ['Circle','Triangle','Star','Umbrella'], ans: 3, pts: 300 },
  { q: "What colour suit do the guards wear?", opts: ['Red','Black','Pink','White'], ans: 2, pts: 200 },
  { q: "Which game involves choosing a partner?", opts: ['Glass Bridge','Tug of War','Marbles','Red Light Green Light'], ans: 2, pts: 300 },
  { q: "Who is Player 067?", opts: ['Ali','Sae-byeok','Ji-yeong','Mi-nyeo'], ans: 1, pts: 400 },
];

const QuizGame = ({ onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState('playing'); // playing | over | win
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef(null);

  const current = QUESTIONS[qIndex];

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [qIndex]);

  const handleAnswer = (idx) => {
    clearInterval(timerRef.current);
    setSelected(idx);
    const correct = idx === current.ans;

    setTimeout(() => {
      if (correct) {
        const bonus = streak >= 2 ? Math.floor(current.pts * 0.5) : 0;
        const pts = current.pts + Math.round(timeLeft * 5) + bonus;
        setScore(s => s + pts);
        setStreak(s => s + 1);
        if (qIndex + 1 >= QUESTIONS.length) {
          setStatus('win');
          onComplete && onComplete(score + pts, { questions: QUESTIONS.length });
        } else {
          setQIndex(i => i + 1);
          setSelected(null);
        }
      } else {
        setStreak(0);
        setLives(l => {
          if (l <= 1) {
            setStatus('over');
            onComplete && onComplete(score, { reached: qIndex });
            return 0;
          }
          return l - 1;
        });
        if (lives > 1) {
          if (qIndex + 1 >= QUESTIONS.length) {
            setStatus('win');
          } else {
            setQIndex(i => i + 1);
            setSelected(null);
          }
        }
      }
    }, 1000);
  };

  const restart = () => {
    setQIndex(0); setSelected(null); setScore(0); setLives(3);
    setStatus('playing'); setStreak(0);
  };

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: '#0a0a0a' }}>
      <h1 className="text-2xl font-black mb-2" style={{ color: '#ef4444', fontFamily: 'Orbitron,sans-serif', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>
        🦑 Squid Game Quiz
      </h1>

      {status === 'playing' && current && (
        <div className="glass rounded-2xl p-6 w-full max-w-xl fade-in">
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {Array.from({length:3}).map((_,i) => (
                <span key={i} className="text-base" style={{ opacity: i < lives ? 1 : 0.15 }}>❤️</span>
              ))}
            </div>
            <div className="text-xs font-bold" style={{ color: '#ef4444' }}>
              Q {qIndex + 1}/{QUESTIONS.length}
            </div>
            <div className="flex items-center gap-2">
              {streak >= 2 && <span className="badge badge-orange">🔥 x{streak} streak</span>}
              <span className="badge badge-purple">+{score}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(timeLeft/15)*100}%`, background: timeLeft <= 5 ? '#ef4444' : 'linear-gradient(90deg,#ef4444,#f59e0b)' }} />
          </div>
          <div className="text-right text-xs mb-4" style={{ color: timeLeft <= 5 ? '#ef4444' : 'var(--text-muted)' }}>
            {timeLeft}s
          </div>

          {/* Question */}
          <p className="text-lg font-bold mb-5 text-center" style={{ color: 'var(--text-primary)', minHeight: 56 }}>
            {current.q}
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {current.opts.map((opt, i) => {
              let bg = 'var(--bg-card)', border = 'var(--border)', color = 'var(--text-primary)';
              if (selected !== null) {
                if (i === current.ans)   { bg = 'rgba(16,185,129,0.2)'; border = '#10b981'; color = '#10b981'; }
                else if (i === selected) { bg = 'rgba(239,68,68,0.2)'; border = '#ef4444'; color = '#ef4444'; }
              }
              return (
                <button key={i} onClick={() => selected === null && handleAnswer(i)}
                  disabled={selected !== null}
                  className="py-3 px-4 rounded-xl text-sm font-medium text-left transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, color, cursor: selected !== null ? 'default' : 'pointer' }}>
                  <span className="font-black mr-2" style={{ color: '#a78bfa' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="text-right mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            Worth {current.pts} pts
          </div>
        </div>
      )}

      {status === 'over' && (
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center bounce-in">
          <div className="text-5xl mb-3">💀</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#ef4444' }}>Eliminated!</h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>You reached Question {qIndex + 1}</p>
          <p className="text-2xl font-black mt-2" style={{ color: '#a78bfa' }}>{score} pts</p>
          <button onClick={restart} className="btn-neon mt-5 px-8 py-3">Try Again</button>
        </div>
      )}

      {status === 'win' && (
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center bounce-in">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#10b981' }}>You Survived!</h2>
          <p style={{ color: 'var(--text-muted)' }}>All questions answered!</p>
          <p className="text-2xl font-black mt-2" style={{ color: '#fbbf24' }}>{score} pts</p>
          <button onClick={restart} className="btn-neon mt-5 px-8 py-3">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
