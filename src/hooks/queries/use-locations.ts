/**
 * Location query hooks
 */

import { useQuery } from '@tanstack/react-query'
import { LocationService, type CityWithRegion, type Region } from '@/services'

export const locationKeys = {
  all: ['locations'] as const,
  cities: () => [...locationKeys.all, 'cities'] as const,
  regions: () => [...locationKeys.all, 'regions'] as const,
}

/**
 * Hook to get all cities with region info (cached 30 min)
 */
export function useCities() {
  return useQuery<CityWithRegion[], Error>({
    queryKey: locationKeys.cities(),
    queryFn: () => LocationService.getCities(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

/**
 * Hook to get all regions (cached 30 min)
 */
export function useRegions() {
  return useQuery<Region[], Error>({
    queryKey: locationKeys.regions(),
    queryFn: () => LocationService.getRegions(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
