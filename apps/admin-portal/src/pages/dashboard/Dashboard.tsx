import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Companies',
    stat: '24',
    change: '+12%',
    changeType: 'increase',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Active Investors',
    stat: '1,247',
    change: '+8%',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: 'Total Assets Under Management',
    stat: '$127.5M',
    change: '+24%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Monthly Trading Volume',
    stat: '$12.8M',
    change: '-3%',
    changeType: 'decrease',
    icon: ChartBarIcon,
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'Company Registration',
    description: 'TechCorp Inc. completed registration process',
    time: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    type: 'Compliance Review',
    description: 'GreenEnergy Co quarterly compliance check',
    time: '4 hours ago',
    status: 'pending',
  },
  {
    id: 3,
    type: 'Large Transaction',
    description: '$500K token purchase by investor group',
    time: '6 hours ago',
    status: 'completed',
  },
  {
    id: 4,
    type: 'KYC Alert',
    description: 'New investor KYC documentation required',
    time: '8 hours ago',
    status: 'alert',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of platform metrics and recent activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`inline-flex items-center ${
                    item.changeType === 'increase' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  <ArrowTrendingUpIcon
                    className={`h-4 w-4 mr-1 ${
                      item.changeType === 'increase' ? 'text-green-500' : 'text-red-500 rotate-180'
                    }`}
                  />
                  {item.change}
                </span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-3 ${
                        activity.status === 'completed'
                          ? 'bg-green-400'
                          : activity.status === 'alert'
                          ? 'bg-red-400'
                          : 'bg-yellow-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {activity.status === 'alert' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    )}
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">API Response Time</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm text-gray-600">120ms</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Database Connection</span>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Blockchain Network</span>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">KYC Service</span>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm text-yellow-600">Degraded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;