/**
 * Integration tests for sanitization in services
 * Verifies that user-generated content is properly sanitized before storage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProfileService } from '../profiles'
import { ArtistService } from '../artists'
import { VenueService } from '../venues'
import { MessagingService } from '../messaging'
import { EnquiryService } from '../enquiries'
import * as sanitize from '@/lib/sanitize'

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
          error: null,
        })
      ),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          is: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: { id: 'user-123', bio: '<b>Test</b>' },
                error: null,
              })
            ),
          })),
          single: vi.fn(() =>
            Promise.resolve({
              data: { id: 'user-123', bio: '<b>Test</b>' },
              error: null,
            })
          ),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: { id: 'user-123', bio: '<b>Test</b>' },
                error: null,
              })
            ),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: { id: 'new-123', content: 'Test' },
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}))

describe('Service Sanitization Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ProfileService', () => {
    it('sanitizes bio with rich text', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await ProfileService.update({
        bio: '<script>alert("XSS")</script><b>Hello</b>',
        first_name: 'Test',
      })

      expect(sanitizeSpy).toHaveBeenCalledWith(
        '<script>alert("XSS")</script><b>Hello</b>'
      )
    })

    it('handles undefined bio', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await ProfileService.update({
        first_name: 'Test',
      })

      // Should not call sanitize for undefined bio
      expect(sanitizeSpy).not.toHaveBeenCalled()
    })
  })

  describe('ArtistService', () => {
    it('sanitizes bio on create', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await ArtistService.create({
        stage_name: 'DJ Test',
        bio: '<p>Bio with <script>evil</script></p>',
        hourly_rate: 100,
      })

      expect(sanitizeSpy).toHaveBeenCalledWith(
        '<p>Bio with <script>evil</script></p>'
      )
    })

    it('sanitizes bio on update', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await ArtistService.update('artist-123', {
        bio: '<b>Updated</b> bio',
      })

      expect(sanitizeSpy).toHaveBeenCalledWith('<b>Updated</b> bio')
    })
  })

  describe('VenueService', () => {
    it('sanitizes description on create', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await VenueService.create({
        venue_name: 'Test Venue',
        description: '<p>Description <script>bad</script></p>',
        type: 'CLUB',
        city_id: '123e4567-e89b-12d3-a456-426614174000',
        street: '123 Test St',
        capacity_max: 100,
      })

      expect(sanitizeSpy).toHaveBeenCalledWith(
        '<p>Description <script>bad</script></p>'
      )
    })

    it('sanitizes description on update', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizeRichText')

      await VenueService.update('venue-123', {
        description: '<i>New</i> description',
      })

      expect(sanitizeSpy).toHaveBeenCalledWith('<i>New</i> description')
    })
  })

  describe('MessagingService', () => {
    it('sanitizes message content with plain text', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizePlainText')

      await MessagingService.sendMessage(
        'thread-123',
        '<b>Hello</b> <script>alert("XSS")</script>'
      )

      expect(sanitizeSpy).toHaveBeenCalledWith(
        '<b>Hello</b> <script>alert("XSS")</script>'
      )
    })
  })

  describe('EnquiryService', () => {
    it('sanitizes enquiry message with plain text', async () => {
      const sanitizeSpy = vi.spyOn(sanitize, 'sanitizePlainText')

      await EnquiryService.create({
        entity_type: 'ARTIST',
        artist_id: 'artist-123',
        enquiry_type: 'BOOKING',
        name: 'Test User',
        email: 'test@example.com',
        message: '<p>Message</p> <script>bad</script>',
      })

      expect(sanitizeSpy).toHaveBeenCalledWith(
        '<p>Message</p> <script>bad</script>'
      )
    })
  })
})
