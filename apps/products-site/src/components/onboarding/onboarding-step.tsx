// "use client" - Not needed in React (Next.js specific)

import { useEffect } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
// TODO: Add speech synthesis later
// import { stopSpeech } from "@/lib/speech-synthesis"
// import { useGuideSpeech } from "@/hooks/use-guide-speech"

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
  // TODO: Add speech synthesis later
  // const { clearSpokenText } = useGuideSpeech()

  // Effect to clear spoken text history when the step changes
  useEffect(() => {
    // TODO: Clear spoken text history when speech is integrated
    // clearSpokenText()
  }, [state.currentStep])

  const handleNextClick = () => {
    // TODO: Stop speech before navigating when integrated
    // stopSpeech()
    if (onNext) {
      onNext()
    } else {
      contextNextStep()
    }
  }

  const handlePrevClick = () => {
    // TODO: Stop speech before navigating when integrated
    // stopSpeech()
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
      <div className="w-full max-w-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">{title}</h1>
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
              className="bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Next Step
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
