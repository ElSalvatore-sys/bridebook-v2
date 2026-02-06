/**
 * Venue Service
 * Handles all venue-related API operations
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert, TablesUpdate, Enums } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import {
  createVenueSchema,
  updateVenueSchema,
  type CreateVenueInput,
  type UpdateVenueInput,
} from '@/lib/validations'

export type Venue = Tables<'venues'>
export type VenueType = Enums<'venue_type'>
export type VenueAmenity = Tables<'venue_amenities'>
export type VenueMedia = Tables<'venue_media'>
export type Amenity = Tables<'amenities'>

export interface VenueWithDetails extends Venue {
  venue_amenities: (VenueAmenity & { amenities: Amenity })[]
  venue_media: VenueMedia[]
}

interface PaginatedResult<T> {
  data: T[]
  count: number | null
}

interface ListOptions {
  limit?: number
  offset?: number
  type?: VenueType
  cityId?: string
}

export class VenueService {
  /**
   * Create a new venue
   */
  static async create(input: CreateVenueInput): Promise<Venue> {
    // Validate input
    const validated = createVenueSchema.parse(input)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const insertData: TablesInsert<'venues'> = {
      ...validated,
      profile_id: user.id,
    }

    const { data, error } = await supabase
      .from('venues')
      .insert(insertData)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Get a venue by ID with related data
   */
  static async getById(id: string): Promise<VenueWithDetails> {
    const { data, error } = await supabase
      .from('venues')
      .select(
        `
        *,
        venue_amenities (*, amenities (*)),
        venue_media (*)
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) handleSupabaseError(error)
    return data as VenueWithDetails
  }

  /**
   * Get venue by profile ID
   */
  static async getByProfileId(profileId: string): Promise<Venue | null> {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('profile_id', profileId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * List venues with pagination and optional filtering
   */
  static async list(options?: ListOptions): Promise<PaginatedResult<Venue>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    let query = supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    // Filter by type
    if (options?.type) {
      query = query.eq('type', options.type)
    }

    // Filter by city
    if (options?.cityId) {
      query = query.eq('city_id', options.cityId)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) handleSupabaseError(error)
    return { data: data ?? [], count }
  }

  /**
   * Update a venue
   */
  static async update(id: string, input: UpdateVenueInput): Promise<Venue> {
    // Validate input
    const validated = updateVenueSchema.parse(input)

    const updateData: TablesUpdate<'venues'> = {
      ...validated,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Soft delete a venue
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('venues')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) handleSupabaseError(error)
  }

  /**
   * Search venues by name
   */
  static async search(
    query: string,
    options?: { limit?: number; offset?: number }
  ): Promise<PaginatedResult<Venue>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const { data, error, count } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)
      .ilike('venue_name', `%${query}%`)
      .order('venue_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) handleSupabaseError(error)
    return { data: data ?? [], count }
  }
}
