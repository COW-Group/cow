import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  calculateGoalProjection,
  calculateYearsToGoal,
  type GoalProjection,
} from '@/lib/goal-projections'

export type InvestmentPlan = 'lumpsum' | 'monthly' | null

export interface SimpleOnboardingState {
  // Current step (1-3)
  currentStep: number

  // Step 1: Goal details
  goalName: string
  targetAmount: number
  currency: string
  targetDate: Date | null

  // Step 2: Calculations
  yearsToGoal: number
  projection: GoalProjection | null
  selectedPlan: InvestmentPlan
  recommendedAmount: number

  // Step 3: User details
  email: string
  phone: string
  password: string
  termsAccepted: boolean
  marketingOptIn: boolean

  // Completion
  isCompleted: boolean
}

interface SimpleOnboardingContextType {
  state: SimpleOnboardingState
  updateGoal: (field: keyof Pick<SimpleOnboardingState, 'goalName' | 'targetAmount' | 'currency' | 'targetDate'>, value: any) => void
  calculateProjections: () => void
  selectPlan: (plan: InvestmentPlan, amount?: number) => void
  updateUserDetails: (field: keyof Pick<SimpleOnboardingState, 'email' | 'phone' | 'password' | 'termsAccepted' | 'marketingOptIn'>, value: any) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  completeOnboarding: () => Promise<void>
  resetOnboarding: () => void
}

const SimpleOnboardingContext = createContext<SimpleOnboardingContextType | undefined>(undefined)

const getInitialState = (): SimpleOnboardingState => {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  const saved = localStorage.getItem('simple_onboarding_state')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Convert targetDate string back to Date object
      if (parsed.targetDate) {
        parsed.targetDate = new Date(parsed.targetDate)
      }
      return parsed
    } catch {
      return createDefaultState()
    }
  }
  return createDefaultState()
}

function createDefaultState(): SimpleOnboardingState {
  return {
    currentStep: 1,
    goalName: '',
    targetAmount: 0,
    currency: 'USD',
    targetDate: null,
    yearsToGoal: 0,
    projection: null,
    selectedPlan: null,
    recommendedAmount: 0,
    email: '',
    phone: '',
    password: '',
    termsAccepted: false,
    marketingOptIn: true,
    isCompleted: false,
  }
}

export function SimpleOnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimpleOnboardingState>(getInitialState)

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simple_onboarding_state', JSON.stringify(state))
    }
  }, [state])

  const updateGoal = (
    field: keyof Pick<SimpleOnboardingState, 'goalName' | 'targetAmount' | 'currency' | 'targetDate'>,
    value: any
  ) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const calculateProjections = () => {
    if (!state.targetDate || !state.targetAmount) {
      return
    }

    const years = calculateYearsToGoal(state.targetDate)
    const projection = calculateGoalProjection(state.targetAmount, years)

    setState((prev) => ({
      ...prev,
      yearsToGoal: years,
      projection,
    }))
  }

  const selectPlan = (plan: InvestmentPlan, amount?: number) => {
    let recommendedAmount = 0

    if (plan === 'lumpsum' && state.projection) {
      recommendedAmount = amount ?? state.projection.recommendedLumpSum
    } else if (plan === 'monthly' && state.projection) {
      recommendedAmount = amount ?? state.projection.recommendedMonthly
    }

    setState((prev) => ({
      ...prev,
      selectedPlan: plan,
      recommendedAmount,
    }))
  }

  const updateUserDetails = (
    field: keyof Pick<SimpleOnboardingState, 'email' | 'phone' | 'password' | 'termsAccepted' | 'marketingOptIn'>,
    value: any
  ) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3),
    }))
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
      currentStep: Math.max(1, Math.min(step, 3)),
    }))
  }

  const completeOnboarding = async () => {
    try {
      // TODO: Save to Supabase
      // - Create user account
      // - Save goal data
      // - Set authentication state

      console.log('Simple onboarding completed:', {
        goal: {
          name: state.goalName,
          amount: state.targetAmount,
          currency: state.currency,
          targetDate: state.targetDate,
        },
        plan: {
          type: state.selectedPlan,
          amount: state.recommendedAmount,
        },
        user: {
          email: state.email,
          phone: state.phone,
        },
      })

      setState((prev) => ({ ...prev, isCompleted: true }))

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('simple_onboarding_state')
      }

      // Redirect to dashboard
      // This will be handled in Step 3 component
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  }

  const resetOnboarding = () => {
    setState(createDefaultState())
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simple_onboarding_state')
    }
  }

  return (
    <SimpleOnboardingContext.Provider
      value={{
        state,
        updateGoal,
        calculateProjections,
        selectPlan,
        updateUserDetails,
        nextStep,
        prevStep,
        goToStep,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </SimpleOnboardingContext.Provider>
  )
}

export function useSimpleOnboarding() {
  const context = useContext(SimpleOnboardingContext)
  if (!context) {
    throw new Error('useSimpleOnboarding must be used within SimpleOnboardingProvider')
  }
  return context
}
