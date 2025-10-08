/**
 * Utility to check and display Supabase database contents
 * For debugging and verification purposes
 */

import { supabase } from '../lib/supabase';

export async function checkSupabaseWorkspaces() {
  try {
    console.log('🔍 Checking Supabase workspaces...');

    // Check workspaces table
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (workspacesError) {
      console.error('❌ Error fetching workspaces:', workspacesError);
      return {
        success: false,
        error: workspacesError.message,
        workspaces: [],
        boards: [],
        tasks: []
      };
    }

    console.log('✅ Workspaces found:', workspaces?.length || 0);
    console.table(workspaces);

    // Check boards table
    const { data: boards, error: boardsError } = await supabase
      .from('boards')
      .select('*, workspace:workspaces(name)')
      .order('created_at', { ascending: false });

    if (boardsError) {
      console.error('❌ Error fetching boards:', boardsError);
    } else {
      console.log('✅ Boards found:', boards?.length || 0);
      console.table(boards);
    }

    // Check tasks table
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*, board:boards(title)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (tasksError) {
      console.error('❌ Error fetching tasks:', tasksError);
    } else {
      console.log('✅ Recent tasks found:', tasks?.length || 0);
      console.table(tasks);
    }

    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('❌ Error getting current user:', userError);
    } else {
      console.log('👤 Current user:', user?.email || 'Not authenticated');
    }

    return {
      success: true,
      workspaces: workspaces || [],
      boards: boards || [],
      tasks: tasks || [],
      user
    };

  } catch (error) {
    console.error('❌ Error checking Supabase data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      workspaces: [],
      boards: [],
      tasks: []
    };
  }
}

export async function createMyCowWorkspaceIfMissing() {
  try {
    console.log('🚀 Checking if MyCow workspace exists...');

    // Check if MyCow Group workspace exists
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'MyCow Group')
      .single();

    if (existingWorkspace) {
      console.log('✅ MyCow Group workspace already exists:', existingWorkspace.id);
      return { success: true, workspace: existingWorkspace, created: false };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ No authenticated user found');
      return { success: false, error: 'User not authenticated' };
    }

    // Create workspace
    const { data: workspace, error: createError } = await supabase
      .from('workspaces')
      .insert({
        name: 'MyCow Group',
        description: 'COW project management and CRM workspace',
        created_by: user.id,
        settings: {
          demoData: true,
          createdAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating workspace:', createError);
      return { success: false, error: createError.message };
    }

    console.log('✅ Created MyCow Group workspace:', workspace.id);
    return { success: true, workspace, created: true };

  } catch (error) {
    console.error('❌ Error in workspace creation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Make functions globally accessible
(window as any).checkSupabaseWorkspaces = checkSupabaseWorkspaces;
(window as any).createMyCowWorkspaceIfMissing = createMyCowWorkspaceIfMissing;