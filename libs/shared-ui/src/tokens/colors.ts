/**
 * COW Brand Color System
 * Based on brand guide principles with glassmorphism support
 */

// Primary Brand Palette
export const brandColors = {
  wisdomCream: '#F5E6D3',
  earthBrown: '#8B4513',
  growthGreen: '#00B774',
  skyBlue: '#627EEA',
  sunsetGold: '#FFB800',
} as const;

// Blockchain Network Colors
export const blockchainColors = {
  ethereum: '#627EEA',
  polygon: '#8247E5',
  solanaStart: '#9945FF',
  solanaEnd: '#14F195',
  bitcoin: '#F7931A',
  generic: '#6B7280',
} as const;

// Security Level Indicators
export const securityColors = {
  high: '#00B774',
  medium: '#FFB800',
  low: '#FF4444',
  unverified: '#6B7280',
} as const;

// User Type Color Coding
export const userTypeColors = {
  individual: '#627EEA',
  business: '#00B774',
  trader: '#FF6B00',
  community: '#8247E5',
  ai: '#6B7280',
  partner: '#00D4AA',
  staff: '#FF4444',
} as const;

// Semantic Colors
export const semanticColors = {
  success: '#00B774',
  warning: '#FFB800',
  error: '#FF4444',
  info: '#627EEA',
  neutral: '#6B7280',
} as const;

// Grayscale
export const grayScale = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

// Glassmorphism Colors
export const glassColors = {
  white: 'rgba(255, 255, 255, 0.7)',
  cream: 'rgba(245, 230, 211, 0.7)',
  dark: 'rgba(0, 0, 0, 0.7)',
  neutral: 'rgba(107, 114, 128, 0.7)',
} as const;

// Background Gradients
export const gradients = {
  solana: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
  sunset: 'linear-gradient(135deg, #FFB800 0%, #FF6B00 100%)',
  ocean: 'linear-gradient(135deg, #627EEA 0%, #00B774 100%)',
  earth: 'linear-gradient(135deg, #8B4513 0%, #F5E6D3 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
} as const;

// Export all colors as a unified object
export const colors = {
  brand: brandColors,
  blockchain: blockchainColors,
  security: securityColors,
  userType: userTypeColors,
  semantic: semanticColors,
  gray: grayScale,
  glass: glassColors,
  gradients,
} as const;

// CSS Custom Properties Generator
export const createCSSCustomProperties = () => {
  const properties: Record<string, string> = {};
  
  // Brand colors
  Object.entries(brandColors).forEach(([key, value]) => {
    properties[`--color-brand-${key}`] = value;
  });
  
  // Semantic colors
  Object.entries(semanticColors).forEach(([key, value]) => {
    properties[`--color-${key}`] = value;
  });
  
  // Gray scale
  Object.entries(grayScale).forEach(([key, value]) => {
    properties[`--color-gray-${key}`] = value;
  });
  
  return properties;
};

export type BrandColor = keyof typeof brandColors;
export type BlockchainColor = keyof typeof blockchainColors;
export type SecurityColor = keyof typeof securityColors;
export type UserTypeColor = keyof typeof userTypeColors;
export type SemanticColor = keyof typeof semanticColors;
export type GrayScale = keyof typeof grayScale;