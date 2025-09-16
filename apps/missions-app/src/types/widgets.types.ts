export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  enabled: boolean;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  settings?: Record<string, any>;
}

export type WidgetType =
  | 'dashboard'
  | 'tasks-table'
  | 'tasks-calendar'
  | 'quick-stats'
  | 'activity-feed'
  | 'recent-boards'
  | 'team-overview'
  | 'goals-tracker'
  | 'time-tracker'
  | 'notifications'
  | 'weather'
  | 'clock'
  | 'notes'
  | 'bookmarks';

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  category: 'productivity' | 'analytics' | 'collaboration' | 'utilities';
  defaultSize: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  maxSize?: {
    width: number;
    height: number;
  };
  resizable: boolean;
  configurable: boolean;
  premium?: boolean;
}

export interface WidgetLayout {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  widgets: Widget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomizationState {
  isCustomizing: boolean;
  availableWidgets: WidgetConfig[];
  currentLayout: WidgetLayout | null;
  savedLayouts: WidgetLayout[];
  draggedWidget: Widget | null;
  selectedWidget: Widget | null;
}