/**
 * Location Service tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocationService } from '../locations'

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

describe('LocationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCities', () => {
    it('returns cities with region info', async () => {
      const mockCities = [
        { id: '1', name: 'Berlin', regions: { id: 'r1', name: 'Germany' } },
        { id: '2', name: 'Munich', regions: { id: 'r1', name: 'Germany' } },
      ]

      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
        }),
      })

      const result = await LocationService.getCities()

      expect(result).toEqual(mockCities)
      expect(mocks.from).toHaveBeenCalledWith('cities')
    })

    it('returns empty array when data is null', async () => {
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      })

      const result = await LocationService.getCities()

      expect(result).toEqual([])
    })

    it('handles supabase error', async () => {
      const error = { message: 'Database error' }
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error }),
        }),
      })

      await LocationService.getCities()

      expect(mocks.handleSupabaseError).toHaveBeenCalledWith(error)
    })
  })

  describe('getRegions', () => {
    it('returns regions ordered by name', async () => {
      const mockRegions = [
        { id: 'r1', name: 'Germany' },
        { id: 'r2', name: 'France' },
      ]

      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockRegions, error: null }),
        }),
      })

      const result = await LocationService.getRegions()

      expect(result).toEqual(mockRegions)
      expect(mocks.from).toHaveBeenCalledWith('regions')
    })

    it('returns empty array when data is null', async () => {
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      })

      const result = await LocationService.getRegions()

      expect(result).toEqual([])
    })

    it('handles supabase error', async () => {
      const error = { message: 'Database error' }
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error }),
        }),
      })

      await LocationService.getRegions()

      expect(mocks.handleSupabaseError).toHaveBeenCalledWith(error)
    })
  })
})
