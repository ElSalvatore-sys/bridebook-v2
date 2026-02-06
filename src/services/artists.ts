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

    const insertData: TablesInsert<'artists'> = {
      ...validated,
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

    const updateData: TablesUpdate<'artists'> = {
      ...validated,
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
}
