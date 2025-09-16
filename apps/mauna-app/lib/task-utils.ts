import type { TaskListService } from "./task-list-service"
import type { Step } from "./types"

export async function toggleTaskCompletion(
  taskListService: TaskListService,
  currentTaskListId: string,
  taskId: string,
  newCompletedStatus: boolean,
  updateTask: (updatedTask: Step) => void, // Callback to update local state
) {
  try {
    const updatedTask = await taskListService.updateTaskInTaskList(currentTaskListId, taskId, {
      completed: newCompletedStatus,
    })
    if (updatedTask) {
      updateTask(updatedTask) // Update the task in the parent component's state
    }
  } catch (error: any) {
    console.error("Failed to toggle task completion:", error)
    throw new Error(`Failed to toggle task completion: ${error.message}`)
  }
}
