"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { CentralDashboardDisplay } from "@/components/central-dashboard-display"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { TaskEditDialog } from "@/components/task-edit-dialog"
import { TaskListManager } from "@/components/task-list-manager"
import { GlobalTaskOrderDisplay } from "@/components/global-task-order-display"
import Breaths from "@/components/breaths"
import { RubricSection } from "@/components/rubric-section"
import { WorldClockSection } from "@/components/world-clock-section"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { Step, TaskList as TTaskList, Breath, RubricData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { TaskListService } from "@/lib/task-list-service"
import { DatabaseService } from "@/lib/database-service"
import { Header } from "@/components/header"
import { DashboardMenu } from "@/components/dashboard-menu"
import { calculateTaskTimes } from "@/lib/time-calculation"

type AppSettings = {
  soundEnabled: boolean
  darkMode: boolean
  defaultDuration: number
  autoLoop: boolean
  focusMode: boolean
  showWeather: boolean
  showGreeting: boolean
  showMantra: boolean
  showSteps: boolean
  showQuotes: boolean
  background: string
  sound: string
}

const NO_TASK_LIST_SELECTED_ID = "no-list-selected"
const ONE_OFF_TASK_ID = "one-off-task-id"
const ALL_ACTIVE_TASKS_ID = "all-active-tasks"

export default function FocusPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60 * 1000)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "break">("work")
  const [timeRemaining, setTimeRemaining] = useState(pomodoroTime)
  const [isRunning, setIsRunning] = useState(false)
  const [totalSessionDuration, setTotalSessionDuration] = useState(pomodoroTime)
  const [autoloopEnabled, setAutoloopEnabled] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [showRubric, setShowRubric] = useState(false)
  const [showBreaths, setShowBreaths] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTaskList, setShowTaskList] = useState(false)
  const [showTaskListSelector, setShowTaskListSelector] = useState(false)
  const [showWorldClockSection, setShowWorldClockSection] = useState(false)
  const [showGlobalTaskOrder, setShowGlobalTaskOrder] = useState(false)

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
    soundEnabled: true,
    darkMode: false,
    defaultDuration: 25 * 60 * 1000,
    autoLoop: false,
    focusMode: false,
    showWeather: false,
    showGreeting: true,
    showMantra: false,
    showSteps: true,
    showQuotes: false,
    background: "default",
    sound: "default",
    showHabitsMenu: true,
  })

  const hasFetchedInitialData = useRef(false)
  const [taskListService, setTaskListService] = useState<TaskListService | null>(null)
  const [databaseService, setDatabaseService] = useState<DatabaseService | null>(null)

  const timeRemainingRef = useRef(timeRemaining)
  useEffect(() => {
    timeRemainingRef.current = timeRemaining
  }, [timeRemaining])

  useEffect(() => {
    if (user) {
      const dbService = new DatabaseService()
      setDatabaseService(dbService)
      setTaskListService(new TaskListService(user.id, dbService))
    } else {
      setDatabaseService(null)
      setTaskListService(null)
    }
  }, [user])

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
  }, [currentTaskListId, currentTask, isRunning, pomodoroTime])

  const handleSetCurrentTaskListId = useCallback(
    (newListId: string) => {
      console.log("Switching to list:", newListId)
      setCurrentTaskListId(newListId)

      const newCurrentTask = getTopMostTask(taskLists, newListId, NO_TASK_LIST_SELECTED_ID)
      const newTime = newCurrentTask?.duration || settings.defaultDuration

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

  useEffect(() => {
    const fetchData = async () => {
      if (user && databaseService && taskListService && !hasFetchedInitialData.current) {
        hasFetchedInitialData.current = true

        let profileName = user.email?.split("@")[0] || "User"
        try {
          const profile = await databaseService.createOrUpdateUserProfile(user.id, profileName)
          if (profile?.name) {
            profileName = profile.name
          }
          setUserProfileName(profileName)
        } catch (error) {
          console.error("Failed to create or fetch user profile:", error)
          setUserProfileName(profileName)
          toast({ title: "Error", description: "Failed to load user profile.", variant: "destructive" })
        }

        try {
          const fetchedLists = await databaseService.fetchTaskLists(user.id)
          setTaskLists(fetchedLists)

          if (fetchedLists.length > 0) {
            const initialListId = fetchedLists.find((list) => list.id === ALL_ACTIVE_TASKS_ID)?.id || fetchedLists[0].id
            setCurrentTaskListId(initialListId)

            const initialTask = getTopMostTask(fetchedLists, initialListId, NO_TASK_LIST_SELECTED_ID)
            const initialTime = initialTask?.duration || settings.defaultDuration

            setCurrentTask(initialTask)
            setTimeRemaining(initialTime)
            setTotalSessionDuration(initialTime)

            toast({ title: "Welcome!", description: `Viewing "${fetchedLists.find((list) => list.id === initialListId)?.name || "All Active Tasks"}".` })
          } else {
            const defaultList = await databaseService.createTaskList(user.id, "My First List", 0)
            setTaskLists([defaultList])

            setCurrentTaskListId(defaultList.id)
            setCurrentTask(undefined)
            setTimeRemaining(settings.defaultDuration)
            setTotalSessionDuration(settings.defaultDuration)

            toast({ title: "Welcome!", description: "A default task list has been created for you." })
          }
        } catch (error) {
          console.error("Failed to fetch task lists:", error)
          toast({ title: "Error", description: "Failed to load task lists.", variant: "destructive" })
          setCurrentTaskListId(NO_TASK_LIST_SELECTED_ID)
          setCurrentTask(undefined)
          setTimeRemaining(settings.defaultDuration)
          setTotalSessionDuration(settings.defaultDuration)
        }
      }
    }

    fetchData()
  }, [user, databaseService, taskListService, toast, settings.defaultDuration])

  useEffect(() => {
    calculateAndSetEstimatedTimes()
  }, [currentTaskListId, currentTask, isRunning, timeRemaining, calculateAndSetEstimatedTimes])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1000
          return newTime
        })
      }, 1000)
    } else if (timeRemaining <= 0 && isRunning) {
      setIsRunning(false)
      if (interval) clearInterval(interval)
      toast({
        title: "Time's Up!",
        description: `Your ${pomodoroPhase} session has ended.`,
      })
      if (autoloopEnabled) {
        const nextPhase = pomodoroPhase === "work" ? "break" : "work"
        handleSwitchPhase(nextPhase)
      }
      calculateAndSetEstimatedTimes()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, pomodoroPhase, autoloopEnabled, toast, calculateAndSetEstimatedTimes])

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => {
      const newIsRunning = !prev
      calculateAndSetEstimatedTimes()
      return newIsRunning
    })
  }, [calculateAndSetEstimatedTimes])

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
      const startTime = new Date(now.getTime() - (currentTask.duration || 0))
      const updatedHistory = [
        ...(currentTask.history || []),
        {
          startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
          endTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
        },
      ]

      const completedTask = { ...currentTask, completed: true, history: updatedHistory }
      await taskListService.updateTaskInTaskList(currentTaskListId, completedTask)

      await taskListService.deleteTaskFromTaskList(currentTaskListId, currentTask.id)
      setTaskLists((prevLists) => {
        return prevLists.map((list) =>
          list.id === currentTaskListId ? { ...list, steps: list.steps.filter((t) => t.id !== currentTask.id) } : list,
        )
      })
      toast({
        title: "Task Completed!",
        description: `"${currentTask.label}" was completed.`,
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
          const newTime = newCurrentTask?.duration || settings.defaultDuration
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
        <RubricSection
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
          setCurrentTaskIndex={() => {}}
          autoloopEndIndex={null}
          setAutoloopEndIndex={() => {}}
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
        <TaskListManager
          isOpen={showTaskListSelector}
          onClose={() => setMenuOpen(false)}
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
        <WorldClockSection
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
        <GlobalTaskOrderDisplay
          taskLists={taskLists}
          noTaskListSelectedId={NO_TASK_LIST_SELECTED_ID}
          userId={user?.id || ""}
          databaseService={databaseService}
          updateTaskLists={setTaskLists}
          onClose={() => setShowGlobalTaskOrder(false)}
        />
      ),
    },
  ]

  const activeSections = sections.filter((s) => s.isVisible)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-cream-25">
        Loading...
      </div>
    )
  }

  return (
    <>
      <div className="content-wrapper flex flex-col">
        <Header isMenuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="flex-1 flex flex-col items-center p-4 relative z-10 mt-16">
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
            onDashboardTypeChange={() => {}}
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
            isOneOffMode={isOneOffMode}
            onOneOffTaskChange={handleOneOffTaskChange}
            currentTask={activeTaskForDisplay}
            oneOffTaskLabel={oneOffTaskLabel}
            totalSessionDuration={totalSessionDuration}
            onSwitchPhase={handleSwitchPhase}
            onExploreVisionBoardClick={() => router.push("/vision")}
            onOpenDashboardMenu={() => {}}
            onUpdateCurrentTaskTimezone={handleUpdateCurrentTaskTimezone}
            toggleWorldClockSectionVisibility={() => setShowWorldClockSection((prev) => !prev)}
          />

          {activeSections.map((section) => (
            <div key={section.id} className="mt-8 mx-auto relative z-10 w-full max-w-4xl px-4">
              {section.component}
            </div>
          ))}
          <div className="h-[500px] w-full"></div>
        </main>
        <DashboardMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          settings={settings}
          updateSettings={setSettings}
          openSettings={() => {}}
          openTaskListManager={() => setShowTaskListSelector(true)}
          openVisionBoard={() => router.push("/vision")}
          handleSignOut={async () => {
            if (user && databaseService) {
              await databaseService.signOut()
              router.push("/")
            }
          }}
          currentUser={user}
          userProfileName={userProfileName}
        />
      </div>
    </>
  )
}