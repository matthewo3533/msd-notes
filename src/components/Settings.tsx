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

export type HeadingFormat = 'custom';

export interface CustomHeadingFormat {
  useTildes: boolean;
  useCapitals: boolean;
  useBold: boolean;
}

interface SettingsProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  customHeadingFormat: CustomHeadingFormat;
  onCustomHeadingFormatChange: (format: CustomHeadingFormat) => void;
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

const Settings: React.FC<SettingsProps> = ({ 
  currentTheme, 
  onThemeChange, 
  customHeadingFormat,
  onCustomHeadingFormatChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Generate custom preview
  const generateCustomPreview = (format: CustomHeadingFormat): string => {
    let text = 'Heading';
    
    // Apply capitals first (before bold conversion)
    if (format.useCapitals) {
      text = text.toUpperCase();
    }
    
    // Then apply bold Unicode conversion
    if (format.useBold) {
      text = convertToBoldUnicode(text);
    }
    
    // Finally apply tildes or colon
    if (format.useTildes) {
      text = `~~~ ${text} ~~~`;
    } else if (format.useCapitals || format.useBold) {
      text = `${text}:`;
    }
    
    return text;
  };

  // Convert to Unicode bold characters
  const convertToBoldUnicode = (text: string): string => {
    const boldMap: { [key: string]: string } = {
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
      'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
      'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
      'Y': '𝗬', 'Z': '𝗭',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
  };

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
  };

  return (
    <div className="settings-selector" ref={dropdownRef}>
      <button
        className="settings-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open settings"
      >
        <svg className="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span className="settings-selector-text">Settings</span>
      </button>
      
      {isOpen && (
        <div className="settings-dropdown">
          <div className="settings-section">
            <h4 className="settings-section-title">Theme</h4>
            <div className="settings-options">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  className={`settings-option ${currentTheme === theme.id ? 'selected' : ''}`}
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
                  <span className="option-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="settings-section">
            <h4 className="settings-section-title">Heading Format</h4>
            <div className="custom-format-controls">
              <label className="custom-format-option">
                <input
                  type="checkbox"
                  checked={customHeadingFormat.useTildes}
                  onChange={(e) => onCustomHeadingFormatChange({
                    ...customHeadingFormat,
                    useTildes: e.target.checked
                  })}
                />
                <span className="custom-format-label">Use Dashes</span>
              </label>
              
              <label className="custom-format-option">
                <input
                  type="checkbox"
                  checked={customHeadingFormat.useCapitals}
                  onChange={(e) => onCustomHeadingFormatChange({
                    ...customHeadingFormat,
                    useCapitals: e.target.checked
                  })}
                />
                <span className="custom-format-label">Use capitals</span>
              </label>
              
              <label className="custom-format-option">
                <input
                  type="checkbox"
                  checked={customHeadingFormat.useBold}
                  onChange={(e) => onCustomHeadingFormatChange({
                    ...customHeadingFormat,
                    useBold: e.target.checked
                  })}
                />
                <span className="custom-format-label">Use Bold</span>
              </label>
            </div>
            
            <div className="custom-preview-section">
              <h5 className="custom-preview-title">Preview:</h5>
              <div className="custom-preview-display">
                {generateCustomPreview(customHeadingFormat)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

