import { SearchX } from 'lucide-react'
import { ArtistCard } from '@/components/discovery/ArtistCard'
import { VenueCard } from '@/components/discovery/VenueCard'
import { CardSkeleton } from '@/components/discovery/CardSkeleton'
import { EmptyState } from '@/components/ui/empty-state'
import type { ArtistSearchResult, VenueSearchResult } from '@/services/search'
import type { ArtistDiscoverResult, VenueDiscoverResult, VenueType } from '@/services'

interface SearchResultsProps {
  artists: ArtistSearchResult[]
  venues: VenueSearchResult[]
  isLoading: boolean
  query: string
  showType: 'all' | 'artists' | 'venues'
}

function toArtistDiscover(r: ArtistSearchResult): ArtistDiscoverResult {
  return {
    id: r.id,
    stage_name: r.stage_name,
    bio: r.bio,
    hourly_rate: r.hourly_rate,
    years_experience: r.years_experience,
    has_equipment: r.has_equipment,
    primary_image_url: r.primary_image_url,
    genre_names: r.genre_names ?? [],
  }
}

function toVenueDiscover(r: VenueSearchResult): VenueDiscoverResult {
  return {
    id: r.id,
    venue_name: r.venue_name,
    description: r.description,
    type: r.type as VenueType,
    city_name: r.city_name,
    street: null,
    capacity_min: r.capacity_min,
    capacity_max: r.capacity_max,
    primary_image_url: r.primary_image_url,
    amenity_names: r.amenity_names ?? [],
  }
}

export function SearchResults({
  artists,
  venues,
  isLoading,
  query,
  showType,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const showArtists = showType === 'all' || showType === 'artists'
  const showVenues = showType === 'all' || showType === 'venues'
  const totalResults =
    (showArtists ? artists.length : 0) + (showVenues ? venues.length : 0)

  if (query.length >= 2 && totalResults === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results found"
        description={`We couldn't find anything matching "${query}". Try a different search term.`}
      />
    )
  }

  return (
    <div className="space-y-8" data-testid="search-results">
      {showArtists && artists.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Artists ({artists.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={toArtistDiscover(artist)} />
            ))}
          </div>
        </section>
      )}

      {showVenues && venues.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Venues ({venues.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={toVenueDiscover(venue)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
