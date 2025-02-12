import React from 'react';

// Inject CSS styles directly into the document
const style = `
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  visibility: hidden;
}

.dialog.open {
  visibility: visible;
}

.dialog-content {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.dialog-header {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.dialog-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.dialog-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
`;

// Append the style to the document head
const addStyles = () => {
  if (!document.getElementById('dialog-component-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'dialog-component-styles';
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
  }
};
addStyles();

// Default Export: Dialog Component
export default function Dialog({ isOpen, children, onClose, className = '' }) {
  return (
    <div className={`dialog ${isOpen ? 'open' : ''} ${className}`}>
      <div className="dialog-content">
        {children}
        <button className="dialog-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Named Exports for Additional Components
export function DialogContent({ children, className = '' }) {
  return <div className={`dialog-content ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = '' }) {
  return <div className={`dialog-header ${className}`}>{children}</div>;
}

export function DialogTitle({ title, className = '' }) {
  return <h2 className={`dialog-title ${className}`}>{title}</h2>;
}

export function DialogDescription({ description, className = '' }) {
  return <p className={`dialog-description ${className}`}>{description}</p>;
}

export function DialogFooter({ children, className = '' }) {
  return <div className={`dialog-footer ${className}`}>{children}</div>;
}
