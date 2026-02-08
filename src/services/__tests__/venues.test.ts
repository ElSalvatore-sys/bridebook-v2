import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockVenue } from '@/test/mocks/data'

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

import { VenueService } from '../venues'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('VenueService', () => {
  describe('create', () => {
    it('validates, authenticates, and inserts', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockVenue, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.create({ venue_name: 'Test Club', type: 'CLUB' })
      expect(result).toEqual(mockVenue)
      expect(mocks.mockFrom).toHaveBeenCalledWith('venues')
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(VenueService.create({ venue_name: 'Test', type: 'CLUB' })).rejects.toThrow('Not authenticated')
    })
  })

  describe('getById', () => {
    it('returns venue with details', async () => {
      const venueWithDetails = { ...mockVenue, venue_amenities: [], venue_media: [], cities: { name: 'Wiesbaden' } }
      const builder = mocks.createBuilder({ data: venueWithDetails, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.getById('venue-1')
      expect(result).toEqual(venueWithDetails)
    })
  })

  describe('getByProfileId', () => {
    it('returns venue for profile', async () => {
      const builder = mocks.createBuilder({ data: mockVenue, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.getByProfileId('user-123')
      expect(result).toEqual(mockVenue)
    })

    it('returns null when no venue exists', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.getByProfileId('user-999')
      expect(result).toBeNull()
    })
  })

  describe('list', () => {
    it('returns paginated venues', async () => {
      const builder = mocks.createBuilder({ data: [mockVenue], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.list()
      expect(result.data).toEqual([mockVenue])
      expect(result.count).toBe(1)
    })

    it('filters by type', async () => {
      const builder = mocks.createBuilder({ data: [mockVenue], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      await VenueService.list({ type: 'CLUB' })
      expect(builder.eq).toHaveBeenCalledWith('type', 'CLUB')
    })

    it('filters by city', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await VenueService.list({ cityId: 'city-1' })
      expect(builder.eq).toHaveBeenCalledWith('city_id', 'city-1')
    })
  })

  describe('update', () => {
    it('validates and updates venue', async () => {
      const updated = { ...mockVenue, venue_name: 'New Name' }
      const builder = mocks.createBuilder({ data: updated, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.update('venue-1', { venue_name: 'New Name' })
      expect(result.venue_name).toBe('New Name')
    })
  })

  describe('delete', () => {
    it('soft deletes venue', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await VenueService.delete('venue-1')
      expect(builder.update).toHaveBeenCalledWith(
        expect.objectContaining({ deleted_at: expect.any(String) })
      )
    })
  })

  describe('search', () => {
    it('searches by venue name', async () => {
      const builder = mocks.createBuilder({ data: [mockVenue], error: null, count: 1 })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.search('Club')
      expect(result.data).toEqual([mockVenue])
      expect(builder.ilike).toHaveBeenCalledWith('venue_name', '%Club%')
    })
  })

  describe('getSimilar', () => {
    it('finds similar venues by type', async () => {
      const venueInfoBuilder = mocks.createBuilder({ data: { type: 'CLUB', city_id: 'city-1' }, error: null })
      const similarBuilder = mocks.createBuilder({
        data: [{
          id: 'v2',
          venue_name: 'Other Club',
          description: null,
          type: 'CLUB',
          street: null,
          capacity_min: 100,
          capacity_max: 300,
          cities: { name: 'Frankfurt' },
          venue_media: [],
          venue_amenities: [],
        }],
        error: null,
      })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return venueInfoBuilder
        return similarBuilder
      })

      const result = await VenueService.getSimilar('venue-1')
      expect(result).toHaveLength(1)
      expect(result[0].venue_name).toBe('Other Club')
    })
  })

  describe('discover', () => {
    it('returns filtered results with defaults', async () => {
      const builder = mocks.createBuilder({
        data: [{
          id: 'v1',
          venue_name: 'Test Club',
          description: null,
          type: 'CLUB',
          street: null,
          capacity_min: 50,
          capacity_max: 200,
          created_at: '2024-01-01',
          cities: { name: 'Wiesbaden' },
          venue_media: [{ url: 'http://img.jpg', is_primary: true }],
          venue_amenities: [{ amenities: { name: 'Sound System' } }],
        }],
        error: null,
        count: 1,
      })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await VenueService.discover()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].city_name).toBe('Wiesbaden')
      expect(result.data[0].amenity_names).toContain('Sound System')
    })

    it('applies capacity filter', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await VenueService.discover({ capacityMin: 50, capacityMax: 200 })
      expect(builder.gte).toHaveBeenCalledWith('capacity_max', 50)
      expect(builder.lte).toHaveBeenCalledWith('capacity_min', 200)
    })

    it('applies venue type filter', async () => {
      const builder = mocks.createBuilder({ data: [], error: null, count: 0 })
      mocks.mockFrom.mockReturnValue(builder)

      await VenueService.discover({ venueTypes: ['CLUB', 'BAR'] })
      expect(builder.in).toHaveBeenCalledWith('type', ['CLUB', 'BAR'])
    })
  })
})
