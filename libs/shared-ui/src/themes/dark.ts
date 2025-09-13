/**
 * COW Dark Theme
 * Dark theme variant with glassmorphism support
 */

import { colors } from '../tokens/colors';
import { lightTheme } from './light';

export const darkTheme = {
  ...lightTheme,
  name: 'dark',
  
  // Override colors for dark mode
  colors: {
    ...lightTheme.colors,
    
    // Background colors
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
      glass: colors.glass.dark,
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    
    // Foreground colors
    foreground: {
      primary: colors.gray[50],
      secondary: colors.gray[200],
      tertiary: colors.gray[400],
      muted: colors.gray[500],
      inverse: colors.gray[900],
    },
    
    // Border colors
    border: {
      default: colors.gray[700],
      muted: colors.gray[600],
      subtle: colors.gray[800],
      focus: colors.blockchain.ethereum,
      glass: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Interactive states
    interactive: {
      primary: colors.brand.skyBlue,
      primaryHover: '#7B8BF0',
      primaryActive: '#6B7BEE',
      secondary: colors.gray[700],
      secondaryHover: colors.gray[600],
      secondaryActive: colors.gray[500],
    },
  },
  
  // Component-specific overrides for dark mode
  components: {
    ...lightTheme.components,
    
    button: {
      ...lightTheme.components.button,
      text: {
        primary: '#FFFFFF',
        secondary: colors.gray[200],
        success: '#FFFFFF',
        warning: colors.gray[900],
        error: '#FFFFFF',
      },
      border: {
        primary: colors.brand.skyBlue,
        secondary: colors.gray[600],
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
      },
    },
    
    card: {
      background: 'rgba(0, 0, 0, 0.4)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    
    input: {
      background: colors.gray[800],
      border: colors.gray[600],
      borderFocus: colors.brand.skyBlue,
      text: colors.gray[100],
      placeholder: colors.gray[400],
    },
    
    modal: {
      background: 'rgba(0, 0, 0, 0.8)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
    },
    
    navigation: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      text: colors.gray[300],
      textActive: colors.brand.skyBlue,
    },
  },
} as const;

export type DarkTheme = typeof darkTheme;