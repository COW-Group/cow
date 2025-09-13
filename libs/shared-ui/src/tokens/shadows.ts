/**
 * COW Shadow System
 * Glassmorphism-compatible shadows for depth and hierarchy
 */

// Shadow levels for elevation
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// Glassmorphism-specific shadows
export const glassShadows = {
  subtle: '0 8px 32px rgba(0, 0, 0, 0.1)',
  medium: '0 12px 40px rgba(0, 0, 0, 0.15)',
  strong: '0 16px 48px rgba(0, 0, 0, 0.2)',
  floating: '0 20px 60px rgba(0, 0, 0, 0.25)',
} as const;

// Colored shadows for brand elements
export const coloredShadows = {
  // Brand color shadows
  wisdom: '0 8px 32px rgba(245, 230, 211, 0.3)',
  earth: '0 8px 32px rgba(139, 69, 19, 0.3)',
  growth: '0 8px 32px rgba(0, 183, 116, 0.3)',
  sky: '0 8px 32px rgba(98, 126, 234, 0.3)',
  sunset: '0 8px 32px rgba(255, 184, 0, 0.3)',
  
  // Blockchain network shadows
  ethereum: '0 8px 32px rgba(98, 126, 234, 0.3)',
  polygon: '0 8px 32px rgba(130, 71, 229, 0.3)',
  solana: '0 8px 32px rgba(153, 69, 255, 0.3)',
  bitcoin: '0 8px 32px rgba(247, 147, 26, 0.3)',
  
  // Status shadows
  success: '0 8px 32px rgba(0, 183, 116, 0.3)',
  warning: '0 8px 32px rgba(255, 184, 0, 0.3)',
  error: '0 8px 32px rgba(255, 68, 68, 0.3)',
  info: '0 8px 32px rgba(98, 126, 234, 0.3)',
} as const;

// Interactive shadows (for hover states)
export const interactiveShadows = {
  hover: {
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    base: '0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    md: '0 8px 16px -2px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)',
    lg: '0 16px 24px -4px rgba(0, 0, 0, 0.12), 0 8px 12px -4px rgba(0, 0, 0, 0.08)',
  },
  focus: {
    ring: '0 0 0 3px rgba(98, 126, 234, 0.1)',
    ringOffset: '0 0 0 2px white, 0 0 0 4px rgba(98, 126, 234, 0.1)',
  },
  active: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    base: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
} as const;

// Component-specific shadows
export const componentShadows = {
  card: shadows.base,
  modal: shadows['2xl'],
  dropdown: shadows.lg,
  tooltip: shadows.md,
  navbar: shadows.sm,
  sidebar: shadows.xl,
  floating: glassShadows.floating,
  button: shadows.sm,
  input: shadows.inner,
} as const;

// Export unified shadow system
export const shadowSystem = {
  base: shadows,
  glass: glassShadows,
  colored: coloredShadows,
  interactive: interactiveShadows,
  component: componentShadows,
} as const;

// CSS Custom Properties Generator
export const createShadowCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Base shadows
  Object.entries(shadows).forEach(([key, value]) => {
    properties[`--shadow-${key}`] = value;
  });
  
  // Glass shadows
  Object.entries(glassShadows).forEach(([key, value]) => {
    properties[`--glass-shadow-${key}`] = value;
  });
  
  // Component shadows
  Object.entries(componentShadows).forEach(([key, value]) => {
    properties[`--component-shadow-${key}`] = value;
  });
  
  return properties;
};

// Utility functions for shadow generation
export const createCustomShadow = (
  offsetX: number,
  offsetY: number,
  blurRadius: number,
  spreadRadius: number = 0,
  color: string = 'rgba(0, 0, 0, 0.1)'
) => {
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
};

export const combineShadows = (...shadows: string[]) => {
  return shadows.join(', ');
};

export const createGlowEffect = (color: string, intensity: number = 0.3) => {
  return `0 0 20px ${color.replace(/rgb\(([^)]+)\)/, `rgba($1, ${intensity})`)}, 0 0 40px ${color.replace(/rgb\(([^)]+)\)/, `rgba($1, ${intensity * 0.5})`)}`;
};

export type Shadow = keyof typeof shadows;
export type GlassShadow = keyof typeof glassShadows;
export type ColoredShadow = keyof typeof coloredShadows;
export type ComponentShadow = keyof typeof componentShadows;