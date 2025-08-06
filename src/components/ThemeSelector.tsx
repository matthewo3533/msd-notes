import React, { useState, useEffect, useRef } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accentGradient: string;
  };
}

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const themes: Theme[] = [
  {
    id: 'dark-blue',
    name: 'Dark Blue',
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accentGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accentGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentThemeData = themes.find(theme => theme.id === currentTheme) || themes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
      >
        <div 
          className="theme-preview-circle"
          style={{
            background: currentThemeData.colors.accentGradient,
            border: `2px solid ${currentThemeData.colors.primary === '#000000' ? '#333' : currentThemeData.colors.primary}`
          }}
        />
        <span className="theme-selector-text">Theme</span>
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(theme.id)}
              aria-label={`Select ${theme.name} theme`}
            >
              <div 
                className="theme-circle"
                style={{
                  background: theme.colors.accentGradient,
                  border: `2px solid ${theme.colors.primary === '#000000' ? '#333' : theme.colors.primary}`
                }}
              />
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 