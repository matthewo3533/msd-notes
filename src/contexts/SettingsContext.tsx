import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomHeadingFormat } from '../components/Settings';

interface SettingsContextType {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  customHeadingFormat: CustomHeadingFormat;
  setCustomHeadingFormat: (format: CustomHeadingFormat) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'dark-blue'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('msd-theme');
    return savedTheme || 'dark-blue';
  });

  // Initialize custom heading format from localStorage or default
  const [customHeadingFormat, setCustomHeadingFormat] = useState<CustomHeadingFormat>(() => {
    const savedCustomFormat = localStorage.getItem('msd-custom-heading-format');
    if (savedCustomFormat) {
      try {
        return JSON.parse(savedCustomFormat);
      } catch (e) {
        console.warn('Failed to parse custom heading format from localStorage');
      }
    }
    return {
      useTildes: true,
      useCapitals: false,
      useBold: false
    };
  });

  // Apply theme class to body
  useEffect(() => {
    // Remove all existing theme classes and dark-mode class
    document.body.classList.remove(
      'theme-dark-blue', 'theme-light', 'dark-mode'
    );
    // Add the current theme class
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('msd-theme', currentTheme);
  }, [currentTheme]);

  // Save custom heading format to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('msd-custom-heading-format', JSON.stringify(customHeadingFormat));
  }, [customHeadingFormat]);

  const value: SettingsContextType = {
    currentTheme,
    setCurrentTheme,
    customHeadingFormat,
    setCustomHeadingFormat,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

