"use client"

import { useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ListTodo, Edit, Trash2, GripVertical, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useAuth } from "@/hooks/use-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step, TaskList as TTaskList } from "@/lib/types"

interface TaskListProps {
  tasks: Step[]
  currentTaskIndex: number
  timeRemaining: number
  updateTask: (task: Step) => void
  deleteTask: (taskId: string) => void
  reorderTasks: (startIndex: number, endIndex: number) => void
  onReorderAndSave: (reorderedTasks: Step[]) => Promise<void>
  setCurrentTaskIndex: (index: number) => void
  autoloopEndIndex: number | null
  setAutoloopEndIndex: (index: number | null) => void
  autoloopEnabled: boolean
  toggleTaskCompletion: (taskId: string, newCompletedStatus: boolean) => void
  taskLists: TTaskList[]
  currentTaskListId: string
  onTaskListChange: (taskId: string, newTaskListId: string) => void
  currentTask: Step | undefined
  onClose: () => void
  onEditTask: (task: Step) => void
  noTaskListSelectedId: string
  databaseService?: DatabaseService | null
  updateTaskLists: (taskLists: TTaskList[]) => void
}

interface SortableTaskItemProps {
  task: Step
  onToggleCompletion: (taskId: string, newCompletedStatus: boolean) => void
  onEditTask: (task: Step) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, newTaskListId: string | null) => void
  taskLists: TTaskList[]
  currentTaskListId: string
  isCurrentTask: boolean
  timeRemaining: number
  estimatedTime: string
  estimatedEndTime: string
}

const ALL_ACTIVE_TASKS_ID = "all-active-tasks"
const NO_TASK_LIST_SELECTED_ID = "no-list-selected"

const SortableTaskItem = memo(({
  task,
  onToggleCompletion,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  taskLists,
  currentTaskListId,
  isCurrentTask,
  timeRemaining,
  estimatedTime,
  estimatedEndTime,
}: SortableTaskItemProps) => {
  console.log("[SortableTaskItem] Rendering for task:", { taskId: task.id, label: task.label, isCurrentTask })

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const { toast } = useToast()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteClick = () => {
    console.log(`[SortableTaskItem] Delete button clicked for task: id=${task.id}, label=${task.label}, taskListId=${task.taskListId}`)
    if (confirm(`Are you sure you want to delete the task "${task.label}"?`)) {
      onDeleteTask(task.id)
      toast({
        title: "Task Deletion Initiated",
        description: `Attempting to delete "${task.label}".`,
      })
    }
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-3 p-4 bg-white/20 border border-white/10 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/30 ${
        isCurrentTask ? "border-sapphire-blue shadow-lg" : "border-brushed-silver/20"
      } ${task.completed ? "opacity-70" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <GripVertical {...listeners} {...attributes} className="h-6 w-6 text-cream-25/70 cursor-grab" />
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id, !task.completed)}
            className="h-6 w-6 border-cream-25 data-[state=checked]:bg-sapphire-blue data-[state=checked]:text-cream-25"
          />
          <Label
            htmlFor={`task-${task.id}`}
            className={`text-lg flex-1 text-cream-25 ${task.completed ? "line-through text-cream-25/50" : ""}`}
          >
            {task.label}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-cream-25/70 hover:text-cream-25"
            onClick={() => onEditTask(task)}
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="text-base text-cream-25/70 space-y-2 ml-9">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="font-medium text-cream-25">Duration:</span>{" "}
            <span className="font-semibold text-sapphire-blue">{formatTime(task.duration || 0)}</span>
          </div>
          <div>
            <span className="font-medium text-cream-25">Est. Time:</span>{" "}
            <span className="font-semibold text-sapphire-blue">{estimatedTime}</span>
          </div>
          <div>
            <span className="font-medium text-cream-25">Est. End:</span>{" "}
            <span className="font-semibold text-sapphire-blue">{estimatedEndTime}</span>
          </div>
          <div>
            <span className="font-medium text-cream-25">Priority:</span>{" "}
            <span className="font-semibold text-sapphire-blue">
              {task.priorityLetter}
              {currentTaskListId === ALL_ACTIVE_TASKS_ID ? task.positionWhenAllListsActive : task.position}
            </span>
          </div>
        </div>

        {/* Habit Group Progress (Breaths) */}
        {task.breaths && task.breaths.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-white/10 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-cream-25 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Subtasks:
              </span>
              <span className="font-semibold text-sapphire-blue">
                {task.breaths.filter(b => b.completed).length}/{task.breaths.length} completed
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sapphire-blue to-cyan-400 transition-all duration-300"
                style={{
                  width: `${(task.breaths.filter(b => b.completed).length / task.breaths.length) * 100}%`
                }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span className="font-medium text-cream-25">Move to:</span>
          <Select
            onValueChange={(newListId) => onMoveTask(task.id, newListId === NO_TASK_LIST_SELECTED_ID ? null : newListId)}
            value={task.taskListId || NO_TASK_LIST_SELECTED_ID}
          >
            <SelectTrigger className="w-[220px] h-9 text-base bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0">
              <SelectValue placeholder="Select list" />
            </SelectTrigger>
            <SelectContent className="bg-ink-950 border-brushed-silver/30 text-cream-25 text-base">
              <SelectItem value={NO_TASK_LIST_SELECTED_ID} className="hover:bg-sapphire-blue/20 text-base">
                No List
              </SelectItem>
              {taskLists
                .filter((list) => list.id !== ALL_ACTIVE_TASKS_ID && list.id !== NO_TASK_LIST_SELECTED_ID)
                .map((list) => (
                  <SelectItem key={list.id} value={list.id} className="hover:bg-sapphire-blue/20 text-base">
                    {list.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
})

export function TaskList({
  tasks,
  currentTaskIndex,
  timeRemaining,
  updateTask,
  deleteTask,
  reorderTasks,
  onReorderAndSave,
  setCurrentTaskIndex,
  autoloopEndIndex,
  setAutoloopEndIndex,
  autoloopEnabled,
  toggleTaskCompletion,
  taskLists,
  currentTaskListId,
  onTaskListChange,
  currentTask,
  onClose,
  onEditTask,
  noTaskListSelectedId,
  databaseService,
  updateTaskLists,
}: TaskListProps) {
  console.log("[TaskList] Rendering, isServer:", typeof window === "undefined")
  console.log("[TaskList] Props:", {
    tasks: tasks.map((t) => ({ id: t.id, label: t.label })),
    currentTaskIndex,
    timeRemaining,
    currentTaskListId,
    currentTask: currentTask ? { id: currentTask.id, label: currentTask.label } : undefined,
    noTaskListSelectedId,
    databaseService: !!databaseService,
  })

  const { user } = useAuth()
  const userId = user?.id || ""
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const displayedTasks = currentTaskListId === ALL_ACTIVE_TASKS_ID
    ? taskLists
        .filter(
          (list) =>
            list.id !== noTaskListSelectedId &&
            list.name !== "✅ Completed Tasks"
        )
        .flatMap((list) => list.steps)
        .filter((step) => !step.completed)
        .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))
        .map((task, index) => {
          console.log(`[TaskList] displayedTasks task ${index + 1}:`, {
            id: task.id,
            label: task.label,
            positionWhenAllListsActive: task.positionWhenAllListsActive,
            taskListId: task.taskListId,
          })
          return task
        })
    : tasks.filter((step) => !step.completed)

  // Calculate estimated times for ALL_ACTIVE_TASKS_ID mode
  const calculatedTasks = currentTaskListId === ALL_ACTIVE_TASKS_ID
    ? displayedTasks.map((task, index) => {
        const now = new Date()
        let startTime = now.getTime()
        
        // Sum durations of previous tasks
        for (let i = 0; i < index; i++) {
          startTime += displayedTasks[i].duration || 0
        }

        const endTime = startTime + (task.duration || 0)
        const estimatedStartTime = new Date(startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        const estimatedEndTime = new Date(endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })

        return {
          ...task,
          estimatedStartTime,
          estimatedEndTime,
        }
      })
    : displayedTasks

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = displayedTasks.findIndex((task) => task.id === active.id)
        const newIndex = displayedTasks.findIndex((task) => task.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = Array.from(displayedTasks)
          const [movedTask] = reordered.splice(oldIndex, 1)
          reordered.splice(newIndex, 0, movedTask)

          if (currentTaskListId === ALL_ACTIVE_TASKS_ID) {
            // Update positionWhenAllListsActive for all tasks
            const tasksWithNewRanks = reordered.map((task, index) => ({
              ...task,
              positionWhenAllListsActive: index + 1,
            }))

            reorderTasks(oldIndex, newIndex)
            try {
              await databaseService?.reorderStepsAllActive(userId, tasksWithNewRanks)
              // Refetch task lists to update state
              const updatedTaskLists = await databaseService?.fetchTaskLists(userId)
              if (updatedTaskLists) {
                updateTaskLists(updatedTaskLists)
                console.log("Refetched task lists:", updatedTaskLists.map(list => ({
                  id: list.id,
                  name: list.name,
                  steps: list.steps.map(step => ({
                    id: step.id,
                    label: step.label,
                    positionWhenAllListsActive: step.positionWhenAllListsActive,
                  })),
                })))
              }
              toast({ title: "Tasks Reordered", description: "Task order saved for All Active Tasks." })
            } catch (error: any) {
              console.error("Error reordering steps for all active tasks:", error)
              toast({
                title: "Error",
                description: `Failed to reorder tasks: ${error.message}`,
                variant: "destructive",
              })
            }
          } else {
            // Update position for tasks within a single list
            const tasksWithNewPositions = reordered.map((task, index) => ({
              ...task,
              position: index,
            }))

            reorderTasks(oldIndex, newIndex)
            try {
              await onReorderAndSave(tasksWithNewPositions)
              toast({ title: "Tasks Reordered", description: "Task order saved." })
            } catch (error: any) {
              console.error("Error reordering steps:", error)
              toast({
                title: "Error",
                description: `Failed to reorder tasks: ${error.message}`,
                variant: "destructive",
              })
            }
          }
        }
      }
    },
    [displayedTasks, currentTaskListId, reorderTasks, onReorderAndSave, databaseService, userId, toast, updateTaskLists],
  )

  const handleMoveTaskToList = useCallback(
    async (taskId: string, newTaskListId: string | null) => {
      if (!userId || !databaseService) {
        toast({
          title: "Error",
          description: "Missing required data to move task.",
          variant: "destructive",
        })
        return
      }
      if (newTaskListId === ALL_ACTIVE_TASKS_ID) {
        toast({
          title: "Error",
          description: "Cannot move tasks to All Active Tasks view.",
          variant: "destructive",
        })
        return
      }

      try {
        const taskToMove = displayedTasks.find((t) => t.id === taskId)
        if (!taskToMove) {
          toast({ title: "Error", description: "Task not found.", variant: "destructive" })
          return
        }

        console.log(`[handleMoveTaskToList] Moving task: id=${taskId}, label=${taskToMove.label}, from taskListId=${taskToMove.taskListId} to newTaskListId=${newTaskListId || 'NULL'}`)

        await databaseService.updateStep(taskId, userId, {
          taskListId: newTaskListId,
        })

        onTaskListChange(taskId, newTaskListId || NO_TASK_LIST_SELECTED_ID)
        const updatedTaskLists = await databaseService.fetchTaskLists(userId)
        if (updatedTaskLists) {
          updateTaskLists(updatedTaskLists)
          console.log(`[handleMoveTaskToList] Task lists refetched after move:`, updatedTaskLists.map(list => ({
            id: list.id,
            name: list.name,
            steps: list.steps.map(step => ({ id: step.id, label: step.label })),
          })))
        }
        toast({ 
          title: "Task Moved", 
          description: newTaskListId ? `Task moved to "${taskLists.find(list => list.id === newTaskListId)?.name}".` : `Task moved to No List.` 
        })
      } catch (error: any) {
        console.error(`[handleMoveTaskToList] Error moving task ${taskId}:`, error)
        toast({ title: "Error", description: `Failed to move task: ${error.message}`, variant: "destructive" })
      }
    },
    [userId, displayedTasks, currentTaskListId, onTaskListChange, toast, databaseService, updateTaskLists, taskLists]
  )

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-ink-950/20 border border-brushed-silver/20 text-cream-25 font-barlow">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl flex items-center gap-3 text-cream-25">
          <ListTodo className="h-7 w-7 text-sapphire-blue" />
          {currentTaskListId === ALL_ACTIVE_TASKS_ID ? "All Active Tasks" : "Task List"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-cream-25/70 hover:text-cream-25">
          <ChevronUp className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent>
        {currentTaskListId === noTaskListSelectedId ? (
          <p className="text-lg text-cream-25/80 text-center py-6">
            No task list selected. Please select or create one.
          </p>
        ) : displayedTasks.length === 0 ? (
          <p className="text-lg text-cream-25/80 text-center py-6">No tasks yet. Add one to get started!</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={displayedTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4 max-h-[1500px] overflow-y-auto pr-3">
                {calculatedTasks.map((task, index) => {
                  const isCurrent = currentTask?.id === task.id
                  const estimatedTime = task.estimatedStartTime || "N/A"
                  const estimatedEndTime = task.estimatedEndTime || "N/A"

                  return (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      onToggleCompletion={toggleTaskCompletion}
                      onEditTask={onEditTask}
                      onDeleteTask={deleteTask}
                      onMoveTask={handleMoveTaskToList}
                      taskLists={taskLists}
                      currentTaskListId={currentTaskListId}
                      isCurrentTask={isCurrent}
                      timeRemaining={timeRemaining}
                      estimatedTime={estimatedTime}
                      estimatedEndTime={estimatedEndTime}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}