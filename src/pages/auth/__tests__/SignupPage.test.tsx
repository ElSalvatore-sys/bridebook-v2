import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SignupPage from '../SignupPage'

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
  })),
}))

describe('SignupPage', () => {
  it('renders signup form', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(screen.getAllByText(/create account/i)[0]).toBeInTheDocument()
  })

  it('renders role options', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Fan')).toBeInTheDocument()
    expect(screen.getByText('Artist')).toBeInTheDocument()
    expect(screen.getByText('Venue')).toBeInTheDocument()
  })

  it('renders form fields', () => {
    const { container } = render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(container.querySelector('#firstName')).toBeInTheDocument()
    expect(container.querySelector('#email')).toBeInTheDocument()
    expect(container.querySelector('#password')).toBeInTheDocument()
  })
})
