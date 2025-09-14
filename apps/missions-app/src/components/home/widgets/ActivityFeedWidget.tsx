import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, DollarSign, Calendar, MessageSquare, Clock, Eye } from 'lucide-react';
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
  title?: string;
  activities?: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New lead added',
    description: 'John Smith from ABC Corp added to CRM',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'Sarah Johnson',
    metadata: { boardName: 'Leads CRM' },
  },
  {
    id: '2',
    type: 'deal',
    title: 'Deal updated',
    description: 'Enterprise Software Deal moved to negotiation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: 'Mike Chen',
    metadata: { boardName: 'Sales Pipeline', amount: '$25,000', status: 'Negotiation' },
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Meeting scheduled',
    description: 'Client discovery call with TechCorp',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: 'You',
  },
  {
    id: '4',
    type: 'comment',
    title: 'Comment added',
    description: 'Left feedback on Q4 planning board',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    user: 'Lisa Rodriguez',
    metadata: { boardName: 'Q4 Strategy' },
  },
  {
    id: '5',
    type: 'board',
    title: 'Board created',
    description: 'New project board for mobile app redesign',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: 'David Kim',
  },
];

export function ActivityFeedWidget({
  title = 'Recent Activity',
  activities = DEFAULT_ACTIVITIES,
  maxItems = 10,
  showTimestamps = true,
}: ActivityFeedWidgetProps) {
  const navigate = useNavigate();
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'deal':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'board':
        return <Activity className="w-4 h-4 text-pink-600" />;
      case 'task':
        return <Clock className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-50 border-blue-100';
      case 'deal':
        return 'bg-green-50 border-green-100';
      case 'meeting':
        return 'bg-purple-50 border-purple-100';
      case 'comment':
        return 'bg-orange-50 border-orange-100';
      case 'board':
        return 'bg-pink-50 border-pink-100';
      case 'task':
        return 'bg-indigo-50 border-indigo-100';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>

      {/* Activity Feed */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative border rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                {/* Activity Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {activity.description}
                      </p>

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          {activity.metadata.boardName && (
                            <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                              📋 {activity.metadata.boardName}
                            </span>
                          )}
                          {activity.metadata.amount && (
                            <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                              💰 {activity.metadata.amount}
                            </span>
                          )}
                          {activity.metadata.status && (
                            <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                              📊 {activity.metadata.status}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {activity.user && (
                            <span className="font-medium">{activity.user}</span>
                          )}
                          {showTimestamps && (
                            <>
                              <span>•</span>
                              <span>{formatTimestamp(activity.timestamp)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/my-work')}
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-3 h-3" />
          View All Activity
        </button>
      </div>
    </div>
  );
}