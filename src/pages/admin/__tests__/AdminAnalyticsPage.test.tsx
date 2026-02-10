import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mocks = vi.hoisted(() => ({
  useUserStats: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useEnquiryStats: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useActivityStats: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useSignupTrend: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useTopArtists: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useTopVenues: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  analyticsKeys: {
    all: ['analytics'],
    userStats: () => ['analytics', 'user-stats'],
    enquiryStats: () => ['analytics', 'enquiry-stats'],
    activityStats: () => ['analytics', 'activity-stats'],
    signupTrend: (days: number) => ['analytics', 'signup-trend', days],
    topArtists: (limit: number) => ['analytics', 'top-artists', limit],
    topVenues: (limit: number) => ['analytics', 'top-venues', limit],
  },
}))

vi.mock('@/hooks/queries/use-analytics', () => mocks)

import AdminAnalyticsPage from '../AdminAnalyticsPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AdminAnalyticsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useUserStats.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useEnquiryStats.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useActivityStats.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useSignupTrend.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useTopArtists.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useTopVenues.mockReturnValue({ data: undefined, isLoading: false })
})

describe('AdminAnalyticsPage', () => {
  it('renders stat cards with data', () => {
    mocks.useUserStats.mockReturnValue({
      data: { users: 100, artists: 25, venues: 30 },
      isLoading: false,
    })
    mocks.useEnquiryStats.mockReturnValue({
      data: { pending: 5, read: 3, responded: 7, archived: 2 },
      isLoading: false,
    })
    mocks.useActivityStats.mockReturnValue({
      data: { messages: 200, favorites: 50 },
      isLoading: false,
    })

    renderPage()

    expect(screen.getByTestId('analytics-stat-users')).toHaveTextContent('100')
    expect(screen.getByTestId('analytics-stat-enquiries')).toHaveTextContent('17')
    expect(screen.getByTestId('analytics-stat-messages')).toHaveTextContent('200')
    expect(screen.getByTestId('analytics-stat-favorites')).toHaveTextContent('50')
  })

  it('shows signup trend chart', () => {
    mocks.useSignupTrend.mockReturnValue({
      data: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 3 },
      ],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByTestId('analytics-signup-chart')).toBeInTheDocument()
    expect(screen.getByText('Signups (Last 30 Days)')).toBeInTheDocument()
  })

  it('shows top artists and venues lists', () => {
    mocks.useTopArtists.mockReturnValue({
      data: [
        { id: 'a1', name: 'Artist 1', avatar_url: null, favorite_count: 10 },
      ],
      isLoading: false,
    })
    mocks.useTopVenues.mockReturnValue({
      data: [
        { id: 'v1', name: 'Venue 1', avatar_url: null, favorite_count: 15 },
      ],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByTestId('analytics-top-artists')).toBeInTheDocument()
    expect(screen.getByTestId('analytics-top-venues')).toBeInTheDocument()
    expect(screen.getByText('Artist 1')).toBeInTheDocument()
    expect(screen.getByText('Venue 1')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mocks.useUserStats.mockReturnValue({ data: undefined, isLoading: true })
    mocks.useEnquiryStats.mockReturnValue({ data: undefined, isLoading: true })
    mocks.useActivityStats.mockReturnValue({ data: undefined, isLoading: true })
    mocks.useSignupTrend.mockReturnValue({ data: undefined, isLoading: true })

    renderPage()

    // Check for stat card loading skeletons
    const statCards = screen.getAllByTestId(/analytics-stat-/)
    expect(statCards.length).toBeGreaterThan(0)
  })
})
