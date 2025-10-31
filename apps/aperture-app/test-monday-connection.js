// Test Monday.com MCP Connection
const fetch = require('node-fetch');

// Configuration - these need to be set up
const MONDAY_API_TOKEN = process.env.REACT_APP_MONDAY_API_TOKEN || '';
const MONDAY_MCP_ENDPOINT = process.env.REACT_APP_MONDAY_MCP_ENDPOINT || 'http://localhost:8080/mcp/monday';

// Test query to check connection
const TEST_QUERY = `
  query {
    me {
      id
      name
      email
    }
  }
`;

async function testMondayConnection() {
  console.log('🔍 Testing Monday.com MCP connection...\n');

  // Check environment variables
  console.log('📋 Configuration check:');
  console.log(`   MCP Endpoint: ${MONDAY_MCP_ENDPOINT}`);
  console.log(`   API Token: ${MONDAY_API_TOKEN ? '***configured***' : '❌ NOT SET'}`);
  console.log('');

  if (!MONDAY_API_TOKEN) {
    console.log('❌ Monday.com API token not configured!');
    console.log('');
    console.log('🔧 Required environment variables:');
    console.log('   REACT_APP_MONDAY_API_TOKEN=your-monday-api-token');
    console.log('   REACT_APP_MONDAY_MCP_ENDPOINT=http://localhost:8080/mcp/monday (optional)');
    console.log('   REACT_APP_MONDAY_WORKSPACE_ID=your-workspace-id (optional)');
    console.log('');
    console.log('📖 How to get Monday.com API token:');
    console.log('   1. Go to your Monday.com account');
    console.log('   2. Click your profile picture → Admin');
    console.log('   3. Go to API section');
    console.log('   4. Generate a new API token');
    console.log('   5. Copy the token and add to .env.local');
    return false;
  }

  try {
    console.log('🌐 Testing Monday.com API connection...');

    // Try direct Monday.com API first (without MCP)
    const directApiResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify({
        query: TEST_QUERY
      })
    });

    if (!directApiResponse.ok) {
      throw new Error(`Monday.com API error: ${directApiResponse.statusText}`);
    }

    const directApiData = await directApiResponse.json();

    if (directApiData.errors) {
      throw new Error(`Monday.com API errors: ${JSON.stringify(directApiData.errors)}`);
    }

    console.log('✅ Monday.com API connection successful!');
    console.log(`   User: ${directApiData.data.me.name} (${directApiData.data.me.email})`);
    console.log(`   User ID: ${directApiData.data.me.id}`);
    console.log('');

    // Now test workspace access
    console.log('🏢 Testing workspace access...');
    const workspaceQuery = `
      query {
        boards(limit: 5) {
          id
          name
          workspace {
            id
            name
          }
        }
      }
    `;

    const workspaceResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify({
        query: workspaceQuery
      })
    });

    const workspaceData = await workspaceResponse.json();

    if (workspaceData.errors) {
      console.log('❌ Workspace access error:', workspaceData.errors);
      return false;
    }

    console.log('✅ Workspace access successful!');
    console.log(`   Found ${workspaceData.data.boards.length} boards`);

    // Check for MyCow Group workspace
    const mycowBoards = workspaceData.data.boards.filter(board =>
      board.workspace && board.workspace.name &&
      board.workspace.name.toLowerCase().includes('mycow')
    );

    if (mycowBoards.length > 0) {
      console.log('🎯 Found MyCow workspace:');
      mycowBoards.forEach(board => {
        console.log(`   - ${board.name} (Workspace: ${board.workspace.name})`);
      });
    } else {
      console.log('⚠️  No MyCow workspace found in accessible boards');
      console.log('   Available workspaces:');
      const workspaces = [...new Set(workspaceData.data.boards
        .filter(board => board.workspace)
        .map(board => board.workspace.name))];
      workspaces.forEach(ws => console.log(`   - ${ws}`));
    }

    console.log('');

    // Test MCP endpoint if configured
    if (MONDAY_MCP_ENDPOINT && MONDAY_MCP_ENDPOINT !== 'http://localhost:8080/mcp/monday') {
      console.log('🔌 Testing MCP endpoint...');
      try {
        const mcpResponse = await fetch(MONDAY_MCP_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MONDAY_API_TOKEN}`
          },
          body: JSON.stringify({
            query: TEST_QUERY
          })
        });

        if (mcpResponse.ok) {
          console.log('✅ MCP endpoint accessible');
        } else {
          console.log('⚠️  MCP endpoint not accessible (this is optional)');
        }
      } catch (mcpError) {
        console.log('⚠️  MCP endpoint not accessible (this is optional)');
      }
    } else {
      console.log('⚠️  MCP endpoint not configured (using direct API)');
    }

    console.log('');
    console.log('🎉 Monday.com connection test completed!');
    console.log('✅ Ready to proceed with migration');
    return true;

  } catch (error) {
    console.log('❌ Monday.com connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if your API token is valid');
    console.log('   2. Ensure you have access to the MyCow Group workspace');
    console.log('   3. Verify your Monday.com account permissions');
    return false;
  }
}

// Run the test
testMondayConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });