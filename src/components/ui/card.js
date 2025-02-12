import React from 'react';

// Inject CSS styles directly into the document
const style = `
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  background-color: #fff;
}

.card-header {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
}

.card-content {
  font-size: 1rem;
  line-height: 1.5;
}
`;

// Append the style to the document head
const addStyles = () => {
  if (!document.getElementById('card-component-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'card-component-styles';
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
  }
};
addStyles();

// Default Export: Card Component
export default function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

// Named Exports for Additional Components
export function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardTitle({ title, className = '' }) {
  return <h2 className={`card-title ${className}`}>{title}</h2>;
}

export function CardDescription({ description, className = '' }) {
  return <p className={`card-description ${className}`}>{description}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}
