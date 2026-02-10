import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Note: We test the schema validation logic directly since import.meta.env
// cannot be mocked in Vitest. The actual environment validation happens at
// app startup and is tested via integration/E2E tests.

describe('env validation schema', () => {
  const envSchema = z.object({
    VITE_SUPABASE_URL: z
      .string()
      .min(1, 'VITE_SUPABASE_URL is required')
      .url('VITE_SUPABASE_URL must be a valid URL')
      .refine(
        (url) => url.includes('supabase.co'),
        'VITE_SUPABASE_URL must be a Supabase URL (should include "supabase.co")'
      ),

    VITE_SUPABASE_ANON_KEY: z
      .string()
      .min(100, 'VITE_SUPABASE_ANON_KEY appears to be invalid (too short)')
      .min(1, 'VITE_SUPABASE_ANON_KEY is required'),

    VITE_APP_URL: z.string().url('VITE_APP_URL must be a valid URL').optional(),

    VITE_APP_NAME: z.string().optional(),

    VITE_SENTRY_DSN: z.string().url('VITE_SENTRY_DSN must be a valid URL').optional(),
  })

  it('validates correct environment', () => {
    const env = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
    }

    const result = envSchema.parse(env)
    expect(result.VITE_SUPABASE_URL).toBe('https://test.supabase.co')
    expect(result.VITE_SUPABASE_ANON_KEY).toBe('a'.repeat(100))
  })

  it('throws on missing VITE_SUPABASE_URL', () => {
    const env = {
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
    }

    expect(() => envSchema.parse(env)).toThrow('VITE_SUPABASE_URL')
  })

  it('throws on invalid URL format', () => {
    const env = {
      VITE_SUPABASE_URL: 'not-a-url',
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
    }

    expect(() => envSchema.parse(env)).toThrow('valid URL')
  })

  it('throws on non-Supabase URL', () => {
    const env = {
      VITE_SUPABASE_URL: 'https://example.com',
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
    }

    expect(() => envSchema.parse(env)).toThrow('supabase.co')
  })

  it('throws on short anon key', () => {
    const env = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'short',
    }

    expect(() => envSchema.parse(env)).toThrow('too short')
  })

  it('allows optional environment variables', () => {
    const env = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
      VITE_APP_URL: 'https://app.example.com',
      VITE_APP_NAME: 'Test App',
    }

    const result = envSchema.parse(env)
    expect(result.VITE_APP_URL).toBe('https://app.example.com')
    expect(result.VITE_APP_NAME).toBe('Test App')
  })

  it('does not throw on missing optional variables', () => {
    const env = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'a'.repeat(100),
    }

    expect(() => envSchema.parse(env)).not.toThrow()
  })
})

