/**
 * MediaManagerPage — Role-based media management
 * Resolves artist/venue entity from the current user's profile
 */

import { useAuth } from '@/hooks/useAuth'
import { useArtistByProfile, useVenueByProfile } from '@/hooks'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MediaManager } from '@/components/media/MediaManager'
import type { MediaTable } from '@/services/media'

export function MediaManagerPage() {
  const { profile } = useAuth()
  const role = profile?.role

  const isArtist = role === 'ARTIST'
  const isVenue = role === 'VENUE'

  const { data: artist, isLoading: artistLoading } = useArtistByProfile(
    profile?.id ?? '',
    { enabled: isArtist && !!profile?.id }
  )

  const { data: venue, isLoading: venueLoading } = useVenueByProfile(
    profile?.id ?? '',
    { enabled: isVenue && !!profile?.id }
  )

  const isLoading = (isArtist && artistLoading) || (isVenue && venueLoading)

  let table: MediaTable | null = null
  let entityId: string | null = null

  if (isArtist && artist) {
    table = 'artist_media'
    entityId = artist.id
  } else if (isVenue && venue) {
    table = 'venue_media'
    entityId = venue.id
  }

  return (
    <div data-testid="media-manager-page" className="space-y-6">
      <PageHeader title="Manage Photos" />

      {isLoading && (
        <div data-testid="media-page-loading">
          <LoadingSpinner fullScreen={false} />
        </div>
      )}

      {!isLoading && !table && (
        <div
          data-testid="media-page-no-entity"
          className="text-center py-12 text-muted-foreground"
        >
          <p>Create an artist or venue profile to manage photos.</p>
        </div>
      )}

      {!isLoading && table && entityId && (
        <MediaManager table={table} entityId={entityId} />
      )}
    </div>
  )
}

export default MediaManagerPage
