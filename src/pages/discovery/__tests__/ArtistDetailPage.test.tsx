import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArtistDetailPage } from '../ArtistDetailPage'

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
    useParams: () => ({ id: 'artist-123' }),
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
  AvailabilityCalendar: () => <div>Calendar</div>,
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
  useArtist: vi.fn(() => ({
    data: {
      id: 'artist-123',
      stage_name: 'Test Artist',
      bio: 'Test bio',
      profile_id: 'profile-123',
      artist_genres: [],
    },
    isLoading: false,
    error: null,
  })),
  useGetOrCreateThread: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}))

describe('ArtistDetailPage', () => {
  it('renders artist name', () => {
    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('renders artist bio', () => {
    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Test bio')).toBeInTheDocument()
  })
})
