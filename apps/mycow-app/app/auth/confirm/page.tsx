"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ZenCard } from "@/components/zen-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOnboarding } from "@/contexts/onboarding-context" // Import useOnboarding

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getClientSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const { completeOnboarding } = useOnboarding() // Get completeOnboarding

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      const onboardingReturnStep = searchParams.get("onboarding_return_step") // Get onboarding flag

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any, // Cast to any as 'type' can be 'email' or 'phone'
        })

        if (error) {
          setMessage(error.message)
          setMessageType("error")
        } else {
          setMessage("Your email has been successfully confirmed!")
          setMessageType("success")
          // If coming from onboarding, complete it
          if (onboardingReturnStep) {
            localStorage.removeItem("onboarding_return_step") // Clear the flag
            completeOnboarding() // This will set isComplete and redirect to /
          } else {
            // Regular confirmation, redirect to home after a short delay
            setTimeout(() => {
              router.push("/")
            }, 2000)
          }
        }
      } else {
        setMessage("Invalid confirmation link.")
        setMessageType("error")
      }
      setLoading(false)
    }

    confirmEmail()
  }, [router, searchParams, supabase, completeOnboarding]) // Add completeOnboarding to dependencies

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
              Email Confirmation
            </h1>
            <p className="text-ink-600 dark:text-cream-300 text-center leading-relaxed">
              {loading ? "Confirming your email..." : message}
            </p>
          </motion.div>

          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          )}

          {!loading && message && (
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
              {messageType === "success" && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              <span>{message}</span>
            </motion.div>
          )}

          {!loading && messageType === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <Link href="/" passHref>
                <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </motion.div>
          )}
        </ZenCard>
      </motion.div>
    </div>
  )
}
