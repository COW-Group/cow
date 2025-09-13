import React from 'react';
import { Link } from 'react-router-dom';
import { User, DollarSign, ChevronRight } from 'lucide-react';
import { CardWidget } from './CardWidget';
import { QuickAction } from '../../types/home.types';

const iconMap = {
  User,
  DollarSign,
  Building: User, // Using User as fallback
  Calendar: User,
  Activity: User
};

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <CardWidget title="Quick Actions" className="h-fit">
      <div className="space-y-3">
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon] || User;
          
          return (
            <Link
              key={action.id}
              to={action.route}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className={`h-5 w-5 ${action.iconColor}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {action.label}
                  {action.count !== undefined && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({action.count})
                    </span>
                  )}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </Link>
          );
        })}
      </div>
    </CardWidget>
  );
}