# ADR-007: Testing Strategy

## Status
Accepted

## Context
EA Platform requires a testing strategy that ensures code quality, prevents regressions, and maintains confidence during rapid development. We need to balance comprehensive coverage with development velocity.

## Decision
We will use **Vitest** for unit/integration tests and **Playwright** for end-to-end tests, following a testing pyramid approach.

## Rationale

### Why Vitest for Unit/Integration Tests?

1. **Vite Native**: Vitest shares Vite's config and transformation pipeline, ensuring tests match production behavior.

2. **Fast Execution**: Vitest is significantly faster than Jest due to native ESM support and smart watch mode.

3. **Jest-Compatible API**: Familiar API for developers coming from Jest.

4. **Built-in Coverage**: Istanbul and c8 coverage built-in.

5. **TypeScript First**: Native TypeScript support without additional configuration.

### Why Playwright for E2E Tests?

1. **Cross-Browser**: Test on Chromium, Firefox, and WebKit with one API.

2. **Auto-Wait**: Automatically waits for elements, reducing flaky tests.

3. **Network Interception**: Mock API responses for deterministic tests.

4. **Trace Viewer**: Debug failed tests with timeline, screenshots, and network log.

5. **Codegen**: Generate test code by recording browser actions.

## Testing Strategy

### Testing Pyramid
```
        /\
       /  \     E2E Tests (Playwright)
      /----\    - Critical user flows only
     /      \   - 10-20 tests
    /--------\  Integration Tests (Vitest)
   /          \ - Component + hook tests
  /------------\ - 50-100 tests
 /              \ Unit Tests (Vitest)
/----------------\ - Pure functions, utilities
                   - 100+ tests
```

### What to Test at Each Level

**Unit Tests (Vitest)**
- Pure utility functions
- Data transformations
- Validation schemas (Zod)
- Custom hooks (with testing-library)

**Integration Tests (Vitest + React Testing Library)**
- Component rendering
- User interactions
- Form submissions
- API hook behavior (with MSW mocking)

**E2E Tests (Playwright)**
- Authentication flow
- Complete booking request flow
- Message thread interaction
- Critical happy paths only

## Consequences

### Positive
- Fast feedback loop with Vitest's watch mode
- Confident refactoring with comprehensive unit tests
- E2E tests catch integration issues
- Cross-browser coverage ensures compatibility
- Visual regression detection with Playwright screenshots

### Negative
- Two testing frameworks to maintain
- E2E tests are slower and more brittle
- Mocking Supabase requires setup
- Test data management for E2E

### Mitigations
- Keep E2E tests minimal (critical paths only)
- Use MSW for consistent API mocking
- Implement test database seeding scripts
- Run E2E tests in CI, not local dev

## Implementation Notes

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
})
```

### Example Test Structure
```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx      # Unit test
├── hooks/
│   └── useBookings/
│       ├── useBookings.ts
│       └── useBookings.test.ts  # Integration test
e2e/
├── auth.spec.ts                 # E2E test
└── booking.spec.ts              # E2E test
```

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Vitest + Playwright** | Fast, modern, Vite-native | Two frameworks | **Selected** |
| **Jest + Playwright** | Mature, well-documented | Slower, config complexity | Rejected |
| **Vitest + Cypress** | Great DX, time-travel debug | Slower than Playwright | Rejected |
| **Jest only** | Single framework | No proper E2E | Rejected |
| **Cypress only** | All-in-one E2E | Slow for unit tests | Rejected |

## Coverage Goals

| Type | Target | Rationale |
|------|--------|-----------|
| Unit | 80% | Core logic should be well-tested |
| Integration | 60% | Key components and hooks |
| E2E | Critical paths | Not measured by coverage |

## CI Integration

```yaml
# In GitHub Actions
- name: Unit & Integration Tests
  run: npm run test:coverage

- name: E2E Tests
  run: npx playwright test
```

## References
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
