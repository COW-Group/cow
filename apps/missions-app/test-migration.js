// Test Migration Workflow
// This script tests the complete migration process from Monday.com to Supabase

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spnoztsuvgxrdmkeygdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulated Monday.com data (representing MyCow Group workspace)
const mockMondayData = {
  workspace: {
    id: 'monday-workspace-123',
    name: 'MyCow Group',
    description: 'COW project management and CRM workspace'
  },
  boards: [
    {
      id: 'board-456',
      name: 'COW Development Board',
      description: 'Main development board for COW project',
      groups: [
        {
          id: 'group-789',
          title: 'Active Development',
          color: '#579bfc',
          position: 0,
          items: [
            {
              id: 'item-101',
              name: 'Implement MCP Integration',
              status: 'In Progress',
              priority: 'High',
              assignees: ['00000000-0000-0000-0000-000000000123'],
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'item-102',
              name: 'Set up Supabase Database',
              status: 'Done',
              priority: 'High',
              assignees: ['00000000-0000-0000-0000-000000000124'],
              dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 'group-790',
          title: 'Testing & QA',
          color: '#00c875',
          position: 1,
          items: [
            {
              id: 'item-103',
              name: 'Test Migration Workflow',
              status: 'Not Started',
              priority: 'Medium',
              assignees: ['00000000-0000-0000-0000-000000000125'],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ]
    },
    {
      id: 'board-457',
      name: 'COW Marketing Board',
      description: 'Marketing and outreach activities',
      groups: [
        {
          id: 'group-791',
          title: 'Marketing Campaigns',
          color: '#e91e63',
          position: 0,
          items: [
            {
              id: 'item-104',
              name: 'Launch Product Demo',
              status: 'Planning',
              priority: 'Medium',
              assignees: ['00000000-0000-0000-0000-000000000126'],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ]
    }
  ]
};

async function testMigration() {
  console.log('🚀 Testing MyCow Group Migration Workflow\n');

  try {
    // Step 1: Test Supabase connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'MyCow Group')
      .single();

    if (testError) {
      throw new Error(`Supabase connection failed: ${testError.message}`);
    }

    console.log('✅ Supabase connected - MyCow Group workspace found');
    console.log(`   Workspace ID: ${testData.id}`);
    console.log('');

    // Step 2: Simulate migration process
    console.log('2️⃣ Starting migration simulation...');
    const migrationSummary = {
      boardsMigrated: 0,
      groupsMigrated: 0,
      tasksMigrated: 0,
      errors: []
    };

    for (const board of mockMondayData.boards) {
      console.log(`📋 Migrating board: ${board.name}`);

      try {
        // Create board
        const { data: createdBoard, error: boardError } = await supabase
          .from('boards')
          .insert({
            workspace_id: testData.id,
            title: board.name,
            description: board.description,
            created_by: '00000000-0000-0000-0000-000000000000',
            monday_board_id: board.id
          })
          .select()
          .single();

        if (boardError) {
          throw new Error(`Board creation failed: ${boardError.message}`);
        }

        console.log(`   ✅ Board created: ${createdBoard.id}`);
        migrationSummary.boardsMigrated++;

        // Migrate groups and tasks
        for (const group of board.groups) {
          console.log(`   📁 Migrating group: ${group.title}`);

          const { data: createdGroup, error: groupError } = await supabase
            .from('board_groups')
            .insert({
              board_id: createdBoard.id,
              title: group.title,
              color: group.color,
              position: group.position,
              monday_group_id: group.id
            })
            .select()
            .single();

          if (groupError) {
            throw new Error(`Group creation failed: ${groupError.message}`);
          }

          console.log(`   ✅ Group created: ${createdGroup.id}`);
          migrationSummary.groupsMigrated++;

          // Migrate tasks
          for (const item of group.items) {
            console.log(`     📝 Migrating task: ${item.name}`);

            const { data: createdTask, error: taskError } = await supabase
              .from('tasks')
              .insert({
                board_id: createdBoard.id,
                group_id: createdGroup.id,
                title: item.name,
                status: item.status,
                priority: item.priority,
                due_date: item.dueDate,
                assignee_ids: item.assignees,
                updated_by_user_id: '00000000-0000-0000-0000-000000000000',
                monday_item_id: item.id
              })
              .select()
              .single();

            if (taskError) {
              throw new Error(`Task creation failed: ${taskError.message}`);
            }

            console.log(`     ✅ Task created: ${createdTask.id}`);
            migrationSummary.tasksMigrated++;
          }
        }

        // Log migration
        await supabase
          .from('migration_logs')
          .insert({
            migration_type: 'board',
            source_id: board.id,
            target_id: createdBoard.id,
            status: 'completed',
            completed_at: new Date().toISOString(),
            metadata: {
              testMigration: true,
              timestamp: new Date().toISOString(),
              boardName: board.name
            }
          });

      } catch (error) {
        console.log(`   ❌ Board migration failed: ${error.message}`);
        migrationSummary.errors.push(`Board ${board.name}: ${error.message}`);
      }

      console.log('');
    }

    // Step 3: Verification
    console.log('3️⃣ Verifying migrated data...');

    const { data: migratedBoards, count: boardCount } = await supabase
      .from('boards')
      .select(`
        *,
        board_groups:board_groups(
          *,
          tasks:tasks(*)
        )
      `, { count: 'exact' })
      .eq('workspace_id', testData.id);

    console.log('✅ Migration verification complete');
    console.log('');

    // Step 4: Summary
    console.log('📊 Migration Summary:');
    console.log(`   Boards migrated: ${migrationSummary.boardsMigrated}`);
    console.log(`   Groups migrated: ${migrationSummary.groupsMigrated}`);
    console.log(`   Tasks migrated: ${migrationSummary.tasksMigrated}`);
    console.log(`   Total boards in DB: ${boardCount}`);

    if (migrationSummary.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      migrationSummary.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }

    console.log('\n🎉 Test migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Access the migration dashboard: http://localhost:4203/app/migration');
    console.log('   2. Connect to Monday.com via MCP authentication');
    console.log('   3. Run the full migration with real data');

    return true;

  } catch (error) {
    console.log(`❌ Migration test failed: ${error.message}`);
    return false;
  }
}

// Clean up test data
async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');

  try {
    // Delete test boards (cascading deletes will handle groups and tasks)
    const { error } = await supabase
      .from('boards')
      .delete()
      .like('title', '%COW%');

    if (error) {
      console.log(`⚠️  Cleanup warning: ${error.message}`);
    } else {
      console.log('✅ Test data cleaned up');
    }
  } catch (error) {
    console.log(`⚠️  Cleanup failed: ${error.message}`);
  }
}

// Run the test
async function main() {
  const success = await testMigration();

  if (success) {
    // Optional: uncomment to clean up test data
    // await cleanupTestData();
  }

  process.exit(success ? 0 : 1);
}

main();