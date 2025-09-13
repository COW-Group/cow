/**
 * COW Avatar Component
 * User representation with fallback and status indicators
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { User } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Avatar variants using CVA
const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-600',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
      
      variant: {
        circular: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
      },
      
      status: {
        none: '',
        online: 'ring-2 ring-green-500',
        offline: 'ring-2 ring-gray-400',
        away: 'ring-2 ring-amber-500',
        busy: 'ring-2 ring-red-500',
      },
    },
    
    defaultVariants: {
      size: 'md',
      variant: 'circular',
      status: 'none',
    },
  }
);

// Status dot variants
const statusDotVariants = cva(
  'absolute bottom-0 right-0 rounded-full border-2 border-white',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
        '2xl': 'h-5 w-5',
      },
      
      status: {
        none: 'hidden',
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-amber-500',
        busy: 'bg-red-500',
      },
    },
    
    defaultVariants: {
      size: 'md',
      status: 'none',
    },
  }
);

// Avatar component props
export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Show status indicator */
  showStatus?: boolean;
}

// Generate initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Avatar component
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      variant,
      status,
      src,
      alt,
      fallback,
      showStatus = false,
      ...props
    },
    ref
  ) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageLoaded(false);
      setImageError(true);
    };

    const showImage = src && imageLoaded && !imageError;
    const showFallback = !showImage;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, status: showStatus ? status : 'none', className }))}
        {...props}
      >
        {/* Image */}
        {src && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              'h-full w-full object-cover',
              showImage ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Fallback content */}
        {showFallback && (
          <div className=\"flex h-full w-full items-center justify-center\">
            {fallback ? (
              <span className=\"font-medium select-none\">
                {fallback.length > 2 ? getInitials(fallback) : fallback}
              </span>
            ) : (
              <User className=\"h-1/2 w-1/2\" />
            )}
          </div>
        )}

        {/* Status indicator */}
        {showStatus && status && status !== 'none' && (
          <div
            className={cn(statusDotVariants({ size, status }))}
            aria-hidden=\"true\"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group component for multiple avatars
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before showing count */
  max?: number;
  /** Total number of avatars (for +N display) */
  total?: number;
  /** Avatar size */
  size?: VariantProps<typeof avatarVariants>['size'];
  /** Spacing between avatars */
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 3, total, size = 'md', spacing = 'normal', children, ...props }, ref) => {
    const spacingMap = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: '-space-x-3',
    };

    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = total ? total - max : childrenArray.length - max;

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingMap[spacing], className)}
        {...props}
      >
        {visibleChildren}
        
        {remainingCount > 0 && (
          <Avatar
            size={size}
            fallback={`+${remainingCount}`}
            className=\"bg-gray-200 text-gray-600 font-medium z-0\"
          />
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

// Export types
export type { AvatarProps, AvatarGroupProps };
export { avatarVariants, statusDotVariants };