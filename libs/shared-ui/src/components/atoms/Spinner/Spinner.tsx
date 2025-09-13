/**
 * COW Spinner Component
 * Loading indicators with various styles
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Spinner variants using CVA
const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    
    color: {
      current: 'text-current',
      primary: 'text-sky-600',
      secondary: 'text-gray-600',
      success: 'text-green-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      white: 'text-white',
      muted: 'text-gray-400',
    },
    
    variant: {
      default: '',
      dots: '',
      pulse: '',
      bounce: '',
    },
  },
  
  defaultVariants: {
    size: 'md',
    color: 'current',
    variant: 'default',
  },
});

// Spinner component props
export interface SpinnerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'size' | 'color'>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label */
  label?: string;
}

// Default spinner component
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, color, variant, label = 'Loading...', ...props }, ref) => {
    if (variant === 'dots') {
      return <DotsSpinner size={size} color={color} className={className} label={label} />;
    }
    
    if (variant === 'pulse') {
      return <PulseSpinner size={size} color={color} className={className} label={label} />;
    }
    
    if (variant === 'bounce') {
      return <BounceSpinner size={size} color={color} className={className} label={label} />;
    }

    return (
      <Loader2
        ref={ref}
        className={cn(spinnerVariants({ size, color, variant, className }))}
        aria-label={label}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

// Dots spinner component
export const DotsSpinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, label = 'Loading...', ...props }, ref) => {
    const sizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const dotSizeMap = {
      xs: 'w-0.5 h-0.5',
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
      xl: 'w-3 h-3',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-1', sizeMap[size || 'md'], className)}
        aria-label={label}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-pulse',
              dotSizeMap[size || 'md'],
              spinnerVariants({ color })
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s',
              backgroundColor: 'currentColor',
            }}
          />
        ))}
      </div>
    );
  }
);

DotsSpinner.displayName = 'DotsSpinner';

// Pulse spinner component
export const PulseSpinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, label = 'Loading...', ...props }, ref) => {
    const sizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-full border-2 border-current opacity-75 animate-ping',
          sizeMap[size || 'md'],
          spinnerVariants({ color }),
          className
        )}
        aria-label={label}
        {...props}
      />
    );
  }
);

PulseSpinner.displayName = 'PulseSpinner';

// Bounce spinner component
export const BounceSpinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, label = 'Loading...', ...props }, ref) => {
    const sizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const dotSizeMap = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-1', sizeMap[size || 'md'], className)}
        aria-label={label}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-bounce',
              dotSizeMap[size || 'md'],
              spinnerVariants({ color })
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              backgroundColor: 'currentColor',
            }}
          />
        ))}
      </div>
    );
  }
);

BounceSpinner.displayName = 'BounceSpinner';

// Loading overlay component
export interface LoadingOverlayProps {
  /** Show the overlay */
  show: boolean;
  /** Loading text */
  text?: string;
  /** Spinner variant */
  variant?: SpinnerProps['variant'];
  /** Spinner size */
  size?: SpinnerProps['size'];
  /** Custom className */
  className?: string;
  /** Children to overlay */
  children?: React.ReactNode;
}

export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ show, text = 'Loading...', variant = 'default', size = 'lg', className, children }, ref) => {
    if (!show && !children) return null;

    return (
      <div ref={ref} className={cn('relative', className)}>
        {children}
        
        {show && (
          <div className=\"absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50\">
            <div className=\"flex flex-col items-center gap-3\">
              <Spinner variant={variant} size={size} color=\"primary\" />
              {text && (
                <p className=\"text-sm text-gray-600 font-medium\">{text}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// Export types
export type { SpinnerProps, LoadingOverlayProps };
export { spinnerVariants };