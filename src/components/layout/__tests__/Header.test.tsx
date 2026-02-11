import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header'

// Mock dependencies
vi.mock('@/hooks', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/queries', () => ({
  useCurrentProfile: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useUIStore: vi.fn((selector) =>
    selector({ toggleSidebar: vi.fn(), setSidebarOpen: vi.fn() })
  ),
}))

vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

vi.mock('@/components/notifications/NotificationBell', () => ({
  NotificationBell: () => <div data-testid="notification-bell">NotificationBell</div>,
}))

vi.mock('@/components/search/SearchBar', () => ({
  GlobalSearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}))

import { useAuth } from '@/hooks'
import { useCurrentProfile } from '@/hooks/queries'

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders NotificationBell and ThemeToggle', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      signOut: vi.fn(),
      signIn: vi.fn(),
      loading: false,
      profile: null,
    } as any)

    vi.mocked(useCurrentProfile).mockReturnValue({
      data: { id: 'profile-1', first_name: 'John', last_name: 'Doe', role: 'FAN' } as any,
      isLoading: false,
      isError: false,
    } as any)

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByTestId('notification-bell')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('renders user avatar menu when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      signOut: vi.fn(),
      signIn: vi.fn(),
      loading: false,
      profile: null,
    } as any)

    vi.mocked(useCurrentProfile).mockReturnValue({
      data: { id: 'profile-1', first_name: 'Alice', last_name: 'Smith', role: 'ARTIST' } as any,
      isLoading: false,
      isError: false,
    } as any)

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByTestId('header-user-menu')).toBeInTheDocument()
  })

  it('renders bloghead logo link', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      signOut: vi.fn(),
      signIn: vi.fn(),
      loading: false,
      profile: null,
    } as any)

    vi.mocked(useCurrentProfile).mockReturnValue({
      data: { id: 'profile-1', first_name: 'Bob', last_name: 'Jones', role: 'VENUE' } as any,
      isLoading: false,
      isError: false,
    } as any)

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const logo = screen.getByTestId('header-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveTextContent('bloghead')
  })

  it('renders hamburger menu toggle', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      signOut: vi.fn(),
      signIn: vi.fn(),
      loading: false,
      profile: null,
    } as any)

    vi.mocked(useCurrentProfile).mockReturnValue({
      data: { id: 'profile-1', first_name: 'Carol', last_name: 'White', role: 'FAN' } as any,
      isLoading: false,
      isError: false,
    } as any)

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByTestId('header-hamburger')).toBeInTheDocument()
  })
})
