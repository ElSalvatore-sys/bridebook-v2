/**
 * Common validation schemas tests
 * Comprehensive tests for shared validators
 */

import { describe, it, expect } from 'vitest'
import {
  germanPhoneSchema,
  germanPostalCodeSchema,
  emailSchema,
  passwordSchema,
  urlSchema,
  euroAmountSchema,
  dateSchema,
  futureDateSchema,
  uuidSchema,
  requiredString,
  paginationSchema,
} from '../common'

describe('Common Validation Schemas', () => {
  describe('germanPhoneSchema', () => {
    it('accepts valid German phone with +49 prefix', () => {
      const result = germanPhoneSchema.safeParse('+4915112345678')
      expect(result.success).toBe(true)
    })

    it('accepts valid German phone with 0 prefix', () => {
      const result = germanPhoneSchema.safeParse('015112345678')
      expect(result.success).toBe(true)
    })

    it('accepts various length valid German numbers', () => {
      expect(germanPhoneSchema.safeParse('+491511234567').success).toBe(true) // 8 digits
      expect(germanPhoneSchema.safeParse('+4915112345678').success).toBe(true) // 10 digits
      expect(germanPhoneSchema.safeParse('+4915112345678901').success).toBe(true) // 14 digits (max)
    })

    it('accepts null and undefined (nullish)', () => {
      expect(germanPhoneSchema.safeParse(null).success).toBe(true)
      expect(germanPhoneSchema.safeParse(undefined).success).toBe(true)
    })

    it('rejects phone starting with 0 (invalid area code)', () => {
      const result = germanPhoneSchema.safeParse('+4900123456789')
      expect(result.success).toBe(false)
    })

    it('rejects too short numbers', () => {
      const result = germanPhoneSchema.safeParse('+491234567')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid German phone number')
      }
    })

    it('rejects non-German country codes', () => {
      expect(germanPhoneSchema.safeParse('+1555123456').success).toBe(false)
      expect(germanPhoneSchema.safeParse('+441234567890').success).toBe(false)
    })

    it('rejects phones with letters', () => {
      expect(germanPhoneSchema.safeParse('+49151ABC').success).toBe(false)
    })

    it('rejects phones with spaces', () => {
      expect(germanPhoneSchema.safeParse('+49 151 12345678').success).toBe(false)
    })
  })

  describe('germanPostalCodeSchema', () => {
    it('accepts valid 5-digit postal codes', () => {
      expect(germanPostalCodeSchema.safeParse('65183').success).toBe(true)
      expect(germanPostalCodeSchema.safeParse('10115').success).toBe(true)
      expect(germanPostalCodeSchema.safeParse('01234').success).toBe(true)
      expect(germanPostalCodeSchema.safeParse('99999').success).toBe(true)
    })

    it('accepts null and undefined (nullish)', () => {
      expect(germanPostalCodeSchema.safeParse(null).success).toBe(true)
      expect(germanPostalCodeSchema.safeParse(undefined).success).toBe(true)
    })

    it('rejects 4-digit codes', () => {
      const result = germanPostalCodeSchema.safeParse('1234')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Postal code must be 5 digits')
      }
    })

    it('rejects 6-digit codes', () => {
      const result = germanPostalCodeSchema.safeParse('123456')
      expect(result.success).toBe(false)
    })

    it('rejects alpha characters', () => {
      expect(germanPostalCodeSchema.safeParse('ABCDE').success).toBe(false)
      expect(germanPostalCodeSchema.safeParse('1234A').success).toBe(false)
    })

    it('rejects codes with spaces', () => {
      expect(germanPostalCodeSchema.safeParse('12 345').success).toBe(false)
    })
  })

  describe('emailSchema', () => {
    it('accepts valid email formats', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true)
      expect(emailSchema.safeParse('user+tag@domain.co.uk').success).toBe(true)
      expect(emailSchema.safeParse('user.name@example.com').success).toBe(true)
      expect(emailSchema.safeParse('user_123@test-domain.org').success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = emailSchema.safeParse('TEST@EXAMPLE.COM')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    it('normalizes mixed case email', () => {
      const result = emailSchema.safeParse('Test.User@Example.COM')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test.user@example.com')
      }
    })

    it('trims whitespace', () => {
      const result = emailSchema.safeParse('  test@example.com  ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    it('rejects invalid email formats', () => {
      expect(emailSchema.safeParse('invalid').success).toBe(false)
      expect(emailSchema.safeParse('no-at-sign.com').success).toBe(false)
      expect(emailSchema.safeParse('@no-local.com').success).toBe(false)
      expect(emailSchema.safeParse('no-domain@').success).toBe(false)
      expect(emailSchema.safeParse('double@@domain.com').success).toBe(false)
    })

    it('provides helpful error message', () => {
      const result = emailSchema.safeParse('invalid')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address')
      }
    })
  })

  describe('passwordSchema', () => {
    it('accepts valid passwords with letter and number', () => {
      expect(passwordSchema.safeParse('Password1').success).toBe(true)
      expect(passwordSchema.safeParse('Test123456').success).toBe(true)
      expect(passwordSchema.safeParse('abcdefg9').success).toBe(true)
    })

    it('accepts passwords with special characters', () => {
      expect(passwordSchema.safeParse('Pass!@#$1').success).toBe(true)
      expect(passwordSchema.safeParse('My-Pass_123').success).toBe(true)
    })

    it('accepts passwords longer than 8 characters', () => {
      expect(passwordSchema.safeParse('VeryLongPassword123456').success).toBe(true)
    })

    it('rejects password under 8 characters', () => {
      const result = passwordSchema.safeParse('Short1')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
      }
    })

    it('rejects password without letters', () => {
      const result = passwordSchema.safeParse('12345678')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('letter'))).toBe(true)
      }
    })

    it('rejects password without numbers', () => {
      const result = passwordSchema.safeParse('NoNumber')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('number'))).toBe(true)
      }
    })

    it('rejects password that is exactly 7 characters', () => {
      expect(passwordSchema.safeParse('Pass123').success).toBe(false)
    })
  })

  describe('urlSchema', () => {
    it('accepts valid HTTP URLs', () => {
      expect(urlSchema.safeParse('http://example.com').success).toBe(true)
      expect(urlSchema.safeParse('http://www.example.com').success).toBe(true)
    })

    it('accepts valid HTTPS URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true)
      expect(urlSchema.safeParse('https://sub.domain.example.com').success).toBe(true)
    })

    it('accepts URLs with paths and query strings', () => {
      expect(urlSchema.safeParse('https://example.com/path/to/page').success).toBe(true)
      expect(urlSchema.safeParse('https://example.com?query=value').success).toBe(true)
      expect(urlSchema.safeParse('https://example.com/path?query=value#hash').success).toBe(true)
    })

    it('accepts null and undefined (nullish)', () => {
      expect(urlSchema.safeParse(null).success).toBe(true)
      expect(urlSchema.safeParse(undefined).success).toBe(true)
    })

    it('rejects URLs without protocol', () => {
      const result = urlSchema.safeParse('example.com')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid URL (e.g., https://example.com)')
      }
    })

    it('rejects invalid URL formats', () => {
      expect(urlSchema.safeParse('not-a-url').success).toBe(false)
      expect(urlSchema.safeParse('://missing-protocol').success).toBe(false)
    })
  })

  describe('euroAmountSchema', () => {
    it('accepts positive whole numbers', () => {
      expect(euroAmountSchema.safeParse(100).success).toBe(true)
      expect(euroAmountSchema.safeParse(1).success).toBe(true)
      expect(euroAmountSchema.safeParse(999999).success).toBe(true)
    })

    it('accepts amounts with 1 decimal place', () => {
      expect(euroAmountSchema.safeParse(99.9).success).toBe(true)
      expect(euroAmountSchema.safeParse(10.5).success).toBe(true)
    })

    it('accepts amounts with 2 decimal places', () => {
      expect(euroAmountSchema.safeParse(99.99).success).toBe(true)
      expect(euroAmountSchema.safeParse(10.50).success).toBe(true)
      expect(euroAmountSchema.safeParse(0.01).success).toBe(true)
    })

    it('accepts zero', () => {
      expect(euroAmountSchema.safeParse(0).success).toBe(true)
      expect(euroAmountSchema.safeParse(0.00).success).toBe(true)
    })

    it('rejects negative amounts', () => {
      const result = euroAmountSchema.safeParse(-1)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Amount must be positive')
      }
    })

    it('rejects amounts with more than 2 decimal places', () => {
      const result = euroAmountSchema.safeParse(100.999)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Amount must have at most 2 decimal places')
      }
    })
  })

  describe('dateSchema', () => {
    it('accepts YYYY-MM-DD format', () => {
      expect(dateSchema.safeParse('2025-12-31').success).toBe(true)
      expect(dateSchema.safeParse('2026-01-01').success).toBe(true)
      expect(dateSchema.safeParse('2024-02-29').success).toBe(true) // Leap year
    })

    it('rejects DD-MM-YYYY format', () => {
      const result = dateSchema.safeParse('31-12-2025')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Date must be in YYYY-MM-DD format')
      }
    })

    it('rejects MM/DD/YYYY format', () => {
      expect(dateSchema.safeParse('12/31/2025').success).toBe(false)
    })

    it('rejects invalid strings', () => {
      expect(dateSchema.safeParse('invalid').success).toBe(false)
      // Note: dateSchema only checks format (YYYY-MM-DD), not validity of month/day values
      // '2025-13-01' passes format check but would fail on actual date parsing
    })
  })

  describe('futureDateSchema', () => {
    it('accepts future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      const nextYearStr = nextYear.toISOString().split('T')[0]

      expect(futureDateSchema.safeParse(tomorrowStr).success).toBe(true)
      expect(futureDateSchema.safeParse(nextYearStr).success).toBe(true)
    })

    it('rejects past dates', () => {
      const result = futureDateSchema.safeParse('2020-01-01')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('future'))).toBe(true)
      }
    })

    it('rejects today (not future)', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = futureDateSchema.safeParse(today)
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format', () => {
      const result = futureDateSchema.safeParse('31-12-2030')
      expect(result.success).toBe(false)
    })
  })

  describe('uuidSchema', () => {
    it('accepts valid UUIDs', () => {
      expect(uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true)
      expect(uuidSchema.safeParse('6ba7b810-9dad-11d1-80b4-00c04fd430c8').success).toBe(true)
    })

    it('accepts UUIDs with uppercase letters', () => {
      expect(uuidSchema.safeParse('550E8400-E29B-41D4-A716-446655440000').success).toBe(true)
    })

    it('rejects non-UUID strings', () => {
      const result = uuidSchema.safeParse('not-a-uuid')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid ID format')
      }
    })

    it('rejects UUIDs with wrong format', () => {
      expect(uuidSchema.safeParse('550e8400-e29b-41d4-a716').success).toBe(false) // Too short
      expect(uuidSchema.safeParse('550e8400e29b41d4a716446655440000').success).toBe(false) // No hyphens
    })
  })

  describe('requiredString', () => {
    it('accepts non-empty strings', () => {
      const schema = requiredString('Test field')
      expect(schema.safeParse('Hello').success).toBe(true)
      expect(schema.safeParse('A').success).toBe(true)
    })

    it('trims whitespace before validation', () => {
      const schema = requiredString('Test field')
      const result = schema.safeParse('  trimmed  ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('trimmed')
      }
    })

    it('rejects empty strings', () => {
      const schema = requiredString('Test field')
      const result = schema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Test field is required')
      }
    })

    it('rejects whitespace-only strings', () => {
      const schema = requiredString('Test field')
      const result = schema.safeParse('   ')
      expect(result.success).toBe(false)
    })

    it('uses provided field name in error message', () => {
      const schema = requiredString('Username')
      const result = schema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username is required')
      }
    })
  })

  describe('paginationSchema', () => {
    it('accepts valid pagination params', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20 })
      expect(result.success).toBe(true)
    })

    it('applies default values', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(20)
      }
    })

    it('accepts cursor-based pagination', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20, cursor: 'abc123' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.cursor).toBe('abc123')
      }
    })

    it('accepts different page numbers', () => {
      expect(paginationSchema.safeParse({ page: 5, limit: 10 }).success).toBe(true)
      expect(paginationSchema.safeParse({ page: 100, limit: 50 }).success).toBe(true)
    })

    it('rejects page < 1', () => {
      const result = paginationSchema.safeParse({ page: 0, limit: 20 })
      expect(result.success).toBe(false)
    })

    it('rejects negative page numbers', () => {
      const result = paginationSchema.safeParse({ page: -1, limit: 20 })
      expect(result.success).toBe(false)
    })

    it('rejects limit < 1', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 0 })
      expect(result.success).toBe(false)
    })

    it('rejects limit > 100', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 101 })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer page', () => {
      const result = paginationSchema.safeParse({ page: 1.5, limit: 20 })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer limit', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20.5 })
      expect(result.success).toBe(false)
    })
  })
})
