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
  LayoutDashboard,
  Repeat,
} from "lucide-react"
import { useRouter } from "next/navigation"
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
  toggleTaskQueue30Visibility?: () => void
  toggleTodayOverviewVisibility?: () => void
  workBreakCycleEnabled?: boolean
  onToggleWorkBreakCycle?: () => void
  cycleWorkDuration?: number
  cycleBreakDuration?: number
  onUpdateCycleDurations?: (work: number, breakDuration: number) => void
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
  toggleTaskQueue30Visibility,
  toggleTodayOverviewVisibility,
  workBreakCycleEnabled = false,
  onToggleWorkBreakCycle,
  cycleWorkDuration = 30,
  cycleBreakDuration = 5,
  onUpdateCycleDurations,
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
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [isInFocusMode, setIsInFocusMode] = useState(false)
  const [isTaskChanging, setIsTaskChanging] = useState(false)
  const [previousTaskId, setPreviousTaskId] = useState<string | undefined>(undefined)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const router = useRouter()

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

  // Auto-enter focus mode when timer is running
  useEffect(() => {
    setIsInFocusMode(isRunning || pomodoroRunning)
    if (isRunning || pomodoroRunning) {
      setShowAdvancedControls(false)
      setShowPushBackOptions(false)
      setShowRitual(null)
    }
  }, [isRunning, pomodoroRunning])

  // Detect task changes and trigger transition animations
  useEffect(() => {
    const currentTaskId = currentTask?.id
    if (currentTaskId !== previousTaskId) {
      if (previousTaskId !== undefined) {
        // Trigger transition animation
        setIsTaskChanging(true)
        const timeoutId = setTimeout(() => {
          setIsTaskChanging(false)
        }, 500) // Animation duration
        return () => clearTimeout(timeoutId)
      }
      setPreviousTaskId(currentTaskId)
    }
  }, [currentTask?.id, previousTaskId])

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
  const displayColor = currentTask?.color || (isOneOffMode ? internalOneOffTask.color : "rgba(255, 255, 255, 0.8)")

  const displayAudioUrl = currentTask?.audioUrl || (isOneOffMode ? internalOneOffTask.audioUrl : undefined)
  const displayAudioType = currentTask?.audioType || (isOneOffMode ? internalOneOffTask.audioType : undefined)

  const openAudioLink = () => {
    if (displayAudioUrl) {
      window.open(displayAudioUrl, "_blank")
    }
  }

  // 30/30 inspired gesture handlers
  const handleTimerTouchStart = (e: React.TouchEvent) => {
    // Prevent default to improve touch responsiveness
    e.preventDefault()
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTimerTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || !touchStartY) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    const distance = Math.abs(deltaX)

    // Enhanced swipe detection with mobile-optimized thresholds
    const swipeThreshold = 30 // Reduced for better mobile sensitivity
    const maxVerticalDeviation = 80 // Allow more vertical movement

    // Swipe gestures for timer control (mobile optimized)
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < maxVerticalDeviation) {
      // Simulate haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }

      if (deltaX > 0) {
        // Swipe right: Add 5 minutes
        pushBackTask(5)
      } else {
        // Swipe left: Subtract 5 minutes
        pushBackTask(-5)
      }
    }

    setTouchStartX(null)
    setTouchStartY(null)
  }

  const handleTimerDoubleClick = () => {
    // Double tap to play/pause (30/30 inspired)
    toggleTimer()
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={onTogglePomodoro}
                disabled={!hasTasks}
              >
                <Play className="h-5 w-5 mr-2" />
                {pomodoroRunning ? "Pause Focusing" : "Start Focusing"}
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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

            <div className="flex gap-4 mb-4 text-cream-25 text-lg font-bold">
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

            {/* Work/Break Cycle Toggle (30/30 style) */}
            {!isInFocusMode && onToggleWorkBreakCycle && (
              <div className="mb-4 animate-in fade-in duration-300">
                <div className="glassmorphism rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cream-25">Auto Work/Break Cycle</span>
                    </div>
                    <button
                      onClick={onToggleWorkBreakCycle}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        workBreakCycleEnabled ? "bg-cyan-500" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          workBreakCycleEnabled ? "transform translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {workBreakCycleEnabled && (
                    <div className="flex gap-3 text-xs text-cream-25/70">
                      <div className="flex-1">
                        <div className="mb-1">Work: {cycleWorkDuration}min</div>
                        <input
                          type="range"
                          min="5"
                          max="60"
                          step="5"
                          value={cycleWorkDuration}
                          onChange={(e) => onUpdateCycleDurations?.(Number(e.target.value), cycleBreakDuration)}
                          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1">Break: {cycleBreakDuration}min</div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={cycleBreakDuration}
                          onChange={(e) => onUpdateCycleDurations?.(cycleWorkDuration, Number(e.target.value))}
                          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Navigation to Other Pages */}
            {!isInFocusMode && (
              <div className="flex gap-2 mb-6 justify-center flex-wrap animate-in fade-in duration-300">
                {toggleTodayOverviewVisibility && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTodayOverviewVisibility}
                    className="glassmorphism border border-white/30 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs px-3 py-1.5 font-semibold"
                    title="Today's Overview"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Today
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/timeline')}
                  className="glassmorphism border border-cream-25/20 text-cream-25/80 hover:text-cream-25 hover:bg-cream-25/10 transition-all duration-200 text-xs px-3 py-1.5"
                  title="View Timeline"
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Timeline
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/habits')}
                  className="glassmorphism border border-purple-500/30 text-purple-300/80 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-200 text-xs px-3 py-1.5"
                  title="View Habits"
                >
                  <Repeat className="h-3.5 w-3.5 mr-1.5" />
                  Habits
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/vision')}
                  className="glassmorphism border border-amber-500/30 text-amber-300/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-200 text-xs px-3 py-1.5"
                  title="View Vision Board"
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Vision
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTaskListVisibility}
                  className="glassmorphism border border-cyan-500/30 text-cyan-300/80 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 text-xs px-3 py-1.5"
                  title="View All Tasks"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  All Tasks
                </Button>
              </div>
            )}

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

            <div
              className="relative mb-8 cursor-pointer transition-all duration-300 hover:scale-105 select-none touch-manipulation min-h-[120px] min-w-[280px] flex items-center justify-center"
              onClick={() => !isInFocusMode && setShowAdvancedControls(!showAdvancedControls)}
              onDoubleClick={handleTimerDoubleClick}
              onTouchStart={handleTimerTouchStart}
              onTouchEnd={handleTimerTouchEnd}
              title="Tap for controls • Double-tap to play/pause • Swipe left/right to adjust time"
            >
              <span
                className="text-8xl font-bold font-montserrat mb-8 transition-all duration-500 sm:text-6xl xs:text-5xl"
                style={{
                  color: isInFocusMode && displayColor ? displayColor : '#f9fafb',
                  textShadow: isInFocusMode && displayColor ? `0 0 20px ${displayColor}40` : 'none'
                }}
              >
                {formatTimeDigital(Math.floor(timeRemaining / 1000))}
              </span>
              {currentTask && isInFocusMode && (
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full transition-all duration-500"
                  style={{ backgroundColor: displayColor }}
                />
              )}
            </div>

            {/* Duration Tracking Indicators */}
            {currentTask && !isInFocusMode && (
              <div className="mb-6 glassmorphism rounded-lg p-4 border border-white/10 max-w-md mx-auto animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-cream-25/60 mb-1">Estimated</div>
                    <div className="text-lg font-semibold text-cyan-300">
                      {Math.round((currentTask.duration || 0) / 60000)}m
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-cream-25/60 mb-1">Actual Focus</div>
                    <div className="text-lg font-semibold text-purple-300">
                      {Math.round((currentTask.actualDuration || 0) / 60000)}m
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-cream-25/60 mb-1">Breaths Total</div>
                    <div className="text-lg font-semibold text-green-300">
                      {Math.round(
                        (currentTask.breaths || []).reduce((sum, breath) => sum + breath.totalTimeSeconds, 0) / 60
                      )}m
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-cream-25/50 text-center">
                  {currentTask.actualDuration && currentTask.actualDuration > 0
                    ? `Remaining: ${Math.max(0, Math.round((currentTask.duration - (currentTask.actualDuration || 0)) / 60000))}m`
                    : "Timer tracks actual time spent vs estimated"}
                </div>
              </div>
            )}

            {/* Essential Controls - Always Visible */}
            <div className="flex gap-2 mb-4 justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTimer}
                aria-label={isRunning || pomodoroRunning ? "Pause timer" : "Start timer"}
                className="w-14 h-14 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: isInFocusMode && displayColor ? displayColor : 'rgba(249, 250, 251, 0.3)',
                  color: isInFocusMode && displayColor ? displayColor : '#f9fafb'
                }}
              >
                {isRunning || pomodoroRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              {!isInFocusMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={completeTask}
                  aria-label="Complete task"
                  className="w-12 h-12 rounded-full glassmorphism border border-cream-25/30 text-cream-25 hover:bg-cream-25/10 transition-all duration-200"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Advanced Controls - Progressive Disclosure */}
            {!isInFocusMode && (showAdvancedControls || !currentTask) && (
              <div className="flex flex-wrap gap-2 mb-8 justify-center animate-in fade-in slide-in-from-top-4 duration-300">
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

                {/* Ritual Controls */}
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
                {/* Task Management Controls */}
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
                {toggleTaskQueue30Visibility && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTaskQueue30Visibility}
                    aria-label="Toggle 30/30 style task queue"
                    className="w-12 h-12 rounded-full glassmorphism border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200"
                    title="30/30 Task Queue"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                )}

                {/* Wellness & Evaluation Controls */}
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
            )}

            {/* Quick Access Hint */}
            {!isInFocusMode && !showAdvancedControls && currentTask && (
              <div className="text-center mb-4">
                <button
                  onClick={() => setShowAdvancedControls(true)}
                  className="text-cream-25/60 hover:text-cream-25 text-sm transition-colors duration-200"
                >
                  Tap timer for more controls
                </button>
              </div>
            )}

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
                  <h2
                    className={`text-5xl font-light text-center glassmorphism rounded-lg px-6 py-3 border border-cream-25/30 backdrop-blur-sm transition-all duration-500 ${
                      isTaskChanging ? 'scale-110 opacity-90' : 'scale-100 opacity-100'
                    }`}
                    style={{
                      color: displayColor && currentTask ? displayColor : '#f9fafb',
                      borderColor: displayColor && currentTask ? `${displayColor}40` : 'rgba(249, 250, 251, 0.3)'
                    }}
                  >
                    {displayLabel}
                  </h2>
                  <div className={`transition-all duration-300 ${isTaskChanging ? 'animate-pulse' : ''}`}>
                    {getPriorityDisplay()}
                  </div>
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <Heart className="h-5 w-5 mr-2" />
                Check In With Feelings
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                View Financial Overview
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Connections
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                View My Projects
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Sales Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
                onClick={() => {}}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
              <Button
                variant="ghost"
                className="text-cream-25 text-lg px-6 py-3 rounded-full border border-cream-25/50 hover:bg-cream-25/10 hover:text-cream-25 transition-colors duration-200 touch-manipulation min-h-[48px] sm:text-base sm:px-4 sm:py-2"
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