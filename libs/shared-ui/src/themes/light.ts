/**
 * COW Light Theme
 * Default light theme with glassmorphism support
 */

import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacingSystem } from '../tokens/spacing';
import { shadowSystem } from '../tokens/shadows';
import { borderSystem } from '../tokens/borders';
import { animationSystem } from '../tokens/animations';

export const lightTheme = {
  name: 'light',
  
  // Colors
  colors: {
    // Background colors
    background: {
      primary: colors.brand.wisdomCream,
      secondary: '#FFFFFF',
      tertiary: colors.gray[50],
      glass: colors.glass.white,
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Foreground colors
    foreground: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      tertiary: colors.gray[500],
      muted: colors.gray[400],
      inverse: '#FFFFFF',
    },
    
    // Brand colors
    brand: colors.brand,
    
    // Semantic colors
    semantic: colors.semantic,
    
    // Blockchain colors
    blockchain: colors.blockchain,
    
    // User type colors
    userType: colors.userType,
    
    // Border colors
    border: {
      default: colors.gray[200],
      muted: colors.gray[300],
      subtle: colors.gray[100],
      focus: colors.blockchain.ethereum,
      glass: borderSystem.glass.subtle,
    },
    
    // Interactive states
    interactive: {
      primary: colors.brand.skyBlue,
      primaryHover: '#5A75E8',
      primaryActive: '#4F69E6',
      secondary: colors.gray[100],
      secondaryHover: colors.gray[200],
      secondaryActive: colors.gray[300],
    },
  },
  
  // Typography
  typography,
  
  // Spacing
  spacing: spacingSystem,
  
  // Shadows
  shadows: shadowSystem,
  
  // Borders
  borders: borderSystem,
  
  // Animations
  animations: animationSystem,
  
  // Component-specific overrides
  components: {
    button: {
      background: {
        primary: colors.brand.skyBlue,
        secondary: 'transparent',
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
      },
      text: {
        primary: '#FFFFFF',
        secondary: colors.gray[700],
        success: '#FFFFFF',
        warning: '#FFFFFF',
        error: '#FFFFFF',
      },
      border: {
        primary: colors.brand.skyBlue,
        secondary: colors.gray[300],
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
      },
    },
    
    card: {
      background: colors.glass.white,
      border: borderSystem.glass.subtle,
      shadow: shadowSystem.glass.subtle,
    },
    
    input: {
      background: '#FFFFFF',
      border: colors.gray[300],
      borderFocus: colors.brand.skyBlue,
      text: colors.gray[900],
      placeholder: colors.gray[500],
    },
    
    modal: {
      background: colors.glass.white,
      overlay: 'rgba(0, 0, 0, 0.5)',
      border: borderSystem.glass.medium,
      shadow: shadowSystem.glass.strong,
    },
    
    navigation: {
      background: colors.glass.white,
      border: borderSystem.glass.subtle,
      shadow: shadowSystem.base.sm,
      text: colors.gray[700],
      textActive: colors.brand.skyBlue,
    },
  },
} as const;

export type LightTheme = typeof lightTheme;