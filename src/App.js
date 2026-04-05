<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
=======
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
import HomePage from './components/HomePage';
import AuthUI from './components/AuthUI';
import GameSelector from './components/GameSelection';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import Scoreboard from './components/scoreboard';
<<<<<<< HEAD
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
=======
import './index.css';

const App = () => {
  // Authentication and user states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // View management states
  const [currentView, setCurrentView] = useState('home');
  const [activeView, setActiveView] = useState('games');

  // Handle the initial "Get Started" click from HomePage
  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  // Handle successful login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser({
      ...userData,
      avatar: '/default-avatar.png',
      createdAt: new Date().toISOString(),
      gamesPlayed: 0
    });
    setCurrentView('games');
  };

  // Handle logout
  const handleLogout = () => {
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
    setActiveView('games');
  };

<<<<<<< HEAD
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
=======
  // Handle view changes in the sidebar
  const handleViewChange = (view) => {
    setActiveView(view);
    if (isAuthenticated) {
      setCurrentView('dashboard');
    }
  };

  // Render the main content area based on activeView
  const renderMainContent = () => {
    switch (activeView) {
      case 'profile':
        return <ProfilePage />;
      case 'games':
        return <GameSelector />;
      case 'scoreboard':
        return <Scoreboard />;
      default:
        return <GameSelector />;
    }
  };

  // Render different views based on currentView state with proper styling
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
            <HomePage onGetStarted={handleGetStarted} />
          </div>
        );
      
      case 'auth':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
            <AuthUI onLogin={handleLogin} />
          </div>
        );
      
      case 'dashboard':
      case 'games':
        if (!isAuthenticated) {
          setCurrentView('home');
          return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
              <HomePage onGetStarted={handleGetStarted} />
            </div>
          );
        }
        return (
          <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
            {/* Sidebar */}
            <Sidebar 
              user={user}
              onLogout={handleLogout}
              onViewChange={handleViewChange}
              activeView={activeView}
            />
            
            {/* Main content area */}
            <div className="flex-1 ml-64">
              <div className="p-6 min-h-screen">
                {renderMainContent()}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
            <HomePage onGetStarted={handleGetStarted} />
          </div>
        );
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      <div className="relative">
        {/* Wrap the entire app with Router */}
        <Router>
          {renderContent()}
        </Router>
      </div>
    </div>
  );
};

export default App;
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
