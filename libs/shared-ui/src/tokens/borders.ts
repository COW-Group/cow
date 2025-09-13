/**
 * COW Border System
 * Consistent borders for glassmorphism design
 */

// Border widths
export const borderWidths = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// Border radius values
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Border styles
export const borderStyles = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none',
} as const;

// Glassmorphism border colors
export const glassBorders = {
  subtle: 'rgba(255, 255, 255, 0.1)',
  medium: 'rgba(255, 255, 255, 0.2)',
  strong: 'rgba(255, 255, 255, 0.3)',
  dark: 'rgba(0, 0, 0, 0.1)',
} as const;

// Semantic border colors
export const semanticBorders = {
  default: 'rgba(229, 231, 235, 1)', // gray-200
  muted: 'rgba(209, 213, 219, 1)',   // gray-300
  subtle: 'rgba(156, 163, 175, 1)',  // gray-400
  
  // Status borders
  success: 'rgba(0, 183, 116, 0.3)',
  warning: 'rgba(255, 184, 0, 0.3)',
  error: 'rgba(255, 68, 68, 0.3)',
  info: 'rgba(98, 126, 234, 0.3)',
  
  // Interactive states
  focus: 'rgba(98, 126, 234, 0.5)',
  hover: 'rgba(98, 126, 234, 0.3)',
  active: 'rgba(98, 126, 234, 0.7)',
} as const;

// Brand-specific borders
export const brandBorders = {
  wisdom: 'rgba(245, 230, 211, 0.5)',
  earth: 'rgba(139, 69, 19, 0.3)',
  growth: 'rgba(0, 183, 116, 0.3)',
  sky: 'rgba(98, 126, 234, 0.3)',
  sunset: 'rgba(255, 184, 0, 0.3)',
} as const;

// Component-specific border configurations
export const componentBorders = {
  card: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: glassBorders.subtle,
    radius: borderRadius.lg,
  },
  button: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: 'transparent',
    radius: borderRadius.md,
  },
  input: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: semanticBorders.default,
    radius: borderRadius.md,
  },
  modal: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: glassBorders.medium,
    radius: borderRadius.xl,
  },
  dropdown: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: glassBorders.subtle,
    radius: borderRadius.lg,
  },
  tooltip: {
    width: borderWidths[1],
    style: borderStyles.solid,
    color: glassBorders.medium,
    radius: borderRadius.md,
  },
} as const;

// Border gradients for premium elements
export const borderGradients = {
  premium: 'linear-gradient(135deg, rgba(255, 184, 0, 0.3) 0%, rgba(98, 126, 234, 0.3) 100%)',
  blockchain: 'linear-gradient(135deg, rgba(98, 126, 234, 0.3) 0%, rgba(130, 71, 229, 0.3) 100%)',
  success: 'linear-gradient(135deg, rgba(0, 183, 116, 0.3) 0%, rgba(0, 183, 116, 0.1) 100%)',
  rainbow: 'linear-gradient(135deg, rgba(255, 0, 0, 0.3) 0%, rgba(255, 154, 0, 0.3) 16.66%, rgba(255, 255, 0, 0.3) 33.33%, rgba(0, 255, 0, 0.3) 50%, rgba(0, 0, 255, 0.3) 66.66%, rgba(130, 0, 255, 0.3) 83.33%, rgba(255, 0, 255, 0.3) 100%)',
} as const;

// Export unified border system
export const borderSystem = {
  widths: borderWidths,
  radius: borderRadius,
  styles: borderStyles,
  glass: glassBorders,
  semantic: semanticBorders,
  brand: brandBorders,
  component: componentBorders,
  gradients: borderGradients,
} as const;

// CSS Custom Properties Generator
export const createBorderCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Border widths
  Object.entries(borderWidths).forEach(([key, value]) => {
    properties[`--border-width-${key}`] = value;
  });
  
  // Border radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    properties[`--border-radius-${key}`] = value;
  });
  
  // Glass borders
  Object.entries(glassBorders).forEach(([key, value]) => {
    properties[`--border-glass-${key}`] = value;
  });
  
  // Semantic borders
  Object.entries(semanticBorders).forEach(([key, value]) => {
    properties[`--border-${key}`] = value;
  });
  
  return properties;
};

// Utility functions
export const createBorder = (
  width: keyof typeof borderWidths,
  style: keyof typeof borderStyles,
  color: string
) => {
  return `${borderWidths[width]} ${borderStyles[style]} ${color}`;
};

export const createGradientBorder = (
  width: keyof typeof borderWidths,
  gradient: string,
  borderRadius: keyof typeof borderRadius = 'md'
) => {
  return {
    border: `${borderWidths[width]} solid transparent`,
    borderRadius: borderRadius,
    background: `${gradient} border-box`,
    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'destination-out',
    maskComposite: 'exclude',
  };
};

export type BorderWidth = keyof typeof borderWidths;
export type BorderRadius = keyof typeof borderRadius;
export type BorderStyle = keyof typeof borderStyles;
export type GlassBorder = keyof typeof glassBorders;
export type SemanticBorder = keyof typeof semanticBorders;
export type BrandBorder = keyof typeof brandBorders;
export type ComponentBorder = keyof typeof componentBorders;