import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  CubeIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  { name: 'Investors', href: '/investors', icon: UsersIcon },
  { name: 'Trading', href: '/trading', icon: ChartBarIcon },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon },
  { name: 'Staff', href: '/staff', icon: UserGroupIcon },
  { name: 'System', href: '/system', icon: CogIcon },
  { name: 'Blockchain', href: '/blockchain', icon: CubeIcon },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

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
            <div className="fixed inset-0 bg-gray-900/80" />
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

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white to-paper-rice px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center border-b border-earth-stone/20 pb-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-cerulean-deep shadow-sm">
                      <span className="text-2xl">🐄</span>
                    </div>
                    <div className="ml-3 flex flex-col">
                      <span className="text-lg font-light text-ink-black">COW</span>
                      <span className="text-xs font-light text-cerulean-deep">Admin Portal</span>
                    </div>
                  </div>

                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-light leading-6 transition-all ${
                                  isActive(item.href)
                                    ? 'bg-cerulean-ice text-cerulean-deep shadow-sm'
                                    : 'text-ink-charcoal hover:text-cerulean-deep hover:bg-cerulean-ice/50'
                                }`}
                                onClick={() => setOpen(false)}
                              >
                                <item.icon
                                  className={`h-5 w-5 shrink-0 ${
                                    isActive(item.href) ? 'text-cerulean-deep' : 'text-ink-silver group-hover:text-cerulean-deep'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>

                  {/* Earth tone grounding footer - Horizon Principle */}
                  <div className="mt-auto pt-4 pb-4 border-t-4 border-earth-stone bg-gradient-to-r from-earth-clay/30 to-earth-stone/30 -mx-6 px-6 rounded-t-lg">
                    <p className="text-xs font-light text-ink-charcoal">Platform Administration</p>
                    <p className="text-xs font-light text-earth-stone">v0.0.1</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r-2 border-earth-stone/20 bg-gradient-to-b from-white to-paper-rice px-6">
          <div className="flex h-16 shrink-0 items-center border-b border-earth-stone/20 pb-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-cerulean-deep shadow-sm">
              <span className="text-2xl">🐄</span>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-light text-ink-black">COW</span>
              <span className="text-xs font-light text-cerulean-deep">Admin Portal</span>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-light leading-6 transition-all ${
                          isActive(item.href)
                            ? 'bg-cerulean-ice text-cerulean-deep shadow-sm'
                            : 'text-ink-charcoal hover:text-cerulean-deep hover:bg-cerulean-ice/50'
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive(item.href) ? 'text-cerulean-deep' : 'text-ink-silver group-hover:text-cerulean-deep'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Earth tone grounding footer - Horizon Principle */}
          <div className="mt-auto pt-4 pb-4 border-t-4 border-earth-stone bg-gradient-to-r from-earth-clay/30 to-earth-stone/30 -mx-6 px-6 rounded-t-lg">
            <p className="text-xs font-light text-ink-charcoal">Platform Administration</p>
            <p className="text-xs font-light text-earth-stone">v0.0.1</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;