import React from 'react';
import { ModernChart } from '../charts/ModernChart';
import { TrendingUp, Activity, BarChart3, Users } from 'lucide-react';

interface AnalyticsWidgetProps {
  type?: 'performance' | 'revenue' | 'engagement' | 'overview';
  timeframe?: 'day' | 'week' | 'month' | 'year';
  className?: string;
}

export function AnalyticsWidget({
  type = 'overview',
  timeframe = 'week',
  className = ''
}: AnalyticsWidgetProps) {

  const generateSampleData = () => {
    const baseData = {
      performance: [
        { label: 'Mon', value: 85, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Tue', value: 92, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Wed', value: 78, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Thu', value: 96, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Fri', value: 88, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Sat', value: 94, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Sun', value: 82, color: 'rgba(59, 130, 246, 0.8)' }
      ],
      revenue: [
        { label: 'Q1', value: 12500, color: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Q2', value: 15300, color: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Q3', value: 18700, color: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Q4', value: 22100, color: 'rgba(16, 185, 129, 0.8)' }
      ],
      engagement: [
        { label: 'Views', value: 45, color: 'rgba(147, 51, 234, 0.8)' },
        { label: 'Clicks', value: 25, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Shares', value: 15, color: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Comments', value: 15, color: 'rgba(245, 158, 11, 0.8)' }
      ]
    };

    return baseData[type] || baseData.performance;
  };

  const getChartType = () => {
    switch (type) {
      case 'performance': return 'area';
      case 'revenue': return 'bar';
      case 'engagement': return 'donut';
      default: return 'line';
    }
  };

  const getMetrics = () => {
    switch (type) {
      case 'performance':
        return {
          title: 'Performance Metrics',
          subtitle: 'Weekly productivity score',
          primary: '89.2%',
          primaryLabel: 'Avg Score',
          secondary: '+5.3%',
          secondaryLabel: 'vs Last Week',
          icon: TrendingUp,
          trend: 'up' as const
        };
      case 'revenue':
        return {
          title: 'Revenue Analytics',
          subtitle: 'Quarterly revenue growth',
          primary: '$68.6K',
          primaryLabel: 'Total Revenue',
          secondary: '+18.2%',
          secondaryLabel: 'Growth',
          icon: BarChart3,
          trend: 'up' as const
        };
      case 'engagement':
        return {
          title: 'Engagement Stats',
          subtitle: 'User interaction breakdown',
          primary: '2.4K',
          primaryLabel: 'Total Interactions',
          secondary: '+12.5%',
          secondaryLabel: 'This Month',
          icon: Users,
          trend: 'up' as const
        };
      default:
        return {
          title: 'Analytics Overview',
          subtitle: 'Key performance indicators',
          primary: '94.7%',
          primaryLabel: 'Overall Score',
          secondary: '+8.1%',
          secondaryLabel: 'Improvement',
          icon: Activity,
          trend: 'up' as const
        };
    }
  };

  const data = generateSampleData();
  const chartType = getChartType();
  const metrics = getMetrics();
  const IconComponent = metrics.icon;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header with Key Metrics */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <IconComponent className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-adaptive-primary">{metrics.title}</h3>
            <p className="text-sm text-adaptive-secondary">{metrics.subtitle}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-right">
          <div className="text-2xl font-bold text-adaptive-primary mb-1">{metrics.primary}</div>
          <div className={`text-sm font-medium flex items-center gap-1 justify-end ${
            metrics.trend === 'up' ? 'text-green-400' :
            metrics.trend === 'down' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {metrics.trend === 'up' ? '↗' : metrics.trend === 'down' ? '↘' : '→'}
            {metrics.secondary}
          </div>
          <div className="text-xs text-adaptive-muted">{metrics.secondaryLabel}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 px-6 pb-6">
        <ModernChart
          data={data}
          type={chartType}
          height={200}
          animate={true}
          showGrid={chartType !== 'donut'}
          showLabels={chartType === 'donut'}
          className="h-full"
        />
      </div>

      {/* Bottom Summary Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 liquid-glass-interactive rounded-xl">
            <div className="text-lg font-bold text-adaptive-primary">
              {type === 'revenue' ? '$22.1K' : type === 'engagement' ? '1.2K' : '94%'}
            </div>
            <div className="text-xs text-adaptive-muted">
              {type === 'revenue' ? 'Best Quarter' : type === 'engagement' ? 'Peak Day' : 'Best Day'}
            </div>
          </div>

          <div className="text-center p-3 liquid-glass-interactive rounded-xl">
            <div className="text-lg font-bold text-adaptive-primary">
              {type === 'revenue' ? '$16.6K' : type === 'engagement' ? '850' : '87%'}
            </div>
            <div className="text-xs text-adaptive-muted">
              {type === 'revenue' ? 'Average' : type === 'engagement' ? 'Average' : 'Average'}
            </div>
          </div>

          <div className="text-center p-3 liquid-glass-interactive rounded-xl">
            <div className="text-lg font-bold text-green-400">
              {type === 'revenue' ? '+18%' : type === 'engagement' ? '+12%' : '+5%'}
            </div>
            <div className="text-xs text-adaptive-muted">Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}