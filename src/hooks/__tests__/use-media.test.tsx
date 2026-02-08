import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'

vi.mock('@/services', () => ({
  StorageService: {
    uploadAvatar: vi.fn(),
    uploadEntityMedia: vi.fn(),
    deleteFile: vi.fn(),
    extractPath: vi.fn(),
  },
  MediaService: {
    create: vi.fn(),
    delete: vi.fn(),
    getByEntity: vi.fn(),
    setPrimary: vi.fn(),
  },
  ProfileService: {
    update: vi.fn(),
  },
}))

vi.mock('@/lib/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showLoading: vi.fn().mockReturnValue('toast-1'),
  dismissToast: vi.fn(),
}))

vi.mock('@/lib/errors', () => ({
  isAbortError: vi.fn().mockReturnValue(false),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-123' } }),
}))

import { StorageService, MediaService, ProfileService } from '@/services'
import { useUploadAvatar, useUploadMedia, useDeleteMedia } from '../queries/use-media'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useUploadAvatar', () => {
  it('uploads avatar and updates profile', async () => {
    ;(StorageService.uploadAvatar as ReturnType<typeof vi.fn>).mockResolvedValue('https://example.com/avatar.webp')
    ;(ProfileService.update as ReturnType<typeof vi.fn>).mockResolvedValue({})

    const { result } = renderHook(() => useUploadAvatar(), { wrapper })
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
    result.current.mutate(file)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StorageService.uploadAvatar).toHaveBeenCalledWith(file, 'user-123')
    expect(ProfileService.update).toHaveBeenCalledWith({ avatar_url: 'https://example.com/avatar.webp' })
  })
})

describe('useUploadMedia', () => {
  it('uploads media and creates DB record', async () => {
    ;(StorageService.uploadEntityMedia as ReturnType<typeof vi.fn>).mockResolvedValue('https://example.com/media.webp')
    ;(MediaService.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'media-1' })

    const { result } = renderHook(() => useUploadMedia('artist_media', 'artist-1'), { wrapper })
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
    result.current.mutate({ file })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StorageService.uploadEntityMedia).toHaveBeenCalledWith(file, 'artist-media', 'artist-1')
  })
})

describe('useDeleteMedia', () => {
  it('deletes from storage and DB', async () => {
    ;(StorageService.extractPath as ReturnType<typeof vi.fn>).mockReturnValue('artist-1/img.webp')
    ;(StorageService.deleteFile as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(MediaService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteMedia('artist_media'), { wrapper })
    result.current.mutate({ id: 'media-1', url: 'https://example.com/img.webp', entityId: 'artist-1' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(MediaService.delete).toHaveBeenCalledWith('artist_media', 'media-1')
  })
})
