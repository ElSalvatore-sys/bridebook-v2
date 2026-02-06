/**
 * API Client utilities
 * Re-exports supabase and provides common helpers
 */

import { supabase } from '@/services/supabase'
import { UnauthorizedError } from './errors'

export { supabase }
export type { Database } from '@/types/database'

/**
 * Get the current authenticated user's ID
 * @throws UnauthorizedError if not authenticated
 */
export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new UnauthorizedError('Not authenticated')
  }

  return user.id
}
