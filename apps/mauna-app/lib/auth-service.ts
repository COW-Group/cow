import { supabase } from "./supabase"
import type { User } from "./types"

export const AuthService = {
  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<{ data: { user: User | null }; error: { message: string } | null }> {
    console.log("Supabase: Attempting sign-in with email:", email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("Supabase: Sign-in failed:", error.message)
      return { data: { user: null }, error: { message: error.message } }
    }
    console.log("Supabase: Sign-in successful.")
    return { data: { user: data.user || null }, error: null }
  },

  async signUpWithPassword(
    email: string,
    password: string,
  ): Promise<{ data: { user: User | null }; error: { message: string } | null }> {
    console.log("Supabase: Attempting sign-up with email:", email)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error("Supabase: Sign-up failed:", error.message)
      return { data: { user: null }, error: { message: error.message } }
    }
    console.log("Supabase: Sign-up successful (check email for confirmation if needed).")
    return { data: { user: data.user || null }, error: null }
  },

  async signOut(): Promise<{ error: string | null }> {
    console.log("Supabase: Signing out.")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Supabase: Sign-out failed:", error.message)
      return { error: error.message }
    }
    console.log("Supabase: Signed out successfully.")
    return { error: null }
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error && error.message !== "Auth session missing!") {
      console.error("Supabase: Error getting user:", error.message)
    }
    return user || null
  },

  async updateUserMetadata(metadata: { [key: string]: any }): Promise<{ success: boolean; error: string | null }> {
    console.log("Supabase: Updating user metadata:", metadata)
    const { data, error } = await supabase.auth.updateUser({ data: metadata })
    if (error) {
      console.error("Supabase: Failed to update user metadata:", error.message)
      return { success: false, error: error.message }
    }
    console.log("Supabase: User metadata updated successfully.")
    return { success: true, error: null }
  },

  async sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
    console.log("Supabase: Sending password reset email to:", email)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (error) {
      console.error("Supabase: Password reset email error:", error.message)
      return { error: error.message }
    }
    console.log("Supabase: Password reset email sent successfully.")
    return { error: null }
  },

  async updatePassword(newPassword: string): Promise<{ user: User | null; error: string | null }> {
    console.log("Supabase: Updating password.")
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      console.error("Supabase: Update password error:", error.message)
      return { user: null, error: error.message }
    }
    console.log("Supabase: Password updated successfully.")
    return { user: data.user || null, error: null }
  },

  onAuthStateChange(callback: (event: string, session: any | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback)
    return subscription
  },
}
