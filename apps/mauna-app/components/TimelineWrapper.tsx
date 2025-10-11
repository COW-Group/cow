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
  startDate?: string // ISO date string - for habits (start date) and activities (scheduled date)
  endDate?: string // ISO date string - for habits (optional end date)
  estimatedStartTime?: string | null // Full timestamp with date and time
  estimatedEndTime?: string | null // Full timestamp with date and time
  duration: number // in minutes
  type: "habit" | "activity"
  isCompleted: boolean
  icon?: string
  frequency?: string
  isBuildHabit?: boolean
  history?: string[]
  breaths?: Breath[]
  taskListId?: string | null // ID of the task list this step belongs to
  taskListName?: string | null // Name of the task list (e.g., "Hot List", "Morning Routine")
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

  const loadTimelineItems = useCallback(async () => {
    if (!user?.id || authLoading) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch all steps (both habits and activities) with their breaths and task list info
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
          task_list_id,
          priority_letter,
          priority_rank,
          timezone,
          start_date,
          end_date,
          task_lists (
            id,
            name
          ),
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

      if (error) {
        setError("Failed to load timeline items: " + error.message)
        toast({ title: "Error", description: "Failed to load timeline items: " + error.message, variant: "destructive" })
        setLoading(false)
        return
      }

      // Map steps to timeline items
      const allTimelineItems: TimelineItem[] = data
        .map((step: any) => {
          // Extract task list information
          const taskListId = step.task_list_id || null
          const taskListName = step.task_lists?.name || null

          // Get scheduled time from habit_notes
          const habitNotes = step.habit_notes || {}
          const scheduledTime = habitNotes._scheduled_time || "08:00"

          // Get start and end dates from database
          const startDate: string | undefined = step.start_date || undefined
          const endDate: string | undefined = step.end_date || undefined
          const estimatedStartTime = null
          const estimatedEndTime = null

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
            startDate: startDate,
            endDate: endDate,
            estimatedStartTime: estimatedStartTime,
            estimatedEndTime: estimatedEndTime,
            duration: durationInMinutes,
            type: step.tag === "habit" ? "habit" : "activity",
            isCompleted: step.completed || false,
            icon: step.icon || null,
            frequency: step.frequency || null,
            isBuildHabit: step.isbuildhabit ?? null,
            history: step.history || [],
            breaths: breaths,
            taskListId: taskListId,
            taskListName: taskListName,
          }
        })
        // Sort by scheduled time
        .sort((a, b) => {
          const timeA = a.scheduledTime.split(':').map(Number)
          const timeB = b.scheduledTime.split(':').map(Number)
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
        })

      // Filter items by selected date
      const timelineItems = allTimelineItems.filter((item) => {
        const selectedDateStr = selectedDate.toISOString().split('T')[0]

        // Habits show based on their frequency AND date range
        if (item.type === "habit") {
          // Check if habit has started
          if (item.startDate && selectedDateStr < item.startDate) {
            return false // Habit hasn't started yet
          }

          // Check if habit has ended
          if (item.endDate && selectedDateStr > item.endDate) {
            return false // Habit has ended
          }

          const frequency = item.frequency || "Every day!"

          // If frequency is "Every day!", show on all days (within date range)
          if (frequency === "Every day!") {
            return true
          }

          // Otherwise, check if the selected date's day of week is in the frequency string
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          const selectedDayOfWeek = dayNames[selectedDate.getDay()]

          // Check if the frequency string includes this day of week
          return frequency.includes(selectedDayOfWeek)
        }

        // Activities only show on their specific scheduled date
        if (item.type === "activity") {
          if (!item.startDate) {
            // One-time activities without a start date are not shown
            return false
          }
          // Compare dates (YYYY-MM-DD)
          return item.startDate === selectedDateStr
        }

        return false
      })

      setItems(timelineItems)
      setLoading(false)
    } catch (err: any) {
      setError("Unexpected error loading timeline: " + err.message)
      toast({ title: "Error", description: "Unexpected error loading timeline.", variant: "destructive" })
      setLoading(false)
    }
  }, [user?.id, authLoading, selectedDate, toast])

  useEffect(() => {
    loadTimelineItems()
  }, [loadTimelineItems])

  const refreshTimeline = useCallback(async () => {
    await loadTimelineItems()
  }, [loadTimelineItems])

  const updateItem = useCallback(async (itemId: string, updates: Partial<TimelineItem>) => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }

    const dbUpdates: Record<string, any> = {}
    if (updates.isCompleted !== undefined) dbUpdates.completed = updates.isCompleted
    if (updates.label !== undefined) dbUpdates.label = updates.label
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon
    if (updates.journalContent !== undefined || updates.cbtNotes !== undefined) {
      // These are handled separately in Timeline component
    }

    // Handle frequency update
    if (updates.frequency !== undefined) {
      dbUpdates.frequency = updates.frequency

      // If changing to "Once" (empty string), set as activity and add start_date
      if (updates.frequency === "") {
        dbUpdates.tag = "activity"
        // Set start_date to the currently selected date if not already set
        dbUpdates.start_date = selectedDate.toISOString().split('T')[0]
        dbUpdates.end_date = null // Activities don't have end dates
      } else {
        // If changing to a recurring frequency, set as habit
        dbUpdates.tag = "habit"
        // Set start_date to today if not already set (habits need start dates)
        if (!updates.startDate) {
          dbUpdates.start_date = new Date().toISOString().split('T')[0]
        }
      }
    }

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
      toast({ title: "Error", description: "Failed to update item.", variant: "destructive" })
    } else {
      refreshTimeline()
      toast({ title: "Item Updated", description: "Timeline item was successfully updated." })
    }
  }, [user?.id, refreshTimeline, toast, selectedDate])

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
