import React from 'react';
import { useMissionStore } from '../../store/mission.store';

interface DeleteBlockProps {
  documentId: string;
}

export function DeleteBlock({ documentId }: DeleteBlockProps) {
  const { removeMission } = useMissionStore();

  const handleDelete = async () => {
    try {
      console.log('Deleting mission:', documentId);
      await removeMission(documentId);
      console.log('Mission deleted successfully');
      
      // Optional: Show success message
      // In a real app, you might want to use a toast notification
    } catch (error) {
      console.error('Failed to delete mission:', error);
      alert(`Failed to delete mission: ${error}`);
    }
  };

  return (
    <div className="delete-block flex justify-center items-center bg-gray-800 p-2 rounded-lg">
      <div
        className="delete-icon w-6 h-6 bg-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-red-600 transition-colors duration-200"
        onClick={handleDelete}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDelete();
          }
        }}
        aria-label="Delete mission"
      >
        <span className="text-white text-sm">✖</span>
      </div>
    </div>
  );
}