/**
 * COW Theme Provider
 * React context for theme management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { 
  applyTheme, 
  getInitialTheme, 
  setStoredTheme, 
  type ThemeName,
  type Theme 
} from '../utils/theme-utils';

// Theme context type
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
  storageKey = 'cow-theme',
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (defaultTheme) return defaultTheme;
    return getInitialTheme();
  });

  const theme = themeName === 'dark' ? darkTheme : lightTheme;

  const setTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no stored preference
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setThemeName(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [storageKey]);

  const value: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC for theme injection
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} ref={ref} />;
  });
};