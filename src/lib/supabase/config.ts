const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const SUPABASE_CONFIG = {
  url: VITE_SUPABASE_URL,
  anonKey: VITE_SUPABASE_ANON_KEY,
} as const;