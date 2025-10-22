// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AnimatedOrb } from "./animated-orb"
import { HighlightedSubtitle } from "./highlighted-subtitle"
import { OnboardingStep } from "./onboarding-step"
import { useOnboarding } from "@/contexts/onboarding-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
// TODO: Add speech synthesis later
// import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step2AgeExperience: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()
  const [isAdult, setIsAdult] = useState<boolean | null>(state.isAdult)
  const [experience, setExperience] = useState<typeof state.hasInvestmentExperience>(state.hasInvestmentExperience)
  const [showBadge, setShowBadge] = useState(false)
  const [shouldSpeakFollowUp, setShouldSpeakFollowUp] = useState(false)

  const speechText = `Nice to meet you, ${state.firstName}! Let's start with the basics. Are you 18 or older? That's the age when you can start using investment tools.`
  const followUpSpeechText = "And have you saved or invested before? It's okay if you haven't - we all start somewhere."

  // TODO: Add speech synthesis when integrated
  // useGuideSpeech({
  //   autoPlayText: shouldSpeakFollowUp ? followUpSpeechText : undefined,
  //   autoPlayGuideType: state.guideType,
  // })

  // Show badge animation after a delay
  useEffect(() => {
    if (isAdult !== null) {
      const timer = setTimeout(() => {
        setShowBadge(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isAdult])

  const handleNext = () => {
    updateState("isAdult", isAdult)
    updateState("hasInvestmentExperience", experience)
    nextStep()
  }

  const handleAgeChange = (value: string) => {
    const isAdultValue = value === "yes"
    setIsAdult(isAdultValue)

    if (isAdultValue) {
      // Delay the follow-up speech slightly to let the UI update
      setTimeout(() => {
        setShouldSpeakFollowUp(true)
      }, 1000)
    } else {
      setShouldSpeakFollowUp(false)
    }
  }

  const isNextDisabled = isAdult === null || (isAdult === true && experience === null)

  return (
    <OnboardingStep title="Getting to Know You" onNext={handleNext} onPrev={prevStep} nextDisabled={isNextDisabled}>
      <div className="flex flex-col items-center">
        <AnimatedOrb isActive={true} guideType={state.guideType} speechText={speechText} autoPlay={true}>
          <HighlightedSubtitle
            text={speechText}
            highlightWords={["basics", "investment tools"]}
            className="mb-8"
          />
        </AnimatedOrb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-md mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="space-y-8">
            <div className="relative">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Are you 18 or older?</Label>
              <RadioGroup
                value={isAdult === null ? "" : isAdult ? "yes" : "no"}
                onValueChange={handleAgeChange}
                className="mt-2 space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="yes" id="age-yes" />
                  <Label htmlFor="age-yes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="no" id="age-no" />
                  <Label htmlFor="age-no" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>

              {/* Ready Badge Animation */}
              {showBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    duration: 0.8,
                  }}
                  className="absolute -right-4 -top-4"
                >
                  <Badge className="bg-gradient-to-r from-[#0066FF] to-emerald-500 text-white px-3 py-1.5 text-xs font-medium shadow-lg">
                    Ready to Grow
                  </Badge>
                </motion.div>
              )}
            </div>

            {isAdult === false && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg"
              >
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  No worries! You can still learn and plan for your future. We'll set up a learning path for you when you're ready.
                </p>
              </motion.div>
            )}

            {isAdult === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.3 }}
              >
                <Label className="text-slate-700 dark:text-slate-200 font-medium">
                  Have you saved or invested before?
                </Label>
                <RadioGroup
                  value={experience || ""}
                  onValueChange={(value) => setExperience(value as typeof experience)}
                  className="mt-2 space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <RadioGroupItem value="Yes, I've invested" id="exp-invested" />
                    <Label htmlFor="exp-invested" className="cursor-pointer">
                      Yes, I've invested
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <RadioGroupItem value="Yes, I've saved" id="exp-saved" />
                    <Label htmlFor="exp-saved" className="cursor-pointer">
                      Yes, I've saved
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <RadioGroupItem value="No, I'm new to this" id="exp-new" />
                    <Label htmlFor="exp-new" className="cursor-pointer">
                      No, I'm new to this
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  )
}
