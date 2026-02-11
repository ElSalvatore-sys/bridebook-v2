/**
 * Vendor validation schemas tests
 * Comprehensive tests for booking requests and reviews
 */

import { describe, it, expect } from 'vitest'
import {
  createBookingRequestSchema,
  vendorReviewSchema,
} from '../vendor'

describe('Vendor Validation Schemas', () => {
  describe('createBookingRequestSchema', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const validRequest = {
      title: 'Summer DJ Night',
      event_date: tomorrowStr,
      start_time: '20:00',
      end_time: '23:00',
    }

    it('accepts valid booking request with required fields', () => {
      const result = createBookingRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('accepts request with all fields', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        description: 'Looking for a DJ for our summer event.',
        proposed_rate: 500,
      })
      expect(result.success).toBe(true)
    })

    it('trims title', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        title: '  Summer DJ Night  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Summer DJ Night')
      }
    })

    it('accepts various time formats in HH:MM', () => {
      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          start_time: '00:00',
          end_time: '23:59',
        }).success
      ).toBe(true)

      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          start_time: '08:30',
          end_time: '17:45',
        }).success
      ).toBe(true)
    })

    it('accepts proposed_rate of 0', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        proposed_rate: 0,
      })
      expect(result.success).toBe(true)
    })

    it('accepts proposed_rate up to 999999', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        proposed_rate: 999999,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty title', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        title: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects title over 200 characters', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        title: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is too long')
      }
    })

    it('rejects description over 2000 characters', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        description: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description is too long')
      }
    })

    it('rejects past event_date', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        event_date: '2020-01-01',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid start_time format', () => {
      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          start_time: '8pm',
        }).success
      ).toBe(false)

      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          start_time: '8:00',
        }).success
      ).toBe(false)

      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          start_time: '08:00:00',
        }).success
      ).toBe(false)
    })

    it('rejects invalid end_time format', () => {
      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          end_time: '11pm',
        }).success
      ).toBe(false)

      expect(
        createBookingRequestSchema.safeParse({
          ...validRequest,
          end_time: 'invalid',
        }).success
      ).toBe(false)
    })

    it('rejects negative proposed_rate', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        proposed_rate: -100,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Rate must be positive')
      }
    })

    it('rejects proposed_rate over 999999', () => {
      const result = createBookingRequestSchema.safeParse({
        ...validRequest,
        proposed_rate: 1000000,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('vendorReviewSchema', () => {
    const validReview = {
      vendor_id: '550e8400-e29b-41d4-a716-446655440000',
      rating_overall: 5,
      title: 'Excellent Service',
      body: 'The vendor provided outstanding service for our event. Highly professional and exceeded expectations.',
      would_recommend: true,
    }

    it('accepts valid review with required fields', () => {
      const result = vendorReviewSchema.safeParse(validReview)
      expect(result.success).toBe(true)
    })

    it('accepts review with all fields', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        booking_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        rating_quality: 5,
        rating_communication: 4,
        rating_value: 5,
        verified_booking: true,
      })
      expect(result.success).toBe(true)
    })

    it('applies default verified_booking of false', () => {
      const result = vendorReviewSchema.safeParse(validReview)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.verified_booking).toBe(false)
      }
    })

    it('accepts all valid rating values (1-5)', () => {
      for (let rating = 1; rating <= 5; rating++) {
        const result = vendorReviewSchema.safeParse({
          ...validReview,
          rating_overall: rating,
        })
        expect(result.success).toBe(true)
      }
    })

    it('accepts optional rating fields from 1-5', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        rating_quality: 3,
        rating_communication: 4,
        rating_value: 5,
      })
      expect(result.success).toBe(true)
    })

    it('accepts would_recommend as false', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        would_recommend: false,
      })
      expect(result.success).toBe(true)
    })

    it('accepts body exactly at minimum length (50 chars)', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        body: 'a'.repeat(50),
      })
      expect(result.success).toBe(true)
    })

    it('accepts body up to 2000 characters', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        body: 'a'.repeat(2000),
      })
      expect(result.success).toBe(true)
    })

    it('trims title', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        title: '  Great Service  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Great Service')
      }
    })

    it('rejects invalid vendor_id UUID', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        vendor_id: 'not-a-uuid',
      })
      expect(result.success).toBe(false)
    })

    it('rejects rating_overall less than 1', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        rating_overall: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Rating must be at least 1')
      }
    })

    it('rejects rating_overall greater than 5', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        rating_overall: 6,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Rating cannot exceed 5')
      }
    })

    it('rejects non-integer rating_overall', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        rating_overall: 4.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty title', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        title: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects title over 100 characters', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        title: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is too long')
      }
    })

    it('rejects empty body', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        body: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects body under 50 characters', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        body: 'Too short',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please write at least 50 characters')
      }
    })

    it('rejects body over 2000 characters', () => {
      const result = vendorReviewSchema.safeParse({
        ...validReview,
        body: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Review is too long')
      }
    })

    it('rejects optional rating fields outside 1-5 range', () => {
      expect(
        vendorReviewSchema.safeParse({
          ...validReview,
          rating_quality: 0,
        }).success
      ).toBe(false)

      expect(
        vendorReviewSchema.safeParse({
          ...validReview,
          rating_quality: 6,
        }).success
      ).toBe(false)
    })
  })
})
