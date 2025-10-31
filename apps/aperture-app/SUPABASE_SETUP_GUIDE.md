# Supabase Setup Guide for MyCow Group Workspace Migration

## Current Status ✅
- **Database Connection**: Working
- **Environment Variables**: Configured
- **Schema Status**: ❌ Needs to be created
- **Workspace**: ❌ Not created yet

## Required Steps

### 1. Set Up Database Schema

**Method A: Supabase Dashboard (Recommended)**
1. Go to your Supabase dashboard: https://app.supabase.com/project/spnoztsuvgxrdmkeygdu/sql/new
2. Copy the entire content from: `src/database/supabase-schema.sql`
3. Paste it in the SQL editor
4. Click "Run" to execute the schema

**Method B: Alternative (if dashboard fails)**
The schema includes:
- All necessary tables (workspaces, boards, tasks, etc.)
- Indexes for performance
- RLS (Row Level Security) policies
- Triggers for auto-updating timestamps
- Default MyCow Group workspace

### 2. Verify Schema Setup

After running the schema, use the verification script:

```bash
node verify-schema.js
```

This will check:
- ✅ Database connection
- ✅ All tables exist
- ✅ MyCow Group workspace created
- ✅ Basic permissions working

### 3. Test Migration Service

Once schema is verified, test the workspace functionality:

```bash
node test-workspace.js
```

## Database Structure

### Core Tables
- `workspaces` - Main workspace container
- `boards` - Monday.com boards equivalent
- `board_groups` - Task groupings
- `tasks` - Individual tasks/items
- `task_comments` - Task discussions
- `board_activities` - Audit log
- `board_labels` - Status/priority options
- `board_members` - User access control
- `migration_logs` - Track migration progress

### Key Features
- **Full Monday.com compatibility** - Maps all Monday.com concepts
- **Real-time updates** - Supabase real-time subscriptions
- **Row Level Security** - Proper access control
- **Migration tracking** - Logs all migration activities
- **Performance optimized** - Proper indexes and constraints

## Environment Variables

Current configuration:
```
NEXT_PUBLIC_SUPABASE_URL=https://spnoztsuvgxrdmkeygdu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
```

## Next Steps After Schema Setup

1. **Test basic operations** - Create/read workspaces
2. **Set up Monday.com MCP integration** - Connect to Monday.com API
3. **Run migration script** - Transfer MyCow Group data
4. **Verify data integrity** - Check all data transferred correctly
5. **Update frontend** - Connect UI to Supabase backend

## Troubleshooting

### Common Issues

**"relation does not exist" error**
- Schema not run yet - follow Step 1 above

**"permission denied" error**
- RLS policies not set up correctly - re-run schema

**"workspace not found" error**
- Default workspace not created - check schema execution

### Getting Help

If you encounter issues:
1. Check the browser console in Supabase dashboard
2. Review the error messages in the verification script
3. Ensure the complete schema was executed without errors

## Files Overview

- `src/database/supabase-schema.sql` - Complete database schema
- `src/lib/supabase.ts` - Supabase client and TypeScript types
- `src/services/schema-setup.service.ts` - Schema management service
- `setup-schema.js` - Setup verification script
- `test-supabase.js` - Basic connection test