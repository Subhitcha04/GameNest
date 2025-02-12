import React, { useState } from 'react';
// Import your specific game components as default imports
import JokerMemoryGame from '../components/games/MemoryGame';
import MoneyHeistTypingTest from '../components/games/TypingTest';
import CorporateHangman from '../components/games/Hangman';
//import SquidGameQuiz from '../components/games/QuizGame';
import FriendsWordScramble from '../components/games/WordScramble';
import RiverdaleticTacToe from '../components/games/TicTacToe';
import StrangerNumberGame from '../components/games/NumberGuessing';
import InsidiousWordGame from '../components/games/wordguessing';
//import BridgertonRPS from '../components/games/RockPaperScissors';
import SnakeGame from '../components/games/ClassicSnake';
// Import your games list
import { games } from '../components/games/gamesList';

const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  // Mapping of game IDs to their respective game components
  const gameComponents = {
    memory: JokerMemoryGame,
    typing: MoneyHeistTypingTest,
    hangman: CorporateHangman,
    //quiz: SquidGameQuiz,
    scramble: FriendsWordScramble,
    tictactoe: RiverdaleticTacToe,
    numguess: StrangerNumberGame,
    wordguess: InsidiousWordGame,
    //rps: BridgertonRPS,
    snake: SnakeGame,
  };

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleGoBack = () => {
    setSelectedGame(null);
  };

  // If no game is selected, show the game selection screen
  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-8">
        <div className="absolute top-4 left-4 text-3xl font-bold text-blue-900">GameNest</div>
        <div className="container mx-auto space-y-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 flex items-center space-x-8 shadow-lg hover:shadow-xl transition-all"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-64 h-40 rounded-xl object-cover"
              />
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  {game.emoji} {game.name}
                </h2>
                <p className="text-blue-800 mb-6">{game.description}</p>
                <button
                  onClick={() => handleSelectGame(game.id)}
                  className="bg-red-500 text-blue-50 px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If a game is selected, render that specific game
  const SelectedGameComponent = gameComponents[selectedGame];

  return (
    <div className="relative min-h-screen">
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-50 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white/80 transition-all"
      >
        ← Back to Games
      </button>
      {SelectedGameComponent ? (
        <SelectedGameComponent />
      ) : (
        <div>Game not found</div>
      )}
    </div>
  );
};

export default GameSelector;
