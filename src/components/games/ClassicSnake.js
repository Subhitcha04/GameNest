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
          </button>
        ))}
      </div>

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
    </div>
  );
};

export default SnakeGame;