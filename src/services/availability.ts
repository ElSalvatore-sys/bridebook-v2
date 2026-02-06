/**
 * Availability Service
 * Handles availability-related API operations
 */

import { supabase } from './supabase'
import type { Tables } from '@/types/database'
import { handleSupabaseError } from '@/lib/errors'

export type Availability = Tables<'availability'>

export class AvailabilityService {
  /**
   * Get availability slots for an artist, ordered by day_of_week + start_time
   */
  static async getByArtistId(artistId: string): Promise<Availability[]> {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('artist_id', artistId)
      .eq('is_available', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) handleSupabaseError(error)
    return data ?? []
  }
}
