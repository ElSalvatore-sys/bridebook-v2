/**
 * Simple lookup hooks tests
 * Tests for use-amenities, use-genres, use-locations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAmenities } from '../use-amenities'
import { useGenres } from '../use-genres'
import { useCities, useRegions } from '../use-locations'

const mocks = vi.hoisted(() => ({
  listAmenities: vi.fn(),
  listGenres: vi.fn(),
  getCities: vi.fn(),
  getRegions: vi.fn(),
}))

vi.mock('@/services/amenities', () => ({
  AmenityService: {
    list: mocks.listAmenities,
  },
}))

vi.mock('@/services/genres', () => ({
  GenreService: {
    list: mocks.listGenres,
  },
}))

vi.mock('@/services/locations', () => ({
  LocationService: {
    getCities: mocks.getCities,
    getRegions: mocks.getRegions,
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Simple lookup hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAmenities', () => {
    it('fetches all amenities', async () => {
      const mockAmenities = [
        { id: '1', name: 'WiFi' },
        { id: '2', name: 'Parking' },
      ]
      mocks.listAmenities.mockResolvedValue(mockAmenities)

      const { result } = renderHook(() => useAmenities(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAmenities)
      expect(mocks.listAmenities).toHaveBeenCalled()
    })

    it('handles error state', async () => {
      const error = new Error('Failed to fetch')
      mocks.listAmenities.mockRejectedValue(error)

      const { result } = renderHook(() => useAmenities(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })
  })

  describe('useGenres', () => {
    it('fetches all genres', async () => {
      const mockGenres = [
        { id: '1', name: 'Rock' },
        { id: '2', name: 'Jazz' },
      ]
      mocks.listGenres.mockResolvedValue(mockGenres)

      const { result } = renderHook(() => useGenres(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockGenres)
    })
  })

  describe('useCities', () => {
    it('fetches all cities', async () => {
      const mockCities = [
        { id: '1', name: 'Berlin' },
        { id: '2', name: 'Munich' },
      ]
      mocks.getCities.mockResolvedValue(mockCities)

      const { result } = renderHook(() => useCities(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockCities)
    })
  })

  describe('useRegions', () => {
    it('fetches all regions', async () => {
      const mockRegions = [{ id: '1', name: 'Hessen' }]
      mocks.getRegions.mockResolvedValue(mockRegions)

      const { result } = renderHook(() => useRegions(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockRegions)
    })
  })
})
