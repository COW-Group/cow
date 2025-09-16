"use client"
import type { User } from "@/lib/types"
import { useEffect, useState, useMemo } from "react"
import { AuthService } from "@/lib/auth-service"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Set up listener first to catch auth state changes
    const subscription = AuthService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Only fetch current user if no session is present
    const checkInitialUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error during initial user check:", error)
        await AuthService.signOut()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkInitialUser()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
  }

  // Memoize to prevent unnecessary re-renders
  return useMemo(() => ({ user, loading, signOut }), [user, loading])
}
