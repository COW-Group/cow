import React, { useState } from 'react';
import { 
  Diamond, 
  Bell, 
  Settings, 
  Search, 
  HelpCircle, 
  MoreVertical 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AppHeaderProps {
  onSettingsClick?: () => void;
  onSearchClick?: () => void;
  onHelpClick?: () => void;
  notifications?: number;
}

export function AppHeader({ 
  onSettingsClick, 
  onSearchClick, 
  onHelpClick,
  notifications = 0 
}: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const headerIcons = [
    { 
      icon: Bell, 
      label: 'Notifications', 
      onClick: () => console.log('Notifications'),
      badge: notifications > 0 ? notifications : undefined
    },
    { icon: Settings, label: 'Settings', onClick: onSettingsClick },
    { icon: Search, label: 'Search', onClick: onSearchClick },
    { icon: HelpCircle, label: 'Help', onClick: onHelpClick },
    { icon: MoreVertical, label: 'More options', onClick: () => console.log('More') }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12 bg-transparent flex items-center justify-between px-6">
      {/* Left side - Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Diamond className="h-6 w-6 text-teal-500" />
          <h1 className="text-base font-bold text-black dark:text-white">
            COW CRM
          </h1>
        </div>
      </div>

      {/* Right side - Icons and User */}
      <div className="flex items-center gap-4">
        {headerIcons.map(({ icon: Icon, label, onClick, badge }) => (
          <button
            key={label}
            onClick={onClick}
            className="relative p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title={label}
            aria-label={label}
          >
            <Icon className="h-5 w-5" />
            {badge && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </button>
        ))}
        
        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-shadow"
            aria-label="User menu"
          >
            LP
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Likhitha Palaypu</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">likhitha@example.com</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}