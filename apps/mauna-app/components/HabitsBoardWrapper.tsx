import React, { createContext, useState, useEffect, useCallback, useMemo } from "react"
import { HabitsBoard } from "./HabitsBoard"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

interface HabitItem {
  id: string
  label: string
  description: string
  color: string
  time: string
  frequency: string
  isBuildHabit: boolean
  history?: string[]
  notes?: { date: string; text: string }[]
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

export const HabitsBoardWrapper = ({ currentMonth }: { currentMonth: Date }) => {
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
        .select("id, label, description, color, duration, frequency, isbuildhabit, history, tag")
        .eq("user_id", user.id)
        .eq("tag", "habit")
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
      const habits: HabitItem[] = data.map((step: any) => ({
        id: step.id,
        label: step.label,
        description: step.description || "No description",
        color: step.color || "#FFD700",
        time: step.duration ? `${step.duration} min` : "00:00",
        frequency: step.frequency || "Every day!",
        isBuildHabit: step.isbuildhabit ?? true,
        history: step.history || [],
        notes: [],
        children: [],
      }))
      const category: Category = {
        id: "steps-cat",
        name: "Steps",
        color: "#FFD700",
        habits,
      }
      console.log("[HabitsBoardWrapper.loadHabits] Processed categories:", JSON.stringify([category], null, 2))
      setCategories([category])
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
    await databaseService.createStep(user.id, {
      label: habit.label,
      description: habit.description,
      color: habit.color,
      duration: parseInt(habit.time.split(" ")[0]) || 15,
      frequency: habit.frequency,
      isBuildHabit: habit.isBuildHabit,
      tag: "habit",
      taskListId: null,
      position: categories.flatMap((cat) => cat.habits).length,
    })
      .then(() => {
        refreshHabits()
        toast({ title: "Habit Added", description: `"${habit.label}" was successfully added.` })
      })
      .catch((err) => {
        console.error("[HabitsBoardWrapper.addHabit] Error adding habit:", err)
        toast({ title: "Error", description: "Failed to add habit.", variant: "destructive" })
      })
  }, [user?.id, categories, refreshHabits, toast])

  const updateHabit = useCallback(async (habitId: string, updates: Partial<HabitItem>) => {
    if (!user?.id) {
      console.error("[HabitsBoardWrapper.updateHabit] No user ID available")
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" })
      return
    }
    console.log("[HabitsBoardWrapper.updateHabit] Updating habit:", { habitId, updates })
    const dbUpdates: Record<string, any> = {}
    if (updates.history !== undefined) dbUpdates.history = updates.history
    if (updates.label !== undefined) dbUpdates.label = updates.label
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.time !== undefined) dbUpdates.duration = parseInt(updates.time.split(" ")[0]) || 15
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
    if (updates.isBuildHabit !== undefined) dbUpdates.isbuildhabit = updates.isBuildHabit
    await databaseService.updateStep(habitId, user.id, dbUpdates)
      .then(() => {
        refreshHabits()
        toast({ title: "Habit Updated", description: "Habit was successfully updated." })
      })
      .catch((err) => {
        console.error("[HabitsBoardWrapper.updateHabit] Error updating habit:", err)
        toast({ title: "Error", description: "Failed to update habit.", variant: "destructive" })
      })
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