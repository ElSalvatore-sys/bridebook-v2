import { describe, it, expect, vi, beforeEach } from 'vitest'

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

import { AdminService } from '../admin'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AdminService', () => {
  describe('getStats', () => {
    it('returns platform counts', async () => {
      const builder = mocks.createBuilder({ data: null, error: null, count: 42 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AdminService.getStats()

      expect(result.users).toBe(42)
      expect(result.artists).toBe(42)
      expect(result.venues).toBe(42)
      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
    })
  })

  describe('getUsers', () => {
    it('returns paginated users', async () => {
      const mockUsers = [
        { id: 'u1', email: 'a@test.com', display_name: 'Alice', first_name: 'Alice', last_name: 'Test', role: 'USER', created_at: '2024-01-01' },
      ]
      const builder = mocks.createBuilder({ data: mockUsers, error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AdminService.getUsers(1, 20)

      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
      expect(result.users).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('updateUserRole', () => {
    it('calls update with correct params', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await AdminService.updateUserRole('u1', 'ADMIN')

      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
      expect(builder.update).toHaveBeenCalledWith({ role: 'ADMIN' })
      expect(builder.eq).toHaveBeenCalledWith('id', 'u1')
    })
  })

  describe('getRecentActivity', () => {
    it('returns recent items', async () => {
      const mockBookings = [
        { id: 'b1-longid-here', created_at: '2024-01-15T10:00:00Z' },
      ]
      const builder = mocks.createBuilder({ data: mockBookings, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AdminService.getRecentActivity()

      expect(mocks.mockFrom).toHaveBeenCalledWith('booking_requests')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('booking')
    })
  })
})
