import React, { useState } from 'react';
import { EnhancedMondayBoard } from '../components/board/EnhancedMondayBoard';
import { CreateBoardModal } from '../components/modals/CreateBoardModal';

export function EnhancedBoardDemo() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardData, setBoardData] = useState(null);

  const handleCreateBoard = async (data: any) => {
    console.log('Creating board with data:', data);
    setBoardData(data);
    setShowCreateModal(false);
  };

  const handleBoardUpdate = (updatedData: any) => {
    console.log('Board updated:', updatedData);
    setBoardData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Enhanced Monday.com Board Demo</h1>
            <p className="text-gray-600 mt-1">
              Full drag & drop functionality integrated with your existing infrastructure
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Board
          </button>
        </div>
      </div>

      {/* Enhanced Board */}
      <div className="flex-1">
        <EnhancedMondayBoard
          boardData={boardData}
          onUpdate={handleBoardUpdate}
        />
      </div>

      {/* Your existing Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}