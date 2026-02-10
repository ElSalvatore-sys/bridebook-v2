import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  useEntityMedia: vi.fn(),
  useUploadMedia: vi.fn(),
  useDeleteMedia: vi.fn(),
  useSetPrimaryMedia: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useEntityMedia: mocks.useEntityMedia,
  useUploadMedia: mocks.useUploadMedia,
  useDeleteMedia: mocks.useDeleteMedia,
  useSetPrimaryMedia: mocks.useSetPrimaryMedia,
}))

vi.mock('@/hooks/queries', () => ({
  useEntityMedia: mocks.useEntityMedia,
  useUploadMedia: mocks.useUploadMedia,
  useDeleteMedia: mocks.useDeleteMedia,
  useSetPrimaryMedia: mocks.useSetPrimaryMedia,
}))

import { MediaManager } from '../MediaManager'

const mockImages = [
  {
    id: 'media-1',
    url: 'https://test.supabase.co/storage/v1/object/public/artist-media/artist-1/img1.webp',
    type: 'IMAGE' as const,
    title: null,
    description: null,
    sort_order: 0,
    is_primary: true,
    artist_id: 'artist-1',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'media-2',
    url: 'https://test.supabase.co/storage/v1/object/public/artist-media/artist-1/img2.webp',
    type: 'IMAGE' as const,
    title: null,
    description: null,
    sort_order: 1,
    is_primary: false,
    artist_id: 'artist-1',
    created_at: '2024-01-02T00:00:00Z',
  },
]

const uploadMutateMock = vi.fn()
const deleteMutateMock = vi.fn()
const setPrimaryMutateMock = vi.fn()

function renderManager(props = {}) {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MediaManager
        table="artist_media"
        entityId="artist-1"
        {...props}
      />
    </QueryClientProvider>
  )
}

describe('MediaManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.useUploadMedia.mockReturnValue({
      mutate: uploadMutateMock,
      isPending: false,
    })

    mocks.useDeleteMedia.mockReturnValue({
      mutate: deleteMutateMock,
      isPending: false,
    })

    mocks.useSetPrimaryMedia.mockReturnValue({
      mutate: setPrimaryMutateMock,
      isPending: false,
    })
  })

  it('renders grid of images', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: mockImages,
      isLoading: false,
    })

    renderManager()

    expect(screen.getByTestId('media-grid')).toBeInTheDocument()
    expect(screen.getByTestId('media-item-media-1')).toBeInTheDocument()
    expect(screen.getByTestId('media-item-media-2')).toBeInTheDocument()
  })

  it('shows empty state when no images', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderManager()

    expect(screen.getByTestId('media-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('media-grid')).not.toBeInTheDocument()
  })

  it('shows loading skeleton', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: undefined,
      isLoading: true,
    })

    renderManager()

    expect(screen.getByTestId('media-loading')).toBeInTheDocument()
    expect(screen.queryByTestId('media-grid')).not.toBeInTheDocument()
  })

  it('highlights primary image with filled star', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: mockImages,
      isLoading: false,
    })

    renderManager()

    // The primary image's star button should contain an svg with fill class
    const primaryStar = screen.getByTestId('media-primary-media-1')
    const starIcon = primaryStar.querySelector('svg')
    expect(starIcon).toHaveClass('fill-yellow-400')

    // Non-primary should not have fill
    const nonPrimaryStar = screen.getByTestId('media-primary-media-2')
    const nonPrimaryIcon = nonPrimaryStar.querySelector('svg')
    expect(nonPrimaryIcon).not.toHaveClass('fill-yellow-400')
  })

  it('calls delete mutation on confirm', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: mockImages,
      isLoading: false,
    })

    renderManager()

    // Click delete button to open dialog
    fireEvent.click(screen.getByTestId('media-delete-media-2'))

    // Confirm deletion in dialog
    fireEvent.click(screen.getByTestId('media-confirm-delete-media-2'))

    expect(deleteMutateMock).toHaveBeenCalledWith({
      id: 'media-2',
      url: mockImages[1].url,
      entityId: 'artist-1',
    })
  })

  it('calls set primary mutation', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: mockImages,
      isLoading: false,
    })

    renderManager()

    fireEvent.click(screen.getByTestId('media-primary-media-2'))

    expect(setPrimaryMutateMock).toHaveBeenCalledWith({
      entityId: 'artist-1',
      mediaId: 'media-2',
    })
  })

  it('disables upload when at max images', () => {
    const tenImages = Array.from({ length: 10 }, (_, i) => ({
      ...mockImages[0],
      id: `media-${i}`,
      is_primary: i === 0,
    }))

    mocks.useEntityMedia.mockReturnValue({
      data: tenImages,
      isLoading: false,
    })

    renderManager({ maxImages: 10 })

    const uploadZone = screen.getByTestId('media-upload-zone')
    expect(uploadZone).toHaveClass('cursor-not-allowed')
    expect(uploadZone).toHaveClass('opacity-50')
  })

  it('shows upload zone', () => {
    mocks.useEntityMedia.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderManager()

    expect(screen.getByTestId('media-upload-zone')).toBeInTheDocument()
  })
})
