import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

interface UserProfile {
  id: string
  name: string | null
  email: string
  avatar_url?: string
  created_at: string
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
    const checkAuthState = () => {
      try {
        const savedAuth = localStorage.getItem('cow_auth_state')
        if (savedAuth) {
          const authState = JSON.parse(savedAuth)
          setAuth(authState)
        }
      } catch (error) {
        console.warn('Failed to load auth state from localStorage:', error)
        localStorage.removeItem('cow_auth_state')
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Mock authentication for demo - simulate existing user with profile
      const mockUser: AuthUser = {
        id: 'mock-user-id',
        email,
        user_metadata: { full_name: 'Demo User' }
      }
      
      // Simulate different user types based on email domain
      let userType: UserProfile['user_type'] = 'retail_investor'
      let investmentExperience: UserProfile['investment_experience'] = 'intermediate'
      let needsOnboarding = false

      if (email.includes('institutional') || email.includes('fund')) {
        userType = 'institutional_investor'
        investmentExperience = 'professional'
      } else if (email.includes('accredited') || email.includes('private')) {
        userType = 'accredited_investor'
        investmentExperience = 'advanced'
      } else if (email.includes('eu') || email.includes('europe')) {
        userType = 'international_investor'
      }

      const mockProfile: UserProfile = {
        id: 'mock-user-id',
        name: 'Demo User',
        email,
        created_at: new Date().toISOString(),
        user_type: userType,
        investment_experience: investmentExperience,
        primary_interest: 'diversification',
        compliance_status: {
          kyc_verified: true,
          accredited_verified: userType === 'accredited_investor' || userType === 'institutional_investor',
          mifid_assessment_completed: userType === 'international_investor',
          region: email.includes('eu') ? 'eu' : 'us'
        }
      }
      
      updateAuth({ user: mockUser, profile: mockProfile, isAuthenticated: true })
      return { needsOnboarding }
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
      // Mock signup for demo - new users need onboarding
      const mockUser: AuthUser = {
        id: 'mock-user-id',
        email,
        user_metadata: { full_name: 'New User' }
      }
      const mockProfile: UserProfile = {
        id: 'mock-user-id',
        name: 'New User',
        email,
        created_at: new Date().toISOString(),
        // New users start with minimal profile - will be completed during onboarding
        user_type: undefined,
        investment_experience: undefined,
        primary_interest: undefined,
        compliance_status: {
          kyc_verified: false,
          accredited_verified: false,
          mifid_assessment_completed: false,
          region: 'us' // Default, will be updated during onboarding
        }
      }
      updateAuth({ user: mockUser, profile: mockProfile, isAuthenticated: true })
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
      console.log("Password reset requested for:", email)
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
      console.log("Confirmation email resent to:", email)
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
      if (auth.profile) {
        const updatedProfile = { ...auth.profile, ...profileUpdates }
        const newAuthState = { ...auth, profile: updatedProfile }
        updateAuth(newAuthState)
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDashboardRoute = () => {
    if (!auth.profile?.user_type) {
      return '/onboarding'
    }
    
    // Route to different dashboard variants based on user type
    switch (auth.profile.user_type) {
      case 'institutional_investor':
        return '/dashboard/institutional'
      case 'accredited_investor':
        return '/dashboard/accredited'
      case 'international_investor':
        return '/dashboard/international'
      case 'retail_investor':
        return '/dashboard/retail'
      default:
        return '/dashboard'
    }
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