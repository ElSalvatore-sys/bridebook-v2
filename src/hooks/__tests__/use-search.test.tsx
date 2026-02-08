import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'

vi.mock('@/services/search', () => ({
  SearchService: {
    searchArtists: vi.fn(),
    searchVenues: vi.fn(),
    searchAll: vi.fn(),
  },
}))

import { SearchService } from '@/services/search'
import { useSearchArtistsRpc, useSearchVenuesRpc, useGlobalSearch } from '../queries/use-search'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useSearchArtistsRpc', () => {
  it('calls SearchService.searchArtists when query >= 2 chars', async () => {
    ;(SearchService.searchArtists as ReturnType<typeof vi.fn>).mockResolvedValue([])

    const { result } = renderHook(() => useSearchArtistsRpc('DJ'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(SearchService.searchArtists).toHaveBeenCalledWith('DJ', undefined)
  })
})

describe('useSearchVenuesRpc', () => {
  it('calls SearchService.searchVenues when query >= 2 chars', async () => {
    ;(SearchService.searchVenues as ReturnType<typeof vi.fn>).mockResolvedValue([])

    const { result } = renderHook(() => useSearchVenuesRpc('Cl'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(SearchService.searchVenues).toHaveBeenCalledWith('Cl', undefined)
  })
})

describe('useGlobalSearch', () => {
  it('calls SearchService.searchAll', async () => {
    ;(SearchService.searchAll as ReturnType<typeof vi.fn>).mockResolvedValue({ artists: [], venues: [] })

    const { result } = renderHook(() => useGlobalSearch('test'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(SearchService.searchAll).toHaveBeenCalledWith('test')
  })
})
