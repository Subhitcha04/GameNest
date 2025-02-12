import React from 'react';
import { User, Users, GamepadIcon, LogOut } from 'lucide-react';

const Sidebar = ({ user, onLogout, onViewChange, activeView }) => {
  if (!user) return null; // Don't render sidebar if no user

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/30 backdrop-blur-sm shadow-lg z-50 flex flex-col">
      {/* User Quick Info */}
      <div className="p-6 border-b border-blue-200 flex items-center space-x-4">
        <img 
          src={user.avatar || `/api/placeholder/64/64`}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-blue-900">{user.username}</h3>
          <button
            onClick={() => onViewChange('profile')}
            className="text-blue-600 text-sm hover:underline"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="mt-4 space-y-2 px-6">
        <button 
          onClick={() => onViewChange('profile')} 
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'profile' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button 
          onClick={() => onViewChange('games')} 
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'games' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <GamepadIcon className="w-4 h-4" />
          <span>Games</span>
        </button>
        
        <button 
          onClick={() => onViewChange('invite')}
          className={`w-full px-4 py-2 rounded-md text-left font-medium flex items-center space-x-2 ${
            activeView === 'invite' ? 'bg-blue-200 text-blue-900' : 'text-blue-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Invite Friends</span>
        </button>

        <button 
          onClick={onLogout} 
          className="w-full px-4 py-2 rounded-md text-left text-red-600 font-medium hover:bg-red-50 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;