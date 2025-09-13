/**
 * COW Dashboard Canvas
 * Main business dashboard with customizable widgets
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../molecules/Card';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Spinner } from '../../atoms/Spinner';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  Shield,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Dashboard widget types
interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'status';
  size: 'small' | 'medium' | 'large' | 'full';
  data?: any;
  loading?: boolean;
  error?: string;
}

// Dashboard metrics interface
interface BusinessMetrics {
  totalValue: {
    amount: number;
    change: number;
    symbol: string;
  };
  activeTokens: {
    count: number;
    change: number;
  };
  investors: {
    count: number;
    change: number;
  };
  compliance: {
    status: 'compliant' | 'warning' | 'critical';
    score: number;
  };
}

// Props interface
export interface DashboardCanvasProps {
  metrics?: BusinessMetrics;
  widgets?: DashboardWidget[];
  layout?: 'grid' | 'masonry' | 'flex';
  loading?: boolean;
  className?: string;
  onWidgetAction?: (widgetId: string, action: string) => void;
}

// Default metrics
const defaultMetrics: BusinessMetrics = {
  totalValue: {
    amount: 2450000,
    change: 12.5,
    symbol: '$',
  },
  activeTokens: {
    count: 15,
    change: 2,
  },
  investors: {
    count: 1247,
    change: 8.3,
  },
  compliance: {
    status: 'compliant',
    score: 98,
  },
};

// Metric card component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}> = ({ title, value, change, icon, variant = 'default' }) => {
  const isPositive = change && change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card variant=\"glass\" className=\"p-6\">
      <div className=\"flex items-center justify-between\">
        <div className=\"flex-1\">
          <Text variant=\"small\" color=\"muted\" className=\"mb-1\">
            {title}
          </Text>
          <Text variant=\"h3\" weight=\"bold\" className=\"mb-2\">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Text>
          {change !== undefined && (
            <div className=\"flex items-center gap-1\">
              <TrendIcon className=\"h-3 w-3\" />
              <Text variant=\"caption\" className={changeColor}>
                {Math.abs(change)}%
              </Text>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          variant === 'success' && 'bg-green-100 text-green-600',
          variant === 'warning' && 'bg-amber-100 text-amber-600',
          variant === 'error' && 'bg-red-100 text-red-600',
          variant === 'default' && 'bg-blue-100 text-blue-600'
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Recent activity component
const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'token_trade',
      description: 'TECH token traded',
      amount: '$45,000',
      time: '2 minutes ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'investor_joined',
      description: 'New investor onboarded',
      amount: '+1',
      time: '15 minutes ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'compliance_check',
      description: 'Monthly compliance review',
      amount: '98% score',
      time: '1 hour ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'token_mint',
      description: 'GREEN tokens minted',
      amount: '1,000 tokens',
      time: '3 hours ago',
      status: 'pending',
    },
  ];

  return (
    <Card variant=\"glass\">
      <CardHeader>
        <CardTitle level={4}>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=\"space-y-4\">
          {activities.map((activity) => (
            <div key={activity.id} className=\"flex items-center justify-between p-3 bg-white/30 rounded-lg\">
              <div className=\"flex items-center gap-3\">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm',
                  activity.type === 'token_trade' && 'bg-blue-100 text-blue-600',
                  activity.type === 'investor_joined' && 'bg-green-100 text-green-600',
                  activity.type === 'compliance_check' && 'bg-purple-100 text-purple-600',
                  activity.type === 'token_mint' && 'bg-amber-100 text-amber-600'
                )}>
                  {activity.type === 'token_trade' && '💰'}
                  {activity.type === 'investor_joined' && '👤'}
                  {activity.type === 'compliance_check' && '🛡️'}
                  {activity.type === 'token_mint' && '🔨'}
                </div>
                <div>
                  <Text variant=\"small\" weight=\"medium\">
                    {activity.description}
                  </Text>
                  <div className=\"flex items-center gap-2\">
                    <Text variant=\"caption\" color=\"muted\">
                      {activity.time}
                    </Text>
                    <Badge 
                      variant={activity.status === 'completed' ? 'success' : 'warning'}
                      size=\"sm\"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Text variant=\"small\" weight=\"bold\">
                {activity.amount}
              </Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Portfolio overview component
const PortfolioOverview: React.FC = () => {
  const tokens = [
    { symbol: 'TECH', name: 'TechCorp Token', value: 45000, change: 8.2, network: 'ethereum' },
    { symbol: 'GREEN', name: 'GreenEnergy Co', value: 32000, change: 15.1, network: 'polygon' },
    { symbol: 'FIN', name: 'FinTech Solutions', value: 28500, change: 6.7, network: 'solana' },
    { symbol: 'REAL', name: 'RealEstate Fund', value: 23000, change: -2.1, network: 'ethereum' },
    { symbol: 'HEALTH', name: 'HealthTech Inc', value: 18500, change: 12.8, network: 'polygon' },
  ];

  return (
    <Card variant=\"glass\">
      <CardHeader>
        <div className=\"flex items-center justify-between\">
          <CardTitle level={4}>Portfolio Overview</CardTitle>
          <Button variant=\"ghost\" size=\"sm\">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className=\"space-y-3\">
          {tokens.map((token) => (
            <div key={token.symbol} className=\"flex items-center justify-between p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors cursor-pointer\">
              <div className=\"flex items-center gap-3\">
                <div className={cn(
                  'h-8 w-8 rounded-full',
                  token.network === 'ethereum' && 'bg-[#627EEA]',
                  token.network === 'polygon' && 'bg-[#8247E5]',
                  token.network === 'solana' && 'bg-[#9945FF]'
                )} />
                <div>
                  <Text variant=\"small\" weight=\"medium\">
                    {token.symbol}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    {token.name}
                  </Text>
                </div>
              </div>
              <div className=\"text-right\">
                <Text variant=\"small\" weight=\"medium\">
                  ${token.value.toLocaleString()}
                </Text>
                <div className=\"flex items-center justify-end gap-1\">
                  {token.change > 0 ? (
                    <TrendingUp className=\"h-3 w-3 text-green-600\" />
                  ) : (
                    <TrendingDown className=\"h-3 w-3 text-red-600\" />
                  )}
                  <Text 
                    variant=\"caption\" 
                    className={token.change > 0 ? 'text-green-600' : 'text-red-600'}
                  >
                    {Math.abs(token.change)}%
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main dashboard canvas component
export const DashboardCanvas: React.FC<DashboardCanvasProps> = ({
  metrics = defaultMetrics,
  widgets = [],
  layout = 'grid',
  loading = false,
  className,
  onWidgetAction,
}) => {
  if (loading) {
    return (
      <div className=\"flex items-center justify-center min-h-[400px]\">
        <div className=\"text-center\">
          <Spinner size=\"lg\" />
          <Text variant=\"small\" color=\"muted\" className=\"mt-4\">
            Loading dashboard...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Key Metrics Row */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <MetricCard
          title=\"Total Portfolio Value\"
          value={`${metrics.totalValue.symbol}${metrics.totalValue.amount.toLocaleString()}`}
          change={metrics.totalValue.change}
          icon={<DollarSign className=\"h-5 w-5\" />}
          variant=\"success\"
        />
        <MetricCard
          title=\"Active Tokens\"
          value={metrics.activeTokens.count}
          change={metrics.activeTokens.change}
          icon={<Building className=\"h-5 w-5\" />}
          variant=\"default\"
        />
        <MetricCard
          title=\"Total Investors\"
          value={metrics.investors.count}
          change={metrics.investors.change}
          icon={<Users className=\"h-5 w-5\" />}
          variant=\"default\"
        />
        <MetricCard
          title=\"Compliance Score\"
          value={`${metrics.compliance.score}%`}
          icon={<Shield className=\"h-5 w-5\" />}
          variant={
            metrics.compliance.status === 'compliant' ? 'success' :
            metrics.compliance.status === 'warning' ? 'warning' : 'error'
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
        {/* Portfolio Overview - Takes 2 columns */}
        <div className=\"lg:col-span-2\">
          <PortfolioOverview />
        </div>

        {/* Recent Activity - Takes 1 column */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <Card variant=\"glass\">
        <CardHeader>
          <CardTitle level={4}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
            <Button variant=\"outline\" className=\"h-20 flex-col gap-2\">
              <Building className=\"h-5 w-5\" />
              <span className=\"text-xs\">Add Company</span>
            </Button>
            <Button variant=\"outline\" className=\"h-20 flex-col gap-2\">
              <Users className=\"h-5 w-5\" />
              <span className=\"text-xs\">Invite Investor</span>
            </Button>
            <Button variant=\"outline\" className=\"h-20 flex-col gap-2\">
              <BarChart3 className=\"h-5 w-5\" />
              <span className=\"text-xs\">View Analytics</span>
            </Button>
            <Button variant=\"outline\" className=\"h-20 flex-col gap-2\">
              <Shield className=\"h-5 w-5\" />
              <span className=\"text-xs\">Compliance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCanvas;