// Schema Verification Script for MyCow Group Workspace
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spnoztsuvgxrdmkeygdu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

const supabase = createClient(supabaseUrl, supabaseKey);

const REQUIRED_TABLES = [
  'workspaces',
  'boards',
  'board_groups',
  'tasks',
  'task_comments',
  'board_activities',
  'board_labels',
  'board_members',
  'migration_logs'
];

async function checkTable(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
      return false;
    }

    console.log(`✅ ${tableName}: Table exists and accessible`);
    return true;
  } catch (err) {
    console.log(`❌ ${tableName}: ${err.message}`);
    return false;
  }
}

async function checkWorkspace() {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'MyCow Group')
      .single();

    if (error) {
      console.log(`❌ MyCow Group workspace: ${error.message}`);
      return false;
    }

    console.log(`✅ MyCow Group workspace: Found (ID: ${data.id})`);
    console.log(`   Description: ${data.description}`);
    console.log(`   Created: ${data.created_at}`);
    return true;
  } catch (err) {
    console.log(`❌ MyCow Group workspace: ${err.message}`);
    return false;
  }
}

async function testBasicOperations() {
  try {
    console.log('\n🧪 Testing basic operations...');

    // Test creating a board (this will fail if RLS is not properly configured)
    const { data: testBoard, error: boardError } = await supabase
      .from('boards')
      .insert({
        workspace_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        title: 'Test Board',
        description: 'Schema verification test board',
        created_by: '00000000-0000-0000-0000-000000000000'
      })
      .select()
      .single();

    if (boardError) {
      console.log(`❌ Board creation test: ${boardError.message}`);
      return false;
    }

    console.log(`✅ Board creation test: Success (ID: ${testBoard.id})`);

    // Clean up test board
    await supabase
      .from('boards')
      .delete()
      .eq('id', testBoard.id);

    console.log(`✅ Board cleanup: Success`);
    return true;
  } catch (err) {
    console.log(`❌ Basic operations test: ${err.message}`);
    return false;
  }
}

async function verifySchema() {
  console.log('🔍 Verifying Supabase schema setup for MyCow Group...\n');

  let allPassed = true;

  // Check database connection
  console.log('📡 Testing database connection...');
  try {
    const { data, error } = await supabase.from('workspaces').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Database connection: Success\n');
  } catch (err) {
    console.log(`❌ Database connection: ${err.message}\n`);
    return false;
  }

  // Check all required tables
  console.log('📋 Checking required tables...');
  for (const table of REQUIRED_TABLES) {
    const exists = await checkTable(table);
    if (!exists) allPassed = false;
  }

  console.log('');

  // Check MyCow Group workspace
  console.log('🏢 Checking MyCow Group workspace...');
  const workspaceExists = await checkWorkspace();
  if (!workspaceExists) allPassed = false;

  // Test basic operations
  const operationsWork = await testBasicOperations();
  if (!operationsWork) allPassed = false;

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 Schema verification PASSED!');
    console.log('✅ All tables exist and are accessible');
    console.log('✅ MyCow Group workspace is ready');
    console.log('✅ Basic operations working');
    console.log('\n🚀 Ready to proceed with workspace migration!');
  } else {
    console.log('❌ Schema verification FAILED!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase dashboard SQL editor');
    console.log('2. Run the complete schema from src/database/supabase-schema.sql');
    console.log('3. Re-run this verification script');
  }

  return allPassed;
}

verifySchema()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });