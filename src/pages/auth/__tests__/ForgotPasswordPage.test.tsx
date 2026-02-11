import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ForgotPasswordPage from '../ForgotPasswordPage'

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    resetPassword: vi.fn(),
  })),
}))

describe('ForgotPasswordPage', () => {
  it('renders email input', () => {
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('renders link back to login', () => {
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    )

    const loginLink = screen.getByText('Sign in')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })
})
