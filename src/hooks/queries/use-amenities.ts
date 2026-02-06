/**
 * Amenity query hooks
 */

import { useQuery } from '@tanstack/react-query'
import { AmenityService, type Amenity } from '@/services'

export const amenityKeys = {
  all: ['amenities'] as const,
  list: () => [...amenityKeys.all, 'list'] as const,
}

/**
 * Hook to get all amenities (cached 30 min)
 */
export function useAmenities() {
  return useQuery<Amenity[], Error>({
    queryKey: amenityKeys.list(),
    queryFn: () => AmenityService.list(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
