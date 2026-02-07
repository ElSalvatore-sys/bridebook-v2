/**
 * Media & file upload validation schemas
 */

import { z } from 'zod'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

/**
 * Base file upload validation
 */
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().positive('File size must be positive'),
  type: z.string().refine((t) => ALLOWED_IMAGE_TYPES.includes(t), {
    message: 'File type not supported. Use JPEG, PNG, WebP, or GIF.',
  }),
})

/**
 * Avatar-specific validation (5MB max)
 */
export const avatarUploadSchema = fileUploadSchema.extend({
  size: z.number().max(5 * 1024 * 1024, 'Avatar must be under 5MB'),
})

/**
 * Media-specific validation (10MB max)
 */
export const mediaUploadSchema = fileUploadSchema.extend({
  size: z.number().max(10 * 1024 * 1024, 'Image must be under 10MB'),
})

/**
 * Schema for creating a media DB record (artist_media / venue_media)
 */
export const createMediaRecordSchema = z.object({
  url: z.string().url('Valid URL is required'),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO'], {
    error: 'Media type must be IMAGE, VIDEO, or AUDIO',
  }),
  title: z.string().max(200, 'Title must be 200 characters or less').optional(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  sort_order: z.number().int().min(0).default(0),
  is_primary: z.boolean().default(false),
})

export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type CreateMediaRecordInput = z.infer<typeof createMediaRecordSchema>
