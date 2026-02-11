/**
 * use-notifications hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useNotifications,
  useNotificationUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../use-notifications'

const mocks = vi.hoisted(() => ({
  getAll: vi.fn(),
  getUnreadCount: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
  user: { id: 'user-1' },
}))

vi.mock('@/services/notifications', () => ({
  NotificationService: {
    getAll: mocks.getAll,
    getUnreadCount: mocks.getUnreadCount,
    markRead: mocks.markRead,
    markAllRead: mocks.markAllRead,
  },
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

describe('use-notifications hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useNotifications', () => {
    it('fetches notifications list', async () => {
      const mockNotifications = [
        { id: '1', type: 'INFO', message: 'Test 1', read: false },
        { id: '2', type: 'SUCCESS', message: 'Test 2', read: true },
      ]
      mocks.getAll.mockResolvedValue(mockNotifications)

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockNotifications)
      expect(mocks.getAll).toHaveBeenCalled()
    })
  })

  describe('useNotificationUnreadCount', () => {
    it('fetches unread count', async () => {
      mocks.getUnreadCount.mockResolvedValue(5)

      const { result } = renderHook(() => useNotificationUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(5)
      expect(mocks.getUnreadCount).toHaveBeenCalled()
    })
  })

  describe('useMarkNotificationRead', () => {
    it('marks notification as read', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000'
      mocks.markRead.mockResolvedValue(undefined)

      const { result } = renderHook(() => useMarkNotificationRead(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(validUuid)

      expect(mocks.markRead).toHaveBeenCalledWith(validUuid)
    })
  })

  describe('useMarkAllNotificationsRead', () => {
    it('marks all notifications as read', async () => {
      mocks.markAllRead.mockResolvedValue(undefined)

      const { result } = renderHook(() => useMarkAllNotificationsRead(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync()

      expect(mocks.markAllRead).toHaveBeenCalled()
    })
  })
})
