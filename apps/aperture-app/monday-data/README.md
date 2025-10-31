# Monday.com MyCow Group Data

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
