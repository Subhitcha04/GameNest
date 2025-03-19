import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock, Star, Zap } from 'lucide-react';

const JokerMemoryGame = () => {
  // Joker-themed card sets with comic and movie references
  const CARD_SETS = {
    GOTHAM_CHAOS: {
      cards: [
        'BATMAN', 'HARLEY', 'RIDDLER', 'ARKHAM', 'JOKER', 
        'PENGUIN', 'TWOFACE', 'POISON', 'LAUGH', 'CHAOS'
      ],
      description: 'Gotham City Mayhem',
      difficulty: 1,
      color: '#6B21A8',
      backgroundImage: '/images/gotham.jpg'
    },
    DARK_KNIGHT: {
      cards: [
        'HEATH', 'PHOENIX', 'GOTHAM', 'ANARCHY', 'MADNESS', 
        'CRIME', 'SMILE', 'AGENT', 'CHAOS', 'DISCORD'
      ],
      description: 'Dark Knight Memories',
      difficulty: 2,
      color: '#DC2626',
      backgroundImage: '/images/dark-knight.jpg'
    },
    ULTIMATE_CHAOS: {
      cards: [
        'NIHILISM', 'PANDEMONIUM', 'DISRUPTION', 'SCHIZOID', 
        'PSYCHOSIS', 'BREAKDOWN', 'MAYHEM', 'LUNACY', 'CIRCUS', 'PANDORA'
      ],
      description: 'Absolute Chaos',
      difficulty: 3,
      color: '#1E40AF',
      backgroundImage: '/images/joker-chaos.jpg'
    }
  };

  // Game state management
  const [cardSet, setCardSet] = useState('GOTHAM_CHAOS');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStatus, setGameStatus] = useState('READY');
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Initialize game
  const initializeGame = (selectedCardSet = cardSet) => {
    const selectedSet = CARD_SETS[selectedCardSet].cards;
    
    // Duplicate cards and shuffle
    const shuffledCards = [...selectedSet, ...selectedSet]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        value: card,
        isFlipped: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameStatus('PLAYING');

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  // Initialize game on first render
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle card flip
  const handleCardFlip = (cardId) => {
    if (
      gameStatus !== 'PLAYING' || 
      flippedCards.length >= 2 || 
      matchedCards.some(card => card.id === cardId)
    ) return;

    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    );

    setCards(updatedCards);
    setFlippedCards([...flippedCards, cardId]);
    setMoves(prev => prev + 1);
  };

  // Check for card matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards.map(id => 
        cards.find(card => card.id === id)
      );

      setTimeout(() => {
        if (firstCard.value === secondCard.value) {
          // Match found
          setMatchedCards([...matchedCards, firstCard, secondCard]);
        } else {
          // No match, flip cards back
          const resetCards = cards.map(card => 
            flippedCards.includes(card.id) 
              ? { ...card, isFlipped: false } 
              : card
          );
          setCards(resetCards);
        }

        setFlippedCards([]);
      }, 1000);
    }

    // Check win condition
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameStatus('WON');
      clearInterval(timerRef.current);
    }
  }, [flippedCards]);

  // Card Design with Joker's Chaotic Style
  const CardComponent = ({ card, onFlip }) => {
    const cardStyles = {
      background: 'linear-gradient(135deg, #1A202C, #2D3748)',
      transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
      transition: 'transform 0.6s',
      backfaceVisibility: 'hidden',
      boxShadow: '0 10px 25px rgba(255,0,0,0.2)'
    };

    return (
      <div 
        className="relative w-full h-full perspective-1000 cursor-pointer group"
        onClick={() => onFlip(card.id)}
      >
        <div 
          className="absolute w-full h-full preserve-3d"
          style={cardStyles}
        >
          {/* Card Front (Hidden) */}
          <div 
            className="absolute w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              backgroundColor: card.isFlipped ? 'transparent' : '#1A202C',
              border: '2px solid #DC2626',
              backgroundImage: !card.isFlipped 
                ? 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, rgba(0,0,0,0.5) 100%)' 
                : 'none'
            }}
          >
            <span className="text-red-500 font-bold text-lg tracking-wider group-hover:scale-125 transition-transform">
              ?
            </span>
          </div>

          {/* Card Back (Revealed) */}
          <div 
            className="absolute w-full h-full bg-gray-900 rounded-lg flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              backgroundColor: '#2D3748',
              border: '2px solid #10B981',
              transform: card.isFlipped ? 'rotateY(0)' : 'rotateY(-180deg)',
            }}
          >
            <span className="text-green-400 font-bold text-2xl tracking-widest">
              {card.isFlipped ? card.value : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(45deg, #1A202C, #2C5282)',
        fontFamily: "'Comic Sans MS', cursive",
        backgroundImage: `url(${CARD_SETS[cardSet].backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Title Section */}
      <div className="text-center mb-6 bg-black/50 p-4 rounded-xl">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          Joker's Memory Mayhem
        </h1>
        <p className="text-gray-300">
          Chaos is a pure art form. Let's play!
        </p>
      </div>

      {/* Difficulty Selection with Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xl">
        {Object.keys(CARD_SETS).map(set => (
          <button
            key={set}
            onClick={() => {
              setCardSet(set);
              initializeGame(set);
            }}
            className={`
              px-4 py-2 rounded-lg flex items-center justify-center space-x-2
              transition-all duration-300 relative overflow-hidden
              ${cardSet === set 
                ? 'bg-red-600 text-white scale-110' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
            style={{
              backgroundImage: `url(${CARD_SETS[set].backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex items-center space-x-2">
              {set === 'GOTHAM_CHAOS' ? <Star /> :
               set === 'DARK_KNIGHT' ? <Zap /> :
               <Clock />}
              <span>{CARD_SETS[set].description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Game Grid with Responsive Layout */}
      <div 
        className="grid grid-cols-5 gap-4 bg-gray-800/70 p-6 rounded-xl shadow-2xl backdrop-blur-sm"
        style={{ width: '600px', height: '600px' }}
      >
        {cards.map(card => (
          <CardComponent 
            key={card.id} 
            card={card} 
            onFlip={handleCardFlip} 
          />
        ))}
      </div>

      {/* Game Info & Controls Grid */}
      <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-xl">
        <div className="bg-gray-800/70 p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="text-white text-xl">
            Moves: <span className="text-red-500">{moves}</span>
          </div>
        </div>
        <div className="bg-gray-800/70 p-4 rounded-lg text-center backdrop-blur-sm">
          <div className="text-white text-xl">
            Time: <span className="text-green-500">{timer}s</span>
          </div>
        </div>
        <button
          onClick={() => initializeGame()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
        >
          <RefreshCw className="mr-2" /> Reset Game
        </button>
      </div>

      {/* Game Status */}
      {gameStatus === 'WON' && (
        <div className="mt-6 text-center bg-black/70 p-6 rounded-xl">
          <h2 className="text-3xl font-bold text-green-500">
            Chaos Conquered! 🃏
          </h2>
          <p className="text-gray-300">
            Moves: {moves} | Time: {timer}s
          </p>
        </div>
      )}
    </div>
  );
};

export default JokerMemoryGame;