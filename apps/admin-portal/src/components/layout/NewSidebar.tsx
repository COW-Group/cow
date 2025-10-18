import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAdminRole } from '../../contexts/AdminRoleContext';
import { navigationSections } from '../../config/navigation';
import { canAccessSection, getRoleBadgeColor, getRoleDisplayName } from '../../types/admin.types';
import { NavSection, NavItem } from '../../types/admin.types';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { currentUser, adminContext } = useAdminRole();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Filter sections based on user role and permissions
  const visibleSections = navigationSections.filter(section => {
    if (!currentUser) return false;

    return canAccessSection(
      currentUser.role,
      section.requiredRole,
      currentUser.managedApp,
      section.requiredApp
    );
  });

  const renderSectionHeader = (section: NavSection, isExpanded: boolean) => {
    const roleColor = currentUser ? getRoleBadgeColor(currentUser.role) : '';

    return (
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cerulean-ice/30 rounded-lg transition-colors"
        onClick={() => section.collapsible && toggleSection(section.id)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-light uppercase tracking-wider text-ink-charcoal">
            {section.label}
          </h3>
          {section.badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-light ${roleColor}`}>
              {section.badge}
            </span>
          )}
        </div>
        {section.collapsible && (
          <div className="text-ink-silver">
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);

    return (
      <NavLink
        key={item.id}
        to={item.href}
        className={`group flex items-center gap-x-3 rounded-lg p-3 text-sm font-light leading-6 transition-all ${
          active
            ? 'bg-cerulean-ice text-cerulean-deep shadow-sm'
            : 'text-ink-charcoal hover:text-cerulean-deep hover:bg-cerulean-ice/50'
        }`}
        onClick={() => setOpen(false)}
      >
        <item.icon
          className={`h-5 w-5 shrink-0 ${
            active ? 'text-cerulean-deep' : 'text-ink-silver group-hover:text-cerulean-deep'
          }`}
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span>{item.name}</span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-soft/20 text-gold-deep">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && !active && (
            <p className="text-xs text-ink-silver mt-0.5 group-hover:text-cerulean">{item.description}</p>
          )}
        </div>
      </NavLink>
    );
  };

  const renderSection = (section: NavSection) => {
    const isExpanded = expandedSections[section.id] ?? section.defaultOpen ?? true;

    return (
      <div key={section.id} className="mb-6">
        {renderSectionHeader(section, isExpanded)}
        {isExpanded && (
          <div className="mt-2 space-y-1 pl-2">
            {section.items.map(item => renderNavItem(item))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white to-paper-rice px-6 pb-4">
      {/* Logo & Context */}
      <div className="flex h-16 shrink-0 items-center border-b border-earth-stone/20 pb-4">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-cerulean-deep shadow-sm">
          <span className="text-2xl">🐄</span>
        </div>
        <div className="ml-3 flex flex-col">
          <span className="text-lg font-light text-ink-black">COW</span>
          <span className="text-xs font-light text-cerulean-deep">Admin Portal</span>
        </div>
      </div>

      {/* Admin Role Badge */}
      {currentUser && (
        <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-cerulean-ice/50 to-earth-clay/20 border border-cerulean/20">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(currentUser.role)}`}>
              {getRoleDisplayName(currentUser.role)}
            </span>
          </div>
          {adminContext && (
            <p className="text-xs text-ink-charcoal mt-1 font-light">
              {adminContext.scopeLabel}
            </p>
          )}
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-y-2">
          {visibleSections.map(section => renderSection(section))}
        </div>
      </nav>

      {/* Earth tone grounding footer - Horizon Principle */}
      <div className="mt-auto pt-4 pb-4 border-t-4 border-earth-stone bg-gradient-to-r from-earth-clay/30 to-earth-stone/30 -mx-6 px-6 rounded-t-lg">
        <p className="text-xs font-light text-ink-charcoal">Platform Administration</p>
        <p className="text-xs font-light text-earth-stone">v0.0.1</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r-2 border-earth-stone/20 bg-gradient-to-b from-white to-paper-rice">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
