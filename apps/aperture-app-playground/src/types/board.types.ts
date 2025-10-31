// Core Monday.com-style board types

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardGroup {
  id: string;
  boardId: string;
  name: string;
  color: string;
  position: number;
  collapsed: boolean;
}

export interface BoardItem {
  id: string;
  groupId: string;
  position: number;
  data: Record<string, any>; // Column data
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardColumn {
  id: string;
  boardId: string;
  name: string;
  type: ColumnType;
  position: number;
  width: number;
  required: boolean;
  options?: ColumnOption[]; // For status, dropdown columns
}

export interface ColumnOption {
  id: string;
  label: string;
  color: string;
}

export type ColumnType =
  | 'text'
  | 'status'
  | 'person'
  | 'date'
  | 'number'
  | 'checkbox'
  | 'dropdown';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  boards: Board[];
}

// Sample data interfaces
export interface SampleData {
  workspaces: Workspace[];
}

export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}