import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { VenueDetailPage } from '../VenueDetailPage'

// Mock ResizeObserver and scrollIntoView
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
  Element.prototype.scrollIntoView = vi.fn()
})

// Mock react-router-dom to provide id param
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: 'venue-123' }),
  }
})

// Mock all ui components
vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: any) => <div>{children}</div>,
  AlertDescription: ({ children }: any) => <div>{children}</div>,
  AlertTitle: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

// Mock all detail components
vi.mock('@/components/detail', () => ({
  BackButton: () => <button>Back</button>,
  ShareButton: () => <button>Share</button>,
  ContactInfo: () => <div>Contact</div>,
  DetailSkeleton: () => <div>Loading...</div>,
  MediaGallery: () => <div data-testid="media-gallery">Gallery</div>,
  ReviewsPlaceholder: () => <div>Reviews</div>,
  SimilarEntities: () => <div>Similar</div>,
}))

vi.mock('@/components/discovery/FavoriteButton', () => ({
  FavoriteButton: () => <button>Favorite</button>,
}))

vi.mock('@/components/discovery/RatingStars', () => ({
  RatingStars: () => <div>Stars</div>,
}))

vi.mock('@/components/enquiry', () => ({
  EnquiryModal: () => <div>Enquiry Modal</div>,
}))

vi.mock('@/hooks/queries', () => ({
  useVenue: vi.fn(() => ({
    data: {
      id: 'venue-123',
      venue_name: 'Test Venue',
      description: 'Test description',
      profile_id: 'profile-123',
      venue_amenities: [],
    },
    isLoading: false,
    error: null,
  })),
  useGetOrCreateThread: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}))

describe('VenueDetailPage', () => {
  it('renders venue name', () => {
    render(
      <BrowserRouter>
        <VenueDetailPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Venue')).toBeInTheDocument()
  })

  it('renders venue description', () => {
    render(
      <BrowserRouter>
        <VenueDetailPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
})
