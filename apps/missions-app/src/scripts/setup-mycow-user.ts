/**
 * Setup script for likhitha@mycow.io user and MyCow workspace
 * This script sets up demo data for development and testing
 */

import { supabase } from '../lib/supabase';

interface MyCowUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface MyCowWorkspace {
  id: string;
  name: string;
  description: string;
  created_by: string;
}

interface MyCowBoard {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  created_by: string;
  monday_board_id?: string;
}

class MyCowUserSetup {
  private USER_ID: string | null = null;
  private readonly WORKSPACE_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  async setupMyCowUser(): Promise<void> {
    console.log('🚀 Setting up MyCow user: likhitha@mycow.io');

    try {
      // 1. Find the existing user by email
      this.USER_ID = await this.findExistingUser('likhitha@mycow.io');
      if (!this.USER_ID) {
        throw new Error('User likhitha@mycow.io not found in Supabase auth.users. Please ensure the user exists.');
      }
      console.log('✅ Found existing user:', this.USER_ID);

      // 2. Create MyCow Group workspace
      const workspace = await this.createMyCowWorkspace();
      console.log('✅ Created MyCow Group workspace:', workspace.name);

      // 3. Create sample boards from Monday.com
      const boards = await this.createMondayBoards(workspace.id);
      console.log(`✅ Created ${boards.length} boards from Monday.com data`);

      // 4. Create sample tasks and data
      await this.createSampleTasks(boards);
      console.log('✅ Created sample tasks and data');

      // 5. Set up board members
      await this.setupBoardMembers(boards);
      console.log('✅ Set up board members');

      console.log('🎉 MyCow user setup complete! User can now access workspace at /app/my-office');

    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  private async findExistingUser(email: string): Promise<string | null> {
    try {
      // Query Supabase Auth to find user by email
      // Note: This requires admin privileges or RLS policies that allow reading user data
      const { data: { users }, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('Error fetching users:', error);
        // Fallback: try to get current user if logged in
        const { data: { user } } = await supabase.auth.getUser();
        return user?.email === email ? user.id : null;
      }

      const user = users.find(u => u.email === email);
      return user?.id || null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  private async createMyCowWorkspace(): Promise<MyCowWorkspace> {
    const workspace: Omit<MyCowWorkspace, 'id'> & { id?: string } = {
      id: this.WORKSPACE_ID,
      name: 'MyCow Group',
      description: 'COW project management and CRM workspace - Migrated from Monday.com',
      created_by: this.USER_ID!
    };

    const { data, error } = await supabase
      .from('workspaces')
      .upsert(workspace)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async createMondayBoards(workspaceId: string): Promise<MyCowBoard[]> {
    const mondayBoards = [
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

    const boards: MyCowBoard[] = [];

    for (const boardData of mondayBoards) {
      const board = {
        workspace_id: workspaceId,
        title: boardData.title,
        description: boardData.description,
        created_by: this.USER_ID!,
        monday_board_id: boardData.monday_board_id,
        column_order: ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker'],
        available_columns: ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker']
      };

      const { data, error } = await supabase
        .from('boards')
        .upsert(board)
        .select()
        .single();

      if (error) throw error;
      boards.push(data);
    }

    return boards;
  }

  private async createSampleTasks(boards: MyCowBoard[]): Promise<void> {
    for (const board of boards) {
      // Create groups for each board
      const groups = await this.createBoardGroups(board.id);

      // Create tasks for each group
      for (const group of groups) {
        await this.createGroupTasks(board.id, group.id);
      }
    }
  }

  private async createBoardGroups(boardId: string) {
    const groupsData = [
      { title: 'In Progress', color: '#fdab3d', position: 1 },
      { title: 'Completed', color: '#00c875', position: 2 },
      { title: 'Stuck', color: '#e2445c', position: 3 },
      { title: 'New Tasks', color: '#579bfc', position: 0 }
    ];

    const groups = [];
    for (const groupData of groupsData) {
      const { data, error } = await supabase
        .from('board_groups')
        .upsert({
          board_id: boardId,
          ...groupData
        })
        .select()
        .single();

      if (error) throw error;
      groups.push(data);
    }

    return groups;
  }

  private async createGroupTasks(boardId: string, groupId: string): Promise<void> {
    const tasksData = [
      {
        title: 'Review Q4 project milestones',
        status: 'In Progress',
        priority: 'High',
        assignee_ids: [this.USER_ID!]
      },
      {
        title: 'Update client presentation materials',
        status: 'Not Started',
        priority: 'Medium',
        assignee_ids: [this.USER_ID!]
      },
      {
        title: 'Coordinate team meeting for next sprint',
        status: 'Completed',
        priority: 'Low',
        assignee_ids: [this.USER_ID!]
      }
    ];

    for (const taskData of tasksData) {
      const { error } = await supabase
        .from('tasks')
        .upsert({
          board_id: boardId,
          group_id: groupId,
          updated_by_user_id: this.USER_ID!,
          ...taskData
        });

      if (error) throw error;
    }
  }

  private async setupBoardMembers(boards: MyCowBoard[]): Promise<void> {
    for (const board of boards) {
      const { error } = await supabase
        .from('board_members')
        .upsert({
          board_id: board.id,
          user_id: this.USER_ID!,
          user_name: 'Likhitha',
          user_avatar: '',
          role: 'owner'
        });

      if (error) throw error;
    }
  }

  private async setupBoardLabels(boards: MyCowBoard[]): Promise<void> {
    const labels = [
      { title: 'High Priority', color: '#e2445c', type: 'priority' },
      { title: 'Client Work', color: '#579bfc', type: 'category' },
      { title: 'Internal', color: '#00c875', type: 'category' },
      { title: 'Urgent', color: '#fdab3d', type: 'priority' }
    ];

    for (const board of boards) {
      for (const label of labels) {
        const { error } = await supabase
          .from('board_labels')
          .upsert({
            board_id: board.id,
            ...label
          });

        if (error) throw error;
      }
    }
  }
}

// Export for use in development
export const setupMyCowUser = async () => {
  const setup = new MyCowUserSetup();
  await setup.setupMyCowUser();
};

// Run if executed directly
if (require.main === module) {
  setupMyCowUser()
    .then(() => {
      console.log('Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}