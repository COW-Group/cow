# Admin Portal Database Integration Plan

**Date**: 2025-10-09
**Purpose**: Comprehensive strategy for admin portal to manage companies, projects, users, permissions, and cross-app access

---

## Executive Summary

The **Admin Portal** will serve as the central management hub for:
- **Companies** (organizations using the platform)
- **Projects** (initiatives within companies)
- **Users** (team members across all apps)
- **Permissions** (who can access what in which app)
- **Access Control** (app-level and resource-level permissions)

**Key Insight**: Mauna-app already has `companies`, `teams`, and `projects` tables. We'll extend these with proper multi-tenancy and cross-app access control.

---

## Table of Contents

1. [Database Schema Extensions](#database-schema-extensions)
2. [Authentication & Authorization](#authentication--authorization)
3. [Admin Portal Features](#admin-portal-features)
4. [Cross-App Integration](#cross-app-integration)
5. [Implementation Phases](#implementation-phases)
6. [Security Considerations](#security-considerations)

---

## Database Schema Extensions

### 1. Companies & Teams (Already Exist!)

**Existing Schema** (from mauna-app):
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Proposed Enhancements**:
```sql
-- Add more company metadata
ALTER TABLE companies
ADD COLUMN industry TEXT,
ADD COLUMN size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
ADD COLUMN website TEXT,
ADD COLUMN logo_url TEXT,
ADD COLUMN settings JSONB DEFAULT '{}',
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived'));

-- Add team roles and visibility
ALTER TABLE teams
ADD COLUMN team_type TEXT DEFAULT 'department' CHECK (team_type IN ('department', 'project', 'cross-functional')),
ADD COLUMN visibility TEXT DEFAULT 'company' CHECK (visibility IN ('company', 'private', 'public')),
ADD COLUMN settings JSONB DEFAULT '{}';
```

### 2. User-Company Relationships (NEW)

**Purpose**: Many-to-many relationship between users and companies

```sql
CREATE TABLE user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  department TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
  UNIQUE(user_id, company_id)
);

CREATE INDEX idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX idx_user_companies_role ON user_companies(role);

-- RLS Policies
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company memberships" ON user_companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Company admins can view all company members" ON user_companies
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Company admins can invite users" ON user_companies
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

**Role Hierarchy**:
- **Owner**: Full control, can delete company, assign admins
- **Admin**: Manage users, projects, permissions (cannot delete company)
- **Manager**: Create projects, assign team members (limited permissions)
- **Member**: Access assigned resources only

### 3. App Permissions (NEW)

**Purpose**: Control which users can access which apps

```sql
CREATE TABLE app_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- NULL for platform-wide
  app_name TEXT NOT NULL CHECK (app_name IN ('missions-app', 'mauna-app', 'admin-portal', 'support-center', 'platform-app')),
  access_level TEXT DEFAULT 'read' CHECK (access_level IN ('none', 'read', 'write', 'admin')),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for no expiration
  UNIQUE(user_id, company_id, app_name)
);

CREATE INDEX idx_app_permissions_user_id ON app_permissions(user_id);
CREATE INDEX idx_app_permissions_company_id ON app_permissions(company_id);
CREATE INDEX idx_app_permissions_app_name ON app_permissions(app_name);

-- RLS Policies
ALTER TABLE app_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own app permissions" ON app_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Company admins can manage app permissions" ON app_permissions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

**Access Levels**:
- **none**: No access (explicitly denied)
- **read**: View-only access
- **write**: Create, edit resources
- **admin**: Full control within app

### 4. Resource Permissions (NEW)

**Purpose**: Fine-grained access control for specific resources

```sql
CREATE TABLE resource_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'board', 'workspace', 'project', 'range', 'mountain', 'goal'
  )),
  resource_id UUID NOT NULL, -- References specific resource
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  permission TEXT NOT NULL DEFAULT 'read' CHECK (permission IN ('read', 'write', 'admin', 'owner')),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_type, resource_id)
);

CREATE INDEX idx_resource_permissions_user_id ON resource_permissions(user_id);
CREATE INDEX idx_resource_permissions_resource ON resource_permissions(resource_type, resource_id);
CREATE INDEX idx_resource_permissions_company_id ON resource_permissions(company_id);

-- RLS Policies
ALTER TABLE resource_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resource permissions" ON resource_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Resource owners can grant permissions" ON resource_permissions
  FOR INSERT WITH CHECK (
    -- User must be owner of the resource OR company admin
    (
      EXISTS (
        SELECT 1 FROM resource_permissions rp
        WHERE rp.user_id = auth.uid()
        AND rp.resource_type = resource_type
        AND rp.resource_id = resource_id
        AND rp.permission = 'owner'
      )
    )
    OR
    (
      company_id IN (
        SELECT company_id FROM user_companies
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )
    )
  );
```

### 5. Project Enhancements (Extend Existing)

**Existing Schema** (from mauna-app):
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id), -- Owner
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  progress INTEGER,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Proposed Enhancements**:
```sql
-- Add company/team linkage
ALTER TABLE projects
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN team_id UUID REFERENCES teams(id),
ADD COLUMN visibility TEXT DEFAULT 'company' CHECK (visibility IN ('personal', 'team', 'company', 'public')),
ADD COLUMN settings JSONB DEFAULT '{}';

-- Link to missions-app workspaces
ALTER TABLE projects
ADD COLUMN workspace_id UUID REFERENCES workspaces(id); -- From missions-app

-- Update RLS policies for company access
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;

CREATE POLICY "Users can view accessible projects" ON projects
  FOR SELECT USING (
    -- Personal projects
    (auth.uid() = user_id AND visibility = 'personal')
    OR
    -- Team projects
    (
      visibility = 'team'
      AND team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid()
      )
    )
    OR
    -- Company projects
    (
      visibility = 'company'
      AND company_id IN (
        SELECT company_id FROM user_companies
        WHERE user_id = auth.uid()
      )
    )
    OR
    -- Explicitly granted access
    (
      EXISTS (
        SELECT 1 FROM resource_permissions
        WHERE user_id = auth.uid()
        AND resource_type = 'project'
        AND resource_id = projects.id
      )
    )
  );
```

### 6. Vision Board Tables Extensions (Mauna-App)

**Add company/project columns** to vision board hierarchy:

```sql
-- Ranges (top level)
ALTER TABLE ranges
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
ADD COLUMN visibility TEXT DEFAULT 'personal' CHECK (visibility IN ('personal', 'team', 'company', 'project')),
ADD COLUMN created_for_user_id UUID REFERENCES profiles(id), -- Original creator
ADD COLUMN assigned_user_ids UUID[] DEFAULT ARRAY[]::UUID[]; -- Assigned users

-- Mountains, Hills, Terrains, Lengths, Steps (repeat pattern)
ALTER TABLE mountains ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE mountains ADD COLUMN project_id UUID REFERENCES projects(id);
ALTER TABLE mountains ADD COLUMN visibility TEXT DEFAULT 'personal';
ALTER TABLE mountains ADD COLUMN assigned_user_ids UUID[];

ALTER TABLE hills ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE hills ADD COLUMN project_id UUID REFERENCES projects(id);
ALTER TABLE hills ADD COLUMN visibility TEXT DEFAULT 'personal';
ALTER TABLE hills ADD COLUMN assigned_user_ids UUID[];

-- Repeat for terrains, lengths, steps...

-- Update RLS policies
CREATE POLICY "Users can view accessible ranges" ON ranges
  FOR SELECT USING (
    (auth.uid() = user_id AND visibility = 'personal')
    OR
    (auth.uid() = ANY(assigned_user_ids))
    OR
    (
      visibility = 'company'
      AND company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
      )
    )
    OR
    (
      visibility = 'project'
      AND project_id IN (
        SELECT id FROM projects
        WHERE user_id = auth.uid()
        OR company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())
      )
    )
  );
```

### 7. Workspace Enhancements (Missions-App)

**Link workspaces to companies**:

```sql
ALTER TABLE workspaces
ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN team_id UUID REFERENCES teams(id),
ADD COLUMN visibility TEXT DEFAULT 'company' CHECK (visibility IN ('private', 'team', 'company'));

-- Update RLS
CREATE POLICY "Company members can view workspace" ON workspaces
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );
```

---

## Authentication & Authorization

### User Flow

**1. User Registration/Invitation**:
```
Admin invites user → Email invitation → User signs up → User added to company
```

**2. Permission Check (App Access)**:
```sql
-- Check if user can access missions-app for a company
SELECT access_level FROM app_permissions
WHERE user_id = :user_id
AND company_id = :company_id
AND app_name = 'missions-app'
AND (expires_at IS NULL OR expires_at > NOW());
```

**3. Permission Check (Resource Access)**:
```sql
-- Check if user can edit a specific board
SELECT permission FROM resource_permissions
WHERE user_id = :user_id
AND resource_type = 'board'
AND resource_id = :board_id;
```

### Helper Functions

**Create useful PostgreSQL functions**:

```sql
-- Check if user is company admin
CREATE OR REPLACE FUNCTION is_company_admin(
  p_user_id UUID,
  p_company_id UUID
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_companies
    WHERE user_id = p_user_id
    AND company_id = p_company_id
    AND role IN ('owner', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user can access app
CREATE OR REPLACE FUNCTION can_access_app(
  p_user_id UUID,
  p_company_id UUID,
  p_app_name TEXT
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM app_permissions
    WHERE user_id = p_user_id
    AND company_id = p_company_id
    AND app_name = p_app_name
    AND access_level NOT IN ('none')
    AND (expires_at IS NULL OR expires_at > NOW())
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Get user's effective permissions for resource
CREATE OR REPLACE FUNCTION get_resource_permission(
  p_user_id UUID,
  p_resource_type TEXT,
  p_resource_id UUID
)
RETURNS TEXT AS $$
  SELECT permission FROM resource_permissions
  WHERE user_id = p_user_id
  AND resource_type = p_resource_type
  AND resource_id = p_resource_id
  ORDER BY
    CASE permission
      WHEN 'owner' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'write' THEN 3
      WHEN 'read' THEN 4
    END
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;
```

---

## Admin Portal Features

### 1. Company Management

**Admin Portal UI**:
- **List Companies**: View all companies in the system
- **Company Details**: Name, industry, size, members, apps, projects
- **Create Company**: Form to add new organization
- **Edit Company**: Update company metadata
- **Suspend/Archive Company**: Disable access without deletion

**API Endpoints** (to implement):
```typescript
// GET /api/admin/companies
async function listCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      members:user_companies(count),
      projects:projects(count)
    `)
    .order('created_at', { ascending: false });

  return data || [];
}

// POST /api/admin/companies
async function createCompany(companyData: Partial<Company>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .insert(companyData)
    .select()
    .single();

  return data;
}

// PATCH /api/admin/companies/:id
async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return data;
}
```

### 2. User Management

**Admin Portal UI**:
- **List Users**: All users across all companies
- **User Details**: Profile, companies, permissions, activity
- **Invite User**: Send invitation to join company
- **Edit User**: Update role, permissions
- **Deactivate User**: Suspend access without deletion

**API Endpoints**:
```typescript
// GET /api/admin/users
async function listUsers(companyId?: string): Promise<UserProfile[]> {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      companies:user_companies(
        company_id,
        role,
        companies(name)
      ),
      permissions:app_permissions(*)
    `);

  if (companyId) {
    query = query.eq('user_companies.company_id', companyId);
  }

  const { data, error } = await query;
  return data || [];
}

// POST /api/admin/users/invite
async function inviteUser(invitation: {
  email: string;
  companyId: string;
  role: string;
  apps: string[];
}): Promise<void> {
  // 1. Create user invite in user_companies (status = 'invited')
  const { data: invite, error: inviteError } = await supabase
    .from('user_companies')
    .insert({
      user_id: null, // Will be filled when user signs up
      company_id: invitation.companyId,
      role: invitation.role,
      status: 'invited',
      invited_by: currentUserId
    })
    .select()
    .single();

  // 2. Send email invitation
  await sendInvitationEmail(invitation.email, invite.id);

  // 3. Create app permissions (will activate when user signs up)
  for (const app of invitation.apps) {
    await supabase
      .from('app_permissions')
      .insert({
        user_id: null, // Will be filled when user signs up
        company_id: invitation.companyId,
        app_name: app,
        access_level: 'write', // Default
        granted_by: currentUserId
      });
  }
}

// PATCH /api/admin/users/:id/role
async function updateUserRole(
  userId: string,
  companyId: string,
  newRole: string
): Promise<void> {
  const { error } = await supabase
    .from('user_companies')
    .update({ role: newRole })
    .eq('user_id', userId)
    .eq('company_id', companyId);
}
```

### 3. Permission Management

**Admin Portal UI**:
- **App Permissions**: Matrix view (users × apps)
- **Grant App Access**: Assign users to apps with access level
- **Revoke App Access**: Remove app permissions
- **Resource Permissions**: Grant specific board/project access
- **Bulk Operations**: Assign multiple users at once

**API Endpoints**:
```typescript
// GET /api/admin/permissions/apps/:companyId
async function getCompanyAppPermissions(companyId: string): Promise<AppPermission[]> {
  const { data, error } = await supabase
    .from('app_permissions')
    .select(`
      *,
      user:profiles(name, email),
      granted_by_user:profiles(name)
    `)
    .eq('company_id', companyId);

  return data || [];
}

// POST /api/admin/permissions/apps
async function grantAppPermission(permission: {
  userId: string;
  companyId: string;
  appName: string;
  accessLevel: string;
}): Promise<void> {
  const { error } = await supabase
    .from('app_permissions')
    .upsert({
      user_id: permission.userId,
      company_id: permission.companyId,
      app_name: permission.appName,
      access_level: permission.accessLevel,
      granted_by: currentUserId,
      granted_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,company_id,app_name'
    });
}

// DELETE /api/admin/permissions/apps/:id
async function revokeAppPermission(permissionId: string): Promise<void> {
  const { error } = await supabase
    .from('app_permissions')
    .delete()
    .eq('id', permissionId);
}
```

### 4. Project Management

**Admin Portal UI**:
- **List Projects**: All projects across companies
- **Project Details**: Metadata, team, linked resources
- **Create Project**: Form to create new project
- **Link Resources**: Connect to boards (missions-app) or ranges (mauna-app)
- **Assign Team**: Add users to project team

**API Endpoints**:
```typescript
// GET /api/admin/projects
async function listProjects(companyId?: string): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select(`
      *,
      company:companies(name),
      team:teams(name),
      workspace:workspaces(name),
      areas:project_areas(count),
      tasks:project_tasks(count)
    `);

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  return data || [];
}

// POST /api/admin/projects
async function createProject(projectData: {
  name: string;
  description: string;
  companyId: string;
  teamId?: string;
  visibility: string;
}): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: projectData.name,
      description: projectData.description,
      company_id: projectData.companyId,
      team_id: projectData.teamId,
      visibility: projectData.visibility,
      user_id: currentUserId,
      status: 'planning'
    })
    .select()
    .single();

  return data;
}

// POST /api/admin/projects/:id/link-workspace
async function linkProjectToWorkspace(
  projectId: string,
  workspaceId: string
): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ workspace_id: workspaceId })
    .eq('id', projectId);
}
```

---

## Cross-App Integration

### Scenario 1: Company-Wide Vision Board Goal

**User Story**: Admin creates a company wellness goal in mauna-app, visible to all employees.

**Flow**:
1. Admin logs into admin portal
2. Navigates to "Company Goals" section
3. Creates new range: "2025 Company Wellness Initiative"
4. Sets visibility to "company"
5. Assigns to all employees

**Database Operations**:
```typescript
// 1. Create range in mauna-app database
const { data: range, error } = await supabase
  .from('ranges')
  .insert({
    user_id: adminUserId, // Creator
    name: "2025 Company Wellness Initiative",
    company_id: companyId,
    visibility: 'company',
    created_for_user_id: adminUserId,
    assigned_user_ids: allEmployeeIds // Array of UUIDs
  })
  .select()
  .single();

// 2. Each employee can now see it in mauna-app
const { data: userRanges } = await supabase
  .from('ranges')
  .select('*')
  .or(`
    user_id.eq.${currentUserId},
    assigned_user_ids.cs.{${currentUserId}},
    company_id.eq.${userCompanyId}
  `);
```

**Result**: All employees see the range in mauna-app, can track their progress, admin can see aggregate completion.

### Scenario 2: Project Linked to Board and Vision

**User Story**: Create a "Product Launch" project that has a missions-app board for task management AND a mauna-app mountain for milestone tracking.

**Flow**:
1. Admin creates project in admin portal
2. Links to missions-app workspace/board
3. Links to mauna-app range/mountain
4. Assigns team members
5. Team members see both in their respective apps

**Database Operations**:
```typescript
// 1. Create project
const { data: project } = await supabase
  .from('projects')
  .insert({
    name: "Product Launch Q1",
    company_id: companyId,
    team_id: productTeamId,
    visibility: 'team',
    user_id: projectManagerId
  })
  .select()
  .single();

// 2. Create workspace in missions-app
const { data: workspace } = await supabase
  .from('workspaces')
  .insert({
    name: "Product Launch Workspace",
    company_id: companyId,
    created_by: projectManagerId
  })
  .select()
  .single();

// 3. Create board in missions-app
const { data: board } = await supabase
  .from('boards')
  .insert({
    workspace_id: workspace.id,
    title: "Product Launch Tasks",
    created_by: projectManagerId
  })
  .select()
  .single();

// 4. Create mountain in mauna-app
const { data: mountain } = await supabase
  .from('mountains')
  .insert({
    user_id: projectManagerId,
    range_id: productRangeId,
    name: "Product Launch Milestones",
    company_id: companyId,
    project_id: project.id,
    visibility: 'project',
    assigned_user_ids: teamMemberIds
  })
  .select()
  .single();

// 5. Link project to workspace
await supabase
  .from('projects')
  .update({ workspace_id: workspace.id })
  .eq('id', project.id);
```

**Result**:
- Team members see "Product Launch Tasks" board in missions-app
- Team members see "Product Launch Milestones" mountain in mauna-app
- Both are linked to same project
- Admin can see unified progress

### Scenario 3: Support Center User Access Management

**User Story**: Support center needs to view user data across all apps to help troubleshoot issues.

**Flow**:
1. Admin grants support team "read" access to all apps
2. Support agent logs in
3. Can view (but not edit) user's boards, vision board, projects
4. Can see activity logs for debugging

**Database Operations**:
```typescript
// 1. Grant support team read access to all apps
const apps = ['missions-app', 'mauna-app', 'admin-portal', 'support-center'];
for (const supportUserId of supportTeamIds) {
  for (const app of apps) {
    await supabase
      .from('app_permissions')
      .upsert({
        user_id: supportUserId,
        company_id: null, // Platform-wide
        app_name: app,
        access_level: 'read',
        granted_by: adminUserId
      });
  }
}

// 2. Support agent queries user's data
const { data: userData } = await supabase
  .from('profiles')
  .select(`
    *,
    boards:boards(*),
    ranges:ranges(*),
    projects:projects(*),
    activities:board_activities(*)
  `)
  .eq('id', troubledUserId)
  .single();
```

**RLS Check**: Support agent can read but not modify (access_level = 'read').

---

## Implementation Phases

### Phase 1: Core Schema & Basic Admin Portal (Week 1-2)

**Database**:
- ✅ Create `user_companies` table
- ✅ Create `app_permissions` table
- ✅ Create `resource_permissions` table
- ✅ Add company/project columns to existing tables
- ✅ Update RLS policies
- ✅ Create helper functions

**Admin Portal UI**:
- Company list/create/edit pages
- User list/invite/edit pages
- Basic permission matrix view

**API**:
- Company CRUD endpoints
- User management endpoints
- Permission management endpoints

### Phase 2: Cross-App Integration (Week 3-4)

**Database**:
- Update vision board tables (ranges, mountains, etc.)
- Update workspaces table with company linkage
- Add visibility and assignment columns

**Mauna-App**:
- Update DatabaseService to handle company/project filters
- Add company/project ranges to UI
- Show visibility badges (personal/team/company)

**Missions-App**:
- Update workspace service to filter by company
- Add company-level boards
- Implement RLS checks in UI

### Phase 3: Advanced Features (Week 5-6)

**Admin Portal**:
- Project management UI
- Resource linking (projects ↔ workspaces ↔ ranges)
- Bulk operations
- Audit logs
- Analytics dashboard

**Support Center**:
- User search and impersonation (read-only)
- Activity logs viewer
- Issue tracking linked to user data

### Phase 4: Optimization & Testing (Week 7-8)

**Performance**:
- Index optimization
- Query optimization
- Caching strategy

**Testing**:
- Unit tests for permission functions
- Integration tests for cross-app flows
- E2E tests for admin portal

**Documentation**:
- Admin portal user guide
- API documentation
- Permission system guide

---

## Security Considerations

### 1. Row Level Security (RLS)

**Critical**: All tables must have RLS enabled and proper policies.

**Checklist**:
- ✅ `user_companies` - Users see own memberships, admins see company
- ✅ `app_permissions` - Users see own permissions, admins manage company
- ✅ `resource_permissions` - Users see own permissions, owners grant
- ✅ `companies` - Members see their companies
- ✅ `projects` - Visibility-based access
- ✅ `ranges` - Visibility + assignment-based access
- ✅ `workspaces` - Company-based access
- ✅ `boards` - Workspace → Company access chain

### 2. Permission Escalation Prevention

**Scenarios to Prevent**:
- User promoting themselves to admin
- User granting permissions they don't have
- User accessing resources outside their company

**Enforcement**:
```sql
-- Prevent self-promotion
CREATE POLICY "Users cannot change their own role" ON user_companies
  FOR UPDATE USING (
    auth.uid() != user_id -- Cannot update own record
    OR (
      -- Unless they're owner (can demote themselves)
      role = 'owner'
      AND NEW.role IN ('admin', 'manager', 'member')
    )
  );

-- Prevent permission escalation
CREATE POLICY "Cannot grant higher permissions than own" ON resource_permissions
  FOR INSERT WITH CHECK (
    permission IN (
      SELECT get_user_max_permission(auth.uid(), resource_type)
    )
  );
```

### 3. Audit Logging

**Create audit log table**:
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'grant', 'revoke'
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB, -- Old and new values
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```

**Trigger for permission changes**:
```sql
CREATE OR REPLACE FUNCTION log_permission_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes)
  VALUES (
    auth.uid(),
    TG_OP,
    'app_permission',
    NEW.id,
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_app_permissions
AFTER INSERT OR UPDATE OR DELETE ON app_permissions
FOR EACH ROW EXECUTE FUNCTION log_permission_change();
```

### 4. Rate Limiting & Abuse Prevention

**Implement at API level**:
- Limit user invitations (max 100/day per company)
- Limit permission changes (max 50/hour per admin)
- Monitor bulk operations
- Alert on suspicious activity

---

## Summary

### Database Schema Summary

**New Tables**:
1. `user_companies` - User-company relationships with roles
2. `app_permissions` - App-level access control
3. `resource_permissions` - Resource-level access control
4. `audit_logs` - Audit trail for security

**Extended Tables**:
1. `companies` - Added metadata (industry, size, logo, status)
2. `teams` - Added type and visibility
3. `projects` - Added company_id, team_id, workspace_id, visibility
4. `ranges, mountains, hills, terrains, lengths, steps` - Added company_id, project_id, visibility, assigned_user_ids
5. `workspaces` - Added company_id, team_id, visibility

**Total Impact**: ~15 tables created/modified

### Admin Portal Features Summary

**Core Features**:
1. Company Management (CRUD)
2. User Management (Invite, Edit, Deactivate)
3. Permission Management (App + Resource levels)
4. Project Management (Create, Link, Assign)

**Advanced Features**:
1. Cross-app resource linking
2. Bulk operations
3. Audit logs
4. Analytics dashboard

### Cross-App Integration Summary

**Mauna-App**:
- Personal + company + project vision board items
- Visibility filtering in UI
- Assignment notifications

**Missions-App**:
- Company workspaces and boards
- Project-linked boards
- Team collaboration

**Support Center**:
- Read-only access to all user data
- Issue tracking with context

**Admin Portal**:
- Central management hub
- Permission control
- Resource linking

---

## Next Steps

### For You (User):
1. Review this plan and provide feedback
2. Prioritize features (what's most critical?)
3. Confirm timeline (realistic for your needs?)

### For Implementation:
1. **Week 1**: Create database schema (tables, policies, functions)
2. **Week 2**: Build admin portal basic UI (companies, users, permissions)
3. **Week 3**: Integrate with mauna-app (company vision boards)
4. **Week 4**: Integrate with missions-app (company workspaces)
5. **Week 5-6**: Advanced features (linking, bulk ops, analytics)
6. **Week 7-8**: Testing, optimization, documentation

---

**Ready to start?** Let me know which phase you'd like to tackle first! 🚀
