import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AdminUser,
  AdminContext,
  AdminRole,
  EcosystemApp,
  getContextLabel,
  getNavigationPermissions,
  NavigationPermissions,
} from '../types/admin.types';

interface AdminRoleContextType {
  currentUser: AdminUser | null;
  adminContext: AdminContext | null;
  permissions: NavigationPermissions | null;
  switchApp: (app: EcosystemApp) => void;
  switchRole: (role: AdminRole, app?: EcosystemApp) => void; // For demo/testing
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

interface AdminRoleProviderProps {
  children: ReactNode;
}

export const AdminRoleProvider: React.FC<AdminRoleProviderProps> = ({ children }) => {
  // Mock user - in production, this would come from auth context
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: '1',
    email: 'admin@cow.io',
    name: 'Admin User',
    role: 'ecosystem_admin', // Default to ecosystem admin for demo
    createdAt: new Date(),
    lastLoginAt: new Date(),
  });

  const [adminContext, setAdminContext] = useState<AdminContext>({
    role: currentUser.role,
    scopeLabel: getContextLabel(currentUser),
  });

  const [permissions, setPermissions] = useState<NavigationPermissions>(
    getNavigationPermissions(currentUser)
  );

  /**
   * Switch app (for Ecosystem Admins navigating between apps)
   */
  const switchApp = (app: EcosystemApp) => {
    if (currentUser.role !== 'ecosystem_admin') {
      console.warn('Only ecosystem admins can switch apps');
      return;
    }

    setAdminContext({
      role: currentUser.role,
      currentApp: app,
      scopeLabel: `Ecosystem Administration | ${app}`,
    });
  };

  /**
   * Switch role (for demo/testing purposes)
   * In production, this would be determined by authentication
   */
  const switchRole = (role: AdminRole, app?: EcosystemApp) => {
    const newUser: AdminUser = {
      ...currentUser,
      role,
      managedApp: app,
    };

    setCurrentUser(newUser);
    setAdminContext({
      role,
      currentApp: app,
      scopeLabel: getContextLabel(newUser),
    });
    setPermissions(getNavigationPermissions(newUser));
  };

  return (
    <AdminRoleContext.Provider
      value={{
        currentUser,
        adminContext,
        permissions,
        switchApp,
        switchRole,
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  );
};

/**
 * Hook to use admin role context
 */
export const useAdminRole = () => {
  const context = useContext(AdminRoleContext);
  if (context === undefined) {
    throw new Error('useAdminRole must be used within an AdminRoleProvider');
  }
  return context;
};
