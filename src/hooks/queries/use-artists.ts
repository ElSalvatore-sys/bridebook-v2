/**
 * Artist query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import {
  ArtistService,
  type Artist,
  type ArtistWithDetails,
} from '@/services'
import { type CreateArtistInput, type UpdateArtistInput } from '@/lib/validations'
import { showSuccess, showError } from '@/lib/toast'

/**
 * Query key factory for artists
 */
export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: (filters?: object) => [...artistKeys.lists(), filters] as const,
  details: () => [...artistKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistKeys.details(), id] as const,
  byProfile: (id: string) => [...artistKeys.all, 'profile', id] as const,
  search: (q: string) => [...artistKeys.all, 'search', q] as const,
}

interface ListOptions {
  limit?: number
  offset?: number
  genreId?: string
}

/**
 * Hook to get a single artist by ID
 */
export function useArtist(
  id: string,
  options?: Omit<UseQueryOptions<ArtistWithDetails, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: artistKeys.detail(id),
    queryFn: () => ArtistService.getById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to get artist by profile ID
 */
export function useArtistByProfile(
  profileId: string,
  options?: Omit<UseQueryOptions<Artist | null, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: artistKeys.byProfile(profileId),
    queryFn: () => ArtistService.getByProfileId(profileId),
    enabled: !!profileId,
    ...options,
  })
}

/**
 * Hook to list artists with pagination and filtering
 */
export function useArtists(
  listOptions?: ListOptions,
  options?: Omit<
    UseQueryOptions<{ data: Artist[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: artistKeys.list(listOptions),
    queryFn: () => ArtistService.list(listOptions),
    ...options,
  })
}

/**
 * Hook to search artists
 */
export function useSearchArtists(
  query: string,
  searchOptions?: { limit?: number; offset?: number },
  options?: Omit<
    UseQueryOptions<{ data: Artist[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: artistKeys.search(query),
    queryFn: () => ArtistService.search(query, searchOptions),
    enabled: query.length > 2,
    ...options,
  })
}

/**
 * Hook to create a new artist
 */
export function useCreateArtist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateArtistInput) => ArtistService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      showSuccess('Artist profile created successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to update an artist
 */
export function useUpdateArtist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateArtistInput }) =>
      ArtistService.update(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      showSuccess('Artist profile updated successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to delete an artist (soft delete)
 */
export function useDeleteArtist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ArtistService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artistKeys.all })
      showSuccess('Artist profile deleted successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}
