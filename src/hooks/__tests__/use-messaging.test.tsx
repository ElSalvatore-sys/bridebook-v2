import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockThread, mockMessage } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  MessagingService: {
    getThreads: vi.fn(),
    getThread: vi.fn(),
    sendMessage: vi.fn(),
    getUnreadCount: vi.fn(),
    getOrCreateThread: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showError: vi.fn(),
}))

import { MessagingService } from '@/services'
import { useThreads, useThread, useSendMessage } from '../queries/use-messaging'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useThreads', () => {
  it('calls MessagingService.getThreads', async () => {
    ;(MessagingService.getThreads as ReturnType<typeof vi.fn>).mockResolvedValue([])

    const { result } = renderHook(() => useThreads(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})

describe('useThread', () => {
  it('calls MessagingService.getThread', async () => {
    const threadDetail = { ...mockThread, participant_one: null, participant_two: null, messages: [] }
    ;(MessagingService.getThread as ReturnType<typeof vi.fn>).mockResolvedValue(threadDetail)

    const { result } = renderHook(() => useThread('thread-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(threadDetail)
  })
})

describe('useSendMessage', () => {
  it('calls MessagingService.sendMessage', async () => {
    ;(MessagingService.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessage)

    const { result } = renderHook(() => useSendMessage(), { wrapper })
    result.current.mutate({ threadId: 'thread-1', content: 'Hello!' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(MessagingService.sendMessage).toHaveBeenCalledWith('thread-1', 'Hello!')
  })
})
