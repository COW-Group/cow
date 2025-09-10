"use client"

import type { AuthError, AuthResponse, User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export interface AuthService {
  signInWithPassword: (email: string, password: string) => Promise<AuthResponse>
  signUpWithPassword: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<{ error: AuthError | null }>
  resendConfirmationEmail: (email: string) => Promise<string | null>
  getCurrentUser: () => Promise<User | null>
  getSession: () => Promise<any>
  onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: any } }
}

export const authService: AuthService = {
  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signUpWithPassword(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: 'investor'
        }
      }
    })
  },

  async signOut() {
    return await supabase.auth.signOut()
  },

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password`
    })
  },

  async resendConfirmationEmail(email: string): Promise<string | null> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })
      return error?.message || null
    } catch (err: any) {
      return err.message || 'Failed to resend confirmation email'
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getSession() {
    return await supabase.auth.getSession()
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

