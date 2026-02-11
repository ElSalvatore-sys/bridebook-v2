/**
 * Enquiry validation schemas tests
 * Comprehensive tests for enquiry form submissions
 */

import { describe, it, expect } from 'vitest'
import { createEnquirySchema } from '../enquiry'

describe('Enquiry Validation Schemas', () => {
  describe('createEnquirySchema', () => {
    const validEnquiry = {
      entity_type: 'ARTIST' as const,
      artist_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I would like to book you for an upcoming event.',
    }

    it('accepts valid enquiry for artist', () => {
      const result = createEnquirySchema.safeParse(validEnquiry)
      expect(result.success).toBe(true)
    })

    it('accepts valid enquiry for venue', () => {
      const result = createEnquirySchema.safeParse({
        entity_type: 'VENUE',
        venue_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'I am interested in booking your venue for a wedding.',
      })
      expect(result.success).toBe(true)
    })

    it('accepts all valid enquiry types', () => {
      const types = ['BOOKING', 'PRICING', 'AVAILABILITY', 'GENERAL']
      types.forEach((enquiry_type) => {
        const result = createEnquirySchema.safeParse({
          ...validEnquiry,
          enquiry_type,
        })
        expect(result.success).toBe(true)
      })
    })

    it('applies default enquiry_type of GENERAL', () => {
      const result = createEnquirySchema.safeParse(validEnquiry)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.enquiry_type).toBe('GENERAL')
      }
    })

    it('accepts enquiry with phone and event_date', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        phone: '+4915112345678',
        event_date: '2026-06-15',
      })
      expect(result.success).toBe(true)
    })

    it('converts empty string phone to undefined', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        phone: '',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBeUndefined()
      }
    })

    it('converts empty string event_date to undefined', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        event_date: '',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.event_date).toBeUndefined()
      }
    })

    it('accepts null for optional fields', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        phone: null,
        event_date: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts message up to 2000 characters', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        message: 'a'.repeat(2000),
      })
      expect(result.success).toBe(true)
    })

    it('trims name', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        name: '  John Doe  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
      }
    })

    it('normalizes email to lowercase', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        email: 'JOHN@EXAMPLE.COM',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('accepts valid event_date in YYYY-MM-DD format', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        event_date: '2026-12-31',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid entity_type', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        entity_type: 'INVALID',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty name', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty message', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        message: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects message over 2000 characters', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        message: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message must be under 2000 characters')
      }
    })

    it('rejects invalid artist_id UUID', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        artist_id: 'not-a-uuid',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid venue_id UUID', () => {
      const result = createEnquirySchema.safeParse({
        entity_type: 'VENUE',
        venue_id: 'not-a-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Message',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid event_date format', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        event_date: '31-12-2026', // DD-MM-YYYY
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid enquiry_type', () => {
      const result = createEnquirySchema.safeParse({
        ...validEnquiry,
        enquiry_type: 'INVALID',
      })
      expect(result.success).toBe(false)
    })
  })
})
