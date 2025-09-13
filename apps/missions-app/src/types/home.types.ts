export interface User {
  id: string;
  name: string;
  email: string;
  recentBoards: BoardPreview[];
}

export interface DashboardStats {
  leads: number;
  deals: number;
  accounts: number;
  activities: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  iconType: 'lead' | 'deal' | 'meeting' | 'contact' | 'account';
  timestamp: Date;
  userId?: string;
}

export interface UpdateFeed {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type: 'notification' | 'mention' | 'update' | 'reminder';
}

export interface BoardPreview {
  id: string;
  slug: string;
  name: string;
  description: string;
  itemCount: number;
  lastVisited: Date;
  isStarred: boolean;
  color: string;
  iconType?: string;
  previewImage?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: 'User' | 'DollarSign' | 'Building' | 'Calendar' | 'Activity';
  route: string;
  iconColor: string;
  count?: number;
}

export interface HomeDashboardData {
  user: User;
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  updateFeed: UpdateFeed[];
  quickActions: QuickAction[];
}

export interface StatsCardProps {
  label: string;
  value: number;
  icon: 'User' | 'DollarSign' | 'Building' | 'TrendingUp';
  iconColor: string;
  bgColor: string;
  route?: string;
  onClick?: () => void;
}

export interface CardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface GreetingProps {
  userName: string;
  timeOfDay?: TimeOfDay;
}