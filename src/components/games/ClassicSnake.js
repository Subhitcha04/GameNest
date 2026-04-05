<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const SnakeGame = () => {
  // Forest-themed difficulty configurations
  const DIFFICULTIES = {
    FOREST_BREEZE: { 
      speed: 200, 
      gridSize: 20, 
      boardWidth: 500, 
      boardHeight: 500,
      description: 'Gentle forest paths',
      backgroundColor: '#2F4F4F',
      snakeColor: '#3CB371',
      foodColor: '#FF6347'
    },
    FOREST_TRAIL: { 
      speed: 100, 
      gridSize: 20, 
      boardWidth: 500, 
      boardHeight: 500,
      description: 'Winding woodland trails',
      backgroundColor: '#228B22',
      snakeColor: '#008080',
      foodColor: '#FF4500'
    },
    FOREST_RUSH: { 
      speed: 50, 
      gridSize: 20, 
      boardWidth: 500, 
      boardHeight: 500,
      description: 'Rapid forest adventure',
      backgroundColor: '#006400',
      snakeColor: '#00CED1',
      foodColor: '#FF0000'
    }
  };

  // State management
  const [difficulty, setDifficulty] = useState('FOREST_BREEZE');
  const [snake, setSnake] = useState([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 15, y: 15});
  const [direction, setDirection] = useState('RIGHT');
  const [gameStatus, setGameStatus] = useState('STOPPED');
  const [score, setScore] = useState(0);

  // Refs and other game mechanics remain similar to previous implementation

  // Enhanced visual generation for food and snake
  const generateFood = () => {
    const config = DIFFICULTIES[difficulty];
    const gridWidth = config.boardWidth / config.gridSize;
    const gridHeight = config.boardHeight / config.gridSize;

    return {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  };

  // Animated forest background
  const ForestBackground = () => {
    const treePositions = Array.from({length: 20}, () => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      size: Math.random() * 30 + 20
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {treePositions.map((tree, index) => (
          <div 
            key={index} 
            className="absolute opacity-30 transform rotate-45"
            style={{
              left: `${tree.x}px`,
              top: `${tree.y}px`,
              width: 0,
              height: 0,
              borderLeft: `${tree.size/2}px solid transparent`,
              borderRight: `${tree.size/2}px solid transparent`,
              borderBottom: `${tree.size}px solid rgba(34,139,34,0.3)`
            }}
          />
        ))}
      </div>
    );
  };

  // Animated snake segments with leaf-like appearance
  const SnakeSegment = ({ x, y, isHead, config }) => {
    const leafVariants = [
      'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      'clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      'clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
    ];

    return (
      <div
        className="absolute transition-all duration-200 ease-in-out transform"
        style={{
          width: `${config.gridSize}px`,
          height: `${config.gridSize}px`,
          left: `${x * config.gridSize}px`,
          top: `${y * config.gridSize}px`,
          backgroundColor: config.snakeColor,
          clipPath: leafVariants[Math.floor(Math.random() * leafVariants.length)],
          animation: isHead 
            ? 'pulse 1s infinite' 
            : 'none',
          transformOrigin: 'center'
        }}
      />
    );
  };

  // Render game with forest theme
  return (
    <div 
      className="flex flex-col items-center p-4 min-h-screen relative"
      style={{ 
        backgroundColor: DIFFICULTIES[difficulty].backgroundColor,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 8%, transparent 8%)',
        backgroundSize: '50px 50px'
      }}
    >
      {/* Forest Background */}
      <ForestBackground />

      <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-lg z-10">
        Forest Snake Adventure
      </h1>
      
      {/* Difficulty Selection */}
      <div className="mb-4 flex space-x-2 z-10">
        {Object.keys(DIFFICULTIES).map(diff => (
          <button
            key={diff}
            onClick={() => {
              setDifficulty(diff);
              // Reset game logic
            }}
            className={`px-4 py-2 rounded text-white transition-all duration-300 ${
              difficulty === diff 
                ? 'bg-green-700 scale-110' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {diff.replace('_', ' ')}
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
          </button>
        ))}
      </div>

<<<<<<< HEAD
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
=======
      {/* Game Board */}
      <div 
        className="relative border-8 border-green-900 shadow-2xl z-10"
        style={{
          width: `${DIFFICULTIES[difficulty].boardWidth}px`,
          height: `${DIFFICULTIES[difficulty].boardHeight}px`,
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        {/* Snake Rendering with Leaf-like Segments */}
        {snake.map((segment, index) => (
          <SnakeSegment 
            key={index} 
            x={segment.x} 
            y={segment.y} 
            isHead={index === 0}
            config={DIFFICULTIES[difficulty]}
          />
        ))}
        
        {/* Food Rendering */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${DIFFICULTIES[difficulty].gridSize}px`,
            height: `${DIFFICULTIES[difficulty].gridSize}px`,
            left: `${food.x * DIFFICULTIES[difficulty].gridSize}px`,
            top: `${food.y * DIFFICULTIES[difficulty].gridSize}px`,
            backgroundColor: DIFFICULTIES[difficulty].foodColor,
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      </div>

      {/* Game Controls */}
      <div className="mt-4 flex space-x-2 items-center z-10">
        <div className="text-2xl font-semibold text-white">
          Score: {score}
        </div>
        <button 
          onClick={() => {/* Start game logic */}} 
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
        >
          <Play className="w-6 h-6" />
        </button>
        <button 
          onClick={() => {/* Pause game logic */}} 
          className="bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
        >
          <Pause className="w-6 h-6" />
        </button>
        <button 
          onClick={() => {/* Reset game logic */}} 
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
    </div>
  );
};

<<<<<<< HEAD
export default SnakeGame;
=======
export default SnakeGame;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
