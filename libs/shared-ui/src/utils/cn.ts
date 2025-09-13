/**
 * Class Name Utility
 * Combines clsx and tailwind-merge for optimal class handling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with proper Tailwind CSS conflict resolution
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a variant-based class name generator
 * @param base - Base class names
 * @param variants - Variant configurations
 * @param compoundVariants - Compound variant rules
 * @param defaultVariants - Default variant values
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T,
  compoundVariants?: Array<{
    [K in keyof T]?: keyof T[K];
  } & { class: string }>,
  defaultVariants?: {
    [K in keyof T]?: keyof T[K];
  }
) {
  return (props?: {
    [K in keyof T]?: keyof T[K];
  } & { class?: string }) => {
    const variantClasses = Object.entries(variants).map(([variantName, variantOptions]) => {
      const selectedVariant = props?.[variantName as keyof T] || defaultVariants?.[variantName as keyof T];
      return selectedVariant ? variantOptions[selectedVariant as string] : '';
    });

    const compoundClasses = compoundVariants?.filter(compound => {
      return Object.entries(compound).every(([key, value]) => {
        if (key === 'class') return true;
        return props?.[key as keyof T] === value;
      });
    }).map(compound => compound.class) || [];

    return cn(base, ...variantClasses, ...compoundClasses, props?.class);
  };
}