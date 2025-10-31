import React, { useState, useEffect } from 'react';
import { FlexiBoardView } from './FlexiBoardView';
import { EnhancedFlexiBoardEngine } from '../../../../../libs/missions-engine-lib/src/index';
import { FlexiBoard, BusinessAppType } from '../../../../../libs/missions-engine-lib/src/types/flexiboard';
import { useBoardStore } from '../../store/board.store';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { SafeRender } from '../common/SafeRender';

interface IntegratedFlexiBoardProps {
  businessApp?: BusinessAppType;
  boardId?: string;
}

export function IntegratedFlexiBoard({ businessApp = 'crm', boardId }: IntegratedFlexiBoardProps) {
  const [engine, setEngine] = useState<EnhancedFlexiBoardEngine | null>(null);
  const [board, setBoard] = useState<FlexiBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const boardStore = useBoardStore();

  useEffect(() => {
    let cancelled = false;
    
    const initializeBoard = async () => {
      // Prevent double execution
      if (cancelled) return;
      
      setIsLoading(true);
      
      try {
        // First create the FlexiBoard, then create the engine with it
        
        // Debug logging
        console.log('🔧 IntegratedFlexiBoard initializing with:', { boardId, businessApp });
        
        // If boardId is provided, try to load from store
        if (boardId) {
          // Check if we already have this board loaded to avoid unnecessary fetches
          const currentBoard = boardStore.currentBoard;
          if (currentBoard && currentBoard.id === boardId) {
            console.log('🔧 Board already loaded:', currentBoard.id);
            // Board already loaded, skip fetch
          } else {
            console.log('🔧 Fetching board by ID:', boardId);
            await boardStore.fetchBoardById(boardId);
          }
          
          const cowBoard = boardStore.currentBoard;
          console.log('🔧 Using cowBoard:', cowBoard);
          
          if (cowBoard && cowBoard.id && Array.isArray(cowBoard.groups)) {
            // Ensure board has required properties with fallbacks
            const safeColumnOrder = cowBoard.columnOrder || ['title', 'status', 'priority', 'assignee', 'date'];
            const safeGroups = cowBoard.groups || [];
            // Convert COWBoard to FlexiBoard format
            const flexiBoard: FlexiBoard = {
              id: cowBoard.id,
              name: cowBoard.title || 'Untitled Board',
              description: cowBoard.description || '',
              ownerId: cowBoard.createdBy?.id || 'unknown',
              workspace: 'default', // COWBoard doesn't have workspace concept
              businessApp: businessApp,
              template: 'custom',
              columns: safeColumnOrder.map((type, index) => ({
                id: `col-${index}`,
                title: typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ') : `Column ${index + 1}`,
                type: mapComponentTypeToColumnType(type),
                width: getColumnWidth(type),
                required: index === 0, // First column is usually required
              })),
              views: [{
                id: 'default-view',
                name: 'Main View',
                type: 'table',
                isDefault: true,
                filters: [],
                sorts: [],
                visibleColumns: safeColumnOrder.map((_, index) => `col-${index}`)
              }],
              activeViewId: 'default-view',
              items: safeGroups.flatMap(group => 
                (group.tasks || []).map(task => ({
                  id: task.id || `task-${Math.random().toString(36).substr(2, 9)}`,
                  boardId: cowBoard.id,
                  data: {
                    'col-0': task.title || '',
                    'col-1': task.status || '',
                    'col-2': task.priority || 'medium',
                    'col-3': (task.assigneeIds || []).join(', ') || '',
                    'col-4': task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                  },
                  status: task.status || 'new',
                  priority: (task.priority as any) || 'medium',
                  assignees: task.assigneeIds || [],
                  tags: [],
                  createdAt: new Date(), // COWBoard doesn't track task creation time
                  updatedAt: new Date(task.updatedBy?.date || Date.now()),
                  createdBy: cowBoard.createdBy?.id || 'unknown',
                  position: 0
                }))
              ),
              groups: safeGroups.map(group => ({
                id: group.id || `group-${Math.random().toString(36).substr(2, 9)}`,
                title: group.title || '',
                color: group.color || '#579bfc',
                items: (group.tasks || []).map(task => ({
                  id: task.id || `task-${Math.random().toString(36).substr(2, 9)}`,
                  boardId: cowBoard.id,
                  data: {
                    'col-0': task.title || '',
                    'col-1': task.status || '',
                    'col-2': task.priority || 'medium',
                    'col-3': (task.assigneeIds || []).join(', ') || '',
                    'col-4': task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                  },
                  status: task.status || 'new',
                  priority: (task.priority as any) || 'medium',
                  assignees: task.assigneeIds || [],
                  tags: [],
                  createdAt: new Date(),
                  updatedAt: new Date(task.updatedBy?.date || Date.now()),
                  createdBy: cowBoard.createdBy?.id || 'unknown',
                  position: 0
                })),
                collapsed: false
              })),
              permissions: {
                canEdit: true,
                canDelete: true,
                canShare: true,
                canComment: true,
                canManageAutomations: true,
                canExport: true,
                canDuplicate: true
              },
              settings: {
                allowComments: true,
                enableNotifications: true,
                showSubItems: false,
                colorCoding: true,
                enableAutomations: true,
                trackTime: false,
                requireApproval: false,
                showUpdates: true,
                enableIntegrations: false,
                allowBulkOperations: true
              },
              createdAt: new Date(cowBoard.createdAt),
              updatedAt: new Date(cowBoard.updatedAt)
            };
            
            // Create enhanced FlexiBoard engine with the board
            const flexiEngine = new EnhancedFlexiBoardEngine(flexiBoard);
            setEngine(flexiEngine);
            setBoard(flexiBoard);
          } else {
            console.warn('COWBoard missing required properties:', {
              hasCowBoard: !!cowBoard,
              hasColumnOrder: cowBoard?.columnOrder !== undefined,
              hasGroups: Array.isArray(cowBoard?.groups),
              hasId: !!cowBoard?.id,
              cowBoard: cowBoard ? { id: cowBoard.id, title: cowBoard.title } : null
            });
            // Create demo board as fallback when COWBoard is invalid
            const demoBoard = createDemoBoard(businessApp);
            const flexiEngine = new EnhancedFlexiBoardEngine(demoBoard);
            setEngine(flexiEngine);
            setBoard(demoBoard);
          }
        } else {
          console.log('🔧 No boardId provided, creating demo board with businessApp:', businessApp);
          // Create demo board for the business app
          const demoBoard = createDemoBoard(businessApp);
          // Create enhanced FlexiBoard engine with the demo board
          const flexiEngine = new EnhancedFlexiBoardEngine(demoBoard);
          setEngine(flexiEngine);
          setBoard(demoBoard);
        }
      } catch (error) {
        console.error('Error initializing FlexiBoard:', error);
        // Create fallback demo board
        const fallbackBoard = createDemoBoard(businessApp);
        const fallbackEngine = new EnhancedFlexiBoardEngine(fallbackBoard);
        setEngine(fallbackEngine);
        setBoard(fallbackBoard);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initializeBoard();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, [boardId]); // Only depend on boardId - businessApp is rarely changed

  const handleBoardUpdate = (updatedBoard: FlexiBoard) => {
    try {
      if (!updatedBoard || !updatedBoard.id) {
        console.warn('Invalid board update received:', updatedBoard);
        return;
      }
      
      setBoard(updatedBoard);
      
      // Sync back to COW board system if this is connected to a COW board
      if (boardId && boardStore.currentBoard) {
        // Convert FlexiBoard changes back to COWBoard format
        // This would involve mapping the FlexiBoard structure back to COWBoard
        // For now, we'll just update the FlexiBoard state
        console.log('Board updated successfully:', updatedBoard.name);
      }
    } catch (error) {
      console.error('Error handling board update:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FlexiBoard...</p>
        </div>
      </div>
    );
  }

  if (!engine || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load FlexiBoard</h2>
          <p className="text-gray-600 mb-4">
            {!engine ? 'FlexiBoard engine failed to initialize' : 'Board data is not available'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Additional safety check before rendering
  try {
    if (!board.id || !board.name || !Array.isArray(board.columns)) {
      throw new Error('Invalid board structure');
    }

    return (
      <SafeRender>
        <ErrorBoundary>
          <FlexiBoardView
            board={board}
            engine={engine}
            onUpdate={handleBoardUpdate}
          />
        </ErrorBoundary>
      </SafeRender>
    );
  } catch (error) {
    console.error('Error rendering FlexiBoardView:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Rendering Error</h2>
          <p className="text-gray-600 mb-4">There was an error displaying the board</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

// Helper functions
function mapComponentTypeToColumnType(componentType: string): any {
  if (!componentType || typeof componentType !== 'string') return 'text';
  
  const mapping: Record<string, string> = {
    'title': 'text',
    'status': 'status',
    'priority': 'priority',
    'person': 'person',
    'date': 'date',
    'progress': 'progress',
    'currency': 'currency',
    'number': 'number',
    'tags': 'tags',
    'email': 'email',
    'phone': 'phone',
    'url': 'url',
    'checkbox': 'checkbox',
    'timeline': 'timeline'
  };
  
  return mapping[componentType.toLowerCase()] || 'text';
}

function getColumnWidth(componentType: string): number {
  if (!componentType || typeof componentType !== 'string') return 150;
  
  const widths: Record<string, number> = {
    'title': 200,
    'status': 120,
    'priority': 100,
    'person': 150,
    'date': 120,
    'progress': 150,
    'currency': 120,
    'number': 100,
    'tags': 180,
    'email': 180,
    'phone': 130,
    'url': 200,
    'checkbox': 80,
    'timeline': 200
  };
  
  return widths[componentType.toLowerCase()] || 150;
}

function createDemoBoard(businessApp: BusinessAppType): FlexiBoard {
  const templates = {
    crm: {
      name: 'CRM Pipeline',
      description: 'Manage your customer relationships and sales pipeline',
      columns: [
        { id: 'col-1', title: 'Lead Name', type: 'text', width: 200 },
        { id: 'col-2', title: 'Status', type: 'status', width: 120, options: [
          { label: 'New Lead', value: 'new', color: '#4F46E5' },
          { label: 'Contacted', value: 'contacted', color: '#F59E0B' },
          { label: 'Qualified', value: 'qualified', color: '#10B981' },
          { label: 'Proposal', value: 'proposal', color: '#8B5CF6' },
          { label: 'Won', value: 'won', color: '#059669' },
          { label: 'Lost', value: 'lost', color: '#DC2626' }
        ]},
        { id: 'col-3', title: 'Company', type: 'text', width: 150 },
        { id: 'col-4', title: 'Deal Value', type: 'currency', width: 120 },
        { id: 'col-5', title: 'Assigned To', type: 'person', width: 150 },
        { id: 'col-6', title: 'Close Date', type: 'date', width: 120 },
        { id: 'col-7', title: 'Progress', type: 'progress', width: 150 },
        { id: 'col-8', title: 'Email', type: 'email', width: 180 },
        { id: 'col-9', title: 'Phone', type: 'phone', width: 130 }
      ],
      items: [
        { id: 'item-1', data: { 'col-1': 'Acme Corp', 'col-2': 'qualified', 'col-3': 'Acme Corporation', 'col-4': 50000, 'col-5': 'john-doe', 'col-6': '2024-02-15', 'col-7': 75, 'col-8': 'contact@acme.com', 'col-9': '+1-555-0123' }},
        { id: 'item-2', data: { 'col-1': 'TechStart Inc', 'col-2': 'proposal', 'col-3': 'TechStart Innovations', 'col-4': 85000, 'col-5': 'jane-smith', 'col-6': '2024-01-30', 'col-7': 60, 'col-8': 'hello@techstart.io', 'col-9': '+1-555-0456' }},
        { id: 'item-3', data: { 'col-1': 'Global Solutions', 'col-2': 'contacted', 'col-3': 'Global Solutions Ltd', 'col-4': 120000, 'col-5': 'mike-johnson', 'col-6': '2024-03-01', 'col-7': 25, 'col-8': 'info@globalsol.com', 'col-9': '+1-555-0789' }}
      ]
    },
    'project-management': {
      name: 'Project Management',
      description: 'Track your projects and tasks efficiently',
      columns: [
        { id: 'col-1', title: 'Task Name', type: 'text', width: 200 },
        { id: 'col-2', title: 'Status', type: 'status', width: 120, options: [
          { label: 'Not Started', value: 'not-started', color: '#6B7280' },
          { label: 'In Progress', value: 'in-progress', color: '#F59E0B' },
          { label: 'Review', value: 'review', color: '#8B5CF6' },
          { label: 'Done', value: 'done', color: '#10B981' },
          { label: 'Blocked', value: 'blocked', color: '#DC2626' }
        ]},
        { id: 'col-3', title: 'Priority', type: 'priority', width: 100 },
        { id: 'col-4', title: 'Assignee', type: 'person', width: 150 },
        { id: 'col-5', title: 'Due Date', type: 'date', width: 120 },
        { id: 'col-6', title: 'Progress', type: 'progress', width: 150 },
        { id: 'col-7', title: 'Tags', type: 'tags', width: 180 }
      ],
      items: [
        { id: 'item-1', data: { 'col-1': 'Design Homepage', 'col-2': 'in-progress', 'col-3': 'high', 'col-4': 'designer-alex', 'col-5': '2024-01-25', 'col-6': 65, 'col-7': 'design,ui,homepage' }},
        { id: 'item-2', data: { 'col-1': 'API Integration', 'col-2': 'review', 'col-3': 'medium', 'col-4': 'dev-sarah', 'col-5': '2024-01-28', 'col-6': 90, 'col-7': 'backend,api,integration' }},
        { id: 'item-3', data: { 'col-1': 'User Testing', 'col-2': 'not-started', 'col-3': 'low', 'col-4': 'qa-mike', 'col-5': '2024-02-05', 'col-6': 0, 'col-7': 'testing,ux,feedback' }}
      ]
    }
  };

  const template = templates[businessApp] || templates.crm;
  
  return {
    id: `demo-board-${businessApp}`,
    name: template.name,
    description: template.description,
    ownerId: 'demo-user',
    workspace: 'demo-workspace',
    businessApp,
    template: businessApp === 'crm' ? 'leads' : 'projects',
    columns: template.columns,
    views: [{
      id: 'main-view',
      name: 'Main View',
      type: 'table',
      isDefault: true,
      filters: [],
      sorts: [],
      visibleColumns: template.columns.map(c => c.id)
    }],
    activeViewId: 'main-view',
    items: template.items.map(item => ({
      id: item.id,
      boardId: `demo-board-${businessApp}`,
      data: item.data,
      status: item.data['col-2'] as string,
      priority: (item.data['col-3'] as string) || 'medium',
      assignees: item.data['col-4'] ? [item.data['col-4'] as string] : [],
      tags: item.data['col-7'] && typeof item.data['col-7'] === 'string' && item.data['col-7'].includes(',') 
        ? (item.data['col-7'] as string).split(',').map(tag => tag.trim()) 
        : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'demo-user',
      position: 0
    })),
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true,
      canComment: true,
      canManageAutomations: true,
      canExport: true,
      canDuplicate: true
    },
    settings: {
      allowComments: true,
      enableNotifications: true,
      showSubItems: false,
      colorCoding: true,
      enableAutomations: true,
      trackTime: false,
      requireApproval: false,
      showUpdates: true,
      enableIntegrations: false,
      allowBulkOperations: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}