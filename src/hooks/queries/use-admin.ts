/**
 * Admin query and mutation hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminService, type PlatformStats, type AdminUsersResult, type AdminActivity } from '@/services/admin'
import type { ProfileRole } from '@/services/profiles'
import { showSuccess, showError } from '@/lib/toast'

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: (page: number, search?: string) => [...adminKeys.all, 'users', page, search] as const,
  activity: () => [...adminKeys.all, 'activity'] as const,
}

export function useAdminStats() {
  return useQuery<PlatformStats, Error>({
    queryKey: adminKeys.stats(),
    queryFn: () => AdminService.getStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminUsers(page = 1, search?: string) {
  return useQuery<AdminUsersResult, Error>({
    queryKey: adminKeys.users(page, search),
    queryFn: () => AdminService.getUsers(page, 20, search),
    placeholderData: (prev) => prev,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; role: ProfileRole }>({
    mutationFn: ({ userId, role }) => AdminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
      showSuccess('User role updated')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

export function useAdminActivity() {
  return useQuery<AdminActivity[], Error>({
    queryKey: adminKeys.activity(),
    queryFn: () => AdminService.getRecentActivity(),
  })
}
