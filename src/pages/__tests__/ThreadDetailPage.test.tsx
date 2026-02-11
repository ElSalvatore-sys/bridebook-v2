import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ThreadDetailPage from '../ThreadDetailPage'

// Mock scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

// Mock messaging components
vi.mock('@/components/messaging', () => ({
  ThreadHeader: () => <div data-testid="thread-header">Header</div>,
  MessageBubble: () => <div data-testid="message-bubble">Message</div>,
  MessageInput: () => <div data-testid="message-input">Input</div>,
}))

// Mock react-router-dom to provide threadId param
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ threadId: 'thread-123' }),
  }
})

vi.mock('@/hooks/queries', () => ({
  useThread: vi.fn(() => ({
    data: {
      id: 'thread-123',
      participant_one: { id: 'user-1', first_name: 'John', last_name: 'Doe' },
      participant_two: { id: 'user-2', first_name: 'Jane', last_name: 'Smith' },
      messages: [],
      booking_request_id: null,
    },
    isLoading: false,
    error: null,
  })),
  useSendMessage: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-1' } as any,
  })),
}))

describe('ThreadDetailPage', () => {
  it('renders thread messages container', () => {
    render(
      <BrowserRouter>
        <ThreadDetailPage />
      </BrowserRouter>
    )

    expect(screen.getByTestId('thread-detail-page')).toBeInTheDocument()
  })

  it('does not crash when thread data is present', () => {
    const { container } = render(
      <BrowserRouter>
        <ThreadDetailPage />
      </BrowserRouter>
    )

    expect(container.querySelector('[data-testid="thread-detail-page"]')).toBeInTheDocument()
  })
})
