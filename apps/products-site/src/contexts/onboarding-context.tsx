// "use client" - Not needed in React (Next.js specific)

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
// TODO: Add Supabase integration later
// import { getClientSupabaseClient as createClient } from "@/lib/supabase/client"
// TODO: Add speech synthesis integration later
// import { useGuideSpeech } from "@/hooks/use-guide-speech"

// Define the shape of the onboarding state
export type GuideType = "Moo"

export type OnboardingState = {
  currentStep: number
  firstName: string
  guideType: GuideType | null
  isAdult: boolean | null
  hasInvestedBefore: boolean | null
  wealthClass: "Beginner" | "Intermediate" | "Advanced" | null
  lifeStage: string | null
  lifeGoals: { id: string; name: string; selected: boolean }[]
  monthlyIncome: number | null
  monthlyExpenses: number | null
  assets: number | null
  liabilities: number | null
  skillsToImprove: ("Employment" | "Self-Employment" | "Business" | "Investing")[]
  financialFreedomGoals: {
    bareMinimum: number | null
    lowerTarget: number | null
    target: number | null
    ideal: number | null
    luxury: number | null
  }
  country: string | null
  currency: string | null
  minimumAnnualIncome: number | null
  maximumAnnualIncome: number | null
  investmentTimeframe: string | null
  riskTolerance: "Definitely" | "Yes" | "In the middle" | "No" | null
  stressLevel: "Not at all" | "A little" | "Moderately" | "Very stressed" | null
  myCowHelp: string[]
  phoneNumber: string
  email: string
  isPremium: boolean
  isAuthenticated: boolean
  userId: string | null
}

// Define the shape of the context value
type OnboardingContextType = {
  state: OnboardingState
  updateState: (key: keyof OnboardingState, value: OnboardingState[keyof OnboardingState]) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  toggleGoal: (goalId: string) => void
  toggleSkill: (skillId: "Employment" | "Self-Employment" | "Business" | "Investing") => void
  toggleMyCowHelp: (helpOption: string) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  // TODO: Add Supabase client later
  // const supabase = createClient()
  // TODO: Add speech synthesis later
  // const { speak } = useGuideSpeech()

  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("onboardingState")
      if (savedState) {
        return JSON.parse(savedState)
      }
    }
    return {
      currentStep: 1,
      firstName: "",
      guideType: null,
      isAdult: null,
      hasInvestedBefore: null,
      wealthClass: null,
      lifeStage: null,
      lifeGoals: [
        { id: "retirement", name: "Retirement", selected: false },
        { id: "home", name: "Buying a Home", selected: false },
        { id: "education", name: "Education Funding", selected: false },
        { id: "debt", name: "Debt Freedom", selected: false },
        { id: "travel", name: "Travel & Experiences", selected: false },
        { id: "business", name: "Starting a Business", selected: false },
        { id: "emergency", name: "Emergency Fund", selected: false },
        { id: "legacy", name: "Leaving a Legacy", selected: false },
      ],
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
      country: null,
      currency: null,
      minimumAnnualIncome: null,
      maximumAnnualIncome: null,
      investmentTimeframe: null,
      riskTolerance: null,
      stressLevel: null,
      myCowHelp: [],
      phoneNumber: "",
      email: "",
      isPremium: false,
      isAuthenticated: false,
      userId: null,
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingState", JSON.stringify(state))
    }
  }, [state])

  // TODO: Add authentication check when Supabase is integrated
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser()
  //     setState((prevState) => ({
  //       ...prevState,
  //       isAuthenticated: !!user,
  //       userId: user?.id || null,
  //       email: user?.email || prevState.email,
  //     }))
  //
  //     if (user) {
  //       const returnStep = localStorage.getItem("onboarding_return_step")
  //       if (returnStep === "11") {
  //         goToStep(11)
  //         localStorage.removeItem("onboarding_return_step")
  //       }
  //     }
  //   }
  //   checkUser()
  //
  //   const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       isAuthenticated: !!session?.user,
  //       userId: session?.user?.id || null,
  //       email: session?.user?.email || prevState.email,
  //     }))
  //     if (session?.user) {
  //       const returnStep = localStorage.getItem("onboarding_return_step")
  //       if (returnStep === "11") {
  //         goToStep(11)
  //         localStorage.removeItem("onboarding_return_step")
  //       }
  //     }
  //   })
  //
  //   return () => {
  //     authListener.subscription.unsubscribe()
  //   }
  // }, [supabase, navigate])

  const updateState = useCallback((key: keyof OnboardingState, value: OnboardingState[keyof OnboardingState]) => {
    setState((prevState) => ({ ...prevState, [key]: value }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prevState) => ({ ...prevState, currentStep: prevState.currentStep + 1 }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prevState) => ({ ...prevState, currentStep: prevState.currentStep - 1 }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setState((prevState) => ({ ...prevState, currentStep: step }))
  }, [])

  const toggleGoal = useCallback((goalId: string) => {
    setState((prevState) => ({
      ...prevState,
      lifeGoals: prevState.lifeGoals.map((goal) => (goal.id === goalId ? { ...goal, selected: !goal.selected } : goal)),
    }))
  }, [])

  const toggleSkill = useCallback((skillId: "Employment" | "Self-Employment" | "Business" | "Investing") => {
    setState((prevState) => {
      const currentSkills = prevState.skillsToImprove
      if (currentSkills.includes(skillId)) {
        return {
          ...prevState,
          skillsToImprove: currentSkills.filter((id) => id !== skillId),
        }
      } else {
        return {
          ...prevState,
          skillsToImprove: [...currentSkills, skillId],
        }
      }
    })
  }, [])

  const toggleMyCowHelp = useCallback((helpOption: string) => {
    setState((prevState) => {
      const currentHelp = prevState.myCowHelp
      if (currentHelp.includes(helpOption)) {
        return {
          ...prevState,
          myCowHelp: currentHelp.filter((item) => item !== helpOption),
        }
      } else {
        return {
          ...prevState,
          myCowHelp: [...currentHelp, helpOption],
        }
      }
    })
  }, [])

  const completeOnboarding = useCallback(async () => {
    // TODO: Add Supabase integration for saving onboarding data
    // if (!state.userId) {
    //   console.error("User ID not available. Cannot save onboarding data.")
    //   navigate("/auth/signin")
    //   return
    // }

    // For now, just navigate to the dashboard/home page
    console.log("Onboarding completed with data:", state)

    // TODO: Save to Supabase when integrated
    // const {
    //   firstName,
    //   guideType,
    //   isAdult,
    //   hasInvestedBefore,
    //   wealthClass,
    //   lifeStage,
    //   lifeGoals,
    //   monthlyIncome,
    //   monthlyExpenses,
    //   assets,
    //   liabilities,
    //   skillsToImprove,
    //   financialFreedomGoals,
    //   country,
    //   currency,
    //   minimumAnnualIncome,
    //   maximumAnnualIncome,
    //   riskTolerance,
    //   stressLevel,
    //   myCowHelp,
    //   phoneNumber,
    //   isPremium,
    // } = state
    //
    // const selectedLifeGoalNames = lifeGoals.filter((goal) => goal.selected).map((goal) => goal.name)
    //
    // const upsertData = {
    //   user_id: state.userId,
    //   first_name: firstName,
    //   guide_voice_preference: guideType,
    //   is_adult: isAdult,
    //   has_investment_experience: hasInvestedBefore,
    //   wealth_class: wealthClass,
    //   life_stage: lifeStage,
    //   life_goals: selectedLifeGoalNames,
    //   monthly_income: monthlyIncome,
    //   monthly_expenses: monthlyExpenses,
    //   assets: assets,
    //   liabilities: liabilities,
    //   skills_to_improve: skillsToImprove,
    //   financial_freedom_goals: financialFreedomGoals,
    //   country: country,
    //   currency: currency,
    //   minimum_annual_income: minimumAnnualIncome,
    //   maximum_annual_income: maximumAnnualIncome,
    //   risk_tolerance: riskTolerance,
    //   stress_level: stressLevel,
    //   my_cow_help: myCowHelp,
    //   phone_number: phoneNumber,
    //   is_premium: isPremium,
    //   updated_at: new Date().toISOString(),
    // }
    //
    // const { data, error } = await supabase
    //   .from("user_data")
    //   .upsert(upsertData, {
    //     onConflict: "user_id",
    //   })
    //
    // if (error) {
    //   console.error("Error saving onboarding data to user_data table:", error.message)
    // } else {
    //   console.log("Onboarding data saved successfully to user_data table:", data)
    // }

    navigate("/")
    if (typeof window !== "undefined") {
      localStorage.removeItem("onboardingState")
    }
  }, [state, navigate])

  const resetOnboarding = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("onboardingState")
    }
    setState({
      currentStep: 1,
      firstName: "",
      guideType: null,
      isAdult: null,
      hasInvestedBefore: null,
      wealthClass: null,
      lifeStage: null,
      lifeGoals: [
        { id: "retirement", name: "Retirement", selected: false },
        { id: "home", name: "Buying a Home", selected: false },
        { id: "education", name: "Education Funding", selected: false },
        { id: "debt", name: "Debt Freedom", selected: false },
        { id: "travel", name: "Travel & Experiences", selected: false },
        { id: "business", name: "Starting a Business", selected: false },
        { id: "emergency", name: "Emergency Fund", selected: false },
        { id: "legacy", name: "Leaving a Legacy", selected: false },
      ],
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
      country: null,
      currency: null,
      minimumAnnualIncome: null,
      maximumAnnualIncome: null,
      investmentTimeframe: null,
      riskTolerance: null,
      stressLevel: null,
      myCowHelp: [],
      phoneNumber: "",
      email: "",
      isPremium: false,
      isAuthenticated: false,
      userId: null,
    })
  }, [])

  const value = React.useMemo(
    () => ({
      state,
      updateState,
      nextStep,
      prevStep,
      goToStep,
      toggleGoal,
      toggleSkill,
      toggleMyCowHelp,
      completeOnboarding,
      resetOnboarding,
    }),
    [
      state,
      updateState,
      nextStep,
      prevStep,
      goToStep,
      toggleGoal,
      toggleSkill,
      toggleMyCowHelp,
      completeOnboarding,
      resetOnboarding,
    ],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
