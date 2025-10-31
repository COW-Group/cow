import React from 'react';
import { User, DollarSign, Calendar, Building, Activity } from 'lucide-react';
import { CardWidget } from './CardWidget';
import { RecentActivity } from '../../types/home.types';

const iconMap = {
  lead: User,
  deal: DollarSign,
  meeting: Calendar,
  contact: User,
  account: Building
};

const iconColorMap = {
  lead: 'text-teal-500',
  deal: 'text-yellow-500', 
  meeting: 'text-blue-500',
  contact: 'text-green-500',
  account: 'text-pink-500'
};

const iconBgMap = {
  lead: 'bg-teal-100 dark:bg-teal-900/30',
  deal: 'bg-yellow-100 dark:bg-yellow-900/30',
  meeting: 'bg-blue-100 dark:bg-blue-900/30', 
  contact: 'bg-green-100 dark:bg-green-900/30',
  account: 'bg-pink-100 dark:bg-pink-900/30'
};

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const formatRelativeTime = (timestamp: Date) => {
    try {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
      return timestamp.toLocaleDateString();
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <CardWidget title="Recent Activity" className="h-fit">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const IconComponent = iconMap[activity.iconType] || User;
            const iconColor = iconColorMap[activity.iconType] || 'text-gray-500';
            const iconBg = iconBgMap[activity.iconType] || 'bg-gray-100 dark:bg-gray-800';

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <IconComponent className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </CardWidget>
  );
}