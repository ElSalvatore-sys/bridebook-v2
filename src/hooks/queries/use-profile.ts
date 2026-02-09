/**
 * Profile query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { ProfileService, type Profile, type ProfileRole } from '@/services'
import { type UpdateProfileInput } from '@/lib/validations'
import { queryClient } from '@/lib/query-client'
import { showSuccess, showError } from '@/lib/toast'
import { isAbortError } from '@/lib/errors'

/**
 * Query key factory for profiles
 */
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  detail: (id: string) => [...profileKeys.all, 'detail', id] as const,
  byRole: (role: ProfileRole) => [...profileKeys.all, 'role', role] as const,
}

/**
 * Hook to get the current user's profile
 */
export function useCurrentProfile(
  options?: Omit<UseQueryOptions<Profile, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => ProfileService.getCurrent(),
    retry: (failureCount, error) => {
      if (isAbortError(error)) return failureCount < 2
      return failureCount < 1
    },
    ...options,
  })
}

/**
 * Hook to get a profile by ID
 */
export function useProfile(
  id: string,
  options?: Omit<UseQueryOptions<Profile, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => ProfileService.getById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to get profiles by role
 */
export function useProfilesByRole(
  role: ProfileRole,
  paginationOptions?: { limit?: number; offset?: number },
  options?: Omit<
    UseQueryOptions<{ data: Profile[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...profileKeys.byRole(role), paginationOptions],
    queryFn: () => ProfileService.getByRole(role, paginationOptions),
    enabled: !!role,
    ...options,
  })
}

/**
 * Hook to update the current user's profile
 */
export function useUpdateProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => ProfileService.update(input),
    onSuccess: (data) => {
      // Invalidate and refetch current profile
      qc.invalidateQueries({ queryKey: profileKeys.current() })
      qc.invalidateQueries({ queryKey: profileKeys.detail(data.id) })
      showSuccess('Profile updated successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to change user's password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => ProfileService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      showSuccess('Password changed successfully')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to request account deletion
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => ProfileService.requestAccountDeletion(),
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/login'
    },
    onError: (error) => {
      showError(error)
    },
  })
}
