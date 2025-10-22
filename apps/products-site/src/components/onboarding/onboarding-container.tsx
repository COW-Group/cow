// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { OnboardingProvider, useOnboarding } from "@/contexts/onboarding-context"
import { Step1Welcome } from "./step1-welcome"
import { Step2AgeExperience } from "./step2-age-experience"
import { Step3WealthClass } from "./step3-wealth-class"
import { Step4LifeGoals } from "./step4-life-goals"
import { Step5CashFlow } from "./step5-cash-flow"
import { Step6Skills } from "./step6-skills"
import { Step7FinancialFreedom } from "./step7-financial-freedom"
import { Step8RiskProfile } from "./step8-risk-profile"
import { Step9EmotionalHealth } from "./step9-emotional-health"
import { Step10WealthPlan } from "./step10-wealth-plan"
import { Step11AccountSetup } from "./step11-account-setup"

// Progress bar component
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#0066FF] to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}

// Step indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index < currentStep
              ? "bg-[#0066FF]"
              : index === currentStep
                ? "bg-emerald-500"
                : "bg-slate-300 dark:bg-slate-600"
          }`}
          animate={{
            scale: index === currentStep - 1 ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: index === currentStep - 1 ? 0 : 0,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Onboarding steps container
const OnboardingSteps: React.FC = () => {
  const { state } = useOnboarding()
  const totalSteps = 11 // Total number of steps in the onboarding flow

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={state.currentStep} totalSteps={totalSteps} />
          <div className="flex justify-between items-center mt-2 text-sm text-slate-600 dark:text-slate-400">
            <span>
              Step {state.currentStep} of {totalSteps}
            </span>
            <span className="hidden sm:inline">Your Wealth Hero Journey</span>
          </div>
        </div>
      </div>

      {/* Main content area with proper spacing */}
      <div className="flex-1 pt-20 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${state.currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {state.currentStep === 1 && <Step1Welcome />}
            {state.currentStep === 2 && <Step2AgeExperience />}
            {state.currentStep === 3 && <Step3WealthClass />}
            {state.currentStep === 4 && <Step4LifeGoals />}
            {state.currentStep === 5 && <Step5CashFlow />}
            {state.currentStep === 6 && <Step6Skills />}
            {state.currentStep === 7 && <Step7FinancialFreedom />}
            {state.currentStep === 8 && <Step8RiskProfile />}
            {state.currentStep === 9 && <Step9EmotionalHealth />}
            {state.currentStep === 10 && <Step10WealthPlan />}
            {state.currentStep === 11 && <Step11AccountSetup />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <StepIndicator currentStep={state.currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  )
}

// Main onboarding container with provider
export const OnboardingContainer: React.FC = () => {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 overflow-hidden">
        <OnboardingSteps />
      </div>
    </OnboardingProvider>
  )
}
