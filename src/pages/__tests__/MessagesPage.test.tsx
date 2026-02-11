import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MessagesPage from '../MessagesPage'

// Mock all messaging components
vi.mock('@/components/messaging', () => ({
  ThreadList: ({ threads }: any) => (
    <div data-testid="thread-list">
      {threads.length === 0 ? 'No messages yet' : `${threads.length} threads`}
    </div>
  ),
  ThreadHeader: () => <div data-testid="thread-header">Header</div>,
  MessageBubble: () => <div data-testid="message-bubble">Message</div>,
  MessageInput: () => <div data-testid="message-input">Input</div>,
}))

vi.mock('@/hooks/queries', () => ({
  useThreads: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useThread: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
  useSendMessage: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-123' } as any,
  })),
}))

describe('MessagesPage', () => {
  it('renders page heading', () => {
    render(
      <BrowserRouter>
        <MessagesPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  it('shows empty state when no threads', () => {
    render(
      <BrowserRouter>
        <MessagesPage />
      </BrowserRouter>
    )

    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument()
  })
})
