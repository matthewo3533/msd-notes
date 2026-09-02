import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomHeadingFormat, DEFAULT_CUSTOM_HEADING_FORMAT } from '../utils/headingFormatter';

interface SettingsContextType {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  customHeadingFormat: CustomHeadingFormat;
  setCustomHeadingFormat: (format: CustomHeadingFormat) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const HEADING_FORMAT_STORAGE_KEY = 'msd-custom-heading-format';
const BOLD_DEFAULT_MIGRATION_KEY = 'msd-use-bold-default-on';

const normalizeHeadingFormat = (saved?: Partial<CustomHeadingFormat> | null): CustomHeadingFormat => ({
  ...DEFAULT_CUSTOM_HEADING_FORMAT,
  ...saved,
  useTildes: typeof saved?.useTildes === 'boolean' ? saved.useTildes : DEFAULT_CUSTOM_HEADING_FORMAT.useTildes,
  useCapitals: typeof saved?.useCapitals === 'boolean' ? saved.useCapitals : DEFAULT_CUSTOM_HEADING_FORMAT.useCapitals,
  useBold: typeof saved?.useBold === 'boolean' ? saved.useBold : DEFAULT_CUSTOM_HEADING_FORMAT.useBold
});

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
    const savedCustomFormat = localStorage.getItem(HEADING_FORMAT_STORAGE_KEY);
    let loaded: CustomHeadingFormat = { ...DEFAULT_CUSTOM_HEADING_FORMAT };

    if (savedCustomFormat) {
      try {
        loaded = normalizeHeadingFormat(JSON.parse(savedCustomFormat));
      } catch (e) {
        console.warn('Failed to parse custom heading format from localStorage');
      }
    }

    // Older builds defaulted Use Bold to off and persisted that. Turn it on once
    // so existing installs match the new default; users can still uncheck it after.
    if (!localStorage.getItem(BOLD_DEFAULT_MIGRATION_KEY)) {
      loaded = { ...loaded, useBold: true };
      localStorage.setItem(BOLD_DEFAULT_MIGRATION_KEY, '1');
    }

    return loaded;
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
    localStorage.setItem(HEADING_FORMAT_STORAGE_KEY, JSON.stringify(customHeadingFormat));
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

