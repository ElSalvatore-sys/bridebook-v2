/**
 * Input sanitization utilities using DOMPurify
 * Provides XSS protection for user-generated content
 */

import DOMPurify from 'dompurify'

/**
 * Allowed HTML tags for rich text content (bios, descriptions)
 */
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li']

/**
 * Allowed HTML attributes for rich text content
 */
const ALLOWED_ATTR = ['href', 'target', 'rel']

/**
 * Sanitize plain text by stripping ALL HTML
 * Use for messages, enquiries, and other plain-text fields
 *
 * @param dirty - Potentially unsafe user input
 * @returns Sanitized plain text with all HTML removed
 *
 * @example
 * sanitizePlainText('<script>alert("XSS")</script>Hello')
 * // Returns: 'Hello'
 */
export function sanitizePlainText(dirty: string | null | undefined): string {
  if (!dirty) return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep text content
  })
}

/**
 * Sanitize rich text by allowing safe HTML tags
 * Use for profile bios, artist bios, venue descriptions
 *
 * @param dirty - Potentially unsafe user input with HTML
 * @returns Sanitized HTML with only safe tags preserved
 *
 * @example
 * sanitizeRichText('<script>alert("XSS")</script><b>Hello</b>')
 * // Returns: '<b>Hello</b>'
 *
 * sanitizeRichText('<a href="javascript:alert()">Click</a>')
 * // Returns: '<a>Click</a>' (dangerous href removed)
 */
export function sanitizeRichText(dirty: string | null | undefined): string {
  if (!dirty) return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false, // Prevent data-* attributes
    ALLOW_UNKNOWN_PROTOCOLS: false, // Block javascript:, data:, etc.
  })
}
