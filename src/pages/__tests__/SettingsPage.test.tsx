import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'
import { mockProfile, mockEmailPreferences } from '@/test/mocks/data'

const mocks = vi.hoisted(() => ({
  useCurrentProfile: vi.fn(),
  useUpdateProfile: vi.fn(),
  useUploadAvatar: vi.fn(),
  useEmailPreferences: vi.fn(),
  useUpdateEmailPreferences: vi.fn(),
  useChangePassword: vi.fn(),
  useDeleteAccount: vi.fn(),
  useAuth: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useCurrentProfile: mocks.useCurrentProfile,
  useUpdateProfile: mocks.useUpdateProfile,
  useUploadAvatar: mocks.useUploadAvatar,
  useEmailPreferences: mocks.useEmailPreferences,
  useUpdateEmailPreferences: mocks.useUpdateEmailPreferences,
  useChangePassword: mocks.useChangePassword,
  useDeleteAccount: mocks.useDeleteAccount,
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}))

import { SettingsPage } from '../SettingsPage'

function renderPage(initialRoute = '/settings?tab=profile') {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <SettingsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useCurrentProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
    })
    mocks.useUpdateProfile.mockReturnValue({ mutate: vi.fn(), isPending: false })
    mocks.useUploadAvatar.mockReturnValue({ mutate: vi.fn(), isPending: false })
    mocks.useEmailPreferences.mockReturnValue({
      data: mockEmailPreferences,
      isLoading: false,
    })
    mocks.useUpdateEmailPreferences.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mocks.useChangePassword.mockReturnValue({ mutate: vi.fn(), isPending: false })
    mocks.useDeleteAccount.mockReturnValue({ mutate: vi.fn(), isPending: false })
    mocks.useAuth.mockReturnValue({
      user: {
        identities: [
          { provider: 'email', id: '1' },
          { provider: 'google', id: '2' },
        ],
      },
    })
  })

  // ──── Profile Tab ────

  it('renders page header', () => {
    renderPage()

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(
      screen.getByText('Manage your profile and account')
    ).toBeInTheDocument()
  })

  it('shows Profile and Account tabs', () => {
    renderPage()

    expect(screen.getByTestId('tab-profile')).toBeInTheDocument()
    expect(screen.getByTestId('tab-account')).toBeInTheDocument()
  })

  it('shows profile form fields on Profile tab', () => {
    renderPage()

    expect(screen.getByTestId('settings-display-name')).toBeInTheDocument()
    expect(screen.getByTestId('settings-first-name')).toBeInTheDocument()
    expect(screen.getByTestId('settings-last-name')).toBeInTheDocument()
    expect(screen.getByTestId('settings-bio')).toBeInTheDocument()
    expect(screen.getByTestId('settings-city')).toBeInTheDocument()
    expect(screen.getByTestId('settings-website')).toBeInTheDocument()
    expect(screen.getByTestId('settings-phone')).toBeInTheDocument()
  })

  it('pre-fills profile form with data', () => {
    renderPage()

    expect(screen.getByTestId('settings-display-name')).toHaveValue(
      mockProfile.display_name
    )
    expect(screen.getByTestId('settings-first-name')).toHaveValue(
      mockProfile.first_name
    )
    expect(screen.getByTestId('settings-last-name')).toHaveValue(
      mockProfile.last_name
    )
    expect(screen.getByTestId('settings-bio')).toHaveValue(mockProfile.bio)
    expect(screen.getByTestId('settings-city')).toHaveValue(mockProfile.city)
    expect(screen.getByTestId('settings-website')).toHaveValue(
      mockProfile.website
    )
    expect(screen.getByTestId('settings-phone')).toHaveValue(mockProfile.phone)
  })

  it('shows loading state', () => {
    mocks.useCurrentProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })

    renderPage()

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  // ──── Account Tab ────

  it('shows email section on Account tab', () => {
    renderPage('/settings?tab=account')

    expect(screen.getByTestId('settings-email')).toBeInTheDocument()
    expect(screen.getByTestId('settings-email')).toHaveValue(mockProfile.email)
  })

  it('shows Change Password section when user has email identity', () => {
    renderPage('/settings?tab=account')

    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(
      screen.getByTestId('settings-current-password')
    ).toBeInTheDocument()
    expect(screen.getByTestId('settings-new-password')).toBeInTheDocument()
    expect(
      screen.getByTestId('settings-confirm-password')
    ).toBeInTheDocument()
  })

  it('shows Danger Zone with delete button', () => {
    renderPage('/settings?tab=account')

    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
    expect(screen.getByTestId('settings-delete-account')).toBeInTheDocument()
  })
})
