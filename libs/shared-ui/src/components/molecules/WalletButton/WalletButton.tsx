/**
 * COW Wallet Button Component
 * Blockchain wallet connection with network detection
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Wallet, ChevronDown, Power, AlertCircle } from 'lucide-react';
import { Button, type ButtonProps } from '../../atoms/Button';
import { Badge, NetworkBadge } from '../../atoms/Badge';
import { Avatar } from '../../atoms/Avatar';
import { cn } from '../../../utils/cn';

// Wallet connection states
type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error';

// Supported wallet types
type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | 'generic';

// Supported networks
type Network = 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | 'generic';

// Wallet button variants
const walletButtonVariants = cva(
  'relative min-w-[120px] justify-between',
  {
    variants: {
      state: {
        disconnected: '',
        connecting: 'opacity-75',
        connected: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
        error: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      },
    },
    defaultVariants: {
      state: 'disconnected',
    },
  }
);

// Wallet button props
export interface WalletButtonProps
  extends Omit<ButtonProps, 'variant' | 'leftIcon' | 'rightIcon'> {
  /** Current wallet connection state */
  state?: WalletState;
  /** Connected wallet type */
  walletType?: WalletType;
  /** Current network */
  network?: Network;
  /** Wallet address */
  address?: string;
  /** Balance to display */
  balance?: string;
  /** Balance symbol */
  balanceSymbol?: string;
  /** Show network indicator */
  showNetwork?: boolean;
  /** Show balance */
  showBalance?: boolean;
  /** Show dropdown indicator */
  showDropdown?: boolean;
  /** Connection callback */
  onConnect?: () => void;
  /** Disconnection callback */
  onDisconnect?: () => void;
  /** Network switch callback */
  onSwitchNetwork?: (network: Network) => void;
  /** Custom wallet icon */
  walletIcon?: React.ReactNode;
  /** Error message */
  error?: string;
}

// Wallet icons mapping
const walletIcons = {
  metamask: '🦊',
  walletconnect: '🔗',
  coinbase: '🟦',
  phantom: '👻',
  generic: '👛',
};

// Format address for display
const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format balance for display
const formatBalance = (balance: string, symbol: string): string => {
  if (!balance) return '';
  const num = parseFloat(balance);
  if (isNaN(num)) return balance;
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M ${symbol}`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K ${symbol}`;
  } else if (num >= 1) {
    return `${num.toFixed(2)} ${symbol}`;
  } else {
    return `${num.toFixed(4)} ${symbol}`;
  }
};

// Main Wallet Button component
export const WalletButton = React.forwardRef<HTMLButtonElement, WalletButtonProps>(
  (
    {
      className,
      state = 'disconnected',
      walletType = 'generic',
      network = 'ethereum',
      address,
      balance,
      balanceSymbol = 'ETH',
      showNetwork = true,
      showBalance = true,
      showDropdown = true,
      onConnect,
      onDisconnect,
      onSwitchNetwork,
      walletIcon,
      error,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = () => {
      if (state === 'disconnected') {
        onConnect?.();
      } else if (state === 'connected') {
        setIsOpen(!isOpen);
      }
    };

    const handleDisconnect = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDisconnect?.();
      setIsOpen(false);
    };

    const handleNetworkSwitch = (newNetwork: Network) => {
      onSwitchNetwork?.(newNetwork);
      setIsOpen(false);
    };

    // Render disconnected state
    if (state === 'disconnected') {
      return (
        <Button
          ref={ref}
          variant=\"outline\"
          onClick={handleClick}
          leftIcon={walletIcon || <Wallet className=\"h-4 w-4\" />}
          className={cn(walletButtonVariants({ state }), className)}
          {...props}
        >
          {children || 'Connect Wallet'}
        </Button>
      );
    }

    // Render connecting state
    if (state === 'connecting') {
      return (
        <Button
          ref={ref}
          variant=\"outline\"
          loading
          disabled
          className={cn(walletButtonVariants({ state }), className)}
          {...props}
        >
          Connecting...
        </Button>
      );
    }

    // Render error state
    if (state === 'error') {
      return (
        <Button
          ref={ref}
          variant=\"outline\"
          onClick={handleClick}
          leftIcon={<AlertCircle className=\"h-4 w-4\" />}
          className={cn(walletButtonVariants({ state }), className)}
          title={error}
          {...props}
        >
          {error || 'Connection Error'}
        </Button>
      );
    }

    // Render connected state
    return (
      <div className=\"relative\">
        <Button
          ref={ref}
          variant=\"outline\"
          onClick={handleClick}
          className={cn(
            walletButtonVariants({ state }),
            'min-w-[200px] justify-between px-3',
            className
          )}
          {...props}
        >
          <div className=\"flex items-center gap-2 min-w-0 flex-1\">
            {/* Wallet Type Indicator */}
            <div className=\"flex items-center gap-1.5\">
              {walletIcon || (
                <span className=\"text-sm\">{walletIcons[walletType]}</span>
              )}
              
              {/* Network Badge */}
              {showNetwork && (
                <NetworkBadge network={network} size=\"sm\" />
              )}
            </div>

            {/* Address and Balance */}
            <div className=\"flex flex-col items-start min-w-0\">
              {address && (
                <span className=\"text-xs font-mono text-gray-600 truncate\">
                  {formatAddress(address)}
                </span>
              )}
              {showBalance && balance && (
                <span className=\"text-xs font-medium text-gray-800\">
                  {formatBalance(balance, balanceSymbol)}
                </span>
              )}
            </div>
          </div>

          {/* Dropdown Indicator */}
          {showDropdown && (
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform ml-2',
              isOpen && 'rotate-180'
            )} />
          )}
        </Button>

        {/* Dropdown Menu */}
        {isOpen && showDropdown && (
          <div className=\"absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 backdrop-blur-sm\">
            <div className=\"p-3 border-b border-gray-100\">
              <div className=\"flex items-center gap-3\">
                <Avatar
                  size=\"sm\"
                  fallback={address ? address.slice(0, 2).toUpperCase() : '??'}
                />
                <div className=\"min-w-0 flex-1\">
                  <p className=\"text-sm font-medium text-gray-900\">
                    {walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet
                  </p>
                  {address && (
                    <p className=\"text-xs font-mono text-gray-500 truncate\">
                      {address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Network Selection */}
            {onSwitchNetwork && (
              <div className=\"p-2\">
                <p className=\"text-xs font-medium text-gray-700 px-2 py-1\">
                  Switch Network
                </p>
                {['ethereum', 'polygon', 'solana'].map((net) => (
                  <button
                    key={net}
                    onClick={() => handleNetworkSwitch(net as Network)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded hover:bg-gray-50',
                      network === net && 'bg-blue-50 text-blue-700'
                    )}
                  >
                    <NetworkBadge network={net as Network} size=\"sm\" />
                    <span className=\"capitalize\">{net}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Disconnect Button */}
            <div className=\"p-2 border-t border-gray-100\">
              <button
                onClick={handleDisconnect}
                className=\"w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 rounded hover:bg-red-50\"
              >
                <Power className=\"h-4 w-4\" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

WalletButton.displayName = 'WalletButton';

// Export types
export type { WalletButtonProps, WalletState, WalletType, Network };
export { walletButtonVariants };