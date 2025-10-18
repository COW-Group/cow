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
      // COW Brand Colors (from Design Guide)
      colors: {
        // Primary Palette - Cerulean (Sky & Water)
        cerulean: {
          deep: '#007BA7',      // Deep Cerulean - Primary brand color
          DEFAULT: '#00A5CF',   // Cerulean - Interactive elements
          light: '#4FC3E0',     // Light Cerulean - Highlights
          powder: '#B0E0E6',    // Powder Blue - Backgrounds
          ice: '#E8F4F8',       // Ice Blue - Page backgrounds
        },
        // Grounding Palette - Earth Tones (Stone, Clay & Growth)
        earth: {
          stone: '#9B8B7E',     // Warm Stone - Foundation
          clay: '#C9B8A8',      // Soft Clay - Warm backgrounds
          terracotta: '#C77A58',// Terra Cotta - Vitality
          sand: '#D4BFA0',      // Desert Sand - Soft neutral
        },
        botanical: {
          bamboo: '#6B8E6F',    // Bamboo Green - Growth
          moss: '#8A9A7B',      // Moss - Natural accents
          sage: '#A4AC96',      // Sage - Calm neutral
        },
        // Secondary Palette - Gold
        gold: {
          deep: '#B8860B',      // Deep Gold - Premium
          soft: '#D4AF37',      // Soft Gold - Highlights
        },
        // Neutrals
        ink: {
          black: '#2C3E50',     // Ink Black - Primary text
          charcoal: '#6B6B6B',  // Soft Charcoal - Secondary text
          slate: '#4A5568',     // Slate - Tertiary text
          silver: '#A0AEC0',    // Silver - Disabled/borders
        },
        paper: {
          rice: '#F5F3F0',      // Rice Paper - Warm backgrounds
          pearl: '#F7FAFC',     // Pearl - Cool backgrounds
        },
        // Semantic Colors
        success: '#2D6A4F',     // Forest Green
        warning: '#F59E0B',     // Amber
        error: '#9B2C2C',       // Burgundy
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