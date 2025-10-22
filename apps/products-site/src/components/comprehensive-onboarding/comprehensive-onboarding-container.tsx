import type React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ComprehensiveOnboardingProvider,
  useComprehensiveOnboarding,
} from '@/contexts/comprehensive-onboarding-context'
import { ComprehensiveProgressBar } from './comprehensive-progress-bar'

// Phase 1: Welcome
import { Step1Welcome } from './phase-welcome/step1-welcome'
import { Step2PrimaryIntent } from './phase-welcome/step2-primary-intent'

// Phase 2: Wealth Journey
import {
  Step3AgeExperience,
  Step4WealthClassStage,
  Step5LifeGoals,
  Step6CashFlow,
  Step7SkillsQuadrant,
  Step8FinancialFreedom,
  Step9Location,
  Step10RiskStress,
} from './phase-wealth'

// Phase 3: Classification
import {
  Step11InvestorType,
  Step12InvestmentProfile,
  Step13Regulatory,
} from './phase-classification'

// Phase 4: Account
import { Step14AccountSetup } from './phase-account'

// Placeholder component for steps not yet implemented
const PlaceholderStep: React.FC<{ stepNumber: number }> = ({ stepNumber }) => {
  const { prevStep, nextStep } = useComprehensiveOnboarding()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Step {stepNumber}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          This step is under construction and will be implemented in the next phase.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium rounded-lg transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-medium rounded-lg shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all"
          >
            Next (Skip)
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const OnboardingContent: React.FC = () => {
  const { state } = useComprehensiveOnboarding()
  const { currentStep } = state

  // Map steps to components
  const renderStep = () => {
    switch (currentStep) {
      // Phase 1: Welcome & Intent
      case 1:
        return <Step1Welcome />
      case 2:
        return <Step2PrimaryIntent />

      // Phase 2: Wealth Journey (Steps 3-10)
      case 3:
        return <Step3AgeExperience />
      case 4:
        return <Step4WealthClassStage />
      case 5:
        return <Step5LifeGoals />
      case 6:
        return <Step6CashFlow />
      case 7:
        return <Step7SkillsQuadrant />
      case 8:
        return <Step8FinancialFreedom />
      case 9:
        return <Step9Location />
      case 10:
        return <Step10RiskStress />

      // Phase 3: Classification (Steps 11-13)
      case 11:
        return <Step11InvestorType />
      case 12:
        return <Step12InvestmentProfile />
      case 13:
        return <Step13Regulatory />

      // Phase 4: Account (Step 14)
      case 14:
        return <Step14AccountSetup />

      default:
        return <Step1Welcome />
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Progress Bar */}
      <ComprehensiveProgressBar />

      {/* Main Content */}
      <div className="pt-32 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-right gradient orb */}
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[#0066FF]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Bottom-left gradient orb */}
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-[#2563eb]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Center accent orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-br from-[#059669]/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>
    </div>
  )
}

export const ComprehensiveOnboardingContainer: React.FC = () => {
  return (
    <ComprehensiveOnboardingProvider>
      <OnboardingContent />
    </ComprehensiveOnboardingProvider>
  )
}
