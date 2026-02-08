import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'
import { mockAmenity, mockGenre, mockCity, mockRegion, mockAvailability } from '@/test/mocks/data'

vi.mock('@/services', () => ({
  AmenityService: { list: vi.fn() },
  GenreService: { list: vi.fn() },
  LocationService: { getCities: vi.fn(), getRegions: vi.fn() },
  AvailabilityService: { getByArtistId: vi.fn() },
}))

vi.mock('@/services/email', () => ({
  EmailService: {
    getPreferences: vi.fn(),
    updatePreferences: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}))

import { AmenityService, GenreService, LocationService, AvailabilityService } from '@/services'
import { EmailService } from '@/services/email'
import { useAmenities } from '../queries/use-amenities'
import { useGenres } from '../queries/use-genres'
import { useCities, useRegions } from '../queries/use-locations'
import { useAvailability } from '../queries/use-availability'
import { useEmailPreferences } from '../queries/use-email-preferences'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useAmenities', () => {
  it('fetches amenities', async () => {
    ;(AmenityService.list as ReturnType<typeof vi.fn>).mockResolvedValue([mockAmenity])
    const { result } = renderHook(() => useAmenities(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockAmenity])
  })
})

describe('useGenres', () => {
  it('fetches genres', async () => {
    ;(GenreService.list as ReturnType<typeof vi.fn>).mockResolvedValue([mockGenre])
    const { result } = renderHook(() => useGenres(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockGenre])
  })
})

describe('useCities', () => {
  it('fetches cities', async () => {
    const cityWithRegion = { ...mockCity, regions: mockRegion }
    ;(LocationService.getCities as ReturnType<typeof vi.fn>).mockResolvedValue([cityWithRegion])
    const { result } = renderHook(() => useCities(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([cityWithRegion])
  })
})

describe('useRegions', () => {
  it('fetches regions', async () => {
    ;(LocationService.getRegions as ReturnType<typeof vi.fn>).mockResolvedValue([mockRegion])
    const { result } = renderHook(() => useRegions(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockRegion])
  })
})

describe('useAvailability', () => {
  it('fetches availability by artist', async () => {
    ;(AvailabilityService.getByArtistId as ReturnType<typeof vi.fn>).mockResolvedValue([mockAvailability])
    const { result } = renderHook(() => useAvailability('artist-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockAvailability])
  })
})

describe('useEmailPreferences', () => {
  it('fetches email preferences', async () => {
    ;(EmailService.getPreferences as ReturnType<typeof vi.fn>).mockResolvedValue({
      booking_emails: true,
      message_emails: true,
      marketing_emails: false,
    })
    const { result } = renderHook(() => useEmailPreferences(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.booking_emails).toBe(true)
  })
})
