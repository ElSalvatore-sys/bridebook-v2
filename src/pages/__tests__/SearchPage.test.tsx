/**
 * SearchPage tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchPage } from '../SearchPage'

vi.mock('@/hooks/queries/use-search', () => ({
  useSearchArtistsRpc: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useSearchVenuesRpc: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
}))

vi.mock('@/hooks/use-debounce', () => ({
  useDebounce: vi.fn((value) => value),
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

describe('SearchPage', () => {
  it('renders without crashing', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByTestId('search-page')).toBeInTheDocument()
  })

  it('displays search heading', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByRole('heading', { name: /^search$/i, level: 1 })).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByTestId('search-page-input')).toBeInTheDocument()
  })
})
