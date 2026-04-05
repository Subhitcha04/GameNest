import React, { useState } from 'react';

<<<<<<< HEAD
const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const X_PLAYER = { name: 'Archie', symbol: 'X', color: '#ef4444', emoji: '🔴' };
const O_PLAYER = { name: 'Jughead', symbol: 'O', color: '#3b82f6', emoji: '🔵' };

const checkWinner = (board) => {
  for (const [a,b,c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  return null;
};

const minimax = (board, isMax) => {
  const result = checkWinner(board);
  if (result) return result.winner === 'O' ? 10 : -10;
  if (board.every(Boolean)) return 0;
  const scores = [];
  board.forEach((cell, i) => {
    if (!cell) {
      const newBoard = [...board];
      newBoard[i] = isMax ? 'O' : 'X';
      scores.push(minimax(newBoard, !isMax));
    }
  });
  return isMax ? Math.max(...scores) : Math.min(...scores);
};

const getBestMove = (board) => {
  let best = -Infinity, bestIdx = -1;
  board.forEach((cell, i) => {
    if (!cell) {
      const nb = [...board]; nb[i] = 'O';
      const score = minimax(nb, false);
      if (score > best) { best = score; bestIdx = i; }
    }
  });
  return bestIdx;
};

const RiverdaleticTacToe = ({ onComplete }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState('X');
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, tie: 0 });
  const [mode, setMode] = useState('pvp'); // pvp | ai
  const [winLine, setWinLine] = useState([]);

  const handleClick = (i) => {
    if (board[i] || result) return;
    const nb = [...board]; nb[i] = current;
    const res = checkWinner(nb);
    const full = nb.every(Boolean);

    if (res) {
      setWinLine(res.line);
      setResult({ type: 'win', player: current });
      setScores(s => ({ ...s, [current]: s[current] + 1 }));
      onComplete && onComplete(current === 'X' ? 100 : 0, { winner: current, mode });
    } else if (full) {
      setResult({ type: 'tie' });
      setScores(s => ({ ...s, tie: s.tie + 1 }));
    } else if (mode === 'ai' && current === 'X') {
      setCurrent('O');
      setBoard(nb);
      setTimeout(() => {
        const aiMove = getBestMove(nb);
        if (aiMove === -1) return;
        const nb2 = [...nb]; nb2[aiMove] = 'O';
        const res2 = checkWinner(nb2);
        const full2 = nb2.every(Boolean);
        setBoard(nb2);
        if (res2) {
          setWinLine(res2.line);
          setResult({ type: 'win', player: 'O' });
          setScores(s => ({ ...s, O: s.O + 1 }));
        } else if (full2) {
          setResult({ type: 'tie' });
          setScores(s => ({ ...s, tie: s.tie + 1 }));
        } else {
          setCurrent('X');
        }
      }, 400);
      return;
    }
    setBoard(nb);
    if (!res && !full) setCurrent(c => c === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrent('X');
    setResult(null);
    setWinLine([]);
  };

  const curPlayer = current === 'X' ? X_PLAYER : O_PLAYER;
  const sym = (val) => val === 'X' ? X_PLAYER : O_PLAYER;

  return (
    <div className="flex flex-col items-center p-6 fade-in min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-black gradient-text mb-2" style={{ fontFamily: 'Orbitron,sans-serif' }}>
        ⭕ Riverdale Tic Tac Toe
      </h1>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        {[['pvp','👥 2 Player'],['ai','🤖 vs AI']].map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); reset(); }}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: mode === m ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
              color: mode === m ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {l}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex gap-4 mb-5">
        {[['🔴 Archie (X)', scores.X, '#ef4444'], ['🤝 Tie', scores.tie, '#94a3b8'], ['🔵 Jughead (O)', scores.O, '#3b82f6']].map(([l, v, c]) => (
          <div key={l} className="glass rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-black" style={{ color: c }}>{v}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Status */}
      {!result
        ? <div className="mb-4 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: `${curPlayer.color}22`, color: curPlayer.color, border: `1px solid ${curPlayer.color}44` }}>
            {curPlayer.emoji} {curPlayer.name}'s Turn
          </div>
        : <div className="mb-4 px-4 py-2 rounded-full text-sm font-bold bounce-in"
            style={{ background: result.type === 'tie' ? 'rgba(148,163,184,0.2)' : `${sym(result.player).color}22`,
                     color: result.type === 'tie' ? '#94a3b8' : sym(result.player).color }}>
            {result.type === 'tie' ? "🤝 It's a draw!" : `${sym(result.player).emoji} ${sym(result.player).name} wins!`}
          </div>
      }

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {board.map((cell, i) => {
          const p = cell ? sym(cell) : null;
          const isWin = winLine.includes(i);
          return (
            <button key={i} onClick={() => handleClick(i)} disabled={!!cell || !!result}
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black transition-all"
              style={{
                background: isWin ? `${p?.color}30` : 'var(--bg-card)',
                border: `2px solid ${isWin ? p?.color : 'var(--border)'}`,
                color: p?.color,
                boxShadow: isWin ? `0 0 20px ${p?.color}66` : 'none',
                transform: isWin ? 'scale(1.05)' : 'scale(1)',
                cursor: cell || result ? 'default' : 'pointer',
              }}>
              {cell || ''}
            </button>
          );
        })}
      </div>

      <button onClick={reset} className="btn-neon px-8 py-2">New Game</button>

      {/* Legend */}
      <div className="flex gap-6 mt-5 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: X_PLAYER.color }} />
          <span style={{ color: 'var(--text-muted)' }}>X = Archie</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: O_PLAYER.color }} />
          <span style={{ color: 'var(--text-muted)' }}>O = Jughead</span>
=======
const RiverdaleticTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('Archie');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Riverdale characters and their symbols
  const players = {
    'Archie': { 
      symbol: 'A', 
      color: 'text-red-600',
      icon: (size) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="red">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      )
    },
    'Jughead': { 
      symbol: 'J', 
      color: 'text-brown-600',
      icon: (size) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="brown">
          <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm-2 14h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
        </svg>
      )
    }
  };

  // Winning combinations
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  // Check for a winner
  const checkWinner = (currentBoard) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] && 
        currentBoard[a] === currentBoard[b] && 
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return null;
  };

  // Make a move
  const makeMove = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setWinner(winner);
    } else if (newBoard.every(cell => cell !== null)) {
      // Draw
      setGameOver(true);
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 'Archie' ? 'Jughead' : 'Archie');
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('Archie');
    setGameOver(false);
    setWinner(null);
  };

  // Determine game status message
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        return `${winner} wins the game! Riverdale Drama Ensues!`;
      }
      return "It's a draw! Typical Riverdale Twist!";
    }
    return `Current Player: ${currentPlayer}'s Turn`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-red-800">
        Riverdale Tic Tac Toe
      </h1>
      
      <div 
        className="text-center mb-4 text-lg font-semibold"
        style={{ 
          color: gameOver ? (winner ? 'red' : 'purple') : 'black'
        }}
      >
        {getStatusMessage()}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`
              w-24 h-24 border-2 border-gray-400 flex items-center justify-center
              hover:bg-gray-200 transition-colors duration-200
              ${gameOver ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => makeMove(index)}
            disabled={gameOver}
          >
            {cell && (
              <span className={`text-4xl ${players[cell].color}`}>
                {players[cell].icon(48)}
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={resetGame}
          className="
            bg-red-600 text-white px-4 py-2 rounded
            hover:bg-red-700 transition-colors duration-200
          "
        >
          Reset Game
        </button>
      </div>
      
      {/* Character Information */}
      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-4">
          <div className="flex items-center">
            {players['Archie'].icon(32)}
            <span className="ml-2">Archie</span>
          </div>
          <div className="flex items-center">
            {players['Jughead'].icon(32)}
            <span className="ml-2">Jughead</span>
          </div>
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default RiverdaleticTacToe;
=======
export default RiverdaleticTacToe;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
