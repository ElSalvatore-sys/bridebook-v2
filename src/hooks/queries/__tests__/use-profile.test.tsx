/**
 * use-profile hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useCurrentProfile,
  useProfile,
  useProfilesByRole,
  useUpdateProfile,
  useChangePassword,
  useDeleteAccount,
} from '../use-profile'

const mocks = vi.hoisted(() => ({
  getCurrent: vi.fn(),
  getById: vi.fn(),
  getByRole: vi.fn(),
  update: vi.fn(),
  changePassword: vi.fn(),
  requestAccountDeletion: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  isAbortError: vi.fn(),
  user: { id: 'user-1' },
}))

vi.mock('@/services/profiles', () => ({
  ProfileService: {
    getCurrent: mocks.getCurrent,
    getById: mocks.getById,
    getByRole: mocks.getByRole,
    update: mocks.update,
    changePassword: mocks.changePassword,
    requestAccountDeletion: mocks.requestAccountDeletion,
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: mocks.showSuccess,
  showError: mocks.showError,
}))

vi.mock('@/lib/errors', () => ({
  isAbortError: mocks.isAbortError,
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: mocks.user }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('use-profile hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCurrentProfile', () => {
    it('fetches current user profile', async () => {
      const mockProfile = { id: 'user-1', first_name: 'John', last_name: 'Doe' }
      mocks.getCurrent.mockResolvedValue(mockProfile)

      const { result } = renderHook(() => useCurrentProfile(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProfile)
      expect(mocks.getCurrent).toHaveBeenCalled()
    })

  })

  describe('useUpdateProfile', () => {
    it('updates profile successfully', async () => {
      const mockUpdated = { id: 'user-1', first_name: 'Jane' }
      mocks.update.mockResolvedValue(mockUpdated)

      const { result } = renderHook(() => useUpdateProfile(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ first_name: 'Jane' })

      expect(mocks.update).toHaveBeenCalledWith({ first_name: 'Jane' })
      expect(mocks.showSuccess).toHaveBeenCalledWith('Profile updated successfully')
    })
  })

  describe('useChangePassword', () => {
    it('changes password successfully', async () => {
      mocks.changePassword.mockResolvedValue(undefined)

      const { result } = renderHook(() => useChangePassword(), {
        wrapper: createWrapper(),
      })

      const input = {
        currentPassword: 'old123',
        newPassword: 'new456',
      }

      await result.current.mutateAsync(input)

      expect(mocks.changePassword).toHaveBeenCalledWith('old123', 'new456')
      expect(mocks.showSuccess).toHaveBeenCalledWith('Password changed successfully')
    })
  })

  describe('useProfile', () => {
    it('fetches profile by id', async () => {
      const mockProfile = { id: 'profile-1', first_name: 'Alice' }
      mocks.getById.mockResolvedValue(mockProfile)

      const { result } = renderHook(() => useProfile('profile-1'), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProfile)
      expect(mocks.getById).toHaveBeenCalledWith('profile-1')
    })

    it('is disabled when id is empty', () => {
      const { result } = renderHook(() => useProfile(''), { wrapper: createWrapper() })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mocks.getById).not.toHaveBeenCalled()
    })
  })

  describe('useProfilesByRole', () => {
    it('fetches profiles by role', async () => {
      const mockData = { data: [{ id: '1', role: 'ARTIST' }], count: 1 }
      mocks.getByRole.mockResolvedValue(mockData)

      const { result } = renderHook(() => useProfilesByRole('ARTIST' as any), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mocks.getByRole).toHaveBeenCalledWith('ARTIST', undefined)
    })

    it('is disabled when role is empty', () => {
      const { result } = renderHook(() => useProfilesByRole('' as any), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mocks.getByRole).not.toHaveBeenCalled()
    })
  })

  describe('useDeleteAccount', () => {
    it('deletes account successfully', async () => {
      mocks.requestAccountDeletion.mockResolvedValue(undefined)
      delete (window as any).location
      window.location = { href: '' } as any

      const { result } = renderHook(() => useDeleteAccount(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync()

      expect(mocks.requestAccountDeletion).toHaveBeenCalled()
      expect(window.location.href).toBe('/login')
    })
  })

  describe('error handling', () => {
    it('calls showError when update fails', async () => {
      const error = new Error('Update failed')
      mocks.update.mockRejectedValue(error)

      const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() })

      try {
        await result.current.mutateAsync({ first_name: 'Jane' })
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })

    it('calls showError when changePassword fails', async () => {
      const error = new Error('Password change failed')
      mocks.changePassword.mockRejectedValue(error)

      const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() })

      try {
        await result.current.mutateAsync({ currentPassword: 'old', newPassword: 'new' })
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })

    it('calls showError when deleteAccount fails', async () => {
      const error = new Error('Deletion failed')
      mocks.requestAccountDeletion.mockRejectedValue(error)

      const { result } = renderHook(() => useDeleteAccount(), { wrapper: createWrapper() })

      try {
        await result.current.mutateAsync()
      } catch (e) {
        // Expected to throw
      }

      expect(mocks.showError).toHaveBeenCalledWith(error)
    })

  })
})
