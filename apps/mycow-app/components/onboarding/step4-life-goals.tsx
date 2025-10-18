"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AnimatedOrb } from "./animated-orb"
import { HighlightedSubtitle } from "./highlighted-subtitle"
import { OnboardingStep } from "./onboarding-step"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin } from "lucide-react"

export const Step4LifeGoals: React.FC = () => {
  const { state, updateState, nextStep, prevStep, toggleGoal, toggleMyCowHelp } = useOnboarding()
  const [customGoal, setCustomGoal] = useState("")
  const [customMyCowHelp, setCustomMyCowHelp] = useState("") // New state for custom MyCOW help
  const [showQuestMap, setShowQuestMap] = useState(false)

  const speechText = "Heroes need quests! What are your goals to shape your financial journey?"

  // Show quest map animation after a delay
  useEffect(() => {
    const selectedGoals = state.lifeGoals.filter((goal) => goal.selected)
    if (selectedGoals.length > 0) {
      const timer = setTimeout(() => {
        setShowQuestMap(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [state.lifeGoals])

  const handleAddCustomGoal = () => {
    if (customGoal.trim()) {
      updateState("lifeGoals", [
        ...state.lifeGoals,
        { id: `custom-${Date.now()}`, name: customGoal.trim(), selected: true },
      ])
      setCustomGoal("")
    }
  }

  const handleAddCustomMyCowHelp = () => {
    if (customMyCowHelp.trim()) {
      toggleMyCowHelp(customMyCowHelp.trim())
      setCustomMyCowHelp("")
    }
  }

  const handleNext = () => {
    nextStep()
  }

  const selectedGoalsCount = state.lifeGoals.filter((goal) => goal.selected).length
  const isNextDisabled = selectedGoalsCount === 0 || state.myCowHelp.length === 0

  return (
    <OnboardingStep title="Life Goals and Quests" onNext={handleNext} onPrev={prevStep} nextDisabled={isNextDisabled}>
      <div className="flex flex-col items-center">
        <AnimatedOrb isActive={true} guideType={state.guideType} speechText={speechText} autoPlay={true}>
          <HighlightedSubtitle
            text={speechText}
            highlightWords={["quests", "goals", "financial journey"]}
            className="mb-8"
          />
        </AnimatedOrb>

        <div className="w-full max-w-4xl mt-8 flex flex-col lg:flex-row gap-8">
          {/* Life Goals Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex-1 bg-cream-50/80 dark:bg-ink-800/80 backdrop-blur-sm p-6 rounded-xl border border-cream-200/50 dark:border-ink-700/50 shadow-lg"
          >
            <h3 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-4">Select Your Quests</h3>

            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {state.lifeGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center space-x-3 rounded-lg border border-cream-200 dark:border-ink-700 p-3 cursor-pointer hover:bg-cream-100/50 dark:hover:bg-ink-700/50 transition-colors"
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={goal.selected}
                      onCheckedChange={() => toggleGoal(goal.id)}
                    />
                    <Label
                      htmlFor={`goal-${goal.id}`}
                      className="flex-1 cursor-pointer font-light text-ink-800 dark:text-cream-100"
                    >
                      {goal.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 flex items-center space-x-2">
              <Input
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Add a custom quest..."
                className="bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCustomGoal()
                  }
                }}
              />
              <button
                onClick={handleAddCustomGoal}
                disabled={!customGoal.trim()}
                className="px-4 py-2 bg-logo-blue text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </motion.div>

          {/* MyCOW Help Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex-1 bg-cream-50/80 dark:bg-ink-800/80 backdrop-blur-sm p-6 rounded-xl border border-cream-200/50 dark:border-ink-700/50 shadow-lg relative"
          >
            <h3 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-4">How can MyCOW help you?</h3>

            <div className="space-y-3">
              {[
                "Curate a Moo Mix",
                "Teach me wealth-building skills",
                "Guide me to wealth protection",
                "Let me invest on my own",
                "I don't know yet",
              ].map((help) => (
                <div
                  key={help}
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    state.myCowHelp.includes(help as any)
                      ? "border-logo-blue bg-blue-50/50 dark:bg-blue-900/20"
                      : "border-cream-200 dark:border-ink-700 hover:bg-cream-100/50 dark:hover:bg-ink-700/50"
                  }`}
                  onClick={() => toggleMyCowHelp(help as any)}
                >
                  <Checkbox
                    id={`help-${help}`}
                    checked={state.myCowHelp.includes(help as any)}
                    onCheckedChange={() => toggleMyCowHelp(help as any)}
                  />
                  <Label
                    htmlFor={`help-${help}`}
                    className="flex-1 cursor-pointer font-light text-ink-800 dark:text-cream-100"
                  >
                    {help}
                  </Label>
                </div>
              ))}
            </div>

            {/* Custom MyCOW Help Input */}
            <div className="mt-4 flex items-center space-x-2">
              <Input
                value={customMyCowHelp}
                onChange={(e) => setCustomMyCowHelp(e.target.value)}
                placeholder="Add a custom way MyCOW can help..."
                className="bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCustomMyCowHelp()
                  }
                }}
              />
              <button
                onClick={handleAddCustomMyCowHelp}
                disabled={!customMyCowHelp.trim()}
                className="px-4 py-2 bg-logo-blue text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Quest Map Animation */}
            {showQuestMap && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  duration: 0.8,
                }}
                className="absolute -right-4 -top-4"
              >
                <div className="bg-cream-100 dark:bg-ink-700 rounded-full p-3 shadow-lg">
                  <MapPin className="w-6 h-6 text-logo-blue dark:text-blue-400" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </OnboardingStep>
  )
}
