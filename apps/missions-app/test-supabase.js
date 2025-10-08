// Quick test to check if workspaces table exists in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    // Test connection and check if workspaces table exists
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Workspaces table does not exist or access denied:', error.message);
      return false;
    }

    console.log('✅ Workspaces table exists!');
    console.log('Data:', data);
    return true;
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

testDatabase();