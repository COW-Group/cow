import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  LifebuoyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Trading', href: '/trading', icon: CurrencyDollarIcon },
  { name: 'Portfolio', href: '/portfolio', icon: ChartBarIcon },
  { name: 'Missions', href: '/missions', icon: RocketLaunchIcon },
  { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  { name: 'Investors', href: '/investors', icon: UsersIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const openExternalApp = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-full max-w-xs bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* Top Navigation */}
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search companies, missions, or investments..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side items */}
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BellIcon className="h-6 w-6" />
              </button>

              <button
                type="button"
                className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserCircleIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex flex-col h-0 flex-1 bg-gray-900">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
            <span className="ml-3 text-white text-lg font-semibold">
              COW Platform
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* COW Platform Apps */}
          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              COW Apps
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => openExternalApp('http://localhost:4201')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
              >
                <RocketLaunchIcon className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
                Missions Engine
                <ArrowTopRightOnSquareIcon className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => openExternalApp('http://localhost:4202')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
              >
                <ShieldCheckIcon className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
                Admin Portal
                <ArrowTopRightOnSquareIcon className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => openExternalApp('http://localhost:4200')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
              >
                <LifebuoyIcon className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
                Support Center
                <ArrowTopRightOnSquareIcon className="ml-auto h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PlatformLayout;