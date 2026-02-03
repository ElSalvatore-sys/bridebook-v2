# ADR-004: Authentication

## Status
Accepted

## Context
EA Platform requires user authentication to identify artists and venues, secure API access, and enable personalized experiences. We need to decide on an authentication strategy that is secure, user-friendly, and integrates well with our backend choice (Supabase).

## Decision
We will use **Supabase Auth** with **Google OAuth** as the primary sign-in method, with email/password as a fallback option.

## Rationale

### Why Supabase Auth?

1. **Native Integration**: Supabase Auth integrates seamlessly with Supabase Database and RLS policies. The `auth.uid()` function in RLS policies directly references the authenticated user.

2. **Managed Security**: Handles password hashing, JWT token management, refresh token rotation, and session management securely.

3. **Multiple Providers**: Supports Google, Apple, Facebook, and other OAuth providers with minimal configuration.

4. **Email Verification**: Built-in email verification, password reset, and magic link flows.

5. **Row Level Security**: Auth state is automatically available in PostgreSQL RLS policies without additional backend code.

### Why Google OAuth as Primary?

1. **Reduced Friction**: Users don't need to create/remember another password.

2. **Trust Signal**: Google's security reputation provides user confidence.

3. **Professional Context**: Artists and venues often use Google Workspace for business.

4. **Verified Emails**: Google accounts have verified email addresses, reducing spam/fraud.

## Consequences

### Positive
- Zero custom authentication code needed
- Secure by default (industry-standard implementation)
- Seamless RLS integration via `auth.uid()`
- Built-in session management and token refresh
- Professional OAuth flow increases trust
- Email verification handled automatically

### Negative
- Depends on Supabase service availability
- Limited customization of auth UI (must use their components or build custom)
- Google OAuth requires Google Cloud Console setup
- Some users may prefer not to use Google

### Mitigations
- Implement email/password as fallback for users who don't want OAuth
- Use Supabase's custom SMTP for branded emails
- Build custom auth UI with shadcn/ui for consistent branding
- Consider adding Apple Sign-In for iOS users in future

## Implementation Notes

### Auth Flow
```
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. Google redirects back with authorization code
4. Supabase exchanges code for tokens
5. User session created, JWT stored in httpOnly cookie
6. Client receives session, user data available
```

### RLS Policy Example
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

### Client-Side Usage
```typescript
// Sign in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Supabase Auth** | Native RLS integration, managed | Vendor lock-in | **Selected** |
| **Auth0** | Feature-rich, enterprise ready | Additional cost, separate service | Rejected - overkill |
| **Clerk** | Great DX, beautiful UI | Another vendor, no RLS integration | Rejected |
| **NextAuth.js** | Flexible, many providers | Not using Next.js, more setup | Rejected |
| **Custom JWT** | Full control | Security risk, development time | Rejected |

## Security Considerations

- Enable RLS on all tables
- Use `auth.uid()` in all user-specific policies
- Implement proper CORS configuration
- Store sensitive operations in Edge Functions
- Regular security audits of RLS policies

## References
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [OAuth 2.0 Security Best Practices](https://oauth.net/2/security-best-practices/)
- [Row Level Security with Auth](https://supabase.com/docs/guides/auth/row-level-security)
