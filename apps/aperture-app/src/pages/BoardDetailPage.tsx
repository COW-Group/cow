import React from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedBoardView } from '../components/boards/EnhancedBoardView';
import { BoardManagementView } from '../types/board.types';

// Mock board data based on slug
const mockBoards: Record<string, BoardManagementView> = {
  'leads-crm': {
    id: '1',
    name: 'Leads CRM',
    privacy: 'main',
    managementType: 'leads',
    statusLabels: [
      { id: '1', label: 'New Lead', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'Contacted', color: '#00CED1', textColor: '#FFFFFF' },
      { id: '3', label: 'Qualified', color: '#008000', textColor: '#FFFFFF' },
      { id: '4', label: 'Lost', color: '#FF0000', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-1',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'deals': {
    id: '2',
    name: 'Deals',
    privacy: 'main',
    managementType: 'projects',
    statusLabels: [
      { id: '1', label: 'Proposal', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'Negotiation', color: '#00CED1', textColor: '#FFFFFF' },
      { id: '3', label: 'Closed Won', color: '#008000', textColor: '#FFFFFF' },
      { id: '4', label: 'Closed Lost', color: '#FF0000', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-2',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'contacts': {
    id: '3',
    name: 'Contacts',
    privacy: 'main',
    managementType: 'employees',
    statusLabels: [
      { id: '1', label: 'Active', color: '#008000', textColor: '#FFFFFF' },
      { id: '2', label: 'Inactive', color: '#808080', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-3',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'accounts': {
    id: '4',
    name: 'Accounts',
    privacy: 'main',
    managementType: 'clients',
    statusLabels: [
      { id: '1', label: 'Prospect', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'Active', color: '#008000', textColor: '#FFFFFF' },
      { id: '3', label: 'Inactive', color: '#808080', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-4',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'account-projects': {
    id: '5',
    name: 'Account Projects',
    privacy: 'main',
    managementType: 'projects',
    statusLabels: [
      { id: '1', label: 'Planning', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'In Progress', color: '#00CED1', textColor: '#FFFFFF' },
      { id: '3', label: 'Completed', color: '#008000', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-5',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'activities': {
    id: '6',
    name: 'Activities',
    privacy: 'main',
    managementType: 'tasks',
    statusLabels: [
      { id: '1', label: 'Planned', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'In Progress', color: '#00CED1', textColor: '#FFFFFF' },
      { id: '3', label: 'Completed', color: '#008000', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-6',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'email-template': {
    id: '7',
    name: 'Email Template',
    privacy: 'main',
    managementType: 'creatives',
    statusLabels: [
      { id: '1', label: 'Draft', color: '#FFA500', textColor: '#FFFFFF' },
      { id: '2', label: 'Review', color: '#00CED1', textColor: '#FFFFFF' },
      { id: '3', label: 'Approved', color: '#008000', textColor: '#FFFFFF' }
    ],
    projectId: 'proj-7',
    type: 'kanban',
    config: {},
    isDefault: false,
    sections: [],
    position: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export function BoardDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug || !mockBoards[slug]) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Board Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The board "{slug}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  const board = mockBoards[slug];

  const handleUpdateItem = (itemId: string, columnId: string, value: any) => {
    console.log('Update item:', { itemId, columnId, value });
    // TODO: Implement actual update logic
  };

  const handleAddItem = (groupId: string, name: string) => {
    console.log('Add item:', { groupId, name });
    // TODO: Implement actual add logic
  };

  const handleAddGroup = (title: string) => {
    console.log('Add group:', { title });
    // TODO: Implement actual add group logic
  };

  const handleAddColumn = (name: string, type: string) => {
    console.log('Add column:', { name, type });
    // TODO: Implement actual add column logic
  };

  return (
    <div className="h-full">
      <EnhancedBoardView
        board={null} // Will use mock data
        onUpdateItem={handleUpdateItem}
        onAddItem={handleAddItem}
        onAddGroup={handleAddGroup}
        onDeleteItem={(itemId) => console.log('Delete item:', itemId)}
      />
    </div>
  );
}