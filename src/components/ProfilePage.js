import React, { useState, useEffect } from 'react';
import { Edit2, Star, Save, AlertCircle, Trophy, Calendar, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProfilePage = () => {
  // State management
  const [userData, setUserData] = useState(null);
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [favoriteGame, setFavoriteGame] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch user profile data on component mount
  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
      return;
    }
    fetchUserProfile();
  }, [token, navigate]);
    if (!token) {
    setError("No authentication token found. Please log in again.");
    setLoading(false);
    return;
    }
    console.log("Using token:", token.substring(0, 10) + "...");
  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/auth/login');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile data.');
      }

      const data = await response.json();
      setUserData(data);
      setDescription(data.description || '');
      setStreak(data.currentStreak || 0);
      setFavoriteGame(data.favoriteGame || '');
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to save profile description
  const handleSaveDescription = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      if (!description.trim()) {
        setError('Description cannot be empty.');
        setSaveLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/profile/description`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description: description.trim() }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/auth/login');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update description.');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving description:', err);
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Function to record a game visit
  const recordGameVisit = async (gameName, duration, completed) => {
    try {
      const response = await fetch(`${API_URL}/game/visit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          gameName, 
          duration, 
          completed 
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/auth/login');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record game visit.');
      }

      const gameData = await response.json();
      setStreak(gameData.streak || 0);
      setFavoriteGame(gameData.favoriteGame || '');
      
      // Update games played count in userData
      if (completed && userData) {
        setUserData({
          ...userData,
          gamesPlayed: (userData.gamesPlayed || 0) + 1
        });
      }
    } catch (err) {
      console.error('Error recording game visit:', err);
      setError(err.message);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(userData?.description || '');
    setError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
        <button 
          onClick={fetchUserProfile}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={userData?.avatar || `/api/placeholder/128/128`}
          alt={userData?.username}
          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{userData?.username}</h1>
          <div className="flex items-center mt-2">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-lg text-blue-700">{streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">About Me</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Edit description"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {description.length}/500 characters
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDescription}
                  disabled={saveLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saveLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saveLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">
            {description || 'No description added yet.'}
          </p>
        )}
      </div>

      {/* Gaming Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-6">Gaming Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium text-blue-800">
              <Trophy className="w-5 h-5 mr-2" />
              <h3>Favorite Game</h3>
            </div>
            <p className="text-gray-700 ml-7">
              {favoriteGame || 'No favorite game yet'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium text-blue-800">
              <Gamepad2 className="w-5 h-5 mr-2" />
              <h3>Statistics</h3>
            </div>
            <ul className="text-gray-700 ml-7 space-y-1">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Current Streak: {streak} days
              </li>
              <li className="flex items-center">
                <Gamepad2 className="w-4 h-4 mr-2 text-blue-500" />
                Total Games: {userData?.gamesPlayed || 0}
              </li>
              <li className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                Member since: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;