/**
 * COW Animation System
 * Consistent timing and easing for microinteractions
 */

// Animation Durations
export const durations = {
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slowest: '1000ms',
} as const;

// Easing Functions
export const easings = {
  linear: 'linear',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// Animation Presets
export const animations = {
  // Fade animations
  fadeIn: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
  fadeOut: {
    duration: durations.normal,
    easing: easings.easeIn,
    keyframes: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
  },
  
  // Slide animations
  slideInUp: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { transform: 'translateY(100%)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
  },
  slideInDown: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { transform: 'translateY(-100%)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
  },
  slideInLeft: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { transform: 'translateX(-100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
  },
  slideInRight: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { transform: 'translateX(100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
  },
  
  // Scale animations
  scaleIn: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { transform: 'scale(0.8)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
  },
  scaleOut: {
    duration: durations.fast,
    easing: easings.easeIn,
    keyframes: {
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.8)', opacity: 0 },
    },
  },
  
  // Bounce animations
  bounceIn: {
    duration: durations.slow,
    easing: easings.bounce,
    keyframes: {
      from: { transform: 'scale(0.3)', opacity: 0 },
      '50%': { transform: 'scale(1.05)', opacity: 1 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
  },
  
  // Spin animation
  spin: {
    duration: durations.slowest,
    easing: easings.linear,
    keyframes: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    iterationCount: 'infinite',
  },
  
  // Pulse animation
  pulse: {
    duration: durations.slow,
    easing: easings.easeInOut,
    keyframes: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    iterationCount: 'infinite',
  },
  
  // Heartbeat animation (for COW mascot)
  heartbeat: {
    duration: '2s',
    easing: easings.easeInOut,
    keyframes: {
      '0%, 100%': { transform: 'scale(1)' },
      '14%': { transform: 'scale(1.05)' },
      '28%': { transform: 'scale(1)' },
      '42%': { transform: 'scale(1.05)' },
      '70%': { transform: 'scale(1)' },
    },
    iterationCount: 'infinite',
  },
  
  // Blockchain transaction animations
  transactionPending: {
    duration: '1.5s',
    easing: easings.easeInOut,
    keyframes: {
      '0%': { transform: 'translateX(-100%)', opacity: 0 },
      '50%': { transform: 'translateX(0)', opacity: 1 },
      '100%': { transform: 'translateX(100%)', opacity: 0 },
    },
    iterationCount: 'infinite',
  },
  
  // Glass morphism hover effect
  glassHover: {
    duration: durations.normal,
    easing: easings.easeOut,
    keyframes: {
      from: { 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      to: { 
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
} as const;

// Transition presets for common properties
export const transitions = {
  colors: `color ${durations.normal} ${easings.easeInOut}, background-color ${durations.normal} ${easings.easeInOut}, border-color ${durations.normal} ${easings.easeInOut}`,
  transform: `transform ${durations.normal} ${easings.easeOut}`,
  opacity: `opacity ${durations.normal} ${easings.easeInOut}`,
  shadow: `box-shadow ${durations.normal} ${easings.easeOut}`,
  size: `width ${durations.normal} ${easings.easeOut}, height ${durations.normal} ${easings.easeOut}`,
  all: `all ${durations.normal} ${easings.easeInOut}`,
  glass: `backdrop-filter ${durations.normal} ${easings.easeOut}, background-color ${durations.normal} ${easings.easeOut}`,
} as const;

// Export unified animation system
export const animationSystem = {
  durations,
  easings,
  animations,
  transitions,
} as const;

// CSS Custom Properties Generator
export const createAnimationCSSProperties = () => {
  const properties: Record<string, string> = {};
  
  // Durations
  Object.entries(durations).forEach(([key, value]) => {
    properties[`--duration-${key}`] = value;
  });
  
  // Easings
  Object.entries(easings).forEach(([key, value]) => {
    properties[`--easing-${key}`] = value;
  });
  
  // Transitions
  Object.entries(transitions).forEach(([key, value]) => {
    properties[`--transition-${key}`] = value;
  });
  
  return properties;
};

// Animation utility functions
export const createKeyframes = (name: string, keyframes: Record<string, any>) => {
  return `@keyframes ${name} {
    ${Object.entries(keyframes).map(([key, value]) => {
      const styles = Object.entries(value as Record<string, any>)
        .map(([prop, val]) => `${prop}: ${val}`)
        .join('; ');
      return `${key} { ${styles} }`;
    }).join('\\n    ')}
  }`;
};

export const createAnimation = (
  keyframeName: string,
  duration: string = durations.normal,
  easing: string = easings.easeInOut,
  iterationCount: string = '1',
  fillMode: string = 'forwards'
) => {
  return `${keyframeName} ${duration} ${easing} ${iterationCount} ${fillMode}`;
};

export type Duration = keyof typeof durations;
export type Easing = keyof typeof easings;
export type Animation = keyof typeof animations;
export type Transition = keyof typeof transitions;