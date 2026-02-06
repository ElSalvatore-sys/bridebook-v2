/**
 * Messaging query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  MessagingService,
  type ThreadWithDetails,
  type ThreadDetail,
  type MessageThread,
  type Message,
} from '@/services'
import { showError } from '@/lib/toast'

/**
 * Query key factory for messaging
 */
export const messagingKeys = {
  all: ['messaging'] as const,
  threads: () => [...messagingKeys.all, 'threads'] as const,
  thread: (id: string) => [...messagingKeys.all, 'thread', id] as const,
  unreadCount: () => [...messagingKeys.all, 'unread'] as const,
}

/**
 * Hook to get all message threads for current user
 */
export function useThreads() {
  return useQuery<ThreadWithDetails[], Error>({
    queryKey: messagingKeys.threads(),
    queryFn: () => MessagingService.getThreads(),
  })
}

/**
 * Hook to get a single thread with all messages
 */
export function useThread(threadId: string) {
  return useQuery<ThreadDetail, Error>({
    queryKey: messagingKeys.thread(threadId),
    queryFn: () => MessagingService.getThread(threadId),
    enabled: !!threadId,
  })
}

/**
 * Hook to send a message in a thread
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation<Message, Error, { threadId: string; content: string }>({
    mutationFn: ({ threadId, content }) =>
      MessagingService.sendMessage(threadId, content),
    onSuccess: (_data, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.thread(threadId) })
      queryClient.invalidateQueries({ queryKey: messagingKeys.threads() })
      queryClient.invalidateQueries({ queryKey: messagingKeys.unreadCount() })
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to get unread message count (polls every 30s)
 */
export function useUnreadCount() {
  return useQuery<number, Error>({
    queryKey: messagingKeys.unreadCount(),
    queryFn: () => MessagingService.getUnreadCount(),
    refetchInterval: 30_000,
  })
}

/**
 * Hook to get or create a thread with another user
 */
export function useGetOrCreateThread() {
  const queryClient = useQueryClient()

  return useMutation<
    MessageThread,
    Error,
    { otherUserId: string; bookingRequestId?: string }
  >({
    mutationFn: ({ otherUserId, bookingRequestId }) =>
      MessagingService.getOrCreateThread(otherUserId, bookingRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.threads() })
    },
    onError: (error) => {
      showError(error)
    },
  })
}
