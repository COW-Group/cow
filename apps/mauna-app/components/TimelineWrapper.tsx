import React, { createContext, useState, useEffect, useCallback, useMemo } from "react"
import { Timeline } from "./Timeline"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2Icon } from "lucide-react"

interface Breath {
  id: string
  name: string
  completed: boolean
  isRunning: boolean
  timeEstimationSeconds: number
  position: number
}

interface TimelineItem {
  id: string
  label: string
  description: string
  color: string
  scheduledTime: string // HH:mm format
  duration: number // in minutes
  type: "habit" | "activity"
  isCompleted: boolean
  icon?: string
  frequency?: string
  isBuildHabit?: boolean
  history?: string[]
  breaths?: Breath[]
}

interface TimelineContextType {
  items: TimelineItem[]
  loading: boolean
  error: string | null
  userId: string | null
  refreshTimeline: () => Promise<void>
  updateItem: (itemId: string, updates: Partial<TimelineItem>) => Promise<void>
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const TimelineContext = createContext<TimelineContextType>({
  items: [],
  loading: true,
  error: null,
  userId: null,
  refreshTimeline: async () => {},
  updateItem: async () => {},
  selectedDate: new Date(),
  setSelectedDate: () => {},
})

export const TimelineWrapper = ({ currentDate = new Date() }: { currentDate?: Date } = {}) => {
  const { user, authLoading } = useAuth(AuthService)
  const { toast } = useToast()
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate)

  console.log("[TimelineWrapper] Auth state:", { userId: user?.id, authLoading })

  const loadTimelineItems = useCallback(async () => {
    console.log("[TimelineWrapper.loadTimelineItems] Starting with userId:", user?.id, "authLoading:", authLoading)
    if (!user?.id || authLoading) {
      console.log("[TimelineWrapper.loadTimelineItems] Skipping - no user or still loading")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("[TimelineWrapper.loadTimelineItems] Fetching steps for timeline")

      // Fetch all steps (both habits and activities) with their breaths
      const { data, error } = await databaseService.supabase
        .from("steps")
        .select(`
          id,
          label,
          description,
          color,
          duration,
          frequency,
          isbuildhabit,
          history,
          tag,
          habit_notes,
          icon,
          completed,
          breaths (
            id,
            name,
            completed,
            is_running,
            time_estimation_seconds,
            position
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      console.log("[TimelineWrapper.loadTimelineItems] Supabase response:", { data, error })

      if (error) {
        console.error("[TimelineWrapper.loadTimelineItems] Error fetching timeline items:", error)
        setError("Failed to load timeline items: " + error.message)
        toast({ title: "Error", description: "Failed to load timeline items: " + error.message, variant: "destructive" })
        setLoading(false)
        return
      }

      console.log("[TimelineWrapper.loadTimelineItems] Raw steps data:", data?.length || 0, "steps")
      if (data && data.length > 0) {
        console.log("[TimelineWrapper.loadTimelineItems] First step sample:", data[0])
      }

      // Map steps to timeline items
      const timelineItems: TimelineItem[] = data
        .map((step: any) => {
          // Get scheduled time from habit_notes or default to 08:00
          const habitNotes = step.habit_notes || {}
          const scheduledTime = habitNotes._scheduled_time || "08:00"

          // Map breaths
          const breaths: Breath[] = (step.breaths || [])
            .map((breath: any) => ({
              id: breath.id,
              name: breath.name,
              completed: breath.completed || false,
              isRunning: breath.is_running || false,
              timeEstimationSeconds: breath.time_estimation_seconds || 0,
              position: breath.position || 0,
            }))
            .sort((a: Breath, b: Breath) => a.position - b.position)

          // Convert duration to minutes if it's in milliseconds (> 1000)
          let durationInMinutes = step.duration || 15
          if (durationInMinutes > 1000) {
            durationInMinutes = Math.round(durationInMinutes / 60000) // Convert ms to minutes
          }

          return {
            id: step.id,
            label: step.label,
            description: step.description || "No description",
            color: step.color || "#FFD700",
            scheduledTime: scheduledTime,
            duration: durationInMinutes,
            type: step.tag === "habit" ? "habit" : "activity",
            isCompleted: step.completed || false,
            icon: step.icon || null,
            frequency: step.frequency || null,
            isBuildHabit: step.isbuildhabit ?? null,
            history: step.history || [],
            breaths: breaths,
          }
        })
        // Sort by scheduled time
        .sort((a, b) => {
          const timeA = a.scheduledTime.split(':').map(Number)
          const timeB = b.scheduledTime.split(':').map(Number)
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
        })

      console.log("[TimelineWrapper.loadTimelineItems] Processed timeline items:", JSON.stringify(timelineItems, null, 2))
      setItems(timelineItems)
      setLoading(false)
    } catch (err: any) {
      console.error("[TimelineWrapper.loadTimelineItems] Unexpected error:", err)
      setError("Unexpected error loading timeline: " + err.message)
      toast({ title: "Error", description: "Unexpected error loading timeline.", variant: "destructive" })
      setLoading(false)
    }
  }, [user?.id, authLoading, toast])

  useEffect(() => {
    console.log("[TimelineWrapper] Triggering useEffect with userId:", user?.id, "authLoading:", authLoading)
    loadTimelineItems()
  }, [user?.id, authLoading, loadTimelineItems])

  const refreshTimeline = useCallback(async () => {
    console.log("[TimelineWrapper.refreshTimeline] Refreshing timeline")
    await loadTimelineItems()
  }, [loadTimelineItems])

  const updateItem = useCallback(async (itemId: string, updates: Partial<TimelineItem>) => {
    if (!user?.id) {
      console.error("[TimelineWrapper.updateItem] No user ID available")
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }
    console.log("[TimelineWrapper.updateItem] Updating item:", { itemId, updates })

    const dbUpdates: Record<string, any> = {}
    if (updates.isCompleted !== undefined) dbUpdates.completed = updates.isCompleted
    if (updates.label !== undefined) dbUpdates.label = updates.label
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration

    // Handle scheduled time update
    if (updates.scheduledTime !== undefined) {
      const { data: currentStep } = await databaseService.supabase
        .from("steps")
        .select("habit_notes")
        .eq("id", itemId)
        .eq("user_id", user.id)
        .single()

      const currentNotes = currentStep?.habit_notes || {}
      dbUpdates.habit_notes = { ...currentNotes, _scheduled_time: updates.scheduledTime }
    }

    const { error } = await databaseService.supabase
      .from("steps")
      .update(dbUpdates)
      .eq("id", itemId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[TimelineWrapper.updateItem] Error updating item:", error)
      toast({ title: "Error", description: "Failed to update item.", variant: "destructive" })
    } else {
      refreshTimeline()
      toast({ title: "Item Updated", description: "Timeline item was successfully updated." })
    }
  }, [user?.id, refreshTimeline, toast])

  const contextValue = useMemo(
    () => ({
      items,
      loading,
      error,
      userId: user?.id || null,
      refreshTimeline,
      updateItem,
      selectedDate,
      setSelectedDate,
    }),
    [items, loading, error, user?.id, refreshTimeline, updateItem, selectedDate]
  )

  if (authLoading) {
    return (
      <div className="text-center text-white">
        <Loader2Icon className="h-8 w-8 animate-spin mx-auto" />
        <p>Authenticating...</p>
      </div>
    )
  }

  if (!user?.id) {
    return <div className="text-center text-red-400">Please log in to view your timeline.</div>
  }

  return (
    <TimelineContext.Provider value={contextValue}>
      <Timeline currentDate={selectedDate} />
    </TimelineContext.Provider>
  )
}
