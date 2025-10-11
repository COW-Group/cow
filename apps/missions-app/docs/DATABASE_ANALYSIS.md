# Database Analysis & Integration Strategy

**Date**: 2025-10-09
**Purpose**: Document existing Supabase patterns across the monorepo and recommend integration strategy for missions-app

---

## Executive Summary

This analysis examines the existing Supabase database implementation in **mauna-app** (wellness/habit tracking) and **missions-app** (project/board management) to:
1. Understand proven patterns that work in production (mauna-app)
2. Identify how to wire missions-app's board service to Supabase
3. Establish a strategy for company/project-oriented features across both apps
4. Recommend shared infrastructure packages

**Key Finding**: Mauna-app already has `projects`, `companies`, and `teams` tables! These can serve as the foundation for multi-tenant features across the entire monorepo.

---

## Table of Contents

1. [Existing Database Schema](#existing-database-schema)
2. [Mauna-App Patterns (Production-Ready)](#mauna-app-patterns-production-ready)
3. [Missions-App Current State](#missions-app-current-state)
4. [Cross-App Integration Strategy](#cross-app-integration-strategy)
5. [Company/Project-Oriented Features](#companyproject-oriented-features)
6. [Recommendations](#recommendations)

---

## Existing Database Schema

### Mauna-App Tables (Personal Wellness + Projects)

**Personal Wellness Hierarchy** (user_id scoped):
```
ranges (vision board sections)
  └── mountains (major goals)
      └── hills (sub-goals)
          └── terrains (milestones)
              └── lengths (tasks)
                  └── steps (actions)
```

**Task Management** (user_id scoped):
- `task_lists` - Daily/weekly task organization
- `steps` (tasks) with `breaths` (sub-tasks/time tracking)

**Projects** (user_id scoped - EXISTS!):
- `projects` - Project management entities
- `project_areas` - Project workstreams/departments
- `project_team_members` - Team roster
- `project_tasks` - Roadmap tasks (week/month/quarter/year periods)

**Company/Team** (shared entities - EXISTS!):
- `companies` - Organization/company records
- `teams` - Teams within companies
- `goals` - Goals linked to users/companies/teams

**Other**:
- `profiles` - User profiles
- `journal_entries`, `emotion_entries` - Wellness tracking
- `vehicles` - Financial tracking
- `daily_plans`, `reset_periods`, `archives` - Planning features

### Missions-App Tables (Board Management)

**Workspace & Boards**:
- `workspaces` - Top-level containers (like companies/projects)
- `boards` - Collaborative boards (like Monday.com)
- `board_groups` - Sections within boards
- `tasks` - Board items/tasks
- `task_comments` - Task discussions
- `board_activities` - Audit log
- `board_labels` - Status/priority options
- `board_members` - Board access control
- `migration_logs` - Monday.com migration tracking

**Key Difference**:
- Mauna-app: Personal wellness + project planning
- Missions-app: Collaborative team boards + workflows

---

## Mauna-App Patterns (Production-Ready)

### 1. Supabase Client Setup

**File**: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
```

**Pattern**: Simple, direct client creation with auth configuration.

### 2. DatabaseService Class Pattern

**File**: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/database-service.ts`

**Key Characteristics**:
- Centralized service class for all database operations
- Comprehensive TypeScript types from `lib/types.ts`
- Error handling with console.error for debugging
- Nested query support for hierarchical data

**Example - Nested Query Pattern**:
```typescript
async fetchRanges(userId: string): Promise<Range[]> {
  const { data, error } = await this.supabase
    .from("ranges")
    .select(`
      id, name, description, color, frequency, isbuildhabit, history,
      mountains (
        id, name, description, color, frequency, isbuildhabit, history,
        hills (
          id, name, description, color, frequency, isbuildhabit, history,
          terrains (
            id, name, description, color, frequency, isbuildhabit, history,
            lengths (
              id, name, description, color, frequency, isbuildhabit, history,
              steps (
                id, label, mantra, description, color, frequency,
                isbuildhabit, history, tag
              )
            )
          )
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[DatabaseService.fetchRanges] Error:", error);
    throw new Error(error.message || "Failed to fetch ranges");
  }

  return data.map(transformRange); // Map to app types
}
```

**Benefits**:
- 6 levels deep nested query in a single call
- Type-safe results
- User-scoped data (RLS enforcement)
- Clear error messages

### 3. CRUD Operation Patterns

**Create**:
```typescript
async createRange(userId: string, name: string): Promise<Range> {
  const { data, error } = await this.supabase
    .from("ranges")
    .insert({ user_id: userId, name, tag: null })
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return { ...data, tag: null, mountains: [] }
}
```

**Update**:
```typescript
async updateRange(id: string, userId: string, name: string): Promise<Range> {
  const { data, error } = await this.supabase
    .from("ranges")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId) // User scoping for security
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return { ...data, mountains: [] }
}
```

**Delete**:
```typescript
async deleteRange(id: string, userId: string): Promise<void> {
  const { error } = await this.supabase
    .from("ranges")
    .delete()
    .eq("id", id)
    .eq("user_id", userId) // User scoping

  if (error) throw new Error(error.message)
}
```

**Pattern**: Always scope operations by `user_id` for Row Level Security (RLS).

### 4. Row Level Security (RLS) Patterns

**From**: `/Users/likhitha/Projects/cow/apps/mauna-app/scripts/create-projects-tables-v1.sql`

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only view their own projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Nested table access control
CREATE POLICY "Users can view areas of their projects" ON project_areas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_areas.project_id
      AND projects.user_id = auth.uid()
    )
  );
```

**Benefits**:
- Database-level security enforcement
- Prevents data leakage across users
- Supports nested relationships (e.g., project_areas checks parent project ownership)

### 5. TypeScript Type Safety

**From**: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/types.ts`

```typescript
export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
  priority: "low" | "medium" | "high"
  dueDate: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectTask {
  id: string
  projectId: string
  areaId: string
  userId: string
  title: string
  description: string | null
  status: "pending" | "in-progress" | "completed" | "blocked"
  timePeriod: string
  timePeriodType: "week" | "month" | "quarter" | "year"
  timePeriodNumber: number
  assignedTo: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  userId: string
  name: string
  industry: string | null
  createdAt: string
}

export interface Team {
  id: string
  companyId: string
  name: string
  description: string | null
  createdAt: string
}
```

**Pattern**: Comprehensive interfaces for all database entities with strict typing.

---

## Missions-App Current State

### 1. Supabase Client Setup

**File**: `/Users/likhitha/Projects/cow/apps/missions-app/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   'https://spnoztsuvgxrdmkeygdu.supabase.co';

const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY ||
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                   'eyJhbG...';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive Database interface with all table types
export interface Database {
  public: {
    Tables: {
      workspaces: { Row: {...}, Insert: {...}, Update: {...} },
      boards: { Row: {...}, Insert: {...}, Update: {...} },
      board_groups: { Row: {...}, Insert: {...}, Update: {...} },
      tasks: { Row: {...}, Insert: {...}, Update: {...} },
      task_comments: { Row: {...}, Insert: {...}, Update: {...} },
      board_activities: { Row: {...}, Insert: {...}, Update: {...} },
      board_labels: { Row: {...}, Insert: {...}, Update: {...} },
      board_members: { Row: {...}, Insert: {...}, Update: {...} },
      migration_logs: { Row: {...}, Insert: {...}, Update: {...} }
    };
  };
}
```

**Strengths**:
- Comprehensive TypeScript database types
- Multiple env var fallbacks
- Type-safe table definitions

**Opportunities**:
- No auth configuration (unlike mauna-app)
- Could extract to shared package

### 2. Board Service (Mock Data)

**File**: `/Users/likhitha/Projects/cow/apps/missions-app/src/services/board.service.ts`

**Current Implementation**: Uses in-memory mock data

```typescript
class BoardService {
  private boards: COWBoard[] = [...mockBoards]; // In-memory storage

  async getBoards(filter?: Partial<BoardFilter>): Promise<COWBoard[]> {
    await this.delay(300); // Simulate API delay

    let filteredBoards = [...this.boards];

    if (filter?.title) {
      const regex = new RegExp(filter.title, 'i');
      filteredBoards = filteredBoards.filter(board =>
        regex.test(board.title) || regex.test(board.description || '')
      );
    }

    return filteredBoards;
  }

  async getBoardById(boardId: string): Promise<COWBoard | null> {
    await this.delay(200);
    return this.boards.find(board => board.id === boardId) || null;
  }

  async createBoard(boardData: Partial<COWBoard>, createdBy: PersonAssignment): Promise<COWBoard> {
    await this.delay(500);

    const newBoard: COWBoard = {
      ...createEmptyBoard(createdBy),
      id: generateId(),
      ...boardData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.boards.push(newBoard);
    return newBoard;
  }

  // Similar mock patterns for updateBoard, deleteBoard, etc.
}
```

**Status**: ❌ **Needs Supabase Integration**

### 3. Workspace Service (Partial Supabase)

**File**: `/Users/likhitha/Projects/cow/apps/missions-app/src/services/supabase-workspace.service.ts`

```typescript
export class SupabaseWorkspaceService {
  async loadWorkspaces(): Promise<Workspace[]> {
    try {
      // ✅ DOES use Supabase for workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: true });

      if (workspacesError) {
        console.error('Error loading workspaces:', workspacesError);
        return [];
      }

      // ✅ DOES use Supabase for boards
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: true });

      // Transform and combine data
      const workspaces: Workspace[] = workspacesData.map(ws => {
        const workspaceBoards = boardsData?.filter(board =>
          board.workspace_id === ws.id
        ) || [];

        return {
          id: ws.id,
          name: ws.name,
          boards: workspaceBoards,
          // ...
        };
      });

      return workspaces;
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      return [];
    }
  }

  async loadBoardTasks(boardId: string) {
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select(`
        *,
        board_groups (id, title, color, position)
      `)
      .eq('board_id', boardId);

    return tasksData || [];
  }
}
```

**Status**: ✅ **Already uses Supabase** for workspace/board loading
**Opportunity**: Merge with board.service.ts to eliminate mock data

---

## Cross-App Integration Strategy

### Current Database Coexistence

```
┌─────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SHARED ENTITIES (Company/Project Level)            │
│  ┌───────────────────────────────────────────────┐ │
│  │ • companies                                   │ │
│  │ • teams                                       │ │
│  │ • projects (mauna-app schema)                 │ │
│  │ • workspaces (missions-app schema)            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  MAUNA-APP (Personal Wellness + Projects)           │
│  ┌───────────────────────────────────────────────┐ │
│  │ Personal Data (user_id scoped):               │ │
│  │ • ranges, mountains, hills, terrains,         │ │
│  │   lengths, steps                              │ │
│  │ • task_lists, steps, breaths                  │ │
│  │ • journal_entries, emotion_entries            │ │
│  │ • vehicles (financial tracking)               │ │
│  │ • daily_plans, reset_periods                  │ │
│  │                                               │ │
│  │ Project Data (user_id scoped):                │ │
│  │ • project_areas, project_team_members         │ │
│  │ • project_tasks                               │ │
│  │                                               │ │
│  │ Shared Data:                                  │ │
│  │ • goals (linked to companies/teams)           │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  MISSIONS-APP (Collaborative Boards)                │
│  ┌───────────────────────────────────────────────┐ │
│  │ • boards, board_groups                        │ │
│  │ • tasks, task_comments                        │ │
│  │ • board_activities, board_labels              │ │
│  │ • board_members                               │ │
│  │ • migration_logs                              │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Schema Relationships

```
companies (shared)
  └── teams (shared)
      ├── workspaces (missions-app) → boards → tasks
      ├── projects (mauna-app) → project_areas → project_tasks
      └── goals (mauna-app, user-scoped but team-linked)

profiles (users)
  ├── Personal wellness (mauna-app): ranges → mountains → ... → steps
  ├── Personal tasks (mauna-app): task_lists → steps → breaths
  ├── Personal projects (mauna-app): projects → project_tasks
  └── Board participation (missions-app): board_members → tasks
```

**Key Insight**: The database already supports both personal and collaborative features. We just need to:
1. Link them properly via company_id/project_id
2. Add cross-app visibility queries
3. Update RLS policies for shared access

---

## Company/Project-Oriented Features

### User's Requirements

From conversation context:
> "Make it possible to have company and project-oriented ranges, mountains, steps that can be assigned to users in missions-app and viewed in mauna-app (alongside personal data)"

### Proposed Schema Changes

#### 1. Add Company/Project Columns to Mauna-App Tables

**Ranges** (currently personal only):
```sql
ALTER TABLE ranges
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
ADD COLUMN visibility TEXT DEFAULT 'personal'
  CHECK (visibility IN ('personal', 'company', 'project', 'team')),
ADD COLUMN created_for_user_id UUID REFERENCES profiles(id), -- Original creator/owner
ADD COLUMN assigned_user_ids UUID[] DEFAULT ARRAY[]::UUID[]; -- Who can see/work on it

-- Index for filtering
CREATE INDEX idx_ranges_company_id ON ranges(company_id);
CREATE INDEX idx_ranges_project_id ON ranges(project_id);
CREATE INDEX idx_ranges_visibility ON ranges(visibility);
CREATE INDEX idx_ranges_assigned_users ON ranges USING GIN(assigned_user_ids);
```

**Mountains, Hills, Terrains, Lengths, Steps** (same pattern):
```sql
ALTER TABLE mountains
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
ADD COLUMN visibility TEXT DEFAULT 'personal',
ADD COLUMN created_for_user_id UUID REFERENCES profiles(id),
ADD COLUMN assigned_user_ids UUID[] DEFAULT ARRAY[]::UUID[];

-- Repeat for hills, terrains, lengths, steps
```

#### 2. Update RLS Policies for Shared Access

**Current** (personal only):
```sql
CREATE POLICY "Users can view their own ranges" ON ranges
  FOR SELECT USING (auth.uid() = user_id);
```

**New** (personal + company + project):
```sql
DROP POLICY "Users can view their own ranges" ON ranges;

CREATE POLICY "Users can view accessible ranges" ON ranges
  FOR SELECT USING (
    -- Own personal ranges
    (auth.uid() = user_id AND visibility = 'personal')
    OR
    -- Assigned to user
    (auth.uid() = ANY(assigned_user_ids))
    OR
    -- Company ranges (if user is in company)
    (
      visibility = 'company'
      AND company_id IN (
        SELECT company_id FROM user_companies
        WHERE user_id = auth.uid()
      )
    )
    OR
    -- Project ranges (if user is on project team)
    (
      visibility = 'project'
      AND project_id IN (
        SELECT project_id FROM project_team_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create ranges" ON ranges
  FOR INSERT WITH CHECK (
    -- Personal ranges
    (auth.uid() = user_id AND visibility = 'personal')
    OR
    -- Company ranges (if user is admin/manager)
    (
      visibility = 'company'
      AND company_id IN (
        SELECT company_id FROM user_companies
        WHERE user_id = auth.uid()
        AND role IN ('admin', 'manager')
      )
    )
    OR
    -- Project ranges (if user is project owner)
    (
      visibility = 'project'
      AND project_id IN (
        SELECT id FROM projects
        WHERE user_id = auth.uid()
      )
    )
  );
```

#### 3. Link Workspaces to Companies

**Missions-app workspaces** should map to **companies**:

```sql
ALTER TABLE workspaces
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- Index
CREATE INDEX idx_workspaces_company_id ON workspaces(company_id);

-- Update RLS to allow company members access
CREATE POLICY "Company members can view workspace" ON workspaces
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
    )
  );
```

### Data Flow Examples

#### Example 1: Company-Wide Wellness Goal

**Scenario**: Company creates a "Healthy Team 2025" range with meditation steps assigned to all employees.

**Creation** (in missions-app or admin-portal):
```typescript
const companyRange = await databaseService.createRange(
  creatorUserId,
  "Healthy Team 2025"
);

await supabase
  .from('ranges')
  .update({
    company_id: 'company-uuid',
    visibility: 'company',
    created_for_user_id: creatorUserId,
    assigned_user_ids: ['user1', 'user2', 'user3'] // All employees
  })
  .eq('id', companyRange.id);
```

**Viewing** (in mauna-app):
```typescript
// User's personal view shows BOTH personal + company ranges
const allRanges = await databaseService.fetchRanges(userId);

// Results:
// [
//   { name: "My Personal Goals", visibility: "personal", ... },
//   { name: "Healthy Team 2025", visibility: "company", company_id: "...", ... }
// ]

// UI can distinguish with badges:
// 🏢 Company Goal | 👤 Personal Goal
```

#### Example 2: Project-Specific Roadmap

**Scenario**: "Gold Integration" project in missions-app has a mauna-app mountain called "Launch Milestones" with technical steps.

**Creation** (in missions-app project board):
```typescript
// 1. Create project in mauna-app schema
const project = await createProject({
  userId: projectOwnerId,
  name: "Gold Integration",
  status: "in_progress"
});

// 2. Create project mountain (linked to missions-app board)
const mountain = await createMountain(
  projectOwnerId,
  rangeId,
  "Launch Milestones"
);

await supabase
  .from('mountains')
  .update({
    project_id: project.id,
    visibility: 'project',
    assigned_user_ids: projectTeamMemberIds
  })
  .eq('id', mountain.id);

// 3. Create missions-app board linked to same project
const board = await createBoard({
  workspaceId,
  title: "Gold Integration Board"
});

await supabase
  .from('boards')
  .update({ project_id: project.id })
  .eq('id', board.id);
```

**Cross-App Visibility**:
```typescript
// In missions-app: Show project health from mauna-app
const projectHealth = await supabase
  .from('mountains')
  .select('id, name, completed, hills (id, name, completed)')
  .eq('project_id', currentProjectId);

// Display in missions-app board header:
// "Project Milestones: 3/5 hills completed (60%)"

// In mauna-app: Show project tasks from missions-app
const projectTasks = await supabase
  .from('tasks')
  .select('id, title, status, board:boards(title)')
  .eq('boards.project_id', currentProjectId);

// Display in mauna-app project view:
// "Active Tasks: 12 in progress, 5 blocked"
```

#### Example 3: Admin Portal Management

**Scenario**: Admin creates a company, assigns users, and sets up initial project structure.

**Admin Portal Flow**:
```typescript
// 1. Create company
const company = await supabase
  .from('companies')
  .insert({ name: "COW Group", industry: "SaaS" })
  .select()
  .single();

// 2. Add users to company
await supabase
  .from('user_companies')
  .insert([
    { user_id: 'user1', company_id: company.id, role: 'admin' },
    { user_id: 'user2', company_id: company.id, role: 'member' },
    { user_id: 'user3', company_id: company.id, role: 'member' }
  ]);

// 3. Create workspace for company (missions-app)
const workspace = await supabase
  .from('workspaces')
  .insert({
    name: "COW Group Workspace",
    company_id: company.id,
    created_by: adminUserId
  })
  .select()
  .single();

// 4. Create default company range (mauna-app)
const companyRange = await createRange(adminUserId, "Company Goals 2025");
await supabase
  .from('ranges')
  .update({
    company_id: company.id,
    visibility: 'company',
    assigned_user_ids: ['user1', 'user2', 'user3']
  })
  .eq('id', companyRange.id);
```

**User Experience**:
- **User logs into mauna-app**: Sees personal goals + "Company Goals 2025" range
- **User logs into missions-app**: Sees "COW Group Workspace" with shared boards
- **Admin portal**: Can manage who has access to what, create/archive projects

---

## Recommendations

### Phase 1: Foundation (Immediate - This Session)

#### 1.1 Create Shared Supabase Client Package

**Create**: `/Users/likhitha/Projects/cow/packages/supabase-client/`

```typescript
// packages/supabase-client/src/index.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  };
}

export function createSupabaseClient(config?: SupabaseConfig): SupabaseClient {
  const url = config?.url ||
              process.env.NEXT_PUBLIC_SUPABASE_URL ||
              process.env.REACT_APP_SUPABASE_URL ||
              '';

  const key = config?.anonKey ||
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
              process.env.REACT_APP_SUPABASE_ANON_KEY ||
              '';

  if (!url || !key) {
    throw new Error('Supabase URL and key are required');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      ...config?.options?.auth
    }
  });
}

// Export singleton instance
export const supabase = createSupabaseClient();
```

**Usage**:
```typescript
// In mauna-app
import { supabase } from '@cow/supabase-client';

// In missions-app
import { supabase } from '@cow/supabase-client';

// In admin-portal
import { supabase } from '@cow/supabase-client';
```

**Benefits**:
- Single source of truth for Supabase configuration
- Consistent auth behavior across apps
- Easy to update/extend for all apps
- Type-safe client

#### 1.2 Wire Missions-App Board Service to Supabase

**Modify**: `/Users/likhitha/Projects/cow/apps/missions-app/src/services/board.service.ts`

**Changes**:
```typescript
import { supabase } from '@cow/supabase-client'; // Use shared client
import type { Database } from '../lib/supabase';

type BoardRow = Database['public']['Tables']['boards']['Row'];
type BoardInsert = Database['public']['Tables']['boards']['Insert'];
type BoardUpdate = Database['public']['Tables']['boards']['Update'];

class BoardService {
  // REMOVE: private boards: COWBoard[] = [...mockBoards];

  async getBoards(filter?: Partial<BoardFilter>): Promise<COWBoard[]> {
    try {
      let query = supabase
        .from('boards')
        .select(`
          *,
          workspace:workspaces(id, name),
          groups:board_groups(
            *,
            tasks(*)
          ),
          labels:board_labels(*),
          members:board_members(*)
        `)
        .order('created_at', { ascending: false });

      if (filter?.title) {
        query = query.ilike('title', `%${filter.title}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching boards:', error);
        throw new Error(error.message);
      }

      return data.map(transformBoardRow); // Transform to COWBoard type
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      return [];
    }
  }

  async getBoardById(boardId: string): Promise<COWBoard | null> {
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        workspace:workspaces(id, name),
        groups:board_groups(
          *,
          tasks(
            *,
            comments:task_comments(*)
          )
        ),
        labels:board_labels(*),
        members:board_members(*),
        activities:board_activities(*)
      `)
      .eq('id', boardId)
      .single();

    if (error) {
      console.error('Error fetching board:', error);
      return null;
    }

    return transformBoardRow(data);
  }

  async createBoard(
    boardData: Partial<COWBoard>,
    createdBy: PersonAssignment
  ): Promise<COWBoard> {
    const { data, error } = await supabase
      .from('boards')
      .insert({
        workspace_id: boardData.workspaceId || getDefaultWorkspaceId(),
        title: boardData.title || 'Untitled Board',
        description: boardData.description,
        is_starred: boardData.isStarred || false,
        created_by: createdBy.id,
        column_order: boardData.columnOrder || [
          'assignee-picker', 'status-picker', 'priority-picker', 'date-picker'
        ],
        view_type: boardData.viewType || 'table'
      } as BoardInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating board:', error);
      throw new Error(error.message);
    }

    return transformBoardRow(data);
  }

  async updateBoard(
    boardId: string,
    updates: Partial<COWBoard>
  ): Promise<COWBoard | null> {
    const { data, error } = await supabase
      .from('boards')
      .update({
        title: updates.title,
        description: updates.description,
        is_starred: updates.isStarred,
        column_order: updates.columnOrder,
        view_type: updates.viewType
      } as BoardUpdate)
      .eq('id', boardId)
      .select()
      .single();

    if (error) {
      console.error('Error updating board:', error);
      return null;
    }

    return transformBoardRow(data);
  }

  async deleteBoard(boardId: string): Promise<boolean> {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', boardId);

    if (error) {
      console.error('Error deleting board:', error);
      return false;
    }

    return true;
  }

  // Helper: Transform database row to app type
  private transformBoardRow(row: any): COWBoard {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      isStarred: row.is_starred,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      createdBy: {
        id: row.created_by,
        name: 'User', // TODO: Fetch from profiles
        avatar: ''
      },
      groups: row.groups?.map(transformGroupRow) || [],
      activities: row.activities?.map(transformActivityRow) || [],
      labels: row.labels || [],
      members: row.members?.map(m => ({
        id: m.user_id,
        name: m.user_name,
        avatar: m.user_avatar
      })) || [],
      columnOrder: row.column_order,
      availableColumns: row.available_columns,
      viewType: row.view_type
    };
  }
}
```

**Testing**:
```typescript
// In missions-app
const boards = await boardService.getBoards();
// Should fetch from Supabase, not mock data

const newBoard = await boardService.createBoard({
  title: "Test Board",
  description: "Created from Supabase integration"
}, currentUser);
// Should persist to database

// Verify in Supabase dashboard or via SQL:
// SELECT * FROM boards WHERE title = 'Test Board';
```

### Phase 2: Company/Project Integration (Next Session)

#### 2.1 Create User-Companies Junction Table

```sql
CREATE TABLE user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

CREATE INDEX idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON user_companies(company_id);

ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company memberships" ON user_companies
  FOR SELECT USING (auth.uid() = user_id);
```

#### 2.2 Add Company/Project Fields to Wellness Tables

Run migration scripts to add:
- `company_id`, `project_id` to ranges, mountains, hills, terrains, lengths, steps
- `visibility` enum ('personal', 'company', 'project', 'team')
- `assigned_user_ids` array for explicit assignments
- Updated RLS policies for cross-user visibility

#### 2.3 Create Shared Types Package

**Create**: `/Users/likhitha/Projects/cow/packages/shared-types/`

```typescript
// packages/shared-types/src/company.ts
export interface Company {
  id: string;
  name: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCompany {
  id: string;
  userId: string;
  companyId: string;
  role: 'admin' | 'manager' | 'member';
  joinedAt: string;
}

// packages/shared-types/src/project.ts
export interface Project {
  id: string;
  userId: string; // Owner
  companyId?: string;
  name: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// packages/shared-types/src/visibility.ts
export type Visibility = 'personal' | 'company' | 'project' | 'team';

export interface VisibilityMixin {
  visibility: Visibility;
  companyId?: string;
  projectId?: string;
  teamId?: string;
  createdForUserId?: string; // Original creator
  assignedUserIds?: string[]; // Explicit assignments
}
```

**Usage**:
```typescript
// In mauna-app
import { Company, Team, Project, VisibilityMixin } from '@cow/shared-types';

interface Range extends VisibilityMixin {
  id: string;
  name: string;
  userId: string;
  // ...
}

// In missions-app
import { Company, Project } from '@cow/shared-types';

// In admin-portal
import { Company, Team, UserCompany } from '@cow/shared-types';
```

### Phase 3: Admin Portal (Future)

#### 3.1 Company Management UI
- Create/edit companies
- Add/remove users from companies
- Assign roles (admin, manager, member)
- View company structure

#### 3.2 Project Management UI
- Create projects (linked to companies)
- Assign project teams
- Link to missions-app workspaces/boards
- Link to mauna-app ranges/mountains

#### 3.3 User Access Control
- Manage who can see company-level wellness goals
- Control project visibility
- Set default permissions for new ranges/boards

### Phase 4: Cross-App Visibility (Future)

#### 4.1 Missions-App Enhancements
- Show project health from mauna-app wellness data
- Display company-wide goal progress
- Link board tasks to mauna-app steps

#### 4.2 Mauna-App Enhancements
- Show company/project ranges alongside personal ones
- Display team members' progress on shared goals
- Link steps to missions-app board tasks

---

## Summary & Next Steps

### What We Learned

✅ **Mauna-app has production-ready patterns**:
- Comprehensive DatabaseService class
- Nested query support for hierarchical data
- Robust error handling
- TypeScript type safety
- RLS policies for security

✅ **Mauna-app already has projects/companies tables**:
- No need to create from scratch
- Can extend with company_id/project_id to wellness tables
- RLS policies already in place

✅ **Missions-app has the schema but uses mock data**:
- Workspace/board tables exist in Supabase
- SupabaseWorkspaceService loads workspaces correctly
- BoardService needs Supabase integration (currently mocked)

✅ **Cross-app integration is achievable**:
- Add company_id/project_id to wellness tables
- Update RLS for cross-user visibility
- Link workspaces to companies
- Share common types via packages

### Immediate Next Steps (This Session)

**Task 1**: ✅ **COMPLETED** - Created this database analysis document

**Task 2**: Create `@cow/supabase-client` shared package
- Extract Supabase client creation logic
- Configure auth settings
- Export singleton instance
- Update both apps to use it

**Task 3**: Wire missions-app `board.service.ts` to Supabase
- Replace mock data with Supabase queries
- Implement getBoards(), getBoardById(), createBoard()
- Test with real database persistence
- Ensure no regressions in UI

**Task 4**: Test end-to-end board creation
- Create board from missions-app UI
- Verify persistence in Supabase
- Confirm mauna-app data remains unaffected
- Validate RLS policies work correctly

**Task 5**: Document findings and create migration plan
- Update this document with test results
- Create schema migration scripts for Phase 2
- Plan company/project integration approach

### Future Sessions

**Phase 2**: Company/Project multi-tenancy
**Phase 3**: Admin portal for access management
**Phase 4**: Cross-app data visibility and linking

---

## Appendix

### File References

**Mauna-App**:
- Client: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/supabase.ts`
- Service: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/database-service.ts`
- Types: `/Users/likhitha/Projects/cow/apps/mauna-app/lib/types.ts`
- SQL: `/Users/likhitha/Projects/cow/apps/mauna-app/scripts/create-projects-tables-v1.sql`
- SQL: `/Users/likhitha/Projects/cow/apps/mauna-app/scripts/create-companies-table-v1.sql`

**Missions-App**:
- Client: `/Users/likhitha/Projects/cow/apps/missions-app/src/lib/supabase.ts`
- Board Service: `/Users/likhitha/Projects/cow/apps/missions-app/src/services/board.service.ts`
- Workspace Service: `/Users/likhitha/Projects/cow/apps/missions-app/src/services/supabase-workspace.service.ts`
- SQL: `/Users/likhitha/Projects/cow/apps/missions-app/src/database/supabase-schema.sql`

### Database Schema Diagram

```
┌─────────────────┐
│    profiles     │ (users)
│  id, name, etc  │
└────────┬────────┘
         │
    ┌────┴──────────────────────────────────┐
    │                                       │
    ▼                                       ▼
┌─────────────────┐                ┌──────────────────┐
│  user_companies │                │  ranges (mauna)  │
│  user_id        │                │  user_id         │
│  company_id ────┼──┐             │  company_id?     │
│  role           │  │             │  visibility      │
└─────────────────┘  │             └──────────────────┘
                     │
                     ▼
              ┌─────────────────┐
              │    companies    │
              │  id, name       │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌────────────┐  ┌────────────┐  ┌──────────────┐
│   teams    │  │ workspaces │  │   projects   │
│ company_id │  │ company_id?│  │  user_id     │
└────────────┘  └─────┬──────┘  │  company_id? │
                      │         └──────┬───────┘
                      ▼                │
               ┌─────────────┐         │
               │   boards    │         │
               │workspace_id │         │
               │ project_id? │◄────────┘
               └──────┬──────┘
                      │
             ┌────────┼────────┐
             │        │        │
             ▼        ▼        ▼
      ┌──────────┐ ┌──────┐ ┌─────────┐
      │  groups  │ │labels│ │ members │
      └────┬─────┘ └──────┘ └─────────┘
           │
           ▼
      ┌──────────┐
      │  tasks   │
      └────┬─────┘
           │
      ┌────┴──────┐
      │           │
      ▼           ▼
┌──────────┐ ┌────────────┐
│ comments │ │ activities │
└──────────┘ └────────────┘
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Next Review**: After Phase 1 implementation
