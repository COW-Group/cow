"use client"

import { useState, useEffect, useCallback, useRef, useMemo, Suspense, lazy } from "react"
import { CentralDashboardDisplay } from "@/components/central-dashboard-display"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { TaskEditDialog } from "@/components/task-edit-dialog"
import Breaths from "@/components/breaths"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { Step, TaskList as TTaskList, Breath, RubricData, AppSettings } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { TaskListService } from "@/lib/task-list-service"
import { DatabaseService } from "@/lib/database-service"
import { calculateTaskTimes } from "@/lib/time-calculation"
import { FloatingNav } from "@/components/floating-nav"
import { TaskQueue30 } from "@/components/task-queue-30"
import { TodayOverviewWidget } from "@/components/today-overview-widget"


const NO_TASK_LIST_SELECTED_ID = "no-list-selected"
const ONE_OFF_TASK_ID = "one-off-task-id"
const ALL_ACTIVE_TASKS_ID = "all-active-tasks"

// Lazy load heavy components
const LazyTaskListManager = lazy(() => import("@/components/task-list-manager").then(m => ({ default: m.TaskListManager })))
const LazyRubricSection = lazy(() => import("@/components/rubric-section").then(m => ({ default: m.RubricSection })))
const LazyWorldClockSection = lazy(() => import("@/components/world-clock-section").then(m => ({ default: m.WorldClockSection })))
const LazyGlobalTaskOrderDisplay = lazy(() => import("@/components/global-task-order-display").then(m => ({ default: m.GlobalTaskOrderDisplay })))

export default function FocusPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Loading state for better UX
  const [isInitializing, setIsInitializing] = useState(true)

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60 * 1000)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "break">("work")
  const [timeRemaining, setTimeRemaining] = useState(pomodoroTime)
  const [isRunning, setIsRunning] = useState(false)
  const [totalSessionDuration, setTotalSessionDuration] = useState(pomodoroTime)
  const [autoloopEnabled, setAutoloopEnabled] = useState(false)
  const [autoloopEndIndex, setAutoloopEndIndex] = useState<number | null>(null)
  const [workBreakCycleEnabled, setWorkBreakCycleEnabled] = useState(false)
  const [cycleWorkDuration, setCycleWorkDuration] = useState(30) // minutes
  const [cycleBreakDuration, setCycleBreakDuration] = useState(5) // minutes

  // Time tracking state
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [elapsedTimeInSession, setElapsedTimeInSession] = useState(0)

  const [showRubric, setShowRubric] = useState(false)
  const [showBreaths, setShowBreaths] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTaskList, setShowTaskList] = useState(false)
  const [showTaskListSelector, setShowTaskListSelector] = useState(false)
  const [showWorldClockSection, setShowWorldClockSection] = useState(false)
  const [showGlobalTaskOrder, setShowGlobalTaskOrder] = useState(false)
  const [showTaskQueue30, setShowTaskQueue30] = useState(false)
  const [showTodayOverview, setShowTodayOverview] = useState(false)

  const [isOneOffMode, setIsOneOffMode] = useState(false)
  const [oneOffTaskLabel, setOneOffTaskLabel] = useState("One-Off Task")
  const [oneOffBreaths, setOneOffBreaths] = useState<Breath[]>([])

  const [taskLists, setTaskLists] = useState<TTaskList[]>([])
  const [currentTaskListId, setCurrentTaskListId] = useState("")
  const [currentTask, setCurrentTask] = useState<Step | undefined>(undefined)
  const [userProfileName, setUserProfileName] = useState("User")

  const [isTaskEditDialogOpen, setIsTaskEditDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Step | null>(null)

  const [settings, setSettings] = useState<AppSettings>({
    focusMode: false,
    showWeather: true,
    showGreeting: true,
    showMantra: false,
    showTasks: true,
    showQuotes: true,
    darkMode: false,
    soundEnabled: true,
    defaultDuration: 30,
    autoLoop: false,
    showCalendarMenu: true,
    showTasksMenu: true,
    showJournalMenu: true,
    showVisionBoardMenu: true,
    showBalanceMenu: true,
    showWealthManagementMenu: true,
    showLinksMenu: true,
    showMantrasMenu: true,
    showQuotesMenu: true,
    showCompletedMountainsMenu: true,
    showAudioSettingsMenu: true,
    showMountainPreferencesMenu: true,
    showBubblesMenu: true,
    showHabitsMenu: true,
    showHelpMenu: true,
    showHeaderMain: true,
    showHeaderFocus: true,
    showHeaderEmotional: true,
    showHeaderHealth: true,
    showHeaderVision: true,
    showHeaderWealth: true,
    showHeaderSocial: true,
    showHeaderProjects: true,
    showHeaderSales: true,
    showHeaderMarketplace: true,
  })

  const hasFetchedInitialData = useRef(false)
  const [taskListService, setTaskListService] = useState<TaskListService | null>(null)
  const [databaseService, setDatabaseService] = useState<DatabaseService | null>(null)

  // Memoized service initialization
  const initializeServices = useCallback(() => {
    if (user && !databaseService && !taskListService) {
      const dbService = new DatabaseService()
      setDatabaseService(dbService)
      setTaskListService(new TaskListService(user.id, dbService))
    }
  }, [user, databaseService, taskListService])

  const timeRemainingRef = useRef(timeRemaining)
  useEffect(() => {
    timeRemainingRef.current = timeRemaining
  }, [timeRemaining])

  useEffect(() => {
    if (user) {
      initializeServices()
    } else {
      setDatabaseService(null)
      setTaskListService(null)
    }
  }, [user, initializeServices])

  useEffect(() => {
    if (!loading && !user) {
      if (process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
        router.push("/")
      } else {
        console.log("Authentication disabled. Running in UI/UX mode with mock user.")
        setUserProfileName("Mock User")
      }
    }
  }, [user, loading, router])

  const getTopMostTask = (taskLists: TTaskList[], currentListId: string, noTaskListSelectedId: string): Step | undefined => {
    if (currentListId === ALL_ACTIVE_TASKS_ID) {
      const allActiveTasks = taskLists
        .filter(
          (list) => list.id !== noTaskListSelectedId && list.name !== "✅ Completed Tasks"
        )
        .flatMap((list) => list.steps)
        .filter((step) => !step.completed)
        .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))
      return allActiveTasks[0]
    }
    const selectedList = taskLists.find((list) => list.id === currentListId)
    return selectedList?.steps.filter((step) => !step.completed)[0]
  }

  // Memoized calculation to prevent unnecessary re-calculations
  const calculateAndSetEstimatedTimes = useCallback(() => {
    setTaskLists((prevLists) => {
      const selectedList = prevLists.find((list) => list.id === currentTaskListId)
      if (!selectedList) return prevLists

      const currentTaskIdx = selectedList.steps.findIndex((t) => t.id === currentTask?.id)
      const updatedSteps = calculateTaskTimes(
        selectedList.steps,
        currentTaskIdx,
        isRunning ? timeRemainingRef.current : currentTask?.duration || pomodoroTime,
        isRunning,
      )

      const currentListSteps = prevLists.find((list) => list.id === currentTaskListId)?.steps || []
      const hasChanges = updatedSteps.some((newStep, idx) => {
        const oldStep = currentListSteps[idx]
        return (
          newStep.estimatedStartTime !== oldStep?.estimatedStartTime ||
          newStep.estimatedEndTime !== oldStep?.estimatedEndTime
        )
      })

      if (!hasChanges) {
        return prevLists
      }

      return prevLists.map((list) => (list.id === currentTaskListId ? { ...list, steps: updatedSteps } : list))
    })
  }, [currentTaskListId, currentTask?.id, currentTask?.duration, isRunning, pomodoroTime])

  const handleSetCurrentTaskListId = useCallback(
    (newListId: string) => {
      console.log("Switching to list:", newListId)
      setCurrentTaskListId(newListId)

      const newCurrentTask = getTopMostTask(taskLists, newListId, NO_TASK_LIST_SELECTED_ID)
      const newTime = newCurrentTask?.duration || (settings.defaultDuration * 60 * 1000)

      setIsRunning(false)
      setTimeRemaining(newTime)
      setTotalSessionDuration(newTime)
      setCurrentTask(newCurrentTask)
      setIsOneOffMode(false)

      setShowRubric(false)
      setShowBreaths(false)
      setShowTaskForm(false)
      setShowTaskList(false)
      setShowTaskListSelector(false)
      setShowWorldClockSection(false)
      setShowGlobalTaskOrder(false)

      const newlySelectedList = taskLists.find((list) => list.id === newListId)
      if (newListId !== NO_TASK_LIST_SELECTED_ID) {
        toast({
          title: "Task List Switched",
          description: `Now viewing "${newlySelectedList?.name || "No List"}".`,
        })
      } else {
        toast({
          title: "No Task List Selected",
          description: "You are currently in 'No Task List Selected' mode.",
        })
      }
    },
    [taskLists, settings.defaultDuration, toast],
  )

  // Optimized data fetching with better error handling and loading states
  useEffect(() => {
    const fetchData = async () => {
      if (user && databaseService && taskListService && !hasFetchedInitialData.current) {
        hasFetchedInitialData.current = true
        setIsInitializing(true)

        try {
          // Parallel execution of independent operations
          const [profile, fetchedLists] = await Promise.allSettled([
            databaseService.createOrUpdateUserProfile(user.id, user.email?.split("@")[0] || "User"),
            databaseService.fetchTaskLists(user.id)
          ])

          // Handle profile result
          if (profile.status === 'fulfilled' && profile.value?.name) {
            setUserProfileName(profile.value.name)
          } else {
            setUserProfileName(user.email?.split("@")[0] || "User")
            if (profile.status === 'rejected') {
              console.error("Failed to create or fetch user profile:", profile.reason)
            }
          }

          // Handle task lists result
          if (fetchedLists.status === 'fulfilled') {
            const lists = fetchedLists.value
            setTaskLists(lists)

            if (lists.length > 0) {
              const initialListId = lists.find((list) => list.id === ALL_ACTIVE_TASKS_ID)?.id || lists[0].id
              setCurrentTaskListId(initialListId)

              const initialTask = getTopMostTask(lists, initialListId, NO_TASK_LIST_SELECTED_ID)
              const initialTime = initialTask?.duration || (settings.defaultDuration * 60 * 1000)

              setCurrentTask(initialTask)
              setTimeRemaining(initialTime)
              setTotalSessionDuration(initialTime)

              toast({ title: "Welcome!", description: `Viewing "${lists.find((list) => list.id === initialListId)?.name || "All Active Tasks"}".` })
            } else {
              const defaultList = await databaseService.createTaskList(user.id, "My First List", 0)
              setTaskLists([defaultList])

              setCurrentTaskListId(defaultList.id)
              setCurrentTask(undefined)
              setTimeRemaining(settings.defaultDuration * 60 * 1000)
              setTotalSessionDuration(settings.defaultDuration * 60 * 1000)

              toast({ title: "Welcome!", description: "A default task list has been created for you." })
            }
          } else {
            console.error("Failed to fetch task lists:", fetchedLists.reason)
            toast({ title: "Error", description: "Failed to load task lists.", variant: "destructive" })
            setCurrentTaskListId(NO_TASK_LIST_SELECTED_ID)
            setCurrentTask(undefined)
            setTimeRemaining(settings.defaultDuration * 60 * 1000)
            setTotalSessionDuration(settings.defaultDuration * 60 * 1000)
          }
        } catch (error) {
          console.error("Unexpected error during data fetching:", error)
          toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" })
        } finally {
          setIsInitializing(false)
        }
      }
    }

    fetchData()
  }, [user, databaseService, taskListService, toast, settings.defaultDuration])

  // Debounce calculations to avoid excessive re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAndSetEstimatedTimes()
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [currentTaskListId, currentTask?.id, isRunning, calculateAndSetEstimatedTimes])

  // Optimized timer with better performance and work/break cycle automation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1000)

        // Track elapsed time in current session
        if (sessionStartTime) {
          const elapsed = Date.now() - sessionStartTime
          setElapsedTimeInSession(elapsed)
        }
      }, 1000)
    } else if (timeRemaining <= 0 && isRunning) {
      setIsRunning(false)

      // Work/Break Cycle Automation (30/30 style)
      if (workBreakCycleEnabled) {
        const nextPhase = pomodoroPhase === "work" ? "break" : "work"
        const nextDuration = nextPhase === "work" ? cycleWorkDuration * 60 * 1000 : cycleBreakDuration * 60 * 1000

        toast({
          title: `${pomodoroPhase === "work" ? "Work" : "Break"} Complete!`,
          description: `Starting ${nextPhase} session (${nextPhase === "work" ? cycleWorkDuration : cycleBreakDuration} min)`,
        })

        setPomodoroPhase(nextPhase)
        setTimeRemaining(nextDuration)
        setTotalSessionDuration(nextDuration)

        // Auto-start next phase
        setTimeout(() => {
          setIsRunning(true)
        }, 1000)
      }
      // Regular autoloop (without work/break cycle)
      else if (autoloopEnabled) {
        toast({
          title: "Time's Up!",
          description: `Your ${pomodoroPhase} session has ended.`,
        })
        const nextPhase = pomodoroPhase === "work" ? "break" : "work"
        handleSwitchPhase(nextPhase)
      }
      // No automation - just notify
      else {
        toast({
          title: "Time's Up!",
          description: `Your ${pomodoroPhase} session has ended.`,
        })
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, pomodoroPhase, autoloopEnabled, workBreakCycleEnabled, cycleWorkDuration, cycleBreakDuration, toast])

  const toggleTimer = useCallback(async () => {
    setIsRunning((prev) => {
      const newIsRunning = !prev

      if (newIsRunning) {
        // Starting timer
        setSessionStartTime(Date.now())
        setElapsedTimeInSession(0)

        // Auto-reveal breaths component
        setShowBreaths(true)

        // Auto-create first breath if none exist
        if (currentTask && (!currentTask.breaths || currentTask.breaths.length === 0) && databaseService && user?.id) {
          const firstBreath: Breath = {
            id: crypto.randomUUID(),
            name: "set up first breath",
            completed: false,
            isRunning: true,
            startTime: new Date().toISOString(),
            endTime: null,
            pausedTime: 0,
            totalTimeSeconds: 0,
            timeEstimationSeconds: Math.floor((currentTask.duration || 0) / 1000),
            position: 0,
            emotionId: null,
          }

          // Update current task with first breath
          setCurrentTask(prev => prev ? { ...prev, breaths: [firstBreath] } : prev)

          // Save to database
          databaseService.updateStepBreaths(user.id, currentTask.id, [firstBreath]).catch(console.error)

          toast({
            title: "First Breath Created",
            description: "Break down your step into breaths for better tracking!",
          })
        }
      } else {
        // Stopping/Pausing timer
        if (sessionStartTime && currentTask) {
          const elapsed = Date.now() - sessionStartTime
          setElapsedTimeInSession(elapsed)

          // Update step's actual duration
          const newActualDuration = (currentTask.actualDuration || 0) + elapsed
          const newTimeRemaining = Math.max(0, (currentTask.duration || 0) - newActualDuration)

          // Update timeRemaining to reflect remaining time (not reset)
          setTimeRemaining(newTimeRemaining)

          // Update current task
          setCurrentTask(prev => prev ? {
            ...prev,
            actualDuration: newActualDuration,
            elapsedTime: elapsed
          } : prev)

          // Update in database
          if (taskListService && currentTaskListId) {
            const updatedTask = {
              ...currentTask,
              actualDuration: newActualDuration,
              elapsedTime: elapsed,
              duration: newTimeRemaining, // Update duration to remaining time
            }
            taskListService.updateTaskInTaskList(currentTaskListId, updatedTask).catch(console.error)
          }
        }
        setSessionStartTime(null)
      }

      calculateAndSetEstimatedTimes()
      return newIsRunning
    })
  }, [calculateAndSetEstimatedTimes, currentTask, sessionStartTime, databaseService, user, taskListService, currentTaskListId, toast])

  const skipToNextTask = useCallback(async () => {
    if (isOneOffMode) {
      toast({
        title: "One-Off Mode",
        description: "Skipping is not applicable in one-off task mode.",
      })
      return
    }
    if (!currentTask || !currentTaskListId || !taskListService) return

    try {
      await taskListService.deleteTaskFromTaskList(currentTaskListId, currentTask.id)
      setTaskLists((prevLists) => {
        return prevLists.map((list) =>
          list.id === currentTaskListId ? { ...list, steps: list.steps.filter((t) => t.id !== currentTask.id) } : list,
        )
      })
      toast({
        title: "Task Skipped",
        description: `"${currentTask.label}" was skipped.`,
      })
      calculateAndSetEstimatedTimes()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to skip task: ${error.message}`, variant: "destructive" })
    }
  }, [currentTask, currentTaskListId, isOneOffMode, taskListService, toast, calculateAndSetEstimatedTimes])

  const pushBackTask = useCallback(
    (minutes: number) => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev + minutes * 60 * 1000)
        return newTime
      })
      toast({
        title: "Time Adjusted",
        description: `${minutes > 0 ? "+" : ""}${minutes} minutes added to the timer.`,
      })
      calculateAndSetEstimatedTimes()
    },
    [toast, calculateAndSetEstimatedTimes],
  )

  const completeTask = useCallback(async () => {
    if (isOneOffMode) {
      toast({
        title: "One-Off Task Completed!",
        description: `"${oneOffTaskLabel}" marked as complete.`,
      })
      setOneOffTaskLabel("One-Off Task")
      setIsOneOffMode(false)
      setOneOffBreaths([])
      return
    }
    if (!currentTask || !currentTaskListId || !taskListService) return

    try {
      const now = new Date()

      // Calculate actual duration (including current session if running)
      let totalActualDuration = currentTask.actualDuration || 0
      if (sessionStartTime && isRunning) {
        totalActualDuration += Date.now() - sessionStartTime
      }

      // Calculate total breath durations
      const totalBreathDuration = (currentTask.breaths || []).reduce(
        (sum, breath) => sum + (breath.totalTimeSeconds * 1000),
        0
      )

      const startTime = new Date(now.getTime() - totalActualDuration)
      const updatedHistory = [
        ...(currentTask.history || []),
        {
          startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
          endTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
          actualDuration: totalActualDuration,
        },
      ]

      const completedTask = {
        ...currentTask,
        completed: true,
        history: updatedHistory,
        actualDuration: totalActualDuration,
      }
      await taskListService.updateTaskInTaskList(currentTaskListId, completedTask)

      await taskListService.deleteTaskFromTaskList(currentTaskListId, currentTask.id)
      setTaskLists((prevLists) => {
        return prevLists.map((list) =>
          list.id === currentTaskListId ? { ...list, steps: list.steps.filter((t) => t.id !== currentTask.id) } : list,
        )
      })

      // Reset timer state
      setSessionStartTime(null)
      setElapsedTimeInSession(0)

      const actualMinutes = Math.round(totalActualDuration / 60000)
      const breathMinutes = Math.round(totalBreathDuration / 60000)

      toast({
        title: "Task Completed!",
        description: `"${currentTask.label}" completed. Focus: ${actualMinutes}m | Breaths: ${breathMinutes}m`,
      })
      calculateAndSetEstimatedTimes()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to complete task: ${error.message}`, variant: "destructive" })
    }
  }, [
    currentTask,
    currentTaskListId,
    isOneOffMode,
    oneOffTaskLabel,
    taskListService,
    sessionStartTime,
    isRunning,
    toast,
    calculateAndSetEstimatedTimes,
  ])

  const toggleTaskLock = useCallback(async () => {
    if (!currentTask || !currentTaskListId || !taskListService) return

    try {
      const updatedTask = { ...currentTask, locked: !currentTask.locked }
      await taskListService.updateTaskInTaskList(currentTaskListId, updatedTask)
      setCurrentTask(updatedTask)
      setTaskLists((prevLists) => {
        return prevLists.map((list) =>
          list.id === currentTaskListId
            ? { ...list, steps: list.steps.map((t) => (t.id === updatedTask.id ? updatedTask : t)) }
            : list,
        )
      })
      toast({
        title: currentTask.locked ? "Task Unlocked" : "Task Locked",
        description: currentTask.locked
          ? `"${currentTask.label}" is now unlocked.`
          : `"${currentTask.label}" is now locked.`,
      })
      calculateAndSetEstimatedTimes()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to toggle lock: ${error.message}`, variant: "destructive" })
    }
  }, [currentTask, currentTaskListId, taskListService, toast, calculateAndSetEstimatedTimes])

  const handleTogglePomodoro = useCallback(() => {
    setPomodoroRunning((prev) => !prev)
    setIsRunning((prev) => {
      const newIsRunning = !prev
      calculateAndSetEstimatedTimes()
      return newIsRunning
    })
  }, [calculateAndSetEstimatedTimes])

  const handleResetPomodoro = useCallback(() => {
    setPomodoroRunning(false)
    setIsRunning(false)
    setTimeRemaining(pomodoroTime)
    setTotalSessionDuration(pomodoroTime)
    setPomodoroPhase("work")
    toast({
      title: "Pomodoro Reset",
      description: "The pomodoro timer has been reset.",
    })
    calculateAndSetEstimatedTimes()
  }, [pomodoroTime, toast, calculateAndSetEstimatedTimes])

  const handleSwitchPhase = useCallback(
    (phase: "work" | "break") => {
      setPomodoroPhase(phase)
      const newDuration = phase === "work" ? pomodoroTime : 5 * 60 * 1000
      setTimeRemaining(newDuration)
      setTotalSessionDuration(newDuration)
      setIsRunning(true)
      toast({
        title: `Switched to ${phase === "work" ? "Focus" : "Break"}`,
        description: `Starting a ${newDuration / 60000}-minute ${phase} session.`,
      })
      calculateAndSetEstimatedTimes()
    },
    [pomodoroTime, toast, calculateAndSetEstimatedTimes],
  )

  const handleOneOffTaskChange = useCallback((field: string, value: string) => {
    if (field === "label") {
      setOneOffTaskLabel(value)
    }
  }, [])

  const handleAddTask = useCallback(
    (newTask: Step) => {
      setTaskLists((prevLists) =>
        prevLists.map((list) => (list.id === newTask.taskListId ? { ...list, steps: [...list.steps, newTask] } : list)),
      )
      calculateAndSetEstimatedTimes()
    },
    [calculateAndSetEstimatedTimes],
  )

  const handleUpdateTask = useCallback(
    async (updatedTask: Step) => {
      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list.id === updatedTask.taskListId
            ? {
                ...list,
                steps: list.steps.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
              }
            : list,
        ),
      )
      if (user?.id && databaseService) {
        try {
          const fetchedLists = await databaseService.fetchTaskLists(user.id)
          setTaskLists(fetchedLists)
        } catch (error: any) {
          console.error("Failed to refetch task lists:", error)
          toast({ title: "Error", description: "Failed to refresh task lists.", variant: "destructive" })
        }
      }
      setIsTaskEditDialogOpen(false)
      setTaskToEdit(null)
      calculateAndSetEstimatedTimes()
    },
    [calculateAndSetEstimatedTimes, user?.id, databaseService, toast],
  )

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.id || !databaseService) {
        toast({
          title: "Error",
          description: "Cannot delete task: Missing user or database service.",
          variant: "destructive",
        })
        return
      }

      try {
        let taskListId = currentTaskListId
        let taskLabel = "Unknown Task"

        console.log(`[handleDeleteTask] Received taskId: ${taskId}, currentTaskListId: ${currentTaskListId}`)

        if (currentTaskListId === ALL_ACTIVE_TASKS_ID) {
          // Find the actual taskListId and label for the task
          const task = taskLists
            .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
            .flatMap((list) => list.steps)
            .find((t) => t.id === taskId)
          if (!task) {
            console.log(`[handleDeleteTask] Task not found for taskId: ${taskId}`)
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive",
            })
            return
          }
          taskListId = task.taskListId
          taskLabel = task.label
          console.log(`[handleDeleteTask] Resolved task: id=${taskId}, label=${taskLabel}, taskListId=${taskListId}`)
        } else {
          const task = taskLists.find((list) => list.id === currentTaskListId)?.steps.find((t) => t.id === taskId)
          if (task) {
            taskLabel = task.label
          } else {
            console.log(`[handleDeleteTask] Task not found for taskId: ${taskId} in taskListId: ${currentTaskListId}`)
            toast({
              title: "Error",
              description: "Task not found in current list.",
              variant: "destructive",
            })
            return
          }
        }

        if (!taskListId || taskListId === ALL_ACTIVE_TASKS_ID || taskListId === NO_TASK_LIST_SELECTED_ID) {
          console.log(`[handleDeleteTask] Invalid taskListId: ${taskListId}`)
          toast({
            title: "Error",
            description: "Invalid task list ID for deletion.",
            variant: "destructive",
          })
          return
        }

        console.log(`[handleDeleteTask] Attempting to delete task: id=${taskId}, label=${taskLabel}, taskListId=${taskListId}`)
        console.log(`[handleDeleteTask] Calling databaseService.deleteStep with userId=${user.id}, taskId=${taskId}`)

        // Delete task from backend
        await databaseService.deleteStep(taskId, user.id)

        // Update local state
        setTaskLists((prevLists) => {
          const updatedLists = prevLists.map((list) =>
            list.id === taskListId ? { ...list, steps: list.steps.filter((task) => task.id !== taskId) } : list,
          )
          console.log(`[handleDeleteTask] Updated taskLists after deletion:`, updatedLists.map(list => ({
            id: list.id,
            name: list.name,
            steps: list.steps.map(step => ({ id: step.id, label: step.label })),
          })))
          return updatedLists
        })

        // If the deleted task was the current task, update currentTask
        if (currentTask?.id === taskId) {
          const newCurrentTask = getTopMostTask(taskLists, currentTaskListId, NO_TASK_LIST_SELECTED_ID)
          setCurrentTask(newCurrentTask)
          const newTime = newCurrentTask?.duration || (settings.defaultDuration * 60 * 1000)
          setTimeRemaining(newTime)
          setTotalSessionDuration(newTime)
          console.log(`[handleDeleteTask] Updated currentTask:`, newCurrentTask ? { id: newCurrentTask.id, label: newCurrentTask.label } : null)
        }

        // Refetch task lists to ensure consistency
        const updatedTaskLists = await databaseService.fetchTaskLists(user.id)
        if (updatedTaskLists) {
          setTaskLists(updatedTaskLists)
          console.log(`[handleDeleteTask] Task lists refetched after deletion:`, updatedTaskLists.map(list => ({
            id: list.id,
            name: list.name,
            steps: list.steps.map(step => ({
              id: step.id,
              label: step.label,
            })),
          })))
        }

        toast({
          title: "Task Deleted",
          description: `"${taskLabel}" was successfully deleted.`,
        })
        calculateAndSetEstimatedTimes()
      } catch (error: any) {
        console.error(`[handleDeleteTask] Error deleting task ${taskId}:`, error)
        toast({
          title: "Error",
          description: `Failed to delete task: ${error.message}`,
          variant: "destructive",
        })
      }
    },
    [user?.id, currentTaskListId, databaseService, currentTask, taskLists, settings.defaultDuration, toast, calculateAndSetEstimatedTimes],
  )

  const handleEditTask = useCallback((task: Step) => {
    setTaskToEdit(task)
    setIsTaskEditDialogOpen(true)
    setShowRubric(false)
    setShowBreaths(false)
    setShowTaskForm(false)
    setShowTaskList(false)
    setShowTaskListSelector(false)
    setShowWorldClockSection(false)
    setShowGlobalTaskOrder(false)
  }, [])

  const handleReorderAndSaveTasks = useCallback(
    async (reorderedTasks: Step[]) => {
      if (!currentTaskListId || !taskListService) return
      setTaskLists((prevLists) =>
        prevLists.map((list) => (list.id === currentTaskListId ? { ...list, steps: reorderedTasks } : list)),
      )
      toast({ title: "Tasks Reordered", description: "Task order saved." })
      calculateAndSetEstimatedTimes()
    },
    [currentTaskListId, taskListService, toast, calculateAndSetEstimatedTimes],
  )

  const handleToggleTaskCompletion = useCallback(
    (taskId: string, newCompletedStatus: boolean) => {
      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list.id === currentTaskListId
            ? {
                ...list,
                steps: list.steps.map((task) =>
                  task.id === taskId ? { ...task, completed: newCompletedStatus } : task,
                ),
              }
            : list,
        ),
      )
      toast({
        title: newCompletedStatus ? "Task Completed!" : "Task Unmarked",
        description: `Task completion status updated.`,
      })
      calculateAndSetEstimatedTimes()
    },
    [currentTaskListId, toast, calculateAndSetEstimatedTimes],
  )

  const handleSaveBreaths = useCallback(
    async (stepId: string, breaths: Breath[]) => {
      if (!user?.id || !databaseService) return

      try {
        if (stepId === ONE_OFF_TASK_ID) {
          setOneOffBreaths(breaths)
          toast({ title: "One-Off Breaths Updated", description: "Breaths saved locally." })
        } else {
          setTaskLists((prevLists) =>
            prevLists.map((list) =>
              list.id === currentTaskListId
                ? {
                    ...list,
                    steps: list.steps.map((step) => (step.id === stepId ? { ...step, breaths: breaths } : step)),
                  }
                : list,
            ),
          )
          if (currentTask?.id === stepId) {
            setCurrentTask((prev) => (prev ? { ...prev, breaths: breaths } : prev))
          }

          await databaseService.updateStepBreaths(user.id, stepId, breaths)
          toast({ title: "Breaths Updated", description: "Breaths saved successfully." })
        }
      } catch (error: any) {
        console.error("Failed to save breaths:", error)
        toast({ title: "Error", description: `Failed to save breaths: ${error.message}`, variant: "destructive" })
      }
    },
    [currentTaskListId, currentTask, toast, user?.id, setOneOffBreaths, databaseService],
  )

  const handleSaveRubric = useCallback(
    async (taskId: string, rubric: RubricData) => {
      if (!user?.id || !taskListService) {
        toast({
          title: "Error",
          description: "Cannot save rubric: User not authenticated or no task list selected.",
          variant: "destructive",
        })
        return
      }

      try {
        const updatedTask = await taskListService.updateTaskInTaskList(currentTaskListId, {
          ...currentTask,
          id: taskId,
          rubric: rubric,
        } as Step)

        if (updatedTask) {
          setTaskLists((prevLists) =>
            prevLists.map((list) =>
              list.id === currentTaskListId
                ? {
                    ...list,
                    steps: list.steps.map((step) => (step.id === taskId ? updatedTask : step)),
                  }
                : list,
            ),
          )
          if (currentTask?.id === taskId) {
            setCurrentTask(updatedTask)
          }
          toast({ title: "Rubric Saved", description: "Task rubric updated successfully." })
        } else {
          toast({ title: "Error", description: "Failed to save rubric: No data returned.", variant: "destructive" })
        }
      } catch (error: any) {
        console.error("Failed to save rubric:", error)
        toast({ title: "Error", description: `Failed to save rubric: ${error.message}`, variant: "destructive" })
      }
    },
    [user?.id, taskListService, currentTaskListId, currentTask, toast],
  )

  const handleUpdateCurrentTaskTimezone = useCallback(
    async (newTimezone: string) => {
      if (!currentTask || !currentTaskListId || !taskListService) {
        toast({
          title: "Error",
          description: "No active task or task list to update timezone.",
          variant: "destructive",
        })
        return
      }

      try {
        const updatedTask = { ...currentTask, timezone: newTimezone }
        await taskListService.updateTaskInTaskList(currentTaskListId, updatedTask)
        setCurrentTask(updatedTask)
        setTaskLists((prevLists) =>
          prevLists.map((list) =>
            list.id === currentTaskListId
              ? { ...list, steps: list.steps.map((t) => (t.id === updatedTask.id ? updatedTask : t)) }
              : list,
          ),
        )
        toast({
          title: "Task Timezone Updated",
          description: `Timezone for "${currentTask.label}" set to ${newTimezone}.`,
        })
      } catch (error: any) {
        console.error("Failed to update task timezone:", error)
        toast({
          title: "Error",
          description: `Failed to update task timezone: ${error.message}`,
          variant: "destructive",
        })
      }
    },
    [currentTask, currentTaskListId, taskListService, toast],
  )

  // TaskQueue30 handlers
  const handleTaskQueue30Click = useCallback((task: Step) => {
    setCurrentTask(task)
    const newTime = task.duration || (settings.defaultDuration * 60 * 1000)
    setTimeRemaining(newTime)
    setTotalSessionDuration(newTime)
    toast({ title: "Task Selected", description: `Now focusing on "${task.label}".` })
  }, [settings.defaultDuration, toast])

  const handleTaskQueue30MoveToBottom = useCallback(
    async (taskId: string) => {
      if (!databaseService || !user?.id) return
      try {
        // Get all tasks in current queue
        const allTasks = taskLists
          .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
          .flatMap((list) => list.steps)
          .filter((step) => !step.completed)
          .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))

        const taskIndex = allTasks.findIndex(t => t.id === taskId)
        if (taskIndex === -1) return

        // Move task to bottom
        const reorderedTasks = [...allTasks]
        const [task] = reorderedTasks.splice(taskIndex, 1)
        reorderedTasks.push(task)

        // Update positionWhenAllListsActive for all tasks
        const tasksWithNewPositions = reorderedTasks.map((task, index) => ({
          ...task,
          positionWhenAllListsActive: index + 1
        }))

        // Batch update all tasks in database
        await Promise.all(
          tasksWithNewPositions.map(task =>
            databaseService.updateStep(task.id, user.id, { positionWhenAllListsActive: task.positionWhenAllListsActive })
          )
        )

        // Update local state
        setTaskLists(prevLists =>
          prevLists.map(list => ({
            ...list,
            steps: list.steps.map(step => {
              const updatedTask = tasksWithNewPositions.find(t => t.id === step.id)
              return updatedTask || step
            })
          }))
        )

        toast({ title: "Task Moved", description: "Task moved to bottom of queue." })
      } catch (error: any) {
        console.error("Failed to move task:", error)
        toast({ title: "Error", description: `Failed to move task: ${error.message}`, variant: "destructive" })
      }
    },
    [databaseService, user?.id, taskLists, toast],
  )

  const handleTaskQueue30MoveToTop = useCallback(
    async (taskId: string) => {
      if (!databaseService || !user?.id) return
      try {
        // Get all tasks in current queue
        const allTasks = taskLists
          .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
          .flatMap((list) => list.steps)
          .filter((step) => !step.completed)
          .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))

        const taskIndex = allTasks.findIndex(t => t.id === taskId)
        if (taskIndex === -1) return

        // Move task to top
        const reorderedTasks = [...allTasks]
        const [task] = reorderedTasks.splice(taskIndex, 1)
        reorderedTasks.unshift(task)

        // Update positionWhenAllListsActive for all tasks
        const tasksWithNewPositions = reorderedTasks.map((task, index) => ({
          ...task,
          positionWhenAllListsActive: index + 1
        }))

        // Batch update all tasks in database
        await Promise.all(
          tasksWithNewPositions.map(task =>
            databaseService.updateStep(task.id, user.id, { positionWhenAllListsActive: task.positionWhenAllListsActive })
          )
        )

        // Update local state
        setTaskLists(prevLists =>
          prevLists.map(list => ({
            ...list,
            steps: list.steps.map(step => {
              const updatedTask = tasksWithNewPositions.find(t => t.id === step.id)
              return updatedTask || step
            })
          }))
        )

        toast({ title: "Task Moved", description: "Task moved to top of queue." })
      } catch (error: any) {
        console.error("Failed to move task:", error)
        toast({ title: "Error", description: `Failed to move task: ${error.message}`, variant: "destructive" })
      }
    },
    [databaseService, user?.id, taskLists, toast],
  )

  const handleTaskQueue30Edit = useCallback(
    (task: Step) => {
      handleEditTask(task)
    },
    [handleEditTask],
  )

  const handleTaskQueue30InsertNewTask = useCallback(
    async (position: number) => {
      if (!databaseService || !user?.id || !taskListService) return

      try {
        // Get all tasks in current queue
        const allTasks = taskLists
          .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
          .flatMap((list) => list.steps)
          .filter((step) => !step.completed)
          .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))

        // Create a new blank task
        const newTask: Step = {
          id: crypto.randomUUID(),
          label: "New Task",
          duration: settings.defaultDuration * 60 * 1000,
          color: "#00D9FF",
          icon: "📝",
          completed: false,
          locked: false,
          history: [],
          breaths: [],
          priorityLetter: "None",
          priorityRank: 0,
          mantra: "",
          startingRitual: "",
          endingRitual: "",
          position: 0,
          positionWhenAllListsActive: position + 1,
          timezone: "",
          taskListId: currentTaskListId === ALL_ACTIVE_TASKS_ID
            ? (taskLists.find(list => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")?.id || "")
            : currentTaskListId,
          userId: user.id,
          tag: "task-list",
        }

        // Insert at correct position and update all subsequent tasks
        const reorderedTasks = [...allTasks]
        reorderedTasks.splice(position, 0, newTask)

        // Update positionWhenAllListsActive for all tasks
        const tasksWithNewPositions = reorderedTasks.map((task, index) => ({
          ...task,
          positionWhenAllListsActive: index + 1
        }))

        // Add new task to database
        await databaseService.createStep(newTask, user.id)

        // Update positions for existing tasks if needed
        await Promise.all(
          tasksWithNewPositions
            .filter(task => task.id !== newTask.id)
            .map(task =>
              databaseService.updateStep(task.id, user.id, { positionWhenAllListsActive: task.positionWhenAllListsActive })
            )
        )

        // Update local state
        setTaskLists(prevLists =>
          prevLists.map(list => {
            if (list.id === newTask.taskListId) {
              return {
                ...list,
                steps: [...list.steps, newTask].map(step => {
                  const updatedTask = tasksWithNewPositions.find(t => t.id === step.id)
                  return updatedTask || step
                })
              }
            }
            return {
              ...list,
              steps: list.steps.map(step => {
                const updatedTask = tasksWithNewPositions.find(t => t.id === step.id)
                return updatedTask || step
              })
            }
          })
        )

        // Open edit dialog for the new task
        setTaskToEdit(newTask)
        setIsTaskEditDialogOpen(true)

        toast({ title: "Task Created", description: `New task added at position ${position + 1}.` })
      } catch (error: any) {
        console.error("Failed to create task:", error)
        toast({ title: "Error", description: `Failed to create task: ${error.message}`, variant: "destructive" })
      }
    },
    [databaseService, user?.id, taskListService, currentTaskListId, taskLists, settings.defaultDuration, toast],
  )

  const handleTaskQueue30PauseAll = useCallback(() => {
    setIsRunning(false)
    toast({ title: "All Tasks Paused", description: "Timer paused." })
  }, [toast])

  const handleTaskQueue30Undo = useCallback(() => {
    toast({ title: "Undo", description: "Undo functionality coming soon!" })
  }, [toast])

  const handleTaskQueue30Copy = useCallback(
    async (taskId: string) => {
      if (!taskListService) return
      try {
        // Find the task to copy
        const taskToCopy = taskLists
          .flatMap(list => list.steps)
          .find(t => t.id === taskId)

        if (!taskToCopy) {
          toast({ title: "Error", description: "Task not found.", variant: "destructive" })
          return
        }

        // Create a copy with a new ID
        const copiedTask: Step = {
          ...taskToCopy,
          id: crypto.randomUUID(),
          label: `${taskToCopy.label} (Copy)`,
          completed: false,
        }

        // Add to the same list
        await taskListService.addTaskToTaskList(taskToCopy.taskListId, copiedTask)

        // Update local state
        setTaskLists((prevLists) =>
          prevLists.map((list) =>
            list.id === taskToCopy.taskListId
              ? { ...list, steps: [...list.steps, copiedTask] }
              : list
          )
        )

        toast({ title: "Task Copied", description: `"${taskToCopy.label}" was copied successfully.` })
      } catch (error: any) {
        console.error("Failed to copy task:", error)
        toast({ title: "Error", description: `Failed to copy task: ${error.message}`, variant: "destructive" })
      }
    },
    [taskListService, taskLists, toast]
  )

  const activeTaskForDisplay = useMemo(() => {
    if (isOneOffMode) {
      return {
        id: ONE_OFF_TASK_ID,
        label: oneOffTaskLabel,
        duration: 0,
        color: "var(--sapphire-blue)",
        icon: "📝",
        completed: false,
        locked: false,
        history: [],
        breaths: oneOffBreaths,
        priorityLetter: "None",
        priorityRank: 0,
        mantra: "",
        startingRitual: "",
        endingRitual: "",
        position: 0,
        timezone: "",
        taskListId: "one-off-task-list",
        userId: user?.id || "",
      } as Step
    }
    if (currentTask && !currentTask.id) {
      console.error("FocusPage: currentTask exists but is missing an ID. Treating as no current task.", currentTask)
      return undefined
    }
    return currentTask
  }, [isOneOffMode, oneOffTaskLabel, oneOffBreaths, currentTask, user?.id])

  useEffect(() => {
    document.body.style.overscrollBehavior = "none"
    return () => {
      document.body.style.overscrollBehavior = ""
    }
  }, [])

  interface Section {
    id: string
    isVisible: boolean
    component: JSX.Element | null
  }

  const sections: Section[] = [
    {
      id: "rubric",
      isVisible: showRubric,
      component: (
        <LazyRubricSection
          task={activeTaskForDisplay}
          onSaveRubric={handleSaveRubric}
          onClose={() => setShowRubric(false)}
        />
      ),
    },
    {
      id: "breaths",
      isVisible: showBreaths && activeTaskForDisplay?.id,
      component: (
        <Breaths
          currentStepId={activeTaskForDisplay?.id || ""}
          initialBreaths={activeTaskForDisplay?.breaths || []}
          onSaveBreaths={handleSaveBreaths}
          isStepRunning={isRunning}
        />
      ),
    },
    {
      id: "taskForm",
      isVisible: showTaskForm,
      component: (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onAddTask={handleAddTask}
          currentTaskListId={currentTaskListId}
          setIsOneOffMode={setIsOneOffMode}
          isOneOffMode={isOneOffMode}
          setOneOffTaskLabel={setOneOffTaskLabel}
          noTaskListSelectedId={NO_TASK_LIST_SELECTED_ID}
          userId={user?.id || ""}
          taskListService={taskListService}
          databaseService={databaseService}
        />
      ),
    },
    {
      id: "taskList",
      isVisible: showTaskList,
      component: (
        <TaskList
          tasks={currentTaskListId === ALL_ACTIVE_TASKS_ID
            ? taskLists
                .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
                .flatMap((list) => list.steps)
                .filter((step) => !step.completed)
                .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))
            : taskLists.find((list) => list.id === currentTaskListId)?.steps.filter((step) => !step.completed) || []
          }
          currentTaskIndex={currentTask
            ? (currentTaskListId === ALL_ACTIVE_TASKS_ID
                ? taskLists
                    .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
                    .flatMap((list) => list.steps)
                    .filter((step) => !step.completed)
                    .findIndex((t) => t.id === currentTask.id)
                : taskLists.find((list) => list.id === currentTaskListId)?.steps.findIndex((t) => t.id === currentTask.id)) || 0
            : 0
          }
          timeRemaining={timeRemaining}
          updateTask={handleUpdateTask}
          deleteTask={handleDeleteTask}
          reorderTasks={(startIndex, endIndex) => {
            const currentTasks = currentTaskListId === ALL_ACTIVE_TASKS_ID
              ? taskLists
                  .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
                  .flatMap((list) => list.steps)
                  .filter((step) => !step.completed)
              : taskLists.find((list) => list.id === currentTaskListId)?.steps || []
            const reordered = Array.from(currentTasks)
            const [removed] = reordered.splice(startIndex, 1)
            reordered.splice(endIndex, 0, removed)
            setTaskLists((prevLists) =>
              prevLists.map((list) =>
                list.id === currentTaskListId ? { ...list, steps: reordered } : list
              )
            )
          }}
          onReorderAndSave={handleReorderAndSaveTasks}
          setCurrentTaskIndex={() => console.log('setCurrentTaskIndex')}
          autoloopEndIndex={null}
          setAutoloopEndIndex={() => console.log('setAutoloopEndIndex')}
          autoloopEnabled={false}
          toggleTaskCompletion={handleToggleTaskCompletion}
          taskLists={taskLists}
          currentTaskListId={currentTaskListId}
          onTaskListChange={(taskId, newTaskListId) => {
            if (user?.id && databaseService) {
              databaseService.fetchTaskLists(user.id).then(setTaskLists).catch(console.error)
            }
          }}
          currentTask={currentTask}
          onClose={() => setShowTaskList(false)}
          onEditTask={handleEditTask}
          noTaskListSelectedId={NO_TASK_LIST_SELECTED_ID}
          databaseService={databaseService}
          updateTaskLists={setTaskLists}
        />
      ),
    },
    {
      id: "taskListManager",
      isVisible: showTaskListSelector && user?.id,
      component: (
        <LazyTaskListManager
          isOpen={showTaskListSelector}
          onClose={() => setShowTaskListSelector(false)}
          taskLists={taskLists}
          currentListId={currentTaskListId}
          updateTaskLists={setTaskLists}
          switchTaskList={handleSetCurrentTaskListId}
          userId={user?.id || ""}
          noTaskListSelectedId={NO_TASK_LIST_SELECTED_ID}
        />
      ),
    },
    {
      id: "taskEditDialog",
      isVisible: isTaskEditDialogOpen && taskToEdit !== null,
      component: taskToEdit ? (
        <TaskEditDialog
          task={taskToEdit}
          onSave={handleUpdateTask}
          onClose={() => {
            setIsTaskEditDialogOpen(false)
            setTaskToEdit(null)
          }}
          taskLists={taskLists}
          currentTaskListId={currentTaskListId}
          onTaskListChange={(taskId, newTaskListId) => {
            if (user?.id && databaseService) {
              databaseService.fetchTaskLists(user.id).then(setTaskLists).catch(console.error)
            }
          }}
          databaseService={databaseService}
        />
      ) : null,
    },
    {
      id: "worldClockSection",
      isVisible: showWorldClockSection,
      component: (
        <LazyWorldClockSection
          initialTimezone={activeTaskForDisplay?.timezone}
          onSave={handleUpdateCurrentTaskTimezone}
          onClose={() => setShowWorldClockSection(false)}
        />
      ),
    },
    {
      id: "globalTaskOrder",
      isVisible: showGlobalTaskOrder,
      component: (
        <LazyGlobalTaskOrderDisplay
          taskLists={taskLists}
          noTaskListSelectedId={NO_TASK_LIST_SELECTED_ID}
          userId={user?.id || ""}
          databaseService={databaseService}
          updateTaskLists={setTaskLists}
          onClose={() => setShowGlobalTaskOrder(false)}
        />
      ),
    },
    {
      id: "taskQueue30",
      isVisible: showTaskQueue30,
      component: (
        <TaskQueue30
          tasks={
            taskLists
              .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
              .flatMap((list) => list.steps)
              .filter((step) => !step.completed)
              .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))
          }
          currentTaskId={currentTask?.id}
          onTaskClick={handleTaskQueue30Click}
          onTaskDelete={handleDeleteTask}
          onTaskReorder={async (taskId, newPosition) => {
            if (!databaseService || !user?.id) return

            try {
              // Get all tasks in current queue
              const allTasks = taskLists
                .filter((list) => list.id !== NO_TASK_LIST_SELECTED_ID && list.name !== "✅ Completed Tasks")
                .flatMap((list) => list.steps)
                .filter((step) => !step.completed)
                .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))

              // Find the task being moved
              const taskIndex = allTasks.findIndex(t => t.id === taskId)
              if (taskIndex === -1) return

              // Reorder the array
              const reorderedTasks = [...allTasks]
              const [movedTask] = reorderedTasks.splice(taskIndex, 1)
              reorderedTasks.splice(newPosition, 0, movedTask)

              // Update positionWhenAllListsActive for all tasks
              const tasksWithNewPositions = reorderedTasks.map((task, index) => ({
                ...task,
                positionWhenAllListsActive: index + 1
              }))

              // Batch update all tasks in database
              await Promise.all(
                tasksWithNewPositions.map(task =>
                  databaseService.updateStep(task.id, user.id, { positionWhenAllListsActive: task.positionWhenAllListsActive })
                )
              )

              // Update local state
              setTaskLists(prevLists =>
                prevLists.map(list => ({
                  ...list,
                  steps: list.steps.map(step => {
                    const updatedTask = tasksWithNewPositions.find(t => t.id === step.id)
                    return updatedTask || step
                  })
                }))
              )

              toast({ title: "Task Reordered", description: "Queue order saved successfully." })
            } catch (error: any) {
              console.error("Failed to reorder task:", error)
              toast({ title: "Error", description: `Failed to reorder: ${error.message}`, variant: "destructive" })
            }
          }}
          onTaskMoveToBottom={handleTaskQueue30MoveToBottom}
          onTaskMoveToTop={handleTaskQueue30MoveToTop}
          onTaskEdit={handleTaskQueue30Edit}
          onInsertNewTask={handleTaskQueue30InsertNewTask}
          onPauseAll={handleTaskQueue30PauseAll}
          onUndo={handleTaskQueue30Undo}
          onCopyTask={handleTaskQueue30Copy}
          isRunning={isRunning}
          autoloopEnabled={autoloopEnabled}
          autoloopEndIndex={autoloopEndIndex}
          timeRemaining={timeRemaining}
        />
      ),
    },
    {
      id: "todayOverview",
      isVisible: showTodayOverview,
      component: <TodayOverviewWidget />,
    },
  ]

  const activeSections = sections.filter((s) => s.isVisible)

  // Enhanced loading UI
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cream-25"></div>
            <div className="text-xl font-light text-cream-25 text-center">
              {loading ? "Authenticating..." : "Loading focus environment..."}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <FloatingNav settings={settings} onSettingsUpdate={setSettings} />
      <div className="content-wrapper absolute inset-0 flex items-center justify-start z-40 focus-mobile-layout overflow-y-auto">
        <div className="w-full flex flex-col items-center p-4 pt-32 md:pt-48 sm:pt-24">
          <CentralDashboardDisplay
            userProfileName={userProfileName}
            pomodoroTime={pomodoroTime}
            pomodoroRunning={pomodoroRunning}
            pomodoroPhase={pomodoroPhase}
            onTogglePomodoro={handleTogglePomodoro}
            onResetPomodoro={handleResetPomodoro}
            hasTasks={
              currentTaskListId ? taskLists.find((list) => list.id === currentTaskListId)?.steps.length > 0 : false
            }
            dashboardType="focus"
            onDashboardTypeChange={() => console.log('onDashboardTypeChange')}
            timeRemaining={timeRemaining}
            isRunning={isRunning}
            toggleTimer={toggleTimer}
            skipToNextTask={skipToNextTask}
            pushBackTask={pushBackTask}
            darkMode={settings.darkMode}
            completeTask={completeTask}
            toggleTaskLock={toggleTaskLock}
            autoloopEnabled={autoloopEnabled}
            toggleRubricVisibility={() => setShowRubric((prev) => !prev)}
            toggleBreathsVisibility={() => setShowBreaths((prev) => !prev)}
            toggleTaskFormVisibility={() => setShowTaskForm((prev) => !prev)}
            toggleTaskListVisibility={() => setShowTaskList((prev) => !prev)}
            toggleTaskListSelectorVisibility={() => setShowTaskListSelector((prev) => !prev)}
            toggleGlobalTaskOrderVisibility={() => setShowGlobalTaskOrder((prev) => !prev)}
            toggleTaskQueue30Visibility={() => setShowTaskQueue30((prev) => !prev)}
            toggleTodayOverviewVisibility={() => setShowTodayOverview((prev) => !prev)}
            workBreakCycleEnabled={workBreakCycleEnabled}
            onToggleWorkBreakCycle={() => setWorkBreakCycleEnabled((prev) => !prev)}
            cycleWorkDuration={cycleWorkDuration}
            cycleBreakDuration={cycleBreakDuration}
            onUpdateCycleDurations={(work, breakDuration) => {
              setCycleWorkDuration(work)
              setCycleBreakDuration(breakDuration)
            }}
            isOneOffMode={isOneOffMode}
            onOneOffTaskChange={handleOneOffTaskChange}
            currentTask={activeTaskForDisplay}
            oneOffTaskLabel={oneOffTaskLabel}
            totalSessionDuration={totalSessionDuration}
            onSwitchPhase={handleSwitchPhase}
            onExploreVisionBoardClick={() => router.push("/vision")}
            onOpenDashboardMenu={() => console.log('onOpenDashboardMenu')}
            onUpdateCurrentTaskTimezone={handleUpdateCurrentTaskTimezone}
            toggleWorldClockSectionVisibility={() => setShowWorldClockSection((prev) => !prev)}
          />

          {activeSections.map((section) => (
            <div key={section.id} className="mt-8 mx-auto relative z-10 w-full max-w-4xl px-4">
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cream-25"></div>
                </div>
              }>
                {section.component}
              </Suspense>
            </div>
          ))}
          <div className="h-[500px] w-full"></div>
        </div>
      </div>
    </>
  )
}