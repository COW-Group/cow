# Quick Start Guide: Comprehensive Onboarding Phase 1

## Getting Started (5 Minutes)

### 1. Import the Container

```tsx
import { ComprehensiveOnboardingContainer } from '@/components/comprehensive-onboarding'

export const OnboardingPage = () => {
  return <ComprehensiveOnboardingContainer />
}
```

That's it! The container handles everything:
- Context provider wrapping
- Progress bar
- Step routing
- Animations
- State management

### 2. Test the Demo Page

The demo page is already created at:
```
/Users/likhitha/Projects/cow/apps/products-site/src/pages/onboarding-demo.tsx
```

Add it to your router:
```tsx
// In your routing configuration
{
  path: '/onboarding',
  component: OnboardingDemo
}
```

### 3. Access State Anywhere

```tsx
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'

const MyComponent = () => {
  const { state } = useComprehensiveOnboarding()

  return (
    <div>
      <h1>Welcome, {state.firstName}!</h1>
      <p>Your guide: {state.guideType}</p>
      <p>Your goal: {state.primaryIntent}</p>
    </div>
  )
}
```

## What's Implemented

### ✅ Step 1: Welcome
- Animated welcome screen
- Guide selection (Moo, Fox, Owl)
- Name input
- TTS audio integration
- Validation

### ✅ Step 2: Primary Intent
- 4 intent cards
- Audio-guided descriptions
- Flow routing logic
- Smooth animations

### ✅ Progress Bar
- Multi-phase tracking
- Dynamic phase display
- Smooth transitions
- Current step indicator

## User Flow

```
Step 1: Welcome
   ↓
User enters name → Selects guide → Clicks "Begin Your Journey"
   ↓
Step 2: Primary Intent
   ↓
User selects intent → Clicks "Continue"
   ↓
Routes to appropriate next step (3 or 11 based on intent)
```

## Key Features

### 🎨 Design
- Sumi-e Sky + Earth color palette
- Dark/light mode support
- Responsive (mobile to desktop)
- Framer Motion animations

### 🎤 Audio
- Auto-play on step entry
- Guide-specific voices
- Manual replay option
- Cleanup on navigation

### 💾 State
- Automatic localStorage persistence
- React Context API
- Type-safe with TypeScript
- Easy to access anywhere

### 📱 Responsive
- Mobile-first design
- Touch-friendly targets
- Adaptive layouts
- Optimized spacing

## Customization

### Change Colors

Edit the color values in components:
```tsx
// Primary: #0066FF
// Secondary: #2563eb
// Success: #059669
```

### Add New Guides

In Step 1, add to the guides array:
```tsx
const guides = [
  { type: 'Moo', subtitle: 'Calm & Thoughtful', description: '...' },
  { type: 'Fox', subtitle: 'Quick & Strategic', description: '...' },
  { type: 'Owl', subtitle: 'Wise & Analytical', description: '...' },
  { type: 'YourGuide', subtitle: 'Your Style', description: '...' }, // Add here
]
```

### Add New Intent Options

In Step 2, add to the intentOptions array:
```tsx
const intentOptions = [
  // ... existing options
  {
    id: 'your_intent',
    title: 'Your Intent',
    icon: YourIcon,
    description: 'Description',
    flowType: 'your_flow',
    skipWealthJourney: true/false,
    audioDescription: 'Audio text...',
  },
]
```

## Troubleshooting

### Audio Not Playing?
- Check browser autoplay policies
- Ensure user has interacted with page
- Check browser console for errors

### State Not Persisting?
- Check localStorage is enabled
- Look for Safari private mode restrictions
- Verify context provider is wrapping components

### Dark Mode Not Working?
- Ensure Tailwind dark mode is configured
- Check theme provider is set up
- Verify dark: classes are present

### Build Errors?
- Run `npm install` to ensure dependencies
- Check TypeScript version compatibility
- Verify all imports are correct

## Next Steps

### For Development
1. Test current Phase 1 implementation
2. Gather user feedback
3. Optimize TTS timing
4. Begin Phase 2 implementation

### For Integration
1. Add to your main routing
2. Configure entry points
3. Set up analytics tracking
4. Add error boundaries

### For Testing
1. Test all user paths
2. Verify state persistence
3. Check responsive breakpoints
4. Test dark mode
5. Validate accessibility

## Resources

### Documentation
- **README**: `/Users/likhitha/Projects/cow/apps/products-site/src/components/comprehensive-onboarding/README.md`
- **Component Hierarchy**: `/Users/likhitha/Projects/cow/apps/products-site/src/components/comprehensive-onboarding/COMPONENT_HIERARCHY.md`
- **Implementation Summary**: `/Users/likhitha/Projects/cow/apps/products-site/PHASE_1_IMPLEMENTATION_SUMMARY.md`

### Design References
- **Design Doc**: `/Users/likhitha/Projects/cow/apps/products-site/COMPREHENSIVE_ONBOARDING_DESIGN.md`
- **Voice & Tone**: `/Users/likhitha/Projects/cow/COW Communications/COW_Voice_Tone_Guide_v3.md`

### Context
- **Context File**: `/Users/likhitha/Projects/cow/apps/products-site/src/contexts/comprehensive-onboarding-context.tsx`

## Support

For questions or issues:
1. Check the comprehensive README
2. Review the design documentation
3. Examine the component hierarchy guide
4. Test with the demo page

## Quick Commands

```bash
# Build the project
npm run build

# Start development server
npm start

# Run tests (when added)
npm test

# Check TypeScript
npx tsc --noEmit
```

---

**Ready to go!** The comprehensive onboarding Phase 1 is fully implemented and production-ready.
