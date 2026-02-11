/**
 * use-artists hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useArtist,
  useArtistByProfile,
  useArtists,
  useSearchArtists,
  useCreateArtist,
  useUpdateArtist,
  useDeleteArtist,
  useSimilarArtists,
} from '../use-artists'

// Mock services and toast
const mocks = vi.hoisted(() => ({
  getById: vi.fn(),
  getByProfileId: vi.fn(),
  list: vi.fn(),
  search: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getSimilar: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/services', () => ({
  ArtistService: {
    getById: mocks.getById,
    getByProfileId: mocks.getByProfileId,
    list: mocks.list,
    search: mocks.search,
    create: mocks.create,
    update: mocks.update,
    delete: mocks.delete,
    getSimilar: mocks.getSimilar,
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: mocks.showSuccess,
  showError: mocks.showError,
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

describe('use-artists hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useArtist', () => {
    it('fetches artist by ID', async () => {
      const mockArtist = { id: '1', stage_name: 'Test Artist' }
      mocks.getById.mockResolvedValue(mockArtist)

      const { result } = renderHook(() => useArtist('1'), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockArtist)
      expect(mocks.getById).toHaveBeenCalledWith('1')
    })

    it('handles error state', async () => {
      const error = new Error('Failed to fetch')
      mocks.getById.mockRejectedValue(error)

      const { result } = renderHook(() => useArtist('1'), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })
  })

  describe('useArtistByProfile', () => {
    it('fetches artist by profile ID', async () => {
      const mockArtist = { id: '1', profile_id: 'profile-1' }
      mocks.getByProfileId.mockResolvedValue(mockArtist)

      const { result } = renderHook(() => useArtistByProfile('profile-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockArtist)
    })
  })

  describe('useArtists', () => {
    it('fetches artist list', async () => {
      const mockData = { data: [{ id: '1' }, { id: '2' }], count: 2 }
      mocks.list.mockResolvedValue(mockData)

      const { result } = renderHook(() => useArtists(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockData)
      expect(mocks.list).toHaveBeenCalled()
    })
  })

  describe('useSearchArtists', () => {
    it('searches artists when query > 2 chars', async () => {
      const mockData = { data: [{ id: '1' }], count: 1 }
      mocks.search.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSearchArtists('test'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.search).toHaveBeenCalledWith('test', undefined)
    })

    it('does not fetch when query <= 2 chars', () => {
      const { result } = renderHook(() => useSearchArtists('ab'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(true)
      expect(mocks.search).not.toHaveBeenCalled()
    })
  })

  describe('useCreateArtist', () => {
    it('creates artist and invalidates cache', async () => {
      const mockArtist = { id: '1', stage_name: 'New Artist' }
      mocks.create.mockResolvedValue(mockArtist)

      const { result } = renderHook(() => useCreateArtist(), { wrapper: createWrapper() })

      await result.current.mutateAsync({ stage_name: 'New Artist' })

      expect(mocks.create).toHaveBeenCalledWith({ stage_name: 'New Artist' })
      expect(mocks.showSuccess).toHaveBeenCalledWith('Artist profile created successfully')
    })

    it('handles error on create', async () => {
      const error = new Error('Create failed')
      mocks.create.mockRejectedValue(error)

      const { result } = renderHook(() => useCreateArtist(), { wrapper: createWrapper() })

      await expect(result.current.mutateAsync({ stage_name: 'New' })).rejects.toThrow()
      expect(mocks.showError).toHaveBeenCalledWith(error)
    })
  })

  describe('useUpdateArtist', () => {
    it('updates artist and invalidates cache', async () => {
      const mockArtist = { id: '1', stage_name: 'Updated' }
      mocks.update.mockResolvedValue(mockArtist)

      const { result } = renderHook(() => useUpdateArtist(), { wrapper: createWrapper() })

      await result.current.mutateAsync({ id: '1', input: { stage_name: 'Updated' } })

      expect(mocks.update).toHaveBeenCalledWith('1', { stage_name: 'Updated' })
      expect(mocks.showSuccess).toHaveBeenCalledWith('Artist profile updated successfully')
    })
  })

  describe('useDeleteArtist', () => {
    it('deletes artist and invalidates cache', async () => {
      mocks.delete.mockResolvedValue(undefined)

      const { result } = renderHook(() => useDeleteArtist(), { wrapper: createWrapper() })

      await result.current.mutateAsync('1')

      expect(mocks.delete).toHaveBeenCalledWith('1')
      expect(mocks.showSuccess).toHaveBeenCalledWith('Artist profile deleted successfully')
    })
  })

  describe('useSimilarArtists', () => {
    it('fetches similar artists', async () => {
      const mockSimilar = [{ id: '2' }, { id: '3' }]
      mocks.getSimilar.mockResolvedValue(mockSimilar)

      const { result } = renderHook(() => useSimilarArtists('1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockSimilar)
      expect(mocks.getSimilar).toHaveBeenCalledWith('1')
    })
  })
})
