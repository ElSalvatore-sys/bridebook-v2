/**
 * Media Service
 * Handles CRUD operations for artist_media and venue_media DB records
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { handleSupabaseError } from '@/lib/errors'
import {
  createMediaRecordSchema,
  type CreateMediaRecordInput,
} from '@/lib/validations'

export type ArtistMedia = Tables<'artist_media'>
export type VenueMedia = Tables<'venue_media'>
export type MediaTable = 'artist_media' | 'venue_media'

/**
 * Get the FK column name for a media table
 */
function getEntityFk(table: MediaTable): 'artist_id' | 'venue_id' {
  return table === 'artist_media' ? 'artist_id' : 'venue_id'
}

export class MediaService {
  /**
   * Create a media record in the database
   */
  static async create(
    table: MediaTable,
    entityId: string,
    input: CreateMediaRecordInput
  ): Promise<ArtistMedia | VenueMedia> {
    const validated = createMediaRecordSchema.parse(input)
    const fk = getEntityFk(table)

    const insertData = {
      ...validated,
      [fk]: entityId,
    } as TablesInsert<typeof table>

    const { data, error } = await supabase
      .from(table)
      .insert(insertData)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Delete a media record and optionally its storage file
   */
  static async delete(table: MediaTable, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) handleSupabaseError(error)
  }

  /**
   * Update a media record (caption, sort_order, is_primary)
   */
  static async update(
    table: MediaTable,
    id: string,
    data: Partial<Pick<CreateMediaRecordInput, 'title' | 'description' | 'sort_order' | 'is_primary'>>
  ): Promise<ArtistMedia | VenueMedia> {
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return updated
  }

  /**
   * Get all media for an entity, ordered by sort_order
   */
  static async getByEntity(
    table: MediaTable,
    entityId: string
  ): Promise<(ArtistMedia | VenueMedia)[]> {
    const fk = getEntityFk(table)

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(fk, entityId)
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data ?? []
  }

  /**
   * Set a media record as the primary image for an entity
   * Unsets all other primary flags first
   */
  static async setPrimary(
    table: MediaTable,
    entityId: string,
    mediaId: string
  ): Promise<void> {
    const fk = getEntityFk(table)

    // Unset all primary flags for this entity
    const { error: unsetError } = await supabase
      .from(table)
      .update({ is_primary: false })
      .eq(fk, entityId)

    if (unsetError) handleSupabaseError(unsetError)

    // Set the target record as primary
    const { error: setError } = await supabase
      .from(table)
      .update({ is_primary: true })
      .eq('id', mediaId)

    if (setError) handleSupabaseError(setError)
  }
}
