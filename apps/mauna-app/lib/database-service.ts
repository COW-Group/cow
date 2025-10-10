// lib/database-service.ts
import { createClient } from "@supabase/supabase-js"
import type {
  UserProfile,
  TaskList,
  Range,
  Mountain,
  Hill,
  Terrain,
  Length,
  Step,
  Breath,
  JournalEntry,
  Emotion,
  Project,
  ProjectArea,
  ProjectTask,
  Vehicle,
  Goal,
  Company,
  Team,
} from "@/lib/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export interface ResetPeriod {
  id: string
  user_id: string
  range_id: string
  start_date: string
  end_date: string
  discover: string
  define: string
  ideate: string
  prototype: string
  test: string
  created_at: string
  updated_at: string
}

export interface ArchivedItem {
  id: string
  user_id: string
  range_id: string
  item_id: string
  item_name: string
  item_type: "Mountain" | "Hill" | "Terrain" | "Length" | "Step"
  completed_at: string
}

export interface DailyPlan {
  id: string
  user_id: string
  date: string
  goals: { id: string; type: string; name: string }[]
  typedGoals: { id: string; type: string; typedName: string }[]
  quote: string
  targets: { stepId: string; goalId: string; taskListId?: string }[]
  successes: string[]
  reviewTypedGoals: { id: string; type: string; typedName: string }[]
  taskListIds: { goalId: string; taskListId: string }[] // Add this
  created_at: string
  updated_at: string
}

export class DatabaseService {
  supabase = supabase

  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, preferred_name, email, avatar_url, created_at")
      .eq("id", userId)
      .single()
    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
    if (!data) {
      return null
    }
    return {
      id: data.id,
      name: data.preferred_name || "Unknown User",
      email: data.email || "N/A",
      avatar_url: data.avatar_url || undefined,
      created_at: data.created_at,
    } as UserProfile
  }

  async createOrUpdateUserProfile(userId: string, preferredName: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .upsert({ id: userId, preferred_name: preferredName, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating or updating user profile:", error)
      throw new Error(error.message)
    }
    return data as UserProfile
  }

  async fetchUsers(query: string): Promise<UserProfile[]> {
    if (!query) return []
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, preferred_name, email, avatar_url, created_at")
      .ilike("preferred_name", `%${query}%`)
      .limit(10)
    if (error) {
      console.error("Error searching users:", error)
      return []
    }
    return data.map((profile) => ({
      id: profile.id,
      name: profile.preferred_name || "Unknown User",
      email: profile.email || "N/A",
      avatar_url: profile.avatar_url || undefined,
      created_at: profile.created_at,
    })) as UserProfile[]
  }

  async fetchTaskLists(userId: string): Promise<TaskList[]> {
    const { data, error } = await this.supabase
      .from("task_lists")
      .select("*, steps(*, breaths(*))")
      .eq("user_id", userId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .order("position", { foreignTable: "steps", ascending: true })
      .order("created_at", { foreignTable: "steps.breaths", ascending: true })
    if (error) {
      console.error("Error fetching task lists:", error)
      throw new Error(error.message)
    }
    data.forEach((list) => {
      console.log(`Raw steps data for task list ${list.id}:`, list.steps?.map(step => ({
        id: step.id,
        label: step.label,
        position_when_all_lists_active: step.position_when_all_lists_active,
      })))
    })
    return data.map((list) => ({
      id: list.id,
      name: list.name,
      userId: list.user_id,
      createdAt: list.created_at,
      position: list.position ?? 0,
      suggestedTimeBlockRange: list.suggested_time_block_range,
      steps:
        list.steps
          ?.filter((step) => step.task_list_id === list.id)
          .map((step: any) => {
            if (!step.id) {
              console.warn("DatabaseService: Fetched step is missing an ID:", step)
            }
            return {
              id: step.id,
              label: step.label,
              duration: step.duration,
              completed: step.completed,
              locked: step.locked,
              taskListId: step.task_list_id,
              lengthId: step.length_id,
              icon: step.icon,
              priorityLetter: step.priority_letter,
              priorityRank: step.priority_rank,
              positionWhenAllListsActive: step.position_when_all_lists_active,
              estimatedStartTime: step.estimated_start_time,
              estimatedEndTime: step.estimated_end_time,
              history: step.history,
              mantra: step.mantra,
              startingRitual: step.starting_ritual,
              endingRitual: step.ending_ritual,
              audioUrl: step.audio_url,
              audioType: step.audio_type,
              position: step.position,
              timezone: step.timezone,
              tag: step.tag || null,
              breaths:
                step.breaths?.map((breath: any) => {
                  if (!breath.id) {
                    console.warn("DatabaseService: Fetched breath is missing an ID:", breath)
                  }
                  return {
                    id: breath.id,
                    name: breath.name,
                    completed: breath.completed,
                    isRunning: breath.is_running,
                    startTime: breath.start_time,
                    endTime: breath.end_time,
                    pausedTime: breath.paused_time,
                    totalTimeSeconds: breath.total_time_seconds,
                    timeEstimationSeconds: breath.time_estimation_seconds,
                    position: breath.position ?? 0,
                  }
                }) || [],
            }
          }) || [],
    })) as TaskList[]
  }

  async createTaskList(userId: string, name: string, position: number): Promise<TaskList> {
    console.log(
      "DatabaseService.createTaskList: Attempting to insert new task list for user:",
      userId,
      "name:",
      name,
      "position:",
      position,
    )
    const { data, error } = await this.supabase
      .from("task_lists")
      .insert({ user_id: userId, name, position })
      .select("*")
      .single()
    if (error) {
      console.error("DatabaseService.createTaskList: Error creating task list:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.createTaskList: Successfully created task list:", data)
    return {
      ...(data as TaskList),
      steps: [],
      position: data.position ?? 0,
      suggestedTimeBlockRange: data.suggested_time_block_range,
    }
  }

  async updateTaskList(
    id: string,
    userId: string,
    updates: { name?: string; position?: number; suggestedTimeBlockRange?: string | null },
  ): Promise<TaskList> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.position !== undefined) dbUpdates.position = updates.position
    if (updates.suggestedTimeBlockRange !== undefined)
      dbUpdates.suggested_time_block_range = updates.suggestedTimeBlockRange
    console.log(
      "DatabaseService.updateTaskList: Attempting to update task list with ID:",
      id,
      "for user:",
      userId,
      "with updates:",
      dbUpdates,
    )
    const { data, error } = await this.supabase
      .from("task_lists")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("DatabaseService.updateTaskList: Error updating task list:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.updateTaskList: Successfully updated task list:", data)
    return {
      ...(data as TaskList),
      steps: [],
      position: data.position ?? 0,
      suggestedTimeBlockRange: data.suggested_time_block_range,
    }
  }

  async deleteTaskList(id: string, userId: string): Promise<void> {
    console.log("DatabaseService.deleteTaskList: Attempting to delete task list with ID:", id, "for user:", userId)
    const { error } = await this.supabase.from("task_lists").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("DatabaseService.deleteTaskList: Error deleting task list:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.deleteTaskList: Successfully deleted task list with ID:", id)
  }

  async reorderTaskLists(userId: string, reorderedLists: TaskList[]): Promise<void> {
    console.log(
      "DatabaseService.reorderTaskLists: Attempting to reorder task lists for user:",
      userId,
      "updates:",
      reorderedLists,
    )
    const updates = reorderedLists.map((list) => ({
      id: list.id,
      name: list.name,
      position: list.position,
      user_id: userId,
      suggested_time_block_range: list.suggestedTimeBlockRange,
      updated_at: new Date().toISOString(),
    }))
    const { error } = await this.supabase.from("task_lists").upsert(updates, { onConflict: "id" })
    if (error) {
      console.error("DatabaseService.reorderTaskLists: Error reordering task lists:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.reorderTaskLists: Successfully reordered task lists.")
  }

  async fetchLengths(userId: string): Promise<Length[]> {
    const { data, error } = await this.supabase
      .from("lengths")
      .select("*, tag")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
    if (error) {
      console.error("Error fetching lengths:", error)
      throw new Error(error.message)
    }
    return data.map((length: any) => ({
      id: length.id,
      name: length.name,
      completed: length.completed,
      tag: length.tag || null,
      steps: [],
    })) as Length[]
  }

  async getVisionBoardSections(userId: string): Promise<{ data: Range[] | null; error: any }> {
    console.log("Supabase: Fetching vision board sections for user:", userId)
    try {
      const { data, error } = await this.supabase
        .from("ranges")
        .select(`
          id,
          name,
          user_id,
          created_at,
          updated_at,
          tag,
          mountains (
            id,
            name,
            user_id,
            created_at,
            updated_at,
            range_id,
            tag,
            completed,
            hills (
              id,
              name,
              user_id,
              created_at,
              updated_at,
              mountain_id,
              tag,
              completed,
              terrains (
                id,
                name,
                user_id,
                created_at,
                updated_at,
                hill_id,
                tag,
                completed,
                lengths (
                  id,
                  name,
                  user_id,
                  created_at,
                  updated_at,
                  terrain_id,
                  completed,
                  tag,
                  steps (
                    id,
                    label,
                    user_id,
                    created_at,
                    updated_at,
                    length_id,
                    position,
                    duration,
                    completed,
                    locked,
                    priority_rank,
                    history,
                    audio_type,
                    audio_url,
                    color,
                    icon,
                    priority_letter,
                    background_audio_source,
                    background_audio_link,
                    timezone,
                    mantra,
                    starting_ritual,
                    ending_ritual,
                    tag,
                    lifeline
                  )
                )
              )
            )
          )
        `)
        .eq("user_id", userId)
      if (error) {
        console.error("Supabase: Error fetching vision board sections:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          userId,
        })
        return { data: null, error }
      }
      const mappedData = data.map(item => ({
        id: item.id,
        name: item.name,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        tag: item.tag || null,
        mountains: item.mountains.map((mountain: any) => ({
          ...mountain,
          tag: mountain.tag || null,
          completed: mountain.completed || false,
          hills: mountain.hills.map((hill: any) => ({
            ...hill,
            tag: hill.tag || null,
            completed: hill.completed || false,
            terrains: hill.terrains.map((terrain: any) => ({
              ...terrain,
              tag: terrain.tag || null,
              completed: terrain.completed || false,
              lengths: terrain.lengths.map((length: any) => ({
                ...length,
                tag: length.tag || null,
                completed: length.completed || false,
                steps: length.steps.map((step: any) => ({
                  ...step,
                  tag: step.tag || null,
                  completed: step.completed || false,
                })),
              })),
            })),
          })),
        })),
      }))
      return { data: mappedData as Range[], error: null }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in getVisionBoardSections:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
      })
      return { data: null, error: err }
    }
  }

async fetchRanges(userId: string): Promise<any[]> {
  console.log("[DatabaseService.fetchRanges] Executing fetchRanges with userId:", userId);
  const { data, error } = await this.supabase
    .from("ranges")
    .select(`
      id,
      name,
      description,
      color,
      frequency,
      isbuildhabit,
      history,
      mountains (
        id,
        name,
        description,
        color,
        frequency,
        isbuildhabit,
        history,
        hills (
          id,
          name,
          description,
          color,
          frequency,
          isbuildhabit,
          history,
          terrains (
            id,
            name,
            description,
            color,
            frequency,
            isbuildhabit,
            history,
            lengths (
              id,
              name,
              description,
              color,
              frequency,
              isbuildhabit,
              history,
              steps (
                id,
                label,
                mantra,
                description,
                color,
                frequency,
                isbuildhabit,
                history,
                tag
              )
            )
          )
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[DatabaseService.fetchRanges] Error fetching ranges:", error);
    throw new Error(error.message || "Failed to fetch ranges");
  }

  console.log("[DatabaseService.fetchRanges] Raw data fetched from Supabase:", JSON.stringify(data, null, 2));
  const mappedData = data.map((range: any) => ({
    id: range.id,
    name: range.name,
    description: range.description,
    color: range.color,
    frequency: range.frequency,
    isBuildHabit: range.isbuildhabit,
    history: range.history,
    notes: [], // Set notes to empty array to match HabitItem interface
    mountains: range.mountains || [],
  }));
  console.log("[DatabaseService.fetchRanges] Mapped data:", JSON.stringify(mappedData, null, 2));
  return mappedData;
}

  async createRange(userId: string, name: string): Promise<Range> {
    const { data, error } = await this.supabase
      .from("ranges")
      .insert({ user_id: userId, name, tag: null })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating range:", error)
      throw new Error(error.message)
    }
    return { ...(data as Range), tag: null, mountains: [] }
  }

  async updateRange(id: string, userId: string, name: string): Promise<Range> {
    const { data, error } = await this.supabase
      .from("ranges")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating range:", error)
      throw new Error(error.message)
    }
    return { ...(data as Range), mountains: [] }
  }

  async updateRangeTag(id: string, userId: string, tag: string | null): Promise<Range> {
    const { data, error } = await this.supabase
      .from("ranges")
      .update({ tag, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating range tag:", error)
      throw new Error(error.message)
    }
    return { ...(data as Range), tag: data.tag || null, mountains: [] }
  }

  async deleteRange(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("ranges").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting range:", error)
      throw new Error(error.message)
    }
  }

  async updateHabit(table: string, id: string, updates: any) {
    const { data, error } = await this.supabase
      .from(table)
      .update(updates)
      .eq("id", id)
    if (error) throw new Error(error.message)
    return data
  }

  async createMountain(userId: string, rangeId: string, name: string): Promise<Mountain> {
    const { data, error } = await this.supabase
      .from("mountains")
      .insert({ user_id: userId, range_id: rangeId, name, tag: null, completed: false })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating mountain:", error)
      throw new Error(error.message)
    }
    return { ...(data as Mountain), tag: null, completed: false, hills: [] }
  }

  async updateMountain(id: string, userId: string, name: string): Promise<Mountain> {
    const { data, error } = await this.supabase
      .from("mountains")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating mountain:", error)
      throw new Error(error.message)
    }
    return { ...(data as Mountain), hills: [] }
  }

  async updateMountainTag(id: string, userId: string, tag: string | null): Promise<Mountain> {
    const { data, error } = await this.supabase
      .from("mountains")
      .update({ tag, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating mountain tag:", error)
      throw new Error(error.message)
    }
    return { ...(data as Mountain), tag: data.tag || null, hills: [] }
  }

  async deleteMountain(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("mountains").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting mountain:", error)
      throw new Error(error.message)
    }
  }

  async createHill(userId: string, mountainId: string, name: string): Promise<Hill> {
    const { data, error } = await this.supabase
      .from("hills")
      .insert({ user_id: userId, mountain_id: mountainId, name, tag: null, completed: false })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating hill:", error)
      throw new Error(error.message)
    }
    return { ...(data as Hill), tag: null, completed: false, terrains: [] }
  }

  async updateHill(id: string, userId: string, name: string): Promise<Hill> {
    const { data, error } = await this.supabase
      .from("hills")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating hill:", error)
      throw new Error(error.message)
    }
    return { ...(data as Hill), terrains: [] }
  }

  async updateHillTag(id: string, userId: string, tag: string | null): Promise<Hill> {
    const { data, error } = await this.supabase
      .from("hills")
      .update({ tag, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating hill tag:", error)
      throw new Error(error.message)
    }
    return { ...(data as Hill), tag: data.tag || null, terrains: [] }
  }

  async deleteHill(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("hills").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting hill:", error)
      throw new Error(error.message)
    }
  }

  async createTerrain(userId: string, hillId: string, name: string): Promise<Terrain> {
    const { data, error } = await this.supabase
      .from("terrains")
      .insert({ user_id: userId, hill_id: hillId, name, tag: null, completed: false })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating terrain:", error)
      throw new Error(error.message)
    }
    return { ...(data as Terrain), tag: null, completed: false, lengths: [] }
  }

  async updateTerrain(id: string, userId: string, name: string): Promise<Terrain> {
    const { data, error } = await this.supabase
      .from("terrains")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating terrain:", error)
      throw new Error(error.message)
    }
    return { ...(data as Terrain), lengths: [] }
  }

  async updateTerrainTag(id: string, userId: string, tag: string | null): Promise<Terrain> {
    const { data, error } = await this.supabase
      .from("terrains")
      .update({ tag, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating terrain tag:", error)
      throw new Error(error.message)
    }
    return { ...(data as Terrain), tag: data.tag || null, lengths: [] }
  }

  async deleteTerrain(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("terrains").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting terrain:", error)
      throw new Error(error.message)
    }
  }

  async createLength(userId: string, terrainId: string, name: string): Promise<Length> {
    const { data, error } = await this.supabase
      .from("lengths")
      .insert({ user_id: userId, terrain_id: terrainId, name, completed: false, tag: null })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating length:", error)
      throw new Error(error.message)
    }
    return { ...(data as Length), tag: null, completed: false, steps: [] }
  }

  async updateLength(id: string, userId: string, updates: { name?: string; completed?: boolean; tag?: string | null }): Promise<Length> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag
    const { data, error } = await this.supabase
      .from("lengths")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating length:", error)
      throw new Error(error.message)
    }
    return { ...(data as Length), tag: data.tag || null, completed: data.completed || false, steps: [] }
  }

  async deleteLength(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("lengths").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting length:", error)
      throw new Error(error.message)
    }
  }

  async createResetPeriod(
    userId: string,
    rangeId: string,
    periodData: {
      startDate: string
      endDate: string
      discover: string
      define: string
      ideate: string
      prototype: string
      test: string
    }
  ): Promise<ResetPeriod> {
    console.log("DatabaseService.createResetPeriod: Creating reset period for user:", userId, "range:", rangeId, "data:", periodData)
    const { data, error } = await this.supabase
      .from("reset_periods")
      .insert({
        user_id: userId,
        range_id: rangeId,
        start_date: periodData.startDate,
        end_date: periodData.endDate,
        discover: periodData.discover,
        define: periodData.define,
        ideate: periodData.ideate,
        prototype: periodData.prototype,
        test: periodData.test,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single()
    if (error) {
      console.error("DatabaseService.createResetPeriod: Error creating reset period:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.createResetPeriod: Successfully created reset period:", data)
    return {
      id: data.id,
      user_id: data.user_id,
      range_id: data.range_id,
      start_date: data.start_date,
      end_date: data.end_date,
      discover: data.discover,
      define: data.define,
      ideate: data.ideate,
      prototype: data.prototype,
      test: data.test,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as ResetPeriod
  }

  async updateResetPeriod(
    id: string,
    userId: string,
    rangeId: string,
    updates: Partial<{
      startDate: string
      endDate: string
      discover: string
      define: string
      ideate: string
      prototype: string
      test: string
    }>
  ): Promise<ResetPeriod> {
    console.log("DatabaseService.updateResetPeriod: Updating reset period:", id, "for user:", userId, "range:", rangeId, "updates:", updates)
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate
    if (updates.discover !== undefined) dbUpdates.discover = updates.discover
    if (updates.define !== undefined) dbUpdates.define = updates.define
    if (updates.ideate !== undefined) dbUpdates.ideate = updates.ideate
    if (updates.prototype !== undefined) dbUpdates.prototype = updates.prototype
    if (updates.test !== undefined) dbUpdates.test = updates.test
    const { data, error } = await this.supabase
      .from("reset_periods")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .eq("range_id", rangeId)
      .select("*")
      .single()
    if (error) {
      console.error("DatabaseService.updateResetPeriod: Error updating reset period:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.updateResetPeriod: Successfully updated reset period:", data)
    return {
      id: data.id,
      user_id: data.user_id,
      range_id: data.range_id,
      start_date: data.start_date,
      end_date: data.end_date,
      discover: data.discover,
      define: data.define,
      ideate: data.ideate,
      prototype: data.prototype,
      test: data.test,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as ResetPeriod
  }

  async fetchResetPeriods(userId: string, rangeId: string): Promise<ResetPeriod[]> {
    console.log("DatabaseService.fetchResetPeriods: Fetching reset periods for user:", userId, "range:", rangeId)
    const { data, error } = await this.supabase
      .from("reset_periods")
      .select("*")
      .eq("user_id", userId)
      .eq("range_id", rangeId)
      .order("created_at", { ascending: false })
    if (error) {
      console.error("DatabaseService.fetchResetPeriods: Error fetching reset periods:", error)
      throw new Error(error.message)
    }
    return data.map((period) => ({
      id: period.id,
      user_id: period.user_id,
      range_id: period.range_id,
      start_date: period.start_date,
      end_date: period.end_date,
      discover: period.discover,
      define: period.define,
      ideate: period.ideate,
      prototype: period.prototype,
      test: period.test,
      created_at: period.created_at,
      updated_at: period.updated_at,
    })) as ResetPeriod[]
  }

  async archiveCompletedItem(
    userId: string,
    rangeId: string,
    item: { id: string; name: string; type: "Mountain" | "Hill" | "Terrain" | "Length" | "Step" }
  ): Promise<ArchivedItem> {
    console.log("DatabaseService.archiveCompletedItem: Archiving item for user:", userId, "range:", rangeId, "item:", item)
    const { data, error } = await this.supabase
      .from("archives")
      .insert({
        user_id: userId,
        range_id: rangeId,
        item_id: item.id,
        item_name: item.name,
        item_type: item.type,
        completed_at: new Date().toISOString(),
      })
      .select("*")
      .single()
    if (error) {
      console.error("DatabaseService.archiveCompletedItem: Error archiving item:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.archiveCompletedItem: Successfully archived item:", data)
    return {
      id: data.id,
      user_id: data.user_id,
      range_id: data.range_id,
      item_id: data.item_id,
      item_name: data.item_name,
      item_type: data.item_type,
      completed_at: data.completed_at,
    } as ArchivedItem
  }

  async fetchArchivedItems(userId: string, rangeId: string): Promise<ArchivedItem[]> {
    console.log("DatabaseService.fetchArchivedItems: Fetching archived items for user:", userId, "range:", rangeId)
    const { data, error } = await this.supabase
      .from("archives")
      .select("*")
      .eq("user_id", userId)
      .eq("range_id", rangeId)
      .order("completed_at", { ascending: false })
    if (error) {
      console.error("DatabaseService.fetchArchivedItems: Error fetching archived items:", error)
      throw new Error(error.message)
    }
    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      range_id: item.range_id,
      item_id: item.item_id,
      item_name: item.item_name,
      item_type: item.item_type,
      completed_at: item.completed_at,
    })) as ArchivedItem[]
  }

  async createDailyPlan(userId: string, dailyPlan: {
  date: string
  goals: { id: string; type: string; name: string }[]
  typedGoals: { id: string; type: string; typedName: string }[]
  quote: string
  targets: { stepId: string; goalId: string; taskListId?: string }[]
  successes: string[]
  reviewTypedGoals: { id: string; type: string; typedName: string }[]
  taskListIds: { goalId: string; taskListId: string }[]
}): Promise<DailyPlan> {
  console.log("[DatabaseService.createDailyPlan] Creating plan for user:", userId, "date:", dailyPlan.date, "plan:", dailyPlan);
  const { data, error } = await this.supabase
    .from("daily_plans")
    .insert({
      user_id: userId,
      date: dailyPlan.date,
      goals: dailyPlan.goals,
      typed_goals: dailyPlan.typedGoals,
      quote: dailyPlan.quote || null,
      targets: dailyPlan.targets,
      successes: dailyPlan.successes,
      review_typed_goals: dailyPlan.reviewTypedGoals,
      task_list_ids: dailyPlan.taskListIds || [], // Include task_list_ids
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) {
    console.error("[DatabaseService.createDailyPlan] Error creating daily plan:", error);
    throw new Error(error.message);
  }
  console.log("[DatabaseService.createDailyPlan] Created daily plan:", data);
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    goals: data.goals,
    typedGoals: data.typed_goals,
    quote: data.quote,
    targets: data.targets,
    successes: data.successes,
    reviewTypedGoals: data.review_typed_goals,
    taskListIds: data.task_list_ids || [], // Include task_list_ids
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as DailyPlan;
}

async updateDailyPlan(id: string, userId: string, updates: {
  date?: string
  goals?: { id: string; type: string; name: string }[]
  typedGoals?: { id: string; type: string; typedName: string }[]
  quote?: string
  targets?: { stepId: string; goalId: string; taskListId?: string }[]
  successes?: string[]
  reviewTypedGoals?: { id: string; type: string; typedName: string }[]
  taskListIds?: { goalId: string; taskListId: string }[]
}): Promise<DailyPlan> {
  console.log("[DatabaseService.updateDailyPlan] Updating plan:", id, "for user:", userId, "updates:", updates);
  const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.goals !== undefined) dbUpdates.goals = updates.goals;
  if (updates.typedGoals !== undefined) dbUpdates.typed_goals = updates.typedGoals;
  if (updates.quote !== undefined) dbUpdates.quote = updates.quote;
  if (updates.targets !== undefined) dbUpdates.targets = updates.targets;
  if (updates.successes !== undefined) dbUpdates.successes = updates.successes;
  if (updates.reviewTypedGoals !== undefined) dbUpdates.review_typed_goals = updates.reviewTypedGoals;
  if (updates.taskListIds !== undefined) dbUpdates.task_list_ids = updates.taskListIds;
  const { data, error } = await this.supabase
    .from("daily_plans")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) {
    console.error("[DatabaseService.updateDailyPlan] Error updating daily plan:", error);
    throw new Error(error.message);
  }
  console.log("[DatabaseService.updateDailyPlan] Updated daily plan:", data);
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    goals: data.goals,
    typedGoals: data.typed_goals,
    quote: data.quote,
    targets: data.targets,
    successes: data.successes,
    reviewTypedGoals: data.review_typed_goals,
    taskListIds: data.task_list_ids || [], // Include task_list_ids
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as DailyPlan;
}

  async fetchDailyPlan(userId: string, date: string): Promise<DailyPlan | null> {
  console.log("[DatabaseService.fetchDailyPlan] Fetching plan for user:", userId, "date:", date);
  const { data, error } = await this.supabase
    .from("daily_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();
  if (error && error.code !== "PGRST116") {
    console.error("[DatabaseService.fetchDailyPlan] Error fetching daily plan:", error);
    throw new Error(error.message);
  }
  if (!data) {
    console.log("[DatabaseService.fetchDailyPlan] No plan found for date:", date);
    return null;
  }
  console.log("[DatabaseService.fetchDailyPlan] Fetched plan:", data);
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    goals: data.goals,
    typedGoals: data.typed_goals,
    quote: data.quote,
    targets: data.targets,
    successes: data.successes,
    reviewTypedGoals: data.review_typed_goals,
    taskListIds: data.task_list_ids || [], // Include task_list_ids
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as DailyPlan;
}

  async createStep(
    userId: string,
    label: string,
    position: number,
    options?: { taskListId?: string | null; lengthId?: string | null }
  ): Promise<Step> {
    const insertData: any = {
      user_id: userId,
      label,
      position,
      completed: false,
      duration: 0,
      locked: false,
      task_list_id: options?.taskListId || null,
      length_id: options?.lengthId || null,
      tag: null,
    }
    const { data, error } = await this.supabase.from("steps").insert(insertData).select("*").single()
    if (error) {
      console.error("Error creating step:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      label: data.label,
      duration: data.duration,
      completed: data.completed,
      locked: data.locked,
      taskListId: data.task_list_id,
      lengthId: data.length_id,
      icon: data.icon,
      priorityLetter: data.priority_letter,
      priorityRank: data.priority_rank,
      positionWhenAllListsActive: data.position_when_all_lists_active,
      estimatedStartTime: data.estimated_start_time,
      estimatedEndTime: data.estimated_end_time,
      history: data.history,
      mantra: data.mantra,
      startingRitual: data.starting_ritual,
      endingRitual: data.ending_ritual,
      audioUrl: data.audio_url,
      audioType: data.audio_type,
      position: data.position,
      timezone: data.timezone,
      tag: data.tag || null,
      breaths: [],
      userId: data.user_id,
      color: data.color,
      lifeline: data.lifeline,
    } as Step
  }

  async updateStep(id: string, userId: string, updates: Partial<Omit<Step, "id">>): Promise<Step> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.label !== undefined) dbUpdates.label = updates.label
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed
    if (updates.locked !== undefined) dbUpdates.locked = updates.locked
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon
    if (updates.priorityLetter !== undefined) dbUpdates.priority_letter = updates.priorityLetter
    if (updates.priorityRank !== undefined) dbUpdates.priority_rank = updates.priorityRank
    if (updates.positionWhenAllListsActive !== undefined) dbUpdates.position_when_all_lists_active = updates.positionWhenAllListsActive
    if (updates.estimatedStartTime !== undefined) dbUpdates.estimated_start_time = updates.estimatedStartTime
    if (updates.estimatedEndTime !== undefined) dbUpdates.estimated_end_time = updates.estimatedEndTime
    if (updates.history !== undefined) dbUpdates.history = updates.history
    if (updates.mantra !== undefined) dbUpdates.mantra = updates.mantra
    if (updates.startingRitual !== undefined) dbUpdates.starting_ritual = updates.startingRitual
    if (updates.endingRitual !== undefined) dbUpdates.ending_ritual = updates.endingRitual
    if (updates.audioUrl !== undefined) dbUpdates.audio_url = updates.audioUrl
    if (updates.audioType !== undefined) dbUpdates.audio_type = updates.audioType
    if (updates.position !== undefined) dbUpdates.position = updates.position
    if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone
    if (updates.taskListId !== undefined) dbUpdates.task_list_id = updates.taskListId
    if (updates.lengthId !== undefined) dbUpdates.length_id = updates.lengthId
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.lifeline !== undefined) dbUpdates.lifeline = updates.lifeline
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag
    const { data, error } = await this.supabase
      .from("steps")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating step:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      label: data.label,
      duration: data.duration,
      completed: data.completed,
      locked: data.locked,
      taskListId: data.task_list_id,
      lengthId: data.length_id,
      icon: data.icon,
      priorityLetter: data.priority_letter,
      priorityRank: data.priority_rank,
      positionWhenAllListsActive: data.position_when_all_lists_active,
      estimatedStartTime: data.estimated_start_time,
      estimatedEndTime: data.estimated_end_time,
      history: data.history,
      mantra: data.mantra,
      startingRitual: data.starting_ritual,
      endingRitual: data.ending_ritual,
      audioUrl: data.audio_url,
      audioType: data.audio_type,
      position: data.position,
      timezone: data.timezone,
      tag: data.tag || null,
      breaths: [],
      userId: data.user_id,
      color: data.color,
      lifeline: data.lifeline,
    } as Step
  }

async deleteStep(id: string, userId: string): Promise<void> {
  console.log(`[DatabaseService.deleteStep] Attempting to delete step: id=${id}, userId=${userId}`);
  try {
    // Delete associated breaths first (if not handled by cascading delete in DB schema)
    const { error: breathError } = await this.supabase
      .from("breaths")
      .delete()
      .eq("step_id", id)
      .eq("user_id", userId);
    if (breathError) {
      console.error("[DatabaseService.deleteStep] Error deleting associated breaths:", breathError);
      throw new Error(`Failed to delete associated breaths: ${breathError.message}`);
    }

    // Delete the step
    const { error } = await this.supabase
      .from("steps")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) {
      console.error("[DatabaseService.deleteStep] Error deleting step:", error, { id, userId });
      throw new Error(`Failed to delete step: ${error.message}`);
    }
    console.log(`[DatabaseService.deleteStep] Successfully deleted step: id=${id}`);
  } catch (error: any) {
    console.error("[DatabaseService.deleteStep] Unexpected error:", error, { id, userId });
    throw error;
  }
}

  async reorderSteps(userId: string, reorderedSteps: Step[]): Promise<void> {
    const updates = reorderedSteps.map((step, index) => ({
      id: step.id,
      position: index,
      user_id: userId,
      task_list_id: step.taskListId,
      length_id: step.lengthId,
    }))
    const { error } = await this.supabase.from("steps").upsert(updates, { onConflict: "id" })
    if (error) {
      console.error("Error reordering steps:", error)
      throw new Error(error.message)
    }
  }

  async reorderStepsAllActive(userId: string, reorderedSteps: Step[]): Promise<void> {
    console.log("reorderStepsAllActive: Starting with steps:", reorderedSteps.map(s => ({ id: s.id, label: s.label })))
    for (const [index, step] of reorderedSteps.entries()) {
      if (!step.id || !userId) {
        console.warn(`Skipping invalid step at index ${index}:`, { id: step.id, userId })
        continue
      }
      console.log(`Updating step ${step.id} at index ${index} with position_when_all_lists_active: ${index + 1}`)
      const { error } = await this.supabase
        .from("steps")
        .update({
          position_when_all_lists_active: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", step.id)
        .eq("user_id", userId)
      if (error) {
        console.error(`Error updating step ${step.id} at index ${index} for all active tasks:`, {
          error,
          step: { id: step.id, label: step.label },
        })
        throw new Error(`Failed to update step ${step.id}: ${error.message}`)
      }
    }
    console.log("reorderStepsAllActive: Completed successfully")
  }

  async createBreath(userId: string, stepId: string, name: string, position: number): Promise<Breath> {
    const safePosition = Math.max(position, 2)
    const { data, error } = await this.supabase
      .from("breaths")
      .insert({
        user_id: userId,
        step_id: stepId,
        name,
        position: safePosition,
        completed: false,
        is_running: false,
        paused_time: 0,
        total_time_seconds: 0,
        time_estimation_seconds: 0,
      })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating breath:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      name: data.name,
      completed: data.completed,
      isRunning: data.is_running,
      startTime: data.start_time,
      endTime: data.end_time,
      pausedTime: data.paused_time,
      totalTimeSeconds: data.total_time_seconds,
      timeEstimationSeconds: data.time_estimation_seconds,
      position: data.position,
    } as Breath
  }

  async updateBreathTiming(id: string, userId: string, updates: Partial<Breath>): Promise<Breath> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed
    if (updates.isRunning !== undefined) dbUpdates.is_running = updates.isRunning
    if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime
    if (updates.pausedTime !== undefined) dbUpdates.paused_time = updates.pausedTime
    if (updates.totalTimeSeconds !== undefined) dbUpdates.total_time_seconds = updates.totalTimeSeconds
    if (updates.timeEstimationSeconds !== undefined) dbUpdates.time_estimation_seconds = updates.timeEstimationSeconds
    if (updates.position !== undefined) dbUpdates.position = Math.max(updates.position, 2)
    const { data, error } = await this.supabase
      .from("breaths")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating breath timing:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      name: data.name,
      completed: data.completed,
      isRunning: data.is_running,
      startTime: data.start_time,
      endTime: data.end_time,
      pausedTime: data.paused_time,
      totalTimeSeconds: data.total_time_seconds,
      timeEstimationSeconds: data.time_estimation_seconds,
      position: data.position,
    } as Breath
  }

  async deleteBreath(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("breaths").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting breath:", error)
      throw new Error(error.message)
    }
  }

  async updateStepBreaths(userId: string, stepId: string, breaths: Breath[]): Promise<void> {
    const updates = breaths.map((breath, index) => ({
      id: breath.id || crypto.randomUUID(),
      step_id: stepId,
      user_id: userId,
      name: breath.name,
      completed: breath.completed,
      is_running: breath.isRunning,
      start_time: breath.startTime,
      end_time: breath.endTime,
      paused_time: breath.pausedTime,
      total_time_seconds: breath.totalTimeSeconds,
      time_estimation_seconds: breath.timeEstimationSeconds,
      position: Math.max(index + 2, 2),
      created_at: breath.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    const { error } = await this.supabase.from("breaths").upsert(updates, { onConflict: "id" })
    if (error) {
      console.error("Error updating breaths:", error)
      throw new Error(error.message)
    }
  }

  async getJournalEntries(userId: string): Promise<{ data: JournalEntry[] | null; error: any }> {
    console.log("Supabase: Attempting to fetch journal entries for user:", userId)
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      if (authError || !user) {
        console.error("Supabase: Authentication check failed:", {
          authError: authError?.message || "No auth error message",
          userId,
        })
        return { data: null, error: authError || new Error("User not authenticated") }
      }
      console.log("Supabase: Authentication state:", {
        isAuthenticated: !!user,
        userId: user.id,
        email: user.email,
      })
      const { data, error } = await this.supabase
        .from("journal")
        .select("id, user_id, title, entry, cbtNotes, category, visionboardlevel, visionboarditemid, visionboarditemtitle, tags, created_at, updated_at, is_archived, is_favorite, type, sourceType, sourceId, sourceDate")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) {
        console.error("Supabase: Error fetching journal entries:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          hint: error.hint || "No hint provided",
          userId,
          table: "journal",
          query: "select id, user_id, title, entry, category, visionboardlevel, visionboarditemid, visionboarditemtitle, tags, created_at, updated_at, is_archived, is_favorite, type from journal where user_id = ? order by created_at desc",
        })
        return { data: null, error }
      }
      console.log("Supabase: Successfully fetched journal entries:", data)
      return { data: data as JournalEntry[], error: null }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in getJournalEntries:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
        table: "journal",
      })
      return { data: null, error: err }
    }
  }

  async getJournalEntryById(userId: string, entryId: string): Promise<{ data: JournalEntry | null; error: any }> {
    console.log("Supabase: Fetching journal entry:", entryId)
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      if (authError || !user) {
        console.error("Supabase: Authentication check failed:", {
          authError: authError?.message || "No auth error message",
          userId,
        })
        return { data: null, error: authError || new Error("User not authenticated") }
      }
      const { data, error } = await this.supabase
        .from("journal")
        .select("id, user_id, title, entry, category, visionboardlevel, visionboarditemid, visionboarditemtitle, tags, created_at, updated_at, is_archived, is_favorite, type")
        .eq("id", entryId)
        .eq("user_id", userId)
        .single()
      if (error) {
        console.error("Supabase: Error fetching journal entry:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          hint: error.hint || "No hint provided",
          userId,
          entryId,
        })
        return { data: null, error }
      }
      return { data: data as JournalEntry, error: null }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in getJournalEntryById:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
        entryId,
      })
      return { data: null, error: err }
    }
  }

  async createJournalEntry(
    userId: string,
    entry: Omit<JournalEntry, "id" | "created_at" | "updated_at" | "is_archived" | "is_favorite">
  ): Promise<{ data: JournalEntry | null; error: any }> {
    console.log("Supabase: Creating journal entry for user:", userId)
    console.log("Supabase: Entering createJournalEntry with userId:", userId, "and entry:", JSON.stringify(entry, null, 2))
    try {
      const newEntry = {
        user_id: userId,
        title: entry.title || null,
        entry: entry.entry || null,
        category: entry.category || null,
        visionboardlevel: entry.visionboardlevel || null,
        visionboarditemid: entry.visionboarditemid || null,
        visionboarditemtitle: entry.visionboarditemtitle || null,
        tags: entry.tags || null,
        type: entry.type || null,
      }
      console.log("Supabase: newEntry data:", JSON.stringify(newEntry, null, 2))
      console.log("Supabase: Executing insert into table 'journal' with schema 'public', client URL:", this.supabase.url)
      const { data, error } = await this.supabase
        .from("journal")
        .insert([newEntry])
        .select()
        .single()
      if (error) {
        console.error("Supabase: Error creating journal entry:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          hint: error.hint || "No hint provided",
          userId,
          rawError: JSON.stringify(error)
        })
        return { data: null, error }
      }
      return { data: data as JournalEntry, error: null }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in createJournalEntry:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
      })
      return { data: null, error: err }
    }
  }

  async updateJournalEntry(
    userId: string,
    entryId: string,
    entry: Omit<JournalEntry, "id" | "created_at" | "updated_at" | "is_archived" | "is_favorite">
  ): Promise<{ data: JournalEntry | null; error: any }> {
    console.log("Supabase: Updating journal entry:", entryId)
    try {
      const updatedEntry = {
        title: entry.title || null,
        entry: entry.entry || null,
        category: entry.category || null,
        visionboardlevel: entry.visionboardlevel || null,
        visionboarditemid: entry.visionboarditemid || null,
        visionboarditemtitle: entry.visionboarditemtitle || null,
        tags: entry.tags || null,
        type: entry.type || null,
        updated_at: new Date().toISOString(),
      }
      const { data, error } = await this.supabase
        .from("journal")
        .update(updatedEntry)
        .eq("id", entryId)
        .eq("user_id", userId)
        .select()
        .single()
      if (error) {
        console.error("Supabase: Error updating journal entry:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          hint: error.hint || "No hint provided",
          userId,
          entryId,
        })
        return { data: null, error }
      }
      return { data: data as JournalEntry, error: null }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in updateJournalEntry:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
        entryId,
      })
      return { data: null, error: err }
    }
  }

  async deleteJournalEntry(id: string, userId: string): Promise<void> {
    console.log("Supabase: Deleting journal entry:", id)
    try {
      const { error } = await this.supabase.from("journal").delete().eq("id", id).eq("user_id", userId)
      if (error) {
        console.error("Supabase: Error deleting journal entry:", {
          message: error.message || "No message provided",
          code: error.code || "No code provided",
          details: error.details || "No details provided",
          hint: error.hint || "No hint provided",
          userId,
          id,
        })
        throw new Error(error.message)
      }
    } catch (err: any) {
      console.error("Supabase: Unexpected error in deleteJournalEntry:", {
        message: err.message || "No message provided",
        stack: err.stack || "No stack provided",
        userId,
        id,
      })
      throw err
    }
  }

  async createOrUpdateJournalEntryFromSource(
    userId: string,
    sourceType: 'step' | 'habit',
    sourceId: string,
    title: string,
    journalContent: string | null | undefined,
    cbtNotes: string | null | undefined,
    sourceDate?: string
  ): Promise<{ data: JournalEntry | null; error: any }> {
    try {
      // Skip if both content fields are empty
      if (!journalContent && !cbtNotes) {
        return { data: null, error: null }
      }

      // For habits, store individual entry AND create/update daily compilation
      if (sourceType === 'habit' && sourceDate) {
        // 1. Store/update individual habit entry (for data integrity)
        const { data: existingIndividual, error: fetchIndividualError } = await this.supabase
          .from("journal")
          .select("id")
          .eq("user_id", userId)
          .eq("sourceType", sourceType)
          .eq("sourceId", sourceId)
          .eq("sourceDate", sourceDate)

        if (fetchIndividualError) {
          console.error("Error checking existing individual habit entry:", fetchIndividualError)
          return { data: null, error: fetchIndividualError }
        }

        const individualData = {
          user_id: userId,
          title,
          entry: journalContent || null,
          cbtNotes: cbtNotes || null,
          type: sourceType,
          sourceType,
          sourceId,
          sourceDate,
          category: 'Habits',
        }

        if (existingIndividual && existingIndividual.length > 0) {
          await this.supabase
            .from("journal")
            .update(individualData)
            .eq("id", existingIndividual[0].id)
        } else {
          await this.supabase
            .from("journal")
            .insert(individualData)
        }

        // 2. Fetch ALL habit entries for this date to compile
        const { data: allHabitEntries, error: fetchAllError } = await this.supabase
          .from("journal")
          .select("title, entry, cbtNotes, sourceId")
          .eq("user_id", userId)
          .eq("sourceType", 'habit')
          .eq("sourceDate", sourceDate)
          .neq("sourceId", 'daily_compilation')

        if (fetchAllError) {
          console.error("Error fetching habit entries for compilation:", fetchAllError)
          return { data: null, error: fetchAllError }
        }

        // 3. Compile all habit notes into one entry
        let compiledEntry = ""
        let compiledCbtNotes = ""

        if (allHabitEntries && allHabitEntries.length > 0) {
          allHabitEntries.forEach((entry, index) => {
            if (entry.entry) {
              compiledEntry += `**${entry.title}**\n${entry.entry}\n\n`
            }
            if (entry.cbtNotes) {
              compiledCbtNotes += `**${entry.title} - CBT Notes**\n${entry.cbtNotes}\n\n`
            }
          })
        }

        // 4. Create/update daily compilation entry
        const { data: existingCompilation, error: fetchCompilationError } = await this.supabase
          .from("journal")
          .select("id")
          .eq("user_id", userId)
          .eq("sourceType", 'habit')
          .eq("sourceId", 'daily_compilation')
          .eq("sourceDate", sourceDate)

        if (fetchCompilationError) {
          console.error("Error checking existing compilation:", fetchCompilationError)
          return { data: null, error: fetchCompilationError }
        }

        const compilationData = {
          user_id: userId,
          title: `Daily Habits - ${new Date(sourceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          entry: compiledEntry.trim() || null,
          cbtNotes: compiledCbtNotes.trim() || null,
          type: 'habit',
          sourceType: 'habit',
          sourceId: 'daily_compilation',
          sourceDate,
          category: 'Habits',
          tags: ['habits', 'daily-compilation']
        }

        if (existingCompilation && existingCompilation.length > 0) {
          const { data, error } = await this.supabase
            .from("journal")
            .update(compilationData)
            .eq("id", existingCompilation[0].id)
            .select()
            .single()

          return { data: data as JournalEntry, error }
        } else {
          const { data, error } = await this.supabase
            .from("journal")
            .insert(compilationData)
            .select()
            .single()

          return { data: data as JournalEntry, error }
        }
      }

      // For non-habit sources (like 'step'), use original logic
      const { data: existingEntries, error: fetchError } = await this.supabase
        .from("journal")
        .select("id")
        .eq("user_id", userId)
        .eq("sourceType", sourceType)
        .eq("sourceId", sourceId)
        .eq("sourceDate", sourceDate || null)

      if (fetchError) {
        console.error("Error checking existing journal entry:", fetchError)
        return { data: null, error: fetchError }
      }

      const entryData = {
        user_id: userId,
        title,
        entry: journalContent || null,
        cbtNotes: cbtNotes || null,
        type: sourceType,
        sourceType,
        sourceId,
        sourceDate: sourceDate || null,
        category: sourceType === 'step' ? 'Timeline' : 'Habits',
      }

      if (existingEntries && existingEntries.length > 0) {
        const { data, error } = await this.supabase
          .from("journal")
          .update(entryData)
          .eq("id", existingEntries[0].id)
          .select()
          .single()

        return { data: data as JournalEntry, error }
      } else {
        const { data, error } = await this.supabase
          .from("journal")
          .insert(entryData)
          .select()
          .single()

        return { data: data as JournalEntry, error }
      }
    } catch (err: any) {
      console.error("Error in createOrUpdateJournalEntryFromSource:", err)
      return { data: null, error: err }
    }
  }

  async fetchEmotions(userId: string): Promise<Emotion[]> {
    const { data, error } = await this.supabase
      .from("emotions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
    if (error) {
      console.error("Error fetching emotions:", error)
      throw new Error(error.message)
    }
    return data as Emotion[]
  }

  async createEmotion(userId: string, name: string, description?: string): Promise<Emotion> {
    const { data, error } = await this.supabase
      .from("emotions")
      .insert({ user_id: userId, name, description: description || null })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating emotion:", error)
      throw new Error(error.message)
    }
    return data as Emotion
  }

  async updateEmotion(id: string, userId: string, updates: { name?: string; description?: string }): Promise<Emotion> {
    const { data, error } = await this.supabase
      .from("emotions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating emotion:", error)
      throw new Error(error.message)
    }
    return data as Emotion
  }

  async deleteEmotion(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("emotions").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting emotion:", error)
      throw new Error(error.message)
    }
  }

  async fetchProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*, project_areas(*), project_team_members(*), project_tasks(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }
    return data.map((project) => ({
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      dueDate: project.due_date,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      areas: project.project_areas.map((area: any) => area.name),
      teamMembers: project.project_team_members.map((member: any) => member.name),
      tasks: project.project_tasks.map((task: any) => ({
        id: task.id,
        projectId: task.project_id,
        areaId: task.area_id,
        userId: task.user_id,
        title: task.title,
        description: task.description,
        status: task.status,
        timePeriod: task.time_period,
        timePeriodType: task.time_period_type,
        timePeriodNumber: task.time_period_number,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      })),
    })) as Project[]
  }

  async createProject(
    userId: string,
    projectData: {
      name: string
      description?: string
      status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
      progress?: number
      dueDate?: string
      areas?: string[]
      teamMembers?: string[]
    },
  ): Promise<Project> {
    const { data: newProject, error: projectError } = await this.supabase
      .from("projects")
      .insert({
        user_id: userId,
        name: projectData.name,
        description: projectData.description || null,
        status: projectData.status || "not_started",
        progress: projectData.progress || 0,
        due_date: projectData.dueDate || null,
      })
      .select("*")
      .single()
    if (projectError) {
      console.error("Error creating project:", projectError)
      throw new Error(projectError.message)
    }
    if (projectData.areas && projectData.areas.length > 0) {
      const areaInserts = projectData.areas.map((areaName, index) => ({
        project_id: newProject.id,
        name: areaName,
        position: index,
      }))
      const { error: areaError } = await this.supabase.from("project_areas").insert(areaInserts)
      if (areaError) {
        console.error("Error inserting project areas:", areaError)
      }
    }
    if (projectData.teamMembers && projectData.teamMembers.length > 0) {
      const memberInserts = projectData.teamMembers.map((memberName) => ({
        project_id: newProject.id,
        name: memberName,
      }))
      const { error: memberError } = await this.supabase.from("project_team_members").insert(memberInserts)
      if (memberError) {
        console.error("Error inserting project team members:", memberError)
      }
    }
    return {
      id: newProject.id,
      userId: newProject.user_id,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      progress: newProject.progress,
      dueDate: newProject.due_date,
      createdAt: newProject.created_at,
      updatedAt: newProject.updated_at,
      areas: projectData.areas || [],
      teamMembers: projectData.teamMembers || [],
      tasks: [],
    } as Project
  }

  async updateProject(
    id: string,
    userId: string,
    updates: Partial<
      Pick<Project, "name" | "description" | "status" | "progress" | "dueDate" | "areas" | "teamMembers">
    >,
  ): Promise<Project> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
    const { data: updatedProject, error: projectError } = await this.supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (projectError) {
      console.error("Error updating project:", projectError)
      throw new Error(projectError.message)
    }
    if (updates.areas !== undefined) {
      const { error: deleteAreasError } = await this.supabase.from("project_areas").delete().eq("project_id", id)
      if (deleteAreasError) {
        console.error("Error deleting old project areas:", deleteAreasError)
      }
      if (updates.areas.length > 0) {
        const areaInserts = updates.areas.map((areaName, index) => ({
          project_id: id,
          name: areaName,
          position: index,
        }))
        const { error: insertAreasError } = await this.supabase.from("project_areas").insert(areaInserts)
        if (insertAreasError) {
          console.error("Error inserting new project areas:", insertAreasError)
        }
      }
    }
    if (updates.teamMembers !== undefined) {
      const { error: deleteMembersError } = await this.supabase
        .from("project_team_members")
        .delete()
        .eq("project_id", id)
      if (deleteMembersError) {
        console.error("Error deleting old project team members:", deleteMembersError)
      }
      if (updates.teamMembers.length > 0) {
        const memberInserts = updates.teamMembers.map((memberName) => ({
          project_id: id,
          name: memberName,
        }))
        const { error: insertMembersError } = await this.supabase.from("project_team_members").insert(memberInserts)
        if (insertMembersError) {
          console.error("Error inserting new project team members:", insertMembersError)
        }
      }
    }
    return {
      id: updatedProject.id,
      userId: updatedProject.user_id,
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      progress: updatedProject.progress,
      dueDate: updatedProject.due_date,
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at,
      areas: updates.areas || [],
      teamMembers: updates.teamMembers || [],
      tasks: [],
    } as Project
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("projects").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting project:", error)
      throw new Error(error.message)
    }
  }

  async createProjectArea(projectId: string, name: string, position: number): Promise<ProjectArea> {
    const { data, error } = await this.supabase
      .from("project_areas")
      .insert({ project_id: projectId, name, position })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating project area:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      projectId: data.project_id,
      name: data.name,
      position: data.position,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ProjectArea
  }

  async updateProjectArea(id: string, updates: Partial<Pick<ProjectArea, "name" | "position">>): Promise<ProjectArea> {
    const { data, error } = await this.supabase
      .from("project_areas")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating project area:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      projectId: data.project_id,
      name: data.name,
      position: data.position,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ProjectArea
  }

  async deleteProjectArea(id: string): Promise<void> {
    const { error } = await this.supabase.from("project_areas").delete().eq("id", id)
    if (error) {
      console.error("Error deleting project area:", error)
      throw new Error(error.message)
    }
  }

  async createProjectTask(
    userId: string,
    taskData: {
      projectId: string
      areaId: string
      title: string
      description?: string
      timePeriodType: "week" | "month" | "quarter" | "year"
      timePeriodNumber: number
      assignedTo?: string
      dueDate?: string
    },
  ): Promise<ProjectTask> {
    const timePeriod = `${taskData.timePeriodType.charAt(0).toUpperCase() + taskData.timePeriodType.slice(1)} ${taskData.timePeriodNumber}`
    const { data, error } = await this.supabase
      .from("project_tasks")
      .insert({
        project_id: taskData.projectId,
        area_id: taskData.areaId,
        user_id: userId,
        title: taskData.title,
        description: taskData.description || null,
        time_period: timePeriod,
        time_period_type: taskData.timePeriodType,
        time_period_number: taskData.timePeriodNumber,
        assigned_to: taskData.assignedTo || null,
        due_date: taskData.dueDate || null,
        status: "pending",
      })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating project task:", error)
      throw new Error(error.message)
    }
    return {
     // lib/database-service.ts (continued from createProjectTask)
      id: data.id,
      projectId: data.project_id,
      areaId: data.area_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      timePeriod: data.time_period,
      timePeriodType: data.time_period_type,
      timePeriodNumber: data.time_period_number,
      assignedTo: data.assigned_to,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ProjectTask
  }

  async updateProjectTask(
    id: string,
    userId: string,
    updates: Partial<Pick<ProjectTask, "title" | "description" | "status" | "assignedTo" | "dueDate">>,
  ): Promise<ProjectTask> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
    const { data, error } = await this.supabase
      .from("project_tasks")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating project task:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      projectId: data.project_id,
      areaId: data.area_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      timePeriod: data.time_period,
      timePeriodType: data.time_period_type,
      timePeriodNumber: data.time_period_number,
      assignedTo: data.assigned_to,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ProjectTask
  }

  async deleteProjectTask(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("project_tasks").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting project task:", error)
      throw new Error(error.message)
    }
  }

  async fetchVehicles(userId: string): Promise<Vehicle[]> {
    console.log("DatabaseService.fetchVehicles: Attempting to fetch vehicles for user:", userId)
    const { data, error } = await this.supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
    if (error) {
      console.error("Error fetching vehicles:", error)
      return []
    }
    console.log("DatabaseService.fetchVehicles: Successfully fetched vehicles:", data)
    return data as Vehicle[]
  }

  async createVehicle(
    userId: string,
    vehicleData: {
      name: string
      type: string
      balance: number
      contribution: number
      taxStatus: string | null
      growth: number | null
    },
  ): Promise<Vehicle> {
    console.log("DatabaseService.createVehicle: Attempting to create vehicle for user:", userId, "data:", vehicleData)
    const { data, error } = await this.supabase
      .from("vehicles")
      .insert({
        user_id: userId,
        name: vehicleData.name,
        type: vehicleData.type,
        balance: vehicleData.balance,
        contribution: vehicleData.contribution,
        tax_status: vehicleData.taxStatus,
        growth: vehicleData.growth,
      })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating vehicle:", error)
      throw new Error(error.message)
    }
    console.log("DatabaseService.createVehicle: Successfully created vehicle:", data)
    return data as Vehicle
  }

  async updateVehicle(
    id: string,
    userId: string,
    updates: Partial<Pick<Vehicle, "name" | "type" | "balance" | "contribution" | "taxStatus" | "growth">>,
  ): Promise<Vehicle> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.type !== undefined) dbUpdates.type = updates.type
    if (updates.balance !== undefined) dbUpdates.balance = updates.balance
    if (updates.contribution !== undefined) dbUpdates.contribution = updates.contribution
    if (updates.taxStatus !== undefined) dbUpdates.tax_status = updates.taxStatus
    if (updates.growth !== undefined) dbUpdates.growth = updates.growth
    const { data, error } = await this.supabase
      .from("vehicles")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating vehicle:", error)
      throw new Error(error.message)
    }
    return data as Vehicle
  }

  async deleteVehicle(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("vehicles").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting vehicle:", error)
      throw new Error(error.message)
    }
  }

  async fetchGoals(userId: string, filterType?: "Company" | "Team" | "My"): Promise<Goal[]> {
    let query = this.supabase.from("goals").select("*").order("created_at", { ascending: false })
    if (filterType === "My") {
      query = query.eq("user_id", userId)
    } else if (filterType === "Company") {
      query = query.eq("type", "company")
    } else if (filterType === "Team") {
      query = query.eq("type", "team")
    }
    const { data, error } = await query
    if (error) {
      console.error("Error fetching goals:", error)
      throw new Error(error.message)
    }
    return data as Goal[]
  }

  async createGoal(userId: string, goalData: Omit<Goal, "id" | "userId" | "createdAt">): Promise<Goal> {
    const { data, error } = await this.supabase
      .from("goals")
      .insert({
        user_id: userId,
        name: goalData.name,
        description: goalData.description,
        target_date: goalData.targetDate,
        status: goalData.status,
        priority: goalData.priority,
        company_id: goalData.companyId || null,
        team_id: goalData.teamId || null,
        type: goalData.type || "personal",
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating goal:", error)
      throw new Error(error.message)
    }
    return data as Goal
  }

  async updateGoal(
    id: string,
    userId: string,
    updates: Partial<Omit<Goal, "id" | "userId" | "createdAt">>,
  ): Promise<Goal> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority
    if (updates.companyId !== undefined) dbUpdates.company_id = updates.companyId
    if (updates.teamId !== undefined) dbUpdates.team_id = updates.teamId
    if (updates.type !== undefined) dbUpdates.type = updates.type
    const { data, error } = await this.supabase
      .from("goals")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating goal:", error)
      throw new Error(error.message)
    }
    return data as Goal
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("goals").delete().eq("id", id).eq("user_id", userId)
    if (error) {
      console.error("Error deleting goal:", error)
      throw new Error(error.message)
    }
  }

  async fetchCompanies(): Promise<Company[]> {
    const { data, error } = await this.supabase.from("companies").select("*").order("name", { ascending: true })
    if (error) {
      console.error("Error fetching companies:", error)
      return []
    }
    return data as Company[]
  }

  async fetchTeams(): Promise<Team[]> {
    const { data, error } = await this.supabase.from("teams").select("*").order("name", { ascending: true })
    if (error) {
      console.error("Error fetching teams:", error)
      return []
    }
    return data as Team[]
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      throw new Error(error.message)
    }
  }

  async createDailyPlan(userId: string, dailyPlan: {
    date: string
    goals: { id: string; type: string; name: string }[]
    typedGoals: { id: string; type: string; typedName: string }[]
    quote: string
    targets: { stepId: string; goalId: string }[]
    successes: string[]
    reviewTypedGoals: { id: string; type: string; typedName: string }[]
  }): Promise<DailyPlan> {
    const { data, error } = await this.supabase
      .from("daily_plans")
      .insert({
        user_id: userId,
        date: dailyPlan.date,
        goals: dailyPlan.goals,
        typed_goals: dailyPlan.typedGoals,
        quote: dailyPlan.quote || null,
        targets: dailyPlan.targets,
        successes: dailyPlan.successes,
        review_typed_goals: dailyPlan.reviewTypedGoals,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single()
    if (error) {
      console.error("Error creating daily plan:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      goals: data.goals,
      typedGoals: data.typed_goals,
      quote: data.quote,
      targets: data.targets,
      successes: data.successes,
      reviewTypedGoals: data.review_typed_goals,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as DailyPlan
  }

  async updateDailyPlan(id: string, userId: string, updates: {
    date?: string
    goals?: { id: string; type: string; name: string }[]
    typedGoals?: { id: string; type: string; typedName: string }[]
    quote?: string
    targets?: { stepId: string; goalId: string }[]
    successes?: string[]
    reviewTypedGoals?: { id: string; type: string; typedName: string }[]
  }): Promise<DailyPlan> {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.date !== undefined) dbUpdates.date = updates.date
    if (updates.goals !== undefined) dbUpdates.goals = updates.goals
    if (updates.typedGoals !== undefined) dbUpdates.typed_goals = updates.typedGoals
    if (updates.quote !== undefined) dbUpdates.quote = updates.quote
    if (updates.targets !== undefined) dbUpdates.targets = updates.targets
    if (updates.successes !== undefined) dbUpdates.successes = updates.successes
    if (updates.reviewTypedGoals !== undefined) dbUpdates.review_typed_goals = updates.reviewTypedGoals
    const { data, error } = await this.supabase
      .from("daily_plans")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single()
    if (error) {
      console.error("Error updating daily plan:", error)
      throw new Error(error.message)
    }
    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      goals: data.goals,
      typedGoals: data.typed_goals,
      quote: data.quote,
      targets: data.targets,
      successes: data.successes,
      reviewTypedGoals: data.review_typed_goals,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as DailyPlan
  }

  async fetchDailyPlan(userId: string, date: string): Promise<DailyPlan | null> {
    const { data, error } = await this.supabase
      .from("daily_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .single()
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching daily plan:", error)
      throw new Error(error.message)
    }
    if (!data) {
      return null
    }
    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      goals: data.goals,
      typedGoals: data.typed_goals,
      quote: data.quote,
      targets: data.targets,
      successes: data.successes,
      reviewTypedGoals: data.review_typed_goals,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as DailyPlan
  }
}

export const databaseService = new DatabaseService()