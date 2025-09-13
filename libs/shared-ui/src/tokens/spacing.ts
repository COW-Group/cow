/**
 * COW Spacing System
 * Consistent spacing scale for layout and components
 */

// Base spacing scale (in rem)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Content spacing
  contentPadding: spacing[4],
  contentGap: spacing[6],
  
  // Component spacing
  componentPadding: spacing[3],
  componentGap: spacing[4],
  
  // Layout spacing
  layoutPadding: spacing[6],
  layoutGap: spacing[8],
  
  // Section spacing
  sectionPadding: spacing[12],
  sectionGap: spacing[16],
  
  // Touch targets
  touchTarget: spacing[11], // 44px minimum
  touchPadding: spacing[2],
  
  // Form elements
  formGap: spacing[4],
  formPadding: spacing[3],
  
  // Card spacing
  cardPadding: spacing[6],
  cardGap: spacing[4],
  
  // Navigation spacing
  navPadding: spacing[4],
  navGap: spacing[2],
} as const;

// Container max widths
export const containerSizes = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

// Export unified spacing object
export const spacingSystem = {
  scale: spacing,
  semantic: semanticSpacing,
  containers: containerSizes,
} as const;

// CSS Custom Properties Generator
export const createSpacingCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Base spacing scale
  Object.entries(spacing).forEach(([key, value]) => {
    properties[`--spacing-${key}`] = value;
  });
  
  // Semantic spacing
  Object.entries(semanticSpacing).forEach(([key, value]) => {
    properties[`--spacing-${key}`] = value;
  });
  
  // Container sizes
  Object.entries(containerSizes).forEach(([key, value]) => {
    properties[`--container-${key}`] = value;
  });
  
  return properties;
};

export type SpacingScale = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type ContainerSize = keyof typeof containerSizes;