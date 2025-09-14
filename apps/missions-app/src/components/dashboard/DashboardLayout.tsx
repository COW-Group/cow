import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { MainContent } from './MainContent';
import { Workspace, Board, ViewType, DateViewType } from '../../types/dashboard';

// Mock data - replace with actual API calls
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'COW CRM',
    iconColor: 'teal',
    type: 'team',
    memberCount: 5,
    isOwner: true,
    boards: [
      { id: '1', name: 'Leads CRM', type: 'leads', enabled: true, itemCount: 12 },
      { id: '2', name: 'Deals', type: 'deals', enabled: true, itemCount: 8 },
      { id: '3', name: 'Contacts', type: 'contacts', enabled: false, itemCount: 156 },
      { id: '4', name: 'Accounts', type: 'accounts', enabled: true, itemCount: 24 },
      { id: '5', name: 'Account Projects', type: 'projects', enabled: true, itemCount: 3 },
      { id: '6', name: 'Activities', type: 'activities', enabled: true, itemCount: 7 },
      { id: '7', name: 'Email Template', type: 'email-template', enabled: true }
    ]
  },
  {
    id: '2',
    name: 'Likhitha Palaypu Vibes',
    iconColor: 'purple',
    type: 'personal',
    memberCount: 1,
    isOwner: true,
    boards: [
      { id: '8', name: 'Creative Projects', type: 'projects', enabled: true, itemCount: 5 },
      { id: '9', name: 'Personal Tasks', type: 'activities', enabled: true, itemCount: 12 }
    ]
  }
];

export function DashboardLayout() {
  const [workspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspaces[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWorkspaceChange = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  const handleCreateWorkspace = () => {
    // Open create workspace modal
    console.log('Create workspace modal');
  };

  const handleNewItem = () => {
    // Open new item modal
    console.log('New item modal');
  };

  const handleViewChange = (view: ViewType) => {
    console.log('View changed to:', view);
  };

  const handleDateViewChange = (dateView: DateViewType) => {
    console.log('Date view changed to:', dateView);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
  };

  const handleHelpClick = () => {
    console.log('Help clicked');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={handleWorkspaceChange}
        onCreateWorkspace={handleCreateWorkspace}
        className={`${
          isMobile 
            ? `transform transition-transform z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : ''
        }`}
      />

      {/* Main Content */}
      <MainContent
        onNewItem={handleNewItem}
        onViewChange={handleViewChange}
        onDateViewChange={handleDateViewChange}
      />

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-24 left-4 z-50 p-2 bg-teal-500 text-white rounded-lg shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}