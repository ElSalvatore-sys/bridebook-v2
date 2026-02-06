import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/ui/page-header'
import {
  SearchBar,
  FilterPanel,
  FilterSheet,
  SortDropdown,
  ViewToggle,
  ActiveFilters,
  Pagination,
  ResultsGrid,
  VenueCard,
} from '@/components/discovery'
import { useDiscoverVenues } from '@/hooks/queries'
import { useFilterStore } from '@/stores'

export function VenuesPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const hydrateFromParams = useFilterStore((s) => s.hydrateFromParams)
  const toSearchParams = useFilterStore((s) => s.toSearchParams)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const locationState = useFilterStore((s) => s.location)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)

  // Hydrate filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.toString()) {
      hydrateFromParams(params)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync filters to URL when they change
  useEffect(() => {
    const params = toSearchParams()
    const search = params.toString()
    const currentSearch = new URLSearchParams(location.search).toString()

    if (search !== currentSearch) {
      navigate(`?${search}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categories, locationState, sortBy, page])

  // Reset filters on unmount
  useEffect(() => {
    return () => {
      resetFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading } = useDiscoverVenues()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Venues"
        description="Find the perfect venue for your event"
      />

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel vendorType="venue" />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <SearchBar className="flex-1 min-w-[200px]" placeholder="Search venues..." />
            <FilterSheet vendorType="venue" />
            <SortDropdown vendorType="venue" />
            <ViewToggle />
          </div>

          <ActiveFilters vendorType="venue" />

          <ResultsGrid
            isLoading={isLoading}
            isEmpty={!isLoading && (data?.data?.length ?? 0) === 0}
            totalCount={data?.count ?? null}
            emptyTitle="No venues found"
            emptyDescription="Try adjusting your search or filters to find venues."
            onClearFilters={resetFilters}
          >
            {data?.data?.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </ResultsGrid>

          <Pagination totalCount={data?.count ?? null} />
        </main>
      </div>
    </div>
  )
}

export default VenuesPage
