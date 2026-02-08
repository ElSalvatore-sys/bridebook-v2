import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockArtist } from '@/test/mocks/data'

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

import { ArtistService } from '../artists'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ArtistService', () => {
  describe('create', () => {
    it('validates, authenticates, and inserts', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockArtist, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.create({ stage_name: 'DJ Test' })
      expect(result).toEqual(mockArtist)
      expect(mocks.mockFrom).toHaveBeenCalledWith('artists')
      expect(builder.insert).toHaveBeenCalled()
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(ArtistService.create({ stage_name: 'DJ Test' })).rejects.toThrow('Not authenticated')
    })
  })

  describe('getById', () => {
    it('returns artist with details', async () => {
      const artistWithDetails = { ...mockArtist, artist_genres: [], artist_media: [] }
      const builder = mocks.createBuilder({ data: artistWithDetails, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.getById('artist-1')
      expect(result).toEqual(artistWithDetails)
    })
  })

  describe('getByProfileId', () => {
    it('returns artist for profile', async () => {
      const builder = mocks.createBuilder({ data: mockArtist, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.getByProfileId('user-123')
      expect(result).toEqual(mockArtist)
    })

    it('returns null when no artist exists', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.getByProfileId('user-999')
      expect(result).toBeNull()
    })
  })

  describe('list', () => {
    it('returns paginated artists without genre filter', async () => {
      const builder = mocks.createBuilder({ data: [mockArtist], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.list()
      expect(result.data).toEqual([mockArtist])
      expect(result.count).toBe(1)
    })

    it('filters by genre when genreId provided', async () => {
      const builder = mocks.createBuilder({
        data: [{ ...mockArtist, artist_genres: [{ genre_id: 'genre-1' }] }],
        error: null,
        count: 1,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.list({ genreId: 'genre-1' })
      expect(result.data).toHaveLength(1)
    })
  })

  describe('update', () => {
    it('validates and updates artist', async () => {
      const updated = { ...mockArtist, stage_name: 'New Name' }
      const builder = mocks.createBuilder({ data: updated, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.update('artist-1', { stage_name: 'New Name' })
      expect(result.stage_name).toBe('New Name')
    })
  })

  describe('delete', () => {
    it('soft deletes artist', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await ArtistService.delete('artist-1')
      expect(mocks.mockFrom).toHaveBeenCalledWith('artists')
      expect(builder.update).toHaveBeenCalledWith(
        expect.objectContaining({ deleted_at: expect.any(String) })
      )
    })
  })

  describe('search', () => {
    it('searches by stage name', async () => {
      const builder = mocks.createBuilder({ data: [mockArtist], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.search('DJ')
      expect(result.data).toEqual([mockArtist])
      expect(builder.ilike).toHaveBeenCalledWith('stage_name', '%DJ%')
    })
  })

  describe('getSimilar', () => {
    it('returns latest artists when no genres', async () => {
      // First call: get genres (empty)
      const genreBuilder = mocks.createBuilder({ data: [], error: null })
      // Second call: get artists
      const artistBuilder = mocks.createBuilder({
        data: [{
          id: 'a2',
          stage_name: 'Other DJ',
          bio: null,
          hourly_rate: 40,
          years_experience: 3,
          has_equipment: false,
          artist_media: [],
          artist_genres: [],
        }],
        error: null,
      })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return genreBuilder
        return artistBuilder
      })

      const result = await ArtistService.getSimilar('artist-1')
      expect(result).toHaveLength(1)
    })

    it('deduplicates results', async () => {
      const genreBuilder = mocks.createBuilder({ data: [{ genre_id: 'g1' }], error: null })
      const artistBuilder = mocks.createBuilder({
        data: [
          { id: 'a2', stage_name: 'DJ A', bio: null, hourly_rate: 40, years_experience: 3, has_equipment: false, artist_media: [], artist_genres: [{ genres: { name: 'House' } }] },
          { id: 'a2', stage_name: 'DJ A', bio: null, hourly_rate: 40, years_experience: 3, has_equipment: false, artist_media: [], artist_genres: [{ genres: { name: 'Techno' } }] },
        ],
        error: null,
      })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return genreBuilder
        return artistBuilder
      })

      const result = await ArtistService.getSimilar('artist-1')
      expect(result).toHaveLength(1)
    })
  })

  describe('discover', () => {
    it('returns filtered results with defaults', async () => {
      const builder = mocks.createBuilder({
        data: [{
          id: 'a1',
          stage_name: 'DJ Test',
          bio: null,
          hourly_rate: 50,
          years_experience: 5,
          has_equipment: true,
          created_at: '2024-01-01',
          artist_media: [{ url: 'http://img.jpg', is_primary: true }],
          artist_genres: [{ genres: { name: 'House' } }],
        }],
        error: null,
        count: 1,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await ArtistService.discover()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].primary_image_url).toBe('http://img.jpg')
    })

    it('applies genre filter', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await ArtistService.discover({ genreIds: ['genre-1'] })
      expect(builder.in).toHaveBeenCalledWith('artist_genres.genre_id', ['genre-1'])
    })

    it('applies price range filter', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await ArtistService.discover({ priceMin: 20, priceMax: 100 })
      expect(builder.gte).toHaveBeenCalledWith('hourly_rate', 20)
      expect(builder.lte).toHaveBeenCalledWith('hourly_rate', 100)
    })

    it('sorts by price_low', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await ArtistService.discover({ sortBy: 'price_low' })
      expect(builder.order).toHaveBeenCalledWith('hourly_rate', { ascending: true, nullsFirst: false })
    })
  })
})
