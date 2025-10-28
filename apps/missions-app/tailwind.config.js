/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // COW Cyan Sky Spectrum (Brand Signature)
        cyan: {
          deep: '#0066FF',      // Logo deep blue
          cerulean: '#00A5CF',  // Brand ink strokes
          bright: '#0ea5e9',    // Emphasis (current site)
          sky: '#38bdf8',       // Supporting (links)
          light: '#bae6fd',     // Atmospheric
          ice: '#e0f2fe',       // Subtle
          darkTint: '#164e63',  // Dark mode tint
          deepTint: '#0c2d3a',  // Deep cyan for special areas
        },
        // Royal Blue Interactive
        button: {
          blue: '#2563eb',      // Primary CTAs
          hover: '#1d4ed8',     // Hover state
          active: '#1e40af',    // Active state
        },
        // Emerald & Bamboo (Growth & Life)
        emerald: {
          light: '#059669',     // Light mode
          bright: '#10b981',    // Dark mode
          pale: '#d1fae5',      // Pale tint
          deep: '#064e3b',      // Deep emerald
        },
        bamboo: {
          DEFAULT: '#6B8E6F',   // Primary bamboo green
          moss: '#8A9A7B',      // Moss
          sage: '#A4AC96',      // Sage
        },
        // Earth Tones (Grounding)
        earth: {
          stone: '#9B8B7E',     // Warm stone
          clay: '#C9B8A8',      // Soft clay
          terracotta: '#C77A58', // Terra cotta
          sand: '#D4BFA0',      // Desert sand
        },
        // Gold (Precious Moments)
        gold: {
          deep: '#b45309',      // Light mode
          bright: '#fbbf24',    // Dark mode
          soft: '#d97706',      // Soft gold
        },
        // Dark Mode Backgrounds (Navy)
        navy: {
          deep: '#0a1628',      // Deep navy
          medium: '#0f1d2e',    // Medium navy
          slate800: '#1e293b',  // Elevated
          slate700: '#334155',  // Highest elevation
        },
        // Light Mode Backgrounds
        light: {
          rice: '#F5F3F0',      // Rice paper
          cream: '#fefce8',     // Cream alternative
          skyWash: '#e0f2fe',   // Sky-tinted
          white: '#ffffff',     // Pure white
        },
        // Status colors (keeping semantic names)
        success: {
          50: '#f0fdf4',
          500: '#10b981',       // COW Emerald
          600: '#059669',       // COW Emerald light
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',       // COW Soft Gold
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)',
        'light-gradient': 'linear-gradient(180deg, #E8F4F8 0%, #F5F3F0 60%, #C9B8A8 100%)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};