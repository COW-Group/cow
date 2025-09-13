/**
 * COW Typography System
 * Based on Inter and JetBrains Mono typefaces
 */

// Font Families
export const fontFamilies = {
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
} as const;

// Font Weights
export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const;

// Font Sizes (responsive with clamp)
export const fontSizes = {
  xs: 'clamp(0.75rem, 0.15vw + 0.71rem, 0.83rem)',
  sm: 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
  base: 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
  lg: 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
  xl: 'clamp(1.56rem, 1vw + 1.31rem, 2.11rem)',
  '2xl': 'clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)',
  '3xl': 'clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)',
  '4xl': 'clamp(3.05rem, 3.54vw + 2.17rem, 5rem)',
  '5xl': 'clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem)',
  '6xl': 'clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem)',
} as const;

// Line Heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography Variants
export const typographyVariants = {
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  button: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  display: {
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.black,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tighter,
  },
} as const;

// Export unified typography object
export const typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  variants: typographyVariants,
} as const;

// CSS Custom Properties Generator
export const createTypographyCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Font sizes
  Object.entries(fontSizes).forEach(([key, value]) => {
    properties[`--font-size-${key}`] = value;
  });
  
  // Font weights
  Object.entries(fontWeights).forEach(([key, value]) => {
    properties[`--font-weight-${key}`] = value.toString();
  });
  
  // Line heights
  Object.entries(lineHeights).forEach(([key, value]) => {
    properties[`--line-height-${key}`] = value.toString();
  });
  
  // Letter spacing
  Object.entries(letterSpacing).forEach(([key, value]) => {
    properties[`--letter-spacing-${key}`] = value;
  });
  
  return properties;
};

export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyVariant = keyof typeof typographyVariants;