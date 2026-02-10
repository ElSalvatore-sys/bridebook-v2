/**
 * Client-side rate limiting using sliding window algorithm
 * Prevents brute-force attacks and abuse of sensitive endpoints
 */

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional block duration in milliseconds (defaults to windowMs) */
  blockDurationMs?: number
}

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Seconds until the rate limit resets (if blocked) */
  retryAfter: number
  /** Number of attempts remaining before blocking */
  remainingAttempts: number
}

/**
 * Attempt record for tracking
 */
interface AttemptRecord {
  attempts: number[]
  blockedUntil?: number
}

/**
 * In-memory storage for rate limit tracking
 * Key format: `${action}:${identifier}` (e.g., 'login:user@example.com')
 */
const rateLimitStore = new Map<string, AttemptRecord>()

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  /** Authentication actions (login, signup): 5 attempts per 15 minutes */
  AUTH: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
  },
  /** Message sending: 10 messages per minute */
  MESSAGE_SEND: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  /** Enquiry sending: 3 enquiries per 5 minutes */
  ENQUIRY_SEND: {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
  /** Password reset: 3 attempts per hour */
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
} as const

/**
 * Check if an action is rate-limited
 *
 * @param key - Unique identifier for this action (e.g., 'login', 'message-send')
 * @param config - Rate limit configuration
 * @returns Rate limit check result
 *
 * @example
 * const result = checkRateLimit('login', RATE_LIMITS.AUTH)
 * if (!result.allowed) {
 *   toast.error(`Too many attempts. Try again in ${result.retryAfter}s`)
 *   return
 * }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(key) || { attempts: [] }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000)
    return {
      allowed: false,
      retryAfter,
      remainingAttempts: 0,
    }
  }

  // Remove attempts outside the sliding window
  const windowStart = now - config.windowMs
  record.attempts = record.attempts.filter((timestamp) => timestamp > windowStart)

  // Check if within rate limit
  const remainingAttempts = config.maxAttempts - record.attempts.length

  if (remainingAttempts <= 0) {
    // Block for the specified duration
    const blockDuration = config.blockDurationMs || config.windowMs
    record.blockedUntil = now + blockDuration
    rateLimitStore.set(key, record)

    return {
      allowed: false,
      retryAfter: Math.ceil(blockDuration / 1000),
      remainingAttempts: 0,
    }
  }

  // Add current attempt
  record.attempts.push(now)
  rateLimitStore.set(key, record)

  return {
    allowed: true,
    retryAfter: 0,
    remainingAttempts: remainingAttempts - 1,
  }
}

/**
 * Reset rate limit for a specific key
 * Call this after successful completion of the action
 *
 * @param key - Unique identifier to reset
 *
 * @example
 * const result = await signIn(email, password)
 * if (result.success) {
 *   resetRateLimit('login')
 * }
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}
