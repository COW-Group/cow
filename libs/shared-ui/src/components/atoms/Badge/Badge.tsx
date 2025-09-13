/**
 * COW Badge Component
 * Status indicators and labels with semantic variants
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Badge variants using CVA
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        secondary: 'bg-gray-50 text-gray-600 border border-gray-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        error: 'bg-red-100 text-red-800 hover:bg-red-200',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        
        // Filled variants
        successFilled: 'bg-green-600 text-white hover:bg-green-700',
        warningFilled: 'bg-amber-500 text-white hover:bg-amber-600',
        errorFilled: 'bg-red-500 text-white hover:bg-red-600',
        infoFilled: 'bg-blue-500 text-white hover:bg-blue-600',
        
        // Brand variants
        wisdom: 'bg-[#F5E6D3] text-[#8B4513] hover:bg-[#F0DBC4]',
        earth: 'bg-[#8B4513] text-white hover:bg-[#7A3E12]',
        growth: 'bg-green-100 text-green-800 hover:bg-green-200',
        sky: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        sunset: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        
        // Blockchain variants
        ethereum: 'bg-[#627EEA]/10 text-[#627EEA] hover:bg-[#627EEA]/20',
        polygon: 'bg-[#8247E5]/10 text-[#8247E5] hover:bg-[#8247E5]/20',
        solana: 'bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 text-[#9945FF] hover:from-[#9945FF]/20 hover:to-[#14F195]/20',
        bitcoin: 'bg-[#F7931A]/10 text-[#F7931A] hover:bg-[#F7931A]/20',
        
        // Glassmorphism variant
        glass: 'bg-white/70 text-gray-700 border border-white/20 backdrop-blur-sm hover:bg-white/80',
      },
      
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      
      shape: {
        rounded: 'rounded-full',
        square: 'rounded',
        pill: 'rounded-full',
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded',
    },
  }
);

// Badge component props
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Show close button */
  onClose?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

// Badge component
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      leftIcon,
      rightIcon,
      onClose,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isClickable = onClick || onClose;

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape }),
          isClickable && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {leftIcon && (
          <span className=\"inline-flex items-center\">{leftIcon}</span>
        )}
        
        {children}
        
        {rightIcon && !onClose && (
          <span className=\"inline-flex items-center\">{rightIcon}</span>
        )}
        
        {onClose && (
          <button
            type=\"button\"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onClose();
            }}
            className=\"inline-flex items-center justify-center ml-1 h-3 w-3 rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-offset-1\"
            aria-label=\"Remove\"
          >
            <X className=\"h-2 w-2\" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge component for specific status indicators
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'success' | 'error' | 'warning';
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      online: { variant: 'success' as const, leftIcon: <div className=\"w-2 h-2 bg-green-500 rounded-full\" /> },
      offline: { variant: 'default' as const, leftIcon: <div className=\"w-2 h-2 bg-gray-400 rounded-full\" /> },
      away: { variant: 'warning' as const, leftIcon: <div className=\"w-2 h-2 bg-amber-500 rounded-full\" /> },
      busy: { variant: 'error' as const, leftIcon: <div className=\"w-2 h-2 bg-red-500 rounded-full\" /> },
      pending: { variant: 'warning' as const, leftIcon: <div className=\"w-2 h-2 bg-amber-500 rounded-full animate-pulse\" /> },
      success: { variant: 'success' as const, leftIcon: <div className=\"w-2 h-2 bg-green-500 rounded-full\" /> },
      error: { variant: 'error' as const, leftIcon: <div className=\"w-2 h-2 bg-red-500 rounded-full\" /> },
      warning: { variant: 'warning' as const, leftIcon: <div className=\"w-2 h-2 bg-amber-500 rounded-full\" /> },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        leftIcon={config.leftIcon}
        {...props}
      >
        {props.children || status}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Network Badge component for blockchain networks
export interface NetworkBadgeProps extends Omit<BadgeProps, 'variant'> {
  network: 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | 'generic';
  showIcon?: boolean;
}

export const NetworkBadge = React.forwardRef<HTMLSpanElement, NetworkBadgeProps>(
  ({ network, showIcon = true, children, ...props }, ref) => {
    const networkConfig = {
      ethereum: { 
        variant: 'ethereum' as const, 
        label: 'Ethereum',
        icon: <div className=\"w-2 h-2 bg-[#627EEA] rounded-full\" />
      },
      polygon: { 
        variant: 'polygon' as const, 
        label: 'Polygon',
        icon: <div className=\"w-2 h-2 bg-[#8247E5] rounded-full\" />
      },
      solana: { 
        variant: 'solana' as const, 
        label: 'Solana',
        icon: <div className=\"w-2 h-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full\" />
      },
      bitcoin: { 
        variant: 'bitcoin' as const, 
        label: 'Bitcoin',
        icon: <div className=\"w-2 h-2 bg-[#F7931A] rounded-full\" />
      },
      generic: { 
        variant: 'default' as const, 
        label: 'Blockchain',
        icon: <div className=\"w-2 h-2 bg-gray-500 rounded-full\" />
      },
    };

    const config = networkConfig[network];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        leftIcon={showIcon ? config.icon : undefined}
        {...props}
      >
        {children || config.label}
      </Badge>
    );
  }
);

NetworkBadge.displayName = 'NetworkBadge';

// Export types
export type { BadgeProps, StatusBadgeProps, NetworkBadgeProps };
export { badgeVariants };