/**
 * use-admin hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAdminStats,
  useAdminUsers,
  useUpdateUserRole,
} from '../use-admin'

const mocks = vi.hoisted(() => ({
  getStats: vi.fn(),
  getUsers: vi.fn(),
  updateRole: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/services/admin', () => ({
  AdminService: {
    getStats: mocks.getStats,
    getUsers: mocks.getUsers,
    updateUserRole: mocks.updateRole,
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

describe('use-admin hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAdminStats', () => {
    it('fetches admin statistics', async () => {
      const mockStats = {
        users: 100,
        artists: 12,
        venues: 8,
        bookings: 45,
        enquiries: 23,
        messages: 89,
      }
      mocks.getStats.mockResolvedValue(mockStats)

      const { result } = renderHook(() => useAdminStats(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockStats)
      expect(mocks.getStats).toHaveBeenCalled()
    })
  })

  describe('useAdminUsers', () => {
    it('fetches all users', async () => {
      const mockResult = {
        users: [
          { id: '1', email: 'user1@test.com', role: 'FAN' },
          { id: '2', email: 'user2@test.com', role: 'ARTIST' },
        ],
        total: 2,
      }
      mocks.getUsers.mockResolvedValue(mockResult)

      const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
    })
  })

  describe('useUpdateUserRole', () => {
    it('updates user role', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000'
      mocks.updateRole.mockResolvedValue(undefined)

      const { result } = renderHook(() => useUpdateUserRole(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ userId: validUuid, role: 'ADMIN' })

      expect(mocks.updateRole).toHaveBeenCalledWith(validUuid, 'ADMIN')
      expect(mocks.showSuccess).toHaveBeenCalledWith('User role updated')
    })
  })
})
