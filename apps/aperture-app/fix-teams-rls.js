/**
 * Fix Teams RLS Policies
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// We need the service role key for admin operations
// For now, we'll use the anon key and execute via the admin API

async function fixTeamsRLS() {
  console.log('🔧 Fixing Teams RLS policies...\n');

  // Read the SQL file
  const sqlPath = path.join(__dirname, 'FIX_TEAMS_AND_STORAGE.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('📋 SQL Script loaded');
  console.log('⚠️  NOTE: This requires Supabase service role key for admin operations');
  console.log('\n📝 To execute this SQL:');
  console.log('\n1. Open Supabase SQL Editor:');
  console.log(`   https://app.supabase.com/project/spnoztsuvgxrdmkeygdu/sql/new`);
  console.log('\n2. Copy and paste the entire contents of:');
  console.log(`   ${sqlPath}`);
  console.log('\n3. Click "Run"\n');

  // Alternative: Use psql if available
  console.log('OR use psql:');
  console.log(`   psql "postgresql://postgres:[YOUR-PASSWORD]@db.spnoztsuvgxrdmkeygdu.supabase.co:5432/postgres" -f FIX_TEAMS_AND_STORAGE.sql\n`);

  console.log('💡 Get your database password from:');
  console.log('   https://app.supabase.com/project/spnoztsuvgxrdmkeygdu/settings/database\n');
}

fixTeamsRLS();
