/**
 * Mauna-app Supabase client
 *
 * Uses shared @cow/supabase-client package for consistent configuration
 * across the monorepo.
 */

export { supabase, createSupabaseClient } from "@cow/supabase-client"
export type { SupabaseClient, SupabaseConfig } from "@cow/supabase-client"