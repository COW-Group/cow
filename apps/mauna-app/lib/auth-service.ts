import { supabase } from "./supabase"
import type { User } from "./types"
import {
  encryptData,
  decryptData,
  generateSalt,
  reEncryptData,
  type SensitiveUserData
} from "./encryption"

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

  // ========== ENCRYPTION METHODS ==========

  /**
   * Register new user with encrypted data storage
   */
  async signUpWithEncryption(
    email: string,
    password: string,
    initialData: Partial<SensitiveUserData> = {}
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log("Supabase: Attempting sign-up with encryption for:", email)

      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User registration failed')

      // 2. Generate salt for this user
      const salt = generateSalt()

      // 3. Encrypt initial data with user's password
      const encryptedData = encryptData(initialData, password)

      // 4. Store encrypted data in database
      const { error: dbError } = await supabase
        .from('encrypted_user_data')
        .insert({
          user_id: authData.user.id,
          encrypted_data: encryptedData,
          salt: salt,
          data_version: 1
        })

      if (dbError) throw dbError

      console.log("Supabase: Sign-up with encryption successful")
      return { user: authData.user, error: null }
    } catch (error: any) {
      console.error("Supabase: Sign-up with encryption failed:", error.message)
      return { user: null, error: error.message }
    }
  },

  /**
   * Login and decrypt user data
   */
  async signInWithDecryption(
    email: string,
    password: string
  ): Promise<{ user: User | null; userData: SensitiveUserData | null; encryptionKey: string | null; error: string | null }> {
    try {
      console.log("Supabase: Attempting sign-in with decryption for:", email)

      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Authentication failed')

      // 2. Fetch user's encrypted data
      const { data: encryptedRecord, error: fetchError } = await supabase
        .from('encrypted_user_data')
        .select('encrypted_data, salt, data_version')
        .eq('user_id', authData.user.id)
        .single()

      if (fetchError) {
        // User might not have encrypted data yet (new user or migrating)
        console.warn("No encrypted data found, creating empty record")
        const salt = generateSalt()
        const emptyData = encryptData({}, password)

        await supabase
          .from('encrypted_user_data')
          .insert({
            user_id: authData.user.id,
            encrypted_data: emptyData,
            salt: salt,
            data_version: 1
          })

        return {
          user: authData.user,
          userData: {} as SensitiveUserData,
          encryptionKey: password,
          error: null
        }
      }

      // 3. Decrypt data client-side using password
      try {
        const decryptedData = decryptData<SensitiveUserData>(
          encryptedRecord.encrypted_data,
          password
        )

        console.log("Supabase: Sign-in with decryption successful")
        return {
          user: authData.user,
          userData: decryptedData,
          encryptionKey: password,
          error: null
        }
      } catch (decryptError) {
        throw new Error('Failed to decrypt user data - possible data corruption')
      }
    } catch (error: any) {
      console.error("Supabase: Sign-in with decryption failed:", error.message)
      return { user: null, userData: null, encryptionKey: null, error: error.message }
    }
  },

  /**
   * Unlock session after page refresh (user still logged in but needs to re-decrypt)
   */
  async unlockWithPassword(password: string): Promise<{ userData: SensitiveUserData | null; encryptionKey: string | null; error: string | null }> {
    try {
      console.log("Supabase: Attempting to unlock with password")

      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // 2. Fetch encrypted data
      const { data: encryptedRecord, error: fetchError } = await supabase
        .from('encrypted_user_data')
        .select('encrypted_data, salt, data_version')
        .eq('user_id', session.user.id)
        .single()

      if (fetchError) throw fetchError

      // 3. Decrypt data
      const decryptedData = decryptData<SensitiveUserData>(
        encryptedRecord.encrypted_data,
        password
      )

      console.log("Supabase: Unlock successful")
      return {
        userData: decryptedData,
        encryptionKey: password,
        error: null
      }
    } catch (error: any) {
      console.error("Supabase: Unlock failed:", error.message)
      return { userData: null, encryptionKey: null, error: 'Failed to unlock - incorrect password' }
    }
  },

  /**
   * Save encrypted user data
   */
  async saveEncryptedUserData(
    userId: string,
    userData: SensitiveUserData,
    encryptionKey: string
  ): Promise<{ error: string | null }> {
    try {
      console.log("Supabase: Saving encrypted user data")

      // 1. Encrypt data client-side
      const encryptedData = encryptData(userData, encryptionKey)

      // 2. Update database
      const { error } = await supabase
        .from('encrypted_user_data')
        .update({
          encrypted_data: encryptedData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error

      console.log("Supabase: Encrypted user data saved successfully")
      return { error: null }
    } catch (error: any) {
      console.error("Supabase: Save encrypted data failed:", error.message)
      return { error: error.message }
    }
  },

  /**
   * Change password and re-encrypt all data
   */
  async changePasswordAndReEncrypt(
    oldPassword: string,
    newPassword: string
  ): Promise<{ error: string | null }> {
    try {
      console.log("Supabase: Changing password with re-encryption")

      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // 2. Fetch current encrypted data
      const { data: encryptedRecord, error: fetchError } = await supabase
        .from('encrypted_user_data')
        .select('encrypted_data')
        .eq('user_id', session.user.id)
        .single()

      if (fetchError) throw fetchError

      // 3. Re-encrypt with new password
      const reEncryptedData = reEncryptData(
        encryptedRecord.encrypted_data,
        oldPassword,
        newPassword
      )

      // 4. Update Supabase auth password
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) throw authError

      // 5. Update encrypted data with new encryption
      const { error: dbError } = await supabase
        .from('encrypted_user_data')
        .update({
          encrypted_data: reEncryptedData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id)

      if (dbError) throw dbError

      console.log("Supabase: Password changed and data re-encrypted successfully")
      return { error: null }
    } catch (error: any) {
      console.error("Supabase: Password change with re-encryption failed:", error.message)
      return { error: error.message }
    }
  },
}
