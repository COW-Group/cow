const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      // COW Brand Colors - The Horizon Principle
      colors: {
        // Primary Cerulean (Sky & Water)
        cerulean: {
          deep: '#007BA7',
          DEFAULT: '#00A5CF',
          light: '#4FC3E0',
          powder: '#B0E0E6',
          ice: '#E8F4F8',
        },
        // Grounding Palette - Earth Tones
        earth: {
          stone: '#9B8B7E',
          clay: '#C9B8A8',
          terra: '#C77A58',
          sand: '#D4BFA0',
        },
        // Botanical (Growth from Earth)
        botanical: {
          bamboo: '#6B8E6F',
          moss: '#8A9A7B',
          sage: '#A4AC96',
        },
        // Gold (Precious Moments)
        gold: {
          deep: '#B8860B',
          soft: '#D4AF37',
        },
        // Neutrals
        ink: {
          black: '#2C3E50',
          charcoal: '#6B6B6B',
        },
        paper: {
          rice: '#F5F3F0',
          pearl: '#F7FAFC',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#2D6A4F',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
        error: {
          DEFAULT: '#9B2C2C',
        },
      },
      // Typography - Inter Font System
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontWeight: {
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Spacing Scale (8px base unit)
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Border Radius
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
      },
      // Box Shadow
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      // Line Height for Readability
      lineHeight: {
        'relaxed': '1.6',
      },
    },
  },
  plugins: [],
};
