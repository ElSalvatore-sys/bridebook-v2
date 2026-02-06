/**
 * Availability query hooks
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { AvailabilityService, type Availability } from '@/services'

export const availabilityKeys = {
  all: ['availability'] as const,
  byArtist: (artistId: string) => [...availabilityKeys.all, 'artist', artistId] as const,
}

/**
 * Hook to get availability for an artist
 */
export function useAvailability(
  artistId: string,
  options?: Omit<UseQueryOptions<Availability[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: availabilityKeys.byArtist(artistId),
    queryFn: () => AvailabilityService.getByArtistId(artistId),
    enabled: !!artistId,
    ...options,
  })
}
