import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Music, MapPin, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { ArtistMedia, VenueMedia } from '@/services'

type MediaItem = ArtistMedia | VenueMedia

interface MediaGalleryProps {
  media: MediaItem[]
  altText: string
  entityType?: 'artist' | 'venue'
}

export function MediaGallery({ media, altText, entityType = 'artist' }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter to images only (V1)
  const images = media.filter(
    (m) => (m as Record<string, unknown>).media_type === 'IMAGE' || !(m as Record<string, unknown>).media_type
  )

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      else if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToPrev, goToNext])

  if (images.length === 0) {
    const PlaceholderIcon = entityType === 'venue' ? MapPin : Music
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted"
        data-testid="media-placeholder"
      >
        <PlaceholderIcon className="h-16 w-16 text-muted-foreground/30" />
      </div>
    )
  }

  // Hero = primary or first
  const primaryIndex = images.findIndex(
    (m) => (m as Record<string, unknown>).is_primary
  )
  const heroIndex = primaryIndex >= 0 ? primaryIndex : 0
  const heroImage = images[heroIndex]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const MAX_THUMBNAILS = 6
  const overflow = images.length - MAX_THUMBNAILS

  return (
    <div className="space-y-3" data-testid="media-gallery">
      {/* Hero image */}
      <button
        type="button"
        className="w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => openLightbox(heroIndex)}
      >
        <img
          src={heroImage.url}
          alt={altText}
          className="aspect-video w-full object-cover transition-transform hover:scale-[1.02]"
        />
      </button>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {images.slice(0, MAX_THUMBNAILS).map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                  i === heroIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                )}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={item.url}
                  alt={`${altText} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
            {overflow > 0 && (
              <button
                type="button"
                className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80"
                onClick={() => openLightbox(MAX_THUMBNAILS)}
              >
                <ImageIcon className="mr-1 h-4 w-4" />
                +{overflow}
              </button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <DialogTitle className="sr-only">
            {altText} - Image {currentIndex + 1} of {images.length}
          </DialogTitle>
          <div className="relative flex h-[90vh] items-center justify-center">
            <img
              src={images[currentIndex].url}
              alt={`${altText} ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />

            {/* Nav buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 text-white hover:bg-background/40"
                  onClick={goToPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 text-white hover:bg-background/40"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/30 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} of {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
