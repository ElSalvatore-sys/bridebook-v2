import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MediaGallery } from '../MediaGallery'

vi.mock('@/components/shared', () => ({
  ImageLightbox: () => <div data-testid="image-lightbox">Lightbox</div>,
}))

describe('MediaGallery', () => {
  it('shows placeholder when media array is empty', () => {
    render(<MediaGallery media={[]} altText="Test Gallery" entityType="artist" />)

    expect(screen.getByTestId('media-placeholder')).toBeInTheDocument()
  })

  it('renders single image', () => {
    const media = [{ url: 'https://example.com/image1.jpg', media_type: 'IMAGE' }] as any

    render(<MediaGallery media={media} altText="Single Image" entityType="venue" />)

    expect(screen.getByTestId('media-gallery')).toBeInTheDocument()
    const img = screen.getByAltText('Single Image')
    expect(img).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('renders grid of images when multiple images provided', () => {
    const media = [
      { url: 'https://example.com/image1.jpg', media_type: 'IMAGE', is_primary: true },
      { url: 'https://example.com/image2.jpg', media_type: 'IMAGE' },
      { url: 'https://example.com/image3.jpg', media_type: 'IMAGE' },
    ] as any

    render(<MediaGallery media={media} altText="Gallery" entityType="artist" />)

    expect(screen.getByTestId('media-gallery')).toBeInTheDocument()
    // Primary image will have alt="Gallery", others have "Gallery 2", "Gallery 3", etc.
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })
})
