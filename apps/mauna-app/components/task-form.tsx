"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Star, Heart, Activity, Music, X } from "lucide-react" // Added Sparkles, Star, Heart, Activity, Music, X
import { useToast } from "@/hooks/use-toast"
import type { TaskListService } from "@/lib/task-list-service" // Import type
import type { DatabaseService } from "@/lib/database-service" // Import type
import type { Step, PriorityLetter } from "@/lib/types" // Import PriorityLetter
import { CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils" // Import cn utility

interface TaskFormProps {
  onClose: () => void
  onAddTask: (newTask: Step) => void
  currentTaskListId: string
  setIsOneOffMode: (isOneOff: boolean) => void
  isOneOffMode: boolean
  setOneOffTaskLabel: (label: string) => void
  noTaskListSelectedId: string // New prop for the special ID
  userId: string // Add userId prop
  taskListService: TaskListService | null // Add taskListService prop
  databaseService: DatabaseService | null // Add databaseService prop
}

export function TaskForm({
  onClose,
  onAddTask,
  currentTaskListId,
  setIsOneOffMode,
  isOneOffMode,
  setOneOffTaskLabel,
  noTaskListSelectedId,
  userId, // Destructure userId
  taskListService, // Destructure taskListService
  databaseService, // Destructure databaseService
}: TaskFormProps) {
  const [label, setLabel] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(30) // Default to 30 minutes
  const [priorityLetter, setPriorityLetter] = useState<PriorityLetter>("None")
  const [priorityRank, setPriorityRank] = useState(0)
  const [color, setColor] = useState("#8A2BE2") // Default to a purple-ish color
  const [icon, setIcon] = useState("🧘") // Default to meditating person emoji
  const [mantra, setMantra] = useState("")
  const [startingRitual, setStartingRitual] = useState("")
  const [endingRitual, setEndingRitual] = useState("")
  const [backgroundAudioSource, setBackgroundAudioSource] = useState("None")
  const [backgroundAudioLink, setBackgroundAudioLink] = useState("")

  const { toast } = useToast()

  // Remove the useMemo that instantiates TaskListService here.
  // It's now passed as a prop from FocusPage.

  const totalDurationMinutes = useMemo(() => {
    return hours * 60 + minutes
  }, [hours, minutes])

  const colorOptions = [
    "#8A2BE2", // BlueViolet
    "#9370DB", // MediumPurple
    "#00CED1", // DarkTurquoise
    "#3CB371", // MediumSeaGreen
    "#FFD700", // Gold
    "#FF6347", // Tomato
    "#FF69B4", // HotPink
  ]

  const iconOptions = [
    "🧘", // Meditating person
    "🌸", // Cherry blossom
    "🌿", // Herb
    "🌊", // Ocean wave
    "🌙", // Crescent moon
    "☀️", // Sun
    "🕯️", // Candle
    "🦋", // Butterfly
    "🌹", // Rose
    "🍃", // Leaf fluttering
  ]

  const priorityDescriptions: Record<PriorityLetter, string> = {
    S: "Strategic tasks that align with long-term goals.",
    E: "Essential tasks that must be completed for immediate impact.",
    R: "Routine tasks that maintain daily operations.",
    N: "Nurture/Delegate tasks to nurture others' growth.",
    T: "Trivial tasks that can be done quickly or are low impact.",
    None: "No specific priority assigned.",
  }

  const handleAddTaskSubmit = async () => {
    if (!label.trim()) {
      toast({ title: "Error", description: "Task label cannot be empty.", variant: "destructive" })
      return
    }

    if (isOneOffMode) {
      setOneOffTaskLabel(label.trim())
      toast({ title: "One-Off Task Set", description: `"${label.trim()}" is now your one-off task.` })
      onClose()
      return
    }

    if (!currentTaskListId || currentTaskListId === noTaskListSelectedId) {
      toast({
        title: "Error",
        description: "Please select or create a task list before adding a task.",
        variant: "destructive",
      })
      return
    }

    // Ensure taskListService is available
    if (!taskListService) {
      toast({ title: "Error", description: "Task service not initialized.", variant: "destructive" })
      return
    }

    try {
      const newTask: Omit<
        Step,
        | "id"
        | "userId"
        | "taskListId"
        | "completed"
        | "history"
        | "position"
        | "lengthId"
        | "estimatedStartTime"
        | "estimatedEndTime"
        | "timezone"
      > = {
        label: label.trim(),
        duration: totalDurationMinutes * 60 * 1000, // Convert minutes to milliseconds
        locked: false,
        color,
        icon,
        priorityLetter,
        priorityRank,
        mantra: mantra.trim(),
        startingRitual: startingRitual.trim(),
        endingRitual: endingRitual.trim(),
        backgroundAudioSource: backgroundAudioSource === "None" ? null : backgroundAudioSource,
        backgroundAudioLink: backgroundAudioLink.trim() || null,
      }
      // Use the taskListService passed as a prop
      const addedTask = await taskListService.addTaskToTaskList(currentTaskListId, newTask)
      onAddTask(addedTask)
      toast({ title: "Task Added ✨", description: `Task "${addedTask.label}" added to list.` })
      onClose()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to add task: ${error.message}`, variant: "destructive" })
    }
  }

  return (
    <div className="bg-ink-950/50 backdrop-blur-xl border border-brushed-silver/30 dark:border-ink-800/30 shadow-2xl rounded-lg p-6 w-full max-w-md">
      <div className="relative mb-4">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-cream-25 hover:text-cream-50 transition-colors"
          aria-label="Close task form"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="flex items-center gap-2 text-2xl font-montserrat font-semibold text-cream-25">
          <Sparkles className="h-6 w-6 text-cream-25" />
          {isOneOffMode ? "Create One-Off Task" : "Create New Task"}
        </h2>
        <CardDescription className="font-barlow text-cream-25/70">
          {isOneOffMode
            ? "Quickly add a temporary task for immediate focus."
            : currentTaskListId === noTaskListSelectedId
              ? "No task list selected. Please select or create one via 'Manage Task Lists'."
              : "Define a new task with all its details."}
        </CardDescription>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scroll max-h-[calc(80vh-100px)]">
        {" "}
        {/* Adjusted max-height */}
        {currentTaskListId === noTaskListSelectedId && !isOneOffMode ? (
          <p className="text-center text-cream-25/70 font-barlow mt-4">
            You must select or create a task list before adding tasks.
            <br />
            Open "Manage Task Lists" from the dashboard menu.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddTaskSubmit()
            }}
            className="space-y-6"
          >
            {/* Task Label */}
            <div>
              <Label htmlFor="label" className="font-montserrat text-cream-25 text-base mb-2 block">
                Task Name
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={isOneOffMode ? "e.g., Quick Brainstorm" : "e.g., Finish Report"}
                className="font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm"
                required
              />
            </div>

            {/* Duration */}
            {!isOneOffMode && (
              <div>
                <Label className="font-montserrat text-cream-25 text-base mb-2 block">Duration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours" className="font-barlow text-cream-25/70 text-sm">
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      min="0"
                      className="font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes" className="font-barlow text-cream-25/70 text-sm">
                      Minutes
                    </Label>
                    <Input
                      id="minutes"
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      min="0"
                      max="59"
                      className="font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm"
                    />
                  </div>
                </div>
                <p className="text-sm text-cream-25/70 font-barlow mt-2">Total: {totalDurationMinutes}m</p>
              </div>
            )}

            {/* Priority Level */}
            {!isOneOffMode && (
              <div>
                <Label className="font-montserrat text-cream-25 text-base mb-2 block flex items-center gap-2">
                  <Star className="h-5 w-5 text-soft-gold" />
                  Priority Level (SERENT Framework)
                </Label>
                <Select value={priorityLetter} onValueChange={(value: PriorityLetter) => setPriorityLetter(value)}>
                  <SelectTrigger className="w-full font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-cream-25 dark:bg-ink-950 text-ink-950 dark:text-cream-25 border-brushed-silver/20 dark:border-ink-800/20 font-barlow">
                    <SelectItem value="None">No Priority</SelectItem>
                    <SelectItem value="S">S (Strategic)</SelectItem>
                    <SelectItem value="E">E (Essential)</SelectItem>
                    <SelectItem value="R">R (Routine)</SelectItem>
                    <SelectItem value="N">N (Nurture/Delegate)</SelectItem>
                    <SelectItem value="T">T (Trivial)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Label htmlFor="priorityRank" className="font-barlow text-cream-25/70 text-sm">
                    Sub-rank
                  </Label>
                  <Input
                    id="priorityRank"
                    type="number"
                    value={priorityRank}
                    onChange={(e) => setPriorityRank(Number(e.target.value))}
                    min="0"
                    className="font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm w-20"
                  />
                </div>
                <p className="text-sm text-cream-25/70 font-barlow mt-2">{priorityDescriptions[priorityLetter]}</p>
              </div>
            )}

            {/* Color Theme */}
            {!isOneOffMode && (
              <div>
                <Label className="font-montserrat text-cream-25 text-base mb-2 block">Color Theme</Label>
                <div className="flex gap-3">
                  {colorOptions.map((c) => (
                    <div
                      key={c}
                      className={cn(
                        "w-8 h-8 rounded-full cursor-pointer border-2 transition-all",
                        color === c ? "border-logo-blue scale-110" : "border-transparent",
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Icon */}
            {!isOneOffMode && (
              <div>
                <Label className="font-montserrat text-cream-25 text-base mb-2 block">Icon</Label>
                <div className="flex flex-wrap gap-3">
                  {iconOptions.map((i) => (
                    <Button
                      key={i}
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "w-10 h-10 rounded-md text-xl transition-all",
                        icon === i ? "border-logo-blue ring-2 ring-logo-blue scale-110" : "border-brushed-silver/30",
                        "bg-white/10 backdrop-blur-sm text-cream-25",
                      )}
                      onClick={() => setIcon(i)}
                    >
                      {i}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Mantra */}
            {!isOneOffMode && (
              <div>
                <Label
                  htmlFor="mantra"
                  className="font-montserrat text-cream-25 text-base mb-2 block flex items-center gap-2"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                  Personal Mantra
                </Label>
                <Textarea
                  id="mantra"
                  value={mantra}
                  onChange={(e) => setMantra(e.target.value)}
                  placeholder="A peaceful phrase to guide your focus..."
                  className="font-caveat text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm min-h-[80px]"
                />
              </div>
            )}

            {/* Starting Ritual */}
            {!isOneOffMode && (
              <div>
                <Label
                  htmlFor="startingRitual"
                  className="font-montserrat text-cream-25 text-base mb-2 block flex items-center gap-2"
                >
                  <Activity className="h-5 w-5 text-sage-500" />
                  Starting Ritual
                </Label>
                <Textarea
                  id="startingRitual"
                  value={startingRitual}
                  onChange={(e) => setStartingRitual(e.target.value)}
                  placeholder="How do you prepare to begin this task?"
                  className="font-caveat text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm min-h-[80px]"
                />
              </div>
            )}

            {/* Ending Ritual */}
            {!isOneOffMode && (
              <div>
                <Label
                  htmlFor="endingRitual"
                  className="font-montserrat text-cream-25 text-base mb-2 block flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5 text-soft-gold" />
                  Ending Ritual
                </Label>
                <Textarea
                  id="endingRitual"
                  value={endingRitual}
                  onChange={(e) => setEndingRitual(e.target.value)}
                  placeholder="How do you close and reflect on this task?"
                  className="font-caveat text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm min-h-[80px]"
                />
              </div>
            )}

            {/* Background Audio */}
            {!isOneOffMode && (
              <div>
                <Label className="font-montserrat text-cream-25 text-base mb-2 block flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-500" />
                  Background Audio
                </Label>
                <Select value={backgroundAudioSource} onValueChange={setBackgroundAudioSource}>
                  <SelectTrigger className="w-full font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm">
                    <SelectValue placeholder="Select audio source" />
                  </SelectTrigger>
                  <SelectContent className="bg-cream-25 dark:bg-ink-950 text-ink-950 dark:text-cream-25 border-brushed-silver/20 dark:border-ink-800/20 font-barlow">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Apple Music">Apple Music</SelectItem>
                    <SelectItem value="Spotify">Spotify</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Custom URL">Custom URL</SelectItem>
                  </SelectContent>
                </Select>
                {backgroundAudioSource !== "None" && (
                  <Input
                    id="backgroundAudioLink"
                    value={backgroundAudioLink}
                    onChange={(e) => setBackgroundAudioLink(e.target.value)}
                    placeholder={`Enter ${backgroundAudioSource.toLowerCase()} link...`}
                    className="font-barlow text-cream-25 bg-white/10 backdrop-blur-sm border-brushed-silver/30 focus:border-logo-blue focus:ring-logo-blue rounded-md shadow-sm mt-2"
                  />
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-montserrat font-semibold rounded-lg shadow-lg
                         bg-gradient-to-r from-logo-blue to-purple-600 text-white
                         hover:from-logo-blue/90 hover:to-purple-700/90 transition-all duration-200 ease-in-out"
            >
              {isOneOffMode ? "Set One-Off Task" : "Create Task"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
