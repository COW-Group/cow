export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}

export interface User extends BaseEntity {
  readonly email: string;
  readonly fullName: string;
  readonly avatarUrl?: string;
  readonly timezone: string;
  readonly preferences: UserPreferences;
}

export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'system';
  readonly notifications: NotificationSettings;
  readonly sidebarCollapsed: boolean;
  readonly favoriteItems: string[];
  readonly recentlyViewed: RecentItem[];
}

export interface NotificationSettings {
  readonly email: boolean;
  readonly push: boolean;
  readonly mentions: boolean;
  readonly dueDates: boolean;
  readonly statusUpdates: boolean;
}

export interface RecentItem {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly timestamp: Date;
}