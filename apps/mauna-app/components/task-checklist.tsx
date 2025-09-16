"use client"

import { useState, useCallback, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Breath } from "@/lib/types"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { formatDuration } from "@/lib/time-calculation"

interface TaskChecklistProps {
  currentTaskStepId: string | undefined
  breaths: Breath[]
  onSaveBreaths: (stepId: string, updatedBreaths: Breath[]) => void
  isTaskRunning: boolean
}

export function TaskChecklist({ currentTaskStepId, breaths, onSaveBreaths, isTaskRunning }: TaskChecklistProps) {
  const { user } = useAuth()
  const userId = user?.id || ""
  const { toast } = useToast()

  const [localBreaths, setLocalBreaths] = useState<Breath[]>(breaths)
  const [newBreathName, setNewBreathName] = useState("")
  const [activeBreathId, setActiveBreathId] = useState<string | null>(null)
  const [breathTimers, setBreathTimers] = useState<{ [key: string]: NodeJS.Timeout | null }>({})
  const [breathElapsedTimes, setBreathElapsedTimes] = useState<{ [key: string]: number }>({})

  // Initialize localBreaths when the prop changes
  useEffect(() => {
    setLocalBreaths(breaths)
    // Initialize elapsed times for existing breaths
    const initialElapsedTimes: { [key: string]: number } = {}
    breaths.forEach((breath) => {
      initialElapsedTimes[breath.id] = breath.totalTimeSeconds * 1000
    })
    setBreathElapsedTimes(initialElapsedTimes)
  }, [breaths])

  // Effect to manage active breath timer
  useEffect(() => {
    if (isTaskRunning && activeBreathId) {
      const interval = setInterval(() => {
        setBreathElapsedTimes((prev) => ({
          ...prev,
          [activeBreathId]: (prev[activeBreathId] || 0) + 1000,
        }))
      }, 1000)
      setBreathTimers((prev) => ({ ...prev, [activeBreathId]: interval }))
      return () => {
        if (interval) clearInterval(interval)
      }
    } else {
      // Clear all timers if task is not running or no active breath
      Object.values(breathTimers).forEach((timer) => {
        if (timer) clearInterval(timer)
      })
      setBreathTimers({})
    }
  }, [isTaskRunning, activeBreathId])

  const handleAddBreath = useCallback(async () => {
    if (!newBreathName.trim() || !currentTaskStepId || !userId) {
      toast({
        title: "Error",
        description: "Breath name and active task step are required.",
        variant: "destructive",
      })
      return
    }

    try {
      const newBreath: Breath = {
        id: crypto.randomUUID(), // Client-side ID for immediate UI update
        name: newBreathName.trim(),
        completed: false,
        isRunning: false,
        startTime: null,
        endTime: null,
        pausedTime: 0,
        totalTimeSeconds: 0,
        timeEstimationSeconds: 0,
        position: localBreaths.length + 1,
        createdAt: new Date().toISOString(),
      }

      const updatedBreaths = [...localBreaths, newBreath]
      setLocalBreaths(updatedBreaths)
      setNewBreathName("")
      setBreathElapsedTimes((prev) => ({ ...prev, [newBreath.id]: 0 }))

      await databaseService.updateStepBreaths(userId, currentTaskStepId, updatedBreaths)
      onSaveBreaths(currentTaskStepId, updatedBreaths) // Propagate change up
      toast({ title: "Breath Added", description: `"${newBreath.name}" has been added.` })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add breath: ${error.message}`,
        variant: "destructive",
      })
      // Revert UI if save fails
      setLocalBreaths(breaths)
    }
  }, [newBreathName, currentTaskStepId, userId, localBreaths, breaths, onSaveBreaths, toast])

  const handleToggleBreathCompletion = useCallback(
    async (id: string, completed: boolean) => {
      if (!currentTaskStepId || !userId) return

      const updatedBreaths = localBreaths.map((breath) =>
        breath.id === id ? { ...breath, completed, isRunning: false } : breath,
      )
      setLocalBreaths(updatedBreaths)

      // Stop timer if this breath was active
      if (activeBreathId === id) {
        setActiveBreathId(null)
        if (breathTimers[id]) {
          clearInterval(breathTimers[id]!)
          setBreathTimers((prev) => ({ ...prev, [id]: null }))
        }
      }

      try {
        await databaseService.updateStepBreaths(userId, currentTaskStepId, updatedBreaths)
        onSaveBreaths(currentTaskStepId, updatedBreaths)
        toast({
          title: "Breath Updated",
          description: `Breath marked as ${completed ? "completed" : "incomplete"}.`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update breath: ${error.message}`,
          variant: "destructive",
        })
        // Revert UI if save fails
        setLocalBreaths(breaths)
      }
    },
    [currentTaskStepId, userId, localBreaths, activeBreathId, breathTimers, breaths, onSaveBreaths, toast],
  )

  const handleDeleteBreath = useCallback(
    async (id: string) => {
      if (!currentTaskStepId || !userId) return

      const updatedBreaths = localBreaths.filter((breath) => breath.id !== id)
      setLocalBreaths(updatedBreaths)

      // Stop timer if this breath was active
      if (activeBreathId === id) {
        setActiveBreathId(null)
        if (breathTimers[id]) {
          clearInterval(breathTimers[id]!)
          setBreathTimers((prev) => ({ ...prev, [id]: null }))
        }
      }

      try {
        await databaseService.updateStepBreaths(userId, currentTaskStepId, updatedBreaths)
        onSaveBreaths(currentTaskStepId, updatedBreaths)
        toast({ title: "Breath Deleted", description: "Breath has been removed." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to delete breath: ${error.message}`,
          variant: "destructive",
        })
        // Revert UI if save fails
        setLocalBreaths(breaths)
      }
    },
    [currentTaskStepId, userId, localBreaths, activeBreathId, breathTimers, breaths, onSaveBreaths, toast],
  )

  const handleToggleBreathTimer = useCallback(
    async (breathToToggle: Breath) => {
      if (!currentTaskStepId || !userId) return

      let updatedBreaths: Breath[] = []
      let newActiveBreathId: string | null = null

      if (activeBreathId === breathToToggle.id) {
        // Pause the current active breath
        updatedBreaths = localBreaths.map((b) =>
          b.id === breathToToggle.id
            ? { ...b, isRunning: false, totalTimeSeconds: Math.floor((breathElapsedTimes[b.id] || 0) / 1000) }
            : b,
        )
        setActiveBreathId(null)
        if (breathTimers[breathToToggle.id]) {
          clearInterval(breathTimers[breathToToggle.id]!)
          setBreathTimers((prev) => ({ ...prev, [breathToToggle.id]: null }))
        }
        toast({ title: "Breath Paused", description: `"${breathToToggle.name}" timer paused.` })
      } else {
        // Pause any currently active breath and start the new one
        updatedBreaths = localBreaths.map((b) => {
          if (b.id === activeBreathId) {
            // Pause previously active breath
            if (breathTimers[b.id]) {
              clearInterval(breathTimers[b.id]!)
              setBreathTimers((prev) => ({ ...prev, [b.id]: null }))
            }
            return { ...b, isRunning: false, totalTimeSeconds: Math.floor((breathElapsedTimes[b.id] || 0) / 1000) }
          } else if (b.id === breathToToggle.id) {
            // Start the new breath
            newActiveBreathId = b.id
            return { ...b, isRunning: true, completed: false } // Uncomplete if starting
          }
          return b
        })
        setActiveBreathId(newActiveBreathId)
        toast({ title: "Breath Started", description: `"${breathToToggle.name}" timer started.` })
      }

      setLocalBreaths(updatedBreaths)

      try {
        await databaseService.updateStepBreaths(userId, currentTaskStepId, updatedBreaths)
        onSaveBreaths(currentTaskStepId, updatedBreaths)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update breath timer: ${error.message}`,
          variant: "destructive",
        })
        // Revert UI if save fails
        setLocalBreaths(breaths)
      }
    },
    [
      currentTaskStepId,
      userId,
      localBreaths,
      activeBreathId,
      breathTimers,
      breathElapsedTimes,
      breaths,
      onSaveBreaths,
      toast,
    ],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add a new micro-task (breath)"
          value={newBreathName}
          onChange={(e) => setNewBreathName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddBreath()
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleAddBreath} disabled={!currentTaskStepId}>
          <Plus className="h-4 w-4 mr-2" /> Add Breath
        </Button>
      </div>
      <div className="space-y-2">
        {localBreaths.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No micro-tasks added yet.</p>
        ) : (
          localBreaths.map((breath) => (
            <div key={breath.id} className="flex items-center justify-between p-2 border rounded-md bg-background">
              <div className="flex items-center space-x-2 flex-1">
                <Checkbox
                  id={`breath-${breath.id}`}
                  checked={breath.completed}
                  onCheckedChange={(checked) => handleToggleBreathCompletion(breath.id, checked as boolean)}
                  disabled={!currentTaskStepId}
                />
                <label
                  htmlFor={`breath-${breath.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    breath.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {breath.name}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatDuration(breathElapsedTimes[breath.id] || 0)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleBreathTimer(breath)}
                  disabled={breath.completed || !currentTaskStepId || !isTaskRunning}
                  aria-label={activeBreathId === breath.id ? "Pause breath timer" : "Start breath timer"}
                >
                  {activeBreathId === breath.id ? (
                    <Pause className="h-4 w-4 text-red-500" />
                  ) : (
                    <Play className="h-4 w-4 text-green-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteBreath(breath.id)}
                  disabled={!currentTaskStepId}
                  aria-label="Delete breath"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
