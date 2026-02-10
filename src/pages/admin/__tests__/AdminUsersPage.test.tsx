import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mocks = vi.hoisted(() => ({
  useAdminUsers: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useUpdateUserRole: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  adminKeys: { all: ['admin'], stats: () => ['admin', 'stats'], users: () => ['admin', 'users'], activity: () => ['admin', 'activity'] },
}))

vi.mock('@/hooks/queries/use-admin', () => mocks)

import { AdminUsersPage } from '../AdminUsersPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAdminUsers.mockReturnValue({ data: undefined, isLoading: false })
  mocks.useUpdateUserRole.mockReturnValue({ mutate: vi.fn() })
})

describe('AdminUsersPage', () => {
  it('renders user table', () => {
    mocks.useAdminUsers.mockReturnValue({
      data: {
        users: [
          { id: 'u1', email: 'alice@test.com', display_name: 'Alice', first_name: 'Alice', last_name: 'Test', role: 'USER', created_at: '2024-01-01' },
        ],
        total: 1,
      },
      isLoading: false,
    })
    renderPage()
    expect(screen.getByTestId('admin-user-row-u1')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('filters users by search', () => {
    renderPage()
    const input = screen.getByTestId('admin-user-search')
    fireEvent.change(input, { target: { value: 'alice' } })
    expect(input).toHaveValue('alice')
  })

  it('shows role change dropdown', () => {
    mocks.useAdminUsers.mockReturnValue({
      data: {
        users: [
          { id: 'u1', email: 'alice@test.com', display_name: 'Alice', first_name: 'Alice', last_name: 'Test', role: 'USER', created_at: '2024-01-01' },
        ],
        total: 1,
      },
      isLoading: false,
    })
    renderPage()
    const select = screen.getByTestId('admin-role-select-u1')
    expect(select).toHaveValue('USER')
  })

  it('handles pagination', () => {
    mocks.useAdminUsers.mockReturnValue({
      data: {
        users: Array.from({ length: 20 }, (_, i) => ({
          id: `u${i}`, email: `u${i}@test.com`, display_name: `User ${i}`, first_name: 'User', last_name: `${i}`, role: 'USER', created_at: '2024-01-01',
        })),
        total: 40,
      },
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByTestId('admin-users-next')).toBeInTheDocument()
  })
})
