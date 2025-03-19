import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Scoreboard.css'; // You can create this CSS file for styling

const Scoreboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/streaks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // If response is an array, use it directly
        // If it's a single object, wrap it in an array
        const userData = Array.isArray(response.data) ? response.data : [response.data];
        
        setUsers(userData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sort users by current streak (highest first)
  const sortedUsers = [...users].sort((a, b) => b.currentStreak - a.currentStreak);

  if (loading) {
    return (
      <div className="scoreboard-container">
        <h1>Scoreboard</h1>
        <div className="loading">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scoreboard-container">
        <h1>Scoreboard</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="scoreboard-container">
      <h1>Scoreboard</h1>
      <p className="scoreboard-description">
        Top players ranked by their current streak
      </p>
      
      <div className="scoreboard-table">
        <div className="scoreboard-header">
          <div className="rank">Rank</div>
          <div className="username">Player</div>
          <div className="streak">Current Streak</div>
        </div>
        
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user, index) => (
            <div key={user._id} className="scoreboard-row">
              <div className="rank">{index + 1}</div>
              <div className="username">{user.username}</div>
              <div className="streak">{user.currentStreak}</div>
            </div>
          ))
        ) : (
          <div className="no-users">No users found</div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;