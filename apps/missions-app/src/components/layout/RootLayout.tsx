import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { WorkspaceSidebar } from '../workspace/WorkspaceSidebar';
import { useAppStore } from '../../store';
import { Modal } from '../ui/Modal';
import { CreateItemModal } from '../workspace/CreateItemModal';
import { MaunAppMarketplace } from '../apps/MaunAppMarketplace';
import { MaunAppLauncher } from '../apps/MaunAppLauncher';
import { useMaunAppsStore } from '../../store/maun-apps.store';

export function RootLayout() {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('workspace-main');
  const { activeModal, modalData, closeModal } = useAppStore();
  const { activeApp } = useMaunAppsStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-black/2"></div>
      </div>

      {/* App Header */}
      <AppHeader />

      {/* Main Content Area */}
      <div className="relative z-10 pt-16"> {/* Account for app header only */}
        {/* Enhanced Workspace Sidebar - Always Show */}
        <div className="fixed left-0 top-16 bottom-0 z-10">
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

      {/* Modal System */}
      {activeModal && activeModal === 'create-task' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalData?.title || 'Create New Item'}
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose item type:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  console.log('Creating task...');
                  closeModal();
                }}
                className="p-4 border border-gray-200/50 rounded-xl hover:bg-gray-100/80 hover:shadow-md text-left transition-all duration-200"
              >
                <div className="font-medium text-gray-900">Task</div>
                <div className="text-sm text-gray-500">Create a new task item</div>
              </button>
              <button
                onClick={() => {
                  console.log('Creating board...');
                  closeModal();
                }}
                className="p-4 border border-gray-200/50 rounded-xl hover:bg-gray-100/80 hover:shadow-md text-left transition-all duration-200"
              >
                <div className="font-medium text-gray-900">Board</div>
                <div className="text-sm text-gray-500">Create a new board</div>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal && activeModal === 'app-marketplace' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Maun App Marketplace"
          size="xl"
        >
          <MaunAppMarketplace
            onClose={closeModal}
            boardId={modalData?.boardId}
            workspaceId={modalData?.workspaceId}
          />
        </Modal>
      )}

      {activeModal && activeModal === 'app-settings' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="App Settings"
        >
          <div className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">App Settings</h3>
              <p className="text-gray-600 mb-6">
                Configure your installed apps and permissions.
              </p>
              <p className="text-sm text-gray-500">
                App settings functionality coming soon...
              </p>
            </div>
          </div>
        </Modal>
      )}

      {activeModal && activeModal === 'create-team' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalData?.title || 'Create New Team'}
        >
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  id="team-name"
                  name="teamName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div>
                <label htmlFor="team-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="team-description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the team's purpose and goals"
                />
              </div>

              <div>
                <label htmlFor="team-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Color
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <button type="button" className="w-8 h-8 rounded bg-blue-500 border-2 border-blue-600"></button>
                    <button type="button" className="w-8 h-8 rounded bg-green-500 border-2 border-transparent"></button>
                    <button type="button" className="w-8 h-8 rounded bg-purple-500 border-2 border-transparent"></button>
                    <button type="button" className="w-8 h-8 rounded bg-red-500 border-2 border-transparent"></button>
                    <button type="button" className="w-8 h-8 rounded bg-orange-500 border-2 border-transparent"></button>
                    <button type="button" className="w-8 h-8 rounded bg-pink-500 border-2 border-transparent"></button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <div className="border border-gray-300 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Added members will appear here
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Creating team...');
                    closeModal();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}


      {/* Maun App Launcher Modal */}
      {activeApp && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title=""
          size="xl"
          showHeader={false}
        >
          <MaunAppLauncher />
        </Modal>
      )}
    </div>
  );
}