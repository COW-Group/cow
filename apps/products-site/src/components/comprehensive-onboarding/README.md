# Comprehensive Onboarding Flow - Phase 1 Implementation

## Overview

This directory contains the implementation of **Phase 1: Welcome & Primary Intent** (Steps 1-2) of the comprehensive onboarding flow for the COW Products Platform.

## Design Reference

- **Design Doc**: `/Users/likhitha/Projects/cow/apps/products-site/COMPREHENSIVE_ONBOARDING_DESIGN.md`
- **Voice & Tone Guide**: `/Users/likhitha/Projects/cow/COW Communications/COW_Voice_Tone_Guide_v3.md`
- **Context**: `src/contexts/comprehensive-onboarding-context.tsx`

## Implemented Components

### Main Container
- **`comprehensive-onboarding-container.tsx`**
  - Main container that orchestrates the entire onboarding flow
  - Wraps content in `ComprehensiveOnboardingProvider`
  - Handles step routing based on `flowType`
  - Implements Framer Motion page transitions
  - Includes animated background decorations

### Progress Tracking
- **`comprehensive-progress-bar.tsx`**
  - Multi-phase progress indicator
  - Shows: Welcome (1-2), Wealth (3-10), Classification (11-13), Account (14)
  - Dynamically adapts based on flow type (shows/hides Wealth phase for direct investors)
  - Highlights current phase with animated markers
  - Overall progress bar with smooth transitions

### Phase 1: Welcome (Steps 1-2)

#### Step 1: Welcome
**File**: `phase-welcome/step1-welcome.tsx`

**Features**:
- Animated welcome screen with guide character selection
- Three guide options: Moo (Calm & Thoughtful), Fox (Quick & Strategic), Owl (Wise & Analytical)
- Name input field with validation
- Integrated TTS audio: "Welcome to MyCOW! I'm [Guide Name], your wealth journey companion."
- CTA: "Begin Your Journey"
- Uses `AnimatedOrb` component from existing onboarding
- Follows COW Voice: Warm but Professional, Direct but Kind

**Audio Integration**:
- Auto-plays welcome message on component mount
- Speaks guide-specific introduction when guide is selected
- Uses `useGuideSpeech` hook for TTS control

#### Step 2: Primary Intent
**File**: `phase-welcome/step2-primary-intent.tsx`

**Features**:
- Question: "What brings you to COW today?"
- 4 Large Card Options:
  1. **Build long-term wealth** (Icon: TrendingUp, Route: wealth journey)
  2. **Invest in performance assets** (Icon: Coins, Route: direct invest)
  3. **Manage client portfolios** (Icon: Users, Route: advisor)
  4. **Institutional investment** (Icon: Building2, Route: institutional)
- Each card shows icon, title, and description
- Audio guidance explains each option when selected
- Updates `flowType` and `skipWealthJourney` in context based on selection
- Follows COW Voice: Inviting, clear, future-focused

**Routing Logic**:
- Personal wealth → Continues to Step 3 (wealth journey)
- Investment focus → Skips to Step 11 (regulatory classification)
- Advisor/Institutional → Skips to Step 11 with pre-selected type

## Design System

### Colors (Sumi-e Sky + Earth)
```css
/* Primary */
--deep-cyan: #0066FF
--electric-blue: #2563eb
--emerald: #059669

/* Backgrounds */
--bg-gradient-light: from-slate-50 via-white to-slate-50
--bg-gradient-dark: from-slate-900 via-slate-800 to-slate-900
```

### Typography
- Headers: Inter 300 (Light) or Spectral 400
- Body: Inter 400 (Regular)
- Emphasis: Inter 600 (Semibold)

### Animations
- Page transitions: Framer Motion slide-fade (0.3s ease-out)
- Card hovers: translateY(-4px) + scale(1.02)
- Selection indicators: Spring animation with layoutId
- Progress bars: Smooth width transitions (0.5s ease-out)

### Responsive Design
- Mobile-first approach
- Grid layouts adapt from 1 column (mobile) to 2-3 columns (desktop)
- Touch-friendly button sizes (min 44px)
- Readable text sizes across all devices

## Usage

### Basic Usage

```tsx
import { ComprehensiveOnboardingContainer } from '@/components/comprehensive-onboarding'

export const OnboardingPage = () => {
  return <ComprehensiveOnboardingContainer />
}
```

### Accessing Onboarding State

```tsx
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'

const MyComponent = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()

  // Access state
  console.log(state.firstName)
  console.log(state.guideType)
  console.log(state.primaryIntent)
  console.log(state.flowType)

  // Update state
  updateState('firstName', 'John')

  // Navigate
  nextStep()
  prevStep()
}
```

## State Management

The comprehensive onboarding uses React Context for state management. State is automatically persisted to localStorage.

**Key State Fields (Phase 1)**:
- `firstName`: User's first name
- `guideType`: Selected guide (Moo, Fox, or Owl)
- `primaryIntent`: Primary goal (wealth, invest, advisor, institutional)
- `flowType`: Determines routing (wealth_journey, direct_invest, advisor, institutional)
- `skipWealthJourney`: Boolean flag to skip wealth journey steps
- `currentStep`: Current step number (1-14)
- `completedPhases`: Array of completed phase IDs

## Audio/TTS Integration

Components use the `useGuideSpeech` hook for text-to-speech:

```tsx
const { speak, stop } = useGuideSpeech({
  autoPlayText: 'Welcome message',
  autoPlayGuideType: guideType,
  onSpeechStart: () => setIsSpeaking(true),
  onSpeechEnd: () => setIsSpeaking(false),
})
```

**Features**:
- Auto-play on component mount
- Guide-specific voice selection
- Manual replay by clicking orb
- Automatic cleanup on unmount
- Prevents duplicate speech playback

## Future Implementation

### Phase 2: Wealth Journey (Steps 3-10)
To be implemented in next phase:
- Step 3: Age & Experience
- Step 4: Wealth Class & Life Stage
- Step 5: Life Goals
- Step 6: Cash Flow Analysis
- Step 7: Skills to Develop
- Step 8: Financial Freedom Goals
- Step 9: Location & Preferences
- Step 10: Risk & Stress Profile

### Phase 3: Classification (Steps 11-13)
To be implemented:
- Step 11: Investor Type Classification
- Step 12: Investment Experience Assessment
- Step 13: Regulatory Acknowledgment

### Phase 4: Account Setup (Step 14)
To be implemented:
- Step 14: Account Creation & Plan Selection

## Component Structure

```
src/components/comprehensive-onboarding/
├── comprehensive-onboarding-container.tsx    # Main container
├── comprehensive-progress-bar.tsx            # Progress tracking
├── index.ts                                   # Barrel exports
├── README.md                                  # This file
└── phase-welcome/
    ├── step1-welcome.tsx                      # Welcome & guide selection
    └── step2-primary-intent.tsx               # Primary intent selection
```

## Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management
- Screen reader compatible
- High contrast text colors
- Minimum touch target sizes (44px)

## Performance

- Code splitting by phase (ready for lazy loading)
- Optimized animations with Framer Motion
- Memoized computed values
- Efficient state updates
- Background assets use CSS gradients (no images)

## Testing Recommendations

1. **User Flow Testing**:
   - Complete flow from Step 1 → Step 2
   - Test all guide selections
   - Test all intent options
   - Verify routing logic

2. **State Persistence**:
   - Verify localStorage saving
   - Test page refresh (state should restore)
   - Test browser back/forward

3. **Audio Testing**:
   - Test auto-play on each step
   - Test manual replay
   - Test cleanup on navigation
   - Test with different guides

4. **Responsive Testing**:
   - Mobile (320px - 767px)
   - Tablet (768px - 1023px)
   - Desktop (1024px+)

5. **Dark Mode**:
   - Verify all components in dark mode
   - Check contrast ratios

## Known Issues

None currently identified.

## Next Steps

1. Implement Phase 2: Wealth Journey (Steps 3-10)
2. Implement Phase 3: Classification (Steps 11-13)
3. Implement Phase 4: Account Setup (Step 14)
4. Add comprehensive test suite
5. Conduct user testing
6. Optimize bundle size with lazy loading
7. Add analytics tracking

## Voice & Tone Alignment

All copy follows the COW Voice & Tone Guide v3.0:

- **Rigorous but Accessible**: Clear explanations without being stuffy
- **Confident but Humble**: Direct about capabilities, honest about what's next
- **Warm but Professional**: Conversational yet serious about financial matters
- **Direct but Kind**: Concise without being brusque

Examples from implementation:
- ✅ "Welcome to MyCOW! I'm Moo, your wealth journey companion."
- ✅ "Choose the path that fits your goals. We'll personalize your experience accordingly."
- ✅ "Not sure? You can always explore other options later."

## Dependencies

- React 18+
- Framer Motion (animations)
- Lucide React (icons)
- Three.js & React Three Fiber (3D orb)
- Tailwind CSS (styling)
- TypeScript (type safety)

## Contributing

When adding new steps:

1. Create step component in appropriate phase directory
2. Import and add to switch statement in `comprehensive-onboarding-container.tsx`
3. Update progress bar phase definitions if needed
4. Export from `index.ts`
5. Update this README
6. Follow existing patterns for animations, styling, and voice
7. Test with different flow types

## License

Copyright © 2025 COW Group. All rights reserved.
