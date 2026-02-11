/**
 * Venue validation schemas tests
 * Comprehensive tests for venue creation and updates
 */

import { describe, it, expect } from 'vitest'
import {
  createVenueSchema,
  updateVenueSchema,
} from '../venue'

describe('Venue Validation Schemas', () => {
  describe('createVenueSchema', () => {
    it('accepts valid venue with required fields', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Grand Ballroom',
        type: 'EVENT_SPACE',
      })
      expect(result.success).toBe(true)
    })

    it('accepts venue with all fields', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Grand Ballroom',
        type: 'EVENT_SPACE',
        description: 'A beautiful event space in the heart of the city',
        street: 'Hauptstraße 123',
        postal_code: '65183',
        city_id: '550e8400-e29b-41d4-a716-446655440000',
        capacity_min: 50,
        capacity_max: 500,
        is_public: true,
        website: 'https://grandballroom.de',
        instagram: '@grandballroom',
      })
      expect(result.success).toBe(true)
    })

    it('accepts all valid venue types', () => {
      const types = [
        'BAR',
        'CLUB',
        'RESTAURANT',
        'HOTEL',
        'EVENT_SPACE',
        'OTHER',
      ]

      types.forEach((type) => {
        const result = createVenueSchema.safeParse({
          venue_name: `Test ${type}`,
          type,
        })
        expect(result.success).toBe(true)
      })
    })

    it('accepts null for optional fields', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        description: null,
        street: null,
        postal_code: null,
        city_id: null,
        capacity_min: null,
        capacity_max: null,
        website: null,
        instagram: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts undefined for optional fields', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'CLUB',
      })
      expect(result.success).toBe(true)
    })

    it('accepts capacity_min of 1', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Small Venue',
        type: 'BAR',
        capacity_min: 1,
      })
      expect(result.success).toBe(true)
    })

    it('accepts large capacity values', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Large Venue',
        type: 'EVENT_SPACE',
        capacity_min: 1000,
        capacity_max: 5000,
      })
      expect(result.success).toBe(true)
    })

    it('accepts is_public as true or false', () => {
      expect(
        createVenueSchema.safeParse({
          venue_name: 'Public Venue',
          type: 'EVENT_SPACE',
          is_public: true,
        }).success
      ).toBe(true)

      expect(
        createVenueSchema.safeParse({
          venue_name: 'Private Venue',
          type: 'EVENT_SPACE',
          is_public: false,
        }).success
      ).toBe(true)
    })

    it('accepts valid website URLs', () => {
      expect(
        createVenueSchema.safeParse({
          venue_name: 'Venue',
          type: 'BAR',
          website: 'https://example.com',
        }).success
      ).toBe(true)

      expect(
        createVenueSchema.safeParse({
          venue_name: 'Venue',
          type: 'BAR',
          website: 'http://venue.de/about',
        }).success
      ).toBe(true)
    })

    it('rejects venue_name under 2 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'A',
        type: 'BAR',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Venue name must be at least 2 characters')
      }
    })

    it('rejects venue_name over 100 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'a'.repeat(101),
        type: 'BAR',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Venue name must be 100 characters or less')
      }
    })

    it('rejects invalid venue type', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'INVALID_TYPE',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid venue type')
      }
    })

    it('rejects description over 1000 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        description: 'a'.repeat(1001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description must be 1000 characters or less')
      }
    })

    it('rejects street over 200 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        street: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Street must be 200 characters or less')
      }
    })

    it('rejects postal_code over 20 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        postal_code: 'a'.repeat(21),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Postal code must be 20 characters or less')
      }
    })

    it('rejects invalid city_id UUID', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        city_id: 'not-a-uuid',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid city ID')
      }
    })

    it('rejects capacity_min less than 1', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        capacity_min: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Minimum capacity must be at least 1')
      }
    })

    it('rejects capacity_max less than 1', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        capacity_max: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Maximum capacity must be at least 1')
      }
    })

    it('rejects non-integer capacity_min', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        capacity_min: 50.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer capacity_max', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        capacity_max: 100.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid website URL', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        website: 'not-a-url',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid URL')
      }
    })

    it('rejects instagram over 100 characters', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Venue',
        type: 'BAR',
        instagram: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateVenueSchema', () => {
    it('allows partial updates', () => {
      const result = updateVenueSchema.safeParse({
        venue_name: 'Updated Name',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only capacity', () => {
      const result = updateVenueSchema.safeParse({
        capacity_min: 100,
        capacity_max: 300,
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only description', () => {
      const result = updateVenueSchema.safeParse({
        description: 'New description',
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateVenueSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('still validates constraints on updated fields', () => {
      const result = updateVenueSchema.safeParse({
        venue_name: 'a', // Too short
      })
      expect(result.success).toBe(false)
    })
  })
})
