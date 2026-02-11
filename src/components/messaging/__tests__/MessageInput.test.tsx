import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageInput } from '../MessageInput'

describe('MessageInput', () => {
  it('renders textarea', () => {
    render(<MessageInput onSend={vi.fn()} isPending={false} />)

    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<MessageInput onSend={vi.fn()} isPending={false} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('disables send button when isPending is true', () => {
    render(<MessageInput onSend={vi.fn()} isPending={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
