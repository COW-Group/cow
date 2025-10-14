// Debug utility to check Supabase configuration
export function debugSupabaseConfig() {
  console.log('🔍 Supabase Configuration Debug:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
  console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  }
  if (process.env.REACT_APP_SUPABASE_URL) {
    console.log('URL value (REACT_APP):', process.env.REACT_APP_SUPABASE_URL);
  }
}
