/**
 * EncryptionContext - Secure Session Management
 *
 * Manages the user's encryption key in memory during their session.
 * The key is derived from their password and stored ONLY in memory (never localStorage/cookies).
 *
 * Security notes:
 * - Key is cleared on logout or page refresh (intentional - requires re-authentication)
 * - Never persisted to disk/localStorage
 * - Automatically cleared when Supabase session ends
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import type { SensitiveUserData } from './encryption'

interface EncryptionContextType {
  // Encryption key (password or derived key) - stored in memory only
  encryptionKey: string | null

  // Set encryption key after successful login
  setEncryptionKey: (key: string) => void

  // Clear encryption key (on logout)
  clearEncryptionKey: () => void

  // Decrypted user data (cached in memory for performance)
  userData: SensitiveUserData | null

  // Set decrypted data after successful decryption
  setUserData: (data: SensitiveUserData) => void

  // Check if encryption is initialized
  isEncryptionReady: boolean

  // Current user
  user: User | null
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined)

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Encryption key stored in memory only (lost on page refresh - intentional)
  const [encryptionKey, setEncryptionKeyState] = useState<string | null>(null)

  // Decrypted user data cached in memory
  const [userData, setUserDataState] = useState<SensitiveUserData | null>(null)

  // Current Supabase user
  const [user, setUser] = useState<User | null>(null)

  // Initialize user from Supabase session
  useEffect(() => {
    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    initUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)

        // Clear encryption data on logout
        if (event === 'SIGNED_OUT') {
          clearEncryptionKey()
        }

        // Handle token refresh
        if (event === 'TOKEN_REFRESHED') {
          // Encryption key stays in memory, no action needed
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const setEncryptionKey = (key: string) => {
    setEncryptionKeyState(key)
  }

  const setUserData = (data: SensitiveUserData) => {
    setUserDataState(data)
  }

  const clearEncryptionKey = () => {
    setEncryptionKeyState(null)
    setUserDataState(null)

    // Optional: Show notification that data has been cleared
    console.log('Encryption key cleared from memory')
  }

  const isEncryptionReady = Boolean(encryptionKey && user)

  // Auto-clear on window close (additional security layer)
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearEncryptionKey()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const value: EncryptionContextType = {
    encryptionKey,
    setEncryptionKey,
    clearEncryptionKey,
    userData,
    setUserData,
    isEncryptionReady,
    user
  }

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  )
}

/**
 * Hook to access encryption context
 * @throws Error if used outside EncryptionProvider
 */
export function useEncryption() {
  const context = useContext(EncryptionContext)
  if (!context) {
    throw new Error('useEncryption must be used within EncryptionProvider')
  }
  return context
}

/**
 * Hook that ensures encryption is ready, redirects to login if not
 * Use this in protected pages that require decrypted user data
 */
export function useRequireEncryption() {
  const router = useRouter()
  const { isEncryptionReady, user } = useEncryption()

  useEffect(() => {
    if (!user) {
      // No user session - redirect to login
      router.push('/login')
    } else if (!isEncryptionReady) {
      // User logged in but encryption not initialized
      // This happens on page refresh - require re-authentication
      router.push('/unlock')  // Special unlock page (password entry only, no full login)
    }
  }, [isEncryptionReady, user, router])

  return { isEncryptionReady, user }
}

/**
 * Security Notes for Developers:
 *
 * 1. Encryption key is NEVER stored in localStorage, sessionStorage, or cookies
 *    - It exists only in React state (memory)
 *    - Lost on page refresh (user must re-authenticate)
 *    - This is intentional for security
 *
 * 2. On page refresh:
 *    - Supabase session persists (user still logged in)
 *    - But encryption key is lost
 *    - User must re-enter password to decrypt data
 *    - Use /unlock page for this (faster than full login)
 *
 * 3. Password is never stored:
 *    - Only used to derive encryption key on login
 *    - Key is kept in memory for session
 *    - Cleared on logout or page close
 *
 * 4. Data flow:
 *    Login → Derive key from password → Decrypt data → Cache in context
 *    Page refresh → Key lost → Redirect to unlock → Re-decrypt
 *    Logout → Clear everything
 */
