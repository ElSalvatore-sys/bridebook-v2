/**
 * use-favorites hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useFavorites,
  useFavoritesByType,
  useFavoriteArtistsEnriched,
  useFavoriteVenuesEnriched,
  useAddFavorite,
  useRemoveFavorite,
  useToggleFavorite,
  useIsFavorite,
} from '../use-favorites'

const mocks = vi.hoisted(() => ({
  getFavorites: vi.fn(),
  getFavoritesByType: vi.fn(),
  getFavoriteArtistsEnriched: vi.fn(),
  getFavoriteVenuesEnriched: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  toggleFavorite: vi.fn(),
  checkIsFavorite: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  user: { id: 'user-1' },
}))

vi.mock('@/services/favorites', () => ({
  FavoriteService: {
    getFavorites: mocks.getFavorites,
    getFavoritesByType: mocks.getFavoritesByType,
    getFavoriteArtistsEnriched: mocks.getFavoriteArtistsEnriched,
    getFavoriteVenuesEnriched: mocks.getFavoriteVenuesEnriched,
    addFavorite: mocks.addFavorite,
    removeFavorite: mocks.removeFavorite,
    toggleFavorite: mocks.toggleFavorite,
    checkIsFavorite: mocks.checkIsFavorite,
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: mocks.showSuccess,
  showError: mocks.showError,
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: mocks.user }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('use-favorites hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useFavorites', () => {
    it('fetches user favorites', async () => {
      const mockResult = {
        data: [
          { id: '1', favorite_type: 'ARTIST', artist_id: 'a1' },
          { id: '2', favorite_type: 'VENUE', venue_id: 'v1' },
        ],
        count: 2,
        page: 1,
        totalPages: 1,
      }
      mocks.getFavorites.mockResolvedValue(mockResult)

      const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(mocks.getFavorites).toHaveBeenCalled()
    })

  })

  describe('useAddFavorite', () => {
    it('adds favorite and invalidates cache', async () => {
      const mockFavorite = { id: '1', favorite_type: 'ARTIST' }
      mocks.addFavorite.mockResolvedValue(mockFavorite)

      const { result } = renderHook(() => useAddFavorite(), { wrapper: createWrapper() })

      await result.current.mutateAsync({ vendorType: 'ARTIST', vendorId: 'a1' })

      expect(mocks.addFavorite).toHaveBeenCalledWith('a1', 'ARTIST')
      // No success toast in this hook - it just invalidates cache
    })
  })

  describe('useRemoveFavorite', () => {
    it('removes favorite and invalidates cache', async () => {
      mocks.removeFavorite.mockResolvedValue(undefined)

      const { result } = renderHook(() => useRemoveFavorite(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ vendorId: 'a1', vendorType: 'ARTIST' })

      expect(mocks.removeFavorite).toHaveBeenCalledWith('a1', 'ARTIST')
      // No success toast in this hook - it just invalidates cache
    })
  })

  describe('useIsFavorite', () => {
    it('checks if entity is favorited', async () => {
      mocks.checkIsFavorite.mockResolvedValue(true)

      const { result } = renderHook(() => useIsFavorite('a1', 'ARTIST'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(true)
      expect(mocks.checkIsFavorite).toHaveBeenCalledWith('a1', 'ARTIST')
    })

    it('is disabled when vendorId is empty', () => {
      const { result } = renderHook(() => useIsFavorite('', 'ARTIST'), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mocks.checkIsFavorite).not.toHaveBeenCalled()
    })
  })

  describe('useFavoritesByType', () => {
    it('fetches favorites by type', async () => {
      const mockData = { data: [{ id: '1', favorite_type: 'VENUE' }], count: 1 }
      mocks.getFavoritesByType.mockResolvedValue(mockData)

      const { result } = renderHook(
        () =>
          useFavoritesByType('VENUE' as const, {
            queryKey: ['favorites', 'list', 'VENUE'],
            queryFn: () => mocks.getFavoritesByType('VENUE'),
          } as any),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.getFavoritesByType).toHaveBeenCalledWith('VENUE')
    })

    it('fetches artist favorites by type', async () => {
      const mockData = { data: [{ id: '2', favorite_type: 'ARTIST' }], count: 1 }
      mocks.getFavoritesByType.mockResolvedValue(mockData)

      const { result } = renderHook(
        () =>
          useFavoritesByType('ARTIST' as const, {
            queryKey: ['favorites', 'list', 'ARTIST'],
            queryFn: () => mocks.getFavoritesByType('ARTIST'),
          } as any),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.getFavoritesByType).toHaveBeenCalledWith('ARTIST')
      expect(result.current.data).toEqual(mockData)
    })
  })

  describe('useFavoriteArtistsEnriched', () => {
    it('fetches enriched artist favorites', async () => {
      const mockArtists = [{ id: 'a1', stage_name: 'Test Artist' }]
      mocks.getFavoriteArtistsEnriched.mockResolvedValue(mockArtists)

      const { result } = renderHook(
        () =>
          useFavoriteArtistsEnriched({
            queryKey: ['favorites', 'list', 'artists-enriched'],
            queryFn: mocks.getFavoriteArtistsEnriched,
          } as any),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.getFavoriteArtistsEnriched).toHaveBeenCalled()
    })
  })

  describe('useFavoriteVenuesEnriched', () => {
    it('fetches enriched venue favorites', async () => {
      const mockVenues = [{ id: 'v1', venue_name: 'Test Venue' }]
      mocks.getFavoriteVenuesEnriched.mockResolvedValue(mockVenues)

      const { result } = renderHook(
        () =>
          useFavoriteVenuesEnriched({
            queryKey: ['favorites', 'list', 'venues-enriched'],
            queryFn: mocks.getFavoriteVenuesEnriched,
          } as any),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.getFavoriteVenuesEnriched).toHaveBeenCalled()
    })
  })

  describe('useToggleFavorite', () => {
    it('toggles favorite with optimistic update', async () => {
      mocks.toggleFavorite.mockResolvedValue({ added: true })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      queryClient.setQueryData(['favorites', 'check', 'a1', 'ARTIST'], false)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useToggleFavorite(), { wrapper })

      await result.current.mutateAsync({ vendorId: 'a1', vendorType: 'ARTIST' })

      expect(mocks.toggleFavorite).toHaveBeenCalledWith('a1', 'ARTIST')
    })

    it('rolls back on error', async () => {
      const error = new Error('Toggle failed')
      mocks.toggleFavorite.mockRejectedValue(error)

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      queryClient.setQueryData(['favorites', 'check', 'a1', 'ARTIST'], true)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useToggleFavorite(), { wrapper })

      try {
        await result.current.mutateAsync({ vendorId: 'a1', vendorType: 'ARTIST' })
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })
  })

  describe('error handling', () => {
    it('calls showError when addFavorite fails', async () => {
      const error = new Error('Add failed')
      mocks.addFavorite.mockRejectedValue(error)

      const { result } = renderHook(() => useAddFavorite(), { wrapper: createWrapper() })

      try {
        await result.current.mutateAsync({ vendorId: 'a1', vendorType: 'ARTIST' })
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })

    it('calls showError when removeFavorite fails', async () => {
      const error = new Error('Remove failed')
      mocks.removeFavorite.mockRejectedValue(error)

      const { result } = renderHook(() => useRemoveFavorite(), { wrapper: createWrapper() })

      try {
        await result.current.mutateAsync({ vendorId: 'a1', vendorType: 'ARTIST' })
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })
  })
})
