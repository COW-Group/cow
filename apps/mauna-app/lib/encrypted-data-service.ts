/**
 * Encrypted Data Service
 *
 * Handles all operations on encrypted user data:
 * - Registration with encryption
 * - Login with decryption
 * - Save/sync encrypted data
 * - Password change (re-encryption)
 */

import { supabase } from './supabase'
import {
  encryptData,
  decryptData,
  generateSalt,
  reEncryptData,
  type SensitiveUserData,
  type EncryptedUserDataRecord
} from './encryption'

/**
 * Register new user with encrypted data storage
 */
export async function registerUserWithEncryption(
  email: string,
  password: string,
  initialData: Partial<SensitiveUserData> = {}
) {
  try {
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

    return {
      user: authData.user,
      session: authData.session,
      message: 'Registration successful! Please check your email to verify your account.'
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

/**
 * Login and decrypt user data
 */
export async function loginAndDecryptData(email: string, password: string) {
  try {
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
      // User might not have encrypted data yet (migrating from old system)
      console.warn('No encrypted data found, creating empty record')
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
        session: authData.session,
        userData: {} as SensitiveUserData,
        encryptionKey: password
      }
    }

    // 3. Decrypt data client-side using password
    try {
      const decryptedData = decryptData<SensitiveUserData>(
        encryptedRecord.encrypted_data,
        password
      )

      return {
        user: authData.user,
        session: authData.session,
        userData: decryptedData,
        encryptionKey: password  // Store in memory via EncryptionContext
      }
    } catch (decryptError) {
      throw new Error('Failed to decrypt user data - possible data corruption')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Login failed')
  }
}

/**
 * Unlock session after page refresh
 * User is still authenticated but needs to re-enter password to decrypt data
 */
export async function unlockWithPassword(password: string) {
  try {
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

    return {
      userData: decryptedData,
      encryptionKey: password
    }
  } catch (error: any) {
    console.error('Unlock error:', error)
    throw new Error('Failed to unlock - incorrect password')
  }
}

/**
 * Save encrypted user data
 * Call this whenever user data changes
 */
export async function saveEncryptedUserData(
  userId: string,
  userData: SensitiveUserData,
  encryptionKey: string
) {
  try {
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

    return { success: true }
  } catch (error: any) {
    console.error('Save error:', error)
    throw new Error('Failed to save encrypted data')
  }
}

/**
 * Change user password and re-encrypt all data
 */
export async function changePasswordAndReEncrypt(
  oldPassword: string,
  newPassword: string
) {
  try {
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

    return {
      success: true,
      newEncryptionKey: newPassword
    }
  } catch (error: any) {
    console.error('Password change error:', error)
    throw new Error('Failed to change password')
  }
}

/**
 * Export user data (decrypted) for backup
 * User must be authenticated and have encryption key in memory
 */
export async function exportUserData(encryptionKey: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No active session')

    const { data: encryptedRecord, error } = await supabase
      .from('encrypted_user_data')
      .select('encrypted_data')
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error

    const decryptedData = decryptData<SensitiveUserData>(
      encryptedRecord.encrypted_data,
      encryptionKey
    )

    // Return as downloadable JSON
    return {
      exported_at: new Date().toISOString(),
      user_id: session.user.id,
      data: decryptedData
    }
  } catch (error: any) {
    console.error('Export error:', error)
    throw new Error('Failed to export data')
  }
}

/**
 * Delete all user data (irreversible)
 */
export async function deleteAllUserData() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No active session')

    // Delete encrypted data (cascade will handle related records)
    const { error } = await supabase
      .from('encrypted_user_data')
      .delete()
      .eq('user_id', session.user.id)

    if (error) throw error

    // Optional: Also delete auth user
    // await supabase.auth.admin.deleteUser(session.user.id)

    return { success: true }
  } catch (error: any) {
    console.error('Delete error:', error)
    throw new Error('Failed to delete user data')
  }
}

/**
 * Helper: Merge new data with existing encrypted data
 * Useful for partial updates
 */
export async function mergeEncryptedData(
  userId: string,
  partialData: Partial<SensitiveUserData>,
  encryptionKey: string
) {
  try {
    // 1. Fetch and decrypt current data
    const { data: encryptedRecord, error: fetchError } = await supabase
      .from('encrypted_user_data')
      .select('encrypted_data')
      .eq('user_id', userId)
      .single()

    if (fetchError) throw fetchError

    const currentData = decryptData<SensitiveUserData>(
      encryptedRecord.encrypted_data,
      encryptionKey
    )

    // 2. Merge with new data
    const mergedData: SensitiveUserData = {
      ...currentData,
      ...partialData,
      metadata: {
        ...currentData.metadata,
        ...partialData.metadata,
        last_sync: new Date().toISOString(),
        data_schema_version: 1
      }
    }

    // 3. Save merged data
    return await saveEncryptedUserData(userId, mergedData, encryptionKey)
  } catch (error: any) {
    console.error('Merge error:', error)
    throw new Error('Failed to merge encrypted data')
  }
}
