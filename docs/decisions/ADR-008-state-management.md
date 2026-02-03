# ADR-008: State Management

## Status
Accepted

## Context
EA Platform needs a state management strategy that handles:
- Server state (data from Supabase: profiles, bookings, messages)
- Client state (UI state: modals, forms, filters)
- Optimistic updates (for responsive UX)
- Caching and revalidation (for performance)

## Decision
We will use **TanStack Query** (React Query) for server state and **Zustand** for client state.

## Rationale

### Why TanStack Query for Server State?

1. **Built for Server State**: Designed specifically for fetching, caching, and synchronizing server data.

2. **Automatic Caching**: Intelligent caching with configurable stale time and cache time.

3. **Background Refetching**: Keeps data fresh without blocking the UI.

4. **Optimistic Updates**: Built-in support for optimistic mutations with rollback.

5. **DevTools**: Excellent devtools for debugging cache state.

6. **Supabase Integration**: Works perfectly with Supabase's async client methods.

### Why Zustand for Client State?

1. **Simple API**: Minimal boilerplate compared to Redux.

2. **No Providers**: Works outside React component tree.

3. **TypeScript First**: Excellent TypeScript support.

4. **Selective Subscriptions**: Components only re-render when their slice changes.

5. **Middleware**: Built-in persist, devtools, and immer middleware.

### Separation of Concerns

```
┌─────────────────────────────────────────┐
│              Component                   │
├─────────────────┬───────────────────────┤
│  TanStack Query │       Zustand         │
│  (Server State) │    (Client State)     │
├─────────────────┼───────────────────────┤
│  • User profile │  • Modal open/close   │
│  • Bookings     │  • Active filters     │
│  • Messages     │  • UI preferences     │
│  • Search results│ • Form draft data    │
└─────────────────┴───────────────────────┘
```

## Consequences

### Positive
- Clear separation between server and client state
- Automatic cache management and invalidation
- Reduced boilerplate compared to Redux
- Optimistic updates improve perceived performance
- Background refetching keeps data fresh
- Excellent developer experience and debugging

### Negative
- Two libraries to learn (though both are simple)
- Must decide which state goes where
- Cache invalidation requires careful thought
- Potential for over-fetching if not configured properly

### Mitigations
- Document state ownership guidelines
- Create custom hooks to encapsulate query logic
- Use query key factory pattern for consistent cache keys
- Set appropriate stale times based on data volatility

## Implementation Notes

### TanStack Query Setup
```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Query Key Factory
```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  bookings: {
    all: ['bookings'] as const,
    list: (filters: BookingFilters) => [...queryKeys.bookings.all, filters] as const,
    detail: (id: string) => [...queryKeys.bookings.all, id] as const,
  },
  // ... other entities
}
```

### Custom Query Hook
```typescript
// src/hooks/use-bookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'

export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .match(filters)
      if (error) throw error
      return data
    },
  })
}
```

### Zustand Store
```typescript
// src/stores/ui-store.ts
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activeFilters: Record<string, string>
  toggleSidebar: () => void
  setFilter: (key: string, value: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeFilters: {},
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value }
    })),
}))
```

## State Ownership Guidelines

| Data Type | Manager | Example |
|-----------|---------|---------|
| User profile | TanStack Query | Profile data, settings |
| Bookings | TanStack Query | Booking list, details |
| Messages | TanStack Query | Message threads |
| Search results | TanStack Query | Artist/venue search |
| Modal state | Zustand | Open/close modals |
| Form drafts | Zustand | Unsaved form data |
| UI preferences | Zustand | Sidebar, theme |
| Active filters | Zustand | Search/list filters |

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **TanStack Query + Zustand** | Best of both worlds | Two libraries | **Selected** |
| **Redux Toolkit + RTK Query** | All-in-one, mature | More boilerplate | Rejected |
| **Jotai** | Atomic, simple | Less structure for server state | Rejected |
| **TanStack Query only** | Single library | Client state awkward | Rejected |
| **Context + useReducer** | Built-in React | No caching, more code | Rejected |

## References
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
