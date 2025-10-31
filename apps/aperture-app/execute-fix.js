#!/usr/bin/env node
/**
 * Execute Teams RLS Fix using Supabase Management API
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Read SQL file
const sqlPath = path.join(__dirname, 'FIX_TEAMS_AND_STORAGE.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('🔧 Executing Teams RLS Fix...\n');

// Execute using supabase db execute (with stdin)
try {
  console.log('📤 Sending SQL to Supabase...');

  // Use echo and pipe to supabase CLI
  const result = execSync(
    `echo "${sql.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" | supabase db execute`,
    { stdio: 'pipe', encoding: 'utf8' }
  );

  console.log('✅ SQL executed successfully!');
  console.log(result);
} catch (error) {
  console.error('❌ Error executing SQL:', error.message);
  console.log('\n🔄 Alternative method - Manual execution:');
  console.log('\n1. Open: https://app.supabase.com/project/spnoztsuvgxrdmkeygdu/sql/new');
  console.log('2. Paste contents of: FIX_TEAMS_AND_STORAGE.sql');
  console.log('3. Click Run\n');
  process.exit(1);
}
