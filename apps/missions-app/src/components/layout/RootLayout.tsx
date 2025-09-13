import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { WorkspaceSidebar } from '../workspace/WorkspaceSidebar';

export function RootLayout() {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('workspace-main');

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content Area */}
      <div className="pt-12"> {/* Account for app header only */}
        {/* Enhanced Workspace Sidebar - Always Show */}
        <div className="fixed left-0 top-12 bottom-0 z-10">
          <WorkspaceSidebar 
            currentWorkspaceId={currentWorkspaceId}
            onWorkspaceChange={setCurrentWorkspaceId}
          />
        </div>
        
        {/* Main Content */}
        <div className="ml-64">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}