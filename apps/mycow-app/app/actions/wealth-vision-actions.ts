"use server"

import { createAuthenticatedSupabaseServerClient } from "@/lib/supabase/server"
import type {
  Mountain,
  Hill,
  Terrain,
  Length,
  Step,
  Breath,
  Range, // Updated types
} from "@/types/wealth-vision"
import { revalidatePath } from "next/cache"

export async function getRanges(): Promise<Range[]> {
  // Updated type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated")
    return []
  }
  const { data, error } = await supabase
    .from("ranges") // Use new table name 'ranges'
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching ranges:", error.message)
    return []
  }
  revalidatePath("/compass/wealth-vision")
  return data as Range[] // Updated type
}

export async function addRange(title: string): Promise<Range | null> {
  // Updated type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding range")
    return null
  }
  const { data, error } = await supabase
    .from("ranges") // Use new table name 'ranges'
    .insert([
      {
        name: title,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding range:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Range // Updated type
}

export async function updateRange(id: string, newTitle: string): Promise<Range | null> {
  // Updated type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating range")
    return null
  }

  const { data, error } = await supabase
    .from("ranges") // Use new table name 'ranges'
    .update({ name: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating range:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Range // Updated type
}

export async function getMountainsByRangeId(rangeId: string): Promise<Mountain[]> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("mountains")
    .select("*")
    .eq("range_id", rangeId)
    .order("position", { ascending: true })

  if (error) console.error("Error fetching mountains:", error.message)
  return data || []
}

export async function addMountain(rangeId: string, title: string): Promise<Mountain | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding mountain")
    return null
  }

  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("mountains")
    .select("position")
    .eq("range_id", rangeId)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1
  const { data, error } = await supabase
    .from("mountains")
    .insert([
      {
        range_id: rangeId,
        title: title,
        position: newPosition,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding mountain:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Mountain
}

export async function updateMountain(id: string, newTitle: string): Promise<Mountain | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating mountain")
    return null
  }

  const { data, error } = await supabase
    .from("mountains")
    .update({ title: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating mountain:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Mountain
}

export async function getHillsByMountainId(mountainId: string): Promise<Hill[]> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("hills")
    .select("*")
    .eq("mountain_id", mountainId)
    .order("position", { ascending: true })

  if (error) console.error("Error fetching hills:", error.message)
  return data || []
}

export async function addHill(mountainId: string, title: string): Promise<Hill | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding hill")
    return null
  }
  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("hills")
    .select("position")
    .eq("mountain_id", mountainId)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1
  const { data, error } = await supabase
    .from("hills")
    .insert([
      {
        mountain_id: mountainId,
        title: title,
        position: newPosition,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding hill:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Hill
}

export async function updateHill(id: string, newTitle: string): Promise<Hill | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating hill")
    return null
  }

  const { data, error } = await supabase
    .from("hills")
    .update({ title: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating hill:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Hill
}

export async function getTerrainsByHillId(hillId: string): Promise<Terrain[]> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("terrains")
    .select("*")
    .eq("hill_id", hillId)
    .order("position", { ascending: true })

  if (error) console.error("Error fetching terrains:", error.message)
  return data || []
}

export async function addTerrain(hillId: string, title: string): Promise<Terrain | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding terrain")
    return null
  }

  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("terrains")
    .select("position")
    .eq("hill_id", hillId)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1

  const { data, error } = await supabase
    .from("terrains")
    .insert([{ hill_id: hillId, title: title, position: newPosition, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error("Error adding terrain:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Terrain
}

export async function updateTerrain(id: string, newTitle: string): Promise<Terrain | null> {
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating terrain")
    return null
  }

  const { data, error } = await supabase
    .from("terrains")
    .update({ title: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating terrain:", error.message)
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Terrain
}

// IMPORTANT: Using 'lengths' table name as per provided schema
export async function getLengthsByTerrainId(terrainId: string): Promise<Length[]> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("lengths") // Use new table name 'lengths'
    .select("*")
    .eq("terrain_id", terrainId)
    .order("position", { ascending: true })

  if (error) console.error("Error fetching lengths:", error.message) // Updated message
  return data || []
}

// New Server Action: Add Length
export async function addLength(terrainId: string, title: string): Promise<Length | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding length") // Updated message
    return null
  }

  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("lengths") // Use new table name 'lengths'
    .select("position")
    .eq("terrain_id", terrainId)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1

  const { data, error } = await supabase
    .from("lengths") // Use new table name 'lengths'
    .insert([{ terrain_id: terrainId, title: title, position: newPosition, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error("Error adding length:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Length // Updated type
}

// New Server Action: Update Length
export async function updateLength(id: string, newTitle: string): Promise<Length | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating length") // Updated message
    return null
  }

  const { data, error } = await supabase
    .from("lengths") // Use new table name 'lengths'
    .update({ title: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating length:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Length // Updated type
}

// IMPORTANT: Using 'steps' table name and 'length_id' as per provided schema
export async function getStepsByLengthId(lengthId: string): Promise<Step[]> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("steps") // Use new table name 'steps'
    .select("*")
    .eq("length_id", lengthId) // Corrected foreign key
    .order("position", { ascending: true })

  if (error) console.error("Error fetching steps:", error.message) // Updated message
  return data || []
}

// New Server Action: Add Step
export async function addStep(lengthId: string, title: string): Promise<Step | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding step") // Updated message
    return null
  }

  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("steps") // Use new table name 'steps'
    .select("position")
    .eq("length_id", lengthId) // Corrected foreign key
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1

  const { data, error } = await supabase
    .from("steps") // Use new table name 'steps'
    .insert([{ length_id: lengthId, title: title, position: newPosition, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error("Error adding step:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Step // Updated type
}

// New Server Action: Update Step
export async function updateStep(id: string, newTitle: string): Promise<Step | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating step") // Updated message
    return null
  }

  const { data, error } = await supabase
    .from("steps") // Use new table name 'steps'
    .update({ title: newTitle })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating step:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Step // Updated type
}

// IMPORTANT: Using 'breaths' table name and 'step_id' as per provided schema
export async function getBreathsByStepId(stepId: string): Promise<Breath[]> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const { data, error } = await supabase
    .from("breaths") // Use new table name 'breaths'
    .select("*")
    .eq("step_id", stepId) // Corrected foreign key
    .order("position", { ascending: true })

  if (error) console.error("Error fetching breaths:", error.message) // Updated message
  return data || []
}

// New Server Action: Add Breath
export async function addBreath(stepId: string, title: string): Promise<Breath | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for adding breath") // Updated message
    return null
  }

  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("breaths") // Use new table name 'breaths'
    .select("position")
    .eq("step_id", stepId) // Corrected foreign key
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionData ? maxPositionData.position + 1 : 1

  const { data, error } = await supabase
    .from("breaths") // Use new table name 'breaths'
    .insert([
      {
        step_id: stepId, // Corrected foreign key
        label: title,
        position: newPosition,
        completed: false,
        total_time_seconds: 0,
        time_estimation_seconds: 0,
        paused_time: 0,
        is_running: false,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding breath:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Breath // Updated type
}

// New Server Action: Update Breath
export async function updateBreath(id: string, newLabel: string): Promise<Breath | null> {
  // Updated function name and type
  const supabase = createAuthenticatedSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("User not authenticated for updating breath") // Updated message
    return null
  }

  const { data, error } = await supabase
    .from("breaths") // Use new table name 'breaths'
    .update({ label: newLabel })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating breath:", error.message) // Updated message
    return null
  }
  revalidatePath("/compass/wealth-vision")
  return data as Breath // Updated type
}
