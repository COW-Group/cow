// Schema Setup Script for MyCow Group Workspace Migration
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spnoztsuvgxrdmkeygdu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSchema() {
  try {
    console.log('🚀 Setting up MyCow Group workspace schema...');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'src', 'database', 'supabase-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Schema file loaded');
    console.log('⚠️  NOTE: The complete schema needs to be executed in Supabase dashboard SQL editor');
    console.log('   due to RPC and RLS policy limitations with the client library.');
    console.log('');
    console.log('📋 Instructions:');
    console.log('1. Go to https://app.supabase.com/project/spnoztsuvgxrdmkeygdu/sql/new');
    console.log('2. Copy the content from: src/database/supabase-schema.sql');
    console.log('3. Paste it in the SQL editor');
    console.log('4. Click "Run" to execute');
    console.log('');

    // Try to create just the workspace to test if tables exist
    console.log('🔍 Testing if schema is already set up...');

    const { data: workspaceCheck, error: checkError } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('name', 'MyCow Group')
      .single();

    if (checkError) {
      if (checkError.message.includes('relation "public.workspaces" does not exist')) {
        console.log('❌ Schema not set up. Please follow the instructions above.');
        return false;
      } else {
        console.log('❌ Error checking workspace:', checkError.message);
        return false;
      }
    }

    if (workspaceCheck) {
      console.log('✅ MyCow Group workspace already exists!');
      console.log('   Workspace ID:', workspaceCheck.id);
      return true;
    }

    console.log('❌ Schema exists but MyCow Group workspace not found.');
    console.log('   Please run the complete schema setup.');
    return false;

  } catch (error) {
    console.log('❌ Error setting up schema:', error.message);
    return false;
  }
}

async function main() {
  const success = await setupSchema();
  process.exit(success ? 0 : 1);
}

main();