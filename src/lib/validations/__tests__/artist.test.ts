/**
 * Artist validation schemas tests
 * Comprehensive tests for artist profile creation and updates
 */

import { describe, it, expect } from 'vitest'
import {
  createArtistSchema,
  updateArtistSchema,
} from '../artist'

describe('Artist Validation Schemas', () => {
  describe('createArtistSchema', () => {
    it('accepts valid artist with required field only', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'DJ Shadow',
      })
      expect(result.success).toBe(true)
    })

    it('accepts artist with all fields', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'DJ Shadow',
        bio: 'Electronic music producer and DJ with 15 years of experience',
        years_experience: 15,
        hourly_rate: 150,
        has_equipment: true,
        is_public: true,
        website: 'https://djshadow.com',
        instagram: '@djshadow',
        spotify: 'spotify:artist:123456',
        soundcloud: 'https://soundcloud.com/djshadow',
      })
      expect(result.success).toBe(true)
    })

    it('accepts null for optional fields', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        bio: null,
        years_experience: null,
        hourly_rate: null,
        website: null,
        instagram: null,
        spotify: null,
        soundcloud: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts undefined for optional fields', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
      })
      expect(result.success).toBe(true)
    })

    it('accepts stage_name with 2 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'DJ',
      })
      expect(result.success).toBe(true)
    })

    it('accepts stage_name up to 100 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'a'.repeat(100),
      })
      expect(result.success).toBe(true)
    })

    it('accepts bio up to 1000 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        bio: 'a'.repeat(1000),
      })
      expect(result.success).toBe(true)
    })

    it('accepts years_experience of 0', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Beginner Artist',
        years_experience: 0,
      })
      expect(result.success).toBe(true)
    })

    it('accepts large years_experience values', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Veteran Artist',
        years_experience: 50,
      })
      expect(result.success).toBe(true)
    })

    it('accepts hourly_rate of 0', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Free Artist',
        hourly_rate: 0,
      })
      expect(result.success).toBe(true)
    })

    it('accepts decimal hourly_rate', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        hourly_rate: 125.50,
      })
      expect(result.success).toBe(true)
    })

    it('accepts has_equipment as true or false', () => {
      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          has_equipment: true,
        }).success
      ).toBe(true)

      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          has_equipment: false,
        }).success
      ).toBe(true)
    })

    it('accepts is_public as true or false', () => {
      expect(
        createArtistSchema.safeParse({
          stage_name: 'Public Artist',
          is_public: true,
        }).success
      ).toBe(true)

      expect(
        createArtistSchema.safeParse({
          stage_name: 'Private Artist',
          is_public: false,
        }).success
      ).toBe(true)
    })

    it('accepts valid website URLs', () => {
      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          website: 'https://example.com',
        }).success
      ).toBe(true)

      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          website: 'http://artist.com/portfolio',
        }).success
      ).toBe(true)
    })

    it('accepts instagram handles', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        instagram: '@artist_official',
      })
      expect(result.success).toBe(true)
    })

    it('accepts spotify URIs and URLs', () => {
      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          spotify: 'spotify:artist:1234567890',
        }).success
      ).toBe(true)

      expect(
        createArtistSchema.safeParse({
          stage_name: 'Artist',
          spotify: 'https://open.spotify.com/artist/abc123',
        }).success
      ).toBe(true)
    })

    it('accepts soundcloud URLs', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        soundcloud: 'https://soundcloud.com/artist-name',
      })
      expect(result.success).toBe(true)
    })

    it('rejects stage_name under 2 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'A',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Stage name must be at least 2 characters')
      }
    })

    it('rejects stage_name over 100 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Stage name must be 100 characters or less')
      }
    })

    it('rejects bio over 1000 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        bio: 'a'.repeat(1001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Bio must be 1000 characters or less')
      }
    })

    it('rejects negative years_experience', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        years_experience: -1,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Years must be 0 or greater')
      }
    })

    it('rejects non-integer years_experience', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        years_experience: 5.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative hourly_rate', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        hourly_rate: -50,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Rate must be 0 or greater')
      }
    })

    it('rejects invalid website URL', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        website: 'not-a-url',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid URL')
      }
    })

    it('rejects instagram over 100 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        instagram: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects spotify over 200 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        spotify: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
    })

    it('rejects soundcloud over 200 characters', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'Artist',
        soundcloud: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateArtistSchema', () => {
    it('allows partial updates', () => {
      const result = updateArtistSchema.safeParse({
        stage_name: 'Updated Stage Name',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only bio', () => {
      const result = updateArtistSchema.safeParse({
        bio: 'Updated bio',
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only rates and experience', () => {
      const result = updateArtistSchema.safeParse({
        years_experience: 10,
        hourly_rate: 200,
      })
      expect(result.success).toBe(true)
    })

    it('allows updating only social media links', () => {
      const result = updateArtistSchema.safeParse({
        instagram: '@newhandle',
        spotify: 'spotify:artist:newid',
        soundcloud: 'https://soundcloud.com/newprofile',
      })
      expect(result.success).toBe(true)
    })

    it('allows empty update object', () => {
      const result = updateArtistSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('still validates constraints on updated fields', () => {
      const result = updateArtistSchema.safeParse({
        stage_name: 'A', // Too short
      })
      expect(result.success).toBe(false)
    })

    it('still validates negative values', () => {
      expect(
        updateArtistSchema.safeParse({
          hourly_rate: -100,
        }).success
      ).toBe(false)

      expect(
        updateArtistSchema.safeParse({
          years_experience: -5,
        }).success
      ).toBe(false)
    })
  })
})
