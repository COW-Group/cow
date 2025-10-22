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
import { Sparkles, Compass, Crown } from "lucide-react"

export const Step3WealthClass: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()
  const [wealthClass, setWealthClass] = useState<typeof state.wealthClass>(state.wealthClass)
  const [lifeStage, setLifeStage] = useState<typeof state.lifeStage>(state.lifeStage)
  const [showBadge, setShowBadge] = useState(false)

  // Ensure speechText is a plain string without any HTML/JSX-like tags
  const speechText = "Every Wealth Hero has a class and stage. What's your Wealth Class to start this journey?"

  // Show badge animation after a delay
  useEffect(() => {
    if (wealthClass) {
      const timer = setTimeout(() => {
        setShowBadge(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [wealthClass])

  const handleNext = () => {
    updateState("wealthClass", wealthClass)
    updateState("lifeStage", lifeStage)
    nextStep()
  }

  const isNextDisabled = !wealthClass || !lifeStage

  // Get the appropriate icon for the wealth class
  const getWealthClassIcon = () => {
    switch (wealthClass) {
      case "Apprentice":
        return <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      case "Adventurer":
        return <Compass className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
      case "Master":
        return <Crown className="w-8 h-8 text-amber-500 dark:text-amber-400" />
      default:
        return null
    }
  }

  return (
    <OnboardingStep
      title="Your Wealth Class & Life Stage"
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={isNextDisabled}
    >
      <div className="flex flex-col items-center">
        <AnimatedOrb isActive={true} guideType={state.guideType} speechText={speechText} autoPlay={true}>
          <HighlightedSubtitle
            text={speechText} // Pass the plain text here
            highlightWords={["Wealth Hero", "class", "stage", "journey"]} // Specify words to highlight
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
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Choose Your Wealth Class</Label>
              <RadioGroup
                value={wealthClass || ""}
                onValueChange={(value) => setWealthClass(value as typeof wealthClass)}
                className="mt-2 space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Apprentice" id="class-apprentice" />
                  <Label htmlFor="class-apprentice" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Apprentice</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Starting Out</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Adventurer" id="class-adventurer" />
                  <Label htmlFor="class-adventurer" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Adventurer</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Exploring Wealth</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Master" id="class-master" />
                  <Label htmlFor="class-master" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Master</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Experienced Investor</div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Class Badge Animation */}
              {showBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    duration: 0.8,
                  }}
                  className="absolute -right-4 -top-4 w-16 h-16 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full border-2 border-[#0066FF] dark:border-blue-500 shadow-lg"
                >
                  {getWealthClassIcon()}
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-slate-700 dark:text-slate-200 font-medium">What's your current Life Stage?</Label>
              <RadioGroup
                value={lifeStage || ""}
                onValueChange={(value) => setLifeStage(value as typeof lifeStage)}
                className="mt-2 space-y-3"
              >
                {!state.isAdult && (
                  <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <RadioGroupItem value="Child" id="stage-child" />
                    <Label htmlFor="stage-child" className="flex-1 cursor-pointer">
                      <div className="font-medium text-slate-800 dark:text-slate-100">Child (0-17)</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Planning for future</div>
                    </Label>
                  </div>
                )}
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Young Adult" id="stage-young-adult" />
                  <Label htmlFor="stage-young-adult" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Young Adult (18-25)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Adult" id="stage-adult" />
                  <Label htmlFor="stage-adult" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Adult (26-40)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Midlife" id="stage-midlife" />
                  <Label htmlFor="stage-midlife" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Midlife (41-60)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                  <RadioGroupItem value="Elder" id="stage-elder" />
                  <Label htmlFor="stage-elder" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Elder (61+)</div>
                  </Label>
                </div>
              </RadioGroup>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  )
}
