# Component Hierarchy: Comprehensive Onboarding

## Visual Tree Structure

```
ComprehensiveOnboardingContainer
│
├─ ComprehensiveOnboardingProvider (Context Wrapper)
│  │
│  └─ OnboardingContent
│     │
│     ├─ ComprehensiveProgressBar (Fixed Top Bar)
│     │  ├─ Overall Progress Bar
│     │  ├─ Phase Markers (Welcome, Wealth, Classification, Account)
│     │  └─ Current Step Indicator
│     │
│     ├─ Background Decorations (Animated Gradient Orbs)
│     │
│     └─ AnimatePresence (Framer Motion)
│        │
│        └─ Current Step Component (Dynamic Routing)
│           │
│           ├─ Step 1: Welcome
│           │  ├─ AnimatedOrb
│           │  │  ├─ Canvas (React Three Fiber)
│           │  │  │  └─ SiriOrb (3D Sphere with waves)
│           │  │  └─ Welcome Text
│           │  │
│           │  └─ Content Card
│           │     ├─ Name Input (with Label)
│           │     ├─ Guide Selection Grid
│           │     │  ├─ Moo Card
│           │     │  ├─ Fox Card
│           │     │  └─ Owl Card
│           │     └─ CTA Button "Begin Your Journey"
│           │
│           ├─ Step 2: Primary Intent
│           │  ├─ Header Section
│           │  │  ├─ Personalized Greeting
│           │  │  └─ Description Text
│           │  │
│           │  ├─ Intent Cards Grid (2 columns)
│           │  │  ├─ Build Wealth Card (TrendingUp icon)
│           │  │  ├─ Invest Assets Card (Coins icon)
│           │  │  ├─ Advisor Card (Users icon)
│           │  │  └─ Institutional Card (Building2 icon)
│           │  │
│           │  ├─ Continue Button
│           │  └─ Help Text
│           │
│           └─ Placeholder Steps (3-14)
│              ├─ Title
│              ├─ Description
│              └─ Navigation Buttons (Prev/Next)
```

## Data Flow

```
User Interaction
      ↓
Component Event Handler
      ↓
useComprehensiveOnboarding Hook
      ↓
Context Action (updateState, nextStep, etc.)
      ↓
Context State Update
      ↓
localStorage Persistence
      ↓
Component Re-render
      ↓
UI Update
```

## State Flow Example: Step 1 → Step 2

```
Step 1: Welcome
   ↓
User enters name: "Alice"
   ↓
updateState('firstName', 'Alice')
   ↓
User selects guide: "Moo"
   ↓
updateState('guideType', 'Moo')
speak(Moo, "Hello! I'm Moo...")
   ↓
User clicks "Begin Your Journey"
   ↓
completePhase('welcome')
nextStep()
   ↓
currentStep: 1 → 2
   ↓
AnimatePresence triggers exit animation
   ↓
Step 1 unmounts (audio stops)
   ↓
Step 2 mounts
   ↓
Auto-play intro: "Nice to meet you, Alice!"
   ↓
User selects intent: "Build Long-Term Wealth"
   ↓
updateState('primaryIntent', 'wealth')
updateState('flowType', 'wealth_journey')
updateState('skipWealthJourney', false)
speak(Moo, "Build long-term wealth through...")
   ↓
User clicks "Continue"
   ↓
nextStep()
   ↓
currentStep: 2 → 3
   ↓
Route to Wealth Journey Phase (Step 3)
```

## Routing Logic

```
Step 2: Primary Intent Selection
      ↓
      ├─ "Build Long-Term Wealth"
      │     flowType: 'wealth_journey'
      │     skipWealthJourney: false
      │     → Step 3 (Age & Experience)
      │
      ├─ "Invest in Performance Assets"
      │     flowType: 'direct_invest'
      │     skipWealthJourney: true
      │     → Step 11 (Investor Classification)
      │
      ├─ "Manage Client Portfolios"
      │     flowType: 'advisor'
      │     skipWealthJourney: true
      │     → Step 11 (Investor Classification)
      │
      └─ "Institutional Investment"
            flowType: 'institutional'
            skipWealthJourney: true
            → Step 11 or Contact Form
```

## Progress Bar Phase Mapping

```
Full Flow (wealth_journey):
┌─────────┬─────────────┬────────────────┬─────────┐
│ Welcome │ Your Journey│ Classification │ Account │
│ (1-2)   │   (3-10)    │    (11-13)     │  (14)   │
└─────────┴─────────────┴────────────────┴─────────┘

Direct Invest Flow (skipWealthJourney = true):
┌─────────┬────────────────┬─────────┐
│ Welcome │ Classification │ Account │
│ (1-2)   │    (11-13)     │  (14)   │
└─────────┴────────────────┴─────────┘
```

## Audio Integration Flow

```
Component Mount
      ↓
useGuideSpeech Hook Initialized
      ↓
Auto-play Effect Triggered (500ms delay)
      ↓
speak(guideType, autoPlayText)
      ↓
speakWithGuideVoice() called
      ↓
Web Speech API: SpeechSynthesisUtterance
      ↓
onSpeechStart callback → setIsSpeaking(true)
      ↓
AnimatedOrb responds to isSpeaking prop
      ↓
Speech completes
      ↓
onSpeechEnd callback → setIsSpeaking(false)
      ↓
User Interaction (button click, guide selection)
      ↓
Manual speak() call
      ↓
New speech initiated (previous stops)
```

## Style Inheritance

```
Global Theme Provider
      ↓
Tailwind CSS Classes
      ↓
Container Background Gradient
      ↓
Card Blur Effects (backdrop-blur)
      ↓
Dark Mode Classes (dark:)
      ↓
Component-Specific Styles
      ↓
Framer Motion Inline Styles
```

## Responsive Breakpoint Behavior

```
Mobile (< 768px):
- Progress bar: Compact, smaller text
- Guide grid: 1 column, stacked
- Intent grid: 1 column, stacked
- Padding: p-4
- Font sizes: text-lg headers

Tablet (768px - 1023px):
- Progress bar: Medium spacing
- Guide grid: 2 columns
- Intent grid: 2 columns
- Padding: p-6
- Font sizes: text-xl headers

Desktop (≥ 1024px):
- Progress bar: Full spacing
- Guide grid: 3 columns
- Intent grid: 2 columns (larger cards)
- Padding: p-8 to p-12
- Font sizes: text-3xl to text-4xl headers
```

## Animation Sequence Timeline

### Step 1 Welcome

```
Time (ms)
0     Component mounts, opacity: 0
100   Orb fades in
300   Content card fades in
500   Auto-play speech begins
800   Name input becomes interactive
1000  Guide cards stagger in (delay: index * 100ms)
1200  CTA button fades in
```

### Step 2 Primary Intent

```
Time (ms)
0     Component mounts, opacity: 0
200   Header fades in from top
300   Intent cards begin staggering in
400   Card 1 (Build Wealth) appears
500   Card 2 (Invest Assets) appears
600   Card 3 (Advisor) appears
700   Card 4 (Institutional) appears
800   Continue button fades in
1000  Auto-play speech begins
```

## Context API Method Reference

### Read Operations
```typescript
state.currentStep          // Current step number (1-14)
state.firstName            // User's name
state.guideType           // Selected guide
state.primaryIntent       // Selected intent
state.flowType            // Determined flow type
state.skipWealthJourney   // Skip flag for direct investors
state.completedPhases     // Array of completed phase IDs
```

### Write Operations
```typescript
updateState(key, value)   // Update single state field
nextStep()                // Increment currentStep
prevStep()                // Decrement currentStep
goToStep(number)          // Jump to specific step
completePhase(phaseId)    // Mark phase as complete
resetOnboarding()         // Clear all state
completeOnboarding()      // Finalize and clear localStorage
```

## Event Handler Patterns

### Step 1 Welcome
```typescript
handleGuideSelect(guide) {
  setSelectedGuide(guide)
  speak(guide, introText)
}

handleNext() {
  stop()  // Stop audio
  updateState('firstName', firstName)
  updateState('guideType', selectedGuide)
  completePhase('welcome')
  nextStep()
}
```

### Step 2 Primary Intent
```typescript
handleIntentSelect(option) {
  setSelectedIntent(option.id)
  speak(guideType, option.audioDescription)
}

handleNext() {
  stop()
  updateState('primaryIntent', selectedIntent)
  updateState('flowType', selectedOption.flowType)
  updateState('skipWealthJourney', selectedOption.skipWealthJourney)
  nextStep()
}
```

## Cleanup Patterns

### Component Unmount
```typescript
useEffect(() => {
  return () => {
    stop()  // Stop any playing audio
  }
}, [stop])
```

### Step Change
```typescript
useEffect(() => {
  // Clear spoken text history when step changes
  clearSpokenText()
}, [state.currentStep])
```

## Error Handling

### State Validation
```typescript
// Step 1
setIsFormValid(!!firstName && !!selectedGuide)

// Step 2
if (!selectedIntent) return  // Early return if invalid
```

### Audio Fallback
```typescript
// If TTS fails, UI still functions
// User can read text visually
// No blocking errors
```

### localStorage Fallback
```typescript
// If localStorage fails (Safari private mode)
// Falls back to in-memory state
// No app crash
```

---

This hierarchy document provides a complete visual reference for understanding how all components interact in the comprehensive onboarding system.
