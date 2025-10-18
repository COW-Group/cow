"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Briefcase, Users, Building, TrendingUp } from "lucide-react"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step6Skills: React.FC = () => {
  const { state, updateState, nextStep, prevStep, toggleSkill } = useOnboarding()
  const orbText =
    "How would you like to earn your money? Select your current preferences. We can learn about the pros and cons of each from the learning dashboard later on."
  const highlightWords = ["earn your money", "preferences", "pros and cons", "learning dashboard"]
  const { speak } = useGuideSpeech({ autoPlayText: orbText, autoPlayGuideType: state.guideType || "Moo" }) // Pass autoplay props here
  const [showSkillTree, setShowSkillTree] = useState(false)

  // Show skill tree animation after a delay
  useEffect(() => {
    if (state.skillsToImprove.length > 0) {
      const timer = setTimeout(() => {
        setShowSkillTree(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.skillsToImprove])

  const skills = [
    {
      id: "Employment" as const,
      name: "Employment Skills",
      description: "Job training, career advancement, workplace skills",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "Self-Employment" as const,
      name: "Self-Employment Skills",
      description: "Freelancing, consulting, independent contracting",
      icon: <Users className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "Business" as const,
      name: "Business Skills",
      description: "Entrepreneurship, business management, scaling",
      icon: <Building className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "Investing" as const,
      name: "Investing Skills",
      description: "Asset management, portfolio building, market analysis",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
  ]

  const handleContinue = () => {
    nextStep()
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md rounded-xl shadow-lg border border-cream-200/50 dark:border-ink-700/50 mb-20">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <AnimatedOrb text={orbText} highlightWords={highlightWords} guideType={state.guideType || "Moo"} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`relative p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                state.skillsToImprove.includes(skill.id)
                  ? "border-logo-blue bg-blue-50/50 dark:bg-blue-900/20 shadow-lg"
                  : "border-cream-200 dark:border-ink-700 hover:border-cream-300 dark:hover:border-ink-600 bg-cream-25 dark:bg-ink-800"
              }`}
              onClick={() => toggleSkill(skill.id)}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`skill-${skill.id}`}
                    checked={state.skillsToImprove.includes(skill.id)}
                    onCheckedChange={() => toggleSkill(skill.id)}
                  />
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    {skill.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <Label htmlFor={`skill-${skill.id}`} className="cursor-pointer">
                    <h3 className="text-base sm:text-lg font-medium text-ink-800 dark:text-cream-100 mb-2">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-ink-600 dark:text-cream-300">{skill.description}</p>
                  </Label>
                </div>
              </div>

              {/* Skill node animation */}
              {state.skillsToImprove.includes(skill.id) && showSkillTree && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: index * 0.1,
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-logo-blue to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Skill Tree Visualization */}
        {showSkillTree && state.skillsToImprove.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 1 }}
            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
          >
            <h3 className="text-base sm:text-lg font-medium text-ink-800 dark:text-cream-100 mb-4 text-center">
              Your Skill Development Path
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {state.skillsToImprove.map((skillId, index) => {
                const skill = skills.find((s) => s.id === skillId)
                return (
                  <motion.div
                    key={skillId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center space-x-2 bg-white dark:bg-ink-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md"
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${skill?.color} flex items-center justify-center`}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-ink-700 dark:text-cream-200">
                      {skill?.name}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-cream-300 dark:border-ink-600 hover:bg-cream-100 dark:hover:bg-ink-800 h-10 sm:h-12"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white h-10 sm:h-12"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
