"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { JournalEntry, Range } from "@/lib/types"
import { toast } from "sonner"
import { Loader2Icon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JournalPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [visionBoardData, setVisionBoardData] = useState<Range[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJournalEntries = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await databaseService.getJournalEntries(user.id)
      if (error) throw error
      console.log("Fetched journal entries:", data)
      setJournalEntries(data || [])
    } catch (err: any) {
      console.error("Failed to fetch journal entries:", err)
      setError("Failed to load journal entries. Please try again.")
      toast.error("Failed to load journal entries.")
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const fetchVisionBoardData = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await databaseService.fetchRanges(user.id)
      console.log("Fetched vision board ranges:", data)
      setVisionBoardData(data)
    } catch (err: any) {
      console.error("Failed to fetch vision board data:", err)
      toast.error("Failed to load vision board data.")
    }
  }, [user?.id])

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchJournalEntries()
      fetchVisionBoardData()
    } else if (!authLoading && !user?.id) {
      setLoading(false)
      setError("Please sign in to view your journal.")
      router.push("/auth/signin")
    }
  }, [user?.id, authLoading, fetchJournalEntries, fetchVisionBoardData, router])

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      if (!user?.id) return
      try {
        await databaseService.deleteJournalEntry(entryId, user.id)
        setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId))
        toast.success("Journal entry deleted successfully!")
      } catch (err: any) {
        console.error("Failed to delete journal entry:", err)
        toast.error("Failed to delete journal entry.")
      }
    },
    [user?.id],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <Loader2Icon className="h-10 w-10 animate-spin text-vibrant-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25 p-4">
      <div className="h-16 sm:h-20"></div>
      <main className="container mx-auto p-4 sm:p-6 max-w-full flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center">Journal</h1>
          <Button
            onClick={() => router.push("/journal/new")}
            className="text-cream-25 border-cream-25/50 hover:bg-cream-25/10"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </div>
        {journalEntries.length === 0 ? (
          <p className="text-cream-25">No journal entries found. Create one to get started!</p>
        ) : (
          <div className="grid gap-4">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg bg-cream-25/10 text-cream-25">
                <h2 className="text-xl font-medium">{entry.title || "Untitled"}</h2>
                <p>{entry.entry ? entry.entry.slice(0, 100) + "..." : "No content"}</p>
                {entry.visionboardlevel && entry.visionboarditemtitle && (
                  <p className="text-sm">
                    Linked to: {entry.visionboardlevel} - {entry.visionboarditemtitle}
                  </p>
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/journal/${entry.id}`)}
                  className="mt-2"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="mt-2 ml-2"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}