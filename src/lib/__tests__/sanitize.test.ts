import { describe, it, expect } from 'vitest'
import { sanitizePlainText, sanitizeRichText } from '../sanitize'

describe('sanitizePlainText', () => {
  it('strips all HTML tags', () => {
    const input = '<p>Hello <b>world</b></p>'
    const result = sanitizePlainText(input)
    expect(result).toBe('Hello world')
  })

  it('strips script tags and content', () => {
    const input = '<script>alert("XSS")</script>Hello'
    const result = sanitizePlainText(input)
    expect(result).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(sanitizePlainText('')).toBe('')
  })

  it('handles null', () => {
    expect(sanitizePlainText(null)).toBe('')
  })

  it('handles undefined', () => {
    expect(sanitizePlainText(undefined)).toBe('')
  })

  it('preserves plain text', () => {
    const input = 'Just plain text'
    const result = sanitizePlainText(input)
    expect(result).toBe('Just plain text')
  })

  it('removes dangerous attributes', () => {
    const input = '<a href="javascript:alert()">Click</a>'
    const result = sanitizePlainText(input)
    expect(result).toBe('Click')
  })
})

describe('sanitizeRichText', () => {
  it('preserves safe HTML tags', () => {
    const input = '<b>Bold</b> and <i>italic</i>'
    const result = sanitizeRichText(input)
    expect(result).toContain('Bold')
    expect(result).toContain('italic')
    expect(result).toContain('<b>')
    expect(result).toContain('<i>')
  })

  it('strips script tags', () => {
    const input = '<script>alert("XSS")</script><b>Safe</b>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('script')
    expect(result).not.toContain('alert')
    expect(result).toContain('Safe')
  })

  it('removes dangerous href attributes', () => {
    const input = '<a href="javascript:alert()">Click</a>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('javascript:')
    expect(result).toContain('Click')
  })

  it('allows safe links with href', () => {
    const input = '<a href="https://example.com">Link</a>'
    const result = sanitizeRichText(input)
    expect(result).toContain('href="https://example.com"')
    expect(result).toContain('Link')
  })

  it('preserves paragraph and list tags', () => {
    const input = '<p>Text</p><ul><li>Item</li></ul>'
    const result = sanitizeRichText(input)
    expect(result).toContain('<p>')
    expect(result).toContain('<ul>')
    expect(result).toContain('<li>')
  })

  it('handles empty string', () => {
    expect(sanitizeRichText('')).toBe('')
  })

  it('handles null', () => {
    expect(sanitizeRichText(null)).toBe('')
  })

  it('handles undefined', () => {
    expect(sanitizeRichText(undefined)).toBe('')
  })

  it('strips data attributes', () => {
    const input = '<div data-value="test">Text</div>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('data-value')
  })
})
