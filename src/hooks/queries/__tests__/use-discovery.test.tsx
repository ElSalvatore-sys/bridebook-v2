/**
 * use-discovery hook tests - branch coverage for conditional filters
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDiscoverVenues } from '../use-discovery'

const mocks = vi.hoisted(() => ({
  discover: vi.fn(),
  useFilterStore: vi.fn(),
}))

vi.mock('@/services/venues', () => ({
  VenueService: {
    discover: mocks.discover,
  },
}))

vi.mock('@/stores/filter-store', () => ({
  useFilterStore: mocks.useFilterStore,
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('use-discovery hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useDiscoverVenues', () => {
    it('handles empty venueTypes array', async () => {
      mocks.useFilterStore.mockImplementation((selector) =>
        selector({
          searchQuery: '',
          categories: [],
          location: { cityId: null, coordinates: null },
          venueTypes: [], // Empty array - branch test
          amenityIds: [],
          sortBy: 'rating',
          page: 1,
          pageSize: 20,
        })
      )

      mocks.discover.mockResolvedValue({ data: [], count: 0 })

      const { result } = renderHook(() => useDiscoverVenues(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.discover).toHaveBeenCalledWith(
        expect.objectContaining({
          venueTypes: undefined, // Should be undefined when empty
        })
      )
    })

    it('handles non-empty venueTypes array', async () => {
      mocks.useFilterStore.mockImplementation((selector) =>
        selector({
          searchQuery: '',
          categories: [],
          location: { cityId: null, coordinates: null },
          venueTypes: ['BAR'], // Non-empty array - branch test
          amenityIds: [],
          sortBy: 'rating',
          page: 1,
          pageSize: 20,
        })
      )

      mocks.discover.mockResolvedValue({ data: [], count: 0 })

      const { result } = renderHook(() => useDiscoverVenues(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.discover).toHaveBeenCalledWith(
        expect.objectContaining({
          venueTypes: ['BAR'], // Should include array when not empty
        })
      )
    })

    it('handles empty amenityIds array', async () => {
      mocks.useFilterStore.mockImplementation((selector) =>
        selector({
          searchQuery: '',
          categories: [],
          location: { cityId: null, coordinates: null },
          venueTypes: [],
          amenityIds: [], // Empty array - branch test
          sortBy: 'rating',
          page: 1,
          pageSize: 20,
        })
      )

      mocks.discover.mockResolvedValue({ data: [], count: 0 })

      const { result } = renderHook(() => useDiscoverVenues(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.discover).toHaveBeenCalledWith(
        expect.objectContaining({
          amenityIds: undefined, // Should be undefined when empty
        })
      )
    })

    it('handles non-empty amenityIds array', async () => {
      mocks.useFilterStore.mockImplementation((selector) =>
        selector({
          searchQuery: '',
          categories: [],
          location: { cityId: null, coordinates: null },
          venueTypes: [],
          amenityIds: ['amenity-1', 'amenity-2'], // Non-empty array - branch test
          sortBy: 'rating',
          page: 1,
          pageSize: 20,
        })
      )

      mocks.discover.mockResolvedValue({ data: [], count: 0 })

      const { result } = renderHook(() => useDiscoverVenues(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.discover).toHaveBeenCalledWith(
        expect.objectContaining({
          amenityIds: ['amenity-1', 'amenity-2'], // Should include array when not empty
        })
      )
    })

    it('handles searchQuery with non-empty string', async () => {
      mocks.useFilterStore.mockImplementation((selector) =>
        selector({
          searchQuery: 'jazz club',
          categories: [],
          location: { cityId: 'city-1', coordinates: null },
          venueTypes: [],
          amenityIds: [],
          sortBy: 'rating',
          page: 1,
          pageSize: 20,
        })
      )

      mocks.discover.mockResolvedValue({ data: [], count: 0 })

      const { result } = renderHook(() => useDiscoverVenues(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.discover).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: 'jazz club',
          cityId: 'city-1',
        })
      )
    })
  })
})
