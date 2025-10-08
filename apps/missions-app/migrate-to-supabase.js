#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 MyCow Monday.com → Supabase Migration');
console.log('=====================================\n');

// Read all Monday.com data files
const dataDir = './monday-data';
const migrationData = {};

try {
  // Load all JSON files
  const files = [
    'workspace-overview.json',
    'sidebar-structure.json',
    'boards-list.json',
    'team-members.json',
    'documents.json',
    'board-8582178538-details.json', // Financial board
    'board-8198396724-details.json', // Strategic board
    'migration-summary.json'
  ];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const key = file.replace('.json', '').replace(/-/g, '_');
      migrationData[key] = data;
      console.log(`✅ Loaded ${file}`);
    } else {
      console.log(`⚠️  Missing ${file}`);
    }
  });

  console.log('\n📊 Processing Migration Data...\n');

  // 1. Process Workspace
  const workspaceArray = migrationData.workspace_overview || [];
  const workspace = workspaceArray.find(w => w.name === 'MyCow Group') || migrationData.migration_summary?.source_workspace;
  console.log('1️⃣ WORKSPACE SETUP:');
  console.log(`   Name: ${workspace.name}`);
  console.log(`   ID: ${workspace.id}`);
  console.log(`   Description: ${workspace.description}`);

  // 2. Process Users
  const users = migrationData.team_members?.users || [];
  console.log('\n2️⃣ USER MIGRATION:');
  console.log(`   Total users: ${users.length}`);

  const userInserts = users.map(user => ({
    id: user.user_id,
    email: user.email,
    full_name: user.name,
    role: user.role,
    is_admin: user.permissions.is_admin,
    timezone: user.access_details.timezone,
    last_activity: user.access_details.last_activity,
    monday_user_id: user.user_id
  }));

  // 3. Process Folders (Workspaces in our schema)
  const folders = migrationData.sidebar_structure?.folders || [];
  console.log('\n3️⃣ FOLDER STRUCTURE:');
  console.log(`   Total folders: ${folders.length}`);

  const workspaceInserts = folders.map((folder, index) => ({
    id: folder.id || `folder_${index}`,
    name: folder.title || folder.name,
    description: folder.description || `${folder.title} department`,
    owner_id: '82967988', // Likhitha's user ID
    monday_folder_id: folder.id,
    created_at: new Date().toISOString()
  }));

  // 4. Process Boards
  const boards = migrationData.boards_list?.boards || [];
  console.log('\n4️⃣ BOARD MIGRATION:');
  console.log(`   Total boards: ${boards.length}`);

  const boardInserts = boards.map(board => ({
    id: board.id,
    name: board.name,
    description: board.description || '',
    workspace_id: board.folder_id || 'main_workspace',
    owner_id: '82967988',
    monday_board_id: board.id,
    state: board.state || 'active',
    created_at: board.created_at || new Date().toISOString()
  }));

  // 5. Process detailed board data
  console.log('\n5️⃣ BOARD CONTENT:');

  // Financial board items
  const financialBoard = migrationData.board_8582178538_details;
  if (financialBoard) {
    console.log(`   Financial Board: ${financialBoard.items.length} items`);
  }

  // Strategic board items
  const strategicBoard = migrationData.board_8198396724_details;
  if (strategicBoard) {
    console.log(`   Strategic Board: ${strategicBoard.items.length} items`);
  }

  // Generate SQL for Supabase
  console.log('\n📝 GENERATING SUPABASE SQL...\n');

  let sql = `-- MyCow Monday.com Migration SQL
-- Generated: ${new Date().toISOString()}
-- Workspace: ${workspace.name}

-- Clear existing data (optional)
-- DELETE FROM tasks;
-- DELETE FROM boards;
-- DELETE FROM workspaces;

`;

  // Insert users to auth.users (Supabase managed)
  sql += `-- Note: Users will be managed through Supabase Auth
-- For reference, these are the Monday.com users:
-- ${userInserts.map(u => `${u.full_name} (${u.email}) - ${u.role}`).join('\n-- ')}

-- You'll need to invite these users through Supabase Auth Dashboard:
${userInserts.map(user => `-- ${user.email} (${user.full_name} - ${user.role})`).join('\n')}

`;

  // Insert workspaces (folders) - simplified with dummy user
  sql += `\n-- Insert Workspaces (Monday Folders)\n`;
  sql += `-- First create a dummy user for created_by field\n`;
  sql += `INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('82967988-0000-0000-0000-000000000000'::UUID, 'likhitha@mycow.io', crypt('dummy', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

`;

  workspaceInserts.slice(0, 5).forEach((workspace, index) => { // Limit to first 5
    const safeName = workspace.name.replace(/'/g, "''");
    const safeDesc = (workspace.description || `${workspace.name} department`).replace(/'/g, "''");
    sql += `INSERT INTO workspaces (name, description, created_by, created_at, updated_at)
VALUES ('${safeName}', '${safeDesc}', '82967988-0000-0000-0000-000000000000'::UUID, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = NOW();

`;
  });

  // Insert boards (Monday boards)
  sql += `\n-- Insert Boards (Monday Boards)\n`;
  boardInserts.slice(0, 5).forEach(board => { // Limit to first 5 boards
    const safeName = board.name.replace(/'/g, "''");
    const safeDesc = board.description.replace(/'/g, "''");
    // Use the first workspace ID as default, or create a UUID
    const workspaceId = workspaceInserts[0]?.id || 'uuid_generate_v4()';
    sql += `INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('${board.id}', '${workspaceId}', '${safeName}', '${safeDesc}', '${board.owner_id}', '${board.id}', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

`;
  });

  // Insert sample tasks (mission items)
  if (strategicBoard) {
    sql += `\n-- Insert Strategic Board Tasks\n`;
    strategicBoard.items.slice(0, 5).forEach(item => { // First 5 items
      const safeName = item.name.replace(/'/g, "''");
      const priority = item.column_values.phase || 1;

      sql += `INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('${item.id}', '${strategicBoard.board.id}', '${safeName}', 'Strategic Q1 objective', 'todo', ${priority}, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

`;
    });
  }

  // Save SQL file
  fs.writeFileSync('./migration.sql', sql);
  console.log('✅ Generated migration.sql');

  // Generate summary
  const summary = {
    migration_timestamp: new Date().toISOString(),
    source: 'Monday.com MyCow Group',
    target: 'Supabase',
    data_processed: {
      users: userInserts.length,
      workspaces: workspaceInserts.length,
      boards: boardInserts.length,
      total_items: (strategicBoard?.items.length || 0) + (financialBoard?.items.length || 0)
    },
    sql_file: 'migration.sql',
    next_steps: [
      '1. Review migration.sql file',
      '2. Run SQL in Supabase dashboard',
      '3. Verify data in tables',
      '4. Test application with migrated data'
    ]
  };

  fs.writeFileSync('./migration-results.json', JSON.stringify(summary, null, 2));

  console.log('\n🎉 MIGRATION PREPARATION COMPLETE!');
  console.log('==================================');
  console.log(`📊 Users to migrate: ${summary.data_processed.users}`);
  console.log(`📁 Workspaces to migrate: ${summary.data_processed.workspaces}`);
  console.log(`📋 Boards to migrate: ${summary.data_processed.boards}`);
  console.log(`📝 Items to migrate: ${summary.data_processed.total_items}`);
  console.log('\n📂 Files created:');
  console.log('   - migration.sql (Run this in Supabase)');
  console.log('   - migration-results.json (Summary)');
  console.log('\n🔥 Next: Run migration.sql in your Supabase dashboard!');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}