import { supabase } from '../lib/supabase';

/**
 * Schema Setup Service
 * Handles database schema initialization for the MyCow Group migration
 */
class SchemaSetupService {
  /**
   * Check if the schema is already set up
   */
  async isSchemaSetup(): Promise<boolean> {
    try {
      // Check if the workspaces table exists and has our MyCow Group workspace
      const { data, error } = await supabase
        .from('workspaces')
        .select('id, name')
        .eq('name', 'MyCow Group')
        .single();

      if (error && !error.message.includes('relation "workspaces" does not exist')) {
        console.error('Error checking schema:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Schema check failed:', error);
      return false;
    }
  }

  /**
   * Set up the complete database schema
   */
  async setupSchema(): Promise<{ success: boolean; error?: string }> {
    try {
      // This would typically be done via Supabase dashboard or migration files
      // For now, we'll just create the workspace if tables exist

      const { error: workspaceError } = await supabase
        .from('workspaces')
        .upsert({
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'MyCow Group',
          description: 'Migrated from Monday.com - COW project management and CRM workspace',
          created_by: '00000000-0000-0000-0000-000000000000', // Replace with actual admin user ID
          settings: {
            migratedFromMonday: true,
            migrationDate: new Date().toISOString(),
            originalWorkspace: 'MyCow Group'
          }
        }, {
          onConflict: 'id'
        });

      if (workspaceError) {
        return {
          success: false,
          error: `Failed to create workspace: ${workspaceError.message}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get schema setup instructions
   */
  getSchemaInstructions(): string {
    return `
To set up the database schema for MyCow Group migration:

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project: ${process.env.NEXT_PUBLIC_SUPABASE_URL}
3. Go to the SQL Editor
4. Copy and paste the contents of: src/database/supabase-schema.sql
5. Click "Run" to execute the schema

This will create all necessary tables, indexes, RLS policies, and the initial MyCow Group workspace.

After running the schema, you can use this migration tool to transfer your Monday.com data.
    `;
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('count(*)')
        .limit(1);

      if (error) {
        return {
          success: false,
          error: `Database connection failed: ${error.message}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
  }

  /**
   * Get database status info
   */
  async getDatabaseStatus() {
    const connectionTest = await this.testConnection();
    const schemaSetup = await this.isSchemaSetup();

    return {
      connected: connectionTest.success,
      schemaSetup,
      error: connectionTest.error,
      instructions: this.getSchemaInstructions()
    };
  }
}

export const schemaSetupService = new SchemaSetupService();
export default schemaSetupService;