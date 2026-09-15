import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization of the Supabase client.
 * Returns null if Supabase environment variables are not yet configured,
 * allowing the app to seamlessly fall back to local in-memory storage without crashing.
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('[Supabase] Successfully initialized Supabase client connected to:', supabaseUrl);
    } catch (err) {
      console.error('[Supabase] Failed to initialize Supabase client:', err);
    }
  }

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}
