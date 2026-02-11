import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilterPanel } from '../FilterPanel'

vi.mock('@/stores', () => ({
  useFilterStore: vi.fn((selector) =>
    selector({
      categories: [],
      toggleCategory: vi.fn(),
      priceRange: null,
      setPriceRange: vi.fn(),
      location: { cityId: null, coordinates: null },
      setLocation: vi.fn(),
      venueTypes: [],
      toggleVenueType: vi.fn(),
      amenityIds: [],
      toggleAmenityId: vi.fn(),
      resetFilters: vi.fn(),
    })
  ),
}))

vi.mock('@/hooks/queries', () => ({
  useGenres: vi.fn(() => ({ data: [{ id: 'g1', name: 'Rock', slug: 'rock' }] })),
  useCities: vi.fn(() => ({ data: [{ id: 'c1', name: 'Berlin' }] })),
  useAmenities: vi.fn(() => ({ data: [] })),
}))

describe('FilterPanel', () => {
  it('renders filter panel', () => {
    render(<FilterPanel vendorType="artist" />)

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
  })

  it('renders reset button', () => {
    render(<FilterPanel vendorType="artist" />)

    expect(screen.getByTestId('filter-reset')).toBeInTheDocument()
  })

  it('renders genre filters for artists', () => {
    render(<FilterPanel vendorType="artist" />)

    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
  })
})
