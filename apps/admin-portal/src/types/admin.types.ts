/**
 * Admin Role Types for COW Admin Portal
 * Defines the hierarchy and permissions for different admin levels
 */

// ============================================================================
// ADMIN ROLE HIERARCHY
// ============================================================================

/**
 * Admin role levels in descending order of access:
 * 1. Ecosystem Admin (God Mode) - All apps and organizations
 * 2. Platform Admin - Single app only (e.g., missions-app)
 * 3. Organization Admin - Single organization within an app
 * 4. Specialized Admins - Cross-cutting roles (compliance, security, etc.)
 */
export type AdminRole =
  | 'ecosystem_admin'
  | 'platform_admin'
  | 'organization_admin'
  | 'compliance_admin'
  | 'security_admin'
  | 'support_admin'
  | 'billing_admin';

/**
 * Apps in the COW ecosystem
 */
export type EcosystemApp =
  | 'missions-app'
  | 'mauna-app'
  | 'mycow-app'
  | 'support-center'
  | 'platform-app'
  | 'products-site'
  | 'public-site';

// ============================================================================
// ADMIN USER
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;

  // For Platform Admins - which app they manage
  managedApp?: EcosystemApp;

  // For Organization Admins - which organization they manage
  organizationId?: string;
  organizationName?: string;

  // Additional roles (user can have multiple specialized roles)
  additionalRoles?: AdminRole[];

  // Metadata
  createdAt: Date;
  lastLoginAt?: Date;
}

// ============================================================================
// ADMIN CONTEXT
// ============================================================================

/**
 * Current admin context - what is the admin currently managing?
 */
export interface AdminContext {
  role: AdminRole;

  // If platform admin
  currentApp?: EcosystemApp;

  // If organization admin
  currentOrganization?: {
    id: string;
    name: string;
    app: EcosystemApp;
  };

  // Display scope
  scopeLabel: string; // e.g., "Ecosystem Administration", "Missions App", "Acme Corp"
}

// ============================================================================
// NAVIGATION PERMISSIONS
// ============================================================================

/**
 * What navigation sections should be visible for each role
 */
export interface NavigationPermissions {
  canViewEcosystemAdmin: boolean;
  canViewPlatformAdmin: boolean;
  canViewOrganizationAdmin: boolean;
  canViewCompliance: boolean;
  canViewSecurity: boolean;
  canViewSupport: boolean;
  canViewBilling: boolean;
  canViewLegacyFeatures: boolean;

  // App-specific permissions
  canManageMissionsApp: boolean;
  canManageMaunaApp: boolean;
  canManageMyCowApp: boolean;
  canManageSupportCenter: boolean;
  canManagePlatformApp: boolean;
}

// ============================================================================
// NAVIGATION STRUCTURE
// ============================================================================

/**
 * Navigation section definition
 */
export interface NavSection {
  id: string;
  label: string;
  badge?: string; // e.g., "God Mode", "App-Specific"
  items: NavItem[];
  requiredRole?: AdminRole[];
  requiredApp?: EcosystemApp; // For platform admin sections
  icon?: React.ComponentType<{ className?: string }>;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

/**
 * Individual navigation item
 */
export interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredRole?: AdminRole[];
  requiredApp?: EcosystemApp;
  description?: string;
}

// ============================================================================
// APP METADATA
// ============================================================================

/**
 * Metadata for each ecosystem app
 */
export interface AppMetadata {
  id: EcosystemApp;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'maintenance';
  organizationCount?: number;
  userCount?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has permission to access a section
 */
export function canAccessSection(
  userRole: AdminRole,
  sectionRequiredRoles?: AdminRole[],
  userManagedApp?: EcosystemApp,
  sectionRequiredApp?: EcosystemApp
): boolean {
  // Ecosystem admin can access everything
  if (userRole === 'ecosystem_admin') {
    return true;
  }

  // Check if role is in required roles
  if (sectionRequiredRoles && !sectionRequiredRoles.includes(userRole)) {
    return false;
  }

  // Check if app matches (for platform admins)
  if (userRole === 'platform_admin' && sectionRequiredApp) {
    return userManagedApp === sectionRequiredApp;
  }

  return true;
}

/**
 * Get navigation permissions for a user
 */
export function getNavigationPermissions(user: AdminUser): NavigationPermissions {
  const role = user.role;
  const managedApp = user.managedApp;

  return {
    canViewEcosystemAdmin: role === 'ecosystem_admin',

    canViewPlatformAdmin:
      role === 'ecosystem_admin' ||
      role === 'platform_admin',

    canViewOrganizationAdmin:
      role === 'ecosystem_admin' ||
      role === 'platform_admin' ||
      role === 'organization_admin',

    canViewCompliance:
      role === 'ecosystem_admin' ||
      role === 'compliance_admin',

    canViewSecurity:
      role === 'ecosystem_admin' ||
      role === 'security_admin',

    canViewSupport:
      role === 'ecosystem_admin' ||
      role === 'support_admin' ||
      (role === 'platform_admin' && managedApp === 'support-center'),

    canViewBilling:
      role === 'ecosystem_admin' ||
      role === 'billing_admin',

    canViewLegacyFeatures:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'platform-app'),

    // App-specific
    canManageMissionsApp:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'missions-app'),

    canManageMaunaApp:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'mauna-app'),

    canManageMyCowApp:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'mycow-app'),

    canManageSupportCenter:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'support-center'),

    canManagePlatformApp:
      role === 'ecosystem_admin' ||
      (role === 'platform_admin' && managedApp === 'platform-app'),
  };
}

/**
 * Get context label for display
 */
export function getContextLabel(user: AdminUser): string {
  switch (user.role) {
    case 'ecosystem_admin':
      return 'Ecosystem Administration | All Apps';

    case 'platform_admin':
      if (user.managedApp === 'missions-app') return 'Missions App Administration';
      if (user.managedApp === 'mauna-app') return 'Mauna App Administration';
      if (user.managedApp === 'mycow-app') return 'MyCow App Administration';
      if (user.managedApp === 'support-center') return 'Support Center Administration';
      if (user.managedApp === 'platform-app') return 'Platform App Administration';
      return 'Platform Administration';

    case 'organization_admin':
      return `${user.organizationName || 'Organization'} Administration`;

    case 'compliance_admin':
      return 'Compliance Administration';

    case 'security_admin':
      return 'Security Administration';

    case 'support_admin':
      return 'Support Administration';

    case 'billing_admin':
      return 'Billing Administration';

    default:
      return 'Admin Portal';
  }
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: AdminRole): string {
  switch (role) {
    case 'ecosystem_admin':
      return 'bg-gradient-to-r from-gold-deep to-gold-soft text-white';
    case 'platform_admin':
      return 'bg-cerulean-deep text-white';
    case 'organization_admin':
      return 'bg-earth-stone text-white';
    case 'compliance_admin':
      return 'bg-success text-white';
    case 'security_admin':
      return 'bg-error text-white';
    case 'support_admin':
      return 'bg-cerulean-light text-white';
    case 'billing_admin':
      return 'bg-botanical-bamboo text-white';
    default:
      return 'bg-ink-silver text-white';
  }
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: AdminRole): string {
  switch (role) {
    case 'ecosystem_admin':
      return 'Ecosystem Admin';
    case 'platform_admin':
      return 'Platform Admin';
    case 'organization_admin':
      return 'Organization Admin';
    case 'compliance_admin':
      return 'Compliance Admin';
    case 'security_admin':
      return 'Security Admin';
    case 'support_admin':
      return 'Support Admin';
    case 'billing_admin':
      return 'Billing Admin';
    default:
      return 'Admin';
  }
}
