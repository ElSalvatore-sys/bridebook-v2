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

import { SearchService } from '../search'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SearchService', () => {
  describe('searchArtists', () => {
    it('calls RPC with correct params', async () => {
      mocks.mockRpc.mockResolvedValue({ data: [{ id: 'a1', stage_name: 'DJ Test', rank: 1 }], error: null })

      const result = await SearchService.searchArtists('test', { genre_id: 'g1' }, 10, 5)
      expect(mocks.mockRpc).toHaveBeenCalledWith('search_artists', {
        search_query: 'test',
        filters: { genre_id: 'g1' },
        result_limit: 10,
        result_offset: 5,
      })
      expect(result).toHaveLength(1)
    })

    it('uses default limit/offset', async () => {
      mocks.mockRpc.mockResolvedValue({ data: [], error: null })

      await SearchService.searchArtists('test')
      expect(mocks.mockRpc).toHaveBeenCalledWith('search_artists', expect.objectContaining({
        result_limit: 20,
        result_offset: 0,
      }))
    })

    it('throws on error', async () => {
      mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'Search failed' } })

      await expect(SearchService.searchArtists('test')).rejects.toThrow('Search failed')
    })
  })

  describe('searchVenues', () => {
    it('calls RPC with correct params', async () => {
      mocks.mockRpc.mockResolvedValue({ data: [{ id: 'v1', venue_name: 'Test Club', rank: 1 }], error: null })

      const result = await SearchService.searchVenues('club', { venue_type: 'CLUB' })
      expect(mocks.mockRpc).toHaveBeenCalledWith('search_venues', expect.objectContaining({
        search_query: 'club',
      }))
      expect(result).toHaveLength(1)
    })

    it('throws on error', async () => {
      mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'Venue search failed' } })

      await expect(SearchService.searchVenues('test')).rejects.toThrow('Venue search failed')
    })
  })

  describe('searchAll', () => {
    it('returns combined results from both searches', async () => {
      mocks.mockRpc
        .mockResolvedValueOnce({ data: [{ id: 'a1', stage_name: 'DJ' }], error: null })
        .mockResolvedValueOnce({ data: [{ id: 'v1', venue_name: 'Club' }], error: null })

      const result = await SearchService.searchAll('test')
      expect(result.artists).toHaveLength(1)
      expect(result.venues).toHaveLength(1)
    })

    it('uses limit=10 by default', async () => {
      mocks.mockRpc
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null })

      await SearchService.searchAll('test')
      expect(mocks.mockRpc).toHaveBeenCalledWith('search_artists', expect.objectContaining({ result_limit: 10 }))
      expect(mocks.mockRpc).toHaveBeenCalledWith('search_venues', expect.objectContaining({ result_limit: 10 }))
    })
  })
})
