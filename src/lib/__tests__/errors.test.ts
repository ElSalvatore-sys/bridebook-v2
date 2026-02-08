import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ErrorCode,
  isAbortError,
  handleSupabaseError,
} from '../errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('creates with defaults', () => {
      const err = new AppError('test')
      expect(err.message).toBe('test')
      expect(err.code).toBe(ErrorCode.UNKNOWN_ERROR)
      expect(err.status).toBe(500)
      expect(err.details).toBeUndefined()
      expect(err.name).toBe('AppError')
      expect(err).toBeInstanceOf(Error)
    })

    it('creates with custom values', () => {
      const err = new AppError('test', ErrorCode.VALIDATION_ERROR, 400, { field: 'name' })
      expect(err.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(err.status).toBe(400)
      expect(err.details).toEqual({ field: 'name' })
    })
  })

  describe('ValidationError', () => {
    it('creates with correct defaults', () => {
      const err = new ValidationError('Invalid input')
      expect(err.message).toBe('Invalid input')
      expect(err.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(err.status).toBe(400)
      expect(err.name).toBe('ValidationError')
      expect(err).toBeInstanceOf(AppError)
    })

    it('accepts details', () => {
      const err = new ValidationError('Invalid', { fields: ['name'] })
      expect(err.details).toEqual({ fields: ['name'] })
    })
  })

  describe('UnauthorizedError', () => {
    it('creates with default message', () => {
      const err = new UnauthorizedError()
      expect(err.message).toBe('Not authenticated')
      expect(err.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(err.status).toBe(401)
      expect(err.name).toBe('UnauthorizedError')
    })

    it('accepts custom message', () => {
      const err = new UnauthorizedError('Custom')
      expect(err.message).toBe('Custom')
    })
  })

  describe('ForbiddenError', () => {
    it('creates with default message', () => {
      const err = new ForbiddenError()
      expect(err.message).toBe('Access denied')
      expect(err.code).toBe(ErrorCode.FORBIDDEN)
      expect(err.status).toBe(403)
      expect(err.name).toBe('ForbiddenError')
    })
  })

  describe('NotFoundError', () => {
    it('creates with default message', () => {
      const err = new NotFoundError()
      expect(err.message).toBe('Resource not found')
      expect(err.code).toBe(ErrorCode.NOT_FOUND)
      expect(err.status).toBe(404)
      expect(err.name).toBe('NotFoundError')
    })
  })
})

describe('isAbortError', () => {
  it('returns false for null/undefined', () => {
    expect(isAbortError(null)).toBe(false)
    expect(isAbortError(undefined)).toBe(false)
    expect(isAbortError(false)).toBe(false)
  })

  it('detects DOMException AbortError', () => {
    const err = new DOMException('The operation was aborted', 'AbortError')
    expect(isAbortError(err)).toBe(true)
  })

  it('detects Error with aborterror name', () => {
    const err = new Error('test')
    err.name = 'AbortError'
    expect(isAbortError(err)).toBe(true)
  })

  it('detects Error with abort_err name', () => {
    const err = new Error('test')
    err.name = 'ABORT_ERR'
    expect(isAbortError(err)).toBe(true)
  })

  it('detects Error with abort message patterns', () => {
    expect(isAbortError(new Error('signal is aborted without reason'))).toBe(true)
    expect(isAbortError(new Error('The operation was aborted'))).toBe(true)
    expect(isAbortError(new Error('aborted'))).toBe(true)
    expect(isAbortError(new Error('The user aborted a request.'))).toBe(true)
    expect(isAbortError(new Error('signal is aborted with custom reason'))).toBe(true)
  })

  it('detects plain object with abort message', () => {
    expect(isAbortError({ message: 'signal is aborted without reason' })).toBe(true)
    expect(isAbortError({ message: 'The operation was aborted' })).toBe(true)
    expect(isAbortError({ message: 'aborted' })).toBe(true)
  })

  it('returns false for regular errors', () => {
    expect(isAbortError(new Error('Network error'))).toBe(false)
    expect(isAbortError(new Error('Upload aborted by user'))).toBe(false)
    expect(isAbortError({ message: 'something else' })).toBe(false)
    expect(isAbortError('string error')).toBe(false)
    expect(isAbortError(42)).toBe(false)
  })
})

describe('handleSupabaseError', () => {
  const makeError = (code: string, message = 'Error') =>
    ({ code, message, details: '', hint: '' }) as import('@supabase/supabase-js').PostgrestError

  it('throws NotFoundError for PGRST116', () => {
    expect(() => handleSupabaseError(makeError('PGRST116'))).toThrow(NotFoundError)
  })

  it('throws ValidationError for 23505 (unique violation)', () => {
    expect(() => handleSupabaseError(makeError('23505'))).toThrow(ValidationError)
  })

  it('throws ForbiddenError for 42501 (RLS)', () => {
    expect(() => handleSupabaseError(makeError('42501'))).toThrow(ForbiddenError)
  })

  it('throws ValidationError for 23503 (foreign key)', () => {
    expect(() => handleSupabaseError(makeError('23503'))).toThrow(ValidationError)
  })

  it('throws ValidationError for 22P02 (invalid UUID)', () => {
    expect(() => handleSupabaseError(makeError('22P02'))).toThrow(ValidationError)
  })

  it('throws AppError for unknown codes', () => {
    const err = makeError('99999', 'Unknown error')
    expect(() => handleSupabaseError(err)).toThrow(AppError)
    try {
      handleSupabaseError(err)
    } catch (e) {
      expect((e as AppError).message).toBe('Unknown error')
    }
  })

  it('uses fallback message for unknown codes with empty message', () => {
    const err = makeError('99999', '')
    try {
      handleSupabaseError(err)
    } catch (e) {
      expect((e as AppError).message).toBe('Database operation failed')
    }
  })

  it('throws DOMException for abort errors', () => {
    const err = { code: '', message: 'aborted', details: '', hint: '' } as import('@supabase/supabase-js').PostgrestError
    expect(() => handleSupabaseError(err)).toThrow(DOMException)
  })
})
