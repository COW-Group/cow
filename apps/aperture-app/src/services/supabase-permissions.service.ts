/**
 * Supabase Permissions Service
 * Handles all database operations for the multi-tenant permissions system
 * Integrates with organizations, user roles, and teams
 */

import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

// Type helpers
type UserRole = Database['public']['Tables']['user_roles']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UserWithRoles extends Profile {
  roles: UserRole[];
  organizations: (Organization & { memberRole: string })[];
  teams: (Team & { memberRole: string })[];
}

export interface PermissionCheckOptions {
  userId: string;
  role: string;
  contextType?: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board';
  contextId?: string;
}

export class SupabasePermissionsService {
  // ============================================================================
  // USER ROLES - Check and manage user roles
  // ============================================================================

  /**
   * Check if a user has a specific role
   */
  async hasRole(options: PermissionCheckOptions): Promise<boolean> {
    try {
      const { userId, role, contextType, contextId } = options;

      let query = supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', role)
        .eq('is_active', true);

      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      if (contextId) {
        query = query.eq('context_id', contextId);
      } else if (contextType) {
        // For ecosystem/platform roles, context_id should be null
        query = query.is('context_id', null);
      }

      const { data, error } = await query.single();

      if (error) {
        // Not found is OK - just means they don't have the role
        if (error.code === 'PGRST116') {
          return false;
        }
        console.error('Error checking role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Failed to check role:', error);
      return false;
    }
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user roles:', error);
      return [];
    }
  }

  /**
   * Grant a role to a user
   */
  async grantRole(
    userId: string,
    role: string,
    contextType: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board',
    contextId: string | null,
    contextName: string | null,
    grantedBy: string
  ): Promise<{ success: boolean; roleId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          context_type: contextType,
          context_id: contextId,
          context_name: contextName,
          granted_by: grantedBy,
          is_active: true,
        })
        .select('id')
        .single();

      if (error) {
        // Check for unique constraint violation (role already exists)
        if (error.code === '23505') {
          return {
            success: false,
            error: 'User already has this role in this context',
          };
        }
        console.error('Error granting role:', error);
        return { success: false, error: error.message };
      }

      return { success: true, roleId: data.id };
    } catch (error: any) {
      console.error('Failed to grant role:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke a role from a user
   */
  async revokeRole(
    userId: string,
    role: string,
    contextType: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board',
    contextId: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let query = supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role)
        .eq('context_type', contextType);

      if (contextId) {
        query = query.eq('context_id', contextId);
      } else {
        query = query.is('context_id', null);
      }

      const { error } = await query;

      if (error) {
        console.error('Error revoking role:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to revoke role:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is ecosystem admin (highest level)
   */
  async isEcosystemAdmin(userId: string): Promise<boolean> {
    return this.hasRole({
      userId,
      role: 'ecosystem_admin',
      contextType: 'ecosystem',
    });
  }

  /**
   * Check if user is platform admin (aperture-app wide)
   */
  async isPlatformAdmin(userId: string): Promise<boolean> {
    return this.hasRole({
      userId,
      role: 'platform_admin',
      contextType: 'platform',
    });
  }

  /**
   * Check if user is account admin of a specific organization
   */
  async isAccountAdmin(userId: string, organizationId: string): Promise<boolean> {
    return this.hasRole({
      userId,
      role: 'account_admin',
      contextType: 'organization',
      contextId: organizationId,
    });
  }

  // ============================================================================
  // ORGANIZATIONS - Manage multi-tenant organizations
  // ============================================================================

  /**
   * Get all organizations a user belongs to
   */
  async getUserOrganizations(userId: string): Promise<(Organization & { memberRole: string })[]> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          organizations (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user organizations:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        ...item.organizations,
        memberRole: item.role,
      }));
    } catch (error) {
      console.error('Failed to fetch user organizations:', error);
      return [];
    }
  }

  /**
   * Get a specific organization
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      return null;
    }
  }

  /**
   * Create a new organization
   */
  async createOrganization(
    name: string,
    slug: string,
    ownerId: string,
    options?: {
      description?: string;
      type?: 'business' | 'personal' | 'enterprise' | 'non-profit';
      plan?: 'free' | 'starter' | 'professional' | 'enterprise';
    }
  ): Promise<{ success: boolean; organization?: Organization; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name,
          slug,
          owner_id: ownerId,
          type: options?.type || 'business',
          plan: options?.plan || 'free',
          description: options?.description,
          is_personal: options?.type === 'personal',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating organization:', error);
        return { success: false, error: error.message };
      }

      // Add owner as organization member
      await supabase.from('organization_members').insert({
        organization_id: data.id,
        user_id: ownerId,
        role: 'owner',
        can_invite_users: true,
        can_manage_billing: true,
        can_manage_settings: true,
        can_create_workspaces: true,
      });

      return { success: true, organization: data };
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all members of an organization
   */
  async getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organizationId)
        .order('joined_at', { ascending: true });

      if (error) {
        console.error('Error fetching organization members:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch organization members:', error);
      return [];
    }
  }

  /**
   * Add a user to an organization
   */
  async addOrganizationMember(
    organizationId: string,
    userId: string,
    role: 'owner' | 'admin' | 'member' | 'guest',
    invitedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('organization_members').insert({
        organization_id: organizationId,
        user_id: userId,
        role,
        invited_by: invitedBy,
        can_invite_users: role === 'owner' || role === 'admin',
        can_manage_billing: role === 'owner' || role === 'admin',
        can_manage_settings: role === 'owner' || role === 'admin',
        can_create_workspaces: role !== 'guest',
      });

      if (error) {
        console.error('Error adding organization member:', error);
        return { success: false, error: error.message };
      }

      // Update user's organization_id in profiles
      await supabase
        .from('profiles')
        .update({ organization_id: organizationId })
        .eq('id', userId);

      return { success: true };
    } catch (error: any) {
      console.error('Failed to add organization member:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // TEAMS - Manage teams within organizations
  // ============================================================================

  /**
   * Get all teams in an organization
   */
  async getOrganizationTeams(organizationId: string): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching teams:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }
  }

  /**
   * Get teams a user belongs to
   */
  async getUserTeams(userId: string): Promise<(Team & { memberRole: string })[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user teams:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        ...item.teams,
        memberRole: item.role,
      }));
    } catch (error) {
      console.error('Failed to fetch user teams:', error);
      return [];
    }
  }

  /**
   * Create a new team
   */
  async createTeam(
    organizationId: string,
    name: string,
    ownerId: string,
    options?: {
      description?: string;
      parentTeamId?: string;
    }
  ): Promise<{ success: boolean; team?: Team; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          organization_id: organizationId,
          name,
          owner_id: ownerId,
          description: options?.description,
          parent_team_id: options?.parentTeamId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        return { success: false, error: error.message };
      }

      // Add owner as team member
      await supabase.from('team_members').insert({
        team_id: data.id,
        user_id: ownerId,
        role: 'team_owner',
        added_by: ownerId,
      });

      return { success: true, team: data };
    } catch (error: any) {
      console.error('Failed to create team:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('added_at', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      return [];
    }
  }

  /**
   * Add a user to a team
   */
  async addTeamMember(
    teamId: string,
    userId: string,
    role: 'team_owner' | 'team_admin' | 'team_member' | 'team_guest',
    addedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('team_members').insert({
        team_id: teamId,
        user_id: userId,
        role,
        added_by: addedBy,
      });

      if (error) {
        console.error('Error adding team member:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to add team member:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // USER PROFILE - Extended user information with roles
  // ============================================================================

  /**
   * Get complete user profile with all roles, organizations, and teams
   */
  async getUserProfile(userId: string): Promise<UserWithRoles | null> {
    try {
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Get roles
      const roles = await this.getUserRoles(userId);

      // Get organizations
      const organizations = await this.getUserOrganizations(userId);

      // Get teams - with error handling
      let teams: (Team & { memberRole: string })[] = [];
      try {
        teams = await this.getUserTeams(userId);
      } catch (error) {
        console.error('Error loading teams (will continue without them):', error);
        teams = [];
      }

      return {
        ...profile,
        roles,
        organizations,
        teams,
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  /**
   * Get current user's profile (using Supabase auth)
   */
  async getCurrentUserProfile(): Promise<UserWithRoles | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return this.getUserProfile(user.id);
    } catch (error) {
      console.error('Failed to fetch current user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(
    organizationId: string,
    updates: Partial<Organization>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organizationId);

      if (error) {
        console.error('Error updating organization:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // PLATFORM & ECOSYSTEM MANAGEMENT
  // ============================================================================

  /**
   * Get all organizations (platform admin only)
   */
  async getAllOrganizations(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all organizations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch all organizations:', error);
      return [];
    }
  }

  /**
   * Get platform statistics (platform admin only)
   */
  async getPlatformStats(): Promise<{
    totalOrganizations: number;
    totalUsers: number;
    totalTeams: number;
    totalWorkspaces: number;
  }> {
    try {
      const [orgsResult, usersResult, teamsResult, workspacesResult] = await Promise.all([
        supabase.from('organizations').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('workspaces').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalOrganizations: orgsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalTeams: teamsResult.count || 0,
        totalWorkspaces: workspacesResult.count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch platform stats:', error);
      return {
        totalOrganizations: 0,
        totalUsers: 0,
        totalTeams: 0,
        totalWorkspaces: 0,
      };
    }
  }
}

// Export singleton instance
export const supabasePermissionsService = new SupabasePermissionsService();
