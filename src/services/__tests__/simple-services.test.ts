import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockAmenity, mockGenre, mockCity, mockRegion, mockAvailability } from '@/test/mocks/data'

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

import { AmenityService } from '../amenities'
import { GenreService } from '../genres'
import { LocationService } from '../locations'
import { AvailabilityService } from '../availability'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AmenityService', () => {
  it('lists amenities ordered by sort_order', async () => {
    const builder = mocks.createBuilder({ data: [mockAmenity], error: null })
    mocks.mockFrom.mockReturnValue(builder)

    const result = await AmenityService.list()
    expect(result).toEqual([mockAmenity])
    expect(mocks.mockFrom).toHaveBeenCalledWith('amenities')
    expect(builder.order).toHaveBeenCalledWith('sort_order', { ascending: true })
  })
})

describe('GenreService', () => {
  it('lists genres ordered by sort_order', async () => {
    const builder = mocks.createBuilder({ data: [mockGenre], error: null })
    mocks.mockFrom.mockReturnValue(builder)

    const result = await GenreService.list()
    expect(result).toEqual([mockGenre])
    expect(mocks.mockFrom).toHaveBeenCalledWith('genres')
  })
})

describe('LocationService', () => {
  describe('getCities', () => {
    it('returns cities with region info', async () => {
      const cityWithRegion = { ...mockCity, regions: mockRegion }
      const builder = mocks.createBuilder({ data: [cityWithRegion], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await LocationService.getCities()
      expect(result).toEqual([cityWithRegion])
      expect(mocks.mockFrom).toHaveBeenCalledWith('cities')
    })
  })

  describe('getRegions', () => {
    it('returns regions', async () => {
      const builder = mocks.createBuilder({ data: [mockRegion], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await LocationService.getRegions()
      expect(result).toEqual([mockRegion])
      expect(mocks.mockFrom).toHaveBeenCalledWith('regions')
    })
  })
})

describe('AvailabilityService', () => {
  it('gets availability by artist ID', async () => {
    const builder = mocks.createBuilder({ data: [mockAvailability], error: null })
    mocks.mockFrom.mockReturnValue(builder)

    const result = await AvailabilityService.getByArtistId('artist-1')
    expect(result).toEqual([mockAvailability])
    expect(mocks.mockFrom).toHaveBeenCalledWith('availability')
    expect(builder.eq).toHaveBeenCalledWith('artist_id', 'artist-1')
  })
})
