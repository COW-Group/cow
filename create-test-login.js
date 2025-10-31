const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spnoztsuvgxrdmkeygdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('Creating test user: test@mycow.io with password: test123456');

  const { data, error } = await supabase.auth.signUp({
    email: 'test@mycow.io',
    password: 'test123456',
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✅ Test user created successfully!');
    console.log('Email: test@mycow.io');
    console.log('Password: test123456');
  }
}

createTestUser();
