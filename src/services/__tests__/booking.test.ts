import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockBooking } from '@/test/mocks/data'

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

import { BookingService } from '../booking'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('BookingService', () => {
  describe('create', () => {
    it('validates, inserts booking, and creates audit event', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const insertBuilder = mocks.createBuilder({ data: mockBooking, error: null })
      const eventBuilder = mocks.createBuilder({ data: null, error: null })
      // For sendBookingNewEmail: profiles select, artists select, venues select, recipient profile
      const profileBuilder = mocks.createBuilder({ data: { first_name: 'Test', last_name: 'User' }, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return insertBuilder       // booking insert
        if (callCount === 2) return eventBuilder         // audit event insert
        return profileBuilder                             // email lookups
      })

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      const result = await BookingService.create(
        { title: 'Test Booking', event_date: futureDateStr, start_time: '20:00', end_time: '23:00' },
        'artist-1',
        'venue-1'
      )
      expect(result).toEqual(mockBooking)
      expect(mocks.mockFrom).toHaveBeenCalledWith('booking_requests')
      expect(mocks.mockFrom).toHaveBeenCalledWith('booking_request_events')
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      await expect(
        BookingService.create({ title: 'Test', event_date: futureDateStr, start_time: '20:00', end_time: '23:00' }, 'a1', 'v1')
      ).rejects.toThrow('Not authenticated')
    })
  })

  describe('getByUser', () => {
    it('returns bookings for authenticated user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: [mockBooking], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await BookingService.getByUser()
      expect(result).toEqual([mockBooking])
      expect(builder.eq).toHaveBeenCalledWith('requester_id', 'user-123')
    })
  })

  describe('getForProvider', () => {
    it('returns empty when user has no artist or venue', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await BookingService.getForProvider()
      expect(result).toEqual([])
    })

    it('filters by artist_id when user has artist only', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const artistBuilder = mocks.createBuilder({ data: { id: 'artist-1' }, error: null })
      const venueBuilder = mocks.createBuilder({ data: null, error: null })
      const bookingBuilder = mocks.createBuilder({ data: [mockBooking], error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return artistBuilder
        if (callCount === 2) return venueBuilder
        return bookingBuilder
      })

      const result = await BookingService.getForProvider()
      expect(result).toEqual([mockBooking])
    })
  })

  describe('getById', () => {
    it('returns booking detail', async () => {
      const detail = { ...mockBooking, booking_request_events: [] }
      const builder = mocks.createBuilder({ data: detail, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await BookingService.getById('booking-1')
      expect(result).toEqual(detail)
    })
  })

  describe('updateStatus', () => {
    it('updates status with audit trail', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const currentBuilder = mocks.createBuilder({ data: { status: 'PENDING' }, error: null })
      const updateBuilder = mocks.createBuilder({ data: { ...mockBooking, status: 'ACCEPTED' }, error: null })
      const eventBuilder = mocks.createBuilder({ data: null, error: null })
      const profileBuilder = mocks.createBuilder({ data: { id: 'user-123', email: 'test@example.com', first_name: 'Test' }, error: null })

      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) return currentBuilder    // get current status
        if (callCount === 2) return updateBuilder     // update booking
        if (callCount === 3) return eventBuilder      // audit event
        return profileBuilder                          // email lookup
      })

      const result = await BookingService.updateStatus('booking-1', 'ACCEPTED', 'Looks great!')
      expect(result.status).toBe('ACCEPTED')
    })
  })
})
