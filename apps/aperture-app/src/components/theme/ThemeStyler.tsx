import React, { useEffect } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';

export const ThemeStyler: React.FC = () => {
  const { theme, themeName } = useAppTheme();

  useEffect(() => {
    const root = document.documentElement;

    if (themeName === 'dark') {
      // Dark theme CSS variables
      root.style.setProperty('--theme-bg-primary', '#000000');
      root.style.setProperty('--theme-bg-secondary', '#111827');
      root.style.setProperty('--theme-bg-tertiary', '#374151');
      root.style.setProperty('--theme-text-primary', '#ffffff');
      root.style.setProperty('--theme-text-secondary', '#d1d5db');
      root.style.setProperty('--theme-text-muted', '#9ca3af');
      root.style.setProperty('--theme-border-default', '#374151');
      root.style.setProperty('--theme-accent', '#fbbf24');
    } else {
      // Light theme CSS variables
      root.style.setProperty('--theme-bg-primary', '#ffffff');
      root.style.setProperty('--theme-bg-secondary', '#f9fafb');
      root.style.setProperty('--theme-bg-tertiary', '#f3f4f6');
      root.style.setProperty('--theme-text-primary', '#111827');
      root.style.setProperty('--theme-text-secondary', '#4b5563');
      root.style.setProperty('--theme-text-muted', '#6b7280');
      root.style.setProperty('--theme-border-default', '#d1d5db');
      root.style.setProperty('--theme-accent', '#2563eb');
    }

    // Add theme class to body for conditional styles
    document.body.className = `theme-${themeName}`;
  }, [theme, themeName]);

  return null; // This component only sets CSS variables
};