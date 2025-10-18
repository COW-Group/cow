'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth-service'
import { useEncryption } from '@/lib/encryption-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function UnlockPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setEncryptionKey, setUserData, user, isEncryptionReady } = useEncryption()

  const [password, setPassword] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/')
    } else if (isEncryptionReady) {
      // Already unlocked, go to dashboard
      router.push('/dashboard')
    }
  }, [user, isEncryptionReady, router])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password to unlock your data.",
        variant: "destructive",
      })
      return
    }

    setIsUnlocking(true)

    try {
      console.log("[UnlockPage] Attempting to unlock with password...")

      const result = await AuthService.unlockWithPassword(password)

      if (result.error) {
        console.error("[UnlockPage] Unlock failed:", result.error)
        toast({
          title: "Unlock Failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        })
      } else {
        console.log("[UnlockPage] Unlock successful")

        // Store encryption key and decrypted data in context
        if (result.encryptionKey && result.userData) {
          setEncryptionKey(result.encryptionKey)
          setUserData(result.userData)
        }

        toast({
          title: "Welcome back!",
          description: "Your data has been unlocked successfully.",
        })

        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error("[UnlockPage] Unexpected error:", error)
      toast({
        title: "Unlock Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnlocking(false)
    }
  }

  const handleLogout = async () => {
    await AuthService.signOut()
    router.push('/')
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-inter p-4">
      <div className="w-full max-w-lg mx-auto relative z-10 text-center space-y-6">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full glassmorphism">
            <Lock className="w-16 h-16 text-cream-25" />
          </div>
        </div>

        {/* Header */}
        <div className="glassmorphism p-4 rounded-xl shadow-lg">
          <p className="text-sm text-cream-100/80 uppercase tracking-widest font-inter">
            DATA LOCKED
          </p>
        </div>

        <div className="glassmorphism p-6 rounded-xl shadow-lg">
          <h1 className="text-5xl md:text-6xl font-montserrat text-cream-25 leading-tight mb-4">
            Welcome back!
          </h1>
          <p className="text-lg text-cream-100/90 font-inter">
            {user.email}
          </p>
        </div>

        {/* Explanation */}
        <div className="glassmorphism p-6 rounded-xl shadow-lg text-left">
          <p className="text-sm text-cream-100/80 font-inter leading-relaxed">
            For your security, your data is encrypted and the encryption key is not stored.
            Please enter your password to unlock your data.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="glassmorphism-inner-card p-4 rounded-xl shadow-md relative">
            <Input
              ref={inputRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 text-4xl md:text-5xl text-foreground bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-center font-caveat pr-12"
              disabled={isUnlocking}
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
            className="w-full h-14 px-8 text-xl glassmorphism text-cream-25 hover:bg-cream-25/20 transition-colors duration-300 rounded-full shadow-lg font-inter"
            disabled={isUnlocking}
          >
            {isUnlocking ? "Unlocking..." : "Unlock My Data"} <ArrowRight className="ml-2" />
          </Button>
        </form>

        {/* Logout Option */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-14 text-lg text-cream-25 hover:bg-cream-25/10 hover:text-cream-100 transition-colors duration-300 rounded-full font-inter"
          disabled={isUnlocking}
        >
          Sign Out
        </Button>

        {/* Security Note */}
        <div className="glassmorphism p-4 rounded-xl shadow-lg">
          <p className="text-xs text-cream-100/60 font-inter">
            🔐 Your data is encrypted client-side. Not even COW staff can access it without your password.
          </p>
        </div>
      </div>
    </div>
  )
}
