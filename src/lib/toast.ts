/**
 * Toast notification utilities
 * Wraps sonner for consistent messaging across the app
 */

import { toast } from 'sonner'
import { AppError, isAbortError } from './errors'

/**
 * Show an error toast with appropriate message
 */
export function showError(error: unknown): void {
  if (isAbortError(error)) return

  let message: string

  if (error instanceof AppError) {
    message = error.message
  } else if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'An unexpected error occurred'
  }

  toast.error(message)
}

/**
 * Show a success toast
 */
export function showSuccess(message: string): void {
  toast.success(message)
}

/**
 * Show a loading toast and return its ID for later dismissal
 */
export function showLoading(message: string): string | number {
  return toast.loading(message)
}

/**
 * Dismiss a specific toast by ID
 */
export function dismissToast(id: string | number): void {
  toast.dismiss(id)
}
