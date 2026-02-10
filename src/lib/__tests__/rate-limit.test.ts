import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  checkRateLimit,
  resetRateLimit,
  clearAllRateLimits,
  RATE_LIMITS,
} from '../rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    clearAllRateLimits()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests under the limit', () => {
    const result1 = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result1.allowed).toBe(true)
    expect(result1.remainingAttempts).toBe(9)

    const result2 = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result2.allowed).toBe(true)
    expect(result2.remainingAttempts).toBe(8)
  })

  it('blocks requests over the limit', () => {
    // Make max attempts (10)
    for (let i = 0; i < 10; i++) {
      checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    }

    // 11th attempt should be blocked
    const result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
    expect(result.remainingAttempts).toBe(0)
  })

  it('returns correct retryAfter time', () => {
    // Block the action
    for (let i = 0; i < 10; i++) {
      checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    }
    const result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)

    expect(result.retryAfter).toBeGreaterThan(0)
    expect(result.retryAfter).toBeLessThanOrEqual(60) // windowMs is 60s
  })

  it('resets after window expires', () => {
    // Make max attempts
    for (let i = 0; i < 10; i++) {
      checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    }

    // Should be blocked
    let result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result.allowed).toBe(false)

    // Fast forward past the window (60s)
    vi.advanceTimersByTime(61 * 1000)

    // Should be allowed again
    result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result.allowed).toBe(true)
  })

  it('allows manual reset', () => {
    // Make max attempts
    for (let i = 0; i < 10; i++) {
      checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    }

    // Should be blocked
    let result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result.allowed).toBe(false)

    // Reset manually
    resetRateLimit('test-action')

    // Should be allowed again
    result = checkRateLimit('test-action', RATE_LIMITS.MESSAGE_SEND)
    expect(result.allowed).toBe(true)
  })

  it('tracks different keys independently', () => {
    // Max out action1
    for (let i = 0; i < 10; i++) {
      checkRateLimit('action1', RATE_LIMITS.MESSAGE_SEND)
    }

    // action1 should be blocked
    const result1 = checkRateLimit('action1', RATE_LIMITS.MESSAGE_SEND)
    expect(result1.allowed).toBe(false)

    // action2 should still be allowed
    const result2 = checkRateLimit('action2', RATE_LIMITS.MESSAGE_SEND)
    expect(result2.allowed).toBe(true)
  })

  it('uses sliding window correctly', () => {
    const config = { maxAttempts: 3, windowMs: 10000 } // 3 attempts per 10s

    // Make 3 attempts at t=0
    checkRateLimit('test', config)
    checkRateLimit('test', config)
    checkRateLimit('test', config)

    // 4th attempt at t=0 should be blocked
    let result = checkRateLimit('test', config)
    expect(result.allowed).toBe(false)

    // Advance 6 seconds (first attempt still in window)
    vi.advanceTimersByTime(6000)
    result = checkRateLimit('test', config)
    expect(result.allowed).toBe(false)

    // Advance another 5 seconds (first attempt now outside window)
    vi.advanceTimersByTime(5000)
    result = checkRateLimit('test', config)
    expect(result.allowed).toBe(true)
  })

  it('respects custom block duration', () => {
    const config = {
      maxAttempts: 2,
      windowMs: 5000,
      blockDurationMs: 15000, // Block for 15s
    }

    // Make max attempts
    checkRateLimit('test', config)
    checkRateLimit('test', config)

    // Should be blocked
    let result = checkRateLimit('test', config)
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(14)

    // After window expires (5s), still blocked because blockDuration is 15s
    vi.advanceTimersByTime(6000)
    result = checkRateLimit('test', config)
    expect(result.allowed).toBe(false)

    // After blockDuration expires (15s total), should be allowed
    vi.advanceTimersByTime(10000)
    result = checkRateLimit('test', config)
    expect(result.allowed).toBe(true)
  })
})
