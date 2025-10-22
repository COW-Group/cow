import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type GuideType = 'Moo' | 'Fox' | 'Owl'

export type PrimaryIntent = 'wealth' | 'invest' | 'advisor' | 'institutional'

export type InvestorType = 'individual' | 'accredited' | 'international' | 'advisor' | 'institutional'

export type WealthClass = 'Beginner' | 'Intermediate' | 'Advanced'

export type FlowType = 'wealth_journey' | 'direct_invest' | 'advisor' | 'institutional'

export type LifeGoal = {
  id: string
  name: string
  selected: boolean
}

export type ComprehensiveOnboardingState = {
  // Progress
  currentStep: number
  totalSteps: number
  completedPhases: ('welcome' | 'wealth' | 'classification' | 'account')[]

  // Phase 1: Welcome
  firstName: string
  guideType: GuideType | null
  primaryIntent: PrimaryIntent | null

  // Phase 2: Wealth Journey (optional - only for wealth track)
  isAdult: boolean | null
  hasInvestedBefore: boolean | null
  wealthClass: WealthClass | null
  lifeStage: string | null
  lifeGoals: LifeGoal[]
  monthlyIncome: number | null
  monthlyExpenses: number | null
  assets: number | null
  liabilities: number | null
  skillsToImprove: ('Employment' | 'Self-Employment' | 'Business' | 'Investing')[]
  financialFreedomGoals: {
    bareMinimum: number | null
    lowerTarget: number | null
    target: number | null
    ideal: number | null
    luxury: number | null
  }
  riskTolerance: 'Definitely' | 'Yes' | 'In the middle' | 'No' | null
  stressLevel: 'Not at all' | 'A little' | 'Moderately' | 'Very stressed' | null

  // Phase 3: Investor Classification (required for all)
  country: string | null
  currency: string | null
  investmentTimeframe: string | null
  investorType: InvestorType | null
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
  myCowHelp: string[]

  // Routing
  flowType: FlowType | null
  skipWealthJourney: boolean
}

type ComprehensiveOnboardingContextType = {
  state: ComprehensiveOnboardingState
  updateState: <K extends keyof ComprehensiveOnboardingState>(
    key: K,
    value: ComprehensiveOnboardingState[K]
  ) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  toggleLifeGoal: (goalId: string) => void
  toggleSkill: (skill: ComprehensiveOnboardingState['skillsToImprove'][number]) => void
  toggleMyCowHelp: (item: string) => void
  completePhase: (phase: ComprehensiveOnboardingState['completedPhases'][number]) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const ComprehensiveOnboardingContext = createContext<ComprehensiveOnboardingContextType | undefined>(
  undefined
)

const defaultLifeGoals: LifeGoal[] = [
  { id: 'security', name: 'Financial Security', selected: false },
  { id: 'retirement', name: 'Retirement Planning', selected: false },
  { id: 'education', name: 'Education Funding', selected: false },
  { id: 'home', name: 'Home Ownership', selected: false },
  { id: 'travel', name: 'Travel & Experiences', selected: false },
  { id: 'legacy', name: 'Legacy Building', selected: false },
  { id: 'business', name: 'Business Ownership', selected: false },
]

const getInitialState = (): ComprehensiveOnboardingState => {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  const saved = localStorage.getItem('comprehensive_onboarding_state')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return createDefaultState()
    }
  }
  return createDefaultState()
}

function createDefaultState(): ComprehensiveOnboardingState {
  return {
    currentStep: 1,
    totalSteps: 14,
    completedPhases: [],
    firstName: '',
    guideType: null,
    primaryIntent: null,
    isAdult: null,
    hasInvestedBefore: null,
    wealthClass: null,
    lifeStage: null,
    lifeGoals: defaultLifeGoals,
    monthlyIncome: null,
    monthlyExpenses: null,
    assets: null,
    liabilities: null,
    skillsToImprove: [],
    financialFreedomGoals: {
      bareMinimum: null,
      lowerTarget: null,
      target: null,
      ideal: null,
      luxury: null,
    },
    riskTolerance: null,
    stressLevel: null,
    country: null,
    currency: null,
    investmentTimeframe: null,
    investorType: null,
    investmentExperience: null,
    primaryInvestmentGoal: null,
    intendedAllocation: null,
    regulatoryAcknowledgments: [],
    disclosuresAccepted: false,
    phoneNumber: '',
    email: '',
    isPremium: false,
    isAuthenticated: false,
    userId: null,
    myCowHelp: [],
    flowType: null,
    skipWealthJourney: false,
  }
}

export function ComprehensiveOnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ComprehensiveOnboardingState>(getInitialState)

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('comprehensive_onboarding_state', JSON.stringify(state))
    }
  }, [state])

  const updateState = <K extends keyof ComprehensiveOnboardingState>(
    key: K,
    value: ComprehensiveOnboardingState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    setState((prev) => {
      // Handle flow-specific routing
      const { currentStep, flowType, skipWealthJourney } = prev

      // If we're on step 2 (primary intent) and user chooses a non-wealth path
      if (currentStep === 2 && skipWealthJourney) {
        return { ...prev, currentStep: 11 } // Skip to investor classification
      }

      // Normal progression
      return { ...prev, currentStep: Math.min(currentStep + 1, prev.totalSteps) }
    })
  }

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }))
  }

  const goToStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, prev.totalSteps)),
    }))
  }

  const toggleLifeGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      lifeGoals: prev.lifeGoals.map((goal) =>
        goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
      ),
    }))
  }

  const toggleSkill = (skill: ComprehensiveOnboardingState['skillsToImprove'][number]) => {
    setState((prev) => ({
      ...prev,
      skillsToImprove: prev.skillsToImprove.includes(skill)
        ? prev.skillsToImprove.filter((s) => s !== skill)
        : [...prev.skillsToImprove, skill],
    }))
  }

  const toggleMyCowHelp = (item: string) => {
    setState((prev) => ({
      ...prev,
      myCowHelp: prev.myCowHelp.includes(item)
        ? prev.myCowHelp.filter((i) => i !== item)
        : [...prev.myCowHelp, item],
    }))
  }

  const completePhase = (phase: ComprehensiveOnboardingState['completedPhases'][number]) => {
    setState((prev) => ({
      ...prev,
      completedPhases: prev.completedPhases.includes(phase)
        ? prev.completedPhases
        : [...prev.completedPhases, phase],
    }))
  }

  const completeOnboarding = () => {
    // TODO: Save to Supabase
    console.log('Onboarding completed:', state)

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('comprehensive_onboarding_state')
    }

    // Redirect to dashboard (will be handled in Step 14)
  }

  const resetOnboarding = () => {
    setState(createDefaultState())
    if (typeof window !== 'undefined') {
      localStorage.removeItem('comprehensive_onboarding_state')
    }
  }

  return (
    <ComprehensiveOnboardingContext.Provider
      value={{
        state,
        updateState,
        nextStep,
        prevStep,
        goToStep,
        toggleLifeGoal,
        toggleSkill,
        toggleMyCowHelp,
        completePhase,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </ComprehensiveOnboardingContext.Provider>
  )
}

export function useComprehensiveOnboarding() {
  const context = useContext(ComprehensiveOnboardingContext)
  if (!context) {
    throw new Error('useComprehensiveOnboarding must be used within ComprehensiveOnboardingProvider')
  }
  return context
}
