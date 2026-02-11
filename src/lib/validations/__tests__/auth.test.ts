/**
 * Authentication validation schemas tests
 * Comprehensive tests for login, signup, and password reset forms
 */

import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../auth'

describe('Authentication Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      })
      expect(result.success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = loginSchema.safeParse({
        email: 'TEST@EXAMPLE.COM',
        password: 'password',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('trims whitespace from email', () => {
      const result = loginSchema.safeParse({
        email: '  test@example.com  ',
        password: 'password',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
      }
    })

    it('rejects missing email', () => {
      const result = loginSchema.safeParse({
        password: 'password',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })

    it('rejects missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })

    it('accepts any non-empty password (no strength check on login)', () => {
      expect(loginSchema.safeParse({ email: 'test@example.com', password: 'x' }).success).toBe(true)
      expect(loginSchema.safeParse({ email: 'test@example.com', password: '123' }).success).toBe(true)
    })
  })

  describe('signupSchema', () => {
    const validSignupData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER' as const,
    }

    it('accepts valid signup data', () => {
      const result = signupSchema.safeParse(validSignupData)
      expect(result.success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        email: 'TEST@EXAMPLE.COM',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('trims firstName and lastName', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        firstName: '  John  ',
        lastName: '  Doe  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.firstName).toBe('John')
        expect(result.data.lastName).toBe('Doe')
      }
    })

    it('accepts ARTIST role', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        role: 'ARTIST',
      })
      expect(result.success).toBe(true)
    })

    it('accepts VENUE role', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        role: 'VENUE',
      })
      expect(result.success).toBe(true)
    })

    it('accepts ADMIN role', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        role: 'ADMIN',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without letters', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        password: '12345678',
        confirmPassword: '12345678',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('letter'))).toBe(true)
      }
    })

    it('rejects password without numbers', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        password: 'NoNumbers',
        confirmPassword: 'NoNumbers',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('number'))).toBe(true)
      }
    })

    it('rejects password under 8 characters', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        password: 'Short1',
        confirmPassword: 'Short1',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('8 characters'))).toBe(true)
      }
    })

    it('rejects mismatched passwords', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
        expect(result.error.issues[0].path).toEqual(['confirmPassword'])
      }
    })

    it('rejects empty confirmPassword', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty firstName', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        firstName: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty lastName', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        lastName: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects firstName over 100 characters', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        firstName: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is too long')
      }
    })

    it('rejects lastName over 100 characters', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        lastName: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is too long')
      }
    })

    it('rejects invalid role', () => {
      const result = signupSchema.safeParse({
        ...validSignupData,
        role: 'INVALID_ROLE',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing role', () => {
      const { role, ...dataWithoutRole } = validSignupData
      const result = signupSchema.safeParse(dataWithoutRole)
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'TEST@EXAMPLE.COM',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('trims whitespace from email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: '  test@example.com  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('rejects invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing email', () => {
      const result = forgotPasswordSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    it('accepts matching valid passwords', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      })
      expect(result.success).toBe(true)
    })

    it('accepts passwords with special characters', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'Pass!@#$123',
        confirmPassword: 'Pass!@#$123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPassword123',
        confirmPassword: 'DifferentPassword123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
        expect(result.error.issues[0].path).toEqual(['confirmPassword'])
      }
    })

    it('rejects password without letters', () => {
      const result = resetPasswordSchema.safeParse({
        password: '12345678',
        confirmPassword: '12345678',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without numbers', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NoNumbers',
        confirmPassword: 'NoNumbers',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password under 8 characters', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'Short1',
        confirmPassword: 'Short1',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = resetPasswordSchema.safeParse({
        password: '',
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty confirmPassword', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPassword123',
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing password', () => {
      const result = resetPasswordSchema.safeParse({
        confirmPassword: 'Password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing confirmPassword', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'Password123',
      })
      expect(result.success).toBe(false)
    })
  })
})
