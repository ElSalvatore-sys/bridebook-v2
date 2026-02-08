import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockFavorite } from '@/test/mocks/data'

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

import { FavoriteService } from '../favorites'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FavoriteService', () => {
  describe('getFavorites', () => {
    it('returns all favorites for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({
        data: [mockFavorite],
        error: null,
        count: 1,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.getFavorites()
      expect(result.data).toEqual([mockFavorite])
    })

    it('throws when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(FavoriteService.getFavorites()).rejects.toThrow('Not authenticated')
    })
  })

  describe('getFavoritesByType', () => {
    it('filters by type', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: [mockFavorite], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.getFavoritesByType('ARTIST')
      expect(result.data).toEqual([mockFavorite])
      expect(builder.eq).toHaveBeenCalledWith('favorite_type', 'ARTIST')
    })
  })

  describe('checkIsFavorite', () => {
    it('returns true when favorite exists', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: { id: 'fav-1' }, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.checkIsFavorite('artist-1', 'ARTIST')
      expect(result).toBe(true)
    })

    it('returns false when no favorite', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.checkIsFavorite('artist-1', 'ARTIST')
      expect(result).toBe(false)
    })

    it('returns false when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      const result = await FavoriteService.checkIsFavorite('artist-1', 'ARTIST')
      expect(result).toBe(false)
    })
  })

  describe('addFavorite', () => {
    it('inserts favorite for ARTIST type', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockFavorite, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.addFavorite('artist-1', 'ARTIST')
      expect(result).toEqual(mockFavorite)
      expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({
        profile_id: 'user-123',
        favorite_type: 'ARTIST',
        artist_id: 'artist-1',
        venue_id: null,
      }))
    })

    it('inserts favorite for VENUE type', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const venueFav = { ...mockFavorite, favorite_type: 'VENUE', artist_id: null, venue_id: 'venue-1' }
      const builder = mocks.createBuilder({ data: venueFav, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await FavoriteService.addFavorite('venue-1', 'VENUE')
      expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({
        venue_id: 'venue-1',
        artist_id: null,
      }))
    })
  })

  describe('removeFavorite', () => {
    it('deletes favorite', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await FavoriteService.removeFavorite('artist-1', 'ARTIST')
      expect(builder.delete).toHaveBeenCalled()
    })
  })

  describe('toggleFavorite', () => {
    it('removes when already favorited', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      // checkIsFavorite returns data (favorite exists)
      const checkBuilder = mocks.createBuilder({ data: { id: 'fav-1' }, error: null })
      const deleteBuilder = mocks.createBuilder({ data: null, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        // First call: checkIsFavorite selects from favorites
        if (callCount <= 1) return checkBuilder
        // Second call: removeFavorite deletes
        return deleteBuilder
      })

      const result = await FavoriteService.toggleFavorite('artist-1', 'ARTIST')
      expect(result.isFavorite).toBe(false)
    })

    it('adds when not favorited', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const checkBuilder = mocks.createBuilder({ data: null, error: null })
      const insertBuilder = mocks.createBuilder({ data: mockFavorite, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount <= 1) return checkBuilder
        return insertBuilder
      })

      const result = await FavoriteService.toggleFavorite('artist-1', 'ARTIST')
      expect(result.isFavorite).toBe(true)
    })
  })

  describe('getFavoriteArtistsEnriched', () => {
    it('returns enriched artist data', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({
        data: [{
          artists: {
            id: 'artist-1',
            stage_name: 'DJ Test',
            bio: 'Bio',
            hourly_rate: 50,
            years_experience: 5,
            has_equipment: true,
            artist_media: [{ url: 'http://img.jpg', is_primary: true }],
            artist_genres: [{ genres: { name: 'House' } }],
          },
        }],
        error: null,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await FavoriteService.getFavoriteArtistsEnriched()
      expect(result).toHaveLength(1)
      expect(result[0].stage_name).toBe('DJ Test')
      expect(result[0].primary_image_url).toBe('http://img.jpg')
      expect(result[0].genre_names).toContain('House')
    })
  })
})
