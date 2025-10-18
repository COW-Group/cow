"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Star, Target, TrendingUp } from "lucide-react"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step10WealthPlan: React.FC = () => {
  const { state, nextStep, prevStep } = useOnboarding()
  const orbText = `Way to go, ${state.firstName}! Your Wealth Hero is taking shape. View Your Wealth Journey now.`
  const highlightWords = ["Wealth Hero", "View", "Your", "Wealth Journey"]
  const orbTextPlanReady = "Your Plan is ready"
  const { speak } = useGuideSpeech({ autoPlayText: orbText, autoPlayGuideType: state.guideType || "Moo" }) // Pass autoplay props here

  const [planProgress, setPlanProgress] = useState(0)
  const [showPlanPreview, setShowPlanPreview] = useState(false)
  const [planComplete, setPlanComplete] = useState(false)

  // Simulate plan generation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowPlanPreview(true)
          setTimeout(() => {
            setPlanComplete(true)
            speak(state.guideType || "Moo", orbTextPlanReady) // Speak when plan is ready
          }, 1000)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [speak, state.guideType, orbTextPlanReady])

  const planSections = [
    { name: "Financial Assessment", progress: planProgress >= 20 },
    { name: "Risk Profile Analysis", progress: planProgress >= 40 },
    { name: "Goal Prioritization", progress: planProgress >= 60 },
    { name: "Investment Strategy", progress: planProgress >= 80 },
    { name: "Action Plan Creation", progress: planProgress >= 100 },
  ]

  const wealthHeroProfile = {
    name: state.firstName,
    class: state.wealthClass,
    lifeStage: state.lifeStage,
    selectedGoals: state.lifeGoals.filter((goal) => goal.selected).length,
    riskLevel: state.riskTolerance,
    supportLevel: state.helpNeeded,
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-6 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md rounded-xl shadow-lg border border-cream-200/50 dark:border-ink-700/50 mb-20">
      <div className="flex flex-col items-center mb-8">
        <AnimatedOrb text={orbText} highlightWords={highlightWords} guideType={state.guideType || "Moo"} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        {/* Plan Generation Progress */}
        <div className="text-center">
          <h3 className="text-xl font-medium text-ink-800 dark:text-cream-100 mb-4">
            Creating Your Personalized Wealth Plan
          </h3>
          <div className="max-w-md mx-auto">
            <Progress value={planProgress} className="h-3 mb-4" />
            <p className="text-sm text-ink-600 dark:text-cream-300">{planProgress}% Complete</p>
          </div>
        </div>

        {/* Plan Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planSections.map((section, index) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: section.progress ? 1 : 0.5,
                scale: section.progress ? 1 : 0.9,
              }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border transition-all duration-500 ${
                section.progress
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-cream-200 dark:border-ink-700 bg-cream-25 dark:bg-ink-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                {section.progress ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-cream-300 dark:border-ink-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    section.progress ? "text-emerald-700 dark:text-emerald-300" : "text-ink-600 dark:text-cream-400"
                  }`}
                >
                  {section.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wealth Hero Profile Preview */}
        {showPlanPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-logo-blue to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-ink-800 dark:text-cream-100 mb-2">
                {wealthHeroProfile.name}, the {wealthHeroProfile.class} Hero
              </h3>
              <p className="text-ink-600 dark:text-cream-300">Your Wealth Hero Profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 dark:bg-ink-800/50 rounded-lg">
                <Target className="w-8 h-8 text-logo-blue mx-auto mb-2" />
                <div className="text-sm text-ink-600 dark:text-cream-300">Life Stage</div>
                <div className="font-medium text-ink-800 dark:text-cream-100">{wealthHeroProfile.lifeStage}</div>
              </div>

              <div className="text-center p-4 bg-white/50 dark:bg-ink-800/50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-sm text-ink-600 dark:text-cream-300">Active Goals</div>
                <div className="font-medium text-ink-800 dark:text-cream-100">{wealthHeroProfile.selectedGoals}</div>
              </div>

              <div className="text-center p-4 bg-white/50 dark:bg-ink-800/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-ink-600 dark:text-cream-300">Risk Level</div>
                <div className="font-medium text-ink-800 dark:text-cream-100">{wealthHeroProfile.riskLevel}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plan Complete Message */}
        {planComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30"
          >
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-ink-800 dark:text-cream-100 mb-2">Your plan is ready!</h3>
            <p className="text-ink-600 dark:text-cream-300 mb-6">
              View Your Wealth Journey after you set up your account.
            </p>

            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 0 10px rgba(59, 130, 246, 0.1)",
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="inline-block"
            >
              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white px-8 py-3 text-lg"
              >
                View Your Wealth Journey
              </Button>
            </motion.div>
          </motion.div>
        )}

        {!planComplete && (
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              className="border-cream-300 dark:border-ink-600 hover:bg-cream-100 dark:hover:bg-ink-800"
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!planComplete}
              className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
