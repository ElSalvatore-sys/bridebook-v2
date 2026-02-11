import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BookingRequestModal } from '../BookingRequestModal'

// Mock dependencies
vi.mock('@/stores', () => ({
  useUIStore: vi.fn((selector) =>
    selector({
      activeModal: null,
      modalData: null,
      closeModal: vi.fn(),
    })
  ),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mocks = vi.hoisted(() => ({
  useArtistByProfile: vi.fn(() => ({ data: null })),
  useVenueByProfile: vi.fn(() => ({ data: null })),
  useCreateBooking: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/hooks/queries', () => mocks)

vi.mock('@/lib/forms/use-zod-form', () => ({
  useZodForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn(() => vi.fn()),
    formState: { errors: {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    reset: vi.fn(),
  })),
}))

import { useUIStore } from '@/stores'
import { useAuth } from '@/context/AuthContext'

describe('BookingRequestModal', () => {
  it('does not render when modal is closed', () => {
    vi.mocked(useUIStore).mockImplementation((selector: any) =>
      selector({
        activeModal: null,
        modalData: null,
        closeModal: vi.fn(),
      })
    )

    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' } as any,
      profile: { id: 'profile-1', role: 'ARTIST' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    const { container } = render(
      <BrowserRouter>
        <BookingRequestModal />
      </BrowserRouter>
    )

    expect(container.querySelector('[data-testid="booking-request-modal"]')).not.toBeInTheDocument()
  })

  it('renders when modal is open', () => {
    vi.mocked(useUIStore).mockImplementation((selector: any) =>
      selector({
        activeModal: 'booking-request',
        modalData: { artistId: 'artist-1', artistName: 'Test Artist' },
        closeModal: vi.fn(),
      })
    )

    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'venue@example.com' } as any,
      profile: { id: 'profile-1', role: 'VENUE' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <BookingRequestModal />
      </BrowserRouter>
    )

    expect(screen.getByText('Send Booking Request')).toBeInTheDocument()
  })

  it('shows USER role message for USER role', () => {
    vi.mocked(useUIStore).mockImplementation((selector: any) =>
      selector({
        activeModal: 'booking-request',
        modalData: { artistId: 'artist-1' },
        closeModal: vi.fn(),
      })
    )

    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'user@example.com' } as any,
      profile: { id: 'profile-1', role: 'USER' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    render(
      <BrowserRouter>
        <BookingRequestModal />
      </BrowserRouter>
    )

    expect(screen.getByText(/Register as an artist or venue/i)).toBeInTheDocument()
  })

  it('renders form fields when user has proper role', () => {
    vi.mocked(useUIStore).mockImplementation((selector: any) =>
      selector({
        activeModal: 'booking-request',
        modalData: { artistId: 'artist-1', artistName: 'Test Artist', entityType: 'artist' },
        closeModal: vi.fn(),
      })
    )

    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'venue@example.com' } as any,
      profile: { id: 'profile-1', role: 'VENUE' } as any,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
    } as any)

    // Mock venue data so canSubmit is true
    mocks.useVenueByProfile.mockReturnValue({
      data: { id: 'venue-1', venue_name: 'Test Venue' },
      isLoading: false,
      isError: false,
    } as any)

    render(
      <BrowserRouter>
        <BookingRequestModal />
      </BrowserRouter>
    )

    expect(screen.getByText('Event Title')).toBeInTheDocument()
    expect(screen.getByText('Event Date')).toBeInTheDocument()
    expect(screen.getByText('Start Time')).toBeInTheDocument()
    expect(screen.getByText('End Time')).toBeInTheDocument()
  })
})
