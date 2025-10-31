/**
 * Shared Supabase client for products-site
 *
 * This file creates a single Supabase client instance with environment
 * variables that webpack can inject at build time.
 */

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@cow/supabase-client"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Debug logging
console.log('🔧 Supabase Client Init:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ MISSING',
  key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '❌ MISSING',
  fullUrl: supabaseUrl,
  env_NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
  env_REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? '✅' : '❌',
})

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase env vars!', { supabaseUrl, supabaseKey })
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with explicit config so webpack can inject env vars
console.log('🔧 Creating Supabase client...')
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
console.log('🔧 Supabase client created successfully', { hasAuth: !!supabase.auth })

// Re-export types for convenience
export type { Profile, Product, ProductTier } from "@cow/supabase-client"
