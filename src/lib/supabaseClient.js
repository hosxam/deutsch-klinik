import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    console.warn('Supabase client initialization failed:', e.message);
    supabase = null;
  }
}

export function getSupabase() {
  return supabase;
}

export function isSupabaseConfigured() {
  return supabase !== null;
}

// Backward-compatible aliases
export { supabase };
export const isSupabaseEnabled = () => supabase !== null;

export { supabaseUrl, supabaseAnonKey };
