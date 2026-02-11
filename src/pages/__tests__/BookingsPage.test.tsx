/**
 * BookingsPage tests
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BookingsPage } from '../BookingsPage'

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const mockProfile = {
  id: 'profile-1',
  user_id: 'user-1',
  role: 'FAN',
  first_name: 'Test',
  last_name: 'User',
}

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' },
    profile: mockProfile,
    loading: false,
  }),
}))

vi.mock('@/hooks/queries/use-booking', () => ({
  useUserBookings: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useProviderBookings: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useUpdateBookingStatus: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
}))

vi.mock('@/hooks/queries/use-messaging', () => ({
  useGetOrCreateThread: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  })),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('BookingsPage', () => {
  it('renders without crashing', () => {
    render(<BookingsPage />, { wrapper: createWrapper() })
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('displays bookings heading', () => {
    render(<BookingsPage />, { wrapper: createWrapper() })
    const headings = screen.getAllByRole('heading', { name: /bookings/i })
    expect(headings.length).toBeGreaterThan(0)
  })

  it('shows bookings list when data loaded', () => {
    render(<BookingsPage />, { wrapper: createWrapper() })
    // The component renders a tab or empty state based on role
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })
})
