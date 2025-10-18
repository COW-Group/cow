"use client"

import { useEffect } from "react"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { stopSpeech } from "@/lib/speech-synthesis" // Import stopSpeech
import { useGuideSpeech } from "@/hooks/use-guide-speech" // Import useGuideSpeech

interface OnboardingStepProps {
  title: string
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  nextDisabled?: boolean
  prevDisabled?: boolean
  showButtons?: boolean
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  children,
  onNext,
  onPrev,
  nextDisabled = false,
  prevDisabled = false,
  showButtons = true,
}) => {
  const { nextStep: contextNextStep, prevStep: contextPrevStep, state } = useOnboarding()
  const { clearSpokenText } = useGuideSpeech() // Get the clear function

  // Effect to clear spoken text history when the step changes
  useEffect(() => {
    // Clear spoken text history whenever the current step changes.
    // This ensures that when a new step is loaded, its autoplay text will play.
    clearSpokenText()
  }, [state.currentStep, clearSpokenText]) // Depend on state.currentStep

  const handleNextClick = () => {
    stopSpeech() // Stop speech before navigating
    if (onNext) {
      onNext()
    } else {
      contextNextStep()
    }
  }

  const handlePrevClick = () => {
    stopSpeech() // Stop speech before navigating
    if (onPrev) {
      onPrev()
    } else {
      contextPrevStep()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="w-full max-w-2xl bg-cream-50/80 dark:bg-ink-800/80 backdrop-blur-sm p-8 rounded-xl border border-cream-200/50 dark:border-ink-700/50 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-ink-800 dark:text-cream-100 mb-6">{title}</h1>
        <div className="mb-8">{children}</div>
        {showButtons && (
          <div className="flex justify-between w-full max-w-sm mx-auto">
            <Button
              onClick={handlePrevClick}
              disabled={prevDisabled || state.currentStep === 1}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-medium shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/30 transition-all duration-300"
            >
              Previous Step
            </Button>
            <Button
              onClick={handleNextClick}
              disabled={nextDisabled}
              className="bg-gradient-to-r from-logo-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Next Step
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
