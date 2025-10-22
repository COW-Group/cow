# Comprehensive Onboarding Design: COW Products Platform
## Hybrid Wealth Journey + Investor Classification Flow

**Version:** 1.0
**Date:** October 21, 2025
**Status:** Design Specification

---

## Executive Summary

This document outlines a comprehensive onboarding flow that combines:
1. **Personal wealth journey** (from mycow-app) - Understanding user financial goals and status
2. **Investor classification** (from products-site) - Regulatory compliance and sophistication sorting
3. **Audio-assisted guidance** - TTS support for accessibility and engagement
4. **COW Brand v3.0** - Luminance Layers design system with Sumi-e Sky + Earth aesthetic

### Key Objectives
- ✅ Properly classify investors for regulatory compliance (SEC, MiFID II, etc.)
- ✅ Understand user wealth status and financial goals
- ✅ Create personalized dashboard and product recommendations
- ✅ Maintain engagement through audio-guided interactive experience
- ✅ Follow "educate, not promote" content strategy

---

## Onboarding Flow Structure

### Phase 1: Welcome & Intent (Steps 1-2)
**Purpose:** Establish connection and understand user's primary goal

#### Step 1: Welcome
- **Component:** Animated welcome with guide character
- **Audio:** "Welcome to MyCOW! I'm [Guide Name], your wealth journey companion."
- **Content:**
  - Brief intro to COW platform
  - Choice of guide character (Moo, Fox, Owl)
  - Name input
- **Design:** Sumi-e aesthetic, animated 3D orb, dark/light mode
- **Duration:** 30 seconds
- **CTA:** "Begin Your Journey"

#### Step 2: Primary Intent
- **Question:** "What brings you to COW today?"
- **Options:**
  1. "Build long-term wealth" → Personal wealth journey track
  2. "Invest in performance assets" → Investor classification track
  3. "Manage client portfolios" → Advisor track (skip to investor classification)
  4. "Institutional investment" → Institutional track (skip to classification)
- **Audio-guided:** Guide explains each option
- **Design:** Large card selection with icons
- **Routing Logic:**
  - Personal wealth → Continue to Step 3 (wealth journey)
  - Investment focus → Skip to Step 11 (regulatory classification)
  - Advisor/Institutional → Skip to Step 11 with pre-selected type

---

### Phase 2: Personal Wealth Journey (Steps 3-10)
**Purpose:** Understand financial situation and goals
**Audience:** Users who selected "Build long-term wealth"
**Based on:** mycow-app onboarding

#### Step 3: Age & Experience
- **Questions:**
  1. "Are you 18 or older?" (Yes/No)
  2. "Have you invested before?" (Yes/No/Learning)
- **Audio:** Guide explains importance of experience level
- **Routing:** If under 18, redirect to educational resources

#### Step 4: Wealth Class & Life Stage
- **Wealth Class Selection:**
  - Beginner: "Just starting my wealth journey"
  - Intermediate: "Building my financial foundation"
  - Advanced: "Growing established wealth"
- **Life Stage:**
  - Early Career, Mid-Career, Peak Earning, Pre-Retirement, Retirement
- **Visual:** Illustrated journey path

#### Step 5: Life Goals
- **Multi-select goals:**
  - Financial Security
  - Retirement Planning
  - Education Funding
  - Home Ownership
  - Travel & Experiences
  - Legacy Building
  - Business Ownership
- **Audio:** "Select all that matter to you"

#### Step 6: Cash Flow Analysis
- **Inputs:**
  - Monthly income
  - Monthly expenses
  - Current assets
  - Current liabilities
- **Visual:** Real-time net worth calculator
- **Audio:** "This helps us personalize your strategy"

#### Step 7: Skills to Develop
- **Select areas to improve:**
  - Employment income
  - Self-employment/freelance
  - Business building
  - Investing knowledge
- **Purpose:** Identify learning path

#### Step 8: Financial Freedom Goals
- **Five-tier goal setting:**
  - Bare Minimum: "I can survive"
  - Lower Target: "I'm comfortable"
  - Target: "I'm thriving"
  - Ideal: "I have flexibility"
  - Luxury: "I have abundance"
- **Input:** Monthly income target for each tier
- **Visual:** Progressive bar chart

#### Step 9: Location & Preferences
- **Country selection** (with flag icons)
- **Currency preference**
- **Investment timeframe:** Short-term (1-3y), Medium (3-10y), Long-term (10y+)
- **Purpose:** Regional customization + prep for regulatory

#### Step 10: Risk & Stress Profile
- **Questions:**
  1. "Can you handle market volatility?" (Scale: Definitely → No)
  2. "How do you feel about your financial situation?" (Scale: Stressed → Confident)
- **Purpose:** Risk tolerance assessment
- **Audio:** Guide provides context for each question

---

### Phase 3: Investor Classification (Steps 11-13)
**Purpose:** Regulatory compliance and sophistication sorting
**Audience:** All users (required for platform access)
**Based on:** products-site backup onboarding

#### Step 11: Investor Type Classification
**Question:** "How would you classify yourself as an investor?"

**Options (with detailed cards):**

##### 1. Individual Investor
- **Icon:** User icon
- **Subtitle:** "Personal Portfolio"
- **Description:** "Individual investors seeking portfolio diversification with real world asset exposure"
- **Minimum Investment:** $1,000
- **Regulatory:** Standard retail protections
- **Benefits:**
  - Diversified portfolio access
  - Educational resources
  - Basic analytics
- **Route to:** Standard retail dashboard

##### 2. Accredited Investor (US)
- **Icon:** Shield icon
- **Subtitle:** "SEC Regulation D 506(c)"
- **Description:** "$200K+ annual income or $1M+ net worth. Access to all token offerings with sophisticated investor benefits"
- **Minimum Investment:** $10,000
- **Regulatory:** SEC verification required
- **Requirements:**
  - Income verification OR
  - Net worth verification
- **Benefits:**
  - Access to all offerings
  - Priority allocations
  - Reduced fees
  - Advanced analytics
- **Route to:** Accredited verification flow

##### 3. International Investor (EU/Global)
- **Icon:** Globe icon
- **Subtitle:** "MiFID II Framework"
- **Description:** "MiFID II suitability assessment with European passporting benefits and cross-border compliance"
- **Minimum Investment:** €5,000
- **Regulatory:** MiFID II assessment
- **Requirements:**
  - Suitability questionnaire
  - Experience verification
  - Appropriateness test
- **Benefits:**
  - Cross-border access
  - EUR/GBP denominated
  - European regulatory protection
- **Route to:** MiFID II assessment

##### 4. Financial Advisor
- **Icon:** Users icon
- **Subtitle:** "Professional Management"
- **Description:** "Licensed advisors managing client portfolios with multi-account dashboard and reporting"
- **Minimum Investment:** $50,000 AUM
- **Regulatory:** RIA/BD verification
- **Requirements:**
  - Professional credentials
  - License verification (Series 65/66/7)
  - E&O insurance proof
- **Benefits:**
  - Multi-client dashboard
  - White-label options
  - Revenue sharing (50-75%)
  - Compliance tools
- **Route to:** Advisor verification & client linking

##### 5. Institutional Investor
- **Icon:** Building icon
- **Subtitle:** "Enterprise Solutions"
- **Description:** "Investment funds, family offices, and institutional asset managers with professional-grade tools"
- **Minimum Investment:** $1,000,000
- **Regulatory:** QIB/QP status
- **Requirements:**
  - Entity documentation
  - AUM verification
  - Qualified status proof
- **Benefits:**
  - Custom mandates
  - Prime brokerage services
  - Dedicated relationship manager
  - API access
- **Route to:** Concierge onboarding (white-glove)

**Audio:** Guide explains each classification with examples
**Design:** Expandable cards, comparison table option

#### Step 12: Investment Experience Assessment
**Purpose:** Further sophistication profiling

**Questions (adapt based on Step 11 selection):**

1. **"What's your investment experience?"**
   - Beginner: New to investing
   - Intermediate: Stocks, bonds, ETFs
   - Advanced: Alternative investments
   - Professional: Investment industry professional

2. **"What's your primary investment goal?"**
   - Wealth Preservation: Protect capital
   - Income Generation: Regular distributions
   - Growth: Capital appreciation
   - Diversification: Balance risk

3. **"What's your intended allocation to performance RWAs?"**
   - Exploring: < 5%
   - Moderate: 5-15%
   - Significant: 15-30%
   - Substantial: > 30%

**Audio:** Context for each question
**Visual:** Progress indicator showing completion

#### Step 13: Regulatory Acknowledgment
**Purpose:** Legal compliance and disclosure

**Content (varies by jurisdiction):**

**For US Accredited:**
- Accreditation verification requirement
- Risk disclosure acknowledgment
- Liquidity considerations
- Suitability statement

**For International (MiFID II):**
- Appropriateness test
- Product complexity disclosure
- Cross-border considerations
- Currency risk disclosure

**For Retail:**
- Retail investor protections
- Risk warnings
- SIPC/insurance coverage
- Regulatory framework

**Components:**
- Scrollable legal text
- "I understand and acknowledge" checkboxes
- Download disclosure documents
- Record of acknowledgment

**Audio:** "Please review these important disclosures"

---

### Phase 4: Account Setup (Step 14)
**Purpose:** Create account and finalize onboarding

#### Step 14: Account Creation

**If Authenticated (returning user):**
- Link onboarding data to existing account
- Update profile with new information
- Route to personalized dashboard

**If Unauthenticated (new user):**
- **Options:**
  1. Sign Up (create new account)
  2. Sign In (existing account)

- **Sign Up Fields:**
  - Email
  - Phone number
  - Password
  - Terms acceptance
  - Privacy policy acceptance

- **Plan Selection:**
  - **Free Plan:** $0/month
    - Basic wealth planning
    - Educational content
    - Limited analytics
  - **Premium Plan:** $15/month (RECOMMENDED)
    - Full Moo Mix access
    - Learn modules
    - Advanced analytics
    - Personalized guidance

**After Auth:**
- Show journey map preview
- Highlight accessible features
- "Welcome [Name], [Wealth Class] Hero!"
- Redirect to dashboard (3-second animated transition)

---

## User Flows & Routing Logic

### Flow 1: Personal Wealth Builder
**Path:** Step 1 → 2 (select "Build wealth") → 3-10 → 11 (Individual) → 12 → 13 → 14
**Outcome:** Personal wealth dashboard with goal tracking, learning path, Moo Mix access
**Compliance:** Standard retail protections
**Typical Time:** 8-12 minutes

### Flow 2: Sophisticated Investor
**Path:** Step 1 → 2 (select "Invest in assets") → 11 (Accredited/International) → 12 → 13 → 14
**Outcome:** Full platform access, all product verticals, advanced analytics
**Compliance:** Accreditation verification or MiFID II assessment
**Typical Time:** 4-6 minutes
**Follow-up:** Verification process (separate flow)

### Flow 3: Financial Advisor
**Path:** Step 1 → 2 (select "Manage clients") → 11 (Advisor) → 12 → 13 → 14
**Outcome:** Multi-client dashboard, white-label options, advisor tools
**Compliance:** RIA/BD verification, license check
**Typical Time:** 5-7 minutes
**Follow-up:** Professional verification + client linking setup

### Flow 4: Institutional Investor
**Path:** Step 1 → 2 (select "Institutional") → 11 (Institutional) → Contact form
**Outcome:** Concierge onboarding initiated
**Compliance:** QIB/QP verification
**Typical Time:** 2-3 minutes
**Follow-up:** Relationship manager outreach within 24 hours

---

## Technical Architecture

### Context Structure
```typescript
export type ComprehensiveOnboardingState = {
  // Progress
  currentStep: number
  totalSteps: number
  completedPhases: ('welcome' | 'wealth' | 'classification' | 'account')[]

  // Phase 1: Welcome
  firstName: string
  guideType: 'Moo' | 'Fox' | 'Owl' | null
  primaryIntent: 'wealth' | 'invest' | 'advisor' | 'institutional' | null

  // Phase 2: Wealth Journey (optional - only for wealth track)
  isAdult: boolean | null
  hasInvestedBefore: boolean | null
  wealthClass: 'Beginner' | 'Intermediate' | 'Advanced' | null
  lifeStage: string | null
  lifeGoals: { id: string; name: string; selected: boolean }[]
  monthlyIncome: number | null
  monthlyExpenses: number | null
  assets: number | null
  liabilities: number | null
  skillsToImprove: string[]
  financialFreedomGoals: {
    bareMinimum: number | null
    lowerTarget: number | null
    target: number | null
    ideal: number | null
    luxury: number | null
  }
  riskTolerance: string | null
  stressLevel: string | null

  // Phase 3: Investor Classification (required for all)
  country: string | null
  currency: string | null
  investmentTimeframe: string | null
  investorType: 'individual' | 'accredited' | 'international' | 'advisor' | 'institutional' | null
  investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional' | null
  primaryInvestmentGoal: 'preservation' | 'income' | 'growth' | 'diversification' | null
  intendedAllocation: 'exploring' | 'moderate' | 'significant' | 'substantial' | null
  regulatoryAcknowledgments: string[]
  disclosuresAccepted: boolean

  // Phase 4: Account
  phoneNumber: string
  email: string
  isPremium: boolean
  isAuthenticated: boolean
  userId: string | null

  // Routing
  flowType: 'wealth_journey' | 'direct_invest' | 'advisor' | 'institutional' | null
  skipWealthJourney: boolean
}
```

### Component Structure
```
src/components/onboarding-v2/
├── comprehensive-onboarding-container.tsx      # Main container
├── comprehensive-onboarding-context.tsx        # State management
├── comprehensive-progress-bar.tsx              # Multi-phase progress
├── phase-welcome/
│   ├── step1-welcome.tsx
│   └── step2-primary-intent.tsx
├── phase-wealth/                                # Optional phase
│   ├── step3-age-experience.tsx
│   ├── step4-wealth-class.tsx
│   ├── step5-life-goals.tsx
│   ├── step6-cash-flow.tsx
│   ├── step7-skills.tsx
│   ├── step8-freedom-goals.tsx
│   ├── step9-location-prefs.tsx
│   └── step10-risk-profile.tsx
├── phase-classification/                        # Required phase
│   ├── step11-investor-type.tsx
│   ├── step12-experience-assessment.tsx
│   └── step13-regulatory-acknowledgment.tsx
├── phase-account/
│   └── step14-account-setup.tsx
└── shared/
    ├── investor-type-card.tsx
    ├── regulatory-disclosure.tsx
    └── journey-map-preview.tsx
```

---

## Design System Application

### Color Palette (COW Brand v3.0)
```css
/* Dark Mode (Primary) */
--background-primary: linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%);
--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
--accent-primary: #2563eb;      /* Electric Blue - CTAs */
--accent-success: #059669;      /* Emerald - Success states */
--brand-cerulean: #00A5CF;      /* Logo, brand features */
--earth-warm-stone: #9B8B7E;    /* Footer, warm sections */

/* Light Mode */
--background-primary: #ffffff;
--text-primary: #0f172a;
--text-secondary: #475569;
--accent-primary: #2563eb;
--accent-success: #059669;
--brand-cerulean: #007BA7;
--earth-warm-stone: #9B8B7E;
```

### Typography
- **Headers:** Inter 300 (Light) or Spectral 400
- **Body:** Inter 400 (Regular)
- **Emphasis:** Inter 600 (Semibold)
- **Scale:** 12px, 14px, 16px, 20px, 24px, 32px, 48px, 64px

### Spacing
- **Card padding:** 24px - 48px
- **Section margins:** 48px - 96px
- **Component spacing:** 16px - 32px
- **Negative space:** 60-70% of viewport

### Animations
- **Page transitions:** Framer Motion slide-fade (0.3s ease-out)
- **Card hovers:** translateY(-2px) + shadow increase
- **Progress:** Smooth width transitions
- **TTS sync:** Highlight words as spoken

### Audio Integration
- **Auto-play:** On step entry (can be disabled)
- **Manual trigger:** Click orb to replay
- **Voice selection:** Based on guide type
- **Speed control:** User adjustable
- **Transcript:** Available as text alternative

---

## Regulatory Compliance Matrix

| Investor Type | Jurisdiction | Verification | Disclosures | Min Investment |
|---------------|-------------|--------------|-------------|----------------|
| Individual | US/Global | Email + Phone | Standard retail | $1,000 |
| Accredited | US | Income/NW docs | Reg D 506(c) | $10,000 |
| International | EU/UK | MiFID II | Appropriateness | €5,000 |
| Advisor | US | RIA/BD license | Fiduciary | $50K AUM |
| Institutional | Global | QIB/QP status | Custom | $1M |

---

## Success Metrics

### Completion Rates
- **Target:** 70% completion rate (start → finish)
- **Benchmark:** 55% (industry average)
- **Track by:** Flow type, step dropout

### Engagement
- **Audio usage:** 60%+ enable TTS
- **Time on task:** 8-12 min (wealth), 4-6 min (invest)
- **Guide selection:** Distribution across Moo/Fox/Owl

### Classification Accuracy
- **Self-classification:** % accurate vs. verification
- **Compliance:** 100% regulatory acknowledgment
- **Follow-through:** % completing verification

### User Satisfaction
- **NPS score:** > 50
- **Clarity rating:** > 4.5/5
- **Audio experience:** > 4.0/5

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- Create comprehensive context
- Build progress tracking
- Implement Phase 1 (Welcome)
- Test audio integration

### Phase 2: Wealth Journey (Week 2)
- Build all Phase 2 steps (3-10)
- Integrate with existing mycow-app components
- Test flow routing logic
- Validate calculations

### Phase 3: Classification (Week 3)
- Build Phase 3 steps (11-13)
- Create regulatory disclosure components
- Implement verification routing
- Test compliance requirements

### Phase 4: Account & Integration (Week 4)
- Build Phase 4 (Step 14)
- Integrate with auth system
- Connect to dashboard routing
- E2E testing

### Phase 5: Polish & Launch (Week 5)
- Audio fine-tuning
- Animation polish
- Accessibility audit (WCAG AAA)
- Load testing
- Soft launch to 10% traffic

---

## Open Questions for Product Team

1. **Institutional Flow:** Should we have a full onboarding or immediate concierge handoff?
2. **Verification Timing:** Collect documents during onboarding or after?
3. **Education Content:** How much to show before account creation?
4. **Social Proof:** Include user testimonials/stats in onboarding?
5. **Mobile Experience:** Simplified flow or full parity?
6. **Data Persistence:** Save progress for incomplete onboarding?
7. **A/B Testing:** Which variations to test first?

---

**Next Steps:**
1. Review this design with stakeholders
2. Confirm regulatory requirements with compliance team
3. Validate UX flow with 5-10 user tests
4. Begin Phase 1 implementation
