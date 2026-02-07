/**
 * Storage Service
 * Handles file uploads, deletion, and validation for Supabase Storage
 */

import imageCompression from 'browser-image-compression'
import { supabase } from './supabase'
import { ValidationError, AppError, isAbortError } from '@/lib/errors'

export type StorageBucket = 'avatars' | 'artist-media' | 'venue-media'

const MAX_SIZES: Record<StorageBucket, number> = {
  avatars: 5 * 1024 * 1024,       // 5MB
  'artist-media': 10 * 1024 * 1024, // 10MB
  'venue-media': 10 * 1024 * 1024,  // 10MB
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export class StorageService {
  /**
   * Retry a storage operation once if it fails with an abort error.
   * Works around a StrictMode race where Supabase's auth lock
   * propagates an AbortController signal during initialization.
   */
  private static async withAbortRetry<T>(
    operation: () => Promise<{ data: T | null; error: { message: string } | null }>
  ): Promise<{ data: T | null; error: { message: string } | null }> {
    const result = await operation()
    if (result.error && isAbortError(result.error)) {
      await new Promise((r) => setTimeout(r, 150))
      return operation()
    }
    return result
  }

  /**
   * Validate file type and size before upload
   */
  static validateFile(file: File, bucket: StorageBucket): void {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError(
        'File type not supported. Use JPEG, PNG, WebP, or GIF.'
      )
    }

    const maxSize = MAX_SIZES[bucket]
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024)
      throw new ValidationError(`File must be under ${maxMB}MB`)
    }
  }

  /**
   * Compress an image file before upload
   */
  static async compressImage(
    file: File,
    options: { maxSizeMB: number; maxWidthOrHeight: number }
  ): Promise<File> {
    try {
      const compressed = await imageCompression(file, {
        ...options,
        useWebWorker: true,
        fileType: 'image/webp',
      })
      return compressed
    } catch {
      // If compression fails, return original file
      console.warn('[Storage] Image compression failed, using original')
      return file
    }
  }

  /**
   * Upload avatar image for a user
   * Compresses to max 1MB / 800px, uploads as avatar.webp (upsert)
   * Returns the public URL
   */
  static async uploadAvatar(file: File, userId: string): Promise<string> {
    this.validateFile(file, 'avatars')

    const compressed = await this.compressImage(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    })

    const path = `${userId}/avatar.webp`
    const { error } = await this.withAbortRetry(() =>
      supabase.storage.from('avatars').upload(path, compressed, {
        upsert: true,
        contentType: 'image/webp',
      })
    )

    if (error) {
      if (isAbortError(error)) throw error
      throw new AppError(
        error.message || 'Failed to upload avatar',
        'UNKNOWN_ERROR',
        500
      )
    }

    // Append cache-buster so the browser doesn't serve a stale cached image
    // (avatar always overwrites the same path via upsert)
    const url = this.getPublicUrl('avatars', path)
    return `${url}?t=${Date.now()}`
  }

  /**
   * Upload media image for an artist or venue
   * Compresses to max 2MB / 1920px, uploads with UUID filename
   * Returns the public URL
   */
  static async uploadEntityMedia(
    file: File,
    bucket: 'artist-media' | 'venue-media',
    entityId: string
  ): Promise<string> {
    this.validateFile(file, bucket)

    const compressed = await this.compressImage(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    })

    const path = `${entityId}/${crypto.randomUUID()}.webp`
    const { error } = await this.withAbortRetry(() =>
      supabase.storage.from(bucket).upload(path, compressed, {
        contentType: 'image/webp',
      })
    )

    if (error) {
      if (isAbortError(error)) throw error
      throw new AppError(
        error.message || 'Failed to upload media',
        'UNKNOWN_ERROR',
        500
      )
    }

    return this.getPublicUrl(bucket, path)
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    const { error } = await this.withAbortRetry(() =>
      supabase.storage.from(bucket).remove([path])
    )

    if (error) {
      if (isAbortError(error)) throw error
      throw new AppError(
        error.message || 'Failed to delete file',
        'UNKNOWN_ERROR',
        500
      )
    }
  }

  /**
   * Get public URL for a stored file
   */
  static getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  /**
   * Extract the storage path from a full public URL
   * Useful for deleting a file when you only have its public URL
   */
  static extractPath(publicUrl: string, bucket: StorageBucket): string | null {
    const marker = `/storage/v1/object/public/${bucket}/`
    const index = publicUrl.indexOf(marker)
    if (index === -1) return null
    return publicUrl.slice(index + marker.length)
  }
}
