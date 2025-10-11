/**
 * @cow/supabase-client
 *
 * Shared Supabase client for COW monorepo
 * Provides consistent configuration across all apps
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Configuration options for Supabase client
 */
export interface SupabaseConfig {
  /** Supabase project URL */
  url?: string;
  /** Supabase anonymous/public API key */
  anonKey?: string;
  /** Additional client options */
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    global?: {
      headers?: Record<string, string>;
    };
  };
}

/**
 * Default auth configuration used across all apps
 */
const DEFAULT_AUTH_CONFIG = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

/**
 * Create a configured Supabase client
 *
 * @param config - Optional configuration overrides
 * @returns Configured Supabase client instance
 * @throws Error if URL or key is missing
 *
 * @example
 * ```typescript
 * // Use default configuration from environment variables
 * const client = createSupabaseClient();
 *
 * // Override with custom config
 * const client = createSupabaseClient({
 *   url: 'https://custom.supabase.co',
 *   anonKey: 'custom-key'
 * });
 * ```
 */
export function createSupabaseClient(config?: SupabaseConfig): SupabaseClient {
  const url = config?.url ||
              process.env.NEXT_PUBLIC_SUPABASE_URL ||
              process.env.REACT_APP_SUPABASE_URL ||
              '';

  const key = config?.anonKey ||
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
              process.env.REACT_APP_SUPABASE_ANON_KEY ||
              '';

  if (!url || !key) {
    throw new Error(
      'Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      '(or REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY) must be set in environment variables'
    );
  }

  return createClient(url, key, {
    auth: {
      ...DEFAULT_AUTH_CONFIG,
      ...config?.options?.auth,
    },
    global: config?.options?.global,
  });
}

/**
 * Singleton Supabase client instance
 *
 * Shared across the application to ensure consistent session management
 * and avoid creating multiple client instances.
 *
 * @example
 * ```typescript
 * import { supabase } from '@cow/supabase-client';
 *
 * const { data, error } = await supabase
 *   .from('boards')
 *   .select('*');
 * ```
 */
export const supabase = createSupabaseClient();

/**
 * Re-export Supabase types for convenience
 */
export type { SupabaseClient } from '@supabase/supabase-js';
