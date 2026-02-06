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

export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'

export interface VenueDiscoverOptions {
  searchQuery?: string
  venueTypes?: VenueType[]
  amenityIds?: string[]
  cityId?: string
  capacityMin?: number
  capacityMax?: number
  sortBy?: SortOption
  limit?: number
  offset?: number
}

export interface VenueDiscoverResult {
  id: string
  venue_name: string
  description: string | null
  type: VenueType
  city_name: string | null
  street: string | null
  capacity_min: number | null
  capacity_max: number | null
  primary_image_url: string | null
  amenity_names: string[]
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

  /**
   * Discover venues with full filtering, sorting, and pagination
   */
  static async discover(
    options?: VenueDiscoverOptions
  ): Promise<PaginatedResult<VenueDiscoverResult>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const hasAmenityFilter = options?.amenityIds && options.amenityIds.length > 0

    const selectString = hasAmenityFilter
      ? `
        id, venue_name, description, type, street, capacity_min, capacity_max, created_at,
        cities!left (name),
        venue_media!left (url, is_primary),
        venue_amenities!inner (amenity_id, amenities (name))
      `
      : `
        id, venue_name, description, type, street, capacity_min, capacity_max, created_at,
        cities!left (name),
        venue_media!left (url, is_primary),
        venue_amenities!left (amenity_id, amenities (name))
      `

    let query = supabase
      .from('venues')
      .select(selectString, { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)

    // Search by venue name
    if (options?.searchQuery) {
      query = query.ilike('venue_name', `%${options.searchQuery}%`)
    }

    // Filter by venue types
    if (options?.venueTypes && options.venueTypes.length > 0) {
      query = query.in('type', options.venueTypes)
    }

    // Filter by city
    if (options?.cityId) {
      query = query.eq('city_id', options.cityId)
    }

    // Filter by amenities
    if (hasAmenityFilter) {
      query = query.in('venue_amenities.amenity_id', options!.amenityIds!)
    }

    // Capacity filter
    if (options?.capacityMin !== undefined) {
      query = query.gte('capacity_max', options.capacityMin)
    }
    if (options?.capacityMax !== undefined) {
      query = query.lte('capacity_min', options.capacityMax)
    }

    // Sorting
    switch (options?.sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) handleSupabaseError(error)

    // Transform to VenueDiscoverResult
    const results: VenueDiscoverResult[] = (data ?? []).map((venue: Record<string, unknown>) => {
      const media = venue.venue_media as Array<{ url: string; is_primary: boolean }> | null
      const primaryMedia = media?.find((m) => m.is_primary)

      const city = venue.cities as { name: string } | null

      const amenityJoins = venue.venue_amenities as Array<{ amenities: { name: string } | null }> | null
      const amenityNames = amenityJoins
        ?.map((a) => a.amenities?.name)
        .filter((n): n is string => !!n) ?? []

      return {
        id: venue.id as string,
        venue_name: venue.venue_name as string,
        description: venue.description as string | null,
        type: venue.type as VenueType,
        city_name: city?.name ?? null,
        street: venue.street as string | null,
        capacity_min: venue.capacity_min as number | null,
        capacity_max: venue.capacity_max as number | null,
        primary_image_url: primaryMedia?.url ?? null,
        amenity_names: [...new Set(amenityNames)],
      }
    })

    return { data: results, count }
  }
}
