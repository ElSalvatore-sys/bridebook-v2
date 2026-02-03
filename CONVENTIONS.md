# Coding Conventions

> Established conventions for EA Platform development. Follow these strictly to maintain consistency.

## Database Naming

| Element | Convention | Example |
|---------|------------|---------|
| Tables | Plural, snake_case | `booking_requests`, `artist_profiles` |
| Columns | Singular, snake_case | `first_name`, `created_at`, `is_verified` |
| Primary Keys | `id` (UUID) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign Keys | `{table_singular}_id` | `artist_id`, `venue_id` |
| Timestamps | `created_at`, `updated_at` | Always include both |
| Soft Delete | `deleted_at` | `TIMESTAMPTZ NULL` |
| Boolean | `is_` or `has_` prefix | `is_active`, `has_verified_email` |
| Enums | UPPERCASE | `'PENDING'`, `'CONFIRMED'`, `'CANCELLED'` |

### Language Rule

**ALL database columns MUST be in English.** No German column names.

```sql
-- CORRECT
CREATE TABLE artists (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    stage_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WRONG (German columns)
CREATE TABLE kuenstler (
    id UUID PRIMARY KEY,
    vorname TEXT NOT NULL,
    kuenstlername TEXT,
    erstellt_am TIMESTAMPTZ DEFAULT NOW()
);
```

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| TypeScript files | kebab-case | `user-profile.tsx`, `booking-request.ts` |
| React components | PascalCase export, kebab-case file | `artist-card.tsx` → `export function ArtistCard` |
| API routes | kebab-case | `api/booking-requests/route.ts` |
| Test files | `.test.ts` or `.spec.ts` suffix | `user-profile.test.ts` |
| CSS modules | `.module.css` suffix | `button.module.css` |
| Config files | kebab-case or standard name | `tailwind.config.ts`, `next.config.js` |

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related routes (grouped)
│   ├── (dashboard)/       # Dashboard routes (grouped)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Primitive UI components
│   ├── forms/             # Form-specific components
│   └── layouts/           # Layout components
├── lib/
│   ├── supabase/          # Supabase client and helpers
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## Code Style

### TypeScript

- **Strict mode enabled** - No `any` types
- **Explicit return types** for functions
- **Interface over Type** for object shapes (unless union needed)
- **Prefer const** over let

```typescript
// CORRECT
interface Artist {
  id: string;
  firstName: string;
  stageName: string | null;
}

function getArtist(id: string): Promise<Artist | null> {
  // ...
}

// WRONG
type Artist = {
  id: any;
  firstName: string;
}

function getArtist(id) {
  // ...
}
```

### React Components

- **Function components only** - No class components
- **Named exports** - No default exports (except pages)
- **Props interface** - Suffix with `Props`

```typescript
// CORRECT
interface ArtistCardProps {
  artist: Artist;
  onSelect?: (id: string) => void;
}

export function ArtistCard({ artist, onSelect }: ArtistCardProps) {
  return (/* ... */);
}

// WRONG
export default class ArtistCard extends React.Component {
  // ...
}
```

## Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, etc. |

**Examples:**

```bash
feat(auth): add Google OAuth login
fix(search): correct pagination offset calculation
docs(readme): update getting started section
chore(deps): upgrade next.js to 14.1
```

### Branch Naming

```
<type>/<ticket-id>-<short-description>
```

Examples:
- `feat/EA-123-artist-profile`
- `fix/EA-456-search-filter-bug`
- `chore/update-dependencies`

## API Conventions

### Endpoints

- **RESTful naming** - Resources as nouns, plural
- **kebab-case** for multi-word resources
- **Versioning** - `/api/v1/` prefix

```
GET    /api/v1/artists           # List artists
POST   /api/v1/artists           # Create artist
GET    /api/v1/artists/:id       # Get single artist
PATCH  /api/v1/artists/:id       # Update artist
DELETE /api/v1/artists/:id       # Delete artist

GET    /api/v1/booking-requests  # List booking requests
POST   /api/v1/booking-requests  # Create booking request
```

### Response Format

```typescript
// Success
{
  "data": { /* resource */ },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { "field": "email" }
  }
}
```

## Environment Variables

- **SCREAMING_SNAKE_CASE**
- **Prefixed by scope**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# External Services
GOOGLE_MAPS_API_KEY=xxx
RESEND_API_KEY=xxx
SENTRY_DSN=xxx

# Feature Flags
FF_HOMEPAGE_BUILDER=false
FF_REVIEWS=false
```

## Testing Conventions

- **File location** - Co-located with source or in `__tests__`
- **Naming** - `{filename}.test.ts`
- **Structure** - Arrange-Act-Assert pattern

```typescript
describe('ArtistCard', () => {
  it('renders artist name correctly', () => {
    // Arrange
    const artist = { id: '1', firstName: 'Max', stageName: 'DJ Max' };

    // Act
    render(<ArtistCard artist={artist} />);

    // Assert
    expect(screen.getByText('DJ Max')).toBeInTheDocument();
  });
});
```

---

**Last Updated:** 2026-02-03
