import React, { useEffect, useState } from 'react';
import { Download, Settings, Play, Trash2, Star, Users, Calendar, Search, Filter } from 'lucide-react';
import { useMaunAppsStore, type MaunApp } from '../../store/maun-apps.store';
import { Button } from '../ui/Button';

interface MaunAppMarketplaceProps {
  onClose: () => void;
  boardId?: string;
  workspaceId?: string;
}

export function MaunAppMarketplace({ onClose, boardId, workspaceId }: MaunAppMarketplaceProps) {
  const {
    availableApps,
    installedApps,
    initializeApps,
    installApp,
    uninstallApp,
    launchApp,
    isAppInstalled
  } = useMaunAppsStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initializeApps();
  }, [initializeApps]);

  const categories = [
    { id: 'all', name: 'All Apps', icon: '📱' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'wellness', name: 'Wellness', icon: '🌱' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'health', name: 'Health', icon: '❤️' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const filteredApps = availableApps.filter(app => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstallApp = (appId: string) => {
    installApp(appId);
  };

  const handleUninstallApp = (appId: string) => {
    uninstallApp(appId);
  };

  const handleLaunchApp = (appId: string) => {
    launchApp(appId, {
      boardId,
      workspaceId,
      onClose
    });
    onClose();
  };

  const getInstallStats = () => {
    const total = availableApps.length;
    const installed = installedApps.length;
    return { total, installed };
  };

  const stats = getInstallStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Maun App Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Powerful productivity and wellness tools from Maun App 7
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {stats.installed} installed
            </span>
            <span>{stats.total} available apps</span>
          </div>
        </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            isInstalled={isAppInstalled(app.id)}
            onInstall={() => handleInstallApp(app.id)}
            onUninstall={() => handleUninstallApp(app.id)}
            onLaunch={() => handleLaunchApp(app.id)}
          />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No apps found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
}

interface AppCardProps {
  app: MaunApp;
  isInstalled: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onLaunch: () => void;
}

function AppCard({ app, isInstalled, onInstall, onUninstall, onLaunch }: AppCardProps) {
  const categoryColors = {
    productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    wellness: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    analytics: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    health: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    finance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    social: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      {/* App Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{app.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {app.name}
            </h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              categoryColors[app.category] || 'bg-gray-100 text-gray-700'
            }`}>
              {app.category}
            </span>
          </div>
        </div>
        {isInstalled && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
            <Download className="h-4 w-4" />
            Installed
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {app.description}
      </p>

      {/* Stats */}
      {isInstalled && app.usageCount > 0 && (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {app.usageCount} uses
          </span>
          {app.lastUsed && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(app.lastUsed).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isInstalled ? (
          <Button onClick={onInstall} size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Install
          </Button>
        ) : (
          <>
            <Button onClick={onLaunch} size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Launch
            </Button>
            <Button
              onClick={onUninstall}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}