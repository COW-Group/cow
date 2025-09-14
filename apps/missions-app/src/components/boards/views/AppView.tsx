import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Download,
  Star,
  Search,
  Filter,
  Grid3x3,
  List,
  Settings,
  Plus,
  ExternalLink,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import { useAppStore } from '../../../stores/app.store';
import { App, AppCategory, AppType, AppScope, InstalledApp } from '../../../types/app.types';
import { Button } from '../../ui/Button';

interface AppViewProps {
  boardId: string;
  workspaceId: string;
}

type ViewMode = 'grid' | 'list';
type AppSection = 'marketplace' | 'installed' | 'recommended';

export function AppView({ boardId, workspaceId }: AppViewProps) {
  const {
    apps,
    installedApps,
    featuredApps,
    categories,
    filters,
    searchQuery,
    isLoading,
    installInProgress,
    selectedApp,
    showAppDetails,
    searchApps,
    filterApps,
    clearFilters,
    installApp,
    uninstallApp,
    selectApp,
    closeAppDetails,
    loadApps,
    loadInstalledApps,
    getFilteredApps,
    getInstalledAppsByScope,
    isAppInstalled
  } = useAppStore();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeSection, setActiveSection] = useState<AppSection>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | null>(null);

  useEffect(() => {
    loadApps();
    loadInstalledApps();
  }, [loadApps, loadInstalledApps]);

  const filteredApps = getFilteredApps();
  const boardInstalledApps = getInstalledAppsByScope('board', boardId);
  const workspaceInstalledApps = getInstalledAppsByScope('workspace', workspaceId);

  const handleInstallApp = async (appId: string, scope: AppScope) => {
    try {
      const targetId = scope === 'board' ? boardId : workspaceId;
      await installApp(appId, scope, targetId);
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleUninstallApp = async (installedAppId: string) => {
    try {
      await uninstallApp(installedAppId);
    } catch (error) {
      console.error('Failed to uninstall app:', error);
    }
  };

  const getCategoryIcon = (category: AppCategory) => {
    const icons: Record<AppCategory, React.ReactNode> = {
      'productivity': <Zap className="h-4 w-4" />,
      'analytics': <TrendingUp className="h-4 w-4" />,
      'communication': <Users className="h-4 w-4" />,
      'integration': <ExternalLink className="h-4 w-4" />,
      'automation': <Settings className="h-4 w-4" />,
      'project-management': <Grid3x3 className="h-4 w-4" />,
      'marketing': <Heart className="h-4 w-4" />,
      'sales': <TrendingUp className="h-4 w-4" />,
      'hr': <Users className="h-4 w-4" />,
      'finance': <TrendingUp className="h-4 w-4" />,
      'custom': <Settings className="h-4 w-4" />
    };
    return icons[category];
  };

  const renderAppCard = (app: App) => {
    const installed = isAppInstalled(app.id);
    const installing = installInProgress.includes(app.id);

    return (
      <motion.div
        key={app.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...({ className: "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer" } as any)}
        onClick={() => selectApp(app.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
              {app.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{app.name}</h3>
                {app.isOfficial && (
                  <Shield className="h-4 w-4 text-blue-500" title="Official App" />
                )}
                {app.isFeatured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" title="Featured" />
                )}
              </div>
              <p className="text-sm text-gray-500">{app.developer}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{app.rating}</span>
              <span className="text-xs text-gray-400">({app.reviewCount})</span>
            </div>
            <div className="text-xs text-gray-400">
              {app.downloads.toLocaleString()} installs
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {app.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(app.category)}
            <span className="text-xs text-gray-500 capitalize">
              {app.category.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900">
              {app.price === 0 ? 'Free' : `$${app.price}`}
            </div>

            {installed ? (
              <Button size="sm" variant="secondary" disabled>
                <Download className="h-3 w-3 mr-1" />
                Installed
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstallApp(app.id, 'board');
                }}
                disabled={installing}
              >
                {installing ? (
                  <>
                    <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Install
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderInstalledApp = (installedApp: InstalledApp) => {
    return (
      <motion.div
        key={installedApp.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...({ className: "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all" } as any)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-lg">
              {installedApp.app.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{installedApp.app.name}</h3>
              <p className="text-sm text-gray-500">
                Installed {new Date(installedApp.installedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs ${
              installedApp.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {installedApp.status}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUninstallApp(installedApp.id)}
            >
              Uninstall
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {installedApp.app.shortDescription}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Used {installedApp.usageCount} times</span>
          {installedApp.lastUsed && (
            <span>
              Last used {new Date(installedApp.lastUsed).toLocaleDateString()}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'marketplace':
        return (
          <div className="space-y-6">
            {/* Featured Apps */}
            {featuredApps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Apps</h3>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                }>
                  {featuredApps.slice(0, 6).map(renderAppCard)}
                </div>
              </div>
            )}

            {/* All Apps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Apps ({filteredApps.length})
              </h3>
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }>
                {filteredApps.map(renderAppCard)}
              </div>
            </div>
          </div>
        );

      case 'installed':
        const allInstalledApps = [...boardInstalledApps, ...workspaceInstalledApps];

        if (allInstalledApps.length === 0) {
          return (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No apps installed</h3>
              <p className="text-gray-500 mb-6">Browse the marketplace to find apps for your board</p>
              <Button onClick={() => setActiveSection('marketplace')}>
                <Store className="h-4 w-4 mr-2" />
                Browse Apps
              </Button>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {boardInstalledApps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Board Apps ({boardInstalledApps.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boardInstalledApps.map(renderInstalledApp)}
                </div>
              </div>
            )}

            {workspaceInstalledApps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Workspace Apps ({workspaceInstalledApps.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspaceInstalledApps.map(renderInstalledApp)}
                </div>
              </div>
            )}
          </div>
        );

      case 'recommended':
        // Show apps based on board content, similar apps to installed ones, etc.
        const recommendedApps = apps.filter(app =>
          app.category === 'productivity' || app.category === 'project-management'
        ).slice(0, 6);

        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
            <p className="text-gray-600 mb-6">Based on your board type and workspace activity</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedApps.map(renderAppCard)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Store className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Board Apps</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-4">
          <Button
            variant={activeSection === 'marketplace' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('marketplace')}
          >
            <Store className="h-4 w-4 mr-2" />
            Marketplace
          </Button>
          <Button
            variant={activeSection === 'installed' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('installed')}
          >
            <Download className="h-4 w-4 mr-2" />
            Installed
            {(boardInstalledApps.length + workspaceInstalledApps.length) > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                {boardInstalledApps.length + workspaceInstalledApps.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeSection === 'recommended' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('recommended')}
          >
            <Star className="h-4 w-4 mr-2" />
            Recommended
          </Button>
        </div>

        {/* Search and Filters */}
        {activeSection === 'marketplace' && (
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => searchApps(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filters.category || ''}
                onChange={(e) => filterApps({
                  ...filters,
                  category: e.target.value as AppCategory || undefined
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <select
                value={filters.price || 'all'}
                onChange={(e) => filterApps({
                  ...filters,
                  price: e.target.value as 'free' | 'paid' | 'all'
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Loading apps...</span>
            </div>
          ) : (
            renderSectionContent()
          )}
        </div>
      </div>

      {/* App Details Modal */}
      <AnimatePresence>
        {showAppDetails && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeAppDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                      {selectedApp.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
                        {selectedApp.isOfficial && (
                          <Shield className="h-5 w-5 text-blue-500" title="Official App" />
                        )}
                        {selectedApp.isFeatured && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current" title="Featured" />
                        )}
                      </div>
                      <p className="text-gray-600">{selectedApp.developer}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedApp.rating}</span>
                          <span className="text-gray-500">({selectedApp.reviewCount} reviews)</span>
                        </div>
                        <span className="text-gray-500">
                          {selectedApp.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeAppDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedApp.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedApp.price === 0 ? 'Free' : `$${selectedApp.price}`}
                    </div>

                    <div className="flex items-center gap-3">
                      {isAppInstalled(selectedApp.id) ? (
                        <Button disabled>
                          <Download className="h-4 w-4 mr-2" />
                          Already Installed
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleInstallApp(selectedApp.id, 'workspace')}
                            disabled={installInProgress.includes(selectedApp.id)}
                          >
                            Install to Workspace
                          </Button>
                          <Button
                            onClick={() => handleInstallApp(selectedApp.id, 'board')}
                            disabled={installInProgress.includes(selectedApp.id)}
                          >
                            {installInProgress.includes(selectedApp.id) ? (
                              <>
                                <div className="animate-spin h-4 w-4 mr-2 border border-white border-t-transparent rounded-full" />
                                Installing...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Install to Board
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}