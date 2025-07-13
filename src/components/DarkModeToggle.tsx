import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: (darkMode: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <div className="dark-mode-toggle">
      <button
        className={`toggle-button ${darkMode ? 'dark' : 'light'}`}
        onClick={() => onToggle(!darkMode)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="toggle-slider">
          <span className="toggle-icon">☀️</span>
          <span className="toggle-icon">🌙</span>
        </div>
      </button>
    </div>
  );
};

export default DarkModeToggle; 