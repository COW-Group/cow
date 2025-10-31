/**
 * Check if all required Supabase tables exist
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requiredTables = [
  'profiles',
  'organizations',
  'organization_members',
  'user_roles',
  'teams',
  'team_members',
  'workspaces',
  'boards',
  'board_groups',
  'tasks',
  'task_comments',
  'board_activities',
  'board_labels',
  'board_members',
  'platform_settings',
  'ecosystem_apps',
  'migration_logs'
];

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');
  console.log(`📍 Project: ${supabaseUrl}\n`);

  const results = {
    existing: [],
    missing: []
  };

  for (const tableName of requiredTables) {
    try {
      // Try to query the table (limit 0 to just check existence)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.log(`❌ ${tableName} - Missing`);
          results.missing.push(tableName);
        } else {
          console.log(`⚠️  ${tableName} - Error: ${error.message}`);
          results.missing.push(tableName);
        }
      } else {
        console.log(`✅ ${tableName} - Exists`);
        results.existing.push(tableName);
      }
    } catch (err) {
      console.log(`❌ ${tableName} - Error: ${err.message}`);
      results.missing.push(tableName);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Existing tables: ${results.existing.length}/${requiredTables.length}`);
  console.log(`   ❌ Missing tables: ${results.missing.length}/${requiredTables.length}`);

  if (results.missing.length > 0) {
    console.log(`\n⚠️  Missing tables:\n   - ${results.missing.join('\n   - ')}`);
    console.log(`\n📝 To create missing tables, run:`);
    console.log(`   1. Go to Supabase Dashboard: ${supabaseUrl.replace('//', '//app.')}/sql`);
    console.log(`   2. Run: /Users/likhitha/Projects/cow/apps/missions-app/FINAL_COMPLETE_MIGRATION.sql`);
  } else {
    console.log(`\n✨ All required tables exist!`);
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

checkTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
