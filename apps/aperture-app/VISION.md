# Missions App - Product Vision

> **Mission-critical project management for purpose-driven work and tokenized companies**

## 🎯 What is Missions App?

Missions App is a **Monday.com-style project management platform** within the Cycles of Wealth (COW) ecosystem. It enables purpose-driven teams and tokenized companies to manage their work through customizable **FlexiBoards** with AI-powered apps.

**NOT about religious missions** - "Missions" refers to **purpose-driven work**, company objectives, and tokenized equity projects.

## 🏢 Who Uses It?

### Primary Users
1. **COW Internal Staff** - Managing tokenization projects, compliance, and operations
2. **Partner Companies** - Tokenized companies (e.g., AuAero, AuSiri) managing their projects
3. **Multi-Tenant Architecture** - Each tokenized company is a separate tenant with isolated data

### User Context
- **Primary Device**: Laptop (robust interface)
- **Secondary Devices**: Mobile (widgets, quick updates), Watch (notifications), AR/VR (immersive views)
- **Offline Support**: Mobile-first with sync capabilities

## 🎨 Design Philosophy

### Apple Liquid Glass Aesthetic
- Frosted glass effects with blur and transparency
- Smooth animations and transitions
- Clean, minimal interface
- Vanta.js animated backgrounds

### Monday.com-Inspired UX
- Color-coded status columns: `#00c875` (done), `#ffcb00` (working), `#e2445c` (stuck), `#579bfc` (review), `#a25ddc` (planned)
- Drag-and-drop Kanban boards
- Inline editing and quick actions
- Customizable views (Table, Kanban, Timeline, Calendar)

## 🧩 Core Concept: FlexiBoards

**FlexiBoards** are customizable workspaces where users can:
- Create multiple boards for different projects/missions
- Add **pluggable apps** (CRM, Content Studio, Sales Pipeline, etc.)
- Customize columns, fields, and workflows
- Share across tenants (for partner collaboration)
- Switch views (Kanban, Table, Timeline, Calendar)

### Built-in Apps (Pluggable into FlexiBoards)

#### 1. **Project Management** (Foundation - MVP)
Monday.com-style task boards with:
- Task cards with assignees, due dates, status
- Custom columns (Status, Priority, Tags, Owners)
- Drag-and-drop between columns
- Inline editing
- Comments and file attachments

#### 2. **Content Studio** (AI-Powered)
Create marketing materials with AI (Grok/Claude):
- AI-generated social media posts
- Content calendar and scheduling
- Version control and team reviews
- AR support for layout previews
- Blaze AI-powered workflows

#### 3. **Sales Pipeline**
Lead tracking and deal management:
- Sales funnel visualization
- Lead scoring and prioritization
- Real-time deal alerts (mobile widgets)
- AI-powered sales forecasting
- VR support for pipeline visualization

#### 4. **CRM** (Cloze-style)
Relationship intelligence:
- Auto-score contacts based on interaction history
- Relationship network visualization (AR support)
- Contact alerts (mobile widgets)
- Integration with Sales Pipeline

#### 5. **Customer Service**
Multi-channel support ticket management:
- Unified inbox (email, chat, etc.)
- AI-powered response suggestions (Claude/Grok)
- Ticket routing and escalation
- Watch notifications for urgent tickets

#### 6. **Legal/Compliance**
Regulatory document management (critical for tokenized companies):
- Document upload and analysis (Claude AI)
- Multi-jurisdiction compliance tracking
- Automated regulatory alerts
- Audit trails and reporting

#### 7. **Productivity Suite** (Mauna Integration)
Gamified habit tracking and wellness:
- **30/30 Timer View**: Pomodoro-style task timers with auto-advance
- **Everyday Streak Tracker**: Daily habit logging with visual progress
- **Finch Gamification**: Virtual pet rewards for completing tasks
- **Vision Boards**: Pinterest/Kanban-style goal visualization
- **Mood Tracking**: Self-care features with AI-prompted reminders

## 📊 MVP Features (Foundation First)

### Phase 1: Core FlexiBoard (PRIORITY)
- [ ] Create/edit/delete boards
- [ ] Add columns (Status, Text, Date, Person, etc.)
- [ ] Create/edit/delete items (tasks/cards)
- [ ] Drag-and-drop items between columns
- [ ] Inline editing (double-click to edit)
- [ ] Basic filtering and search
- [ ] User assignment to items
- [ ] Due date tracking

### Phase 2: Views & Collaboration
- [ ] Kanban view (default)
- [ ] Table view
- [ ] Timeline/Gantt view
- [ ] Comments on items
- [ ] File attachments
- [ ] @mentions and notifications
- [ ] Real-time collaboration (multiple users)

### Phase 3: Multi-Tenancy & Permissions
- [ ] Tenant isolation (data separation)
- [ ] Role-based access control (Admin, Editor, Viewer)
- [ ] Shared boards (cross-tenant collaboration)
- [ ] Audit logs

### Phase 4: AI Integration
- [ ] Claude/Grok API integration
- [ ] AI-powered task suggestions
- [ ] Auto-categorization and tagging
- [ ] Smart notifications

### Phase 5: Pluggable Apps
- [ ] App marketplace framework
- [ ] Content Studio (first app)
- [ ] CRM (second app)
- [ ] Sales Pipeline (third app)

## 🎮 Gamification & Wellness (Mauna Features)

### 30/30 Timer Integration
- Visual timer cards in FlexiBoard
- Auto-advance to next task with sound cues
- Mobile/watch widgets for pause notifications
- Focused work burst tracking

### Everyday-Style Streak Tracking
- Daily habit check-ins
- Visual progress boards that evolve aesthetically
- Watch notifications for daily reminders
- Journal entries tied to habits

### Finch-Style Gamification
- Virtual pet companion
- Completing tasks "feeds" the pet
- Customizable reward frequencies
- AR support for immersive pet interactions
- Pet evolution based on consistency

### Vision Boards
- **Pinterest-Style**: Pin inspirational images/quotes to boards
- **Kanban-Style**: Move goal cards through stages (Inspired → In Progress → Achieved)
- Work-in-progress limits for focus
- VR walkthroughs for spatial goal visualization

## 🔐 Technical Requirements

### Stack Alignment
- **Frontend**: React + TypeScript (matches products-site)
- **Styling**: Tailwind CSS + Custom Apple liquid glass styles
- **Components**: Shadcn UI + Custom components
- **State**: React Context (or Zustand for complex state)
- **Backend**: Supabase (PostgreSQL + real-time)
- **AI**: Claude/Grok API integration
- **Deployment**: Vercel

### Database Schema (Supabase)
- `boards` - FlexiBoard instances
- `columns` - Board columns (Status, Priority, etc.)
- `items` - Tasks/cards on boards
- `users` - User accounts
- `tenants` - Multi-tenant isolation
- `board_permissions` - Access control
- `comments` - Item comments
- `attachments` - File uploads

### Real-time Features
- Supabase real-time subscriptions for live collaboration
- Optimistic UI updates
- Conflict resolution for concurrent edits

## 🎯 User Stories (Prioritized)

### Foundation (MVP - Phase 1)
1. **As a COW internal staff member**, I want to create customizable FlexiBoards for project management, so I can organize tasks and track OKRs efficiently.
2. **As a project manager**, I want to configure role-based permissions for FlexiBoards, so I can control access for internal staff and partners.
3. **As a team member**, I want to view and edit FlexiBoards in Kanban view with drag-and-drop, so I can visualize workflow stages.

### Collaboration (Phase 2)
4. **As a partner company staff**, I want to access shared FlexiBoards with collaboration features, so I can contribute to joint projects while only seeing my tenant's data.
5. **As a team collaborator**, I want to share productivity views across tenants, so partners can co-create workflows.

### AI-Powered Features (Phase 4)
6. **As a content creator**, I want to use the Content Studio app with AI-powered content creation (Grok/Claude), so I can produce marketing materials efficiently.
7. **As a sales manager**, I want to integrate a Sales Pipeline app with AI forecasting, so I can manage deals with data-driven insights.
8. **As a compliance officer**, I want to use the Legal/Compliance app to analyze regulatory documents with Claude AI, so I can ensure multi-jurisdiction compliance.
9. **As a customer service agent**, I want AI-powered response suggestions (Claude/Grok), so I can respond to clients quickly.

### CRM & Relationships (Phase 5)
10. **As a CRM user**, I want Cloze-style relationship intelligence to auto-score contacts, so I can prioritize key relationships.
11. **As a sales analyst**, I want to generate sales forecasts integrating real-time CRM data, so I can make data-driven decisions.

### Productivity & Wellness (Phase 5)
12. **As a productivity user**, I want a 30/30-style timer view integrated into FlexiBoards, so I can maintain focused work bursts.
13. **As a habit builder**, I want Everyday-style streak tracking to log daily habits, so I can build consistency.
14. **As a goal setter**, I want Finch-like gamification where completing habits feeds a virtual pet, so self-improvement is engaging.
15. **As a visionary planner**, I want to create Pinterest-style vision boards for pinning inspirational images, so I can visualize professional dreams.

### Cross-Platform (Phase 6)
16. **As a mobile-first user**, I want a mobile interface with offline access and watch widgets, so I can interact seamlessly when away from my laptop.
17. **As an AR/VR enthusiast**, I want to use AR/VR environments for spatial workspaces, synced with my laptop's FlexiBoard.

## 🚀 Development Priorities

### Immediate Focus (Next 2 Weeks)
1. **FlexiBoard CRUD** - Create, read, update, delete boards
2. **Column Management** - Add/remove/reorder columns
3. **Item CRUD** - Create, edit, delete task cards
4. **Drag-and-Drop** - Move items between columns
5. **Basic UI** - Apple liquid glass styling for board view

### Short-Term (Next Month)
6. **Kanban View** - Full interactive Kanban board
7. **User Assignment** - Assign items to team members
8. **Comments** - Add comments to items
9. **Real-time Sync** - Supabase subscriptions for live updates
10. **Multi-tenancy** - Tenant isolation and permissions

### Medium-Term (Next Quarter)
11. **Multiple Views** - Table, Timeline, Calendar views
12. **AI Integration** - Claude/Grok API for smart suggestions
13. **Content Studio App** - First pluggable app
14. **Mobile Widgets** - Quick update widgets

### Long-Term (Next 6 Months)
15. **Full App Marketplace** - All pluggable apps (CRM, Sales, etc.)
16. **Gamification** - Mauna features integration
17. **AR/VR Support** - Spatial interfaces
18. **Advanced Analytics** - Cross-board insights

## 📐 Style Guidelines

### Colors
- **Status Colors**: `#00c875` (done), `#ffcb00` (working), `#e2445c` (stuck), `#579bfc` (review), `#a25ddc` (planned)
- **Primary**: Apple system blue `#007AFF`
- **Background**: Dark mode with `rgba(255, 255, 255, 0.05)` glass panels
- **Text**: White with varying opacity

### Glass Effects
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}
```

### Typography
- **Headings**: SF Pro Display (fallback: system-ui)
- **Body**: SF Pro Text (fallback: system-ui)
- **Monospace**: SF Mono (fallback: Monaco)

### Animations
- Smooth transitions: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Drag-and-drop: Spring physics
- Vanta.js background: Animated particle effects

## 🎯 Success Metrics

### User Engagement
- Daily active boards per user
- Items created/completed per day
- Cross-tenant collaboration frequency
- Mobile widget usage

### Product Metrics
- Time to create first board
- Average board complexity (columns, items)
- App adoption rate (which pluggable apps are most used)
- Gamification engagement (pet feeding frequency)

### Business Metrics
- Tenant acquisition (new tokenized companies)
- User retention (30-day, 90-day)
- Feature adoption across user types

## 🔮 Future Vision

**Year 1**: Solid Monday.com alternative with AI features
**Year 2**: Full app marketplace with Mauna wellness integration
**Year 3**: Industry-standard platform for tokenized company operations
**Year 5**: AR/VR native collaboration platform for Web3 businesses

---

## 🤖 For AI Orchestrator

When implementing features, prioritize:
1. **Foundation first** - Board/column/item CRUD before advanced features
2. **Mobile-responsive** - Always consider laptop + mobile + watch
3. **Multi-tenant isolation** - Never leak data across tenants
4. **Apple aesthetics** - Maintain liquid glass styling
5. **Real-time** - Use Supabase subscriptions for live updates
6. **AI-native** - Integrate Claude/Grok where it adds value
7. **Accessibility** - Keyboard shortcuts, screen reader support

**Start with MVP Phase 1**, then expand incrementally. Each feature should be production-ready before moving to the next.
