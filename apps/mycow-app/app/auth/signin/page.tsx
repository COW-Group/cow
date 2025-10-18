"use client"

import type React from "react"
import { XCircle } from "lucide-react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import { ZenCard } from "@/components/zen-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, ArrowRight, Mail } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context" // Import useOnboarding

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getClientSupabaseClient()
  const { completeOnboarding } = useOnboarding() // Get completeOnboarding

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setMessageType(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      const onboardingReturnStep = searchParams.get("onboarding_return_step")
      if (onboardingReturnStep) {
        // If coming from onboarding, complete it
        localStorage.removeItem("onboarding_return_step") // Clear the flag
        completeOnboarding() // This will set isComplete and redirect to /
      } else {
        router.push("/") // Regular sign-in, redirect to home
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-25 via-cream-50 to-emerald-50/30 dark:from-ink-950 dark:via-ink-900 dark:to-emerald-950/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-emerald-200/20 dark:from-blue-800/10 dark:to-emerald-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [-90, 0, -90],
          }}
          transition={{
            duration: 28,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <ZenCard
          hover={false}
          className="p-8 backdrop-blur-xl bg-cream-50/80 dark:bg-ink-800/80 border border-cream-200/50 dark:border-ink-700/50 shadow-2xl shadow-emerald-500/5 dark:shadow-emerald-400/5"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl" />
              <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-16 h-16 relative z-10 drop-shadow-lg" />
            </motion.div>

            <h1 className="text-3xl font-extralight text-ink-800 dark:text-cream-100 tracking-wide mb-2">
              Welcome Back to{" "}
              <span className="font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                MyCOW
              </span>
            </h1>
            <p className="text-ink-600 dark:text-cream-300 text-center leading-relaxed">
              Sign in to continue your zen financial journey
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSignIn}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Label htmlFor="email" className="text-ink-700 dark:text-cream-200 font-medium mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70 text-ink-800 dark:text-cream-100 backdrop-blur-sm focus:bg-cream-100 dark:focus:bg-ink-700 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-300 h-12 text-base pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 dark:text-cream-500 mt-0.5" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <Label htmlFor="password" className="text-ink-700 dark:text-cream-200 font-medium mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70 text-ink-800 dark:text-cream-100 backdrop-blur-sm focus:bg-cream-100 dark:focus:bg-ink-700 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-300 h-12 text-base pr-12"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 dark:text-cream-400 hover:text-ink-700 dark:hover:text-cream-200 transition-colors duration-200 mt-0.5"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm p-4 rounded-lg flex items-start space-x-3 ${
                  messageType === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                }`}
              >
                {messageType === "error" && <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                <span>{message}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <motion.div
                    className="flex items-center justify-center"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200/60 dark:border-ink-700/60" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream-50/80 dark:bg-ink-800/80 text-ink-500 dark:text-cream-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link
                href={
                  typeof window !== "undefined" && localStorage.getItem("onboarding_return_step")
                    ? `/auth/signup?onboarding_return_step=${localStorage.getItem("onboarding_return_step")}`
                    : "/auth/signup"
                }
                className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-200 group"
              >
                Sign up instead
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </motion.div>
        </ZenCard>
      </motion.div>
    </div>
  )
}
