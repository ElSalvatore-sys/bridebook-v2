import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CardSkeleton } from '@/components/discovery/CardSkeleton'
import { ArtistCard } from '@/components/discovery/ArtistCard'
import { VenueCard } from '@/components/discovery/VenueCard'
import { useSimilarArtists, useSimilarVenues } from '@/hooks/queries'

interface SimilarEntitiesProps {
  entityType: 'artist' | 'venue'
  entityId: string
}

export function SimilarEntities({ entityType, entityId }: SimilarEntitiesProps) {
  const artistQuery = useSimilarArtists(entityId, { enabled: entityType === 'artist' && !!entityId })
  const venueQuery = useSimilarVenues(entityId, { enabled: entityType === 'venue' && !!entityId })

  const isLoading = entityType === 'artist' ? artistQuery.isLoading : venueQuery.isLoading
  const artists = artistQuery.data ?? []
  const venues = venueQuery.data ?? []
  const isEmpty = entityType === 'artist' ? artists.length === 0 : venues.length === 0

  if (isLoading) {
    return (
      <div className="space-y-3" data-testid="similar-entities-loading">
        <h3 className="text-lg font-semibold">
          Similar {entityType === 'artist' ? 'Artists' : 'Venues'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isEmpty) return null

  return (
    <div className="space-y-3" data-testid="similar-entities">
      <h3 className="text-lg font-semibold">
        Similar {entityType === 'artist' ? 'Artists' : 'Venues'}
      </h3>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">
          {entityType === 'artist'
            ? artists.map((a) => (
                <div key={a.id} className="w-[220px] shrink-0">
                  <ArtistCard artist={a} />
                </div>
              ))
            : venues.map((v) => (
                <div key={v.id} className="w-[220px] shrink-0">
                  <VenueCard venue={v} />
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
