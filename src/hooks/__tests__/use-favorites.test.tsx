import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockFavorite } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  FavoriteService: {
    getFavorites: vi.fn(),
    checkIsFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
    getFavoriteArtistsEnriched: vi.fn(),
    getFavoriteVenuesEnriched: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    getFavoritesByType: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showError: vi.fn(),
}))

import { FavoriteService } from '@/services'
import { useFavorites, useIsFavorite, useToggleFavorite } from '../queries/use-favorites'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useFavorites', () => {
  it('calls FavoriteService.getFavorites', async () => {
    ;(FavoriteService.getFavorites as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockFavorite], count: 1 })

    const { result } = renderHook(() => useFavorites(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual([mockFavorite])
  })
})

describe('useIsFavorite', () => {
  it('calls FavoriteService.checkIsFavorite', async () => {
    ;(FavoriteService.checkIsFavorite as ReturnType<typeof vi.fn>).mockResolvedValue(true)

    const { result } = renderHook(() => useIsFavorite('artist-1', 'ARTIST'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
  })
})

describe('useToggleFavorite', () => {
  it('calls FavoriteService.toggleFavorite', async () => {
    ;(FavoriteService.toggleFavorite as ReturnType<typeof vi.fn>).mockResolvedValue({ isFavorite: true })

    const { result } = renderHook(() => useToggleFavorite(), { wrapper })
    result.current.mutate({ vendorId: 'artist-1', vendorType: 'ARTIST' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(FavoriteService.toggleFavorite).toHaveBeenCalledWith('artist-1', 'ARTIST')
  })
})
