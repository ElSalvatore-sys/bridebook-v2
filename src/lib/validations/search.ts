/**
 * Search validation schemas
 */

import { z } from 'zod/v4'

export const searchQuerySchema = z.string().trim().min(2).max(100)

export const searchTypeSchema = z.enum(['all', 'artists', 'venues']).default('all')

export const artistSearchFilterSchema = z
  .object({
    genre_id: z.string().uuid().optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
  })
  .optional()

export const venueSearchFilterSchema = z
  .object({
    venue_type: z.string().optional(),
    city_id: z.string().uuid().optional(),
    capacity_min: z.number().int().min(0).optional(),
    capacity_max: z.number().int().min(0).optional(),
  })
  .optional()

export type SearchQuery = z.infer<typeof searchQuerySchema>
export type SearchType = z.infer<typeof searchTypeSchema>
export type ArtistSearchFilters = z.infer<typeof artistSearchFilterSchema>
export type VenueSearchFilters = z.infer<typeof venueSearchFilterSchema>
