import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declare Deno variable

// Define interfaces for type safety
interface VisionBoardTask {
  id: number
  user_id: string
  target_task_list_id: string
  label: string
  duration: number | null
  color?: string
  icon?: string
  mantra?: string
  audio_url?: string
  audio_type?: string
  scheduled_move_at: string
}

interface NewTask {
  id: number
  user_id: string
  task_list_id: string
  label: string
  duration: number | null
  color: string
  icon: string
  completed: boolean
  locked: boolean
  mantra?: string
  audio_url?: string
  audio_type?: string
  position: number
  created_at: string
  updated_at: string
}

serve(async (req: Request) => {
  // Validate HTTP method
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  try {
    // @ts-ignore: Deno global is available in Edge runtime
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    )

    const { data: tasksToMove, error: fetchError } = await supabaseClient
      .from("vision_board_tasks")
      .select("*")
      .not("scheduled_move_at", "is", null)
      .not("target_task_list_id", "is", null)
      .lte("scheduled_move_at", new Date().toISOString())

    if (fetchError) {
      console.error("Error fetching tasks:", fetchError)
      return new Response("Error fetching tasks", { status: 500 })
    }

    if (!tasksToMove || tasksToMove.length === 0) {
      console.log("No tasks to move.")
      return new Response("No tasks to move", { status: 200 })
    }

    console.log(`Found ${tasksToMove.length} tasks to move.`)

    for (const vbTask of tasksToMove as VisionBoardTask[]) {
      try {
        const { data: newTask, error: insertError } = await supabaseClient
          .from("tasks")
          .insert({
            user_id: vbTask.user_id,
            task_list_id: vbTask.target_task_list_id,
            label: vbTask.label,
            duration: vbTask.duration,
            color: vbTask.color || "#60A5FA",
            icon: vbTask.icon || "Sparkles",
            completed: false,
            locked: false,
            mantra: vbTask.mantra,
            audio_url: vbTask.audio_url,
            audio_type: vbTask.audio_type,
            position: 99999,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error(`Error inserting task ${vbTask.id}:`, insertError)
          continue
        }

        console.log(`Moved task "${vbTask.label}" (VB ID: ${vbTask.id}) to tasks (New ID: ${(newTask as NewTask).id})`)

        const { error: deleteError } = await supabaseClient.from("vision_board_tasks").delete().eq("id", vbTask.id)

        if (deleteError) {
          console.error(`Error deleting task ${vbTask.id}:`, deleteError)
        } else {
          console.log(`Deleted vision board task ${vbTask.id}.`)
        }
      } catch (taskProcessError) {
        console.error(`Unexpected error processing task ${vbTask.id}:`, taskProcessError)
      }
    }

    return new Response("Task movement completed", { status: 200 })
  } catch (error) {
    console.error("Error in Edge Function:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
})
