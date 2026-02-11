/**
 * Amenity Service tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AmenityService } from '../amenities'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  handleSupabaseError: vi.fn(),
}))

vi.mock('../supabase', () => ({
  supabase: {
    from: mocks.from,
  },
}))

vi.mock('@/lib/errors', () => ({
  handleSupabaseError: mocks.handleSupabaseError,
}))

describe('AmenityService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('returns amenities ordered by sort_order', async () => {
      const mockAmenities = [
        { id: '1', name: 'WiFi', sort_order: 1 },
        { id: '2', name: 'Parking', sort_order: 2 },
      ]

      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockAmenities, error: null }),
        }),
      })

      const result = await AmenityService.list()

      expect(result).toEqual(mockAmenities)
      expect(mocks.from).toHaveBeenCalledWith('amenities')
    })

    it('returns empty array when data is null', async () => {
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      })

      const result = await AmenityService.list()

      expect(result).toEqual([])
    })

    it('handles supabase error', async () => {
      const error = { message: 'Database error' }
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error }),
        }),
      })

      await AmenityService.list()

      expect(mocks.handleSupabaseError).toHaveBeenCalledWith(error)
    })
  })
})
