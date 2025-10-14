import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Mail,
  MoreVertical,
  Shield,
  Trash2,
  Crown,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { Database } from '../../lib/supabase';

type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface MemberWithProfile extends OrganizationMember {
  profile?: Profile;
}

type RoleFilter = 'all' | 'owner' | 'admin' | 'member' | 'guest';

export function OrganizationMembers() {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'guest'>('member');
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();

      if (!currentUser.organization_id) {
        console.warn('User has no organization');
        return;
      }

      setOrganizationId(currentUser.organization_id);

      // TODO: Implement getOrganizationMembers in supabasePermissionsService
      // For now, this is a placeholder
      const mockMembers: MemberWithProfile[] = [
        {
          id: '1',
          organization_id: currentUser.organization_id,
          user_id: currentUser.id,
          role: 'owner',
          can_invite_users: true,
          can_manage_billing: true,
          can_manage_settings: true,
          can_create_workspaces: true,
          invited_by: null,
          joined_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          profile: currentUser,
        },
      ];

      setMembers(mockMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !organizationId) return;

    try {
      // TODO: Implement invitation functionality
      alert(`Invitation would be sent to ${inviteEmail} with role ${inviteRole}`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
    } catch (error: any) {
      console.error('Error inviting member:', error);
      alert(`Failed to invite member: ${error.message}`);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: 'owner' | 'admin' | 'member' | 'guest') => {
    try {
      // TODO: Implement role update functionality
      alert(`Would update member ${memberId} to role ${newRole}`);
      await loadMembers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      alert(`Failed to update role: ${error.message}`);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      // TODO: Implement member removal functionality
      alert(`Would remove member ${memberId}`);
      await loadMembers();
    } catch (error: any) {
      console.error('Error removing member:', error);
      alert(`Failed to remove member: ${error.message}`);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-green-100 text-green-700';
      case 'guest':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading members...</div>
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
              <h1 className="text-2xl font-semibold text-gray-900">Organization Members</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization's members and their permissions
              </p>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-6 flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-gray-900">No members found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchQuery || roleFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Get started by inviting your first member'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.profile?.avatar_url ? (
                          <img
                            src={member.profile.avatar_url}
                            alt={member.profile.full_name || 'User'}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {member.profile?.full_name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.profile?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">{member.profile?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.last_active_at
                        ? new Date(member.last_active_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {member.can_invite_users && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Invite
                          </span>
                        )}
                        {member.can_manage_billing && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Billing
                          </span>
                        )}
                        {member.can_manage_settings && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Settings
                          </span>
                        )}
                        {member.can_create_workspaces && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Workspaces
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {/* TODO: Add dropdown menu for actions */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Invite Member</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {inviteRole === 'admin' &&
                      'Admins can manage members, settings, and billing'}
                    {inviteRole === 'member' &&
                      'Members can create and manage workspaces and boards'}
                    {inviteRole === 'guest' && 'Guests have limited access to specific boards'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!inviteEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
