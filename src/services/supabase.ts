import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getEnv } from '@/lib/env'

// Validate environment variables at startup
const env = getEnv()

export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
)
