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

  async getUserProfile(userId: string): Promise<{ profile: { id: string; name: string | null; email: string } | null; error: string | null }> {
    console.log("Supabase: Fetching user profile for user ID:", userId)

    // First get the auth user to get email
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error("Supabase: Error getting auth user:", authError.message)
      return { profile: null, error: authError.message }
    }

    // Then get the profile data
    const { data, error } = await supabase
      .from("profiles")
      .select("id, preferred_name, full_name")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Supabase: Error fetching user profile:", error.message)
      return { profile: null, error: error.message }
    }

    // Use preferred_name if available, otherwise full_name
    const name = data?.preferred_name || data?.full_name || null

    console.log("Supabase: User profile fetched successfully")
    return {
      profile: {
        id: data.id,
        name: name,
        email: authData.user?.email || ""
      },
      error: null
    }
  },

  async updateProfile(userId: string, updates: { name?: string; email?: string }): Promise<{ error: string | null }> {
    console.log("Supabase: Updating user profile for user ID:", userId, updates)

    // Update profile table with name
    if (updates.name !== undefined) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ preferred_name: updates.name, full_name: updates.name })
        .eq("id", userId)

      if (profileError) {
        console.error("Supabase: Error updating profile:", profileError.message)
        return { error: profileError.message }
      }
    }

    // Update auth email if provided
    if (updates.email !== undefined) {
      const { error: emailError } = await supabase.auth.updateUser({ email: updates.email })
      if (emailError) {
        console.error("Supabase: Error updating email:", emailError.message)
        return { error: emailError.message }
      }
    }

    console.log("Supabase: User profile updated successfully")
    return { error: null }
  },
}
