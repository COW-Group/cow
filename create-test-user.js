// Create a test user in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const testEmail = 'likhitha@mycow.io';
  const testPassword = 'Test123456!';  // Change this to your preferred password

  console.log('Creating test user...');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('');

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Likhitha'
      }
    }
  });

  if (error) {
    console.error('❌ Sign-up error:', error.message);

    // If user already exists, try to sign in
    if (error.message.includes('already registered')) {
      console.log('\\n⚠️  User already exists, trying to sign in...');

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (signInError) {
        console.error('❌ Sign-in error:', signInError.message);
        console.log('\\n💡 Try resetting the password in Supabase Dashboard:');
        console.log('   1. Go to Authentication → Users');
        console.log('   2. Find the user');
        console.log('   3. Click "..." → Send password recovery');
      } else {
        console.log('✅ Sign-in successful!');
        console.log('User ID:', signInData.user.id);

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          console.log('⚠️  No profile found, creating one...');

          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: signInData.user.id,
              email: testEmail,
              full_name: 'Likhitha',
              investor_type: 'individual',
              accreditation_verified: false,
              kyc_status: 'not_started',
              metadata: {}
            });

          if (insertError) {
            console.error('❌ Profile creation error:', insertError.message);
          } else {
            console.log('✅ Profile created successfully!');
          }
        } else if (profile) {
          console.log('✅ Profile exists:', profile.full_name);
        }
      }
    }
    return;
  }

  console.log('✅ User created successfully!');
  console.log('User ID:', data.user.id);
  console.log('Email:', data.user.email);

  // Create profile
  if (data.user) {
    console.log('\\nCreating profile...');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: testEmail,
        full_name: 'Likhitha',
        investor_type: 'individual',
        accreditation_verified: false,
        kyc_status: 'not_started',
        metadata: {}
      });

    if (profileError) {
      console.error('❌ Profile creation error:', profileError.message);
    } else {
      console.log('✅ Profile created successfully!');
    }
  }

  console.log('\\n📝 Use these credentials to sign in:');
  console.log('   Email:', testEmail);
  console.log('   Password:', testPassword);
}

createTestUser().catch(console.error);
