import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockArtist } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  ArtistService: {
    getById: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    getByProfileId: vi.fn(),
    search: vi.fn(),
    getSimilar: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/lib/errors', () => ({
  isAbortError: vi.fn().mockReturnValue(false),
}))

import { ArtistService } from '@/services'
import { useArtist, useArtists, useCreateArtist, useDeleteArtist } from '../queries/use-artists'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useArtist', () => {
  it('calls ArtistService.getById', async () => {
    ;(ArtistService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockArtist)

    const { result } = renderHook(() => useArtist('artist-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockArtist)
  })
})

describe('useArtists', () => {
  it('calls ArtistService.list', async () => {
    ;(ArtistService.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockArtist], count: 1 })

    const { result } = renderHook(() => useArtists(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual([mockArtist])
  })
})

describe('useCreateArtist', () => {
  it('calls ArtistService.create', async () => {
    ;(ArtistService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockArtist)

    const { result } = renderHook(() => useCreateArtist(), { wrapper })
    result.current.mutate({ stage_name: 'DJ Test' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteArtist', () => {
  it('calls ArtistService.delete', async () => {
    ;(ArtistService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteArtist(), { wrapper })
    result.current.mutate('artist-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ArtistService.delete).toHaveBeenCalledWith('artist-1')
  })
})
