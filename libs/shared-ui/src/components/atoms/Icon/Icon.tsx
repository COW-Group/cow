/**
 * COW Icon Component
 * Consistent icon sizing and styling with Lucide React
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Icon variants using CVA
const iconVariants = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    },
    
    color: {
      current: 'text-current',
      inherit: 'text-inherit',
      default: 'text-gray-500',
      muted: 'text-gray-400',
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
  },
  
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

// Icon component props
export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'size' | 'color'>,
    VariantProps<typeof iconVariants> {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Accessible label */
  label?: string;
}

// Icon component
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size, color, icon: IconComponent, label, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, color, className }))}
        aria-label={label}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

// Convenience wrapper for common blockchain icons
export interface BlockchainIconProps extends Omit<IconProps, 'icon'> {
  network: 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | 'generic';
}

export const BlockchainIcon = React.forwardRef<SVGSVGElement, BlockchainIconProps>(
  ({ network, color, ...props }, ref) => {
    // Note: In a real implementation, you'd import actual blockchain icons
    // For now, using placeholder icons from Lucide
    const iconMap = {
      ethereum: () => (
        <svg viewBox=\"0 0 24 24\" className={cn(iconVariants({ size: props.size, color: color || 'ethereum' }))}>
          <path fill=\"currentColor\" d=\"M12 0L5.5 12.25L12 16.5L18.5 12.25L12 0ZM12 24L5.5 13.75L12 18L18.5 13.75L12 24Z\" />
        </svg>
      ),
      polygon: () => (
        <svg viewBox=\"0 0 24 24\" className={cn(iconVariants({ size: props.size, color: color || 'polygon' }))}>
          <path fill=\"currentColor\" d=\"M12 0L2 7v10l10 7 10-7V7L12 0zm0 22l-8-5.6V7.6L12 2l8 5.6v8.8L12 22z\" />
        </svg>
      ),
      solana: () => (
        <svg viewBox=\"0 0 24 24\" className={cn(iconVariants({ size: props.size, color: color || 'solana' }))}>
          <path fill=\"currentColor\" d=\"M4 8h13l-2-2h2l3 3-3 3h-2l2-2H4V8zm0 8h13l-2 2h2l3-3-3-3h-2l2 2H4v2z\" />
        </svg>
      ),
      bitcoin: () => (
        <svg viewBox=\"0 0 24 24\" className={cn(iconVariants({ size: props.size, color: color || 'bitcoin' }))}>
          <path fill=\"currentColor\" d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\" />
        </svg>
      ),
      generic: () => (
        <svg viewBox=\"0 0 24 24\" className={cn(iconVariants({ size: props.size, color: color || 'default' }))}>
          <circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" />
          <path fill=\"currentColor\" d=\"M8 12h8M12 8v8\" />
        </svg>
      ),
    };

    const IconComponent = iconMap[network];

    return (
      <IconComponent
        ref={ref}
        {...props}
      />
    );
  }
);

BlockchainIcon.displayName = 'BlockchainIcon';

// Export types
export type { IconProps, BlockchainIconProps };
export { iconVariants };