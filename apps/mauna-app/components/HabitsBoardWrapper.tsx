import React, { createContext, useState, useEffect, useCallback, useMemo } from "react"
import { HabitsBoard } from "./HabitsBoard"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2Icon } from "lucide-react"

interface HabitItem {
  id: string
  label: string
  description: string
  color: string
  time: string
  frequency: string
  isBuildHabit: boolean
  habitGroup?: string
  history?: string[]
  notes?: { [date: string]: string }
  units?: { [date: string]: number }
  skipped?: { [date: string]: boolean }
  children?: HabitItem[]
}

interface Category {
  id: string
  name: string
  color: string
  habits: HabitItem[]
}

interface HabitsContextType {
  categories: Category[]
  loading: boolean
  error: string | null
  userId: string | null
  refreshHabits: () => Promise<void>
  updateHabit: (habitId: string, updates: Partial<HabitItem>) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  addHabit: (habit: HabitItem) => Promise<void>
}

export const HabitsContext = createContext<HabitsContextType>({
  categories: [],
  loading: true,
  error: null,
  userId: null,
  refreshHabits: async () => {},
  updateHabit: async () => {},
  deleteHabit: async () => {},
  addHabit: async () => {},
})

export const HabitsBoardWrapper = ({ currentMonth = new Date() }: { currentMonth?: Date } = {}) => {
  const { user, authLoading } = useAuth(AuthService)
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log("[HabitsBoardWrapper] Auth state:", { userId: user?.id, authLoading })

  const loadHabits = useCallback(async () => {
    console.log("[HabitsBoardWrapper.loadHabits] Starting loadHabits with userId:", user?.id, "authLoading:", authLoading)
    if (!user?.id || authLoading) {
      console.log("[HabitsBoardWrapper.loadHabits] Raw Supabase data:", JSON.stringify(data, null, 2), "Error:", error)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      console.log("[HabitsBoardWrapper.loadHabits] Executing Supabase query for steps with tag='habit'")
      const { data, error } = await databaseService.supabase
        .from("steps")
        .select("id, label, description, color, duration, frequency, isbuildhabit, history, tag, habit_group, habit_notes, habit_units, habit_skipped")
        .eq("user_id", user.id)
        .eq("tag", "habit")
        .order("habit_group", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true })
      console.log("[HabitsBoardWrapper.loadHabits] Supabase query response:", { data, error })
      if (error) {
        console.error("[HabitsBoardWrapper.loadHabits] Error fetching habits:", error)
        setError("Failed to load habits: " + error.message)
        toast({ title: "Error", description: "Failed to load habits.", variant: "destructive" })
        setLoading(false)
        return
      }
      console.log("[HabitsBoardWrapper.loadHabits] Raw steps data:", JSON.stringify(data, null, 2))

      // Map habits with new fields
      const habits: HabitItem[] = data.map((step: any) => {
        const habitNotes = step.habit_notes || {}
        const scheduledTime = habitNotes._scheduled_time || "08:00"

        // Remove _scheduled_time from notes to keep it clean
        const { _scheduled_time, ...cleanNotes } = habitNotes

        return {
          id: step.id,
          label: step.label,
          description: step.description || "No description",
          color: step.color || "#FFD700",
          time: scheduledTime,
          frequency: step.frequency || "Every day!",
          isBuildHabit: step.isbuildhabit ?? true,
          habitGroup: step.habit_group || null,
          history: step.history || [],
          notes: cleanNotes,
          units: step.habit_units || {},
          skipped: step.habit_skipped || {},
          children: [],
        }
      })

      // Separate uncategorized habits from grouped habits
      const uncategorizedHabits: HabitItem[] = []
      const groupedHabits: { [key: string]: HabitItem[] } = {}

      habits.forEach((habit) => {
        if (!habit.habitGroup) {
          uncategorizedHabits.push(habit)
        } else {
          const groupName = habit.habitGroup
          if (!groupedHabits[groupName]) {
            groupedHabits[groupName] = []
          }
          groupedHabits[groupName].push(habit)
        }
      })

      // Convert grouped habits to categories array
      const categories: Category[] = Object.entries(groupedHabits).map(([groupName, groupHabits]) => ({
        id: `group-${groupName.toLowerCase().replace(/\s+/g, "-")}`,
        name: groupName,
        color: groupHabits[0]?.color || "#FFD700",
        habits: groupHabits,
      }))

      // Add uncategorized habits as a special category at the beginning
      if (uncategorizedHabits.length > 0) {
        categories.unshift({
          id: 'uncategorized',
          name: '',
          color: '#FFD700',
          habits: uncategorizedHabits,
        })
      }

      console.log("[HabitsBoardWrapper.loadHabits] Processed categories:", JSON.stringify(categories, null, 2))
      setCategories(categories)
      setLoading(false)
    } catch (err: any) {
      console.error("[HabitsBoardWrapper.loadHabits] Unexpected error fetching habits:", err)
      setError("Unexpected error loading habits: " + err.message)
      toast({ title: "Error", description: "Unexpected error loading habits.", variant: "destructive" })
      setLoading(false)
    }
  }, [user?.id, authLoading])

  useEffect(() => {
    console.log("[HabitsBoardWrapper] Triggering useEffect with userId:", user?.id, "authLoading:", authLoading)
    loadHabits()
  }, [user?.id, authLoading, loadHabits])

  const refreshHabits = useCallback(async () => {
    console.log("[HabitsBoardWrapper.refreshHabits] Refreshing habits")
    await loadHabits()
  }, [loadHabits])

  const addHabit = useCallback(async (habit: HabitItem) => {
    if (!user?.id) {
      console.error("[HabitsBoardWrapper.addHabit] No user ID available")
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }
    console.log("[HabitsBoardWrapper.addHabit] Creating habit:", habit)

    const { data, error} = await databaseService.supabase
      .from("steps")
      .insert({
        user_id: user.id,
        label: habit.label,
        description: habit.description,
        color: habit.color,
        duration: 15,
        frequency: habit.frequency,
        isbuildhabit: habit.isBuildHabit,
        habit_group: habit.habitGroup || null,
        history: [],
        habit_notes: { _scheduled_time: habit.time || "08:00" },
        habit_units: {},
        habit_skipped: {},
        tag: "habit",
        task_list_id: null,
        position: categories.flatMap((cat) => cat.habits).length,
        completed: false,
        locked: false,
      })
      .select()

    if (error) {
      console.error("[HabitsBoardWrapper.addHabit] Error adding habit:", error)
      toast({ title: "Error", description: "Failed to add habit.", variant: "destructive" })
    } else {
      refreshHabits()
      toast({ title: "Habit Added", description: `"${habit.label}" was successfully added.` })
    }
  }, [user?.id, categories, refreshHabits, toast])

  const updateHabit = useCallback(async (habitId: string, updates: Partial<HabitItem>) => {
    if (!user?.id) {
      console.error("[HabitsBoardWrapper.updateHabit] No user ID available")
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }
    console.log("[HabitsBoardWrapper.updateHabit] Updating habit:", { habitId, updates })

    // First, get the current habit to merge notes properly
    const { data: currentHabit } = await databaseService.supabase
      .from("steps")
      .select("habit_notes")
      .eq("id", habitId)
      .eq("user_id", user.id)
      .single()

    const currentNotes = currentHabit?.habit_notes || {}

    const dbUpdates: Record<string, any> = {}
    if (updates.history !== undefined) dbUpdates.history = updates.history
    if (updates.label !== undefined) dbUpdates.label = updates.label
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
    if (updates.isBuildHabit !== undefined) dbUpdates.isbuildhabit = updates.isBuildHabit
    if (updates.habitGroup !== undefined) dbUpdates.habit_group = updates.habitGroup
    if (updates.units !== undefined) dbUpdates.habit_units = updates.units
    if (updates.skipped !== undefined) dbUpdates.habit_skipped = updates.skipped

    // Handle time update - merge with existing notes
    if (updates.time !== undefined) {
      dbUpdates.habit_notes = { ...currentNotes, _scheduled_time: updates.time }
    }

    // Handle notes update - merge with scheduled time
    if (updates.notes !== undefined) {
      dbUpdates.habit_notes = { ...updates.notes, _scheduled_time: currentNotes._scheduled_time || "08:00" }
    }

    const { error } = await databaseService.supabase
      .from("steps")
      .update(dbUpdates)
      .eq("id", habitId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[HabitsBoardWrapper.updateHabit] Error updating habit:", error)
      toast({ title: "Error", description: "Failed to update habit.", variant: "destructive" })
    } else {
      refreshHabits()
      toast({ title: "Habit Updated", description: "Habit was successfully updated." })
    }
  }, [user?.id, refreshHabits, toast])

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!user?.id) {
      console.error("[HabitsBoardWrapper.deleteHabit] No user ID available")
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }
    console.log("[HabitsBoardWrapper.deleteHabit] Deleting habit:", habitId)
    await databaseService.deleteStep(habitId, user.id)
      .then(() => {
        refreshHabits()
        toast({ title: "Habit Deleted", description: "Habit was successfully deleted." })
      })
      .catch((err) => {
        console.error("[HabitsBoardWrapper.deleteHabit] Error deleting habit:", err)
        toast({ title: "Error", description: "Failed to delete habit.", variant: "destructive" })
      })
  }, [user?.id, refreshHabits, toast])

  const contextValue = useMemo(
    () => ({
      categories,
      loading,
      error,
      userId: user?.id || null,
      refreshHabits,
      updateHabit,
      deleteHabit,
      addHabit,
    }),
    [categories, loading, error, user?.id, refreshHabits, updateHabit, deleteHabit, addHabit]
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
    return <div className="text-center text-red-400">Please log in to view habits.</div>
  }

  return (
    <HabitsContext.Provider value={contextValue}>
      <HabitsBoard currentMonth={currentMonth} />
    </HabitsContext.Provider>
  )
}