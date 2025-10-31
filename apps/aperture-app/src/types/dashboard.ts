export interface Board {
  id: string;
  name: string;
  type: 'leads' | 'deals' | 'contacts' | 'accounts' | 'projects' | 'activities' | 'email-template';
  enabled: boolean;
  iconColor?: string;
  itemCount?: number;
}

export interface Workspace {
  id: string;
  name: string;
  iconColor: string;
  boards: Board[];
  type: 'personal' | 'team' | 'collaborative';
  memberCount?: number;
  isOwner?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
}

export type ViewType = 'table' | 'calendar';
export type DateViewType = 'today' | 'week' | 'month' | 'custom';