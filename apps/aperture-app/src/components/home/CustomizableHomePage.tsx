import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Settings, Layout, Grid, Palette, Edit3, Trash2, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomePageStore } from '../../stores/home.store';
import { HomePageWidget, HomePageLayout } from '../../types/home.types';
import { Button } from '../ui/Button';

// Widget Components
import { ShortcutsWidget } from './widgets/ShortcutsWidget';
import { QuickStatsWidget } from './widgets/QuickStatsWidget';
import { RecentBoardsWidget } from './widgets/RecentBoardsWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { ActivityFeedWidget } from './widgets/ActivityFeedWidget';
import { WelcomeWidget } from './widgets/WelcomeWidget';

const WIDGET_COMPONENTS = {
  'welcome': WelcomeWidget,
  'shortcuts': ShortcutsWidget,
  'recent-boards': RecentBoardsWidget,
  'calendar': CalendarWidget,
  'activity-feed': ActivityFeedWidget,
  'stats': QuickStatsWidget,
  'quick-actions': ShortcutsWidget,
  'board-shortcuts': RecentBoardsWidget,
  'todo-list': QuickStatsWidget,
  'metrics': QuickStatsWidget,
  'dashboard-chart': QuickStatsWidget,
  'notifications': ActivityFeedWidget,
  'clock': QuickStatsWidget,
};

interface SortableWidgetProps {
  widget: HomePageWidget;
  isEditing: boolean;
  onRemove: (widgetId: string) => void;
  onEdit: (widget: HomePageWidget) => void;
}

function SortableWidget({ widget, isEditing, onRemove, onEdit }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const WidgetComponent = WIDGET_COMPONENTS[widget.type];
  if (!WidgetComponent) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isDragging ? 'z-10' : ''
      }`}
      {...attributes}
    >
      {/* Widget Content */}
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
        isEditing ? 'ring-2 ring-blue-100 border-blue-200' : 'hover:shadow-md'
      }`}>
        <WidgetComponent {...widget.config} />
      </div>

      {/* Edit Mode Controls */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(widget)}
            className="w-8 h-8 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 flex items-center justify-center"
            title="Edit widget"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(widget.id)}
            className="w-8 h-8 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 flex items-center justify-center"
            title="Remove widget"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>

          <div
            {...listeners}
            className="w-8 h-8 bg-gray-500 text-white rounded-full shadow-sm hover:bg-gray-600 flex items-center justify-center cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <Move className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}

interface WidgetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: keyof typeof WIDGET_COMPONENTS) => void;
}

function WidgetLibraryModal({ isOpen, onClose, onAddWidget }: WidgetLibraryModalProps) {
  const { widgetLibrary } = useHomePageStore();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Widget Library</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgetLibrary.map((widgetType) => (
            <motion.div
              key={widgetType.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
              onClick={() => {
                onAddWidget(widgetType.type as keyof typeof WIDGET_COMPONENTS);
                onClose();
              }}
            >
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center`}>
                  <div className="text-white text-lg">{widgetType.icon}</div>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{widgetType.name}</h3>
                  <p className="text-sm text-gray-500">{widgetType.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{widgetType.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CustomizableHomePage() {
  const {
    currentLayout,
    availableLayouts,
    widgetLibrary,
    loadLayout,
    saveLayout,
    addWidget,
    removeWidget,
    updateWidget,
    loadTemplates,
    loadWidgetLibrary,
    loadPreferences,
  } = useHomePageStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [activeWidget, setActiveWidget] = useState<HomePageWidget | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize store data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadTemplates();
        await loadWidgetLibrary();
        await loadPreferences();
        await loadLayout('default');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize home page data:', error);
        setIsLoading(false);
      }
    };

    initializeData();
  }, [loadTemplates, loadWidgetLibrary, loadPreferences, loadLayout]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const widget = currentLayout?.widgets.find(w => w.id === active.id);
    setActiveWidget(widget || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && currentLayout) {
      const oldIndex = currentLayout.widgets.findIndex(w => w.id === active.id);
      const newIndex = currentLayout.widgets.findIndex(w => w.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newWidgets = [...currentLayout.widgets];
        const [movedWidget] = newWidgets.splice(oldIndex, 1);
        newWidgets.splice(newIndex, 0, movedWidget);

        // Update the current layout with reordered widgets
        const updatedLayout = { ...currentLayout, widgets: newWidgets };
        // Since we don't have reorderWidgets, we can update the layout directly through the store
        updateWidget(active.id, { position: { x: newIndex, y: 0 } });
      }
    }

    setActiveWidget(null);
  };

  const handleAddWidget = useCallback((type: keyof typeof WIDGET_COMPONENTS) => {
    addWidget(type as any);
  }, [addWidget]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    removeWidget(widgetId);
  }, [removeWidget]);

  const handleEditWidget = useCallback((widget: HomePageWidget) => {
    // TODO: Open widget configuration modal
    console.log('Edit widget:', widget);
  }, []);

  const handleSaveLayout = useCallback(() => {
    saveLayout();
    setIsEditing(false);
  }, [saveLayout]);

  const handleLoadTemplate = useCallback((layoutId: string) => {
    loadLayout(layoutId);
  }, [loadLayout]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-white min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentLayout) {
    return (
      <div className="flex-1 bg-white min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your personalized dashboard</h2>
            <p className="text-gray-600 mb-8">Choose a layout template to get started</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {availableLayouts.map((layout) => (
                <motion.div
                  key={layout.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => handleLoadTemplate(layout.id)}
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{layout.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{layout.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {layout.widgets.length} widgets
                    </span>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">{currentLayout.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isEditing ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWidgetLibrary(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveLayout}
                >
                  Save Changes
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Drag and Drop Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Widgets Grid */}
          <div className={`grid gap-6 ${
            currentLayout.columns === 1 ? 'grid-cols-1' :
            currentLayout.columns === 2 ? 'grid-cols-1 lg:grid-cols-2' :
            currentLayout.columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            <SortableContext
              items={currentLayout.widgets.map(w => w.id)}
              strategy={rectSortingStrategy}
            >
              <AnimatePresence>
                {currentLayout.widgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SortableWidget
                      widget={widget}
                      isEditing={isEditing}
                      onRemove={handleRemoveWidget}
                      onEdit={handleEditWidget}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            {/* Add Widget Button (when editing and no widgets) */}
            {isEditing && currentLayout.widgets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <div
                  onClick={() => setShowWidgetLibrary(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Add your first widget</h3>
                  <p className="text-gray-500">Choose from our library of widgets to personalize your dashboard</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeWidget ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 opacity-90 transform rotate-2">
                {(() => {
                  const WidgetComponent = WIDGET_COMPONENTS[activeWidget.type];
                  return WidgetComponent ? <WidgetComponent {...activeWidget.config} /> : null;
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Widget Library Modal */}
        <AnimatePresence>
          <WidgetLibraryModal
            isOpen={showWidgetLibrary}
            onClose={() => setShowWidgetLibrary(false)}
            onAddWidget={handleAddWidget}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}