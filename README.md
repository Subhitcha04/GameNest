<<<<<<< HEAD
# 🎮 GameNest — Online Gaming Platform v2.0

> **Play. Compete. Dominate.**  
> A feature-rich, theme-driven gaming hub built with React.js — featuring 10+ mini-games, a live leaderboard, player profiles, and a sleek dark UI.

---

## 🚀 What's New in v2.0

| Feature | v1.0 | v2.0 |
|---|---|---|
| Games | Basic library | 10 themed mini-games |
| UI | Standard React | Custom dark glassmorphism design |
| Fonts | Default | Orbitron + Inter (Google Fonts) |
| Styling | CSS Modules | Tailwind CSS + custom CSS variables |
| UI Components | Custom only | shadcn/ui + Lucide React icons |
| Storage | MongoDB (remote) | LocalStorage utility (`db.js`) |
| Animations | None | Fade, float, shimmer, glow-pulse |
| Homepage | Basic landing | Animated canvas particle background |
| Profile | Basic info | Stats dashboard with streaks & favorites |
| Leaderboard | Global list | Per-game filter with medals |
| Email | None | SendGrid API integration (`/pages/api`) |
| Deployment | Netlify + Render | Netlify + GitHub Pages (`gh-pages`) |

---

## ✨ Features

- 🎮 **10 Themed Mini-Games** — Each game has a unique pop-culture theme (Joker, Money Heist, Squid Game, Stranger Things, Bridgerton, and more)
- 🏆 **Live Leaderboard** — Filter by game, view top 20 scores with gold/silver/bronze medals
- 👤 **Player Profiles** — Stats dashboard showing total games, streaks, high scores, and favorite game
- 🔐 **JWT Authentication** — Secure login and registration with persistent sessions via `localStorage`
- ✉️ **Email Integration** — SendGrid-powered invite/notification emails via a Next.js API route
- 🌙 **Dark Glassmorphism UI** — Deep dark theme (`#0d0d1a`) with purple accents, glass cards, and smooth animations
- ⚡ **Optimized Navigation** — React Router v7 with view-state management (no page reloads)
- 🎨 **Custom Animations** — fadeIn, float, shimmer text, glow-pulse, bounceIn via CSS keyframes

---

## 🎲 Games Library

| Game | Theme | Category | Difficulty |
|---|---|---|---|
| 🃏 Joker Memory Game | DC – Joker | Memory | Medium |
| 💰 Money Heist Typing Test | La Casa de Papel | Typing | Medium |
| 🏢 Corporate Hangman | Office Culture | Word | Easy |
| 🦑 Squid Game Quiz | Squid Game | Trivia | Hard |
| 📝 Friends Word Scramble | F·R·I·E·N·D·S | Word | Easy |
| ⭕ Riverdale Tic Tac Toe | Riverdale | Board | Easy |
| 🔢 Stranger Things Number Guessing | Stranger Things | Puzzle | Medium |
| 👻 Insidious Word Hunt | Insidious | Word | Medium |
| 🪶 Bridgerton Rock Paper Scissors | Bridgerton | Arcade | Easy |
| 🐍 Forest Snake Adventure | Classic Snake | Arcade | Hard |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v7, Context API |
| **Styling** | Tailwind CSS v3, shadcn/ui, Lucide React |
| **Fonts** | Google Fonts — Orbitron, Inter |
| **Storage** | LocalStorage (via `src/utils/db.js`) |
| **Backend** | Node.js, Express.js, MongoDB |
| **Auth** | JWT-based authentication |
| **Email** | SendGrid (`@sendgrid/mail`) |
| **Deployment** | Netlify (Frontend), Render (Backend), GitHub Pages (alt) |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
GameNest-enhanced/
├── public/
│   ├── images/          # Game thumbnail images
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── games/       # All 10 game components
│   │   │   ├── gamesList.js
│   │   │   ├── ClassicSnake.js
│   │   │   ├── MemoryGame.js
│   │   │   ├── TypingTest.js
│   │   │   ├── Hangman.js
│   │   │   ├── QuizGame.js
│   │   │   ├── WordScramble.js
│   │   │   ├── TicTacToe.js
│   │   │   ├── NumberGuessing.js
│   │   │   ├── RockPaperScissors.js
│   │   │   └── wordguessing.js
│   │   ├── ui/          # shadcn/ui base components
│   │   ├── HomePage.js
│   │   ├── AuthUI.js
│   │   ├── GameSelection.js
│   │   ├── ProfilePage.js
│   │   ├── Sidebar.js
│   │   └── scoreboard.js
│   ├── utils/
│   │   └── db.js        # LocalStorage API (auth, scores, stats)
│   ├── App.js
│   └── index.css        # Global styles, CSS variables, animations
├── pages/
│   └── api/
│       └── send-email.js  # SendGrid email API route
├── game-nest-backend/     # Express + MongoDB backend
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local or Atlas)
- SendGrid API Key (for email features)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/GameNest.git
cd GameNest

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your variables: REACT_APP_BACKEND_URL, SENDGRID_API_KEY

# Start the development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd game-nest-backend
=======
# GameNest - Online Gaming Platform

## Overview
GameNest is a feature-rich gaming platform designed and deployed using React.js. It offers a game library, tournaments, and leaderboards for an interactive user experience. The frontend is deployed on Netlify, ensuring scalability and fast performance. The backend is powered by MongoDB and secured with JWT-based authentication.

## Features
- 🎮 **Game Library** – Browse and play various games seamlessly.
- 📊 **Leaderboard** – Track player rankings and scores.
- 🔐 **User Authentication** – Secure login and registration using JWT authentication.
- 🚀 **Optimized Navigation** – Implemented using React Router for a smooth user experience.
- 📦 **State Management** – Context API ensures efficient data handling.

## Technologies Used
- **Frontend:** React.js, React Router, Context API
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT-based authentication
- **Deployment:** Netlify (Frontend), Render(Backend)
- **Version Control:** Git & GitHub

## Setup Instructions

### Backend Setup
```bash
# Navigate to backend directory
cd backend
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919

# Install dependencies
npm install

# Start the server
npm start
```

<<<<<<< HEAD
### Build for Production

```bash
# Create optimized production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
SENDGRID_API_KEY=your_sendgrid_api_key
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📸 Screenshots

| Page | Preview |
|---|---|
| 🏠 Home / Landing Page | *(animated particle background, hero section)* |
| 🔐 Authentication | *(login & register with JWT)* |
| 🎮 Game Library | *(10 themed game cards with filters)* |
| 👤 Player Profile | *(stats, streaks, favorite game)* |
| 🏆 Leaderboard | *(per-game filter, medal rankings)* |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project was built as a 5th Semester academic project.  
Feel free to fork and build upon it!

---

<div align="center">
  <strong>GameNest © 2024 — Built with ❤️ using React.js</strong>
</div>
=======
### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm run dev
```

## Screenshots
Here are some images showcasing the platform:

### Authentication Page
![Authentication](images/authentication.png)

### Game Library
![Games](images/games.png)

### User Profile Page
![Profile](images/profile.png)

### Scoreboard
![Scoreboard](images/scoreboard.png)

### Front Page
![Front Page](images/frontpage.png)

## Contributing
Contributions are welcome! Feel free to fork this repository, create a new branch, and submit a pull request.

>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
