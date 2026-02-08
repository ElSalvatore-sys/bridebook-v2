import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock sonner BEFORE importing the module
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn().mockReturnValue('toast-id-1'),
    dismiss: vi.fn(),
  },
}))

import { toast } from 'sonner'
import { showError, showSuccess, showLoading, dismissToast } from '../toast'
import { AppError } from '../errors'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('showError', () => {
  it('shows AppError message', () => {
    showError(new AppError('Custom app error'))
    expect(toast.error).toHaveBeenCalledWith('Custom app error')
  })

  it('shows Error message', () => {
    showError(new Error('Regular error'))
    expect(toast.error).toHaveBeenCalledWith('Regular error')
  })

  it('shows string directly', () => {
    showError('String error')
    expect(toast.error).toHaveBeenCalledWith('String error')
  })

  it('shows fallback for unknown types', () => {
    showError(42)
    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
  })

  it('shows fallback for undefined', () => {
    showError(undefined)
    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
  })

  it('ignores abort errors', () => {
    const err = new DOMException('The operation was aborted', 'AbortError')
    showError(err)
    expect(toast.error).not.toHaveBeenCalled()
  })
})

describe('showSuccess', () => {
  it('calls toast.success', () => {
    showSuccess('Done!')
    expect(toast.success).toHaveBeenCalledWith('Done!')
  })
})

describe('showLoading', () => {
  it('calls toast.loading and returns ID', () => {
    const id = showLoading('Loading...')
    expect(toast.loading).toHaveBeenCalledWith('Loading...')
    expect(id).toBe('toast-id-1')
  })
})

describe('dismissToast', () => {
  it('calls toast.dismiss with ID', () => {
    dismissToast('toast-id-1')
    expect(toast.dismiss).toHaveBeenCalledWith('toast-id-1')
  })
})
