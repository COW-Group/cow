import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { SimpleOnboardingProvider, useSimpleOnboarding } from '@/contexts/simple-onboarding-context'
import { Step1GoalInput } from './step1-goal-input'
import { Step2Projection } from './step2-projection'
import { Step3QuickSignup } from './step3-quick-signup'

const OnboardingSteps: React.FC = () => {
  const { state } = useSimpleOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066FF] to-[#2563eb] flex items-center justify-center">
                <span className="text-white font-bold text-sm">COW</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">MyCOW</span>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all duration-300 ${
                      state.currentStep === step
                        ? 'bg-gradient-to-br from-[#0066FF] to-[#2563eb] text-white scale-110'
                        : state.currentStep > step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {state.currentStep > step ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 rounded-full transition-all duration-300 ${
                        state.currentStep > step
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Label */}
            <div className="text-sm text-slate-600 dark:text-slate-400 hidden md:block">
              Step {state.currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && <Step1GoalInput key="step1" />}
          {state.currentStep === 2 && <Step2Projection key="step2" />}
          {state.currentStep === 3 && <Step3QuickSignup key="step3" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const SimpleOnboardingContainer: React.FC = () => {
  return (
    <SimpleOnboardingProvider>
      <OnboardingSteps />
    </SimpleOnboardingProvider>
  )
}
