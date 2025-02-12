import React from 'react';

const HomePage = ({ onGetStarted }) => (
  <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
    <div className="absolute top-4 left-4 text-3xl font-bold text-blue-900">GameNest</div>
    <div className="text-center bg-white/30 backdrop-blur-sm p-12 rounded-xl shadow-lg">
      <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-6">
        Welcome to GameNest
      </h1>
      <p className="text-xl text-blue-900 mb-8 max-w-2xl mx-auto">
        Dive into a world of endless gaming fun! GameNest brings you a curated collection of engaging mini-games that challenge your skills, boost your reflexes, and provide hours of entertainment.
      </p>
      <button 
        onClick={onGetStarted}
        className="bg-red-500 text-blue-50 px-8 py-3 rounded-full text-xl hover:bg-red-600 transition-colors"
      >
        Get Started
      </button>
    </div>
  </div>
);

export default HomePage;
