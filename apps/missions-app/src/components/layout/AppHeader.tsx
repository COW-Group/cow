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
import { useAppTheme } from '../../hooks/useAppTheme';
import { ThemeToggle } from '../theme/ThemeToggle';

interface AppHeaderProps {
  onToggleTheme?: () => void;
}

export function AppHeader({ onToggleTheme }: AppHeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { classes } = useAppTheme();

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearchClick = () => {
    // Navigate to my-office with search focus
    navigate('/app/my-office');
  };

  const handleHelpClick = () => {
    navigate('/app/help');
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  const handleMoreClick = () => {
    console.log('More options clicked');
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="glass-header rounded-full px-6 py-3 flex items-center gap-6">
        {/* Left side - Logo and brand */}
        <div className="flex items-center space-x-3 cursor-pointer smooth-hover px-3 py-2 rounded-full" onClick={() => navigate('/')}>
          <Circle className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span className={`text-xl font-bold ${classes.text.primary} tracking-tight`}>
            COW
          </span>
        </div>

        {/* Right side - Icons and avatar */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationsClick}
              className={`p-2 ${classes.text.muted} ${classes.hover.accent} smooth-hover rounded-full ${classes.hover.bg}`}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 top-full mt-2 w-80 glass-modal rounded-2xl shadow-lg py-2 z-50`}>
                <div className={`px-4 py-2 border-b ${classes.border.default}`}>
                  <h3 className={`text-sm font-semibold ${classes.text.primary}`}>Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className={`px-4 py-3 ${classes.hover.card} cursor-pointer`}>
                    <p className={`text-sm ${classes.text.primary}`}>New lead added to CRM</p>
                    <p className={`text-xs ${classes.text.muted}`}>2 minutes ago</p>
                  </div>
                  <div className={`px-4 py-3 ${classes.hover.card} cursor-pointer`}>
                    <p className={`text-sm ${classes.text.primary}`}>Board updated: Sales Pipeline</p>
                    <p className={`text-xs ${classes.text.muted}`}>1 hour ago</p>
                  </div>
                  <div className={`px-4 py-3 ${classes.hover.card} cursor-pointer`}>
                    <p className={`text-sm ${classes.text.primary}`}>New comment on task</p>
                    <p className={`text-xs ${classes.text.muted}`}>3 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className={`p-2 ${classes.text.muted} ${classes.hover.accent} smooth-hover rounded-full ${classes.hover.bg}`}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className={`p-2 ${classes.text.muted} ${classes.hover.accent} smooth-hover rounded-full ${classes.hover.bg}`}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            onClick={handleHelpClick}
            className={`p-2 ${classes.text.muted} ${classes.hover.accent} smooth-hover rounded-full ${classes.hover.bg}`}
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Avatar with User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`h-8 w-8 rounded-full ${classes.bg.secondary} flex items-center justify-center cursor-pointer ${classes.hover.bg} smooth-hover ${classes.border.muted} border`}
              aria-label="User menu"
            >
              <span className={`text-sm ${classes.text.primary} font-medium`}>LP</span>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 glass-modal rounded-2xl shadow-lg py-2 z-50`}>
                <div className={`px-4 py-2 border-b ${classes.border.default}`}>
                  <p className={`text-sm font-medium ${classes.text.primary}`}>Likhitha Palaypu</p>
                  <p className={`text-xs ${classes.text.muted}`}>likhitha@example.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/settings');
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${classes.text.muted} ${classes.hover.card} ${classes.hover.accent}`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/settings');
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${classes.text.muted} ${classes.hover.card} ${classes.hover.accent}`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Sign out functionality - navigate to home
                    navigate('/');
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${classes.text.muted} ${classes.hover.card} ${classes.hover.accent}`}
                >
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