import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import game components
import JokerMemoryGame from '../components/games/MemoryGame';
import MoneyHeistTypingTest from '../components/games/TypingTest';
import CorporateHangman from '../components/games/Hangman';
import FriendsWordScramble from '../components/games/WordScramble';
import RiverdaleticTacToe from '../components/games/TicTacToe';
import StrangerNumberGame from '../components/games/NumberGuessing';
import InsidiousWordGame from '../components/games/wordguessing';
import SnakeGame from '../components/games/ClassicSnake';

// Import games list
import { games } from '../components/games/gamesList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Game components mapping
  const gameComponents = {
    memory: JokerMemoryGame,
    typing: MoneyHeistTypingTest,
    hangman: CorporateHangman,
    scramble: FriendsWordScramble,
    tictactoe: RiverdaleticTacToe,
    numguess: StrangerNumberGame,
    wordguess: InsidiousWordGame,
    snake: SnakeGame,
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (selectedGame) {
      setStartTime(Date.now());
    }
  }, [selectedGame]);

  const recordGameVisit = async (gameName, duration, completed) => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`${API_URL}/game/visit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ gameName, duration, completed }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/auth/login');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record game visit.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleGoBack = () => {
    if (selectedGame && startTime) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const gameInfo = games.find(game => game.id === selectedGame);
      if (gameInfo) {
        recordGameVisit(gameInfo.name, duration, false);
      }
    }
    setSelectedGame(null);
    setStartTime(null);
  };

  const handleGameComplete = (success = true) => {
    if (selectedGame && startTime) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const gameInfo = games.find(game => game.id === selectedGame);
      if (gameInfo) {
        recordGameVisit(gameInfo.name, duration, success);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg max-w-md">
          <h2 className="text-2xl text-red-600 font-bold">Error</h2>
          <p className="text-gray-800">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Try Again</button>
        </div>
      </div>
    );
  }

  if (!selectedGame) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">GameNest</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white p-4 rounded shadow-md">
              <img src={game.image || '/fallback-image.png'} alt={game.name} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-xl font-semibold mt-2">{game.emoji} {game.name}</h2>
              <p className="text-gray-600 mt-1">{game.description}</p>
              <button onClick={() => handleSelectGame(game.id)} className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const SelectedGameComponent = gameComponents[selectedGame];
  return (
    <div className="relative min-h-screen">
      <button onClick={handleGoBack} className="absolute top-4 left-4 bg-white p-2 rounded shadow hover:bg-gray-100">← Back</button>
      {SelectedGameComponent ? <SelectedGameComponent onComplete={handleGameComplete} /> : <div>Game not found</div>}
    </div>
  );
};

export default GameSelector;
