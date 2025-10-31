import { Widget, WidgetType, WidgetConfig } from '../types/widgets.types';
import { WIDGET_CONFIGS } from '../config/widgets.config';

export interface SmartLayoutSuggestion {
  id: string;
  name: string;
  description: string;
  confidence: number;
  widgets: {
    type: WidgetType;
    position: { x: number; y: number; width: number; height: number };
    reason: string;
  }[];
  category: 'productivity' | 'analytics' | 'collaboration' | 'mixed';
  icon: string;
}

export interface WidgetRecommendation {
  widget: WidgetConfig;
  reason: string;
  confidence: number;
  suggestedPosition?: { x: number; y: number; width: number; height: number };
  category: 'trending' | 'personalized' | 'complementary' | 'seasonal';
}

export class WidgetRecommendationService {
  private static readonly USAGE_PATTERNS_KEY = 'widget-usage-patterns';
  private static readonly USER_PREFERENCES_KEY = 'widget-user-preferences';

  // Track widget usage for AI recommendations
  static trackWidgetUsage(widgetType: WidgetType, action: 'add' | 'remove' | 'interact' | 'resize' | 'move'): void {
    try {
      const patterns = this.getUsagePatterns();
      const timestamp = Date.now();
      const dateKey = new Date().toDateString();

      if (!patterns[widgetType]) {
        patterns[widgetType] = {
          totalUsage: 0,
          dailyUsage: {},
          actions: {},
          lastUsed: timestamp,
          addedCount: 0,
          removedCount: 0
        };
      }

      const widgetPattern = patterns[widgetType];

      // Update usage statistics
      widgetPattern.totalUsage++;
      widgetPattern.lastUsed = timestamp;

      if (!widgetPattern.dailyUsage[dateKey]) {
        widgetPattern.dailyUsage[dateKey] = 0;
      }
      widgetPattern.dailyUsage[dateKey]++;

      if (!widgetPattern.actions[action]) {
        widgetPattern.actions[action] = 0;
      }
      widgetPattern.actions[action]++;

      if (action === 'add') widgetPattern.addedCount++;
      if (action === 'remove') widgetPattern.removedCount++;

      localStorage.setItem(this.USAGE_PATTERNS_KEY, JSON.stringify(patterns));
    } catch (error) {
      console.error('Failed to track widget usage:', error);
    }
  }

  // Get personalized widget recommendations
  static getPersonalizedRecommendations(currentWidgets: Widget[]): WidgetRecommendation[] {
    const recommendations: WidgetRecommendation[] = [];
    const activeWidgetTypes = new Set(currentWidgets.map(w => w.type));
    const patterns = this.getUsagePatterns();
    const preferences = this.getUserPreferences();

    // 1. Trending widgets (popular among similar users)
    const trendingWidgets = this.getTrendingWidgets();
    for (const widgetType of trendingWidgets) {
      if (!activeWidgetTypes.has(widgetType)) {
        const widget = WIDGET_CONFIGS[widgetType];
        if (widget) {
          recommendations.push({
            widget,
            reason: 'Popular among users with similar workspace preferences',
            confidence: 0.8,
            category: 'trending',
            suggestedPosition: this.suggestOptimalPosition(widget, currentWidgets)
          });
        }
      }
    }

    // 2. Complementary widgets (based on current widgets)
    for (const activeWidget of currentWidgets) {
      const complementaryTypes = this.getComplementaryWidgets(activeWidget.type);
      for (const widgetType of complementaryTypes) {
        if (!activeWidgetTypes.has(widgetType)) {
          const widget = WIDGET_CONFIGS[widgetType];
          if (widget) {
            recommendations.push({
              widget,
              reason: `Works well with your ${WIDGET_CONFIGS[activeWidget.type]?.title || 'current widget'}`,
              confidence: 0.7,
              category: 'complementary',
              suggestedPosition: this.suggestOptimalPosition(widget, currentWidgets)
            });
          }
        }
      }
    }

    // 3. Previously used widgets (user history)
    for (const [widgetType, pattern] of Object.entries(patterns)) {
      if (!activeWidgetTypes.has(widgetType as WidgetType) && pattern.addedCount > pattern.removedCount) {
        const widget = WIDGET_CONFIGS[widgetType as WidgetType];
        if (widget) {
          const daysSinceLastUse = (Date.now() - pattern.lastUsed) / (1000 * 60 * 60 * 24);
          const confidence = Math.max(0.3, 0.9 - (daysSinceLastUse * 0.1));

          recommendations.push({
            widget,
            reason: `You've used this widget ${pattern.addedCount} times before`,
            confidence,
            category: 'personalized',
            suggestedPosition: this.suggestOptimalPosition(widget, currentWidgets)
          });
        }
      }
    }

    // 4. Seasonal/contextual recommendations
    const seasonalRecommendations = this.getSeasonalRecommendations();
    for (const rec of seasonalRecommendations) {
      if (!activeWidgetTypes.has(rec.widgetType)) {
        const widget = WIDGET_CONFIGS[rec.widgetType];
        if (widget) {
          recommendations.push({
            widget,
            reason: rec.reason,
            confidence: 0.6,
            category: 'seasonal',
            suggestedPosition: this.suggestOptimalPosition(widget, currentWidgets)
          });
        }
      }
    }

    // Sort by confidence and limit results
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
  }

  // Get smart layout suggestions
  static getSmartLayoutSuggestions(currentWidgets: Widget[]): SmartLayoutSuggestion[] {
    const suggestions: SmartLayoutSuggestion[] = [];

    // Productivity-focused layout
    suggestions.push({
      id: 'productivity-focus',
      name: 'Productivity Focus',
      description: 'Optimized for task management and goal tracking',
      confidence: 0.9,
      category: 'productivity',
      icon: '🎯',
      widgets: [
        { type: 'quick-actions', position: { x: 0, y: 0, width: 1, height: 1 }, reason: 'Quick access to actions' },
        { type: 'goals-progress', position: { x: 1, y: 0, width: 2, height: 1 }, reason: 'Track your goals at a glance' },
        { type: 'calendar', position: { x: 0, y: 1, width: 2, height: 2 }, reason: 'Stay on top of your schedule' },
        { type: 'tasks', position: { x: 2, y: 1, width: 1, height: 2 }, reason: 'Manage your daily tasks' }
      ]
    });

    // Analytics dashboard layout
    suggestions.push({
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      description: 'Data-driven insights and performance metrics',
      confidence: 0.8,
      category: 'analytics',
      icon: '📊',
      widgets: [
        { type: 'performance-metrics', position: { x: 0, y: 0, width: 2, height: 1 }, reason: 'Key performance indicators' },
        { type: 'revenue-chart', position: { x: 2, y: 0, width: 1, height: 1 }, reason: 'Track financial performance' },
        { type: 'activity-feed', position: { x: 0, y: 1, width: 1, height: 2 }, reason: 'Monitor recent activities' },
        { type: 'team-status', position: { x: 1, y: 1, width: 2, height: 1 }, reason: 'Team collaboration overview' }
      ]
    });

    // Collaboration hub layout
    suggestions.push({
      id: 'collaboration-hub',
      name: 'Collaboration Hub',
      description: 'Team communication and project coordination',
      confidence: 0.75,
      category: 'collaboration',
      icon: '👥',
      widgets: [
        { type: 'team-status', position: { x: 0, y: 0, width: 2, height: 1 }, reason: 'See who\'s online and available' },
        { type: 'recent-files', position: { x: 2, y: 0, width: 1, height: 1 }, reason: 'Quick access to shared files' },
        { type: 'notifications', position: { x: 0, y: 1, width: 1, height: 1 }, reason: 'Stay updated on team activities' },
        { type: 'activity-feed', position: { x: 1, y: 1, width: 2, height: 2 }, reason: 'Track project progress' }
      ]
    });

    // Custom mixed layout based on usage patterns
    const personalizedLayout = this.generatePersonalizedLayout(currentWidgets);
    if (personalizedLayout) {
      suggestions.push(personalizedLayout);
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // Apply a smart layout suggestion
  static applySmartLayout(suggestion: SmartLayoutSuggestion): Widget[] {
    const widgets: Widget[] = [];

    for (const widgetDef of suggestion.widgets) {
      const config = WIDGET_CONFIGS[widgetDef.type];
      if (config) {
        widgets.push({
          id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: widgetDef.type,
          title: config.title,
          position: widgetDef.position,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return widgets;
  }

  // Private helper methods
  private static getUsagePatterns(): Record<string, any> {
    try {
      return JSON.parse(localStorage.getItem(this.USAGE_PATTERNS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private static getUserPreferences(): Record<string, any> {
    try {
      return JSON.parse(localStorage.getItem(this.USER_PREFERENCES_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private static getTrendingWidgets(): WidgetType[] {
    // Simulate trending widgets based on current popular productivity tools
    return ['quick-actions', 'goals-progress', 'calendar', 'performance-metrics'];
  }

  private static getComplementaryWidgets(widgetType: WidgetType): WidgetType[] {
    const complementaryMap: Record<WidgetType, WidgetType[]> = {
      'quick-actions': ['shortcuts', 'notifications'],
      'calendar': ['tasks', 'goals-progress'],
      'tasks': ['calendar', 'goals-progress'],
      'goals-progress': ['calendar', 'tasks', 'performance-metrics'],
      'performance-metrics': ['revenue-chart', 'activity-feed'],
      'team-status': ['activity-feed', 'notifications'],
      'activity-feed': ['team-status', 'notifications'],
      'recent-files': ['shortcuts', 'activity-feed'],
      'revenue-chart': ['performance-metrics'],
      'notifications': ['activity-feed', 'team-status'],
      'shortcuts': ['quick-actions', 'recent-files']
    };

    return complementaryMap[widgetType] || [];
  }

  private static getSeasonalRecommendations(): Array<{ widgetType: WidgetType; reason: string }> {
    const month = new Date().getMonth();
    const recommendations: Array<{ widgetType: WidgetType; reason: string }> = [];

    // Year-end planning (November-December)
    if (month >= 10) {
      recommendations.push({
        widgetType: 'goals-progress',
        reason: 'Perfect time for year-end goal reviews and planning'
      });
      recommendations.push({
        widgetType: 'performance-metrics',
        reason: 'Analyze your annual performance metrics'
      });
    }

    // New Year productivity boost (January-February)
    if (month <= 1) {
      recommendations.push({
        widgetType: 'tasks',
        reason: 'Start the year organized with better task management'
      });
      recommendations.push({
        widgetType: 'calendar',
        reason: 'Plan your year ahead with better calendar integration'
      });
    }

    return recommendations;
  }

  private static suggestOptimalPosition(
    widget: WidgetConfig,
    currentWidgets: Widget[]
  ): { x: number; y: number; width: number; height: number } {
    const gridSize = { width: 4, height: 6 }; // Assume 4x6 grid
    const occupied: boolean[][] = Array(gridSize.height).fill(null).map(() => Array(gridSize.width).fill(false));

    // Mark occupied positions
    for (const w of currentWidgets) {
      for (let y = w.position.y; y < w.position.y + w.position.height; y++) {
        for (let x = w.position.x; x < w.position.x + w.position.width; x++) {
          if (y < gridSize.height && x < gridSize.width) {
            occupied[y][x] = true;
          }
        }
      }
    }

    // Find optimal position for the new widget
    const defaultSize = widget.defaultSize;

    for (let y = 0; y <= gridSize.height - defaultSize.height; y++) {
      for (let x = 0; x <= gridSize.width - defaultSize.width; x++) {
        let canPlace = true;

        // Check if the widget can fit at this position
        for (let dy = 0; dy < defaultSize.height; dy++) {
          for (let dx = 0; dx < defaultSize.width; dx++) {
            if (occupied[y + dy][x + dx]) {
              canPlace = false;
              break;
            }
          }
          if (!canPlace) break;
        }

        if (canPlace) {
          return {
            x,
            y,
            width: defaultSize.width,
            height: defaultSize.height
          };
        }
      }
    }

    // If no optimal position found, return default
    return {
      x: 0,
      y: 0,
      width: defaultSize.width,
      height: defaultSize.height
    };
  }

  private static generatePersonalizedLayout(currentWidgets: Widget[]): SmartLayoutSuggestion | null {
    const patterns = this.getUsagePatterns();
    const mostUsedWidgets = Object.entries(patterns)
      .sort(([, a], [, b]) => (b as any).totalUsage - (a as any).totalUsage)
      .slice(0, 4)
      .map(([widgetType]) => widgetType as WidgetType);

    if (mostUsedWidgets.length < 3) return null;

    const widgets = mostUsedWidgets.map((type, index) => {
      const config = WIDGET_CONFIGS[type];
      const positions = [
        { x: 0, y: 0, width: 1, height: 1 },
        { x: 1, y: 0, width: 2, height: 1 },
        { x: 0, y: 1, width: 2, height: 1 },
        { x: 2, y: 1, width: 1, height: 1 }
      ];

      return {
        type,
        position: positions[index] || { x: 0, y: 2, width: 1, height: 1 },
        reason: `Your most used widget with ${(patterns[type] as any).totalUsage} interactions`
      };
    });

    return {
      id: 'personalized-layout',
      name: 'Your Personal Layout',
      description: 'Based on your usage patterns and preferences',
      confidence: 0.85,
      category: 'mixed',
      icon: '⭐',
      widgets
    };
  }

  // Update user preferences
  static updateUserPreferences(preferences: Record<string, any>): void {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences, updatedAt: Date.now() };
      localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  }

  // Clear all AI data
  static clearAIData(): void {
    try {
      localStorage.removeItem(this.USAGE_PATTERNS_KEY);
      localStorage.removeItem(this.USER_PREFERENCES_KEY);
    } catch (error) {
      console.error('Failed to clear AI data:', error);
    }
  }
}