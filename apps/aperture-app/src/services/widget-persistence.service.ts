import { Widget, WidgetLayout } from '../types/widgets.types';

const WIDGET_LAYOUT_KEY = 'aperture-app-widget-layout';
const SAVED_LAYOUTS_KEY = 'aperture-app-saved-layouts';

export class WidgetPersistenceService {
  // Save current layout
  static saveCurrentLayout(userId: string, widgets: Widget[]): void {
    try {
      const layout: WidgetLayout = {
        id: 'current',
        userId,
        name: 'Current Layout',
        isDefault: true,
        widgets,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem(WIDGET_LAYOUT_KEY, JSON.stringify(layout));
    } catch (error) {
      console.error('Failed to save widget layout:', error);
    }
  }

  // Load current layout
  static loadCurrentLayout(userId: string): Widget[] | null {
    try {
      const layoutData = localStorage.getItem(WIDGET_LAYOUT_KEY);
      if (!layoutData) return null;

      const layout: WidgetLayout = JSON.parse(layoutData);

      // Verify the layout belongs to the current user
      if (layout.userId !== userId) return null;

      return layout.widgets;
    } catch (error) {
      console.error('Failed to load widget layout:', error);
      return null;
    }
  }

  // Save a named layout
  static saveNamedLayout(userId: string, name: string, widgets: Widget[]): void {
    try {
      const layouts = this.getSavedLayouts(userId);

      const newLayout: WidgetLayout = {
        id: `layout-${Date.now()}`,
        userId,
        name,
        isDefault: false,
        widgets,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Remove existing layout with same name
      const filteredLayouts = layouts.filter(layout => layout.name !== name);
      filteredLayouts.push(newLayout);

      localStorage.setItem(SAVED_LAYOUTS_KEY, JSON.stringify(filteredLayouts));
    } catch (error) {
      console.error('Failed to save named layout:', error);
    }
  }

  // Get all saved layouts for a user
  static getSavedLayouts(userId: string): WidgetLayout[] {
    try {
      const layoutsData = localStorage.getItem(SAVED_LAYOUTS_KEY);
      if (!layoutsData) return [];

      const allLayouts: WidgetLayout[] = JSON.parse(layoutsData);
      return allLayouts.filter(layout => layout.userId === userId);
    } catch (error) {
      console.error('Failed to load saved layouts:', error);
      return [];
    }
  }

  // Load a specific saved layout
  static loadSavedLayout(userId: string, layoutId: string): Widget[] | null {
    try {
      const layouts = this.getSavedLayouts(userId);
      const layout = layouts.find(l => l.id === layoutId);
      return layout ? layout.widgets : null;
    } catch (error) {
      console.error('Failed to load saved layout:', error);
      return null;
    }
  }

  // Delete a saved layout
  static deleteSavedLayout(userId: string, layoutId: string): void {
    try {
      const layouts = this.getSavedLayouts(userId);
      const filteredLayouts = layouts.filter(l => l.id !== layoutId);
      localStorage.setItem(SAVED_LAYOUTS_KEY, JSON.stringify(filteredLayouts));
    } catch (error) {
      console.error('Failed to delete saved layout:', error);
    }
  }

  // Export layout to JSON
  static exportLayout(layout: WidgetLayout): void {
    try {
      const exportData = {
        ...layout,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${layout.name.toLowerCase().replace(/\s+/g, '-')}-layout.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export layout:', error);
    }
  }

  // Import layout from JSON
  static importLayout(userId: string, layoutData: any): Widget[] | null {
    try {
      // Validate the imported data structure
      if (!layoutData.widgets || !Array.isArray(layoutData.widgets)) {
        throw new Error('Invalid layout format');
      }

      // Validate each widget in the layout
      const validWidgets: Widget[] = layoutData.widgets.filter((widget: any) => {
        return (
          widget.id &&
          widget.type &&
          widget.title &&
          widget.position &&
          typeof widget.position.x === 'number' &&
          typeof widget.position.y === 'number' &&
          typeof widget.position.width === 'number' &&
          typeof widget.position.height === 'number'
        );
      });

      if (validWidgets.length === 0) {
        throw new Error('No valid widgets found in layout');
      }

      // Save the imported layout as a named layout
      const importedName = `${layoutData.name || 'Imported Layout'} (${new Date().toLocaleDateString()})`;
      this.saveNamedLayout(userId, importedName, validWidgets);

      return validWidgets;
    } catch (error) {
      console.error('Failed to import layout:', error);
      return null;
    }
  }

  // Clear all data for a user
  static clearUserData(userId: string): void {
    try {
      // Clear current layout
      const currentLayout = this.loadCurrentLayout(userId);
      if (currentLayout) {
        localStorage.removeItem(WIDGET_LAYOUT_KEY);
      }

      // Clear saved layouts
      const allLayouts: WidgetLayout[] = JSON.parse(
        localStorage.getItem(SAVED_LAYOUTS_KEY) || '[]'
      );
      const otherUserLayouts = allLayouts.filter(layout => layout.userId !== userId);
      localStorage.setItem(SAVED_LAYOUTS_KEY, JSON.stringify(otherUserLayouts));
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // Get storage usage statistics
  static getStorageStats(): {
    currentLayoutSize: number;
    savedLayoutsSize: number;
    totalSize: number;
    layoutCount: number;
  } {
    try {
      const currentLayoutData = localStorage.getItem(WIDGET_LAYOUT_KEY) || '';
      const savedLayoutsData = localStorage.getItem(SAVED_LAYOUTS_KEY) || '';
      const savedLayouts: WidgetLayout[] = JSON.parse(savedLayoutsData || '[]');

      return {
        currentLayoutSize: new Blob([currentLayoutData]).size,
        savedLayoutsSize: new Blob([savedLayoutsData]).size,
        totalSize: new Blob([currentLayoutData + savedLayoutsData]).size,
        layoutCount: savedLayouts.length,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        currentLayoutSize: 0,
        savedLayoutsSize: 0,
        totalSize: 0,
        layoutCount: 0,
      };
    }
  }
}