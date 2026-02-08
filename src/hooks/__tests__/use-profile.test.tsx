import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockProfile } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  ProfileService: {
    getCurrent: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/lib/errors', () => ({
  isAbortError: vi.fn().mockReturnValue(false),
}))

import { ProfileService } from '@/services'
import { useCurrentProfile, useProfile, useUpdateProfile } from '../queries/use-profile'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCurrentProfile', () => {
  it('calls ProfileService.getCurrent', async () => {
    ;(ProfileService.getCurrent as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useCurrentProfile(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProfile)
  })
})

describe('useProfile', () => {
  it('calls ProfileService.getById', async () => {
    ;(ProfileService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useProfile('user-123'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProfile)
  })

  it('is disabled when ID is empty', () => {
    const { result } = renderHook(() => useProfile(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useUpdateProfile', () => {
  it('calls ProfileService.update and shows success', async () => {
    ;(ProfileService.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useUpdateProfile(), { wrapper })

    result.current.mutate({ first_name: 'Updated' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProfileService.update).toHaveBeenCalledWith({ first_name: 'Updated' })
  })
})
