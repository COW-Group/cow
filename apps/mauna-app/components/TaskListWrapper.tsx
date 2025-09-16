"use client"

import { TaskList } from "@/components/task-list"
import type { Step, TaskList as TTaskList } from "@/lib/types"
import { DatabaseService } from "@/lib/database-service"

interface TaskListWrapperProps {
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
  databaseService: DatabaseService | null
}

export function TaskListWrapper({
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
}: TaskListWrapperProps) {
  console.log("[TaskListWrapper] Rendering, isServer:", typeof window === "undefined")
  console.log("[TaskListWrapper] Props:", {
    tasks: tasks.map((t) => ({ id: t.id, label: t.label })),
    currentTaskIndex,
    timeRemaining,
    currentTaskListId,
    currentTask: currentTask ? { id: currentTask.id, label: currentTask.label } : undefined,
  })

  return (
    <TaskList
      tasks={tasks}
      currentTaskIndex={currentTaskIndex}
      timeRemaining={timeRemaining}
      updateTask={updateTask}
      deleteTask={deleteTask}
      reorderTasks={reorderTasks}
      onReorderAndSave={onReorderAndSave}
      setCurrentTaskIndex={setCurrentTaskIndex}
      autoloopEndIndex={autoloopEndIndex}
      setAutoloopEndIndex={setAutoloopEndIndex}
      autoloopEnabled={autoloopEnabled}
      toggleTaskCompletion={toggleTaskCompletion}
      taskLists={taskLists}
      currentTaskListId={currentTaskListId}
      onTaskListChange={onTaskListChange}
      currentTask={currentTask}
      onClose={onClose}
      onEditTask={onEditTask}
      noTaskListSelectedId={noTaskListSelectedId}
      databaseService={databaseService}
    />
  )
}