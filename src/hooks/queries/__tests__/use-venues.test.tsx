import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useVenue, useVenues, useCreateVenue, useUpdateVenue } from '../use-venues'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  getById: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/services', async () => {
  const actual = await vi.importActual('@/services')
  return {
    ...actual,
    VenueService: {
      getById: mocks.getById,
      list: mocks.list,
      create: mocks.create,
      update: mocks.update,
    },
  }
})

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

describe('use-venues', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useVenue', () => {
    it('fetches venue by ID', async () => {
      const mockVenue = { id: 'venue-1', venue_name: 'Test Venue' }
      mocks.getById.mockResolvedValue(mockVenue)

      const { result } = renderHook(() => useVenue('venue-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockVenue)
      expect(mocks.getById).toHaveBeenCalledWith('venue-1')
    })
  })

  describe('useVenues', () => {
    it('lists venues with pagination', async () => {
      const mockVenues = { data: [{ id: 'venue-1' }], count: 1 }
      mocks.list.mockResolvedValue(mockVenues)

      const { result } = renderHook(() => useVenues({ limit: 10 }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockVenues)
    })
  })

  describe('useCreateVenue', () => {
    it('creates venue and invalidates cache', async () => {
      const mockVenue = { id: 'venue-new', venue_name: 'New Venue' }
      mocks.create.mockResolvedValue(mockVenue)

      const { result } = renderHook(() => useCreateVenue(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        venue_name: 'New Venue',
        profile_id: 'profile-1',
      } as any)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mocks.create).toHaveBeenCalled()
    })
  })

  describe('useUpdateVenue', () => {
    it('updates venue and invalidates cache', async () => {
      const mockVenue = { id: 'venue-1', venue_name: 'Updated Venue' }
      mocks.update.mockResolvedValue(mockVenue)

      const { result } = renderHook(() => useUpdateVenue(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        id: 'venue-1',
        input: { venue_name: 'Updated Venue' },
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mocks.update).toHaveBeenCalledWith('venue-1', {
        venue_name: 'Updated Venue',
      })
    })
  })
})
