import { useTheme } from '../components/theme/ThemeProvider';

export const useAppTheme = () => {
  const { theme, setTheme } = useTheme();

  // Derive theme name from theme state
  const themeName = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const toggleTheme = () => {
    setTheme(themeName === 'dark' ? 'light' : 'dark');
  };

  // Generate theme-aware CSS classes
  const classes = {
    // Background classes
    bg: {
      primary: themeName === 'dark' ? 'bg-black' : 'bg-white',
      secondary: themeName === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
      card: themeName === 'dark' ? 'bg-gray-900/50 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl',
      glass: themeName === 'dark' ? 'bg-gray-900/50 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md',
      header: themeName === 'dark' ? 'bg-gray-900/50 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl',
      modal: themeName === 'dark' ? 'bg-gray-900/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl',
      overlay: themeName === 'dark' ? 'bg-black/80 backdrop-blur-sm' : 'bg-gray-900/50 backdrop-blur-sm',
    },

    // Text classes
    text: {
      primary: themeName === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: themeName === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: themeName === 'dark' ? 'text-gray-400' : 'text-gray-500',
      accent: themeName === 'dark' ? 'text-yellow-400' : 'text-blue-600',
      error: themeName === 'dark' ? 'text-red-400' : 'text-red-600',
      success: themeName === 'dark' ? 'text-green-400' : 'text-green-600',
      warning: themeName === 'dark' ? 'text-yellow-300' : 'text-yellow-600',
    },

    // Border classes
    border: {
      default: themeName === 'dark' ? 'border-gray-800' : 'border-gray-200',
      muted: themeName === 'dark' ? 'border-gray-700' : 'border-gray-300',
      glass: themeName === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50',
      focus: themeName === 'dark' ? 'border-yellow-400' : 'border-blue-500',
      accent: themeName === 'dark' ? 'border-yellow-400' : 'border-blue-600',
    },

    // Button classes
    button: {
      primary: themeName === 'dark'
        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
        : 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: themeName === 'dark'
        ? 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      ghost: themeName === 'dark'
        ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    },

    // Input classes
    input: {
      base: themeName === 'dark'
        ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500',
    },

    // Loading spinner
    spinner: themeName === 'dark' ? 'border-yellow-400' : 'border-blue-600',

    // Hover states
    hover: {
      accent: themeName === 'dark' ? 'hover:text-yellow-400' : 'hover:text-blue-600',
      bg: themeName === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100',
      card: themeName === 'dark' ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50',
    },
  };

  return {
    theme,
    themeName,
    toggleTheme,
    setTheme,
    classes,
    isDark: themeName === 'dark',
    isLight: themeName === 'light',
  };
};