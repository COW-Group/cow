import React, { useState } from 'react';
import {
  Settings,
  Plus,
  X,
  Search,
  Grid,
  List,
  Save,
  RefreshCw,
  Download,
  Upload,
  Star,
  Crown,
  ChevronDown,
  Filter
} from 'lucide-react';
import { WidgetConfig, Widget, WidgetType } from '../../types/widgets.types';
import { WIDGET_CONFIGS } from '../../config/widgets.config';
import { Button } from '../ui/Button';

interface WidgetCustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgets: Widget[];
  onWidgetToggle: (widgetType: WidgetType, enabled: boolean) => void;
  onWidgetAdd: (widgetType: WidgetType) => void;
  onLayoutSave: (name: string) => void;
  onLayoutReset: () => void;
  onLayoutExport: () => void;
  onLayoutImport: (layout: any) => void;
}

type ViewMode = 'grid' | 'list';
type FilterCategory = 'all' | 'productivity' | 'analytics' | 'collaboration' | 'utilities';

export function WidgetCustomizationMenu({
  isOpen,
  onClose,
  activeWidgets,
  onWidgetToggle,
  onWidgetAdd,
  onLayoutSave,
  onLayoutReset,
  onLayoutExport,
  onLayoutImport
}: WidgetCustomizationMenuProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['productivity', 'analytics']));

  if (!isOpen) return null;

  const availableWidgets = Object.values(WIDGET_CONFIGS);
  const activeWidgetTypes = new Set(activeWidgets.map(w => w.type));

  // Filter widgets based on search and category
  const filteredWidgets = availableWidgets.filter(widget => {
    const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group widgets by category
  const widgetsByCategory = filteredWidgets.reduce((acc, widget) => {
    const category = widget.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(widget);
    return acc;
  }, {} as Record<string, WidgetConfig[]>);

  const handleWidgetToggle = (widget: WidgetConfig) => {
    const isActive = activeWidgetTypes.has(widget.type);
    if (isActive) {
      onWidgetToggle(widget.type, false);
    } else {
      onWidgetAdd(widget.type);
    }
  };

  const handleSaveLayout = () => {
    if (layoutName.trim()) {
      onLayoutSave(layoutName.trim());
      setLayoutName('');
      setShowSaveDialog(false);
    }
  };

  const toggleCategoryExpanded = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const categoryIcons = {
    productivity: '🎯',
    analytics: '📊',
    collaboration: '👥',
    utilities: '🔧'
  };

  const categoryNames = {
    productivity: 'Productivity',
    analytics: 'Analytics',
    collaboration: 'Collaboration',
    utilities: 'Utilities'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl">
        {/* Main customization panel with enhanced liquid glass */}
        <div className="h-full liquid-glass-sidebar border-l border-white/20 shadow-2xl shadow-blue-500/10 overflow-hidden backdrop-blur-2xl" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)'
        }}>
        {/* Redesigned Header with Apple-style glass morphism */}
        <div className="relative overflow-hidden">
          {/* Header background with dynamic gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />

          <div className="relative p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <Settings className="w-7 h-7 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20">
                      <Star className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-adaptive-primary mb-1">Widget Studio</h2>
                  <p className="text-adaptive-secondary text-sm flex items-center gap-2">
                    <span>AI-powered workspace designer</span>
                    <span>•</span>
                    <span className="font-medium text-blue-400">{availableWidgets.length} widgets</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-xl liquid-glass-interactive border border-white/10 hover:border-white/20 flex items-center justify-center group transition-all duration-200 hover:bg-red-500/10"
                title="Close customization panel"
              >
                <X className="w-5 h-5 icon-adaptive-muted group-hover:text-red-400 transition-colors" />
              </button>
            </div>

            {/* Enhanced Smart Recommendations Banner */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl" />
              <div className="relative liquid-glass-section rounded-2xl p-4 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-xl blur-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-adaptive-primary mb-1">✨ AI Recommendation</div>
                    <div className="text-xs text-adaptive-muted">Based on your usage patterns, try the Calendar + Tasks combo</div>
                  </div>
                  <button className="px-4 py-2 liquid-button-primary rounded-xl text-sm font-medium hover:scale-105 transition-transform">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Controls Section */}
        <div className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/2" />
          <div className="relative p-6 space-y-6">
            {/* Enhanced Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 icon-adaptive-muted group-focus-within:text-blue-400 transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Search widgets or describe what you need..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm liquid-glass-interactive border border-white/10 focus:border-blue-400/30 transition-all backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)'
                    }}
                  />
                  {searchQuery && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <button
                        onClick={() => setSearchQuery('')}
                        className="w-6 h-6 rounded-full liquid-glass-interactive hover:bg-red-500/20 flex items-center justify-center transition-all hover:scale-110"
                        title="Clear search"
                      >
                        <X className="w-3 h-3 text-adaptive-muted hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as FilterCategory)}
                  className="relative appearance-none px-4 py-4 rounded-2xl pr-12 min-w-[160px] text-sm cursor-pointer liquid-glass-interactive border border-white/10 hover:border-purple-400/30 transition-all backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="productivity">🎯 Productivity</option>
                  <option value="analytics">📊 Analytics</option>
                  <option value="collaboration">👥 Collaboration</option>
                  <option value="utilities">🔧 Utilities</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 icon-adaptive-muted pointer-events-none" />
              </div>
            </div>

            {/* Modern View Mode and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 p-1.5 liquid-glass-sidebar rounded-2xl border border-white/10 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-400/30'
                      : 'icon-adaptive-muted hover:text-adaptive-primary liquid-glass-interactive hover:bg-white/5'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-400/30'
                      : 'icon-adaptive-muted hover:text-adaptive-primary liquid-glass-interactive hover:bg-white/5'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="liquid-button-secondary inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl group hover:scale-105 transition-all shadow-lg hover:shadow-green-500/10"
                  title="Save current layout"
                >
                  <Save className="w-4 h-4 mr-2 group-hover:text-green-400 transition-colors" />
                  Save Layout
                </button>
                <button
                  onClick={onLayoutReset}
                  className="liquid-button-secondary inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl group hover:scale-105 transition-all shadow-lg hover:shadow-orange-500/10"
                  title="Reset to default layout"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors" />
                  Reset
                </button>
              </div>
            </div>

            {/* Enhanced Status Bar with Apple-style indicators */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl blur-xl" />
              <div className="relative flex items-center justify-between liquid-glass-section rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-50" />
                    </div>
                    <span className="text-sm font-semibold text-adaptive-primary">{activeWidgets.length} Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-adaptive-muted">
                    <span className="font-medium text-blue-400">{filteredWidgets.length}</span>
                    <span>available</span>
                    {searchQuery && (
                      <>
                        <span>•</span>
                        <span className="italic">Results for "{searchQuery}"</span>
                      </>
                    )}
                  </div>
                </div>
                {filteredWidgets.length !== availableWidgets.length && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-3 py-1.5 liquid-glass-interactive rounded-xl text-blue-400 hover:text-blue-300 transition-all hover:scale-105 text-xs font-medium border border-blue-400/20 hover:border-blue-400/40"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Widget List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="space-y-6">
              {Object.entries(widgetsByCategory).map(([category, widgets]) => (
                <div key={category}>
                  <button
                    onClick={() => toggleCategoryExpanded(category)}
                    className="flex items-center gap-3 w-full text-left mb-4 group"
                  >
                    <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    <h3 className="text-lg font-semibold text-adaptive-primary group-hover:text-blue-400 transition-colors">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </h3>
                    <span className="text-sm text-adaptive-muted ml-2 px-2 py-0.5 rounded-full liquid-glass-interactive">({widgets.length})</span>
                    <ChevronDown
                      className={`w-4 h-4 icon-adaptive-muted ml-auto transition-all duration-200 group-hover:text-blue-400 ${
                        expandedCategories.has(category) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedCategories.has(category) && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {widgets.map((widget) => {
                        const isActive = activeWidgetTypes.has(widget.type);
                        return (
                          <div
                            key={widget.type}
                            className={`group relative liquid-glass-sidebar rounded-xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                              isActive
                                ? 'liquid-glass-selected shadow-lg shadow-blue-500/10'
                                : 'hover:border-white/20'
                            }`}
                            onClick={() => handleWidgetToggle(widget)}
                          >
                            {widget.premium && (
                              <div className="absolute -top-1 -right-1">
                                <Crown className="w-4 h-4 text-yellow-400" />
                              </div>
                            )}

                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-200">
                                {widget.icon}
                              </div>
                              <div className={`w-5 h-5 rounded-lg liquid-glass-interactive border-2 transition-all duration-200 flex items-center justify-center ${
                                isActive
                                  ? 'bg-blue-500/20 border-blue-400 shadow-sm shadow-blue-400/20'
                                  : 'border-white/20 hover:border-blue-400/50'
                              }`}>
                                {isActive && (
                                  <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            <h4 className="font-semibold text-adaptive-primary mb-2 text-sm group-hover:text-white transition-colors">{widget.title}</h4>
                            <p className="text-adaptive-secondary text-xs leading-relaxed group-hover:text-adaptive-muted transition-colors">{widget.description}</p>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2.5 py-1 liquid-glass-interactive rounded-lg text-adaptive-muted font-mono">
                                  {widget.defaultSize.width}×{widget.defaultSize.height}
                                </span>
                                {widget.resizable && (
                                  <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                                    Resizable
                                  </div>
                                )}
                              </div>
                              {isActive && (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  <Star className="w-3 h-3 fill-current" />
                                  Active
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWidgets.map((widget) => {
                const isActive = activeWidgetTypes.has(widget.type);
                return (
                  <div
                    key={widget.type}
                    className={`group flex items-center gap-4 p-4 liquid-glass-sidebar rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
                      isActive
                        ? 'liquid-glass-selected shadow-lg shadow-blue-500/10'
                        : 'hover:border-white/20'
                    }`}
                    onClick={() => handleWidgetToggle(widget)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-200">
                      {widget.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-adaptive-primary text-sm group-hover:text-white transition-colors">{widget.title}</h4>
                        {widget.premium && (
                          <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <Crown className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-adaptive-secondary text-xs group-hover:text-adaptive-muted transition-colors">{widget.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-lg liquid-glass-interactive border-2 transition-all duration-200 flex items-center justify-center ${
                      isActive
                        ? 'bg-blue-500/20 border-blue-400 shadow-sm shadow-blue-400/20'
                        : 'border-white/20 hover:border-blue-400/50'
                    }`}>
                      {isActive && (
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Drag widgets to reorder • Right-click for more options
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onLayoutExport}
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const layout = JSON.parse(event.target?.result as string);
                        onLayoutImport(layout);
                      } catch (error) {
                        console.error('Failed to import layout:', error);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
                className="hidden"
                id="layout-import"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('layout-import')?.click()}
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                Import
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Layout Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Save Layout</h3>
            <input
              type="text"
              placeholder="Enter layout name..."
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSaveLayout()}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSaveDialog(false);
                  setLayoutName('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveLayout}
                disabled={!layoutName.trim()}
              >
                Save Layout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}