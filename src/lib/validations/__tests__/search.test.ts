import { describe, it, expect } from 'vitest'
import {
  searchQuerySchema,
  searchTypeSchema,
  artistSearchFilterSchema,
  venueSearchFilterSchema,
} from '../search'

describe('searchQuerySchema', () => {
  it('accepts valid queries (2+ chars)', () => {
    expect(searchQuerySchema.parse('DJ')).toBe('DJ')
    expect(searchQuerySchema.parse('rock band')).toBe('rock band')
  })

  it('trims whitespace', () => {
    expect(searchQuerySchema.parse('  hello  ')).toBe('hello')
  })

  it('rejects queries shorter than 2 chars', () => {
    expect(() => searchQuerySchema.parse('a')).toThrow()
    expect(() => searchQuerySchema.parse('')).toThrow()
  })

  it('rejects whitespace-only strings (trimmed to empty)', () => {
    expect(() => searchQuerySchema.parse('   ')).toThrow()
  })

  it('rejects queries longer than 100 chars', () => {
    const long = 'a'.repeat(101)
    expect(() => searchQuerySchema.parse(long)).toThrow()
  })

  it('accepts exactly 100 chars', () => {
    const exact = 'a'.repeat(100)
    expect(searchQuerySchema.parse(exact)).toBe(exact)
  })
})

describe('searchTypeSchema', () => {
  it('accepts valid types', () => {
    expect(searchTypeSchema.parse('all')).toBe('all')
    expect(searchTypeSchema.parse('artists')).toBe('artists')
    expect(searchTypeSchema.parse('venues')).toBe('venues')
  })

  it('defaults to all when undefined', () => {
    expect(searchTypeSchema.parse(undefined)).toBe('all')
  })

  it('rejects invalid types', () => {
    expect(() => searchTypeSchema.parse('events')).toThrow()
  })
})

describe('artistSearchFilterSchema', () => {
  it('accepts valid filters', () => {
    const result = artistSearchFilterSchema.parse({
      genre_id: '550e8400-e29b-41d4-a716-446655440000',
      price_min: 0,
      price_max: 100,
    })
    expect(result?.genre_id).toBe('550e8400-e29b-41d4-a716-446655440000')
  })

  it('accepts empty object', () => {
    expect(artistSearchFilterSchema.parse({})).toEqual({})
  })

  it('accepts undefined (optional)', () => {
    expect(artistSearchFilterSchema.parse(undefined)).toBeUndefined()
  })

  it('rejects invalid UUID for genre_id', () => {
    expect(() =>
      artistSearchFilterSchema.parse({ genre_id: 'not-a-uuid' })
    ).toThrow()
  })

  it('rejects negative price', () => {
    expect(() =>
      artistSearchFilterSchema.parse({ price_min: -1 })
    ).toThrow()
  })

  it('allows omitting optional fields', () => {
    const result = artistSearchFilterSchema.parse({ price_min: 50 })
    expect(result).toEqual({ price_min: 50 })
  })
})

describe('venueSearchFilterSchema', () => {
  it('accepts valid filters', () => {
    const result = venueSearchFilterSchema.parse({
      venue_type: 'BAR',
      city_id: '550e8400-e29b-41d4-a716-446655440000',
      capacity_min: 50,
      capacity_max: 200,
    })
    expect(result?.venue_type).toBe('BAR')
    expect(result?.capacity_min).toBe(50)
  })

  it('accepts undefined (optional)', () => {
    expect(venueSearchFilterSchema.parse(undefined)).toBeUndefined()
  })

  it('rejects invalid UUID for city_id', () => {
    expect(() =>
      venueSearchFilterSchema.parse({ city_id: 'invalid' })
    ).toThrow()
  })

  it('rejects negative capacity', () => {
    expect(() =>
      venueSearchFilterSchema.parse({ capacity_min: -10 })
    ).toThrow()
  })

  it('rejects non-integer capacity', () => {
    expect(() =>
      venueSearchFilterSchema.parse({ capacity_min: 10.5 })
    ).toThrow()
  })
})
