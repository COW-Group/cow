import { supabase } from "./supabase"
import type { Step, TaskList, Length } from "@/lib/types"
import type { DatabaseService } from "@/lib/database-service"

export class TaskListService {
  private userId: string
  private databaseService: DatabaseService

  constructor(userId: string, databaseService: DatabaseService) {
    this.userId = userId
    this.databaseService = databaseService
  }

  async getTaskLists(): Promise<TaskList[]> {
    try {
      return await this.databaseService.fetchTaskLists(this.userId)
    } catch (error) {
      console.error("Error fetching task lists in TaskListService:", error)
      return []
    }
  }

  async getLengths(): Promise<Length[]> {
    try {
      return await this.databaseService.fetchLengths(this.userId)
    } catch (error) {
      console.error("Error fetching lengths in TaskListService:", error)
      return []
    }
  }

  async addTaskToTaskList(
    taskListId: string,
    stepData: Omit<Step, "id" | "userId" | "taskListId" | "completed" | "history" | "position" | "lengthId">,
  ): Promise<Step> {
    const { data: currentSteps, error: fetchError } = await supabase
      .from("steps")
      .select("position")
      .eq("task_list_id", taskListId)
      .order("position", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error("Error fetching current steps for position:", fetchError)
      throw new Error(fetchError.message)
    }

    const newPosition = currentSteps && currentSteps.length > 0 ? currentSteps[0].position + 1 : 0

    const newTask = await this.databaseService.createStep(this.userId, stepData.label, newPosition, {
      taskListId: taskListId,
      lengthId: null,
    })

    const updatedTask = await this.databaseService.updateStep(newTask.id, this.userId, {
      duration: stepData.duration,
      locked: stepData.locked,
      color: stepData.color,
      icon: stepData.icon,
      priorityLetter: stepData.priorityLetter,
      priorityRank: stepData.priorityRank,
      mantra: stepData.mantra,
      startingRitual: stepData.startingRitual,
      endingRitual: stepData.endingRitual,
      audioUrl: stepData.backgroundAudioLink,
      audioType: stepData.backgroundAudioSource,
    })

    return updatedTask
  }

  async updateTaskInTaskList(taskListId: string, step: Step): Promise<Step> {
    const updatedStep = await this.databaseService.updateStep(step.id, this.userId, {
      label: step.label,
      duration: step.duration,
      completed: step.completed,
      locked: step.locked,
      icon: step.icon,
      priorityLetter: step.priorityLetter,
      priorityRank: step.priorityRank,
      history: step.history,
      mantra: step.mantra,
      startingRitual: step.startingRitual,
      endingRitual: step.endingRitual,
      audioType: step.audioType,
      audioUrl: step.audioUrl,
      color: step.color,
      position: step.position,
      timezone: step.timezone,
      taskListId: step.taskListId,
      lengthId: step.lengthId,
    })
    return updatedStep
  }

  async deleteTaskFromTaskList(taskListId: string, stepId: string): Promise<void> {
    await this.databaseService.deleteStep(stepId, this.userId)
  }

  async reorderTasksInTaskList(taskListId: string, reorderedSteps: Step[]): Promise<void> {
    await this.databaseService.reorderSteps(this.userId, reorderedSteps)
  }

  async fetchStepsForTaskList(taskListId: string): Promise<Step[]> {
    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .eq("task_list_id", taskListId)
      .eq("user_id", this.userId)
      .order("position", { ascending: true })

    if (error) {
      console.error("Error fetching steps for task list:", error)
      throw new Error(error.message)
    }
    return data as Step[]
  }
}