/**
 * Vendor Search Hook Tests
 * Tests for useVendorSearch, useVenueSearch, useArtistSearch, getTotalCount, flattenPages
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  venueList: vi.fn(),
  venueSearch: vi.fn(),
  artistList: vi.fn(),
  artistSearch: vi.fn(),
}))

vi.mock('@/services', () => ({
  VenueService: {
    list: mocks.venueList,
    search: mocks.venueSearch,
  },
  ArtistService: {
    list: mocks.artistList,
    search: mocks.artistSearch,
  },
}))

vi.mock('@/stores', () => ({
  useFilterStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    const state = {
      searchQuery: '',
      categories: [] as string[],
      priceRange: null,
      location: { cityId: null, radius: 50 },
      sortBy: 'relevance',
      pageSize: 20,
    }
    return selector ? selector(state) : state
  },
}))

import {
  useVenueSearch,
  useArtistSearch,
  getTotalCount,
  flattenPages,
  vendorSearchKeys,
} from '../queries/use-vendor-search'

let wrapper: ReturnType<typeof createWrapper>

beforeEach(() => {
  vi.clearAllMocks()
  wrapper = createWrapper()
})

// ========== VENDOR SEARCH KEYS ==========

describe('vendorSearchKeys', () => {
  it('generates base key', () => {
    expect(vendorSearchKeys.all).toEqual(['vendors', 'search'])
  })

  it('generates venues key with filters', () => {
    const filters = { q: 'test' }
    const key = vendorSearchKeys.venues(filters)
    expect(key).toEqual(['vendors', 'search', 'venues', filters])
  })

  it('generates artists key with filters', () => {
    const filters = { q: 'dj' }
    const key = vendorSearchKeys.artists(filters)
    expect(key).toEqual(['vendors', 'search', 'artists', filters])
  })
})

// ========== GET TOTAL COUNT (pure function) ==========

describe('getTotalCount', () => {
  it('returns count from first page', () => {
    const pages = [
      { data: [{ id: '1' }], count: 42, nextPage: 20 },
      { data: [{ id: '2' }], count: 42, nextPage: null },
    ]

    expect(getTotalCount(pages)).toBe(42)
  })

  it('returns null when pages is undefined', () => {
    expect(getTotalCount(undefined)).toBeNull()
  })

  it('returns null when pages is empty array', () => {
    expect(getTotalCount([])).toBeNull()
  })

  it('returns null when first page has null count', () => {
    const pages = [{ data: [{ id: '1' }], count: null, nextPage: null }]

    expect(getTotalCount(pages)).toBeNull()
  })

  it('returns 0 when count is 0', () => {
    const pages = [{ data: [], count: 0, nextPage: null }]

    expect(getTotalCount(pages)).toBe(0)
  })
})

// ========== FLATTEN PAGES (pure function) ==========

describe('flattenPages', () => {
  it('flattens multiple pages into a single array', () => {
    const pages = [
      { data: [{ id: '1' }, { id: '2' }], count: 4, nextPage: 2 },
      { data: [{ id: '3' }, { id: '4' }], count: 4, nextPage: null },
    ]

    const result = flattenPages(pages)
    expect(result).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }])
  })

  it('returns empty array when pages is undefined', () => {
    expect(flattenPages(undefined)).toEqual([])
  })

  it('returns empty array when pages is empty', () => {
    expect(flattenPages([])).toEqual([])
  })

  it('handles pages with empty data arrays', () => {
    const pages = [
      { data: [{ id: '1' }], count: 1, nextPage: null },
      { data: [], count: 1, nextPage: null },
    ]

    const result = flattenPages(pages)
    expect(result).toEqual([{ id: '1' }])
  })

  it('handles single page', () => {
    const pages = [{ data: [{ id: '1' }, { id: '2' }], count: 2, nextPage: null }]

    const result = flattenPages(pages)
    expect(result).toEqual([{ id: '1' }, { id: '2' }])
  })
})

// ========== USE VENUE SEARCH ==========

describe('useVenueSearch', () => {
  it('calls VenueService.list when no search query', async () => {
    mocks.venueList.mockResolvedValue({
      data: [{ id: 'v1', venue_name: 'Club Test' }],
      count: 1,
    })

    const { result } = renderHook(() => useVenueSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mocks.venueList).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
      cityId: undefined,
    })
    expect(mocks.venueSearch).not.toHaveBeenCalled()
  })

  it('returns paginated data', async () => {
    mocks.venueList.mockResolvedValue({
      data: [{ id: 'v1', venue_name: 'Test Venue' }],
      count: 1,
    })

    const { result } = renderHook(() => useVenueSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const page = result.current.data?.pages[0]
    expect(page?.data).toEqual([{ id: 'v1', venue_name: 'Test Venue' }])
    expect(page?.count).toBe(1)
  })

  it('sets nextPage to null when no more results', async () => {
    mocks.venueList.mockResolvedValue({
      data: [{ id: 'v1' }],
      count: 1,
    })

    const { result } = renderHook(() => useVenueSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.pages[0]?.nextPage).toBeNull()
    expect(result.current.hasNextPage).toBe(false)
  })

  it('handles error from VenueService.list', async () => {
    mocks.venueList.mockRejectedValue(new Error('Venue list failed'))

    const { result } = renderHook(() => useVenueSearch(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Venue list failed')
  })
})

// ========== USE ARTIST SEARCH ==========

describe('useArtistSearch', () => {
  it('calls ArtistService.list when no search query', async () => {
    mocks.artistList.mockResolvedValue({
      data: [{ id: 'a1', stage_name: 'DJ Test' }],
      count: 1,
    })

    const { result } = renderHook(() => useArtistSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mocks.artistList).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
      genreId: undefined,
    })
    expect(mocks.artistSearch).not.toHaveBeenCalled()
  })

  it('returns paginated data', async () => {
    mocks.artistList.mockResolvedValue({
      data: [{ id: 'a1', stage_name: 'DJ Test' }],
      count: 1,
    })

    const { result } = renderHook(() => useArtistSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const page = result.current.data?.pages[0]
    expect(page?.data).toEqual([{ id: 'a1', stage_name: 'DJ Test' }])
    expect(page?.count).toBe(1)
  })

  it('sets nextPage to null when no more results', async () => {
    mocks.artistList.mockResolvedValue({
      data: [{ id: 'a1' }],
      count: 1,
    })

    const { result } = renderHook(() => useArtistSearch(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.pages[0]?.nextPage).toBeNull()
    expect(result.current.hasNextPage).toBe(false)
  })

  it('handles error from ArtistService.list', async () => {
    mocks.artistList.mockRejectedValue(new Error('Artist list failed'))

    const { result } = renderHook(() => useArtistSearch(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Artist list failed')
  })
})
