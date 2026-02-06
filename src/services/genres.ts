/**
 * Genre Service
 * Handles genre-related API operations
 */

import { supabase } from './supabase'
import type { Tables } from '@/types/database'
import { handleSupabaseError } from '@/lib/errors'

export type Genre = Tables<'genres'>

export class GenreService {
  /**
   * List all genres ordered by sort_order
   */
  static async list(): Promise<Genre[]> {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data ?? []
  }
}
