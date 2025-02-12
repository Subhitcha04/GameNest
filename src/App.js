import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import HomePage from './components/HomePage';
import AuthUI from './components/AuthUI';
import GameSelector from './components/GameSelection';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import InvitePage from './components/InvitePage';
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
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
    setActiveView('games');
  };

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
      case 'invite':
        return <InvitePage />;
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
