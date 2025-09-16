"use client"
import { Button } from "@/components/ui/button"
import {
  Lock,
  Unlock,
  SkipForward,
  Plus,
  Brain,
  Eye,
  DollarSign,
  Users,
  Briefcase,
  ShoppingCart,
  Heart,
  Play,
  Calendar,
  Target,
  Clock,
  Music,
  ExternalLink,
  Sunrise,
  Sunset,
  Minus,
  ListTodo,
  FileText,
  Edit3,
  Award,
  Wind,
  Pause,
  ListFilter,
  TrendingUp,
  Share2,
  Store,
  Compass,
  CheckCircle,
  Globe,
  ListOrdered,
} from "lucide-react"
import type { Step } from "@/lib/types"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { getTimeOfDayGreeting, formatTimeDigital } from "@/lib/utils"
import { WorldClockDisplay } from "./world-clock-display"

type DashboardType =
  | "main"
  | "focus"
  | "emotional"
  | "vision"
  | "wealth"
  | "social"
  | "projects"
  | "sales"
  | "marketplace"

interface CentralDashboardDisplayProps {
  userProfileName: string | null
  pomodoroTime: number
  pomodoroRunning: boolean
  pomodoroPhase: "work" | "break"
  onTogglePomodoro: () => void
  onResetPomodoro: () => void
  hasTasks: boolean
  dashboardType: DashboardType
  onDashboardTypeChange: (type: DashboardType) => void
  timeRemaining: number
  isRunning: boolean
  toggleTimer: () => void
  skipToNextTask: () => void
  pushBackTask: (minutes: number) => void
  darkMode: boolean
  completeTask: () => void
  toggleTaskLock: () => void
  autoloopEnabled?: boolean
  toggleRubricVisibility: () => void
  toggleBreathsVisibility: () => void
  toggleTaskFormVisibility: () => void
  toggleTaskListVisibility: () => void
  toggleTaskListSelectorVisibility: () => void
  toggleGlobalTaskOrderVisibility: () => void
  isOneOffMode: boolean
  onOneOffTaskChange: (field: string, value: string) => void
  currentTask: Step | undefined
  oneOffTaskLabel: string
  totalSessionDuration: number
  onSwitchPhase: (phase: "work" | "break") => void
  onExploreVisionBoardClick: () => void
  onOpenDashboardMenu: () => void
  onUpdateCurrentTaskTimezone: (timezone: string) => void
  toggleWorldClockSectionVisibility: () => void
}

export function CentralDashboardDisplay({
  userProfileName,
  pomodoroTime,
  pomodoroRunning,
  onTogglePomodoro,
  onResetPomodoro,
  pomodoroPhase,
  hasTasks,
  dashboardType,
  onDashboardTypeChange,
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
  toggleTaskListSelectorVisibility,
  toggleGlobalTaskOrderVisibility,
  isOneOffMode,
  onOneOffTaskChange,
  currentTask,
  oneOffTaskLabel,
  totalSessionDuration,
  onSwitchPhase,
  onExploreVisionBoardClick,
  onOpenDashboardMenu,
  onUpdateCurrentTaskTimezone,
  toggleWorldClockSectionVisibility,
}: CentralDashboardDisplayProps) {
  const [currentTime, setCurrentTime] = useState("")
  const displayedUserName = userProfileName ? userProfileName.split(" ")[0] : "User"
  const capitalizedUserName = displayedUserName.charAt(0).toUpperCase() + displayedUserName.slice(1)

  const [showPushBackOptions, setShowPushBackOptions] = useState(false)
  const [showRitual, setShowRitual] = useState<"starting" | "ending" | null>(null)
  const [isEditingOneOff, setIsEditingOneOff] = useState(false)
  const [showWorldClockDisplay, setShowWorldClockDisplay] = useState(false)

  const [internalOneOffTask, setInternalOneOffTask] = useState<Step>({
    id: "one-off",
    label: "One-Off Task",
    duration: 25 * 60 * 1000,
    color: "var(--sapphire-blue)",
    icon: "📝",
    completed: false,
    locked: false,
    history: [],
    breaths: [],
    priorityLetter: "",
    priorityRank: 0,
    mantra: "",
    startingRitual: "",
    endingRitual: "",
    position: 0,
    timezone: "",
  })

  const archPathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [strokeDashoffset, setStrokeDashoffset] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setInternalOneOffTask((prev) => ({
      ...prev,
      label: oneOffTaskLabel,
    }))
  }, [oneOffTaskLabel])

  useEffect(() => {
    if (archPathRef.current) {
      const length = archPathRef.current.getTotalLength()
      setPathLength(length)
      setStrokeDashoffset(length)
    }
  }, [])

  useEffect(() => {
    if (pathLength > 0 && totalSessionDuration > 0) {
      const progress = 1 - timeRemaining / totalSessionDuration
      setStrokeDashoffset(pathLength * (1 - progress))
    } else {
      setStrokeDashoffset(pathLength)
    }
  }, [timeRemaining, totalSessionDuration, pathLength])

  const greeting = getTimeOfDayGreeting()

  const dashboardOptions = [
    { type: "main" as DashboardType, icon: Calendar, label: "Main" },
    { type: "focus" as DashboardType, icon: Brain, label: "Focus" },
    { type: "emotional" as DashboardType, icon: Heart, label: "Emotional" },
    { type: "vision" as DashboardType, icon: Eye, label: "Vision" },
    { type: "wealth" as DashboardType, icon: DollarSign, label: "Wealth" },
    { type: "social" as DashboardType, icon: Users, label: "Social" },
    { type: "projects" as DashboardType, icon: Briefcase, label: "Projects" },
    { type: "sales" as DashboardType, icon: TrendingUp, label: "Sales" },
    { type: "marketplace" as DashboardType, icon: ShoppingCart, label: "Marketplace" },
  ]

  const isFocusModeSelected = dashboardType === "focus"

  const handleInternalOneOffTaskChange = (field: keyof Step, value: string | number) => {
    setInternalOneOffTask((prev) => ({ ...prev, [field]: value }))
    if (field === "label") {
      onOneOffTaskChange("label", value as string)
    }
    if (field === "timezone") {
      onOneOffTaskChange("timezone", value as string)
    }
  }

  const displayIcon = currentTask?.icon || (isOneOffMode ? internalOneOffTask.icon : undefined)
  const displayLabel = currentTask?.label || (isOneOffMode ? internalOneOffTask.label : undefined)
  const displayMantra = currentTask?.mantra || (isOneOffMode ? internalOneOffTask.mantra : undefined)
  const displayStartingRitual =
    currentTask?.startingRitual || (isOneOffMode ? internalOneOffTask.startingRitual : undefined)
  const displayEndingRitual = currentTask?.endingRitual || (isOneOffMode ? internalOneOffTask.endingRitual : undefined)
  const displayTimezone = currentTask?.timezone || (isOneOffMode ? internalOneOffTask.timezone : undefined)

  const displayAudioUrl = currentTask?.audioUrl || (isOneOffMode ? internalOneOffTask.audioUrl : undefined)
  const displayAudioType = currentTask?.audioType || (isOneOffMode ? internalOneOffTask.audioType : undefined)

  const openAudioLink = () => {
    if (displayAudioUrl) {
      window.open(displayAudioUrl, "_blank")
    }
  }

  const getPriorityDisplay = () => {
    const priorityLetter = currentTask?.priorityLetter || internalOneOffTask.priorityLetter
    const priorityRank = currentTask?.priorityRank || internalOneOffTask.priorityRank

    if (!priorityLetter) return null

    const priorityText = `${priorityLetter}${priorityRank || ""}`
    const priorityColors = {
      S: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      E: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      R: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      N: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-gray-200",
      T: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }

    return (
      <Badge className={`${priorityColors[priorityLetter as keyof typeof priorityColors]} font-semibold`}>
        {priorityText}
      </Badge>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-cream-25 text-center">
      <div className="flex flex-col items-center py-8 px-16 relative z-10">
        {dashboardType === "main" && (
          <>
            <div className="text-[10rem] font-light leading-none mb-4 font-montserrat">{currentTime}</div>
            <h2 className="text-4xl font-barlow font-light mb-8 zen-heading">
              {greeting}, {capitalizedUserName}.
            </h2>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={onTogglePomodoro}
                disabled={!hasTasks}
              >
                <Play className="h-5 w-5 mr-2" />
                {pomodoroRunning ? "Pause Focusing" : "Start Focusing"}
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Calendar className="h-5 w-5 mr-2" />
                No events
              </Button>
            </div>
          </>
        )}

        {dashboardType === "focus" && (
          <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full">
            <svg className="absolute inset-0 z-0 hidden" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
              <path
                d="M 50 750 A 700 700 0 0 1 950 750"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                ref={archPathRef}
                d="M 50 750 A 700 700 0 0 1 950 750"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="20"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: strokeDashoffset,
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            </svg>

            <div className="flex gap-4 mb-8 text-cream-25 text-lg font-bold">
              <button
                onClick={() => onSwitchPhase("work")}
                className={pomodoroPhase === "work" ? "opacity-100" : "opacity-50"}
              >
                FOCUS
              </button>
              <span className="opacity-50"></span>
              <button
                onClick={() => onSwitchPhase("break")}
                className={pomodoroPhase === "break" ? "opacity-100" : "opacity-50"}
              >
                BREAK
              </button>
            </div>

            <div className="mb-8 glassmorphism rounded-lg px-6 py-3 border border-cream-25/30 backdrop-blur-sm min-h-[60px] flex items-center justify-center">
              <p className="text-cream-25 text-xl font-caveat italic text-center">
                {showRitual === "starting"
                  ? displayStartingRitual || "No starting ritual set."
                  : showRitual === "ending"
                    ? displayEndingRitual || "No ending ritual set."
                    : displayMantra || "No mantra set."}
              </p>
            </div>

            {showWorldClockDisplay && (
              <WorldClockDisplay timezone={displayTimezone} onClick={null} />
            )}

            <span className="text-8xl font-bold font-montserrat text-cream-25 mb-8">
              {formatTimeDigital(Math.floor(timeRemaining / 1000))}
            </span>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={skipToNextTask}
                aria-label={autoloopEnabled ? "Next task (autoloop)" : "Skip to next task"}
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTimer}
                aria-label={isRunning || pomodoroRunning ? "Pause timer" : "Start timer"}
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                {isRunning || pomodoroRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={completeTask}
                aria-label="Complete task"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <CheckCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTaskLock}
                aria-label={currentTask?.locked ? "Unlock task" : "Lock task"}
                className={`w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200 ${
                  currentTask?.locked ? "bg-cream-25/20" : ""
                }`}
              >
                {currentTask?.locked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPushBackOptions(!showPushBackOptions)}
                aria-label="Adjust time"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <Clock className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRitual(showRitual === "starting" ? null : "starting")}
                aria-label="Show starting ritual"
                className={`w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200 ${
                  showRitual === "starting" ? "bg-cream-25/20" : ""
                }`}
              >
                <Sunrise className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRitual(showRitual === "ending" ? null : "ending")}
                aria-label="Show ending ritual"
                className={`w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200 ${
                  showRitual === "ending" ? "bg-cream-25/20" : ""
                }`}
              >
                <Sunset className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTaskFormVisibility}
                aria-label="Toggle task form display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <FileText className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTaskListVisibility}
                aria-label="Toggle task list display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <ListTodo className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRubricVisibility}
                aria-label="Toggle rubric display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <Award className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBreathsVisibility}
                aria-label="Toggle breaths display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <Wind className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTaskListSelectorVisibility}
                aria-label="Toggle task list selector display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <ListFilter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleGlobalTaskOrderVisibility}
                aria-label="Toggle global task order display"
                className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
              >
                <ListOrdered className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowWorldClockDisplay((prev) => !prev)
                  toggleWorldClockSectionVisibility()
                }}
                aria-label="Toggle world clock display and settings"
                className={`w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200 ${
                  showWorldClockDisplay ? "bg-cream-25/20" : ""
                }`}
              >
                <Globe className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-3 mb-4 flex-wrap justify-center text-cream-25">
              {!currentTask && isOneOffMode && !isEditingOneOff ? (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditingOneOff(true)}
                  className="flex items-center gap-2 text-cream-25 hover:text-cream-100 text-xl font-light"
                >
                  <Edit3 className="h-5 w-5" />
                  Click to create one-off task
                </Button>
              ) : isEditingOneOff || (isOneOffMode && !currentTask) ? (
                <div className="flex flex-col gap-2 w-full max-w-md">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Task icon (emoji)"
                      value={displayIcon}
                      onChange={(e) => handleInternalOneOffTaskChange("icon", e.target.value)}
                      className="w-16 bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                    />
                    <Input
                      placeholder="I will focus on..."
                      value={displayLabel}
                      onChange={(e) => handleInternalOneOffTaskChange("label", e.target.value)}
                      className="flex-1 bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70 text-4xl font-light text-center"
                    />
                    <Button size="sm" onClick={() => setIsEditingOneOff(false)} className="zen-button-primary">
                      Done
                    </Button>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Input
                      placeholder="Priority (S/E/R/N/T)"
                      value={internalOneOffTask.priorityLetter}
                      onChange={(e) => handleInternalOneOffTaskChange("priorityLetter", e.target.value.toUpperCase())}
                      className="w-20 bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                    />
                    <Input
                      placeholder="Rank"
                      value={internalOneOffTask.priorityRank}
                      onChange={(e) => handleInternalOneOffTaskChange("priorityRank", Number(e.target.value))}
                      className="w-16 bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                    />
                  </div>
                  <Textarea
                    placeholder="Enter personal mantra..."
                    value={internalOneOffTask.mantra}
                    onChange={(e) => handleInternalOneOffTaskChange("mantra", e.target.value)}
                    className="text-center italic bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70 font-caveat"
                    rows={2}
                  />
                  <Textarea
                    placeholder="Starting ritual..."
                    value={internalOneOffTask.startingRitual}
                    onChange={(e) => handleInternalOneOffTaskChange("startingRitual", e.target.value)}
                    className="text-center italic bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70 font-caveat"
                    rows={2}
                  />
                  <Textarea
                    placeholder="Ending ritual..."
                    value={internalOneOffTask.endingRitual}
                    onChange={(e) => handleInternalOneOffTaskChange("endingRitual", e.target.value)}
                    className="text-center italic bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70 font-caveat"
                    rows={2}
                  />
                  <Input
                    placeholder="Audio URL (e.g., YouTube link)"
                    value={internalOneOffTask.audioUrl || ""}
                    onChange={(e) => handleInternalOneOffTaskChange("audioUrl", e.target.value)}
                    className="bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                  />
                  <Input
                    placeholder="Audio Type (e.g., youtube, spotify)"
                    value={internalOneOffTask.audioType || ""}
                    onChange={(e) => handleInternalOneOffTaskChange("audioType", e.target.value)}
                    className="bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                  />
                  <Input
                    placeholder="Timezone (e.g., America/New_York)"
                    value={internalOneOffTask.timezone || ""}
                    onChange={(e) => handleInternalOneOffTaskChange("timezone", e.target.value)}
                    className="bg-transparent border-cream-25/20 text-cream-25 placeholder:text-cream-25/70"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-5xl font-light text-center glassmorphism rounded-lg px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                    {displayLabel}
                  </h2>
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
              {displayAudioUrl && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openAudioLink}
                    className="text-xs text-cream-25/80 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Music className="h-3 w-3" />
                    <span>
                      {displayAudioType === "apple-music" && "Apple Music"}
                      {displayAudioType === "spotify" && "Spotify"}
                      {displayAudioType === "youtube" && "YouTube"}
                      {displayAudioType === "file" && "Audio"}
                      {!displayAudioType && "Audio Link"}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {showPushBackOptions && (
              <div className="flex flex-col gap-2 justify-center animate-in fade-in slide-in-from-top-4 duration-300 mb-4">
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(-30)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    30m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(-10)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    10m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(-5)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    5m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(-1)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    1m
                  </Button>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(1)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    1m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(5)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    5m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(10)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    10m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      pushBackTask(30)
                      setShowPushBackOptions(false)
                    }}
                    className="text-cream-25 hover:bg-cream-25/10 transition-colors duration-200 border border-cream-25/30 font-barlow"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    30m
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {dashboardType === "emotional" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Emotional Wellness</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Heart className="h-5 w-5 mr-2" />
                Check In With Feelings
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Brain className="h-5 w-5 mr-2" />
                Mindful Breathing
              </Button>
            </div>
          </>
        )}
        {dashboardType === "vision" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <Eye className="h-5 w-5" />
                  <span className="font-medium">Vision & Goals</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={onExploreVisionBoardClick}
              >
                <Compass className="h-5 w-5 mr-2" />
                Explore Vision Board
              </Button>
            </div>
          </>
        )}
        {dashboardType === "wealth" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Wealth Management</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                View Financial Overview
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Target className="h-5 w-5 mr-2" />
                Set Financial Goal
              </Button>
            </div>
          </>
        )}
        {dashboardType === "social" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Social Connections</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Connections
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Updates
              </Button>
            </div>
          </>
        )}
        {dashboardType === "projects" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">Projects & SDGs</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                View My Projects
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Target className="h-5 w-5 mr-2" />
                Explore SDG Categories
              </Button>
            </div>
          </>
        )}
        {dashboardType === "sales" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Sales Tracking</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Sales Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Sale
              </Button>
            </div>
          </>
        )}
        {dashboardType === "marketplace" && (
          <>
            <div className="mb-6">
              <div className="glassmorphism rounded-full px-6 py-3 border border-cream-25/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cream-25">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Marketplace</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200"
                onClick={() => {}}
              >
                <Store className="h-5 w-5 mr-2" />
                Sell Your Services
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}