# 13 — MVP Priorities & Implementation Roadmap

> Comprehensive feature prioritization mapping every feature to database tables, API endpoints, UI components, forms, complexity, and dependencies.
> Based on docs 01–12 and 61 screenshots.

---

## Table of Contents

1. [Feature Tiers (P0–P4)](#1-feature-tiers-p0p4)
2. [Technical Dependencies](#2-technical-dependencies)
3. [Risk Assessment](#3-risk-assessment)
4. [Success Metrics per Tier](#4-success-metrics-per-tier)
5. [German Market Requirements](#5-german-market-requirements)
6. [Sprint/Week Breakdown for P0](#6-sprintweek-breakdown-for-p0)
7. [Team Size Assumptions](#7-team-size-assumptions)
8. [Testing Requirements per Tier](#8-testing-requirements-per-tier)
9. [Deployment Milestones](#9-deployment-milestones)
10. [Feature Flags Strategy](#10-feature-flags-strategy)
11. [Vendor Onboarding (Chicken-Egg Problem)](#11-vendor-onboarding-chicken-egg-problem)
12. [Content Requirements](#12-content-requirements)
13. [Third-Party Integrations Timeline](#13-third-party-integrations-timeline)
14. [Cost Estimates](#14-cost-estimates)
15. [Launch Checklist](#15-launch-checklist)

---

## 1. Feature Tiers (P0–P4)

### Legend

| Symbol | Meaning |
|--------|---------|
| **S** | Small — 1–2 days |
| **M** | Medium — 3–5 days |
| **L** | Large — 1–2 weeks |
| **XL** | Extra Large — 2–4 weeks |

---

### P0 — Core MVP (Must-Have for Launch)

#### P0.1 User Authentication

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `users`, `user_sessions`, `password_resets` |
| **API Endpoints** | 10 endpoints: `POST /auth/register` (#1), `POST /auth/login` (#2), `POST /auth/oauth` (#3), `POST /auth/refresh` (#4), `POST /auth/logout` (#5), `POST /auth/password-reset` (#6), `POST /auth/password-reset/confirm` (#7), `POST /auth/email/verify` (#8), `POST /auth/email/resend` (#9), `GET /auth/session` (#10) |
| **UI Components** | Modal, TextInput, Button, Divider, Toast, LoadingIndicator |
| **Forms** | Login/Signup Modal (Form 1.1) — 2 fields + 3 SSO buttons |
| **Complexity** | **L** |
| **Dependencies** | Supabase Auth setup, OAuth provider configs (Apple, Google, Facebook), email service for verification |

#### P0.2 User Profile Management

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `users` |
| **API Endpoints** | 7 endpoints: `GET /users/me` (#11), `PATCH /users/me` (#12), `POST /users/me/avatar` (#13), `DELETE /users/me/avatar` (#14), `GET /users/me/preferences` (#15), `PATCH /users/me/preferences` (#16), `DELETE /users/me` (#17) |
| **UI Components** | TextInput, Select, AvatarUpload, Button, ToggleSwitch, SplitLayout, SidebarNav |
| **Forms** | Settings: Contact Email (7.1), Profile Photo (7.2), Login Methods (7.3), Language Change (7.4), Account Deletion (7.5) |
| **Complexity** | **M** |
| **Dependencies** | P0.1 Auth |

#### P0.3 Wedding Setup

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `weddings`, `wedding_settings` |
| **API Endpoints** | 7 endpoints: `GET /weddings` (#18), `POST /weddings` (#19), `GET /weddings/:id` (#20), `PATCH /weddings/:id` (#21), `DELETE /weddings/:id` (#22), `GET /weddings/:id/settings` (#23), `PATCH /weddings/:id/settings` (#24) |
| **UI Components** | TextInput, Select, ChipSelect, Button, Modal |
| **Forms** | Wedding Details (7.6) — 8 fields |
| **Complexity** | **M** |
| **Dependencies** | P0.1 Auth |

#### P0.4 Vendor Search + Filters

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `vendors`, `categories`, `subcategories`, `regions`, `cities`, `vendor_images` |
| **API Endpoints** | 8 endpoints: `GET /vendors` (#28), `GET /categories` (#35), `GET /categories/:slug` (#36), `GET /regions` (#37), `GET /regions/:slug/cities` (#38), `GET /cities/:slug` (#39), `GET /search` (#109), `GET /search/suggest` (#110) |
| **UI Components** | SearchBar, LocationInput, Select, FilterBar, Checkbox, ChipSelect, VenueCard, Map, Badge, Pagination, SearchResultsLayout, HeroBanner, SkeletonLoader |
| **Forms** | Main Dashboard Search (9.1), Venue & Vendor Filters (9.2) — ~82 filter checkboxes across 11 sections |
| **Complexity** | **XL** |
| **Dependencies** | P0.3 Wedding Setup, Google Maps API, category/region seed data |

#### P0.5 Vendor Detail Page

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `vendors`, `vendor_images`, `vendor_packages`, `vendor_hours`, `vendor_availability` |
| **API Endpoints** | 3 endpoints: `GET /vendors/:id` (#29), `GET /vendors/:id/availability` (#30), `POST /vendors/:id/track` (#115) |
| **UI Components** | ImageGallery, RatingStars, Badge, TabBar, Accordion, Button, Map, SkeletonLoader, Carousel |
| **Forms** | None (read-only) |
| **Complexity** | **L** |
| **Dependencies** | P0.4 Vendor Search, vendor seed data |

#### P0.6 Favorites

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `favorites` |
| **API Endpoints** | 4 endpoints: `GET /weddings/:id/favorites` (#44), `POST /weddings/:id/favorites` (#45), `PATCH /weddings/:id/favorites/:fid` (#46), `DELETE /weddings/:id/favorites/:fid` (#47) |
| **UI Components** | VenueCard, Modal, SearchBar, Button, EmptyState, Toast |
| **Forms** | Add to Favorites Modal (9.3) — 1 search field |
| **Complexity** | **S** |
| **Dependencies** | P0.3 Wedding Setup, P0.4 Vendor Search |

#### P0.7 Basic Enquiry

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `enquiries`, `messages` |
| **API Endpoints** | 5 endpoints: `POST /weddings/:id/enquiries` (#48), `GET /weddings/:id/enquiries` (#49), `GET /weddings/:id/enquiries/:eid` (#50), `PATCH /weddings/:id/enquiries/:eid` (#51), `POST /weddings/:id/enquiries/:eid/archive` (#52) |
| **UI Components** | Modal, TextInput, Textarea, Checkbox, Button, Toast |
| **Forms** | Venue Inquiry Modal (3.1) — 5 read-only fields + 5 checkboxes + textarea; Edit Contact Modal (3.2) — 6 editable fields |
| **Complexity** | **M** |
| **Dependencies** | P0.1 Auth, P0.3 Wedding Setup, P0.5 Vendor Detail, email service |

#### P0.8 Legal Pages & GDPR Compliance

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `users` (deletion/export fields) |
| **API Endpoints** | 2 endpoints: `POST /users/me/export` (#118), `GET /exports/:id` (#119) |
| **UI Components** | Footer, Button, Modal, ToggleSwitch |
| **Forms** | Cookie consent dialog, account deletion (7.5) |
| **Complexity** | **M** |
| **Dependencies** | Legal content (Impressum, Datenschutz, AGB), cookie consent library |

#### P0.9 File Uploads

| Attribute | Details |
|-----------|---------|
| **DB Tables** | — (Supabase Storage) |
| **API Endpoints** | 4 endpoints: `POST /uploads/presign` (#105), `POST /uploads/:id/confirm` (#106), `GET /uploads/:id` (#107), `DELETE /uploads/:id` (#108) |
| **UI Components** | AvatarUpload, LoadingIndicator |
| **Forms** | Profile Photo Upload (7.2) |
| **Complexity** | **M** |
| **Dependencies** | Supabase Storage or Cloudinary |

**P0 Total: 50 endpoints, 12 DB tables, ~100 filter/form fields**

---

### P1 — Planning Tools (Core Engagement)

#### P1.1 Dashboard

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `weddings`, `tasks`, `favorites`, `enquiries` (read aggregation) |
| **API Endpoints** | Reuses existing GET endpoints from P0 + analytics: `GET /weddings/:id/analytics/tasks` (#114), `GET /weddings/:id/analytics/budget` (#112), `GET /weddings/:id/analytics/guests` (#113) |
| **UI Components** | CountdownWidget, QuickActionBar, FeatureCard, DreamteamCard, MilestoneBadge, PromoCard, PartnerInviteBanner, SectionHeader, Carousel, ProgressBar, StatsRow |
| **Forms** | Main Dashboard Search (9.1) |
| **Complexity** | **L** |
| **Dependencies** | P0.1–P0.7 all complete |

#### P1.2 Budget Calculator

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `budget_categories`, `budget_items`, `payments` |
| **API Endpoints** | 11 endpoints: `POST /weddings/:id/budget/calculate` (#66), `GET /weddings/:id/budget` (#67), `GET /weddings/:id/budget/categories` (#68), `POST /weddings/:id/budget/categories` (#69), `PATCH /weddings/:id/budget/categories/:cid` (#70), `DELETE /weddings/:id/budget/categories/:cid` (#71), `GET /weddings/:id/budget/categories/:cid/items` (#72), `POST /weddings/:id/budget/categories/:cid/items` (#73), `PATCH /weddings/:id/budget/categories/:cid/items/:iid` (#74), `DELETE /weddings/:id/budget/categories/:cid/items/:iid` (#75), `POST /weddings/:id/budget/reset` (#76) |
| **UI Components** | ChipSelect, Checkbox, TextInput, Button, BudgetLineItem, StatsRow, PageHeader, Modal, LoadingIndicator, ProgressBar |
| **Forms** | Budget Calculator Wizard (2.1) — 7 fields with ~20 options; Budget Line Item Editor (5.1) — 4 fields; Max Budget Inline Edit (5.2) |
| **Complexity** | **L** |
| **Dependencies** | P0.3 Wedding Setup, budget category defaults |

#### P1.3 Guest List CRUD

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `guests`, `guest_groups` |
| **API Endpoints** | 9 endpoints: `GET /weddings/:id/guests` (#77), `POST /weddings/:id/guests` (#78), `POST /weddings/:id/guests/import` (#79), `PATCH /weddings/:id/guests/:gid` (#80), `DELETE /weddings/:id/guests/:gid` (#81), `GET /weddings/:id/guest-groups` (#82), `POST /weddings/:id/guest-groups` (#83), `PATCH /weddings/:id/guest-groups/:gid` (#84), `DELETE /weddings/:id/guest-groups/:gid` (#85) |
| **UI Components** | Modal, Textarea, Select, Button, EmptyState, Badge, Avatar, SearchBar |
| **Forms** | Add Multiple Guests (4.1) — 2 fields; Guest List Empty State (4.2) |
| **Complexity** | **M** |
| **Dependencies** | P0.3 Wedding Setup |

#### P1.4 Task Checklist

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `tasks`, `task_templates` |
| **API Endpoints** | 7 endpoints: `GET /weddings/:id/tasks` (#59), `POST /weddings/:id/tasks` (#60), `PATCH /weddings/:id/tasks/:tid` (#61), `DELETE /weddings/:id/tasks/:tid` (#62), `PATCH /weddings/:id/tasks/bulk` (#63), `GET /task-templates` (#64), `POST /weddings/:id/tasks/from-template` (#65) |
| **UI Components** | Checkbox, Button, ProgressBar, Badge, FeatureCard, Accordion, PageHeader |
| **Forms** | No dedicated forms captured in screenshots (CTA "Loslegen" cards) |
| **Complexity** | **M** |
| **Dependencies** | P0.3 Wedding Setup, task template seed data |

#### P1.5 Basic Messaging

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `messages`, `message_attachments`, `enquiries` |
| **API Endpoints** | 6 endpoints: `GET /weddings/:id/messages` (#53), `GET /weddings/:id/messages/:eid` (#54), `POST /weddings/:id/messages/:eid` (#55), `POST /weddings/:id/messages/:eid/read` (#56), `POST /weddings/:id/messages/:eid/archive` (#57), `POST /weddings/:id/messages/:eid/unarchive` (#58) |
| **UI Components** | TabBar, Avatar, Badge, TextInput, Button, EmptyState, SkeletonLoader |
| **Forms** | Message compose (textarea + send button) |
| **Complexity** | **M** |
| **Dependencies** | P0.7 Basic Enquiry |

#### P1.6 Data Export (Guest List, Budget)

| Attribute | Details |
|-----------|---------|
| **DB Tables** | — (reads from existing tables) |
| **API Endpoints** | 3 endpoints: `POST /weddings/:id/export/guests` (#116), `POST /weddings/:id/export/budget` (#117), `GET /exports/:id` (#119) |
| **UI Components** | Button, Modal, Toast |
| **Forms** | Export format selection |
| **Complexity** | **S** |
| **Dependencies** | P1.2 Budget, P1.3 Guest List |

**P1 Total: 36 endpoints (new), 6 additional DB tables, ~33 form fields**

---

### P2 — Engagement & Growth

#### P2.1 Wedding Homepage Builder

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `wedding_settings` (extended for homepage content) |
| **API Endpoints** | 11 endpoints: `GET /weddings/:id/homepage` (#87), `GET /wedding-homepage/:slug` (#88), `POST /weddings/:id/homepage` (#89), `PATCH /weddings/:id/homepage/content` (#90), `PATCH /weddings/:id/homepage/design` (#91), `PATCH /weddings/:id/homepage/settings` (#92), `POST /weddings/:id/homepage/photos` (#93), `DELETE /weddings/:id/homepage/photos/:pid` (#94), `POST /weddings/:id/homepage/publish` (#95), `POST /weddings/:id/homepage/unpublish` (#96), `DELETE /weddings/:id/homepage` (#97) |
| **UI Components** | SplitLayout, TabBar, SidebarNav, TextInput, Textarea, ToggleSwitch, DesignThumbnail, FontSelector, DevicePreview, Accordion, Button, AvatarUpload |
| **Forms** | Homepage Details: Names (8.1), Date (8.2), Location (8.3), Photos (8.4), RSVP (8.5), FAQs (8.6), Story (8.7), Timeline (8.8), Gift Registry (8.9), Accommodation (8.10); Design Tab (8.11); Settings Tab (8.12) — 12 forms total |
| **Complexity** | **XL** |
| **Dependencies** | P0.1 Auth, P0.3 Wedding Setup, P0.9 File Uploads |

#### P2.2 Advanced Filters & Map View

| Attribute | Details |
|-----------|---------|
| **DB Tables** | Same as P0.4 (extended queries) |
| **API Endpoints** | `GET /search/recent` (#111), enhanced `GET /vendors` with geo params |
| **UI Components** | Map (enhanced with clustering), FilterBar (enhanced), Badge (removable) |
| **Forms** | Venue Search Map View (10.2) |
| **Complexity** | **M** |
| **Dependencies** | P0.4 Vendor Search |

#### P2.3 Reviews System

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `reviews` |
| **API Endpoints** | 4 endpoints: `GET /vendors/:id/reviews` (#31), `POST /vendors/:id/reviews` (#32), `PATCH /vendors/:id/reviews/:rid` (#33), `DELETE /vendors/:id/reviews/:rid` (#34) |
| **UI Components** | RatingStars (interactive), Textarea, Button, Modal, Avatar, ProgressBar |
| **Forms** | Review submission form (rating + title + body) |
| **Complexity** | **M** |
| **Dependencies** | P0.5 Vendor Detail, P0.3 Wedding Setup |

#### P2.4 Full Messaging (Real-Time)

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `messages`, `message_attachments` |
| **API Endpoints** | WebSocket: `wss://ws.bridebook.de/v1` — events: `message.new`, `message.read`, `typing.start`, `typing.stop`, `typing.indicator` |
| **UI Components** | Avatar (online indicator), Textarea, Button, Badge |
| **Forms** | Message compose with file attachments |
| **Complexity** | **L** |
| **Dependencies** | P1.5 Basic Messaging, Supabase Realtime or custom WebSocket |

#### P2.5 Notifications System

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `notifications`, `email_logs` |
| **API Endpoints** | 7 endpoints: `GET /notifications` (#98), `GET /notifications/:id` (#99), `POST /notifications/:id/read` (#100), `POST /notifications/read-all` (#101), `DELETE /notifications/:id` (#102), `GET /notifications/preferences` (#103), `PATCH /notifications/preferences` (#104) |
| **UI Components** | Header (badge counts), Toast, Button, ToggleSwitch |
| **Forms** | Notification preferences (toggles) |
| **Complexity** | **L** |
| **Dependencies** | P0.1 Auth, email service, WebSocket (P2.4) |

#### P2.6 Team Collaboration

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `weddings` (team member refs) |
| **API Endpoints** | 3 endpoints: `POST /weddings/:id/team` (#25), `GET /weddings/:id/team` (#26), `DELETE /weddings/:id/team/:mid` (#27) |
| **UI Components** | TextInput, Select, Button, Avatar, Badge, Modal |
| **Forms** | Team Members Invite (7.7) — 2 fields |
| **Complexity** | **M** |
| **Dependencies** | P0.1 Auth, P0.3 Wedding Setup, email service |

#### P2.7 Public RSVP

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `guests` |
| **API Endpoints** | 1 endpoint: `POST /weddings/:id/rsvp` (#86) |
| **UI Components** | Button, Select, TextInput, Textarea |
| **Forms** | RSVP form (status + dietary + plus-one) |
| **Complexity** | **M** |
| **Dependencies** | P2.1 Wedding Homepage, P1.3 Guest List |

#### P2.8 Seating Plan

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `seating_tables`, `seating_assignments` |
| **API Endpoints** | CRUD for seating (not in initial 119 — needs extension) |
| **UI Components** | Drag-and-drop canvas, Modal, Button, Badge |
| **Forms** | Table creation, guest assignment |
| **Complexity** | **L** |
| **Dependencies** | P1.3 Guest List |

**P2 Total: 29 endpoints (new) + WebSocket, 4 additional DB tables**

---

### P3 — Content & Scale

#### P3.1 Articles / Advice Section

| Attribute | Details |
|-----------|---------|
| **DB Tables** | — (headless CMS or static content) |
| **API Endpoints** | 4 endpoints: `GET /articles` (#40), `GET /articles/:slug` (#41), `GET /articles/search` (#42), `POST /articles/:id/views` (#43) |
| **UI Components** | Breadcrumbs, PromoCard, TabBar, SearchBar, Badge, Carousel |
| **Forms** | Inspiration Search (9.4), Inspiration Tab Filter (9.5) |
| **Complexity** | **M** |
| **Dependencies** | Content creation pipeline, CMS integration |

#### P3.2 Analytics Dashboard

| Attribute | Details |
|-----------|---------|
| **DB Tables** | — (reads from existing tables) |
| **API Endpoints** | 3 endpoints: `GET /weddings/:id/analytics/budget` (#112), `GET /weddings/:id/analytics/guests` (#113), `GET /weddings/:id/analytics/tasks` (#114) |
| **UI Components** | StatsRow, ProgressBar, charts (new), PageHeader |
| **Forms** | None |
| **Complexity** | **M** |
| **Dependencies** | P1.2 Budget, P1.3 Guest List, P1.4 Tasks |

#### P3.3 Mobile App (React Native / PWA)

| Attribute | Details |
|-----------|---------|
| **DB Tables** | Same — consumes existing API |
| **API Endpoints** | All existing endpoints |
| **UI Components** | Native equivalents of all web components |
| **Forms** | All existing forms, mobile-optimized |
| **Complexity** | **XL** |
| **Dependencies** | Full P0+P1+P2 API stability |

**P3 Total: 7 endpoints (reused from above)**

---

### P4 — Differentiation

#### P4.1 AI Vendor Recommendations

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `vendors`, `favorites`, `reviews`, `weddings` (ML features) |
| **API Endpoints** | New: `GET /recommendations` (not in current spec) |
| **UI Components** | VenueCard, Carousel, Badge |
| **Forms** | Preference questionnaire |
| **Complexity** | **XL** |
| **Dependencies** | Sufficient vendor + interaction data, ML pipeline |

#### P4.2 Vendor Dashboard & Self-Service

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `vendors`, `vendor_images`, `vendor_packages`, `vendor_availability`, `vendor_hours`, `enquiries`, `reviews` |
| **API Endpoints** | New CRUD for vendor self-management (est. 15–20 endpoints) |
| **UI Components** | Full dashboard: tables, charts, forms, calendar |
| **Forms** | Vendor profile editor, package editor, availability calendar, reply to enquiry |
| **Complexity** | **XL** |
| **Dependencies** | P0.1 Auth (vendor role), P0.5 Vendor Detail |

#### P4.3 Marketplace / Payments

| Attribute | Details |
|-----------|---------|
| **DB Tables** | `payments` (extended), new `subscriptions` table |
| **API Endpoints** | Webhooks: `payment.completed`, `payment.failed`, `payment.refunded`, `subscription.created`, `subscription.cancelled` |
| **UI Components** | Payment forms, subscription UI |
| **Forms** | Payment method, subscription selection |
| **Complexity** | **XL** |
| **Dependencies** | Stripe integration, vendor dashboard, legal compliance |

**P4 Total: ~20 new endpoints**

---

### Complete Table Coverage (30/30 Tables)

| Tier | Tables |
|------|--------|
| **P0** | `users`, `user_sessions`, `password_resets`, `weddings`, `wedding_settings`, `categories`, `subcategories`, `regions`, `cities`, `vendors`, `vendor_images`, `vendor_packages`, `vendor_hours`, `vendor_availability`, `enquiries`, `messages`, `favorites` (17) |
| **P1** | `budget_categories`, `budget_items`, `payments`, `tasks`, `task_templates`, `guests`, `guest_groups` (7) |
| **P2** | `reviews`, `message_attachments`, `notifications`, `email_logs`, `seating_tables`, `seating_assignments` (6) |
| **Total** | **30/30 tables** |

### Complete Endpoint Coverage (119/119)

| Tier | Endpoint Range | Count |
|------|----------------|-------|
| **P0** | Auth (#1–10), Users (#11–17), Weddings (#18–24), Vendors (#28–30), Categories (#35–39), Favorites (#44–47), Enquiries (#48–52), Uploads (#105–108), Search (#109–110), Export-GDPR (#118–119), Track (#115) | **50** |
| **P1** | Tasks (#59–65), Budget (#66–76), Guests (#77–85), Messages (#53–58), Export (#116–117), Analytics (#112–114) | **36** |
| **P2** | Team (#25–27), Reviews (#31–34), Homepage (#87–97), Notifications (#98–104), RSVP (#86), Search-recent (#111) | **29** |
| **P3** | Articles (#40–43) | **4** |
| **Total** | | **119** |

---

## 2. Technical Dependencies

### Infrastructure Setup (Week 0)

| Service | Purpose | Tier Needed |
|---------|---------|-------------|
| **Supabase** | Auth, PostgreSQL, Storage, Realtime | P0 |
| **Vercel** | Frontend hosting, serverless functions | P0 |
| **Google Maps API** | Vendor search map | P0 |
| **Email Service** (Resend) | Verification, enquiry notifications | P0 |
| **Sentry** | Error monitoring | P0 |
| **Cloudinary** | Image transforms (optional, Supabase Storage first) | P1 |
| **Stripe** | Payments (when marketplace launches) | P4 |
| **PostHog/Plausible** | Analytics | P2 |

### Shared Components (Build First)

Design system foundation required before any feature work:

1. **Design tokens** — Colors, typography, spacing, shadows (from doc 05)
2. **Layout components** — Header, Footer, SplitLayout, SearchResultsLayout, PageHeader
3. **Form primitives** — TextInput, Select, Textarea, Checkbox, ToggleSwitch, ChipSelect, Button
4. **Feedback components** — Modal, Toast, LoadingIndicator, SkeletonLoader, EmptyState
5. **Data display** — Badge, RatingStars, Avatar, ProgressBar, Divider

**Estimated effort:** 1 week for full design system

### Database Migration Order

```
Migration 1 (P0): users → user_sessions → password_resets
Migration 2 (P0): categories → subcategories → regions → cities
Migration 3 (P0): weddings → wedding_settings
Migration 4 (P0): vendors → vendor_images → vendor_packages → vendor_hours → vendor_availability
Migration 5 (P0): enquiries → messages → favorites
Migration 6 (P1): task_templates → tasks
Migration 7 (P1): budget_categories → budget_items → payments
Migration 8 (P1): guest_groups → guests
Migration 9 (P2): reviews → message_attachments
Migration 10 (P2): notifications → email_logs
Migration 11 (P2): seating_tables → seating_assignments
```

---

## 3. Risk Assessment

### P0 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OAuth provider rejection (Apple review) | Medium | High | Implement email auth first, add OAuth incrementally |
| Google Maps API cost overruns | Low | Medium | Implement static map fallback, lazy-load map component |
| Vendor search performance with complex filters | Medium | High | Start with simple filters, add advanced filters in P2; use database indexes and materialized views |
| Empty vendor catalog at launch | High | Critical | Seed 50–100 real Wiesbaden venues before launch (see §11) |
| German legal content accuracy | Medium | High | Engage German-speaking lawyer for Impressum/Datenschutz/AGB review |
| Supabase Auth edge cases | Low | Medium | Wrap Supabase Auth with abstraction layer for potential migration |

### P1 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Budget calculator accuracy | Medium | Medium | Use percentage-based allocation from industry data, allow full manual override |
| Guest list bulk import parsing | Medium | Low | Robust name parser with preview step before import |
| Task template relevance | Low | Low | Curate from established wedding planning checklists (German-localized) |

### P2 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Homepage builder complexity | High | Medium | Start with templates only (no custom CSS), add customization iteratively |
| WebSocket reliability | Medium | Medium | Use Supabase Realtime (built-in), fallback to polling |
| Review spam/abuse | Medium | Medium | Require verified wedding + vendor interaction, moderation queue |

---

## 4. Success Metrics per Tier

### P0 Metrics

| Metric | Target |
|--------|--------|
| Registration completion rate | ≥ 60% |
| Vendor search → detail page CTR | ≥ 15% |
| Enquiry submission rate (of detail page views) | ≥ 5% |
| Favorites saved per user | ≥ 3 in first session |
| Core Web Vitals (LCP) | < 2.5s |
| Lighthouse Accessibility | ≥ 90 |
| Error rate (5xx) | < 0.1% |

### P1 Metrics

| Metric | Target |
|--------|--------|
| Budget calculator completion rate | ≥ 70% |
| Guest list entries per user (first week) | ≥ 10 |
| Checklist task completion rate | ≥ 30% within first month |
| DAU/MAU ratio | ≥ 20% |

### P2 Metrics

| Metric | Target |
|--------|--------|
| Homepage publication rate | ≥ 40% of couples |
| Reviews submitted per vendor (avg) | ≥ 2 |
| Real-time message response time | < 5 min median |
| Team invitations sent | ≥ 1 per wedding |

### P3/P4 Metrics

| Metric | Target |
|--------|--------|
| Article page views per user/month | ≥ 3 |
| Vendor self-registration rate | ≥ 5 vendors/week |
| AI recommendation CTR | ≥ 10% |

---

## 5. German Market Requirements

### P0 — Legal (Must-Have)

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| **Impressum** | Static page with company info, Handelsregister, USt-IdNr | P0 |
| **Datenschutzerklärung** | Static page covering DSGVO Art. 13/14, data processing purposes, third-party services | P0 |
| **AGB** (Terms) | Static page with platform terms, vendor terms, user terms | P0 |
| **Cookie Consent** | Banner with granular consent (required/analytics/marketing), cookie preference center | P0 |
| **GDPR Data Export** | `POST /users/me/export` — ZIP with all user data (Art. 20) | P0 |
| **GDPR Account Deletion** | `DELETE /users/me` — 30-day grace period, full data anonymization (Art. 17) | P0 |
| **Right to Rectification** | Profile edit (`PATCH /users/me`) — Art. 16 | P0 |

### P1 — Compliance

| Requirement | Implementation |
|-------------|---------------|
| Data processing records | Internal documentation |
| Sub-processor list | Supabase, Vercel, Google Maps, email provider |

### P4 — Payments

| Requirement | Implementation |
|-------------|---------------|
| **SEPA Direct Debit** | Stripe SEPA integration |
| **Klarna** | Stripe Klarna integration |
| **GoBD compliance** | Invoice numbering, archival |
| **TSE** (if POS needed) | Not required for online-only |

---

## 6. Sprint/Week Breakdown for P0

### Week 1: Foundation

| Day | Deliverable |
|-----|-------------|
| Mon | Supabase project setup, Vercel deployment pipeline, repo scaffolding (Next.js + TypeScript + Tailwind) |
| Tue | Design tokens implementation, layout components (Header, Footer, SplitLayout) |
| Wed | Form primitives (TextInput, Select, Textarea, Checkbox, Button, ToggleSwitch) |
| Thu | Feedback components (Modal, Toast, LoadingIndicator, SkeletonLoader, EmptyState) |
| Fri | Data display components (Badge, RatingStars, Avatar, ProgressBar, Divider, ChipSelect) |

### Week 2: Auth + Vendor Data

| Day | Deliverable |
|-----|-------------|
| Mon | DB migrations 1–4 (auth + categories + weddings + vendors) |
| Tue | Auth flow: registration, login, email verification |
| Wed | Auth flow: OAuth (Google), password reset, session management |
| Thu | Category/region/city seed data import, vendor seed data (50+ venues) |
| Fri | User profile management, settings page (account tab) |

### Week 3: Search + Detail + Enquiry

| Day | Deliverable |
|-----|-------------|
| Mon | Vendor search API with basic filters (category, region, price range) |
| Tue | Search results page (VenueCard grid, pagination) + Google Maps integration |
| Wed | Filter panel (all 11 sections, 82 checkboxes) |
| Thu | Vendor detail page (images, info, packages, hours, availability) |
| Fri | Enquiry modal + favorites (add/remove/list) |

### Week 4: Legal + Polish + Hardening

| Day | Deliverable |
|-----|-------------|
| Mon | Legal pages (Impressum, Datenschutz, AGB), cookie consent |
| Tue | GDPR endpoints (data export, account deletion), file upload flow |
| Wed | Responsive design pass, mobile testing |
| Thu | Bug fixes, error handling, loading states, empty states |
| Fri | Performance optimization (lazy loading, image optimization, Core Web Vitals) |

**Milestone: P0 Alpha — internal testing ready**

---

## 7. Team Size Assumptions

### Solo Developer (~12 weeks for P0+P1)

| Phase | Weeks | Scope |
|-------|-------|-------|
| P0 Foundation + Auth | 1–4 | Design system, auth, search, detail, enquiry, legal |
| P1 Planning Tools | 5–8 | Dashboard, budget, guests, checklist, messaging |
| Polish + Testing | 9–10 | Bug fixes, E2E tests, accessibility |
| Soft Launch Prep | 11–12 | Seed data, vendor outreach, monitoring setup |

### 2-Person Team (~8 weeks for P0+P1)

| Developer | Weeks 1–4 (P0) | Weeks 5–8 (P1) |
|-----------|-----------------|-----------------|
| **Frontend** | Design system → search UI → detail page → enquiry modal → legal pages | Dashboard → budget UI → guest list UI → checklist UI → message threads |
| **Fullstack** | Supabase setup → auth API → vendor API + seed data → search API + filters → file uploads | Budget API → guest API → task API → message API → analytics |

**Parallelizable work:**
- Frontend design system ↔ Backend DB migrations + API
- Search UI ↔ Auth API
- Vendor detail UI ↔ Enquiry API
- Budget UI ↔ Guest list API

### 3+ Person Team (~5 weeks for P0+P1)

| Developer | Focus |
|-----------|-------|
| **Frontend Lead** | Design system, all page layouts, responsive |
| **Backend Lead** | Supabase, all APIs, migrations, seed data |
| **Full-Stack** | Auth flow, search+filters, enquiry, real-time |

---

## 8. Testing Requirements per Tier

### P0: 80% Unit Test Coverage

**Unit Tests:**
- Auth service: registration, login, OAuth, token refresh, password reset
- Vendor search: filter parsing, query building, pagination
- Form validation: all form fields match spec
- GDPR: data export completeness, deletion cascading

**E2E Tests (Playwright):**
| Scenario | Steps |
|----------|-------|
| User registration | Open → SSO/email → verify email → redirect to dashboard |
| Vendor search | Enter location → select category → apply filters → view results → paginate |
| Vendor detail | Click result → view gallery → check packages → check availability |
| Add favorite | View vendor → click heart → verify in favorites list → remove |
| Submit enquiry | View vendor → open modal → fill form → submit → verify confirmation |
| Cookie consent | First visit → banner appears → accept/reject → verify cookies |
| Account deletion | Settings → delete account → confirm → verify data removed |

**Accessibility:**
- axe-core automated scan on all pages (0 critical/serious violations)
- VoiceOver manual testing on auth flow + search + vendor detail
- Keyboard navigation through all forms

### P1: 70% Unit Test Coverage

**E2E Tests:**
| Scenario | Steps |
|----------|-------|
| Budget calculator | Enter budget → select options → calculate → verify breakdown |
| Guest list | Add guests (bulk) → assign groups → update RSVP → export CSV |
| Checklist | Load templates → toggle tasks → verify progress bar |
| Messaging | Open thread → send message → verify in list |

### P2: 60% Unit Test Coverage

**E2E Tests:**
| Scenario | Steps |
|----------|-------|
| Homepage builder | Create → add content → select design → publish → verify public URL |
| Review submission | Select vendor → rate → write review → submit → verify display |
| Real-time messaging | Send message → verify instant delivery → typing indicator |

### Manual QA Checklist (All Tiers)

- [ ] All forms submit successfully with valid data
- [ ] All forms show proper validation errors with invalid data
- [ ] All pages load within 3 seconds on 3G connection
- [ ] All pages render correctly on Chrome, Safari, Firefox
- [ ] All pages render correctly on mobile (375px), tablet (768px), desktop (1280px)
- [ ] All images have alt text
- [ ] All interactive elements have focus indicators
- [ ] All modals trap focus and close on Escape

---

## 9. Deployment Milestones

### Alpha (Week 4) — Internal Testing

| Criteria | Details |
|----------|---------|
| **Features** | Auth + vendor search + vendor detail + favorites + enquiry |
| **Data** | 50+ seed vendors, 5+ categories |
| **Testing** | Manual QA by team |
| **Users** | Team only (2–5 people) |
| **URL** | `alpha.bridebook.de` |
| **Rollback** | Vercel instant rollback to previous deployment |

### Beta (Week 8) — Limited Users

| Criteria | Details |
|----------|---------|
| **Features** | Full P0 + P1 (dashboard, budget, guests, checklist, messaging) |
| **Data** | 100+ seed vendors, full category tree |
| **Testing** | E2E test suite passing, accessibility audit ≥ 90 |
| **Users** | 20–50 invited beta users |
| **URL** | `beta.bridebook.de` |
| **Feedback** | In-app feedback form, Sentry error tracking |
| **Rollback** | Vercel instant rollback + database migration rollback scripts |

### Soft Launch (Week 10) — Invite-Only

| Criteria | Details |
|----------|---------|
| **Features** | P0 + P1 + select P2 (homepage builder behind flag) |
| **Data** | Real vendor outreach begun, 50+ verified vendors |
| **Testing** | Load testing (100 concurrent users), security audit |
| **Users** | 100–200 invited users (couples + vendors) |
| **URL** | `app.bridebook.de` |
| **Monitoring** | Sentry, PostHog analytics, uptime monitoring |
| **Rollback** | Blue/green deployment, database point-in-time recovery |

### Public Launch (Week 12) — Open Registration

| Criteria | Details |
|----------|---------|
| **Features** | Full P0 + P1, P2 features gradually enabled |
| **Data** | 100+ active vendors, all legal pages live |
| **Testing** | All P0+P1 E2E tests passing, 0 critical bugs |
| **Users** | Open registration |
| **URL** | `bridebook.de` |
| **Monitoring** | Full observability stack |
| **Rollback** | Automated rollback on error rate spike |

### Rollback Procedures

| Level | Trigger | Action | Recovery Time |
|-------|---------|--------|---------------|
| **Frontend** | UI broken, JS errors | Vercel instant rollback | < 1 minute |
| **API** | 5xx error rate > 1% | Revert Supabase Edge Functions | < 5 minutes |
| **Database** | Data corruption | Point-in-time recovery | < 30 minutes |
| **Full** | Critical security issue | Maintenance mode + full rollback | < 1 hour |

---

## 10. Feature Flags Strategy

### Features Behind Flags

| Feature | Flag Name | Tier | Default |
|---------|-----------|------|---------|
| Wedding Homepage Builder | `ff_homepage_builder` | P2 | OFF |
| Reviews System | `ff_reviews` | P2 | OFF |
| Real-Time Notifications | `ff_realtime_notifications` | P2 | OFF |
| Advanced Filters (map, geo) | `ff_advanced_filters` | P2 | OFF |
| Team Collaboration | `ff_team_collaboration` | P2 | OFF |
| Articles Section | `ff_articles` | P3 | OFF |
| AI Recommendations | `ff_ai_recommendations` | P4 | OFF |
| Vendor Self-Service | `ff_vendor_dashboard` | P4 | OFF |

### Gradual Rollout Plan

| Phase | % Users | Duration | Criteria to Advance |
|-------|---------|----------|---------------------|
| Internal | 0% (team only) | 1 week | No critical bugs |
| Canary | 5% | 3 days | Error rate < 0.1%, no performance regression |
| Early Adopters | 25% | 1 week | Positive feedback, metrics on target |
| General | 100% | — | All metrics stable |

### Implementation

**Option A (Recommended for MVP): Environment Variables**
```env
FF_HOMEPAGE_BUILDER=false
FF_REVIEWS=false
FF_REALTIME_NOTIFICATIONS=false
```

Simple, no database overhead. Toggle via Vercel dashboard.

**Option B (Post-launch): Supabase Config Table**
```sql
CREATE TABLE feature_flags (
    name TEXT PRIMARY KEY,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INT DEFAULT 0,
    user_allowlist UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Enables per-user targeting and gradual rollout without redeployment.

### Kill Switch

Every flagged feature includes:
1. Server-side flag check (API returns 404 for disabled features)
2. Client-side flag check (component doesn't render)
3. Vercel env var override for instant disable without code change

---

## 11. Vendor Onboarding (Chicken-Egg Problem)

### Phase 1: Seed Data (Pre-Launch)

**Target:** 50–100 real Wiesbaden/Hessen venues

| Source | Data Points | Method |
|--------|-------------|--------|
| Google Maps API | Name, address, phone, website, hours, photos, ratings | Script |
| Public venue websites | Description, packages, pricing, capacity | Manual |
| Hochzeitslocations.de | Venue listings, categories | Manual research |
| Facebook/Instagram | Photos, reviews | Manual |

**Seed data script (CSV → Supabase):**
```bash
# Expected CSV format:
# business_name,category,subcategory,city,address,phone,email,website,min_price,max_price,description,capacity_min,capacity_max
node scripts/import-vendors.js --file=seed-vendors.csv --images-dir=seed-images/
```

**Categories to seed (10+):**

| German Name | Slug | Target Vendors |
|-------------|------|----------------|
| Hochzeitslocations | `locations` | 30 |
| Fotograf | `fotografen` | 10 |
| Florist | `floristen` | 5 |
| Catering | `catering` | 5 |
| DJ / Musik | `musik` | 5 |
| Videograf | `videografen` | 3 |
| Hochzeitstorte | `torte` | 3 |
| Brautkleider | `brautmode` | 3 |
| Transport | `transport` | 3 |
| Ringe & Schmuck | `ringe` | 3 |

### Phase 2: Direct Outreach (Launch)

**Approach:**
1. Email template to 200 Wiesbaden-area vendors offering free premium listing for 6 months
2. Phone follow-up for top 50 venues
3. Offer to create their listing for them (white-glove onboarding)

**Value proposition:** "Free listing on Germany's new wedding platform. We'll create your profile, upload your photos, and handle enquiries."

### Phase 3: Self-Service (P4)

Full vendor signup portal with:
- Business profile creation
- Photo upload
- Package management
- Availability calendar
- Enquiry management dashboard

### Development/Demo Data

For development and demo purposes, generate:
- 10 fake couple profiles with sample weddings
- 20 placeholder vendors with stock photos
- Sample enquiry threads, reviews, budget breakdowns
- Realistic German names, addresses, pricing

---

## 12. Content Requirements

### Legal Pages (P0 — Required Before Launch)

| Page | Content | Source |
|------|---------|--------|
| **Impressum** | Company name, address, Handelsregister, USt-IdNr, contact, responsible person (§5 TMG) | Legal template + lawyer review |
| **Datenschutzerklärung** | Data processing purposes, legal basis, third parties (Supabase, Vercel, Google, email provider), retention periods, user rights (DSGVO Art. 13/14) | Legal template + lawyer review |
| **AGB** | Platform terms of use, vendor terms, liability limitations, dispute resolution | Legal template + lawyer review |
| **Cookie Policy** | Cookie categories, purposes, third-party cookies, opt-out instructions | Auto-generated from consent tool |

### Category & Subcategory Data

| Category | Subcategories |
|----------|---------------|
| Hochzeitslocations | Schloss, Scheune, Hotel, Restaurant, Garten, Landhaus, Eventlocation, Weingut, Im Freien, Auf dem Wasser, Dachterrasse, Lager/Fabrik |
| Fotograf | Hochzeitsfotograf, Videograf, Fotobooth |
| Florist | Brautstrauß, Tischdeko, Zeremonie-Deko |
| Catering | Buffet, Menü, BBQ, Food Truck |
| Musik | DJ, Live-Band, Solo-Musiker |
| Torte | Hochzeitstorte, Candy Bar, Patisserie |
| Brautkleider | Brautmode, Herrenbekleidung, Accessoires |
| Beauty | Haare & Make-Up, Styling |
| Transport | Oldtimer, Kutsche, Limousine |
| Ringe & Schmuck | Trauringe, Verlobungsringe |

### Region/City Data (Starting with Hessen)

| Region | Cities (with lat/lng) |
|--------|-----------------------|
| Hessen | Wiesbaden, Frankfurt, Darmstadt, Kassel, Mainz (Rheinland-Pfalz nearby), Offenbach, Gießen, Marburg, Fulda, Bad Homburg, Rüsselsheim |
| Rheinland-Pfalz | Mainz, Koblenz, Trier |
| Baden-Württemberg | Heidelberg, Mannheim |
| Bayern | Würzburg, Aschaffenburg |

### Task Templates (28+ items across 6 time periods)

| Months Before | Tasks |
|---------------|-------|
| **12+** | Location buchen, Budget festlegen, Gästeliste beginnen, Trauzeuge/in wählen |
| **9–12** | Fotograf buchen, Catering auswählen, DJ/Band buchen, Save-the-Date versenden |
| **6–9** | Florist buchen, Hochzeitstorte bestellen, Einladungen versenden, Kleid/Anzug kaufen |
| **3–6** | Ringe kaufen, Friseur/Make-Up Probe, Sitzplan erstellen, Menü finalisieren |
| **1–3** | Letzte Anpassungen Kleid, Hochzeitshomepage veröffentlichen, Ablaufplan erstellen, Trauzeuge-Rede besprechen |
| **< 1** | Plätze bestätigen, Letzte Zahlungen, Koffer packen, Ringe bereithalten, Dokumente prüfen |

### Budget Category Defaults (21 line items across 4 groups)

| Group | Items |
|-------|-------|
| **Locations & Dienstleister** (10) | Hochzeitslocation, Florist, Fotograf, Catering, Musik, Torte, Transport, Dekoration und Verleih, Festzelt, Planer/Redner |
| **Kleidung & Accessoires** (4) | Brautmode, Herrenbekleidung, Ringe und Schmuck, Beauty/Haare/Make-Up |
| **Zusätzliches** (6) | Heiratslizenz Gebühren, Versicherung, Suite für Hochzeitsnacht, Gastgeschenke, Flitterwochen, Bekanntmachungen |
| **Andere** (1) | Extras |

### Placeholder/Demo Data

| Data Type | Count | Notes |
|-----------|-------|-------|
| Fake couple profiles | 10 | German names, Wiesbaden area |
| Sample weddings | 10 | Various dates 2027–2028, budgets €15k–€50k |
| Demo vendors | 20 | Realistic profiles with stock photos |
| Sample enquiry threads | 5 | Multi-message conversations |
| Sample reviews | 30 | 3–5 stars, German text |
| Budget breakdowns | 3 | Small/medium/large wedding examples |

---

## 13. Third-Party Integrations Timeline

| Week | Integration | Purpose | Cost |
|------|-------------|---------|------|
| **1** | **Supabase** project setup | Auth, PostgreSQL, Storage, Realtime | Free tier |
| **1** | **Vercel** deployment | Frontend hosting, CI/CD | Free tier |
| **2** | **Google Maps API** | Vendor search map, geocoding | $200/mo free credit |
| **3** | **Resend** (email) | Verification, enquiry confirmations | Free tier (100/day) |
| **3** | **Sentry** | Error monitoring | Free tier |
| **4** | Cookie consent library | GDPR compliance | Free (open source) |
| **5** | **Cloudinary** (optional) | Image transforms, CDN | Free tier (25GB) |
| **8** | **PostHog** | Product analytics | Free tier (1M events/mo) |
| **9** | **Stripe** (if needed) | Payments for premium features | 1.4% + €0.25/tx |
| **Post-launch** | **OneSignal/FCM** | Push notifications | Free tier |
| **Post-launch** | **Plausible** | Privacy-friendly web analytics | €9/mo |

---

## 14. Cost Estimates

### At Launch (< 500 users)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Supabase | Free tier | €0 |
| Vercel | Free tier | €0 |
| Google Maps | Free credit ($200) | €0 |
| Resend | Free tier (100 emails/day) | €0 |
| Sentry | Free tier | €0 |
| Domain (bridebook.de) | Annual | ~€1/mo |
| **Total** | | **~€1/mo** |

### Growth Phase (500–1,000 users)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Supabase | Pro | €25 |
| Vercel | Pro | €20 |
| Google Maps | Free credit likely sufficient | €0 |
| Resend | Starter | €20 |
| Sentry | Free tier | €0 |
| Cloudinary | Plus | €89 |
| PostHog | Free tier | €0 |
| Domain | Annual | ~€1 |
| **Total** | | **~€155/mo** |

### Scale Phase (1,000+ users)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Supabase | Pro (+ compute add-on) | €50 |
| Vercel | Pro | €20 |
| Google Maps | Overage possible | ~€50 |
| Resend | Business | €50 |
| Sentry | Team | €26 |
| Cloudinary | Plus | €89 |
| PostHog | Free tier | €0 |
| Stripe | Per transaction (1.4% + €0.25) | Variable |
| Domain | Annual | ~€1 |
| **Total** | | **~€286/mo + Stripe fees** |

---

## 15. Launch Checklist

### P0 Go/No-Go

**Auth & Users:**
- [ ] Signup flow works (email + password)
- [ ] Login flow works (email + password)
- [ ] OAuth works (Google at minimum)
- [ ] Email verification sends and confirms
- [ ] Password reset flow works end-to-end
- [ ] Session refresh works (token rotation)
- [ ] Profile edit works (name, email, avatar)
- [ ] Account deletion triggers 30-day grace period

**Vendor Search & Detail:**
- [ ] Vendor search returns results for all seeded categories
- [ ] Category filter works
- [ ] Region/city filter works
- [ ] Price range filter works
- [ ] Search pagination works
- [ ] Vendor detail page loads with images, info, packages
- [ ] Vendor availability calendar displays correctly
- [ ] Google Maps integration shows vendor locations

**Favorites & Enquiry:**
- [ ] Favorites add/remove works from search results and detail page
- [ ] Favorites list page displays correctly
- [ ] Enquiry form submits with all required fields
- [ ] Enquiry creates conversation thread
- [ ] Vendor receives email notification for new enquiry

**Legal & Compliance:**
- [ ] Impressum page live with accurate company info
- [ ] Datenschutzerklärung page live (lawyer-reviewed)
- [ ] AGB page live (lawyer-reviewed)
- [ ] Cookie consent dialog appears on first visit
- [ ] Cookie consent respects granular choices (required/analytics/marketing)
- [ ] GDPR data export endpoint works (`POST /users/me/export`)
- [ ] GDPR account deletion works (`DELETE /users/me`)
- [ ] All forms have proper validation and error messages

**Performance & Quality:**
- [ ] Core Web Vitals pass: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No critical or high security vulnerabilities (OWASP scan)
- [ ] SSL configured, HTTPS enforced
- [ ] Error monitoring active (Sentry)
- [ ] All pages responsive (mobile/tablet/desktop)
- [ ] 50+ seed vendors in database across 5+ categories

---

### P1 Go/No-Go

- [ ] Dashboard loads with countdown, quick actions, dream team
- [ ] Budget calculator wizard completes and produces realistic breakdown
- [ ] Budget line items are editable (estimated, booked, notes)
- [ ] Budget reset works with confirmation
- [ ] Guest list: add single guest works
- [ ] Guest list: bulk import (multi-line) works
- [ ] Guest list: groups can be created and assigned
- [ ] Guest list: RSVP status can be updated
- [ ] Checklist loads from templates with correct time periods
- [ ] Checklist tasks can be toggled (todo → done)
- [ ] Custom tasks can be added
- [ ] Message threads display correctly with sender info
- [ ] Messages can be sent within a thread
- [ ] Message threads can be archived
- [ ] Guest list CSV export works
- [ ] Budget CSV/PDF export works
- [ ] All P0 regression tests still pass

---

### P2 Go/No-Go

- [ ] Homepage builder: create page with names, date, story
- [ ] Homepage builder: select design theme and font
- [ ] Homepage builder: upload photos
- [ ] Homepage builder: publish creates public URL
- [ ] Homepage builder: password protection works
- [ ] Reviews can be submitted with ratings and text
- [ ] Reviews display on vendor detail page with rating breakdown
- [ ] Real-time notifications deliver via WebSocket
- [ ] Notification preferences toggles work
- [ ] Team member invitation sends email
- [ ] Team member can access shared wedding
- [ ] Public RSVP form submits and updates guest status
- [ ] Advanced filters (venue type, style, features) return correct results
- [ ] Map view clusters vendors correctly
- [ ] Performance under load: 100 concurrent users, < 3s response time
- [ ] All P0+P1 regression tests still pass

---

## Appendix: Component Count Summary

| Doc | Category | Count |
|-----|----------|-------|
| 01-DATABASE-SCHEMA | Tables | 30 |
| 10-API-STRUCTURE | REST Endpoints | 119 |
| 10-API-STRUCTURE | WebSocket Events | 9 |
| 10-API-STRUCTURE | Webhook Events | 8 |
| 03-UI-COMPONENTS | Components | 50 |
| 08-FORMS-ANALYSIS | Forms | 34 |
| 08-FORMS-ANALYSIS | Total Fields | ~155 |
| 07-SITEMAP-NAVIGATION | Routes | ~40 |
