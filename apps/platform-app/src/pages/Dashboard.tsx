import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Portfolio Value',
      value: '$2.4M',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Active Companies',
      value: '24',
      change: '+3 this month',
      changeType: 'positive' as const,
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Active Missions',
      value: '8',
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: RocketLaunchIcon,
    },
    {
      name: 'Total Investors',
      value: '156',
      change: '+8 this month',
      changeType: 'positive' as const,
      icon: UsersIcon,
    },
  ];

  const recentMissions = [
    {
      id: '1',
      title: 'TechCorp Tokenization',
      status: 'active',
      progress: 35,
      dueDate: '2024-12-31',
      type: 'tokenization',
    },
    {
      id: '2',
      title: 'Q4 Compliance Review',
      status: 'active',
      progress: 45,
      dueDate: '2024-12-31',
      type: 'compliance',
    },
    {
      id: '3',
      title: 'Series A Fundraising',
      status: 'active',
      progress: 65,
      dueDate: '2024-12-15',
      type: 'campaign',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'completed milestone',
      target: 'Lead Investor Secured',
      mission: 'Series A Fundraising',
      time: '2 hours ago',
    },
    {
      id: '2',
      action: 'updated progress',
      target: 'TechCorp Tokenization',
      mission: 'TechCorp Tokenization',
      time: '4 hours ago',
    },
    {
      id: '3',
      action: 'created new board',
      target: 'Due Diligence Tracking',
      mission: 'Q4 Compliance Review',
      time: '1 day ago',
    },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your investments and missions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {item.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          {item.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Missions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Missions
                </h3>
                <button
                  onClick={() => window.open('http://localhost:4201', '_blank')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  View all
                  <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {mission.title}
                      </h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {mission.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due {mission.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span>{' '}
                        <span className="text-indigo-600">{activity.target}</span>{' '}
                        in {activity.mission}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => window.open('http://localhost:4201', '_blank')}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <RocketLaunchIcon className="h-8 w-8 text-indigo-600 mb-3" />
              <h4 className="text-sm font-medium text-gray-900">New Mission</h4>
              <p className="text-sm text-gray-500">Start a new project mission</p>
            </button>
            
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600 mb-3" />
              <h4 className="text-sm font-medium text-gray-900">Add Company</h4>
              <p className="text-sm text-gray-500">Register new company</p>
            </button>
            
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600 mb-3" />
              <h4 className="text-sm font-medium text-gray-900">New Investment</h4>
              <p className="text-sm text-gray-500">Make new investment</p>
            </button>
            
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <ChartBarIcon className="h-8 w-8 text-indigo-600 mb-3" />
              <h4 className="text-sm font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-500">Portfolio performance</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;