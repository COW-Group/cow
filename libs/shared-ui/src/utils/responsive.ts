/**
 * Responsive Utility Functions
 * Helper functions for responsive design
 */

import { breakpoints, type Breakpoint } from '../tokens/breakpoints';

// Hook for current breakpoint (would be implemented in React context)
export const useBreakpoint = () => {
  // This would be implemented with useEffect and useState in a real app
  // For now, return a mock implementation
  return {
    current: 'md' as Breakpoint,
    isXs: false,
    isSm: false,
    isMd: true,
    isLg: false,
    isXl: false,
    is2xl: false,
  };
};

// Responsive value selector
export const getResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint,
  fallback: T
): T => {
  // Try to find value for current breakpoint, falling back to smaller ones
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint]!;
    }
  }
  
  return fallback;
};

// Responsive class generator
export const createResponsiveClasses = (
  property: string,
  values: Partial<Record<Breakpoint, string>>
): string => {
  return Object.entries(values)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs') {
        return `${property}-${value}`;
      }
      return `${breakpoint}:${property}-${value}`;
    })
    .join(' ');
};

// Media query helpers (using custom suffix to avoid conflicts)
export const createResponsiveMediaQuery = (minWidth: string) => {
  return `@media (min-width: ${minWidth})`;
};

export const createResponsiveMaxWidthMediaQuery = (maxWidth: string) => {
  return `@media (max-width: ${maxWidth})`;
};

// Container size calculator
export const getContainerSize = (breakpoint: Breakpoint): string => {
  const containerSizes = {
    xs: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };
  
  return containerSizes[breakpoint] || '100%';
};

// Grid column calculator
export const getGridColumns = (breakpoint: Breakpoint): number => {
  const gridColumns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 8,
  };
  
  return gridColumns[breakpoint] || 1;
};