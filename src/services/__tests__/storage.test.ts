import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ValidationError, AppError } from '@/lib/errors'

const mocks = vi.hoisted(() => {
  const fn = vi.fn
  function createBuilder(result?: { data?: unknown; error?: unknown; count?: number | null }) {
    const r = { data: result?.data ?? null, error: result?.error ?? null, count: result?.count ?? null }
    const b: Record<string, any> = {}
    for (const m of ['select','eq','neq','is','in','ilike','gte','lte','order','range','limit','or','insert','update','delete','single','maybeSingle','abortSignal'])
      b[m] = fn().mockReturnValue(b)
    b.then = (resolve: (v: any) => void) => { resolve(r); return b }
    return b as Record<string, ReturnType<typeof vi.fn>> & { then: unknown }
  }
  const mockQueryBuilder = createBuilder()
  const mockFrom = fn().mockReturnValue(mockQueryBuilder)
  const mockAuth = {
    getUser: fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: fn(),
    signUp: fn(),
    signOut: fn(),
    signInWithOAuth: fn(),
    resetPasswordForEmail: fn(),
    updateUser: fn(),
    onAuthStateChange: fn().mockReturnValue({ data: { subscription: { unsubscribe: fn() } } }),
  }
  const mockStorageBucket = {
    upload: fn().mockResolvedValue({ data: { path: 'test/path' }, error: null }),
    remove: fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/bucket/test' } }),
  }
  const mockStorage = { from: fn().mockReturnValue(mockStorageBucket) }
  const mockFunctions = { invoke: fn().mockResolvedValue({ data: { id: 'mock-resend-id' }, error: null }) }
  const mockRpc = fn().mockResolvedValue({ data: [], error: null })
  return {
    supabase: { from: mockFrom, auth: mockAuth, storage: mockStorage, functions: mockFunctions, rpc: mockRpc },
    mockFrom, mockQueryBuilder, mockAuth, mockStorage, mockStorageBucket, mockFunctions, mockRpc, createBuilder,
  }
})

vi.mock('@/services/supabase', () => ({ supabase: mocks.supabase }))
vi.mock('browser-image-compression', () => ({
  default: vi.fn().mockImplementation(async (file: File) => file),
}))

import { StorageService } from '../storage'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('StorageService', () => {
  describe('validateFile', () => {
    it('accepts valid image types', () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })
      expect(() => StorageService.validateFile(file, 'avatars')).not.toThrow()
    })

    it('rejects invalid file type', () => {
      const file = new File(['data'], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 })
      expect(() => StorageService.validateFile(file, 'avatars')).toThrow(ValidationError)
    })

    it('rejects file exceeding size limit for avatars', () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 })
      expect(() => StorageService.validateFile(file, 'avatars')).toThrow(ValidationError)
      expect(() => StorageService.validateFile(file, 'avatars')).toThrow('5MB')
    })

    it('rejects file exceeding size limit for media', () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 })
      expect(() => StorageService.validateFile(file, 'artist-media')).toThrow(ValidationError)
      expect(() => StorageService.validateFile(file, 'artist-media')).toThrow('10MB')
    })
  })

  describe('compressImage', () => {
    it('returns compressed file on success', async () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      const result = await StorageService.compressImage(file, { maxSizeMB: 1, maxWidthOrHeight: 800 })
      expect(result).toBeDefined()
    })

    it('returns original file when compression fails', async () => {
      const imageCompression = await import('browser-image-compression')
      ;(imageCompression.default as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Compression failed'))

      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      const result = await StorageService.compressImage(file, { maxSizeMB: 1, maxWidthOrHeight: 800 })
      expect(result).toBe(file)
    })
  })

  describe('uploadAvatar', () => {
    it('uploads and returns URL with cache buster', async () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })

      mocks.mockStorageBucket.upload.mockResolvedValue({ data: { path: 'user-123/avatar.webp' }, error: null })
      mocks.mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/avatars/user-123/avatar.webp' },
      })

      const result = await StorageService.uploadAvatar(file, 'user-123')
      expect(result).toContain('https://test.supabase.co')
      expect(result).toContain('?t=')
    })

    it('throws on upload error', async () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })

      mocks.mockStorageBucket.upload.mockResolvedValue({ data: null, error: { message: 'Upload failed' } })

      await expect(StorageService.uploadAvatar(file, 'user-123')).rejects.toThrow(AppError)
    })
  })

  describe('deleteFile', () => {
    it('deletes from storage', async () => {
      mocks.mockStorageBucket.remove.mockResolvedValue({ data: [], error: null })

      await StorageService.deleteFile('avatars', 'user-123/avatar.webp')
      expect(mocks.mockStorage.from).toHaveBeenCalledWith('avatars')
      expect(mocks.mockStorageBucket.remove).toHaveBeenCalledWith(['user-123/avatar.webp'])
    })
  })

  describe('getPublicUrl', () => {
    it('returns public URL', () => {
      mocks.mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/avatars/test.webp' },
      })

      const result = StorageService.getPublicUrl('avatars', 'test.webp')
      expect(result).toBe('https://test.supabase.co/storage/v1/object/public/avatars/test.webp')
    })
  })

  describe('extractPath', () => {
    it('extracts path from public URL', () => {
      const url = 'https://test.supabase.co/storage/v1/object/public/avatars/user-123/avatar.webp'
      expect(StorageService.extractPath(url, 'avatars')).toBe('user-123/avatar.webp')
    })

    it('returns null for invalid URL', () => {
      expect(StorageService.extractPath('https://other.com/file.jpg', 'avatars')).toBeNull()
    })
  })
})
