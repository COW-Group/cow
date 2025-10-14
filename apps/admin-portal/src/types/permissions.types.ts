/**
 * Permissions System for Missions App
 * Based on monday.com's permission hierarchy
 *
 * Hierarchy: Account > Workspace > Board
 * When multiple permissions exist, the strictest one applies
 */

// ============================================================================
// USER TYPES (Account Level)
// ============================================================================

/**
 * User types determine the base level of access a user has in the account
 * Similar to monday.com's user types
 */
export type UserType =
  | 'account_admin'   // Full account access - manage everything
  | 'member'          // Standard team member - can create and edit
  | 'viewer'          // Read-only access - cannot make changes
  | 'guest';          // External user - limited to specific boards

/**
 * Extended user interface with permissions
 */
export interface PermissionedUser {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  customRole?: string; // Reference to custom role ID (Enterprise feature)
  accountPermissions: AccountPermissions;
  isActive: boolean;
  emailDomain: string; // Used to identify guests (different domain)
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ACCOUNT PERMISSIONS (Highest Level)
// ============================================================================

/**
 * Account-level permissions - available on Enterprise plan
 * These are the highest level permissions that apply across the entire account
 */
export interface AccountPermissions {
  // === ADMIN PRIVILEGES ===
  adminPrivileges: {
    // User Management
    accessUserManagement: boolean;           // View and manage users
    inviteUsers: boolean;                    // Invite new users to account
    removeUsers: boolean;                    // Remove users from account
    changeUserRoles: boolean;                // Change user types/roles
    manageBoardOwnership: boolean;           // Transfer board ownership
    manageAutomationOwnership: boolean;      // Transfer automation ownership

    // Security
    accessSecurity: boolean;                 // Access security settings
    configureSSO: boolean;                   // Configure single sign-on
    viewAuditLogs: boolean;                  // View audit logs
    manageCompliance: boolean;               // Manage compliance settings
    manageSessionSettings: boolean;          // Manage session timeouts
    activatePanicMode: boolean;              // Emergency account lockdown

    // Billing
    accessBilling: boolean;                  // View and manage billing
    changePlan: boolean;                     // Upgrade/downgrade plan
    manageInvoices: boolean;                 // Manage invoice settings
    updatePaymentMethod: boolean;            // Update payment methods
    manageBillingContacts: boolean;          // Manage billing contacts
  };

  // === WORKSPACE MANAGEMENT ===
  workspaceManagement: {
    createWorkspaces: boolean;               // Create new workspaces
    deleteWorkspaces: boolean;               // Delete workspaces
    manageWorkspaceSettings: boolean;        // Edit workspace settings
    transferWorkspaceOwnership: boolean;     // Transfer workspace ownership
  };

  // === BOARD MANAGEMENT ===
  boardManagement: {
    createMainBoards: boolean;               // Create main boards
    createPrivateBoards: boolean;            // Create private boards
    createShareableBoards: boolean;          // Create shareable boards
    deleteBoards: boolean;                   // Delete boards
    archiveBoards: boolean;                  // Archive boards
    duplicateBoards: boolean;                // Duplicate boards
    exportBoards: boolean;                   // Export board data
  };

  // === TEAM MANAGEMENT ===
  teamManagement: {
    createTeams: boolean;                    // Create teams
    deleteTeams: boolean;                    // Delete teams
    manageTeamMembers: boolean;              // Add/remove team members
    createSubTeams: boolean;                 // Create sub-teams (Enterprise)
  };

  // === INTEGRATIONS & APPS ===
  integrationsAndApps: {
    installApps: boolean;                    // Install apps from marketplace
    uninstallApps: boolean;                  // Uninstall apps
    configureIntegrations: boolean;          // Set up integrations
    manageAPIAccess: boolean;                // Manage API tokens
  };

  // === CONTENT CREATION ===
  contentCreation: {
    createDocs: boolean;                     // Create documents
    createDashboards: boolean;               // Create dashboards
    createForms: boolean;                    // Create forms
    createAutomations: boolean;              // Create automations
  };
}

// ============================================================================
// WORKSPACE PERMISSIONS (Middle Level)
// ============================================================================

/**
 * Workspace role determines permissions within a specific workspace
 */
export type WorkspaceRole =
  | 'workspace_owner'   // Created the workspace, full control
  | 'workspace_member'  // Can create/edit content in workspace
  | 'workspace_viewer'; // Can only view workspace content

/**
 * Workspace-specific permissions
 * Applied to users within a workspace context
 */
export interface WorkspacePermissions {
  workspaceId: string;
  role: WorkspaceRole;

  // What can this user do in this workspace?
  canCreateBoards: boolean;
  canCreateDashboards: boolean;
  canCreateDocs: boolean;
  canCreateFolders: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canEditWorkspaceSettings: boolean;
  canDeleteWorkspace: boolean;
  canManageWorkspaceApps: boolean;

  // Custom restrictions (Enterprise feature)
  customRestrictions?: {
    maxBoardsCreation?: number;
    allowedBoardTypes?: BoardType[];
    restrictedFeatures?: string[];
  };
}

// ============================================================================
// BOARD PERMISSIONS (Lowest Level, Most Specific)
// ============================================================================

/**
 * Board types determine default visibility
 */
export type BoardType =
  | 'main'         // Visible to all team members
  | 'private'      // Only visible to invited users
  | 'shareable';   // Can be shared with external users

/**
 * Board role determines what a user can do on a specific board
 */
export type BoardRole =
  | 'board_owner'     // Created the board, full control
  | 'board_editor'    // Can edit all content
  | 'board_viewer'    // Can only view content
  | 'board_guest';    // Limited external access

/**
 * Board-specific permissions
 * Most granular level of permissions
 */
export interface BoardPermissions {
  boardId: string;
  boardType: BoardType;
  role: BoardRole;

  // Board structure
  canEditBoardStructure: boolean;          // Add/remove columns
  canChangeBoardSettings: boolean;         // Edit board settings
  canDeleteBoard: boolean;                 // Delete the board
  canDuplicateBoard: boolean;              // Duplicate the board
  canArchiveBoard: boolean;                // Archive the board

  // Items (rows)
  canCreateItems: boolean;                 // Create new items
  canEditItems: boolean;                   // Edit existing items
  canDeleteItems: boolean;                 // Delete items
  canMoveItems: boolean;                   // Move items between groups

  // Collaboration
  canInviteUsersToBoard: boolean;          // Invite new users
  canRemoveUsersFromBoard: boolean;        // Remove users
  canComment: boolean;                     // Add comments
  canMention: boolean;                     // Mention other users

  // Advanced features
  canCreateAutomations: boolean;           // Create automations
  canCreateIntegrations: boolean;          // Set up integrations
  canExportData: boolean;                  // Export board data
  canImportData: boolean;                  // Import data

  // Views
  canCreateViews: boolean;                 // Create custom views
  canShareViews: boolean;                  // Share views with others
}

// ============================================================================
// CUSTOM ROLES (Enterprise Feature)
// ============================================================================

/**
 * Custom roles allow creating specialized user types
 * Available on Enterprise plan only
 */
export interface CustomRole {
  id: string;
  name: string;
  description: string;
  baseUserType: Exclude<UserType, 'account_admin'>; // Must inherit from a base type

  // Custom role can only restrict permissions, not expand them
  customPermissions: Partial<AccountPermissions>;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  // Usage tracking
  assignedUserCount: number;
}

/**
 * Common custom role templates
 */
export type CustomRoleTemplate =
  | 'billing_admin'       // Can only access billing
  | 'user_manager'        // Can only manage users
  | 'security_admin'      // Can only manage security
  | 'workspace_creator'   // Can create workspaces but limited other access
  | 'board_admin';        // Can manage all boards but no account settings

// ============================================================================
// PERMISSION EVALUATION
// ============================================================================

/**
 * Permission context - used when evaluating if a user can perform an action
 */
export interface PermissionContext {
  userId: string;
  action: PermissionAction;
  resource: PermissionResource;
  resourceId?: string; // ID of board, workspace, etc.
}

/**
 * Actions that can be performed
 */
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share'
  | 'export'
  | 'manage_users'
  | 'manage_settings'
  | 'manage_billing';

/**
 * Resources that can be acted upon
 */
export type PermissionResource =
  | 'account'
  | 'workspace'
  | 'board'
  | 'item'
  | 'team'
  | 'user'
  | 'app'
  | 'integration'
  | 'automation'
  | 'dashboard'
  | 'doc';

/**
 * Result of permission check
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  restrictedBy?: 'account' | 'workspace' | 'board'; // Which level denied access
  requiredUserType?: UserType;
  requiredRole?: WorkspaceRole | BoardRole;
}

// ============================================================================
// PERMISSION ASSIGNMENT & MANAGEMENT
// ============================================================================

/**
 * Assign permissions to a user
 */
export interface PermissionAssignment {
  userId: string;
  resource: PermissionResource;
  resourceId: string;
  role: WorkspaceRole | BoardRole;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date; // Optional expiration for temporary access
}

/**
 * Permission change log - for audit trail
 */
export interface PermissionChangeLog {
  id: string;
  userId: string;
  changedBy: string;
  changeType: 'granted' | 'revoked' | 'modified';
  resource: PermissionResource;
  resourceId?: string;
  oldPermissions?: any;
  newPermissions?: any;
  reason?: string;
  timestamp: Date;
}

// ============================================================================
// TEAM PERMISSIONS
// ============================================================================

/**
 * Team-level permissions
 * When a user is part of a team, they inherit team permissions
 */
export interface TeamPermissions {
  teamId: string;
  role: 'team_owner' | 'team_admin' | 'team_member' | 'team_guest';

  // What can users with this role do?
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canManageTeamSettings: boolean;
  canCreateSubTeams: boolean; // Enterprise only
  canViewTeamContent: boolean;
  canEditTeamContent: boolean;
}

// ============================================================================
// PERMISSION DEFAULTS
// ============================================================================

/**
 * Default permissions for each user type
 * These are the baseline permissions before any custom roles
 */
export const DEFAULT_PERMISSIONS: Record<UserType, Partial<AccountPermissions>> = {
  account_admin: {
    // Full access to everything
    adminPrivileges: {
      accessUserManagement: true,
      inviteUsers: true,
      removeUsers: true,
      changeUserRoles: true,
      manageBoardOwnership: true,
      manageAutomationOwnership: true,
      accessSecurity: true,
      configureSSO: true,
      viewAuditLogs: true,
      manageCompliance: true,
      manageSessionSettings: true,
      activatePanicMode: true,
      accessBilling: true,
      changePlan: true,
      manageInvoices: true,
      updatePaymentMethod: true,
      manageBillingContacts: true,
    },
    workspaceManagement: {
      createWorkspaces: true,
      deleteWorkspaces: true,
      manageWorkspaceSettings: true,
      transferWorkspaceOwnership: true,
    },
    boardManagement: {
      createMainBoards: true,
      createPrivateBoards: true,
      createShareableBoards: true,
      deleteBoards: true,
      archiveBoards: true,
      duplicateBoards: true,
      exportBoards: true,
    },
    teamManagement: {
      createTeams: true,
      deleteTeams: true,
      manageTeamMembers: true,
      createSubTeams: true,
    },
    integrationsAndApps: {
      installApps: true,
      uninstallApps: true,
      configureIntegrations: true,
      manageAPIAccess: true,
    },
    contentCreation: {
      createDocs: true,
      createDashboards: true,
      createForms: true,
      createAutomations: true,
    },
  },

  member: {
    // Standard user access
    adminPrivileges: {
      accessUserManagement: false,
      inviteUsers: true, // Members can invite others
      removeUsers: false,
      changeUserRoles: false,
      manageBoardOwnership: false,
      manageAutomationOwnership: false,
      accessSecurity: false,
      configureSSO: false,
      viewAuditLogs: false,
      manageCompliance: false,
      manageSessionSettings: false,
      activatePanicMode: false,
      accessBilling: false,
      changePlan: false,
      manageInvoices: false,
      updatePaymentMethod: false,
      manageBillingContacts: false,
    },
    workspaceManagement: {
      createWorkspaces: true, // Can be restricted by custom role
      deleteWorkspaces: false,
      manageWorkspaceSettings: false,
      transferWorkspaceOwnership: false,
    },
    boardManagement: {
      createMainBoards: true,
      createPrivateBoards: true,
      createShareableBoards: true,
      deleteBoards: false, // Can only delete own boards
      archiveBoards: true,
      duplicateBoards: true,
      exportBoards: true,
    },
    teamManagement: {
      createTeams: true,
      deleteTeams: false,
      manageTeamMembers: false,
      createSubTeams: false,
    },
    integrationsAndApps: {
      installApps: true,
      uninstallApps: true,
      configureIntegrations: true,
      manageAPIAccess: false,
    },
    contentCreation: {
      createDocs: true,
      createDashboards: true,
      createForms: true,
      createAutomations: true,
    },
  },

  viewer: {
    // Read-only access
    adminPrivileges: {
      accessUserManagement: false,
      inviteUsers: false,
      removeUsers: false,
      changeUserRoles: false,
      manageBoardOwnership: false,
      manageAutomationOwnership: false,
      accessSecurity: false,
      configureSSO: false,
      viewAuditLogs: false,
      manageCompliance: false,
      manageSessionSettings: false,
      activatePanicMode: false,
      accessBilling: false,
      changePlan: false,
      manageInvoices: false,
      updatePaymentMethod: false,
      manageBillingContacts: false,
    },
    workspaceManagement: {
      createWorkspaces: false,
      deleteWorkspaces: false,
      manageWorkspaceSettings: false,
      transferWorkspaceOwnership: false,
    },
    boardManagement: {
      createMainBoards: false,
      createPrivateBoards: false,
      createShareableBoards: false,
      deleteBoards: false,
      archiveBoards: false,
      duplicateBoards: false,
      exportBoards: true, // Can export to review data
    },
    teamManagement: {
      createTeams: false,
      deleteTeams: false,
      manageTeamMembers: false,
      createSubTeams: false,
    },
    integrationsAndApps: {
      installApps: false,
      uninstallApps: false,
      configureIntegrations: false,
      manageAPIAccess: false,
    },
    contentCreation: {
      createDocs: false,
      createDashboards: false,
      createForms: false,
      createAutomations: false,
    },
  },

  guest: {
    // Very limited external access
    adminPrivileges: {
      accessUserManagement: false,
      inviteUsers: false,
      removeUsers: false,
      changeUserRoles: false,
      manageBoardOwnership: false,
      manageAutomationOwnership: false,
      accessSecurity: false,
      configureSSO: false,
      viewAuditLogs: false,
      manageCompliance: false,
      manageSessionSettings: false,
      activatePanicMode: false,
      accessBilling: false,
      changePlan: false,
      manageInvoices: false,
      updatePaymentMethod: false,
      manageBillingContacts: false,
    },
    workspaceManagement: {
      createWorkspaces: false,
      deleteWorkspaces: false,
      manageWorkspaceSettings: false,
      transferWorkspaceOwnership: false,
    },
    boardManagement: {
      createMainBoards: false,
      createPrivateBoards: false,
      createShareableBoards: false,
      deleteBoards: false,
      archiveBoards: false,
      duplicateBoards: false,
      exportBoards: false,
    },
    teamManagement: {
      createTeams: false,
      deleteTeams: false,
      manageTeamMembers: false,
      createSubTeams: false,
    },
    integrationsAndApps: {
      installApps: false,
      uninstallApps: false,
      configureIntegrations: false,
      manageAPIAccess: false,
    },
    contentCreation: {
      createDocs: false,
      createDashboards: false,
      createForms: false,
      createAutomations: false,
    },
  },
};
