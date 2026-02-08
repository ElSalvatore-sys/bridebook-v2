import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockMediaRecord } from '@/test/mocks/data'

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

import { MediaService } from '../media'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('MediaService', () => {
  describe('create', () => {
    it('validates and inserts media record', async () => {
      const builder = mocks.createBuilder({ data: mockMediaRecord, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MediaService.create('artist_media', 'artist-1', {
        url: 'https://example.com/image.jpg',
        type: 'IMAGE',
        sort_order: 0,
        is_primary: false,
      })
      expect(result).toEqual(mockMediaRecord)
      expect(mocks.mockFrom).toHaveBeenCalledWith('artist_media')
      expect(builder.insert).toHaveBeenCalled()
    })

    it('uses venue_id FK for venue_media table', async () => {
      const builder = mocks.createBuilder({ data: mockMediaRecord, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await MediaService.create('venue_media', 'venue-1', {
        url: 'https://example.com/image.jpg',
        type: 'IMAGE',
        sort_order: 0,
        is_primary: false,
      })
      expect(mocks.mockFrom).toHaveBeenCalledWith('venue_media')
      expect(builder.insert).toHaveBeenCalledWith(
        expect.objectContaining({ venue_id: 'venue-1' })
      )
    })
  })

  describe('delete', () => {
    it('deletes a media record', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await MediaService.delete('artist_media', 'media-1')
      expect(mocks.mockFrom).toHaveBeenCalledWith('artist_media')
      expect(builder.delete).toHaveBeenCalled()
      expect(builder.eq).toHaveBeenCalledWith('id', 'media-1')
    })
  })

  describe('update', () => {
    it('updates a media record', async () => {
      const updated = { ...mockMediaRecord, title: 'New Title' }
      const builder = mocks.createBuilder({ data: updated, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MediaService.update('artist_media', 'media-1', { title: 'New Title' })
      expect(result).toEqual(updated)
      expect(builder.update).toHaveBeenCalledWith({ title: 'New Title' })
    })
  })

  describe('getByEntity', () => {
    it('gets all media for an artist', async () => {
      const builder = mocks.createBuilder({ data: [mockMediaRecord], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await MediaService.getByEntity('artist_media', 'artist-1')
      expect(result).toEqual([mockMediaRecord])
      expect(builder.eq).toHaveBeenCalledWith('artist_id', 'artist-1')
      expect(builder.order).toHaveBeenCalledWith('sort_order', { ascending: true })
    })

    it('uses venue_id FK for venue_media', async () => {
      const builder = mocks.createBuilder({ data: [], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await MediaService.getByEntity('venue_media', 'venue-1')
      expect(builder.eq).toHaveBeenCalledWith('venue_id', 'venue-1')
    })
  })

  describe('setPrimary', () => {
    it('unsets all then sets target as primary', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await MediaService.setPrimary('artist_media', 'artist-1', 'media-1')
      // Called twice: once for unset, once for set
      expect(mocks.mockFrom).toHaveBeenCalledWith('artist_media')
      expect(builder.update).toHaveBeenCalledWith({ is_primary: false })
      expect(builder.update).toHaveBeenCalledWith({ is_primary: true })
    })
  })
})
