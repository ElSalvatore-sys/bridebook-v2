import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockProfile } from '@/test/mocks/data'

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

import { ProfileService } from '../profiles'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProfileService', () => {
  describe('getCurrent', () => {
    it('returns profile for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockProfile, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ProfileService.getCurrent()
      expect(result).toEqual(mockProfile)
      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(ProfileService.getCurrent()).rejects.toThrow('Not authenticated')
    })
  })

  describe('getById', () => {
    it('returns profile by ID', async () => {
      const builder = mocks.createBuilder({ data: mockProfile, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ProfileService.getById('user-123')
      expect(result).toEqual(mockProfile)
    })

    it('throws on error', async () => {
      const builder = mocks.createBuilder({
        data: null,
        error: { code: 'PGRST116', message: 'Not found', details: '', hint: '' },
      })
      mocks.mockFrom.mockReturnValue(builder)

      await expect(ProfileService.getById('nonexistent')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('validates and updates profile', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: { ...mockProfile, first_name: 'Updated' }, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ProfileService.update({ first_name: 'Updated' })
      expect(result.first_name).toBe('Updated')
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(ProfileService.update({ first_name: 'Test' })).rejects.toThrow('Not authenticated')
    })
  })

  describe('getByRole', () => {
    it('returns paginated results with defaults', async () => {
      const builder = mocks.createBuilder({
        data: [mockProfile],
        error: null,
        count: 1,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ProfileService.getByRole('ARTIST')
      expect(result.data).toEqual([mockProfile])
      expect(result.count).toBe(1)
    })

    it('passes custom pagination options', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await ProfileService.getByRole('ARTIST', { limit: 5, offset: 10 })
      expect(builder.range).toHaveBeenCalledWith(10, 14)
    })
  })
})
