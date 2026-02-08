/**
 * Security Audit Tests
 * Automated assertions for security hardening (Phase 16)
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ========== 1. No Sensitive Env Vars Leaked ==========

describe('Environment Variable Security', () => {
  it('no VITE_ env vars contain sensitive patterns', () => {
    const sensitivePatterns = ['service_role', 'secret', 'password', 'private_key']
    const viteEnvVars = Object.keys(import.meta.env).filter((key) =>
      key.startsWith('VITE_')
    )

    for (const key of viteEnvVars) {
      const lowerKey = key.toLowerCase()
      for (const pattern of sensitivePatterns) {
        expect(lowerKey).not.toContain(pattern)
      }
    }
  })
})

// ========== 2. vercel.json Security Headers ==========

describe('Security Headers (vercel.json)', () => {
  const vercelJsonPath = resolve(__dirname, '../../../vercel.json')
  let vercelConfig: { headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }> }

  it('vercel.json exists and is valid JSON', () => {
    const content = readFileSync(vercelJsonPath, 'utf-8')
    vercelConfig = JSON.parse(content)
    expect(vercelConfig).toBeDefined()
    expect(vercelConfig.headers).toBeDefined()
  })

  it('contains all required security headers', () => {
    const content = readFileSync(vercelJsonPath, 'utf-8')
    vercelConfig = JSON.parse(content)

    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Strict-Transport-Security',
      'X-DNS-Prefetch-Control',
    ]

    const catchAllRoute = vercelConfig.headers.find((h) => h.source === '/(.*)')
    expect(catchAllRoute).toBeDefined()

    const headerKeys = catchAllRoute!.headers.map((h) => h.key)

    for (const required of requiredHeaders) {
      expect(headerKeys).toContain(required)
    }
  })

  it('CSP blocks frame embedding', () => {
    const content = readFileSync(vercelJsonPath, 'utf-8')
    vercelConfig = JSON.parse(content)

    const catchAllRoute = vercelConfig.headers.find((h) => h.source === '/(.*)')
    const csp = catchAllRoute!.headers.find((h) => h.key === 'Content-Security-Policy')
    expect(csp).toBeDefined()
    expect(csp!.value).toContain("frame-ancestors 'none'")
  })

  it('HSTS is at least 1 year', () => {
    const content = readFileSync(vercelJsonPath, 'utf-8')
    vercelConfig = JSON.parse(content)

    const catchAllRoute = vercelConfig.headers.find((h) => h.source === '/(.*)')
    const hsts = catchAllRoute!.headers.find((h) => h.key === 'Strict-Transport-Security')
    expect(hsts).toBeDefined()
    expect(hsts!.value).toContain('max-age=31536000')
  })
})

// ========== 3. Zod Validation Schemas Exist ==========

describe('Zod Validation Schema Coverage', () => {
  it('auth schemas are exported', async () => {
    const mod = await import('../validations/auth')
    expect(mod.loginSchema).toBeDefined()
    expect(mod.signupSchema).toBeDefined()
    expect(mod.resetPasswordSchema).toBeDefined()
  })

  it('profile schema is exported', async () => {
    const mod = await import('../validations/profile')
    expect(mod.updateProfileSchema).toBeDefined()
  })

  it('artist schemas are exported', async () => {
    const mod = await import('../validations/artist')
    expect(mod.createArtistSchema).toBeDefined()
    expect(mod.updateArtistSchema).toBeDefined()
  })

  it('venue schemas are exported', async () => {
    const mod = await import('../validations/venue')
    expect(mod.createVenueSchema).toBeDefined()
    expect(mod.updateVenueSchema).toBeDefined()
  })

  it('booking/vendor schemas are exported', async () => {
    const mod = await import('../validations/vendor')
    expect(mod.createBookingRequestSchema).toBeDefined()
  })

  it('messaging schema is exported', async () => {
    const mod = await import('../validations/messaging')
    expect(mod.sendMessageSchema).toBeDefined()
  })

  it('media schemas are exported', async () => {
    const mod = await import('../validations/media')
    expect(mod.fileUploadSchema).toBeDefined()
    expect(mod.mediaUploadSchema).toBeDefined()
  })

  it('email preferences schema is exported', async () => {
    const mod = await import('../validations/email')
    expect(mod.emailPreferencesSchema).toBeDefined()
  })

  it('search schemas are exported', async () => {
    const mod = await import('../validations/search')
    expect(mod.searchQuerySchema).toBeDefined()
  })

  it('event schemas are exported', async () => {
    const mod = await import('../validations/event')
    expect(mod.createEventSchema).toBeDefined()
    expect(mod.updateEventSchema).toBeDefined()
  })

  it('planning schemas are exported', async () => {
    const mod = await import('../validations/planning')
    expect(mod.createTaskSchema).toBeDefined()
    expect(mod.createGuestSchema).toBeDefined()
    expect(mod.createBudgetItemSchema).toBeDefined()
  })

  it('barrel export re-exports all schema modules', async () => {
    const barrel = await import('../validations/index')
    // Spot-check key schemas from each module
    expect(barrel.loginSchema).toBeDefined()
    expect(barrel.updateProfileSchema).toBeDefined()
    expect(barrel.createArtistSchema).toBeDefined()
    expect(barrel.createVenueSchema).toBeDefined()
    expect(barrel.createBookingRequestSchema).toBeDefined()
    expect(barrel.sendMessageSchema).toBeDefined()
    expect(barrel.fileUploadSchema).toBeDefined()
    expect(barrel.emailPreferencesSchema).toBeDefined()
    expect(barrel.searchQuerySchema).toBeDefined()
    expect(barrel.createEventSchema).toBeDefined()
    expect(barrel.createTaskSchema).toBeDefined()
  })
})
