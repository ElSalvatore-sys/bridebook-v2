import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'
import { mockProfile, mockArtist, mockVenue } from '@/test/mocks/data'

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useArtistByProfile: vi.fn(),
  useVenueByProfile: vi.fn(),
  useEntityMedia: vi.fn(),
  useUploadMedia: vi.fn(),
  useDeleteMedia: vi.fn(),
  useSetPrimaryMedia: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}))

vi.mock('@/hooks', () => ({
  useArtistByProfile: mocks.useArtistByProfile,
  useVenueByProfile: mocks.useVenueByProfile,
  useEntityMedia: mocks.useEntityMedia,
  useUploadMedia: mocks.useUploadMedia,
  useDeleteMedia: mocks.useDeleteMedia,
  useSetPrimaryMedia: mocks.useSetPrimaryMedia,
}))

vi.mock('@/hooks/queries', () => ({
  useArtistByProfile: mocks.useArtistByProfile,
  useVenueByProfile: mocks.useVenueByProfile,
  useEntityMedia: mocks.useEntityMedia,
  useUploadMedia: mocks.useUploadMedia,
  useDeleteMedia: mocks.useDeleteMedia,
  useSetPrimaryMedia: mocks.useSetPrimaryMedia,
}))

import { MediaManagerPage } from '../MediaManagerPage'

function renderPage() {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MediaManagerPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const mutationDefault = { mutate: vi.fn(), isPending: false }

describe('MediaManagerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default: disabled artist/venue hooks
    mocks.useArtistByProfile.mockReturnValue({
      data: null,
      isLoading: false,
    })
    mocks.useVenueByProfile.mockReturnValue({
      data: null,
      isLoading: false,
    })

    // Default media hook mocks (needed by MediaManager if rendered)
    mocks.useEntityMedia.mockReturnValue({ data: [], isLoading: false })
    mocks.useUploadMedia.mockReturnValue(mutationDefault)
    mocks.useDeleteMedia.mockReturnValue(mutationDefault)
    mocks.useSetPrimaryMedia.mockReturnValue(mutationDefault)
  })

  it('renders media manager for ARTIST role', () => {
    mocks.useAuth.mockReturnValue({
      profile: { ...mockProfile, role: 'ARTIST' },
    })
    mocks.useArtistByProfile.mockReturnValue({
      data: mockArtist,
      isLoading: false,
    })

    renderPage()

    expect(screen.getByTestId('media-manager-page')).toBeInTheDocument()
    expect(screen.getByTestId('media-manager')).toBeInTheDocument()
    expect(screen.queryByTestId('media-page-no-entity')).not.toBeInTheDocument()
  })

  it('renders media manager for VENUE role', () => {
    mocks.useAuth.mockReturnValue({
      profile: { ...mockProfile, role: 'VENUE' },
    })
    mocks.useVenueByProfile.mockReturnValue({
      data: mockVenue,
      isLoading: false,
    })

    renderPage()

    expect(screen.getByTestId('media-manager-page')).toBeInTheDocument()
    expect(screen.getByTestId('media-manager')).toBeInTheDocument()
  })

  it('shows no-entity message for USER role', () => {
    mocks.useAuth.mockReturnValue({
      profile: { ...mockProfile, role: 'USER' },
    })

    renderPage()

    expect(screen.getByTestId('media-page-no-entity')).toBeInTheDocument()
    expect(screen.queryByTestId('media-manager')).not.toBeInTheDocument()
  })

  it('shows loading while entity resolves', () => {
    mocks.useAuth.mockReturnValue({
      profile: { ...mockProfile, role: 'ARTIST' },
    })
    mocks.useArtistByProfile.mockReturnValue({
      data: null,
      isLoading: true,
    })

    renderPage()

    expect(screen.getByTestId('media-page-loading')).toBeInTheDocument()
    expect(screen.queryByTestId('media-manager')).not.toBeInTheDocument()
  })
})
