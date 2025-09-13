/**
 * Theme Utility Functions
 * Helper functions for theme management
 */

import { lightTheme } from '../themes/light';
import { darkTheme } from '../themes/dark';

export type Theme = typeof lightTheme;
export type ThemeName = 'light' | 'dark';

// Theme registry
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// Get theme by name
export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};

// Generate CSS custom properties from theme
export const generateCSSVariables = (theme: Theme): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Flatten theme object and create CSS custom properties
  const flattenObject = (obj: any, prefix = ''): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const cssKey = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value, cssKey);
      } else if (typeof value === 'string') {
        variables[`--${cssKey}`] = value;
      }
    });
  };
  
  flattenObject(theme.colors, 'color');
  flattenObject(theme.spacing.scale, 'spacing');
  flattenObject(theme.typography.fontSizes, 'font-size');
  flattenObject(theme.shadows.base, 'shadow');
  
  return variables;
};

// Apply theme to document
export const applyTheme = (themeName: ThemeName): void => {
  const theme = getTheme(themeName);
  const variables = generateCSSVariables(theme);
  
  Object.entries(variables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
  
  // Set theme attribute for CSS selectors
  document.documentElement.setAttribute('data-theme', themeName);
};

// Detect system theme preference
export const getSystemTheme = (): ThemeName => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Theme storage helpers
export const getStoredTheme = (): ThemeName | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('cow-theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  }
  return null;
};

export const setStoredTheme = (themeName: ThemeName): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('cow-theme', themeName);
  }
};

// Get initial theme (stored > system > light)
export const getInitialTheme = (): ThemeName => {
  return getStoredTheme() || getSystemTheme();
};