import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type Profile } from "@cow/supabase-client"
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
  name: string | null
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
  const [loading, setLoading] = useState(true) // Start with loading true
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
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from database
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
            name: profile.name || session.user.user_metadata.full_name || null,
            email: session.user.email || '',
            avatar_url: profile.avatar_url || session.user.user_metadata.avatar_url,
            created_at: profile.created_at || new Date().toISOString()
          } : {
            id: session.user.id,
            name: session.user.user_metadata.full_name || null,
            email: session.user.email || '',
            created_at: new Date().toISOString()
          }

          updateAuth({ user: authUser, profile: userProfile, isAuthenticated: true })
        }
      } catch (error) {
        console.warn('Failed to load auth state:', error)
      } finally {
        setLoading(false)
      }
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
          name: profile.name || session.user.user_metadata.full_name || null,
          email: session.user.email || '',
          avatar_url: profile.avatar_url || session.user.user_metadata.avatar_url,
          created_at: profile.created_at || new Date().toISOString()
        } : {
          id: session.user.id,
          name: session.user.user_metadata.full_name || null,
          email: session.user.email || '',
          created_at: new Date().toISOString()
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
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata
        }

        const userProfile: UserProfile = profile ? {
          ...profile,
          name: profile.name || data.user.user_metadata.full_name || null,
          email: data.user.email || '',
          avatar_url: profile.avatar_url || data.user.user_metadata.avatar_url,
          created_at: profile.created_at || new Date().toISOString()
        } : {
          id: data.user.id,
          name: data.user.user_metadata.full_name || null,
          email: data.user.email || '',
          created_at: new Date().toISOString()
        }

        updateAuth({ user: authUser, profile: userProfile, isAuthenticated: true })

        // Check if user needs onboarding (no profile data)
        const needsOnboarding = !profile
        return { needsOnboarding }
      }

      return { needsOnboarding: false }
    } catch (err: any) {
      setError(err.message || "Sign-in failed")
      throw err
    } finally {
      setLoading(false)
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
            name: email.split('@')[0],
            role: 'investor' // Default role
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
          name: email.split('@')[0],
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