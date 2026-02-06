/**
 * Event validation schemas
 * Event setup and configuration forms
 */

import { z } from 'zod'
import {
  requiredString,
  futureDateSchema,
  euroAmountSchema,
  uuidSchema,
} from './common'

/**
 * Event type options
 */
const eventTypes = [
  'concert',
  'festival',
  'private_party',
  'corporate',
  'club_night',
  'other',
] as const

/**
 * Create event schema (full setup)
 */
export const createEventSchema = z.object({
  event_name: requiredString('Event name').max(100, 'Event name is too long'),
  organizer_name: requiredString('Organizer name').max(100, 'Name is too long'),
  event_type: z
    .enum(eventTypes, { error: 'Please select an event type' })
    .optional(),
  event_date: futureDateSchema.optional(),
  venue_id: uuidSchema.optional(),
  budget_total: euroAmountSchema.optional(),
  guest_count_estimate: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10000, 'Guest count is too high')
    .optional(),
  description: z.string().max(2000, 'Description is too long').optional(),
})

/**
 * Update event schema (all optional)
 */
export const updateEventSchema = createEventSchema.partial()

/**
 * Quick setup schema (onboarding - minimal fields)
 */
export const quickEventSetupSchema = z.object({
  event_name: requiredString('Event name').max(100, 'Event name is too long'),
  organizer_name: requiredString('Organizer name').max(100, 'Name is too long'),
  event_date: futureDateSchema.optional(),
  guest_count_estimate: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10000, 'Guest count is too high')
    .optional(),
})

// Type exports
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type QuickEventSetupInput = z.infer<typeof quickEventSetupSchema>
export type EventType = (typeof eventTypes)[number]
