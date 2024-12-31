import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';
import type { Database } from './database.types';

export const supabase = createClient<Database>(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);