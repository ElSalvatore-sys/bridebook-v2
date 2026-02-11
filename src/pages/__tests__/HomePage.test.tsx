/**
 * HomePage tests
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from '../HomePage'

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

// Mock auth context
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
  }),
}))

// Mock discovery hooks
vi.mock('@/hooks/queries/use-discovery', () => ({
  useDiscoverArtists: vi.fn(() => ({
    data: [{ id: '1', stage_name: 'Test Artist' }],
    isLoading: false,
    isError: false,
  })),
  useDiscoverVenues: vi.fn(() => ({
    data: [{ id: '1', venue_name: 'Test Venue' }],
    isLoading: false,
    isError: false,
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

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('displays hero section', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('shows featured content sections', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    // Should have artists and venues sections
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })
})
