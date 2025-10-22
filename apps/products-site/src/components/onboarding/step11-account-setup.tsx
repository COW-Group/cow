// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Mail, Crown, Sparkles, MapPin, UserPlus, LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step11AccountSetup: React.FC = () => {
  const { state, updateState, completeOnboarding, prevStep } = useOnboarding()

  const orbTextAuthenticated =
    "Complete Your Wealth Journey by setting up your account. Enter your phone number and email to get started."
  const orbTextUnauthenticated = `You've completed your wealth assessment, ${state.firstName}! Now create your account to save your progress and access your personalized wealth journey.`

  const highlightWordsAuthenticated = ["Complete", "Your", "Wealth Journey", "account"]
  const highlightWordsUnauthenticated = [
    "completed",
    "wealth assessment",
    state.firstName,
    "create your account",
    "save your progress",
    "personalized wealth journey",
  ]

  const { speak } = useGuideSpeech({
    autoPlayText: state.isAuthenticated ? orbTextAuthenticated : orbTextUnauthenticated,
    autoPlayGuideType: state.guideType || "Moo",
  }) // Pass autoplay props here

  const [phoneNumber, setPhoneNumber] = useState(state.phoneNumber)
  const [email, setEmail] = useState(state.email)
  const [isPremium, setIsPremium] = useState(state.isPremium)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showJourneyMap, setShowJourneyMap] = useState(false)
  const navigate = useNavigate()

  const isAuthenticated = state.isAuthenticated

  const handleSignUp = () => {
    // Save current step for return after auth
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_return_step", "11")
    }
    navigate("/auth/signup")
  }

  const handleSignIn = () => {
    // Save current step for return after auth
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_return_step", "11")
    }
    navigate("/auth/signin")
  }

  const handleComplete = () => {
    updateState("phoneNumber", phoneNumber)
    updateState("email", email)
    updateState("isPremium", isPremium)
    setShowJourneyMap(true)

    // Complete onboarding after showing journey map
    setTimeout(() => {
      completeOnboarding()
    }, 3000)
  }

  const isFormValid = phoneNumber && email && agreeToTerms

  const journeyHighlights = [
    { icon: <MapPin className="w-6 h-6" />, title: "Compass", description: "View your financial flow" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Assets", description: "Build your Moo Mix" },
    { icon: <Crown className="w-6 h-6" />, title: "Wealth Vision", description: "Achieve your goals" },
  ]

  if (showJourneyMap) {
    return (
      <div className="max-w-4xl mx-auto w-full p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#0066FF] to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-light text-slate-800 dark:text-slate-100 mb-4">
              Welcome to Your Wealth Journey!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Your personalized plan is ready. Here's what awaits you:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {journeyHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="text-[#0066FF] mb-4">{highlight.icon}</div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">{highlight.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{highlight.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30"
          >
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-2">
              Welcome, {state.firstName}, {state.wealthClass} Hero!
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Your wealth journey begins now. Redirecting to your dashboard...
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // If not authenticated, show sign up/sign in options
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto w-full p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-20">
        <div className="flex flex-col items-center mb-8">
          <AnimatedOrb
            text={orbTextUnauthenticated}
            highlightWords={highlightWordsUnauthenticated}
            guideType={state.guideType || "Moo"}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Your Account</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              You've completed your wealth assessment, {state.firstName}! Now create your account to save your progress
              and access your personalized wealth journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-center">
                <UserPlus className="w-12 h-12 text-[#0066FF] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-2">New to MyCOW?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Create a new account to start your wealth journey
                </p>
                <Button
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-center">
                <LogIn className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-2">Already have an account?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Sign in to continue your wealth journey</p>
                <Button
                  onClick={handleSignIn}
                  variant="outline"
                  className="w-full border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Back
            </Button>
            <div className="text-sm text-ink-500 dark:text-slate-400">Complete authentication to continue</div>
          </div>
        </motion.div>
      </div>
    )
  }

  // If authenticated, show the account setup form
  return (
    <div className="max-w-4xl mx-auto w-full p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-20">
      <div className="flex flex-col items-center mb-8">
        <AnimatedOrb
          text={orbTextAuthenticated}
          highlightWords={highlightWordsAuthenticated}
          guideType={state.guideType || "Moo"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200 font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                size={18}
              />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                size={18}
              />
              <Input
                id="email"
                type="email"
                placeholder="hero@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div>
          <Label className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-4 block">Choose Your Plan</Label>
          <RadioGroup
            value={isPremium ? "premium" : "free"}
            onValueChange={(value) => setIsPremium(value === "premium")}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4 rounded-lg border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
              <RadioGroupItem value="free" id="plan-free" />
              <div className="flex-1">
                <Label htmlFor="plan-free" className="cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                    <span className="text-lg font-medium text-slate-800 dark:text-slate-100">Free Wealth Plan</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Access to basic wealth planning tools and educational content
                  </p>
                </Label>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-500">$0</div>
                <div className="text-sm text-ink-500 dark:text-slate-400">per month</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 rounded-lg border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
              <RadioGroupItem value="premium" id="plan-premium" />
              <div className="flex-1">
                <Label htmlFor="plan-premium" className="cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <Crown className="w-6 h-6 text-[#0066FF]" />
                    <span className="text-lg font-medium text-slate-800 dark:text-slate-100">Premium Plan</span>
                    <span className="bg-gradient-to-r from-[#0066FF] to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Full access to Moo Mix, Learn modules, advanced analytics, and personalized guidance
                  </p>
                </Label>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#0066FF]">$15</div>
                <div className="text-sm text-ink-500 dark:text-slate-400">per month</div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
          <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} className="mt-1" />
          <Label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-[#0066FF] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0066FF] hover:underline">
              Privacy Policy
            </a>
            . I understand that MyCOW will help me manage my wealth journey and that I can cancel anytime.
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-[#0066FF] to-emerald-500 hover:from-[#0066FF]/90 hover:to-emerald-500/90 text-white disabled:opacity-50 px-8 py-3 text-lg"
          >
            {isPremium ? "Start Premium Journey" : "Start Free Journey"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
