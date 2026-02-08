import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'

const mocks = vi.hoisted(() => {
  const fn = vi.fn
  const mockAuth = {
    getUser: fn(),
    getSession: fn(),
    signInWithPassword: fn(),
    signUp: fn(),
    signOut: fn(),
    signInWithOAuth: fn(),
    resetPasswordForEmail: fn(),
    updateUser: fn(),
    onAuthStateChange: fn().mockReturnValue({
      data: { subscription: { unsubscribe: fn() } },
    }),
  }

  const mockFrom = fn().mockReturnValue({
    select: fn().mockReturnThis(),
    eq: fn().mockReturnThis(),
    abortSignal: fn().mockReturnThis(),
    single: fn().mockReturnThis(),
    then: (resolve: (val: unknown) => void) => {
      resolve({ data: null, error: null })
    },
  })

  return { mockAuth, mockFrom }
})

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: mocks.mockAuth,
    from: mocks.mockFrom,
  },
}))

vi.mock('@/lib/query-client', () => ({
  queryClient: {
    clear: vi.fn(),
  },
}))

// Must import after mocks
import { AuthProvider, useAuth } from '@/context/AuthContext'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.mockAuth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  })
  mocks.mockAuth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  })
  mocks.mockAuth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  })
  // Mock window.location
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '/', origin: 'http://localhost:3000' },
  })
})

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })

  it('returns user/session/profile as null initially', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Wait for loading to finish
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.profile).toBeNull()
  })

  it('signIn calls signInWithPassword', async () => {
    mocks.mockAuth.signInWithPassword.mockResolvedValue({ data: {}, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signIn('test@example.com', 'password')
    })

    expect(mocks.mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
  })

  it('signUp calls supabase signUp with metadata', async () => {
    mocks.mockAuth.signUp.mockResolvedValue({ data: {}, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signUp('test@example.com', 'password', { first_name: 'Test' })
    })

    expect(mocks.mockAuth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: { data: { first_name: 'Test' } },
    })
  })

  it('signOut clears state and calls supabase signOut', async () => {
    mocks.mockAuth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signOut()
    })

    expect(mocks.mockAuth.signOut).toHaveBeenCalledWith({ scope: 'local' })
  })

  it('resetPassword calls resetPasswordForEmail', async () => {
    mocks.mockAuth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.resetPassword('test@example.com')
    })

    expect(mocks.mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.objectContaining({ redirectTo: expect.any(String) })
    )
  })

  it('updatePassword calls updateUser', async () => {
    mocks.mockAuth.updateUser.mockResolvedValue({ data: {}, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updatePassword('newpassword')
    })

    expect(mocks.mockAuth.updateUser).toHaveBeenCalledWith({ password: 'newpassword' })
  })

  it('signInWithGoogle calls signInWithOAuth', async () => {
    mocks.mockAuth.signInWithOAuth.mockResolvedValue({ data: {}, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signInWithGoogle()
    })

    expect(mocks.mockAuth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    )
  })
})
