/**
 * Environment variable validation using Zod
 * Validates all required environment variables at app startup
 */

import { z } from 'zod'

/**
 * Environment variable schema
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z
    .string()
    .min(1, 'VITE_SUPABASE_URL is required')
    .url('VITE_SUPABASE_URL must be a valid URL')
    .refine(
      (url) => url.includes('supabase.co'),
      'VITE_SUPABASE_URL must be a Supabase URL (should include "supabase.co")'
    ),

  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(100, 'VITE_SUPABASE_ANON_KEY appears to be invalid (too short)')
    .min(1, 'VITE_SUPABASE_ANON_KEY is required'),

  VITE_APP_URL: z.string().url('VITE_APP_URL must be a valid URL').optional(),

  VITE_APP_NAME: z.string().optional(),

  VITE_SENTRY_DSN: z.string().url('VITE_SENTRY_DSN must be a valid URL').optional(),
})

/**
 * Validated environment variables type
 */
export type Env = z.infer<typeof envSchema>

/**
 * Cached validated environment
 */
let cachedEnv: Env | null = null

/**
 * Validate environment variables
 * Throws descriptive errors if validation fails
 *
 * @throws {Error} If environment variables are missing or invalid
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(import.meta.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((err) => {
        const path = err.path.join('.')
        return `  • ${path}: ${err.message}`
      })

      throw new Error(
        `❌ Environment validation failed:\n\n${messages.join('\n')}\n\n` +
          `Please check your .env file and ensure all required variables are set.\n` +
          `See .env.example for reference.`
      )
    }
    throw error
  }
}

/**
 * Get validated environment variables (cached)
 * Use this instead of import.meta.env to ensure type safety
 *
 * @returns Validated environment variables
 * @throws {Error} If environment variables are missing or invalid
 *
 * @example
 * import { getEnv } from '@/lib/env'
 *
 * const env = getEnv()
 * console.log(env.VITE_SUPABASE_URL) // Type-safe!
 */
export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv()
  }
  return cachedEnv
}
