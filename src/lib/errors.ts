/**
 * Application Error Classes
 * Hierarchical error system for consistent error handling
 */

import type { PostgrestError } from '@supabase/supabase-js'

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Base application error with code, status, and details
 */
export class AppError extends Error {
  readonly code: ErrorCodeType
  readonly status: number
  readonly details?: unknown

  constructor(
    message: string,
    code: ErrorCodeType = ErrorCode.UNKNOWN_ERROR,
    status = 500,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details)
    this.name = 'ValidationError'
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, ErrorCode.UNAUTHORIZED, 401)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, ErrorCode.FORBIDDEN, 403)
    this.name = 'ForbiddenError'
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, ErrorCode.NOT_FOUND, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Convert Supabase PostgrestError to appropriate AppError
 */
export function handleSupabaseError(error: PostgrestError): never {
  const { code, message } = error

  // PGRST116: No rows returned (single() with no match)
  if (code === 'PGRST116') {
    throw new NotFoundError('Resource not found')
  }

  // 23505: Unique violation
  if (code === '23505') {
    throw new ValidationError('A record with this value already exists')
  }

  // 42501: Insufficient privilege (RLS)
  if (code === '42501') {
    throw new ForbiddenError('You do not have permission to perform this action')
  }

  // 23503: Foreign key violation
  if (code === '23503') {
    throw new ValidationError('Referenced record does not exist')
  }

  // 22P02: Invalid text representation (e.g., invalid UUID)
  if (code === '22P02') {
    throw new ValidationError('Invalid ID format')
  }

  // Default: wrap in generic AppError
  throw new AppError(message || 'Database operation failed', ErrorCode.UNKNOWN_ERROR, 500)
}
