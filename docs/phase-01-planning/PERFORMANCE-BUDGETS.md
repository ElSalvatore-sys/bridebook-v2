# Performance Budgets

> Core Web Vitals targets and monitoring strategy for EA Platform

---

## Core Web Vitals Targets

| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | < 100ms | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | < 200ms | ≤ 200ms | 200ms - 500ms | > 500ms |

---

## Lighthouse Score Targets

| Category | Target | Minimum |
|----------|--------|---------|
| **Performance** | > 90 | 80 |
| **Accessibility** | > 95 | 90 |
| **Best Practices** | > 95 | 90 |
| **SEO** | > 90 | 80 |

---

## Bundle Size Budgets

| Asset | Target | Maximum | Tool |
|-------|--------|---------|------|
| **Initial JS** (gzipped) | < 150 KB | 200 KB | Vite analyzer |
| **Initial CSS** (gzipped) | < 30 KB | 50 KB | Vite analyzer |
| **Per-route chunk** | < 50 KB | 100 KB | Vite analyzer |
| **Total JS** (all routes) | < 500 KB | 750 KB | Vite analyzer |
| **Largest image** | < 200 KB | 500 KB | Lighthouse |

### Bundle Analysis Commands

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Check bundle with vite-bundle-analyzer
npx vite-bundle-analyzer
```

---

## Loading Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Byte (TTFB)** | < 200ms | Vercel Edge + Supabase |
| **First Contentful Paint (FCP)** | < 1.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.0s | Lighthouse |
| **Speed Index** | < 3.0s | Lighthouse |

---

## Runtime Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| **JS execution time** | < 2s | Lighthouse |
| **Main thread work** | < 3s | Lighthouse |
| **DOM size** | < 1500 elements | Lighthouse |
| **Memory usage** | < 100 MB | Chrome DevTools |

---

## API Performance Targets

| Operation | Target | Maximum |
|-----------|--------|---------|
| **Auth operations** | < 500ms | 1s |
| **List queries (paginated)** | < 300ms | 500ms |
| **Single record fetch** | < 200ms | 400ms |
| **Create/Update mutation** | < 500ms | 1s |
| **Image upload (< 5MB)** | < 3s | 5s |
| **Search query** | < 500ms | 1s |

---

## Actions When Budgets Exceeded

### LCP > 2.5s
1. Audit largest element on page
2. Optimize hero images (compression, srcset)
3. Implement skeleton loaders
4. Lazy load below-fold content
5. Check server response times

### FID / INP > 100ms / 200ms
1. Audit JavaScript execution time
2. Code-split heavy components
3. Defer non-critical JavaScript
4. Use `requestIdleCallback` for low-priority work
5. Reduce third-party script impact

### CLS > 0.1
1. Reserve space for dynamic content
2. Add explicit dimensions to images
3. Avoid inserting content above existing content
4. Use CSS `aspect-ratio` for media
5. Preload fonts to prevent FOIT/FOUT

### Bundle Size > 200 KB
1. Analyze with bundle visualizer
2. Remove unused dependencies
3. Use tree-shakeable imports
4. Implement route-based code splitting
5. Consider lighter alternatives

---

## Monitoring Tools

### Development

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Lighthouse CI** | Automated audits | GitHub Actions |
| **Vite Bundle Analyzer** | Bundle visualization | Build script |
| **React DevTools** | Component performance | Browser extension |
| **Chrome DevTools** | Runtime profiling | Browser |

### Production

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Vercel Analytics** | Real User Monitoring | Automatic |
| **Sentry Performance** | Transaction tracing | SDK integration |
| **Web Vitals (npm)** | Core Web Vitals reporting | Custom integration |

### Web Vitals Integration

```typescript
// src/lib/web-vitals.ts
import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals'

function reportMetric(metric: Metric) {
  // Send to analytics
  console.log(metric.name, metric.value)

  // Or send to Sentry
  Sentry.captureMessage(`${metric.name}: ${metric.value}`, {
    tags: { metric: metric.name },
    extra: { value: metric.value, rating: metric.rating }
  })
}

export function initWebVitals() {
  onCLS(reportMetric)
  onFID(reportMetric)
  onLCP(reportMetric)
  onINP(reportMetric)
  onTTFB(reportMetric)
}
```

---

## CI/CD Performance Gates

### GitHub Actions Workflow

```yaml
name: Performance Check

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: npm run build

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true

      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sk dist/assets/*.js | awk '{sum+=$1} END {print sum}')
          if [ $BUNDLE_SIZE -gt 200 ]; then
            echo "Bundle size exceeded: ${BUNDLE_SIZE}KB"
            exit 1
          fi
```

### Lighthouse CI Configuration

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "first-input-delay": ["error", { "maxNumericValue": 100 }]
      }
    }
  }
}
```

---

## Performance Checklist

### Before Each Release

- [ ] Run Lighthouse audit locally
- [ ] Check bundle size hasn't increased significantly
- [ ] Verify no new layout shifts introduced
- [ ] Test on slow 3G network simulation
- [ ] Check memory usage in DevTools
- [ ] Verify images are optimized

### Monthly Review

- [ ] Review Vercel Analytics trends
- [ ] Check Sentry performance data
- [ ] Audit third-party script impact
- [ ] Review and update budgets if needed
- [ ] Test on real mobile devices

---

## References

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
