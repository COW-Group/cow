export interface Person {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Status {
  label: string;
  color: string;
  id: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Item {
  id: string;
  name: string;
  board: Board;
  status: Status;
  date: string;
  persons: Person[];
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  item: Item;
  assignedAt: Date;
  assignedBy: string;
  isCompleted: boolean;
  isOverdue: boolean;
}

export interface MyWorkData {
  assignments: Assignment[];
  totalCount: number;
  pendingCount: number;
  completedCount: number;
}

export type MyWorkView = 'table' | 'calendar';
export type DateViewOption = 'today' | 'week' | 'month' | 'all';

export interface MyWorkFilters {
  search: string;
  dateView: DateViewOption;
  status: string[];
  boards: string[];
}

export interface MyWorkState {
  data: MyWorkData | null;
  loading: boolean;
  error: string | null;
  view: MyWorkView;
  filters: MyWorkFilters;
}