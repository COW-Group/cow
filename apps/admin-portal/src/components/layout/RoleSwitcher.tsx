import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAdminRole } from '../../contexts/AdminRoleContext';
import { AdminRole, EcosystemApp, getRoleDisplayName, getRoleBadgeColor } from '../../types/admin.types';

/**
 * Role Switcher Component
 * Allows switching between different admin roles for testing/demo
 * In production, this would be determined by authentication
 */

interface RoleOption {
  role: AdminRole;
  app?: EcosystemApp;
  label: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    role: 'ecosystem_admin',
    label: 'Ecosystem Admin',
    description: 'Full access to all apps',
  },
  {
    role: 'platform_admin',
    app: 'aperture-app',
    label: 'Platform Admin (Missions App)',
    description: 'Manage aperture-app only',
  },
  {
    role: 'platform_admin',
    app: 'mauna-app',
    label: 'Platform Admin (Mauna App)',
    description: 'Manage mauna-app only',
  },
  {
    role: 'platform_admin',
    app: 'mycow-app',
    label: 'Platform Admin (MyCow App)',
    description: 'Manage mycow-app only',
  },
  {
    role: 'platform_admin',
    app: 'support-center',
    label: 'Platform Admin (Support)',
    description: 'Manage support center only',
  },
  {
    role: 'organization_admin',
    label: 'Organization Admin',
    description: 'Manage single organization',
  },
  {
    role: 'compliance_admin',
    label: 'Compliance Admin',
    description: 'Compliance oversight',
  },
  {
    role: 'security_admin',
    label: 'Security Admin',
    description: 'Security management',
  },
];

const RoleSwitcher: React.FC = () => {
  const { currentUser, adminContext, switchRole } = useAdminRole();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser || !adminContext) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cerulean-ice/30 hover:bg-cerulean-ice transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-left">
          <div className="text-xs font-light text-ink-charcoal">Viewing as</div>
          <div className="text-sm font-light text-cerulean-deep">{adminContext.scopeLabel}</div>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-ink-silver" />
      </Menu.Button>

      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          onClose={() => setIsOpen(false)}
        >
          <div className="py-1">
            <div className="px-4 py-2 border-b border-earth-stone/20">
              <p className="text-xs font-light text-ink-charcoal uppercase tracking-wide">
                Switch Admin Role
              </p>
              <p className="text-xs text-ink-silver mt-0.5">
                (For demo/testing purposes)
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {roleOptions.map((option, index) => {
                const isActive =
                  currentUser.role === option.role &&
                  (!option.app || currentUser.managedApp === option.app);

                return (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          switchRole(option.role, option.app);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 ${
                          active ? 'bg-cerulean-ice/50' : ''
                        } ${isActive ? 'bg-cerulean-ice' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${getRoleBadgeColor(
                              option.role
                            )}`}
                          >
                            {getRoleDisplayName(option.role)}
                          </span>
                          {isActive && (
                            <span className="text-xs text-cerulean-deep">✓ Active</span>
                          )}
                        </div>
                        <p className="text-sm font-light text-ink-black mt-1">
                          {option.label}
                        </p>
                        <p className="text-xs text-ink-silver mt-0.5">{option.description}</p>
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default RoleSwitcher;
