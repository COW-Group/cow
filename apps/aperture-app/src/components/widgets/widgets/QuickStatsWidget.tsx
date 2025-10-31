import React from 'react';
import { Target, Clock, CheckSquare, TrendingUp } from 'lucide-react';

interface QuickStatsWidgetProps {
  data?: {
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    productivityScore: number;
  };
}

export function QuickStatsWidget({ data }: QuickStatsWidgetProps) {
  const stats = data || {
    totalCount: 0,
    pendingCount: 0,
    completedCount: 0,
    productivityScore: 0
  };

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.totalCount,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Completed',
      value: stats.completedCount,
      icon: CheckSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Productivity',
      value: `${stats.productivityScore}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-3 h-full">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-xl p-3 flex flex-col justify-between border border-white/5 hover:border-white/10 transition-all`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}