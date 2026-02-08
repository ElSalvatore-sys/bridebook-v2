import { describe, it, expect } from 'vitest'
import { formatBytes, formatDate } from '../format'

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB')
  })

  it('formats kilobytes with decimals', () => {
    expect(formatBytes(1536)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB')
  })

  it('formats gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('respects custom decimals', () => {
    expect(formatBytes(1536, 2)).toBe('1.5 KB')
    expect(formatBytes(1536, 0)).toBe('2 KB')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('Jan 15, 2024')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-06-01T12:00:00Z'))
    expect(typeof result).toBe('string')
    expect(result).toContain('2024')
  })
})
