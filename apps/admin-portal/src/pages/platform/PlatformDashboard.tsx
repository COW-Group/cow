import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';

interface PlatformStats {
  totalOrganizations: number;
  totalUsers: number;
  totalTeams: number;
  totalWorkspaces: number;
  activeUsers7d: number;
  activeUsers30d: number;
}

export default function PlatformDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalOrganizations: 0,
    totalUsers: 0,
    totalTeams: 0,
    totalWorkspaces: 0,
    activeUsers7d: 0,
    activeUsers30d: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await supabasePermissionsService.getPlatformStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading platform stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Organizations',
      value: stats.totalOrganizations,
      icon: BuildingOfficeIcon,
      href: '/organizations',
      color: 'bg-blue-500',
    },
    {
      name: 'Users',
      value: stats.totalUsers,
      icon: UserGroupIcon,
      href: '/users',
      color: 'bg-green-500',
    },
    {
      name: 'Teams',
      value: stats.totalTeams,
      icon: UserGroupIcon,
      href: '/teams',
      color: 'bg-purple-500',
    },
    {
      name: 'Workspaces',
      value: stats.totalWorkspaces,
      icon: CubeIcon,
      href: '/workspaces',
      color: 'bg-yellow-500',
    },
  ];

  const quickActions = [
    {
      name: 'User Management',
      description: 'Manage users, roles, and permissions',
      href: '/users',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Organizations',
      description: 'Manage organizations and settings',
      href: '/organizations',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ecosystem Apps',
      description: 'Manage all COW ecosystem apps',
      href: '/apps',
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Platform Settings',
      description: 'Configure platform-wide settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Security & Compliance',
      description: 'Audit logs and security settings',
      href: '/security',
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Analytics',
      description: 'Platform usage and metrics',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading platform stats...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage the entire COW ecosystem from one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Activity Stats */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500">Active Users (Last 7 Days)</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {stats.activeUsers7d.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Active Users (Last 30 Days)</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeUsers30d.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${action.color} rounded-md p-3`}>
                    <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Health Status */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Missions App</span>
            </div>
            <span className="text-sm text-gray-500">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Database</span>
            </div>
            <span className="text-sm text-gray-500">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Authentication</span>
            </div>
            <span className="text-sm text-gray-500">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
