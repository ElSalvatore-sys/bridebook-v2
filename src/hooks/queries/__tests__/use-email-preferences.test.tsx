import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEmailPreferences, useUpdateEmailPreferences } from '../use-email-preferences'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  getPreferences: vi.fn(),
  updatePreferences: vi.fn(),
}))

vi.mock('@/services/email', () => ({
  EmailService: {
    getPreferences: mocks.getPreferences,
    updatePreferences: mocks.updatePreferences,
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

describe('use-email-preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useEmailPreferences', () => {
    it('fetches email preferences', async () => {
      const mockPrefs = {
        id: 'prefs-1',
        marketing_emails: true,
        booking_emails: true,
      }
      mocks.getPreferences.mockResolvedValue(mockPrefs)

      const { result } = renderHook(() => useEmailPreferences(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockPrefs)
    })
  })

  describe('useUpdateEmailPreferences', () => {
    it('updates email preferences', async () => {
      const mockPrefs = { id: 'prefs-1', marketing_emails: false }
      mocks.updatePreferences.mockResolvedValue(mockPrefs)

      const { result } = renderHook(() => useUpdateEmailPreferences(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ marketing_emails: false })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mocks.updatePreferences).toHaveBeenCalledWith({
        marketing_emails: false,
      })
    })
  })
})
