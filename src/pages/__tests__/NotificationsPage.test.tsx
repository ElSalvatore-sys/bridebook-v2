import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mocks = vi.hoisted(() => {
  const mockMarkAllRead = vi.fn()
  return {
    mockMarkAllRead,
    useNotifications: vi.fn().mockReturnValue({ data: [], isLoading: false }),
    useNotificationUnreadCount: vi.fn().mockReturnValue({ data: 0 }),
    useMarkNotificationRead: vi.fn().mockReturnValue({ mutate: vi.fn() }),
    useMarkAllNotificationsRead: vi.fn().mockReturnValue({ mutate: mockMarkAllRead }),
    notificationKeys: { all: ['notifications'], list: () => ['notifications', 'list'], unreadCount: () => ['notifications', 'unread-count'] },
  }
})

vi.mock('@/hooks/queries/use-notifications', () => mocks)
vi.mock('@/services/notifications', () => ({
  NotificationService: { delete: vi.fn().mockResolvedValue(undefined) },
}))

import { NotificationsPage } from '../NotificationsPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useNotifications.mockReturnValue({ data: [], isLoading: false })
  mocks.useNotificationUnreadCount.mockReturnValue({ data: 0 })
  mocks.useMarkNotificationRead.mockReturnValue({ mutate: vi.fn() })
  mocks.useMarkAllNotificationsRead.mockReturnValue({ mutate: mocks.mockMarkAllRead })
})

describe('NotificationsPage', () => {
  it('renders notification list', () => {
    mocks.useNotifications.mockReturnValue({
      data: [
        {
          id: 'n1', user_id: 'u1', type: 'new_favorite', title: 'New follower',
          body: 'Someone liked you', data: {}, link: null, read_at: null,
          created_at: new Date().toISOString(),
        },
      ],
      isLoading: false,
    })
    mocks.useNotificationUnreadCount.mockReturnValue({ data: 1 })

    renderPage()
    expect(screen.getByTestId('notification-card-n1')).toBeInTheDocument()
    expect(screen.getByText('New follower')).toBeInTheDocument()
  })

  it('shows empty state when no notifications', () => {
    renderPage()
    expect(screen.getByTestId('notifications-empty')).toBeInTheDocument()
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
  })

  it('shows loading skeleton', () => {
    mocks.useNotifications.mockReturnValue({ data: [], isLoading: true })
    renderPage()
    expect(screen.getByTestId('notifications-loading')).toBeInTheDocument()
  })

  it('calls markAllRead when button clicked', () => {
    mocks.useNotifications.mockReturnValue({
      data: [
        {
          id: 'n1', user_id: 'u1', type: 'message_received', title: 'Msg',
          body: null, data: {}, link: null, read_at: null,
          created_at: new Date().toISOString(),
        },
      ],
      isLoading: false,
    })
    mocks.useNotificationUnreadCount.mockReturnValue({ data: 1 })

    renderPage()
    fireEvent.click(screen.getByTestId('notifications-mark-all-read'))
    expect(mocks.mockMarkAllRead).toHaveBeenCalled()
  })
})
