# Moo Implementation Plan for Products-Site
## Financial Intelligence Assistant - COW Brand v3.0 Aligned

**Created:** October 23, 2025
**Reference:** moo-v1-implementation-plan.md + COW Communications v3.0
**Target:** products-site MooPage (/moo)

---

## Executive Summary

Transform the existing Moo chatbot in products-site into a **Financial Intelligence Assistant** covering accounting and finance disciplines, fully aligned with COW Brand v3.0 (Sumi-e Sky + Earth aesthetic).

### Scope for Products-Site Implementation

**Phase 1 (Immediate - This Sprint):**
- Dual-mode UI (Learning vs Project)
- Discipline filter with COW brand colors
- Enhanced suggested prompts (4 disciplines)
- COW v3.0 brand integration
- Side panel with progress tracking
- Improved formatting for financial content

**Phase 2 (Next Sprint):**
- Backend API integration
- 12 calculation tools
- RAG knowledge base (40 documents)
- Export functionality

---

## COW Brand v3.0 Integration

### Color Palette for Moo

Based on COW_Color_System_v3.md and COW_Design_Guide_UPDATED.md:

#### Discipline Color Coding

```
Financial Accounting → Deep Blue (#1e40af light / #3b82f6 dark)
  Icon: FileText 📊
  Mood: Traditional, formal, structured

Cost Accounting → Terra Cotta (#C77A58 light / #C77A58 dark at 80% opacity)
  Icon: Calculator 🏭
  Mood: Manufacturing, tangible, operational

Management Accounting → Cerulean (#00A5CF light / #0ea5e9 dark)
  Icon: BarChart3 📈
  Mood: Analytical, strategic, data-driven

Financial Management → Bamboo Green (#6B8E6F light / #10b981 dark)
  Icon: Briefcase 💰
  Mood: Growth, investment, prosperity
```

#### Primary Moo Branding

```css
/* Moo Brand Identity */
--moo-primary: #2563eb;        /* Electric Blue - primary CTAs */
--moo-secondary: #00A5CF;      /* Cerulean - brand identity */
--moo-accent: #0ea5e9;         /* Bright Cyan - interactive */
--moo-success: #10b981;        /* Emerald - calculations, success */

/* Backgrounds (Light Mode) */
--moo-bg-light: #F5F3F0;       /* Rice Paper - warm, inviting */
--moo-card-light: #ffffff;     /* Pure White - cards */
--moo-surface-light: #f8fafc;  /* Pearl - subtle sections */

/* Backgrounds (Dark Mode) */
--moo-bg-dark: #0a1628;        /* Navy Deep - family favorite */
--moo-surface-dark: #0f1d2e;   /* Night Sky - content areas */
--moo-card-dark: #1e293b;      /* Dawn Approach - elevated cards */

/* Text (Light Mode) */
--moo-text-primary-light: #0f172a;   /* Black Ink */
--moo-text-secondary-light: #475569; /* Body text */
--moo-text-tertiary-light: #64748b;  /* Supporting */

/* Text (Dark Mode) */
--moo-text-primary-dark: #f8fafc;    /* Primary headings */
--moo-text-secondary-dark: #cbd5e1;  /* Body text */
--moo-text-tertiary-dark: #94a3b8;   /* Supporting */
```

### Voice & Tone for Moo

Based on COW_Voice_Tone_Guide_v3.md:

**Moo's Voice:**
- **Rigorous but Accessible** - Explain technical concepts clearly
- **Confident but Humble** - Show expertise, acknowledge limitations
- **Warm but Professional** - Helpful colleague, not salesy
- **Direct but Kind** - Get to the point without being brusque

**Examples:**

❌ **Too Technical:**
"Implementing differential cost analysis requires marginal contribution margin optimization across heterogeneous production schedules."

❌ **Too Simple:**
"We make accounting easy!"

✅ **Moo Voice:**
"Break-even analysis helps you find the sales volume where revenue equals costs. Let me show you how to calculate this for your business."

---

## UI Design Specification

### Header Navigation

```
┌────────────────────────────────────────────────────────────┐
│  🐮 Moo - Financial Intelligence Assistant                 │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Learning Mode│  │ Project Mode │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                              │
│  Discipline Focus:                                          │
│  [Financial Acct] [Cost Acct] [Mgmt Acct] [Fin Mgmt] [All] │
└────────────────────────────────────────────────────────────┘
```

### Learning Mode - Welcome Screen

```
┌────────────────────────────────────────────┐
│                                             │
│              🐮                             │
│         Welcome to Moo                      │
│   Financial Intelligence Assistant          │
│                                             │
│  Master accounting & finance concepts       │
│  through interactive learning               │
│                                             │
└────────────────────────────────────────────┘

Financial Accounting
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📊 Accounting   │ │ 📝 Journal      │ │ 💰 Accrual vs   │
│    Equation     │ │    Entries      │ │    Cash Basis   │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Cost Accounting
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🏭 Activity-    │ │ 💲 Product      │ │ 📦 FIFO vs      │
│    Based        │ │    Costing      │ │    LIFO         │
│    Costing      │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Management Accounting
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📈 Break-Even   │ │ ⚖️  Make-or-Buy │ │ 🎯 Relevant     │
│    Analysis     │ │    Decisions    │ │    Costs        │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Financial Management
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 💼 Net Present  │ │ 💰 Investment   │ │ ⏰ Time Value   │
│    Value        │ │    Projects     │ │    of Money     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Integration
┌──────────────────────────────────────────┐
│ ✨ Show how all four disciplines work    │
│    together in a business decision       │
└──────────────────────────────────────────┘
```

### Side Panel - Progress Tracker

```
┌─────────────────────────┐
│   Learning Progress     │
├─────────────────────────┤
│                         │
│ ✓ Financial (2/8)       │
│   ○○○○○○●●              │
│                         │
│ ✓ Cost (1/8)            │
│   ○○○○○○○●              │
│                         │
│ ○ Management (0/8)      │
│   ○○○○○○○○              │
│                         │
│ ○ Financial Mgmt (0/6)  │
│   ○○○○○○                │
│                         │
├─────────────────────────┤
│  Current Topic:         │
│  Break-Even Analysis    │
│                         │
│  Difficulty:            │
│  ●●○  Intermediate      │
│                         │
├─────────────────────────┤
│  Quick Reference:       │
│  📖 Formulas            │
│  📚 Glossary            │
│  🔗 Related Concepts    │
└─────────────────────────┘
```

### Chat Interface with Financial Formatting

Moo's responses should support formatted financial tables:

```
User: "Calculate depreciation for equipment costing $100k,
       salvage $10k, 5-year life using straight-line"

Moo:
═══════════════════════════════════════════════
DEPRECIATION CALCULATION - STRAIGHT-LINE METHOD
═══════════════════════════════════════════════

Equipment Cost:        $100,000
Less: Salvage Value:   ($10,000)
Depreciable Base:      $90,000

Useful Life:           5 years
Annual Depreciation:   $18,000

DEPRECIATION SCHEDULE
Year | Depreciation | Accumulated | Book Value
─────┼──────────────┼─────────────┼───────────
  1  |   $18,000    |   $18,000   |  $82,000
  2  |   $18,000    |   $36,000   |  $64,000
  3  |   $18,000    |   $54,000   |  $46,000
  4  |   $18,000    |   $72,000   |  $28,000
  5  |   $18,000    |   $90,000   |  $10,000

JOURNAL ENTRY (Annual):
Depreciation Expense         18,000
    Accumulated Depreciation         18,000

INTERPRETATION:
This creates a tax shield of $4,500 annually
(at 25% tax rate) - important for NPV calculations.

CROSS-DISCIPLINE CONNECTIONS:
📊 Financial Accounting: Appears on balance sheet
                        (asset) and income statement
                        (expense)
🏭 Cost Accounting:     Included in overhead if
                        manufacturing equipment
💰 Financial Mgmt:      Tax shield affects NPV in
                        capital budgeting

Would you like me to:
• Show double-declining balance method?
• Calculate NPV including tax shield?
• Explain when to use each method?
```

---

## Component Specification

### 1. ModeSelector Component

```tsx
// components/moo/ModeSelector.tsx
interface ModeSelectorProps {
  mode: 'learning' | 'project'
  onChange: (mode: 'learning' | 'project') => void
}

// Design:
// - Toggle between Learning and Project modes
// - Electric Blue (#2563eb) for active mode
// - Subtle transition animations
// - COW brand rounded corners (12px)
```

### 2. DisciplineFilter Component

```tsx
// components/moo/DisciplineFilter.tsx
interface DisciplineFilterProps {
  discipline: Discipline
  onChange: (discipline: Discipline) => void
}

// Design:
// - 5 buttons: Financial, Cost, Management, Fin Mgmt, All
// - Color-coded by discipline (see color palette above)
// - Pill-shaped buttons with icons
// - Active state with brand colors
```

### 3. SuggestedPrompts Component

```tsx
// components/moo/SuggestedPrompts.tsx
interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[]
  onSelect: (prompt: string) => void
  disciplineFilter: Discipline
}

// Design:
// - Grid layout (3 columns on desktop, 1 on mobile)
// - Card design with hover effects
// - Icon + title + prompt text
// - Filtered by selected discipline
// - COW card styling (rounded-2xl, glassmorphic)
```

### 4. ProgressTracker Component

```tsx
// components/moo/ProgressTracker.tsx
interface ProgressTrackerProps {
  conceptsMastered: Record<Discipline, number>
  totalConcepts: Record<Discipline, number>
  currentTopic?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

// Design:
// - Side panel (collapsible on mobile)
// - Progress bars with discipline colors
// - Current topic highlight
// - Quick reference links
```

### 5. FinancialTable Component

```tsx
// components/moo/FinancialTable.tsx
interface FinancialTableProps {
  headers: string[]
  rows: (string | number)[][]
  title?: string
  footer?: string
}

// Design:
// - Monospace font for numbers
// - Right-aligned currency
// - Zebra striping for readability
// - Professional accounting formatting
// - Responsive (horizontal scroll on mobile)
```

---

## Implementation Phases

### Phase 1: UI Foundation (This Sprint - 3 Days)

**Day 1: Mode & Discipline System**
- [ ] Add mode state (learning/project) to MooPage
- [ ] Create ModeSelector component with COW styling
- [ ] Create DisciplineFilter component with color coding
- [ ] Update suggested prompts array with 13 discipline-specific prompts
- [ ] Filter prompts based on selected discipline

**Day 2: Enhanced Welcome Screen**
- [ ] Redesign welcome screen with COW brand v3.0
- [ ] Organize prompts by discipline with icons
- [ ] Add Moo brand identity (icon, tagline)
- [ ] Implement responsive grid layout
- [ ] Add hover animations and transitions

**Day 3: Progress Tracking & Polish**
- [ ] Create ProgressTracker side panel component
- [ ] Add session storage for concept tracking
- [ ] Implement collapsible sidebar for mobile
- [ ] Polish all styling with COW brand colors
- [ ] Test light/dark mode consistency

**Deliverable:** Fully branded Moo UI with dual modes, discipline filters, and organized prompts

---

### Phase 2: Backend Integration (Next Sprint - 5 Days)

**Days 1-2: API Setup**
- [ ] Create FastAPI backend structure
- [ ] Set up Claude API integration
- [ ] Implement enhanced system prompts per discipline
- [ ] Add mode-specific prompt engineering
- [ ] Test API endpoints

**Days 3-4: Calculation Tools**
- [ ] Implement 3 financial accounting tools
- [ ] Implement 3 cost accounting tools
- [ ] Implement 3 management accounting tools
- [ ] Implement 3 financial management tools
- [ ] Add formatted output generation

**Day 5: Knowledge Base**
- [ ] Create RAG system with FAISS
- [ ] Add 40 knowledge base documents (10 per discipline)
- [ ] Test context retrieval accuracy
- [ ] Integrate with Claude API
- [ ] End-to-end testing

**Deliverable:** Working backend with calculations and knowledge retrieval

---

### Phase 3: Project Mode (Future Sprint)

- [ ] 6 project templates
- [ ] Project workflow UI
- [ ] Assumption tracking
- [ ] PDF export functionality
- [ ] Project state management

---

## Success Criteria

### Phase 1 (UI)
- ✅ Mode selector works smoothly
- ✅ Discipline filter updates prompts correctly
- ✅ All 13 suggested prompts display properly
- ✅ Side panel tracks session progress
- ✅ COW brand v3.0 colors applied consistently
- ✅ Works in light and dark mode
- ✅ Responsive on mobile, tablet, desktop

### Phase 2 (Backend)
- ✅ API responds in <2 seconds
- ✅ Calculations match Excel accuracy (100%)
- ✅ RAG retrieves relevant context >80% of time
- ✅ Formatted output displays properly
- ✅ Cross-discipline connections shown appropriately

---

## Technical Debt & Notes

**Current State:**
- MooPage exists with basic chat interface
- Uses mock responses (setTimeout)
- Has 3 generic suggested prompts
- Basic COW styling (Deep Cyan)

**Changes Required:**
- Add mode and discipline state management
- Expand suggested prompts from 3 to 13
- Create 5 new components (ModeSelector, DisciplineFilter, etc.)
- Integrate discipline-specific color coding
- Add session storage for progress tracking
- Prepare backend structure for Phase 2

**Performance Considerations:**
- Session storage for progress (no backend needed yet)
- Lazy load discipline-specific knowledge when selected
- Optimize prompt filtering (memo hook)
- Debounce API calls in Phase 2

---

## Brand Alignment Checklist

### Colors ✅
- [ ] Electric Blue (#2563eb) for primary CTAs
- [ ] Cerulean (#00A5CF) for Moo brand identity
- [ ] Bright Cyan (#0ea5e9) for interactive elements
- [ ] Emerald (#10b981) for success/calculations
- [ ] Discipline-specific colors for filters
- [ ] Rice Paper (#F5F3F0) light mode background
- [ ] Navy Deep (#0a1628) dark mode background

### Typography ✅
- [ ] Light font weights (300-400)
- [ ] Clear hierarchy
- [ ] Monospace for financial tables
- [ ] Professional but approachable

### Voice ✅
- [ ] Rigorous but accessible
- [ ] Confident but humble
- [ ] Warm but professional
- [ ] Direct but kind

### Components ✅
- [ ] Rounded corners (12-20px)
- [ ] Glassmorphic effects where appropriate
- [ ] Generous spacing
- [ ] Hover states with smooth transitions
- [ ] Icon + text combinations

---

## Next Steps

1. **Today:** Update MooPage with mode selector and discipline filter
2. **Tomorrow:** Implement enhanced welcome screen with organized prompts
3. **Day 3:** Add progress tracker and finalize Phase 1
4. **Review:** User test with 3-5 people
5. **Plan Phase 2:** Backend API architecture

---

**Status:** Ready to implement Phase 1
**Priority:** High
**Dependencies:** None (UI only)
**Estimated Effort:** 3 days for Phase 1

---

*Built for COW Group - Transforming financial education through intelligent assistance*
