import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  Download,
  Star,
  Shield,
  ExternalLink,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Zap,
  Grid3x3,
  Settings,
  Heart,
  ChevronDown,
  X,
  Tag
} from 'lucide-react';
import { useAppStore } from '../../stores/app.store';
import { App, AppCategory, AppScope } from '../../types/app.types';
import { Button } from '../ui/Button';

interface AppMarketplaceProps {
  scope?: AppScope;
  targetId?: string;
  onAppInstalled?: (app: App) => void;
  className?: string;
}

export function AppMarketplace({
  scope = 'workspace',
  targetId,
  onAppInstalled,
  className = ''
}: AppMarketplaceProps) {
  const {
    apps,
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
    selectApp,
    closeAppDetails,
    loadApps,
    getFilteredApps,
    isAppInstalled
  } = useAppStore();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'name'>('popular');

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const filteredApps = getFilteredApps();

  // Sort apps
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleInstallApp = async (appId: string) => {
    try {
      await installApp(appId, scope, targetId);
      const app = apps.find(a => a.id === appId);
      if (app && onAppInstalled) {
        onAppInstalled(app);
      }
    } catch (error) {
      console.error('Failed to install app:', error);
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
      'finance': <DollarSign className="h-4 w-4" />,
      'custom': <Settings className="h-4 w-4" />
    };
    return icons[category];
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'board-view': 'bg-blue-100 text-blue-800',
      'widget': 'bg-green-100 text-green-800',
      'integration': 'bg-purple-100 text-purple-800',
      'workflow': 'bg-orange-100 text-orange-800',
      'data-tool': 'bg-pink-100 text-pink-800',
      'communication': 'bg-indigo-100 text-indigo-800',
      'custom': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const renderAppCard = (app: App) => {
    const installed = isAppInstalled(app.id, scope, targetId);
    const installing = installInProgress.includes(app.id);

    return (
      <motion.div
        key={app.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        {...({ className: "bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group" } as any)}
        onClick={() => selectApp(app.id)}
      >
        {/* App Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm"
              style={{ backgroundColor: app.color || '#4F46E5' }}
            >
              {app.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                {app.isOfficial && (
                  <Shield className="h-4 w-4 text-blue-500" title="Official App" />
                )}
                {app.isFeatured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" title="Featured" />
                )}
              </div>
              <p className="text-sm text-gray-600">{app.developer}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{app.rating}</span>
          </div>
        </div>

        {/* App Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {app.shortDescription}
        </p>

        {/* App Tags */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(app.type)}`}>
            {app.type.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {getCategoryIcon(app.category)}
            <span className="capitalize">{app.category.replace('-', ' ')}</span>
          </div>
        </div>

        {/* App Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{app.downloads.toLocaleString()} installs</span>
          <span>{app.reviewCount} reviews</span>
        </div>

        {/* App Actions */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
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
                handleInstallApp(app.id);
              }}
              disabled={installing}
              className="min-w-[80px]"
            >
              {installing ? (
                <>
                  <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full" />
                  Installing
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
      </motion.div>
    );
  };

  const renderFilters = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          {...({ className: "bg-white border border-gray-200 rounded-lg p-4 space-y-4" } as any)}
        >
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => filterApps({ ...filters, category: undefined })}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  !filters.category
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => filterApps({ ...filters, category })}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center gap-1 ${
                    filters.category === category
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <div className="flex gap-2">
              {['all', 'free', 'paid'].map(price => (
                <button
                  key={price}
                  onClick={() => filterApps({ ...filters, price: price as any })}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    (filters.price || 'all') === price
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {price === 'all' ? 'All Prices' : price === 'free' ? 'Free' : 'Paid'}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
            <div className="flex gap-2">
              {[4.5, 4.0, 3.5, 3.0].map(rating => (
                <button
                  key={rating}
                  onClick={() => filterApps({ ...filters, rating })}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center gap-1 ${
                    filters.rating === rating
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Star className="h-3 w-3 fill-current" />
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">App Marketplace</h2>
            <p className="text-gray-600">Discover apps to enhance your workspace</p>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps by name, category, or functionality..."
              value={searchQuery}
              onChange={(e) => searchApps(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="name">Name A-Z</option>
          </select>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {renderFilters()}

        {/* Active Filters */}
        {(searchQuery || Object.keys(filters).length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Search className="h-3 w-3" />
                "{searchQuery}"
                <button onClick={() => searchApps('')} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.category && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {getCategoryIcon(filters.category)}
                {filters.category}
                <button
                  onClick={() => filterApps({ ...filters, category: undefined })}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.price && filters.price !== 'all' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <DollarSign className="h-3 w-3" />
                {filters.price}
                <button
                  onClick={() => filterApps({ ...filters, price: undefined })}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Star className="h-3 w-3 fill-current" />
                {filters.rating}+ stars
                <button
                  onClick={() => filterApps({ ...filters, rating: undefined })}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Featured Apps */}
      {featuredApps.length > 0 && !searchQuery && Object.keys(filters).length === 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            Featured Apps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.slice(0, 6).map(renderAppCard)}
          </div>
        </div>
      )}

      {/* All Apps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Apps ({sortedApps.length})
        </h3>

        {sortedApps.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApps.map(renderAppCard)}
          </div>
        )}
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start gap-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                      style={{ backgroundColor: selectedApp.color || '#4F46E5' }}
                    >
                      {selectedApp.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900">{selectedApp.name}</h2>
                        {selectedApp.isOfficial && (
                          <Shield className="h-6 w-6 text-blue-500" title="Official App" />
                        )}
                        {selectedApp.isFeatured && (
                          <Star className="h-6 w-6 text-yellow-500 fill-current" title="Featured" />
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mb-3">{selectedApp.developer}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-lg">{selectedApp.rating}</span>
                          <span className="text-gray-500">({selectedApp.reviewCount} reviews)</span>
                        </div>
                        <span className="text-gray-500">
                          {selectedApp.downloads.toLocaleString()} downloads
                        </span>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedApp.type)}`}>
                          {selectedApp.type.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeAppDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About this app</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedApp.description}</p>
                  </div>

                  {selectedApp.tags.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.permissions.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Permissions</h3>
                      <div className="space-y-2">
                        {selectedApp.permissions.map((permission, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {permission.type} access to {permission.resource}
                              </div>
                              <div className="text-sm text-gray-600">{permission.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedApp.price === 0 ? 'Free' : `$${selectedApp.price}`}
                    </div>

                    <div className="flex items-center gap-4">
                      {isAppInstalled(selectedApp.id, scope, targetId) ? (
                        <Button size="lg" disabled className="min-w-[160px]">
                          <Download className="h-5 w-5 mr-2" />
                          Already Installed
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={() => handleInstallApp(selectedApp.id)}
                          disabled={installInProgress.includes(selectedApp.id)}
                          className="min-w-[160px]"
                        >
                          {installInProgress.includes(selectedApp.id) ? (
                            <>
                              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                              Installing...
                            </>
                          ) : (
                            <>
                              <Download className="h-5 w-5 mr-2" />
                              Install App
                            </>
                          )}
                        </Button>
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