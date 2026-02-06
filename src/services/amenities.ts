/**
 * Amenity Service
 * Handles amenity-related API operations
 */

import { supabase } from './supabase'
import type { Tables } from '@/types/database'
import { handleSupabaseError } from '@/lib/errors'

export type Amenity = Tables<'amenities'>

export class AmenityService {
  /**
   * List all amenities ordered by sort_order
   */
  static async list(): Promise<Amenity[]> {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data ?? []
  }
}
