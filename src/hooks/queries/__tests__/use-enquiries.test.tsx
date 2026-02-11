/**
 * use-enquiries hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useSentEnquiries,
  useReceivedEnquiries,
  useCreateEnquiry,
  useUpdateEnquiryStatus,
} from '../use-enquiries'

const mocks = vi.hoisted(() => ({
  getBySender: vi.fn(),
  getForProvider: vi.fn(),
  create: vi.fn(),
  updateStatus: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('@/services/enquiries', () => ({
  EnquiryService: {
    getBySender: mocks.getBySender,
    getForProvider: mocks.getForProvider,
    create: mocks.create,
    updateStatus: mocks.updateStatus,
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: mocks.showSuccess,
  showError: mocks.showError,
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

describe('use-enquiries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useSentEnquiries', () => {
    it('fetches sent enquiries', async () => {
      const mockEnquiries = [
        { id: '1', entity_type: 'ARTIST', name: 'John' },
        { id: '2', entity_type: 'VENUE', name: 'Jane' },
      ]
      mocks.getBySender.mockResolvedValue(mockEnquiries)

      const { result } = renderHook(() => useSentEnquiries(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockEnquiries)
      expect(mocks.getBySender).toHaveBeenCalled()
    })
  })

  describe('useReceivedEnquiries', () => {
    it('fetches received enquiries', async () => {
      const mockEnquiries = [{ id: '3', entity_type: 'ARTIST' }]
      mocks.getForProvider.mockResolvedValue(mockEnquiries)

      const { result } = renderHook(() => useReceivedEnquiries(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockEnquiries)
    })
  })

  describe('useCreateEnquiry', () => {
    it('creates enquiry successfully', async () => {
      const mockEnquiry = { id: '1', name: 'John', email: 'john@test.com' }
      mocks.create.mockResolvedValue(mockEnquiry)

      const { result } = renderHook(() => useCreateEnquiry(), {
        wrapper: createWrapper(),
      })

      const input = {
        entity_type: 'ARTIST' as const,
        enquiry_type: 'GENERAL' as const,
        name: 'John',
        email: 'john@test.com',
        message: 'Test enquiry',
      }

      await result.current.mutateAsync(input)

      expect(mocks.create).toHaveBeenCalledWith(input)
      expect(mocks.showSuccess).toHaveBeenCalledWith('Enquiry sent successfully!')
    })
  })

  describe('useUpdateEnquiryStatus', () => {
    it('updates enquiry status', async () => {
      const mockUpdated = { id: '1', status: 'READ' }
      mocks.updateStatus.mockResolvedValue(mockUpdated)

      const { result } = renderHook(() => useUpdateEnquiryStatus(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ id: '1', status: 'READ' })

      expect(mocks.updateStatus).toHaveBeenCalledWith('1', 'READ')
      // No success toast in this hook - it just invalidates cache
    })
  })
})
