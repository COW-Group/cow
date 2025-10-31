/**
 * @cow/supabase-client
 *
 * Shared Supabase client for COW monorepo
 * Provides consistent configuration across all apps
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

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
export function createSupabaseClient(config?: SupabaseConfig): SupabaseClient<Database> {
  const url = config?.url ||
              process.env.NEXT_PUBLIC_SUPABASE_URL ||
              process.env.REACT_APP_SUPABASE_URL ||
              '';

  const key = config?.anonKey ||
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
              process.env.REACT_APP_SUPABASE_ANON_KEY ||
              '';

  // Debug logging
  console.log('🔧 Supabase Client Init:', {
    url: url ? `${url.substring(0, 30)}...` : '❌ MISSING',
    key: key ? `${key.substring(0, 20)}...` : '❌ MISSING',
    env_NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
    env_REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? '✅' : '❌',
  });

  if (!url || !key) {
    throw new Error(
      'Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      '(or REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY) must be set in environment variables'
    );
  }

  return createClient<Database>(url, key, {
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

/**
 * Re-export Database type and table types for convenience
 */
export type { Database } from './types';

// Convenient type exports for all tables
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductTier = Database['public']['Tables']['product_tiers']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Asset = Database['public']['Tables']['assets']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignParticipant = Database['public']['Tables']['campaign_participants']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type KYCApplication = Database['public']['Tables']['kyc_applications']['Row'];
export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type SupportMessage = Database['public']['Tables']['support_messages']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row'];
export type AuditLog = Database['public']['Tables']['audit_log']['Row'];
