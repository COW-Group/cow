import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Circle, 
  Bell, 
  Search, 
  HelpCircle, 
  Cloud, 
  MoreVertical 
} from 'lucide-react';

interface AppHeaderProps {
  onToggleTheme?: () => void;
}

export function AppHeader({ onToggleTheme }: AppHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Logo and brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Circle className="h-6 w-6 fill-orange-500 text-orange-500" />
            <span className="text-base font-bold text-black dark:text-white">
              COW CRM
            </span>
          </div>
        </div>

        {/* Right side - Icons and avatar */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </div>

          {/* Search */}
          <Search className="h-5 w-5 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors" />

          {/* Q Icon (QuestionMark approximation) */}
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
            <span className="text-xs text-white font-bold">Q</span>
          </div>

          {/* Help */}
          <HelpCircle className="h-5 w-5 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors" />

          {/* Cloud */}
          <Cloud className="h-5 w-5 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors" />

          {/* More menu */}
          <MoreVertical className="h-5 w-5 text-gray-500 hover:text-teal-500 cursor-pointer transition-colors" />

          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center cursor-pointer">
            <span className="text-sm text-white font-medium">LP</span>
          </div>
        </div>
      </div>
    </div>
  );
}