/**
 * Artist validation schemas
 * Uses stage_name (not 'name') per actual database schema
 */

import { z } from 'zod'

/**
 * Schema for creating a new artist
 */
export const createArtistSchema = z.object({
  stage_name: z
    .string()
    .min(2, 'Stage name must be at least 2 characters')
    .max(100, 'Stage name must be 100 characters or less'),
  bio: z.string().max(1000, 'Bio must be 1000 characters or less').nullish(),
  years_experience: z.number().int().min(0, 'Years must be 0 or greater').nullish(),
  hourly_rate: z.number().min(0, 'Rate must be 0 or greater').nullish(),
  has_equipment: z.boolean().optional(),
  is_public: z.boolean().optional(),
  website: z.string().url('Invalid URL').nullish(),
  instagram: z.string().max(100).nullish(),
  spotify: z.string().max(200).nullish(),
  soundcloud: z.string().max(200).nullish(),
})

/**
 * Schema for updating an existing artist
 * All fields optional for partial updates
 */
export const updateArtistSchema = createArtistSchema.partial()

export type CreateArtistInput = z.infer<typeof createArtistSchema>
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>
