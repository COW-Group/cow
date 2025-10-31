import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  CubeIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  ServerIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { NavSection } from '../types/admin.types';

/**
 * Complete navigation structure for COW Admin Portal
 * Organized by admin role hierarchy
 */

export const navigationSections: NavSection[] = [
  // ============================================================================
  // ECOSYSTEM ADMINISTRATION (God Mode - Only Ecosystem Admins)
  // ============================================================================
  {
    id: 'ecosystem-admin',
    label: 'Ecosystem Administration',
    badge: 'God Mode',
    requiredRole: ['ecosystem_admin'],
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'ecosystem-dashboard',
        name: 'Ecosystem Dashboard',
        href: '/',
        icon: HomeIcon,
        description: 'System health, all apps metrics',
      },
      {
        id: 'apps-management',
        name: 'Apps Management',
        href: '/apps',
        icon: Squares2X2Icon,
        description: 'Enable/disable/configure all apps',
      },
      {
        id: 'all-organizations',
        name: 'All Organizations',
        href: '/organizations',
        icon: BuildingOfficeIcon,
        description: 'Every organization using any COW app',
      },
      {
        id: 'global-users',
        name: 'Global Users',
        href: '/users',
        icon: UsersIcon,
        description: 'All users across all apps',
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure',
        href: '/infrastructure',
        icon: ServerIcon,
        description: 'Servers, databases, services',
      },
      {
        id: 'global-billing',
        name: 'Global Billing',
        href: '/ecosystem/billing',
        icon: CreditCardIcon,
        description: 'All subscriptions across all apps',
      },
      {
        id: 'ecosystem-settings',
        name: 'Ecosystem Settings',
        href: '/ecosystem/settings',
        icon: CogIcon,
        description: 'System-wide configuration',
      },
    ],
  },

  // ============================================================================
  // PLATFORM ADMINISTRATION (App-Specific - Platform Admins & Ecosystem Admins)
  // ============================================================================
  {
    id: 'aperture-app-admin',
    label: 'Missions App Administration',
    requiredRole: ['ecosystem_admin', 'platform_admin'],
    requiredApp: 'aperture-app',
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'missions-dashboard',
        name: 'Missions App Dashboard',
        href: '/platform/aperture-app',
        icon: HomeIcon,
        description: 'App usage, key metrics',
      },
      {
        id: 'missions-accounts',
        name: 'Accounts Management',
        href: '/platform/aperture-app/accounts',
        icon: BuildingOfficeIcon,
        description: 'All organizations using aperture-app',
      },
      {
        id: 'missions-users',
        name: 'App Users',
        href: '/platform/aperture-app/users',
        icon: UsersIcon,
        description: 'Users within aperture-app',
      },
      {
        id: 'missions-templates',
        name: 'Templates & Workflows',
        href: '/platform/aperture-app/templates',
        icon: DocumentTextIcon,
        description: 'Board templates, automations',
      },
      {
        id: 'missions-integrations',
        name: 'Integrations',
        href: '/platform/aperture-app/integrations',
        icon: CubeIcon,
        description: '3rd party integrations',
      },
      {
        id: 'missions-analytics',
        name: 'Analytics',
        href: '/platform/aperture-app/analytics',
        icon: ChartBarIcon,
        description: 'App performance, user behavior',
      },
      {
        id: 'missions-billing',
        name: 'App Billing',
        href: '/platform/aperture-app/billing',
        icon: CreditCardIcon,
        description: 'Subscriptions for aperture-app',
      },
      {
        id: 'missions-settings',
        name: 'App Settings',
        href: '/platform/aperture-app/settings',
        icon: CogIcon,
        description: 'Missions-app configuration',
      },
    ],
  },

  {
    id: 'mauna-app-admin',
    label: 'Mauna App Administration',
    requiredRole: ['ecosystem_admin', 'platform_admin'],
    requiredApp: 'mauna-app',
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'mauna-dashboard',
        name: 'Mauna App Dashboard',
        href: '/platform/mauna-app',
        icon: HomeIcon,
        description: 'App usage, key metrics',
      },
      {
        id: 'mauna-accounts',
        name: 'Accounts Management',
        href: '/platform/mauna-app/accounts',
        icon: BuildingOfficeIcon,
        description: 'All organizations using mauna-app',
      },
      {
        id: 'mauna-users',
        name: 'App Users',
        href: '/platform/mauna-app/users',
        icon: UsersIcon,
        description: 'Users within mauna-app',
      },
      {
        id: 'mauna-integrations',
        name: 'Integrations',
        href: '/platform/mauna-app/integrations',
        icon: CubeIcon,
        description: 'Mauna-app integrations',
      },
      {
        id: 'mauna-analytics',
        name: 'Analytics',
        href: '/platform/mauna-app/analytics',
        icon: ChartBarIcon,
        description: 'Mauna-app analytics',
      },
      {
        id: 'mauna-settings',
        name: 'App Settings',
        href: '/platform/mauna-app/settings',
        icon: CogIcon,
        description: 'Mauna-app configuration',
      },
    ],
  },

  {
    id: 'mycow-app-admin',
    label: 'MyCow App Administration',
    requiredRole: ['ecosystem_admin', 'platform_admin'],
    requiredApp: 'mycow-app',
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'mycow-dashboard',
        name: 'MyCow App Dashboard',
        href: '/platform/mycow-app',
        icon: HomeIcon,
        description: 'App usage, key metrics',
      },
      {
        id: 'mycow-accounts',
        name: 'Accounts Management',
        href: '/platform/mycow-app/accounts',
        icon: BuildingOfficeIcon,
        description: 'All organizations using mycow-app',
      },
      {
        id: 'mycow-users',
        name: 'App Users',
        href: '/platform/mycow-app/users',
        icon: UsersIcon,
        description: 'Users within mycow-app',
      },
      {
        id: 'mycow-integrations',
        name: 'Integrations',
        href: '/platform/mycow-app/integrations',
        icon: CubeIcon,
        description: 'MyCow-app integrations',
      },
      {
        id: 'mycow-analytics',
        name: 'Analytics',
        href: '/platform/mycow-app/analytics',
        icon: ChartBarIcon,
        description: 'MyCow-app analytics',
      },
      {
        id: 'mycow-settings',
        name: 'App Settings',
        href: '/platform/mycow-app/settings',
        icon: CogIcon,
        description: 'MyCow-app configuration',
      },
    ],
  },

  {
    id: 'support-center-admin',
    label: 'Support Center Administration',
    requiredRole: ['ecosystem_admin', 'platform_admin', 'support_admin'],
    requiredApp: 'support-center',
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'support-dashboard',
        name: 'Support Dashboard',
        href: '/platform/support-center',
        icon: HomeIcon,
        description: 'Support metrics',
      },
      {
        id: 'support-tickets',
        name: 'Tickets & Cases',
        href: '/platform/support-center/tickets',
        icon: ClipboardDocumentListIcon,
        description: 'Manage support tickets',
      },
      {
        id: 'support-kb',
        name: 'Knowledge Base',
        href: '/platform/support-center/knowledge-base',
        icon: DocumentTextIcon,
        description: 'KB management',
      },
      {
        id: 'support-agents',
        name: 'Support Agents',
        href: '/platform/support-center/agents',
        icon: UserGroupIcon,
        description: 'Manage support team',
      },
    ],
  },

  // ============================================================================
  // ORGANIZATION MANAGEMENT (Org Admins see this)
  // ============================================================================
  {
    id: 'organization-admin',
    label: 'Organization Management',
    requiredRole: ['organization_admin'],
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        id: 'org-dashboard',
        name: 'Organization Dashboard',
        href: '/organization',
        icon: HomeIcon,
        description: 'Organization metrics',
      },
      {
        id: 'org-workspaces',
        name: 'Workspaces',
        href: '/organization/workspaces',
        icon: Squares2X2Icon,
        description: 'Manage workspaces',
      },
      {
        id: 'org-users-teams',
        name: 'Users & Teams',
        href: '/organization/users-teams',
        icon: UserGroupIcon,
        description: 'Organization members',
      },
      {
        id: 'org-permissions',
        name: 'Permissions & Roles',
        href: '/organization/permissions',
        icon: ShieldCheckIcon,
        description: 'Access control',
      },
      {
        id: 'org-billing',
        name: 'Billing',
        href: '/organization/billing',
        icon: CreditCardIcon,
        description: 'Organization subscription',
      },
      {
        id: 'org-settings',
        name: 'Settings',
        href: '/organization/settings',
        icon: CogIcon,
        description: 'Organization preferences',
      },
    ],
  },

  // ============================================================================
  // SPECIALIZED ADMIN AREAS
  // ============================================================================
  {
    id: 'compliance-admin',
    label: 'Compliance',
    requiredRole: ['ecosystem_admin', 'compliance_admin'],
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        id: 'compliance-dashboard',
        name: 'Compliance Dashboard',
        href: '/compliance',
        icon: ShieldCheckIcon,
        description: 'Compliance overview',
      },
      {
        id: 'kyc-aml',
        name: 'KYC/AML Reviews',
        href: '/compliance/kyc-aml',
        icon: UserGroupIcon,
        description: 'Identity verification',
      },
      {
        id: 'regulatory-reports',
        name: 'Regulatory Reports',
        href: '/compliance/reports',
        icon: DocumentTextIcon,
        description: 'Compliance reporting',
      },
      {
        id: 'audit-trails',
        name: 'Audit Trails',
        href: '/compliance/audit',
        icon: ClipboardDocumentListIcon,
        description: 'Activity logs',
      },
    ],
  },

  {
    id: 'security-admin',
    label: 'Security',
    requiredRole: ['ecosystem_admin', 'security_admin'],
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        id: 'security-dashboard',
        name: 'Security Dashboard',
        href: '/security',
        icon: ShieldCheckIcon,
        description: 'Security overview',
      },
      {
        id: 'access-control',
        name: 'Access Control',
        href: '/security/access-control',
        icon: UserGroupIcon,
        description: 'Manage permissions',
      },
      {
        id: 'security-incidents',
        name: 'Security Incidents',
        href: '/security/incidents',
        icon: BellIcon,
        description: 'Incident management',
      },
      {
        id: 'session-management',
        name: 'Session Management',
        href: '/security/sessions',
        icon: CogIcon,
        description: 'Active sessions',
      },
    ],
  },

  {
    id: 'billing-admin',
    label: 'Billing & Finance',
    requiredRole: ['ecosystem_admin', 'billing_admin'],
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        id: 'billing-dashboard',
        name: 'Billing Dashboard',
        href: '/billing',
        icon: CreditCardIcon,
        description: 'Financial overview',
      },
      {
        id: 'invoices',
        name: 'Invoices',
        href: '/billing/invoices',
        icon: DocumentTextIcon,
        description: 'Manage invoices',
      },
      {
        id: 'subscriptions',
        name: 'Subscriptions',
        href: '/billing/subscriptions',
        icon: ChartBarIcon,
        description: 'Active subscriptions',
      },
      {
        id: 'financial-reports',
        name: 'Financial Reports',
        href: '/billing/reports',
        icon: ClipboardDocumentListIcon,
        description: 'Revenue analytics',
      },
    ],
  },

  // ============================================================================
  // LEGACY FEATURES (Platform App - Tokenization)
  // ============================================================================
  {
    id: 'legacy-features',
    label: 'Legacy Features',
    badge: 'Platform App',
    requiredRole: ['ecosystem_admin', 'platform_admin'],
    requiredApp: 'platform-app',
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        id: 'companies',
        name: 'Companies',
        href: '/companies',
        icon: BuildingOfficeIcon,
        description: 'Tokenization companies',
      },
      {
        id: 'investors',
        name: 'Investors',
        href: '/investors',
        icon: UsersIcon,
        description: 'Investor management',
      },
      {
        id: 'trading',
        name: 'Trading',
        href: '/trading',
        icon: ChartBarIcon,
        description: 'Token trading',
      },
      {
        id: 'blockchain',
        name: 'Blockchain',
        href: '/blockchain',
        icon: CubeIcon,
        description: 'Blockchain operations',
      },
    ],
  },
];

/**
 * Get app display name
 */
export function getAppDisplayName(app: string): string {
  switch (app) {
    case 'aperture-app':
      return 'Missions App';
    case 'mauna-app':
      return 'Mauna App';
    case 'support-center':
      return 'Support Center';
    case 'platform-app':
      return 'Platform App';
    case 'products-site':
      return 'Products Site';
    case 'public-site':
      return 'Public Site';
    default:
      return app;
  }
}
