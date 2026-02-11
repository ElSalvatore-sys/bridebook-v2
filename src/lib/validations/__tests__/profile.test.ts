/**
 * Profile validation schemas tests
 * Comprehensive tests for profile updates and password changes
 */

import { describe, it, expect } from 'vitest'
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../profile'

describe('Profile Validation Schemas', () => {
  describe('updateProfileSchema', () => {
    it('accepts valid profile update with all fields', () => {
      const result = updateProfileSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        display_name: 'JohnD',
        bio: 'Music enthusiast and event organizer',
        city: 'Berlin',
        website: 'https://johndoe.com',
        avatar_url: 'https://example.com/avatar.jpg',
        phone: '+4915112345678',
      })
      expect(result.success).toBe(true)
    })

    it('accepts partial update with single field', () => {
      const result = updateProfileSchema.safeParse({
        first_name: 'Jane',
      })
      expect(result.success).toBe(true)
    })

    it('accepts empty string for optional fields', () => {
      const result = updateProfileSchema.safeParse({
        display_name: '',
        bio: '',
        city: '',
        website: '',
      })
      expect(result.success).toBe(true)
    })

    it('accepts null for phone and avatar_url', () => {
      const result = updateProfileSchema.safeParse({
        phone: null,
        avatar_url: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts undefined for all fields (no update)', () => {
      const result = updateProfileSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('accepts first_name with whitespace (no auto-trim)', () => {
      const result = updateProfileSchema.safeParse({
        first_name: '  John  ',
      })
      // Note: updateProfileSchema does not trim first_name/last_name
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.first_name).toBe('  John  ')
      }
    })

    it('accepts last_name with whitespace (no auto-trim)', () => {
      const result = updateProfileSchema.safeParse({
        last_name: '  Doe  ',
      })
      // Note: updateProfileSchema does not trim first_name/last_name
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.last_name).toBe('  Doe  ')
      }
    })

    it('accepts display_name between 2-50 chars', () => {
      expect(updateProfileSchema.safeParse({ display_name: 'AB' }).success).toBe(true)
      expect(updateProfileSchema.safeParse({ display_name: 'a'.repeat(50) }).success).toBe(true)
    })

    it('accepts bio up to 500 characters', () => {
      const result = updateProfileSchema.safeParse({
        bio: 'a'.repeat(500),
      })
      expect(result.success).toBe(true)
    })

    it('accepts valid German phone numbers', () => {
      expect(updateProfileSchema.safeParse({ phone: '+4915112345678' }).success).toBe(true)
      expect(updateProfileSchema.safeParse({ phone: '015112345678' }).success).toBe(true)
    })

    it('accepts valid URLs for website', () => {
      expect(updateProfileSchema.safeParse({ website: 'https://example.com' }).success).toBe(true)
      expect(updateProfileSchema.safeParse({ website: 'http://example.com/path' }).success).toBe(true)
    })

    it('accepts valid URLs for avatar_url', () => {
      expect(updateProfileSchema.safeParse({ avatar_url: 'https://cdn.example.com/img.jpg' }).success).toBe(true)
    })

    it('rejects first_name longer than 100 characters', () => {
      const result = updateProfileSchema.safeParse({
        first_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name must be 100 characters or less')
      }
    })

    it('rejects last_name longer than 100 characters', () => {
      const result = updateProfileSchema.safeParse({
        last_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name must be 100 characters or less')
      }
    })

    it('rejects display_name with only 1 character', () => {
      const result = updateProfileSchema.safeParse({
        display_name: 'A',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Display name must be at least 2 characters')
      }
    })

    it('rejects display_name longer than 50 characters', () => {
      const result = updateProfileSchema.safeParse({
        display_name: 'a'.repeat(51),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Display name must be 50 characters or less')
      }
    })

    it('rejects bio longer than 500 characters', () => {
      const result = updateProfileSchema.safeParse({
        bio: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Bio must be 500 characters or less')
      }
    })

    it('rejects city longer than 100 characters', () => {
      const result = updateProfileSchema.safeParse({
        city: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('City must be 100 characters or less')
      }
    })

    it('rejects invalid URL for website', () => {
      const result = updateProfileSchema.safeParse({
        website: 'not-a-url',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid German phone format', () => {
      const result = updateProfileSchema.safeParse({
        phone: '+1234567890', // Non-German
      })
      expect(result.success).toBe(false)
    })
  })

  describe('changePasswordSchema', () => {
    it('accepts valid password change', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456',
      })
      expect(result.success).toBe(true)
    })

    it('accepts passwords with special characters', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'Old!Pass@123',
        newPassword: 'New#Pass$456',
        confirmPassword: 'New#Pass$456',
      })
      expect(result.success).toBe(true)
    })

    it('rejects when newPassword does not match confirmPassword', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: 'DifferentPassword789',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
        expect(result.error.issues[0].path).toEqual(['confirmPassword'])
      }
    })

    it('rejects empty currentPassword', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: '',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Current password is required')
      }
    })

    it('rejects empty newPassword', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: '',
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty confirmPassword', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects newPassword without letters', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: '12345678',
        confirmPassword: '12345678',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('letter'))).toBe(true)
      }
    })

    it('rejects newPassword without numbers', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: 'NoNumbers',
        confirmPassword: 'NoNumbers',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('number'))).toBe(true)
      }
    })

    it('rejects newPassword under 8 characters', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldPassword123',
        newPassword: 'Short1',
        confirmPassword: 'Short1',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('8 characters'))).toBe(true)
      }
    })

    it('allows currentPassword of any length (just validates non-empty)', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'x',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456',
      })
      expect(result.success).toBe(true)
    })
  })
})
