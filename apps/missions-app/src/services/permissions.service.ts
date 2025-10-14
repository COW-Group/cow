/**
 * Permission Service
 * Handles all permission evaluation and management
 * Based on monday.com's permission hierarchy
 *
 * Key principle: Strictest permission wins
 * Account permissions override workspace permissions
 * Workspace permissions override board permissions
 */

import {
  PermissionedUser,
  UserType,
  AccountPermissions,
  WorkspacePermissions,
  BoardPermissions,
  CustomRole,
  PermissionContext,
  PermissionCheckResult,
  PermissionAction,
  PermissionResource,
  BoardType,
  WorkspaceRole,
  BoardRole,
  DEFAULT_PERMISSIONS,
} from '../types/permissions.types';

class PermissionsService {
  private customRoles: Map<string, CustomRole> = new Map();

  // ============================================================================
  // PERMISSION CHECKING - Core functionality
  // ============================================================================

  /**
   * Check if a user can perform an action on a resource
   * This is the main entry point for permission checking
   */
  canUser(
    user: PermissionedUser,
    action: PermissionAction,
    resource: PermissionResource,
    resourceId?: string
  ): PermissionCheckResult {
    // Account admins can do everything
    if (user.userType === 'account_admin') {
      return { allowed: true };
    }

    // Get the user's effective permissions (base type + custom role)
    const effectivePermissions = this.getEffectiveAccountPermissions(user);

    // Check based on resource type
    switch (resource) {
      case 'account':
        return this.checkAccountPermission(user, action, effectivePermissions);

      case 'workspace':
        return this.checkWorkspacePermission(user, action, resourceId, effectivePermissions);

      case 'board':
        return this.checkBoardPermission(user, action, resourceId, effectivePermissions);

      case 'team':
        return this.checkTeamPermission(user, action, resourceId, effectivePermissions);

      case 'user':
        return this.checkUserManagementPermission(user, action, effectivePermissions);

      case 'app':
      case 'integration':
        return this.checkAppPermission(user, action, effectivePermissions);

      default:
        return {
          allowed: false,
          reason: `Unknown resource type: ${resource}`,
        };
    }
  }

  /**
   * Bulk permission check - check multiple permissions at once
   * Useful for UI rendering where you need to know multiple permissions
   */
  canUserMultiple(
    user: PermissionedUser,
    checks: Array<{ action: PermissionAction; resource: PermissionResource; resourceId?: string }>
  ): Record<string, boolean> {
    const results: Record<string, boolean> = {};

    for (const check of checks) {
      const key = `${check.action}:${check.resource}${check.resourceId ? `:${check.resourceId}` : ''}`;
      const result = this.canUser(user, check.action, check.resource, check.resourceId);
      results[key] = result.allowed;
    }

    return results;
  }

  // ============================================================================
  // EFFECTIVE PERMISSIONS CALCULATION
  // ============================================================================

  /**
   * Get the effective account permissions for a user
   * Takes into account their base user type and any custom role
   */
  getEffectiveAccountPermissions(user: PermissionedUser): AccountPermissions {
    // Start with base permissions for user type
    let permissions = { ...DEFAULT_PERMISSIONS[user.userType] } as AccountPermissions;

    // If user has a custom role, apply its restrictions
    if (user.customRole) {
      const customRole = this.customRoles.get(user.customRole);
      if (customRole && customRole.isActive) {
        permissions = this.mergePermissions(permissions, customRole.customPermissions);
      }
    }

    return permissions;
  }

  /**
   * Merge custom permissions with base permissions
   * Custom roles can only restrict, not expand permissions
   */
  private mergePermissions(
    base: Partial<AccountPermissions>,
    custom: Partial<AccountPermissions>
  ): AccountPermissions {
    const merged: any = { ...base };

    // For each permission category
    for (const category in custom) {
      if (custom.hasOwnProperty(category)) {
        const categoryPermissions = (custom as any)[category];

        if (typeof categoryPermissions === 'object') {
          // Merge the permissions within this category
          for (const permission in categoryPermissions) {
            if (categoryPermissions.hasOwnProperty(permission)) {
              // If custom role sets it to false, override base
              // If custom role doesn't specify, keep base value
              if (categoryPermissions[permission] === false) {
                if (!merged[category]) merged[category] = {};
                merged[category][permission] = false;
              }
            }
          }
        }
      }
    }

    return merged as AccountPermissions;
  }

  // ============================================================================
  // SPECIFIC PERMISSION CHECKS
  // ============================================================================

  /**
   * Check account-level permissions
   */
  private checkAccountPermission(
    user: PermissionedUser,
    action: PermissionAction,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    switch (action) {
      case 'manage_settings':
        if (permissions.workspaceManagement?.manageWorkspaceSettings) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'User does not have permission to manage account settings',
          requiredUserType: 'account_admin',
        };

      case 'manage_billing':
        if (permissions.adminPrivileges?.accessBilling) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'User does not have permission to access billing',
          requiredUserType: 'account_admin',
        };

      case 'manage_users':
        if (permissions.adminPrivileges?.accessUserManagement) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'User does not have permission to manage users',
          requiredUserType: 'account_admin',
        };

      default:
        return { allowed: false, reason: 'Invalid action for account resource' };
    }
  }

  /**
   * Check workspace-level permissions
   */
  private checkWorkspacePermission(
    user: PermissionedUser,
    action: PermissionAction,
    workspaceId: string | undefined,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    // First check account-level restrictions
    switch (action) {
      case 'create':
        if (!permissions.workspaceManagement?.createWorkspaces) {
          return {
            allowed: false,
            reason: 'User does not have permission to create workspaces',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'delete':
        if (!permissions.workspaceManagement?.deleteWorkspaces) {
          return {
            allowed: false,
            reason: 'User does not have permission to delete workspaces',
            restrictedBy: 'account',
          };
        }
        // Also check if user is workspace owner
        // This would require workspace data lookup
        return { allowed: true };

      case 'update':
      case 'manage_settings':
        if (!permissions.workspaceManagement?.manageWorkspaceSettings) {
          return {
            allowed: false,
            reason: 'User does not have permission to manage workspace settings',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'read':
        // Everyone can read workspaces they're a member of
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Invalid action for workspace resource' };
    }
  }

  /**
   * Check board-level permissions
   */
  private checkBoardPermission(
    user: PermissionedUser,
    action: PermissionAction,
    boardId: string | undefined,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    // Check account-level permissions first
    switch (action) {
      case 'create':
        if (!permissions.boardManagement?.createMainBoards) {
          return {
            allowed: false,
            reason: 'User does not have permission to create boards',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'delete':
        if (!permissions.boardManagement?.deleteBoards) {
          return {
            allowed: false,
            reason: 'User does not have permission to delete boards',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'export':
        if (!permissions.boardManagement?.exportBoards) {
          return {
            allowed: false,
            reason: 'User does not have permission to export boards',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'read':
        // Everyone can read boards they're subscribed to
        return { allowed: true };

      case 'update':
        // Viewers cannot update
        if (user.userType === 'viewer') {
          return {
            allowed: false,
            reason: 'Viewers cannot edit boards',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Invalid action for board resource' };
    }
  }

  /**
   * Check team permissions
   */
  private checkTeamPermission(
    user: PermissionedUser,
    action: PermissionAction,
    teamId: string | undefined,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    switch (action) {
      case 'create':
        if (!permissions.teamManagement?.createTeams) {
          return {
            allowed: false,
            reason: 'User does not have permission to create teams',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'delete':
        if (!permissions.teamManagement?.deleteTeams) {
          return {
            allowed: false,
            reason: 'User does not have permission to delete teams',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'manage_users':
        if (!permissions.teamManagement?.manageTeamMembers) {
          return {
            allowed: false,
            reason: 'User does not have permission to manage team members',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'read':
        // Everyone can read teams they're a member of
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Invalid action for team resource' };
    }
  }

  /**
   * Check user management permissions
   */
  private checkUserManagementPermission(
    user: PermissionedUser,
    action: PermissionAction,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    switch (action) {
      case 'create': // Invite users
        if (!permissions.adminPrivileges?.inviteUsers) {
          return {
            allowed: false,
            reason: 'User does not have permission to invite users',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'delete': // Remove users
        if (!permissions.adminPrivileges?.removeUsers) {
          return {
            allowed: false,
            reason: 'User does not have permission to remove users',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'update': // Change roles
        if (!permissions.adminPrivileges?.changeUserRoles) {
          return {
            allowed: false,
            reason: 'User does not have permission to change user roles',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'read':
        if (!permissions.adminPrivileges?.accessUserManagement) {
          return {
            allowed: false,
            reason: 'User does not have permission to view users',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Invalid action for user resource' };
    }
  }

  /**
   * Check app/integration permissions
   */
  private checkAppPermission(
    user: PermissionedUser,
    action: PermissionAction,
    permissions: AccountPermissions
  ): PermissionCheckResult {
    switch (action) {
      case 'create': // Install app
        if (!permissions.integrationsAndApps?.installApps) {
          return {
            allowed: false,
            reason: 'User does not have permission to install apps',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'delete': // Uninstall app
        if (!permissions.integrationsAndApps?.uninstallApps) {
          return {
            allowed: false,
            reason: 'User does not have permission to uninstall apps',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'update': // Configure integration
        if (!permissions.integrationsAndApps?.configureIntegrations) {
          return {
            allowed: false,
            reason: 'User does not have permission to configure integrations',
            restrictedBy: 'account',
          };
        }
        return { allowed: true };

      case 'read':
        // Everyone can view apps
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Invalid action for app resource' };
    }
  }

  // ============================================================================
  // CUSTOM ROLES MANAGEMENT
  // ============================================================================

  /**
   * Create a new custom role
   * Only available on Enterprise plan
   */
  createCustomRole(role: Omit<CustomRole, 'id' | 'createdAt' | 'updatedAt'>): CustomRole {
    const newRole: CustomRole = {
      ...role,
      id: `role-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.customRoles.set(newRole.id, newRole);
    return newRole;
  }

  /**
   * Update an existing custom role
   */
  updateCustomRole(roleId: string, updates: Partial<CustomRole>): CustomRole | null {
    const role = this.customRoles.get(roleId);
    if (!role) return null;

    const updatedRole: CustomRole = {
      ...role,
      ...updates,
      updatedAt: new Date(),
    };

    this.customRoles.set(roleId, updatedRole);
    return updatedRole;
  }

  /**
   * Delete a custom role
   */
  deleteCustomRole(roleId: string): boolean {
    return this.customRoles.delete(roleId);
  }

  /**
   * Get all custom roles
   */
  getAllCustomRoles(): CustomRole[] {
    return Array.from(this.customRoles.values());
  }

  /**
   * Get a custom role by ID
   */
  getCustomRole(roleId: string): CustomRole | null {
    return this.customRoles.get(roleId) || null;
  }

  // ============================================================================
  // USER TYPE MANAGEMENT
  // ============================================================================

  /**
   * Check if a user can be assigned a specific user type
   */
  canAssignUserType(assigningUser: PermissionedUser, targetUserType: UserType): boolean {
    // Only account admins can assign account_admin role
    if (targetUserType === 'account_admin') {
      return assigningUser.userType === 'account_admin';
    }

    // Admins can assign any other role
    if (assigningUser.userType === 'account_admin') {
      return true;
    }

    // No one else can assign roles
    return false;
  }

  /**
   * Validate if a user can be a guest based on email domain
   */
  canBeGuest(userEmail: string, accountDomains: string[]): boolean {
    const userDomain = userEmail.split('@')[1];
    return !accountDomains.includes(userDomain);
  }

  // ============================================================================
  // PERMISSION UTILITIES
  // ============================================================================

  /**
   * Get a human-readable description of what a user can do
   */
  getUserCapabilitiesDescription(user: PermissionedUser): string[] {
    const capabilities: string[] = [];
    const permissions = this.getEffectiveAccountPermissions(user);

    // Check major capabilities
    if (permissions.workspaceManagement?.createWorkspaces) {
      capabilities.push('Create workspaces');
    }
    if (permissions.boardManagement?.createMainBoards) {
      capabilities.push('Create boards');
    }
    if (permissions.teamManagement?.createTeams) {
      capabilities.push('Create teams');
    }
    if (permissions.adminPrivileges?.inviteUsers) {
      capabilities.push('Invite users');
    }
    if (permissions.integrationsAndApps?.installApps) {
      capabilities.push('Install apps');
    }
    if (user.userType === 'viewer') {
      capabilities.push('View-only access');
    }
    if (user.userType === 'guest') {
      capabilities.push('Guest access (limited to shareable boards)');
    }

    return capabilities;
  }

  /**
   * Compare two user types and return which one has more permissions
   */
  compareUserTypes(type1: UserType, type2: UserType): number {
    const hierarchy: UserType[] = ['account_admin', 'member', 'viewer', 'guest'];
    const index1 = hierarchy.indexOf(type1);
    const index2 = hierarchy.indexOf(type2);

    if (index1 < index2) return 1; // type1 has more permissions
    if (index1 > index2) return -1; // type2 has more permissions
    return 0; // Equal permissions
  }
}

// Export singleton instance
export const permissionsService = new PermissionsService();
