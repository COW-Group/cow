import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Database } from '../../lib/supabase';

type EcosystemApp = Database['public']['Tables']['ecosystem_apps']['Row'];

export default function EcosystemAppsManagement() {
  const [apps, setApps] = useState<EcosystemApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<EcosystemApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    filterApps();
  }, [searchQuery, statusFilter, apps]);

  const loadApps = async () => {
    try {
      setLoading(true);
      // TODO: Implement getAllEcosystemApps in supabasePermissionsService
      // For now, using mock data representing the COW ecosystem apps
      const mockApps: EcosystemApp[] = [
        {
          id: '1',
          app_name: 'missions-app',
          display_name: 'Missions',
          description: 'Project management and task tracking platform',
          icon_url: null,
          is_active: true,
          version: '1.0.0',
          settings: {
            port: 4203,
            features: ['boards', 'teams', 'agents', 'insights'],
          },
          created_at: new Date('2024-01-15').toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          app_name: 'admin-portal',
          display_name: 'Admin Portal',
          description: 'Platform administration and ecosystem management',
          icon_url: null,
          is_active: true,
          version: '1.0.0',
          settings: {
            port: 4202,
            features: ['user-management', 'org-management', 'platform-stats'],
          },
          created_at: new Date('2024-01-10').toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          app_name: 'public-site',
          display_name: 'Public Website',
          description: 'Main marketing and information website',
          icon_url: null,
          is_active: true,
          version: '2.1.0',
          settings: {
            port: 3000,
            features: ['landing', 'about', 'pricing', 'blog'],
          },
          created_at: new Date('2023-12-01').toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '4',
          app_name: 'platform-app',
          display_name: 'Platform App',
          description: 'Core tokenization platform',
          icon_url: null,
          is_active: true,
          version: '3.0.0',
          settings: {
            port: 4200,
            features: ['tokenization', 'compliance', 'trading'],
          },
          created_at: new Date('2023-11-15').toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '5',
          app_name: 'support-center',
          display_name: 'Support Center',
          description: 'Customer support and help documentation',
          icon_url: null,
          is_active: true,
          version: '1.5.0',
          settings: {
            port: 4201,
            features: ['tickets', 'knowledge-base', 'chat'],
          },
          created_at: new Date('2024-01-20').toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '6',
          app_name: 'mauna-app',
          display_name: 'Mauna',
          description: 'AI-powered financial analysis platform',
          icon_url: null,
          is_active: false,
          version: '0.9.0-beta',
          settings: {
            port: 4204,
            features: ['ai-analysis', 'reports', 'predictions'],
          },
          created_at: new Date('2024-02-01').toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setApps(mockApps);
    } catch (error) {
      console.error('Error loading ecosystem apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApps = () => {
    let filtered = apps;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) =>
        statusFilter === 'active' ? app.is_active : !app.is_active
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.display_name.toLowerCase().includes(query) ||
          app.app_name.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query)
      );
    }

    setFilteredApps(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="w-4 h-4 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircleIcon className="w-4 h-4 mr-1" />
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading ecosystem apps...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ecosystem Apps</h1>
          <p className="mt-2 text-gray-600">
            Manage all applications in the Cycles of Wealth ecosystem
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-5 w-5 mr-2" />
            Register App
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <CubeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Apps</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {apps.length.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Apps</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {apps.filter((a) => a.is_active).length.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                <XCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive Apps</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {apps.filter((a) => !a.is_active).length.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search apps by name or description..."
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery || statusFilter !== 'all' ? 'No apps found' : 'No apps yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by registering your first app'}
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {app.icon_url ? (
                      <img src={app.icon_url} alt="" className="h-12 w-12 rounded-lg" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                        <CubeIcon className="h-7 w-7 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{app.display_name}</h3>
                      <p className="text-sm text-gray-500">{app.app_name}</p>
                    </div>
                  </div>
                  {getStatusBadge(app.is_active)}
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{app.description}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>v{app.version}</span>
                  <span>Port: {(app.settings as any)?.port || 'N/A'}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {((app.settings as any)?.features || []).slice(0, 3).map((feature: string) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                    {((app.settings as any)?.features || []).length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{((app.settings as any)?.features || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Details
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Cog6ToothIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
