"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Target, Plus } from "lucide-react"
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import type { VisionBoardSection } from "@/types/wealth-vision"
import { RangeCard } from "./range-card" // Import the new RangeCard
import { AddTopLevelRangeModal } from "./add-top-level-range-modal" // Import the new modal
import type { RealtimeChannel } from "@supabase/supabase-js" // Import RealtimeChannel

export function WealthVisionSection() {
  const [wealthVisionSections, setWealthVisionSections] = useState<VisionBoardSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddTopLevelRangeModalOpen, setIsAddTopLevelRangeModalOpen] = useState(false)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      console.log("WealthVisionSection: Setting up realtime and fetching initial data...")
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("WealthVisionSection: Error getting authenticated user data:", authError.message)
        setError("Failed to get user authentication status: " + authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        console.warn("WealthVisionSection: No authenticated user found. Not fetching wealth vision data.")
        setError("Authentication required to view Wealth Vision.")
        setLoading(false)
        return
      }

      const userId = authData.user.id
      console.log("WealthVisionSection: Authenticated user ID:", userId)

      // Initial fetch
      await fetchWealthVisionData(userId)

      // Set up Realtime subscription for the 'ranges' table
      channel = supabase
        .channel(`ranges_for_user_${userId}`) // Updated channel name
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to INSERT, UPDATE, DELETE
            schema: "public",
            table: "ranges", // Updated table name
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("WealthVisionSection: Realtime change received for ranges:", payload)
            if (payload.eventType === "INSERT") {
              setWealthVisionSections((prev) =>
                [...prev, payload.new as VisionBoardSection].sort(
                  (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
                ),
              )
            } else if (payload.eventType === "UPDATE") {
              setWealthVisionSections((prev) =>
                prev.map((section) => (section.id === payload.old.id ? (payload.new as VisionBoardSection) : section)),
              )
            } else if (payload.eventType === "DELETE") {
              setWealthVisionSections((prev) => prev.filter((section) => section.id !== payload.old.id))
            }
          },
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, []) // Empty dependency array to run once on mount

  const fetchWealthVisionData = async (userId: string) => {
    setLoading(true)
    setError(null)
    console.log("WealthVisionSection: Attempting to fetch ranges for user:", userId)
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("ranges") // Updated table name
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })

      if (sectionsError) {
        console.error("WealthVisionSection: Error fetching sections:", sectionsError.message)
        throw sectionsError
      }
      console.log("WealthVisionSection: Fetched sections data:", sectionsData)
      setWealthVisionSections(sectionsData || [])
    } catch (err: any) {
      console.error("WealthVisionSection: Failed to load wealth vision:", err.message)
      setError("Failed to load wealth vision: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ZenCard>
        <div className="flex items-center justify-center h-48 text-ink-600 dark:text-cream-300">
          Loading Wealth Vision...
        </div>
      </ZenCard>
    )
  }

  if (error) {
    return (
      <ZenCard>
        <div className="text-red-500 text-center h-48 flex items-center justify-center">Error: {error}</div>
      </ZenCard>
    )
  }

  return (
    <div className="space-y-8">
      <ZenCard>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 flex items-center">
            <Target className="w-5 h-5 mr-3 text-logo-blue" />
            Your Wealth Vision
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddTopLevelRangeModalOpen(true)} // Open the Add Top-Level Range modal
            className="bg-logo-blue hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Range
          </Button>
        </div>
        <p className="text-sm text-ink-600 dark:text-cream-400 mb-6">
          Ranges represent your highest-level wealth vision categories, such as "Financial Freedom" or "Special
          Activities & Experiences."
        </p>
        <div className="grid gap-4">
          {wealthVisionSections.length > 0 ? (
            wealthVisionSections.map((range) => (
              <motion.div
                key={range.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RangeCard range={range} />
              </motion.div>
            ))
          ) : (
            <div className="text-center text-ink-600 dark:text-cream-300 py-8">
              No Ranges defined yet. Click "Add Range" to start building your Wealth Vision!
            </div>
          )}
        </div>
      </ZenCard>

      {/* Add Top-Level Range Modal */}
      <AddTopLevelRangeModal
        isOpen={isAddTopLevelRangeModalOpen}
        onClose={() => setIsAddTopLevelRangeModalOpen(false)}
      />
    </div>
  )
}
