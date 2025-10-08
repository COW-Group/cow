/**
 * Demo Data Setup Utility
 * Sets up MyCow workspace with sample data for likhitha@mycow.io
 * Can be run from browser console or triggered from UI
 */

import { supabase } from '../lib/supabase';

interface SetupResult {
  success: boolean;
  message: string;
  workspaceId?: string;
  boardsCreated?: number;
  tasksCreated?: number;
}

export async function setupMyCowDemoData(): Promise<SetupResult> {
  try {
    console.log('🚀 Setting up MyCow demo data...');

    // Step 1: Get current user (assuming likhitha@mycow.io is logged in)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: 'No authenticated user found. Please log in as likhitha@mycow.io first.'
      };
    }

    console.log('✅ Found authenticated user:', user.email);

    // Step 2: Create MyCow Group workspace
    const workspaceId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .upsert({
        id: workspaceId,
        name: 'MyCow Group',
        description: 'COW project management and CRM workspace - Demo data from Monday.com',
        created_by: user.id,
        settings: {
          migratedFromMonday: true,
          demoData: true,
          setupDate: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Workspace error:', workspaceError);
      return {
        success: false,
        message: `Failed to create workspace: ${workspaceError.message}`
      };
    }

    console.log('✅ Created workspace:', workspace.name);

    // Step 3: Create sample boards
    const boards = [
      {
        title: 'COW Project Management',
        description: 'Main project tracking board for COW initiatives',
        monday_board_id: 'board_001'
      },
      {
        title: 'CRM & Client Management',
        description: 'Customer relationship management and client projects',
        monday_board_id: 'board_002'
      },
      {
        title: 'Team Tasks & Operations',
        description: 'Daily operations and team task management',
        monday_board_id: 'board_003'
      },
      {
        title: 'Marketing & Content',
        description: 'Marketing campaigns and content creation tracking',
        monday_board_id: 'board_004'
      }
    ];

    let boardsCreated = 0;
    let tasksCreated = 0;

    for (const boardData of boards) {
      // Create board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .upsert({
          workspace_id: workspaceId,
          title: boardData.title,
          description: boardData.description,
          created_by: user.id,
          monday_board_id: boardData.monday_board_id,
          column_order: ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker'],
          available_columns: ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker']
        })
        .select()
        .single();

      if (boardError) {
        console.error('Board error:', boardError);
        continue;
      }

      boardsCreated++;
      console.log(`✅ Created board: ${board.title}`);

      // Create groups for each board
      const groups = [
        { title: 'New Tasks', color: '#579bfc', position: 0 },
        { title: 'In Progress', color: '#fdab3d', position: 1 },
        { title: 'Completed', color: '#00c875', position: 2 },
        { title: 'Stuck', color: '#e2445c', position: 3 }
      ];

      for (const groupData of groups) {
        const { data: group, error: groupError } = await supabase
          .from('board_groups')
          .upsert({
            board_id: board.id,
            ...groupData
          })
          .select()
          .single();

        if (groupError) {
          console.error('Group error:', groupError);
          continue;
        }

        // Create sample tasks for each group
        const sampleTasks = [
          {
            title: `Review ${boardData.title.toLowerCase()} milestones`,
            status: 'In Progress',
            priority: 'High',
            assignee_ids: [user.id]
          },
          {
            title: `Update ${boardData.title.toLowerCase()} documentation`,
            status: 'Not Started',
            priority: 'Medium',
            assignee_ids: [user.id]
          },
          {
            title: `Coordinate team meeting for ${boardData.title.toLowerCase()}`,
            status: 'Completed',
            priority: 'Low',
            assignee_ids: [user.id]
          }
        ];

        for (const taskData of sampleTasks.slice(0, 1)) { // Just one task per group to keep it simple
          const { error: taskError } = await supabase
            .from('tasks')
            .upsert({
              board_id: board.id,
              group_id: group.id,
              updated_by_user_id: user.id,
              ...taskData
            });

          if (!taskError) {
            tasksCreated++;
          }
        }
      }

      // Add board member
      await supabase
        .from('board_members')
        .upsert({
          board_id: board.id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_avatar: user.user_metadata?.avatar_url || '',
          role: 'owner'
        });
    }

    console.log('🎉 Demo data setup completed!');

    return {
      success: true,
      message: `Successfully set up MyCow workspace with ${boardsCreated} boards and ${tasksCreated} tasks. Navigate to /app/my-office to see your workspace!`,
      workspaceId,
      boardsCreated,
      tasksCreated
    };

  } catch (error) {
    console.error('❌ Setup failed:', error);
    return {
      success: false,
      message: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Make it globally accessible for browser console
(window as any).setupMyCowDemoData = setupMyCowDemoData;