<<<<<<< HEAD
export const games = [
  { id: 'memory',    name: 'Joker Memory Game',               description: 'Test memory with this Joker-themed card matching game.',         image: '/images/memorycard.jpg',          emoji: '🃏', category: 'Memory',  difficulty: 'Medium' },
  { id: 'typing',    name: 'Money Heist Typing Test',          description: 'Race the clock typing heist quotes as fast as you can.',          image: '/images/typing_test.jpg',         emoji: '💰', category: 'Typing',  difficulty: 'Medium' },
  { id: 'hangman',   name: 'Corporate Hangman',                description: 'Guess office buzzwords before the boss fires you!',               image: '/images/hangman.jpg',             emoji: '🏢', category: 'Word',    difficulty: 'Easy'   },
  { id: 'quiz',      name: 'Squid Game Quiz',                  description: 'Survive five deadly trivia questions from the hit show.',          image: '/images/game_quiz.jpg',           emoji: '🦑', category: 'Trivia',  difficulty: 'Hard'   },
  { id: 'scramble',  name: 'Friends Word Scramble',            description: "Unscramble iconic Friends words before you're out of lives.",      image: '/images/word_scramble.jpg',       emoji: '📝', category: 'Word',    difficulty: 'Easy'   },
  { id: 'tictactoe', name: 'Riverdale Tic Tac Toe',            description: 'Classic Tic Tac Toe with a Riverdale twist — 2 players.',          image: '/images/tictactoe.jpg',           emoji: '⭕', category: 'Board',   difficulty: 'Easy'   },
  { id: 'numguess',  name: 'Stranger Things Number Guessing',  description: 'Guess the secret number before the Demogorgon gets you.',          image: '/images/number_guessing.jpg',     emoji: '🔢', category: 'Puzzle',  difficulty: 'Medium' },
  { id: 'wordguess', name: 'Insidious Word Hunt',              description: 'Guess the spooky hidden word one letter at a time.',               image: '/images/word_guessing.jpg',       emoji: '👻', category: 'Word',    difficulty: 'Medium' },
  { id: 'rps',       name: 'Bridgerton Rock Paper Scissors',   description: 'A classic RPS match with a regency-era Bridgerton theme.',         image: '/images/rock_paper_scissors.jpg', emoji: '🪶', category: 'Arcade',  difficulty: 'Easy'   },
  { id: 'snake',     name: 'Forest Snake Adventure',           description: 'Control the snake through the forest — how long can you survive?',  image: '/images/snake.jpg',              emoji: '🐍', category: 'Arcade',  difficulty: 'Hard'   },
];
=======
import React from "react";

export const games = [
  {
    id: "memory",
    name: "Joker Memory Game",
    description: "Test your memory and concentration with this fun Joker-themed memory game.",
    image: "/images/memorycard.jpg",
    emoji: "🃏",
  },
  {
    id: "typing",
    name: "Money Heist Typing Test",
    description: "Race against the clock and type as fast as possible to rob the bank like the heist team!",
    image: "/images/typing_test.jpg",
    emoji: "💰",
  },
  {
    id: "hangman",
    name: "Corporate Hangman",
    description: "Guess the word before the corporate boss draws you out!",
    image: "/images/hangman.jpg",
    emoji: "🏢",
  },
  {
    id: "quiz",
    name: "Squid Game Quiz",
    description: "Answer tricky questions related to the Squid Game series and survive!",
    image: "/images/game_quiz.jpg",
    emoji: "🦑",
  },
  {
    id: "scramble",
    name: "Friends Word Scramble",
    description: "Unscramble the letters to form iconic words related to the Friends series.",
    image: "/images/word_scramble.jpg",
    emoji: "📝",
  },
  {
    id: "tictactoe",
    name: "Riverdale Tic Tac Toe",
    description: "Play a classic game of Tic-Tac-Toe with a Riverdale twist.",
    image: "/images/tictactoe.jpg",
    emoji: "⭕",
  },
  {
    id: "numguess",
    name: "Stranger Things Number Guessing",
    description: "Guess the number from a secret range before time runs out.",
    image: "/images/number_guessing.jpg",
    emoji: "🔢",
  },
  {
    id: "wordguess",
    name: "Insidious Word Guessing",
    description: "Guess the spooky word hidden within the Insidious theme.",
    image: "/images/word_guessing.jpg",
    emoji: "👻",
  },
  {
    id: "rps",
    name: "Bridgerton Rock Paper Scissors",
    description: "A classic game of Rock, Paper, Scissors, but with a Bridgerton theme!",
    image: "/images/rock_paper_scissors.jpg",
    emoji: "🪶",
  },
  {
    id: "snake",
    name: "Classic Snake Game",
    description: "Control the snake and eat the food without hitting the walls or yourself!",
    image: "/images/snake.jpg",
    emoji: "🐍",
  },
];

const GameList = () => {
  return (
    <div className="game-container">
      {games.map((game) => (
        <div key={game.id} className="game-card">
          <img src={process.env.PUBLIC_URL + game.image} alt={game.name} className="game-image" />
          <h3>{game.name} {game.emoji}</h3>
          <p>{game.description}</p>
        </div>
      ))}
    </div>
  );
};

export default GameList;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
