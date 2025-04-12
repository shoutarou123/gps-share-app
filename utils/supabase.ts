import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase-database'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const supabaseUrl = process.env.VITE_SUPABASE_URL
