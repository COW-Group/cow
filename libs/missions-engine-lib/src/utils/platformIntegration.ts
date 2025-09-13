// Platform Integration Service for COW Missions Engine
// This service provides interfaces for integrating with other platform apps

export interface PlatformApp {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface IntegrationEvent {
  id: string;
  type: string;
  source: string;
  target: string;
  data: any;
  timestamp: Date;
}

export interface NotificationConfig {
  enabled: boolean;
  channels: ('email' | 'slack' | 'teams' | 'webhook')[];
  rules: NotificationRule[];
}

export interface NotificationRule {
  id: string;
  trigger: string;
  conditions: Record<string, any>;
  message: string;
  recipients: string[];
}

export class PlatformIntegrationService {
  private apps: Map<string, PlatformApp> = new Map();
  private eventQueue: IntegrationEvent[] = [];

  constructor() {
    this.initializeDefaultApps();
  }

  // Initialize default platform apps
  private initializeDefaultApps() {
    const defaultApps: PlatformApp[] = [
      {
        id: 'platform-app',
        name: 'Main Platform',
        baseUrl: 'http://localhost:4200',
        enabled: true,
        config: {
          features: ['trading', 'portfolio', 'analytics'],
          apiVersion: 'v1',
        },
      },
      {
        id: 'admin-portal',
        name: 'Admin Portal',
        baseUrl: 'http://localhost:4202',
        enabled: true,
        config: {
          features: ['user-management', 'system-config', 'monitoring'],
          apiVersion: 'v1',
        },
      },
      {
        id: 'support-center',
        name: 'Support Center',
        baseUrl: 'http://localhost:4200',
        enabled: true,
        config: {
          features: ['tickets', 'chat', 'knowledge-base'],
          apiVersion: 'v1',
        },
      },
      {
        id: 'mobile-app',
        name: 'Mobile App',
        baseUrl: 'http://localhost:3000',
        enabled: false,
        config: {
          features: ['trading', 'portfolio'],
          platform: 'react-native',
        },
      },
    ];

    defaultApps.forEach(app => this.apps.set(app.id, app));
  }

  // App Management
  registerApp(app: PlatformApp): void {
    this.apps.set(app.id, app);
  }

  getApp(appId: string): PlatformApp | null {
    return this.apps.get(appId) || null;
  }

  getAllApps(): PlatformApp[] {
    return Array.from(this.apps.values());
  }

  enableApp(appId: string): boolean {
    const app = this.apps.get(appId);
    if (app) {
      app.enabled = true;
      return true;
    }
    return false;
  }

  disableApp(appId: string): boolean {
    const app = this.apps.get(appId);
    if (app) {
      app.enabled = false;
      return true;
    }
    return false;
  }

  // Cross-platform navigation
  navigateToApp(appId: string, path?: string): string {
    const app = this.getApp(appId);
    if (!app || !app.enabled) {
      throw new Error(`App ${appId} not found or not enabled`);
    }

    const url = path ? `${app.baseUrl}${path}` : app.baseUrl;
    return url;
  }

  // Navigation helpers for specific apps
  navigateToMainPlatform(path = '/'): string {
    return this.navigateToApp('platform-app', path);
  }

  navigateToAdminPortal(path = '/'): string {
    return this.navigateToApp('admin-portal', path);
  }

  navigateToSupportCenter(path = '/'): string {
    return this.navigateToApp('support-center', path);
  }

  // Universal search across platforms
  async universalSearch(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Search within missions
    const missionResults = await this.searchMissions(query);
    results.push(...missionResults);

    // Search in other platforms (mock implementation)
    const platformResults = await this.searchOtherPlatforms(query);
    results.push(...platformResults);

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  private async searchMissions(query: string): Promise<SearchResult[]> {
    // This would integrate with your mission search functionality
    return [
      {
        id: '1',
        title: `Mission: ${query}`,
        description: 'Related mission found',
        type: 'mission',
        app: 'missions-engine',
        url: '/missions/1',
        relevance: 0.9,
      },
    ];
  }

  private async searchOtherPlatforms(query: string): Promise<SearchResult[]> {
    // Mock implementation - in real app, this would call APIs
    return [
      {
        id: '2',
        title: `Trading data for ${query}`,
        description: 'Trading information',
        type: 'trading',
        app: 'platform-app',
        url: '/trading/search?q=' + encodeURIComponent(query),
        relevance: 0.7,
      },
      {
        id: '3',
        title: `Support ticket: ${query}`,
        description: 'Related support ticket',
        type: 'ticket',
        app: 'support-center',
        url: '/tickets/search?q=' + encodeURIComponent(query),
        relevance: 0.6,
      },
    ];
  }

  // Event system for cross-platform communication
  publishEvent(event: Omit<IntegrationEvent, 'id' | 'timestamp'>): void {
    const fullEvent: IntegrationEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };
    
    this.eventQueue.push(fullEvent);
    this.processEvent(fullEvent);
  }

  private processEvent(event: IntegrationEvent): void {
    // Process different types of events
    switch (event.type) {
      case 'mission_created':
        this.handleMissionCreated(event);
        break;
      case 'mission_completed':
        this.handleMissionCompleted(event);
        break;
      case 'board_shared':
        this.handleBoardShared(event);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  private handleMissionCreated(event: IntegrationEvent): void {
    // Notify relevant platforms about new mission
    this.sendNotification({
      type: 'mission_created',
      message: `New mission created: ${event.data.title}`,
      recipients: event.data.team || [],
      channels: ['email'],
    });
  }

  private handleMissionCompleted(event: IntegrationEvent): void {
    // Update related systems when mission is completed
    this.sendNotification({
      type: 'mission_completed',
      message: `Mission completed: ${event.data.title}`,
      recipients: event.data.stakeholders || [],
      channels: ['email', 'slack'],
    });
  }

  private handleBoardShared(event: IntegrationEvent): void {
    // Handle board sharing across platforms
    console.log('Board shared:', event.data);
  }

  // Notification system
  private sendNotification(notification: {
    type: string;
    message: string;
    recipients: string[];
    channels: string[];
  }): void {
    // Mock notification sending
    console.log('Sending notification:', notification);
    
    // In real implementation, this would integrate with:
    // - Email service
    // - Slack API
    // - Teams API
    // - Webhook endpoints
  }

  // Data synchronization helpers
  async syncMissionWithPlatform(missionId: string, targetApp: string): Promise<boolean> {
    try {
      const app = this.getApp(targetApp);
      if (!app || !app.enabled) {
        return false;
      }

      // Mock API call to sync mission data
      console.log(`Syncing mission ${missionId} with ${targetApp}`);
      
      // In real implementation:
      // const response = await fetch(`${app.baseUrl}/api/missions/${missionId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(missionData)
      // });
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  }

  // Analytics integration
  async sendAnalyticsEvent(event: {
    category: string;
    action: string;
    label?: string;
    value?: number;
    customData?: Record<string, any>;
  }): Promise<void> {
    // Mock analytics event
    console.log('Analytics event:', event);
    
    // In real implementation, integrate with:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics service
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Get integration status
  getIntegrationStatus(): {
    connectedApps: number;
    totalApps: number;
    recentEvents: IntegrationEvent[];
    status: 'healthy' | 'warning' | 'error';
  } {
    const enabledApps = Array.from(this.apps.values()).filter(app => app.enabled);
    const recentEvents = this.eventQueue.slice(-10);
    
    return {
      connectedApps: enabledApps.length,
      totalApps: this.apps.size,
      recentEvents,
      status: enabledApps.length > 0 ? 'healthy' : 'warning',
    };
  }
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  app: string;
  url: string;
  relevance: number;
}

// Export singleton instance
export const platformIntegration = new PlatformIntegrationService();

// Navigation utilities for components
export const useNavigation = () => {
  return {
    navigateToApp: (appId: string, path?: string) => {
      const url = platformIntegration.navigateToApp(appId, path);
      window.open(url, '_blank');
    },
    navigateToMainPlatform: (path?: string) => {
      const url = platformIntegration.navigateToMainPlatform(path);
      window.open(url, '_blank');
    },
    navigateToAdminPortal: (path?: string) => {
      const url = platformIntegration.navigateToAdminPortal(path);
      window.open(url, '_blank');
    },
    navigateToSupportCenter: (path?: string) => {
      const url = platformIntegration.navigateToSupportCenter(path);
      window.open(url, '_blank');
    },
  };
};