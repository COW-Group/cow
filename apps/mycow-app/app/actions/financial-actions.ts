"use server"

import { createAuthenticatedSupabaseServerClient } from "@/lib/supabase/server"
import type {
  FinancialInflow,
  FinancialOutflow,
  Range, // Renamed from VisionBoardSection
  Mountain,
  Hill,
  Terrain,
  Length, // Renamed from Milestone
  Step, // Renamed from Task
  Breath, // Renamed from MicroTask
} from "@/lib/types" // Ensure types are correctly imported from lib/types or types/wealth-vision
import { revalidatePath } from "next/cache"

const supabase = createAuthenticatedSupabaseServerClient()

// Helper to get user ID
async function getUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated")
    return null
  }
  return user.id
}

// Inflow actions
export async function getFinancialInflows(): Promise<FinancialInflow[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from("financial_inflows")
    .select(`*, category_name:ranges(name)`) // Fetch category name via join, using 'ranges'
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching financial inflows:", error.message)
    return []
  }

  return data.map((item) => ({
    ...item,
    category_name: item.category_name ? item.category_name.name : null, // Extract name from joined object
  })) as FinancialInflow[]
}

export async function addFinancialInflow(
  inflow: Omit<FinancialInflow, "id" | "user_id" | "created_at" | "updated_at" | "category_name">,
): Promise<FinancialInflow | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from("financial_inflows")
    .insert([
      {
        ...inflow,
        user_id: userId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding financial inflow:", error.message)
    return null
  }

  revalidatePath("/financial/income")
  revalidatePath("/financial/assets")
  return data as FinancialInflow
}

export async function updateFinancialInflow(
  id: string,
  updates: Partial<Omit<FinancialInflow, "user_id" | "created_at" | "updated_at" | "category_name">>,
): Promise<FinancialInflow | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from("financial_inflows")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating financial inflow:", error.message)
    return null
  }

  revalidatePath("/financial/income")
  revalidatePath("/financial/assets")
  return data as FinancialInflow
}

export async function deleteFinancialInflow(id: string): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  const { error } = await supabase.from("financial_inflows").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting financial inflow:", error.message)
    return false
  }

  revalidatePath("/financial/income")
  revalidatePath("/financial/assets")
  return true
}

// Outflow actions
export async function getFinancialOutflows(): Promise<FinancialOutflow[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from("financial_outflows")
    .select(`*, category_name:ranges(name)`) // Fetch category name via join, using 'ranges'
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching financial outflows:", error.message)
    return []
  }

  // Map to include goal_item_name based on goal_vision_level and goal_vision_item_id
  const outflowsWithNames = await Promise.all(
    data.map(async (item) => {
      let goalItemName: string | null = null
      if (item.goal_vision_level && item.goal_vision_item_id) {
        let tableName: string | null = null
        let titleColumn = "title" // Default for most tables
        switch (item.goal_vision_level) {
          case "Mountain":
            tableName = "mountains"
            break
          case "Hill":
            tableName = "hills"
            break
          case "Terrain":
            tableName = "terrains"
            break
          case "Length": // Renamed from Milestone
            tableName = "lengths"
            break
          case "Step": // Renamed from Task
            tableName = "steps"
            break
          case "Breath": // Renamed from MicroTask
            tableName = "breaths"
            titleColumn = "label"
            break
          default:
            break
        }

        if (tableName) {
          const { data: goalItemData, error: goalItemError } = await supabase
            .from(tableName)
            .select(titleColumn)
            .eq("id", item.goal_vision_item_id)
            .single()

          if (goalItemData && !goalItemError) {
            goalItemName = goalItemData[titleColumn]
          } else if (goalItemError) {
            console.error(
              `Error fetching goal item for ${item.goal_vision_level} ${item.goal_vision_item_id}:`,
              goalItemError.message,
            )
          }
        }
      }

      return {
        ...item,
        category_name: item.category_name ? item.category_name.name : null,
        goal_item_name: goalItemName,
      }
    }),
  )

  return outflowsWithNames as FinancialOutflow[]
}

export async function addFinancialOutflow(
  outflow: Omit<FinancialOutflow, "id" | "user_id" | "created_at" | "updated_at" | "category_name" | "goal_item_name">,
): Promise<FinancialOutflow | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from("financial_outflows")
    .insert([
      {
        ...outflow,
        user_id: userId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding financial outflow:", error.message)
    return null
  }

  revalidatePath("/financial/expenses")
  revalidatePath("/financial/liabilities")
  revalidatePath("/financial/goals")
  return data as FinancialOutflow
}

export async function updateFinancialOutflow(
  id: string,
  updates: Partial<
    Omit<FinancialOutflow, "user_id" | "created_at" | "updated_at" | "category_name" | "goal_item_name">
  >,
): Promise<FinancialOutflow | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from("financial_outflows")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating financial outflow:", error.message)
    return null
  }

  revalidatePath("/financial/expenses")
  revalidatePath("/financial/liabilities")
  revalidatePath("/financial/goals")
  return data as FinancialOutflow
}

export async function deleteFinancialOutflow(id: string): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  const { error } = await supabase.from("financial_outflows").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting financial outflow:", error.message)
    return false
  }

  revalidatePath("/financial/expenses")
  revalidatePath("/financial/liabilities")
  revalidatePath("/financial/goals")
  return true
}

// Get filtered data for Sankey based on time period
export async function getFinancialDataForPeriod(startDate: string, endDate: string) {
  const userId = await getUserId()
  if (!userId) return { inflows: [], outflows: [] }

  // Get inflows that are active and fall within the period
  const { data: inflows, error: inflowError } = await supabase
    .from("financial_inflows")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`inflow_arrival_date.gte.${startDate},inflow_arrival_date.is.null`)
    .or(`inflow_arrival_date.lte.${endDate},inflow_arrival_date.is.null`)

  // Get outflows that are active and fall within the period
  const { data: outflows, error: outflowError } = await supabase
    .from("financial_outflows")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`payment_date.gte.${startDate},payment_date.is.null`)
    .or(`payment_date.lte.${endDate},payment_date.is.null`)

  if (inflowError) {
    console.error("Error fetching inflows for period:", inflowError.message)
  }
  if (outflowError) {
    console.error("Error fetching outflows for period:", outflowError.message)
  }

  return {
    inflows: (inflows as FinancialInflow[]) || [],
    outflows: (outflows as FinancialOutflow[]) || [],
  }
}

// New: Fetch all Ranges for category dropdowns
export async function getAllRanges(): Promise<Range[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from("ranges") // Use new table name 'ranges'
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching all ranges:", error.message)
    return []
  }
  return data as Range[]
}

// New: Fetch items for a specific Wealth Vision level
export async function getVisionItemsByLevel(
  level: FinancialOutflow["goal_vision_level"],
  parentId?: string, // For hierarchical levels
): Promise<Array<Mountain | Hill | Terrain | Length | Step | Breath>> {
  // Updated types
  const userId = await getUserId()
  if (!userId) return []

  let query
  let tableName: string | null = null
  let titleColumn = "title" // Default for most tables

  switch (level) {
    case "Mountain":
      tableName = "mountains"
      query = supabase.from(tableName).select("*").eq("user_id", userId)
      if (parentId) query = query.eq("range_id", parentId)
      break
    case "Hill":
      tableName = "hills"
      query = supabase.from(tableName).select("*").eq("user_id", userId) // Hills now have user_id
      if (parentId) query = query.eq("mountain_id", parentId)
      break
    case "Terrain":
      tableName = "terrains"
      query = supabase.from(tableName).select("*").eq("user_id", userId) // Terrains now have user_id
      if (parentId) query = query.eq("hill_id", parentId)
      break
    case "Length": // Renamed from Milestone
      tableName = "lengths" // Use new table name
      query = supabase.from(tableName).select("*").eq("user_id", userId)
      if (parentId) query = query.eq("terrain_id", parentId)
      break
    case "Step": // Renamed from Task
      tableName = "steps" // Use new table name
      query = supabase.from(tableName).select("*").eq("user_id", userId)
      if (parentId) query = query.eq("length_id", parentId) // Assuming foreign key changed to length_id
      break
    case "Breath": // Renamed from MicroTask
      tableName = "breaths" // Use new table name
      titleColumn = "label"
      query = supabase.from(tableName).select("*").eq("user_id", userId)
      if (parentId) query = query.eq("step_id", parentId) // Assuming foreign key changed to step_id
      break
    default:
      return []
  }

  const { data, error } = await query.order("position", { ascending: true })

  if (error) {
    console.error(`Error fetching ${level}s:`, error.message)
    return []
  }

  // Map to a common structure for the dropdown, using 'title' or 'label' as 'name'
  return data.map((item) => ({
    id: item.id,
    name: item[titleColumn], // Use titleColumn for the name
    ...item,
  }))
}
