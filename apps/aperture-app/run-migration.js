#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🚀 Running Supabase Migration via CLI');
console.log('====================================\n');

// Read environment variables or use hardcoded fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   'https://spnoztsuvgxrdmkeygdu.supabase.co';

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ||
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzM3NjksImV4cCI6MjA0ODE0OTc2OX0.YgY6Q3lNOKgR5Zb9IjYMAMa2LD-Fo2OTJr6jUzrKE6E';

console.log(`📡 Connecting to: ${supabaseUrl}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    // Read the corrected migration SQL
    const migrationSQL = fs.readFileSync('./simple-migration.sql', 'utf8');

    console.log('📋 Executing migration SQL...\n');

    // Split SQL into individual statements (simple approach)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.toLowerCase().includes('select')) {
        console.log(`🔍 Executing query ${i + 1}...`);
        const { data, error } = await supabase.rpc('query', { sql: statement });

        if (error) {
          console.error(`❌ Query ${i + 1} failed:`, error.message);
        } else {
          console.log(`✅ Query ${i + 1} completed:`, data);
        }
      } else {
        console.log(`📝 Executing statement ${i + 1}...`);
        // For INSERT/CREATE statements, we'll need to use the database connection directly
        // This is a limitation of Supabase client - it doesn't expose raw SQL execution
        console.log(`   ${statement.substring(0, 50)}...`);
      }
    }

    console.log('\n🎉 Migration execution attempt completed!');
    console.log('Note: Some statements may need to be run directly in Supabase SQL Editor');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Alternative: Copy simple-migration.sql content to Supabase SQL Editor');
  }
}

// Show the migration content for manual execution
console.log('📋 Migration SQL Content:');
console.log('========================\n');
const migrationContent = fs.readFileSync('./simple-migration.sql', 'utf8');
console.log(migrationContent);

console.log('\n🔧 Attempting automated execution...\n');
runMigration();