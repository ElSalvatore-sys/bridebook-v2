/**
 * Profile validation schemas
 */

import { z } from 'zod'
import type { Enums } from '@/types/database'
import { germanPhoneSchema, urlSchema, passwordSchema } from './common'

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
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'City must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .optional()
    .or(z.literal('')),
  avatar_url: urlSchema,
  phone: germanPhoneSchema,
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * Schema for changing password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
