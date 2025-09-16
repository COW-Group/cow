"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { databaseService } from "@/lib/database-service"

type OnboardingStep = "name" | "sync" | "email" | "password"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth(AuthService)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("name")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInitializedStep = useRef(false)

  console.log(
    `[OnboardingPage Render] currentStep: ${currentStep}, loading: ${loading}, user: ${user ? user.id : "null"}`,
  )

  useEffect(() => {
    console.log(`[OnboardingPage useEffect] Auth state changed. loading: ${loading}, user: ${user ? user.id : "null"}`)
    if (!loading) {
      if (user) {
        console.log("[OnboardingPage useEffect] User found, redirecting to dashboard.")
        router.push("/dashboard")
      } else if (!hasInitializedStep.current) {
        console.log("[OnboardingPage useEffect] No user, setting initial step to 'name'.")
        setCurrentStep("name")
        hasInitializedStep.current = true
      } else {
        console.log("[OnboardingPage useEffect] No user, initial step already set. Current step:", currentStep)
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentStep])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[handleNameSubmit] Submitting name:", userName)
    if (userName.trim()) {
      setCurrentStep("sync")
      console.log("[handleNameSubmit] Set currentStep to 'sync'.")
    } else {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      })
      console.log("[handleNameSubmit] Name empty, showing toast.")
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[handleEmailSubmit] Submitting email:", userEmail)
    if (!userEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to continue.",
        variant: "destructive",
      })
      console.log("[handleEmailSubmit] Email empty, showing toast.")
      return
    }
    setCurrentStep("password")
    console.log("[handleEmailSubmit] Set currentStep to 'password'.")
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[handleAuthSubmit] Attempting auth for email:", userEmail)
    if (!userEmail || !userPassword) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      console.log("[handleAuthSubmit] Missing credentials.")
      return
    }

    setIsSubmitting(true)
    let authSuccess = false
    let authMessage = ""

    try {
      console.log("[handleAuthSubmit] Attempting sign-in...")
      const signInResult = await AuthService.signInWithPassword(userEmail, userPassword)

      if (signInResult.error) {
        console.log("[handleAuthSubmit] Sign-in failed, attempting sign-up:", signInResult.error.message)
        const signUpResult = await AuthService.signUpWithPassword(userEmail, userPassword)

        if (signUpResult.error) {
          console.error("[handleAuthSubmit] Sign-up also failed:", signUpResult.error.message)
          authSuccess = false
          authMessage = signUpResult.error.message || "An unknown error occurred during sign-up."
        } else {
          authSuccess = true
          if (signUpResult.data.user?.identities && signUpResult.data.user.identities.length === 0) {
            authMessage = "Sign up successful! Please check your email to confirm your account."
            if (userName.trim() && signUpResult.data.user) {
              await databaseService.createOrUpdateUserProfile(signUpResult.data.user.id, userName.trim())
            }
            console.log("[handleAuthSubmit] Sign-up successful, redirecting to auth confirm.")
            router.push("/auth/confirm?type=signup_pending")
            return
          } else {
            authMessage = "Account created and signed in successfully!"
            if (signUpResult.data.user && userName.trim()) {
              await databaseService.createOrUpdateUserProfile(signUpResult.data.user.id, userName.trim())
            }
            console.log("[handleAuthSubmit] Account created and signed in.")
          }
        }
      } else {
        authSuccess = true
        authMessage = "Signed in successfully!"
        if (signInResult.data.user && userName.trim()) {
          await databaseService.createOrUpdateUserProfile(signInResult.data.user.id, userName.trim())
        }
        console.log("[handleAuthSubmit] Signed in successfully.")
      }

      if (authSuccess) {
        toast({
          title: "Success!",
          description: authMessage,
        })
        console.log("[handleAuthSubmit] Auth success, redirecting to dashboard.")
        router.push("/dashboard")
      } else {
        toast({
          title: "Authentication Failed",
          description: authMessage,
          variant: "destructive",
        })
        console.log("[handleAuthSubmit] Auth failed.")
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred during authentication. Please try again.",
        variant: "destructive",
      })
      console.error("[handleAuthSubmit] Unexpected error during auth:", error)
    } finally {
      setIsSubmitting(false)
      console.log("[handleAuthSubmit] Auth process finished. isSubmitting set to false.")
    }
  }

  const handleBack = () => {
    console.log("[handleBack] Current step was:", currentStep)
    let nextStep: OnboardingStep
    if (currentStep === "sync") {
      nextStep = "name"
    } else if (currentStep === "email") {
      nextStep = "sync"
    } else if (currentStep === "password") {
      nextStep = "email"
    } else {
      nextStep = "name"
    }
    setCurrentStep(nextStep)
    console.log("[handleBack] Setting step to:", nextStep)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full max-w-lg mx-auto px-4 relative z-10 text-center text-cream-25 text-2xl">Loading...</div>
      )
    }

    return (
      <div className="w-full max-w-lg mx-auto px-4 relative z-10 text-center space-y-6">
        {currentStep === "name" && (
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="glassmorphism p-6 rounded-xl shadow-lg">
              <h1 className="text-5xl md:text-6xl font-barlow text-cream-25 leading-tight">
                Hello! What is your name?
              </h1>
            </div>
            <div className="glassmorphism-inner-card p-4 rounded-xl shadow-md">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full h-16 text-4xl md:text-5xl text-foreground bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-center font-caveat"
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>
            <p className="text-sm text-cream-100/80 font-inter mt-2">
              Please enter your first name or the name you prefer to be called.
            </p>
            <Button
              type="submit"
              className="h-14 px-8 text-xl glassmorphism text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 rounded-full shadow-lg font-inter"
              disabled={isSubmitting}
            >
              Continue <ArrowLeft className="rotate-180 ml-2" />
            </Button>
          </form>
        )}

        {currentStep === "sync" && (
          <div className="space-y-6">
            <div className="flex items-center justify-start mb-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="glassmorphism px-4 py-2 rounded-full text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 font-inter flex items-center gap-2"
                aria-label="Back to Name"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-lg">Name</span>
              </Button>
            </div>
            <div className="glassmorphism p-4 rounded-xl shadow-lg">
              <p className="text-sm text-cream-100/80 uppercase tracking-widest font-inter">MAUNA ACCOUNT</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-lg">
              <h1 className="text-5xl md:text-6xl font-montserrat text-cream-25 leading-tight">
                How do you want to sync your data, {userName}?
              </h1>
            </div>
            <Button
              onClick={() => setCurrentStep("email")}
              className="w-full h-14 text-lg glassmorphism text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 rounded-full shadow-lg font-inter"
              disabled={isSubmitting}
            >
              <Mail className="mr-2 h-6 w-6" />
              Continue with Email
            </Button>
            <Button
              onClick={() => {
                toast({ title: "Guest Mode", description: "Continuing as a guest." })
                router.push("/dashboard")
              }}
              variant="ghost"
              className="w-full h-14 text-lg text-cream-25 hover:bg-cream-25/10 hover:text-cream-100 transition-colors duration-300 rounded-full font-inter"
              disabled={isSubmitting}
            >
              Stay logged out
            </Button>
          </div>
        )}

        {currentStep === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="flex items-center justify-start mb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="glassmorphism px-4 py-2 rounded-full text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 font-inter flex items-center gap-2"
                aria-label="Back to Sync Options"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-lg">Continue with...</span>
              </Button>
            </div>
            <div className="glassmorphism p-4 rounded-xl shadow-lg">
              <p className="text-sm text-cream-100/80 uppercase tracking-widest font-inter">MAUNA ACCOUNT</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-lg">
              <h1 className="text-5xl md:text-6xl font-montserrat text-cream-25 leading-tight">
                What's your email, {userName}?
              </h1>
            </div>
            <div className="glassmorphism-inner-card p-4 rounded-xl shadow-md">
              <Input
                ref={inputRef}
                type="email"
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full h-16 text-4xl md:text-5xl text-foreground bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-center font-caveat"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            <div className="glassmorphism p-4 rounded-xl shadow-lg">
              <p className="text-sm text-cream-100/80 font-inter">
                Enter your email to create a MAUNA account or log in.
              </p>
            </div>
            <Button
              type="submit"
              className="h-14 px-8 text-xl glassmorphism text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 rounded-full shadow-lg font-inter"
              disabled={isSubmitting}
            >
              Continue <ArrowLeft className="rotate-180 ml-2" />
            </Button>
          </form>
        )}

        {currentStep === "password" && (
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div className="flex items-center justify-start mb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="glassmorphism px-4 py-2 rounded-full text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 font-inter flex items-center gap-2"
                aria-label="Back to Email"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-lg">Email</span>
              </Button>
            </div>
            <div className="glassmorphism p-4 rounded-xl shadow-lg">
              <p className="text-sm text-cream-100/80 uppercase tracking-widest font-inter">SIGNING IN</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-lg">
              <h1 className="text-5xl md:text-6xl font-montserrat text-cream-25 leading-tight">
                Enter your MAUNA password.
              </h1>
            </div>
            <div className="glassmorphism-inner-card p-4 rounded-xl shadow-md relative">
              <Input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full h-16 text-4xl md:text-5xl text-foreground bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-center font-caveat pr-12"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 text-cream-25 hover:text-cream-100"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </Button>
            </div>
            <Button
              type="submit"
              className="h-14 px-8 text-xl glassmorphism text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 rounded-full shadow-lg font-inter"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Sign In / Sign Up"}
            </Button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">{renderContent()}</div>
  )
}