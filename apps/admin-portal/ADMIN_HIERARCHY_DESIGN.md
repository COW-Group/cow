# COW Admin Portal - Hierarchy & Navigation Design

## Admin Role Hierarchy

### 1. **Ecosystem Admins** (Highest Level - God Mode)
**Scope:** ENTIRE COW Ecosystem
**Access:** Full system administration across ALL apps

#### Responsibilities:
- Manage all apps (missions-app, mauna-app, support-center, etc.)
- Ecosystem infrastructure & configuration
- Global user management across all apps
- Cross-app analytics & reporting
- System-wide settings & security
- Ecosystem-wide compliance
- API & integration management
- Add/remove apps from ecosystem
- Global billing & subscriptions

#### Navigation Sections:
- **Ecosystem Dashboard** - System health, all apps metrics
- **Apps Management** - Enable/disable/configure all apps
  - Missions App
  - Mauna App
  - Support Center
  - Platform App (Legacy)
  - Products Site
  - Public Site
- **Global Users** - All users across all apps
- **All Organizations** - Every organization using any COW app
- **Infrastructure** - Servers, databases, services
- **Security & Compliance** - Ecosystem-wide audit logs, security
- **Global Billing** - All subscriptions across all apps
- **API & Integrations** - Ecosystem-level APIs

---

### 2. **Platform Admins** (App Level)
**Scope:** ONE specific app (e.g., ONLY missions-app OR ONLY mauna-app)
**Access:** Full administration of their assigned app only

#### Responsibilities:
- App-specific configuration & settings
- App-level user management
- App integrations & marketplace
- App analytics & performance
- App-specific compliance
- Template & workflow management (for their app)
- Cannot access other apps

#### Navigation Sections:

**Platform Admin for Missions App sees:**
- **Missions App Dashboard** - App usage, key metrics
- **Accounts Management** - All organizations using missions-app
- **App Users** - Users within missions-app
- **Templates & Workflows** - Board templates, automations
- **Integrations** - 3rd party integrations for missions-app
- **Analytics** - Missions-app performance, user behavior
- **App Settings** - Missions-app configuration
- **App Billing** - Subscriptions for missions-app

**Platform Admin for Mauna App sees:**
- **Mauna App Dashboard** - App usage, key metrics
- **Accounts Management** - All organizations using mauna-app
- **App Users** - Users within mauna-app
- **App Configuration** - Mauna-app specific settings
- **Integrations** - Mauna-app integrations
- **Analytics** - Mauna-app analytics
- *(Cannot see missions-app sections)*

**Platform Admin for Support Center sees:**
- **Support Dashboard**
- **Tickets & Cases**
- **Knowledge Base Management**
- **Support Agents**
- *(Cannot see missions-app or mauna-app)*

---

### 3. **Organization Admins** (Organization Level)
**Scope:** Single organization within an app (e.g., one company using missions-app)
**Access:** Their organization's account only

#### Responsibilities (within missions-app):
- Workspace management
- Organization user management
- Team management
- Board ownership & permissions
- Organization settings
- Billing for their organization
- Security settings for their org

#### Navigation Sections:
- **Organization Dashboard** - Org-specific metrics
- **Workspaces** - Manage workspaces
- **Users & Teams** - Organization members
- **Permissions & Roles** - Custom roles, access control
- **Billing** - Organization subscription
- **Settings** - Organization preferences
- **Audit Logs** - Organization activity

---

### 4. **Specialized Admin Roles** (Cross-Cutting)

#### **Compliance Admins**
**Scope:** Platform-wide or app-level compliance
**Responsibilities:**
- KYC/AML oversight
- Regulatory reporting
- Audit trail management
- Compliance monitoring
- Document verification

**Navigation:**
- **Compliance Dashboard**
- **KYC/AML Reviews**
- **Regulatory Reports**
- **Audit Trails**
- **Compliance Alerts**

#### **Security Admins**
**Scope:** Platform-wide or app-level security
**Responsibilities:**
- Security monitoring
- Access control
- Incident response
- Vulnerability management
- Session management

**Navigation:**
- **Security Dashboard**
- **Access Control**
- **Security Incidents**
- **Audit Logs**
- **Session Management**

#### **Support Admins**
**Scope:** Support Center app
**Responsibilities:**
- Support ticket management
- Knowledge base curation
- Support agent management
- Customer communication

**Navigation:**
- **Support Dashboard**
- **Tickets**
- **Knowledge Base**
- **Support Agents**
- **Customer Communication**

#### **Billing Admins**
**Scope:** Platform-wide or organization-level billing
**Responsibilities:**
- Payment processing
- Invoice management
- Subscription management
- Financial reporting

**Navigation:**
- **Billing Dashboard**
- **Invoices**
- **Subscriptions**
- **Payment Methods**
- **Financial Reports**

---

## Proposed Navigation Structure

```
┌─────────────────────────────────────┐
│       COW ADMIN PORTAL              │
│                                     │
│  ECOSYSTEM ADMINISTRATION           │
│  (Ecosystem Admins Only)            │
│  ├─ Ecosystem Dashboard             │
│  ├─ Apps Management ▾               │
│  │  ├─ Missions App                 │
│  │  ├─ Mauna App                    │
│  │  ├─ Support Center               │
│  │  ├─ Platform App (Legacy)        │
│  │  ├─ Products Site                │
│  │  ├─ Public Site                  │
│  │  └─ Add New App                  │
│  ├─ All Organizations               │
│  ├─ Global Users                    │
│  ├─ Infrastructure                  │
│  ├─ Global Billing                  │
│  └─ Ecosystem Settings              │
│                                     │
│  PLATFORM ADMINISTRATION            │
│  (Platform Admins - App Specific)   │
│  ├─ [App Name] Dashboard            │
│  ├─ Accounts (Organizations)        │
│  ├─ App Users                       │
│  ├─ Templates & Workflows           │
│  │  (if missions-app)               │
│  ├─ Integrations                    │
│  ├─ Analytics                       │
│  ├─ App Billing                     │
│  └─ App Settings                    │
│                                     │
│  ORGANIZATION MANAGEMENT             │
│  (Organization Admins)              │
│  ├─ Organization Dashboard          │
│  ├─ Workspaces                      │
│  │  (missions-app specific)         │
│  ├─ Users & Teams                   │
│  ├─ Permissions & Roles             │
│  ├─ Billing                         │
│  └─ Settings                        │
│                                     │
│  SPECIALIZED ADMIN AREAS            │
│  ├─ Compliance ▾                    │
│  │  ├─ Compliance Dashboard         │
│  │  ├─ KYC/AML Reviews              │
│  │  ├─ Regulatory Reports           │
│  │  └─ Audit Trails                 │
│  ├─ Security ▾                      │
│  │  ├─ Security Dashboard           │
│  │  ├─ Access Control               │
│  │  ├─ Security Incidents           │
│  │  └─ Session Management           │
│  ├─ Support ▾                       │
│  │  ├─ Support Dashboard            │
│  │  ├─ Tickets                      │
│  │  ├─ Knowledge Base               │
│  │  └─ Agents                       │
│  └─ Billing ▾                       │
│     ├─ Billing Dashboard            │
│     ├─ Invoices                     │
│     ├─ Subscriptions                │
│     └─ Reports                      │
│                                     │
│  LEGACY FEATURES                    │
│  (Platform App - Tokenization)      │
│  ├─ Companies                       │
│  ├─ Investors                       │
│  ├─ Trading                         │
│  └─ Blockchain                      │
└─────────────────────────────────────┘
```

---

## Role-Based Navigation Visibility

### Ecosystem Admin sees (GOD MODE):
- ✅ Ecosystem Administration (full access)
- ✅ Platform Administration (all apps - can switch between them)
- ✅ Organization Management (all orgs across all apps)
- ✅ Specialized Admin Areas (all - ecosystem-wide scope)
- ✅ Legacy Features (all)

### Platform Admin (Missions App) sees:
- ❌ Ecosystem Administration (no access)
- ✅ Platform Administration (ONLY Missions App sections)
- ✅ Organization Management (read-only - orgs using missions-app)
- ✅ Specialized Admin Areas (missions-app scoped only)
- ❌ Cannot see Mauna App, Support Center, or other apps
- ❌ Legacy Features

### Platform Admin (Mauna App) sees:
- ❌ Ecosystem Administration (no access)
- ✅ Platform Administration (ONLY Mauna App sections)
- ✅ Organization Management (read-only - orgs using mauna-app)
- ✅ Specialized Admin Areas (mauna-app scoped only)
- ❌ Cannot see Missions App, Support Center, or other apps
- ❌ Legacy Features

### Platform Admin (Support Center) sees:
- ❌ Ecosystem Administration (no access)
- ✅ Platform Administration (ONLY Support Center sections)
- ✅ Specialized Admin Areas (support-scoped: tickets, knowledge base)
- ❌ Cannot see Missions App, Mauna App, or other apps
- ❌ Legacy Features

### Organization Admin sees:
- ❌ Ecosystem Administration (no access)
- ❌ Platform Administration (no access)
- ✅ Organization Management (ONLY their organization)
- ⚠️ Specialized Admin Areas (only if specifically granted)
- ❌ Legacy Features

### Compliance Admin sees:
- ⚠️ Ecosystem Administration (compliance metrics only - read-only)
- ⚠️ Platform Administration (compliance data only - read-only)
- ✅ Compliance section (full access - ecosystem or app scoped)
- ⚠️ Other sections (read-only for compliance audits)

---

## Implementation Notes

1. **Context Switcher:** Add a prominent context switcher in the header showing:
   - Current admin role/scope
   - Which app/organization they're managing (if applicable)
   - Ability to switch between multiple contexts (if user has multiple roles)
   - Examples:
     - Ecosystem Admin: "Ecosystem Administration | All Apps"
     - Platform Admin: "Missions App Administration"
     - Org Admin: "Acme Corp | Missions App"

2. **Breadcrumbs:** Clear breadcrumb navigation showing hierarchy:
   - Ecosystem Admin: `Ecosystem > Apps > Missions App > Settings`
   - Platform Admin: `Missions App > Accounts > Acme Corp`
   - Org Admin: `Acme Corp > Workspaces > Marketing Team`

3. **Role Indicators:** Visual badges/colors for each admin level:
   - Ecosystem Admin: Gold/Premium (god mode)
   - Platform Admin: Deep Cerulean (app-specific)
   - Org Admin: Earth tones (grounded/limited)
   - Specialized: Role-specific colors (Compliance: Green, Security: Red, etc.)

4. **Scoped Views:** When an admin is managing something, clearly show the scope:
   - Ecosystem Admin: "Managing: All Apps & Organizations"
   - Platform Admin (Missions): "Managing: Missions App Only"
   - Platform Admin (Mauna): "Managing: Mauna App Only"
   - Org Admin: "Managing: Acme Corp Organization"

5. **Quick Actions:** Context-aware quick actions in header:
   - Ecosystem Admin: "Add App", "Add Organization", "Manage Infrastructure"
   - Platform Admin (Missions): "Add Account", "Create Template", "Manage Integrations"
   - Platform Admin (Support): "Create KB Article", "Add Support Agent"
   - Org Admin: "Invite Users", "Create Workspace", "Add Team"

6. **App Selector (for Ecosystem Admins):**
   - Dropdown showing all apps with quick jump
   - "Missions App", "Mauna App", "Support Center", "Platform App", etc.
   - Jump directly to app's admin dashboard

---

## Additional Admin Types to Consider

### **Content Admin**
- Manages content across public-site, products-site
- CMS operations
- SEO management
- Asset library

### **Analytics Admin**
- Platform-wide analytics access
- Business intelligence
- Report generation
- Data exports

### **API Admin**
- API key management
- Developer portal
- API usage monitoring
- Webhook management

### **Marketplace Admin** (if applicable)
- App marketplace management
- App approval process
- Developer relations
