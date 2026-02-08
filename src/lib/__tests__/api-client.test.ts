import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UnauthorizedError } from '../errors'

const mocks = vi.hoisted(() => {
  const mockGetUser = vi.fn()
  return { mockGetUser }
})

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: mocks.mockGetUser,
    },
  },
}))

import { getCurrentUserId } from '../api-client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getCurrentUserId', () => {
  it('returns user ID on success', async () => {
    mocks.mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    })

    const id = await getCurrentUserId()
    expect(id).toBe('user-123')
  })

  it('throws UnauthorizedError on auth error', async () => {
    mocks.mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'No session' },
    })

    await expect(getCurrentUserId()).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when no user', async () => {
    mocks.mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    await expect(getCurrentUserId()).rejects.toThrow(UnauthorizedError)
  })
})
