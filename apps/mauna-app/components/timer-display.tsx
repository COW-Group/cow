"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Removed: import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SkipForward,
  CheckCircle,
  Lock,
  Unlock,
  Clock,
  Music,
  ExternalLink,
  Sunrise,
  Sunset,
  Plus,
  Minus,
  ListTodo,
  FileText,
  Edit3,
  Award,
  Wind,
  Play,
  Pause,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatTimeDigital } from "@/lib/utils" // Correctly importing formatTimeDigital

interface TimerDisplayProps {
  currentTask?: Task
  timeRemaining: number
  isRunning: boolean
  toggleTimer: () => void
  skipToNextTask: () => void
  pushBackTask: (minutes: number) => void // Updated to accept minutes
  darkMode: boolean
  completeTask: () => void
  toggleTaskLock: () => void
  autoloopEnabled?: boolean
  toggleRubricVisibility: () => void
  toggleBreathsVisibility: () => void // This will now trigger parent state
  toggleTaskFormVisibility: () => void
  toggleTaskListVisibility: () => void
  isOneOffMode: boolean // New prop to indicate one-off mode
  onOneOffTaskChange: (field: string, value: string) => void // New prop for one-off task changes
  pomodoroPhase: "work" | "break" // New prop for pomodoro phase
  pomodoroRunning: boolean // New prop for pomodoro running state
}

export function TimerDisplay({
  currentTask,
  timeRemaining,
  isRunning,
  toggleTimer,
  skipToNextTask,
  pushBackTask,
  darkMode,
  completeTask,
  toggleTaskLock,
  autoloopEnabled = false,
  toggleRubricVisibility,
  toggleBreathsVisibility,
  toggleTaskFormVisibility,
  toggleTaskListVisibility,
  isOneOffMode,
  onOneOffTaskChange,
  pomodoroPhase, // Destructure new prop
  pomodoroRunning, // Destructure new prop
}: TimerDisplayProps) {
  const [showPushBackOptions, setShowPushBackOptions] = useState(false)
  const [showRitual, setShowRitual] = useState<"starting" | "ending" | null>(null)
  const [isEditingOneOff, setIsEditingOneOff] = useState(false)
  const [oneOffTask, setOneOffTask] = useState({
    icon: "🧘",
    label: "One-Off Task",
    priorityLetter: "",
    priorityRank: "",
    mantra: "",
    startingRitual: "",
    endingRitual: "",
  })
  const { toast } = useToast()

  // Update one-off task state and propagate changes
  const handleOneOffTaskChange = (field: string, value: string) => {
    setOneOffTask((prev) => ({ ...prev, [field]: value }))
    onOneOffTaskChange(field, value)
  }

  const calculateProgress = () => {
    if (!currentTask && !isOneOffMode) return 0 // No task, no progress
    const totalSeconds = (currentTask?.duration || 30) * 60 // Default to 30 if no task
    const progress = (timeRemaining / totalSeconds) * 100
    return isNaN(progress) ? 0 : progress
  }

  const openAudioLink = () => {
    if (currentTask?.audioUrl) {
      window.open(currentTask.audioUrl, "_blank")
    }
  }

  const getPriorityDisplay = () => {
    const priorityLetter = currentTask?.priorityLetter || oneOffTask.priorityLetter
    const priorityRank = currentTask?.priorityRank || oneOffTask.priorityRank

    if (!priorityLetter) return null

    const priorityText = `${priorityLetter}${priorityRank || ""}`
    const priorityColors = {
      S: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      E: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      R: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      N: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      T: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }

    return (
      <Badge className={`${priorityColors[priorityLetter as keyof typeof priorityColors]} font-semibold`}>
        {priorityText}
      </Badge>
    )
  }

  const progress = calculateProgress()
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Make sure strokeDashoffset is not NaN
  const safeStrokeDashoffset = isNaN(strokeDashoffset) ? circumference : strokeDashoffset

  const displayIcon = currentTask?.icon || oneOffTask.icon
  const displayLabel = currentTask?.label || oneOffTask.label
  const displayMantra = currentTask?.mantra || oneOffTask.mantra
  const displayStartingRitual = currentTask?.startingRitual || oneOffTask.startingRitual
  const displayEndingRitual = currentTask?.endingRitual || oneOffTask.endingRitual

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-zen border border-border font-inter rounded-lg bg-transparent">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          {/* Pomodoro Tabs - REMOVED as per instructions */}

          {/* Task Info Section - Always visible */}
          <div className="flex items-center gap-3 mb-4 flex-wrap justify-center text-cream-25">
            {!currentTask && isOneOffMode && !isEditingOneOff ? (
              <Button
                variant="ghost"
                onClick={() => setIsEditingOneOff(true)}
                className="flex items-center gap-2 text-cream-25 hover:text-cream-100"
              >
                <Edit3 className="h-4 w-4" />
                Click to create one-off task
              </Button>
            ) : isEditingOneOff || (isOneOffMode && !currentTask) ? (
              <div className="flex flex-col gap-2 w-full max-w-md">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Task icon (emoji)"
                    value={displayIcon}
                    onChange={(e) => handleOneOffTaskChange("icon", e.target.value)}
                    className="w-16 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-cream-900 dark:text-cream-25"
                  />
                  <Input
                    placeholder="Task name"
                    value={displayLabel}
                    onChange={(e) => handleOneOffTaskChange("label", e.target.value)}
                    className="flex-1 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-cream-900 dark:text-cream-25"
                  />
                  <Button size="sm" onClick={() => setIsEditingOneOff(false)} className="zen-button-primary">
                    Done
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Priority (S/E/R/N/T)"
                    value={oneOffTask.priorityLetter}
                    onChange={(e) => handleOneOffTaskChange("priorityLetter", e.target.value.toUpperCase())}
                    className="w-20 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-cream-900 dark:text-cream-25"
                  />
                  <Input
                    placeholder="Rank"
                    value={oneOffTask.priorityRank}
                    onChange={(e) => handleOneOffTaskChange("priorityRank", e.target.value)}
                    className="w-16 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-cream-900 dark:text-cream-25"
                  />
                </div>
              </div>
            ) : (
              <>
                <span className="text-2xl">{displayIcon}</span>
                <h2 className="text-2xl font-bold text-center">{displayLabel}</h2>
                {getPriorityDisplay()}
                {!currentTask && isOneOffMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingOneOff(true)}
                    className="ml-2 text-cream-25 hover:text-cream-100"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Ritual Display */}
          {showRitual && (
            <div className="mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/50 backdrop-blur-sm w-full max-w-md text-cream-25">
              <div className="flex items-center gap-2 mb-2">
                {showRitual === "starting" ? (
                  <Sunrise className="h-4 w-4 text-orange-300" />
                ) : (
                  <Sunset className="h-4 w-4 text-purple-300" />
                )}
                <h3 className="font-medium text-sm">
                  {showRitual === "starting" ? "Starting Ritual" : "Ending Ritual"}
                </h3>
              </div>
              {!currentTask && isEditingOneOff ? (
                <Textarea
                  placeholder={`${showRitual} ritual...`}
                  value={showRitual === "starting" ? oneOffTask.startingRitual : oneOffTask.endingRitual}
                  onChange={(e) =>
                    handleOneOffTaskChange(
                      showRitual === "starting" ? "startingRitual" : "endingRitual",
                      e.target.value,
                    )
                  }
                  className="text-sm bg-transparent border-white/20 dark:border-slate-700/50 text-cream-25"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-cream-25">
                  {showRitual === "starting" ? displayStartingRitual : displayEndingRitual}
                </p>
              )}
            </div>
          )}

          {/* Personal Mantra Display */}
          {(displayMantra || (!currentTask && isEditingOneOff)) && !showRitual && (
            <div className="mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/50 backdrop-blur-sm w-full max-w-md text-cream-25">
              {!currentTask && isEditingOneOff ? (
                <Textarea
                  placeholder="Enter personal mantra..."
                  value={displayMantra}
                  onChange={(e) => handleOneOffTaskChange("mantra", e.target.value)}
                  className="text-center italic bg-transparent border-white/20 dark:border-slate-700/50 text-cream-25"
                  rows={2}
                />
              ) : (
                <p className="text-center italic text-cream-25 font-medium font-caveat text-lg">"{displayMantra}"</p>
              )}
            </div>
          )}

          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="transparent"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="12"
                className="text-cream-25"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="transparent"
                stroke={currentTask?.color || "hsl(var(--logo-blue))"} // Use logo-blue as default
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={safeStrokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 128 128)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream-25">
              <span className="text-6xl font-bold font-montserrat">{formatTimeDigital(timeRemaining / 1000)}</span>
              <span className="text-sm text-cream-25/80 mt-2">
                {currentTask
                  ? Math.floor(currentTask.duration / 60) > 0
                    ? `${Math.floor(currentTask.duration / 60)}h ${currentTask.duration % 60}m total`
                    : `${currentTask.duration} minutes total`
                  : "One-off task timer"}
              </span>
            </div>
          </div>

          {/* Main Play/Pause Button */}
          <Button
            variant={isRunning || pomodoroRunning ? "destructive" : "default"}
            size="icon"
            onClick={toggleTimer}
            aria-label={isRunning || pomodoroRunning ? "Pause timer" : "Start timer"}
            className="zen-button-primary mb-4" // Added mb-4 for spacing
          >
            {isRunning || pomodoroRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Moved controls section below the timer */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={skipToNextTask}
              aria-label={autoloopEnabled ? "Next task (autoloop)" : "Skip to next task"}
              className="zen-button-secondary"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={completeTask}
              aria-label="Complete task"
              className="zen-button-secondary"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTask?.locked ? "default" : "outline"}
              size="icon"
              onClick={toggleTaskLock}
              aria-label={currentTask?.locked ? "Unlock task" : "Lock task"}
              className={currentTask?.locked ? "zen-button-primary" : "zen-button-secondary"}
            >
              {currentTask?.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPushBackOptions(!showPushBackOptions)}
              aria-label="Adjust time"
              className="zen-button-secondary"
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowRitual(showRitual === "starting" ? null : "starting")}
              aria-label="Show starting ritual"
              className={showRitual === "starting" ? "zen-button-primary" : "zen-button-secondary"}
            >
              <Sunrise className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowRitual(showRitual === "ending" ? null : "ending")}
              aria-label="Show ending ritual"
              className={showRitual === "ending" ? "zen-button-primary" : "zen-button-secondary"}
            >
              <Sunset className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTaskFormVisibility}
              aria-label="Toggle task form display"
              className="zen-button-secondary"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTaskListVisibility}
              aria-label="Toggle task list display"
              className="zen-button-secondary"
            >
              <ListTodo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleRubricVisibility}
              aria-label="Toggle rubric display"
              className="zen-button-secondary"
            >
              <Award className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleBreathsVisibility} // This button now triggers the parent's state
              aria-label="Toggle breaths display"
              className="zen-button-secondary"
            >
              <Wind className="h-4 w-4" />
            </Button>
          </div>

          {/* Audio Link Display */}
          {currentTask?.audioUrl && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={openAudioLink}
                className="text-xs text-cream-25/80 hover:text-purple-300 flex items-center gap-1"
              >
                <Music className="h-3 w-3" />
                <span>
                  {currentTask.audioType === "apple-music" && "Apple Music"}
                  {currentTask.audioType === "spotify" && "Spotify"}
                  {currentTask.audioType === "youtube" && "YouTube"}
                  {currentTask.audioType === "file" && "Audio"}
                </span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          )}

          {showPushBackOptions && (
            <div className="flex flex-col gap-2 justify-center animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Subtract time row */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(-30)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  30m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(-10)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  10m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(-5)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  5m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(-1)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  1m
                </Button>
              </div>
              {/* Add time row */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(1)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  1m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(5)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  5m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(10)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  10m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pushBackTask(30)
                    setShowPushBackOptions(false)
                  }}
                  className="zen-button-secondary font-inter"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  30m
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
