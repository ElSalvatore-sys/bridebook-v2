import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SortDropdown } from '../SortDropdown'

vi.mock('@/stores', () => ({
  useFilterStore: vi.fn((selector) =>
    selector({
      sortBy: 'relevance',
      setSortBy: vi.fn(),
    })
  ),
}))

describe('SortDropdown', () => {
  it('renders sort dropdown', () => {
    render(<SortDropdown vendorType="artist" />)

    expect(screen.getByTestId('sort-dropdown')).toBeInTheDocument()
  })

  it('displays Relevance label for default sort', () => {
    render(<SortDropdown vendorType="artist" />)

    expect(screen.getByText('Relevance')).toBeInTheDocument()
  })
})
