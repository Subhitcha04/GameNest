import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthUI from './components/AuthUI';
import GameSelector from './components/GameSelection';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import Scoreboard from './components/scoreboard';
import { loadUser, saveUser, clearUser } from './utils/db';
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [activeView, setActiveView] = useState('games');

  // Restore session on mount
  useEffect(() => {
    const saved = loadUser();
    if (saved) {
      setIsAuthenticated(true);
      setUser(saved);
      setCurrentView('dashboard');
    }
  }, []);

  const handleGetStarted = () => setCurrentView('auth');

  const handleLogin = (userData) => {
    const u = { ...userData, joinedAt: userData.joinedAt || new Date().toISOString() };
    setIsAuthenticated(true);
    setUser(u);
    saveUser(u);
    setCurrentView('dashboard');
    setActiveView('games');
  };

  const handleLogout = () => {
    clearUser();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
    setActiveView('games');
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setCurrentView('dashboard');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'profile':    return <ProfilePage user={user} />;
      case 'scoreboard': return <Scoreboard user={user} />;
      default:           return <GameSelector user={user} />;
    }
  };

  const renderContent = () => {
    if (currentView === 'home') {
      return <HomePage onGetStarted={handleGetStarted} />;
    }
    if (currentView === 'auth') {
      return <AuthUI onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
    }
    if (!isAuthenticated) {
      return <HomePage onGetStarted={handleGetStarted} />;
    }
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar
          user={user}
          onLogout={handleLogout}
          onViewChange={handleViewChange}
          activeView={activeView}
        />
        <div className="flex-1" style={{ marginLeft: 240 }}>
          <div className="p-6 min-h-screen">
            {renderMainContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      {renderContent()}
    </Router>
  );
};

export default App;
