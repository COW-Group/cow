#!/usr/bin/env node

/**
 * Monday.com MCP Data Fetcher
 * Fetches comprehensive data from Monday.com MyCow Group workspace
 * Uses the official Monday.com MCP server for data access
 */

console.log('🚀 Monday.com MyCow Group Data Fetcher');
console.log('=====================================\n');

console.log('📋 Since you have Monday.com connected via MCP, please run these commands:');
console.log('');

// Workspace Overview
console.log('1️⃣ GET WORKSPACE OVERVIEW:');
console.log('Ask Claude: "Show me all workspaces I have access to on Monday.com with their IDs and details"');
console.log('');

// Sidebar Structure
console.log('2️⃣ GET SIDEBAR STRUCTURE:');
console.log('Ask Claude: "Show me the complete sidebar structure of my MyCow Group workspace including all folders, boards, dashboards, docs organized exactly as they appear in the navigation"');
console.log('');

// Boards Data
console.log('3️⃣ GET ALL BOARDS:');
console.log('Ask Claude: "List all boards in my MyCow Group workspace with their IDs, names, descriptions, and item counts formatted as JSON"');
console.log('');

// Detailed Board Content
console.log('4️⃣ GET BOARD DETAILS (run for each board):');
console.log('Ask Claude: "For board [BOARD_NAME] in MyCow Group, show me all groups, items, columns, assignees, due dates, statuses, and comments formatted as JSON"');
console.log('');

// Documents and Files
console.log('5️⃣ GET DOCUMENTS:');
console.log('Ask Claude: "Show me all documents, files, and attachments in my MyCow Group workspace with their locations and details"');
console.log('');

// Dashboards
console.log('6️⃣ GET DASHBOARDS:');
console.log('Ask Claude: "List all dashboards in my MyCow Group workspace with their configurations and widget details"');
console.log('');

// Team and Permissions
console.log('7️⃣ GET TEAM INFO:');
console.log('Ask Claude: "Show me all team members in MyCow Group workspace with their roles and permissions"');
console.log('');

// Automations
console.log('8️⃣ GET AUTOMATIONS:');
console.log('Ask Claude: "List all automations and workflows configured in my MyCow Group workspace"');
console.log('');

console.log('📝 INSTRUCTIONS:');
console.log('1. Run each command above with Claude');
console.log('2. Copy the JSON responses');
console.log('3. Save each response to a separate file:');
console.log('   - workspace-overview.json');
console.log('   - sidebar-structure.json');
console.log('   - boards-list.json');
console.log('   - board-[BOARD_NAME]-details.json (for each board)');
console.log('   - documents.json');
console.log('   - dashboards.json');
console.log('   - team-members.json');
console.log('   - automations.json');
console.log('');

console.log('4. Then run: node process-monday-data.js');
console.log('');

console.log('🔗 MCP Server URL: https://mcp.monday.com/sse');
console.log('📖 Documentation: https://github.com/mondaycom/mcp');
console.log('');

// Create data directory
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'monday-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log(`📁 Created directory: ${dataDir}`);
  console.log('💾 Save all JSON responses in this directory');
  console.log('');
}

// Create template files
const templates = {
  'README.md': `# Monday.com MyCow Group Data

## Fetched Data Files

1. **workspace-overview.json** - All workspaces and IDs
2. **sidebar-structure.json** - Complete navigation structure
3. **boards-list.json** - All boards with basic info
4. **board-[name]-details.json** - Detailed board data (one per board)
5. **documents.json** - All documents and files
6. **dashboards.json** - Dashboard configurations
7. **team-members.json** - Team members and permissions
8. **automations.json** - Workflows and automations

## Migration Process

1. Fetch data using the commands in fetch-monday-data.js
2. Save JSON responses to this directory
3. Run: node process-monday-data.js
4. Run: node migrate-to-supabase.js

## MCP Connection

- Server: https://mcp.monday.com/sse
- Documentation: https://github.com/mondaycom/mcp
`,

  'data-template.json': `{
  "instruction": "Replace this file with actual data from Claude MCP responses",
  "example_queries": [
    "Show me all workspaces I have access to on Monday.com",
    "List all boards in my MyCow Group workspace",
    "Show me detailed board data for [board-name]"
  ]
}`
};

Object.entries(templates).forEach(([filename, content]) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created template: ${filename}`);
});

console.log('');
console.log('✅ Setup complete! Start fetching data with the commands above.');