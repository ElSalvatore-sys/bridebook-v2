# ADR-001: Frontend Framework

## Status
Accepted

## Context
EA Platform needs a frontend framework to build a modern, responsive web application for artists and venues to connect and manage bookings. The application is primarily a dashboard/internal tool rather than a content site, which affects our technical requirements around SEO and server-side rendering.

## Decision
We will use **React with Vite** as our frontend framework instead of Next.js.

## Rationale

### Why React + Vite over Next.js?

1. **No SSR/SEO Requirements**: EA Platform is a dashboard application where users must be authenticated. There's no public content that needs to be indexed by search engines.

2. **Simpler Mental Model**: Pure client-side React with Vite is simpler to reason about - no hydration issues, no server/client component decisions, no edge cases around data fetching strategies.

3. **Faster Development Experience**: Vite's HMR is significantly faster than Next.js dev server, improving developer productivity.

4. **Deployment Flexibility**: A static SPA can be deployed anywhere (Vercel, Netlify, S3, any CDN) without requiring Node.js server infrastructure.

5. **Supabase Integration**: Supabase client works entirely client-side. We don't need server-side data fetching - all API calls go directly to Supabase.

6. **Bundle Size Control**: Direct control over code splitting and bundle optimization without framework abstractions.

## Consequences

### Positive
- Faster development iteration with Vite's HMR
- Simpler deployment as static files
- No server-side complexity to manage
- Direct control over routing and code splitting
- Easier debugging without server/client boundaries
- Lower hosting costs (no server runtime needed)

### Negative
- No SSR for potential future public pages (can add later if needed)
- Must handle loading states manually (no streaming SSR)
- Initial page load shows blank until JS loads
- Cannot use React Server Components

### Mitigations
- Use skeleton loaders for perceived performance
- Implement proper code splitting for faster initial load
- If SEO becomes needed, can add a separate marketing site with Next.js

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Next.js (App Router)** | SSR/SSG, built-in routing, React Server Components | Overkill for dashboard app, slower dev server, more complex | Rejected - unnecessary complexity |
| **Next.js (Pages Router)** | Mature, well-documented, flexible | Still has SSR complexity we don't need | Rejected |
| **Remix** | Great forms, progressive enhancement | Learning curve, less ecosystem | Rejected - smaller community |
| **React + Vite** | Fast DX, simple, perfect for SPAs | No SSR | **Selected** |
| **Vue + Vite** | Great DX, simpler reactivity | Team expertise is React | Rejected |

## References
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Why Not Next.js for Dashboard Apps](https://kentcdodds.com/blog/remix-the-yang-to-react-s-yin) (conceptual discussion)
