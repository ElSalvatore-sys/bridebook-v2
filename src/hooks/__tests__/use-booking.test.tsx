import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockBooking } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  BookingService: {
    getByUser: vi.fn(),
    getForProvider: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

import { BookingService } from '@/services'
import {
  useUserBookings,
  useProviderBookings,
  useBooking,
  useCreateBooking,
  useUpdateBookingStatus,
} from '../queries/use-booking'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useUserBookings', () => {
  it('calls BookingService.getByUser', async () => {
    ;(BookingService.getByUser as ReturnType<typeof vi.fn>).mockResolvedValue([mockBooking])

    const { result } = renderHook(() => useUserBookings(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockBooking])
  })
})

describe('useProviderBookings', () => {
  it('calls BookingService.getForProvider', async () => {
    ;(BookingService.getForProvider as ReturnType<typeof vi.fn>).mockResolvedValue([mockBooking])

    const { result } = renderHook(() => useProviderBookings(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockBooking])
  })
})

describe('useBooking', () => {
  it('calls BookingService.getById', async () => {
    ;(BookingService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooking)

    const { result } = renderHook(() => useBooking('booking-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockBooking)
  })
})

describe('useCreateBooking', () => {
  it('calls BookingService.create', async () => {
    ;(BookingService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooking)

    const { result } = renderHook(() => useCreateBooking(), { wrapper })
    result.current.mutate({
      input: { title: 'Test', event_date: '2030-06-15', start_time: '20:00', end_time: '23:00' },
      artistId: 'artist-1',
      venueId: 'venue-1',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateBookingStatus', () => {
  it('calls BookingService.updateStatus', async () => {
    ;(BookingService.updateStatus as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockBooking, status: 'ACCEPTED' })

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper })
    result.current.mutate({ id: 'booking-1', status: 'ACCEPTED' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
