import React from 'react';

const Badge = ({ label, className = '', variant = 'default' }) => {
  const badgeStyles = {
    default: {
      display: 'inline-block',
      padding: '4px 8px',
      fontSize: '12px',
      color: '#fff',
      backgroundColor: '#6c757d',
      borderRadius: '12px',
    },
    primary: {
      backgroundColor: '#007bff',
    },
    success: {
      backgroundColor: '#28a745',
    },
    warning: {
      backgroundColor: '#ffc107',
      color: '#000',
    },
  };

  const combinedStyle = {
    ...badgeStyles.default,
    ...(badgeStyles[variant] || {}),
  };

  return <span style={combinedStyle} className={className}>{label}</span>;
};

export default Badge;
