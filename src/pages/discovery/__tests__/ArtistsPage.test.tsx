import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ArtistsPage from '../ArtistsPage'

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
  ArtistCard: ({ artist }: any) => <div data-testid={`artist-${artist.id}`}>{artist.stage_name}</div>,
}))

vi.mock('@/components/shared', () => ({
  ChipSelect: () => <div data-testid="chip-select">Chips</div>,
}))

vi.mock('@/hooks/queries', () => ({
  useDiscoverArtists: vi.fn(() => ({
    data: { data: [], count: 0 },
    isLoading: false,
  })),
  useGenres: vi.fn(() => ({
    data: [],
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
      setCategories: vi.fn(),
      priceRange: null,
      sortBy: 'relevance',
      page: 1,
    })
  ),
}))

describe('ArtistsPage', () => {
  it('renders page title', () => {
    render(
      <BrowserRouter>
        <ArtistsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Discover Artists')).toBeInTheDocument()
  })

  it('shows empty state when no artists found', () => {
    render(
      <BrowserRouter>
        <ArtistsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('No artists found')).toBeInTheDocument()
  })
})
