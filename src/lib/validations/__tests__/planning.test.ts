/**
 * Planning tool validation schemas tests
 * Comprehensive tests for tasks, budget items, and guests
 */

import { describe, it, expect } from 'vitest'
import {
  createTaskSchema,
  updateTaskSchema,
  createBudgetItemSchema,
  updateBudgetItemSchema,
  createGuestSchema,
  updateGuestSchema,
  bulkGuestImportSchema,
} from '../planning'

describe('Planning Validation Schemas', () => {
  describe('createTaskSchema', () => {
    it('accepts valid task with required fields', () => {
      const result = createTaskSchema.safeParse({
        title: 'Book photographer',
        priority: 'medium',
      })
      expect(result.success).toBe(true)
    })

    it('accepts task with all fields', () => {
      const result = createTaskSchema.safeParse({
        title: 'Book photographer',
        description: 'Research and book a professional photographer',
        due_date: '2026-06-15',
        category: 'photography',
        priority: 'high',
        assigned_to: '550e8400-e29b-41d4-a716-446655440000',
        vendor_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      })
      expect(result.success).toBe(true)
    })

    it('applies default priority of medium', () => {
      const result = createTaskSchema.safeParse({
        title: 'Task without priority',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe('medium')
      }
    })

    it('accepts low priority', () => {
      const result = createTaskSchema.safeParse({
        title: 'Low priority task',
        priority: 'low',
      })
      expect(result.success).toBe(true)
    })

    it('accepts high priority', () => {
      const result = createTaskSchema.safeParse({
        title: 'High priority task',
        priority: 'high',
      })
      expect(result.success).toBe(true)
    })

    it('accepts all valid categories', () => {
      const categories = ['venue', 'catering', 'photography', 'music', 'flowers', 'attire', 'invitations', 'other']
      categories.forEach((category) => {
        const result = createTaskSchema.safeParse({
          title: `Task for ${category}`,
          category,
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects empty title', () => {
      const result = createTaskSchema.safeParse({
        title: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects title over 200 characters', () => {
      const result = createTaskSchema.safeParse({
        title: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is too long')
      }
    })

    it('rejects description over 2000 characters', () => {
      const result = createTaskSchema.safeParse({
        title: 'Valid title',
        description: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description is too long')
      }
    })

    it('rejects invalid category', () => {
      const result = createTaskSchema.safeParse({
        title: 'Task',
        category: 'invalid-category',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid priority', () => {
      const result = createTaskSchema.safeParse({
        title: 'Task',
        priority: 'invalid-priority',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid UUID for assigned_to', () => {
      const result = createTaskSchema.safeParse({
        title: 'Task',
        assigned_to: 'not-a-uuid',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format', () => {
      const result = createTaskSchema.safeParse({
        title: 'Task',
        due_date: '15-06-2026',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateTaskSchema', () => {
    it('allows partial updates', () => {
      const result = updateTaskSchema.safeParse({
        title: 'Updated title',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only completed status', () => {
      const result = updateTaskSchema.safeParse({
        completed: true,
      })
      expect(result.success).toBe(true)
    })

    it('allows updating completed_at timestamp', () => {
      const result = updateTaskSchema.safeParse({
        completed: true,
        completed_at: '2026-02-10T12:00:00Z',
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateTaskSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('rejects invalid datetime format for completed_at', () => {
      const result = updateTaskSchema.safeParse({
        completed_at: 'not-a-datetime',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createBudgetItemSchema', () => {
    it('accepts valid budget item with required fields', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Venue rental',
        estimated_cost: 5000,
      })
      expect(result.success).toBe(true)
    })

    it('accepts budget item with all fields', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'catering',
        name: 'Dinner service',
        estimated_cost: 8000,
        actual_cost: 7500,
        vendor_id: '550e8400-e29b-41d4-a716-446655440000',
        notes: 'Includes cocktail hour',
        is_paid: true,
        payment_due_date: '2026-06-01',
      })
      expect(result.success).toBe(true)
    })

    it('applies default is_paid of false', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'flowers',
        name: 'Bouquets',
        estimated_cost: 500,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.is_paid).toBe(false)
      }
    })

    it('accepts all valid budget categories', () => {
      const categories = [
        'venue',
        'catering',
        'photography',
        'videography',
        'music',
        'flowers',
        'decor',
        'attire',
        'beauty',
        'stationery',
        'transportation',
        'gifts',
        'honeymoon',
        'other',
      ]
      categories.forEach((category) => {
        const result = createBudgetItemSchema.safeParse({
          category,
          name: `Item for ${category}`,
          estimated_cost: 1000,
        })
        expect(result.success).toBe(true)
      })
    })

    it('accepts estimated_cost with 2 decimal places', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Item',
        estimated_cost: 1234.56,
      })
      expect(result.success).toBe(true)
    })

    it('accepts actual_cost with 2 decimal places', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Item',
        estimated_cost: 1000,
        actual_cost: 987.65,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty name', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: '',
        estimated_cost: 1000,
      })
      expect(result.success).toBe(false)
    })

    it('rejects name over 100 characters', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'a'.repeat(101),
        estimated_cost: 1000,
      })
      expect(result.success).toBe(false)
    })

    it('rejects notes over 500 characters', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Item',
        estimated_cost: 1000,
        notes: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative estimated_cost', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Item',
        estimated_cost: -100,
      })
      expect(result.success).toBe(false)
    })

    it('rejects estimated_cost with more than 2 decimals', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'venue',
        name: 'Item',
        estimated_cost: 100.999,
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid category', () => {
      const result = createBudgetItemSchema.safeParse({
        category: 'invalid',
        name: 'Item',
        estimated_cost: 1000,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateBudgetItemSchema', () => {
    it('allows partial updates', () => {
      const result = updateBudgetItemSchema.safeParse({
        actual_cost: 7500,
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only is_paid', () => {
      const result = updateBudgetItemSchema.safeParse({
        is_paid: true,
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateBudgetItemSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('createGuestSchema', () => {
    it('accepts valid guest with required fields', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
      })
      expect(result.success).toBe(true)
    })

    it('accepts guest with all fields', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '+4915112345678',
        party_id: '550e8400-e29b-41d4-a716-446655440000',
        is_primary_contact: true,
        rsvp_status: 'attending',
        plus_one_allowed: true,
        plus_one_name: 'Guest of Jane',
        dietary_restrictions: ['vegetarian', 'gluten-free'],
        table_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        seat_number: 5,
        guest_type: 'bride_friend',
        notes: 'Close friend from college',
      })
      expect(result.success).toBe(true)
    })

    it('applies default is_primary_contact of true', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.is_primary_contact).toBe(true)
      }
    })

    it('applies default rsvp_status of pending', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rsvp_status).toBe('pending')
      }
    })

    it('applies default plus_one_allowed of false', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.plus_one_allowed).toBe(false)
      }
    })

    it('accepts all valid RSVP statuses', () => {
      const statuses = ['pending', 'attending', 'declined', 'maybe']
      statuses.forEach((status) => {
        const result = createGuestSchema.safeParse({
          first_name: 'John',
          last_name: 'Doe',
          rsvp_status: status,
        })
        expect(result.success).toBe(true)
      })
    })

    it('accepts all valid guest types', () => {
      const types = [
        'bride_family',
        'groom_family',
        'bride_friend',
        'groom_friend',
        'mutual',
        'colleague',
        'other',
      ]
      types.forEach((guest_type) => {
        const result = createGuestSchema.safeParse({
          first_name: 'John',
          last_name: 'Doe',
          guest_type,
        })
        expect(result.success).toBe(true)
      })
    })

    it('accepts valid German phone numbers', () => {
      expect(
        createGuestSchema.safeParse({
          first_name: 'John',
          last_name: 'Doe',
          phone: '+4915112345678',
        }).success
      ).toBe(true)

      expect(
        createGuestSchema.safeParse({
          first_name: 'John',
          last_name: 'Doe',
          phone: '015112345678',
        }).success
      ).toBe(true)
    })

    it('accepts dietary restrictions as array', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        dietary_restrictions: ['vegan', 'nut allergy'],
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty first_name', () => {
      const result = createGuestSchema.safeParse({
        first_name: '',
        last_name: 'Doe',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty last_name', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects first_name over 50 characters', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'a'.repeat(51),
        last_name: 'Doe',
      })
      expect(result.success).toBe(false)
    })

    it('rejects last_name over 50 characters', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'a'.repeat(51),
      })
      expect(result.success).toBe(false)
    })

    it('rejects plus_one_name over 100 characters', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        plus_one_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects notes over 500 characters', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        notes: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
    })

    it('rejects seat_number less than 1', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        seat_number: 0,
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer seat_number', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        seat_number: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid RSVP status', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        rsvp_status: 'invalid',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid guest type', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        guest_type: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateGuestSchema', () => {
    it('allows partial updates', () => {
      const result = updateGuestSchema.safeParse({
        rsvp_status: 'attending',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only dietary restrictions', () => {
      const result = updateGuestSchema.safeParse({
        dietary_restrictions: ['lactose-free'],
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateGuestSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('bulkGuestImportSchema', () => {
    it('accepts array of valid guests', () => {
      const result = bulkGuestImportSchema.safeParse({
        guests: [
          { first_name: 'John', last_name: 'Doe' },
          { first_name: 'Jane', last_name: 'Smith' },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('accepts single guest in array', () => {
      const result = bulkGuestImportSchema.safeParse({
        guests: [{ first_name: 'John', last_name: 'Doe' }],
      })
      expect(result.success).toBe(true)
    })

    it('accepts 500 guests (max limit)', () => {
      const guests = Array.from({ length: 500 }, (_, i) => ({
        first_name: `Guest${i}`,
        last_name: 'Doe',
      }))
      const result = bulkGuestImportSchema.safeParse({ guests })
      expect(result.success).toBe(true)
    })

    it('rejects empty guests array', () => {
      const result = bulkGuestImportSchema.safeParse({
        guests: [],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('At least one guest required')
      }
    })

    it('rejects over 500 guests', () => {
      const guests = Array.from({ length: 501 }, (_, i) => ({
        first_name: `Guest${i}`,
        last_name: 'Doe',
      }))
      const result = bulkGuestImportSchema.safeParse({ guests })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Maximum 500 guests per import')
      }
    })

    it('rejects if any guest is invalid', () => {
      const result = bulkGuestImportSchema.safeParse({
        guests: [
          { first_name: 'John', last_name: 'Doe' },
          { first_name: '', last_name: 'Invalid' }, // Empty first_name
        ],
      })
      expect(result.success).toBe(false)
    })
  })
})
