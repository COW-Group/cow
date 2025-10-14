import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BuildingOfficeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { Database } from '../../lib/supabase';

type Team = Database['public']['Tables']['teams']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];

interface TeamWithOrganization extends Team {
  organization?: Organization;
  memberCount?: number;
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<TeamWithOrganization[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamWithOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, teams]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      // TODO: Implement getAllTeams in supabasePermissionsService
      // For now, this is a placeholder with mock data
      const mockTeams: TeamWithOrganization[] = [
        {
          id: '1',
          organization_id: '1',
          name: 'Engineering',
          description: 'Product engineering team',
          avatar_url: null,
          owner_id: '1',
          parent_team_id: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization: {
            id: '1',
            name: 'Acme Inc',
            slug: 'acme-inc',
            description: 'Technology company',
            avatar_url: null,
            owner_id: '1',
            type: 'business',
            plan: 'professional',
            plan_limits: null,
            settings: null,
            is_active: true,
            is_personal: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          memberCount: 12,
        },
        {
          id: '2',
          organization_id: '1',
          name: 'Design',
          description: 'Product design and UX team',
          avatar_url: null,
          owner_id: '2',
          parent_team_id: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization: {
            id: '1',
            name: 'Acme Inc',
            slug: 'acme-inc',
            description: 'Technology company',
            avatar_url: null,
            owner_id: '1',
            type: 'business',
            plan: 'professional',
            plan_limits: null,
            settings: null,
            is_active: true,
            is_personal: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          memberCount: 8,
        },
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    if (!searchQuery.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query) ||
        team.organization?.name.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
          <p className="mt-2 text-gray-600">
            Manage teams across all organizations in the COW ecosystem
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teams</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {teams.length.toLocaleString()}
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
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {teams.reduce((acc, team) => acc + (team.memberCount || 0), 0).toLocaleString()}
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
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Organizations</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {new Set(teams.map((t) => t.organization_id)).size.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search teams by name, description, or organization..."
          />
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Organization
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Members
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchQuery ? 'No teams found' : 'No teams yet'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : 'Get started by creating a new team'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {team.avatar_url ? (
                          <img className="h-10 w-10 rounded-full" src={team.avatar_url} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{team.name}</div>
                        {team.description && (
                          <div className="text-sm text-gray-500">{team.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link
                        to={`/organizations`}
                        className="text-sm text-blue-600 hover:text-blue-900"
                      >
                        {team.organization?.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{team.memberCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(team.is_active)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(team.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
