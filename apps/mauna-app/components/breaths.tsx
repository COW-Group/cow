"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Plus, Play, Pause, Trash2, GripVertical, Pencil, Save, RotateCcw } from "lucide-react"
import type { Breath } from "@/lib/types"
import { databaseService } from "@/lib/database-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { arrayMove } from "@/lib/utils"

interface BreathsProps {
  currentStepId?: string
  initialBreaths?: Breath[]
  onSaveBreaths: (stepId: string, breaths: Breath[]) => void
  isStepRunning: boolean // Indicates if the main focus timer (from FocusPage) is running
}

interface SortableBreathItemProps {
  breath: Breath
  onToggleCompletion: (id: string, completed: boolean) => void
  onToggleRunning: (breath: Breath) => void
  onReset: (breath: Breath) => void
  onDelete: (id: string) => void
  onUpdateName: (id: string, name: string) => void
  onEstimationChange: (id: string, value: string) => void
  onTotalTimeChange: (id: string, value: string) => void
  isStepRunning: boolean // Passed from parent (FocusPage)
  formatTime: (seconds: number) => string
  formatDateTime: (dateString: string | undefined | null) => string
  toast: ReturnType<typeof useToast>["toast"] // Pass toast function
}

const SortableBreathItem = React.memo<SortableBreathItemProps>(
  ({
    breath,
    onToggleCompletion,
    onToggleRunning,
    onReset,
    onDelete,
    onUpdateName,
    onEstimationChange,
    onTotalTimeChange,
    isStepRunning,
    formatTime,
    formatDateTime,
    toast, // Receive toast function
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: breath.id })
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(breath.name ?? "")
    const [editedEstimation, setEditedEstimation] = useState(Math.floor((breath.timeEstimationSeconds ?? 0) / 60))
    const [editedTotalTime, setEditedTotalTime] = useState(Math.floor((breath.totalTimeSeconds ?? 0) / 60))

    useEffect(() => {
      setEditedName(breath.name ?? "")
      setEditedEstimation(Math.floor((breath.timeEstimationSeconds ?? 0) / 60))
      setEditedTotalTime(Math.floor((breath.totalTimeSeconds ?? 0) / 60))
    }, [breath])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : 0,
      opacity: isDragging ? 0.8 : 1,
    }

    const handleEditClick = () => {
      setIsEditing(true)
    }

    const handleSaveClick = () => {
      onUpdateName(breath.id, editedName)
      onEstimationChange(breath.id, editedEstimation.toString())
      onTotalTimeChange(breath.id, editedTotalTime.toString())
      setIsEditing(false)
    }

    const handleToggleRunningClick = () => {
      if (!isStepRunning) {
        toast({
          title: "Main Timer Not Active",
          description: "Breath timer can only run when the main step timer is active and running.",
          variant: "destructive",
        })
        return
      }
      onToggleRunning(breath)
    }

    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`mb-2 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${
          breath.completed ? "opacity-50 line-through" : ""
        }`}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab text-cream-25/70 hover:text-cream-25 mr-2"
            {...listeners}
            {...attributes}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </Button>
          <Checkbox
            id={`breath-${breath.id}`}
            checked={breath.completed}
            onCheckedChange={(checked) => onToggleCompletion(breath.id, Boolean(checked))}
            className="mr-3 border-cream-25 data-[state=checked]:bg-sapphire-blue data-[state=checked]:text-cream-25"
          />
          <Input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="flex-1 bg-transparent border-none text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            placeholder={breath.name || "Untitled Breath"}
            readOnly={!isEditing}
          />
        </div>

        <div className="flex items-center justify-start space-x-2 ml-10 mt-2">
          {isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveClick}
              className="text-green-500 hover:text-green-600 transition-colors duration-200"
              aria-label="Save breath"
            >
              <Save className="h-5 w-5" />
            </Button>
          ) : (
            <>
              {/* Play/Pause button is disabled if the main step is not running */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleRunningClick} // Use the new handler
                disabled={breath.completed} // Only disable if completed, the handler will check isStepRunning
                className="text-cream-25/70 hover:text-cream-25"
                aria-label={breath.isRunning ? `Pause ${breath.name}` : `Start ${breath.name}`}
              >
                {breath.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReset(breath)}
                disabled={
                  breath.completed || (!breath.isRunning && breath.totalTimeSeconds === 0 && breath.pausedTime === 0)
                }
                className="text-cream-25/70 hover:text-cream-25"
                aria-label={`Reset ${breath.name}`}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditClick}
                className="text-cream-25/70 hover:text-cream-25 transition-colors duration-200"
                aria-label={`Edit ${breath.name}`}
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(breath.id)}
                className="text-red-400 hover:text-red-500"
                aria-label={`Delete ${breath.name}`}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-cream-25/70 space-y-1 ml-10 mt-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="font-medium text-cream-25">Start:</span>
              <div className="text-cream-25">{formatDateTime(breath.startTime)}</div>
            </div>
            <div>
              <span className="font-medium text-cream-25">End:</span>
              <div className="text-cream-25">{formatDateTime(breath.endTime)}</div>
            </div>
            <div>
              <span className="font-medium text-cream-25">Time:</span>
              <div className="font-semibold text-sapphire-blue">
                {breath.totalTimeSeconds && breath.totalTimeSeconds > 0 ? formatTime(breath.totalTimeSeconds) : "0s"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`estimation-${breath.id}`} className="text-xs font-medium text-cream-25">
                Est. (min):
              </Label>
              <Input
                id={`estimation-${breath.id}`}
                type="number"
                min="0"
                value={editedEstimation}
                onChange={(e) => setEditedEstimation(Number(e.target.value))}
                className="w-20 h-7 text-xs bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0"
                readOnly={!isEditing}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`totalTime-${breath.id}`} className="text-xs font-medium text-cream-25">
                Actual (min):
              </Label>
              <Input
                id={`totalTime-${breath.id}`}
                type="number"
                min="0"
                value={editedTotalTime}
                onChange={(e) => setEditedTotalTime(Number(e.target.value))}
                className="w-20 h-7 text-xs bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0"
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      </Card>
    )
  },
)

export default function Breaths({ currentStepId, initialBreaths, onSaveBreaths, isStepRunning }: BreathsProps) {
  const { user } = useAuth()
  const [newBreathName, setNewBreathName] = useState("")
  const [breaths, setBreaths] = useState<Breath[]>(initialBreaths || [])
  const { toast } = useToast() // Get toast function here
  const [runningBreathId, setRunningBreathId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastLoadedStepId = useRef<string | undefined>(undefined)

  const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const debouncedSaveBreaths = useCallback(
    debounce((stepId: string, breathsToSave: Breath[]) => {
      onSaveBreaths(stepId, breathsToSave)
    }, 500),
    [onSaveBreaths],
  )

  // Sync initialBreaths from parent component when currentStepId changes
  useEffect(() => {
    if (currentStepId && initialBreaths) {
      const sortedInitialBreaths = [...initialBreaths].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      setBreaths(sortedInitialBreaths)
      lastLoadedStepId.current = currentStepId
    } else {
      setBreaths([])
      lastLoadedStepId.current = currentStepId
    }
  }, [currentStepId, initialBreaths])

  // Interval for updating running breath time display
  useEffect(() => {
    if (runningBreathId) {
      intervalRef.current = setInterval(() => {
        setBreaths((prevBreaths) =>
          prevBreaths.map((b) => {
            if (b.id === runningBreathId && b.isRunning && b.startTime) {
              const currentElapsedMs = Date.now() - new Date(b.startTime).getTime() + (b.pausedTime || 0)
              const totalTimeSeconds = Math.floor(currentElapsedMs / 1000)
              return { ...b, totalTimeSeconds } // Update local state for display
            }
            return b
          }),
        )
      }, 100)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [runningBreathId])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}m ${secs}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours}h ${mins}m ${secs}s`
    }
  }, [])

  const formatDateTime = useCallback((dateString: string | undefined | null): string => {
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    } catch {
      return "Invalid date"
    }
  }, [])

  const totalEstimatedTime = useMemo(() => {
    const totalSeconds = breaths.reduce((sum, breath) => sum + (breath.timeEstimationSeconds || 0), 0)
    return formatTime(totalSeconds)
  }, [breaths, formatTime])

  const addBreath = useCallback(async () => {
    if (!user?.id || !currentStepId || !newBreathName.trim()) return

    try {
      // Calculate next position for the new breath, ensuring it's > 1
      const nextPosition = breaths.length > 0 ? Math.max(Math.max(...breaths.map((b) => b.position || 0)) + 1, 2) : 2

      const newBreath = await databaseService.createBreath(user.id, currentStepId, newBreathName.trim(), nextPosition)
      const updatedBreaths = [...breaths, newBreath].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      setBreaths(updatedBreaths)
      debouncedSaveBreaths(currentStepId!, updatedBreaths)
      setNewBreathName("")
      toast({
        title: "Breath added",
        description: `"${newBreathName.trim()}" has been added to your breaths.`,
      })
    } catch (error) {
      console.error("Error adding breath:", error)
      toast({
        title: "Error",
        description: "Failed to add breath. Please try again.",
        variant: "destructive",
      })
    }
  }, [user?.id, currentStepId, newBreathName, breaths, debouncedSaveBreaths, toast])

  const toggleCompletion = useCallback(
    async (breathId: string, completed: boolean) => {
      if (!user?.id || !currentStepId) return

      try {
        // Ensure to pause if running before marking complete/incomplete
        if (runningBreathId === breathId) {
          const breathToPause = breaths.find((b) => b.id === breathId)
          if (breathToPause && breathToPause.isRunning) {
            await toggleRunning(breathToPause) // This will handle state and DB update for pausing
          }
        }

        const updates: Partial<Breath> = { completed }
        // If completing, also set total time and clear running state
        if (completed) {
          const currentBreath = breaths.find((b) => b.id === breathId)
          if (currentBreath) {
            const finalTime = currentBreath.totalTimeSeconds || 0 // Use current totalTimeSeconds from interval
            updates.totalTimeSeconds = finalTime
            updates.isRunning = false
            updates.startTime = null
            updates.endTime = new Date().toISOString()
            updates.pausedTime = 0 // Reset paused time on completion
          }
        } else {
          // If uncompleting, clear end time and total time
          updates.totalTimeSeconds = 0
          updates.endTime = null
          updates.pausedTime = 0
        }

        const updatedBreathFromDB = await databaseService.updateBreathTiming(breathId, user.id, updates)
        const updatedBreaths = breaths.map((b) => (b.id === breathId ? { ...b, ...updatedBreathFromDB } : b))
        setBreaths(updatedBreaths)
        debouncedSaveBreaths(currentStepId, updatedBreaths)

        toast({
          title: completed ? "Breath completed" : "Breath uncompleted",
          description: `Breath has been marked as ${completed ? "completed" : "not completed"}.`,
        })
      } catch (error) {
        console.error("Error updating breath completion:", error)
        toast({
          title: "Error",
          description: "Failed to update breath. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, runningBreathId, debouncedSaveBreaths, toast],
  )

  const toggleRunning = useCallback(
    async (breath: Breath) => {
      if (!user?.id || !currentStepId) return

      try {
        const now = new Date().toISOString()
        let tempUpdatedBreaths = [...breaths] // Create a temporary copy for local manipulation

        // If another breath is currently running, pause it first
        if (runningBreathId && runningBreathId !== breath.id) {
          const runningBreath = tempUpdatedBreaths.find((b) => b.id === runningBreathId)
          if (runningBreath && runningBreath.isRunning && runningBreath.startTime) {
            const elapsedMs = Date.now() - new Date(runningBreath.startTime).getTime()
            const totalPausedTime = (runningBreath.pausedTime || 0) + elapsedMs
            const totalTimeSeconds = Math.floor(totalPausedTime / 1000) // Final calculated time for the paused breath

            const pausedBreathUpdates = {
              isRunning: false,
              endTime: now,
              pausedTime: totalPausedTime,
              totalTimeSeconds: totalTimeSeconds,
            }

            // Update in DB
            await databaseService.updateBreathTiming(runningBreathId, user.id, pausedBreathUpdates)
            // Update temp local state
            tempUpdatedBreaths = tempUpdatedBreaths.map((b) =>
              b.id === runningBreathId ? { ...b, ...pausedBreathUpdates } : b,
            )
          }
        }

        let updates: Partial<Breath>
        if (breath.isRunning) {
          // If the target breath is currently running, pause it
          const elapsedMs = Date.now() - new Date(breath.startTime!).getTime()
          const totalPausedTime = (breath.pausedTime || 0) + elapsedMs
          const totalTimeSeconds = Math.floor(totalPausedTime / 1000) // Final calculated time for this paused breath

          updates = {
            isRunning: false,
            endTime: now,
            pausedTime: totalPausedTime,
            totalTimeSeconds: totalTimeSeconds,
          }
          setRunningBreathId(null)
        } else {
          // If the target breath is currently paused or stopped, start it
          updates = {
            isRunning: true,
            startTime: now,
            endTime: null, // Clear end time if restarting
            // When starting, pausedTime and totalTimeSeconds retain their previous values until the next pause/stop
            pausedTime: breath.pausedTime,
            totalTimeSeconds: breath.totalTimeSeconds,
          }
          setRunningBreathId(breath.id)
        }

        // Apply updates to the target breath in local state
        tempUpdatedBreaths = tempUpdatedBreaths.map((b) => (b.id === breath.id ? { ...b, ...updates } : b))
        setBreaths(tempUpdatedBreaths) // Update local state
        debouncedSaveBreaths(currentStepId, tempUpdatedBreaths) // Trigger parent save

        // Update in DB (after local state update for faster UI response)
        await databaseService.updateBreathTiming(breath.id, user.id, updates)

        toast({
          title: updates.isRunning ? "Breath started" : "Breath paused",
          description: `"${breath.name}" has been ${updates.isRunning ? "started" : "paused"}.`,
        })
      } catch (error) {
        console.error("Error toggling breath running state:", error)
        toast({
          title: "Error",
          description: "Failed to update breath. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, runningBreathId, debouncedSaveBreaths, toast],
  )

  const resetBreath = useCallback(
    async (breath: Breath) => {
      if (!user?.id || !currentStepId) return

      try {
        // If the breath is currently running, stop its interval and reset runningBreathId
        if (runningBreathId === breath.id) {
          setRunningBreathId(null)
        }

        const updates: Partial<Breath> = {
          isRunning: false,
          startTime: null,
          endTime: null,
          pausedTime: 0,
          totalTimeSeconds: 0,
          completed: false, // Also uncheck if reset
        }

        const updatedBreathFromDB = await databaseService.updateBreathTiming(breath.id, user.id, updates)
        const updatedBreaths = breaths.map((b) => (b.id === breath.id ? { ...b, ...updatedBreathFromDB } : b))
        setBreaths(updatedBreaths)
        debouncedSaveBreaths(currentStepId, updatedBreaths)

        toast({
          title: "Breath reset",
          description: `"${breath.name}" has been reset.`,
        })
      } catch (error) {
        console.error("Error resetting breath:", error)
        toast({
          title: "Error",
          description: "Failed to reset breath. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, runningBreathId, debouncedSaveBreaths, toast],
  )

  const deleteBreath = useCallback(
    async (breathId: string) => {
      if (!user?.id || !currentStepId) return

      try {
        await databaseService.deleteBreath(breathId, user.id)
        if (runningBreathId === breathId) {
          setRunningBreathId(null)
        }

        const updatedBreaths = breaths.filter((b) => b.id !== breathId)
        // Re-assign positions after deletion
        const breathsWithNewPositions = updatedBreaths.map((breath, index) => ({
          ...breath,
          position: index + 2, // Ensure positions start from 2
        }))

        setBreaths(breathsWithNewPositions)
        debouncedSaveBreaths(currentStepId, breathsWithNewPositions) // Save updated positions to DB

        toast({
          title: "Breath deleted",
          description: "Breath has been removed.",
        })
      } catch (error) {
        console.error("Error deleting breath:", error)
        toast({
          title: "Error",
          description: "Failed to delete breath. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, debouncedSaveBreaths, runningBreathId, toast],
  )

  const updateBreathName = useCallback(
    async (breathId: string, newName: string) => {
      if (!user?.id || !currentStepId || !newName.trim()) return

      try {
        const updatedBreathFromDB = await databaseService.updateBreathTiming(breathId, user.id, {
          name: newName.trim(),
        })
        const updatedBreaths = breaths.map((b) => (b.id === breathId ? { ...b, ...updatedBreathFromDB } : b))
        setBreaths(updatedBreaths)
        debouncedSaveBreaths(currentStepId, updatedBreaths)

        toast({
          title: "Breath updated",
          description: "Breath name has been updated.",
        })
      } catch (error) {
        console.error("Error updating breath name:", error)
        toast({
          title: "Error",
          description: "Failed to update breath name. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, debouncedSaveBreaths, toast],
  )

  const updateBreathEstimation = useCallback(
    async (breathId: string, estimationMinutes: string) => {
      if (!user?.id || !currentStepId) return

      try {
        const estimationSeconds = Math.max(0, Number(estimationMinutes) || 0) * 60
        const updatedBreathFromDB = await databaseService.updateBreathTiming(breathId, user.id, {
          timeEstimationSeconds: estimationSeconds,
        })
        const updatedBreaths = breaths.map((b) => (b.id === breathId ? { ...b, ...updatedBreathFromDB } : b))
        setBreaths(updatedBreaths)
        debouncedSaveBreaths(currentStepId, updatedBreaths)
      } catch (error) {
        console.error("Error updating breath estimation:", error)
        toast({
          title: "Error",
          description: "Failed to update breath estimation. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, debouncedSaveBreaths, toast],
  )

  const updateBreathTotalTime = useCallback(
    async (breathId: string, totalMinutes: string) => {
      if (!user?.id || !currentStepId) return

      try {
        const totalSeconds = Math.max(0, Number(totalMinutes) || 0) * 60
        const updatedBreathFromDB = await databaseService.updateBreathTiming(breathId, user.id, {
          totalTimeSeconds: totalSeconds,
        })
        const updatedBreaths = breaths.map((b) => (b.id === breathId ? { ...b, ...updatedBreathFromDB } : b))
        setBreaths(updatedBreaths)
        debouncedSaveBreaths(currentStepId, updatedBreaths)
        toast({
          title: "Breath updated",
          description: "Breath actual time has been updated.",
        })
      } catch (error) {
        console.error("Error updating breath total time:", error)
        toast({
          title: "Error",
          description: "Failed to update breath total time. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, currentStepId, breaths, debouncedSaveBreaths, toast],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = breaths.findIndex((breath) => breath.id === active.id)
        const newIndex = breaths.findIndex((breath) => breath.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedBreaths = arrayMove(breaths, oldIndex, newIndex)
          // Update positions for all reordered breaths, ensuring they are > 1
          const breathsWithUpdatedPositions = reorderedBreaths.map((breath, index) => ({
            ...breath,
            position: index + 2,
          }))

          setBreaths(breathsWithUpdatedPositions)
          // Trigger save via debouncedSaveBreaths, which in turn calls onSaveBreaths (parent's handleSaveBreaths)
          // onSaveBreaths then calls databaseService.updateStepBreaths to persist all positions.
          debouncedSaveBreaths(currentStepId!, breathsWithUpdatedPositions)

          toast({ title: "Breaths Reordered", description: "Breath order updated." })
        }
      }
    },
    [breaths, currentStepId, debouncedSaveBreaths, toast],
  )

  const breathIds = useMemo(() => breaths.map((breath) => breath.id), [breaths])

  if (!currentStepId) {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cream-25">Breaths</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cream-25/70">Select a step to manage its breaths.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-cream-25">Breaths</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-cream-25/70">
          Total Estimated Time: <span className="font-semibold text-sapphire-blue">{totalEstimatedTime}</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new breath..."
            value={newBreathName}
            onChange={(e) => setNewBreathName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addBreath()
              }
            }}
            className="flex-1 bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0"
          />
          <Button
            onClick={addBreath}
            disabled={!newBreathName.trim()}
            className="bg-sapphire-blue hover:bg-sapphire-blue/80 text-cream-25"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={breathIds} strategy={verticalListSortingStrategy}>
              {breaths.map((breath) => (
                <SortableBreathItem
                  key={breath.id}
                  breath={breath}
                  onToggleCompletion={toggleCompletion}
                  onToggleRunning={toggleRunning}
                  onReset={resetBreath}
                  onDelete={deleteBreath}
                  onUpdateName={updateBreathName}
                  onEstimationChange={updateBreathEstimation}
                  onTotalTimeChange={updateBreathTotalTime}
                  isStepRunning={isStepRunning}
                  formatTime={formatTime}
                  formatDateTime={formatDateTime}
                  toast={toast} // Pass the toast function
                />
              ))}
            </SortableContext>
          </DndContext>
          {breaths.length === 0 && (
            <div className="text-center py-8 text-cream-25/70">
              <p>No breaths yet. Add one above to get started!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
