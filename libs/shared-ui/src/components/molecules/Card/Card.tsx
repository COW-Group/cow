/**
 * COW Card Component
 * Glassmorphism-styled card container with comprehensive variants
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Card variants using CVA
const cardVariants = cva(
  'rounded-lg border shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        // Glass morphism variants
        glass: 'bg-white/70 border-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
        glassStrong: 'bg-white/80 border-white/30 backdrop-blur-lg shadow-[0_12px_40px_rgba(0,0,0,0.15)]',
        glassSubtle: 'bg-white/60 border-white/10 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
        
        // Solid variants
        default: 'bg-white border-gray-200 shadow-sm',
        elevated: 'bg-white border-gray-200 shadow-lg',
        outlined: 'bg-white border-gray-300 shadow-none',
        
        // Brand variants
        wisdom: 'bg-gradient-to-br from-[#F5E6D3] to-white border-[#8B4513]/20 shadow-[0_8px_32px_rgba(139,69,19,0.1)]',
        earth: 'bg-gradient-to-br from-[#8B4513]/10 to-white border-[#8B4513]/30',
        growth: 'bg-gradient-to-br from-green-50 to-white border-green-200',
        sky: 'bg-gradient-to-br from-blue-50 to-white border-blue-200',
        sunset: 'bg-gradient-to-br from-amber-50 to-white border-amber-200',
        
        // Status variants
        success: 'bg-green-50 border-green-200 shadow-[0_8px_32px_rgba(0,183,116,0.1)]',
        warning: 'bg-amber-50 border-amber-200 shadow-[0_8px_32px_rgba(255,184,0,0.1)]',
        error: 'bg-red-50 border-red-200 shadow-[0_8px_32px_rgba(255,68,68,0.1)]',
        info: 'bg-blue-50 border-blue-200 shadow-[0_8px_32px_rgba(98,126,234,0.1)]',
        
        // Interactive variants
        interactive: 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer',
        interactiveGlass: 'bg-white/70 border-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/80 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] cursor-pointer',
      },
      
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
        none: 'p-0',
      },
      
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'lg',
    },
  }
);

// Card component props
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Make card focusable */
  focusable?: boolean;
  /** Disable hover effects */
  disableHover?: boolean;
}

// Main Card component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      focusable = false,
      disableHover = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, radius }),
          focusable && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
          className
        )}
        tabIndex={focusable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show border at bottom */
  bordered?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          bordered && 'border-b border-gray-200 pb-4 mb-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Title component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    const Comp = `h${level}` as const;
    
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight text-gray-900',
          level === 1 && 'text-2xl',
          level === 2 && 'text-xl',
          level === 3 && 'text-lg',
          level === 4 && 'text-base',
          level === 5 && 'text-sm',
          level === 6 && 'text-xs',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Description component
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 leading-relaxed', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

// Card Content component
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// Card Footer component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show border at top */
  bordered?: boolean;
  /** Footer alignment */
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = false, align = 'right', children, ...props }, ref) => {
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          alignmentClasses[align],
          bordered && 'border-t border-gray-200 pt-4 mt-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// Blockchain Card component for crypto-specific content
export interface BlockchainCardProps extends CardProps {
  /** Blockchain network */
  network?: 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
  /** Show network indicator */
  showNetwork?: boolean;
  /** Transaction hash or address */
  hash?: string;
  /** Show copy button for hash */
  copyable?: boolean;
}

export const BlockchainCard = React.forwardRef<HTMLDivElement, BlockchainCardProps>(
  (
    {
      network,
      showNetwork = true,
      hash,
      copyable = true,
      children,
      className,
      variant = 'glass',
      ...props
    },
    ref
  ) => {
    const networkColors = {
      ethereum: 'border-[#627EEA]/30 bg-gradient-to-br from-[#627EEA]/5 to-white',
      polygon: 'border-[#8247E5]/30 bg-gradient-to-br from-[#8247E5]/5 to-white',
      solana: 'border-[#9945FF]/30 bg-gradient-to-br from-[#9945FF]/5 to-white',
      bitcoin: 'border-[#F7931A]/30 bg-gradient-to-br from-[#F7931A]/5 to-white',
    };

    const truncateHash = (hash: string) => {
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn(
          network && networkColors[network],
          className
        )}
        {...props}
      >
        {showNetwork && network && (
          <div className=\"mb-3 flex items-center gap-2\">
            <div className={cn(
              'h-2 w-2 rounded-full',
              network === 'ethereum' && 'bg-[#627EEA]',
              network === 'polygon' && 'bg-[#8247E5]',
              network === 'solana' && 'bg-[#9945FF]',
              network === 'bitcoin' && 'bg-[#F7931A]'
            )} />
            <span className=\"text-xs font-medium text-gray-600 capitalize\">
              {network}
            </span>
          </div>
        )}
        
        {children}
        
        {hash && (
          <div className=\"mt-3 pt-3 border-t border-gray-200/50\">
            <div className=\"flex items-center justify-between text-xs text-gray-500\">
              <span>Hash:</span>
              <div className=\"flex items-center gap-2\">
                <code className=\"font-mono\">{truncateHash(hash)}</code>
                {copyable && (
                  <button
                    onClick={() => copyToClipboard(hash)}
                    className=\"hover:text-gray-700 transition-colors\"
                    title=\"Copy full hash\"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

BlockchainCard.displayName = 'BlockchainCard';

// Export types
export type { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardFooterProps, 
  BlockchainCardProps 
};
export { cardVariants };