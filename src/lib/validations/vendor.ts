/**
 * Vendor validation schemas
 * Enquiry form (critical conversion!) and review form
 */

import { z } from 'zod'
import {
  requiredString,
  emailSchema,
  germanPhoneSchema,
  futureDateSchema,
  uuidSchema,
} from './common'

/**
 * Budget range options for enquiry form
 */
const budgetRanges = [
  'under_1000',
  '1000_2500',
  '2500_5000',
  '5000_10000',
  'over_10000',
] as const

/**
 * Booking enquiry form schema
 * CRITICAL CONVERSION FORM - keep fields minimal but useful
 */
export const bookingEnquirySchema = z.object({
  // Contact info
  name: requiredString('Your name').max(100, 'Name is too long'),
  email: emailSchema,
  phone: germanPhoneSchema,

  // Event details
  event_date: futureDateSchema,
  guest_count: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'Guest count is required')
    .max(10000, 'Guest count is too high'),

  // Budget
  budget_range: z.enum(budgetRanges, {
    error: 'Please select a budget range',
  }),

  // Message
  message: requiredString('Message')
    .min(20, 'Please provide more details (at least 20 characters)')
    .max(2000, 'Message is too long'),

  // Preferences
  flexible_on_date: z.boolean().default(false),

  // Optional event reference (if logged in)
  event_id: uuidSchema.optional(),
})

/**
 * Vendor review schema
 */
export const vendorReviewSchema = z.object({
  vendor_id: uuidSchema,
  booking_id: uuidSchema.optional(),

  // Ratings (1-5)
  rating_overall: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  rating_quality: z.number().int().min(1).max(5).optional(),
  rating_communication: z.number().int().min(1).max(5).optional(),
  rating_value: z.number().int().min(1).max(5).optional(),

  // Review text
  title: requiredString('Review title').max(100, 'Title is too long'),
  body: requiredString('Review')
    .min(50, 'Please write at least 50 characters')
    .max(2000, 'Review is too long'),

  // Recommendation
  would_recommend: z.boolean(),

  // Verification
  verified_booking: z.boolean().default(false),
})

// Type exports
export type BookingEnquiryInput = z.infer<typeof bookingEnquirySchema>
export type VendorReviewInput = z.infer<typeof vendorReviewSchema>
export type BudgetRange = (typeof budgetRanges)[number]
