import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAvailability } from '../use-availability'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  getByArtistId: vi.fn(),
}))

vi.mock('@/services', async () => {
  const actual = await vi.importActual('@/services')
  return {
    ...actual,
    AvailabilityService: {
      getByArtistId: mocks.getByArtistId,
    },
  }
})

describe('use-availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAvailability', () => {
    it('fetches availability for artist', async () => {
      const mockAvailability = [
        { id: 'avail-1', date: '2026-07-15', is_available: true },
        { id: 'avail-2', date: '2026-07-16', is_available: false },
      ]
      mocks.getByArtistId.mockResolvedValue(mockAvailability)

      const { result } = renderHook(() => useAvailability('artist-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockAvailability)
      expect(mocks.getByArtistId).toHaveBeenCalledWith('artist-1')
    })

    it('does not fetch when artistId is empty', () => {
      const { result } = renderHook(() => useAvailability(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(mocks.getByArtistId).not.toHaveBeenCalled()
    })
  })
})
