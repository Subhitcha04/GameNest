import React from 'react';

const Progress = ({ value, max = 100 }) => {
  const containerStyle = {
    width: '100%',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    backgroundColor: '#4caf50',
    width: `${Math.min((value / max) * 100, 100)}%`,
    transition: 'width 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle}></div>
    </div>
  );
};

export default Progress;
