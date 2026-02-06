/**
 * Wedding validation schemas
 * Wedding setup and configuration forms
 */

import { z } from 'zod'
import {
  requiredString,
  futureDateSchema,
  euroAmountSchema,
  germanPostalCodeSchema,
  uuidSchema,
} from './common'

/**
 * Wedding style options
 */
const weddingStyles = [
  'classic',
  'modern',
  'rustic',
  'bohemian',
  'glamorous',
  'minimalist',
  'other',
] as const

/**
 * Create wedding schema (full setup)
 */
export const createWeddingSchema = z.object({
  partner1_name: requiredString('Partner 1 name').max(100, 'Name is too long'),
  partner2_name: requiredString('Partner 2 name').max(100, 'Name is too long'),
  wedding_date: futureDateSchema.optional(),
  venue_id: uuidSchema.optional(),
  budget_total: euroAmountSchema.optional(),
  guest_count_estimate: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10000, 'Guest count is too high')
    .optional(),

  // Location
  ceremony_city: z.string().max(100, 'City name is too long').optional(),
  ceremony_postal_code: germanPostalCodeSchema,

  // Style preferences
  wedding_style: z
    .enum(weddingStyles, { error: 'Please select a wedding style' })
    .optional(),
  color_palette: z.array(z.string()).max(5, 'Maximum 5 colors').optional(),
})

/**
 * Update wedding schema (all optional)
 */
export const updateWeddingSchema = createWeddingSchema.partial()

/**
 * Quick setup schema (onboarding - minimal fields)
 */
export const quickSetupSchema = z.object({
  partner1_name: requiredString('Your name').max(100, 'Name is too long'),
  partner2_name: requiredString("Your partner's name").max(
    100,
    'Name is too long'
  ),
  wedding_date: futureDateSchema.optional(),
  guest_count_estimate: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10000, 'Guest count is too high')
    .optional(),
})

// Type exports
export type CreateWeddingInput = z.infer<typeof createWeddingSchema>
export type UpdateWeddingInput = z.infer<typeof updateWeddingSchema>
export type QuickSetupInput = z.infer<typeof quickSetupSchema>
