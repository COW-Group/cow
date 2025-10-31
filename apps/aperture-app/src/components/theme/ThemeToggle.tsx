import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md'
}) => {
  const { themeName, toggleTheme, classes } = useAppTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center justify-center
        rounded-full transition-all duration-300 ease-in-out
        ${classes.button.ghost}
        hover:scale-110 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${classes.border.focus} focus:ring-offset-transparent
        ${className}
      `}
      title={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
      aria-label={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className={`relative ${iconSizes[size]}`}>
        {/* Sun icon for light mode */}
        <Sun
          className={`
            ${iconSizes[size]}
            absolute top-0 left-0 transition-all duration-300 ease-in-out
            ${themeName === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-75'
            }
          `}
        />

        {/* Moon icon for dark mode */}
        <Moon
          className={`
            ${iconSizes[size]}
            absolute top-0 left-0 transition-all duration-300 ease-in-out
            ${themeName === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
    </button>
  );
};