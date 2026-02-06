/**
 * Venue query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import {
  VenueService,
  type Venue,
  type VenueWithDetails,
  type VenueType,
} from '@/services'
import { type CreateVenueInput, type UpdateVenueInput } from '@/lib/validations'
import { showSuccess, showError } from '@/lib/toast'

/**
 * Query key factory for venues
 */
export const venueKeys = {
  all: ['venues'] as const,
  lists: () => [...venueKeys.all, 'list'] as const,
  list: (filters?: object) => [...venueKeys.lists(), filters] as const,
  details: () => [...venueKeys.all, 'detail'] as const,
  detail: (id: string) => [...venueKeys.details(), id] as const,
  byProfile: (id: string) => [...venueKeys.all, 'profile', id] as const,
  search: (q: string) => [...venueKeys.all, 'search', q] as const,
}

interface ListOptions {
  limit?: number
  offset?: number
  type?: VenueType
  cityId?: string
}

/**
 * Hook to get a single venue by ID
 */
export function useVenue(
  id: string,
  options?: Omit<UseQueryOptions<VenueWithDetails, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: venueKeys.detail(id),
    queryFn: () => VenueService.getById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to get venue by profile ID
 */
export function useVenueByProfile(
  profileId: string,
  options?: Omit<UseQueryOptions<Venue | null, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: venueKeys.byProfile(profileId),
    queryFn: () => VenueService.getByProfileId(profileId),
    enabled: !!profileId,
    ...options,
  })
}

/**
 * Hook to list venues with pagination and filtering
 */
export function useVenues(
  listOptions?: ListOptions,
  options?: Omit<
    UseQueryOptions<{ data: Venue[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: venueKeys.list(listOptions),
    queryFn: () => VenueService.list(listOptions),
    ...options,
  })
}

/**
 * Hook to search venues
 */
export function useSearchVenues(
  query: string,
  searchOptions?: { limit?: number; offset?: number },
  options?: Omit<
    UseQueryOptions<{ data: Venue[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: venueKeys.search(query),
    queryFn: () => VenueService.search(query, searchOptions),
    enabled: query.length > 2,
    ...options,
  })
}

/**
 * Hook to create a new venue
 */
export function useCreateVenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateVenueInput) => VenueService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.lists() })
      showSuccess('Venue created successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to update a venue
 */
export function useUpdateVenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVenueInput }) =>
      VenueService.update(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: venueKeys.lists() })
      showSuccess('Venue updated successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to delete a venue (soft delete)
 */
export function useDeleteVenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => VenueService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.all })
      showSuccess('Venue deleted successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}
