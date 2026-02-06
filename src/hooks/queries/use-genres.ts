/**
 * Genre query hooks
 */

import { useQuery } from '@tanstack/react-query'
import { GenreService, type Genre } from '@/services'

export const genreKeys = {
  all: ['genres'] as const,
  list: () => [...genreKeys.all, 'list'] as const,
}

/**
 * Hook to get all genres (cached 30 min)
 */
export function useGenres() {
  return useQuery<Genre[], Error>({
    queryKey: genreKeys.list(),
    queryFn: () => GenreService.list(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
