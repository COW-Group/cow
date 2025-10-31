import React, { useState } from 'react';
import {
  Table,
  Columns,
  Calendar,
  BarChart3,
  GanttChart,
  Store,
  Layout,
  Grid3x3
} from 'lucide-react';
import { TableView } from './views/TableView';
import { KanbanView } from './views/KanbanView';
import { TimelineView } from './views/TimelineView';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { GanttView } from './views/GanttView';
import { AppView } from './views/AppView';
import { Button } from '../ui/Button';

export type BoardViewType = 'table' | 'kanban' | 'timeline' | 'dashboard' | 'calendar' | 'gantt' | 'apps';

interface BoardViewSwitcherProps {
  boardId: string;
  workspaceId: string;
  items: any[];
  columns: any[];
  groups?: any[];
  onItemUpdate?: (itemId: string, updates: any) => void;
  onItemAdd?: (item: any) => void;
  onItemDelete?: (itemId: string) => void;
  className?: string;
  defaultView?: BoardViewType;
}

const VIEW_CONFIG: Record<BoardViewType, {
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = {
  table: {
    label: 'Table',
    icon: Table,
    description: 'Spreadsheet-style view with rows and columns'
  },
  kanban: {
    label: 'Kanban',
    icon: Columns,
    description: 'Visual board with cards organized by status'
  },
  timeline: {
    label: 'Timeline',
    icon: GanttChart,
    description: 'Timeline view showing tasks and deadlines'
  },
  dashboard: {
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Charts and analytics overview'
  },
  calendar: {
    label: 'Calendar',
    icon: Calendar,
    description: 'Calendar view with scheduled items'
  },
  gantt: {
    label: 'Gantt',
    icon: GanttChart,
    description: 'Project timeline with dependencies'
  },
  apps: {
    label: 'Apps',
    icon: Store,
    description: 'Browse and install apps for this board'
  }
};

export function BoardViewSwitcher({
  boardId,
  workspaceId,
  items,
  columns,
  groups,
  onItemUpdate,
  onItemAdd,
  onItemDelete,
  className = '',
  defaultView = 'table'
}: BoardViewSwitcherProps) {
  const [currentView, setCurrentView] = useState<BoardViewType>(defaultView);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const renderViewContent = () => {
    const commonProps = {
      items,
      columns,
      groups: groups || [],
      onItemUpdate: onItemUpdate || (() => {}),
      onItemAdd: onItemAdd || (() => {}),
      onItemDelete: onItemDelete || (() => {}),
      boardId,
      workspaceId
    };

    switch (currentView) {
      case 'table':
        return <TableView {...commonProps} />;
      case 'kanban':
        return <KanbanView {...commonProps} />;
      case 'timeline':
        return <TimelineView {...commonProps} />;
      case 'dashboard':
        return <DashboardView {...commonProps} />;
      case 'calendar':
        return <CalendarView {...commonProps} />;
      case 'gantt':
        return <GanttView {...commonProps} />;
      case 'apps':
        return (
          <AppView
            boardId={boardId}
            workspaceId={workspaceId}
          />
        );
      default:
        return <TableView {...commonProps} />;
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* View Switcher Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* View Tabs */}
          <div className="flex items-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(Object.keys(VIEW_CONFIG) as BoardViewType[]).map((view) => {
                const config = VIEW_CONFIG[view];
                const Icon = config.icon;

                return (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      currentView === view
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={config.description}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCompactMode && config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Options */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompactMode(!isCompactMode)}
              title="Toggle compact mode"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>

            {/* View-specific actions could go here */}
            {currentView === 'apps' && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Store className="h-4 w-4" />
                <span>App Marketplace</span>
              </div>
            )}
          </div>
        </div>

        {/* View Description */}
        <div className="mt-2 text-sm text-gray-600">
          {VIEW_CONFIG[currentView].description}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {renderViewContent()}
      </div>
    </div>
  );
}