import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import RoleSwitcher from './RoleSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b-2 border-earth-stone/20 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-ink-charcoal hover:text-cerulean-deep lg:hidden transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-earth-stone/30 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-x-3">
          <div className="hidden lg:block h-8 w-1 bg-gradient-to-b from-cerulean-deep to-earth-stone rounded-full" />
          <div>
            <h1 className="text-sm font-light text-ink-charcoal">COW Platform</h1>
            <p className="text-lg font-light text-cerulean-deep">Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Role Switcher */}
          <RoleSwitcher />
          <button
            type="button"
            className="-m-2.5 p-2.5 text-ink-silver hover:text-cerulean-deep transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-earth-stone/30" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <div className="flex items-center gap-x-4">
              <div className="hidden lg:flex lg:flex-col lg:text-right lg:leading-5">
                <span className="text-sm font-light text-ink-black">{user?.name}</span>
                <span className="text-xs font-light text-cerulean-deep">{user?.role}</span>
              </div>
              <button
                type="button"
                className="flex items-center gap-x-2 bg-cerulean-ice/30 p-1.5 text-sm font-light text-ink-charcoal hover:bg-cerulean-ice hover:text-cerulean-deep focus:outline-none focus:ring-2 focus:ring-cerulean-deep rounded-lg transition-all"
                onClick={logout}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cerulean-deep to-cerulean-light flex items-center justify-center shadow-sm">
                  <span className="text-sm font-light text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;