import { SampleData, Board, BoardGroup, BoardItem, BoardColumn, Workspace, Person } from '../types/board.types';

// Sample people
export const samplePeople: Person[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', color: '#0073ea' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', color: '#00c875' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', color: '#ff5e5b' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', color: '#fdab3d' },
];

// Sample status options
export const statusOptions = [
  { id: '1', label: 'Not Started', color: '#c4c4c4' },
  { id: '2', label: 'Working on it', color: '#fdab3d' },
  { id: '3', label: 'Done', color: '#00c875' },
  { id: '4', label: 'Stuck', color: '#e2445c' },
];

// Sample priority options
export const priorityOptions = [
  { id: '1', label: 'Low', color: '#579bfc' },
  { id: '2', label: 'Medium', color: '#fdab3d' },
  { id: '3', label: 'High', color: '#e2445c' },
  { id: '4', label: 'Critical', color: '#bb3354' },
];

// Sample boards
const sampleBoards: Board[] = [
  {
    id: 'board-1',
    name: 'Marketing Campaign',
    description: 'Q4 2024 Marketing Campaign Planning',
    workspaceId: 'workspace-1',
    color: '#0073ea',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'board-2',
    name: 'Product Roadmap',
    description: 'Feature development and releases',
    workspaceId: 'workspace-1',
    color: '#00c875',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'board-3',
    name: 'Sales Pipeline',
    description: 'Track leads and opportunities',
    workspaceId: 'workspace-2',
    color: '#ff5e5b',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
  },
];

// Sample columns for Marketing Campaign board
const marketingColumns: BoardColumn[] = [
  {
    id: 'col-1',
    boardId: 'board-1',
    name: 'Task',
    type: 'text',
    position: 0,
    width: 200,
    required: true,
  },
  {
    id: 'col-2',
    boardId: 'board-1',
    name: 'Status',
    type: 'status',
    position: 1,
    width: 120,
    required: false,
    options: statusOptions,
  },
  {
    id: 'col-3',
    boardId: 'board-1',
    name: 'Assigned To',
    type: 'person',
    position: 2,
    width: 150,
    required: false,
  },
  {
    id: 'col-4',
    boardId: 'board-1',
    name: 'Due Date',
    type: 'date',
    position: 3,
    width: 120,
    required: false,
  },
  {
    id: 'col-5',
    boardId: 'board-1',
    name: 'Priority',
    type: 'status',
    position: 4,
    width: 100,
    required: false,
    options: priorityOptions,
  },
];

// Sample groups for Marketing Campaign board
const marketingGroups: BoardGroup[] = [
  {
    id: 'group-1',
    boardId: 'board-1',
    name: 'Planning Phase',
    color: '#0073ea',
    position: 0,
    collapsed: false,
  },
  {
    id: 'group-2',
    boardId: 'board-1',
    name: 'Execution',
    color: '#00c875',
    position: 1,
    collapsed: false,
  },
  {
    id: 'group-3',
    boardId: 'board-1',
    name: 'Review & Analysis',
    color: '#ff5e5b',
    position: 2,
    collapsed: false,
  },
];

// Sample items for Marketing Campaign board
const marketingItems: BoardItem[] = [
  {
    id: 'item-1',
    groupId: 'group-1',
    position: 0,
    data: {
      'col-1': 'Market Research',
      'col-2': '2', // Working on it
      'col-3': '1', // John Doe
      'col-4': '2024-02-15',
      'col-5': '3', // High
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'item-2',
    groupId: 'group-1',
    position: 1,
    data: {
      'col-1': 'Create Brand Guidelines',
      'col-2': '1', // Not Started
      'col-3': '2', // Jane Smith
      'col-4': '2024-02-20',
      'col-5': '2', // Medium
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'item-3',
    groupId: 'group-2',
    position: 0,
    data: {
      'col-1': 'Design Landing Page',
      'col-2': '2', // Working on it
      'col-3': '3', // Mike Johnson
      'col-4': '2024-03-01',
      'col-5': '3', // High
    },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'item-4',
    groupId: 'group-2',
    position: 1,
    data: {
      'col-1': 'Launch Social Media Campaign',
      'col-2': '1', // Not Started
      'col-3': '4', // Sarah Wilson
      'col-4': '2024-03-15',
      'col-5': '2', // Medium
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'item-5',
    groupId: 'group-3',
    position: 0,
    data: {
      'col-1': 'Analyze Campaign Performance',
      'col-2': '1', // Not Started
      'col-3': '1', // John Doe
      'col-4': '2024-04-01',
      'col-5': '2', // Medium
    },
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

// Sample workspaces
const sampleWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Marketing Team',
    color: '#0073ea',
    boards: sampleBoards.filter(b => b.workspaceId === 'workspace-1'),
  },
  {
    id: 'workspace-2',
    name: 'Sales Team',
    color: '#00c875',
    boards: sampleBoards.filter(b => b.workspaceId === 'workspace-2'),
  },
];

export const sampleData: SampleData = {
  workspaces: sampleWorkspaces,
};

// Helper functions to get data
export const getBoardById = (id: string): Board | undefined => {
  return sampleBoards.find(board => board.id === id);
};

export const getColumnsByBoardId = (boardId: string): BoardColumn[] => {
  // For now, only return marketing columns for the demo board
  return boardId === 'board-1' ? marketingColumns : [];
};

export const getGroupsByBoardId = (boardId: string): BoardGroup[] => {
  // For now, only return marketing groups for the demo board
  return boardId === 'board-1' ? marketingGroups : [];
};

export const getItemsByBoardId = (boardId: string): BoardItem[] => {
  // For now, only return marketing items for the demo board
  return boardId === 'board-1' ? marketingItems : [];
};

export const getPersonById = (id: string): Person | undefined => {
  return samplePeople.find(person => person.id === id);
};

export const getStatusById = (id: string): any => {
  return statusOptions.find(status => status.id === id);
};

export const getPriorityById = (id: string): any => {
  return priorityOptions.find(priority => priority.id === id);
};