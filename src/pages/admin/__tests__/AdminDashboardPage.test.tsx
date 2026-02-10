import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mocks = vi.hoisted(() => ({
  useAdminStats: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useAdminActivity: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  adminKeys: { all: ['admin'], stats: () => ['admin', 'stats'], users: () => ['admin', 'users'], activity: () => ['admin', 'activity'] },
}))

vi.mock('@/hooks/queries/use-admin', () => mocks)

import { AdminDashboardPage } from '../AdminDashboardPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAdminStats.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useAdminActivity.mockReturnValue({ data: undefined, isLoading: false })
})

describe('AdminDashboardPage', () => {
  it('renders stat cards with counts', () => {
    mocks.useAdminStats.mockReturnValue({
      data: { users: 100, artists: 25, venues: 30, bookings: 50, enquiries: 10, messages: 200 },
      isLoading: false,
    })
    renderPage()
    expect(screen.getByTestId('admin-stat-users')).toHaveTextContent('100')
    expect(screen.getByTestId('admin-stat-artists')).toHaveTextContent('25')
    expect(screen.getByTestId('admin-stat-venues')).toHaveTextContent('30')
    expect(screen.getByTestId('admin-stat-bookings')).toHaveTextContent('50')
  })

  it('shows activity feed', () => {
    mocks.useAdminActivity.mockReturnValue({
      data: [
        { id: 'a1', type: 'booking', description: 'Booking created', created_at: '2024-01-15T10:00:00Z' },
      ],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByTestId('admin-activity-feed')).toBeInTheDocument()
    expect(screen.getByText('Booking created')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mocks.useAdminStats.mockReturnValue({ data: undefined, isLoading: true })
    renderPage()
    expect(screen.getByTestId('admin-stats-loading')).toBeInTheDocument()
  })

  it('renders quick links', () => {
    renderPage()
    expect(screen.getByTestId('admin-quick-links')).toBeInTheDocument()
    expect(screen.getByText('Manage Users')).toBeInTheDocument()
    expect(screen.getByText('Content Overview')).toBeInTheDocument()
  })
})
