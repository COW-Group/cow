import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type Profile } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

// Use the Profile type from Supabase, extending it with legacy fields for compatibility
interface UserProfile extends Partial<Profile> {
  id: string
  full_name: string | null
  email: string
  avatar_url?: string
  created_at: string
  // Legacy fields for backwards compatibility
  user_type?: 'accredited_investor' | 'international_investor' | 'institutional_investor' | 'retail_investor'
  investment_experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  primary_interest?: 'wealth_preservation' | 'income_generation' | 'growth' | 'diversification'
  compliance_status?: {
    kyc_verified: boolean
    accredited_verified: boolean
    mifid_assessment_completed: boolean
    region: 'us' | 'eu' | 'international'
  }
}

interface AuthContextType {
  auth: {
    user: AuthUser | null
    profile: UserProfile | null
    isAuthenticated: boolean
  }
  loading: boolean
  error: string | null
  signInWithPassword: (email: string, password: string) => Promise<{ needsOnboarding: boolean }>
  signUp: (email: string, password: string) => Promise<{ needsOnboarding: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>
  getDashboardRoute: () => string
}

const AuthContext = createContext<AuthContextType>({
  auth: { user: null, profile: null, isAuthenticated: false },
  loading: false,
  error: null,
  signInWithPassword: async () => ({ needsOnboarding: false }),
  signUp: async () => ({ needsOnboarding: true }),
  signOut: async () => {},
  resetPassword: async () => {},
  resendConfirmationEmail: async () => {},
  updateUserProfile: async () => {},
  getDashboardRoute: () => '/dashboard',
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{
    user: AuthUser | null
    profile: UserProfile | null
    isAuthenticated: boolean
  }>({ user: null, profile: null, isAuthenticated: false })
  const [loading, setLoading] = useState(false) // Start with loading false
  const [error, setError] = useState<string | null>(null)

  // Helper function to save auth state to localStorage
  const saveAuthState = (authState: typeof auth) => {
    try {
      localStorage.setItem('cow_auth_state', JSON.stringify(authState))
    } catch (error) {
      console.warn('Failed to save auth state to localStorage:', error)
    }
  }

  // Helper function to update auth state and persist it
  const updateAuth = (authState: typeof auth) => {
    setAuth(authState)
    saveAuthState(authState)
  }

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthState = async () => {
      console.log('🔍 Checking auth state on mount...')
      // SKIP: Supabase getSession() hangs in Chrome
      // Auth state will be populated when user signs in
      console.log('ℹ️ Skipping session check (Chrome compatibility)')
    }

    checkAuthState()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata
        }

        const userProfile: UserProfile = profile ? {
          ...profile,
          full_name: profile.full_name || session.user.user_metadata.full_name || null,
          email: session.user.email || '',
          avatar_url: profile.avatar_url || session.user.user_metadata.avatar_url,
          created_at: profile.created_at || new Date().toISOString()
        } : {
          id: session.user.id,
          full_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || null,
          email: session.user.email || '',
          created_at: session.user.created_at || new Date().toISOString()
        }

        updateAuth({ user: authUser, profile: userProfile, isAuthenticated: true })
      } else if (event === 'SIGNED_OUT') {
        updateAuth({ user: null, profile: null, isAuthenticated: false })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    console.log('🟢 signInWithPassword START', { email, hasSupabase: !!supabase })
    setLoading(true)
    setError(null)

    // NUCLEAR WORKAROUND: Chrome blocks ALL Supabase Promise methods
    // Make raw HTTP request and manually parse the response
    try {
      console.log('🟢 Making raw HTTP auth request...')

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const authData = await response.json()
      console.log('✅ Auth response received', { hasUser: !!authData.user })

      if (authData.user) {
        // Fetch profile directly with raw HTTP
        console.log('🟢 Fetching profile...')
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${authData.user.id}&select=*`,
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              'Authorization': `Bearer ${authData.access_token}`
            }
          }
        )

        const profiles = await profileResponse.json()
        const profile = profiles?.[0]

        const authUser: AuthUser = {
          id: authData.user.id,
          email: authData.user.email || '',
          user_metadata: authData.user.user_metadata
        }

        const userProfile: UserProfile = profile ? {
          ...profile,
          full_name: profile.full_name || authData.user.user_metadata.full_name || null,
          email: authData.user.email || '',
          avatar_url: profile.avatar_url || authData.user.user_metadata.avatar_url,
          created_at: profile.created_at || new Date().toISOString()
        } : {
          id: authData.user.id,
          full_name: authData.user.user_metadata.full_name || authData.user.email?.split('@')[0] || null,
          email: authData.user.email || '',
          created_at: authData.user.created_at || new Date().toISOString()
        }

        updateAuth({ user: authUser, profile: userProfile, isAuthenticated: true })

        // Store session in localStorage for Supabase client
        const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
        localStorage.setItem(storageKey, JSON.stringify(authData))

        console.log('✅ Authentication successful!')
        setLoading(false)
        return { needsOnboarding: !profile }
      }

      throw new Error('Authentication failed - no user returned')

    } catch (err: any) {
      console.error('❌ Sign-in error:', err)
      setError(err.message || "Sign-in failed")
      setLoading(false)
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0] // Use email prefix as default name
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            full_name: email.split('@')[0],
            investor_type: 'individual',
            accreditation_verified: false,
            kyc_status: 'not_started',
            metadata: {}
          })

        if (profileError) {
          console.warn('Failed to create profile:', profileError)
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          full_name: email.split('@')[0],
          email: data.user.email || '',
          created_at: new Date().toISOString()
        }

        updateAuth({ user: authUser, profile: userProfile, isAuthenticated: true })
        return { needsOnboarding: true } // New users need onboarding
      }

      return { needsOnboarding: true }
    } catch (err: any) {
      setError(err.message || "Sign-up failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      updateAuth({ user: null, profile: null, isAuthenticated: false })
      localStorage.removeItem('cow_auth_state')
    } catch (err: any) {
      setError(err.message || "Sign-out failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Failed to resend confirmation email")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    setLoading(true)
    setError(null)
    try {
      if (auth.user) {
        // Update profile in database
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', auth.user.id)

        if (error) throw error

        // Update local state
        if (auth.profile) {
          const updatedProfile = { ...auth.profile, ...profileUpdates }
          const newAuthState = { ...auth, profile: updatedProfile }
          updateAuth(newAuthState)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDashboardRoute = () => {
    // All users now use the unified professional dashboard
    return '/dashboard'

    // NOTE: Type-specific dashboards still exist at:
    // - /dashboard/institutional
    // - /dashboard/accredited
    // - /dashboard/international
    // - /dashboard/retail
    // But all users are routed to the default /dashboard which uses the professional design
  }

  return (
    <AuthContext.Provider value={{ 
      auth, 
      loading, 
      error, 
      signInWithPassword, 
      signUp, 
      signOut, 
      resetPassword, 
      resendConfirmationEmail,
      updateUserProfile,
      getDashboardRoute
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}