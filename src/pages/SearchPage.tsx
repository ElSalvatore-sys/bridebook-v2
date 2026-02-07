import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchFilters } from '@/components/search/SearchFilters'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearchArtistsRpc, useSearchVenuesRpc } from '@/hooks/queries/use-search'
import type { SearchType } from '@/lib/validations/search'
import type { ArtistSearchFilters, VenueSearchFilters } from '@/services/search'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const type = (searchParams.get('type') as SearchType) || 'all'
  const cityId = searchParams.get('city') ?? null
  const genreId = searchParams.get('genre') ?? null

  const debouncedQuery = useDebounce(query, 300)

  // Build filters
  const artistFilters: ArtistSearchFilters | undefined = genreId
    ? { genre_id: genreId }
    : undefined
  const venueFilters: VenueSearchFilters | undefined = cityId
    ? { city_id: cityId }
    : undefined

  const showArtists = type === 'all' || type === 'artists'
  const showVenues = type === 'all' || type === 'venues'

  const {
    data: artists,
    isLoading: artistsLoading,
  } = useSearchArtistsRpc(
    showArtists ? debouncedQuery : '',
    artistFilters
  )

  const {
    data: venues,
    isLoading: venuesLoading,
  } = useSearchVenuesRpc(
    showVenues ? debouncedQuery : '',
    venueFilters
  )

  function updateParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === null || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    })
  }

  return (
    <div className="space-y-6" data-testid="search-page">
      <PageHeader
        title="Search"
        description="Find artists and venues"
      />

      {/* Search input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search artists & venues..."
          value={query}
          onChange={(e) => updateParam('q', e.target.value)}
          className="pl-10"
          autoFocus
          data-testid="search-page-input"
        />
      </div>

      {/* Filters */}
      <SearchFilters
        type={type}
        cityId={cityId}
        genreId={genreId}
        onTypeChange={(t) => updateParam('type', t === 'all' ? null : t)}
        onCityChange={(id) => updateParam('city', id)}
        onGenreChange={(id) => updateParam('genre', id)}
        onClearAll={() => {
          setSearchParams((prev) => {
            const next = new URLSearchParams()
            const q = prev.get('q')
            if (q) next.set('q', q)
            return next
          })
        }}
      />

      {/* Results or prompt */}
      {debouncedQuery.length < 2 ? (
        <EmptyState
          icon={Search}
          title="Search for artists and venues"
          description="Type at least 2 characters to start searching."
        />
      ) : (
        <SearchResults
          artists={showArtists ? (artists ?? []) : []}
          venues={showVenues ? (venues ?? []) : []}
          isLoading={
            (showArtists && artistsLoading) || (showVenues && venuesLoading)
          }
          query={debouncedQuery}
          showType={type}
        />
      )}
    </div>
  )
}
