import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BookingCard } from '../BookingCard'
import type { BookingWithDetails } from '@/services'

vi.mock('@/hooks/queries', () => ({
  useUpdateBookingStatus: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useGetOrCreateThread: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('./BookingStatusBadge', () => ({
  BookingStatusBadge: ({ status }: { status: string }) => (
    <div data-testid="booking-status-badge">{status}</div>
  ),
}))

describe('BookingCard', () => {
  const mockBooking: BookingWithDetails = {
    id: 'booking-1',
    title: 'Summer DJ Night',
    event_date: '2026-07-15',
    start_time: '20:00',
    end_time: '02:00',
    status: 'PENDING',
    proposed_rate: 500,
    description: 'Great event at the venue',
    artists: { stage_name: 'DJ Test', profile_id: 'artist-profile-1' } as any,
    venues: null,
    requester: { id: 'requester-1', first_name: 'John', last_name: 'Doe' } as any,
  } as any

  it('renders booking details', () => {
    render(
      <BrowserRouter>
        <BookingCard booking={mockBooking} viewType="fan" />
      </BrowserRouter>
    )

    expect(screen.getByText('Summer DJ Night')).toBeInTheDocument()
    expect(screen.getByText('2026-07-15')).toBeInTheDocument()
    expect(screen.getByText('20:00 - 02:00')).toBeInTheDocument()
    expect(screen.getByTestId('booking-status-badge')).toHaveTextContent('Pending')
  })

  it('shows action buttons when status is PENDING for provider view', () => {
    render(
      <BrowserRouter>
        <BookingCard booking={mockBooking} viewType="provider" />
      </BrowserRouter>
    )

    expect(screen.getByTestId('booking-accept')).toBeInTheDocument()
    expect(screen.getByTestId('booking-decline')).toBeInTheDocument()
  })

  it('renders message button', () => {
    render(
      <BrowserRouter>
        <BookingCard booking={mockBooking} viewType="fan" />
      </BrowserRouter>
    )

    expect(screen.getByTestId('booking-message')).toBeInTheDocument()
  })
})
