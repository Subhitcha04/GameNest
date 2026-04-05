import React, { useState, useEffect, useRef, useCallback } from 'react';

const CELL = 20;
const COLS = 25;
const ROWS = 20;
const W = CELL * COLS;
const H = CELL * ROWS;

const SPEEDS = { Easy: 180, Medium: 110, Hard: 60 };
const COLORS = { Easy: { bg: '#0f2d1a', snake: '#22c55e', food: '#f97316', head: '#4ade80' },
                 Medium: { bg: '#1a1a0f', snake: '#84cc16', food: '#ef4444', head: '#bef264' },
                 Hard:   { bg: '#1a0f0f', snake: '#06b6d4', food: '#f43f5e', head: '#67e8f9' } };

const rand = (max) => Math.floor(Math.random() * max);

const SnakeGame = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }],
    food: { x: 20, y: 10 },
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    score: 0,
    running: false,
    over: false,
  });
  const timerRef = useRef(null);
  const [uiScore, setUiScore] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | playing | paused | over
  const [diff, setDiff] = useState('Medium');
  const [hiScore, setHiScore] = useState(() => parseInt(localStorage.getItem('gn_snake_hi') || '0'));

  const placeFood = useCallback((snake) => {
    let pos;
    do { pos = { x: rand(COLS), y: rand(ROWS) }; }
    while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = stateRef.current;
    const c = COLORS[diff];

    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // Food
    ctx.shadowBlur = 12; ctx.shadowColor = c.food;
    ctx.fillStyle = c.food;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? c.head : c.snake;
      ctx.shadowBlur = isHead ? 10 : 0;
      ctx.shadowColor = c.head;
      const r = isHead ? 6 : 4;
      const x = seg.x * CELL + 2;
      const y = seg.y * CELL + 2;
      const s = CELL - 4;
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eyes on head
      if (isHead) {
        const { dir } = stateRef.current;
        ctx.fillStyle = '#000';
        const cx = seg.x * CELL + CELL / 2;
        const cy = seg.y * CELL + CELL / 2;
        const ex = dir.x, ey = dir.y;
        const perp = { x: -ey, y: ex };
        [1, -1].forEach(side => {
          ctx.beginPath();
          ctx.arc(cx + ex * 4 + perp.x * 3 * side, cy + ey * 4 + perp.y * 3 * side, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }, [diff]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.over) return;

    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      s.over = true; s.running = false;
      setStatus('over');
      const hi = Math.max(hiScore, s.score);
      localStorage.setItem('gn_snake_hi', hi);
      setHiScore(hi);
      onComplete && onComplete(s.score, { hiScore: hi });
      draw();
      return;
    }

    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.over = true; s.running = false;
      setStatus('over');
      const hi = Math.max(hiScore, s.score);
      localStorage.setItem('gn_snake_hi', hi);
      setHiScore(hi);
      onComplete && onComplete(s.score, { hiScore: hi });
      draw();
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    const newSnake = [head, ...s.snake];
    if (!ate) newSnake.pop();
    else {
      s.score += 10;
      setUiScore(s.score);
      s.food = placeFood(newSnake);
    }
    s.snake = newSnake;
    draw();
  }, [draw, placeFood, hiScore, onComplete]);

  const startGame = useCallback(() => {
    clearInterval(timerRef.current);
    stateRef.current = {
      snake: [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }],
      food: placeFood([{ x: 12, y: 10 }]),
      dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
      score: 0, running: true, over: false,
    };
    setUiScore(0);
    setStatus('playing');
    timerRef.current = setInterval(tick, SPEEDS[diff]);
    draw();
  }, [diff, tick, draw, placeFood]);

  const pauseGame = () => {
    const s = stateRef.current;
    if (s.over) return;
    if (s.running) {
      clearInterval(timerRef.current);
      s.running = false;
      setStatus('paused');
    } else {
      s.running = true;
      setStatus('playing');
      timerRef.current = setInterval(tick, SPEEDS[diff]);
    }
  };

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKey = (e) => {
      const s = stateRef.current;
      if (!s.running) return;
      const map = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (nd) {
        e.preventDefault();
        // Prevent reversing
        if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
      }
      if (e.key === ' ') { e.preventDefault(); pauseGame(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); clearInterval(timerRef.current); };
  }, []);

  // Re-init timer if diff changes while idle
  useEffect(() => {
    if (status === 'playing') {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(tick, SPEEDS[diff]);
    }
  }, [diff]);

  const dirs = [
    { label: '↑', d: { x: 0, y: -1 } }, { label: '←', d: { x: -1, y: 0 } },
    { label: '↓', d: { x: 0, y: 1 } },  { label: '→', d: { x: 1, y: 0 } },
  ];

  return (
    <div className="flex flex-col items-center p-4 fade-in" style={{ color: 'var(--text-primary)' }}>
      <h1 className="text-2xl font-black gradient-text mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        🐍 Forest Snake
      </h1>

      {/* Difficulty */}
      <div className="flex gap-2 mb-4">
        {Object.keys(SPEEDS).map(d => (
          <button key={d} onClick={() => setDiff(d)} disabled={status === 'playing'}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: diff === d ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
              color: diff === d ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
              opacity: status === 'playing' ? 0.6 : 1,
            }}>
            {d}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-3">
        <div className="glass rounded-xl px-5 py-2 text-center">
          <div className="text-xl font-bold" style={{ color: '#a78bfa' }}>{uiScore}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</div>
        </div>
        <div className="glass rounded-xl px-5 py-2 text-center">
          <div className="text-xl font-bold" style={{ color: '#fbbf24' }}>{hiScore}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Best</div>
        </div>
        <div className="glass rounded-xl px-5 py-2 text-center">
          <div className="text-xl font-bold" style={{ color: '#34d399' }}>{diff}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Mode</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden" style={{ border: '2px solid var(--border)', boxShadow: '0 0 30px rgba(124,58,237,0.2)' }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block' }} />

        {/* Overlay */}
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(13,13,26,0.85)', backdropFilter: 'blur(4px)' }}>
            {status === 'over' && (
              <div className="text-center mb-6 bounce-in">
                <div className="text-4xl mb-2">💀</div>
                <h2 className="text-2xl font-black" style={{ color: '#ef4444' }}>Game Over!</h2>
                <p className="text-lg mt-1" style={{ color: '#a78bfa' }}>Score: {uiScore}</p>
                {uiScore >= hiScore && uiScore > 0 && <p className="text-sm" style={{ color: '#fbbf24' }}>🏆 New High Score!</p>}
              </div>
            )}
            {status === 'paused' && (
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">⏸️</div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Paused</h2>
              </div>
            )}
            {status === 'idle' && (
              <div className="text-center mb-6">
                <div className="text-4xl mb-2 float">🐍</div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Forest Snake</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Use arrow keys or WASD to move</p>
              </div>
            )}
            <div className="flex gap-3">
              <button className="btn-neon px-6 py-2" onClick={startGame}>
                {status === 'over' ? '🔄 Try Again' : status === 'paused' ? '▶ Resume' : '▶ Start'}
              </button>
              {status === 'paused' && (
                <button onClick={startGame} className="px-6 py-2 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  Restart
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-32">
        <div />
        <button className="btn-neon py-2 text-lg" onClick={() => { stateRef.current.nextDir = { x: 0, y: -1 }; }}>↑</button>
        <div />
        <button className="btn-neon py-2 text-lg" onClick={() => { stateRef.current.nextDir = { x: -1, y: 0 }; }}>←</button>
        <button className="btn-neon py-2 text-sm" onClick={pauseGame}>{status === 'playing' ? '⏸' : '▶'}</button>
        <button className="btn-neon py-2 text-lg" onClick={() => { stateRef.current.nextDir = { x: 1, y: 0 }; }}>→</button>
        <div />
        <button className="btn-neon py-2 text-lg" onClick={() => { stateRef.current.nextDir = { x: 0, y: 1 }; }}>↓</button>
        <div />
      </div>

      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        Arrow keys / WASD to move · Space to pause
      </p>
    </div>
  );
};

export default SnakeGame;
