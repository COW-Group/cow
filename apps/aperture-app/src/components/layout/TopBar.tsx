import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  ChevronDown,
  User,
  Moon,
  Sun,
  Monitor,
  LogOut
} from 'lucide-react';
import { useAppStore, useWorkspaceStore } from '@/store';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

export function TopBar() {
  const { 
    toggleSidebar, 
    theme, 
    setTheme, 
    currentUser,
    setCurrentUser,
    openModal 
  } = useAppStore();
  
  const { currentWorkspace } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ];

  const userMenuOptions = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'theme', label: 'Theme', submenu: themeOptions },
    { id: 'divider', label: '---' },
    { id: 'logout', label: 'Log out', icon: LogOut },
  ];

  const handleCreateNew = () => {
    openModal('create-menu', {
      title: 'Create New',
      options: [
        { id: 'project', label: 'Project', icon: Plus },
        { id: 'task', label: 'Task', icon: Plus },
        { id: 'goal', label: 'Goal', icon: Plus },
        { id: 'board', label: 'Board', icon: Plus },
      ]
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      openModal('search-results', {
        title: 'Search Results',
        query: searchQuery
      });
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          {currentWorkspace && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600">
                    {currentWorkspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentWorkspace.name}
                </h1>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, goals..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateNew}
          className="hidden sm:flex"
        >
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>

        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>

        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">
                    {currentUser?.fullName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          }
          items={userMenuOptions}
          onItemClick={(item) => {
            if (item.id === 'profile') {
              openModal('user-profile');
            } else if (item.id === 'settings') {
              openModal('user-settings');
            } else if (item.id === 'logout') {
              setCurrentUser(null);
            } else if (themeOptions.find(t => t.id === item.id)) {
              setTheme(item.id as 'light' | 'dark' | 'system');
            }
          }}
        />
      </div>
    </header>
  );
}