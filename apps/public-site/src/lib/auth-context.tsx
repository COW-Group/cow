"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { AuthUser, UserProfile } from "./types"

interface AuthContextType {
  auth: {
    user: AuthUser | null
    profile: UserProfile | null
    isAuthenticated: boolean
  }
  loading: boolean
  error: string | null
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (role: string | string[]) => boolean
  canAccessInvestorFeatures: () => boolean
  canAccessStaffFeatures: () => boolean
  canAccessAdminFeatures: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  auth: { user: null, profile: null, isAuthenticated: false },
  loading: false,
  error: null,
  signInWithPassword: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  resendConfirmationEmail: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
  hasRole: () => false,
  canAccessInvestorFeatures: () => false,
  canAccessStaffFeatures: () => false,
  canAccessAdminFeatures: () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<{
    user: AuthUser | null
    profile: UserProfile | null
    isAuthenticated: boolean
  }>({ user: null, profile: null, isAuthenticated: false })
  const [loading, setLoading] = useState(true) // Start with loading true to check existing session
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { authService } = await import('./auth-service')
        const { data: { session } } = await authService.getSession()
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata || {}
          }

          const { databaseService } = await import('./database-service')
          let profile = await databaseService.fetchUserProfile(authUser.id)
          
          if (!profile && authUser.email) {
            profile = await databaseService.createOrUpdateUserProfile(
              authUser.id,
              authUser.user_metadata.full_name || authUser.email.split('@')[0],
              authUser.user_metadata.role || 'investor'
            )
          }

          setAuth({ 
            user: authUser, 
            profile: profile, 
            isAuthenticated: true 
          })
        }
      } catch (err) {
        console.error('Error checking session:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state listener
    const setupAuthListener = async () => {
      const { authService } = await import('./auth-service')
      const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata || {}
          }

          const { databaseService } = await import('./database-service')
          let profile = await databaseService.fetchUserProfile(authUser.id)
          
          if (!profile && authUser.email) {
            profile = await databaseService.createOrUpdateUserProfile(
              authUser.id,
              authUser.user_metadata.full_name || authUser.email.split('@')[0],
              authUser.user_metadata.role || 'investor'
            )
          }

          setAuth({ 
            user: authUser, 
            profile: profile, 
            isAuthenticated: true 
          })
        } else if (event === 'SIGNED_OUT') {
          setAuth({ user: null, profile: null, isAuthenticated: false })
        }
      })

      return () => subscription.unsubscribe()
    }

    setupAuthListener()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { authService } = await import('./auth-service')
      const response = await authService.signInWithPassword(email, password)
      
      if (response.error) {
        throw new Error(response.error.message)
      }

      if (response.data.user) {
        const authUser: AuthUser = {
          id: response.data.user.id,
          email: response.data.user.email,
          user_metadata: response.data.user.user_metadata || {}
        }

        // Fetch or create user profile
        const { databaseService } = await import('./database-service')
        let profile = await databaseService.fetchUserProfile(authUser.id)
        
        if (!profile && authUser.email) {
          // Create profile if it doesn't exist
          profile = await databaseService.createOrUpdateUserProfile(
            authUser.id,
            authUser.user_metadata.full_name || authUser.email.split('@')[0],
            authUser.user_metadata.role || 'investor'
          )
        }

        setAuth({ 
          user: authUser, 
          profile: profile, 
          isAuthenticated: true 
        })
      }
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
      const { authService } = await import('./auth-service')
      const response = await authService.signUpWithPassword(email, password)
      
      if (response.error) {
        throw new Error(response.error.message)
      }

      // Note: After signup, user needs to verify email before they can sign in
      // We don't set auth state here since they're not fully authenticated yet
    } catch (err: any) {
      setError(err.message || "Sign-up failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { authService } = await import('./auth-service')
      const { error } = await authService.signOut()
      
      if (error) {
        throw new Error(error.message)
      }
      
      setAuth({ user: null, profile: null, isAuthenticated: false })
    } catch (err: any) {
      setError(err.message || "Sign-out failed")
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      const { authService } = await import('./auth-service')
      const { error } = await authService.resetPasswordForEmail(email)
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email")
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    setLoading(true)
    try {
      const { authService } = await import('./auth-service')
      const error = await authService.resendConfirmationEmail(email)
      
      if (error) {
        throw new Error(error)
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend confirmation email")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!auth.user) throw new Error("User must be authenticated")
    setLoading(true)
    try {
      const { databaseService } = await import('./database-service')
      const updatedProfile = await databaseService.updateUserProfile(auth.user.id, updates)
      
      setAuth(prev => ({
        ...prev,
        profile: updatedProfile
      }))
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!auth.user) return
    
    try {
      const { databaseService } = await import('./database-service')
      const profile = await databaseService.fetchUserProfile(auth.user.id)
      
      setAuth(prev => ({
        ...prev,
        profile: profile
      }))
    } catch (err: any) {
      console.error('Failed to refresh profile:', err)
    }
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!auth.profile?.role) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(auth.profile.role)
  }

  const canAccessInvestorFeatures = (): boolean => {
    return hasRole(['investor', 'staff', 'admin'])
  }

  const canAccessStaffFeatures = (): boolean => {
    return hasRole(['staff', 'admin'])
  }

  const canAccessAdminFeatures = (): boolean => {
    return hasRole('admin')
  }

  const contextValue: AuthContextType = {
    auth,
    loading,
    error,
    signInWithPassword,
    signUp,
    signOut,
    resetPassword,
    resendConfirmationEmail,
    updateProfile,
    refreshProfile,
    hasRole,
    canAccessInvestorFeatures,
    canAccessStaffFeatures,
    canAccessAdminFeatures,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}