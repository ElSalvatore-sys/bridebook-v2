import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockThread, mockMessage } from '@/test/mocks/data'

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
vi.mock('../email', () => ({
  EmailService: {
    send: vi.fn(),
  },
}))

import { MessagingService } from '../messaging'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('MessagingService', () => {
  describe('getThreads', () => {
    it('returns threads for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({
        data: [{
          ...mockThread,
          participant_one: { id: 'user-123', first_name: 'Test', last_name: 'User', avatar_url: null, role: 'ARTIST' },
          participant_two: { id: 'user-456', first_name: 'Other', last_name: 'User', avatar_url: null, role: 'VENUE_OWNER' },
          messages: [{ ...mockMessage, sender_id: 'user-456' }],
        }],
        error: null,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MessagingService.getThreads()
      expect(result).toHaveLength(1)
      expect(result[0].last_message).toBeTruthy()
      expect(result[0].unread_count).toBe(1)
    })

    it('throws when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(MessagingService.getThreads()).rejects.toThrow('Not authenticated')
    })
  })

  describe('getThread', () => {
    it('returns thread and marks unread as read', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const threadBuilder = mocks.createBuilder({
        data: {
          ...mockThread,
          participant_one: null,
          participant_two: null,
          messages: [
            { ...mockMessage, sender_id: 'user-456', is_read: false },
          ],
        },
        error: null,
      })
      const updateBuilder = mocks.createBuilder({ data: null, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return threadBuilder
        return updateBuilder
      })

      const result = await MessagingService.getThread('thread-1')
      expect(result.messages).toHaveLength(1)
      // Should have called update to mark as read
      expect(mocks.mockFrom).toHaveBeenCalledWith('messages')
    })
  })

  describe('getOrCreateThread', () => {
    it('returns existing thread', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockThread, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MessagingService.getOrCreateThread('user-456')
      expect(result).toEqual(mockThread)
    })

    it('creates new thread when none exists', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const findBuilder = mocks.createBuilder({ data: null, error: null })
      const createBuilder = mocks.createBuilder({ data: mockThread, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return findBuilder
        return createBuilder
      })

      const result = await MessagingService.getOrCreateThread('user-456')
      expect(result).toEqual(mockThread)
    })
  })

  describe('sendMessage', () => {
    it('validates, inserts message, and updates thread', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const insertBuilder = mocks.createBuilder({ data: mockMessage, error: null })
      const updateBuilder = mocks.createBuilder({ data: null, error: null })
      const threadBuilder = mocks.createBuilder({
        data: { participant_one_id: 'user-123', participant_two_id: 'user-456' },
        error: null,
      })
      const profileBuilder = mocks.createBuilder({
        data: { first_name: 'Test', last_name: 'User' },
        error: null,
      })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return insertBuilder     // message insert
        if (callCount === 2) return updateBuilder     // thread update
        if (callCount === 3) return threadBuilder     // email: get thread
        return profileBuilder                          // email: get profiles
      })

      const result = await MessagingService.sendMessage('thread-1', 'Hello!')
      expect(result).toEqual(mockMessage)
      expect(mocks.mockFrom).toHaveBeenCalledWith('messages')
    })

    it('throws when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(MessagingService.sendMessage('thread-1', 'Hello!')).rejects.toThrow('Not authenticated')
    })
  })

  describe('getUnreadCount', () => {
    it('returns count for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const threadBuilder = mocks.createBuilder({ data: [{ id: 'thread-1' }], error: null })
      const countBuilder = mocks.createBuilder({ data: null, error: null, count: 3 })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return threadBuilder
        return countBuilder
      })

      const result = await MessagingService.getUnreadCount()
      expect(result).toBe(3)
    })

    it('returns 0 when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      const result = await MessagingService.getUnreadCount()
      expect(result).toBe(0)
    })

    it('returns 0 on error', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: null, error: { message: 'Error' } })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MessagingService.getUnreadCount()
      expect(result).toBe(0)
    })
  })
})
