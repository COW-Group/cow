const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    // Include shared-ui components
    join(__dirname, '../../libs/shared-ui/src/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      // COW Brand Colors
      colors: {
        wisdom: {
          50: '#FDFCFA',
          100: '#F9F5F0',
          200: '#F5E6D3',
          300: '#E8D4BB',
          400: '#D4B896',
          500: '#C19A6B',
          600: '#A67C52',
          700: '#8B4513',
          800: '#6D340F',
          900: '#4F260B',
        },
        earth: '#8B4513',
        growth: '#00B774',
        sky: '#627EEA',
        sunset: '#FFB800',
        // Blockchain colors
        ethereum: '#627EEA',
        polygon: '#8247E5',
        solana: '#9945FF',
        bitcoin: '#F7931A',
      },
      // Glassmorphism utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.05)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
