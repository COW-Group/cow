import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  color: string;
}

interface QuickStatsWidgetProps {
  title?: string;
  stats?: StatItem[];
  layout?: 'horizontal' | 'vertical';
}

const DEFAULT_STATS: StatItem[] = [
  {
    id: '1',
    label: 'Active Leads',
    value: 24,
    change: { value: 12, type: 'increase' },
    color: 'text-blue-600',
  },
  {
    id: '2',
    label: 'Deals Closed',
    value: 8,
    change: { value: 3, type: 'increase' },
    color: 'text-green-600',
  },
  {
    id: '3',
    label: 'Revenue',
    value: '$42,350',
    change: { value: 8, type: 'increase' },
    color: 'text-purple-600',
  },
  {
    id: '4',
    label: 'Conversion Rate',
    value: '23.5%',
    change: { value: 2, type: 'decrease' },
    color: 'text-orange-600',
  },
];

export function QuickStatsWidget({
  title = 'Key Metrics',
  stats = DEFAULT_STATS,
  layout = 'horizontal',
}: QuickStatsWidgetProps) {
  const renderChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3" />;
      case 'neutral':
        return <Minus className="w-3 h-3" />;
    }
  };

  const getChangeColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-50';
      case 'decrease':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (layout === 'vertical') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                {stat.change && (
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getChangeColor(stat.change.type)}`}>
                    {renderChangeIcon(stat.change.type)}
                    {stat.change.value}%
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            {stat.change && (
              <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getChangeColor(stat.change.type)}`}>
                {renderChangeIcon(stat.change.type)}
                {stat.change.type === 'increase' ? '+' : stat.change.type === 'decrease' ? '-' : ''}
                {stat.change.value}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}