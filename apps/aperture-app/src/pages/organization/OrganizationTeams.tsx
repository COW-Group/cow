import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  UserPlus,
  Settings,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { Database } from '../../lib/supabase';

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamWithMemberCount extends Team {
  memberCount?: number;
}

export function OrganizationTeams() {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamWithMemberCount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();

      if (!currentUser.organization_id) {
        console.warn('User has no organization');
        return;
      }

      setOrganizationId(currentUser.organization_id);

      const orgTeams = await supabasePermissionsService.getOrganizationTeams(
        currentUser.organization_id
      );

      // TODO: Get member counts for each team
      const teamsWithCounts: TeamWithMemberCount[] = orgTeams.map((team) => ({
        ...team,
        memberCount: 0, // Placeholder
      }));

      setTeams(teamsWithCounts);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName || !organizationId) return;

    try {
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();
      if (!currentUser) return;

      const result = await supabasePermissionsService.createTeam(
        organizationId,
        newTeamName,
        currentUser.id,
        { description: newTeamDescription }
      );

      if (result.success) {
        alert('Team created successfully!');
        setShowCreateModal(false);
        setNewTeamName('');
        setNewTeamDescription('');
        await loadTeams();
      } else {
        alert(`Failed to create team: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error creating team:', error);
      alert(`Failed to create team: ${error.message}`);
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization's teams and team members
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Team</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {searchQuery ? 'No teams found' : 'No teams yet'}
            </h3>
            <p className="text-gray-500 mt-2">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Get started by creating your first team'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Team</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {team.avatar_url ? (
                        <img
                          src={team.avatar_url}
                          alt={team.name}
                          className="h-12 w-12 rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                        {team.description && (
                          <p className="text-sm text-gray-500 mt-1">{team.description}</p>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <UserPlus className="w-4 h-4" />
                      <span>{team.memberCount || 0} members</span>
                    </div>
                    <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                      <span>View Team</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <UserPlus className="w-4 h-4" />
                      <span>Add Members</span>
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Team</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Engineering, Design, Marketing..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    rows={3}
                    placeholder="What does this team do?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
