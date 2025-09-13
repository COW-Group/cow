/**
 * COW Input Component
 * Glassmorphism-styled input with comprehensive variants
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Input variants using CVA
const inputVariants = cva(
  // Base styles
  'flex w-full rounded-md border border-gray-300 bg-white/90 backdrop-blur-sm px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-gray-50 border-gray-200',
        glass: 'bg-white/70 border-white/20 backdrop-blur-md',
        minimal: 'border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-sky-500',
      },
      
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      
      state: {
        default: '',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-amber-500 focus:border-amber-500 focus:ring-amber-500/20',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
);

// Input component props
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Label */
  label?: string;
  /** Required indicator */
  required?: boolean;
  /** Show password toggle for password inputs */
  showPasswordToggle?: boolean;
}

// Input component
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      type = 'text',
      leftElement,
      rightElement,
      helperText,
      error,
      label,
      required,
      showPasswordToggle,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);
    const inputId = id || React.useId();
    
    // Determine actual state based on error
    const actualState = error ? 'error' : state;
    
    // Handle password visibility toggle
    React.useEffect(() => {
      if (type === 'password' && showPasswordToggle) {
        setInputType(showPassword ? 'text' : 'password');
      } else {
        setInputType(type);
      }
    }, [type, showPassword, showPasswordToggle]);

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className=\"w-full\">
        {label && (
          <label 
            htmlFor={inputId}
            className=\"mb-2 block text-sm font-medium text-gray-700\"
          >
            {label}
            {required && <span className=\"ml-1 text-red-500\">*</span>}
          </label>
        )}
        
        <div className=\"relative\">
          {leftElement && (
            <div className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500\">
              {leftElement}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: actualState }),
              leftElement && 'pl-10',
              (rightElement || (type === 'password' && showPasswordToggle) || error) && 'pr-10',
              className
            )}
            {...props}
          />
          
          {/* Right side elements */}
          <div className=\"absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1\">
            {error && (
              <AlertCircle className=\"h-4 w-4 text-red-500\" />
            )}
            
            {type === 'password' && showPasswordToggle && !error && (
              <button
                type=\"button\"
                onClick={togglePassword}
                className=\"text-gray-500 hover:text-gray-700 focus:outline-none\"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className=\"h-4 w-4\" />
                ) : (
                  <Eye className=\"h-4 w-4\" />
                )}
              </button>
            )}
            
            {rightElement && !error && !(type === 'password' && showPasswordToggle) && (
              <div className=\"text-gray-500\">{rightElement}</div>
            )}
          </div>
        </div>
        
        {/* Helper text or error message */}
        {(helperText || error) && (
          <div className=\"mt-1 text-xs\">
            {error ? (
              <span className=\"text-red-600\">{error}</span>
            ) : (
              <span className=\"text-gray-500\">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Export types
export type { InputProps };
export { inputVariants };