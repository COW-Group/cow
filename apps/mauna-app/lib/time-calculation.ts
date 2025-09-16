import type { Step } from "@/lib/types"

/**
 * Formats a Date object into HH:MM string.
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
}

/**
 * Calculates estimated start and end times for a list of tasks.
 *
 * @param tasks The array of tasks (Steps).
 * @param currentTaskIndex The index of the currently active task.
 * @param currentTimeRemaining The remaining duration of the current task in milliseconds.
 * @param isTimerRunning Boolean indicating if the timer is currently active.
 * @returns A new array of tasks with updated estimatedStartTime and estimatedEndTime.
 */
export function calculateTaskTimes(
  tasks: Step[],
  currentTaskIndex: number,
  currentTimeRemaining: number, // Remaining time for the current task in milliseconds
  isTimerRunning: boolean,
): Step[] {
  const now = new Date()
  let currentEstimatedTime = now.getTime() // Start with current time in milliseconds

  return tasks.map((task, index) => {
    const updatedTask = { ...task }

    if (index < currentTaskIndex) {
      // Tasks before the current one are considered completed or in the past
      // Their estimated times should reflect their actual completion if available, or be cleared
      updatedTask.estimatedStartTime = undefined
      updatedTask.estimatedEndTime = undefined
    } else if (index === currentTaskIndex) {
      // This is the current task
      updatedTask.estimatedStartTime = formatTime(now)
      const currentTaskDuration = isTimerRunning ? currentTimeRemaining : task.duration || 0
      updatedTask.estimatedEndTime = formatTime(new Date(now.getTime() + currentTaskDuration))
      currentEstimatedTime = now.getTime() + currentTaskDuration
    } else {
      // Tasks after the current one
      updatedTask.estimatedStartTime = formatTime(new Date(currentEstimatedTime))
      currentEstimatedTime += task.duration || 0 // Add task's duration
      updatedTask.estimatedEndTime = formatTime(new Date(currentEstimatedTime))
    }
    return updatedTask
  })
}

/**
 * Formats a duration in milliseconds into a human-readable string (e.g., "1h 25m 30s").
 * @param ms The duration in milliseconds.
 * @returns A formatted string.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  // Only show seconds if there are no hours or minutes, or if it's the only non-zero part
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`)
  }
  return parts.join(" ")
}
