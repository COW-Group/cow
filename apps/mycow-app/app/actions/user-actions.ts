"use server"

import { createAuthenticatedSupabaseServerClient } from "@/lib/supabase/server"
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

// Get user birthday from public.user_data table
export async function getUserBirthday(): Promise<string | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase.from("user_data").select("birthday").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 means "No rows found"
    console.error("Error fetching user birthday:", error.message)
    return null
  }

  return data?.birthday || null
}

// Save user birthday to public.user_data table
export async function saveUserBirthday(birthday: string): Promise<boolean> {
  const { data: authUserData, error: authUserError } = await supabase.auth.getUser()

  if (authUserError || !authUserData.user) {
    console.error("Error getting authenticated user data:", authUserError?.message)
    return false
  }

  const userId = authUserData.user.id

  // Prepare the data for upsert into user_data table
  const upsertData = {
    user_id: userId,
    birthday: birthday,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("user_data").upsert(upsertData, {
    onConflict: "user_id", // Conflict on 'user_id' to perform update if row exists, insert if not
  })

  if (error) {
    console.error("Error saving user birthday:", error.message)
    return false
  }

  revalidatePath("/")
  return true
}
