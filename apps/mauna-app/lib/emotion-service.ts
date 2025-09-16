import { createClient } from "@supabase/supabase-js"

export interface Emotion {
  id: string
  user_id: string
  emotion_name: string | null
  emotion_category: string | null
  intensity: number | null
  notes: string | null
  is_vaulted: boolean
  is_pain_box: boolean
  is_processed: boolean
  created_at: string
  updated_at: string

  // New fields for the emotional processing flow
  trigger_context: string | null
  trigger_event: string | null
  trigger_worldview: string | null
  physical_sensations: string | null
  subjective_feelings: string | null
  reflection: string | null
  response: string | null
  is_constructive: boolean | null
  pain_box_reasons: string[] | null
  current_step: "trigger" | "experience" | "vault" | "sit" | "respond" | "processed" | null
}

export interface CreateEmotionData {
  user_id: string
  emotion_name?: string | null
  emotion_category?: string | null
  intensity?: number | null
  notes?: string | null
  is_vaulted?: boolean
  is_pain_box?: boolean
  is_processed?: boolean
  trigger_context?: string | null
  trigger_event?: string | null
  trigger_worldview?: string | null
  physical_sensations?: string | null
  subjective_feelings?: string | null
  current_step: "trigger" | "experience" | "vault" | "sit" | "respond" | "processed" | null
}

export interface UpdateEmotionData {
  emotion_name?: string | null
  emotion_category?: string | null
  intensity?: number | null
  notes?: string | null
  is_vaulted?: boolean
  is_pain_box?: boolean
  is_processed?: boolean
  trigger_context?: string | null
  trigger_event?: string | null
  trigger_worldview?: string | null
  physical_sensations?: string | null
  subjective_feelings?: string | null
  reflection?: string | null
  response?: string | null
  is_constructive?: boolean | null
  pain_box_reasons?: string[] | null
  current_step?: "trigger" | "experience" | "vault" | "sit" | "respond" | "processed" | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const emotionService = {
  async createEmotion(data: CreateEmotionData): Promise<Emotion> {
    const { data: newEmotion, error } = await supabase
      .from("emotions")
      .insert({
        user_id: data.user_id,
        emotion_name: data.emotion_name,
        emotion_category: data.emotion_category,
        intensity: data.intensity,
        notes: data.notes,
        is_vaulted: data.is_vaulted,
        is_pain_box: data.is_pain_box,
        is_processed: data.is_processed,
        trigger_context: data.trigger_context,
        trigger_event: data.trigger_event,
        trigger_worldview: data.trigger_worldview,
        physical_sensations: data.physical_sensations,
        subjective_feelings: data.subjective_feelings,
        current_step: data.current_step,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating emotion:", error)
      throw new Error(error.message)
    }
    console.log("DB: Created emotion:", newEmotion)
    return newEmotion as Emotion
  },

  async getEmotions(userId: string): Promise<Emotion[]> {
    const { data, error } = await supabase
      .from("emotions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching emotions:", error)
      throw new Error(error.message)
    }
    console.log("DB: Fetched emotions for user", userId, data)
    return data as Emotion[]
  },

  async getEmotionById(emotionId: string, userId: string): Promise<Emotion | null> {
    const { data, error } = await supabase
      .from("emotions")
      .select("*")
      .eq("id", emotionId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error fetching emotion by ID:", error)
      throw new Error(error.message)
    }
    console.log("DB: Fetched emotion by ID", emotionId, data)
    return data as Emotion | null
  },

  async updateEmotion(emotionId: string, updates: UpdateEmotionData): Promise<Emotion> {
    const { data, error } = await supabase
      .from("emotions")
      .update({
        emotion_name: updates.emotion_name,
        emotion_category: updates.emotion_category,
        intensity: updates.intensity,
        notes: updates.notes,
        is_vaulted: updates.is_vaulted,
        is_pain_box: updates.is_pain_box,
        is_processed: updates.is_processed,
        trigger_context: updates.trigger_context,
        trigger_event: updates.trigger_event,
        trigger_worldview: updates.trigger_worldview,
        physical_sensations: updates.physical_sensations,
        subjective_feelings: updates.subjective_feelings,
        reflection: updates.reflection,
        response: updates.response,
        is_constructive: updates.is_constructive,
        pain_box_reasons: updates.pain_box_reasons,
        current_step: updates.current_step,
        updated_at: new Date().toISOString(), // Explicitly update timestamp
      })
      .eq("id", emotionId)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating emotion:", error)
      throw new Error(error.message)
    }
    console.log("DB: Updated emotion:", data)
    return data as Emotion
  },

  async deleteEmotion(emotionId: string, userId: string): Promise<void> {
    const { error } = await supabase.from("emotions").delete().eq("id", emotionId).eq("user_id", userId)

    if (error) {
      console.error("Error deleting emotion:", error)
      throw new Error(error.message)
    }
    console.log("DB: Deleted emotion:", emotionId)
  },
}
