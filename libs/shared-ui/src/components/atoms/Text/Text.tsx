/**
 * COW Text Component
 * Typography component with semantic variants
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Text variants using CVA
const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-medium tracking-tight',
      h6: 'scroll-m-20 text-base font-medium tracking-tight',
      p: 'leading-7',
      lead: 'text-xl text-gray-600 leading-relaxed',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-gray-500',
      caption: 'text-xs text-gray-500',
      code: 'relative rounded bg-gray-100 px-2 py-1 font-mono text-sm font-medium',
      display: 'text-6xl font-black tracking-tighter lg:text-8xl',
    },
    
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-500',
      subtle: 'text-gray-600',
      inverse: 'text-white',
      
      // Brand colors
      wisdom: 'text-[#8B4513]',
      earth: 'text-[#8B4513]',
      growth: 'text-green-600',
      sky: 'text-[#627EEA]',
      sunset: 'text-[#FFB800]',
      
      // Semantic colors
      success: 'text-green-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      info: 'text-blue-600',
      
      // Blockchain colors
      ethereum: 'text-[#627EEA]',
      polygon: 'text-[#8247E5]',
      solana: 'text-[#9945FF]',
      bitcoin: 'text-[#F7931A]',
    },
    
    weight: {
      thin: 'font-thin',
      extraLight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semiBold: 'font-semibold',
      bold: 'font-bold',
      extraBold: 'font-extrabold',
      black: 'font-black',
    },
    
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    
    decoration: {
      none: 'no-underline',
      underline: 'underline',
      lineThrough: 'line-through',
    },
    
    transform: {
      none: 'normal-case',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
    
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  
  defaultVariants: {
    variant: 'p',
    color: 'default',
    weight: 'normal',
    align: 'left',
    decoration: 'none',
    transform: 'none',
    truncate: false,
  },
});

// Element mapping for semantic variants
const elementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p',
  caption: 'span',
  code: 'code',
  display: 'h1',
} as const;

// Text component props
export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  /** Render as child component */
  asChild?: boolean;
  /** Custom HTML element */
  as?: keyof JSX.IntrinsicElements;
}

// Text component
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant = 'p',
      color,
      weight,
      align,
      decoration,
      transform,
      truncate,
      asChild = false,
      as,
      ...props
    },
    ref
  ) => {
    const Comp = asChild 
      ? Slot 
      : (as || elementMap[variant as keyof typeof elementMap] || 'div');

    return (
      <Comp
        className={cn(
          textVariants({
            variant,
            color,
            weight,
            align,
            decoration,
            transform,
            truncate,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

// Convenience components for common text elements
export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }
>(({ level = 1, ...props }, ref) => {
  const variant = `h${level}` as const;
  return <Text ref={ref} variant={variant} {...props} />;
});

Heading.displayName = 'Heading';

export const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  Omit<TextProps, 'variant'>
>((props, ref) => {
  return <Text ref={ref} variant=\"p\" {...props} />;
});

Paragraph.displayName = 'Paragraph';

export const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TextProps, 'variant'>
>((props, ref) => {
  return <Text ref={ref} variant=\"caption\" {...props} />;
});

Caption.displayName = 'Caption';

export const Code = React.forwardRef<
  HTMLElement,
  Omit<TextProps, 'variant'>
>((props, ref) => {
  return <Text ref={ref} variant=\"code\" {...props} />;
});

Code.displayName = 'Code';

// Export types
export type { TextProps };
export { textVariants };