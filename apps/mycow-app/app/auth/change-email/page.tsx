"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import { ZenCard } from "@/components/zen-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ChangeEmailPage() {
  const [currentEmail, setCurrentEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const router = useRouter()
  const supabase = getClientSupabaseClient()

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (user) {
        setCurrentEmail(user.email || "")
      } else if (error) {
        setMessage("Failed to fetch current email: " + error.message)
        setMessageType("error")
      }
    }
    fetchUserEmail()
  }, [supabase])

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setMessageType(null)

    if (newEmail === currentEmail) {
      setMessage("New email cannot be the same as the current email.")
      setMessageType("error")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Confirmation link sent to your NEW email. Please verify to complete the change.")
      setMessageType("success")
      setNewEmail("") // Clear new email input
    }
    setLoading(false)
  }

  return (
    <ZenCard hover={false} className="p-8">
      <div className="flex flex-col items-center mb-6">
        <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-light text-ink-800 dark:text-cream-100 tracking-wide">
          My<span className="font-medium text-logo-blue">COW</span>
        </h1>
        <p className="text-ink-600 dark:text-cream-300 mt-2">Change your email address</p>
      </div>

      <form onSubmit={handleChangeEmail} className="space-y-4">
        <div>
          <Label htmlFor="current-email">Current Email</Label>
          <Input
            id="current-email"
            type="email"
            value={currentEmail}
            disabled
            className="mt-1 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100 opacity-70"
          />
        </div>
        <div>
          <Label htmlFor="new-email">New Email</Label>
          <Input
            id="new-email"
            type="email"
            placeholder="new@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="mt-1 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
          />
        </div>

        {message && (
          <p className={`text-sm ${messageType === "error" ? "text-red-500" : "text-sage-500"}`}>{message}</p>
        )}

        <Button type="submit" className="w-full bg-logo-blue hover:bg-blue-700 text-white" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Change Email
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-600 dark:text-cream-300">
        <Link href="/" className="text-logo-blue hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </ZenCard>
  )
}
