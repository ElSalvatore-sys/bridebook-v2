/**
 * Event validation schemas tests
 * Comprehensive tests for event creation and management
 */

import { describe, it, expect } from 'vitest'
import {
  createEventSchema,
  updateEventSchema,
  quickEventSetupSchema,
} from '../event'

describe('Event Validation Schemas', () => {
  describe('createEventSchema', () => {
    it('accepts valid event with required fields only', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Summer Festival',
        organizer_name: 'Music Productions GmbH',
      })
      expect(result.success).toBe(true)
    })

    it('accepts event with all fields', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const result = createEventSchema.safeParse({
        event_name: 'Summer Festival',
        organizer_name: 'Music Productions GmbH',
        event_type: 'festival',
        event_date: tomorrowStr,
        venue_id: '550e8400-e29b-41d4-a716-446655440000',
        budget_total: 50000,
        guest_count_estimate: 500,
        description: 'A large outdoor summer music festival',
      })
      expect(result.success).toBe(true)
    })

    it('accepts all valid event types', () => {
      const types = ['concert', 'festival', 'private_party', 'corporate', 'club_night', 'other']
      types.forEach((event_type) => {
        const result = createEventSchema.safeParse({
          event_name: `Event - ${event_type}`,
          organizer_name: 'Organizer',
          event_type,
        })
        expect(result.success).toBe(true)
      })
    })

    it('trims and accepts event_name', () => {
      const result = createEventSchema.safeParse({
        event_name: '  Summer Festival  ',
        organizer_name: 'Organizer',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.event_name).toBe('Summer Festival')
      }
    })

    it('trims and accepts organizer_name', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: '  Music Productions  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.organizer_name).toBe('Music Productions')
      }
    })

    it('accepts valid future date', () => {
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      const dateStr = nextMonth.toISOString().split('T')[0]

      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        event_date: dateStr,
      })
      expect(result.success).toBe(true)
    })

    it('accepts guest count within valid range', () => {
      expect(
        createEventSchema.safeParse({
          event_name: 'Small Event',
          organizer_name: 'Organizer',
          guest_count_estimate: 1,
        }).success
      ).toBe(true)

      expect(
        createEventSchema.safeParse({
          event_name: 'Large Event',
          organizer_name: 'Organizer',
          guest_count_estimate: 10000,
        }).success
      ).toBe(true)
    })

    it('accepts budget_total with decimals', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        budget_total: 25000.50,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty event_name', () => {
      const result = createEventSchema.safeParse({
        event_name: '',
        organizer_name: 'Organizer',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty organizer_name', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects event_name over 100 characters', () => {
      const result = createEventSchema.safeParse({
        event_name: 'a'.repeat(101),
        organizer_name: 'Organizer',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Event name is too long')
      }
    })

    it('rejects organizer_name over 100 characters', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is too long')
      }
    })

    it('rejects description over 2000 characters', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        description: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description is too long')
      }
    })

    it('rejects past date', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        event_date: '2020-01-01',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid event_type', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        event_type: 'invalid_type',
      })
      expect(result.success).toBe(false)
    })

    it('rejects guest_count_estimate less than 1', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        guest_count_estimate: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('At least 1 guest required')
      }
    })

    it('rejects guest_count_estimate over 10000', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        guest_count_estimate: 10001,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Guest count is too high')
      }
    })

    it('rejects non-integer guest_count_estimate', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        guest_count_estimate: 50.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Guest count must be a whole number')
      }
    })

    it('rejects negative budget_total', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        budget_total: -1000,
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid UUID for venue_id', () => {
      const result = createEventSchema.safeParse({
        event_name: 'Festival',
        organizer_name: 'Organizer',
        venue_id: 'not-a-uuid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateEventSchema', () => {
    it('allows partial updates', () => {
      const result = updateEventSchema.safeParse({
        event_name: 'Updated Event Name',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only event_type', () => {
      const result = updateEventSchema.safeParse({
        event_type: 'concert',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only guest_count_estimate', () => {
      const result = updateEventSchema.safeParse({
        guest_count_estimate: 200,
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateEventSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('still validates constraints on updated fields', () => {
      const result = updateEventSchema.safeParse({
        event_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('quickEventSetupSchema', () => {
    it('accepts minimal valid quick setup', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: 'Quick Event',
        organizer_name: 'Quick Organizer',
      })
      expect(result.success).toBe(true)
    })

    it('accepts quick setup with all fields', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const result = quickEventSetupSchema.safeParse({
        event_name: 'Quick Event',
        organizer_name: 'Quick Organizer',
        event_date: tomorrowStr,
        guest_count_estimate: 100,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty event_name', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: '',
        organizer_name: 'Organizer',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty organizer_name', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: 'Event',
        organizer_name: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects guest_count_estimate less than 1', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: 'Event',
        organizer_name: 'Organizer',
        guest_count_estimate: 0,
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer guest_count_estimate', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: 'Event',
        organizer_name: 'Organizer',
        guest_count_estimate: 50.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects past event_date', () => {
      const result = quickEventSetupSchema.safeParse({
        event_name: 'Event',
        organizer_name: 'Organizer',
        event_date: '2020-01-01',
      })
      expect(result.success).toBe(false)
    })
  })
})
