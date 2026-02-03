# ADR-006: Hosting and Deployment

## Status
Accepted

## Context
EA Platform needs a hosting solution for the React SPA frontend and deployment pipeline for continuous delivery. The solution should support preview deployments, easy rollbacks, and scale with traffic.

## Decision
We will use **Vercel** for frontend hosting and **Supabase Cloud** for backend services.

## Rationale

### Why Vercel?

1. **Zero-Config Deployment**: Automatic builds from Git pushes, no CI/CD configuration needed.

2. **Preview Deployments**: Every PR gets a unique preview URL for testing and review.

3. **Global Edge Network**: Static assets served from edge locations worldwide for low latency.

4. **Instant Rollbacks**: One-click rollback to any previous deployment.

5. **Vite Support**: Native support for Vite builds with optimal caching.

6. **Free Tier**: Generous free tier suitable for MVP and early growth.

### Why Supabase Cloud?

1. **Managed PostgreSQL**: Automatic backups, updates, and scaling.

2. **Integrated Services**: Auth, Storage, Realtime, and Edge Functions in one dashboard.

3. **Connection Pooling**: Supavisor handles connection pooling automatically.

4. **Point-in-Time Recovery**: Database can be restored to any point in time.

5. **Monitoring**: Built-in logs, metrics, and alerts.

## Consequences

### Positive
- Instant deployments on git push
- Preview URLs for every pull request
- Global CDN for fast static asset delivery
- No infrastructure management
- Automatic HTTPS certificates
- Built-in analytics and web vitals
- Easy environment variable management

### Negative
- Vercel pricing at scale can be expensive
- Vendor lock-in (though migration is straightforward for SPAs)
- Limited server-side functionality (not needed for our SPA)
- Supabase Cloud regions limited (though expanding)

### Mitigations
- Monitor usage to avoid unexpected costs
- Keep deployment simple (no vendor-specific features)
- Use Supabase's self-host option if cost becomes prohibitive
- Consider multi-region Supabase for production

## Deployment Pipeline

```
Developer Push → GitHub → Vercel Build → Preview/Production
                            ↓
                    Type Check → Lint → Build → Deploy
                            ↓
                    Preview URL (PR) or Production (main)
```

### Environment Configuration

| Environment | Vercel | Supabase |
|-------------|--------|----------|
| Development | localhost | Local or dev project |
| Preview | `pr-123.vercel.app` | Dev project |
| Production | `eaplatform.com` | Production project |

### Environment Variables
```bash
# Vercel Environment Variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SENTRY_DSN=https://...
```

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Vercel + Supabase Cloud** | Best DX, zero-config | Cost at scale | **Selected** |
| **Netlify + Supabase** | Similar to Vercel | Slightly less Vite integration | Close second |
| **AWS S3 + CloudFront** | Cheap at scale, full control | More setup, no preview deploys | Rejected - DX |
| **Railway** | Full-stack, simple | Less mature, fewer edge locations | Rejected |
| **Self-hosted (VPS)** | Full control, cheap | Maintenance burden, no auto-scaling | Rejected |

## Domain and DNS

- Production domain: `eaplatform.com` (or similar)
- Vercel handles SSL certificates automatically
- DNS managed via Vercel or external (Cloudflare)

## Monitoring and Observability

| Tool | Purpose |
|------|---------|
| Vercel Analytics | Web vitals, traffic |
| Supabase Dashboard | Database metrics, logs |
| Sentry | Error tracking, performance |
| UptimeRobot | Availability monitoring |

## References
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Hosting Guide](https://supabase.com/docs/guides/platform)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
