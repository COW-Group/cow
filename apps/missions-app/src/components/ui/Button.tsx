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
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md';

  const variants = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg focus:ring-yellow-500 ring-offset-black',
    secondary: 'bg-gray-900/50 text-white hover:bg-gray-800 hover:shadow-lg focus:ring-gray-500 backdrop-blur-md border border-gray-800 ring-offset-black',
    ghost: 'text-gray-400 hover:bg-gray-900/50 hover:text-white hover:backdrop-blur-md hover:shadow-md focus:ring-gray-500 ring-offset-black',
    outline: 'border border-gray-600 text-white hover:bg-gray-800 hover:shadow-lg focus:ring-gray-500 backdrop-blur-md bg-transparent ring-offset-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-500 backdrop-blur-md ring-offset-black',
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
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
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