import { describe, it, expect } from 'vitest'
import { bookingNewTemplate, bookingStatusTemplate, messageNewTemplate } from '../email-templates'

describe('bookingNewTemplate', () => {
  const baseData = {
    recipientName: 'Jane',
    requesterName: 'John Doe',
    title: 'Friday Night Set',
    eventDate: '2024-06-15',
    bookingId: 'booking-123',
  }

  it('includes requester name in subject', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.subject).toContain('John Doe')
  })

  it('includes title in HTML', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.html).toContain('Friday Night Set')
  })

  it('includes event date in HTML', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.html).toContain('2024-06-15')
  })

  it('includes time range when present', () => {
    const result = bookingNewTemplate({ ...baseData, startTime: '20:00', endTime: '23:00' })
    expect(result.html).toContain('20:00')
    expect(result.html).toContain('23:00')
  })

  it('omits time range when absent', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.html).not.toContain('Time:')
  })

  it('includes proposed rate when present', () => {
    const result = bookingNewTemplate({ ...baseData, proposedRate: '150' })
    expect(result.html).toContain('150')
  })

  it('omits rate when absent', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.html).not.toContain('Proposed rate')
  })

  it('includes List-Unsubscribe header', () => {
    const result = bookingNewTemplate(baseData)
    expect(result.headers['List-Unsubscribe']).toBeDefined()
    expect(result.headers['List-Unsubscribe']).toContain('settings')
  })
})

describe('bookingStatusTemplate', () => {
  const baseData = {
    recipientName: 'Jane',
    title: 'Friday Night Set',
    previousStatus: 'PENDING',
    newStatus: 'ACCEPTED',
    bookingId: 'booking-123',
  }

  it('includes status in subject', () => {
    const result = bookingStatusTemplate(baseData)
    expect(result.subject.toLowerCase()).toContain('accepted')
  })

  it('includes both statuses in HTML', () => {
    const result = bookingStatusTemplate(baseData)
    expect(result.html).toContain('PENDING')
    expect(result.html).toContain('ACCEPTED')
  })

  it('includes note when present', () => {
    const result = bookingStatusTemplate({ ...baseData, note: 'Looking forward to it!' })
    expect(result.html).toContain('Looking forward to it!')
  })

  it('omits note when absent', () => {
    const result = bookingStatusTemplate(baseData)
    expect(result.html).not.toContain('font-style:italic')
  })
})

describe('messageNewTemplate', () => {
  const baseData = {
    recipientName: 'Jane',
    senderName: 'John',
    messagePreview: 'Hey, are you available?',
    threadId: 'thread-123',
  }

  it('includes sender name in subject', () => {
    const result = messageNewTemplate(baseData)
    expect(result.subject).toContain('John')
  })

  it('truncates preview at 150 chars', () => {
    const longMessage = 'A'.repeat(200)
    const result = messageNewTemplate({ ...baseData, messagePreview: longMessage })
    expect(result.html).toContain('A'.repeat(150) + '...')
    expect(result.html).not.toContain('A'.repeat(151))
  })

  it('does not truncate short messages', () => {
    const result = messageNewTemplate(baseData)
    expect(result.html).toContain('Hey, are you available?')
  })
})
