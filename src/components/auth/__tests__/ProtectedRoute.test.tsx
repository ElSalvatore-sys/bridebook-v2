import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'

// Mock dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ fullScreen }: { fullScreen?: boolean }) => (
    <div data-testid="loading-spinner">{fullScreen && 'fullscreen'}</div>
  ),
}))

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, state }: { to: string; state?: any }) => (
      <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)} />
    ),
  }
})

import { useAuth } from '@/context/AuthContext'

describe('ProtectedRoute', () => {
  it('shows loading spinner when auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('redirects to /login when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/login')
  })

  it('redirects to /dashboard when user lacks required role', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      profile: { id: 'profile-1', role: 'FAN' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="ADMIN">
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/dashboard')
  })

  it('renders children when user is authenticated and has required role', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'admin@example.com' } as any,
      profile: { id: 'profile-1', role: 'ADMIN' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="ADMIN">
          <div data-testid="protected-content">Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
})
