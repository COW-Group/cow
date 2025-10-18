/**
 * Client-Side Encryption Utilities for Mauna
 *
 * Zero-knowledge encryption: All sensitive user data is encrypted in the browser
 * before being sent to Supabase. Only the user (with their password) can decrypt.
 *
 * Even COW staff with full database access cannot read encrypted user data.
 */

import CryptoJS from 'crypto-js'

/**
 * Generates a random salt for key derivation
 * This salt is stored unencrypted in the database (it's not secret)
 */
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString()
}

/**
 * Derives a strong encryption key from user's password using PBKDF2
 * @param password - User's password (never stored, only in memory during session)
 * @param salt - Random salt (stored in DB, not secret)
 * @returns Derived encryption key
 */
export function deriveEncryptionKey(password: string, salt: string): string {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,  // 256-bit key
    iterations: 100000   // 100k iterations for security
  })
  return key.toString()
}

/**
 * Encrypts sensitive user data using AES-256
 * @param data - Any JSON-serializable data
 * @param password - User's password (or derived key)
 * @returns Encrypted string (safe to store in database)
 */
export function encryptData(data: any, password: string): string {
  try {
    const dataString = JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(dataString, password)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypts user data
 * @param encryptedData - Encrypted string from database
 * @param password - User's password (or derived key)
 * @returns Decrypted data object
 * @throws Error if decryption fails (wrong password or corrupted data)
 */
export function decryptData<T = any>(encryptedData: string, password: string): T {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password)
    const dataString = decrypted.toString(CryptoJS.enc.Utf8)

    if (!dataString) {
      throw new Error('Decryption produced empty result')
    }

    return JSON.parse(dataString) as T
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt data - incorrect password or corrupted data')
  }
}

/**
 * Encrypts a specific field within an object
 * Useful for encrypting only sensitive fields while leaving metadata unencrypted
 */
export function encryptField(value: any, password: string): string {
  return encryptData(value, password)
}

/**
 * Decrypts a specific field
 */
export function decryptField<T = any>(encryptedValue: string, password: string): T {
  return decryptData<T>(encryptedValue, password)
}

/**
 * Validates if encrypted data can be decrypted with given password
 * Useful for testing password before attempting full decryption
 */
export function validatePassword(encryptedData: string, password: string): boolean {
  try {
    decryptData(encryptedData, password)
    return true
  } catch {
    return false
  }
}

/**
 * Re-encrypts data with a new password (for password change flow)
 * @param encryptedData - Current encrypted data
 * @param oldPassword - Current password
 * @param newPassword - New password
 * @returns Newly encrypted data
 */
export function reEncryptData(
  encryptedData: string,
  oldPassword: string,
  newPassword: string
): string {
  const decrypted = decryptData(encryptedData, oldPassword)
  return encryptData(decrypted, newPassword)
}

/**
 * Type definitions for encrypted data structures
 */

export interface EncryptedUserDataRecord {
  user_id: string
  encrypted_data: string  // Encrypted JSON blob
  salt: string           // For password-based key derivation
  data_version: number   // Schema version for migrations
  created_at: string
  updated_at: string
}

export interface SensitiveUserData {
  // Journal entries - very personal
  journal_entries?: any[]

  // Emotion tracking - mental health data
  emotion_entries?: any[]
  triggers?: any[]
  experiences?: any[]

  // Financial data - account information
  vehicles?: any[]  // Financial accounts

  // Goals and projects - business strategy
  goals?: any[]
  projects?: any[]

  // Personal productivity data
  steps?: any[]
  breaths?: any[]
  task_lists?: any[]

  // Vision board - personal aspirations
  ranges?: any[]
  mountains?: any[]
  hills?: any[]
  terrains?: any[]
  lengths?: any[]

  // Other sensitive metadata
  metadata?: {
    last_sync: string
    data_schema_version: number
  }
}

/**
 * Helper to determine if data needs encryption
 */
export function isSensitiveData(tableName: string): boolean {
  const sensitiveTables = [
    'journal',
    'emotion_entries',
    'triggers',
    'experiences',
    'vehicles',
    'goals',
    'projects',
    'steps',
    'breaths',
    'ranges',
    'mountains',
    'hills',
    'terrains',
    'lengths'
  ]
  return sensitiveTables.includes(tableName)
}

/**
 * Non-sensitive data that doesn't need encryption (only RLS)
 */
const nonSensitiveData = [
  'user_settings',   // Week start, timezone - not sensitive
  'app_settings',    // UI preferences
  'profiles',        // Public profile info
  'sounds'           // Global data, not user-specific
]

export function needsEncryption(tableName: string): boolean {
  return !nonSensitiveData.includes(tableName)
}
