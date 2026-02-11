import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../Sidebar'

// Mock dependencies
vi.mock('@/stores', () => ({
  useUIStore: vi.fn((selector) =>
    selector({ sidebarOpen: false, setSidebarOpen: vi.fn() })
  ),
}))

vi.mock('@/hooks/queries', () => ({
  useUnreadCount: vi.fn(() => ({ data: 0 })),
  useNotificationUnreadCount: vi.fn(() => ({ data: 0 })),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/hooks/useAuth'

describe('Sidebar', () => {
  it('renders core navigation items', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      profile: { id: 'profile-1', role: 'FAN' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(screen.getByTestId('sidebar-link-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-link-artists')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-link-venues')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-link-favorites')).toBeInTheDocument()
  })

  it('shows admin nav items when role is ADMIN', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'admin@example.com' } as any,
      profile: { id: 'profile-1', role: 'ADMIN' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(screen.getByTestId('sidebar-link-admin')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-link-admin-users')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-link-admin-analytics')).toBeInTheDocument()
  })

  it('hides admin nav items for non-admin roles', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'fan@example.com' } as any,
      profile: { id: 'profile-1', role: 'FAN' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(screen.queryByTestId('sidebar-link-admin')).not.toBeInTheDocument()
    expect(screen.queryByTestId('sidebar-link-admin-users')).not.toBeInTheDocument()
  })

  it('shows "My Photos" link for ARTIST and VENUE roles', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'artist@example.com' } as any,
      profile: { id: 'profile-1', role: 'ARTIST' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(screen.getByTestId('sidebar-link-media')).toBeInTheDocument()
  })
})
