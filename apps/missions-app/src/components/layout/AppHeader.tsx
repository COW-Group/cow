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
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="liquid-glass-sidebar rounded-2xl px-8 py-4 flex items-center gap-8 shadow-lg">
        {/* Left side - Logo and brand */}
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/05 transition-colors px-4 py-2 rounded-xl" onClick={() => navigate('/')}>
          <Circle className="h-7 w-7 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-bold text-adaptive-primary tracking-tight">
            COW
          </span>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-white/10"></div>

        {/* Right side - Icons and avatar */}
        <div className="flex items-center space-x-1">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationsClick}
              className="relative p-2.5 icon-adaptive-muted hover:bg-white/08 transition-colors rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-3 w-80 liquid-glass-sidebar rounded-2xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-adaptive-primary">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-white/05 transition-colors cursor-pointer rounded-lg mx-2">
                    <p className="text-sm text-adaptive-primary">New lead added to CRM</p>
                    <p className="text-xs text-adaptive-muted">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/05 transition-colors cursor-pointer rounded-lg mx-2">
                    <p className="text-sm text-adaptive-primary">Board updated: Sales Pipeline</p>
                    <p className="text-xs text-adaptive-muted">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/05 transition-colors cursor-pointer rounded-lg mx-2">
                    <p className="text-sm text-adaptive-primary">New comment on task</p>
                    <p className="text-xs text-adaptive-muted">3 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="p-2.5 icon-adaptive-muted hover:bg-white/08 transition-colors rounded-xl"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2.5 icon-adaptive-muted hover:bg-white/08 transition-colors rounded-xl"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            onClick={handleHelpClick}
            className="p-2.5 icon-adaptive-muted hover:bg-white/08 transition-colors rounded-xl"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Avatar with User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-600/80 flex items-center justify-center cursor-pointer hover:bg-white/08 transition-colors border border-white/20"
              aria-label="User menu"
            >
              <span className="text-sm text-white font-medium">LP</span>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-48 liquid-glass-sidebar rounded-2xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-adaptive-primary">Likhitha Palaypu</p>
                  <p className="text-xs text-adaptive-muted">likhitha@example.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/settings');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-adaptive-secondary hover:bg-white/05 hover:text-adaptive-primary transition-colors rounded-lg mx-2 mt-1"
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/settings');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-adaptive-secondary hover:bg-white/05 hover:text-adaptive-primary transition-colors rounded-lg mx-2"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Sign out functionality - navigate to home
                    navigate('/');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-adaptive-secondary hover:bg-white/05 hover:text-adaptive-primary transition-colors rounded-lg mx-2 mb-1"
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