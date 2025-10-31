// Test Supabase connection and query products
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test auth
    console.log('\n1. Testing auth connection...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Auth error:', sessionError);
    } else {
      console.log('✅ Auth connection successful');
      console.log('Session:', session ? 'Logged in' : 'Not logged in');
    }

    // Test sign in
    console.log('\n2. Testing sign in with test credentials...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'likhitha@mycow.io',
      password: 'test-password-here' // You'll need to provide the actual password
    });
    if (authError) {
      console.error('❌ Sign-in error:', authError.message);
    } else {
      console.log('✅ Sign-in successful');
    }

    // Test products query
    console.log('\n3. Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(10);

    if (productsError) {
      console.error('❌ Products query error:', productsError);
    } else {
      console.log('✅ Products query successful');
      console.log(`Found ${products.length} products:`);
      products.forEach(p => {
        console.log(`  - ${p.name} (${p.product_type}): $${p.price_usd}`);
      });
    }

    // Test profiles table
    console.log('\n4. Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .limit(5);

    if (profilesError) {
      console.error('❌ Profiles query error:', profilesError);
    } else {
      console.log('✅ Profiles query successful');
      console.log(`Found ${profiles.length} profiles`);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();
