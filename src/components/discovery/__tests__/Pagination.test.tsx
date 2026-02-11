import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pagination } from '../Pagination'

vi.mock('@/stores', () => ({
  useFilterStore: vi.fn((selector) =>
    selector({
      page: 1,
      pageSize: 10,
      setPage: vi.fn(),
    })
  ),
}))

describe('Pagination', () => {
  it('renders pagination controls when totalCount > pageSize', () => {
    render(<Pagination totalCount={50} />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-prev')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument()
  })

  it('returns null when totalCount is less than pageSize', () => {
    const { container } = render(<Pagination totalCount={5} />)

    expect(container.querySelector('[data-testid="pagination"]')).not.toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(<Pagination totalCount={50} />)

    const prevButton = screen.getByTestId('pagination-prev')
    expect(prevButton).toBeDisabled()
  })
})
