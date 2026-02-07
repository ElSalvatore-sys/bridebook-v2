/**
 * Search query hooks
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  SearchService,
  type ArtistSearchResult,
  type VenueSearchResult,
  type CombinedSearchResults,
  type ArtistSearchFilters,
  type VenueSearchFilters,
} from '@/services/search'

export const searchKeys = {
  all: ['search'] as const,
  artists: (q: string, filters?: ArtistSearchFilters) =>
    [...searchKeys.all, 'artists', q, filters] as const,
  venues: (q: string, filters?: VenueSearchFilters) =>
    [...searchKeys.all, 'venues', q, filters] as const,
  global: (q: string) => [...searchKeys.all, 'global', q] as const,
}

export function useSearchArtistsRpc(query: string, filters?: ArtistSearchFilters) {
  return useQuery<ArtistSearchResult[], Error>({
    queryKey: searchKeys.artists(query, filters),
    queryFn: () => SearchService.searchArtists(query, filters),
    enabled: query.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useSearchVenuesRpc(query: string, filters?: VenueSearchFilters) {
  return useQuery<VenueSearchResult[], Error>({
    queryKey: searchKeys.venues(query, filters),
    queryFn: () => SearchService.searchVenues(query, filters),
    enabled: query.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useGlobalSearch(query: string) {
  return useQuery<CombinedSearchResults, Error>({
    queryKey: searchKeys.global(query),
    queryFn: () => SearchService.searchAll(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}
