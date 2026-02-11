/**
 * Genre Service tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GenreService } from '../genres'

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

describe('GenreService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('returns genres ordered by sort_order', async () => {
      const mockGenres = [
        { id: '1', name: 'Rock', slug: 'rock', sort_order: 1 },
        { id: '2', name: 'Jazz', slug: 'jazz', sort_order: 2 },
      ]

      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockGenres, error: null }),
        }),
      })

      const result = await GenreService.list()

      expect(result).toEqual(mockGenres)
      expect(mocks.from).toHaveBeenCalledWith('genres')
    })

    it('returns empty array when data is null', async () => {
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      })

      const result = await GenreService.list()

      expect(result).toEqual([])
    })

    it('handles supabase error', async () => {
      const error = { message: 'Database error' }
      mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error }),
        }),
      })

      await GenreService.list()

      expect(mocks.handleSupabaseError).toHaveBeenCalledWith(error)
    })
  })
})
