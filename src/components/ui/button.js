import React from 'react';

const Button = ({ label, onClick, type = 'button', className = '' }) => {
  const buttonStyle = {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  };

  const hoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...buttonStyle }}
      onMouseOver={(e) => (e.target.style.backgroundColor = hoverStyle.backgroundColor)}
      onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      className={className}
    >
      {label}
    </button>
  );
};

export default Button;
