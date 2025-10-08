#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Debugging Supabase Data');
console.log('=========================\n');

// Read environment variables or use hardcoded fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   'https://spnoztsuvgxrdmkeygdu.supabase.co';

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ||
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

console.log(`📡 Connecting to: ${supabaseUrl}\n`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugData() {
  try {
    // 1. Check workspaces
    console.log('1️⃣ CHECKING WORKSPACES:');
    const { data: workspacesData, error: workspacesError } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: true });

    if (workspacesError) {
      console.error('❌ Workspaces error:', workspacesError);
    } else {
      console.log(`✅ Found ${workspacesData.length} workspaces:`);
      workspacesData.forEach(ws => {
        console.log(`   - ${ws.name} (ID: ${ws.id})`);
      });
    }

    console.log('\n2️⃣ CHECKING BOARDS:');
    const { data: boardsData, error: boardsError } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: true });

    if (boardsError) {
      console.error('❌ Boards error:', boardsError);
    } else {
      console.log(`✅ Found ${boardsData.length} boards:`);
      boardsData.forEach(board => {
        console.log(`   - ${board.title} (ID: ${board.id}, Workspace: ${board.workspace_id})`);
      });
    }

    console.log('\n3️⃣ CHECKING TASKS:');
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (tasksError) {
      console.error('❌ Tasks error:', tasksError);
    } else {
      console.log(`✅ Found ${tasksData.length} tasks:`);
      tasksData.forEach(task => {
        console.log(`   - ${task.title} (Board: ${task.board_id})`);
      });
    }

    console.log('\n4️⃣ ANALYZING WORKSPACE STRUCTURE:');
    if (workspacesData && boardsData) {
      workspacesData.forEach(ws => {
        console.log(`\n📁 Workspace: ${ws.name}`);
        const workspaceBoards = boardsData.filter(board => board.workspace_id === ws.id);
        console.log(`   Contains ${workspaceBoards.length} boards:`);

        workspaceBoards.forEach(board => {
          console.log(`   📋 ${board.title}`);
          console.log(`      - Monday ID: ${board.monday_board_id}`);
          console.log(`      - Created: ${board.created_at}`);
        });

        // Separate strategic vs department boards
        const strategicBoards = workspaceBoards.filter(board =>
          board.title.includes('Q1 Strategic') || board.monday_board_id === '8198396724'
        );
        const departmentBoards = workspaceBoards.filter(board =>
          !board.title.includes('Q1 Strategic') && board.monday_board_id !== '8198396724'
        );

        console.log(`   🎯 Strategic boards: ${strategicBoards.length}`);
        console.log(`   📁 Department boards (will become folders): ${departmentBoards.length}`);
      });
    }

  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

debugData();