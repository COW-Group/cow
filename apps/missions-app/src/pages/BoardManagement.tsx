import React, { useState } from 'react';
import { CreateBoardModal } from '../components/modals/CreateBoardModal';
import { SimpleBoardView } from '../components/boards/SimpleBoardView';
import { CreateBoardRequest, BoardManagementView } from '../types/board.types';

export function BoardManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<BoardManagementView | null>(null);

  const handleCreateBoard = async (data: CreateBoardRequest) => {
    try {
      // TODO: Replace with actual API call
      console.log('Creating board:', data);
      
      // Mock successful creation
      const newBoard: BoardManagementView = {
        id: Date.now().toString(),
        name: data.name,
        privacy: data.privacy,
        managementType: data.managementType,
        customManagementType: data.customManagementType,
        statusLabels: [
          { id: '1', label: 'Working on it', color: '#FFA500', textColor: '#FFFFFF' },
          { id: '2', label: 'Stuck', color: '#FF0000', textColor: '#FFFFFF' },
          { id: '3', label: 'Done', color: '#008000', textColor: '#FFFFFF' }
        ],
        // Extended from base Board interface
        projectId: 'proj-1',
        type: 'kanban',
        config: {},
        isDefault: false,
        sections: [],
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCurrentBoard(newBoard);
      alert('Board created successfully!');
    } catch (error) {
      console.error('Failed to create board:', error);
      alert('Failed to create board. Please try again.');
    }
  };

  const handleUpdateItem = (itemId: string, columnId: string, value: any) => {
    console.log('Update item:', { itemId, columnId, value });
    // TODO: Implement item update logic
  };

  const handleAddItem = (groupId: string, name: string) => {
    console.log('Add item:', { groupId, name });
    // TODO: Implement add item logic
  };

  const handleAddGroup = (title: string) => {
    console.log('Add group:', { title });
    // TODO: Implement add group logic
  };

  const handleAddColumn = (name: string, type: string) => {
    console.log('Add column:', { name, type });
    // TODO: Implement add column logic
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Demo Controls */}
      <div className="fixed top-4 right-4 z-50 space-x-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        >
          Create Board
        </button>
        {currentBoard && (
          <button
            onClick={() => setCurrentBoard(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close Board
          </button>
        )}
      </div>

      {/* Content */}
      {currentBoard ? (
        <SimpleBoardView
          board={currentBoard}
          onUpdateItem={handleUpdateItem}
          onAddItem={handleAddItem}
          onAddGroup={handleAddGroup}
          onAddColumn={handleAddColumn}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Board Management Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Click "Create Board" to get started with the new board interface.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Create Your First Board
            </button>
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}