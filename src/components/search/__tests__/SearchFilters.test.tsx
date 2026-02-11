import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SearchFilters } from '../SearchFilters'

vi.mock('@/hooks/queries/use-locations', () => ({
  useCities: vi.fn(() => ({ data: [{ id: 'c1', name: 'Berlin' }] })),
}))

vi.mock('@/hooks/queries/use-genres', () => ({
  useGenres: vi.fn(() => ({ data: [{ id: 'g1', name: 'Rock' }] })),
}))

describe('SearchFilters', () => {
  const defaultProps = {
    type: 'all' as const,
    cityId: null,
    genreId: null,
    onTypeChange: vi.fn(),
    onCityChange: vi.fn(),
    onGenreChange: vi.fn(),
    onClearAll: vi.fn(),
  }

  it('renders filter controls', () => {
    render(<SearchFilters {...defaultProps} />)

    expect(screen.getByTestId('search-filters')).toBeInTheDocument()
  })

  it('renders type buttons', () => {
    render(<SearchFilters {...defaultProps} />)

    expect(screen.getByTestId('filter-type-all')).toBeInTheDocument()
    expect(screen.getByTestId('filter-type-artists')).toBeInTheDocument()
    expect(screen.getByTestId('filter-type-venues')).toBeInTheDocument()
  })

  it('renders city and genre filters when type is all', () => {
    render(<SearchFilters {...defaultProps} type="all" />)

    expect(screen.getByTestId('filter-city')).toBeInTheDocument()
    expect(screen.getByTestId('filter-genre')).toBeInTheDocument()
  })
})
