/**
 * Location Service
 * Handles city and region lookups
 */

import { supabase } from './supabase'
import type { Tables } from '@/types/database'
import { handleSupabaseError } from '@/lib/errors'

export type City = Tables<'cities'>
export type Region = Tables<'regions'>

export interface CityWithRegion extends City {
  regions: Region
}

export class LocationService {
  /**
   * Get all cities with their region info
   */
  static async getCities(): Promise<CityWithRegion[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*, regions (*)')
      .order('name', { ascending: true })

    if (error) handleSupabaseError(error)
    return (data ?? []) as CityWithRegion[]
  }

  /**
   * Get all regions
   */
  static async getRegions(): Promise<Region[]> {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name', { ascending: true })

    if (error) handleSupabaseError(error)
    return data ?? []
  }
}
