import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import {
  useUserStats,
  useEnquiryStats,
  useActivityStats,
  useTopArtists,
} from '../use-analytics'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  getUserStats: vi.fn(),
  getEnquiryStats: vi.fn(),
  getActivityStats: vi.fn(),
  getTopArtists: vi.fn(),
}))

vi.mock('@/services/analytics', () => ({
  AnalyticsService: {
    getUserStats: mocks.getUserStats,
    getEnquiryStats: mocks.getEnquiryStats,
    getActivityStats: mocks.getActivityStats,
    getTopArtists: mocks.getTopArtists,
  },
}))

describe('use-analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useUserStats', () => {
    it('fetches user stats', async () => {
      const mockStats = { totalUsers: 100, activeUsers: 80 }
      mocks.getUserStats.mockResolvedValue(mockStats)

      const { result } = renderHook(() => useUserStats(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockStats)
    })
  })

  describe('useEnquiryStats', () => {
    it('fetches enquiry stats', async () => {
      const mockStats = { totalEnquiries: 50, pendingEnquiries: 10 }
      mocks.getEnquiryStats.mockResolvedValue(mockStats)

      const { result } = renderHook(() => useEnquiryStats(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockStats)
    })
  })

  describe('useActivityStats', () => {
    it('fetches activity stats', async () => {
      const mockStats = { totalActivity: 200 }
      mocks.getActivityStats.mockResolvedValue(mockStats)

      const { result } = renderHook(() => useActivityStats(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockStats)
    })
  })

  describe('useTopArtists', () => {
    it('fetches top artists', async () => {
      const mockArtists = [
        { id: 'artist-1', name: 'Artist 1', count: 10 },
        { id: 'artist-2', name: 'Artist 2', count: 8 },
      ]
      mocks.getTopArtists.mockResolvedValue(mockArtists)

      const { result } = renderHook(() => useTopArtists(5), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockArtists)
      expect(mocks.getTopArtists).toHaveBeenCalledWith(5)
    })
  })
})
