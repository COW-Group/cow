import React, { useState, useEffect } from 'react';
import { WidgetCustomizationMenu } from '../components/widgets/WidgetCustomizationMenu';
import { WidgetContainer } from '../components/widgets/WidgetContainer';
import { renderWidget } from '../components/widgets/WidgetRegistry';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { SmartLayoutSuggestions } from '../components/widgets/SmartLayoutSuggestions';
import { Settings, HelpCircle, Compass, Star, Play, Brain, Sparkles } from 'lucide-react';
import {
  MyWorkData,
  Assignment
} from '../types/mywork.types';
import { Widget, WidgetType, WidgetLayout } from '../types/widgets.types';
import { WIDGET_CONFIGS, DEFAULT_WIDGETS } from '../config/widgets.config';
import { WidgetPersistenceService } from '../services/widget-persistence.service';
import { WidgetRecommendationService, WidgetRecommendation } from '../services/widget-recommendations.service';
import { useAppStore } from '../store/app.store';

// Mock API function - replace with actual API call
const fetchMyWorkData = async (): Promise<MyWorkData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - initially empty, can be populated for testing
  const mockAssignments: Assignment[] = [];

  return {
    assignments: mockAssignments,
    totalCount: mockAssignments.length,
    pendingCount: mockAssignments.filter(a => !a.isCompleted).length,
    completedCount: mockAssignments.filter(a => a.isCompleted).length
  };
};

export function MyOffice() {
  const { currentUser, setCurrentUser } = useAppStore();
  const [data, setData] = useState<MyWorkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<Widget[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [currentWalkthroughStep, setCurrentWalkthroughStep] = useState(0);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [widgetsInitialized, setWidgetsInitialized] = useState(false);

  // Note: User is now initialized by useAuth hook in AppHeader
  // No need for mock user here

  // Initialize widgets from persistence or defaults - ONLY ONCE
  useEffect(() => {
    if (!widgetsInitialized && currentUser) {
      // Try to load saved layout first
      const savedWidgets = WidgetPersistenceService.loadCurrentLayout(currentUser.id);

      if (savedWidgets && savedWidgets.length > 0) {
        setActiveWidgets(savedWidgets);
      } else {
        // Fall back to default widgets only if no saved layout exists
        const defaultWidgets: Widget[] = DEFAULT_WIDGETS.map((widgetType, index) => ({
          id: `widget-${widgetType}-${Date.now()}`,
          type: widgetType as WidgetType,
          title: WIDGET_CONFIGS[widgetType].title,
          enabled: true,
          position: {
            x: index % 3,
            y: Math.floor(index / 3),
            width: WIDGET_CONFIGS[widgetType].defaultSize.width,
            height: WIDGET_CONFIGS[widgetType].defaultSize.height
          },
          settings: {}
        }));
        setActiveWidgets(defaultWidgets);
      }
      setWidgetsInitialized(true);
    }
  }, [widgetsInitialized, currentUser]);

  // Save widgets whenever they change (including when all are removed)
  useEffect(() => {
    if (widgetsInitialized && currentUser) {
      WidgetPersistenceService.saveCurrentLayout(currentUser.id, activeWidgets);
    }
  }, [activeWidgets, currentUser, widgetsInitialized]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchMyWorkData();
        setData(result);
      } catch (error) {
        console.error('Failed to load My Work data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Widget management functions
  const handleWidgetToggle = (widgetType: WidgetType, enabled: boolean) => {
    setActiveWidgets(widgets => {
      if (!enabled) {
        return widgets.filter(w => w.type !== widgetType);
      }
      return widgets;
    });
  };

  const handleWidgetAdd = (widgetType: WidgetType) => {
    const widgetConfig = WIDGET_CONFIGS[widgetType];
    if (!widgetConfig) return;

    // Helper function to check if a position would cause overlap
    const wouldOverlap = (testX: number, testY: number, testWidth: number, testHeight: number): boolean => {
      return activeWidgets.some(widget => {
        // Check if any cell of the new widget would overlap with existing widget cells
        const widgetRight = widget.position.x + widget.position.width;
        const widgetBottom = widget.position.y + widget.position.height;
        const testRight = testX + testWidth;
        const testBottom = testY + testHeight;

        // Check for overlap
        return !(testRight <= widget.position.x ||
                 testX >= widgetRight ||
                 testBottom <= widget.position.y ||
                 testY >= widgetBottom);
      });
    };

    // Find available position by checking each grid cell
    const GRID_COLS = 6;
    const GRID_ROWS = 8;
    let foundPosition = false;
    let x = 0, y = 0;

    // Try to find a position that fits the widget without overlap
    for (let row = 0; row < GRID_ROWS && !foundPosition; row++) {
      for (let col = 0; col < GRID_COLS && !foundPosition; col++) {
        // Check if widget fits within grid bounds
        if (col + widgetConfig.defaultSize.width <= GRID_COLS &&
            row + widgetConfig.defaultSize.height <= GRID_ROWS) {
          // Check if this position would cause overlap
          if (!wouldOverlap(col, row, widgetConfig.defaultSize.width, widgetConfig.defaultSize.height)) {
            x = col;
            y = row;
            foundPosition = true;
          }
        }
      }
    }

    // If no position found, place at end (may cause overlap but user can move it)
    if (!foundPosition) {
      // Calculate position based on the last widget
      if (activeWidgets.length > 0) {
        const lastWidget = activeWidgets[activeWidgets.length - 1];
        x = lastWidget.position.x;
        y = lastWidget.position.y + lastWidget.position.height;

        // Wrap to next column if we exceed grid bounds
        if (y + widgetConfig.defaultSize.height > GRID_ROWS) {
          x = (lastWidget.position.x + lastWidget.position.width) % GRID_COLS;
          y = 0;
        }
      }
    }

    const newWidget: Widget = {
      id: `widget-${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetConfig.title,
      enabled: true,
      position: {
        x,
        y,
        width: widgetConfig.defaultSize.width,
        height: widgetConfig.defaultSize.height
      },
      settings: {}
    };

    setActiveWidgets(widgets => [...widgets, newWidget]);

    // Track widget addition for AI recommendations
    WidgetRecommendationService.trackWidgetUsage(widgetType, 'add');
  };

  const handleWidgetRemove = (widgetId: string) => {
    const widget = activeWidgets.find(w => w.id === widgetId);
    if (widget) {
      // Track widget removal for AI recommendations
      WidgetRecommendationService.trackWidgetUsage(widget.type, 'remove');
    }
    setActiveWidgets(widgets => widgets.filter(w => w.id !== widgetId));
  };

  const handleWidgetMove = (widgetId: string, newPosition: { x: number; y: number }) => {
    const widget = activeWidgets.find(w => w.id === widgetId);
    if (!widget) return;

    // newPosition is already in grid coordinates from WidgetContainer
    // Track widget movement for AI recommendations
    WidgetRecommendationService.trackWidgetUsage(widget.type, 'move');

    setActiveWidgets(widgets =>
      widgets.map(w =>
        w.id === widgetId
          ? { ...w, position: { ...w.position, x: newPosition.x, y: newPosition.y } }
          : w
      )
    );
  };

  const handleWidgetResize = (widgetId: string, newSize: { width: number; height: number }) => {
    const widget = activeWidgets.find(w => w.id === widgetId);
    if (!widget) return;

    // Ensure minimum size
    const minWidth = WIDGET_CONFIGS[widget.type]?.minSize?.width || 1;
    const minHeight = WIDGET_CONFIGS[widget.type]?.minSize?.height || 1;
    const maxWidth = WIDGET_CONFIGS[widget.type]?.maxSize?.width || 6;
    const maxHeight = WIDGET_CONFIGS[widget.type]?.maxSize?.height || 4;

    const clampedWidth = Math.max(minWidth, Math.min(newSize.width, maxWidth));
    const clampedHeight = Math.max(minHeight, Math.min(newSize.height, maxHeight));

    // Check if new size would fit in grid
    const GRID_COLS = 6;
    const GRID_ROWS = 8;
    if (widget.position.x + clampedWidth > GRID_COLS ||
        widget.position.y + clampedHeight > GRID_ROWS) {
      return; // Would exceed grid bounds
    }

    // Check for collisions with other widgets
    const wouldCollide = activeWidgets.some(w => {
      if (w.id === widgetId) return false; // Skip self

      const wRight = w.position.x + w.position.width;
      const wBottom = w.position.y + w.position.height;
      const newRight = widget.position.x + clampedWidth;
      const newBottom = widget.position.y + clampedHeight;

      return !(newRight <= w.position.x ||
               widget.position.x >= wRight ||
               newBottom <= w.position.y ||
               widget.position.y >= wBottom);
    });

    // Only update if no collision
    if (!wouldCollide) {
      // Track widget resizing for AI recommendations
      WidgetRecommendationService.trackWidgetUsage(widget.type, 'resize');

      setActiveWidgets(widgets =>
        widgets.map(w =>
          w.id === widgetId
            ? { ...w, position: { ...w.position, width: clampedWidth, height: clampedHeight } }
            : w
        )
      );
    }
  };

  const handleLayoutSave = (name: string) => {
    if (!currentUser) return;
    WidgetPersistenceService.saveNamedLayout(currentUser.id, name, activeWidgets);
    console.log('Layout saved:', name);
  };

  const handleLayoutReset = () => {
    const defaultWidgets: Widget[] = DEFAULT_WIDGETS.map((widgetType, index) => ({
      id: `widget-${widgetType}-${Date.now()}`,
      type: widgetType as WidgetType,
      title: WIDGET_CONFIGS[widgetType].title,
      enabled: true,
      position: {
        x: index % 3,
        y: Math.floor(index / 3),
        width: WIDGET_CONFIGS[widgetType].defaultSize.width,
        height: WIDGET_CONFIGS[widgetType].defaultSize.height
      },
      settings: {}
    }));
    setActiveWidgets(defaultWidgets);
  };

  const handleLayoutExport = () => {
    if (!currentUser) return;

    const layout: WidgetLayout = {
      id: 'export',
      userId: currentUser.id,
      name: 'My Office Layout',
      isDefault: false,
      widgets: activeWidgets,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    WidgetPersistenceService.exportLayout(layout);
  };

  const handleLayoutImport = (layout: any) => {
    if (!currentUser) return;

    const importedWidgets = WidgetPersistenceService.importLayout(currentUser.id, layout);
    if (importedWidgets) {
      setActiveWidgets(importedWidgets);
    }
  };

  // AI-powered handlers
  const handleApplySmartLayout = (widgets: Widget[]) => {
    setActiveWidgets(widgets);
    setShowAIRecommendations(false);

    // Track smart layout usage
    widgets.forEach(widget => {
      WidgetRecommendationService.trackWidgetUsage(widget.type, 'add');
    });
  };

  const handleAddRecommendedWidget = (recommendation: WidgetRecommendation) => {
    const widgetConfig = recommendation.widget;
    const position = recommendation.suggestedPosition || {
      x: 0, y: 0, width: widgetConfig.defaultSize.width, height: widgetConfig.defaultSize.height
    };

    const newWidget: Widget = {
      id: `widget-${widgetConfig.type}-${Date.now()}`,
      type: widgetConfig.type,
      title: widgetConfig.title,
      enabled: true,
      position,
      settings: {}
    };

    setActiveWidgets(widgets => [...widgets, newWidget]);

    // Track widget addition from recommendation
    WidgetRecommendationService.trackWidgetUsage(widgetConfig.type, 'add');
  };

  const toggleAIRecommendations = () => {
    setShowAIRecommendations(!showAIRecommendations);
  };

  const handleNewTask = () => {
    console.log('Open new task modal');
  };

  const toggleCustomization = () => {
    setIsCustomizing(!isCustomizing);
    setShowCustomization(!showCustomization);
  };

  const handleStatusChange = (assignmentId: string, newStatusId: string) => {
    console.log('Update status:', assignmentId, newStatusId);
  };

  const handleDateChange = (assignmentId: string, newDate: string) => {
    console.log('Update date:', assignmentId, newDate);
  };

  const handleItemDelete = (assignmentId: string) => {
    console.log('Delete item:', assignmentId);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log('Bulk action:', action, selectedIds);
  };

  const handleHelp = () => {
    console.log('Open help');
  };

  const renderWidgetContent = (widget: Widget) => {
    const widgetProps = {
      data: widget.type === 'quick-stats' ? {
        totalCount: data?.totalCount || 0,
        pendingCount: data?.pendingCount || 0,
        completedCount: data?.completedCount || 0,
        productivityScore: data?.totalCount ? Math.round((data.completedCount / data.totalCount) * 100) : 0
      } : undefined,
      assignments: widget.type === 'tasks-table' ? data?.assignments || [] : undefined,
      onNewTask: widget.type === 'tasks-table' ? handleNewTask : undefined,
      onStatusChange: widget.type === 'tasks-table' ? handleStatusChange : undefined,
      onDateChange: widget.type === 'tasks-table' ? handleDateChange : undefined,
      onItemDelete: widget.type === 'tasks-table' ? handleItemDelete : undefined,
      onBulkAction: widget.type === 'tasks-table' ? handleBulkAction : undefined,
      onViewAll: widget.type === 'activity-feed' ? () => console.log('View all activity') : undefined
    };

    return renderWidget(widget.type, widgetProps);
  };

  // Show widget-based office with customization
  if (activeWidgets.length > 0) {
    return (
      <div className="flex-1 min-h-screen relative">
        {/* Enhanced Header with Smart Features */}
        <div className="p-6 pb-4 sticky top-0 z-40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-adaptive-primary mb-2 flex items-center gap-3">
                  {currentUser?.fullName.split(' ')[0] ? `${currentUser.fullName.split(' ')[0]}'s` : 'My'} Office
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live workspace" />
                </h1>
                <p className="text-adaptive-secondary">Your AI-powered productivity workspace • {activeWidgets.length} widgets active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-adaptive-muted">
                  <span className="font-medium text-adaptive-primary">{Math.round(Math.random() * 100)}%</span> productivity
                </div>
                <div className="w-1 h-4 bg-green-400 rounded-full opacity-60" />
              </div>

              {/* Advanced Actions */}
              <button
                onClick={toggleAIRecommendations}
                className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl group transition-all ${showAIRecommendations ? 'liquid-button-primary shadow-lg shadow-purple-500/25' : 'liquid-button-secondary'}`}
                title="AI-Powered Workspace Recommendations"
              >
                <Brain className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors" />
                AI Assistant
                {!showAIRecommendations && <Sparkles className="w-3 h-3 ml-1 text-yellow-400 animate-pulse" />}
              </button>

              <button
                onClick={toggleCustomization}
                className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isCustomizing
                    ? 'liquid-button-primary shadow-lg shadow-blue-500/25'
                    : 'liquid-button-secondary'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isCustomizing ? 'Done Customizing' : 'Customize'}
              </button>
            </div>
          </div>

          {/* Smart Context Bar - Only show when customizing */}
          {isCustomizing && (
            <div className="bg-blue-500/10 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-300 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm text-adaptive-primary font-medium">Customization Mode</span>
                  </div>
                  <div className="text-xs text-adaptive-muted">
                    Drag widgets to reposition • Right-click for options • Grid snapping enabled
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs px-3 py-1.5 liquid-glass-interactive rounded-lg text-adaptive-muted hover:text-adaptive-primary">
                    Auto-arrange
                  </button>
                  <button className="text-xs px-3 py-1.5 liquid-glass-interactive rounded-lg text-adaptive-muted hover:text-adaptive-primary">
                    Templates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Widget Grid Container */}
        <div className="px-6 pb-6">
          <div className="relative min-h-[800px] rounded-2xl overflow-hidden group">
            {/* Advanced Grid Guidelines with Smart Zones */}
            {isCustomizing && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Main Grid */}
                <div
                  className="h-full w-full opacity-20 transition-opacity duration-300"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '216px 166px'
                  }}
                />

                {/* Smart Drop Zones */}
                <div className="absolute inset-4">
                  <div className="grid grid-cols-6 gap-4 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="border-2 border-dashed border-blue-400/20 rounded-lg hover:border-blue-400/40 hover:bg-blue-400/5 transition-all duration-200 min-h-[150px] flex items-center justify-center"
                      >
                        <div className="text-xs text-blue-400/60 font-medium opacity-0 hover:opacity-100 transition-opacity">
                          Drop Zone
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-adaptive-muted">Optimized Layout</span>
                </div>
              </div>
            )}

            {/* AI-Powered Empty State for New Users */}
            {!isCustomizing && activeWidgets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Star className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-adaptive-primary mb-3">
                    Ready to build your workspace?
                  </h3>
                  <p className="text-adaptive-muted text-sm mb-6">
                    Click "Customize" to add your first widgets and create the perfect productivity environment
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Widgets with Smart Animations */}
            {activeWidgets.map((widget, index) => (
              <div
                key={widget.id}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <WidgetContainer
                  widget={widget}
                  onRemove={handleWidgetRemove}
                  onMove={handleWidgetMove}
                  onResize={handleWidgetResize}
                  isCustomizing={isCustomizing}
                  activeWidgets={activeWidgets}
                >
                  {renderWidgetContent(widget)}
                </WidgetContainer>
              </div>
            ))}

            {/* Floating Action Hints */}
            {isCustomizing && activeWidgets.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-adaptive-muted">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘</kbd>
                    <span>+ click for quick actions</span>
                  </div>
                  <div className="w-1 h-4 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-2 text-xs text-adaptive-muted">
                    <span>Scroll to zoom</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customization Menu */}
        <WidgetCustomizationMenu
          isOpen={showCustomization}
          onClose={() => {
            setShowCustomization(false);
            setIsCustomizing(false);
          }}
          activeWidgets={activeWidgets}
          onWidgetToggle={handleWidgetToggle}
          onWidgetAdd={handleWidgetAdd}
          onLayoutSave={handleLayoutSave}
          onLayoutReset={handleLayoutReset}
          onLayoutExport={handleLayoutExport}
          onLayoutImport={handleLayoutImport}
        />

        {/* AI-Powered Smart Layout Suggestions */}
        {showAIRecommendations && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">
            <div className="absolute inset-y-0 left-0 w-full max-w-lg">
              <SmartLayoutSuggestions
                currentWidgets={activeWidgets}
                onApplyLayout={handleApplySmartLayout}
                onAddWidget={handleAddRecommendedWidget}
                className="h-full shadow-2xl"
              />
              {/* Close overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAIRecommendations(false)}
              />
            </div>
          </div>
        )}

        {/* Onboarding Flow Modal */}
        <OnboardingFlow
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />

        {/* App Walkthrough */}
        {showWalkthrough && (
          <AppWalkthrough
            currentStep={currentWalkthroughStep}
            onStepChange={setCurrentWalkthroughStep}
            onComplete={() => {
              setShowWalkthrough(false);
              setCurrentWalkthroughStep(0);
            }}
            onSkip={() => {
              setShowWalkthrough(false);
              setCurrentWalkthroughStep(0);
            }}
          />
        )}
      </div>
    );
  }

  // Fallback to empty state
  return (
    <div className="flex-1 min-h-screen relative">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentUser?.fullName.split(' ')[0] ? `${currentUser.fullName.split(' ')[0]}'s` : 'My'} Office
            </h1>
            <p className="text-gray-400 text-lg">Set up your personalized workspace with widgets</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCustomization(true);
                setIsCustomizing(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              <Settings className="w-5 h-5 mr-2 inline" />
              Add Widgets
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Settings className="w-16 h-16 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Your Customizable Office
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Create your perfect workspace by adding widgets that match your workflow.
              Choose from productivity tools, analytics dashboards, and utility widgets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setShowCustomization(true);
                  setIsCustomizing(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25 inline-flex items-center"
              >
                <Settings className="w-5 h-5 mr-2" />
                Customize Your Office
              </button>
              <button
                onClick={() => setShowOnboarding(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium transition-all border border-white/10 inline-flex items-center"
              >
                <Compass className="w-5 h-5 mr-2" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Menu */}
      <WidgetCustomizationMenu
        isOpen={showCustomization}
        onClose={() => {
          setShowCustomization(false);
          setIsCustomizing(false);
        }}
        activeWidgets={activeWidgets}
        onWidgetToggle={handleWidgetToggle}
        onWidgetAdd={handleWidgetAdd}
        onLayoutSave={handleLayoutSave}
        onLayoutReset={handleLayoutReset}
        onLayoutExport={handleLayoutExport}
        onLayoutImport={handleLayoutImport}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}

// App Walkthrough component (simplified version)
interface AppWalkthroughProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onSkip: () => void;
}

function AppWalkthrough({ currentStep, onStepChange, onComplete, onSkip }: AppWalkthroughProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">App Walkthrough</h2>
        <p className="text-gray-400 mb-6">Learn how to use your customizable office space.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}