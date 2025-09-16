import React from 'react';
import { Activity, User, DollarSign, Calendar, MessageSquare, Clock, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'lead' | 'deal' | 'meeting' | 'comment' | 'board' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: {
    boardName?: string;
    amount?: string;
    status?: string;
  };
}

interface ActivityFeedWidgetProps {
  activities?: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
  onViewAll?: () => void;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'task',
    title: 'Task completed',
    description: 'Q4 Performance Review completed',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    user: 'You',
    metadata: { boardName: 'Performance Reviews' },
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment',
    description: 'Sarah added feedback on project proposal',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: 'Sarah Johnson',
    metadata: { boardName: 'Strategic Planning' },
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Meeting scheduled',
    description: 'Team sync for next Tuesday',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    user: 'Mike Chen',
  },
  {
    id: '4',
    type: 'board',
    title: 'Board updated',
    description: 'New items added to development backlog',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: 'Development Team',
  },
];

export function ActivityFeedWidget({
  activities = DEFAULT_ACTIVITIES,
  maxItems = 5,
  showTimestamps = true,
  onViewAll
}: ActivityFeedWidgetProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'deal':
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-orange-400" />;
      case 'board':
        return <Activity className="w-4 h-4 text-pink-400" />;
      case 'task':
        return <Clock className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'deal':
        return 'bg-green-500/10 border-green-500/20';
      case 'meeting':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'comment':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'board':
        return 'bg-pink-500/10 border-pink-500/20';
      case 'task':
        return 'bg-indigo-500/10 border-indigo-500/20';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  if (displayActivities.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <Activity className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-sm font-medium text-white mb-1">No recent activity</h3>
        <p className="text-xs text-gray-400">Activity will appear here as you work</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Activity List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {displayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${getActivityColor(activity.type)}`}
          >
            <div className="flex items-start gap-3">
              {/* Activity Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-1 leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      {activity.description}
                    </p>

                    {/* Metadata */}
                    {activity.metadata?.boardName && (
                      <div className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded mb-2">
                        <Activity className="w-3 h-3" />
                        {activity.metadata.boardName}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        {activity.user && (
                          <span className="font-medium">{activity.user}</span>
                        )}
                        {showTimestamps && activity.user && <span>•</span>}
                        {showTimestamps && (
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        )}
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      {activities.length > maxItems && onViewAll && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={onViewAll}
            className="w-full text-xs text-blue-400 hover:text-blue-300 font-medium py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View All Activity ({activities.length})
          </button>
        </div>
      )}
    </div>
  );
}