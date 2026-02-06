/**
 * Profile validation schemas
 * Matches the profiles table structure (no bio field)
 */

import { z } from 'zod'
import type { Enums } from '@/types/database'

/**
 * Profile role type from database
 */
export type ProfileRole = Enums<'profile_role'>

/**
 * Schema for updating profile data
 * All fields optional for partial updates
 */
export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less')
    .optional(),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less')
    .optional(),
  avatar_url: z.string().url('Invalid URL').nullish(),
  phone: z.string().max(20, 'Phone must be 20 characters or less').nullish(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
