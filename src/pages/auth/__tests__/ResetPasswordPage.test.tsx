import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ResetPasswordPage from '../ResetPasswordPage'

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  updateUser: vi.fn(),
}))

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      updateUser: mocks.updateUser,
    },
  },
}))

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders password inputs when session is valid', async () => {
    mocks.getSession.mockResolvedValue({
      data: { session: { access_token: 'valid-token' } },
      error: null,
    })

    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('New password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument()
    })
  })

  it('shows error when session is invalid', async () => {
    mocks.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Invalid session'),
    })

    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Invalid reset link')).toBeInTheDocument()
    })
  })
})
