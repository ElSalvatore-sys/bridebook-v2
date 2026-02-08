import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockVenue } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  VenueService: {
    getById: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    getByProfileId: vi.fn(),
    search: vi.fn(),
    getSimilar: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/lib/errors', () => ({
  isAbortError: vi.fn().mockReturnValue(false),
}))

import { VenueService } from '@/services'
import { useVenue, useVenues, useCreateVenue, useDeleteVenue } from '../queries/use-venues'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useVenue', () => {
  it('calls VenueService.getById', async () => {
    ;(VenueService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockVenue)

    const { result } = renderHook(() => useVenue('venue-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockVenue)
  })
})

describe('useVenues', () => {
  it('calls VenueService.list', async () => {
    ;(VenueService.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockVenue], count: 1 })

    const { result } = renderHook(() => useVenues(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual([mockVenue])
  })
})

describe('useCreateVenue', () => {
  it('calls VenueService.create', async () => {
    ;(VenueService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockVenue)

    const { result } = renderHook(() => useCreateVenue(), { wrapper })
    result.current.mutate({ venue_name: 'Test Club', type: 'CLUB' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteVenue', () => {
  it('calls VenueService.delete', async () => {
    ;(VenueService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteVenue(), { wrapper })
    result.current.mutate('venue-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(VenueService.delete).toHaveBeenCalledWith('venue-1')
  })
})
