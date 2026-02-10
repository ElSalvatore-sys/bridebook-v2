/**
 * Notification query and mutation hooks
 */

import { useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { NotificationService, type Notification } from '@/services/notifications'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import { showSuccess, showError } from '@/lib/toast'
import { toast } from 'sonner'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

export function useNotifications(limit = 50) {
  const { user } = useAuth()

  return useQuery<Notification[], Error>({
    queryKey: notificationKeys.list(),
    queryFn: () => NotificationService.getAll(limit),
    enabled: !!user,
  })
}

export function useNotificationUnreadCount() {
  const { user } = useAuth()

  return useQuery<number, Error>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => NotificationService.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation<Notification, Error, string>({
    mutationFn: (id) => NotificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error) => {
      showError(error)
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: () => NotificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      showSuccess('All notifications marked as read')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

export function useRealtimeNotifications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as Notification
          queryClient.invalidateQueries({ queryKey: notificationKeys.all })
          toast(notification.title, {
            description: notification.body ?? undefined,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])
}
