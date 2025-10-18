"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import { ZenCard } from "@/components/zen-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, Mail, Eye, EyeOff, CheckCircle, Key } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getClientSupabaseClient()

  useEffect(() => {
    const type = searchParams.get("type")
    const accessToken = searchParams.get("access_token")
    if (type === "recovery" && accessToken) {
      setIsResetting(true)
    }
  }, [searchParams])

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setMessageType(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Password reset link sent to your email!")
      setMessageType("success")
      setEmail("")
    }
    setLoading(false)
  }

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setMessageType(null)

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Your password has been reset successfully! Redirecting to sign in...")
      setMessageType("success")
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
    }
    setLoading(false)
  }

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword
  const passwordStrength = newPassword.length >= 8 ? "strong" : newPassword.length >= 6 ? "medium" : "weak"

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-25 via-cream-50 to-purple-50/30 dark:from-ink-950 dark:via-ink-900 dark:to-purple-950/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-blue-200/20 dark:from-purple-800/10 dark:to-blue-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 dark:from-blue-800/10 dark:to-purple-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [-90, 0, -90],
          }}
          transition={{
            duration: 30,
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
          className="p-8 backdrop-blur-xl bg-cream-50/80 dark:bg-ink-800/80 border border-cream-200/50 dark:border-ink-700/50 shadow-2xl shadow-purple-500/5 dark:shadow-purple-400/5"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl" />
              <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-16 h-16 relative z-10 drop-shadow-lg" />
            </motion.div>

            <h1 className="text-3xl font-extralight text-ink-800 dark:text-cream-100 tracking-wide mb-2">
              {isResetting ? "Set New Password" : "Reset Password"}
            </h1>
            <p className="text-ink-600 dark:text-cream-300 text-center leading-relaxed">
              {isResetting ? "Choose a strong password for your account" : "Enter your email to receive a reset link"}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            {isResetting ? (
              <form onSubmit={handleSetNewPassword} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Label htmlFor="new-password" className="text-ink-700 dark:text-cream-200 font-medium mb-2 block">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70 text-ink-800 dark:text-cream-100 backdrop-blur-sm focus:bg-cream-100 dark:focus:bg-ink-700 focus:border-purple-400 dark:focus:border-purple-500 transition-all duration-300 h-12 text-base pl-10 pr-12"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 dark:text-cream-500 mt-0.5" />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 dark:text-cream-400 hover:text-ink-700 dark:hover:text-cream-200 transition-colors duration-200 mt-0.5"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-cream-200 dark:bg-ink-600 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength === "strong"
                                ? "bg-emerald-500 w-full"
                                : passwordStrength === "medium"
                                  ? "bg-yellow-500 w-2/3"
                                  : "bg-red-500 w-1/3"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                passwordStrength === "strong" ? "100%" : passwordStrength === "medium" ? "66%" : "33%",
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength === "strong"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : passwordStrength === "medium"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Label htmlFor="confirm-password" className="text-ink-700 dark:text-cream-200 font-medium mb-2 block">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70 text-ink-800 dark:text-cream-100 backdrop-blur-sm focus:bg-cream-100 dark:focus:bg-ink-700 focus:border-purple-400 dark:focus:border-purple-500 transition-all duration-300 h-12 text-base pl-10 pr-12"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 dark:text-cream-500 mt-0.5" />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 dark:text-cream-400 hover:text-ink-700 dark:hover:text-cream-200 transition-colors duration-200 mt-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 flex items-center space-x-2"
                    >
                      {passwordsMatch ? (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Passwords match</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          Passwords don't match
                        </span>
                      )}
                    </motion.div>
                  )}
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
                    {messageType === "success" && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
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
                    disabled={loading || !passwordsMatch}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        Reset Password
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-6">
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
                      className="mt-1 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70 text-ink-800 dark:text-cream-100 backdrop-blur-sm focus:bg-cream-100 dark:focus:bg-ink-700 focus:border-purple-400 dark:focus:border-purple-500 transition-all duration-300 h-12 text-base pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 dark:text-cream-500 mt-0.5" />
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
                    {messageType === "success" && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                    <span>{message}</span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        Send Reset Link
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>

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
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200 group"
              >
                Back to Sign In
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </motion.div>
        </ZenCard>
      </motion.div>
    </div>
  )
}
