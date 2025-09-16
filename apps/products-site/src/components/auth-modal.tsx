import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/lib/auth-context"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  userType?: {
    id: string
    title: string
    subtitle: string
    description: string
  } | null
}

export function AuthModal({ isOpen, onClose, userType }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [isResendConfirmation, setIsResendConfirmation] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [resendEmail, setResendEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { signInWithPassword, signUp, resetPassword, resendConfirmationEmail, loading, error, getDashboardRoute } = useAuthContext()
  const navigate = useNavigate()

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let result
      if (isLogin) {
        result = await signInWithPassword(email, password)
      } else {
        result = await signUp(email, password)
      }
      
      if (!error) {
        setEmail("")
        setPassword("")
        setIsResetPassword(false)
        setIsResendConfirmation(false)
        setSuccessMessage("")
        onClose()
        
        // Navigate to appropriate dashboard or onboarding
        if (result.needsOnboarding) {
          navigate('/onboarding')
        } else {
          navigate(getDashboardRoute())
        }
      }
    } catch (err) {
      console.error(isLogin ? "Sign-in error:" : "Sign-up error:", err)
    }
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(resetEmail)
      setSuccessMessage("Password reset email sent. Please check your inbox.")
      setResetEmail("")
    } catch (err) {
      console.error("Password reset error:", err)
    }
  }

  const handleResendConfirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resendConfirmationEmail(resendEmail)
      setSuccessMessage("Confirmation email resent. Please check your inbox.")
      setResendEmail("")
    } catch (err) {
      console.error("Resend confirmation error:", err)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setIsResetPassword(false)
    setIsResendConfirmation(false)
    setEmail("")
    setPassword("")
    setResetEmail("")
    setResendEmail("")
    setSuccessMessage("")
  }

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword)
    setIsResendConfirmation(false)
    setEmail("")
    setPassword("")
    setResetEmail("")
    setResendEmail("")
    setSuccessMessage("")
  }

  const toggleResendConfirmation = () => {
    setIsResendConfirmation(!isResendConfirmation)
    setIsResetPassword(false)
    setEmail("")
    setPassword("")
    setResetEmail("")
    setResendEmail("")
    setSuccessMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[calc(100vw-32px)] max-w-xs sm:w-[calc(100vw-48px)] sm:max-w-md md:w-[calc(100vw-64px)] md:max-w-lg lg:w-[calc(100vw-80px)] lg:max-w-xl xl:max-w-2xl max-h-[calc(100vh-64px)] text-gray-900 border-0 p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(200%)',
          borderRadius: '2rem',
          border: '1px solid rgba(203, 213, 225, 0.3)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          margin: '16px',
          minHeight: 'min-content'
        }}
      >
        {/* Professional Header - 8-Point Grid System */}
        <div 
          className="px-6 sm:px-8 md:px-10 lg:px-12 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
            borderBottom: '1px solid rgba(203, 213, 225, 0.4)'
          }}
        >
          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl text-slate-800 font-light tracking-tight leading-tight">
              {isResetPassword ? "Reset Password" : isResendConfirmation ? "Resend Confirmation Email" : isLogin ? "Sign In" : "Register"}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto">
              {isResetPassword
                ? "Enter your email to receive a secure password reset link."
                : isResendConfirmation
                ? "We'll resend the confirmation email to your inbox."
                : isLogin
                ? "Welcome back. Please sign in to your account."
                : "Join thousands of investors in tokenized assets."}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {/* Professional Content Area - 8-Point Grid Spacing */}
        <div className="px-6 sm:px-8 md:px-10 lg:px-12 pb-6 sm:pb-8 md:pb-10">
        {isResetPassword ? (
          <form onSubmit={handleResetPasswordSubmit} className="grid gap-6 sm:gap-8 pt-4 sm:pt-6">
            <div className="grid gap-3 sm:gap-4">
              <Label 
                htmlFor="reset-email" 
                className="text-base text-slate-700 font-medium tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="h-14 border-2 border-slate-200/60 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 font-light text-lg transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                placeholder="your@email.com"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl text-sm text-center bg-red-50/80 text-red-800 border-2 border-red-200/60 backdrop-blur-sm font-medium shadow-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl text-sm text-center bg-green-50/80 text-green-800 border-2 border-green-200/60 backdrop-blur-sm font-medium shadow-sm">
                {successMessage}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-14 sm:h-16 rounded-2xl border-0 text-lg sm:text-xl font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:scale-[1.02] focus:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }} 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : null}
              Send Reset Email
            </Button>
          </form>
        ) : isResendConfirmation ? (
          <form onSubmit={handleResendConfirmationSubmit} className="grid gap-6 sm:gap-8 pt-4 sm:pt-6">
            <div className="grid gap-3 sm:gap-4">
              <Label 
                htmlFor="resend-email" 
                className="text-base text-slate-700 font-medium tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="resend-email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="h-14 border-2 border-slate-200/60 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 font-light text-lg transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                placeholder="your@email.com"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl text-sm text-center bg-red-50/80 text-red-800 border-2 border-red-200/60 backdrop-blur-sm font-medium shadow-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl text-sm text-center bg-green-50/80 text-green-800 border-2 border-green-200/60 backdrop-blur-sm font-medium shadow-sm">
                {successMessage}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-14 sm:h-16 rounded-2xl border-0 text-lg sm:text-xl font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:scale-[1.02] focus:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }} 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : null}
              Resend Confirmation Email
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAuthSubmit} className="grid gap-6 sm:gap-8 pt-4 sm:pt-6">
            <div className="grid gap-3 sm:gap-4">
              <Label 
                htmlFor="email" 
                className="text-base text-slate-700 font-medium tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 border-2 border-slate-200/60 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 font-light text-lg transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="grid gap-3 sm:gap-4">
              <Label 
                htmlFor="password" 
                className="text-base text-slate-700 font-medium tracking-wide"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 border-2 border-slate-200/60 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 font-light text-lg transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                placeholder="••••••••••••"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl text-sm text-center bg-red-50/80 text-red-800 border-2 border-red-200/60 backdrop-blur-sm font-medium shadow-sm">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-14 sm:h-16 rounded-2xl border-0 text-lg sm:text-xl font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:scale-[1.02] focus:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }} 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : null}
              {isLogin ? "Sign In" : "Register"}
            </Button>
          </form>
        )}
        
        {/* Professional Footer - 8-Point Grid System */}
        <div 
          className="text-center px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6 mt-2 sm:mt-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {isResetPassword || isResendConfirmation ? (
            <Button
              variant="link"
              onClick={isResetPassword ? toggleResetPassword : toggleResendConfirmation}
              className="p-0 h-auto text-slate-600 hover:text-slate-900 transition-colors duration-200 font-light"
            >
              ← Back to {isLogin ? "Sign In" : "Register"}
            </Button>
          ) : (
            <>
              {isLogin ? (
                <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
                  <div className="text-gray-500 font-light">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      onClick={toggleMode}
                      className="p-0 h-auto text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium underline tracking-wide"
                    >
                      Register here
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <Button
                      variant="link"
                      onClick={toggleResetPassword}
                      className="p-0 h-auto text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs sm:text-sm font-light transition-colors duration-200 tracking-wide"
                    >
                      Forgot Password?
                    </Button>
                    <Button
                      variant="link"
                      onClick={toggleResendConfirmation}
                      className="p-0 h-auto text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs sm:text-sm font-light transition-colors duration-200 tracking-wide"
                    >
                      Resend Confirmation Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
                  <div className="text-gray-500 font-light">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={toggleMode}
                      className="p-0 h-auto text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium underline tracking-wide"
                    >
                      Sign in here
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    onClick={toggleResendConfirmation}
                    className="p-0 h-auto text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs sm:text-sm font-light transition-colors duration-200 tracking-wide"
                  >
                    Resend Confirmation Email
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal