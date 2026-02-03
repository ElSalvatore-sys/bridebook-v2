# Success Metrics

> Key Performance Indicators (KPIs) for EA Platform by launch phase.

---

## Metric Categories

| Category | Description |
|----------|-------------|
| **Acquisition** | New user signups and registrations |
| **Activation** | Users completing key actions |
| **Engagement** | Ongoing platform usage |
| **Retention** | Users returning over time |
| **Revenue** | Monetization metrics (P3+) |
| **Technical** | Performance and reliability |

---

## P0 Launch Metrics (MVP)

### Acquisition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Artist signups | 50+ | Verified artist profiles created |
| Venue signups | 20+ | Verified venue profiles created |
| Organizer signups | 30+ | Registered organizer accounts |
| Signup completion rate | > 60% | Started signup → completed profile |
| Signup source | Track | UTM parameters, referral codes |

### Activation

| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile completion | > 70% | Essential fields filled (artists: bio, genre, media) |
| First search | > 80% | Users who perform at least 1 search |
| First favorite | > 50% | Users who save at least 1 artist/venue |
| First booking request | > 20% | Organizers who send a booking request |
| Booking request response | > 60% | Artists/venues who respond within 48h |

### Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking requests sent | 100+ total | First month cumulative |
| Messages sent | 500+ total | First month cumulative |
| Searches performed | 1,000+ total | First month cumulative |
| Profile views per artist | 10+ avg | Monthly average |

### Technical

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| FID (First Input Delay) | < 100ms | Core Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Core Web Vitals |
| Lighthouse Performance | > 85 | Automated audit |
| Lighthouse Accessibility | > 90 | Automated audit |
| 5xx Error Rate | < 0.1% | Server errors / total requests |
| Uptime | > 99.5% | Monthly availability |

---

## P1 Metrics (Core Engagement)

### Acquisition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total registered users | 500+ | All user types |
| Weekly new users | 50+ | Growth rate |
| User type distribution | 40/30/25/5 | Artists/Venues/Organizers/Customers |

### Activation

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard visits | > 70% | Users who view dashboard weekly |
| Calendar usage | > 50% | Artists/venues who set availability |
| Review submission | > 30% | Completed bookings that get reviewed |

### Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| DAU/MAU ratio | > 20% | Daily active / monthly active |
| Booking requests/week | 50+ | Weekly volume |
| Booking conversion rate | > 15% | Requests → confirmed bookings |
| Repeat booking rate | > 25% | Artists re-booked by same venue |
| Message response time | < 24h | Median time to first response |

### Retention

| Metric | Target | Measurement |
|--------|--------|-------------|
| Week 1 retention | > 40% | Users active 7 days after signup |
| Month 1 retention | > 25% | Users active 30 days after signup |
| Monthly churn | < 10% | Users who don't return within 30 days |

---

## P2 Metrics (Growth)

### Acquisition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total registered users | 2,000+ | 6 months post-launch |
| Organic signups | > 30% | Non-paid acquisition |
| Referral signups | > 10% | User-referred signups |
| Geographic coverage | 5+ cities | Active users in cities beyond Wiesbaden |

### Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| Public event page views | 1,000+/month | Event discovery traction |
| Artist followers | 5+ avg | Average followers per artist |
| Social shares | 100+/month | Events/profiles shared |
| Team invitations | > 30% | Venues with multiple users |

### Retention

| Metric | Target | Measurement |
|--------|--------|-------------|
| 3-month retention | > 40% | Users active 90 days after signup |
| NPS score | > 30 | Net Promoter Score survey |

---

## P3+ Metrics (Revenue)

### Revenue

| Metric | Target | Measurement |
|--------|--------|-------------|
| Premium subscriptions | 100+ | Paid artist/venue accounts |
| Booking GMV | €10,000+/month | Gross merchandise value |
| Platform commission | 5-10% | Revenue per booking |
| MRR | €2,000+ | Monthly recurring revenue |
| CAC payback | < 6 months | Customer acquisition cost recovery |

### Monetization Rates

| Metric | Target | Measurement |
|--------|--------|-------------|
| Free → Paid conversion | > 5% | Premium upgrade rate |
| In-platform payment adoption | > 30% | Bookings using platform payments |
| Premium feature usage | > 50% | Premium users using premium features |

---

## Tracking Implementation

### Analytics Tools

| Tool | Purpose |
|------|---------|
| **PostHog** | Product analytics, funnels, retention |
| **Sentry** | Error tracking, performance monitoring |
| **Vercel Analytics** | Web vitals, page performance |
| **Supabase Dashboard** | Database metrics, auth stats |
| **Google Search Console** | SEO metrics (later) |

### Event Tracking Schema

```typescript
// Core events to track
interface TrackingEvents {
  // Acquisition
  'signup.started': { method: 'email' | 'google' | 'apple' }
  'signup.completed': { user_type: 'artist' | 'venue' | 'organizer' | 'customer' }

  // Activation
  'profile.completed': { user_type: string, completion_percent: number }
  'search.performed': { query: string, filters: object, results_count: number }
  'favorite.added': { item_type: 'artist' | 'venue', item_id: string }
  'booking_request.sent': { artist_id?: string, venue_id?: string }

  // Engagement
  'booking_request.responded': { response: 'accepted' | 'declined' | 'negotiating' }
  'message.sent': { thread_id: string }
  'review.submitted': { rating: number, booking_id: string }
  'calendar.updated': { user_type: string }

  // Conversion
  'booking.confirmed': { value: number, artist_id: string, venue_id: string }
  'premium.upgraded': { plan: string, price: number }
}
```

### Dashboard Metrics

Weekly review dashboard should show:

1. **Funnel:** Signup → Profile Complete → First Search → First Booking Request
2. **Volume:** New users, booking requests, messages, bookings
3. **Quality:** Response rates, conversion rates, ratings
4. **Health:** Error rates, load times, uptime

---

## Benchmarks

### Industry Comparisons

| Metric | EA Platform Target | Industry Average | Source |
|--------|-------------------|------------------|--------|
| Signup completion | > 60% | 40-60% | SaaS benchmarks |
| DAU/MAU | > 20% | 10-20% | Marketplace average |
| Booking conversion | > 15% | 5-15% | Service marketplaces |
| NPS | > 30 | 20-30 | B2B platforms |

### Competitive Baselines

| Platform | Metric | Value |
|----------|--------|-------|
| Eventpeppers | Cost per gig | ~€2.50 (€150/year ÷ ~60 gigs) |
| Gigmit | Cost per application | ~€0.63 (€228/year ÷ ~360 applications) |
| Eventinc | Commission | Lead-gen based |

---

## Alert Thresholds

### Critical (Immediate Action)

- Error rate > 1%
- Uptime < 99%
- Signup completion < 40%
- Zero bookings in 48h (after launch)

### Warning (Investigate)

- Signup completion < 55%
- DAU/MAU < 15%
- Booking response rate < 50%
- Average rating < 3.5

### Review (Monthly)

- Retention trends
- User type balance
- Geographic spread
- Feature adoption rates
