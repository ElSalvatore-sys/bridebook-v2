import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockEmailPreferences } from '@/test/mocks/data'

const mocks = vi.hoisted(() => {
  const fn = vi.fn
  function createBuilder(result?: { data?: unknown; error?: unknown; count?: number | null }) {
    const r = { data: result?.data ?? null, error: result?.error ?? null, count: result?.count ?? null }
    const b: Record<string, any> = {}
    for (const m of ['select','eq','neq','is','in','ilike','gte','lte','order','range','limit','or','insert','update','delete','single','maybeSingle','abortSignal'])
      b[m] = fn().mockReturnValue(b)
    b.then = (resolve: (v: any) => void) => { resolve(r); return b }
    return b as Record<string, ReturnType<typeof vi.fn>> & { then: unknown }
  }
  const mockQueryBuilder = createBuilder()
  const mockFrom = fn().mockReturnValue(mockQueryBuilder)
  const mockAuth = {
    getUser: fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: fn(),
    signUp: fn(),
    signOut: fn(),
    signInWithOAuth: fn(),
    resetPasswordForEmail: fn(),
    updateUser: fn(),
    onAuthStateChange: fn().mockReturnValue({ data: { subscription: { unsubscribe: fn() } } }),
  }
  const mockStorageBucket = {
    upload: fn().mockResolvedValue({ data: { path: 'test/path' }, error: null }),
    remove: fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/bucket/test' } }),
  }
  const mockStorage = { from: fn().mockReturnValue(mockStorageBucket) }
  const mockFunctions = { invoke: fn().mockResolvedValue({ data: { id: 'mock-resend-id' }, error: null }) }
  const mockRpc = fn().mockResolvedValue({ data: [], error: null })
  return {
    supabase: { from: mockFrom, auth: mockAuth, storage: mockStorage, functions: mockFunctions, rpc: mockRpc },
    mockFrom, mockQueryBuilder, mockAuth, mockStorage, mockStorageBucket, mockFunctions, mockRpc, createBuilder,
  }
})

vi.mock('@/services/supabase', () => ({ supabase: mocks.supabase }))

import { EmailService } from '../email'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('EmailService', () => {
  describe('send', () => {
    it('sends email when preferences allow', async () => {
      // Mock getPreferencesForUser
      const prefsBuilder = mocks.createBuilder({ data: { ...mockEmailPreferences, booking_emails: true }, error: null })
      // Mock isDuplicate (no duplicate)
      const dedupBuilder = mocks.createBuilder({ data: [], error: null })
      // Mock email_logs insert
      const logBuilder = mocks.createBuilder({ data: null, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return prefsBuilder  // preferences
        if (callCount === 2) return dedupBuilder   // dedup check
        return logBuilder                           // log insert
      })

      mocks.mockFunctions.invoke.mockResolvedValue({ data: { id: 'resend-1' }, error: null })

      await EmailService.send(
        'booking-new',
        'user-123',
        'test@example.com',
        { subject: 'Test', html: '<p>Test</p>' }
      )

      expect(mocks.mockFunctions.invoke).toHaveBeenCalledWith('send-email', expect.any(Object))
    })

    it('skips when booking_emails disabled', async () => {
      const prefsBuilder = mocks.createBuilder({
        data: { ...mockEmailPreferences, booking_emails: false },
        error: null,
      })
      mocks.mockFrom.mockReturnValue(prefsBuilder)

      await EmailService.send(
        'booking-new',
        'user-123',
        'test@example.com',
        { subject: 'Test', html: '<p>Test</p>' }
      )

      expect(mocks.mockFunctions.invoke).not.toHaveBeenCalled()
    })

    it('skips when message_emails disabled', async () => {
      const prefsBuilder = mocks.createBuilder({
        data: { ...mockEmailPreferences, message_emails: false },
        error: null,
      })
      mocks.mockFrom.mockReturnValue(prefsBuilder)

      await EmailService.send(
        'message-new',
        'user-123',
        'test@example.com',
        { subject: 'Test', html: '<p>Test</p>' }
      )

      expect(mocks.mockFunctions.invoke).not.toHaveBeenCalled()
    })

    it('never throws (silent failure)', async () => {
      mocks.mockFrom.mockImplementation(() => { throw new Error('DB down') })

      await expect(
        EmailService.send('booking-new', 'user-123', 'test@example.com', { subject: 'Test', html: '<p>Test</p>' })
      ).resolves.toBeUndefined()
    })
  })

  describe('getPreferences', () => {
    it('returns preferences for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockEmailPreferences, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EmailService.getPreferences()
      expect(result).toEqual(mockEmailPreferences)
    })

    it('returns null when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await EmailService.getPreferences()
      expect(result).toBeNull()
    })
  })

  describe('updatePreferences', () => {
    it('updates preferences', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const updated = { ...mockEmailPreferences, marketing_emails: true }
      const builder = mocks.createBuilder({ data: updated, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EmailService.updatePreferences({ marketing_emails: true })
      expect(result).toEqual(updated)
    })

    it('throws when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(EmailService.updatePreferences({ marketing_emails: true })).rejects.toThrow('Not authenticated')
    })
  })
})
