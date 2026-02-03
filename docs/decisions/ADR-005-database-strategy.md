# ADR-005: Database Strategy

## Status
Accepted

## Context
EA Platform needs a database strategy that supports:
- Multi-tenant data isolation (artists and venues are separate tenants)
- Complex relational queries (bookings, messages, availability)
- Real-time subscriptions (messaging, notifications)
- Secure data access patterns
- Future scalability

## Decision
We will use **PostgreSQL** (via Supabase) with **Row Level Security (RLS)** for multi-tenant data isolation.

## Rationale

### Why PostgreSQL?

1. **Relational Model**: Our data has clear relationships (users → profiles, profiles → bookings, bookings → messages). SQL handles this naturally.

2. **ACID Compliance**: Financial operations (future payments) and booking state changes require transactional integrity.

3. **Advanced Features**:
   - Full-text search for artist/venue discovery
   - JSON/JSONB for flexible metadata
   - Array types for tags/categories
   - PostGIS for location-based queries (future)

4. **Mature Ecosystem**: Decades of battle-testing, extensive documentation, and tooling.

### Why Row Level Security (RLS)?

1. **Security at Database Level**: Even if application code has bugs, RLS prevents unauthorized data access.

2. **Simplified Backend**: No need to write authorization checks in API endpoints - the database enforces access rules.

3. **Multi-Tenant Isolation**: Each user can only see their own data by default; explicit policies grant additional access.

4. **Audit Trail**: RLS policies are version-controlled with migrations, providing clear security audit trail.

## Consequences

### Positive
- Strong data isolation without application-level checks
- Complex queries with JOINs, aggregations, CTEs
- Real-time subscriptions via Supabase Realtime
- Type generation from schema for TypeScript
- Migrations provide reproducible database state
- Battle-tested technology with extensive tooling

### Negative
- RLS policies add complexity to database design
- Must carefully consider policy performance (indexed columns)
- Debugging RLS issues can be challenging
- Schema changes require migrations

### Mitigations
- Use `EXPLAIN ANALYZE` to verify RLS policy performance
- Create helper functions for common RLS patterns
- Comprehensive RLS policy testing in CI
- Document all policies in migration files

## Implementation Notes

### RLS Pattern Example
```sql
-- Enable RLS on table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view bookings where they are artist or venue
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (
  artist_id = auth.uid() OR
  venue_id = auth.uid()
);

-- Policy: Only artists can create booking requests
CREATE POLICY "Artists can create bookings"
ON bookings FOR INSERT
WITH CHECK (artist_id = auth.uid());
```

### Multi-Tenant Data Model
```
users (Supabase Auth)
  └── profiles (artist or venue profile)
        └── bookings (as artist or venue)
        └── messages (sent or received)
        └── availability (artist slots or venue slots)
```

### Performance Considerations
- Index columns used in RLS policies (`artist_id`, `venue_id`)
- Use `security definer` functions for complex cross-tenant operations
- Batch operations where possible to reduce RLS evaluation overhead

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **PostgreSQL + RLS** | Strong security, relational | RLS complexity | **Selected** |
| **PostgreSQL (no RLS)** | Simpler queries | Auth in app code, security risk | Rejected |
| **MongoDB** | Flexible schema, easy start | No relations, eventual consistency | Rejected |
| **Firebase Firestore** | Real-time, managed | NoSQL limits, Security Rules syntax | Rejected |
| **PlanetScale (MySQL)** | Serverless, branching | No RLS equivalent, MySQL limitations | Rejected |

## Schema Design Principles

1. **Normalize First**: Start with normalized tables, denormalize only when performance requires
2. **UUIDs for IDs**: Use UUID primary keys for security and distributed compatibility
3. **Timestamps**: Include `created_at` and `updated_at` on all tables
4. **Soft Deletes**: Use `deleted_at` timestamp instead of hard deletes for audit trail
5. **Enum Types**: Use PostgreSQL enums for status fields

## References
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Multi-Tenant Data Architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/considerations/tenancy-models)
