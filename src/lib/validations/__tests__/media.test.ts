/**
 * Media Validation Schema Tests
 */

import { describe, it, expect } from 'vitest'
import {
  fileUploadSchema,
  avatarUploadSchema,
  mediaUploadSchema,
  createMediaRecordSchema,
} from '../media'

describe('Media Schemas', () => {
  describe('fileUploadSchema', () => {
    it('accepts valid image files', () => {
      const result = fileUploadSchema.safeParse({
        name: 'photo.jpg',
        size: 1024 * 1024,
        type: 'image/jpeg',
      })
      expect(result.success).toBe(true)
    })

    it('accepts all allowed types', () => {
      for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/gif']) {
        const result = fileUploadSchema.safeParse({
          name: 'file.ext',
          size: 1000,
          type,
        })
        expect(result.success).toBe(true)
      }
    })

    it('rejects unsupported file types', () => {
      const result = fileUploadSchema.safeParse({
        name: 'doc.pdf',
        size: 1000,
        type: 'application/pdf',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty file name', () => {
      const result = fileUploadSchema.safeParse({
        name: '',
        size: 1000,
        type: 'image/jpeg',
      })
      expect(result.success).toBe(false)
    })

    it('rejects zero size', () => {
      const result = fileUploadSchema.safeParse({
        name: 'photo.jpg',
        size: 0,
        type: 'image/jpeg',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('avatarUploadSchema', () => {
    it('accepts files under 5MB', () => {
      const result = avatarUploadSchema.safeParse({
        name: 'avatar.png',
        size: 4 * 1024 * 1024,
        type: 'image/png',
      })
      expect(result.success).toBe(true)
    })

    it('rejects files over 5MB', () => {
      const result = avatarUploadSchema.safeParse({
        name: 'avatar.png',
        size: 6 * 1024 * 1024,
        type: 'image/png',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('mediaUploadSchema', () => {
    it('accepts files under 10MB', () => {
      const result = mediaUploadSchema.safeParse({
        name: 'photo.webp',
        size: 9 * 1024 * 1024,
        type: 'image/webp',
      })
      expect(result.success).toBe(true)
    })

    it('rejects files over 10MB', () => {
      const result = mediaUploadSchema.safeParse({
        name: 'photo.webp',
        size: 11 * 1024 * 1024,
        type: 'image/webp',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createMediaRecordSchema', () => {
    it('accepts valid media record', () => {
      const result = createMediaRecordSchema.safeParse({
        url: 'https://example.com/image.webp',
        type: 'IMAGE',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sort_order).toBe(0)
        expect(result.data.is_primary).toBe(false)
      }
    })

    it('accepts full media record with all fields', () => {
      const result = createMediaRecordSchema.safeParse({
        url: 'https://example.com/image.webp',
        type: 'IMAGE',
        title: 'My photo',
        description: 'A great photo',
        sort_order: 5,
        is_primary: true,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('My photo')
        expect(result.data.sort_order).toBe(5)
        expect(result.data.is_primary).toBe(true)
      }
    })

    it('accepts VIDEO and AUDIO types', () => {
      for (const type of ['VIDEO', 'AUDIO']) {
        const result = createMediaRecordSchema.safeParse({
          url: 'https://example.com/media.mp4',
          type,
        })
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid media type', () => {
      const result = createMediaRecordSchema.safeParse({
        url: 'https://example.com/image.webp',
        type: 'DOCUMENT',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid URL', () => {
      const result = createMediaRecordSchema.safeParse({
        url: 'not-a-url',
        type: 'IMAGE',
      })
      expect(result.success).toBe(false)
    })

    it('rejects title over 200 characters', () => {
      const result = createMediaRecordSchema.safeParse({
        url: 'https://example.com/image.webp',
        type: 'IMAGE',
        title: 'x'.repeat(201),
      })
      expect(result.success).toBe(false)
    })
  })
})
