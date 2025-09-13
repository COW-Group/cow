/**
 * Animation Utility Functions
 * Helper functions for animations and transitions
 */

import { durations, easings, type Duration, type Easing } from '../tokens/animations';

// Create CSS transition
export const createTransition = (
  properties: string | string[],
  duration: Duration = 'normal',
  easing: Easing = 'easeInOut',
  delay?: Duration
): string => {
  const props = Array.isArray(properties) ? properties : [properties];
  const transitions = props.map(prop => {
    const parts = [prop, durations[duration], easings[easing]];
    if (delay) parts.push(durations[delay]);
    return parts.join(' ');
  });
  
  return transitions.join(', ');
};

// Create keyframe animation
export const createKeyframeAnimation = (
  name: string,
  duration: Duration = 'normal',
  easing: Easing = 'easeInOut',
  iterationCount: number | 'infinite' = 1,
  fillMode: 'none' | 'forwards' | 'backwards' | 'both' = 'forwards'
): string => {
  return `${name} ${durations[duration]} ${easings[easing]} ${iterationCount} ${fillMode}`;
};

// Stagger animation delays
export const createStaggerDelay = (
  index: number,
  baseDelay: number = 100,
  maxDelay: number = 500
): string => {
  const delay = Math.min(index * baseDelay, maxDelay);
  return `${delay}ms`;
};

// Spring animation helper
export const createSpringTransition = (
  properties: string | string[],
  tension: number = 300,
  friction: number = 30
): string => {
  // Convert spring physics to cubic-bezier approximation
  const damping = friction / (2 * Math.sqrt(tension));
  const frequency = Math.sqrt(tension) / (2 * Math.PI);
  
  // Approximate cubic-bezier based on spring physics
  const x1 = damping > 1 ? 0.4 : 0.175;
  const y1 = damping > 1 ? 0 : 0.885;
  const x2 = damping > 1 ? 0.2 : 0.32;
  const y2 = damping > 1 ? 1 : 1.275;
  
  const duration = Math.max(200, 1000 / frequency);
  
  const props = Array.isArray(properties) ? properties : [properties];
  const transitions = props.map(prop => 
    `${prop} ${duration}ms cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
  );
  
  return transitions.join(', ');
};

// Animation state manager
export class AnimationController {
  private animations = new Set<string>();
  
  add(animationName: string): void {
    this.animations.add(animationName);
  }
  
  remove(animationName: string): void {
    this.animations.delete(animationName);
  }
  
  has(animationName: string): boolean {
    return this.animations.has(animationName);
  }
  
  clear(): void {
    this.animations.clear();
  }
  
  getActive(): string[] {
    return Array.from(this.animations);
  }
}

// Reduced motion helper
export const respectsReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Safe animation wrapper
export const safeAnimate = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions
): Animation | null => {
  if (respectsReducedMotion()) {
    // Apply final state immediately if reduced motion is preferred
    const finalFrame = keyframes[keyframes.length - 1];
    Object.assign(element.style, finalFrame);
    return null;
  }
  
  if (!element.animate) {
    return null;
  }
  
  return element.animate(keyframes, options);
};

// Intersection observer for scroll animations
export const createScrollAnimation = (
  element: HTMLElement,
  animationClass: string,
  threshold: number = 0.1,
  rootMargin: string = '0px'
): IntersectionObserver | null => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
        }
      });
    },
    { threshold, rootMargin }
  );
  
  observer.observe(element);
  return observer;
};