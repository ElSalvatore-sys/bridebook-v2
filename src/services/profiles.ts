/**
 * Profile Service
 * Handles all profile-related API operations
 */

import { supabase } from './supabase'
import type { Tables, TablesUpdate, Enums } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations'

export type Profile = Tables<'profiles'>
export type ProfileRole = Enums<'profile_role'>

interface PaginatedResult<T> {
  data: T[]
  count: number | null
}

export class ProfileService {
  /**
   * Get the current authenticated user's profile
   */
  static async getCurrent(): Promise<Profile> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Get a profile by ID
   */
  static async getById(id: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Update the current user's profile
   */
  static async update(input: UpdateProfileInput): Promise<Profile> {
    // Validate input
    const validated = updateProfileSchema.parse(input)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const updateData: TablesUpdate<'profiles'> = {
      ...validated,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Change the current user's password
   * Verifies current password first via signInWithPassword, then updates
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
      throw new UnauthorizedError('Not authenticated')
    }

    // Verify current password by attempting sign-in
    // Note: signInWithPassword refreshes auth tokens and triggers onAuthStateChange,
    // but since it's the same user the listener just redundantly re-fetches the profile
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (verifyError) {
      throw new Error('Current password is incorrect')
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) throw updateError
  }

  /**
   * Request account deletion
   * MVP: Signs out the user. Real deletion requires an Edge Function
   * with service_role key (Phase 16)
   */
  static async requestAccountDeletion(): Promise<void> {
    await supabase.auth.signOut({ scope: 'local' })
  }

  /**
   * Get profiles by role with pagination
   */
  static async getByRole(
    role: ProfileRole,
    options?: { limit?: number; offset?: number }
  ): Promise<PaginatedResult<Profile>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', role)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) handleSupabaseError(error)
    return { data: data ?? [], count }
  }
}
