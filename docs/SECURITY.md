# Security Architecture

This document outlines the security measures implemented in bloghead-v2 to protect user data, prevent common attacks, and ensure GDPR compliance.

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [Database Security](#database-security)
4. [Security Headers](#security-headers)
5. [Rate Limiting](#rate-limiting)
6. [Error Handling](#error-handling)
7. [Dependency Security](#dependency-security)
8. [Testing Security Measures](#testing-security-measures)
9. [Incident Response](#incident-response)
10. [GDPR Compliance](#gdpr-compliance)
11. [Pre-Launch Security Checklist](#pre-launch-security-checklist)

---

## Authentication & Authorization

### Implementation

**Provider:** Supabase Auth (industry-standard authentication)

**Features:**
- Email/password authentication with secure password hashing (bcrypt)
- OAuth 2.0 with Google Sign-In
- Email verification for new accounts
- Password reset via secure email links
- Session management with JWT tokens
- Automatic token refresh

**Authorization:**
- Role-based access control (RBAC): `USER`, `ARTIST`, `VENUE_OWNER`, `ADMIN`
- Protected routes enforced via `ProtectedRoute` component
- Role-specific guards for sensitive actions
- Server-side authorization via Row Level Security (RLS)

**Files:**
- `src/context/AuthContext.tsx` — Auth state management
- `src/components/layout/ProtectedRoute.tsx` — Route guards
- `src/hooks/queries/use-auth.ts` — Auth query hooks

### Best Practices

✅ **What We Do:**
- Store tokens in httpOnly cookies (managed by Supabase)
- Enforce email verification before full access
- Implement role-based guards on sensitive actions
- Use secure password reset flows
- Rate limit authentication attempts

❌ **What We Avoid:**
- Storing sensitive data in localStorage (only session tokens)
- Allowing weak passwords (min 8 chars enforced)
- Exposing user IDs in URLs for sensitive operations

---

## Input Validation & Sanitization

### Two-Layer Defense

**Layer 1: Schema Validation (Zod)**
- All user input validated against strict Zod schemas
- Type safety enforced at compile time (TypeScript)
- Business logic validation (e.g., future dates for bookings)

**Layer 2: XSS Sanitization (DOMPurify)**
- User-generated content sanitized **before storage**
- Two modes:
  - `sanitizePlainText()` — Strips ALL HTML (messages, enquiries)
  - `sanitizeRichText()` — Allows safe HTML (bios, descriptions)

**Files:**
- `src/lib/validations.ts` — Zod schemas
- `src/lib/sanitize.ts` — DOMPurify wrapper
- `src/services/*.ts` — Service layer applies sanitization

### Sanitization Rules

| Field Type | Sanitization | Allowed Tags |
|------------|--------------|--------------|
| Profile Bio | `sanitizeRichText()` | `<b>`, `<i>`, `<em>`, `<strong>`, `<a>`, `<p>`, `<br>`, `<ul>`, `<ol>`, `<li>` |
| Artist Bio | `sanitizeRichText()` | Same as above |
| Venue Description | `sanitizeRichText()` | Same as above |
| Messages | `sanitizePlainText()` | None (strip all HTML) |
| Enquiries | `sanitizePlainText()` | None (strip all HTML) |

**Example:**
```typescript
// Input: '<script>alert("XSS")</script><b>Hello</b>'
sanitizeRichText(input) // Output: '<b>Hello</b>'
sanitizePlainText(input) // Output: 'Hello'
```

---

## Database Security

### Row Level Security (RLS)

**All tables protected by RLS policies:**

1. **Profiles** — Users can only view/edit own profile
2. **Artists** — Public read, owner-only write/delete
3. **Venues** — Public read, owner-only write/delete
4. **Bookings** — Users see own bookings, artists/venues see related bookings
5. **Messages** — Only participants can read/write
6. **Enquiries** — Sender and recipient only
7. **Reviews** — Public read, verified bookings can write
8. **Analytics** — Admin-only access

**Files:**
- `supabase/migrations/002_rls_policies.sql` — RLS policy definitions

### SQL Injection Prevention

✅ **What We Do:**
- Use Supabase query builder (parameterized queries)
- Never concatenate user input into SQL strings
- Type-safe database operations via TypeScript

**Example:**
```typescript
// ✅ Safe (parameterized)
await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)

// ❌ Unsafe (SQL injection risk)
await supabase.rpc('custom_sql', { query: `SELECT * FROM profiles WHERE id = '${userId}'` })
```

---

## Security Headers

### Vercel Configuration

**File:** `vercel.json`

**Headers Enforced:**

```json
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
}
```

**Protection Against:**
- Clickjacking (X-Frame-Options, CSP frame-ancestors)
- MIME sniffing (X-Content-Type-Options)
- XSS (Content-Security-Policy)
- Man-in-the-middle (HSTS)
- Unwanted browser features (Permissions-Policy)

---

## Rate Limiting

### Client-Side Rate Limiting

**Implementation:** Sliding window algorithm with Map-based storage

**Files:**
- `src/lib/rate-limit.ts` — Rate limit utility
- Applied in auth pages and messaging components

**Limits:**

| Action | Max Attempts | Window | Block Duration |
|--------|--------------|--------|----------------|
| Login | 5 | 15 min | 15 min |
| Signup | 5 | 15 min | 15 min |
| Password Reset | 3 | 1 hour | 1 hour |
| Message Send | 10 | 1 min | — |
| Enquiry Send | 3 | 5 min | — |

**Example:**
```typescript
const rateLimit = checkRateLimit('login', RATE_LIMITS.AUTH)
if (!rateLimit.allowed) {
  toast.error(`Too many attempts. Try again in ${rateLimit.retryAfter}s`)
  return
}
```

### Server-Side Rate Limiting

**Handled by Supabase:**
- API request rate limits (per project tier)
- Database query rate limits
- Authentication attempt limits

**Note:** Client-side rate limiting provides UX feedback and reduces unnecessary API calls. Server-side limits are the ultimate enforcement layer.

---

## Error Handling

### Security-First Error Messages

**Files:**
- `src/lib/errors.ts` — Custom error classes
- `src/services/*.ts` — Service layer error handling

**Principles:**
1. **Never expose sensitive information** in error messages
2. **Log detailed errors server-side** (Sentry)
3. **Show generic messages to users** ("An error occurred")
4. **Provide actionable guidance** when safe

**Example:**
```typescript
// ❌ Bad (exposes DB structure)
throw new Error(`User with ID ${userId} not found in profiles table`)

// ✅ Good (generic)
throw new NotFoundError('Profile not found')
```

**Error Classes:**
- `NotFoundError` — Resource not found (404)
- `UnauthorizedError` — Auth required (401)
- `ForbiddenError` — Insufficient permissions (403)
- `ValidationError` — Invalid input (400)
- `ConflictError` — Resource conflict (409)

---

## Dependency Security

### Automated Scanning

**Tools:**
- `npm audit` — Scans for known vulnerabilities
- Dependabot (GitHub) — Automated security updates
- Snyk (optional) — Continuous monitoring

**Best Practices:**
✅ Update dependencies regularly
✅ Review security advisories
✅ Audit new dependencies before adding
✅ Pin major versions in production

**Commands:**
```bash
# Check for vulnerabilities
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# Update dependencies
npm update
```

---

## Testing Security Measures

### Test Coverage

**Files:**
- `src/lib/__tests__/sanitize.test.ts` — XSS protection tests
- `src/lib/__tests__/rate-limit.test.ts` — Rate limiting tests
- `src/lib/__tests__/env.test.ts` — Environment validation tests
- `src/services/__tests__/sanitization.test.ts` — Integration tests

**Coverage Requirements:**
- Line: 80%
- Branch: 70%
- Function: 75%
- Statement: 80%

**Security Test Cases:**
1. XSS vector injection (script tags, event handlers, javascript: URLs)
2. Rate limit enforcement (brute-force prevention)
3. RLS policy enforcement (unauthorized access attempts)
4. Input validation bypasses
5. Authentication state tampering

**Run Tests:**
```bash
npm run test
npm run test:coverage
npm run test:e2e
```

---

## Incident Response

### Security Incident Procedure

1. **Detect** — Monitor logs (Sentry), user reports, automated scans
2. **Assess** — Determine severity and scope
3. **Contain** — Isolate affected systems
4. **Remediate** — Fix vulnerability, deploy patch
5. **Notify** — Inform affected users (GDPR requirement if data breach)
6. **Review** — Post-mortem, update documentation

### Reporting Security Issues

**Email:** security@bloghead.app
**Response Time:** Within 24 hours

**Include:**
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

---

## GDPR Compliance

### Data Protection Measures

✅ **Implemented:**
- User consent for data processing (signup flow)
- Right to access (profile page)
- Right to rectification (profile edit)
- Right to erasure (account deletion → soft delete)
- Data minimization (only collect necessary data)
- Data encryption (HTTPS, database encryption at rest)
- Privacy policy disclosure

**Files:**
- `src/pages/legal/PrivacyPolicyPage.tsx` — Privacy policy
- `src/pages/legal/TermsPage.tsx` — Terms of service
- `src/services/profiles.ts` — Soft delete implementation

### Cookie Policy

**Essential Cookies Only:**
- `supabase.auth.token` — Session management (httpOnly)
- `vercel-analytics` — Performance monitoring (anonymous)

**No Tracking Cookies** — No third-party advertising or tracking

---

## Pre-Launch Security Checklist

### Phase 16: Security Hardening ✅

- [x] Input sanitization (DOMPurify)
- [x] Client-side rate limiting
- [x] Environment variable validation
- [x] Security documentation
- [x] Test coverage (25+ security tests)

### Pre-Production (Phase 26)

- [ ] Penetration testing
- [ ] Vulnerability scan
- [ ] Security audit
- [ ] Incident response plan
- [ ] Backup and recovery tested
- [ ] SSL/TLS certificate configured
- [ ] Security headers verified
- [ ] GDPR compliance review
- [ ] Privacy policy updated
- [ ] Terms of service finalized

### Ongoing

- [ ] Regular dependency updates
- [ ] Quarterly security reviews
- [ ] User security training (staff)
- [ ] Monitoring and alerting
- [ ] Backup verification

---

## Security Contact

**Maintainer:** Ali (EA Solutions)
**Email:** security@bloghead.app
**Response SLA:** 24 hours

---

**Last Updated:** Phase 16 (February 2026)
**Next Review:** Phase 26 (Pre-Production)
