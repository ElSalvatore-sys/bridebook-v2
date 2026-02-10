import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const fn = vi.fn
  function createBuilder(result?: { data?: unknown; error?: unknown; count?: number | null }) {
    const r = { data: result?.data ?? null, error: result?.error ?? null, count: result?.count ?? null }
    const b: Record<string, any> = {}
    for (const m of ['select','eq','neq','is','in','ilike','gte','lte','order','range','limit','or','insert','update','delete','single','maybeSingle','abortSignal','not'])
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

import { AnalyticsService } from '../analytics'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AnalyticsService', () => {
  describe('getUserStats', () => {
    it('returns user counts by role', async () => {
      const builder = mocks.createBuilder({ data: null, error: null, count: 10 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getUserStats()

      expect(result.users).toBe(10)
      expect(result.artists).toBe(10)
      expect(result.venues).toBe(10)
      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
    })
  })

  describe('getEnquiryStats', () => {
    it('returns enquiry counts by status', async () => {
      const builder = mocks.createBuilder({ data: null, error: null, count: 5 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getEnquiryStats()

      expect(result.pending).toBe(5)
      expect(result.read).toBe(5)
      expect(result.responded).toBe(5)
      expect(result.archived).toBe(5)
      expect(mocks.mockFrom).toHaveBeenCalledWith('enquiries')
    })
  })

  describe('getActivityStats', () => {
    it('returns message and favorite counts', async () => {
      const builder = mocks.createBuilder({ data: null, error: null, count: 100 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getActivityStats()

      expect(result.messages).toBe(100)
      expect(result.favorites).toBe(100)
      expect(mocks.mockFrom).toHaveBeenCalledWith('messages')
    })
  })

  describe('getSignupTrend', () => {
    it('returns time-series data grouped by date', async () => {
      const mockProfiles = [
        { created_at: '2024-01-01T10:00:00Z' },
        { created_at: '2024-01-01T14:00:00Z' },
        { created_at: '2024-01-02T10:00:00Z' },
      ]
      const builder = mocks.createBuilder({ data: mockProfiles, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getSignupTrend(30)

      expect(mocks.mockFrom).toHaveBeenCalledWith('profiles')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ date: '2024-01-01', count: 2 })
      expect(result[1]).toEqual({ date: '2024-01-02', count: 1 })
    })
  })

  describe('getTopArtists', () => {
    it('returns top 5 artists by favorite count', async () => {
      const mockFavorites = [
        { artist_id: 'a1' },
        { artist_id: 'a1' },
        { artist_id: 'a2' },
      ]
      const mockArtists = [
        { id: 'a1', stage_name: 'Artist 1', profile_id: 'p1', profiles: { avatar_url: null } },
        { id: 'a2', stage_name: 'Artist 2', profile_id: 'p2', profiles: { avatar_url: null } },
      ]

      const favBuilder = mocks.createBuilder({ data: mockFavorites, error: null })
      const artistBuilder = mocks.createBuilder({ data: mockArtists, error: null })

      mocks.mockFrom
        .mockReturnValueOnce(favBuilder)
        .mockReturnValueOnce(artistBuilder)

      const result = await AnalyticsService.getTopArtists(5)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Artist 1')
      expect(result[0].favorite_count).toBe(2)
      expect(result[1].name).toBe('Artist 2')
      expect(result[1].favorite_count).toBe(1)
    })

    it('returns empty array when no favorites', async () => {
      const builder = mocks.createBuilder({ data: [], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getTopArtists(5)

      expect(result).toEqual([])
    })
  })

  describe('getTopVenues', () => {
    it('returns top 5 venues by favorite count', async () => {
      const mockFavorites = [
        { venue_id: 'v1' },
        { venue_id: 'v1' },
        { venue_id: 'v1' },
        { venue_id: 'v2' },
      ]
      const mockVenues = [
        { id: 'v1', profile_id: 'p1', profiles: { display_name: 'Venue 1', avatar_url: 'http://test.com/v1.jpg' } },
        { id: 'v2', profile_id: 'p2', profiles: { display_name: 'Venue 2', avatar_url: null } },
      ]

      const favBuilder = mocks.createBuilder({ data: mockFavorites, error: null })
      const venueBuilder = mocks.createBuilder({ data: mockVenues, error: null })

      mocks.mockFrom
        .mockReturnValueOnce(favBuilder)
        .mockReturnValueOnce(venueBuilder)

      const result = await AnalyticsService.getTopVenues(5)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Venue 1')
      expect(result[0].favorite_count).toBe(3)
      expect(result[1].name).toBe('Venue 2')
      expect(result[1].favorite_count).toBe(1)
    })

    it('returns empty array when no favorites', async () => {
      const builder = mocks.createBuilder({ data: [], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await AnalyticsService.getTopVenues(5)

      expect(result).toEqual([])
    })
  })
})
