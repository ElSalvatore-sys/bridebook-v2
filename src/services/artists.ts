/**
 * Artist Service
 * Handles all artist-related API operations
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import {
  createArtistSchema,
  updateArtistSchema,
  type CreateArtistInput,
  type UpdateArtistInput,
} from '@/lib/validations'
import { sanitizeRichText } from '@/lib/sanitize'

export type Artist = Tables<'artists'>
export type ArtistGenre = Tables<'artist_genres'>
export type ArtistMedia = Tables<'artist_media'>
export type Genre = Tables<'genres'>

export interface ArtistWithDetails extends Artist {
  artist_genres: (ArtistGenre & { genres: Genre })[]
  artist_media: ArtistMedia[]
}

interface PaginatedResult<T> {
  data: T[]
  count: number | null
}

interface ListOptions {
  limit?: number
  offset?: number
  genreId?: string
}

export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'

export interface ArtistDiscoverOptions {
  searchQuery?: string
  genreIds?: string[]
  priceMin?: number
  priceMax?: number
  sortBy?: SortOption
  limit?: number
  offset?: number
}

export interface ArtistDiscoverResult {
  id: string
  stage_name: string
  bio: string | null
  hourly_rate: number | null
  years_experience: number | null
  has_equipment: boolean
  primary_image_url: string | null
  genre_names: string[]
}

export class ArtistService {
  /**
   * Create a new artist profile
   */
  static async create(input: CreateArtistInput): Promise<Artist> {
    // Validate input
    const validated = createArtistSchema.parse(input)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    // Sanitize bio to prevent XSS (allow safe HTML formatting)
    const sanitized = {
      ...validated,
      bio: validated.bio ? sanitizeRichText(validated.bio) : validated.bio,
    }

    const insertData: TablesInsert<'artists'> = {
      ...sanitized,
      profile_id: user.id,
    }

    const { data, error } = await supabase
      .from('artists')
      .insert(insertData)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Get an artist by ID with related data
   */
  static async getById(id: string): Promise<ArtistWithDetails> {
    const { data, error } = await supabase
      .from('artists')
      .select(
        `
        *,
        artist_genres (*, genres (*)),
        artist_media (*)
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .order('sort_order', { referencedTable: 'artist_media', ascending: true })
      .single()

    if (error) handleSupabaseError(error)
    return data as ArtistWithDetails
  }

  /**
   * Get artist by profile ID
   */
  static async getByProfileId(profileId: string): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('profile_id', profileId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * List artists with pagination and optional filtering
   */
  static async list(options?: ListOptions): Promise<PaginatedResult<Artist>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    // Filter by genre if provided - requires inner join
    if (options?.genreId) {
      const { data, error, count } = await supabase
        .from('artists')
        .select('*, artist_genres!inner(genre_id)', { count: 'exact' })
        .is('deleted_at', null)
        .eq('is_public', true)
        .eq('artist_genres.genre_id', options.genreId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) handleSupabaseError(error)
      // Strip the artist_genres from result to match Artist type
      const artists = (data ?? []).map(({ artist_genres: _, ...rest }) => rest)
      return { data: artists as Artist[], count }
    }

    const { data, error, count } = await supabase
      .from('artists')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) handleSupabaseError(error)
    return { data: data ?? [], count }
  }

  /**
   * Update an artist
   */
  static async update(id: string, input: UpdateArtistInput): Promise<Artist> {
    // Validate input
    const validated = updateArtistSchema.parse(input)

    // Sanitize bio to prevent XSS (allow safe HTML formatting)
    const sanitized = {
      ...validated,
      bio: validated.bio ? sanitizeRichText(validated.bio) : validated.bio,
    }

    const updateData: TablesUpdate<'artists'> = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('artists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Soft delete an artist
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('artists')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) handleSupabaseError(error)
  }

  /**
   * Search artists by stage name
   */
  static async search(
    query: string,
    options?: { limit?: number; offset?: number }
  ): Promise<PaginatedResult<Artist>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const { data, error, count } = await supabase
      .from('artists')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)
      .ilike('stage_name', `%${query}%`)
      .order('stage_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) handleSupabaseError(error)
    return { data: data ?? [], count }
  }

  /**
   * Get similar artists based on shared genres
   */
  static async getSimilar(
    artistId: string,
    limit = 4
  ): Promise<ArtistDiscoverResult[]> {
    // First get this artist's genre IDs
    const { data: genreRows } = await supabase
      .from('artist_genres')
      .select('genre_id')
      .eq('artist_id', artistId)

    const genreIds = genreRows?.map((g) => g.genre_id) ?? []

    if (genreIds.length === 0) {
      // No genres — fall back to latest public artists
      const { data, error } = await supabase
        .from('artists')
        .select(
          `
          id, stage_name, bio, hourly_rate, years_experience, has_equipment,
          artist_media!left (url, is_primary),
          artist_genres!left (genre_id, genres (name))
        `
        )
        .is('deleted_at', null)
        .eq('is_public', true)
        .neq('id', artistId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) handleSupabaseError(error)
      return ArtistService.transformToDiscoverResults(data ?? [])
    }

    // Find artists sharing genres, excluding self
    const { data, error } = await supabase
      .from('artists')
      .select(
        `
        id, stage_name, bio, hourly_rate, years_experience, has_equipment,
        artist_media!left (url, is_primary),
        artist_genres!inner (genre_id, genres (name))
      `
      )
      .is('deleted_at', null)
      .eq('is_public', true)
      .neq('id', artistId)
      .in('artist_genres.genre_id', genreIds)
      .limit(limit)

    if (error) handleSupabaseError(error)

    // Deduplicate (artist may share multiple genres)
    const seen = new Set<string>()
    const unique = (data ?? []).filter((a: Record<string, unknown>) => {
      const id = a.id as string
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })

    return ArtistService.transformToDiscoverResults(unique.slice(0, limit))
  }

  private static transformToDiscoverResults(
    data: Record<string, unknown>[]
  ): ArtistDiscoverResult[] {
    return data.map((artist) => {
      const media = artist.artist_media as Array<{ url: string; is_primary: boolean }> | null
      const primaryMedia = media?.find((m) => m.is_primary)

      const genreJoins = artist.artist_genres as Array<{ genres: { name: string } | null }> | null
      const genreNames =
        genreJoins?.map((g) => g.genres?.name).filter((n): n is string => !!n) ?? []

      return {
        id: artist.id as string,
        stage_name: artist.stage_name as string,
        bio: artist.bio as string | null,
        hourly_rate: artist.hourly_rate as number | null,
        years_experience: artist.years_experience as number | null,
        has_equipment: artist.has_equipment as boolean,
        primary_image_url: primaryMedia?.url ?? null,
        genre_names: [...new Set(genreNames)],
      }
    })
  }

  /**
   * Discover artists with full filtering, sorting, and pagination
   */
  static async discover(
    options?: ArtistDiscoverOptions
  ): Promise<PaginatedResult<ArtistDiscoverResult>> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const hasGenreFilter = options?.genreIds && options.genreIds.length > 0

    const selectString = hasGenreFilter
      ? `
        id, stage_name, bio, hourly_rate, years_experience, has_equipment, created_at,
        artist_media!left (url, is_primary),
        artist_genres!inner (genre_id, genres (name))
      `
      : `
        id, stage_name, bio, hourly_rate, years_experience, has_equipment, created_at,
        artist_media!left (url, is_primary),
        artist_genres!left (genre_id, genres (name))
      `

    let query = supabase
      .from('artists')
      .select(selectString, { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_public', true)

    // Search by stage name
    if (options?.searchQuery) {
      query = query.ilike('stage_name', `%${options.searchQuery}%`)
    }

    // Filter by genres
    if (hasGenreFilter) {
      query = query.in('artist_genres.genre_id', options!.genreIds!)
    }

    // Price range filter
    if (options?.priceMin !== undefined) {
      query = query.gte('hourly_rate', options.priceMin)
    }
    if (options?.priceMax !== undefined) {
      query = query.lte('hourly_rate', options.priceMax)
    }

    // Sorting
    switch (options?.sortBy) {
      case 'price_low':
        query = query.order('hourly_rate', { ascending: true, nullsFirst: false })
        break
      case 'price_high':
        query = query.order('hourly_rate', { ascending: false, nullsFirst: false })
        break
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

    // Transform to ArtistDiscoverResult
    const results: ArtistDiscoverResult[] = (data ?? []).map((artist: Record<string, unknown>) => {
      const media = artist.artist_media as Array<{ url: string; is_primary: boolean }> | null
      const primaryMedia = media?.find((m) => m.is_primary)

      const genreJoins = artist.artist_genres as Array<{ genres: { name: string } | null }> | null
      const genreNames = genreJoins
        ?.map((g) => g.genres?.name)
        .filter((n): n is string => !!n) ?? []

      return {
        id: artist.id as string,
        stage_name: artist.stage_name as string,
        bio: artist.bio as string | null,
        hourly_rate: artist.hourly_rate as number | null,
        years_experience: artist.years_experience as number | null,
        has_equipment: artist.has_equipment as boolean,
        primary_image_url: primaryMedia?.url ?? null,
        genre_names: [...new Set(genreNames)],
      }
    })

    return { data: results, count }
  }
}
