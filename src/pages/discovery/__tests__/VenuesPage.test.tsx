import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import VenuesPage from '../VenuesPage'

// Mock ResizeObserver for components that use it
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

// Mock all discovery components
vi.mock('@/components/discovery', () => ({
  SearchBar: () => <div data-testid="search-bar">Search</div>,
  FilterPanel: () => <div data-testid="filter-panel">Filters</div>,
  FilterSheet: () => <div data-testid="filter-sheet">Filter Sheet</div>,
  SortDropdown: () => <div data-testid="sort-dropdown">Sort</div>,
  ViewToggle: () => <div data-testid="view-toggle">View</div>,
  ActiveFilters: () => <div data-testid="active-filters">Active Filters</div>,
  Pagination: () => <div data-testid="pagination">Pagination</div>,
  ResultsGrid: ({ isEmpty, emptyTitle, children }: any) => (
    <div data-testid="results-grid">
      {isEmpty ? <div>{emptyTitle}</div> : children}
    </div>
  ),
  VenueCard: ({ venue }: any) => <div data-testid={`venue-${venue.id}`}>{venue.venue_name}</div>,
}))

vi.mock('@/components/shared', () => ({
  ChipSelect: () => <div data-testid="chip-select">Chips</div>,
}))

vi.mock('@/hooks/queries', () => ({
  useDiscoverVenues: vi.fn(() => ({
    data: { data: [], count: 0 },
    isLoading: false,
  })),
}))

vi.mock('@/stores', () => ({
  useFilterStore: vi.fn((selector) =>
    selector({
      hydrateFromParams: vi.fn(),
      toSearchParams: () => new URLSearchParams(),
      resetFilters: vi.fn(),
      searchQuery: '',
      categories: [],
      location: null,
      venueTypes: [],
      setVenueTypes: vi.fn(),
      amenityIds: [],
      sortBy: 'relevance',
      page: 1,
    })
  ),
}))

describe('VenuesPage', () => {
  it('renders page title', () => {
    render(
      <BrowserRouter>
        <VenuesPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Discover Venues')).toBeInTheDocument()
  })

  it('shows empty state when no venues found', () => {
    render(
      <BrowserRouter>
        <VenuesPage />
      </BrowserRouter>
    )

    expect(screen.getByText('No venues found')).toBeInTheDocument()
  })
})
