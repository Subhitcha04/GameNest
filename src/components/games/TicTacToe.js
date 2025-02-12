import React, { useState } from 'react';

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
        </div>
      </div>
    </div>
  );
};

export default RiverdaleticTacToe;