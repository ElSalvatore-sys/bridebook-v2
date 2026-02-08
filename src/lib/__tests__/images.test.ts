import { describe, it, expect } from 'vitest'
import { imageSizes, getTransformedImageUrl, getAvatarUrl, getMediaUrl } from '../images'

describe('imageSizes', () => {
  it('has expected size presets', () => {
    expect(imageSizes.thumbnail).toEqual({ width: 100, height: 100 })
    expect(imageSizes.small).toEqual({ width: 300, height: 300 })
    expect(imageSizes.medium).toEqual({ width: 600, height: 600 })
    expect(imageSizes.large).toEqual({ width: 1200, height: 1200 })
  })
})

describe('getTransformedImageUrl', () => {
  it('returns URL unchanged (free tier)', () => {
    const url = 'https://example.com/image.jpg'
    expect(getTransformedImageUrl(url)).toBe(url)
    expect(getTransformedImageUrl(url, 'thumbnail')).toBe(url)
  })
})

describe('getAvatarUrl', () => {
  it('returns undefined for null', () => {
    expect(getAvatarUrl(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(getAvatarUrl(undefined)).toBeUndefined()
  })

  it('returns URL for valid string', () => {
    expect(getAvatarUrl('https://example.com/avatar.jpg')).toBe('https://example.com/avatar.jpg')
  })

  it('returns URL unchanged with size param (free tier)', () => {
    expect(getAvatarUrl('https://example.com/avatar.jpg', 'small')).toBe('https://example.com/avatar.jpg')
  })
})

describe('getMediaUrl', () => {
  it('returns URL unchanged', () => {
    expect(getMediaUrl('https://example.com/media.jpg')).toBe('https://example.com/media.jpg')
  })

  it('returns URL unchanged with size param (free tier)', () => {
    expect(getMediaUrl('https://example.com/media.jpg', 'large')).toBe('https://example.com/media.jpg')
  })
})
