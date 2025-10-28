#!/usr/bin/env node

/**
 * Deploy Database Schema to Supabase
 * Executes SQL files against the remote Supabase database
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../COW-Products-Site/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.log('\nℹ️  You need the service role key (not the anon key) to run migrations.');
  console.log('   Find it at: https://supabase.com/dashboard/project/spnoztsuvgxrdmkeygdu/settings/api');
  console.log('   Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_service_key');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Executing: ${fileName}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');

    // Execute the SQL using Supabase's RPC to the database
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, we need to execute via REST API
      // Let's try a direct approach using fetch to the database
      throw new Error('Need to use alternative method - see below');
    }

    console.log(`✅ Successfully executed ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${fileName}:`, error.message);
    return false;
  }
}

async function deploy() {
  console.log('🚀 Starting database schema deployment...\n');
  console.log(`📍 Target: ${supabaseUrl}`);

  const schemaFile = path.join(__dirname, 'database/cow-investor-platform-schema.sql');
  const rolesFile = path.join(__dirname, 'database/migration-add-roles.sql');

  // Check if files exist
  if (!fs.existsSync(schemaFile)) {
    console.error(`❌ Schema file not found: ${schemaFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(rolesFile)) {
    console.error(`❌ Roles file not found: ${rolesFile}`);
    process.exit(1);
  }

  // Execute schema files
  console.log('\n📋 Deployment Plan:');
  console.log('  1. cow-investor-platform-schema.sql (18 tables + RLS)');
  console.log('  2. migration-add-roles.sql (role-based access)');
  console.log('\n⚠️  Note: This script requires manual execution via Supabase Dashboard');
  console.log('\nℹ️  Please follow these steps instead:');
  console.log('\n1. Open: https://supabase.com/dashboard/project/spnoztsuvgxrdmkeygdu/sql');
  console.log('2. Click "New query"');
  console.log('3. Copy and paste the content of: database/cow-investor-platform-schema.sql');
  console.log('4. Click "Run"');
  console.log('5. Repeat for: database/migration-add-roles.sql');
  console.log('\nOr copy to clipboard with:');
  console.log('  cat database/cow-investor-platform-schema.sql | pbcopy');
  console.log('  (then paste in Supabase SQL Editor)');
}

deploy().catch(console.error);
