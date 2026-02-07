/**
 * Search Service
 * Full-text search across artists and venues via RPC functions
 */

import { supabase } from './supabase'
import { AppError, ErrorCode } from '@/lib/errors'
import type { Json } from '@/types/database'
import type { VenueType } from './venues'

export interface ArtistSearchResult {
  id: string
  stage_name: string
  bio: string | null
  hourly_rate: number | null
  years_experience: number | null
  has_equipment: boolean
  primary_image_url: string | null
  genre_names: string[]
  rank: number
}

export interface VenueSearchResult {
  id: string
  venue_name: string
  description: string | null
  type: VenueType
  city_name: string | null
  capacity_min: number | null
  capacity_max: number | null
  primary_image_url: string | null
  amenity_names: string[]
  rank: number
}

export interface CombinedSearchResults {
  artists: ArtistSearchResult[]
  venues: VenueSearchResult[]
}

export interface ArtistSearchFilters {
  genre_id?: string
  price_min?: number
  price_max?: number
}

export interface VenueSearchFilters {
  venue_type?: string
  city_id?: string
  capacity_min?: number
  capacity_max?: number
}

export class SearchService {
  static async searchArtists(
    query: string,
    filters?: ArtistSearchFilters,
    limit = 20,
    offset = 0
  ): Promise<ArtistSearchResult[]> {
    const { data, error } = await supabase.rpc('search_artists', {
      search_query: query,
      filters: (filters ?? {}) as unknown as Json,
      result_limit: limit,
      result_offset: offset,
    })

    if (error) {
      throw new AppError(
        error.message || 'Artist search failed',
        ErrorCode.UNKNOWN_ERROR,
        500
      )
    }

    return (data ?? []) as ArtistSearchResult[]
  }

  static async searchVenues(
    query: string,
    filters?: VenueSearchFilters,
    limit = 20,
    offset = 0
  ): Promise<VenueSearchResult[]> {
    const { data, error } = await supabase.rpc('search_venues', {
      search_query: query,
      filters: (filters ?? {}) as unknown as Json,
      result_limit: limit,
      result_offset: offset,
    })

    if (error) {
      throw new AppError(
        error.message || 'Venue search failed',
        ErrorCode.UNKNOWN_ERROR,
        500
      )
    }

    return (data ?? []) as VenueSearchResult[]
  }

  static async searchAll(
    query: string,
    limit = 10
  ): Promise<CombinedSearchResults> {
    const [artists, venues] = await Promise.all([
      SearchService.searchArtists(query, undefined, limit),
      SearchService.searchVenues(query, undefined, limit),
    ])

    return { artists, venues }
  }
}
