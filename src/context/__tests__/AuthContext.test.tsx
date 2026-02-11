/**
 * AuthContext tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock Supabase
const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  signInWithOAuth: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      getUser: mocks.getUser,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      signOut: mocks.signOut,
      signInWithOAuth: mocks.signInWithOAuth,
      resetPasswordForEmail: mocks.resetPasswordForEmail,
      updateUser: mocks.updateUser,
      onAuthStateChange: mocks.onAuthStateChange,
    },
    from: mocks.from,
  },
}))

vi.mock('@/lib/query-client', () => ({
  queryClient: {
    clear: vi.fn(),
  },
}))

function TestComponent() {
  const { user, session, profile, loading } = useAuth()
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user?.id || 'no-user'}</div>
      <div data-testid="session">{session?.user.id || 'no-session'}</div>
      <div data-testid="profile">{profile?.id || 'no-profile'}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock setup
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })

    mocks.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          abortSignal: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
    })
  })

  it('provides loading state initially', () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('provides authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' }
    const mockSession = { user: mockUser, access_token: 'token' }
    const mockProfile = { id: 'user-1', first_name: 'Test', last_name: 'User' }

    mocks.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    mocks.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          abortSignal: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      }),
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('user-1')
  })

  it('provides null user when not authenticated', async () => {
    mocks.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
  })

  it('exports useAuth hook', () => {
    expect(typeof useAuth).toBe('function')
  })
})
