/**
 * Venue validation schemas
 * Uses venue_name, street/postal_code/city_id, capacity_min/max per actual DB schema
 * Note: phone is on profiles, not venues
 */

import { z } from 'zod'
import { Constants } from '@/types/database'

const venueTypes = Constants.public.Enums.venue_type

/**
 * Schema for creating a new venue
 */
export const createVenueSchema = z.object({
  venue_name: z
    .string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must be 100 characters or less'),
  type: z.enum(venueTypes, {
    error: 'Invalid venue type',
  }),
  description: z.string().max(1000, 'Description must be 1000 characters or less').nullish(),
  street: z.string().max(200, 'Street must be 200 characters or less').nullish(),
  postal_code: z.string().max(20, 'Postal code must be 20 characters or less').nullish(),
  city_id: z.string().uuid('Invalid city ID').nullish(),
  capacity_min: z.number().int().min(1, 'Minimum capacity must be at least 1').nullish(),
  capacity_max: z
    .number()
    .int()
    .min(1, 'Maximum capacity must be at least 1')
    .nullish(),
  is_public: z.boolean().optional(),
  website: z.string().url('Invalid URL').nullish(),
  instagram: z.string().max(100).nullish(),
})

/**
 * Schema for updating an existing venue
 * All fields optional for partial updates
 */
export const updateVenueSchema = createVenueSchema.partial()

export type CreateVenueInput = z.infer<typeof createVenueSchema>
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>
