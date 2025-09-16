import React from 'react';
import { WidgetType } from '../../types/widgets.types';
import { QuickStatsWidget } from './widgets/QuickStatsWidget';
import { TasksTableWidget } from './widgets/TasksTableWidget';
import { ActivityFeedWidget } from './widgets/ActivityFeedWidget';
import { AnalyticsWidget } from './AnalyticsWidget';

// Placeholder components for widgets that aren't implemented yet
const PlaceholderWidget = ({ title }: { title: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-6">
    <div className="w-16 h-16 liquid-glass-interactive rounded-2xl flex items-center justify-center mb-4 border border-white/10">
      <span className="text-2xl">🚧</span>
    </div>
    <h3 className="text-sm font-semibold text-adaptive-primary mb-2">{title}</h3>
    <p className="text-xs text-adaptive-muted">Coming soon in next update...</p>
    <div className="mt-4 px-3 py-1 liquid-glass-interactive rounded-lg border border-white/10">
      <span className="text-xs text-blue-400">In Development</span>
    </div>
  </div>
);

const DashboardWidget = () => <AnalyticsWidget type="overview" />;

const TasksCalendarWidget = () => (
  <div className="h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-white">December 2024</h3>
      <div className="flex gap-1">
        <button className="w-6 h-6 text-gray-400 hover:text-white">‹</button>
        <button className="w-6 h-6 text-gray-400 hover:text-white">›</button>
      </div>
    </div>
    <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="text-center text-gray-400 p-1 font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={i}
            className={`text-center p-1 rounded hover:bg-white/10 cursor-pointer ${
              i >= 6 && i <= 27 ? 'text-white' : 'text-gray-600'
            } ${i === 15 ? 'bg-blue-500/20 text-blue-300' : ''}`}
          >
            {i >= 6 && i <= 27 ? i - 5 : ''}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecentBoardsWidget = () => (
  <div className="h-full">
    <div className="space-y-3">
      {[
        { name: 'Strategic Planning', color: 'blue', items: 12 },
        { name: 'Development Sprint', color: 'green', items: 8 },
        { name: 'Marketing Campaign', color: 'purple', items: 15 },
      ].map((board, index) => (
        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-${board.color}-400`} />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{board.name}</div>
              <div className="text-xs text-gray-400">{board.items} items</div>
            </div>
            <div className="text-xs text-gray-400">2h ago</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickNotesWidget = () => (
  <div className="h-full">
    <textarea
      placeholder="Quick notes and reminders..."
      className="w-full h-full bg-transparent border-none text-sm text-white placeholder-gray-400 resize-none focus:outline-none"
      defaultValue="• Review Q4 reports
• Schedule team meeting
• Update project timeline"
    />
  </div>
);

export const WidgetRegistry: Record<WidgetType, React.ComponentType<any>> = {
  'dashboard': DashboardWidget,
  'tasks-table': TasksTableWidget,
  'tasks-calendar': TasksCalendarWidget,
  'quick-stats': QuickStatsWidget,
  'activity-feed': ActivityFeedWidget,
  'recent-boards': RecentBoardsWidget,
  'team-overview': () => <PlaceholderWidget title="Team Overview" />,
  'goals-tracker': () => <PlaceholderWidget title="Goals Tracker" />,
  'time-tracker': () => <PlaceholderWidget title="Time Tracker" />,
  'notifications': () => <PlaceholderWidget title="Notifications" />,
  'weather': () => <PlaceholderWidget title="Weather" />,
  'clock': () => <PlaceholderWidget title="World Clock" />,
  'notes': QuickNotesWidget,
  'bookmarks': () => <PlaceholderWidget title="Bookmarks" />,
  'performance-metrics': () => <AnalyticsWidget type="performance" />,
  'revenue-chart': () => <AnalyticsWidget type="revenue" />,
  'engagement-stats': () => <AnalyticsWidget type="engagement" />,
};

export function renderWidget(type: WidgetType, props: any = {}) {
  const WidgetComponent = WidgetRegistry[type];
  return <WidgetComponent {...props} />;
}