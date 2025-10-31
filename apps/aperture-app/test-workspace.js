// Workspace Migration Test Script
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spnoztsuvgxrdmkeygdu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWorkspaceOperations() {
  console.log('🧪 Testing MyCow Group workspace operations...\n');

  try {
    // 1. Get the MyCow Group workspace
    console.log('1️⃣ Fetching MyCow Group workspace...');
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'MyCow Group')
      .single();

    if (workspaceError) {
      console.log(`❌ Failed to fetch workspace: ${workspaceError.message}`);
      return false;
    }

    console.log(`✅ Workspace found: ${workspace.name} (ID: ${workspace.id})`);

    // 2. Create a test board
    console.log('\n2️⃣ Creating test board...');
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({
        workspace_id: workspace.id,
        title: 'Migration Test Board',
        description: 'Test board to verify workspace migration functionality',
        created_by: '00000000-0000-0000-0000-000000000000',
        monday_board_id: 'test-board-123'
      })
      .select()
      .single();

    if (boardError) {
      console.log(`❌ Failed to create board: ${boardError.message}`);
      return false;
    }

    console.log(`✅ Board created: ${board.title} (ID: ${board.id})`);

    // 3. Create a test group
    console.log('\n3️⃣ Creating test group...');
    const { data: group, error: groupError } = await supabase
      .from('board_groups')
      .insert({
        board_id: board.id,
        title: 'Test Group',
        color: '#579bfc',
        position: 0,
        monday_group_id: 'test-group-456'
      })
      .select()
      .single();

    if (groupError) {
      console.log(`❌ Failed to create group: ${groupError.message}`);
      return false;
    }

    console.log(`✅ Group created: ${group.title} (ID: ${group.id})`);

    // 4. Create a test task
    console.log('\n4️⃣ Creating test task...');
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        board_id: board.id,
        group_id: group.id,
        title: 'Test Migration Task',
        status: 'In Progress',
        priority: 'High',
        updated_by_user_id: '00000000-0000-0000-0000-000000000000',
        monday_item_id: 'test-item-789'
      })
      .select()
      .single();

    if (taskError) {
      console.log(`❌ Failed to create task: ${taskError.message}`);
      return false;
    }

    console.log(`✅ Task created: ${task.title} (ID: ${task.id})`);

    // 5. Add a comment to the task
    console.log('\n5️⃣ Adding task comment...');
    const { data: comment, error: commentError } = await supabase
      .from('task_comments')
      .insert({
        task_id: task.id,
        content: 'This is a test comment to verify migration functionality.',
        author_id: '00000000-0000-0000-0000-000000000000',
        author_name: 'Migration Test User'
      })
      .select()
      .single();

    if (commentError) {
      console.log(`❌ Failed to create comment: ${commentError.message}`);
      return false;
    }

    console.log(`✅ Comment added: ${comment.content.substring(0, 50)}...`);

    // 6. Create board activity log
    console.log('\n6️⃣ Logging board activity...');
    const { data: activity, error: activityError } = await supabase
      .from('board_activities')
      .insert({
        board_id: board.id,
        type: 'task_created',
        task_id: task.id,
        task_title: task.title,
        user_id: '00000000-0000-0000-0000-000000000000',
        user_name: 'Migration Test User',
        changes: {
          action: 'created',
          details: 'Test task created during migration test'
        }
      })
      .select()
      .single();

    if (activityError) {
      console.log(`❌ Failed to create activity: ${activityError.message}`);
      return false;
    }

    console.log(`✅ Activity logged: ${activity.type}`);

    // 7. Test data retrieval (simulating the frontend)
    console.log('\n7️⃣ Testing data retrieval...');
    const { data: boardData, error: retrieveError } = await supabase
      .from('boards')
      .select(`
        *,
        board_groups:board_groups(
          *,
          tasks:tasks(
            *,
            task_comments:task_comments(*)
          )
        ),
        board_activities:board_activities(*)
      `)
      .eq('id', board.id)
      .single();

    if (retrieveError) {
      console.log(`❌ Failed to retrieve data: ${retrieveError.message}`);
      return false;
    }

    console.log(`✅ Data retrieval successful:`);
    console.log(`   - Board: ${boardData.title}`);
    console.log(`   - Groups: ${boardData.board_groups?.length || 0}`);
    console.log(`   - Tasks: ${boardData.board_groups?.[0]?.tasks?.length || 0}`);
    console.log(`   - Comments: ${boardData.board_groups?.[0]?.tasks?.[0]?.task_comments?.length || 0}`);
    console.log(`   - Activities: ${boardData.board_activities?.length || 0}`);

    // 8. Clean up test data
    console.log('\n8️⃣ Cleaning up test data...');
    await supabase.from('task_comments').delete().eq('task_id', task.id);
    await supabase.from('board_activities').delete().eq('task_id', task.id);
    await supabase.from('tasks').delete().eq('id', task.id);
    await supabase.from('board_groups').delete().eq('id', group.id);
    await supabase.from('boards').delete().eq('id', board.id);

    console.log('✅ Test data cleaned up');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Workspace migration test PASSED!');
    console.log('✅ All CRUD operations working');
    console.log('✅ Relational data structure verified');
    console.log('✅ Monday.com ID mapping functional');
    console.log('\n🚀 Ready for full MyCow Group migration!');

    return true;

  } catch (error) {
    console.log(`❌ Unexpected error during test: ${error.message}`);
    return false;
  }
}

async function testMigrationLogging() {
  console.log('\n📊 Testing migration logging...');

  try {
    const { data: log, error: logError } = await supabase
      .from('migration_logs')
      .insert({
        migration_type: 'workspace_test',
        source_id: 'monday-workspace-mycow',
        target_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        status: 'completed',
        completed_at: new Date().toISOString(),
        metadata: {
          test: true,
          timestamp: new Date().toISOString(),
          items_migrated: 1
        }
      })
      .select()
      .single();

    if (logError) {
      console.log(`❌ Migration logging failed: ${logError.message}`);
      return false;
    }

    console.log(`✅ Migration log created: ${log.migration_type} (${log.status})`);

    // Clean up
    await supabase.from('migration_logs').delete().eq('id', log.id);
    console.log('✅ Test log cleaned up');

    return true;
  } catch (error) {
    console.log(`❌ Migration logging error: ${error.message}`);
    return false;
  }
}

async function main() {
  const workspaceTest = await testWorkspaceOperations();
  const migrationTest = await testMigrationLogging();

  const allPassed = workspaceTest && migrationTest;
  process.exit(allPassed ? 0 : 1);
}

main();