/**
 * COW Responsive Breakpoint System
 * Mobile-first responsive design breakpoints
 */

// Breakpoint values
export const breakpoints = {
  xs: '0px',      // Mobile portrait
  sm: '576px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '992px',    // Tablet landscape / Desktop
  xl: '1200px',   // Desktop
  '2xl': '1400px', // Large desktop
} as const;

// Media query generators
export const createMediaQuery = (breakpoint: keyof typeof breakpoints) => {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
};

export const createMaxWidthMediaQuery = (breakpoint: keyof typeof breakpoints) => {
  const breakpointValue = parseInt(breakpoints[breakpoint]);
  const maxWidth = breakpointValue - 1;
  return `@media (max-width: ${maxWidth}px)`;
};

export const createRangeMediaQuery = (
  minBreakpoint: keyof typeof breakpoints,
  maxBreakpoint: keyof typeof breakpoints
) => {
  const minValue = breakpoints[minBreakpoint];
  const maxValue = parseInt(breakpoints[maxBreakpoint]) - 1;
  return `@media (min-width: ${minValue}) and (max-width: ${maxValue}px)`;
};

// Responsive utilities
export const responsive = {
  // Common media queries
  mobile: createMaxWidthMediaQuery('md'),
  tablet: createRangeMediaQuery('md', 'lg'),
  desktop: createMediaQuery('lg'),
  
  // Touch device detection
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  
  // Reduced motion preference
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Dark mode preference
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)',
  
  // High contrast preference
  highContrast: '@media (prefers-contrast: high)',
  
  // Print styles
  print: '@media print',
} as const;

// Container queries (for modern browsers)
export const containerQueries = {
  xs: '@container (min-width: 320px)',
  sm: '@container (min-width: 576px)',
  md: '@container (min-width: 768px)',
  lg: '@container (min-width: 992px)',
  xl: '@container (min-width: 1200px)',
} as const;

// Responsive grid columns
export const gridColumns = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
  '2xl': 8,
} as const;

// Export unified responsive system
export const responsiveSystem = {
  breakpoints,
  mediaQueries: {
    min: createMediaQuery,
    max: createMaxWidthMediaQuery,
    range: createRangeMediaQuery,
  },
  responsive,
  containerQueries,
  gridColumns,
} as const;

// CSS Custom Properties Generator
export const createBreakpointCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Breakpoint values
  Object.entries(breakpoints).forEach(([key, value]) => {
    properties[`--breakpoint-${key}`] = value;
  });
  
  return properties;
};

// Utility functions for responsive design
export const isBreakpoint = (breakpoint: keyof typeof breakpoints, width: number) => {
  const breakpointValue = parseInt(breakpoints[breakpoint]);
  return width >= breakpointValue;
};

export const getCurrentBreakpoint = (width: number): keyof typeof breakpoints => {
  const sortedBreakpoints = Object.entries(breakpoints)
    .map(([key, value]) => ({ key: key as keyof typeof breakpoints, value: parseInt(value) }))
    .sort((a, b) => b.value - a.value);
  
  for (const { key, value } of sortedBreakpoints) {
    if (width >= value) {
      return key;
    }
  }
  
  return 'xs';
};

export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = keyof typeof responsive;
export type ContainerQuery = keyof typeof containerQueries;