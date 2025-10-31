import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--button-blue)',
      color: 'var(--white)',
      border: 'none'
    },
    secondary: {
      backgroundColor: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'var(--white)',
      border: 'none'
    }
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      className={cn(
        baseClasses,
        sizes[size],
        className
      )}
      style={variantStyles[variant]}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </motion.button>
  );
}