import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mocks = vi.hoisted(() => ({
  useNotifications: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useNotificationUnreadCount: vi.fn().mockReturnValue({ data: 0 }),
  useMarkNotificationRead: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useMarkAllNotificationsRead: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}))

vi.mock('@/hooks/queries/use-notifications', () => mocks)

import { NotificationBell } from '../NotificationBell'

function renderBell() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useNotifications.mockReturnValue({ data: [], isLoading: false })
  mocks.useNotificationUnreadCount.mockReturnValue({ data: 0 })
  mocks.useMarkNotificationRead.mockReturnValue({ mutate: vi.fn() })
  mocks.useMarkAllNotificationsRead.mockReturnValue({ mutate: vi.fn() })
})

describe('NotificationBell', () => {
  it('renders bell icon', () => {
    renderBell()
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument()
  })

  it('shows badge with unread count', () => {
    mocks.useNotificationUnreadCount.mockReturnValue({ data: 5 })
    renderBell()
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('5')
  })

  it('hides badge when count is 0', () => {
    mocks.useNotificationUnreadCount.mockReturnValue({ data: 0 })
    renderBell()
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument()
  })

  it('shows notification items in dropdown when clicked', async () => {
    mocks.useNotifications.mockReturnValue({
      data: [
        {
          id: 'n1',
          user_id: 'u1',
          type: 'message_received',
          title: 'New message from DJ Test',
          body: 'Hey there!',
          data: {},
          link: '/messages',
          read_at: null,
          created_at: new Date().toISOString(),
        },
      ],
      isLoading: false,
    })
    mocks.useNotificationUnreadCount.mockReturnValue({ data: 1 })

    renderBell()
    fireEvent.click(screen.getByTestId('notification-bell'))

    expect(screen.getByTestId('notification-item-n1')).toBeInTheDocument()
    expect(screen.getByText('New message from DJ Test')).toBeInTheDocument()
  })
})
