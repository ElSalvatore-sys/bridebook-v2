# ADR-002: Backend Service

## Status
Accepted

## Context
EA Platform requires backend services for authentication, database operations, file storage, and real-time features. We need to decide between building custom backend infrastructure or using a Backend-as-a-Service (BaaS) solution.

## Decision
We will use **Supabase** as our backend service provider.

## Rationale

### Why Supabase?

1. **All-in-One Solution**: Supabase provides Auth, Database (PostgreSQL), Storage, Edge Functions, and Realtime subscriptions in a single platform.

2. **PostgreSQL Foundation**: Unlike Firebase's NoSQL, Supabase uses PostgreSQL, giving us:
   - Relational data modeling
   - Complex queries with JOINs
   - Row Level Security (RLS) for multi-tenant security
   - Full-text search
   - JSON/JSONB support for flexible data

3. **Self-Hostable**: While we'll use Supabase Cloud initially, we can self-host later if needed for data sovereignty or cost optimization.

4. **Developer Experience**: Excellent TypeScript support, auto-generated types, and a powerful dashboard for development.

5. **Cost-Effective**: Generous free tier, predictable pricing, and no per-request costs like some serverless solutions.

6. **Real-time Built-in**: Native Postgres LISTEN/NOTIFY for real-time updates, perfect for our messaging feature.

## Consequences

### Positive
- Rapid development with managed infrastructure
- Built-in authentication with multiple providers (Google OAuth, email/password)
- Row Level Security eliminates most backend authorization code
- Real-time subscriptions for messaging and notifications
- File storage with CDN for artist/venue images
- Auto-generated TypeScript types from database schema
- Built-in connection pooling (Supavisor)

### Negative
- Vendor lock-in (mitigated by PostgreSQL standard and self-host option)
- Less control over infrastructure compared to custom backend
- Edge Functions have cold start latency
- Some advanced PostgreSQL features may not be exposed

### Mitigations
- Use standard PostgreSQL features to maintain portability
- Keep business logic in database functions or client-side where possible
- Use Edge Functions sparingly, only for webhooks and integrations

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Supabase** | All-in-one, PostgreSQL, RLS, real-time | Vendor dependency | **Selected** |
| **Firebase** | Mature, Google backing, great mobile SDKs | NoSQL limits, vendor lock-in, complex pricing | Rejected |
| **Custom Node.js API** | Full control, no vendor lock-in | More development time, infrastructure management | Rejected - MVP speed priority |
| **PlanetScale + Clerk + Uploadthing** | Best-of-breed for each | Multiple vendors, more complexity, higher cost | Rejected |
| **AWS Amplify** | AWS ecosystem, scalable | Complex, AWS learning curve | Rejected |

## References
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase vs Firebase Comparison](https://supabase.com/alternatives/supabase-vs-firebase)
