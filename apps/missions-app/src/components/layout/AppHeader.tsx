import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Circle,
  Bell,
  Search,
  HelpCircle,
  Settings,
  MoreVertical
} from 'lucide-react';

interface AppHeaderProps {
  onToggleTheme?: () => void;
}

export function AppHeader({ onToggleTheme }: AppHeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearchClick = () => {
    // For now, navigate to my-work with search focus
    navigate('/my-work');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked'); // Can navigate to settings page when created
  };

  const handleMoreClick = () => {
    console.log('More options clicked');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Logo and brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Circle className="h-6 w-6 fill-orange-500 text-orange-500" />
            <span className="text-base font-bold text-black dark:text-white">
              COW CRM
            </span>
          </div>
        </div>

        {/* Right side - Icons and avatar */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationsClick}
              className="p-1 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm text-gray-900 dark:text-white">New lead added to CRM</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm text-gray-900 dark:text-white">Board updated: Sales Pipeline</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm text-gray-900 dark:text-white">New comment on task</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="p-1 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-1 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            onClick={handleHelpClick}
            className="p-1 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* More menu */}
          <button
            onClick={handleMoreClick}
            className="p-1 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Avatar with User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors"
              aria-label="User menu"
            >
              <span className="text-sm text-white font-medium">LP</span>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Likhitha Palaypu</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">likhitha@example.com</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Account Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
}