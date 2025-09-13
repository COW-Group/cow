/**
 * COW Button Component
 * Glassmorphism-styled button with comprehensive variants
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Button variants using CVA
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - Sky Blue
        primary:
          'bg-sky-500 text-white shadow-md hover:bg-sky-600 active:bg-sky-700 focus-visible:ring-sky-500',
        
        // Secondary - Glass morphism
        secondary:
          'bg-white/70 text-gray-700 shadow-md border border-white/20 backdrop-blur-md hover:bg-white/80 active:bg-white/60 focus-visible:ring-sky-500',
        
        // Success - Growth Green
        success:
          'bg-green-600 text-white shadow-md hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500',
        
        // Warning - Sunset Gold
        warning:
          'bg-amber-500 text-white shadow-md hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-amber-500',
        
        // Error - Red
        error:
          'bg-red-500 text-white shadow-md hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500',
        
        // Ghost - Transparent
        ghost:
          'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500',
        
        // Outline - Bordered
        outline:
          'border border-gray-300 bg-transparent text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-sky-500',
        
        // Link - No background
        link:
          'text-sky-600 underline-offset-4 hover:underline focus-visible:ring-sky-500',
        
        // Blockchain variants
        ethereum:
          'bg-[#627EEA] text-white shadow-md hover:bg-[#5A75E8] active:bg-[#4F69E6] focus-visible:ring-[#627EEA]',
        
        polygon:
          'bg-[#8247E5] text-white shadow-md hover:bg-[#7A41E1] active:bg-[#713BDD] focus-visible:ring-[#8247E5]',
        
        solana:
          'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-md hover:from-[#8A3FE6] hover:to-[#12E087] focus-visible:ring-[#9945FF]',
        
        bitcoin:
          'bg-[#F7931A] text-white shadow-md hover:bg-[#E6850F] active:bg-[#D67A0A] focus-visible:ring-[#F7931A]',
      },
      
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Button component props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component */
  asChild?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
}

// Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />
        )}
        {!loading && leftIcon && (
          <span className=\"mr-2 flex items-center\">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className=\"ml-2 flex items-center\">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

// Export types
export type { ButtonProps };
export { buttonVariants };