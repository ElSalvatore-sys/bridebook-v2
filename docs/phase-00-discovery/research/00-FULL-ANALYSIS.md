<!-- 
  ╔══════════════════════════════════════════════════════════════╗
  ║         BRIDEBOOK WEDDING PLATFORM — FULL ANALYSIS          ║
  ║                    MASTER REFERENCE FILE                     ║
  ╚══════════════════════════════════════════════════════════════╝
-->

# Bridebook Wedding Platform — Complete Analysis

---

## Part 0: Document Metadata

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Created** | 2026-02-03 |
| **Source** | 61 screenshots from Bridebook.com |
| **Author** | Claude Code analysis |
| **Total Lines** | ~16,000+ |
| **Documents** | 13 individual analyses |
| **Format** | Markdown (CommonMark) |

---

## Part 1: Executive Summary

Bridebook is a **German-market wedding planning platform** (locale: `de-DE`) that connects couples with wedding vendors across categories like venues, photographers, florists, caterers, and more. This analysis reverse-engineers the platform from 61 desktop screenshots into 13 specification documents covering every layer of the product.

### What's Covered

| Doc | Topic | Lines | Key Deliverable |
|-----|-------|-------|-----------------|
| 01 | Database Schema | 561 | Full PostgreSQL DDL — 30+ tables, indexes, RLS |
| 02 | User Flows | 886 | 15+ end-to-end flows (onboarding → booking → planning) |
| 03 | UI Components | 1,120 | 50+ React/TypeScript component specs |
| 04 | Wireframes | 1,348 | ASCII box-drawing layouts for every key screen |
| 05 | Design Tokens | 840 | CSS custom properties + Tailwind config |
| 06 | Micro-Interactions | 2,669 | Animation timing, transitions, loading states |
| 07 | Sitemap & Navigation | 658 | Full URL structure + nav hierarchy |
| 08 | Forms Analysis | 739 | Field-level specs for every form |
| 09 | Settings Pages | 404 | Account, notification, privacy settings |
| 10 | API Structure | 3,422 | 119 REST endpoints, OpenAPI-compatible |
| 11 | Responsive Design | 938 | Breakpoints, layout adaptation strategies |
| 12 | Accessibility | 1,239 | WCAG 2.1 AA + BITV 2.0 compliance |
| 13 | MVP Priorities | 1,116 | P0–P4 tiers, sprint plan, cost estimates |

### Tech Stack (Recommended)

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  Next.js 14 · React 18 · TypeScript · Tailwind  │
│  Framer Motion · React Hook Form · Zod          │
├─────────────────────────────────────────────────┤
│                   BACKEND                        │
│  Supabase (Auth + DB + Storage + Realtime)      │
│  PostgreSQL 15+ · Row Level Security            │
│  Edge Functions (Deno)                          │
├─────────────────────────────────────────────────┤
│                 INFRASTRUCTURE                   │
│  Vercel (hosting) · Supabase Cloud              │
│  Cloudinary (images) · Resend (email)           │
│  Google Maps API · Stripe (payments)            │
└─────────────────────────────────────────────────┘
```

### Priority Tiers at a Glance

```
                    ▲
                   /P0\        Core MVP (Auth, Search, Vendors, Enquiry, GDPR)
                  /────\       50 endpoints · 12 tables · ~100 form fields
                 / P1   \      Planning Tools (Dashboard, Budget, Guests, Tasks)
                /────────\     36 endpoints · 6 tables · ~33 fields
               /   P2     \    Engagement (Homepage Builder, Reviews, Map)
              /────────────\   25 endpoints · ~50 fields
             /     P3       \  Premium (Real-time Chat, Notifications, Analytics)
            /────────────────\ 15 endpoints
           /       P4         \Delight (AI, Seating, Video, Integrations)
          /────────────────────\
```

---

## Part 1b: How to Use This Document

### Table of Contents (Anchor Links)

- [Part 0: Document Metadata](#part-0-document-metadata)
- [Part 1: Executive Summary](#part-1-executive-summary)
- [Part 1b: How to Use This Document](#part-1b-how-to-use-this-document)
- [Part 2: Quick Reference Tables](#part-2-quick-reference-tables)
- [Part 2b: Visual Summaries](#part-2b-visual-summaries)
- [Part 3: Complete Documents](#part-3-complete-documents)
  - [Doc 01 — Database Schema](#doc-01--database-schema)
  - [Doc 02 — User Flows](#doc-02--user-flows)
  - [Doc 03 — UI Components](#doc-03--ui-components)
  - [Doc 04 — Wireframes](#doc-04--wireframes)
  - [Doc 05 — Design Tokens](#doc-05--design-tokens)
  - [Doc 06 — Micro-Interactions](#doc-06--micro-interactions)
  - [Doc 07 — Sitemap & Navigation](#doc-07--sitemap--navigation)
  - [Doc 08 — Forms Analysis](#doc-08--forms-analysis)
  - [Doc 09 — Settings Pages](#doc-09--settings-pages)
  - [Doc 10 — API Structure](#doc-10--api-structure)
  - [Doc 11 — Responsive Design](#doc-11--responsive-design)
  - [Doc 12 — Accessibility](#doc-12--accessibility)
  - [Doc 13 — MVP Priorities](#doc-13--mvp-priorities)
- [Part 4: Cross-Reference Index](#part-4-cross-reference-index)
- [Part 4b: Glossary](#part-4b-glossary)
- [Part 5: Next Steps Checklist](#part-5-next-steps-checklist)

### Search Tips for This File

- **Cmd/Ctrl + F** — Search for table names (`CREATE TABLE`), component names, endpoint paths (`/api/v1/`)
- **Search `## Doc`** — Jump between documents
- **Search `### P0`**, `### P1`, etc. — Jump to priority tiers
- **Search `═══`** — Jump to document separators

### Individual Document Links

For easier editing, each document lives at:

```
docs/01-DATABASE-SCHEMA.md      docs/08-FORMS-ANALYSIS.md
docs/02-USER-FLOWS.md           docs/09-SETTINGS-PAGES.md
docs/03-UI-COMPONENTS.md        docs/10-API-STRUCTURE.md
docs/04-WIREFRAMES.md           docs/11-RESPONSIVE-DESIGN.md
docs/05-DESIGN-TOKENS.md        docs/12-ACCESSIBILITY.md
docs/06-MICRO-INTERACTIONS.md   docs/13-MVP-PRIORITIES.md
docs/07-SITEMAP-NAVIGATION.md
```

---

## Part 2: Quick Reference Tables

### Database Tables Overview

| Table | Doc 01 Section | P-Tier | Key Relationships |
|-------|---------------|--------|-------------------|
| `users` | §1 Users & Auth | P0 | → sessions, weddings, reviews |
| `user_sessions` | §1 | P0 | → users |
| `password_resets` | §1 | P0 | → users |
| `weddings` | §2 | P0 | → users (couple), settings, guests, tasks |
| `wedding_settings` | §2 | P0 | → weddings |
| `vendors` | §3 | P0 | → categories, regions, images, packages |
| `categories` | §3 | P0 | Vendor taxonomy |
| `subcategories` | §3 | P0 | → categories |
| `regions` | §4 | P0 | Geographic hierarchy |
| `cities` | §4 | P0 | → regions |
| `vendor_images` | §3 | P0 | → vendors |
| `vendor_packages` | §3 | P0 | → vendors |
| `vendor_hours` | §3 | P0 | → vendors |
| `vendor_availability` | §3 | P0 | → vendors |
| `favorites` | §5 | P0 | → weddings, vendors |
| `enquiries` | §6 | P0 | → weddings, vendors |
| `messages` | §6 | P1 | → enquiries |
| `message_attachments` | §6 | P1 | → messages |
| `budget_categories` | §7 | P1 | → weddings |
| `budget_items` | §7 | P1 | → budget_categories |
| `payments` | §7 | P1 | → budget_items |
| `guests` | §8 | P1 | → weddings, guest_groups |
| `guest_groups` | §8 | P1 | → weddings |
| `tasks` | §9 | P1 | → weddings |
| `task_templates` | §9 | P1 | Seed data |
| `reviews` | §10 | P2 | → vendors, users |
| `bookings` | §11 | P2 | → weddings, vendors |
| `notifications` | §12 | P3 | → users |

### API Endpoint Summary

| Resource | Method Distribution | Count | P-Tier |
|----------|-------------------|-------|--------|
| Auth | POST-heavy | 10 | P0 |
| Users | GET/PATCH | 7 | P0 |
| Weddings | CRUD | 7 | P0 |
| Vendors | GET | 8 | P0 |
| Favorites | CRUD | 4 | P0 |
| Enquiries | CRUD | 5 | P0 |
| Uploads | POST/GET/DELETE | 4 | P0 |
| Budget | Full CRUD | 11 | P1 |
| Guests | Full CRUD + Import | 9 | P1 |
| Tasks | Full CRUD + Templates | 7 | P1 |
| Messages | CRUD + Read/Archive | 6 | P1 |
| Exports | POST/GET | 3 | P1 |
| Homepage | Full CRUD + Publish | 11 | P2 |
| Reviews | CRUD | 4 | P2 |
| Search | GET | 3 | P0-P2 |
| Analytics | GET | 4 | P1-P3 |
| **Total** | | **~119** | |

### Component Count by Category

| Category | Components | Primary Doc |
|----------|-----------|-------------|
| Layout | SplitLayout, SidebarNav, PageHeader, Footer | 03, 11 |
| Navigation | TabBar, Breadcrumb, Pagination, SearchBar | 03, 07 |
| Forms | TextInput, Select, Checkbox, ChipSelect, Textarea, ToggleSwitch | 03, 08 |
| Display | VenueCard, Badge, Avatar, RatingStars, ProgressBar, Carousel | 03 |
| Feedback | Toast, Modal, EmptyState, SkeletonLoader, LoadingIndicator | 03, 06 |
| Maps | Map, LocationInput | 03 |
| Media | ImageGallery, AvatarUpload | 03 |

---

## Part 2b: Visual Summaries

### Feature Priority Pyramid (P0 → P4)

```
P0 — CORE MVP (Launch Blockers)
├── User Auth (email + OAuth)
├── Wedding Setup Wizard
├── Vendor Search + Filters (82 filter options)
├── Vendor Detail Pages
├── Favorites System
├── Basic Enquiry/Contact
├── File Uploads
└── GDPR + Legal Pages (Impressum, Datenschutz, AGB)

P1 — PLANNING TOOLS (Core Engagement)
├── Couple Dashboard
├── Budget Calculator + Wizard
├── Guest List CRUD + Import
├── Task Checklist + Templates
├── Basic Messaging
└── Data Export (CSV/PDF)

P2 — ENGAGEMENT & GROWTH
├── Wedding Homepage Builder (12 forms!)
├── Advanced Filters + Map View
├── Reviews System
├── Vendor Dashboard (Basic)
└── Bookings Management

P3 — PREMIUM FEATURES
├── Real-time Chat (WebSocket)
├── Push Notifications
├── Advanced Analytics
├── Partner/Collaborator Invite
└── Vendor Premium Tier

P4 — DELIGHT & DIFFERENTIATION
├── AI Vendor Recommendations
├── Seating Chart Builder
├── Video Consultations
├── Calendar Integrations
└── Multi-language (EN/TR/AR)
```

### Database ERD Summary (Text-Based)

```
users ─────────┬──── weddings ─────┬──── guests
  │             │        │          │      │
  │             │        │          │    guest_groups
  │             │        │          │
  │             │        ├──── budget_categories ── budget_items ── payments
  │             │        │
  │             │        ├──── tasks
  │             │        │
  │             │        ├──── favorites ──── vendors
  │             │        │                      │
  │             │        ├──── enquiries        ├── vendor_images
  │             │        │       │              ├── vendor_packages
  │             │        │     messages         ├── vendor_hours
  │             │        │                      ├── vendor_availability
  │             │        └──── wedding_settings └── reviews
  │             │
  ├── user_sessions
  ├── password_resets
  └── notifications

vendors ──── categories ──── subcategories
   │
   └──── regions ──── cities
```

### User Journey Overview

```
Landing Page → Sign Up (Email/OAuth)
     │
     ▼
Onboarding Wizard (Wedding Date, Location, Budget, Guest Count)
     │
     ▼
Dashboard ─────┬──── Vendor Search → Filter → Detail → Enquiry → Message
               ├──── Budget Calculator → Categories → Line Items
               ├──── Guest List → Add/Import → Groups → RSVP
               ├──── Task Checklist → Templates → Track Progress
               └──── Wedding Homepage → Customize → Publish → Share
```

### Tech Stack Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Next.js  │  │ React 18 │  │ Tailwind │  │   Framer   │  │
│  │   14     │  │   + TS   │  │   CSS    │  │   Motion   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     SUPABASE LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Auth   │  │ Postgres │  │ Storage  │  │  Realtime  │  │
│  │  (JWT)   │  │  15+ RLS │  │  (S3)    │  │  (WS)      │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    THIRD-PARTY                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Google  │  │  Stripe  │  │ Resend   │  │ Cloudinary │  │
│  │  Maps    │  │ Payments │  │  Email   │  │  Images    │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   DEPLOYMENT                                 │
│  ┌──────────────────────┐  ┌────────────────────────────┐   │
│  │   Vercel (Frontend)  │  │  Supabase Cloud (Backend)  │   │
│  └──────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: Complete Documents

Each document below is the full, unmodified content from its source file.



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 01                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-01--DATABASE-SCHEMA"></a>

### Doc 01 — DATABASE SCHEMA

> Source: `docs/01-DATABASE-SCHEMA.md` ·      561 lines

# Database Schema — Bridebook Wedding Planning Platform

> **Engine:** PostgreSQL 15+
> **Primary Keys:** UUID v4
> **Timestamps:** `TIMESTAMPTZ` everywhere
> **Naming:** `snake_case`, singular table names

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. USERS & AUTH
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('couple', 'vendor', 'admin')),
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    avatar_url      TEXT,
    phone           TEXT,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);
CREATE INDEX idx_users_role ON users (role);

CREATE TABLE user_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    ip_address      INET,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions (expires_at);

CREATE TABLE password_resets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    used            BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_resets_user_id ON password_resets (user_id);

-- ============================================================
-- 2. WEDDINGS
-- ============================================================

CREATE TABLE weddings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner1_name   TEXT NOT NULL,
    partner2_name   TEXT NOT NULL,
    wedding_date    DATE,
    venue_city      TEXT,
    estimated_guests INT CHECK (estimated_guests >= 0),
    total_budget    NUMERIC(12,2) CHECK (total_budget >= 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    status          TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weddings_user_id ON weddings (user_id);
CREATE INDEX idx_weddings_date ON weddings (wedding_date);

CREATE TABLE wedding_settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL UNIQUE REFERENCES weddings(id) ON DELETE CASCADE,
    preferences     JSONB NOT NULL DEFAULT '{}',
    privacy         TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('private', 'shared', 'public')),
    theme           TEXT,
    locale          TEXT NOT NULL DEFAULT 'de-DE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN wedding_settings.preferences IS 'Free-form couple preferences: style, colors, dietary, etc.';

-- ============================================================
-- 3. CATEGORIES & GEOGRAPHY
-- ============================================================

CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL UNIQUE,
    slug            TEXT NOT NULL UNIQUE,
    icon            TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subcategories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (category_id, slug)
);

CREATE INDEX idx_subcategories_category_id ON subcategories (category_id);

CREATE TABLE regions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL UNIQUE,
    slug            TEXT NOT NULL UNIQUE,
    country_code    TEXT NOT NULL DEFAULT 'DE' CHECK (char_length(country_code) = 2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id       UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (region_id, slug)
);

CREATE INDEX idx_cities_region_id ON cities (region_id);
CREATE INDEX idx_cities_name_trgm ON cities USING gin (name gin_trgm_ops);

-- ============================================================
-- 4. VENDORS
-- ============================================================

CREATE TABLE vendors (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id  UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    city_id         UUID REFERENCES cities(id) ON DELETE SET NULL,
    business_name   TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    cover_image_url TEXT,
    website         TEXT,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    min_price       NUMERIC(10,2) CHECK (min_price >= 0),
    max_price       NUMERIC(10,2) CHECK (max_price >= 0),
    avg_rating      NUMERIC(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    review_count    INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (max_price IS NULL OR min_price IS NULL OR max_price >= min_price)
);

CREATE INDEX idx_vendors_category_id ON vendors (category_id);
CREATE INDEX idx_vendors_subcategory_id ON vendors (subcategory_id);
CREATE INDEX idx_vendors_city_id ON vendors (city_id);
CREATE INDEX idx_vendors_status ON vendors (status);
CREATE INDEX idx_vendors_name_trgm ON vendors USING gin (business_name gin_trgm_ops);
CREATE INDEX idx_vendors_featured ON vendors (is_featured) WHERE is_featured = TRUE;

COMMENT ON COLUMN vendors.metadata IS 'Vendor-specific attributes: capacity, amenities, languages, etc.';

CREATE TABLE vendor_images (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_images_vendor_id ON vendor_images (vendor_id);

CREATE TABLE vendor_packages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_packages_vendor_id ON vendor_packages (vendor_id);

CREATE TABLE vendor_availability (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vendor_id, date)
);

CREATE INDEX idx_vendor_availability_lookup ON vendor_availability (vendor_id, date, status);

CREATE TABLE vendor_hours (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time       TIME NOT NULL,
    close_time      TIME NOT NULL,
    is_closed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vendor_id, day_of_week)
);

COMMENT ON COLUMN vendor_hours.day_of_week IS '0 = Monday, 6 = Sunday (ISO 8601)';

CREATE INDEX idx_vendor_hours_vendor_id ON vendor_hours (vendor_id);

-- ============================================================
-- 5. INTERACTIONS
-- ============================================================

CREATE TABLE enquiries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    subject         TEXT,
    wedding_date    DATE,
    guest_count     INT CHECK (guest_count >= 0),
    budget_range    TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'booked', 'declined', 'archived')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_enquiries_wedding_id ON enquiries (wedding_id);
CREATE INDEX idx_enquiries_vendor_id ON enquiries (vendor_id);
CREATE INDEX idx_enquiries_status ON enquiries (status);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id      UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body            TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_enquiry_id ON messages (enquiry_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);

CREATE TABLE message_attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id      UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_url        TEXT NOT NULL,
    file_name       TEXT NOT NULL,
    file_size       INT CHECK (file_size > 0),
    mime_type       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_attachments_message_id ON message_attachments (message_id);

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    overall_rating  SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    quality_rating  SMALLINT CHECK (quality_rating BETWEEN 1 AND 5),
    value_rating    SMALLINT CHECK (value_rating BETWEEN 1 AND 5),
    service_rating  SMALLINT CHECK (service_rating BETWEEN 1 AND 5),
    title           TEXT,
    body            TEXT,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    vendor_reply    TEXT,
    vendor_replied_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_reviews_vendor_id ON reviews (vendor_id);
CREATE INDEX idx_reviews_wedding_id ON reviews (wedding_id);
CREATE INDEX idx_reviews_published ON reviews (vendor_id, is_published) WHERE is_published = TRUE;

CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_favorites_wedding_id ON favorites (wedding_id);
CREATE INDEX idx_favorites_vendor_id ON favorites (vendor_id);

-- ============================================================
-- 6. PLANNING
-- ============================================================

CREATE TABLE task_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    months_before   INT CHECK (months_before >= 0),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN task_templates.months_before IS 'Suggested months before wedding to complete this task';

CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    template_id     UUID REFERENCES task_templates(id) ON DELETE SET NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    due_date        DATE,
    status          TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'skipped')),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_wedding_id ON tasks (wedding_id);
CREATE INDEX idx_tasks_status ON tasks (wedding_id, status);

CREATE TABLE guest_groups (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guest_groups_wedding_id ON guest_groups (wedding_id);

CREATE TABLE guests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    group_id        UUID REFERENCES guest_groups(id) ON DELETE SET NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    rsvp_status     TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined', 'maybe')),
    dietary_notes   TEXT,
    plus_one        BOOLEAN NOT NULL DEFAULT FALSE,
    is_child        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_wedding_id ON guests (wedding_id);
CREATE INDEX idx_guests_group_id ON guests (group_id);
CREATE INDEX idx_guests_rsvp ON guests (wedding_id, rsvp_status);

CREATE TABLE seating_tables (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    capacity        INT NOT NULL CHECK (capacity > 0),
    table_type      TEXT NOT NULL DEFAULT 'round' CHECK (table_type IN ('round', 'rectangular', 'u_shape', 'custom')),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seating_tables_wedding_id ON seating_tables (wedding_id);

CREATE TABLE seating_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id        UUID NOT NULL REFERENCES seating_tables(id) ON DELETE CASCADE,
    guest_id        UUID NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
    seat_number     INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seating_assignments_table_id ON seating_assignments (table_id);

-- ============================================================
-- 7. BUDGET
-- ============================================================

CREATE TABLE budget_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    allocated       NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (allocated >= 0),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_categories_wedding_id ON budget_categories (wedding_id);

CREATE TABLE budget_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
    vendor_id       UUID REFERENCES vendors(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    estimated_cost  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
    actual_cost     NUMERIC(10,2) CHECK (actual_cost >= 0),
    status          TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'paid', 'cancelled')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_items_category_id ON budget_items (category_id);
CREATE INDEX idx_budget_items_vendor_id ON budget_items (vendor_id);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_item_id  UUID NOT NULL REFERENCES budget_items(id) ON DELETE CASCADE,
    amount          NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    method          TEXT CHECK (method IN ('bank_transfer', 'credit_card', 'cash', 'paypal', 'other')),
    paid_at         DATE NOT NULL,
    reference       TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_budget_item_id ON payments (budget_item_id);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT,
    data            JSONB,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;

COMMENT ON COLUMN notifications.data IS 'Structured payload: entity type, entity id, action, deep link, etc.';

CREATE TABLE email_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    to_address      TEXT NOT NULL,
    template        TEXT NOT NULL,
    subject         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'bounced')),
    provider_id     TEXT,
    error           TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user_id ON email_logs (user_id);
CREATE INDEX idx_email_logs_status ON email_logs (status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
            t, t
        );
    END LOOP;
END;
$$;
```

## Table Summary

| # | Group | Table | Rows (est. year 1) |
|---|-------|-------|---------------------|
| 1 | Auth | `users` | 10k |
| 2 | Auth | `user_sessions` | 50k |
| 3 | Auth | `password_resets` | 2k |
| 4 | Weddings | `weddings` | 5k |
| 5 | Weddings | `wedding_settings` | 5k |
| 6 | Categories | `categories` | ~15 |
| 7 | Categories | `subcategories` | ~60 |
| 8 | Categories | `regions` | ~16 |
| 9 | Categories | `cities` | ~200 |
| 10 | Vendors | `vendors` | 3k |
| 11 | Vendors | `vendor_images` | 15k |
| 12 | Vendors | `vendor_packages` | 9k |
| 13 | Vendors | `vendor_availability` | 100k |
| 14 | Vendors | `vendor_hours` | 21k |
| 15 | Interactions | `enquiries` | 20k |
| 16 | Interactions | `messages` | 80k |
| 17 | Interactions | `message_attachments` | 10k |
| 18 | Interactions | `reviews` | 5k |
| 19 | Interactions | `favorites` | 25k |
| 20 | Planning | `task_templates` | ~100 |
| 21 | Planning | `tasks` | 50k |
| 22 | Planning | `guest_groups` | 15k |
| 23 | Planning | `guests` | 150k |
| 24 | Planning | `seating_tables` | 10k |
| 25 | Planning | `seating_assignments` | 100k |
| 26 | Budget | `budget_categories` | 25k |
| 27 | Budget | `budget_items` | 50k |
| 28 | Budget | `payments` | 30k |
| 29 | Notifications | `notifications` | 200k |
| 30 | Notifications | `email_logs` | 100k |

**Total: 30 tables**

## Key Design Decisions

1. **UUIDs over serial IDs** — safe for distributed systems, no enumeration attacks
2. **CHECK constraints for enums** — lightweight, no extra tables; easy to extend with `ALTER TABLE ... DROP/ADD CONSTRAINT`
3. **JSONB for flexible data** — `wedding_settings.preferences`, `vendors.metadata`, `notifications.data` avoid schema sprawl
4. **Trigram indexes** — `pg_trgm` on `users.email`, `vendors.business_name`, `cities.name` for fuzzy/typeahead search
5. **Partial indexes** — unread notifications, published reviews, featured vendors for hot-path queries
6. **One review per wedding×vendor** — UNIQUE constraint prevents duplicates
7. **Auto `updated_at`** — single trigger function applied dynamically to all tables with the column
8. **`vendor_availability` unique on (vendor_id, date)** — prevents double-booking at the DB level
9. **`seating_assignments.guest_id` UNIQUE** — a guest can only sit at one table



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 02                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-02--USER-FLOWS"></a>

### Doc 02 — USER FLOWS

> Source: `docs/02-USER-FLOWS.md` ·      886 lines

# Bridebook Wedding Platform — User Flows

> Comprehensive documentation of all user-facing flows derived from 61 platform screenshots.
> German-language UI (locale: `de-DE`). All labels reflect the live platform text.

---

## Table of Contents

1. [Onboarding & Authentication](#1-onboarding--authentication)
2. [Vendor Discovery & Search](#2-vendor-discovery--search)
3. [Enquiry & Booking](#3-enquiry--booking)
4. [Favorites Management](#4-favorites-management)
5. [Planning Tools](#5-planning-tools)
6. [Settings & Account](#6-settings--account)
7. [Wedding Homepage (Hochzeitshomepage)](#7-wedding-homepage-hochzeitshomepage)
8. [Additional / Inferred Flows](#8-additional--inferred-flows)

---

## Screenshot → Flow Mapping

| # | Screenshot File | Flow Section |
|---|----------------|-------------|
| 1 | `landing page. .png` | 1 — Onboarding |
| 2 | `Sign up modal (Google:Apple:Email options).png` | 1 — Onboarding |
| 3 | `Main dashboard overview (countdown, progress, quick actions).png` | 1 — Onboarding |
| 4 | `homepage pt2.png` | 2 — Vendor Discovery |
| 5 | `homepage pt3.png` | 2 — Vendor Discovery |
| 6 | `homepaget pt4.png` | 2 — Vendor Discovery |
| 7 | `location und dienstleister.png` | 2 — Vendor Discovery |
| 8 | `location pt2 the map view and locations.png` | 2 — Vendor Discovery |
| 9 | `location pt3 budget firendly.png` | 2 — Vendor Discovery |
| 10 | `locaiton pt4.png` | 2 — Vendor Discovery |
| 11 | `location und dienstleister filters.png` | 2 — Vendor Discovery |
| 12 | `location und dienstleister filters pt2.png` | 2 — Vendor Discovery |
| 13 | `location und dienstleister filters pt3.png` | 2 — Vendor Discovery |
| 14 | `location und dienstleister filters pt4.png` | 2 — Vendor Discovery |
| 15 | `location und dienstleister filters PT 5.png` | 2 — Vendor Discovery |
| 16 | `location - catering.png` | 2 — Vendor Discovery |
| 17 | `location - florists.png` | 2 — Vendor Discovery |
| 18 | `location - photograph.png` | 2 — Vendor Discovery |
| 19 | `location - transport.png` | 2 — Vendor Discovery |
| 20 | `locatons when pressed and trying to book the email with template.png` | 3 — Enquiry |
| 21 | `location when venue is clicked email template and message pt 2.png` | 3 — Enquiry |
| 22 | `locaiton when venue is choosen the email template the edit button to edit information.png` | 3 — Enquiry |
| 23 | `messages pt1.png` | 3 — Enquiry |
| 24 | `messages pt2.png` | 3 — Enquiry |
| 25 | `messages pt3.png` | 3 — Enquiry |
| 26 | `messages pt4.png` | 3 — Enquiry |
| 27 | `favourites.png` | 4 — Favorites |
| 28 | `favourites when favourites hinzufugen is clicked.png` | 4 — Favorites |
| 29 | `planungs pic.png` | 5 — Planning Tools |
| 30 | `PLANUNGS tool pt2.png` | 5 — Planning Tools |
| 31 | `planungs tool pt3.png` | 5 — Planning Tools |
| 32 | `planungs tool pt4.png` | 5 — Planning Tools |
| 33 | `planungs tool pt5.png` | 5 — Planning Tools |
| 34 | `planungs tool budget icon pt 1 .png` | 5 — Budget |
| 35 | `planungs tool budget icon pt 2.png` | 5 — Budget |
| 36 | `planungs tool budget icon after budget inserted pt1.png` | 5 — Budget |
| 37 | `planungs tool budget icon after budget inserted pt2.png` | 5 — Budget |
| 38 | `planungs tool budget icon after budget inserted pt3.png` | 5 — Budget |
| 39 | `planungs tool budget icon after budget inserted pt4.png` | 5 — Budget |
| 40 | `planungs tool budget icon after budget inserted pt5.png` | 5 — Budget |
| 41 | `planungs tool budget icon after budget inserted and again hochzeit is pressed .png` | 5 — Budget |
| 42 | `planungs tool budget icon after budget inserted and hochzeit is clicked and the buttom look for venues is pressed.png` | 5 — Budget |
| 43 | `planungstool gästelist.png` | 5 — Guest List |
| 44 | `planungstool gäästelist when clciked.png` | 5 — Guest List |
| 45 | `planungstool ratschlag pt 1.png` | 5 — Advice |
| 46 | `planungstool ratschlag pt 2.png` | 5 — Advice |
| 47 | `planungstool ratschlag pt 3.png` | 5 — Advice |
| 48 | `settings pt1.png` | 6 — Settings |
| 49 | `settings pt2.png` | 6 — Settings |
| 50 | `settings pt3.png` | 6 — Settings |
| 51 | `settings pt4.png` | 6 — Settings |
| 52 | `settings pt5.png` | 6 — Settings |
| 53 | `hochzeit home page pt1.png` | 7 — Wedding Homepage |
| 54 | `hochzeit home page pt2.png` | 7 — Wedding Homepage |
| 55 | `hochzeit home page pt4.png` | 7 — Wedding Homepage |
| 56 | `hochzeit home page pt5.png` | 7 — Wedding Homepage |
| 57 | `hochzeit home page pt6.png` | 7 — Wedding Homepage |
| 58 | `hochzeit home page pt7.png` | 7 — Wedding Homepage |
| 59 | `hochzeit home page design pt1.png` | 7 — Wedding Homepage |
| 60 | `hochzeit home page design pt2.png` | 7 — Wedding Homepage |
| 61 | `hochzeit home page einstellung.png` | 7 — Wedding Homepage |

**All 61 screenshots accounted for.**

---

## 1. Onboarding & Authentication

**Screenshots:** `landing page. .png`, `Sign up modal (Google:Apple:Email options).png`, `Main dashboard overview (countdown, progress, quick actions).png`

### 1.1 First Visit (Unauthenticated)

```
Step 1: Landing Page → User arrives at bridebook.com → System displays:
  - Hero banner: "Finde deine Traumlocation" with "Los geht's" CTA
  - Right panel: "El & Eli" couple widget with countdown (Tage/Std/Min/Sek)
  - Search bar: Region (Deutschland) + Kategorie (Hochzeitslocations) + "Suche" button
  - "Suche nach Dienstleister Namen" text link below search
  - Quick-link cards: Checkliste, Hochzeitshomepage, Gästeliste, Favoriten, Gebucht
  - Top nav: Locations & Dienstleister ▼, Planungs-Tools ▼, Inspiration, Hochzeitshomepage
  → Step 2
```

```
Step 2: User Action Decision
  IF user clicks "Los geht's" or any authenticated feature → Step 3
  IF user clicks "Suche" → Flow 2 (Vendor Discovery), Step 1
  IF user clicks a quick-link card → Respective flow (each shows "Loslegen" for unconfigured items)
```

### 1.2 Sign Up / Login

```
Step 3: Sign-Up Modal → System displays "Einloggen" page with:
  - Email field (text input)
  - "Mit Apple einloggen" button
  - "Mit Google einloggen" button
  - "Mit E-mail einloggen" button
  - Right panel: QR code ("Scanne den QR Code um jederzeit und von überall auf
    Bridebook zuzugreifen") + wedding photo gallery
  → Step 4

Step 4: Authentication
  IF user selects Apple → System redirects to Apple OAuth → returns with session → Step 5
  IF user selects Google → System redirects to Google OAuth → returns with session → Step 5
  IF user selects Email → System shows email/password form → Step 5
  IF authentication fails → System shows error inline → remains on Step 3
```

### 1.3 Post-Login Dashboard

```
Step 5: Personalized Dashboard → System displays same layout as landing page but with:
  - Personalized couple names: "El & Eli"
  - Countdown widget: "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek"
  - "Klick auf mich" prompt on countdown (clickable to set wedding date)
  - Quick-links now show status counts: "Favoriten (4 gespeichert)", "Gebucht (0 Dienstleister)"
  - Top-right icons: 💬 (messages), ♡ (favorites), ⚙ (settings)
  → User proceeds to any flow
```

### 1.4 No Separate Profile Wizard

Profile data (names, partner name, wedding date, location, roles) is collected via **Settings > Meine Hochzeitsdetails** (see Flow 6). There is no onboarding wizard — the platform is immediately usable after authentication.

---

## 2. Vendor Discovery & Search

**Screenshots:** `homepage pt2–pt4`, `location und dienstleister*`, `location pt2–pt4`, `location - catering/florists/photograph/transport`

### 2.1 Entry Points

```
Step 1: Entry Decision
  IF user clicks "Suche" button on homepage search bar → Step 2 (Search Results)
  IF user clicks "Los geht's" hero CTA → Step 2 (Search Results for Hochzeitslocations)
  IF user clicks vendor category card on homepage → Step 2 (filtered by category)
  IF user clicks "Suche nach Dienstleister Namen" → Step 2 with name-search focus
  IF user clicks "Beliebte Locations in deiner Nähe" card → Step 3 (Vendor Detail)
```

### 2.2 Search Results (List + Map Split View)

```
Step 2: Search Results Page → System displays:
  - Header: "[count] Hochzeitslocations rundum Deutschland"
  - Left panel: Vendor cards with:
    - Photo thumbnail
    - Vendor name + location
    - Star rating (e.g., "5.0 ★ (20)")
    - "Broschüre anfragen" button (purple)
    - "Besichtigungstermine verfügbar" badge (where applicable)
  - Right panel: Interactive map with location pins
  - Top: Filter bar (see Step 4) + result count badge ("10694 Ergebnisse anzeigen")
  - Active filter chips shown inline (e.g., "Schlafbar ✕")
  → Step 3 (click vendor) OR Step 4 (apply filters) OR Step 5 (switch category)
```

### 2.3 Filter Panel

```
Step 4: Filter Panel → User clicks "Filter" or scrolls filter area → System shows:
  - Preiskategorie: Erschwinglich (€), Mäßig (€€), Luxuriös (€€€), Super Luxuriös (€€€€)
  - Gästeanzahl: Bis zu 30, 30+, 50+, 80+, 100+, 150+, 200+ Gäste
  - Deine Must-Haves: Exklusive Nutzung, Unterbringung vor Ort, Ausschankgenehmigung
  - Anzahl an Schlafzimmern (numeric)
  - Art von Location: 20+ checkboxes (Bauernhof, Burg/Schloss, Garten, Hotel, Scheune, etc.)
  - Location Stil: 18+ checkboxes (Bohemien, Glamourös, Historisch, Modern, Rustikal, etc.)
  - Location Features: 15+ checkboxes (Außenbereich, Brautsuite, Kamin, Tanzfläche, etc.)
  - Essen und Trinken (options)
  - Sonderangebot (toggle)
  - Besichtigungen (toggle)
  - Kulturspezialität (options)
  - Diversität & Inklusion (options)
  → User checks options → clicks "Ergebnisse anzeigen" → returns to Step 2 with filtered results
  → "Filter zurücksetzen" clears all → returns to Step 2 unfiltered
```

### 2.4 Category Switching

```
Step 5: Category Results → System displays category-specific results pages:
  - Catering → "location - catering.png"
  - Florists → "location - florists.png"
  - Fotografie → "location - photograph.png"
  - Transport → "location - transport.png"
  Each page has same list+map layout with category-specific vendor cards.
  Filters adapt to category (e.g., no "Schlafzimmer" for florists).
  → Step 3 (click vendor) OR Step 4 (filter) OR Step 5 (switch again)
```

### 2.5 Homepage Discovery Sections

```
Step 6: Homepage Scroll Sections (below search bar):
  - "Beliebte Locations in deiner Nähe": horizontal carousel of 4 venue cards
    (VONACHT, Die Edelscheune, ACHTWERK Events GmbH, Hofgut Maisenburg)
    Each card: photo, name, location, rating stars, review count
  - "Beliebte Location Arten in Deutschland": grid of location type cards
  - "Hochzeitslocations erkunden": worldwide destination grid
  - "Budget-friendly" filtered link
  → Click any card → Step 2 (filtered) or Step 3 (vendor detail)
```

### 2.6 Budget-Friendly Results

```
Step 7: Budget-Friendly Page → System shows search results pre-filtered for
  Preiskategorie: Erschwinglich (€)
  Same list+map layout as Step 2
  → User can further filter or click vendor → Step 3
```

---

## 3. Enquiry & Booking

**Screenshots:** `locatons when pressed and trying to book the email with template.png`, `location when venue is clicked email template and message pt 2.png`, `locaiton when venue is choosen the email template the edit button to edit information.png`, `messages pt1–pt4`

### 3.1 Enquiry Modal

```
Step 1: Vendor Card → User clicks "Broschüre anfragen" on any vendor card → System opens modal:
  "Nachricht an: [VENDOR NAME]"
  - Subtext: "Wir geben eure Daten weiter, damit der Dienstleister sich direkt an euch wenden kann.
    Paare schicken im Durchschnitt mindestens 7 Anfragen."
  - Pre-filled fields (read-only, pencil ✏ icon to edit):
    - E-Mail: [user email]
    - Tel. Nr.: [leer]
    - Vor- und Nachnamen: [couple names]
    - Ideales Datum: [leer]
    - Geschätzte Gästeanzahl: [leer]
  - Checkboxes "Welche Infos möchtet ihr erhalten?":
    ☑ Allgemeine Informationen
    ☐ Preise und Pakete
    ☐ Verfügbarkeit
    ☐ Termin zur Besichtigung
    ☐ Andere
  - "+ Persönliche Nachricht schreiben" expandable link
  - Purple CTA: "Broschüre anfragen"
  → Step 2 (edit data) OR Step 3 (send)
```

### 3.2 Edit Contact Data

```
Step 2: "Daten bearbeiten" Modal → User clicks pencil icon → System shows edit form:
  - E-Mail* (editable text field)
  - Tel. Nr.* with country flag picker (🇩🇪 +49)
  - Dein Name* (text field, pre-filled)
  - Name deines Partners / deiner Partnerin* (text field, pre-filled)
  - Geschätzte Gästeanzahl* (number input with stepper)
  - Ideales Datum* (date picker: "Hochzeitsdatum")
  - "Informationen speichern" purple CTA
  - "Speichern" text link top-right
  → User saves → returns to Step 1 with updated fields
  IF required fields empty → inline validation error → remains on Step 2
```

### 3.3 Send Enquiry

```
Step 3: User clicks "Broschüre anfragen" → System:
  - Sends enquiry to vendor via Bridebook messaging system
  - Shows success confirmation
  - Creates conversation thread in Messages (Flow 3.4)
  - Vendor added to "Gebucht" tracking if applicable
  → Messages inbox
```

### 3.4 Messages Inbox

```
Step 4: Messages Page ("Nachrichten") → System displays:
  - Tabs: Dienstleister | Gäste | Bridebook | Archiviert
  - IF no messages → Empty state: "Noch keine Nachrichten"
    Subtext: "Wenn ihr einer Location oder einem Dienstleister über Bridebook eine
    Nachricht schickt, wird eure Unterhaltung hier angezeigt."
  - IF messages exist → Conversation list with vendor name, last message preview, timestamp
  → User clicks conversation → Thread view with message history
```

### 3.5 Guest Messaging

```
Step 5: Messages > Gäste tab → System shows:
  - Instructions for collecting guest emails via unique shareable link
  - "Adresse anfordern" feature linked to Guest List
  → User shares link → Guests submit contact info → appears in guest list
```

---

## 4. Favorites Management

**Screenshots:** `favourites.png`, `favourites when favourites hinzufugen is clicked.png`

### 4.1 Favorites Page

```
Step 1: "Deine Dienstleister" Page → System displays:
  - Header: ♡ "Deine Dienstleister" + "+ Favorit hinzufügen" button (purple, top-right)
  - Tabs: Locations | Dienstleister | Gebucht
  - IF no favorites saved:
    - "Hochzeitslocations (0)"
    - Empty state icon (magnifying glass)
    - "Hier werden deine favorisierten Locations gespeichert!"
    - Purple CTA: "🔍 Locations entdecken"
    - Text link: "Neuen Favoriten hinzufügen +"
  - Bottom banner: "Teilt Favoriten mit einander, hinterlasst Kommentare und
    erhaltet sofortiges Feedback" + "Partner/in einladen" button (purple outline)
  → Step 2 (add favorite) OR click "Locations entdecken" → Flow 2 (Vendor Discovery)
```

### 4.2 Add Favorite Modal

```
Step 2: "Zu Favoriten hinzufügen" Modal → System displays:
  - Search field: "Gib den Namen eures Dienstleisters ein:" with "🔍 Dienstleister suchen" placeholder
  - Search results appear as user types (autocomplete from Bridebook database)
  - IF vendor not found:
    - "Du findest deinen Dienstleister nicht?"
    - "Manuell hinzufügen" link → manual entry form
    - "Auf Google suchen" link → Google search integration
  → User selects vendor → vendor added to favorites list → returns to Step 1
  → User clicks ✕ → modal closes → returns to Step 1
```

### 4.3 Favorites in Planning Tools

Favorites also appear on the Planning Tools page as "Dreamteam" cards:
- Hochzeitslocations, Fotograf, Florist cards with "Dienstleister hinzufügen" links
- These link directly to the Favorites system

---

## 5. Planning Tools

**Screenshots:** `planungs pic.png`, `PLANUNGS tool pt2–pt5`, `planungs tool budget icon*`, `planungstool gästelist*`, `planungstool ratschlag*`

### 5.1 Planning Hub

```
Step 1: Planungs-Tools Page → System displays:
  - Left panel: Couple card ("El & Eli", Deutschland, "Noch kein Hochzeitsdatum")
    - "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek" + "Los geht's" CTA
  - Center: "Beginnt mit eurer Checkliste" hero with phone mockup + "Loslegen" CTA
  - "Plane mit deinem Partner / deiner Partnerin" banner + "Partnerin einladen" button
  → Step 2 (Planning Grid)

Step 2: Planning Grid → 6 cards:
  | Card | Description | CTA |
  |------|-------------|-----|
  | Budget | "Behaltet euer Budget im Auge" | Loslegen |
  | Gästeliste | "Verwaltet eure Gästeliste – fügt eure Zu-/Absagen" | Loslegen |
  | Homepage | "Eure persönliche Website für Gäste" | Loslegen |
  | Gebucht | "Gebuchte Dienstleister hinzufügen" | Loslegen |
  | Inspiration | "Speichert Fotos, Notizen & Ideen" | Loslegen |
  | Ratschläge | "Nützliche & inspirierende Tipps für euren großen Tag" | Loslegen |
  → User clicks a card → respective sub-flow below
```

### 5.2 Planning Milestones

```
Step 3: Below the grid, system shows milestone tracker:
  - "Genau auf dem richtigen Weg" (on track)
  - "Dream Team" (vendor team assembled)
  - "Eure Favoriten" (favorites saved)
  - "Der erste Gast" (first guest added)
  - "Sieht gut aus" (looking good)
  - "Glückwunsch!" (congratulations)
  Milestones unlock progressively as user completes actions.
```

### 5.3 Vendor Discovery Cards (in Planning)

```
Step 4: "Findet die perfekten Dienstleister" section:
  - Cards: Beauty Team, Fotografie Stil, Traumtorte
  - Each card links to vendor search for that category → Flow 2
```

---

### 5A. Budget Tool

```
Step B1: Budget Wizard → User clicks "Budget" card → System displays:
  - Header: "Lass uns euer Hochzeitsbudget berechnen!"
  - Subtext: "Die Algorithmen von Bridebook berechnen euer Budget basierend auf euren
    Präferenzen und tausend anderen Brautpaaren. Seid ihr bereit?"
  - Fields:
    - "Gebt euer Hochzeitsbudget ein:" € input + "EUR - Euro" currency selector
    - "Wie viele Gäste werden am Hochzeitsempfang teilnehmen?"
      Chips: Unentschlossen | Weniger als 50 | 50-99 | 100-149 | 150-250 | Mehr als 250
    - "An welchem Wochentag findet eure Hochzeit statt?"
      Chips: Unentschlossen | Mo.-Do. | Freitag | Samstag | Sonntag
    - "Zu welcher Jahreszeit findet eure Hochzeit statt?"
      Chips: Unentschlossen | Hochsaison (Mai bis Sep) | Nebensaison (andere Monate) | Weihnachtszeit
    - "Für wann ist eure Hochzeit geplant?"
      Chips: Unentschlossen | 2026 | 2027 | 2028 | 2029 und später
    - "Wählt optionale Kategorien, die ihr im Budget DABEI haben wollt:"
      Toggles: Videograf, Planer, Live-Band, Versicherung, Entertainer, Papeterie
  - CTA: "Mein Hochzeitsbudget berechnen" (purple)
  → Step B2

Step B2: Loading Animation → System displays:
  - Camera icon animation
  - "Zahlenverarbeitung im Gange" text
  - Animated dots (blue, pink, green, yellow)
  → Calculation completes → Step B3

Step B3: Budget Breakdown ("Budgetaufschlüsselung") → System displays:
  - Header row: Maximales Budget (e.g., 50.000 €) | Geschätzte Kosten (50.000 €) | Kosten bisher (0 €)
  - "Budget zurücksetzen" button (outline) | "+ Neues Element hinzufügen" button (purple)
  - Edit icon (✏) next to Maximales Budget for quick adjustment

  Category: "Hochzeitslocations & Dienstleister"
    | Item | Estimated | Actual | Action |
    |------|-----------|--------|--------|
    | Hochzeitslocation | zirka 12.624 € | 0 € | > expand |
    | Florist | zirka 2.770 € | 0 € | > expand |
    | Fotograf | zirka 2.450 € | 0 € | > expand |
    | Catering (Essen und Trinken) | zirka 12.676 € | 0 € | > expand |
    | Musik | zirka 4.101 € | 0 € | > expand |
    | Torte | zirka 639 € | 0 € | > expand |
    | Transport | zirka [amount] | 0 € | > expand |
    | Dekoration | zirka [amount] | 0 € | > expand |
    | Festzelt | zirka [amount] | 0 € | > expand |
    | Planer | zirka [amount] | 0 € | > expand |
  Each row has "🔍 Dienstleister suchen" link → Flow 2 (Vendor Discovery)

  Category: "Hochzeitskleidung & Accessoires"
    - Brautmode, Herrenbekleidung, Ringe, Beauty

  Category: "Zusätzliches"
    - Heiratslizenz, Versicherung, Suite, Gastgeschenke, Flitterwochen, Bekanntmachungen

  Category: "Andere"
    - Extras
  → Step B4 (expand item) OR Step B5 (reset) OR Step B6 (add element)

Step B4: Item Detail Panel → User clicks expand arrow (>) → System shows:
  - Element name (editable)
  - "Zirka" estimated amount
  - "Gebucht" actual amount (editable)
  - Notes text field
  - "Speichern" button (purple)
  - "Dieses Element löschen" destructive link (red text)
  → User edits and saves → Kosten bisher updates → returns to Step B3
  IF user deletes → confirmation → item removed → returns to Step B3

Step B5: Budget Reset → User clicks "Budget zurücksetzen" →
  System shows confirmation dialog →
  IF confirmed → all budget data cleared → returns to Step B1
  IF cancelled → returns to Step B3

Step B6: Add New Element → User clicks "+ Neues Element hinzufügen" →
  System adds blank row to current category →
  User fills in name + amounts → saves → row persists in Step B3
```

### 5B. Guest List Tool

```
Step G1: Guest List Empty State → User clicks "Gästeliste" card → System displays:
  - Header: 👥 "Gästeliste"
  - Illustration: two hearts
  - "Lass uns ein paar Freunde zu deiner Gästeliste hinzufügen!"
  - Subtext: "Verwalte deine Zu-/Absagen, Adressen, Tischnummern und vieles mehr und
    exportiere sie später ganz einfach!"
  - Purple CTA: "Füge deine ersten Gäste hinzu ⊕"
  - Text link: "Oder sieh dir deine leere Gästeliste an"
  → Step G2 (add guests) OR click text link → empty table view

Step G2: Add Guests Modal → System displays:
  - "Füge mehrere Gäste gleichzeitig hinzu"
  - Kategorie dropdown: "Els Gäste" (group selector, e.g., Bride's guests, Groom's guests)
  - "Namen hinzufügen" text area with placeholder examples:
    "z.B. Monica & Chandler
     Rachel
     Phoebe
     Joey
     Ross"
  - Help text: "Gib jedem neuen Gast eine neue Zeile.
    Setze ein '&' Symbol zwischen die Namen der Gäste,
    um sie als Paar/Familie zu verknüpfen. z.B. Harry &
    Meghan & Archie"
  - "Speichern" button (purple)
  → User enters names → clicks Speichern → guests added to list → guest list table view
  → User clicks ✕ → returns to Step G1
```

### 5C. Checklist

```
Step C1: Checklist Entry → User clicks "Checkliste" from quick-links or planning hub →
  System displays: "Beginnt mit eurer Checkliste" hero with phone mockup
  - "Die To-Do-Liste voller Ratschläge erwartet euch"
  - "Loslegen" CTA (purple)
  → User clicks Loslegen → checklist task list (not captured in detail in screenshots)
```

### 5D. Advice / Inspiration (Ratschläge)

```
Step R1: Advice Page → User clicks "Ratschläge" or "Inspiration" nav item → System displays:
  - Header: "Lass dich inspirieren" (large serif font)
  - Subtext: "Von der Aufteilung eures Budgets zur Auswahl eurer Traumlocation, bringen wir
    Freude in eure Hochzeitsplanung..."
  - Category tabs: Alle | Allgemeine Ratschläge | Expertenberatung | Hochzeitsbudget |
    Gäste | Zeremonie | Nach der Hochzeit | Echte Hochzeit | Dienstleister
  - Article cards with:
    - Hero image
    - Title (e.g., "Erinnerungen für die Ewigkeit – mit Voicestories")
    - Category tags (e.g., "Allgemeine Ratschläge > Expertenberatung")
  → User clicks tab → filters articles by category
  → User clicks article card → full article page
```

---

## 6. Settings & Account

**Screenshots:** `settings pt1–pt5`

### 6.1 Settings Navigation

```
Step 1: Settings Page → User clicks ⚙ icon (top-right) → System displays:
  - Header: "Einstellungen"
  - Subtext: "Verwaltet hier alles, was mit eurem Account zu tun hat"
  - Left sidebar navigation:
    - 💻 Meine Account-Daten (default active)
    - 📋 Meine Hochzeitsdetails
    - 📡 Teilt eure Hochzeit
    - ❓ Kundenservice
    - [Ausloggen] button (bottom)
  → User clicks a section → respective step below
```

### 6.2 Account Data (Meine Account-Daten)

```
Step 2: Account Data Section → System displays:
  - "Dein Profilbild": circular upload area ("Füge ein Foto hinzu") + "Hochladen" button
  - "Meine Kontakt E-Mail Adresse":
    - Help text: "Die E-Mail-Adresse, über die unsere Dienstleister euch kontaktieren werden
      (Bitte gebt sie sorgfältig ein)"
    - E-Mail field (pre-filled) + "Speichern" button (purple)
  - "Meine Login-Methoden":
    - "E-Mail Login-Methode hinzufügen" button (purple)
    - "Deine sozialen Login-Methoden:"
      - "f Mit Facebook verbinden" button
      - "G Mit Google-Konto verbinden" button
  - "Sprache ändern": Dropdown → "Deutsch (Deutschland)" ▼
  - "Account löschen":
    - Warning: "Durch diese Aktion werden euer Konto und alle gespeicherten Inhalte
      endgültig gelöscht. Dies kann nicht rückgängig gemacht werden."
    - "Konto löschen" button (red outline, destructive)
  - Footer: "App Version: Bridebook bb-web | 33.39.0"
  → Step 2a (delete account)

Step 2a: Account Deletion
  IF user clicks "Konto löschen" → System shows confirmation dialog with warning →
  IF confirmed → Account and all data permanently deleted → redirect to landing page
  IF cancelled → returns to Step 2
```

### 6.3 Wedding Details (Meine Hochzeitsdetails)

```
Step 3: Wedding Details Section → System displays:
  - Name: text field (pre-filled, e.g., "El")
  - Partner/in Name: text field (e.g., "Eli")
  - Role checkboxes for each person: ☐ Braut ☐ Bräutigam ☐ Andere
  - Standort: text field (e.g., "Deutschland")
  - Hochzeitsdatum: date picker ("Datum auswählen") with calendar icon
  - Land auswählen: dropdown with flag (🇩🇪 Deutschland)
  - Währung: dropdown ("EUR - Euro")
  - "Meine Währung ändern" text link below currency
  → User edits any field → changes auto-save or explicit save
```

### 6.4 Share Wedding (Teilt eure Hochzeit)

```
Step 4: Share Wedding Section → System displays:
  - "Teammitglieder":
    - Help text: "Lade deine Partner:in, Freunde und Familie zur Planung ein.
      Sie können auf deine Hochzeitsinfos zugreifen / sie bearbeiten und
      erhalten auch E-Mail-Updates."
    - Partner/in Name field (pre-filled, e.g., "Eli")
    - Role checkboxes: ☐ Braut ☐ Bräutigam ☐ Andere
    - "Teammitglieder einladen" button (purple)
  - "Teilt eure Hochzeitsdetails":
    - Instructions about sharing via "Adresse anfordern" function
    - "Ladet die Bridebook-App herunter & erstellt eure Hochzeitshomepage!"
    - App Store badge + Google Play badge + QR code
  → User clicks "Teammitglieder einladen" → sends invite email to partner
```

### 6.5 Customer Service (Kundenservice)

```
Step 5: Customer Service Section → System displays:
  - "Hilfe":
    - "Das Support-Team ist hier, damit dein Bridebook reibungslos läuft.
      Brauchst du Hilfe? Kontaktiere uns bitte!"
    - "Hilfe holen" button (purple)
  - "Feedback":
    - "Wir freuen uns, von dir zu hören und wollen uns immer verbessern.
      Klicke unten, um dein Feedback zu senden!"
    - "Gib uns Feedback" button (purple)
  → "Hilfe holen" → opens support contact form / help center
  → "Gib uns Feedback" → opens feedback form
```

---

## 7. Wedding Homepage (Hochzeitshomepage)

**Screenshots:** `hochzeit home page pt1–pt7`, `hochzeit home page design pt1–pt2`, `hochzeit home page einstellung.png`

### 7.1 Homepage Editor — Details Tab

```
Step 1: Hochzeitshomepage → User clicks "Hochzeitshomepage" in nav → System displays:
  - Header: 🌐 "Hochzeitshomepage"
  - URL display: "bridebook.com/de/for/eure-einzigartige-Adresse" + copy icon
  - Status badge: "Nicht veröffentlicht"
  - Action buttons: "Teilen" (outline) + "Veröffentlichen" (purple, filled)
  - 3 tabs: Details | Design | Einstellungen
  - Right panel: Live preview with mobile/desktop toggle (📱 💻) + "Vorschau ▷" link

  Details tab sections (collapsible accordion):
  → Step 2 (edit sections)

Step 2: Details Tab Sections:

  2a. "Eure Namen*" (expanded by default):
    - "Dein Name*": text field (e.g., "El")
    - "Der Name deines Partners*": text field (e.g., "Eli")
    - "Speichern" button (purple)
    → Preview updates with couple names in chosen font

  2b. "Hochzeitsdatum" (collapsible):
    - Date field: "Hochzeitsdatum hinzufügen"
    - "Speichern" button
    → Preview shows "Datum wird noch bekannt gegeben" if empty

  2c. "Hochzeitslocation" (collapsible):
    - Location field: "Bitte gebt ein Hochzeitsdatum ein, um eure Location hinzuzufügen"
    - ☑ "Verwendet Fotos von eurer Hochzeitslocation" toggle
    - "Speichern" button
    → Preview shows "Location wird noch angegeben" if empty

  2d. "Fotos" (collapsible):
    - Photo upload area / gallery grid
    → User uploads photos → appear in preview gallery

  2e. "Zu-/Absagen" (RSVP) (collapsible):
    - Prompt to add guests first (links to Guest List tool)
    → Requires guests in guest list to enable RSVP

  2f. "Fragen" (FAQ) (collapsible):
    - FAQ entries for guests
    - Example entries visible in preview:
      "Gibt es einen Dresscode?" → "Stellt euch eine sommerliche Gartenparty vor..."
      "Gibt es Parkplätze vor Ort?" → "Ja, vor der Location stehen Parkplätze zur Verfügung."
    → User adds/edits FAQ items

  2g. "Unsere Geschichte" (collapsible):
    - Rich text area for couple's story
    → Preview shows story section with uploaded photo

  2h. "Zeitplan" (Timeline) (collapsible):
    - Event timeline entries (ceremony time, reception, etc.)
    → User adds timeline events

  2i. "Hochzeitswunschliste" (Registry) (collapsible):
    - Registry URL field
    - Amazon integration option
    → Preview shows registry link

  2j. "Nachricht an die Gäste" (collapsible):
    - Text area for a personal message to guests

  2k. "Unterkünfte" (Accommodations) (collapsible):
    - Nearby hotel suggestions
    - Preview shows: "Um eure Reise noch bequemer zu machen, empfehlen wir euch
      Unterkünfte in der Nähe unserer Location!" + "Lokale Hotels entdecken" button
```

### 7.2 Homepage Editor — Design Tab

```
Step 3: Design Tab → User clicks "Design" tab → System displays:
  - "Design" section (collapsible, expanded):
    - Theme grid: 6+ design templates arranged in 3 rows of 2
      - Each template shows couple names in different styles/fonts
      - Color dots below first row (blue, green, pink, teal) for color variants
      - Themes include: Modern minimalist, Floral watercolor, Botanical green,
        Script elegant, Bold serif, Deep red classic
    - Font selector: 6 font options (shown in different templates)
  - Right panel: Live preview updates in real-time as user selects theme
  → User clicks a theme → preview instantly updates
  → User clicks color dot → theme color variant changes
```

### 7.3 Homepage Editor — Einstellungen Tab

```
Step 4: Einstellungen (Settings) Tab → User clicks "Einstellungen" tab → System displays:
  - "URL der Website":
    - Text field: "eure-einzigartige-Adresse" (editable slug)
    - Help text: "Euer Link wird hier verfügbar sein, sobald ihr eure Homepage veröffentlicht habt"
  - "Veröffentlicht": Toggle switch (OFF by default)
  - "Homepage-Passwort": Toggle switch (OFF by default)
    → IF enabled → password field appears for setting guest access password
  - "Fertig" button (purple)
  → User customizes URL → toggles publish → clicks Fertig
```

### 7.4 Publish Flow

```
Step 5: Publishing → User clicks "Veröffentlichen" button (header) →
  IF all required fields filled (names) → Homepage goes live at custom URL
    Status badge changes from "Nicht veröffentlicht" → "Veröffentlicht"
    "Teilen" button becomes active for sharing URL
  IF required fields missing → System highlights missing sections
  → Published homepage visible to guests at bridebook.com/de/for/[custom-slug]
```

---

## 8. Additional / Inferred Flows

These flows are inferred from UI elements visible across screenshots but do not have dedicated screenshot coverage.

### 8.1 Logout

```
Step 1: User navigates to Settings (⚙) → sees "Ausloggen" button in left sidebar
Step 2: User clicks "Ausloggen" → System clears session/cookies
Step 3: System redirects to landing page (unauthenticated state)
  → All personalized data (countdown, favorites count) no longer visible
  → Quick-link cards reset to generic "Loslegen" state
```

### 8.2 Password Reset (Inferred)

```
Step 1: Sign-up/Login modal → User selects "Mit E-mail einloggen"
Step 2: Email/password form displayed → "Passwort vergessen?" link visible
Step 3: User clicks forgot password → System shows email input
Step 4: User enters registered email → clicks submit
Step 5: System sends password reset email with tokenized link
Step 6: User clicks link in email → System shows "Neues Passwort" form
Step 7: User enters new password + confirmation → submits
  IF passwords match and meet requirements → password updated → redirect to login
  IF passwords don't match → inline error → remains on form
  IF token expired → error message → "Erneut anfordern" link
```

### 8.3 Navigation Bar Interactions

Visible on every authenticated page in the top-right corner:

```
💬 Messages Icon:
  Step 1: User clicks 💬 → navigates to /messages (Nachrichten page, Flow 3.4)
  IF unread messages → badge count shown on icon

♡ Favorites Icon:
  Step 1: User clicks ♡ → navigates to /favorites (Deine Dienstleister page, Flow 4.1)

⚙ Settings Icon:
  Step 1: User clicks ⚙ → navigates to /settings (Einstellungen page, Flow 6.1)
```

### 8.4 Review / Rating Submission (Inferred)

Star ratings (e.g., "5.0 ★ (20)") appear on vendor cards in search results, indicating a review system exists.

```
Step 1: User books and interacts with a vendor (post-event)
Step 2: System prompts user to leave a review (likely via email or in-app notification)
Step 3: User clicks review prompt → review form:
  - Star rating (1-5 stars)
  - Written review text area
  - Optional photo upload
Step 4: User submits review → System:
  - Validates content (moderation)
  - Publishes review on vendor profile
  - Updates vendor's aggregate star rating and review count
```

### 8.5 Dienstleister Quiz (Inferred)

A "Dienstleister Quiz" CTA is referenced in vendor discovery entry points.

```
Step 1: User clicks "Dienstleister Quiz" → System presents guided questionnaire
Step 2: Questions about preferences (style, budget, guest count, priorities)
Step 3: System processes answers → generates personalized vendor recommendations
Step 4: Results page with matched vendors → user can browse or enquire
```

### 8.6 Partner Invitation Flow

Visible across multiple screens ("Partner/in einladen" button on Favorites, Planning Tools, Settings).

```
Step 1: User clicks "Partner/in einladen" (or "Teammitglieder einladen" in Settings)
Step 2: System pre-fills partner name from wedding details
Step 3: User confirms partner's email + role (Braut/Bräutigam/Andere)
Step 4: System sends invitation email with link
Step 5: Partner clicks link → creates own account or logs in
Step 6: Partner gains shared access to:
  - Wedding planning dashboard
  - Favorites (can comment and react)
  - Budget and guest list
  - Wedding homepage editor
```

---

## Global UI Elements (Present on All Authenticated Pages)

| Element | Location | Behavior |
|---------|----------|----------|
| Bridebook logo | Top-left | Links to dashboard/homepage |
| "Locations & Dienstleister ▼" | Top nav | Dropdown → category links |
| "Planungs-Tools ▼" | Top nav | Dropdown → Budget, Gästeliste, Checkliste, etc. |
| "Inspiration" | Top nav | Links to Ratschläge/advice page |
| "Hochzeitshomepage" | Top nav | Links to wedding homepage editor |
| 💬 Messages icon | Top-right | Links to messages inbox |
| ♡ Favorites icon | Top-right | Links to favorites page |
| ⚙ Settings icon | Top-right | Links to settings page |
| Footer | Bottom | Über uns, Bridebook Business, Planungstools, Dienstleister Verzeichnis, Ideen & Inspiration, App Store/Play Store links, QR code, Cookie Richtlinie, Datenschutzrichtlinie, AGB, social icons (YouTube, TikTok, Facebook, Pinterest, X, Instagram) |

---

## Error & Empty States Summary

| Screen | Empty/Error State | CTA |
|--------|------------------|-----|
| Favorites (Locations tab) | "Hier werden deine favorisierten Locations gespeichert!" | "Locations entdecken" |
| Messages (Dienstleister tab) | "Noch keine Nachrichten" | Implicit: send enquiry first |
| Guest List | "Lass uns ein paar Freunde zu deiner Gästeliste hinzufügen!" | "Füge deine ersten Gäste hinzu" |
| Budget | Wizard shown (no prior data) | "Mein Hochzeitsbudget berechnen" |
| Countdown | "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek" | "Klick auf mich" / "Los geht's" |
| Wedding Homepage | "Nicht veröffentlicht", placeholder text | "Veröffentlichen" |
| Enquiry edit modal | Required fields empty | Inline validation prevents submit |

---

*Document generated from analysis of 61 Bridebook platform screenshots (German locale, web version 33.39.0).*



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 03                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-03--UI-COMPONENTS"></a>

### Doc 03 — UI COMPONENTS

> Source: `docs/03-UI-COMPONENTS.md` ·     1120 lines

# UI Component Library — Bridebook Wedding Planning Platform

> **Framework:** React 18+ with TypeScript
> **Styling:** Tailwind CSS + CSS Modules
> **Design Tokens:** Purple primary (#7C3AED), semantic color system
> **Breakpoints:** `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

---

## Table of Contents

1. [Navigation](#1-navigation)
2. [Forms & Inputs](#2-forms--inputs)
3. [Buttons & Actions](#3-buttons--actions)
4. [Cards & Content](#4-cards--content)
5. [Data Display](#5-data-display)
6. [Feedback & Overlays](#6-feedback--overlays)
7. [Layout](#7-layout)
8. [Interactive](#8-interactive)

---

## 1. Navigation

### 1.1 Header / Navbar

Top-level navigation bar. Sticky on scroll. Contains logo, main nav links, and icon actions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `User \| null` | — | Logged-in user for avatar/actions |
| `unreadMessages` | `number` | `0` | Badge count on message icon |
| `favoritesCount` | `number` | `0` | Badge count on heart icon |

**Nav Links:** Locations & Dienstleister, Planungs-Tools, Inspiration, Hochzeitshomepage

**Icon Actions:** Messages (envelope), Favorites (heart), Settings (gear)

**States:** logged-out (shows Sign In CTA), logged-in (shows avatar + icons)

**Responsive:** Collapses to hamburger menu below `md`. Logo always visible.

```tsx
<Header user={currentUser} unreadMessages={3} favoritesCount={12} />
```

---

### 1.2 Tab Bar

Horizontal tab navigation for switching views within a page.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | — | `{ id: string; label: string; count?: number }` |
| `activeTab` | `string` | — | Currently selected tab id |
| `onChange` | `(id: string) => void` | — | Tab change handler |
| `variant` | `'underline' \| 'pill'` | `'underline'` | Visual style |

**Variants:**
- `underline` — Bottom border indicator (Details/Design/Einstellungen)
- `pill` — Filled background pill (Dienstleister/Gäste/Bridebook/Archiviert)

**Responsive:** Horizontally scrollable on mobile with fade edges.

```tsx
<TabBar
  tabs={[
    { id: 'details', label: 'Details' },
    { id: 'design', label: 'Design' },
    { id: 'settings', label: 'Einstellungen' },
  ]}
  activeTab="details"
  onChange={setActiveTab}
/>
```

---

### 1.3 Sidebar Navigation

Vertical navigation for settings/editor pages. Fixed left panel.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | — | `{ id: string; label: string; icon?: ReactNode }` |
| `activeItem` | `string` | — | Currently selected item |
| `onSelect` | `(id: string) => void` | — | Selection handler |

**Items:** Meine Account-Daten, Meine Hochzeitsdetails, Teilt eure Hochzeit, Kundenservice

**Responsive:** Collapses to horizontal scroll tabs on mobile.

```tsx
<SidebarNav items={settingsNavItems} activeItem="account" onSelect={navigate} />
```

---

### 1.4 Footer

Multi-column footer with links, social icons, app store badges, and QR code.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `FooterColumn[]` | — | Link groups |
| `showAppBadges` | `boolean` | `true` | iOS/Android store badges |
| `showQRCode` | `boolean` | `true` | App download QR |

**Columns:** 4-column grid — About, Features, Resources, Legal

**Responsive:** Stacks to single column on mobile. Accordion-style collapsible sections.

```tsx
<Footer columns={footerColumns} showAppBadges showQRCode />
```

---

### 1.5 Breadcrumbs

Path indicator for nested content pages (inspiration articles).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Crumb[]` | — | `{ label: string; href?: string }` |
| `separator` | `string` | `'>'` | Separator character |

**Example path:** Allgemeine Ratschläge > Expertberatung

```tsx
<Breadcrumbs items={[
  { label: 'Allgemeine Ratschläge', href: '/inspiration/general' },
  { label: 'Expertberatung' },
]} />
```

---

## 2. Forms & Inputs

### 2.1 Text Input

Standard text field with label, optional helper text, and validation states.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Change handler |
| `placeholder` | `string` | — | Placeholder text |
| `type` | `'text' \| 'email' \| 'password' \| 'url' \| 'number'` | `'text'` | Input type |
| `error` | `string` | — | Error message |
| `helperText` | `string` | — | Hint below field |
| `prefix` | `ReactNode` | — | Icon/text before input |
| `suffix` | `ReactNode` | — | Icon/text after input |
| `disabled` | `boolean` | `false` | Disabled state |

**States:** default, focus (purple ring), error (red ring + message), disabled (gray bg)

**Used for:** Email, name, URL, budget amounts

```tsx
<TextInput label="E-Mail" type="email" value={email} onChange={setEmail} error={emailError} />
```

---

### 2.2 Select / Dropdown

Dropdown selector for single-choice options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `options` | `Option[]` | — | `{ value: string; label: string }` |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Change handler |
| `placeholder` | `string` | `'Auswählen...'` | Placeholder |
| `searchable` | `boolean` | `false` | Enable type-to-filter |

**Used for:** Language selector, category dropdown (Hochzeitslocations), currency picker

```tsx
<Select
  label="Kategorie"
  options={[{ value: 'locations', label: 'Hochzeitslocations' }]}
  value={category}
  onChange={setCategory}
/>
```

---

### 2.3 Textarea

Multi-line text input.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Change handler |
| `rows` | `number` | `4` | Visible rows |
| `maxLength` | `number` | — | Character limit |
| `helperText` | `string` | — | Hint text |

**Used for:** Guest name bulk entry, messages to vendors

```tsx
<Textarea label="Gästenamen" rows={6} value={names} onChange={setNames}
  helperText="Ein Name pro Zeile" />
```

---

### 2.4 Checkbox

Single or grouped checkbox for multi-select filtering.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Checkbox label |
| `checked` | `boolean` | `false` | Checked state |
| `onChange` | `(checked: boolean) => void` | — | Toggle handler |
| `indeterminate` | `boolean` | `false` | Partial selection |

**Used for:** Filter groups — Preiskategorie, Location features, Essen und Trinken, Räumlichkeiten

```tsx
<Checkbox label="Außenbereich" checked={filters.outdoor} onChange={toggleOutdoor} />
```

---

### 2.5 Chip / Pill Select

Single-select or multi-select chip group for compact option selection.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ChipOption[]` | — | `{ value: string; label: string }` |
| `selected` | `string \| string[]` | — | Selected value(s) |
| `onChange` | `(value: string \| string[]) => void` | — | Change handler |
| `multiple` | `boolean` | `false` | Allow multi-select |

**Used for:** Guest count ranges (0–50, 51–100...), weekday/weekend, season, year

```tsx
<ChipSelect
  options={[
    { value: '0-50', label: '0–50' },
    { value: '51-100', label: '51–100' },
    { value: '101-150', label: '101–150' },
  ]}
  selected={guestRange}
  onChange={setGuestRange}
/>
```

---

### 2.6 Toggle Switch

On/off toggle for binary settings.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Toggle label |
| `checked` | `boolean` | `false` | On/off state |
| `onChange` | `(checked: boolean) => void` | — | Toggle handler |
| `disabled` | `boolean` | `false` | Disabled state |

**Used for:** Veröffentlicht (publish homepage), Homepage-Passwort (password protection)

```tsx
<ToggleSwitch label="Veröffentlicht" checked={isPublished} onChange={setPublished} />
```

---

### 2.7 Search Bar

Text input styled as a search field with icon and optional clear button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Search query |
| `onChange` | `(value: string) => void` | — | Input handler |
| `onSubmit` | `() => void` | — | Submit handler |
| `placeholder` | `string` | `'Suche...'` | Placeholder |
| `showClear` | `boolean` | `true` | Show clear × button |

**Placeholder:** "Suche nach Dienstleister Namen"

```tsx
<SearchBar value={query} onChange={setQuery} onSubmit={search}
  placeholder="Suche nach Dienstleister Namen" />
```

---

### 2.8 Location Input

Country/region selector with icon prefix and autocomplete.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Selected location |
| `onChange` | `(value: string) => void` | — | Change handler |
| `suggestions` | `Location[]` | — | Autocomplete items |

**Visual:** Globe/pin icon prefix, dropdown with flag + country name

```tsx
<LocationInput value={country} onChange={setCountry} suggestions={countries} />
```

---

### 2.9 File Upload / Avatar

Circular avatar upload with camera icon overlay.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Current image URL |
| `onUpload` | `(file: File) => void` | — | Upload handler |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Avatar size |
| `fallback` | `string` | — | Initials if no image |

**States:** empty (placeholder icon), uploading (spinner overlay), loaded (image)

```tsx
<AvatarUpload src={user.avatar} onUpload={handleAvatarUpload} size="lg" />
```

---

## 3. Buttons & Actions

### 3.1 Button

Primary action trigger. Multiple variants for hierarchy.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Button label |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `ReactNode` | — | Leading icon |
| `iconOnly` | `boolean` | `false` | Icon-only mode (no label) |
| `loading` | `boolean` | `false` | Show spinner |
| `disabled` | `boolean` | `false` | Disabled state |
| `fullWidth` | `boolean` | `false` | Stretch to container |
| `onClick` | `() => void` | — | Click handler |

**Variants:**
- `primary` — Purple filled (#7C3AED text white). Used: Suche, Veröffentlichen, Speichern, Mein Hochzeitsbudget berechnen
- `secondary` — Purple border, transparent fill. Used: Teilen, Budget zurücksetzen
- `ghost` — Purple text, no border. Used: Loslegen, Dienstleister suchen, Alle anzeigen
- `destructive` — Red border, red text. Used: Konto löschen

**States:** default, hover (darken), active (scale down), focus (ring), disabled (opacity 50%), loading (spinner replaces text)

**Icon-only:** Heart, envelope, gear icons in header. Circle shape.

```tsx
<Button variant="primary" onClick={handleSearch}>Suche</Button>
<Button variant="secondary" icon={<ShareIcon />}>Teilen</Button>
<Button variant="ghost">Alle anzeigen</Button>
<Button variant="destructive">Konto löschen</Button>
<Button variant="primary" iconOnly icon={<HeartIcon />} />
```

---

## 4. Cards & Content

### 4.1 Venue Card

Search result card showing venue image, name, rating, and availability badge.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `venue` | `Venue` | — | Venue data |
| `showBadge` | `boolean` | `true` | Show availability badge |
| `onFavorite` | `() => void` | — | Heart toggle handler |
| `isFavorited` | `boolean` | `false` | Favorite state |

**Layout:** 16:9 image → name → star rating + review count → optional "Besichtigungstermine verfügbar" badge. Heart icon top-right of image.

**Responsive:** 2-column grid on desktop, single column on mobile.

```tsx
<VenueCard venue={venue} isFavorited={fav} onFavorite={toggleFav} />
```

---

### 4.2 Feature Card

Dashboard card linking to a planning tool. Icon + title + description + CTA.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Feature icon |
| `title` | `string` | — | Feature name |
| `description` | `string` | — | Short explanation |
| `href` | `string` | — | Link destination |
| `ctaLabel` | `string` | `'Loslegen'` | CTA text |

**Used for:** Budget, Gästeliste, Hochzeitshomepage, Checkliste

```tsx
<FeatureCard icon={<BudgetIcon />} title="Budget" description="Behalte den Überblick"
  href="/budget" ctaLabel="Loslegen" />
```

---

### 4.3 Promo Card

Marketing card with background image, overlay text, and CTA.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | — | Background image URL |
| `title` | `string` | — | Overlay heading |
| `subtitle` | `string` | — | Overlay description |
| `ctaLabel` | `string` | — | Button text |
| `href` | `string` | — | Link destination |

**Used for:** Beauty Team, Fotografie Stil, Traumtorte inspiration cards

**Visual:** Full-bleed image, dark gradient overlay from bottom, white text.

```tsx
<PromoCard image="/promo/beauty.jpg" title="Euer Beauty Team"
  subtitle="Findet die besten Stylisten" ctaLabel="Entdecken" href="/beauty" />
```

---

### 4.4 Budget Line Item

Single row in the budget tracker showing category, estimates, and actuals.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Category icon |
| `category` | `string` | — | Category name |
| `estimated` | `number` | — | Estimated cost |
| `actual` | `number` | `0` | Actual cost |
| `currency` | `string` | `'€'` | Currency symbol |
| `onClick` | `() => void` | — | Expand/edit handler |

**Layout:** Icon | Category name | Estimated (gray) | Actual (bold) | Chevron right

```tsx
<BudgetLineItem icon={<CakeIcon />} category="Hochzeitstorte"
  estimated={500} actual={450} onClick={() => openCategory('cake')} />
```

---

### 4.5 Dreamteam Card

Vendor category card with icon, type, favorites count, and search link.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Vendor type icon |
| `vendorType` | `string` | — | Category name |
| `favoritesCount` | `number` | `0` | Saved favorites in this category |
| `href` | `string` | — | Search link |

**Layout:** Circular icon → vendor type label → "X Favoriten" badge → "Suchen" link

**Responsive:** Horizontal scroll carousel on all screen sizes.

```tsx
<DreamteamCard icon={<CameraIcon />} vendorType="Fotograf"
  favoritesCount={3} href="/search?type=photographer" />
```

---

### 4.6 Milestone Badge

Hexagonal achievement/milestone indicator for planning progress.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Milestone icon |
| `title` | `string` | — | Milestone name |
| `subtitle` | `string` | — | Time/status info |
| `completed` | `boolean` | `false` | Completion state |

**Visual:** Hexagon-shaped icon container, title below, purple fill when completed, gray outline when pending.

```tsx
<MilestoneBadge icon={<RingIcon />} title="Verlobung" subtitle="vor 2 Monaten" completed />
```

---

### 4.7 Design Thumbnail

Selectable homepage theme preview with color swatches.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preview` | `string` | — | Theme preview image |
| `name` | `string` | — | Theme name |
| `colors` | `string[]` | — | Color dot hex values |
| `selected` | `boolean` | `false` | Selected state |
| `onSelect` | `() => void` | — | Selection handler |

**Visual:** Rounded preview image, theme name, row of color dots. Purple border when selected.

```tsx
<DesignThumbnail preview="/themes/elegant.jpg" name="Elegant"
  colors={['#7C3AED', '#FAFAFA', '#1A1A1A']} selected onSelect={selectTheme} />
```

---

### 4.8 Font Selector

Grid of font preview tiles for homepage typography selection.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fonts` | `FontOption[]` | — | `{ id: string; name: string; sample: string }` |
| `selected` | `string` | — | Selected font id |
| `onSelect` | `(id: string) => void` | — | Selection handler |

**Visual:** Grid of tiles, each showing font name rendered in that font. Purple border on selected.

```tsx
<FontSelector fonts={availableFonts} selected={selectedFont} onSelect={setFont} />
```

---

## 5. Data Display

### 5.1 Countdown Widget

Wedding date countdown with days, hours, minutes, seconds.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetDate` | `Date` | — | Wedding date |
| `icon` | `ReactNode` | — | Circular icon (rings, heart) |

**Layout:** Large circular icon left, then Tage / Std / Min / Sek columns with numeric values.

```tsx
<CountdownWidget targetDate={weddingDate} icon={<RingsIcon />} />
```

---

### 5.2 Quick Action Bar

Horizontal row of icon shortcuts with optional counts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `QuickAction[]` | — | `{ icon, label, count?, href }` |

**Items:** Checkliste, Hochzeitshomepage, Gästeliste, Favoriten, Gebucht — each with badge count.

**Responsive:** Horizontally scrollable on mobile.

```tsx
<QuickActionBar actions={[
  { icon: <ChecklistIcon />, label: 'Checkliste', count: 42, href: '/checklist' },
  { icon: <GlobeIcon />, label: 'Homepage', href: '/homepage' },
]} />
```

---

### 5.3 Stats Row

Three-column statistics display for budget overview.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stats` | `Stat[]` | — | `{ label: string; value: string; variant?: 'default' \| 'success' \| 'warning' }` |

**Items:** Maximales Budget, Geschätzte Kosten, Kosten bisher

```tsx
<StatsRow stats={[
  { label: 'Maximales Budget', value: '€30.000' },
  { label: 'Geschätzte Kosten', value: '€25.400' },
  { label: 'Kosten bisher', value: '€12.300', variant: 'success' },
]} />
```

---

### 5.4 Rating Stars

Star rating display with optional review count.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | — | 0–5 rating value |
| `count` | `number` | — | Number of reviews |
| `size` | `'sm' \| 'md'` | `'sm'` | Star size |

```tsx
<RatingStars rating={4.8} count={124} />
```

---

### 5.5 Badge / Tag

Standalone label for status, counts, or categories.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Badge content |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color scheme |
| `removable` | `boolean` | `false` | Show × to remove |
| `onRemove` | `() => void` | — | Remove handler |

**Used for:** "10694 Ergebnisse anzeigen", "Nicht veröffentlicht", "Schlafbar ×" (removable filter), price category badges

```tsx
<Badge variant="info">10694 Ergebnisse anzeigen</Badge>
<Badge variant="warning">Nicht veröffentlicht</Badge>
<Badge removable onRemove={removeFilter}>Schlafbar</Badge>
```

---

### 5.6 Progress Bar

Linear progress indicator for completion tracking.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | 0–100 percentage |
| `label` | `string` | — | Description text |
| `showPercentage` | `boolean` | `true` | Show % text |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color based on status |

**Used for:** Checklist completion, budget usage percentage

```tsx
<ProgressBar value={65} label="Checkliste" showPercentage />
```

---

### 5.7 Avatar

Standalone user or vendor avatar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `fallback` | `string` | — | Initials |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size (24–80px) |
| `online` | `boolean` | — | Online indicator dot |

```tsx
<Avatar src={user.avatar} fallback="AM" size="md" />
```

---

### 5.8 Divider / Separator

Horizontal rule between sections or list items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'full' \| 'inset'` | `'full'` | Full-width or left-padded |
| `label` | `string` | — | Optional centered text label |

```tsx
<Divider />
<Divider variant="inset" />
<Divider label="oder" />
```

---

## 6. Feedback & Overlays

### 6.1 Modal / Dialog

Overlay dialog with backdrop for focused interactions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Visibility state |
| `onClose` | `() => void` | — | Close handler |
| `title` | `string` | — | Dialog heading |
| `children` | `ReactNode` | — | Dialog content |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog width |
| `showClose` | `boolean` | `true` | Show × button |

**Used for:** Guest add modal, venue inquiry/contact modal, confirmation dialogs

**Behavior:** Backdrop click closes, Escape key closes, focus trap, scroll lock on body.

```tsx
<Modal open={isOpen} onClose={close} title="Gäste hinzufügen" size="md">
  <GuestAddForm onSubmit={addGuests} />
</Modal>
```

---

### 6.2 Toast / Snackbar

Temporary notification for action feedback.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | — | Notification text |
| `variant` | `'success' \| 'error' \| 'info' \| 'warning'` | `'info'` | Color/icon style |
| `duration` | `number` | `4000` | Auto-dismiss ms |
| `action` | `{ label: string; onClick: () => void }` | — | Optional action button |

**Position:** Bottom-center on mobile, bottom-right on desktop.

```tsx
toast.success('Änderungen gespeichert')
toast.error('Fehler beim Speichern')
```

---

### 6.3 Loading Indicator

Animated loading state with optional illustration.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dots' \| 'spinner' \| 'skeleton' \| 'illustration'` | `'dots'` | Loading style |
| `label` | `string` | — | Loading message |
| `fullPage` | `boolean` | `false` | Center in viewport |

**Variants:**
- `dots` — Three bouncing dots
- `spinner` — Circular spinner
- `skeleton` — Placeholder shimmer (see Skeleton Loader)
- `illustration` — Custom illustration + animated dots ("Zahlenverarbeitung im Gange")

```tsx
<LoadingIndicator variant="illustration" label="Zahlenverarbeitung im Gange" fullPage />
```

---

### 6.4 Skeleton Loader

Placeholder shimmer blocks matching content layout while loading.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'card' \| 'avatar' \| 'image'` | `'text'` | Shape preset |
| `lines` | `number` | `3` | Number of text lines |
| `width` | `string` | `'100%'` | Container width |

```tsx
<SkeletonLoader variant="card" />
<SkeletonLoader variant="text" lines={4} />
```

---

### 6.5 Empty State

Centered message when no content is available.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Illustration or icon |
| `title` | `string` | — | Heading |
| `description` | `string` | — | Explanation text |
| `action` | `{ label: string; onClick: () => void }` | — | CTA button |

```tsx
<EmptyState icon={<HeartIcon />} title="Noch keine Favoriten"
  description="Speichere Dienstleister, die euch gefallen"
  action={{ label: 'Dienstleister suchen', onClick: goToSearch }} />
```

---

### 6.6 Tooltip

Hover/focus hint for icons and truncated text.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | — | Tooltip text |
| `children` | `ReactNode` | — | Trigger element |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Placement |
| `delay` | `number` | `300` | Show delay ms |

```tsx
<Tooltip content="Nachrichten">
  <Button iconOnly icon={<EnvelopeIcon />} />
</Tooltip>
```

---

## 7. Layout

### 7.1 Page Header

Top section of a page with icon, title, and optional action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Page icon |
| `title` | `string` | — | Page heading |
| `subtitle` | `string` | — | Optional subheading |
| `actions` | `ReactNode` | — | Right-aligned action buttons |

```tsx
<PageHeader icon={<BudgetIcon />} title="Budget"
  actions={<Button variant="secondary">Budget zurücksetzen</Button>} />
```

---

### 7.2 Section Header

Bold title row with optional "show all" link and carousel navigation arrows.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Section title |
| `showAllHref` | `string` | — | "Alle anzeigen" link |
| `showArrows` | `boolean` | `false` | Carousel nav arrows |
| `onPrev` | `() => void` | — | Previous arrow handler |
| `onNext` | `() => void` | — | Next arrow handler |

```tsx
<SectionHeader title="Euer Dreamteam" showAllHref="/dreamteam" showArrows
  onPrev={scrollPrev} onNext={scrollNext} />
```

---

### 7.3 Split Layout

Two-column layout with fixed left sidebar and scrollable right content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebar` | `ReactNode` | — | Left panel content |
| `children` | `ReactNode` | — | Right panel content |
| `sidebarWidth` | `string` | `'280px'` | Left panel width |

**Used for:** Settings page, homepage editor

**Responsive:** Sidebar collapses to top tabs on mobile.

```tsx
<SplitLayout sidebar={<SidebarNav />}>
  <AccountSettings />
</SplitLayout>
```

---

### 7.4 Search Results Layout

Left scrollable list + right interactive map.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `list` | `ReactNode` | — | Results list |
| `map` | `ReactNode` | — | Map component |
| `showMap` | `boolean` | `true` | Map visibility toggle |

**Responsive:** Full-width list on mobile with "Karte anzeigen" floating button.

```tsx
<SearchResultsLayout
  list={<VenueList venues={results} />}
  map={<VenueMap venues={results} />}
/>
```

---

### 7.5 Hero Banner

Full-width banner with background image, overlay text, and CTA.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | — | Background image URL |
| `title` | `string` | — | Heading text |
| `subtitle` | `string` | — | Subheading text |
| `cta` | `{ label: string; href: string }` | — | CTA button |

```tsx
<HeroBanner image="/hero/wedding.jpg" title="Plant eure Traumhochzeit"
  subtitle="Alles an einem Ort" cta={{ label: 'Loslegen', href: '/signup' }} />
```

---

## 8. Interactive

### 8.1 Filter Bar

Sticky horizontal filter controls for search pages.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `FilterGroup[]` | — | Filter definitions |
| `activeFilters` | `Record<string, any>` | — | Current filter state |
| `onChange` | `(filters: Record<string, any>) => void` | — | Filter change handler |
| `resultCount` | `number` | — | Total matching results |
| `onReset` | `() => void` | — | Reset all filters |

**Layout:** Horizontally scrollable filter chips/dropdowns, result count badge right, "Zurücksetzen" button.

**Behavior:** Sticky below header on scroll.

```tsx
<FilterBar filters={venueFilters} activeFilters={state} onChange={setFilters}
  resultCount={10694} onReset={resetFilters} />
```

---

### 8.2 Map

Interactive Google Map with venue/vendor pins.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `markers` | `MapMarker[]` | — | `{ lat, lng, label, id }` |
| `center` | `{ lat: number; lng: number }` | — | Map center |
| `zoom` | `number` | `10` | Initial zoom level |
| `onMarkerClick` | `(id: string) => void` | — | Pin click handler |
| `selectedId` | `string` | — | Highlighted marker |

```tsx
<Map markers={venueMarkers} center={wiesbadenCenter} zoom={12}
  onMarkerClick={selectVenue} selectedId={selected} />
```

---

### 8.3 Carousel / Slider

Horizontal scroll container with optional navigation arrows and pagination dots.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Slide items |
| `showArrows` | `boolean` | `true` | Nav arrows |
| `showDots` | `boolean` | `false` | Pagination dots |
| `slidesPerView` | `number` | `'auto'` | Visible slides |
| `gap` | `number` | `16` | Gap between slides (px) |

**Used for:** Dreamteam cards, promo cards, milestones, venue photo galleries

```tsx
<Carousel showArrows showDots slidesPerView={3}>
  {dreamteamCards.map(card => <DreamteamCard key={card.id} {...card} />)}
</Carousel>
```

---

### 8.4 Accordion

Collapsible content sections with expand/collapse toggle.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | — | `{ id, title, content, defaultOpen? }` |
| `multiple` | `boolean` | `false` | Allow multiple open |

**Used for:** Guest list sections (Eure Namen, Hochzeitsdatum, Fotos, Zu-/Absagen)

```tsx
<Accordion items={[
  { id: 'names', title: 'Eure Namen', content: <NameFields /> },
  { id: 'date', title: 'Hochzeitsdatum', content: <DatePicker /> },
  { id: 'rsvp', title: 'Zu-/Absagen', content: <RSVPManager /> },
]} />
```

---

### 8.5 Device Preview

Mobile/desktop toggle frame for homepage preview.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | — | Preview URL or content |
| `device` | `'mobile' \| 'desktop'` | `'desktop'` | Current device mode |
| `onDeviceChange` | `(device: string) => void` | — | Toggle handler |
| `children` | `ReactNode` | — | Preview content |

**Visual:** Toggle bar with phone/monitor icons. Mobile shows centered iPhone frame, desktop shows full-width.

```tsx
<DevicePreview device={previewDevice} onDeviceChange={setDevice}>
  <HomepagePreview config={homepageConfig} />
</DevicePreview>
```

---

### 8.6 Partner Invite Banner

Full-width CTA banner prompting partner invitation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `partnerName` | `string` | — | Partner's name if known |
| `onInvite` | `() => void` | — | Invite action handler |
| `onDismiss` | `() => void` | — | Dismiss handler |

**Visual:** Purple gradient background, ring icon, heading + description, CTA button.

```tsx
<PartnerInviteBanner onInvite={invitePartner} onDismiss={dismissBanner} />
```

---

### 8.7 Image Gallery / Lightbox

Grid of venue/vendor photos with fullscreen lightbox viewer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `GalleryImage[]` | — | `{ src, alt, thumbnail? }` |
| `columns` | `number` | `3` | Grid columns |
| `maxVisible` | `number` | `6` | Visible before "+N more" |

**Behavior:** Click opens fullscreen lightbox with prev/next arrows and close button. Swipe on mobile.

```tsx
<ImageGallery images={venuePhotos} columns={3} maxVisible={6} />
```

---

### 8.8 Pagination

Dot or numbered pagination for carousels and search results.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `number` | — | Current page/index |
| `total` | `number` | — | Total pages |
| `onChange` | `(page: number) => void` | — | Page change handler |
| `variant` | `'dots' \| 'numbered'` | `'dots'` | Visual style |

**Variants:**
- `dots` — Small circles for carousels (Bridebook Favoriten)
- `numbered` — Page numbers for search results

```tsx
<Pagination current={1} total={5} onChange={setPage} variant="dots" />
```

---

## Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| `color-primary` | `#7C3AED` | Buttons, links, active states |
| `color-primary-hover` | `#6D28D9` | Button hover |
| `color-background` | `#FFFFFF` | Page background |
| `color-surface` | `#F9FAFB` | Card backgrounds |
| `color-text` | `#111827` | Primary text |
| `color-text-secondary` | `#6B7280` | Secondary/muted text |
| `color-border` | `#E5E7EB` | Borders, dividers |
| `color-error` | `#EF4444` | Error states, destructive |
| `color-success` | `#10B981` | Success states |
| `color-warning` | `#F59E0B` | Warning states |
| `radius-sm` | `4px` | Inputs, badges |
| `radius-md` | `8px` | Cards, buttons |
| `radius-lg` | `16px` | Modals, large cards |
| `radius-full` | `9999px` | Avatars, pills |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `font-family` | `Inter, system-ui, sans-serif` | All text |
| `font-size-xs` | `12px` | Captions, badges |
| `font-size-sm` | `14px` | Body text, inputs |
| `font-size-md` | `16px` | Default body |
| `font-size-lg` | `20px` | Section headers |
| `font-size-xl` | `24px` | Page titles |
| `font-size-2xl` | `32px` | Hero headings |
| `spacing-unit` | `4px` | Base spacing (multiply) |
| `transition-fast` | `150ms ease` | Hover states |
| `transition-normal` | `300ms ease` | Expand/collapse |
| `z-header` | `100` | Sticky header |
| `z-filter` | `90` | Sticky filter bar |
| `z-modal` | `200` | Modal backdrop |
| `z-toast` | `300` | Toast notifications |



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 04                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-04--WIREFRAMES"></a>

### Doc 04 — WIREFRAMES

> Source: `docs/04-WIREFRAMES.md` ·     1348 lines

# Bridebook — ASCII Wireframes

> Box-drawing reference: ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼

---

## Header Variants

### Logged-Out Header (all pages)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo:Bridebook]           [Nav:Hochzeitsorte] [Nav:Dienstleister]          │
│                            [Nav:Inspiration]   [Button:Einloggen]           │
│                                                [Button:Registrieren]        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Logged-In Header (all pages)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo:Bridebook]  [Nav:Dashboard] [Nav:Checkliste] [Nav:Budget]            │
│                   [Nav:Gästeliste] [Nav:Favoriten] [Nav:Nachrichten]       │
│                   [Icon:Bell] [Avatar:User ▾]                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Landing / Home Page

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-Out Header]                                   │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│                        ┌──────────────────────────────┐                            │
│                        │                              │                            │
│                        │     [Hero:Background Image]  │                            │
│                        │                              │                            │
│                        │   "Finde alles für deine     │                            │
│                        │    Traumhochzeit"            │                            │
│                        │                              │                            │
│                        │  ┌────────────┬────────────┐ │                            │
│                        │  │[Select:Land]│[Select:Kat]│ │                            │
│                        │  └────────────┴────────────┘ │                            │
│                        │       [Button:Suchen]        │                            │
│                        │                              │                            │
│                        └──────────────────────────────┘                            │
│                                                                                    │
│  ┌─── Quick Actions ──────────────────────────────────────────────────────────┐    │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │    │
│  │ │[Icon]    │ │[Icon]    │ │[Icon]    │ │[Icon]    │ │[Icon]    │         │    │
│  │ │Locations │ │Fotografen│ │Catering  │ │Florist   │ │DJ/Musik  │         │    │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Beliebte Orte ─────────────────────────────────────────────────────────┐    │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │    │
│  │ │[Img]        │ │[Img]        │ │[Img]        │ │[Img]        │          │    │
│  │ │ Berlin      │ │ München     │ │ Hamburg      │ │ Köln        │          │    │
│  │ │ 342 Orte    │ │ 287 Orte    │ │ 198 Orte    │ │ 156 Orte    │          │    │
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Weltweit entdecken ────────────────────────────────────────────────────┐    │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │    │
│  │ │[Flag:DE] │ │[Flag:AT] │ │[Flag:CH] │ │[Flag:UK] │ │[Flag:FR] │        │    │
│  │ │Deutsch-  │ │Österreich│ │Schweiz   │ │UK        │ │Frankreich│        │    │
│  │ │land      │ │          │ │          │ │          │ │          │        │    │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Footer ────────────────────────────────────────────────────────────────┐    │
│  │ [Logo]   Über uns │ Kontakt │ Blog │ Presse │ Datenschutz │ Impressum    │    │
│  │          [Social:FB] [Social:IG] [Social:Pinterest]                       │    │
│  │          © 2025 Bridebook                                                 │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ [Logo] [≡ Hamburger]      │
├───────────────────────────┤
│                           │
│  ┌─────────────────────┐  │
│  │ [Hero:Image]        │  │
│  │                     │  │
│  │ "Finde alles für    │  │
│  │  deine Traumhoch-   │  │
│  │  zeit"              │  │
│  │                     │  │
│  │ [Select:Land    ▾]  │  │
│  │ [Select:Kategorie▾] │  │
│  │ [Button:Suchen]     │  │
│  └─────────────────────┘  │
│                           │
│  ── Quick Actions ──      │
│  ┌────────┐ ┌────────┐   │
│  │Locations│ │Foto    │   │
│  └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐   │
│  │Catering│ │Florist │   │
│  └────────┘ └────────┘   │
│                           │
│  ── Beliebte Orte ──     │
│  ┌─────────────────────┐  │
│  │[Img] Berlin 342     │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │[Img] München 287    │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │[Img] Hamburg 198    │  │
│  └─────────────────────┘  │
│                           │
│  ── Weltweit ──           │
│  [Flag:DE] [Flag:AT]     │
│  [Flag:CH] [Flag:UK]     │
│                           │
│  ── Footer ──             │
│  [Links stacked]          │
│  © 2025 Bridebook         │
└───────────────────────────┘
```

### Tablet (768px)
```
┌───────────────────────────────────────────────────┐
│ [Logo:Bridebook]    [Nav:Hochzeitsorte]           │
│                     [Button:Einloggen]             │
├───────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │          [Hero:Background Image]            │  │
│  │   "Finde alles für deine Traumhochzeit"     │  │
│  │  ┌──────────────┬──────────────┐            │  │
│  │  │[Select:Land] │[Select:Kat]  │            │  │
│  │  └──────────────┴──────────────┘            │  │
│  │         [Button:Suchen]                     │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │Locations│ │Foto    │ │Catering│ │Florist │     │
│  └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                    │
│  ┌──────────────┐ ┌──────────────┐                │
│  │[Img] Berlin  │ │[Img] München │                │
│  │ 342 Orte     │ │ 287 Orte     │                │
│  └──────────────┘ └──────────────┘                │
│  ┌──────────────┐ ┌──────────────┐                │
│  │[Img] Hamburg │ │[Img] Köln    │                │
│  │ 198 Orte     │ │ 156 Orte     │                │
│  └──────────────┘ └──────────────┘                │
│                                                    │
│  [Footer: 2-column links]                         │
└───────────────────────────────────────────────────┘
```

---

## 2. Sign Up / Login Modal

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-Out Header]                                   │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│         ┌──────────────────────────────────────────────────────┐                   │
│         │  ┌────────────────────┬─────────────────────────┐   │                   │
│         │  │                    │                         │   │                   │
│         │  │  "Willkommen bei   │   ┌─────────────────┐  │   │                   │
│         │  │   Bridebook"       │   │                 │  │   │                   │
│         │  │                    │   │  [QR Code]      │  │   │                   │
│         │  │  [Input:Email]     │   │                 │  │   │                   │
│         │  │  [Input:Passwort]  │   │  "Scanne den    │  │   │                   │
│         │  │                    │   │   QR-Code mit   │  │   │                   │
│         │  │  [Button:Einloggen]│   │   deinem Handy" │  │   │                   │
│         │  │                    │   │                 │  │   │                   │
│         │  │  ── oder ──       │   └─────────────────┘  │   │                   │
│         │  │                    │                         │   │                   │
│         │  │  [Button:Apple]   │                         │   │                   │
│         │  │  [Button:Google]  │                         │   │                   │
│         │  │                    │                         │   │                   │
│         │  │  "Noch kein Konto?"│                         │   │                   │
│         │  │  [Link:Registrier] │                         │   │                   │
│         │  │                    │                         │   │                   │
│         │  └────────────────────┴─────────────────────────┘   │                   │
│         └──────────────────────────────────────────────────────┘                   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ [Logo] [X Close]          │
├───────────────────────────┤
│                           │
│  "Willkommen bei          │
│   Bridebook"              │
│                           │
│  [Input:Email         ]   │
│  [Input:Passwort      ]   │
│                           │
│  [Button:Einloggen    ]   │
│                           │
│  ────── oder ──────       │
│                           │
│  [Button:Apple SSO    ]   │
│  [Button:Google SSO   ]   │
│                           │
│  "Noch kein Konto?"       │
│  [Link:Jetzt registrieren]│
│                           │
│  (QR Code hidden on       │
│   mobile)                 │
│                           │
└───────────────────────────┘
```

---

## 3. User Dashboard

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─── Countdown ─────────────────────────────────────────────────────────────┐    │
│  │  "Hallo, [Name]! Noch 142 Tage bis zur Hochzeit 🎉"                     │    │
│  │  [Progress: ████████░░░░░░░░░░░░ 45% erledigt]                           │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Checkliste CTA ─────────────────────────┐  ┌─── Partner einladen ────┐     │
│  │  "3 Aufgaben diese Woche fällig"            │  │  [Icon:Couple]          │     │
│  │  [Button:Zur Checkliste]                    │  │  "Partner einladen"     │     │
│  └─────────────────────────────────────────────┘  │  [Button:Einladen]      │     │
│                                                    └─────────────────────────┘     │
│                                                                                    │
│  ┌─── Planungstools ─────────────────────────────────────────────────────────┐    │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                       │    │
│  │ │[Icon]        │ │[Icon]        │ │[Icon]        │                       │    │
│  │ │ Checkliste   │ │ Budget       │ │ Gästeliste   │                       │    │
│  │ │ 12/28 Tasks  │ │ €15.000      │ │ 0 Gäste      │                       │    │
│  │ └──────────────┘ └──────────────┘ └──────────────┘                       │    │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                       │    │
│  │ │[Icon]        │ │[Icon]        │ │[Icon]        │                       │    │
│  │ │ Favoriten    │ │ Hochzeits-   │ │ Nachrichten  │                       │    │
│  │ │ 5 gespeichert│ │ homepage     │ │ 2 neu        │                       │    │
│  │ └──────────────┘ └──────────────┘ └──────────────┘                       │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Favoriten Banner ──────────────────────────────────────────────────────┐    │
│  │  "Eure gespeicherten Dienstleister"                                       │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                           │    │
│  │  │[Img] │ │[Img] │ │[Img] │ │[Img] │ │[Img] │  →                       │    │
│  │  │Name  │ │Name  │ │Name  │ │Name  │ │Name  │                           │    │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                           │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Dreamteam Carousel ────────────────────────────────────────────────────┐    │
│  │  ← [Card:Vendor] [Card:Vendor] [Card:Vendor] [Card:Vendor] →            │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Meilensteine ─────────────────────────────────────────────────────────┐    │
│  │  ● Location gebucht  ○ Fotograf gebucht  ○ Einladungen verschickt       │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ [Logo] [Bell] [Avatar]    │
├───────────────────────────┤
│                           │
│  "Hallo, [Name]!"         │
│  Noch 142 Tage            │
│  [████████░░░░] 45%       │
│                           │
│  ┌───────────────────┐    │
│  │ 3 Aufgaben fällig │    │
│  │ [Button:Checkliste]│    │
│  └───────────────────┘    │
│                           │
│  ┌────────┐ ┌────────┐   │
│  │Checklist│ │Budget  │   │
│  │12/28    │ │€15.000 │   │
│  └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐   │
│  │Gäste   │ │Favorit │   │
│  │0       │ │5       │   │
│  └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐   │
│  │Homepage│ │Nachrich│   │
│  │        │ │2 neu   │   │
│  └────────┘ └────────┘   │
│                           │
│  Partner einladen         │
│  [Button:Einladen     ]   │
│                           │
│  ── Favoriten ──          │
│  [Horizontal scroll →]    │
│  [Card] [Card] [Card]     │
│                           │
│  ── Dreamteam ──          │
│  ← [Card] [Card] →       │
│                           │
│  ── Meilensteine ──       │
│  ● Location gebucht       │
│  ○ Fotograf gebucht       │
│  ○ Einladungen             │
│                           │
│  [Bottom Tab Bar]         │
│  [Home][Check][Fav][Msg]  │
└───────────────────────────┘
```

### Tablet (768px)
```
┌───────────────────────────────────────────────────┐
│ [Logo]  [Nav:Dashboard] [Nav:Check] [Avatar]      │
├───────────────────────────────────────────────────┤
│                                                    │
│  "Hallo, [Name]! Noch 142 Tage"                   │
│  [████████████░░░░░░░░] 45%                        │
│                                                    │
│  ┌──────────────────┐ ┌───────────────────┐       │
│  │ 3 Aufgaben fällig│ │ Partner einladen  │       │
│  │ [Button:Check]   │ │ [Button:Einladen] │       │
│  └──────────────────┘ └───────────────────┘       │
│                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Checkliste│ │Budget    │ │Gästeliste│          │
│  │12/28     │ │€15.000   │ │0 Gäste   │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Favoriten │ │Homepage  │ │Nachrichten│          │
│  │5         │ │          │ │2 neu     │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                    │
│  [Favoriten Banner: horizontal scroll]             │
│  [Dreamteam Carousel]                              │
│  [Meilensteine: inline]                            │
└───────────────────────────────────────────────────┘
```

---

## 4. Vendor Search / Listing

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─── Search Bar ────────────────────────────────────────────────────────────┐    │
│  │  [Input:Ort oder PLZ        ] [Select:Kategorie ▾] [Button:Suchen]       │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  [Badge: 234 Ergebnisse]                                                          │
│                                                                                    │
│  ┌─ Filters (240px) ─┐ ┌─ Results ──────────────────┐ ┌─ Map (400px) ────┐      │
│  │                    │ │                            │ │                  │      │
│  │ Preis              │ │ ┌──────────────────────┐   │ │  ┌────────────┐ │      │
│  │ [○ €] [○ €€]      │ │ │[Img]  Schloss Heidel │   │ │  │            │ │      │
│  │ [○ €€€] [○ €€€€]  │ │ │       ★★★★☆ (42)    │   │ │  │  [Map]     │ │      │
│  │                    │ │ │       €€€ · 150 Gäste│   │ │  │            │ │      │
│  │ Gästeanzahl        │ │ │       [♥ Favorit]    │   │ │  │   📍 📍     │ │      │
│  │ [Slider: 0─300]    │ │ └──────────────────────┘   │ │  │  📍   📍   │ │      │
│  │                    │ │                            │ │  │     📍     │ │      │
│  │ Must-Haves         │ │ ┌──────────────────────┐   │ │  │            │ │      │
│  │ [☐ Außenbereich]   │ │ │[Img]  Gut Schwaben   │   │ │  └────────────┘ │      │
│  │ [☐ Unterkunft]     │ │ │       ★★★★★ (78)    │   │ │                  │      │
│  │ [☐ Eigenes Cater.] │ │ │       €€ · 200 Gäste│   │ │                  │      │
│  │ [☐ Barrierefreier] │ │ │       [♥ Favorit]    │   │ │                  │      │
│  │                    │ │ └──────────────────────┘   │ │                  │      │
│  │ Location-Typ       │ │                            │ │                  │      │
│  │ [☐ Schloss]        │ │ ┌──────────────────────┐   │ │                  │      │
│  │ [☐ Scheune]        │ │ │[Img]  Weingut Mosel  │   │ │                  │      │
│  │ [☐ Hotel]          │ │ │       ★★★★☆ (23)    │   │ │                  │      │
│  │ [☐ Weingut]        │ │ │       €€€ · 100 Gäste│   │ │                  │      │
│  │ [☐ Restaurant]     │ │ │       [♥ Favorit]    │   │ │                  │      │
│  │                    │ │ └──────────────────────┘   │ │                  │      │
│  │ [Button:Zurücks.]  │ │                            │ │                  │      │
│  └────────────────────┘ └────────────────────────────┘ └──────────────────┘      │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ [Logo] [≡]                │
├───────────────────────────┤
│ [Input:Ort oder PLZ     ] │
│ [Select:Kategorie      ▾] │
│ [Button:Suchen]           │
│                           │
│ [Badge:234] [Button:Filter│
│  ▾] [Toggle:Liste|Karte] │
│                           │
│ ┌───────────────────────┐ │
│ │[Img]                  │ │
│ │ Schloss Heidelberg    │ │
│ │ ★★★★☆ (42)           │ │
│ │ €€€ · 150 Gäste      │ │
│ │ [♥]                   │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │[Img]                  │ │
│ │ Gut Schwaben          │ │
│ │ ★★★★★ (78)           │ │
│ │ €€ · 200 Gäste       │ │
│ │ [♥]                   │ │
│ └───────────────────────┘ │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

### Tablet (768px)
```
┌───────────────────────────────────────────────────┐
│ [Logo]  [Nav items]  [Avatar]                     │
├───────────────────────────────────────────────────┤
│ [Search Bar: full width]                          │
│ [Badge:234] [Filter Toggle]                       │
│                                                    │
│  ┌─── Results (2-col) ───────┐ ┌─── Map ────┐    │
│  │ ┌──────────┐ ┌──────────┐│ │            │    │
│  │ │[Card]    │ │[Card]    ││ │  [Map]     │    │
│  │ │Schloss   │ │Gut       ││ │            │    │
│  │ │Heidelberg│ │Schwaben  ││ │   📍 📍    │    │
│  │ └──────────┘ └──────────┘│ │            │    │
│  │ ┌──────────┐ ┌──────────┐│ └────────────┘    │
│  │ │[Card]    │ │[Card]    ││                    │
│  │ └──────────┘ └──────────┘│                    │
│  └───────────────────────────┘                    │
└───────────────────────────────────────────────────┘
```

### Filter Panel — Expanded State (Mobile)
```
┌───────────────────────────┐
│ Filter       [X Schließen]│
├───────────────────────────┤
│                           │
│ Preis                     │
│ [● €] [○ €€] [○ €€€]    │
│ [○ €€€€]                 │
│                           │
│ Gästeanzahl              │
│ [Slider: ●────────── 300] │
│ Min: 0  Max: 300          │
│                           │
│ Must-Haves                │
│ [☑ Außenbereich]          │
│ [☐ Unterkunft]            │
│ [☐ Eigenes Catering]      │
│ [☐ Barrierefreier Zugang] │
│                           │
│ Location-Typ              │
│ [☐ Schloss]               │
│ [☐ Scheune]               │
│ [☑ Weingut]               │
│ [☐ Hotel]                 │
│ [☐ Restaurant]            │
│                           │
│ [Button:234 Ergebnisse    │
│  anzeigen]                │
│ [Link:Zurücksetzen]       │
└───────────────────────────┘
```

### Map Popup — Pin Clicked State
```
                   ┌─────────────────────┐
                   │ [Img: Venue Photo]  │
                   │ Schloss Heidelberg  │
                   │ ★★★★☆ (42)        │
                   │ €€€ · 150 Gäste   │
                   │ [Button:Ansehen]    │
                   └────────┬────────────┘
                            │
                            ▼
                           📍
```

---

## 5. Vendor Profile / Contact Modal

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─── Gallery ───────────────────────────────────────────────────────────────┐    │
│  │  [Img:Main]  [Img:2] [Img:3] [Img:4] [+12 Fotos]                        │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Info ──────────────────────────────┐ ┌─── Sidebar ─────────────────┐       │
│  │                                        │ │                            │       │
│  │  Schloss Heidelberg                    │ │  Ab €5.000                 │       │
│  │  ★★★★☆ (42 Bewertungen)              │ │  [Button:Anfrage senden]   │       │
│  │  📍 Heidelberg, BW                     │ │  [Button:♥ Favorit]       │       │
│  │  👥 50–200 Gäste                       │ │                            │       │
│  │  💰 €€€                                │ │  ┌──────────────────────┐ │       │
│  │                                        │ │  │ Schnellfakten        │ │       │
│  │  ── Über die Location ──              │ │  │ Außenbereich: ✓      │ │       │
│  │  Lorem ipsum dolor sit amet...         │ │  │ Unterkunft: ✓        │ │       │
│  │                                        │ │  │ Eigenes Catering: ✗  │ │       │
│  │  ── Ausstattung ──                    │ │  │ Barrierefreier: ✓    │ │       │
│  │  [Tag:Garten] [Tag:Saal]             │ │  └──────────────────────┘ │       │
│  │  [Tag:Parkplatz] [Tag:WLAN]           │ │                            │       │
│  │                                        │ │                            │       │
│  │  ── Bewertungen ──                    │ │                            │       │
│  │  [Review:1] [Review:2] [Review:3]     │ │                            │       │
│  └────────────────────────────────────────┘ └────────────────────────────┘       │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Contact Modal Overlay (Desktop)
```
┌──────────────────────────────────────────────────────┐
│                                          [X Close]   │
│                                                      │
│  "Anfrage an Schloss Heidelberg"                     │
│                                                      │
│  [Input:Euer Name              ]                     │
│  [Input:E-Mail                 ]                     │
│  [Input:Telefon (optional)     ]                     │
│                                                      │
│  Informationen                                       │
│  [☑ Preisliste anfordern]                            │
│  [☑ Verfügbarkeit prüfen]                            │
│  [☐ Besichtigung vereinbaren]                        │
│                                                      │
│  [Textarea:Persönliche Nachricht                     │
│   ──────────────────────────────                     │
│                                                      │
│                                                      │
│   ──────────────────────────────]                    │
│                                                      │
│  Hochzeitsdatum: [Input:TT.MM.JJJJ]                │
│  Gästeanzahl:    [Input:___]                         │
│                                                      │
│  [Button:Brochüre anfragen                       ]   │
│                                                      │
│  "Wir senden eure Anfrage direkt an den              │
│   Dienstleister."                                    │
└──────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Zurück         [♥]     │
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │[Img:Main gallery]     │ │
│ │              1/15     │ │
│ └───────────────────────┘ │
│                           │
│  Schloss Heidelberg       │
│  ★★★★☆ (42)             │
│  📍 Heidelberg, BW       │
│  Ab €5.000               │
│                           │
│  [Button:Anfrage senden]  │
│                           │
│  ── Schnellfakten ──     │
│  Außenbereich: ✓          │
│  Unterkunft: ✓            │
│  Catering: ✗              │
│                           │
│  ── Über die Location ── │
│  Lorem ipsum...           │
│                           │
│  ── Ausstattung ──       │
│  [Tag] [Tag] [Tag]       │
│                           │
│  ── Bewertungen ──       │
│  [Review:1]               │
│  [Review:2]               │
│                           │
│ ┌─ Sticky Bottom ───────┐ │
│ │ Ab €5.000              │ │
│ │ [Button:Anfrage senden]│ │
│ └────────────────────────┘ │
└───────────────────────────┘
```

### Contact Modal (Mobile — Full Screen)
```
┌───────────────────────────┐
│ ← Zurück                 │
├───────────────────────────┤
│                           │
│ "Anfrage an Schloss       │
│  Heidelberg"              │
│                           │
│ [Input:Euer Name       ]  │
│ [Input:E-Mail          ]  │
│ [Input:Telefon         ]  │
│                           │
│ [☑ Preisliste]            │
│ [☑ Verfügbarkeit]         │
│ [☐ Besichtigung]          │
│                           │
│ [Textarea:Nachricht    ]  │
│                           │
│ Datum: [Input:TT.MM.JJ]  │
│ Gäste: [Input:___]        │
│                           │
│ [Button:Brochüre          │
│  anfragen              ]  │
│                           │
└───────────────────────────┘
```

---

## 6. Messages / Inbox

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─── Tabs ──────────────────────────────────────────────────────────────────┐    │
│  │  [Tab:Dienstleister (3)]  [Tab:Gäste]  [Tab:Bridebook]  [Tab:Archiviert] │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─ Thread List (350px) ─┐ ┌─ Message Detail ─────────────────────────────┐      │
│  │                        │ │                                              │      │
│  │ ┌────────────────────┐ │ │  Schloss Heidelberg                         │      │
│  │ │[Avatar] Schloss    │ │ │  Online vor 2 Stunden                       │      │
│  │ │Heidelberg          │ │ │                                              │      │
│  │ │"Vielen Dank für..."│ │ │  ┌──────────────────────────────────────┐   │      │
│  │ │vor 2 Std ●         │ │ │  │ Ihr: "Hallo, wir interessieren      │   │      │
│  │ └────────────────────┘ │ │  │ uns für den 15.06.2025..."           │   │      │
│  │                        │ │  └──────────────────────────────────────┘   │      │
│  │ ┌────────────────────┐ │ │                                              │      │
│  │ │[Avatar] Foto       │ │ │  ┌──────────────────────────────────────┐   │      │
│  │ │Studio Meyer        │ │ │  │ Schloss: "Vielen Dank für Ihre      │   │      │
│  │ │"Gerne senden..."   │ │ │  │ Anfrage! Der Termin ist noch..."    │   │      │
│  │ │vor 1 Tag           │ │ │  └──────────────────────────────────────┘   │      │
│  │ └────────────────────┘ │ │                                              │      │
│  │                        │ │  ┌──────────────────────────────────────┐   │      │
│  │ ┌────────────────────┐ │ │  │[Textarea:Nachricht schreiben...   ] │   │      │
│  │ │[Avatar] DJ Max     │ │ │  │                    [Button:Senden]  │   │      │
│  │ │"Ich bin verfügbar" │ │ │  └──────────────────────────────────────┘   │      │
│  │ │vor 3 Tagen         │ │ │                                              │      │
│  │ └────────────────────┘ │ └──────────────────────────────────────────────┘      │
│  └────────────────────────┘                                                        │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Empty State — Gäste Tab
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  [Tab:Dienstleister]  [Tab:Gäste ●]  [Tab:Bridebook]  [Tab:Archiviert]           │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│                                                                                    │
│                        ┌──────────────────────────┐                                │
│                        │      [Icon:Envelope]     │                                │
│                        │                          │                                │
│                        │  "Noch keine Nachrichten │                                │
│                        │   an Gäste"              │                                │
│                        │                          │                                │
│                        │  "Schreibt euren Gästen  │                                │
│                        │   direkt über Bridebook" │                                │
│                        │                          │                                │
│                        │  [Button:Nachricht       │                                │
│                        │   schreiben]             │                                │
│                        └──────────────────────────┘                                │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Nachrichten             │
├───────────────────────────┤
│ [Dienst.] [Gäste] [BB]   │
│ [Archiviert]              │
├───────────────────────────┤
│                           │
│ ┌───────────────────────┐ │
│ │[Av] Schloss Heidelberg│ │
│ │"Vielen Dank für..."   │ │
│ │vor 2 Std ●            │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │[Av] Foto Studio Meyer │ │
│ │"Gerne senden..."      │ │
│ │vor 1 Tag              │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │[Av] DJ Max            │ │
│ │"Ich bin verfügbar"    │ │
│ │vor 3 Tagen            │ │
│ └───────────────────────┘ │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 7. Checklist Page

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Eure Checkliste                                                                  │
│  [Progress: ████████████░░░░░░░░░░░░░░ 45% · 12/28 erledigt]                    │
│                                                                                    │
│  ┌─── 12+ Monate vorher ─────────────────────────────────────────────────────┐   │
│  │  [☑] Budget festlegen                                                      │   │
│  │  [☑] Hochzeitsdatum wählen                                                 │   │
│  │  [☑] Location besichtigen                                                  │   │
│  │  [☐] Trauzeugen fragen                                                     │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─── 9–12 Monate vorher ────────────────────────────────────────────────────┐   │
│  │  [☑] Fotograf buchen                                                       │   │
│  │  [☐] Catering auswählen                                                    │   │
│  │  [☐] DJ / Band buchen                                                      │   │
│  │  [☐] Florist kontaktieren                                                  │   │
│  │  [☐] Save-the-Date versenden                                               │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─── 6–9 Monate vorher ─────────────────────────────── [▾ Collapsed] ───────┐   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─── 3–6 Monate vorher ─────────────────────────────── [▾ Collapsed] ───────┐   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─── 1–3 Monate vorher ─────────────────────────────── [▾ Collapsed] ───────┐   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─── Letzte Woche ──────────────────────────────────── [▾ Collapsed] ───────┐   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Accordion — Expanded State
```
  ┌─── 6–9 Monate vorher ─────────────────────────────── [▴ Expanded] ────────┐
  │  [☐] Einladungen designen                                                  │
  │  [☐] Hochzeitstorte bestellen                                              │
  │  [☐] Brautkleid Termin                                                     │
  │  [☐] Anzug / Outfit planen                                                 │
  │  [☐] Hochzeitsauto mieten                                                  │
  └────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Checkliste              │
├───────────────────────────┤
│                           │
│ [████████░░░░] 45%        │
│ 12/28 erledigt            │
│                           │
│ ── 12+ Monate ──         │
│ [☑] Budget festlegen     │
│ [☑] Datum wählen         │
│ [☑] Location besichtigen │
│ [☐] Trauzeugen fragen    │
│                           │
│ ── 9–12 Monate ──        │
│ [☑] Fotograf buchen      │
│ [☐] Catering auswählen   │
│ [☐] DJ / Band buchen     │
│ [☐] Florist kontaktieren │
│ [☐] Save-the-Date        │
│                           │
│ ── 6–9 Monate ── [▾]     │
│ ── 3–6 Monate ── [▾]     │
│ ── 1–3 Monate ── [▾]     │
│ ── Letzte Woche ─ [▾]    │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 8. Budget Tracker

### Desktop — Setup Form
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─── Budget einrichten ─────────────────────────────────────────────────────┐    │
│  │                                                                            │    │
│  │  Gesamtbudget                                                              │    │
│  │  [Input:€ ____________]                                                    │    │
│  │                                                                            │    │
│  │  Gästeanzahl                                                               │    │
│  │  [Pill:20-50] [Pill:50-100] [Pill:100-150●] [Pill:150-200] [Pill:200+]   │    │
│  │                                                                            │    │
│  │  Wochentag                                                                 │    │
│  │  [Pill:Samstag●] [Pill:Freitag] [Pill:Sonntag] [Pill:Unter der Woche]    │    │
│  │                                                                            │    │
│  │  Jahreszeit                                                                │    │
│  │  [Pill:Frühling] [Pill:Sommer●] [Pill:Herbst] [Pill:Winter]              │    │
│  │                                                                            │    │
│  │  Jahr                                                                      │    │
│  │  [Pill:2025●] [Pill:2026] [Pill:2027]                                    │    │
│  │                                                                            │    │
│  │  Optionale Kategorien (alles was ihr braucht)                              │    │
│  │  [☑ Location]  [☑ Catering]  [☑ Fotograf]  [☑ Musik/DJ]                 │    │
│  │  [☐ Videograf] [☑ Florist]   [☑ Hochzeitstorte] [☐ Brautauto]          │    │
│  │  [☐ Einladungen] [☑ Kleidung] [☐ Ringe]                                 │    │
│  │                                                                            │    │
│  │  [Button:Budget berechnen                                              ]   │    │
│  │                                                                            │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop — Breakdown View
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Euer Budget                                                          [Edit ✎]    │
│                                                                                    │
│  ┌─── Zusammenfassung ───────────────────────────────────────────────────────┐    │
│  │  Gesamt: €15.000  │  Geschätzt: €13.450  │  Tatsächlich: €4.200  │ Rest: │    │
│  │                    │                       │                       │€10.800│    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
│  ┌─── Kategorien ────────────────────────────────────────────────────────────┐    │
│  │                                                                            │    │
│  │  Kategorie          │ Geschätzt  │ Tatsächlich │ Differenz │              │    │
│  │  ───────────────────┼────────────┼─────────────┼───────────┤              │    │
│  │  Location            │   €5.000   │   €4.200    │   -€800   │ [▸]         │    │
│  │  Catering            │   €3.500   │     —       │     —     │ [▸]         │    │
│  │  Fotograf            │   €1.800   │     —       │     —     │ [▸]         │    │
│  │  Musik/DJ            │     €800   │     —       │     —     │ [▸]         │    │
│  │  Florist             │     €600   │     —       │     —     │ [▸]         │    │
│  │  Hochzeitstorte      │     €450   │     —       │     —     │ [▸]         │    │
│  │  Kleidung            │   €1.300   │     —       │     —     │ [▸]         │    │
│  │                                                                            │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px) — Breakdown
```
┌───────────────────────────┐
│ ← Budget                  │
├───────────────────────────┤
│                           │
│ Gesamt     €15.000        │
│ Geschätzt  €13.450        │
│ Bezahlt    €4.200         │
│ Rest       €10.800        │
│                           │
│ ── Kategorien ──          │
│ ┌───────────────────────┐ │
│ │ Location        [▸]   │ │
│ │ €5.000 / €4.200       │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Catering        [▸]   │ │
│ │ €3.500 / —            │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Fotograf        [▸]   │ │
│ │ €1.800 / —            │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Musik/DJ        [▸]   │ │
│ │ €800 / —              │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Florist         [▸]   │ │
│ │ €600 / —              │ │
│ └───────────────────────┘ │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 9. Guest List

### Desktop — Empty State vs Filled State
```
┌─── EMPTY STATE ──────────────────────┐  ┌─── FILLED STATE ────────────────────────┐
│                                       │  │                                          │
│  Gästeliste                           │  │  Gästeliste (87 Gäste)                  │
│                                       │  │                                          │
│  ┌─────────────────────────────────┐  │  │  [Input:Suchen...      ] [Button:+Add]  │
│  │                                 │  │  │                                          │
│  │      [Icon:People]              │  │  │  ┌─── Familie Braut (24) ────────────┐  │
│  │                                 │  │  │  │ [☑] Maria Schmidt     Zugesagt    │  │
│  │  "Noch keine Gäste"            │  │  │  │ [☑] Thomas Schmidt    Zugesagt    │  │
│  │                                 │  │  │  │ [☐] Anna Schmidt      Ausstehend  │  │
│  │  "Fügt eure Gäste hinzu        │  │  │  │ [☐] Peter Müller      Ausstehend  │  │
│  │   und behaltet den Überblick"  │  │  │  └──────────────────────────────────────┘  │
│  │                                 │  │  │                                          │
│  │  [Button:Gäste hinzufügen]     │  │  │  ┌─── Familie Bräutigam (28) ────────┐  │
│  │                                 │  │  │  │ [☑] Klaus Weber       Zugesagt    │  │
│  │                                 │  │  │  │ [☐] Petra Weber       Ausstehend  │  │
│  └─────────────────────────────────┘  │  │  └──────────────────────────────────────┘  │
│                                       │  │                                          │
│                                       │  │  ┌─── Freunde (35) ─────────────────┐  │
│                                       │  │  │ [☑] Lisa Braun        Zugesagt    │  │
│                                       │  │  │ [☑] Max Becker        Zugesagt    │  │
│                                       │  │  │ [☐] Julia Koch        Abgesagt    │  │
│                                       │  │  └──────────────────────────────────────┘  │
│                                       │  │                                          │
└───────────────────────────────────────┘  └──────────────────────────────────────────┘
```

### Add Guest Modal
```
┌──────────────────────────────────────────────────────┐
│  Gäste hinzufügen                        [X Close]   │
│                                                      │
│  Kategorie                                           │
│  [Select:Kategorie wählen              ▾]            │
│    ├─ Familie Braut                                  │
│    ├─ Familie Bräutigam                              │
│    ├─ Freunde                                        │
│    ├─ Arbeitskollegen                                │
│    └─ Sonstige                                       │
│                                                      │
│  Namen (ein Name pro Zeile)                          │
│  ┌────────────────────────────────────────────────┐  │
│  │ Maria Schmidt                                  │  │
│  │ Thomas Schmidt                                 │  │
│  │ Anna Schmidt                                   │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [Button:Speichern]  [Link:Abbrechen]                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Gästeliste (87)        │
├───────────────────────────┤
│                           │
│ [Input:Suchen...]  [+]   │
│                           │
│ ── Familie Braut (24) ── │
│ [☑] Maria Schmidt        │
│     Zugesagt              │
│ [☑] Thomas Schmidt       │
│     Zugesagt              │
│ [☐] Anna Schmidt         │
│     Ausstehend            │
│                           │
│ ── Familie Bräut. (28) ──│
│ [☑] Klaus Weber          │
│     Zugesagt              │
│ [☐] Petra Weber          │
│     Ausstehend            │
│                           │
│ ── Freunde (35) ──       │
│ [☑] Lisa Braun           │
│ [☑] Max Becker           │
│ [☐] Julia Koch Abgesagt  │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 10. Favorites

### Desktop — Empty State vs Filled State
```
┌─── EMPTY STATE ──────────────────────┐  ┌─── FILLED STATE ────────────────────────┐
│                                       │  │                                          │
│  Favoriten                            │  │  Favoriten                               │
│  [Tab:Locations●] [Tab:Dienstleister] │  │  [Tab:Locations●] [Tab:Dienstleister]   │
│  [Tab:Gebucht]                        │  │  [Tab:Gebucht]                           │
│                                       │  │                                          │
│  ┌─ Partner Invite Banner ──────────┐ │  │  ┌─ Partner Invite Banner ────────────┐ │
│  │ "Ladet euren Partner ein, um     │ │  │  │ ✓ Partner verknüpft               │ │
│  │  gemeinsam Favoriten zu teilen!" │ │  │  └────────────────────────────────────┘ │
│  │ [Button:Partner einladen]        │ │  │                                          │
│  └──────────────────────────────────┘ │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│                                       │  │  │[Img]     │ │[Img]     │ │[Img]     ││
│  ┌─────────────────────────────────┐  │  │  │Schloss   │ │Gut       │ │Weingut   ││
│  │                                 │  │  │  │Heidelberg│ │Schwaben  │ │Mosel     ││
│  │      [Icon:Heart]               │  │  │  │★★★★☆    │ │★★★★★    │ │★★★★☆    ││
│  │                                 │  │  │  │[♥ Saved] │ │[♥ Saved] │ │[♥ Saved] ││
│  │  "Noch keine Favoriten"        │  │  │  └──────────┘ └──────────┘ └──────────┘│
│  │                                 │  │  │                                          │
│  │  "Speichert eure Lieblings-     │  │  │  ┌──────────┐ ┌──────────┐             │
│  │   locations mit dem ♥"          │  │  │  │[Img]     │ │[Img]     │             │
│  │                                 │  │  │  │Landhaus  │ │Scheune   │             │
│  │  [Button:Locations entdecken]   │  │  │  │Rose      │ │am See    │             │
│  │                                 │  │  │  │★★★★★    │ │★★★★☆    │             │
│  └─────────────────────────────────┘  │  │  └──────────┘ └──────────┘             │
│                                       │  │                                          │
└───────────────────────────────────────┘  └──────────────────────────────────────────┘
```

### Favorit hinzufügen Modal
```
┌──────────────────────────────────────────────────────┐
│  Favorit hinzufügen                      [X Close]   │
│                                                      │
│  [Input:Dienstleister suchen...          🔍]         │
│                                                      │
│  ── Vorgeschlagen ──                                │
│  ┌────────────────────────────────────────────────┐  │
│  │ [Img] Schloss Neuenstein  ★★★★☆  [+ Hinzuf.]  │  │
│  │ [Img] Hofgut Laubenheim   ★★★★★  [+ Hinzuf.]  │  │
│  │ [Img] Weingut Friedrich   ★★★★☆  [+ Hinzuf.]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Favoriten              │
├───────────────────────────┤
│ [Locations] [Dienst.] [G] │
│                           │
│ ┌─ Partner einladen ───┐ │
│ │ Partner einladen      │ │
│ │ [Button:Einladen]     │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │[Img] Schloss Heidelberg│ │
│ │ ★★★★☆  [♥]           │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │[Img] Gut Schwaben     │ │
│ │ ★★★★★  [♥]           │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │[Img] Weingut Mosel    │ │
│ │ ★★★★☆  [♥]           │ │
│ └───────────────────────┘ │
│                           │
│ [FAB: + Hinzufügen]      │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 11. Wedding Homepage Editor

### Desktop — Details Tab
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Hochzeitshomepage                                                                │
│  [Tab:Details●] [Tab:Design] [Tab:Einstellungen]                                  │
│                                                                                    │
│  ┌─── Accordion Fields ─────────────┐ ┌─── Live Preview ─────────────────────┐   │
│  │                                   │ │                                      │   │
│  │  [▴] Überschrift                  │ │  ┌──────────────────────────────┐   │   │
│  │  ┌─────────────────────────────┐  │ │  │                              │   │   │
│  │  │[Input:Lisa & Thomas]       │  │ │  │   Lisa & Thomas              │   │   │
│  │  └─────────────────────────────┘  │ │  │                              │   │   │
│  │                                   │ │  │   15. Juni 2025              │   │   │
│  │  [▾] Datum & Uhrzeit             │ │  │   Schloss Heidelberg         │   │   │
│  │  [▾] Location                     │ │  │                              │   │   │
│  │  [▾] Unser Kennenlern-Story       │ │  │   "Wir freuen uns auf       │   │   │
│  │  [▾] Dresscode                    │ │  │    euch!"                    │   │   │
│  │  [▾] Zeitplan                     │ │  │                              │   │   │
│  │  [▾] Geschenkwünsche              │ │  │   ── Zeitplan ──            │   │   │
│  │  [▾] FAQ                          │ │  │   14:00 Trauung             │   │   │
│  │                                   │ │  │   15:30 Empfang             │   │   │
│  │                                   │ │  │   18:00 Abendessen          │   │   │
│  │                                   │ │  │   21:00 Party               │   │   │
│  │                                   │ │  │                              │   │   │
│  │                                   │ │  └──────────────────────────────┘   │   │
│  └───────────────────────────────────┘ └──────────────────────────────────────┘   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Accordion — Expanded "Datum & Uhrzeit"
```
  [▴] Datum & Uhrzeit
  ┌─────────────────────────────────────────────┐
  │  Datum:    [Input:15.06.2025          ]     │
  │  Uhrzeit:  [Input:14:00              ]     │
  │  Ganztägig: [Toggle: ○──● ]                │
  └─────────────────────────────────────────────┘
```

### Desktop — Design Tab
```
│  Hochzeitshomepage                                                                │
│  [Tab:Details] [Tab:Design●] [Tab:Einstellungen]                                  │
│                                                                                    │
│  ── Template wählen ──                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                             │
│  │[Template]│ │[Template]│ │[Template]│ │[Template]│                             │
│  │Klassisch │ │Modern    │ │Romantisch│ │Minimal   │                             │
│  │  [● ✓]   │ │  [○]     │ │  [○]     │ │  [○]     │                             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                             │
│                                                                                    │
│  ── Farbschema ──                                                                 │
│  [●Weiß/Gold] [○Blush] [○Navy] [○Grün] [○Bordeaux] [○Custom]                   │
│                                                                                    │
│  ── Schriftart ──                                                                 │
│  [Select:Playfair Display ▾]                                                      │
```

### Desktop — Einstellungen Tab
```
│  Hochzeitshomepage                                                                │
│  [Tab:Details] [Tab:Design] [Tab:Einstellungen●]                                  │
│                                                                                    │
│  URL eurer Hochzeitshomepage                                                      │
│  bridebook.de/ [Input:lisa-thomas       ]                                         │
│                                                                                    │
│  Veröffentlicht                                                                   │
│  [Toggle: ○──● Aktiv]                                                             │
│                                                                                    │
│  Passwortschutz                                                                   │
│  [Toggle: ●──○ Aus]                                                               │
│  [Input:Passwort (optional)     ]                                                 │
│                                                                                    │
│  [Button:Änderungen speichern]                                                    │
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Homepage                │
├───────────────────────────┤
│ [Details] [Design] [Einst]│
│                           │
│ [▴] Überschrift           │
│ [Input:Lisa & Thomas   ]  │
│                           │
│ [▾] Datum & Uhrzeit       │
│ [▾] Location              │
│ [▾] Kennenlern-Story      │
│ [▾] Dresscode             │
│ [▾] Zeitplan              │
│ [▾] Geschenkwünsche       │
│ [▾] FAQ                   │
│                           │
│ [Button:Vorschau       ]  │
│                           │
│ (Live preview shown as    │
│  full-screen overlay on   │
│  "Vorschau" tap)          │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## 12. Settings

### Desktop (1200px)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              [Logged-In Header]                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─ Sidebar (250px) ─────┐ ┌─ Content ──────────────────────────────────────┐    │
│  │                        │ │                                                │    │
│  │  [● Account]           │ │  Account                                       │    │
│  │  [○ Hochzeitsdetails]  │ │                                                │    │
│  │  [○ Teilt eure         │ │  Name                                          │    │
│  │     Hochzeit]          │ │  [Input:Lisa Müller              ]             │    │
│  │  [○ Kundenservice]     │ │                                                │    │
│  │  [─── Ausloggen]       │ │  E-Mail                                        │    │
│  │                        │ │  [Input:lisa@example.com          ]             │    │
│  │                        │ │                                                │    │
│  │                        │ │  Passwort                                       │    │
│  │                        │ │  [Button:Passwort ändern]                       │    │
│  │                        │ │                                                │    │
│  │                        │ │  Sprache                                        │    │
│  │                        │ │  [Select:Deutsch ▾]                             │    │
│  │                        │ │                                                │    │
│  │                        │ │  Benachrichtigungen                             │    │
│  │                        │ │  [Toggle: ●──○] E-Mail-Benachrichtigungen      │    │
│  │                        │ │  [Toggle: ○──●] Push-Benachrichtigungen        │    │
│  │                        │ │                                                │    │
│  │                        │ │  [Button:Speichern]                             │    │
│  │                        │ │                                                │    │
│  │                        │ │  ─────────────────────────────                 │    │
│  │                        │ │  [Link:Konto löschen (rot)]                    │    │
│  │                        │ │                                                │    │
│  └────────────────────────┘ └────────────────────────────────────────────────┘    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Settings — Hochzeitsdetails Panel
```
│  Hochzeitsdetails                                                │
│                                                                  │
│  Hochzeitsdatum                                                  │
│  [Input:15.06.2025              ]                                │
│                                                                  │
│  Partner 1                         Partner 2                     │
│  [Input:Lisa Müller     ]          [Input:Thomas Weber  ]        │
│                                                                  │
│  Gästeanzahl (geplant)                                           │
│  [Input:120                 ]                                    │
│                                                                  │
│  Location (falls bereits gewählt)                                │
│  [Input:Schloss Heidelberg  ]                                    │
│                                                                  │
│  Budget                                                          │
│  [Input:€15.000             ]                                    │
│                                                                  │
│  [Button:Speichern]                                              │
```

### Settings — Teilt eure Hochzeit Panel
```
│  Teilt eure Hochzeit                                             │
│                                                                  │
│  Partner einladen                                                │
│  [Input:E-Mail des Partners          ] [Button:Einladen]         │
│                                                                  │
│  Verknüpfte Partner                                              │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  [Avatar] Thomas Weber · thomas@example.com  [Entfernen]│     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                  │
│  Hochzeitshomepage teilen                                        │
│  Link: bridebook.de/lisa-thomas  [Button:Kopieren]               │
│                                                                  │
│  Social Sharing                                                  │
│  [Button:WhatsApp] [Button:E-Mail] [Button:Link kopieren]       │
```

### Settings — Kundenservice Panel
```
│  Kundenservice                                                   │
│                                                                  │
│  ── Häufige Fragen ──                                           │
│  [▸] Wie ändere ich mein Hochzeitsdatum?                        │
│  [▸] Wie lade ich meinen Partner ein?                           │
│  [▸] Wie lösche ich mein Konto?                                 │
│  [▸] Wie kontaktiere ich einen Dienstleister?                   │
│                                                                  │
│  ── Kontakt ──                                                  │
│  [Button:E-Mail schreiben]                                       │
│  [Button:Live Chat starten]                                      │
│                                                                  │
│  E-Mail: support@bridebook.de                                    │
```

### Mobile (375px)
```
┌───────────────────────────┐
│ ← Einstellungen           │
├───────────────────────────┤
│                           │
│ ┌───────────────────────┐ │
│ │ [▸] Account           │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ [▸] Hochzeitsdetails  │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ [▸] Teilt eure        │ │
│ │     Hochzeit          │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ [▸] Kundenservice     │ │
│ └───────────────────────┘ │
│                           │
│ [Button:Ausloggen (rot)]  │
│                           │
│ (Tapping any item pushes  │
│  to detail screen with    │
│  ← back navigation)      │
│                           │
│ [Bottom Tab Bar]          │
└───────────────────────────┘
```

---

## Verification Checklist

| # | Page | Desktop | Mobile | Tablet | Extra States |
|---|------|---------|--------|--------|--------------|
| 1 | Landing/Home | ✓ | ✓ | ✓ | — |
| 2 | Sign Up/Login | ✓ | ✓ | — | — |
| 3 | Dashboard | ✓ | ✓ | ✓ | — |
| 4 | Vendor Search | ✓ | ✓ | ✓ | Filter expanded, Map popup |
| 5 | Vendor Profile | ✓ | ✓ | — | Contact modal (desktop + mobile) |
| 6 | Messages/Inbox | ✓ | ✓ | — | Empty state (Gäste tab) |
| 7 | Checklist | ✓ | ✓ | — | Accordion expanded |
| 8 | Budget Tracker | ✓ (setup + breakdown) | ✓ | — | — |
| 9 | Guest List | ✓ (empty + filled) | ✓ | — | Add guest modal |
| 10 | Favorites | ✓ (empty + filled) | ✓ | — | Favorit hinzufügen modal |
| 11 | Homepage Editor | ✓ (3 tabs) | ✓ | — | Accordion expanded |
| 12 | Settings | ✓ (sidebar + 4 panels) | ✓ | — | All content panels |

**Header variants:** Logged-out ✓ | Logged-in ✓
**Box-drawing chars:** ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼ ✓
**Labels:** [Logo] [Search] [Button:CTA] [Card:Vendor] [Input:...] [Select:...] [Tab:...] [Toggle:...] etc. ✓



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 05                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-05--DESIGN-TOKENS"></a>

### Doc 05 — DESIGN TOKENS

> Source: `docs/05-DESIGN-TOKENS.md` ·      840 lines

# Bridebook Design Tokens

> Extracted from 61 UI screenshots of the Bridebook wedding planning platform.
> Tokens provided as CSS custom properties and Tailwind CSS config.

---

## Table of Contents

1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Spacing](#3-spacing)
4. [Borders & Radius](#4-borders--radius)
5. [Shadows](#5-shadows)
6. [Breakpoints](#6-breakpoints)
7. [Z-Index Scale](#7-z-index-scale)
8. [Transitions](#8-transitions)
9. [Opacity Scale](#9-opacity-scale)
10. [Focus Ring](#10-focus-ring)
11. [Icon Sizes](#11-icon-sizes)
12. [Container Max-Widths](#12-container-max-widths)
13. [Aspect Ratios](#13-aspect-ratios)
14. [Backdrop & Overlay](#14-backdrop--overlay)
15. [CSS Custom Properties](#15-css-custom-properties)
16. [Tailwind Config](#16-tailwind-config)

---

## 1. Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#5B4ED1` | Buttons, links, active tabs, map pins, focus rings, toggles |
| `brand-secondary` | `#EC4899` | Hearts, favorites, partner invite CTA, decorative accents |
| `brand-teal` | `#3BB5A0` | Illustrations, loading/processing states |
| `brand-gold` | `#FFB800` | Star ratings |

### Neutral / Gray Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#FAFAFA` | Footer, secondary panels |
| `gray-100` | `#F5F5F5` | Page background behind content |
| `gray-200` | `#E5E5E5` | Borders, dividers, horizontal rules |
| `gray-300` | `#D4D4D4` | Dropdown/form outlines |
| `gray-400` | `#999999` | Tertiary labels, footer headers |
| `gray-500` | `#888888` | Placeholder/helper text |
| `gray-600` | `#555555` | Secondary descriptive text |
| `gray-700` | `#333333` | Body text, form labels |
| `gray-900` | `#1A1A1A` | Primary headings |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Success states, confirmations |
| `warning` | `#FFB800` | Warnings, star ratings |
| `error` | `#EF4444` | Destructive actions ("Konto loschen", delete) |
| `info` | `#5B4ED1` | Informational highlights (reuses brand primary) |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-page` | `#FFFFFF` | Primary page background |
| `bg-secondary` | `#F5F5F5` | Content area background |
| `bg-warm` | `#F9F8F6` | Warm off-white panels (hero, countdown) |
| `bg-card` | `#FFFFFF` | Card surfaces |
| `bg-input` | `#FFFFFF` | Input field backgrounds |
| `bg-purple-wash` | `#E8E4F8` | Icon badge backgrounds, sidebar active |
| `bg-purple-light` | `#F3F0FF` | Icon containers, light purple tint |
| `bg-purple-subtle` | `#F8F7FC` | Alternating list row highlight |
| `bg-nav` | `#1E1B3A` | Top navigation bar (dark navy) |
| `bg-illustration` | `#F0E6D6` | Warm beige circle behind empty-state illustrations |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#1A1A1A` | Headings, primary content |
| `text-body` | `#333333` | Body text, form labels |
| `text-secondary` | `#555555` | Descriptive/supporting text |
| `text-muted` | `#888888` | Placeholder, helper text |
| `text-tertiary` | `#999999` | Footer labels, minor annotations |
| `text-link` | `#5B4ED1` | Interactive link text |
| `text-on-primary` | `#FFFFFF` | Text on primary-colored backgrounds |
| `text-on-nav` | `#FFFFFF` | Text on dark navigation bar |

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `border-default` | `#E5E5E5` | Cards, inputs, section dividers |
| `border-strong` | `#D4D4D4` | Dropdown outlines, form focus outlines |
| `border-focus` | `#5B4ED1` | Active tab underline, input focus ring |
| `border-error` | `#EF4444` | Error state borders |

### Wedding Homepage Design Themes

| Token | Hex | Theme |
|-------|-----|-------|
| `theme-lavender` | `#B8A9F0` | Lavender (default) |
| `theme-blush` | `#F5D5D5` | Blush/pink floral |
| `theme-burgundy` | `#722F37` | Dark burgundy/maroon |
| `theme-forest` | `#3A5F1C` | Dark forest green |
| `theme-ivory` | `#F5F0EB` | Cream/ivory neutral |

---

## 2. Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-sans` | `"Inter", "DM Sans", system-ui, -apple-system, sans-serif` | All UI elements: nav, body, buttons, labels |
| `font-serif` | `"Playfair Display", "Georgia", serif` | Display/hero headings, feature titles, couple names |

### Font Sizes

| Token | px | rem | Usage |
|-------|-----|-----|-------|
| `text-xs` | 11px | 0.6875rem | Overline text, floating label (shrunk) |
| `text-sm` | 12px | 0.75rem | Captions, footer links |
| `text-base-sm` | 13px | 0.8125rem | Nav items, checkbox labels |
| `text-base` | 14-15px | 0.875-0.9375rem | Standard body text, descriptions |
| `text-lg` | 16-18px | 1-1.125rem | Large body, empty state descriptions |
| `text-xl` | 18-20px | 1.125-1.25rem | Modal titles, sub-section heads |
| `text-2xl` | 22-26px | 1.375-1.625rem | Section headings |
| `text-3xl` | 28-32px | 1.75-2rem | Page titles |
| `text-4xl` | 32-36px | 2-2.25rem | Feature card titles (serif), couple names |
| `text-5xl` | 40-48px | 2.5-3rem | Hero headings, display text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Labels, nav items |
| `font-semibold` | 600 | Sub-headings, buttons, modal titles |
| `font-bold` | 700 | Page titles, section headings |
| `font-extrabold` | 800 | Serif display headings |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.2 | Display headings, hero text |
| `leading-snug` | 1.3 | Section headings, card titles |
| `leading-normal` | 1.5 | Body text, descriptions |
| `leading-relaxed` | 1.625 | Large body text, empty state copy |
| `leading-loose` | 1.75 | Spacious paragraph text |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tight` | -0.02em | Display/hero headings |
| `tracking-normal` | 0 | Body text |
| `tracking-wide` | 0.05em | Overline/label text, footer section headers |
| `tracking-wider` | 0.1em | All-caps overline text |

### Heading Styles

| Level | Font | Size | Weight | Line Height | Tracking |
|-------|------|------|--------|-------------|----------|
| `h1` | serif | 40-48px | 800 | 1.2 | -0.02em |
| `h2` | sans | 28-32px | 700 | 1.2 | -0.02em |
| `h3` | sans | 22-26px | 700 | 1.3 | 0 |
| `h4` | sans | 18-20px | 600 | 1.3 | 0 |
| `h5` | sans | 16-18px | 600 | 1.5 | 0 |
| `h6` | sans | 14-15px | 600 | 1.5 | 0 |

---

## 3. Spacing

**Base unit:** 4px

| Token | Value |
|-------|-------|
| `space-0` | 0px |
| `space-0.5` | 2px |
| `space-1` | 4px |
| `space-1.5` | 6px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |

### Component Padding Standards

| Component | Padding |
|-----------|---------|
| Card | 16-24px all sides |
| Modal | 24-32px |
| Form inputs | 12px vertical, 16px horizontal |
| Buttons (CTA) | 12px vertical, 24px horizontal |
| Chips/pills | 8px vertical, 16px horizontal |
| Nav bar | 16px vertical |
| Page sections | 32-48px vertical |

### Section Margins

| Context | Value |
|---------|-------|
| Between heading and content | 16-24px |
| Between grid cards | 16-20px |
| Between sections | 32-48px |
| Tab gap (horizontal) | 24-32px |
| Filter checkbox vertical gap | 8-12px |

---

## 4. Borders & Radius

### Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| `border-thin` | 1px | Cards, inputs, dividers |
| `border-medium` | 2px | Active tab underline, focus rings |
| `border-thick` | 3px | Emphasized active indicators |

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | — |
| `radius-sm` | 4px | Checkboxes |
| `radius-md` | 8px | Inputs, social auth buttons |
| `radius-lg` | 12px | Cards, venue cards |
| `radius-xl` | 16px | Modals, dialogs |
| `radius-2xl` | 20px | Filter chips |
| `radius-pill` | 9999px | Primary buttons, search bar, toggles |
| `radius-full` | 50% | Avatars, icon circles, radio buttons |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | `none` | Nav bar, flat elements |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `shadow-md` | `0 1px 4px rgba(0,0,0,0.06)` | Cards (default) |
| `shadow-lg` | `0 2px 8px rgba(0,0,0,0.08)` | Search bar, elevated cards |
| `shadow-xl` | `0 4px 24px rgba(0,0,0,0.15)` | Modals, dialogs |
| `shadow-2xl` | `0 20px 60px rgba(0,0,0,0.2)` | Modal outer glow |

---

## 6. Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `screen-sm` | 640px | Mobile landscape |
| `screen-md` | 768px | Tablet |
| `screen-lg` | 1024px | Desktop |
| `screen-xl` | 1280px | Large desktop |
| `screen-2xl` | 1536px | Ultra-wide |

---

## 7. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | 0 | Default layer |
| `z-elevated` | 10 | Elevated cards |
| `z-dropdown` | 20 | Dropdowns, popovers |
| `z-sticky` | 30 | Sticky nav bar |
| `z-overlay` | 40 | Modal backdrop/overlay |
| `z-modal` | 50 | Modal content |
| `z-toast` | 60 | Toast notifications |
| `z-tooltip` | 70 | Tooltips |

---

## 8. Transitions

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `transition-fast` | 100ms | `ease-out` | Toggle switches, checkbox checks |
| `transition-base` | 150ms | `ease-in-out` | Button hover, link hover, focus rings |
| `transition-moderate` | 200ms | `ease-in-out` | Dropdown open/close, tab switching |
| `transition-slow` | 300ms | `ease-in-out` | Modal open/close, page transitions |
| `transition-slower` | 500ms | `ease-in-out` | Loading skeleton fade, illustration entrance |

### Easing Functions

| Token | Value |
|-------|-------|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

---

## 9. Opacity Scale

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-0` | 0 | Hidden/invisible |
| `opacity-5` | 0.05 | Extremely subtle overlays |
| `opacity-10` | 0.10 | Disabled background tint |
| `opacity-25` | 0.25 | Disabled elements |
| `opacity-50` | 0.50 | Modal backdrop, overlay |
| `opacity-75` | 0.75 | Semi-transparent elements |
| `opacity-100` | 1 | Fully opaque |

---

## 10. Focus Ring

| Token | Value | Usage |
|-------|-------|-------|
| `focus-ring-color` | `#5B4ED1` | Matches brand primary |
| `focus-ring-width` | 2px | Outline width |
| `focus-ring-offset` | 2px | Gap between element and ring |
| `focus-ring-style` | `solid` | Outline style |

```css
/* Focus-visible pattern */
:focus-visible {
  outline: 2px solid #5B4ED1;
  outline-offset: 2px;
}
```

---

## 11. Icon Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `icon-xs` | 12px | Inline indicators, chevrons |
| `icon-sm` | 16px | Small inline icons |
| `icon-md` | 20px | Standard UI icons (nav, buttons) |
| `icon-lg` | 24px | Section header icons, action icons |
| `icon-xl` | 32px | Feature/category icons, budget badges |
| `icon-2xl` | 48px | Empty state illustrations |

Icon style: Outlined stroke, 1.5-2px stroke weight.

---

## 12. Container Max-Widths

| Token | Value | Usage |
|-------|-------|-------|
| `container-sm` | 640px | Narrow forms, modals |
| `container-md` | 768px | Settings pages, single-column |
| `container-lg` | 1024px | Standard content |
| `container-xl` | 1200px | Main content area (observed max) |
| `container-2xl` | 1400px | Full-width layouts |

---

## 13. Aspect Ratios

| Token | Value | Usage |
|-------|-------|-------|
| `aspect-square` | 1 / 1 | Avatar images, icon containers |
| `aspect-card` | 4 / 3 | Blog/article card images, venue thumbnails |
| `aspect-landscape` | 16 / 9 | Hero images, banner images |
| `aspect-portrait` | 3 / 4 | Vendor profile images |
| `aspect-wide` | 21 / 9 | Full-width hero banner |

---

## 14. Backdrop & Overlay

| Token | Value | Usage |
|-------|-------|-------|
| `backdrop-color` | `rgba(30, 27, 58, 0.5)` | Modal backdrop (dark navy with 50% opacity) |
| `backdrop-blur` | `blur(4px)` | Optional backdrop blur |
| `overlay-light` | `rgba(255, 255, 255, 0.8)` | Light overlay for disabled sections |
| `overlay-dark` | `rgba(0, 0, 0, 0.5)` | Generic dark overlay |

---

## 15. CSS Custom Properties

```css
:root {
  /* ========== COLORS ========== */

  /* Brand */
  --color-brand-primary: #5B4ED1;
  --color-brand-secondary: #EC4899;
  --color-brand-teal: #3BB5A0;
  --color-brand-gold: #FFB800;

  /* Neutral / Gray */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #999999;
  --color-gray-500: #888888;
  --color-gray-600: #555555;
  --color-gray-700: #333333;
  --color-gray-900: #1A1A1A;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #FFB800;
  --color-error: #EF4444;
  --color-info: #5B4ED1;

  /* Backgrounds */
  --bg-page: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-warm: #F9F8F6;
  --bg-card: #FFFFFF;
  --bg-input: #FFFFFF;
  --bg-purple-wash: #E8E4F8;
  --bg-purple-light: #F3F0FF;
  --bg-purple-subtle: #F8F7FC;
  --bg-nav: #1E1B3A;
  --bg-illustration: #F0E6D6;

  /* Text */
  --text-primary: #1A1A1A;
  --text-body: #333333;
  --text-secondary: #555555;
  --text-muted: #888888;
  --text-tertiary: #999999;
  --text-link: #5B4ED1;
  --text-on-primary: #FFFFFF;
  --text-on-nav: #FFFFFF;

  /* Borders */
  --border-default: #E5E5E5;
  --border-strong: #D4D4D4;
  --border-focus: #5B4ED1;
  --border-error: #EF4444;

  /* Wedding Themes */
  --theme-lavender: #B8A9F0;
  --theme-blush: #F5D5D5;
  --theme-burgundy: #722F37;
  --theme-forest: #3A5F1C;
  --theme-ivory: #F5F0EB;

  /* ========== TYPOGRAPHY ========== */

  --font-sans: "Inter", "DM Sans", system-ui, -apple-system, sans-serif;
  --font-serif: "Playfair Display", "Georgia", serif;

  --text-xs: 0.6875rem;    /* 11px */
  --text-sm: 0.75rem;      /* 12px */
  --text-base-sm: 0.8125rem; /* 13px */
  --text-base: 0.875rem;   /* 14px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 1.75;

  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;

  /* ========== SPACING ========== */

  --space-0: 0px;
  --space-0-5: 2px;
  --space-1: 4px;
  --space-1-5: 6px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ========== BORDERS & RADIUS ========== */

  --border-thin: 1px;
  --border-medium: 2px;
  --border-thick: 3px;

  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-pill: 9999px;
  --radius-full: 50%;

  /* ========== SHADOWS ========== */

  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 1px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 4px 24px rgba(0, 0, 0, 0.15);
  --shadow-2xl: 0 20px 60px rgba(0, 0, 0, 0.2);

  /* ========== BREAKPOINTS (for reference, not usable as CSS vars) ========== */

  /* --screen-sm: 640px; */
  /* --screen-md: 768px; */
  /* --screen-lg: 1024px; */
  /* --screen-xl: 1280px; */
  /* --screen-2xl: 1536px; */

  /* ========== Z-INDEX ========== */

  --z-base: 0;
  --z-elevated: 10;
  --z-dropdown: 20;
  --z-sticky: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-tooltip: 70;

  /* ========== TRANSITIONS ========== */

  --transition-fast: 100ms ease-out;
  --transition-base: 150ms ease-in-out;
  --transition-moderate: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  --transition-slower: 500ms ease-in-out;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ========== OPACITY ========== */

  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-10: 0.10;
  --opacity-25: 0.25;
  --opacity-50: 0.50;
  --opacity-75: 0.75;
  --opacity-100: 1;

  /* ========== FOCUS RING ========== */

  --focus-ring-color: #5B4ED1;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* ========== ICON SIZES ========== */

  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
  --icon-2xl: 48px;

  /* ========== CONTAINERS ========== */

  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1200px;
  --container-2xl: 1400px;

  /* ========== BACKDROP & OVERLAY ========== */

  --backdrop-color: rgba(30, 27, 58, 0.5);
  --backdrop-blur: blur(4px);
  --overlay-light: rgba(255, 255, 255, 0.8);
  --overlay-dark: rgba(0, 0, 0, 0.5);
}
```

---

## 16. Tailwind Config

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      /* ========== COLORS ========== */
      colors: {
        brand: {
          primary: '#5B4ED1',
          secondary: '#EC4899',
          teal: '#3BB5A0',
          gold: '#FFB800',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#999999',
          500: '#888888',
          600: '#555555',
          700: '#333333',
          900: '#1A1A1A',
        },
        semantic: {
          success: '#22C55E',
          warning: '#FFB800',
          error: '#EF4444',
          info: '#5B4ED1',
        },
        bg: {
          page: '#FFFFFF',
          secondary: '#F5F5F5',
          warm: '#F9F8F6',
          card: '#FFFFFF',
          input: '#FFFFFF',
          'purple-wash': '#E8E4F8',
          'purple-light': '#F3F0FF',
          'purple-subtle': '#F8F7FC',
          nav: '#1E1B3A',
          illustration: '#F0E6D6',
        },
        text: {
          primary: '#1A1A1A',
          body: '#333333',
          secondary: '#555555',
          muted: '#888888',
          tertiary: '#999999',
          link: '#5B4ED1',
          'on-primary': '#FFFFFF',
          'on-nav': '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#D4D4D4',
          focus: '#5B4ED1',
          error: '#EF4444',
        },
        theme: {
          lavender: '#B8A9F0',
          blush: '#F5D5D5',
          burgundy: '#722F37',
          forest: '#3A5F1C',
          ivory: '#F5F0EB',
        },
        backdrop: {
          DEFAULT: 'rgba(30, 27, 58, 0.5)',
        },
        overlay: {
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(0, 0, 0, 0.5)',
        },
      },

      /* ========== TYPOGRAPHY ========== */
      fontFamily: {
        sans: ['"Inter"', '"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', '"Georgia"', 'serif'],
      },
      fontSize: {
        'xs': ['0.6875rem', { lineHeight: '1.5' }],       // 11px
        'sm': ['0.75rem', { lineHeight: '1.5' }],         // 12px
        'base-sm': ['0.8125rem', { lineHeight: '1.5' }],  // 13px
        'base': ['0.875rem', { lineHeight: '1.5' }],      // 14px
        'lg': ['1.125rem', { lineHeight: '1.5' }],        // 18px
        'xl': ['1.25rem', { lineHeight: '1.3' }],         // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],         // 24px
        '3xl': ['1.875rem', { lineHeight: '1.2' }],       // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],        // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],           // 48px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.5',
        relaxed: '1.625',
        loose: '1.75',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.05em',
        wider: '0.1em',
      },

      /* ========== SPACING ========== */
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      /* ========== BORDER RADIUS ========== */
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        pill: '9999px',
        full: '50%',
      },

      /* ========== SHADOWS ========== */
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 1px 4px rgba(0, 0, 0, 0.06)',
        lg: '0 2px 8px rgba(0, 0, 0, 0.08)',
        xl: '0 4px 24px rgba(0, 0, 0, 0.15)',
        '2xl': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },

      /* ========== BREAKPOINTS ========== */
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      /* ========== Z-INDEX ========== */
      zIndex: {
        base: '0',
        elevated: '10',
        dropdown: '20',
        sticky: '30',
        overlay: '40',
        modal: '50',
        toast: '60',
        tooltip: '70',
      },

      /* ========== TRANSITIONS ========== */
      transitionDuration: {
        fast: '100ms',
        base: '150ms',
        moderate: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* ========== OPACITY ========== */
      opacity: {
        0: '0',
        5: '0.05',
        10: '0.10',
        25: '0.25',
        50: '0.50',
        75: '0.75',
        100: '1',
      },

      /* ========== CONTAINERS ========== */
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1200px',
        'container-2xl': '1400px',
      },

      /* ========== ASPECT RATIOS ========== */
      aspectRatio: {
        square: '1 / 1',
        card: '4 / 3',
        landscape: '16 / 9',
        portrait: '3 / 4',
        wide: '21 / 9',
      },

      /* ========== BACKDROP BLUR ========== */
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
    },
  },
};
```



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 06                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-06--MICRO-INTERACTIONS"></a>

### Doc 06 — MICRO INTERACTIONS

> Source: `docs/06-MICRO-INTERACTIONS.md` ·     2669 lines

# Bridebook Micro-Interactions & Animations

> Cataloged from 63 UI screenshots of the Bridebook wedding planning platform.
> All timing values reference tokens from [05-DESIGN-TOKENS.md](./05-DESIGN-TOKENS.md).
> Component variants reference [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md).

---

## Table of Contents

1. [Loading States](#1-loading-states)
2. [Empty States](#2-empty-states)
3. [Error States](#3-error-states)
4. [Success States](#4-success-states)
5. [Hover & Focus States](#5-hover--focus-states)
6. [Animations](#6-animations)
7. [Mobile Gestures](#7-mobile-gestures)
8. [Accessibility](#8-accessibility)

---

## 1. Loading States

### Budget Calculation Processing Dots

**Trigger:** User submits budget form ("Zahlenverarbeitung im Gange" screen)
**Duration:** `transition-slower` (500ms) per dot cycle, infinite loop
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.processing-dots {
  display: flex;
  gap: 8px;
}
.processing-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: dot-pulse 500ms ease-in-out infinite alternate;
}
.processing-dot:nth-child(1) { background: #5B4ED1; animation-delay: 0ms; }
.processing-dot:nth-child(2) { background: #EC4899; animation-delay: 125ms; }
.processing-dot:nth-child(3) { background: #3BB5A0; animation-delay: 250ms; }
.processing-dot:nth-child(4) { background: #6DD5C3; animation-delay: 375ms; }

@keyframes dot-pulse {
  0% { transform: scale(0.6); opacity: 0.4; }
  100% { transform: scale(1); opacity: 1; }
}
```

```tsx
// Framer Motion
const dotVariants = {
  pulse: (i: number) => ({
    scale: [0.6, 1, 0.6],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      repeat: Infinity,
      delay: i * 0.125,
    },
  }),
};

const colors = ["#5B4ED1", "#EC4899", "#3BB5A0", "#6DD5C3"];

<div style={{ display: "flex", gap: 8 }}>
  {colors.map((color, i) => (
    <motion.div
      key={i}
      custom={i}
      animate="pulse"
      variants={dotVariants}
      style={{ width: 12, height: 12, borderRadius: "50%", background: color }}
    />
  ))}
</div>
```

### Skeleton Screen (Dashboard Cards)

**Trigger:** Page load, before content renders (Checkliste, Hochzeitshomepage, Gasteliste, Favoriten, Gebucht cards)
**Duration:** `transition-slower` (500ms) shimmer cycle
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.skeleton {
  background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 500ms ease-in-out infinite alternate;
  border-radius: 8px;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```tsx
<motion.div
  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatType: "reverse" }}
  style={{
    background: "linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%)",
    backgroundSize: "200% 100%",
    borderRadius: 8,
    height: 120,
  }}
/>
```

### Image Lazy-Load (Venue Cards)

**Trigger:** Image enters viewport in search results
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.venue-image {
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.venue-image.loaded {
  opacity: 1;
}
```

```tsx
<motion.img
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  src={venueSrc}
/>
```

### Map Pin Clustering (Progressive Load)

**Trigger:** Google Maps integration initializes, pins load in batches
**Duration:** `transition-moderate` (200ms) per batch
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.map-pin {
  opacity: 0;
  transform: scale(0.5) translateY(-8px);
  transition: opacity 200ms cubic-bezier(0, 0, 0.2, 1),
              transform 200ms cubic-bezier(0, 0, 0.2, 1);
}
.map-pin.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}
```

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.5, y: -8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
  className="map-pin"
/>
```

### Button Spinner (Form Submit)

**Trigger:** "Speichern", "Brochure anfragen", "Veroffentlichen" button click
**Duration:** 600ms full rotation, infinite
**Easing:** `linear`

```css
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 0.6, ease: "linear", repeat: Infinity }}
  style={{
    width: 16, height: 16, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
  }}
/>
```

### Infinite Scroll Indicator

**Trigger:** User scrolls near bottom of venue search results (10694 results)
**Duration:** `transition-slower` (500ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.scroll-indicator {
  display: flex;
  justify-content: center;
  padding: 16px;
}
.scroll-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5B4ED1;
  animation: scroll-bounce 500ms ease-in-out infinite;
}
.scroll-indicator .dot:nth-child(2) { animation-delay: 100ms; }
.scroll-indicator .dot:nth-child(3) { animation-delay: 200ms; }

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
```

```tsx
<div style={{ display: "flex", justifyContent: "center", gap: 6, padding: 16 }}>
  {[0, 1, 2].map((i) => (
    <motion.div
      key={i}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], repeat: Infinity, delay: i * 0.1 }}
      style={{ width: 8, height: 8, borderRadius: "50%", background: "#5B4ED1" }}
    />
  ))}
</div>
```

---

## 2. Empty States

### Empty Favorites / Locations

**Trigger:** User navigates to Favorites with 0 saved items
**Duration:** `transition-slow` (300ms) entrance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
}
.empty-state-illustration {
  width: 120px;
  height: 120px;
  background: #F5F0E8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  opacity: 0;
  transform: scale(0.9);
  animation: empty-entrance 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.empty-state-cta {
  background: #5B4ED1;
  color: #fff;
  border-radius: 24px;
  padding: 12px 32px;
}

@keyframes empty-entrance {
  to { opacity: 1; transform: scale(1); }
}
```

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  className="empty-state"
>
  <div className="empty-state-illustration">
    {/* Magnifying glass SVG */}
  </div>
  <p>Hier werden deine favorisierten Locations gespeichert!</p>
  <button className="empty-state-cta">Locations entdecken</button>
</motion.div>
```

### Empty Messages (Dienstleister Tab)

**Trigger:** User opens Messages → Dienstleister tab with no messages
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-messages {
  text-align: center;
  padding: 48px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.empty-messages-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 16px;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  className="empty-messages"
>
  {/* Envelope with heart illustration */}
  <h3>Noch keine Nachrichten</h3>
  <p>Schreibe eine Nachricht an einen Dienstleister.</p>
</motion.div>
```

### Empty Messages (Gaste Tab)

**Trigger:** User opens Messages → Gaste tab with no guest messages
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-guest-messages {
  text-align: center;
  padding: 48px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {/* Envelope illustration */}
  <h3>Erreiche deine Gaste uber Bridebook direkt per E-Mail</h3>
  <ol>
    <li>Schritt 1: Gaste hinzufugen</li>
    <li>Schritt 2: Events erstellen</li>
    <li>Schritt 3: Nachricht senden</li>
  </ol>
</motion.div>
```

### Empty Messages (Bridebook Tab)

**Trigger:** User opens Messages → Bridebook tab
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-bridebook-messages {
  text-align: center;
  padding: 48px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {/* Teal play icon illustration */}
  <h3>Findet heraus, was es Neues gibt</h3>
</motion.div>
```

### Empty Messages (Archiviert Tab)

**Trigger:** User opens Messages → Archiviert tab with no archived items
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-archived {
  text-align: center;
  padding: 48px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {/* Purple chat bubbles illustration */}
  <h3>Archivierte Nachrichten</h3>
</motion.div>
```

### Empty Guest List

**Trigger:** User opens Gasteliste with 0 guests
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.empty-guestlist {
  text-align: center;
  padding: 48px 24px;
}
.empty-guestlist-illustration {
  width: 120px;
  height: 120px;
  background: #F5F0E8;
  border-radius: 50%;
  margin: 0 auto 24px;
  opacity: 0;
  animation: empty-entrance 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {/* Two hearts illustration on beige circle */}
  <p>Lass uns ein paar Freunde zu deiner Gasteliste hinzufugen!</p>
  <button className="btn-primary">Fuge deine ersten Gaste hinzu</button>
</motion.div>
```

### Empty Budget (Zero State)

**Trigger:** Budget categories all show "0 EUR"
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.budget-zero {
  color: #9CA3AF;
  font-variant-numeric: tabular-nums;
  opacity: 0;
  animation: fade-in 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes fade-in {
  to { opacity: 1; }
}
```

```tsx
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ color: "#9CA3AF" }}
>
  0 EUR
</motion.span>
```

### First-Time Dashboard

**Trigger:** New user lands on dashboard; all cards show "Loslegen", Favoriten "0 gespeichert"
**Duration:** `transition-slow` (300ms) staggered per card
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.dashboard-card {
  opacity: 0;
  transform: translateY(16px);
  animation: stagger-in 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.dashboard-card:nth-child(1) { animation-delay: 0ms; }
.dashboard-card:nth-child(2) { animation-delay: 75ms; }
.dashboard-card:nth-child(3) { animation-delay: 150ms; }
.dashboard-card:nth-child(4) { animation-delay: 225ms; }
.dashboard-card:nth-child(5) { animation-delay: 300ms; }

@keyframes stagger-in {
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1], delay: i * 0.075 },
  }),
};

{cards.map((card, i) => (
  <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
    {card.content}
    <a>Loslegen</a>
  </motion.div>
))}
```

### Empty Dreamteam

**Trigger:** Dreamteam section showing "0 Favoriten" across Hochzeitslocations/Fotograf/Florist
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.dreamteam-card-empty {
  opacity: 0.7;
  border: 1px dashed #D1D5DB;
  transition: opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.dreamteam-card-empty:hover {
  opacity: 1;
  border-color: #5B4ED1;
}
```

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.7 }}
  whileHover={{ opacity: 1, borderColor: "#5B4ED1" }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ border: "1px dashed #D1D5DB", borderRadius: 12 }}
>
  <span>0 Favoriten</span>
</motion.div>
```

### Milestones (Locked)

**Trigger:** Hexagonal badges displayed greyed out with unlock conditions
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.milestone-locked {
  filter: grayscale(100%);
  opacity: 0.5;
  transition: filter 300ms cubic-bezier(0, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.milestone-unlocked {
  filter: grayscale(0%);
  opacity: 1;
}
```

```tsx
<motion.div
  animate={unlocked ? { filter: "grayscale(0%)", opacity: 1 } : { filter: "grayscale(100%)", opacity: 0.5 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  className="milestone-badge"
/>
```

### No Search Results

**Trigger:** Filter combination returns 0 venue results
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.no-results {
  text-align: center;
  padding: 64px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  <p>Keine Ergebnisse fur deine Filter.</p>
  <button>Filter zurucksetzen</button>
</motion.div>
```

### First-Time Countdown (Zero State)

**Trigger:** Dashboard countdown shows 0 Tage 0 Std 0 Min 0 Sek + "Noch kein Hochzeitsdatum"
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.countdown-zero .digit {
  color: #9CA3AF;
  font-size: 32px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.countdown-prompt {
  color: #5B4ED1;
  text-decoration: underline;
  cursor: pointer;
}
```

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  className="countdown-zero"
>
  {["Tage", "Std", "Min", "Sek"].map((label) => (
    <div key={label}><span className="digit">0</span><span>{label}</span></div>
  ))}
  <a className="countdown-prompt">Noch kein Hochzeitsdatum</a>
</motion.div>
```

---

## 3. Error States

### Form Validation (Inline)

**Trigger:** User submits form with empty required fields (marked `[Pflicht]`)
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.input-error {
  border-color: #EF4444;
  animation: shake 150ms ease-in-out;
}
.input-error-message {
  color: #EF4444;
  font-size: 13px;
  margin-top: 4px;
  opacity: 0;
  animation: fade-in 150ms ease-in-out forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

```tsx
<motion.div
  animate={hasError ? { x: [0, -4, 4, 0] } : {}}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
>
  <input style={{ borderColor: hasError ? "#EF4444" : "#D1D5DB" }} />
  {hasError && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      style={{ color: "#EF4444", fontSize: 13 }}
    >
      Dieses Feld ist ein Pflichtfeld
    </motion.p>
  )}
</motion.div>
```

### Required Field Indicators

**Trigger:** Form render — asterisk `*` on required labels (Element*, E-Mail*, Dein Name*)
**Duration:** Immediate (no animation)
**Easing:** N/A

```css
.label-required::after {
  content: " *";
  color: #EF4444;
}
```

```tsx
<label>
  {label}
  {required && <span style={{ color: "#EF4444" }}> *</span>}
</label>
```

### Destructive Action Confirmation

**Trigger:** User clicks "Konto loschen" — warning appears: "Dies kann nicht ruckgangig gemacht werden"
**Duration:** `transition-slow` (300ms) modal entrance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.btn-destructive {
  color: #EF4444;
  border: 1px solid #EF4444;
  background: transparent;
  border-radius: 8px;
  padding: 10px 20px;
  transition: background 150ms ease-in-out, color 150ms ease-in-out;
}
.btn-destructive:hover {
  background: #EF4444;
  color: #fff;
}
.destructive-warning {
  color: #6B7280;
  font-size: 14px;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  <p className="destructive-warning">Dies kann nicht ruckgangig gemacht werden</p>
  <motion.button
    whileHover={{ backgroundColor: "#EF4444", color: "#fff" }}
    transition={{ duration: 0.15 }}
    className="btn-destructive"
  >
    Konto loschen
  </motion.button>
</motion.div>
```

### Budget Delete Confirmation

**Trigger:** User clicks delete in budget item detail modal — red "Dieses Element loschen" button
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.budget-delete-btn {
  color: #EF4444;
  border: 1px solid #EF4444;
  background: transparent;
  border-radius: 8px;
  padding: 10px 20px;
  width: 100%;
  transition: background 150ms ease-in-out;
}
.budget-delete-btn:hover {
  background: #FEF2F2;
}
```

```tsx
<motion.button
  whileHover={{ backgroundColor: "#FEF2F2" }}
  transition={{ duration: 0.15 }}
  style={{
    color: "#EF4444", border: "1px solid #EF4444",
    background: "transparent", borderRadius: 8, padding: "10px 20px", width: "100%",
  }}
>
  Dieses Element loschen
</motion.button>
```

### Info Banner with Dismiss

**Trigger:** Contextual info displayed: "Fugt zuerst Gaste zu Events hinzu" with X close
**Duration:** `transition-moderate` (200ms) dismiss
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.info-banner {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-banner.dismissing {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
}
```

```tsx
<AnimatePresence>
  {showBanner && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: "#EFF6FF", border: "1px solid #BFDBFE",
        borderRadius: 8, padding: "12px 16px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
      }}
    >
      <span>Fugt zuerst Gaste zu Events hinzu</span>
      <button onClick={() => setShowBanner(false)}>✕</button>
    </motion.div>
  )}
</AnimatePresence>
```

### Network/Offline Error

**Trigger:** Network request fails or device goes offline
**Duration:** `transition-slow` (300ms) entrance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.offline-banner {
  background: #FEF2F2;
  border-bottom: 2px solid #EF4444;
  padding: 12px 16px;
  text-align: center;
  color: #991B1B;
  opacity: 0;
  transform: translateY(-100%);
  animation: slide-down 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes slide-down {
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: "-100%" }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{
    background: "#FEF2F2", borderBottom: "2px solid #EF4444",
    padding: "12px 16px", textAlign: "center", color: "#991B1B",
  }}
>
  Keine Internetverbindung. Bitte uberprufe deine Verbindung.
</motion.div>
```

### 404 Not Found

**Trigger:** User navigates to non-existent route
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.not-found {
  text-align: center;
  padding: 80px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.not-found h1 { font-size: 48px; color: #5B4ED1; }
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ textAlign: "center", padding: "80px 24px" }}
>
  <h1 style={{ fontSize: 48, color: "#5B4ED1" }}>404</h1>
  <p>Seite nicht gefunden</p>
  <a href="/">Zuruck zur Startseite</a>
</motion.div>
```

### Session Timeout Modal

**Trigger:** User session expires after inactivity
**Duration:** `transition-slow` (300ms) modal entrance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.timeout-modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.timeout-modal-content {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
```

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  style={{ background: "rgba(0,0,0,0.5)", position: "fixed", inset: 0 }}
>
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  >
    <h3>Sitzung abgelaufen</h3>
    <p>Bitte melde dich erneut an.</p>
    <button>Anmelden</button>
  </motion.div>
</motion.div>
```

### Permission Denied

**Trigger:** User attempts restricted action without authorization
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.permission-denied {
  text-align: center;
  padding: 64px 24px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ textAlign: "center", padding: "64px 24px" }}
>
  <p>Du hast keine Berechtigung fur diese Aktion.</p>
  <a href="/">Zuruck zur Startseite</a>
</motion.div>
```

---

## 4. Success States

### Budget Calculated

**Trigger:** Processing dots finish → full budget breakdown with estimated costs
**Duration:** `transition-slow` (300ms) content entrance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.budget-result {
  opacity: 0;
  transform: translateY(12px);
  animation: reveal 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.budget-row {
  animation: reveal 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.budget-row:nth-child(n) {
  animation-delay: calc(var(--index) * 50ms);
}

@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {budgetRows.map((row, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: i * 0.05 }}
    >
      <span>{row.category}</span>
      <span>{row.amount} EUR</span>
    </motion.div>
  ))}
</motion.div>
```

### Form Saved

**Trigger:** User clicks "Speichern" on settings/homepage editor
**Duration:** `transition-base` (150ms) button state change
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.btn-saved {
  background: #10B981;
  color: #fff;
  transition: background 150ms ease-in-out;
}
.btn-saved .checkmark {
  display: inline-block;
  animation: check-pop 150ms ease-in-out;
}

@keyframes check-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

```tsx
<motion.button
  animate={saved ? { backgroundColor: "#10B981" } : { backgroundColor: "#5B4ED1" }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
>
  {saved ? (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.15 }}
    >
      ✓ Gespeichert
    </motion.span>
  ) : "Speichern"}
</motion.button>
```

### Published State

**Trigger:** User clicks "Veroffentlichen" — status changes to published
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  transition: background 150ms ease-in-out, color 150ms ease-in-out;
}
.status-badge.unpublished {
  background: #F3F4F6;
  color: #6B7280;
}
.status-badge.published {
  background: #ECFDF5;
  color: #059669;
}
```

```tsx
<motion.span
  animate={published
    ? { backgroundColor: "#ECFDF5", color: "#059669" }
    : { backgroundColor: "#F3F4F6", color: "#6B7280" }
  }
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ padding: "4px 12px", borderRadius: 12, fontSize: 13 }}
>
  {published ? "Veroffentlicht" : "Nicht veroffentlicht"}
</motion.span>
```

### Venue Message Sent

**Trigger:** "Brochure anfragen" form submitted successfully
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.sent-confirmation {
  text-align: center;
  padding: 32px;
  opacity: 0;
  animation: fade-up 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.sent-confirmation .icon {
  color: #10B981;
  font-size: 48px;
}
```

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ textAlign: "center", padding: 32 }}
>
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: [0, 1.2, 1] }}
    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    style={{ color: "#10B981", fontSize: 48 }}
  >
    ✓
  </motion.div>
  <p>Nachricht gesendet!</p>
</motion.div>
```

### Guest Added

**Trigger:** "Speichern" in guest add modal
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.guest-row-new {
  background: #F0EDFA;
  animation: highlight-fade 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes highlight-fade {
  0% { background: #E8E4F8; }
  100% { background: transparent; }
}
```

```tsx
<motion.tr
  initial={{ opacity: 0, backgroundColor: "#E8E4F8" }}
  animate={{ opacity: 1, backgroundColor: "transparent" }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
/>
```

### Favorite Added (Heart Fill)

**Trigger:** User clicks heart icon on venue card
**Duration:** `transition-fast` (100ms) + `ease-bounce`
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.heart-icon {
  cursor: pointer;
  transition: transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.heart-icon.active {
  color: #EF4444;
  fill: #EF4444;
  transform: scale(1.2);
}
```

```tsx
<motion.button
  whileTap={{ scale: 1.3 }}
  animate={favorited ? { scale: [1, 1.3, 1], color: "#EF4444" } : { scale: 1, color: "#9CA3AF" }}
  transition={{ duration: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
>
  <HeartIcon filled={favorited} />
</motion.button>
```

### Toast Notification

**Trigger:** After successful action (save, delete, send)
**Duration:** `transition-slow` (300ms) in, auto-dismiss after 3000ms
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)` in, `ease-in` out

```css
.toast {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 60; /* z-toast */
  background: #1F2937;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  transform: translateX(120%);
  opacity: 0;
  animation: toast-in 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes toast-in {
  to { transform: translateX(0); opacity: 1; }
}
@keyframes toast-out {
  to { transform: translateX(120%); opacity: 0; }
}
```

```tsx
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ x: "120%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "120%", opacity: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 60,
        background: "#1F2937", color: "#fff", padding: "12px 20px",
        borderRadius: 8, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      }}
    >
      {message}
    </motion.div>
  )}
</AnimatePresence>
```

### Checkmark on Task Complete

**Trigger:** User checks off a checklist item
**Duration:** `transition-fast` (100ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.checkbox-check {
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  animation: draw-check 100ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}
```

```tsx
<motion.svg viewBox="0 0 16 16" width={16} height={16}>
  <motion.path
    d="M3 8l3 3 7-7"
    fill="none"
    stroke="#5B4ED1"
    strokeWidth={2}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.1, ease: [0, 0, 0.2, 1] }}
  />
</motion.svg>
```

### Booking Confirmed

**Trigger:** Vendor booking finalized
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.booking-confirmed {
  text-align: center;
  padding: 32px;
}
.booking-confirmed .icon {
  font-size: 56px;
  animation: bounce-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
```

```tsx
<motion.div style={{ textAlign: "center", padding: 32 }}>
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    style={{ fontSize: 56 }}
  >
    🎉
  </motion.div>
  <p>Buchung bestatigt!</p>
</motion.div>
```

---

## 5. Hover & Focus States

### Input Focus Ring

**Trigger:** User focuses any form input (search bars, email fields, text areas)
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
input, textarea, select {
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;
}
input:focus, textarea:focus, select:focus {
  border-color: #5B4ED1;
  box-shadow: 0 0 0 2px rgba(91, 78, 209, 0.2);
}
```

```tsx
<motion.input
  whileFocus={{ borderColor: "#5B4ED1", boxShadow: "0 0 0 2px rgba(91,78,209,0.2)" }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 14px" }}
/>
```

### Tab Active Underline

**Trigger:** User clicks a tab (Details/Design/Einstellungen, Dienstleister/Gaste/Bridebook/Archiviert)
**Duration:** `transition-moderate` (200ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.tab {
  position: relative;
  padding: 12px 16px;
  color: #6B7280;
  transition: color 200ms ease-in-out;
}
.tab.active {
  color: #5B4ED1;
}
.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #5B4ED1;
  border-radius: 3px 3px 0 0;
}
```

```tsx
<motion.div style={{ position: "relative", padding: "12px 16px" }}>
  <span style={{ color: active ? "#5B4ED1" : "#6B7280" }}>{label}</span>
  {active && (
    <motion.div
      layoutId="tab-underline"
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, background: "#5B4ED1", borderRadius: "3px 3px 0 0",
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    />
  )}
</motion.div>
```

### Chip/Pill Selected

**Trigger:** User selects a chip/pill (filter options, "Unentschlossen", result count)
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.chip {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #D1D5DB;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 150ms ease-in-out;
}
.chip.selected {
  background: #5B4ED1;
  border-color: #5B4ED1;
  color: #fff;
}
```

```tsx
<motion.button
  animate={selected
    ? { backgroundColor: "#5B4ED1", borderColor: "#5B4ED1", color: "#fff" }
    : { backgroundColor: "#fff", borderColor: "#D1D5DB", color: "#374151" }
  }
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ padding: "6px 16px", borderRadius: 20, border: "1px solid" }}
>
  {label}
</motion.button>
```

### Sidebar Nav Active

**Trigger:** User clicks sidebar item — purple wash background + left border
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.sidebar-item {
  padding: 10px 16px;
  border-left: 3px solid transparent;
  transition: all 150ms ease-in-out;
}
.sidebar-item.active {
  background: #E8E4F8;
  border-left-color: #5B4ED1;
  color: #5B4ED1;
}
```

```tsx
<motion.a
  animate={active
    ? { backgroundColor: "#E8E4F8", borderLeftColor: "#5B4ED1", color: "#5B4ED1" }
    : { backgroundColor: "transparent", borderLeftColor: "transparent", color: "#374151" }
  }
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ padding: "10px 16px", borderLeft: "3px solid" }}
>
  {label}
</motion.a>
```

### Button Hover

**Trigger:** Mouse enters primary/secondary button
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.btn-primary {
  background: #5B4ED1;
  color: #fff;
  border-radius: 8px;
  padding: 10px 24px;
  transition: background 150ms ease-in-out, transform 150ms ease-in-out;
}
.btn-primary:hover {
  background: #4A3DB8;
}
.btn-outline {
  border: 1px solid #5B4ED1;
  color: #5B4ED1;
  background: transparent;
  transition: background 150ms ease-in-out;
}
.btn-outline:hover {
  background: rgba(91, 78, 209, 0.05);
}
```

```tsx
<motion.button
  whileHover={{ backgroundColor: "#4A3DB8" }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ background: "#5B4ED1", color: "#fff", borderRadius: 8, padding: "10px 24px" }}
>
  {label}
</motion.button>
```

### Card Hover/Lift

**Trigger:** Mouse enters venue card, planning tool card, or Dreamteam card
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 150ms ease-in-out, transform 150ms ease-in-out;
}
.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

```tsx
<motion.div
  whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
>
  {children}
</motion.div>
```

### Link Hover

**Trigger:** Mouse enters purple links ("Dienstleister suchen", "Loslegen", "Manuell hinzufugen")
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.link {
  color: #5B4ED1;
  text-decoration: none;
  transition: text-decoration 150ms ease-in-out;
}
.link:hover {
  text-decoration: underline;
}
```

```tsx
<motion.a
  whileHover={{ textDecoration: "underline" }}
  style={{ color: "#5B4ED1", textDecoration: "none" }}
>
  {label}
</motion.a>
```

### Checkbox Hover

**Trigger:** Mouse enters checkbox in filter panels
**Duration:** `transition-fast` (100ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  transition: border-color 100ms ease-out;
}
.checkbox:hover {
  border-color: #5B4ED1;
}
.checkbox:checked {
  background: #5B4ED1;
  border-color: #5B4ED1;
}
```

```tsx
<motion.div
  whileHover={{ borderColor: "#5B4ED1" }}
  transition={{ duration: 0.1, ease: [0, 0, 0.2, 1] }}
  style={{ width: 18, height: 18, border: "2px solid #D1D5DB", borderRadius: 4 }}
/>
```

### Map Pin Hover

**Trigger:** Mouse enters venue pin on Google Maps
**Duration:** `transition-fast` (100ms)
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.map-pin:hover {
  transform: scale(1.3);
  transition: transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}
```

```tsx
<motion.div
  whileHover={{ scale: 1.3 }}
  transition={{ duration: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
  className="map-pin"
/>
```

### Design Theme Selector

**Trigger:** User clicks a color dot in Hochzeitshomepage design settings
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.theme-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 150ms ease-in-out;
}
.theme-dot.selected {
  border-color: #3B82F6;
}
```

```tsx
<motion.button
  animate={selected ? { borderColor: "#3B82F6" } : { borderColor: "transparent" }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{
    width: 32, height: 32, borderRadius: "50%",
    background: color, border: "3px solid",
  }}
/>
```

### Font Selector Hover

**Trigger:** Mouse enters font preview card in design settings
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.font-card {
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 150ms ease-in-out;
}
.font-card:hover {
  border-color: #5B4ED1;
}
.font-card.selected {
  border-color: #5B4ED1;
  background: #F0EDFA;
}
```

```tsx
<motion.div
  whileHover={{ borderColor: "#5B4ED1" }}
  animate={selected ? { borderColor: "#5B4ED1", backgroundColor: "#F0EDFA" } : {}}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
  style={{ border: "2px solid #E5E7EB", borderRadius: 8, padding: 16 }}
>
  <span style={{ fontFamily }}>{fontName}</span>
</motion.div>
```

### Toggle Switch

**Trigger:** User clicks Veroffentlicht/Homepage-Passwort toggle
**Duration:** `transition-fast` (100ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.toggle-track {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #D1D5DB;
  position: relative;
  cursor: pointer;
  transition: background 100ms ease-out;
}
.toggle-track.active {
  background: #5B4ED1;
}
.toggle-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 100ms ease-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.toggle-track.active .toggle-thumb {
  transform: translateX(20px);
}
```

```tsx
<motion.div
  animate={{ backgroundColor: active ? "#5B4ED1" : "#D1D5DB" }}
  transition={{ duration: 0.1, ease: [0, 0, 0.2, 1] }}
  style={{ width: 44, height: 24, borderRadius: 12, position: "relative", cursor: "pointer" }}
  onClick={toggle}
>
  <motion.div
    animate={{ x: active ? 20 : 0 }}
    transition={{ duration: 0.1, ease: [0, 0, 0.2, 1] }}
    style={{
      width: 20, height: 20, borderRadius: "50%", background: "#fff",
      position: "absolute", top: 2, left: 2,
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }}
  />
</motion.div>
```

---

## 6. Animations

### Modal Open/Close

**Trigger:** Opening favorites add, guest add, venue contact, budget detail, or data edit modal
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 40; /* z-overlay */
  transition: background 300ms cubic-bezier(0, 0, 0.2, 1);
}
.modal-backdrop.open {
  background: rgba(0, 0, 0, 0.5); /* opacity-50 */
}
.modal-content {
  z-index: 50; /* z-modal */
  transform: scale(0.95) translateY(16px);
  opacity: 0;
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.modal-content.open {
  transform: scale(1) translateY(0);
  opacity: 1;
}
```

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        style={{ position: "fixed", inset: 0, background: "#000", zIndex: 40 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        style={{ zIndex: 50 }}
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Dropdown Expand

**Trigger:** Click on nav menus (Locations & Dienstleister, Planungs-Tools) or accordion sections
**Duration:** `transition-moderate` (200ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.dropdown {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 200ms ease-in-out, opacity 200ms ease-in-out;
}
.dropdown.open {
  max-height: 500px;
  opacity: 1;
}
```

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Tab Underline Slide

**Trigger:** User switches between tabs — active indicator slides horizontally
**Duration:** `transition-moderate` (200ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: #5B4ED1;
  border-radius: 3px 3px 0 0;
  transition: left 200ms ease-in-out, width 200ms ease-in-out;
}
```

```tsx
<motion.div
  layoutId="tab-indicator"
  style={{
    position: "absolute", bottom: 0, height: 3,
    background: "#5B4ED1", borderRadius: "3px 3px 0 0",
  }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
/>
```

### Budget Processing Dots

**Trigger:** Budget form submitted — 4 colored dots animate in sequence
**Duration:** `transition-slower` (500ms) per cycle
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

> See [Budget Calculation Processing Dots](#budget-calculation-processing-dots) in Loading States.

### Countdown Timer

**Trigger:** Dashboard loads — digits tick down (Tage/Std/Min/Sek)
**Duration:** 1000ms per tick
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.countdown-digit {
  font-size: 32px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  display: inline-block;
}
.countdown-digit.tick {
  animation: digit-tick 200ms cubic-bezier(0, 0, 0.2, 1);
}

@keyframes digit-tick {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

```tsx
<motion.span
  key={value}
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
  style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
>
  {value}
</motion.span>
```

### Filter Panel Expand/Collapse

**Trigger:** User opens filter panel — checkbox groups expand
**Duration:** `transition-moderate` (200ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.filter-group {
  overflow: hidden;
  max-height: 0;
  transition: max-height 200ms ease-in-out;
}
.filter-group.expanded {
  max-height: 400px;
}
.filter-reset {
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}
.filter-group.expanded ~ .filter-reset {
  opacity: 1;
}
```

```tsx
<motion.div
  animate={expanded ? { height: "auto" } : { height: 0 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  style={{ overflow: "hidden" }}
>
  {filterOptions}
</motion.div>
<motion.button
  animate={{ opacity: expanded ? 1 : 0 }}
  transition={{ duration: 0.2 }}
>
  Filter zurucksetzen
</motion.button>
```

### Image Carousel

**Trigger:** User swipes/clicks arrows on venue card image gallery
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.carousel-track {
  display: flex;
  transition: transform 300ms ease-in-out;
}
.carousel-track[data-slide="1"] { transform: translateX(-100%); }
.carousel-track[data-slide="2"] { transform: translateX(-200%); }
```

```tsx
<motion.div
  animate={{ x: `-${currentSlide * 100}%` }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  style={{ display: "flex" }}
>
  {images.map((src, i) => (
    <img key={i} src={src} style={{ minWidth: "100%" }} />
  ))}
</motion.div>
```

### Milestone Badge Unlock

**Trigger:** User completes milestone condition — hexagon badge transitions from grey to colored
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.milestone-badge {
  transition: filter 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.milestone-badge.unlocked {
  filter: grayscale(0%);
  transform: scale(1.15);
  animation: badge-settle 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms forwards;
}

@keyframes badge-settle {
  to { transform: scale(1); }
}
```

```tsx
<motion.div
  animate={unlocked
    ? { filter: "grayscale(0%)", scale: [1, 1.15, 1] }
    : { filter: "grayscale(100%)", scale: 1 }
  }
  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
/>
```

### Page Section Entrance (Staggered)

**Trigger:** Dashboard page loads — sections fade in sequentially (hero, quick actions, nearby locations, categories)
**Duration:** `transition-slow` (300ms) per section
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.section {
  opacity: 0;
  transform: translateY(20px);
  animation: section-enter 300ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.section:nth-child(1) { animation-delay: 0ms; }
.section:nth-child(2) { animation-delay: 100ms; }
.section:nth-child(3) { animation-delay: 200ms; }
.section:nth-child(4) { animation-delay: 300ms; }

@keyframes section-enter {
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1], delay: i * 0.1 },
  }),
};

{sections.map((section, i) => (
  <motion.section key={i} custom={i} initial="hidden" animate="visible" variants={sectionVariants}>
    {section}
  </motion.section>
))}
```

### Heart Pulse on Favorite

**Trigger:** User adds venue to favorites — heart icon pulses
**Duration:** `transition-fast` (100ms) + `ease-bounce`
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

> See [Favorite Added (Heart Fill)](#favorite-added-heart-fill) in Success States.

### Checkbox Checkmark Draw

**Trigger:** User checks a checkbox — SVG path draws in
**Duration:** `transition-fast` (100ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

> See [Checkmark on Task Complete](#checkmark-on-task-complete) in Success States.

### Progress Bar Fill

**Trigger:** Budget progress or checklist completion percentage updates
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #5B4ED1;
  border-radius: 4px;
  transition: width 300ms cubic-bezier(0, 0, 0.2, 1);
}
```

```tsx
<div style={{ height: 8, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
  <motion.div
    animate={{ width: `${percentage}%` }}
    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
    style={{ height: "100%", background: "#5B4ED1", borderRadius: 4 }}
  />
</div>
```

### Lightbox/Gallery Open

**Trigger:** User clicks venue photo or Hochzeitshomepage image
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 40;
  transition: background 300ms cubic-bezier(0, 0, 0.2, 1);
}
.lightbox-backdrop.open {
  background: rgba(0, 0, 0, 0.9);
}
.lightbox-image {
  transform: scale(0.8);
  opacity: 0;
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0, 0, 0.2, 1);
}
.lightbox-image.open {
  transform: scale(1);
  opacity: 1;
}
```

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        style={{ position: "fixed", inset: 0, background: "#000", zIndex: 40 }}
      />
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        src={imageSrc}
        style={{ zIndex: 50, maxWidth: "90vw", maxHeight: "90vh" }}
      />
    </>
  )}
</AnimatePresence>
```

### Notification Badge Bounce

**Trigger:** New unread message/favorite — badge appears on navbar icon
**Duration:** `transition-fast` (100ms) + `ease-bounce`
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #EF4444;
  color: #fff;
  font-size: 11px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badge-bounce 100ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badge-bounce {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
```

```tsx
<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
  style={{
    position: "absolute", top: -4, right: -4,
    width: 18, height: 18, background: "#EF4444", color: "#fff",
    fontSize: 11, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}
>
  {count}
</motion.span>
```

---

## 7. Mobile Gestures

### Horizontal Tab Scroll

**Trigger:** Tab bar overflows on mobile — becomes horizontally scrollable with fade edges
**Duration:** N/A (native scroll)
**Easing:** Native momentum scroll

```css
.tab-scroll {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent);
}
.tab-scroll::-webkit-scrollbar { display: none; }
```

```tsx
<div
  style={{
    display: "flex", overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    maskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
  }}
>
  {tabs.map((tab) => <TabItem key={tab.id} {...tab} />)}
</div>
```

### Pull to Refresh

**Trigger:** User pulls down on venue list, messages, or guest list
**Duration:** `transition-slow` (300ms) snap-back
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.pull-indicator {
  height: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height 300ms cubic-bezier(0, 0, 0.2, 1);
}
.pull-indicator.active {
  height: 60px;
}
.pull-spinner {
  animation: spin 600ms linear infinite;
}
```

```tsx
<motion.div
  animate={{ height: isPulling ? 60 : 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  style={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}
>
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}>
    ↻
  </motion.div>
</motion.div>
```

### Swipe to Delete

**Trigger:** User swipes left on guest list item or archived message
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.swipe-item {
  position: relative;
  overflow: hidden;
}
.swipe-content {
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
}
.swipe-content.swiped {
  transform: translateX(-80px);
}
.swipe-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: #EF4444;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

```tsx
<motion.div style={{ position: "relative", overflow: "hidden" }}>
  <motion.div
    drag="x"
    dragConstraints={{ left: -80, right: 0 }}
    dragElastic={0.1}
    onDragEnd={(_, info) => { if (info.offset.x < -40) onDelete(); }}
    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
  >
    {content}
  </motion.div>
  <div style={{
    position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
    background: "#EF4444", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    Loschen
  </div>
</motion.div>
```

### Carousel Swipe

**Trigger:** User swipes horizontally on venue image gallery, Dienstleister cards, or nearby locations
**Duration:** `transition-slow` (300ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
.mobile-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 16px;
  scrollbar-width: none;
}
.mobile-carousel::-webkit-scrollbar { display: none; }
.mobile-carousel > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -(items.length - 1) * cardWidth, right: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  style={{ display: "flex", gap: 16 }}
>
  {items.map((item, i) => <Card key={i} {...item} />)}
</motion.div>
```

### Pinch to Zoom

**Trigger:** User pinch-zooms on venue photos or Google Maps
**Duration:** Native gesture (real-time)
**Easing:** Native

```css
.zoomable {
  touch-action: manipulation;
  max-width: 100%;
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
}
```

```tsx
// Use native CSS touch-action or a library like use-gesture
<motion.img
  style={{ touchAction: "manipulation", maxWidth: "100%" }}
  whileTap={{ scale: 1 }}
  src={src}
/>
```

### Long Press Context Menu

**Trigger:** User long-presses (500ms) on venue card or guest list item
**Duration:** `transition-moderate` (200ms) menu appearance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.context-menu {
  position: absolute;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 200ms cubic-bezier(0, 0, 0.2, 1),
              transform 200ms cubic-bezier(0, 0, 0.2, 1);
}
.context-menu.visible {
  opacity: 1;
  transform: scale(1);
}
```

```tsx
<AnimatePresence>
  {showMenu && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
      style={{
        position: "absolute", background: "#fff", borderRadius: 12,
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: "8px 0",
      }}
    >
      <button>Zu Favoriten hinzufugen</button>
      <button>Teilen</button>
    </motion.div>
  )}
</AnimatePresence>
```

### Double-Tap to Favorite

**Trigger:** User double-taps venue card in search results
**Duration:** `transition-fast` (100ms) heart + `ease-bounce`
**Easing:** `ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`

```css
.double-tap-heart {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  color: #EF4444;
  font-size: 64px;
  pointer-events: none;
  animation: heart-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes heart-pop {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}
```

```tsx
<AnimatePresence>
  {showHeart && (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.2, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", color: "#EF4444",
        fontSize: 64, pointerEvents: "none",
      }}
    >
      ♥
    </motion.div>
  )}
</AnimatePresence>
```

---

## 8. Accessibility

### prefers-reduced-motion Global Override

All animations in this document must respect the user's motion preference. Apply this global rule:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// Framer Motion global setup
import { useReducedMotion } from "framer-motion";

function AnimatedComponent({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Reduced Motion Fallback Per Category

| Category | Full Motion | Reduced Motion |
|----------|-------------|----------------|
| Loading dots | Scale + opacity pulse | Static dots, opacity-only |
| Skeleton shimmer | Background-position slide | Static grey placeholder |
| Modal open/close | Scale + translateY + opacity | Opacity-only (instant) |
| Dropdown expand | Height animation | Instant show/hide |
| Tab underline slide | Horizontal position transition | Instant position change |
| Card hover lift | translateY + shadow | Shadow change only |
| Toast slide | translateX slide | Opacity-only |
| Heart pulse | Scale bounce | Color change only |
| Progress bar fill | Width transition | Instant width |
| Carousel | Transform slide | Instant snap |
| Page section entrance | Staggered fade + translateY | Immediate display |
| Milestone badge unlock | Scale bounce + filter | Filter change only |
| Countdown tick | translateY digit roll | Instant value change |

### Focus Trap in Modals

**Trigger:** Any modal opens (favorites add, guest add, venue contact, budget detail, data edit)
**Duration:** Immediate
**Easing:** N/A

```css
/* Prevent body scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
```

```tsx
import { useEffect, useRef } from "react";

function useFocusTrap(isOpen: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return ref;
}
```

### Focus-Visible Rings

**Trigger:** Keyboard navigation reaches any interactive element
**Duration:** `transition-base` (150ms)
**Easing:** `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)`

```css
:focus-visible {
  outline: 2px solid #5B4ED1; /* focus-ring-color */
  outline-offset: 2px; /* focus-ring-offset */
  transition: outline-color 150ms ease-in-out;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

```tsx
// Apply via Tailwind or inline
<button
  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4ED1]"
>
  {label}
</button>
```

### Skip Navigation

**Trigger:** First Tab press on page load
**Duration:** `transition-base` (150ms) appearance
**Easing:** `ease-out` — `cubic-bezier(0, 0, 0.2, 1)`

```css
.skip-nav {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 100;
  background: #5B4ED1;
  color: #fff;
  padding: 12px 24px;
  border-radius: 0 0 8px 8px;
  transition: top 150ms cubic-bezier(0, 0, 0.2, 1);
}
.skip-nav:focus {
  top: 0;
}
```

```tsx
<a
  href="#main-content"
  style={{
    position: "absolute", top: "-100%", left: 16, zIndex: 100,
    background: "#5B4ED1", color: "#fff", padding: "12px 24px",
    borderRadius: "0 0 8px 8px", transition: "top 150ms cubic-bezier(0,0,0.2,1)",
  }}
  onFocus={(e) => (e.currentTarget.style.top = "0")}
  onBlur={(e) => (e.currentTarget.style.top = "-100%")}
>
  Zum Hauptinhalt springen
</a>
```

### ARIA Live Regions

**Trigger:** Dynamic content changes (toast notifications, loading states, error messages)
**Duration:** N/A (screen reader announcement)
**Easing:** N/A

```html
<!-- Toast notifications -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="toast-region">
  <!-- Dynamically updated with toast message text -->
</div>

<!-- Loading states -->
<div aria-live="polite" aria-busy="true" role="status">
  Zahlenverarbeitung im Gange...
</div>

<!-- Error messages -->
<div aria-live="assertive" role="alert">
  Dieses Feld ist ein Pflichtfeld
</div>
```

```tsx
// Toast live region
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {toastMessage}
</div>

// Loading status
<div aria-live="polite" aria-busy={isLoading} role="status">
  {isLoading ? "Laden..." : "Fertig"}
</div>

// Error alert
{hasError && (
  <div aria-live="assertive" role="alert">
    {errorMessage}
  </div>
)}
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Token Reference

All timing and easing values used in this document map to tokens defined in [05-DESIGN-TOKENS.md](./05-DESIGN-TOKENS.md):

| Token | Value | Used In |
|-------|-------|---------|
| `transition-fast` | 100ms, `ease-out` | Toggle, checkbox, heart, badge bounce, checkmark draw |
| `transition-base` | 150ms, `ease-in-out` | Button hover, link hover, focus rings, chip select, sidebar, form save, publish |
| `transition-moderate` | 200ms, `ease-in-out` | Dropdown, tab switch, filter panel, info banner dismiss, context menu |
| `transition-slow` | 300ms, `ease-in-out` | Modal, page transitions, empty states, success states, carousel, progress bar, lightbox |
| `transition-slower` | 500ms, `ease-in-out` | Loading dots, skeleton shimmer, infinite scroll |
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entrance animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Heart pulse, badge bounce, milestone unlock, map pin, double-tap |
| `opacity-50` | 0.50 | Modal backdrop |
| `z-overlay` | 40 | Modal backdrop, lightbox backdrop |
| `z-modal` | 50 | Modal content, lightbox image |
| `z-toast` | 60 | Toast notifications |
| `focus-ring-color` | `#5B4ED1` | All focus-visible outlines |
| `focus-ring-width` | 2px | Outline width |
| `focus-ring-offset` | 2px | Outline offset |



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 07                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-07--SITEMAP-NAVIGATION"></a>

### Doc 07 — SITEMAP NAVIGATION

> Source: `docs/07-SITEMAP-NAVIGATION.md` ·      658 lines

# Sitemap & Navigation — Bridebook Wedding Planning Platform

> **Locale:** `de-DE` (German primary, English secondary)
> **Base URL:** `https://www.bridebook.com`
> **Screenshots Covered:** 61/61
> **Cross-references:** [02-USER-FLOWS.md](./02-USER-FLOWS.md), [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md)

---

## Table of Contents

1. [Full Sitemap](#1-full-sitemap)
2. [Navigation Components](#2-navigation-components)
3. [Breadcrumb Patterns](#3-breadcrumb-patterns)
4. [URL Parameters](#4-url-parameters)
5. [Protected Routes](#5-protected-routes)
6. [Deep Linking](#6-deep-linking)
7. [Route Metadata](#7-route-metadata)
8. [Missing & Inferred Routes](#8-missing--inferred-routes)
9. [Localization & i18n Routing](#9-localization--i18n-routing)
10. [Mobile App Deep Links](#10-mobile-app-deep-links)
11. [Technical SEO](#11-technical-seo)
12. [Navigation State Management](#12-navigation-state-management)
13. [Redirects & URL Normalization](#13-redirects--url-normalization)

---

## 1. Full Sitemap

### 1.1 Hierarchical Route Tree

```
/                                          # Landing page (public)
│
├── /auth/                                 # Authentication (modal overlay)
│   ├── /anmelden                          # Login
│   └── /registrieren                      # Sign up (Google / Apple / Email)
│
├── /hochzeit/                             # Main dashboard (auth required)
│   └── (countdown, progress ring, quick actions)
│
├── /locations/                            # Vendor discovery (public browsable)
│   ├── ?filters=...                       # Filtered search results
│   ├── ?view=map                          # Map view toggle
│   ├── /catering                          # Category: Catering
│   ├── /florists                          # Category: Florists
│   ├── /photograph                        # Category: Photographers
│   ├── /transport                         # Category: Transport
│   ├── /[category]                        # Other vendor categories
│   └── /[slug]                            # Vendor detail page
│       └── /anfrage                       # Enquiry form / email template
│
├── /nachrichten/                          # Messages (auth required)
│   ├── ?tab=dienstleister                 # Vendor messages
│   ├── ?tab=gaeste                        # Guest messages
│   ├── ?tab=bridebook                     # Bridebook system messages
│   └── ?tab=archiviert                    # Archived messages
│
├── /favoriten/                            # Favorites (auth required)
│   ├── ?tab=locations                     # Saved locations
│   ├── ?tab=dienstleister                 # Saved vendors
│   └── ?tab=gebucht                       # Booked vendors
│
├── /planungs-tools/                       # Planning hub (auth required)
│   ├── (overview with tool cards)
│   │
│   ├── /budget/                           # Budget tool
│   │   ├── /wizard                        # Budget setup wizard
│   │   └── (category breakdown, pie chart)
│   │
│   ├── /gaesteliste/                      # Guest list manager
│   │   └── (table view, add/edit guests)
│   │
│   ├── /checkliste/                       # Checklist (inferred)
│   │   └── (task timeline)
│   │
│   └── /ratschlaege/                      # Advice & articles
│       └── /[article-slug]               # Individual article
│
├── /hochzeitshomepage/                    # Wedding website editor (auth required)
│   ├── ?tab=details                       # Content editing
│   ├── ?tab=design                        # Theme / design picker
│   └── ?tab=einstellungen                 # Website settings (URL, visibility)
│
├── /einstellungen/                        # Account settings (auth required)
│   ├── ?tab=account                       # Email, password, delete account
│   ├── ?tab=hochzeitsdetails              # Wedding date, location, budget
│   ├── ?tab=teilen                        # Share / invite partner
│   └── ?tab=kundenservice                 # Help & support
│
├── /inspiration/                          # Editorial content (public)
│   └── /[article-slug]
│
├── /datenschutz                           # Privacy policy (public, inferred)
├── /impressum                             # Legal notice (public, inferred)
├── /agb                                   # Terms of service (public, inferred)
├── /passwort-vergessen                    # Password reset (public, inferred)
├── /email-verifizieren                    # Email verification (inferred)
└── /abmelden                             # Logout action (inferred)
```

### 1.2 Screenshot Coverage Map

| Route | Screenshots | Count |
|-------|------------|-------|
| `/` (Landing) | #1 | 1 |
| `/auth/*` | #2 | 1 |
| `/hochzeit` (Dashboard) | #3 | 1 |
| `/` (Homepage sections) | #4, #5, #6 | 3 |
| `/locations` | #7–#19 | 13 |
| `/locations/[slug]/anfrage` | #20, #21, #22 | 3 |
| `/nachrichten` | #23, #24, #25, #26 | 4 |
| `/favoriten` | #27, #28 | 2 |
| `/planungs-tools` | #29–#33 | 5 |
| `/planungs-tools/budget` | #34–#42 | 9 |
| `/planungs-tools/gaesteliste` | #43, #44 | 2 |
| `/planungs-tools/ratschlaege` | #45, #46, #47 | 3 |
| `/einstellungen` | #48–#52 | 5 |
| `/hochzeitshomepage` | #53–#61 | 9 |
| **Total** | | **61** |

---

## 2. Navigation Components

### 2.1 Primary Header / Navbar

Persistent across all authenticated pages. Fixed position, full width.

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]   Locations  Nachrichten  Favoriten  Planungs-Tools │
│                                          [Avatar] [≡ Menu]  │
└─────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **Logo** | Links to `/hochzeit` (dashboard) when authenticated, `/` when not |
| **Locations** | Links to `/locations` |
| **Nachrichten** | Links to `/nachrichten` — badge shows unread count |
| **Favoriten** | Links to `/favoriten` |
| **Planungs-Tools** | Links to `/planungs-tools` |
| **Avatar** | Opens dropdown: Einstellungen, Hochzeitshomepage, Abmelden |
| **Hamburger (≡)** | Mobile only — opens side drawer |

### 2.2 Mobile Bottom Tab Bar

Visible on mobile viewports (< 768px). Replaces header nav links.

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Home    │ Suche    │ Planung  │ Messages │  Mehr    │
│   🏠     │   🔍     │   📋     │   💬     │   ≡     │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| Tab | Route | Active When |
|-----|-------|-------------|
| Home | `/hochzeit` | Dashboard or landing |
| Suche | `/locations` | Any `/locations/*` route |
| Planung | `/planungs-tools` | Any `/planungs-tools/*` route |
| Messages | `/nachrichten` | Any `/nachrichten/*` route |
| Mehr | — | Opens drawer with remaining links |

### 2.3 Sub-Navigation (Tab Bars)

Several pages use horizontal tab bars for in-page navigation:

| Page | Tabs | Implementation |
|------|------|---------------|
| `/nachrichten` | Dienstleister, Gäste, Bridebook, Archiviert | `?tab=` query param |
| `/favoriten` | Locations, Dienstleister, Gebucht | `?tab=` query param |
| `/hochzeitshomepage` | Details, Design, Einstellungen | `?tab=` query param |
| `/einstellungen` | Account, Hochzeitsdetails, Teilen, Kundenservice | `?tab=` query param |

### 2.4 Sidebar Navigation

Present on `/einstellungen` and `/hochzeitshomepage` at desktop breakpoints (>= 1024px). Tabs render as a vertical sidebar list instead of horizontal tabs.

### 2.5 Footer

Visible on public pages (`/`, `/datenschutz`, `/impressum`, `/agb`). Contains:

- Company info & links
- Legal links (Datenschutz, Impressum, AGB)
- Social media icons
- Language selector (DE / EN)
- App store badges (iOS / Android)

---

## 3. Breadcrumb Patterns

### 3.1 Vendor Discovery

```
Startseite > Locations > [Category] > [Vendor Name]
/          > /locations > /locations/catering > /locations/schloss-biebrich
```

### 3.2 Planning Tools

```
Startseite > Planungs-Tools > Budget
/          > /planungs-tools > /planungs-tools/budget

Startseite > Planungs-Tools > Gästeliste
/          > /planungs-tools > /planungs-tools/gaesteliste

Startseite > Planungs-Tools > Ratschläge > [Article Title]
/          > /planungs-tools > /planungs-tools/ratschlaege > /planungs-tools/ratschlaege/[slug]
```

### 3.3 Settings

```
Startseite > Einstellungen > [Tab Name]
/          > /einstellungen > /einstellungen?tab=account
```

### 3.4 Wedding Homepage Editor

```
Startseite > Hochzeitshomepage > [Tab Name]
/          > /hochzeitshomepage > /hochzeitshomepage?tab=design
```

### 3.5 Breadcrumb Display Rules

- Not shown on top-level pages (`/`, `/hochzeit`, `/nachrichten`)
- Always starts with "Startseite" when present
- Clickable segments except the current page (last segment)
- Mobile: collapsed to "< Back" single link with parent route

---

## 4. URL Parameters

### 4.1 Search & Filters (`/locations`)

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `q` | `string` | `?q=schloss` | Free-text search query |
| `category` | `enum` | `?category=catering` | Vendor category filter |
| `region` | `string` | `?region=wiesbaden` | Geographic region |
| `budget_min` | `number` | `?budget_min=1000` | Minimum price |
| `budget_max` | `number` | `?budget_max=5000` | Maximum price |
| `capacity_min` | `number` | `?capacity_min=50` | Minimum guest capacity |
| `capacity_max` | `number` | `?capacity_max=200` | Maximum guest capacity |
| `style` | `string[]` | `?style=rustikal,modern` | Venue style tags |
| `amenities` | `string[]` | `?amenities=outdoor,parking` | Amenity filters |
| `availability` | `date` | `?availability=2025-09-15` | Date availability |
| `sort` | `enum` | `?sort=empfohlen` | Sort order (`empfohlen`, `preis_asc`, `preis_desc`, `bewertung`, `entfernung`) |
| `view` | `enum` | `?view=list\|map` | View mode toggle |
| `page` | `number` | `?page=2` | Pagination (1-indexed) |
| `per_page` | `number` | `?per_page=20` | Results per page (default 20) |

### 4.2 Tab Navigation

| Parameter | Used On | Values |
|-----------|---------|--------|
| `tab` | `/nachrichten` | `dienstleister`, `gaeste`, `bridebook`, `archiviert` |
| `tab` | `/favoriten` | `locations`, `dienstleister`, `gebucht` |
| `tab` | `/hochzeitshomepage` | `details`, `design`, `einstellungen` |
| `tab` | `/einstellungen` | `account`, `hochzeitsdetails`, `teilen`, `kundenservice` |

### 4.3 UTM & Tracking

| Parameter | Type | Description |
|-----------|------|-------------|
| `utm_source` | `string` | Traffic source |
| `utm_medium` | `string` | Marketing medium |
| `utm_campaign` | `string` | Campaign name |
| `ref` | `string` | Internal referral tracking |

---

## 5. Protected Routes

### 5.1 Auth Requirements

| Route | Auth Required | Redirect On Fail |
|-------|:------------:|------------------|
| `/` | No | — |
| `/locations` | No | — |
| `/locations/[category]` | No | — |
| `/locations/[slug]` | No | — |
| `/locations/[slug]/anfrage` | **Yes** | Auth modal, then return |
| `/hochzeit` | **Yes** | `/` with auth modal |
| `/nachrichten` | **Yes** | `/` with auth modal |
| `/favoriten` | **Yes** | `/` with auth modal |
| `/planungs-tools` | **Yes** | `/` with auth modal |
| `/planungs-tools/*` | **Yes** | `/` with auth modal |
| `/hochzeitshomepage` | **Yes** | `/` with auth modal |
| `/einstellungen` | **Yes** | `/` with auth modal |
| `/datenschutz` | No | — |
| `/impressum` | No | — |
| `/agb` | No | — |

### 5.2 Auth Flow Behavior

1. User visits protected route while unauthenticated
2. System stores `returnUrl` in session/localStorage
3. Auth modal appears as overlay (not a page redirect)
4. After successful auth, user is redirected to stored `returnUrl`
5. If no `returnUrl`, redirect to `/hochzeit` (dashboard)

### 5.3 Partial Protection

Some public pages have protected actions:

| Page | Public View | Protected Action |
|------|------------|-----------------|
| `/locations/[slug]` | View vendor details | "Anfrage senden" (send enquiry) |
| `/locations` | Browse & filter | "Favorit hinzufügen" (add favorite) |

---

## 6. Deep Linking

### 6.1 Shareable URLs

| URL Pattern | Shareable | OG Preview |
|-------------|:---------:|:----------:|
| `/locations/[slug]` | Yes | Vendor image, name, rating |
| `/planungs-tools/ratschlaege/[slug]` | Yes | Article title, excerpt, image |
| `/hochzeitshomepage/[couple-slug]` | Yes | Couple names, date, cover image |
| `/hochzeit` | No | Dashboard is private |
| `/nachrichten` | No | Messages are private |
| `/einstellungen` | No | Settings are private |

### 6.2 UTM Handling

- UTM parameters are preserved through auth flow
- Stripped from URL after first page load (stored in analytics session)
- Passed to backend on sign-up for attribution

### 6.3 Invite Links

```
/einladen?token=[invite-token]
```

- Partner invite link from Settings > Teilen
- Token validates and auto-links accounts
- Expired tokens redirect to `/` with error toast

---

## 7. Route Metadata

### 7.1 Page Titles

| Route | `<title>` Pattern |
|-------|-------------------|
| `/` | `Bridebook — Deine Hochzeitsplanung` |
| `/hochzeit` | `Dashboard — Bridebook` |
| `/locations` | `Locations & Dienstleister — Bridebook` |
| `/locations/catering` | `Catering — Locations — Bridebook` |
| `/locations/[slug]` | `[Vendor Name] — Bridebook` |
| `/nachrichten` | `Nachrichten — Bridebook` |
| `/favoriten` | `Favoriten — Bridebook` |
| `/planungs-tools` | `Planungs-Tools — Bridebook` |
| `/planungs-tools/budget` | `Budget — Planungs-Tools — Bridebook` |
| `/planungs-tools/gaesteliste` | `Gästeliste — Planungs-Tools — Bridebook` |
| `/planungs-tools/ratschlaege` | `Ratschläge — Bridebook` |
| `/hochzeitshomepage` | `Hochzeitshomepage — Bridebook` |
| `/einstellungen` | `Einstellungen — Bridebook` |

### 7.2 Meta Descriptions

| Route | `<meta name="description">` |
|-------|------------------------------|
| `/` | `Plane deine Traumhochzeit mit Bridebook. Finde Locations, Dienstleister und alles was du brauchst.` |
| `/locations` | `Entdecke die besten Hochzeitslocations und Dienstleister in deiner Nähe.` |
| `/locations/[slug]` | `[Vendor Name] — [Category] in [City]. Bewertungen, Preise und Verfügbarkeit auf Bridebook.` |
| `/planungs-tools` | `Kostenlose Planungs-Tools für deine Hochzeit: Budget, Gästeliste, Checkliste und mehr.` |

### 7.3 Open Graph Tags

```html
<!-- Vendor detail page example -->
<meta property="og:type" content="website" />
<meta property="og:title" content="[Vendor Name] — Bridebook" />
<meta property="og:description" content="[Short description]" />
<meta property="og:image" content="[Hero image URL]" />
<meta property="og:url" content="https://www.bridebook.com/locations/[slug]" />
<meta property="og:locale" content="de_DE" />
<meta property="og:locale:alternate" content="en_GB" />
```

---

## 8. Missing & Inferred Routes

Routes not directly visible in screenshots but expected based on platform patterns:

| Route | Purpose | Evidence |
|-------|---------|----------|
| `/checkliste` | Wedding checklist / timeline | Referenced in planning tools UI |
| `/404` | Not found page | Standard web practice |
| `/datenschutz` | Privacy policy (DSGVO) | Required by German law |
| `/impressum` | Legal notice | Required by German law (TMG §5) |
| `/agb` | Terms of service | Standard for transactional platforms |
| `/passwort-vergessen` | Password reset flow | Auth modal has "Passwort vergessen?" link |
| `/email-verifizieren` | Email verification callback | Standard auth flow |
| `/abmelden` | Logout action | Settings dropdown option |
| `/einladen` | Partner invite acceptance | Settings > Teilen feature |
| `/vendor/[slug]/bewertung` | Write vendor review | Review functionality implied |

---

## 9. Localization & i18n Routing

### 9.1 URL Structure

```
https://www.bridebook.com/de/locations        # German (primary)
https://www.bridebook.com/en/locations         # English
https://www.bridebook.com/locations            # Default → /de/ (German market)
```

### 9.2 Hreflang Tags

```html
<link rel="alternate" hreflang="de" href="https://www.bridebook.com/de/locations" />
<link rel="alternate" hreflang="en" href="https://www.bridebook.com/en/locations" />
<link rel="alternate" hreflang="x-default" href="https://www.bridebook.com/en/locations" />
```

### 9.3 Locale Detection & Redirect

1. First visit: detect `Accept-Language` header
2. If `de-*` → redirect to `/de/` prefix (or serve German content at `/`)
3. Store preference in cookie (`locale=de`)
4. Manual override via footer language selector persists to cookie
5. Authenticated users: locale stored in user profile, overrides cookie

### 9.4 Translated Route Slugs

| German | English |
|--------|---------|
| `/nachrichten` | `/messages` |
| `/favoriten` | `/favourites` |
| `/planungs-tools` | `/planning-tools` |
| `/einstellungen` | `/settings` |
| `/hochzeitshomepage` | `/wedding-website` |
| `/gaesteliste` | `/guest-list` |
| `/ratschlaege` | `/advice` |
| `/datenschutz` | `/privacy` |
| `/impressum` | `/legal` |

---

## 10. Mobile App Deep Links

### 10.1 Custom URL Scheme

```
bridebook://                                    # Open app
bridebook://hochzeit                           # Dashboard
bridebook://locations/[slug]                   # Vendor detail
bridebook://nachrichten                        # Messages
bridebook://nachrichten/[conversation-id]      # Specific conversation
bridebook://favoriten                          # Favorites
bridebook://planungs-tools/budget              # Budget tool
bridebook://planungs-tools/gaesteliste         # Guest list
bridebook://einstellungen                      # Settings
```

### 10.2 Universal Links (iOS) / App Links (Android)

```json
// apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.bridebook.app",
        "paths": [
          "/locations/*",
          "/nachrichten/*",
          "/favoriten",
          "/planungs-tools/*",
          "/hochzeitshomepage/*",
          "/einladen/*"
        ]
      }
    ]
  }
}
```

### 10.3 Deferred Deep Links

- If app is not installed, redirect to App Store / Play Store
- Original deep link stored, applied after install + first open
- Used for partner invite links and vendor share links

---

## 11. Technical SEO

### 11.1 Canonical URLs

```html
<!-- Remove query params from canonical (except meaningful filters) -->
<link rel="canonical" href="https://www.bridebook.com/locations" />

<!-- Paginated pages -->
<link rel="canonical" href="https://www.bridebook.com/locations?page=2" />

<!-- Tab pages use canonical without tab param -->
<link rel="canonical" href="https://www.bridebook.com/nachrichten" />
```

### 11.2 Robots.txt

```
User-agent: *
Allow: /
Disallow: /hochzeit
Disallow: /nachrichten
Disallow: /favoriten
Disallow: /einstellungen
Disallow: /auth/
Disallow: /api/
Disallow: /email-verifizieren
Disallow: /abmelden

Sitemap: https://www.bridebook.com/sitemap.xml
```

### 11.3 XML Sitemap Structure

```xml
<urlset>
  <!-- Static pages -->
  <url><loc>https://www.bridebook.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.bridebook.com/locations</loc><priority>0.9</priority></url>
  <url><loc>https://www.bridebook.com/locations/catering</loc><priority>0.8</priority></url>
  <url><loc>https://www.bridebook.com/locations/florists</loc><priority>0.8</priority></url>
  <!-- ... other categories -->

  <!-- Dynamic vendor pages (generated) -->
  <url><loc>https://www.bridebook.com/locations/schloss-biebrich</loc><priority>0.7</priority></url>
  <!-- ... -->

  <!-- Article pages -->
  <url><loc>https://www.bridebook.com/planungs-tools/ratschlaege/[slug]</loc><priority>0.6</priority></url>

  <!-- Legal pages -->
  <url><loc>https://www.bridebook.com/datenschutz</loc><priority>0.3</priority></url>
  <url><loc>https://www.bridebook.com/impressum</loc><priority>0.3</priority></url>
</urlset>
```

### 11.4 Noindex Pages

| Route | `noindex` | Reason |
|-------|:---------:|--------|
| `/hochzeit` | Yes | Private dashboard |
| `/nachrichten` | Yes | Private messages |
| `/favoriten` | Yes | Private favorites |
| `/einstellungen` | Yes | Private settings |
| `/auth/*` | Yes | Auth modals |
| `/email-verifizieren` | Yes | Transient utility page |
| `/passwort-vergessen` | Yes | Transient utility page |
| `/locations?page=2+` | Yes | Paginated pages (canonical on page 1) |

---

## 12. Navigation State Management

### 12.1 Active State Logic

| Component | Active Condition |
|-----------|-----------------|
| Header nav link | `pathname.startsWith(href)` |
| Mobile tab bar | Exact match or starts-with for nested routes |
| Sub-tabs | `searchParams.get('tab') === tabId` or first tab if no param |
| Sidebar item | Same as sub-tabs at desktop breakpoint |
| Breadcrumb | Last segment is non-clickable (current page) |

### 12.2 Breadcrumb Generation Rules

```
1. Split pathname by "/"
2. For each segment, look up display name from route config
3. Map dynamic segments ([slug]) to fetched entity name
4. Append current tab name if ?tab= is present
5. First segment is always "Startseite" → "/"
```

### 12.3 Back Button Behavior

| Context | Back Action |
|---------|------------|
| Vendor detail | Return to `/locations` with preserved filters |
| Enquiry form | Return to vendor detail |
| Budget wizard | Return to budget overview |
| Article detail | Return to `/planungs-tools/ratschlaege` |
| Settings tab | Remain on `/einstellungen` (tab switch, no history push) |
| Auth modal | Close modal, stay on current page |
| Mobile drawer | Close drawer |

### 12.4 Scroll Restoration

- Tab switches: scroll to top
- Back navigation: restore previous scroll position
- Filter changes on `/locations`: scroll to top of results
- Pagination: scroll to top of results

---

## 13. Redirects & URL Normalization

### 13.1 Trailing Slash

- **Policy:** No trailing slash (canonical)
- `/locations/` → 301 → `/locations`
- Exception: root `/` (required)

### 13.2 WWW vs Non-WWW

- **Canonical:** `www.bridebook.com`
- `bridebook.com` → 301 → `www.bridebook.com`

### 13.3 HTTPS

- `http://` → 301 → `https://`
- HSTS header enabled

### 13.4 Legacy URL Redirects

| Legacy URL | Redirect To | Code |
|------------|------------|------|
| `/dashboard` | `/hochzeit` | 301 |
| `/vendors` | `/locations` | 301 |
| `/messages` | `/nachrichten` | 301 |
| `/favourites` | `/favoriten` | 301 |
| `/settings` | `/einstellungen` | 301 |
| `/planning` | `/planungs-tools` | 301 |
| `/budget` | `/planungs-tools/budget` | 301 |
| `/guest-list` | `/planungs-tools/gaesteliste` | 301 |
| `/wedding-website` | `/hochzeitshomepage` | 301 |

### 13.5 Case Normalization

- All routes are lowercase
- `/Locations` → 301 → `/locations`
- Query params are case-sensitive (preserved as-is)

---

*Generated from analysis of 61 platform screenshots. Route patterns are inferred from UI structure and German-market web conventions where not directly visible in URLs.*



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 08                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-08--FORMS-ANALYSIS"></a>

### Doc 08 — FORMS ANALYSIS

> Source: `docs/08-FORMS-ANALYSIS.md` ·      739 lines

# 08 - FORMS ANALYSIS (Bridebook.com)

Complete field-level specification of every form visible in the Bridebook screenshot corpus.

---

## Table of Contents

1. [Auth Forms](#1-auth-forms)
2. [Wedding Setup / Budget Calculator](#2-wedding-setup--budget-calculator)
3. [Vendor Enquiry Forms](#3-vendor-enquiry-forms)
4. [Guest Forms](#4-guest-forms)
5. [Budget Management Forms](#5-budget-management-forms)
6. [Task / Checklist Forms](#6-task--checklist-forms)
7. [Settings Forms](#7-settings-forms)
8. [Wedding Homepage Forms](#8-wedding-homepage-forms)
9. [Search & Filter Forms](#9-search--filter-forms)
10. [Miscellaneous Forms](#10-miscellaneous-forms)
11. [Form Behavior Patterns](#11-form-behavior-patterns)
12. [Input Specifications](#12-input-specifications)
13. [File Uploads](#13-file-uploads)
14. [Form Accessibility](#14-form-accessibility)
15. [Form Analytics](#15-form-analytics)

---

## 1. AUTH FORMS

### 1.1 Login / Signup Modal (Einloggen)

**Route:** Modal overlay on any page
**Source:** `Sign up modal (Google:Apple:Email options).png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Email | email input | E-Mail | — | Yes | Email format |
| Password | password input | Passwort | — | Yes | Min length (unknown) |

**SSO Buttons (3 options, displayed before email fields):**

| Button | Style | Icon |
|--------|-------|------|
| Mit Apple einloggen | Dark/black filled | Apple logo |
| Mit Google einloggen | Outlined | Google logo |
| Per E-mail einloggen | Outlined | Email icon |

**Submit:** Varies by method (SSO redirects, email shows fields then submit)
**Secondary:** QR code on right side — "Scanne den QR Code um jederzeit und von überall auf dein Bridebook zuzugreifen"
**Success:** Redirect to main dashboard
**Notes:** Email login reveals email + password fields. SSO buttons trigger OAuth flows.

---

## 2. WEDDING SETUP / BUDGET CALCULATOR

### 2.1 Hochzeitsbudget berechnen (Wedding Budget Calculator)

**Route:** Planungs-Tools > Budget
**Source:** `planungs tool budget icon pt 1.png`, `planungs tool budget icon pt 2.png`

| Field | Type | Label | Placeholder/Default | Required | Validation |
|-------|------|-------|---------------------|----------|------------|
| Geschätztes Budget | Number input (currency, stepper arrows) | "Gebt euer Hochzeitsbudget ein:" | "Geschätztes Budget" (EUR prefix) | Expected | Numeric only |
| Currency | Dropdown select | (inline with budget) | "EUR - Euro" | Pre-filled | — |
| Gästezahl | Single-select chip/pill group | "Wie viele Gäste werden am Hochzeitsempfang teilnehmen?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Wochentag | Single-select chip/pill group | "An welchem Wochentag findet eure Hochzeit statt?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Jahreszeit | Single-select chip/pill group | "Zu welcher Jahreszeit findet eure Hochzeit statt?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Hochzeitsjahr | Single-select chip/pill group | "Für wann ist eure Hochzeit geplant?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Optionale Kategorien | Checkbox group (multi-select) | "Wählt optionale Kategorien, die ihr im Budget DABEI haben wollt:" | All unchecked | No | — |

**Gästezahl Options:**

| Option |
|--------|
| Unentschlossen |
| Weniger als 50 |
| 50 - 99 |
| 100 - 149 |
| 150 - 250 |
| Mehr als 250 |

**Wochentag Options:**

| Option |
|--------|
| Unentschlossen |
| Mo. - Do. |
| Freitag |
| Samstag |
| Sonntag |

**Jahreszeit Options:**

| Option |
|--------|
| Unentschlossen |
| Hochsaison (Mai bis Sep) |
| Nebensaison (andere Monate) |
| Weihnachtszeit |

**Hochzeitsjahr Options:**

| Option |
|--------|
| Unentschlossen |
| 2026 |
| 2027 |
| 2028 |
| 2029 und später |

**Optionale Kategorien Checkboxes:**

| Checkbox Label | Default |
|----------------|---------|
| Videograf | Unchecked |
| Planer, Redner | Unchecked |
| Live-Band | Unchecked |
| Versicherung | Unchecked |
| Entertainer (z.B. Zauberer) | Unchecked |
| Papeterie & Einladungen | Unchecked |

**Submit:** "Mein Hochzeitsbudget berechnen" — purple filled pill button
**Success:** Loading screen ("Zahlenverarbeitung im Gange" with animated dots) → redirects to Budget Breakdown page
**Helper tips per field:**
- Gästezahl: "Kleiner Tipp: Mehr Gäste = höhere Kosten für Catering, Papeterie, usw."
- Wochentag: "Kleiner Tipp: Wer nicht am Samstag feiert, spart Kosten für Caterer, Location, etc."
- Jahreszeit: "Kleiner Tipp: Feiert außerhalb der Hauptsaison und spart Kosten für Dienstleister"

---

## 3. VENDOR ENQUIRY FORMS

### 3.1 Venue Inquiry / Brochure Request (Nachricht an Dienstleister)

**Route:** Modal on venue detail page
**Source:** `locatons when pressed and trying to book the email with template.png`, `location when venue is clicked email template and message pt 2.png`

**Pre-filled Read-Only Info (editable via pencil icon):**

| Field | Display Value | Editable | Missing State |
|-------|---------------|----------|---------------|
| E-Mail | user@email.com | Via edit button | — |
| Tel. Nr. | phone number | Via edit button | Red "[fehlt]" tag |
| Vor- und Nachname | "El & Eli" | Via edit button | — |
| Ideales Datum | date | Via edit button | Red "[fehlt]" tag |
| Geschätzte Gästeanzahl | count | Via edit button | Red "[fehlt]" tag |

**Checkbox Group: "Welche Infos möchtet ihr erhalten?"**

| Option | Type | Default |
|--------|------|---------|
| Allgemeine Informationen | Checkbox | Checked (purple) |
| Preis und Pakete | Checkbox | Unchecked |
| Verfügbarkeit | Checkbox | Unchecked |
| Termin zur Besichtigung | Checkbox | Unchecked |
| Andere | Checkbox | Unchecked |

**Expandable Message Section:** "+ Persönliche Nachricht schreiben"

| Field | Type | Label | Default Content |
|-------|------|-------|-----------------|
| Nachricht bearbeiten | Textarea | "Nachricht bearbeiten" | "Hi, wir suchen gerade nach einer Location für unsere Hochzeit und würden gerne mehr über die deine erfahren. Könntest du uns die Details zuschicken, wenn du einen Moment Zeit hast? Vielen Dank!" |

**Submit:** "Broschüre anfragen" — purple button with download icon
**Cancel:** X (close modal)
**Success:** Confirmation (message sent to vendor)

### 3.2 Edit Contact Information (Daten bearbeiten)

**Route:** Sub-modal within venue inquiry
**Source:** `locaiton when venue is choosen the email template the edit button to edit information.png`

| Field | Type | Label | Placeholder | Required | Notes |
|-------|------|-------|-------------|----------|-------|
| E-Mail | Text input | "E-Mail*" | (pre-filled) | Yes | — |
| Tel. Nr. | Phone input | "Tel. Nr.*" | "+49 Telefonnummer eingeben" | Yes | Country flag selector (DE default) |
| Dein Name | Text input | "Dein Name*" | (pre-filled) | Yes | — |
| Partner Name | Text input | "Name deines Partners / deiner Partnerin*" | (pre-filled) | Yes | — |
| Geschätzte Gästeanzahl | Number input (stepper +/-) | "Geschätzte Gästeanzahl*" | "Wie viele Gäste?" | Yes | Increment/decrement controls |
| Ideales Datum | Date picker | "Ideales Datum*" | "Hochzeitsdatum" | Yes | Calendar icon |

**Submit:** "Informationen speichern" — purple button
**Cancel:** Back arrow (<) top left
**Note:** Red info text: "Wir geben eure Daten weiter, damit der Dienstleister euch direkt an euch wenden kann."

---

## 4. GUEST FORMS

### 4.1 Add Multiple Guests (Gästeliste Modal)

**Route:** Planungstool > Gästeliste > "Gäste hinzufügen"
**Source:** `planungstool gäästelist when clciked.png`
**Modal Title:** "Füge mehrere Gäste gleichzeitig hinzu"

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Kategorie | Dropdown select | "Kategorie" | "Els Gäste" (pre-selected) | Yes | Must select a category |
| Namen hinzufügen | Textarea (multi-line) | "Namen hinzufügen" | "z.B. Monica & Chandler" | Yes | One name per line; "&" links couples/families |

**Submit:** "Speichern" — purple button
**Cancel:** X (close modal)
**Helper text:** "Gib jedem neuen Gast eine neue Zeile. Setze ein '&' Symbol zwischen die Namen der Gäste, um sie als Paar/Familie zu verknüpfen. z.B. Harry & Meghan & Archie"

### 4.2 Guest List Empty State

**Source:** `planungstool gastelist.png`
**No form fields** — displays CTA button: "Füge deine ersten Gäste hinzu" which opens Form 4.1.

---

## 5. BUDGET MANAGEMENT FORMS

### 5.1 Budget Line Item Editor (Modal)

**Route:** Budget Breakdown > click any line item row
**Source:** `planungs tool budget icon after budget inserted and again hochzeit is pressed.png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Element | Text input | "Element*" | (pre-filled category name, e.g. "Hochzeitslocation") | Yes | — |
| zirka (Estimated) | Number/currency input (stepper) | "zirka" | (pre-filled, e.g. "EUR 12624") | No | Numeric/currency |
| Gebucht (Booked) | Number/currency input (stepper) | "Gebucht" | (pre-filled, e.g. "EUR 0") | No | Numeric/currency |
| Notizen zu Zahlungen | Textarea | "Notizen zu Zahlungen und Anzahlungen" | "z.B. Wann ist die Anzahlung/Zahlung fällig? Wer zahlt?" | No | — |

**Submit:** "Speichern" — purple filled full-width button
**Delete:** "Dieses Element löschen" — red outlined text with trash icon
**Cancel:** X (close modal)

### 5.2 Maximales Budget Inline Edit

**Route:** Budget Breakdown page header
**Source:** `planungs tool budget icon after budget inserted pt2.png`

| Field | Type | Label | Current Value | Notes |
|-------|------|-------|---------------|-------|
| Maximales Budget | Inline editable (pencil icon toggle) | "Maximales Budget" | "50.000 EUR" | Pencil icon converts display to input |

**Actions in header:**

| Button | Text | Style |
|--------|------|-------|
| Reset | "Budget zurücksetzen" | Outlined |
| Add item | "+ Neues Element hinzufügen" | Purple filled |

### 5.3 Budget Breakdown Categories (Interactive Table)

**Source:** `planungs tool budget icon after budget inserted pt2-pt5.png`

Not a form, but each row is clickable and opens Form 5.1. Categories include:

**Hochzeitslocations & Dienstleister (10 items):** Hochzeitslocation, Florist, Fotograf, Catering, Musik, Torte, Transport, Dekoration und Verleih, Festzelt, Planer/Redner

**Hochzeitskleidung & Accessoires (4 items):** Brautmode, Herrenbekleidung, Ringe und Schmuck, Beauty/Haare/Make-Up

**Zusätzliches (6 items):** Heiratslizenz Gebühren, Versicherung, Suite für Hochzeitsnacht, Gastgeschenke, Flitterwochen, Bekanntmachungen

**Andere (1 item):** Extras

Each row shows: Icon | Item name | zirka (estimated) | Gebucht (booked) | Action link | Chevron >

---

## 6. TASK / CHECKLIST FORMS

No dedicated task creation or edit forms were visible in the screenshots. The Checkliste section shows CTA cards ("Loslegen" buttons) but no inline task editing UI was captured.

---

## 7. SETTINGS FORMS

### 7.1 Contact Email (Meine Kontakt E-Mail Adresse)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| E-Mail | Email input | "E-Mail" (floating label) | Pre-filled current email | Yes | Email format |

**Submit:** "Speichern" — purple button
**Helper:** "Die E-Mail-Adresse, über die unsere Dienstleister euch kontaktieren werden (Bitte gebt sie sorgfältig ein)"

### 7.2 Profile Photo Upload

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Photo | File upload (image) | "Dein Profilbild" | "Füge ein Foto hinzu" (inside circle) | No |

**Submit:** "Hochladen" — outline button

### 7.3 Login Methods (Meine Login-Methoden)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`, `settings pt2.png`

No input fields — action buttons only:

| Button | Style | Icon |
|--------|-------|------|
| E-Mail Login-Methode hinzufügen | Purple filled | — |
| Mit Facebook verbinden | Outlined | Facebook |
| Mit Google-Konto verbinden | Outlined | Google |

### 7.4 Language Change (Sprache ändern)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Sprache ändern | Dropdown select | "Sprache ändern" (floating label) | "Deutsch (Deutschland)" | Yes |

**Behavior:** Likely auto-saves on change.

### 7.5 Account Deletion

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt2.png`

No input fields.
**Button:** "Konto löschen" — red/outline destructive button
**Warning:** "Durch diese Aktion werden euer Konto und alle gespeicherten Inhalte endgültig gelöscht. Dies kann nicht rückgängig gemacht werden."
**Behavior:** Likely triggers confirmation dialog.

### 7.6 Wedding Details (Hochzeitsdetails)

**Route:** Settings > Meine Hochzeitsdetails
**Source:** `settings pt3.png`

| Field | Type | Label | Placeholder/Default | Required | Validation |
|-------|------|-------|---------------------|----------|------------|
| Name | Text input | "Name" (floating) | Pre-filled "El" | Yes | Text |
| Partner/in Name | Text input | "Partner/in Name" (floating) | Pre-filled "Eli" | Yes | Text |
| Role (Person 1) | Radio-like checkbox group | — | — | No | One of 3 options |
| Role (Person 2) | Radio-like checkbox group | — | — | No | One of 3 options |
| Standort | Text input | "Standort" (floating) | Pre-filled "Deutschland" | No | Text/location |
| Hochzeitsdatum | Date picker | "Hochzeitsdatum" (floating) | "Datum auswählen" | No | Valid date |
| Land auswählen | Dropdown select | "Land auswählen" (floating) | "Deutschland" (with flag) | Yes | Country list |
| Währung | Dropdown select | "Währung" (floating) | "EUR - Euro" | Yes | Currency list |

**Role Options:** Braut, Bräutigam, Andere

### 7.7 Team Members Invite

**Route:** Settings > Teilt eure Hochzeit
**Source:** `settings pt4.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Partner/in Name | Text input | "Partner/in Name" (floating) | Pre-filled "Eli" | Yes |
| Role | Checkbox group | — | — | No |

**Role Options:** Braut, Bräutigam, Andere
**Submit:** "Teammitglieder einladen" — purple filled button
**Description:** "Lade deine Partner:in, Freunde und Familie zur Planung ein."

### 7.8 Customer Service

**Route:** Settings > Kundenservice
**Source:** `settings pt5.png`

No input fields. Two action buttons:

| Button | Style |
|--------|-------|
| Hilfe holen | Purple filled |
| Gib uns Feedback | Purple filled |

---

## 8. WEDDING HOMEPAGE FORMS

### 8.1 Details Tab — Eure Namen (Your Names)

**Route:** Hochzeitshomepage > Details > Eure Namen
**Source:** `hochzeit home page pt1.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Dein Name | Text input | "Dein Name*" | Pre-filled "El" | Yes |
| Partner Name | Text input | "Der Name deines Partners*" | Pre-filled "Eli" | Yes |

**Submit:** "Speichern" — small purple button

### 8.2 Details Tab — Hochzeitsdatum

**Route:** Hochzeitshomepage > Details > Hochzeitsdatum
**Source:** `hochzeit home page pt2.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Hochzeitsdatum | Date/text input | "Hochzeitsdatum" | "Hochzeitsdatum hinzufügen" | No |

**Submit:** "Speichern"

### 8.3 Details Tab — Hochzeitslocation

**Route:** Hochzeitshomepage > Details > Hochzeitslocation
**Source:** `hochzeit home page pt2.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Location | Text input | — | "Location hinzufügen" | No |
| Use location photos | Checkbox | "Verwendet Fotos von eurer Hochzeitslocation" | Checked by default | No |

**Submit:** "Speichern"

### 8.4 Details Tab — Fotos

**Route:** Hochzeitshomepage > Details > Fotos
**Source:** `hochzeit home page pt4.png`

| Field | Type | Label | Notes |
|-------|------|-------|-------|
| Photo upload | File upload (image grid) | — | Thumbnail grid of uploaded photos |

**Buttons:** "Fotos hinzufügen" (outlined), "Speichern" (purple)

### 8.5 Details Tab — Zu-/Absagen (RSVP)

**Route:** Hochzeitshomepage > Details > Zu-/Absagen
**Source:** `hochzeit home page pt4.png`

No form fields. Info banner: "Fügt zuerst Gäste zu Events hinzu" — directs to Gästeliste.

### 8.6 Details Tab — Fragen (FAQs)

**Route:** Hochzeitshomepage > Details > Fragen
**Source:** `hochzeit home page pt4.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Question | Text input | — | "Wirst du teilnehmen?" (example) |

**Button:** "Frage hinzufügen+" — text link

### 8.7 Details Tab — Unsere Geschichte (Our Story)

**Route:** Hochzeitshomepage > Details > Unsere Geschichte
**Source:** `hochzeit home page pt5.png`

| Field | Type | Label | Default |
|-------|------|-------|---------|
| Story text | Textarea | "Erzählt euren Gästen ein bisschen was über euch!" | "Wir haben uns getroffen, gelacht und uns verliebt. Irgendwann wurde uns dann klar, dass wir nicht ohne einander leben wollen. Jetzt heiraten wir!" |

**Submit:** "Speichern"

### 8.8 Details Tab — Zeitplan (Timeline)

**Route:** Hochzeitshomepage > Details > Zeitplan
**Source:** `hochzeit home page pt5.png`

| Field | Type | Label | Notes |
|-------|------|-------|-------|
| Datum hinzufügen | Date/time link | — | Red text link to add date |
| Event name | Text display | — | "Hochzeit" (shown) |

**Buttons:** "Event hinzufügen" (outlined purple), "Fertig" (small purple)
**Note:** "Sichtbarkeit für Gäste" — Events visible on homepage.

### 8.9 Details Tab — Hochzeitswünschliste (Gift Registry)

**Route:** Hochzeitshomepage > Details > Hochzeitswünschliste
**Source:** `hochzeit home page pt6.png`

| Field | Type | Label | Placeholder/Default |
|-------|------|-------|---------------------|
| Wishlist URL | URL input | "Verbindet eure Wünschliste mit eurer Homepage" | "URL eurer Wünschliste hinzufügen" |
| Nachricht an die Gäste | Textarea | "Nachricht an die Gäste" | "Euch dabei zu haben, ist das beste Geschenk von allen. Wenn ihr noch mehr beitragen möchtet, ist hier unsere Liste." |

**Buttons:** "Löschen" (outlined), "Speichern" (purple)
**Additional:** Amazon wedding registry partner option.

### 8.10 Details Tab — Unterkünfte (Accommodation)

**Route:** Hochzeitshomepage > Details > Unterkünfte
**Source:** `hochzeit home page pt7.png`

| Field | Type | Label | Placeholder/Default |
|-------|------|-------|---------------------|
| Gebuchte Location | Search/text input | — | "Gebuchte Location hinzufügen" |
| Nachricht an die Gäste | Textarea | "Nachricht an die Gäste" | "Um eure Reise noch bequemer zu machen, empfehlen wir euch Unterkünfte in der Nähe unserer Location!" |

**Buttons:** "Vorschau-Link" (outlined), "Speichern" (purple)

### 8.11 Design Tab (Theme & Font Picker)

**Route:** Hochzeitshomepage > Design
**Source:** `hochzeit home page design pt1.png`, `hochzeit home page design pt2.png`

| Field | Type | Label | Options |
|-------|------|-------|---------|
| Design template | Visual card selector (grid) | "Design" | ~8 theme cards (floral, minimal, elegant, etc.) with color variant dots |
| Schriftarten (Fonts) | Visual tile selector (grid) | "Schriftarten" | 6 font options ("Ag" preview tiles — serif, sans-serif, script, etc.) |

**Behavior:** Click to apply. Live preview on the right side. Color dots switch palette within a theme. No explicit save button (auto-applies).

### 8.12 Einstellungen Tab (Settings)

**Route:** Hochzeitshomepage > Einstellungen
**Source:** `hochzeit home page einstellung.png`

| Field | Type | Label | Placeholder/Default | Required |
|-------|------|-------|---------------------|----------|
| URL der Website | Text input | "URL der Website" | "eure-einzigartige-Adresse" | Yes |
| Veröffentlicht | Toggle switch | "Veröffentlicht" | Off (grey) | — |
| Homepage-Passwort | Toggle switch | "Homepage-Passwort" | Off (grey) | — |

**Submit:** "Fertig" — small purple button
**Helper:** "Euer Link wird hier verfügbar sein, sobald ihr eure Homepage veröffentlicht habt"

**Global Homepage Actions (visible across all tabs):**

| Button | Style | Position |
|--------|-------|----------|
| Teilen (Share) | Outlined | Top bar |
| Veröffentlichen (Publish) | Purple filled | Top bar |
| Mobile/Desktop preview toggle | Icon buttons | Top bar |
| Vorschau (Preview) | Text link | Top bar |

---

## 9. SEARCH & FILTER FORMS

### 9.1 Main Dashboard Search

**Route:** Dashboard / Landing page
**Source:** `Main dashboard overview.png`, `landing page. .png`

| Field | Type | Label | Default |
|-------|------|-------|---------|
| Standort | Dropdown select | "Standort" | "Deutschland" (with pin icon) |
| Kategorie | Dropdown select | "Kategorie" | "Hochzeitslocations" |
| Dienstleister Name | Text input | (below main search) | "Suche nach Dienstleister Namen" |

**Submit:** "Suche" — purple button
**Additional CTA:** "Los geht's" on hero banner

### 9.2 Venue & Vendor Filters (Comprehensive Filter Panel)

**Route:** Location search results page
**Source:** `location und dienstleister filters.png` through `filters PT 5.png`

**Location search field:**

| Field | Type | Placeholder |
|-------|------|-------------|
| Location | Text input | "Deutschland" (pre-filled) |

**Submit:** "[count] Ergebnisse anzeigen" — purple button
**Reset:** "Filter zurücksetzen" — text link
**Close:** "Schließen X"

#### Filter Sections (all checkboxes):

**Preiskategorie (Price, 4 options):**
Erschwinglich ($) | Mäßig ($$) | Luxuriös ($$$) | Super Luxuriös ($$$$)

**Gästeanzahl (Guest Count, 7 options):**
Bis zu 30 | 30+ | 50+ | 80+ | 100+ | 150+ | 200+

**Deine Must-Haves (3 options):**
Exklusive Nutzung | Unterbringung vor Ort | Ausschankgenehmigung

**Anzahl an Schlafzimmern (4 options):**
Bis zu 10 | 20+ | 30+ | 50+

**Art von Location (17 options):**
Landhaus | Scheune | Im Freien | Schloss | Hotel | Eventlocation | Lager/Fabrik | Attraktion | Restaurant | Golfplatz | Auf dem Wasser | Sportlocation | Konferenzzentrum | Rathaus | Andere | Dachterrasse | Weinberg/Weingut

**Location Stil (21 options):**
Klassisch | Intern | Alternativ | Romantisch | Schöne Anlagen/Garten | Ungewöhnlich | Erschwinglich | Außenbereich | Luxus | Rustikal | Wasserblick | Modern | Einzigartig | Stadt | Leere Leinwand | Schöne Aussicht | Historisch | Asiatisch | Lässig | Formell | Cool

**Location Features (13 options):**
Parkplätze vor Ort | Barrierefrei | Hauseigener Hochzeits-Koordinator | Tanzfläche verfügbar | Soundsystem verfügbar | Ballsaal | Konfetti erlaubt | Feuerwerk erlaubt | Festzelt gestattet | Wasserblick | Landschaftsgarten | Tiere erlaubt | Kirche zu Fuß erreichbar

**Essen und Trinken (4 options):**
Hausinternes Catering | Externes Catering erlaubt | Keine Korkgebühr für eigenen Alkohol | Veganes Catering möglich

**Bridebook Sonderangebot (1 option):**
Last Minute

**Besichtigungen und Veranstaltungen (2 options):**
Hat verfügbare Besichtigungstermine | Hat anstehende Hochzeitsmesse

**Kulturspezialist (4 options):**
Asiatischer Hochzeitsspezialist | Jüdischer Hochzeitsspezialist | Muslimischer Hochzeitsspezialist | Andere

**Diversität und Inklusion (2 options):**
LGBTQ+-freundlich | Neurodivers-freundlich

**Total filter checkboxes: ~82 across 11 sections**

### 9.3 Add to Favorites Modal

**Route:** Favoriten > "Neuen Favoriten hinzufügen+"
**Source:** `favourites when favourites hinzufugen is clicked.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Dienstleister search | Search text input | "Gib den Namen eures Dienstleisters ein:" | "Dienstleister suchen" (with search icon) |

**Cancel:** X (close modal)
**Fallback links:** "Du findest deinen Dienstleister nicht?" → "Manuell hinzufügen" or "Auf Google suchen"

### 9.4 Inspiration Search

**Route:** Homepage inspiration section
**Source:** `homepaget pt4.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Vision search | Search text input | "Hochzeitsvision und Inspiration" | "Suche nach Inspiration, z.B. Freudig" |

### 9.5 Inspiration Tab Filter (Ratschlag)

**Route:** Planungstool > Ratschläge
**Source:** `planungstool ratschlag pt 1.png`

Tab pill navigation (not a traditional form):

| Tab |
|-----|
| Alle |
| Allgemeine Ratschläge |
| Expertenberatung |
| Hochzeitsbudget |
| Gäste |
| Zeremonie |
| Nach der Hochzeit |
| Echte Hochzeit |
| Dienstleister |

---

## 10. MISCELLANEOUS FORMS

### 10.1 Messages Section

**Route:** Nachrichten
**Source:** `messages pt1-pt4.png`

No input forms visible. Contains 4 tabs (Dienstleister, Gäste, Bridebook, Archiviert) — all empty states. CTA button "Nachricht schreiben" on Gäste tab.

### 10.2 Venue Search (Map View)

**Route:** Location search via budget tool
**Source:** `planungs tool budget icon after budget inserted and hochzeit is clicked and the buttom look for venues is pressed.png`

| Field | Type | Placeholder |
|-------|------|-------------|
| Location/Venue search | Text/search input | "Städte, Hochzeitslocation, Suchort, Deutschland" |

Each venue card has an "Anfrage senden" (Send inquiry) button.

---

## FORM COUNT SUMMARY

| Category | Form Count | Total Fields |
|----------|-----------|--------------|
| Auth | 1 | 2 + 3 SSO buttons |
| Wedding Setup / Budget Calculator | 1 | 7 fields (~20 options) |
| Vendor Enquiry | 2 | 12 fields + 5 checkboxes |
| Guest | 1 | 2 |
| Budget Management | 2 | 5 |
| Task/Checklist | 0 (not captured) | — |
| Settings | 8 | ~15 |
| Wedding Homepage | 12 | ~20 |
| Search & Filter | 5 | ~90 (mostly filter checkboxes) |
| Miscellaneous | 2 | 2 |
| **TOTAL** | **34 forms** | **~155+ fields** |

---

## GLOBAL UI PATTERNS

| Pattern | Detail |
|---------|--------|
| Primary button color | Purple/violet (#7C3AED or similar) |
| Destructive button style | Red outlined text |
| Save button text | "Speichern" (most forms) or "Fertig" (done) |
| Required field indicator | Asterisk (*) after label |
| Floating labels | Used on all text inputs in Settings |
| Missing data indicator | Red "[fehlt]" tag |
| Chip/pill selectors | Used for single-select groups (budget calculator) |
| Accordion sections | Used in Wedding Homepage Details tab |
| Modal pattern | White modal with dark overlay, X close button top-right |
| Auto-save | Design tab (theme/font selection) |
| Language | All UI in German (Deutsch) |

---

## 11. FORM BEHAVIOR PATTERNS

- Auto-save forms: Settings, Wedding Homepage Details
- Manual save forms: Budget items, Guest entries
- Dirty state detection: Show "unsaved changes" warning
- Multi-step wizard: Budget calculator (5 steps)
- Conditional fields: Show/hide logic

---

## 12. INPUT SPECIFICATIONS

- Character limits: Name (100), Description (500), Message (2000)
- Input masks: Phone (+49 XXX XXXXXXX), Date (DD.MM.YYYY)
- Autocomplete attributes: name, email, tel, street-address
- Mobile keyboards: inputmode="email|tel|numeric|url"
- Datepicker locale: German (DD.MM.YYYY), week starts Monday

---

## 13. FILE UPLOADS

- Avatar: JPG/PNG, max 5MB, 1:1 crop
- Wedding photos: JPG/PNG/WEBP, max 10MB each, multi-select
- Drag & drop zones

---

## 14. FORM ACCESSIBILITY

- Label associations (for/id pairs)
- Error announcements (aria-live="polite")
- Required indicators (aria-required="true")
- Tab order per form

---

## 15. FORM ANALYTICS

- Submission events: form_submit_{form_name}
- Field interaction: field_focus, field_blur
- Abandonment tracking: form_abandon_{form_name}



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 09                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-09--SETTINGS-PAGES"></a>

### Doc 09 — SETTINGS PAGES

> Source: `docs/09-SETTINGS-PAGES.md` ·      404 lines

# 09 - SETTINGS PAGES (Bridebook.com)

Complete specification of all settings pages, fields, and configuration options across the Bridebook platform.

---

## Table of Contents

1. [Settings Page Structure](#1-settings-page-structure)
2. [Meine Account-Daten (My Account Data)](#2-meine-account-daten-my-account-data)
3. [Meine Hochzeitsdetails (My Wedding Details)](#3-meine-hochzeitsdetails-my-wedding-details)
4. [Teilt eure Hochzeit (Share Your Wedding)](#4-teilt-eure-hochzeit-share-your-wedding)
5. [Kundenservice (Customer Service)](#5-kundenservice-customer-service)
6. [Hochzeitshomepage Einstellungen (Wedding Homepage Settings)](#6-hochzeitshomepage-einstellungen-wedding-homepage-settings)
7. [Destructive Actions](#7-destructive-actions)
8. [INFERRED: Notification Settings](#8-inferred-notification-settings)
9. [INFERRED: Privacy Settings](#9-inferred-privacy-settings)
10. [INFERRED: Security Settings](#10-inferred-security-settings)

---

## 1. SETTINGS PAGE STRUCTURE

**Route:** `/einstellungen`
**English equivalent:** `/settings` (301 redirect)
**Auth required:** Yes — unauthenticated users redirect to `/` with auth modal
**Source:** `settings pt1.png`–`settings pt5.png`

### 1.1 Page Header

| Element | German | English | Style |
|---------|--------|---------|-------|
| Title | Einstellungen | Settings | H1, bold |
| Subtitle | Verwaltet hier alles, was mit eurem Account zu tun hat | Manage everything related to your account | Body text, muted |

### 1.2 Sidebar Navigation

**Layout:** Vertical sidebar list on left (desktop ≥ 1024px). Tabs switch content area on right without page reload.

| Tab | German Label | Icon | Route |
|-----|-------------|------|-------|
| 1 | Meine Account-Daten | 💻 | `/einstellungen?tab=account` |
| 2 | Meine Hochzeitsdetails | 📋 | `/einstellungen?tab=hochzeitsdetails` |
| 3 | Teilt eure Hochzeit | 📡 | `/einstellungen?tab=teilen` |
| 4 | Kundenservice | ❓ | `/einstellungen?tab=kundenservice` |
| — | Ausloggen | — | Clears session → redirect to `/` |

**Active state:** Purple highlight bar on left edge of active tab.
**Default tab:** Meine Account-Daten (tab 1).
**Tab switching:** No browser history push — tab changes are in-place.
**Back button:** Returns to previous page (not previous tab).

### 1.3 Mobile Responsive Behavior (Inferred)

At breakpoints < 1024px, sidebar tabs likely collapse to horizontal tabs or a stacked vertical list above the content area, consistent with Bridebook's responsive patterns.

### 1.4 Breadcrumb

```
Startseite > Einstellungen > [Tab Name]
/          > /einstellungen > /einstellungen?tab=account
```

### 1.5 App Version Footer

Visible at bottom of Account Data tab:
```
App Version: Bridebook bb-web | 33.39.0
```

---

## 2. MEINE ACCOUNT-DATEN (My Account Data)

**Route:** `/einstellungen?tab=account`
**Source:** `settings pt1.png`, `settings pt2.png`

### 2.1 Profile Photo Upload (Dein Profilbild)

| Field | Type | Label (DE) | Label (EN) | Placeholder | Required | Save Behavior |
|-------|------|-----------|------------|-------------|----------|---------------|
| Photo | File upload (image) | Dein Profilbild | Your Profile Photo | "Füge ein Foto hinzu" (inside circle) | No | Explicit — "Hochladen" button |

**Upload button:** "Hochladen" — outline style button.
**Display:** Circular crop preview.
**Accepted formats:** Image files (exact constraints not visible).

### 2.2 Contact Email (Meine Kontakt E-Mail Adresse)

| Field | Type | Label (DE) | Label (EN) | Placeholder | Required | Validation | Save Behavior |
|-------|------|-----------|------------|-------------|----------|------------|---------------|
| E-Mail | Email input | E-Mail | Email | Pre-filled current email | Yes | Email format | Explicit — "Speichern" button (purple) |

**Helper text:** "Die E-Mail-Adresse, über die unsere Dienstleister euch kontaktieren werden (Bitte gebt sie sorgfältig ein)"
**English:** "The email address vendors will use to contact you (Please enter it carefully)"

### 2.3 Login Methods (Meine Login-Methoden)

No input fields — action buttons only.

| Button | German Label | Style | Icon |
|--------|-------------|-------|------|
| Email login | E-Mail Login-Methode hinzufügen | Purple filled | — |
| Facebook | Mit Facebook verbinden | Outlined | Facebook logo |
| Google | Mit Google-Konto verbinden | Outlined | Google logo |

**Section header:** "Deine sozialen Login-Methoden:"
**Behavior:** Clicking SSO buttons triggers respective OAuth flow. Email button likely opens email/password setup fields.

### 2.4 Language Selector (Sprache ändern)

| Field | Type | Label (DE) | Label (EN) | Default | Required | Save Behavior |
|-------|------|-----------|------------|---------|----------|---------------|
| Sprache ändern | Dropdown select | Sprache ändern | Change Language | Deutsch (Deutschland) | Yes | Auto-save on change |

**Floating label** style input.

### 2.5 Account Deletion (Account löschen)

See [Section 7: Destructive Actions](#7-destructive-actions).

---

## 3. MEINE HOCHZEITSDETAILS (My Wedding Details)

**Route:** `/einstellungen?tab=hochzeitsdetails`
**Source:** `settings pt3.png`

| Field | Type | Label (DE) | Label (EN) | Placeholder/Default | Required | Validation | Save Behavior |
|-------|------|-----------|------------|---------------------|----------|------------|---------------|
| Name | Text input (floating label) | Name | Name | Pre-filled (e.g., "El") | Yes | Text | Auto-save or explicit |
| Partner/in Name | Text input (floating label) | Partner/in Name | Partner Name | Pre-filled (e.g., "Eli") | Yes | Text | Auto-save or explicit |
| Role (Person 1) | Radio-like checkbox group | — | — | — | No | Single selection | Auto-save |
| Role (Person 2) | Radio-like checkbox group | — | — | — | No | Single selection | Auto-save |
| Standort | Text input (floating label) | Standort | Location | Pre-filled (e.g., "Deutschland") | No | Text/location | Auto-save or explicit |
| Hochzeitsdatum | Date picker | Hochzeitsdatum | Wedding Date | "Datum auswählen" + calendar icon | No | Valid date | Auto-save |
| Land auswählen | Dropdown select (floating label) | Land auswählen | Select Country | 🇩🇪 Deutschland (with flag) | Yes | Country list | Auto-save |
| Währung | Dropdown select (floating label) | Währung | Currency | EUR - Euro | Yes | Currency list | Auto-save |

### 3.1 Role Options

| Option (DE) | Option (EN) |
|-------------|-------------|
| Braut | Bride |
| Bräutigam | Groom |
| Andere | Other |

Both persons get independent role selection. Displayed as checkbox-style but single-select behavior.

### 3.2 Currency Change

"Meine Währung ändern" text link appears below the currency dropdown for additional currency management.

---

## 4. TEILT EURE HOCHZEIT (Share Your Wedding)

**Route:** `/einstellungen?tab=teilen`
**Source:** `settings pt4.png`

### 4.1 Team Members (Teammitglieder)

**Description text:** "Lade deine Partner:in, Freunde und Familie zur Planung ein. Sie können auf deine Hochzeitsinfos zugreifen / sie bearbeiten und erhalten auch E-Mail-Updates."

| Field | Type | Label (DE) | Label (EN) | Default | Required | Validation |
|-------|------|-----------|------------|---------|----------|------------|
| Partner/in Name | Text input (floating label) | Partner/in Name | Partner Name | Pre-filled (e.g., "Eli") | Yes | Text |
| Role | Checkbox group | — | — | — | No | Single selection |

**Role Options:** Braut, Bräutigam, Andere

**Submit:** "Teammitglieder einladen" — purple filled button.
**Behavior:** Sends invite email to partner/team member granting access to wedding planning data.

### 4.2 Share Wedding Details (Teilt eure Hochzeitsdetails)

**Description:** Instructions about sharing via "Adresse anfordern" function.
**Promotion text:** "Ladet die Bridebook-App herunter & erstellt eure Hochzeitshomepage!"

| Element | Type | Purpose |
|---------|------|---------|
| App Store badge | Image link | iOS app download |
| Google Play badge | Image link | Android app download |
| QR code | Image | Quick mobile app access |

---

## 5. KUNDENSERVICE (Customer Service)

**Route:** `/einstellungen?tab=kundenservice`
**Source:** `settings pt5.png`

No input fields. Two action sections:

### 5.1 Help (Hilfe)

**Description:** "Das Support-Team ist hier, damit dein Bridebook reibungslos läuft. Brauchst du Hilfe? Kontaktiere uns bitte!"
**Button:** "Hilfe holen" — purple filled.
**Action:** Opens support contact form / help center.

### 5.2 Feedback

**Description:** "Wir freuen uns, von dir zu hören und wollen uns immer verbessern. Klicke unten, um dein Feedback zu senden!"
**Button:** "Gib uns Feedback" — purple filled.
**Action:** Opens feedback submission form.

---

## 6. HOCHZEITSHOMEPAGE EINSTELLUNGEN (Wedding Homepage Settings)

**Route:** `/hochzeitshomepage?tab=einstellungen`
**Source:** `hochzeit home page einstellung.png`

This is a separate settings tab within the Wedding Homepage editor (not the main `/einstellungen` page). The homepage editor has 3 tabs: Details | Design | Einstellungen.

### 6.1 Settings Fields

| Field | Type | Label (DE) | Label (EN) | Placeholder/Default | Required | Save Behavior |
|-------|------|-----------|------------|---------------------|----------|---------------|
| URL der Website | Text input | URL der Website | Website URL | "eure-einzigartige-Adresse" (editable slug) | Yes | Explicit — "Fertig" button |
| Veröffentlicht | Toggle switch | Veröffentlicht | Published | Off (grey) | — | Explicit — "Fertig" button |
| Homepage-Passwort | Toggle switch | Homepage-Passwort | Homepage Password | Off (grey) | — | Explicit — "Fertig" button |

**Submit:** "Fertig" — small purple button.
**Helper text:** "Euer Link wird hier verfügbar sein, sobald ihr eure Homepage veröffentlicht habt"
**Published URL format:** `bridebook.com/de/for/[custom-slug]`

### 6.2 Password Protection Behavior

When "Homepage-Passwort" toggle is enabled → password field appears for setting a guest access password. Guests must enter the password to view the homepage.

### 6.3 Publish Flow

| Condition | Result |
|-----------|--------|
| All required fields filled (names) | Homepage goes live at custom URL |
| Required fields missing | System highlights missing sections |
| Status change | Badge changes from "Nicht veröffentlicht" → "Veröffentlicht" |
| After publish | "Teilen" button becomes active for sharing URL |

### 6.4 Global Homepage Actions (Visible Across All Tabs)

| Button | German | Style | Position |
|--------|--------|-------|----------|
| Share | Teilen | Outlined | Top bar |
| Publish | Veröffentlichen | Purple filled | Top bar |
| Preview toggle | Mobile/Desktop icons | Icon buttons | Top bar |
| Preview | Vorschau | Text link | Top bar |

---

## 7. DESTRUCTIVE ACTIONS

### 7.1 Delete Account (Konto löschen)

**Route:** `/einstellungen?tab=account` (bottom of page)
**Source:** `settings pt2.png`

**Warning text (DE):** "Durch diese Aktion werden euer Konto und alle gespeicherten Inhalte endgültig gelöscht. Dies kann nicht rückgängig gemacht werden."
**Warning text (EN):** "This action will permanently delete your account and all saved content. This cannot be undone."

**Button:** "Konto löschen" — red/outline destructive style.

### 7.2 Deletion Flow

```
Step 1: User clicks "Konto löschen" button
Step 2: System shows confirmation dialog with warning
Step 3a: IF confirmed → Account and all data permanently deleted → redirect to landing page
Step 3b: IF cancelled → returns to account settings
```

### 7.3 Data Loss Scope

Account deletion removes:
- Profile data (photo, name, email)
- Wedding details (date, location, partner info)
- All planning data (checklist, budget, guest list, favorites)
- Wedding homepage content
- Message history with vendors
- Team member connections

### 7.4 Cooling-Off Period (Inferred)

Under GDPR/DSGVO requirements applicable in Germany, a cooling-off or grace period before permanent deletion is likely implemented. Standard practice: 14–30 day soft-delete window during which the account can be recovered.

---

## 8. INFERRED: NOTIFICATION SETTINGS

> **Status:** Not visible in current screenshot corpus. Inferred as necessary for a complete platform.

### 8.1 Email Notification Toggles

| Notification Type (DE) | Notification Type (EN) | Default (Inferred) |
|------------------------|------------------------|---------------------|
| Nachrichten von Dienstleistern | Messages from vendors | On |
| Erinnerungen an Aufgaben | Task reminders | On |
| Tipps & Empfehlungen | Tips & recommendations | On |
| Marketing & Angebote | Marketing & offers | Off |
| Teammitglieder-Updates | Team member updates | On |

### 8.2 Push Notification Preferences (Inferred)

| Setting | Type | Default |
|---------|------|---------|
| Push-Benachrichtigungen aktivieren | Master toggle | On |
| Nachrichten | Toggle | On |
| Erinnerungen | Toggle | On |
| Countdown-Meilensteine | Toggle | On |

### 8.3 Frequency Settings (Inferred)

| Option (DE) | Option (EN) |
|-------------|-------------|
| Sofort | Immediately |
| Tägliche Zusammenfassung | Daily digest |
| Wöchentliche Zusammenfassung | Weekly digest |

---

## 9. INFERRED: PRIVACY SETTINGS

> **Status:** Not visible in current screenshot corpus. Required for GDPR/DSGVO compliance in the German market.

### 9.1 Profile Visibility (Inferred)

| Setting (DE) | Setting (EN) | Type | Default |
|-------------|-------------|------|---------|
| Profil-Sichtbarkeit | Profile visibility | Dropdown (Öffentlich / Privat) | Privat |
| Suchmaschinen-Indexierung | Search engine indexing | Toggle | Off |

### 9.2 Data Rights (GDPR/DSGVO) (Inferred)

| Action (DE) | Action (EN) | Type | Confirmation Required |
|-------------|-------------|------|----------------------|
| Daten exportieren | Export data | Button | Yes |
| Daten löschen | Delete data | Button | Yes (see Section 7) |
| Einwilligungen verwalten | Manage consents | Link | — |

**GDPR requirements for the German market:**
- Right to data portability — export in machine-readable format (JSON/CSV)
- Right to erasure — covered by account deletion (Section 7)
- Right to access — user must be able to view all stored personal data
- Cookie preferences — managed separately via cookie banner

### 9.3 Cookie Preferences (Inferred)

| Category (DE) | Category (EN) | Required | Default |
|---------------|---------------|----------|---------|
| Technisch notwendig | Technically necessary | Yes | On (locked) |
| Analyse | Analytics | No | Off |
| Marketing | Marketing | No | Off |

---

## 10. INFERRED: SECURITY SETTINGS

> **Status:** Not visible in current screenshot corpus. Inferred as standard for account security.

### 10.1 Password Management (Inferred)

| Field (DE) | Field (EN) | Type | Validation |
|-----------|------------|------|------------|
| Aktuelles Passwort | Current password | Password input | Must match current |
| Neues Passwort | New password | Password input | Min length, complexity |
| Passwort bestätigen | Confirm password | Password input | Must match new password |

**Note:** Currently, login methods are managed in Section 2.3. Password change may be handled through the "E-Mail Login-Methode hinzufügen" flow or via a "Passwort vergessen" (forgot password) email link.

### 10.2 Two-Factor Authentication (Inferred)

| Setting (DE) | Setting (EN) | Type | Default |
|-------------|-------------|------|---------|
| Zwei-Faktor-Authentifizierung | Two-factor authentication | Toggle + setup flow | Off |

**Methods:** SMS, authenticator app, or email code.

### 10.3 Active Sessions (Inferred)

| Column | Description |
|--------|-------------|
| Gerät | Device name/type |
| Standort | Location (approximate) |
| Letzter Zugriff | Last access time |
| Aktion | "Abmelden" (Sign out) button |

---

## Field Pattern Summary

All settings pages follow consistent Bridebook patterns:

| Pattern | Implementation |
|---------|----------------|
| Input style | Floating labels (Material Design influenced) |
| Primary action | Purple filled button |
| Secondary action | Outlined button |
| Destructive action | Red/outline button |
| Toggle switches | Grey (off) / Purple (on) |
| Auto-save | Used for dropdowns and toggles where possible |
| Explicit save | Used for text inputs with "Speichern" or "Fertig" buttons |
| Language | All labels in German; English available via language selector |
| Confirmation | Required for destructive actions only |



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 10                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-10--API-STRUCTURE"></a>

### Doc 10 — API STRUCTURE

> Source: `docs/10-API-STRUCTURE.md` ·     3422 lines

# 10 — REST API Structure

> Complete REST API specification for Bridebook, derived from 61 screenshots and docs 01–09.
> Base URL: `https://api.bridebook.de/api/v1`
> OpenAPI 3.0 compatible · German-first (de-DE) · JWT Bearer auth

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Authentication](#2-authentication)
3. [Users](#3-users)
4. [Weddings](#4-weddings)
5. [Vendors](#5-vendors)
6. [Categories & Geography](#6-categories--geography)
7. [Advice / Articles](#7-advice--articles)
8. [Favorites](#8-favorites)
9. [Enquiries](#9-enquiries)
10. [Messages](#10-messages)
11. [Planning — Tasks](#11-planning--tasks)
12. [Planning — Budget](#12-planning--budget)
13. [Planning — Guests](#13-planning--guests)
14. [Wedding Homepage](#14-wedding-homepage)
15. [Notifications](#15-notifications)
16. [Uploads](#16-uploads)
17. [Search](#17-search)
18. [Analytics](#18-analytics)
19. [Export](#19-export)
20. [Webhooks](#20-webhooks)
21. [Real-Time / WebSocket](#21-real-time--websocket)

---

## 1. API Conventions

### 1.1 Versioning

| Header | Value |
|--------|-------|
| URL prefix | `/api/v1` |
| Strategy | URL-based versioning |
| Deprecation | `Sunset` header with ISO 8601 date |
| Minimum notice | 6 months before removal |

### 1.2 Authentication

All authenticated endpoints require:

```
Authorization: Bearer <jwt_access_token>
```

Token lifetime: 15 minutes (access), 30 days (refresh).

### 1.3 Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Per endpoint | JWT Bearer token |
| `Content-Type` | POST/PUT/PATCH | `application/json` |
| `Accept` | Recommended | `application/json` |
| `Accept-Language` | Optional | `de-DE` (default), `en-GB` |
| `Idempotency-Key` | POST mutations | UUID v4, prevents duplicate creates |
| `X-Request-ID` | Optional | UUID v4, returned in response for tracing |
| `If-None-Match` | Optional | ETag for conditional GET (304 Not Modified) |

### 1.4 Response Envelope

**Success (single resource):**

```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

**Success (collection):**

```json
{
  "data": [ ... ],
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  },
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "has_more": true,
    "total_count": 342
  }
}
```

**Error:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

### 1.5 Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body or params |
| 400 | `INVALID_CURSOR` | Malformed pagination cursor |
| 401 | `UNAUTHORIZED` | Missing or expired token |
| 401 | `TOKEN_EXPIRED` | Access token expired, use refresh |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 403 | `WEDDING_ACCESS_DENIED` | Not a member of this wedding |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Duplicate resource (e.g., duplicate favorite) |
| 409 | `EMAIL_TAKEN` | Email already registered |
| 422 | `UNPROCESSABLE` | Semantic validation failure |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

### 1.6 Pagination

Cursor-based pagination on all list endpoints:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Opaque cursor from previous response |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | varies | Sort field (e.g., `created_at`, `name`) |
| `order` | string | `desc` | `asc` or `desc` |

### 1.7 Rate Limiting

| Tier | Limit | Applied To |
|------|-------|------------|
| **Strict** | 10 req/min | Auth endpoints (login, register, password reset) |
| **Standard** | 60 req/min | Most CRUD endpoints |
| **Relaxed** | 120 req/min | Read-only lists, search |
| **Heavy** | 30 req/min | File uploads, exports, bulk operations |

Response headers on every request:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 57
X-RateLimit-Reset: 1705312260
Retry-After: 42       (only on 429)
```

### 1.8 CORS

```
Access-Control-Allow-Origin: https://bridebook.de, https://app.bridebook.de
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, X-Request-ID, If-None-Match
Access-Control-Expose-Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, ETag, X-Request-ID
Access-Control-Max-Age: 86400
```

### 1.9 ETag / Conditional Requests

Cacheable GET responses include an `ETag` header. Clients send `If-None-Match` to receive `304 Not Modified` when content hasn't changed. Supported on:

- `GET /vendors/:id`
- `GET /weddings/:id`
- `GET /wedding-homepage/:id/public`
- `GET /categories`
- `GET /regions`

### 1.10 Idempotency

All POST endpoints that create resources support `Idempotency-Key` header (UUID v4). The server stores the key for 24 hours. Replayed requests return the original response with `X-Idempotent-Replayed: true`.

---

## 2. Authentication

> Rate limit tier: **Strict** (10 req/min)
> Cross-ref: `users` table, `user_sessions` table, `password_resets` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)

### 2.1 Register

```
POST /auth/register
```

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✓ | Valid email, max 255 chars |
| `password` | string | ✓ | Min 8 chars, 1 uppercase, 1 number |
| `first_name` | string | ✓ | Max 100 chars |
| `last_name` | string | ✓ | Max 100 chars |
| `role` | enum | ✓ | `couple` \| `vendor` |
| `locale` | string | — | Default `de-DE` |

**Response:** `201 Created`

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "Anna",
      "last_name": "Schmidt",
      "role": "couple",
      "avatar_url": null,
      "locale": "de-DE",
      "email_verified": false,
      "created_at": "2026-01-15T10:30:00Z"
    },
    "tokens": {
      "access_token": "eyJ...",
      "refresh_token": "eyJ...",
      "expires_in": 900
    }
  }
}
```

**Errors:** `EMAIL_TAKEN` (409), `VALIDATION_ERROR` (400)

### 2.2 Login

```
POST /auth/login
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✓ |
| `password` | string | ✓ |

**Response:** `200 OK` — Same token structure as register.

**Errors:** `UNAUTHORIZED` (401) — "Ungültige Anmeldedaten"

### 2.3 OAuth Login

```
POST /auth/oauth
```

**Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `provider` | enum | ✓ | `apple` \| `google` \| `facebook` |
| `id_token` | string | ✓ | Provider's ID token |
| `first_name` | string | — | For new accounts (Apple) |
| `last_name` | string | — | For new accounts (Apple) |

**Response:** `200 OK` (existing user) or `201 Created` (new user) — Same token structure.

### 2.4 Refresh Token

```
POST /auth/refresh
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `refresh_token` | string | ✓ |

**Response:** `200 OK`

```json
{
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}
```

**Errors:** `UNAUTHORIZED` (401) — Invalid or expired refresh token

### 2.5 Logout

```
POST /auth/logout
```

**Auth:** Required

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `refresh_token` | string | ✓ |

**Response:** `204 No Content`

Invalidates the session and refresh token server-side.

### 2.6 Request Password Reset

```
POST /auth/password-reset
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✓ |

**Response:** `202 Accepted` — Always returns 202 regardless of email existence (prevents enumeration).

### 2.7 Confirm Password Reset

```
POST /auth/password-reset/confirm
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `token` | string | ✓ |
| `password` | string | ✓ |

**Response:** `200 OK`

**Errors:** `UNAUTHORIZED` (401) — Invalid or expired reset token (1 hour TTL)

### 2.8 Verify Email

```
POST /auth/email/verify
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `token` | string | ✓ |

**Response:** `200 OK`

```json
{
  "data": {
    "email_verified": true
  }
}
```

### 2.9 Resend Verification Email

```
POST /auth/email/resend
```

**Auth:** Required

**Response:** `202 Accepted`

Rate limited to 1 per 2 minutes per user.

### 2.10 Get Current Session

```
GET /auth/session
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "user": { ... },
    "session": {
      "id": "uuid",
      "created_at": "2026-01-15T10:30:00Z",
      "last_active_at": "2026-01-15T12:00:00Z",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0..."
    }
  }
}
```

---

## 3. Users

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `users` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Profile forms — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §9, [09-SETTINGS-PAGES.md](./09-SETTINGS-PAGES.md)

### 3.1 Get Profile

```
GET /users/me
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Anna",
    "last_name": "Schmidt",
    "role": "couple",
    "avatar_url": "https://cdn.bridebook.de/avatars/uuid.jpg",
    "locale": "de-DE",
    "email_verified": true,
    "oauth_providers": ["google"],
    "active_wedding_id": "uuid",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T12:00:00Z"
  }
}
```

### 3.2 Update Profile

```
PATCH /users/me
```

**Auth:** Required

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `first_name` | string | — | Max 100 chars |
| `last_name` | string | — | Max 100 chars |
| `email` | string | — | Valid email (triggers re-verification) |
| `locale` | string | — | `de-DE` \| `en-GB` |

**Response:** `200 OK` — Updated user object.

### 3.3 Upload Avatar

```
POST /users/me/avatar
```

**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `file` | file | ✓ | JPG/PNG, max 5 MB, min 200×200px |

**Response:** `200 OK`

```json
{
  "data": {
    "avatar_url": "https://cdn.bridebook.de/avatars/uuid.jpg"
  }
}
```

### 3.4 Delete Avatar

```
DELETE /users/me/avatar
```

**Auth:** Required

**Response:** `204 No Content`

### 3.5 Get Preferences

```
GET /users/me/preferences
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "email_notifications": true,
    "push_notifications": true,
    "marketing_emails": false,
    "newsletter": true,
    "reminder_frequency": "weekly"
  }
}
```

### 3.6 Update Preferences

```
PATCH /users/me/preferences
```

**Auth:** Required

**Body:** Partial update of preference fields.

**Response:** `200 OK` — Updated preferences object.

### 3.7 Delete Account

```
DELETE /users/me
```

**Auth:** Required

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | string | Conditional | Required if password-based account |
| `reason` | string | — | Optional deletion reason |

**Response:** `202 Accepted`

Triggers async account deletion (30-day grace period). All personal data is anonymized per GDPR. See [§19 Export](#19-export) for data portability.

---

## 4. Weddings

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `weddings` table, `wedding_settings` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Wedding detail forms — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §6

### 4.1 List Weddings

```
GET /weddings
```

**Auth:** Required

Returns all weddings the authenticated user is a member of (as owner or team member).

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "partner1_first_name": "Anna",
      "partner1_last_name": "Schmidt",
      "partner1_role": "Braut",
      "partner2_first_name": "Max",
      "partner2_last_name": "Müller",
      "partner2_role": "Bräutigam",
      "date": "2027-06-15",
      "location": "Wiesbaden",
      "country": "DE",
      "currency": "EUR",
      "estimated_budget": 25000,
      "estimated_guests": 120,
      "status": "planning",
      "role": "owner",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

### 4.2 Create Wedding

```
POST /weddings
```

**Auth:** Required

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `partner1_first_name` | string | ✓ | Max 100 |
| `partner1_last_name` | string | — | Max 100 |
| `partner1_role` | enum | — | `Braut` \| `Bräutigam` \| `Andere` |
| `partner2_first_name` | string | — | Max 100 |
| `partner2_last_name` | string | — | Max 100 |
| `partner2_role` | enum | — | `Braut` \| `Bräutigam` \| `Andere` |
| `date` | date | — | ISO 8601, must be future |
| `location` | string | — | Max 200 |
| `country` | string | — | ISO 3166-1 alpha-2, default `DE` |
| `currency` | string | — | ISO 4217, default `EUR` |
| `estimated_budget` | integer | — | Min 0 |
| `estimated_guests` | integer | — | Min 0 |

**Response:** `201 Created` — Full wedding object.

### 4.3 Get Wedding

```
GET /weddings/:wedding_id
```

**Auth:** Required (wedding member)

**Response:** `200 OK` — Full wedding object with settings.

### 4.4 Update Wedding

```
PATCH /weddings/:wedding_id
```

**Auth:** Required (wedding owner)

**Body:** Partial update of wedding fields (same as create).

**Response:** `200 OK`

### 4.5 Delete Wedding

```
DELETE /weddings/:wedding_id
```

**Auth:** Required (wedding owner)

**Response:** `204 No Content`

Cascades to all related data (tasks, budget, guests, enquiries, favorites, homepage).

### 4.6 Get Wedding Settings

```
GET /weddings/:wedding_id/settings
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "wedding_id": "uuid",
    "privacy_level": "private",
    "theme": "classic",
    "locale": "de-DE",
    "timezone": "Europe/Berlin",
    "preferences": {
      "show_budget": true,
      "show_guest_count": true,
      "default_currency": "EUR"
    },
    "updated_at": "2026-01-15T12:00:00Z"
  }
}
```

### 4.7 Update Wedding Settings

```
PATCH /weddings/:wedding_id/settings
```

**Auth:** Required (wedding owner)

**Body:** Partial update of settings fields (JSONB merge).

**Response:** `200 OK`

### 4.8 Invite Team Member

```
POST /weddings/:wedding_id/team
```

**Auth:** Required (wedding owner)

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✓ | Valid email |
| `name` | string | ✓ | Display name |
| `role` | enum | ✓ | `partner` \| `planner` \| `viewer` |

**Response:** `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "email": "partner@example.com",
    "name": "Max",
    "role": "partner",
    "status": "pending",
    "invited_at": "2026-01-15T10:30:00Z"
  }
}
```

### 4.9 List Team Members

```
GET /weddings/:wedding_id/team
```

**Auth:** Required (wedding member)

**Response:** `200 OK` — Array of team members with status (`pending`, `accepted`, `declined`).

### 4.10 Remove Team Member

```
DELETE /weddings/:wedding_id/team/:member_id
```

**Auth:** Required (wedding owner)

**Response:** `204 No Content`

---

## 5. Vendors

> Rate limit tier: **Relaxed** (120 req/min) for list/search, **Standard** (60 req/min) for detail/reviews
> Cross-ref: `vendors`, `vendor_images`, `vendor_packages`, `vendor_availability`, `reviews` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Search filters — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §5

### 5.1 List / Search Vendors

```
GET /vendors
```

**Auth:** Optional (favorites status requires auth)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | — | Full-text search on business_name, description |
| `category` | string | — | Category slug (e.g., `locations`, `fotografen`) |
| `subcategory` | string | — | Subcategory slug |
| `region` | string | — | Region slug |
| `city` | string | — | City slug |
| `lat` | number | — | Latitude for geo search |
| `lng` | number | — | Longitude for geo search |
| `radius_km` | integer | 50 | Radius for geo search (max 200) |
| `price_range` | enum | — | `$` \| `$$` \| `$$$` \| `$$$$` |
| `min_price` | integer | — | Minimum price in EUR |
| `max_price` | integer | — | Maximum price in EUR |
| `min_rating` | number | — | Min avg_rating (0-5) |
| `guest_capacity_min` | integer | — | Min guest capacity |
| `guest_capacity_max` | integer | — | Max guest capacity |
| `venue_type` | string[] | — | Comma-separated: `landhaus,scheune,schloss,hotel,restaurant,garten,strand,stadtisch,bauernhof,weingut,boot,industriell,museum,kirche,zelt,denkmal,andere` |
| `venue_style` | string[] | — | Comma-separated: `klassisch,alternativ,romantisch,modern,rustikal,bohemian,glamouros,minimalistisch,vintage,tropisch,woodland,industrial,mediterran,art-deco,zeitgenossisch,traditionell,luxurios,intim,festlich,gotisch,nautisch` |
| `features` | string[] | — | Comma-separated: `parkplatze,barrierefrei,tanzflache,garten,kamin,terrasse,pool,klimaanlage,hauseigene-unterkunft,haustiere-erlaubt,kinderfreundlich,ladestation,wlan` |
| `catering` | string[] | — | `hausinternes-catering,externe-catering,halal,koscher` |
| `accommodation_rooms` | enum | — | `10` \| `20` \| `30` \| `50` |
| `exclusive_use` | boolean | — | Venue exclusive hire |
| `has_accommodation` | boolean | — | On-site rooms |
| `has_license` | boolean | — | Alcohol license |
| `special_offer` | boolean | — | Last-minute deals |
| `open_day` | boolean | — | Available viewing dates |
| `wedding_fair` | boolean | — | Hochzeitsmesse participation |
| `cultural_specialist` | string[] | — | `asiatisch,judisch,muslimisch,andere` |
| `diversity` | string[] | — | `lgbtq,neurodivers` |
| `available_date` | date | — | ISO 8601, check availability |
| `view` | enum | `list` | `list` \| `map` |
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 20 | Max 100 |
| `sort` | enum | `relevance` | `relevance` \| `rating` \| `price_asc` \| `price_desc` \| `distance` \| `newest` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "business_name": "Schloss Biebrich",
      "slug": "schloss-biebrich",
      "category": {
        "id": "uuid",
        "name": "Locations",
        "slug": "locations"
      },
      "city": {
        "id": "uuid",
        "name": "Wiesbaden",
        "region": "Hessen"
      },
      "cover_image_url": "https://cdn.bridebook.de/vendors/...",
      "min_price": 5000,
      "max_price": 15000,
      "price_range": "$$$",
      "avg_rating": 4.7,
      "review_count": 42,
      "is_favorited": false,
      "favorite_note": null,
      "tags": ["Schloss", "Exklusive Nutzung", "Garten"],
      "distance_km": 3.2
    }
  ],
  "pagination": { ... },
  "meta": {
    "total_count": 156,
    "applied_filters": { ... }
  }
}
```

### 5.2 Get Vendor Detail

```
GET /vendors/:vendor_id
```

**Auth:** Optional

**ETag:** Supported

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "business_name": "Schloss Biebrich",
    "slug": "schloss-biebrich",
    "description": "Ein historisches Schloss...",
    "category": { "id": "uuid", "name": "Locations", "slug": "locations" },
    "subcategories": [{ "id": "uuid", "name": "Schloss", "slug": "schloss" }],
    "city": { "id": "uuid", "name": "Wiesbaden", "region": "Hessen" },
    "address": "Rheingaustraße 140, 65203 Wiesbaden",
    "lat": 50.0379,
    "lng": 8.2297,
    "phone": "+49 611 123456",
    "email": "info@schloss-biebrich.de",
    "website": "https://schloss-biebrich.de",
    "min_price": 5000,
    "max_price": 15000,
    "currency": "EUR",
    "avg_rating": 4.7,
    "review_count": 42,
    "images": [
      {
        "id": "uuid",
        "url": "https://cdn.bridebook.de/vendors/...",
        "alt_text": "Großer Festsaal",
        "position": 0,
        "is_cover": true
      }
    ],
    "packages": [
      {
        "id": "uuid",
        "name": "Basis-Paket",
        "description": "Raummiete inkl. Bestuhlung",
        "price": 5000,
        "currency": "EUR",
        "active": true
      }
    ],
    "hours": [
      { "day": 1, "open_time": "09:00", "close_time": "22:00" }
    ],
    "features": ["parkplatze", "barrierefrei", "garten", "tanzflache"],
    "venue_types": ["schloss"],
    "venue_styles": ["klassisch", "romantisch"],
    "guest_capacity_min": 50,
    "guest_capacity_max": 250,
    "exclusive_use": true,
    "has_accommodation": true,
    "accommodation_rooms": 20,
    "has_license": true,
    "catering_options": ["hausinternes-catering"],
    "cultural_specialists": [],
    "diversity_friendly": ["lgbtq"],
    "special_offer": null,
    "is_favorited": false,
    "status": "active",
    "created_at": "2025-06-01T08:00:00Z",
    "updated_at": "2026-01-10T14:00:00Z"
  }
}
```

### 5.3 Get Vendor Availability

```
GET /vendors/:vendor_id/availability
```

**Auth:** Optional

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | date | ✓ | Start date (ISO 8601) |
| `to` | date | ✓ | End date (max 90 days range) |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "date": "2027-06-15",
      "status": "available"
    },
    {
      "date": "2027-06-16",
      "status": "booked"
    },
    {
      "date": "2027-06-17",
      "status": "blocked"
    }
  ]
}
```

### 5.4 List Vendor Reviews

```
GET /vendors/:vendor_id/reviews
```

**Auth:** Optional

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `cursor` | string | — |
| `limit` | integer | 20 |
| `sort` | enum | `newest` — `newest` \| `highest` \| `lowest` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "first_name": "Sarah",
        "avatar_url": "..."
      },
      "overall_rating": 5,
      "quality_rating": 5,
      "value_rating": 4,
      "service_rating": 5,
      "title": "Traumhafte Location!",
      "content": "Wir hatten eine wunderbare Hochzeit...",
      "wedding_date": "2026-09-20",
      "vendor_reply": {
        "content": "Vielen Dank für die tolle Bewertung!",
        "replied_at": "2026-10-01T09:00:00Z"
      },
      "created_at": "2026-09-25T14:00:00Z"
    }
  ],
  "pagination": { ... },
  "meta": {
    "rating_breakdown": {
      "5": 28,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 0
    },
    "avg_overall": 4.7,
    "avg_quality": 4.8,
    "avg_value": 4.3,
    "avg_service": 4.9
  }
}
```

### 5.5 Create Review

```
POST /vendors/:vendor_id/reviews
```

**Auth:** Required

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `overall_rating` | integer | ✓ | 1–5 |
| `quality_rating` | integer | ✓ | 1–5 |
| `value_rating` | integer | ✓ | 1–5 |
| `service_rating` | integer | ✓ | 1–5 |
| `title` | string | ✓ | Max 200 chars |
| `content` | string | ✓ | Min 50, max 5000 chars |
| `wedding_date` | date | — | ISO 8601 |
| `wedding_id` | uuid | ✓ | Must be user's wedding |

**Response:** `201 Created`

**Errors:** `CONFLICT` (409) — One review per wedding per vendor.

### 5.6 Update Review

```
PATCH /vendors/:vendor_id/reviews/:review_id
```

**Auth:** Required (review author)

**Body:** Partial update of review fields.

**Response:** `200 OK`

### 5.7 Delete Review

```
DELETE /vendors/:vendor_id/reviews/:review_id
```

**Auth:** Required (review author or admin)

**Response:** `204 No Content`

---

## 6. Categories & Geography

> Rate limit tier: **Relaxed** (120 req/min)
> Cross-ref: `categories`, `subcategories`, `regions`, `cities` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> ETag supported on all endpoints

### 6.1 List Categories

```
GET /categories
```

**Auth:** None

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Locations",
      "slug": "locations",
      "icon": "map-pin",
      "description": "Hochzeitslocations in Ihrer Nähe",
      "vendor_count": 342,
      "position": 1
    }
  ]
}
```

### 6.2 Get Category with Subcategories

```
GET /categories/:category_slug
```

**Auth:** None

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "name": "Locations",
    "slug": "locations",
    "description": "...",
    "vendor_count": 342,
    "subcategories": [
      {
        "id": "uuid",
        "name": "Schloss",
        "slug": "schloss",
        "vendor_count": 28
      }
    ]
  }
}
```

### 6.3 List Regions

```
GET /regions
```

**Auth:** None

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `country` | string | `DE` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Hessen",
      "slug": "hessen",
      "country_code": "DE",
      "city_count": 24
    }
  ]
}
```

### 6.4 List Cities

```
GET /regions/:region_slug/cities
```

**Auth:** None

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Wiesbaden",
      "slug": "wiesbaden",
      "lat": 50.0782,
      "lng": 8.2398,
      "vendor_count": 156
    }
  ]
}
```

### 6.5 Get City

```
GET /cities/:city_slug
```

**Auth:** None

**Response:** `200 OK` — City detail with vendor count by category.

```json
{
  "data": {
    "id": "uuid",
    "name": "Wiesbaden",
    "slug": "wiesbaden",
    "region": { "id": "uuid", "name": "Hessen", "slug": "hessen" },
    "lat": 50.0782,
    "lng": 8.2398,
    "vendor_counts": {
      "locations": 42,
      "fotografen": 28,
      "floristen": 15
    }
  }
}
```

---

## 7. Advice / Articles

> Rate limit tier: **Relaxed** (120 req/min)
> Cross-ref: Advice section in [07-SITEMAP-NAVIGATION.md](./07-SITEMAP-NAVIGATION.md)

### 7.1 List Articles

```
GET /articles
```

**Auth:** None

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `category` | string | — |
| `tag` | string | — |
| `cursor` | string | — |
| `limit` | integer | 20 |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "10 Tipps für die Hochzeitsplanung",
      "slug": "10-tipps-hochzeitsplanung",
      "excerpt": "Die wichtigsten Schritte...",
      "cover_image_url": "...",
      "category": "Planung",
      "tags": ["Tipps", "Anfänger"],
      "read_time_minutes": 5,
      "view_count": 1240,
      "published_at": "2026-01-10T08:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 7.2 Get Article

```
GET /articles/:article_slug
```

**Auth:** None

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "title": "10 Tipps für die Hochzeitsplanung",
    "slug": "10-tipps-hochzeitsplanung",
    "content": "<html>...</html>",
    "cover_image_url": "...",
    "category": "Planung",
    "tags": ["Tipps", "Anfänger"],
    "author": {
      "name": "Bridebook Redaktion",
      "avatar_url": "..."
    },
    "read_time_minutes": 5,
    "view_count": 1241,
    "related_articles": [ ... ],
    "published_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-01-12T10:00:00Z"
  }
}
```

### 7.3 Search Articles

```
GET /articles/search
```

**Auth:** None

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| `q` | string | ✓ |
| `limit` | integer | — |

**Response:** `200 OK` — Same structure as list.

### 7.4 Track Article View

```
POST /articles/:article_id/views
```

**Auth:** None (anonymous tracking)

**Response:** `204 No Content`

Debounced: only counts once per session per article.

---

## 8. Favorites

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `favorites` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)

### 8.1 List Favorites

```
GET /weddings/:wedding_id/favorites
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `category` | string | — |
| `cursor` | string | — |
| `limit` | integer | 20 |
| `sort` | enum | `newest` — `newest` \| `name` \| `price` \| `rating` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "vendor": {
        "id": "uuid",
        "business_name": "Schloss Biebrich",
        "slug": "schloss-biebrich",
        "category": { "name": "Locations", "slug": "locations" },
        "cover_image_url": "...",
        "min_price": 5000,
        "avg_rating": 4.7,
        "review_count": 42,
        "city": "Wiesbaden"
      },
      "note": "Tolle Gartenanlage, Termin am 15.3.",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 8.2 Add Favorite

```
POST /weddings/:wedding_id/favorites
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `vendor_id` | uuid | ✓ |
| `note` | string | — |

**Response:** `201 Created`

**Errors:** `CONFLICT` (409) — Already favorited (UNIQUE constraint on wedding_id + vendor_id).

### 8.3 Update Favorite Note

```
PATCH /weddings/:wedding_id/favorites/:favorite_id
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `note` | string | ✓ |

**Response:** `200 OK`

### 8.4 Remove Favorite

```
DELETE /weddings/:wedding_id/favorites/:favorite_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

---

## 9. Enquiries

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `enquiries` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Enquiry form — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §3

### 9.1 Create Enquiry

```
POST /weddings/:wedding_id/enquiries
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `vendor_id` | uuid | ✓ | Target vendor |
| `interests` | string[] | ✓ | `allgemeine-informationen`, `preis-und-pakete`, `verfuegbarkeit`, `besichtigung`, `andere` |
| `message` | string | — | Custom message (max 2000 chars) |
| `preferred_date` | date | — | Wedding date (pre-filled) |
| `estimated_guests` | integer | — | Guest count (pre-filled) |

Pre-filled from wedding data: email, phone, partner names, date, guest count.

**Response:** `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "vendor": {
      "id": "uuid",
      "business_name": "Schloss Biebrich",
      "slug": "schloss-biebrich"
    },
    "interests": ["allgemeine-informationen", "preis-und-pakete"],
    "message": "Guten Tag, wir interessieren uns...",
    "status": "pending",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Errors:** `CONFLICT` (409) — Duplicate enquiry (UNIQUE constraint on wedding_id + vendor_id).

### 9.2 List Enquiries

```
GET /weddings/:wedding_id/enquiries
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `status` | enum | — | `pending` \| `read` \| `replied` \| `booked` \| `declined` \| `archived` |
| `cursor` | string | — |
| `limit` | integer | 20 |

**Response:** `200 OK` — Array of enquiry objects with vendor summary and last message preview.

### 9.3 Get Enquiry Detail

```
GET /weddings/:wedding_id/enquiries/:enquiry_id
```

**Auth:** Required (wedding member)

**Response:** `200 OK` — Full enquiry with message thread.

### 9.4 Update Enquiry Status

```
PATCH /weddings/:wedding_id/enquiries/:enquiry_id
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `status` | enum | ✓ |

Valid transitions: `pending` → `read` → `replied` → `booked`/`declined`/`archived`

**Response:** `200 OK`

### 9.5 Archive Enquiry

```
POST /weddings/:wedding_id/enquiries/:enquiry_id/archive
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

---

## 10. Messages

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `messages`, `message_attachments` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)

### 10.1 List Conversations

```
GET /weddings/:wedding_id/messages
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `status` | enum | — | `active` \| `archived` |
| `cursor` | string | — |
| `limit` | integer | 20 |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "enquiry_id": "uuid",
      "vendor": {
        "id": "uuid",
        "business_name": "Schloss Biebrich",
        "avatar_url": "..."
      },
      "last_message": {
        "content": "Vielen Dank für Ihre Anfrage...",
        "sender_type": "vendor",
        "sent_at": "2026-01-16T09:00:00Z"
      },
      "unread_count": 2,
      "status": "active",
      "updated_at": "2026-01-16T09:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 10.2 Get Message Thread

```
GET /weddings/:wedding_id/messages/:enquiry_id
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `cursor` | string | — |
| `limit` | integer | 50 |
| `order` | enum | `asc` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "sender_id": "uuid",
      "sender_type": "couple",
      "content": "Guten Tag, wir interessieren uns...",
      "attachments": [
        {
          "id": "uuid",
          "filename": "einladung.pdf",
          "url": "...",
          "content_type": "application/pdf",
          "size_bytes": 245000
        }
      ],
      "is_read": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 10.3 Send Message

```
POST /weddings/:wedding_id/messages/:enquiry_id
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `content` | string | ✓ | Max 5000 chars |
| `attachment_ids` | uuid[] | — | Pre-uploaded via Uploads API |

**Response:** `201 Created`

Triggers real-time WebSocket event and push notification to recipient.

### 10.4 Mark Thread as Read

```
POST /weddings/:wedding_id/messages/:enquiry_id/read
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

Marks all unread messages in thread as read.

### 10.5 Archive Conversation

```
POST /weddings/:wedding_id/messages/:enquiry_id/archive
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

### 10.6 Unarchive Conversation

```
POST /weddings/:wedding_id/messages/:enquiry_id/unarchive
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

---

## 11. Planning — Tasks

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `tasks`, `task_templates` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)

### 11.1 List Tasks

```
GET /weddings/:wedding_id/tasks
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `status` | enum | — | `todo` \| `in_progress` \| `done` \| `skipped` |
| `months_before` | integer | — | Filter by timing (e.g., 12 = 12 months before wedding) |
| `cursor` | string | — |
| `limit` | integer | 50 |
| `sort` | enum | `due_date` | `due_date` \| `status` \| `created_at` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Location buchen",
      "description": "Recherchiere und buche eure Traumlocation",
      "status": "todo",
      "due_date": "2026-06-15",
      "months_before": 12,
      "category": "Location",
      "is_custom": false,
      "assigned_to": null,
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... },
  "meta": {
    "counts": {
      "todo": 24,
      "in_progress": 3,
      "done": 12,
      "skipped": 2,
      "total": 41
    }
  }
}
```

### 11.2 Create Task

```
POST /weddings/:wedding_id/tasks
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | ✓ | Max 200 chars |
| `description` | string | — | Max 2000 chars |
| `due_date` | date | — | ISO 8601 |
| `months_before` | integer | — | 0–24 |
| `category` | string | — | Max 100 chars |
| `assigned_to` | uuid | — | Wedding team member ID |

**Response:** `201 Created`

### 11.3 Update Task

```
PATCH /weddings/:wedding_id/tasks/:task_id
```

**Auth:** Required (wedding member)

**Body:** Partial update of task fields including `status`.

**Response:** `200 OK`

### 11.4 Delete Task

```
DELETE /weddings/:wedding_id/tasks/:task_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

### 11.5 Bulk Update Tasks

```
PATCH /weddings/:wedding_id/tasks/bulk
```

**Auth:** Required (wedding member)
**Rate limit tier:** Heavy (30 req/min)

**Body:**

```json
{
  "task_ids": ["uuid", "uuid"],
  "updates": {
    "status": "done"
  }
}
```

Max 50 tasks per request.

**Response:** `200 OK`

```json
{
  "data": {
    "updated_count": 5
  }
}
```

### 11.6 List Task Templates

```
GET /task-templates
```

**Auth:** Required

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `category` | string | — |

**Response:** `200 OK` — Array of template objects with `title`, `description`, `months_before`, `category`.

### 11.7 Add Tasks from Template

```
POST /weddings/:wedding_id/tasks/from-template
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `template_ids` | uuid[] | ✓ |

**Response:** `201 Created`

```json
{
  "data": {
    "created_count": 15,
    "tasks": [ ... ]
  }
}
```

---

## 12. Planning — Budget

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `budget_categories`, `budget_items`, `payments` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Budget calculator form — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §2

### 12.1 Budget Calculator Wizard

```
POST /weddings/:wedding_id/budget/calculate
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `estimated_budget` | integer | ✓ | Amount in EUR |
| `guest_count` | enum | ✓ | `<50` \| `50-99` \| `100-149` \| `150-250` \| `250+` \| `undecided` |
| `day_of_week` | enum | ✓ | `weekday` \| `friday` \| `saturday` \| `sunday` \| `undecided` |
| `season` | enum | ✓ | `hochsaison` \| `nebensaison` \| `weihnachtszeit` \| `undecided` |
| `year` | integer | ✓ | 2026–2029+ |
| `optional_categories` | string[] | — | `videograf`, `planer`, `live-band`, `versicherung`, `entertainer`, `papeterie` |

**Response:** `201 Created`

```json
{
  "data": {
    "total_budget": 25000,
    "categories": [
      {
        "id": "uuid",
        "name": "Hochzeitslocation",
        "estimated_amount": 7500,
        "percentage": 30,
        "position": 1
      },
      {
        "id": "uuid",
        "name": "Catering",
        "estimated_amount": 5000,
        "percentage": 20,
        "position": 2
      }
    ],
    "adjustments": {
      "season_factor": 1.15,
      "day_factor": 0.85,
      "guest_factor": 1.0
    }
  }
}
```

### 12.2 Get Budget Summary

```
GET /weddings/:wedding_id/budget
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "total_budget": 25000,
    "total_estimated": 23500,
    "total_actual": 8200,
    "total_paid": 5000,
    "total_remaining": 16800,
    "categories": [
      {
        "id": "uuid",
        "name": "Hochzeitslocation",
        "estimated_amount": 7500,
        "actual_amount": 7200,
        "paid_amount": 3600,
        "item_count": 3,
        "position": 1
      }
    ]
  }
}
```

### 12.3 List Budget Categories

```
GET /weddings/:wedding_id/budget/categories
```

**Auth:** Required (wedding member)

**Response:** `200 OK` — Array of budget category objects.

### 12.4 Create Budget Category

```
POST /weddings/:wedding_id/budget/categories
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✓ |
| `estimated_amount` | integer | — |
| `position` | integer | — |

**Response:** `201 Created`

### 12.5 Update Budget Category

```
PATCH /weddings/:wedding_id/budget/categories/:category_id
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

### 12.6 Delete Budget Category

```
DELETE /weddings/:wedding_id/budget/categories/:category_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

Cascading: Also deletes all items in this category.

### 12.7 List Budget Items

```
GET /weddings/:wedding_id/budget/categories/:category_id/items
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Raummiete",
      "estimated_cost": 5000,
      "actual_cost": 4800,
      "status": "booked",
      "vendor_id": "uuid",
      "vendor_name": "Schloss Biebrich",
      "payment_notes": "Anzahlung 50% geleistet",
      "payments": [
        {
          "id": "uuid",
          "amount": 2400,
          "method": "bank_transfer",
          "paid_at": "2026-03-01T00:00:00Z"
        }
      ],
      "created_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

### 12.8 Create Budget Item

```
POST /weddings/:wedding_id/budget/categories/:category_id/items
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | ✓ | Max 200 chars |
| `estimated_cost` | integer | — | Min 0, in cents or whole EUR |
| `actual_cost` | integer | — | Min 0 |
| `status` | enum | — | `planned` \| `booked` \| `paid` \| `cancelled` |
| `vendor_id` | uuid | — | Link to vendor |
| `payment_notes` | string | — | Max 1000 chars |

**Response:** `201 Created`

### 12.9 Update Budget Item

```
PATCH /weddings/:wedding_id/budget/categories/:category_id/items/:item_id
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

### 12.10 Delete Budget Item

```
DELETE /weddings/:wedding_id/budget/categories/:category_id/items/:item_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

### 12.11 Reset Budget

```
POST /weddings/:wedding_id/budget/reset
```

**Auth:** Required (wedding owner)

Deletes all categories and items, resets to initial state.

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `confirm` | boolean | ✓ |

**Response:** `200 OK`

---

## 13. Planning — Guests

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: `guests`, `guest_groups`, `seating_tables`, `seating_assignments` tables — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)
> Cross-ref: Guest forms — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §4

### 13.1 List Guests

```
GET /weddings/:wedding_id/guests
```

**Auth:** Required (wedding member)

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `group_id` | uuid | — |
| `rsvp_status` | enum | — | `pending` \| `accepted` \| `declined` \| `maybe` |
| `search` | string | — | Search by name |
| `cursor` | string | — |
| `limit` | integer | 50 |
| `sort` | enum | `name` | `name` \| `group` \| `rsvp_status` \| `created_at` |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "Julia",
      "last_name": "Weber",
      "email": "julia@example.com",
      "phone": "+49 170 1234567",
      "group": {
        "id": "uuid",
        "name": "Els Gäste"
      },
      "rsvp_status": "accepted",
      "dietary_notes": "Vegetarisch",
      "plus_one": true,
      "plus_one_name": "Thomas Weber",
      "is_child": false,
      "seating": {
        "table_id": "uuid",
        "table_name": "Tisch 3"
      },
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... },
  "meta": {
    "counts": {
      "total": 120,
      "accepted": 85,
      "declined": 10,
      "maybe": 8,
      "pending": 17,
      "plus_ones": 30,
      "children": 5
    }
  }
}
```

### 13.2 Create Guest

```
POST /weddings/:wedding_id/guests
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `first_name` | string | ✓ | Max 100 |
| `last_name` | string | — | Max 100 |
| `email` | string | — | Valid email |
| `phone` | string | — | E.164 format |
| `group_id` | uuid | — | Existing guest group |
| `rsvp_status` | enum | — | Default `pending` |
| `dietary_notes` | string | — | Max 500 chars |
| `plus_one` | boolean | — | Default false |
| `plus_one_name` | string | — | Max 200 chars |
| `is_child` | boolean | — | Default false |

**Response:** `201 Created`

### 13.3 Bulk Import Guests

```
POST /weddings/:wedding_id/guests/import
```

**Auth:** Required (wedding member)
**Rate limit tier:** Heavy (30 req/min)

**Body:**

```json
{
  "group_id": "uuid",
  "guests": [
    { "name": "Julia Weber" },
    { "name": "Thomas & Maria Schmidt" },
    { "name": "Familie Müller" }
  ]
}
```

Names are parsed: `&` creates linked couples, one name per line. Max 200 guests per import.

**Response:** `201 Created`

```json
{
  "data": {
    "created_count": 5,
    "guests": [ ... ]
  }
}
```

### 13.4 Update Guest

```
PATCH /weddings/:wedding_id/guests/:guest_id
```

**Auth:** Required (wedding member)

**Body:** Partial update of guest fields.

**Response:** `200 OK`

### 13.5 Delete Guest

```
DELETE /weddings/:wedding_id/guests/:guest_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

### 13.6 List Guest Groups

```
GET /weddings/:wedding_id/guest-groups
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Els Gäste",
      "guest_count": 45,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

### 13.7 Create Guest Group

```
POST /weddings/:wedding_id/guest-groups
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✓ |

**Response:** `201 Created`

### 13.8 Update Guest Group

```
PATCH /weddings/:wedding_id/guest-groups/:group_id
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

### 13.9 Delete Guest Group

```
DELETE /weddings/:wedding_id/guest-groups/:group_id
```

**Auth:** Required (wedding member)

Guests in this group are moved to "Ungrouped", not deleted.

**Response:** `204 No Content`

### 13.10 Public RSVP

```
POST /weddings/:wedding_id/rsvp
```

**Auth:** None (public endpoint, protected by wedding homepage URL slug)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `guest_token` | string | ✓ |
| `rsvp_status` | enum | ✓ |
| `dietary_notes` | string | — |
| `plus_one_name` | string | — |

**Response:** `200 OK`

```json
{
  "data": {
    "guest_name": "Julia Weber",
    "rsvp_status": "accepted",
    "message": "Vielen Dank für deine Zusage!"
  }
}
```

---

## 14. Wedding Homepage

> Rate limit tier: **Standard** (60 req/min)
> Cross-ref: Wedding homepage forms — [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md) §7

### 14.1 Get Homepage (Private/Edit)

```
GET /weddings/:wedding_id/homepage
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "wedding_id": "uuid",
    "slug": "anna-und-max",
    "is_published": true,
    "password_protected": false,
    "password": null,
    "content": {
      "partner1_name": "Anna",
      "partner2_name": "Max",
      "wedding_date": "2027-06-15",
      "location": "Schloss Biebrich, Wiesbaden",
      "use_location_photos": true,
      "our_story": "Wir haben uns 2020 kennengelernt...",
      "timeline": [
        {
          "id": "uuid",
          "title": "Trauung",
          "date": "2027-06-15",
          "time": "14:00",
          "location": "Schlosskapelle",
          "description": "Freie Trauung im Garten"
        }
      ],
      "faq": [
        {
          "id": "uuid",
          "question": "Gibt es einen Dresscode?",
          "answer": "Festlich elegant"
        }
      ],
      "registry_url": "https://...",
      "registry_message": "Eure Anwesenheit ist das schönste Geschenk...",
      "accommodation": {
        "venue_name": "Hotel am Schloss",
        "message": "Wir haben ein Zimmerkontingent...",
        "url": "https://..."
      },
      "rsvp_enabled": true,
      "rsvp_deadline": "2027-05-01"
    },
    "design": {
      "theme": "romantic",
      "font": "playfair",
      "primary_color": "#5B4ED1",
      "accent_color": "#EC4899"
    },
    "photos": [
      {
        "id": "uuid",
        "url": "https://cdn.bridebook.de/homepage/...",
        "position": 0,
        "alt_text": ""
      }
    ],
    "public_url": "https://bridebook.de/h/anna-und-max",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-02-01T12:00:00Z"
  }
}
```

### 14.2 Get Homepage (Public)

```
GET /wedding-homepage/:slug
```

**Auth:** None (public). If password-protected, requires `X-Homepage-Password` header.

**ETag:** Supported

**Response:** `200 OK` — Public-safe subset (no edit fields, no private data).

**Errors:** `NOT_FOUND` (404), `FORBIDDEN` (403) — Wrong password.

### 14.3 Create Homepage

```
POST /weddings/:wedding_id/homepage
```

**Auth:** Required (wedding owner)

**Body:** Initial content fields (same structure as update).

**Response:** `201 Created`

### 14.4 Update Homepage Content

```
PATCH /weddings/:wedding_id/homepage/content
```

**Auth:** Required (wedding member)

**Body:** Partial update of `content` object fields.

**Response:** `200 OK`

### 14.5 Update Homepage Design

```
PATCH /weddings/:wedding_id/homepage/design
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `theme` | string | — |
| `font` | string | — |
| `primary_color` | string | — |
| `accent_color` | string | — |

Auto-saved on change.

**Response:** `200 OK`

### 14.6 Update Homepage Settings

```
PATCH /weddings/:wedding_id/homepage/settings
```

**Auth:** Required (wedding owner)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `slug` | string | — |
| `password_protected` | boolean | — |
| `password` | string | — |

**Response:** `200 OK`

### 14.7 Upload Homepage Photo

```
POST /weddings/:wedding_id/homepage/photos
```

**Auth:** Required (wedding member)
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `file` | file | ✓ | JPG/PNG/WebP, max 10 MB |
| `position` | integer | — | Sort order |
| `alt_text` | string | — | Max 200 chars |

**Response:** `201 Created`

### 14.8 Delete Homepage Photo

```
DELETE /weddings/:wedding_id/homepage/photos/:photo_id
```

**Auth:** Required (wedding member)

**Response:** `204 No Content`

### 14.9 Publish Homepage

```
POST /weddings/:wedding_id/homepage/publish
```

**Auth:** Required (wedding owner)

**Response:** `200 OK`

```json
{
  "data": {
    "is_published": true,
    "public_url": "https://bridebook.de/h/anna-und-max"
  }
}
```

### 14.10 Unpublish Homepage

```
POST /weddings/:wedding_id/homepage/unpublish
```

**Auth:** Required (wedding owner)

**Response:** `200 OK`

### 14.11 Delete Homepage

```
DELETE /weddings/:wedding_id/homepage
```

**Auth:** Required (wedding owner)

**Response:** `204 No Content`

---

## 15. Notifications

> Rate limit tier: **Relaxed** (120 req/min)
> Cross-ref: `notifications` table — [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md)

### 15.1 List Notifications

```
GET /notifications
```

**Auth:** Required

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| `is_read` | boolean | — |
| `type` | string | — |
| `cursor` | string | — |
| `limit` | integer | 20 |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "enquiry_reply",
      "title": "Neue Nachricht von Schloss Biebrich",
      "body": "Vielen Dank für Ihre Anfrage...",
      "is_read": false,
      "data": {
        "enquiry_id": "uuid",
        "vendor_id": "uuid"
      },
      "action_url": "/nachrichten/uuid",
      "created_at": "2026-01-16T09:00:00Z"
    }
  ],
  "pagination": { ... },
  "meta": {
    "unread_count": 3
  }
}
```

### 15.2 Get Notification

```
GET /notifications/:notification_id
```

**Auth:** Required

**Response:** `200 OK`

### 15.3 Mark Notification as Read

```
POST /notifications/:notification_id/read
```

**Auth:** Required

**Response:** `204 No Content`

### 15.4 Mark All Notifications as Read

```
POST /notifications/read-all
```

**Auth:** Required

**Response:** `204 No Content`

```json
{
  "data": {
    "updated_count": 3
  }
}
```

### 15.5 Delete Notification

```
DELETE /notifications/:notification_id
```

**Auth:** Required

**Response:** `204 No Content`

### 15.6 Get Notification Preferences

```
GET /notifications/preferences
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "channels": {
      "push": true,
      "email": true,
      "in_app": true
    },
    "types": {
      "enquiry_reply": { "push": true, "email": true },
      "task_reminder": { "push": true, "email": false },
      "vendor_update": { "push": false, "email": true },
      "marketing": { "push": false, "email": false }
    }
  }
}
```

### 15.7 Update Notification Preferences

```
PATCH /notifications/preferences
```

**Auth:** Required

**Body:** Partial update of preferences (deep merge).

**Response:** `200 OK`

---

## 16. Uploads

> Rate limit tier: **Heavy** (30 req/min)

### 16.1 Get Presigned Upload URL

```
POST /uploads/presign
```

**Auth:** Required

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `filename` | string | ✓ | Max 255 chars |
| `content_type` | string | ✓ | MIME type |
| `size_bytes` | integer | ✓ | Max 50 MB |
| `purpose` | enum | ✓ | `avatar` \| `message_attachment` \| `homepage_photo` \| `vendor_image` |

**Response:** `200 OK`

```json
{
  "data": {
    "upload_id": "uuid",
    "presigned_url": "https://storage.bridebook.de/...",
    "method": "PUT",
    "headers": {
      "Content-Type": "image/jpeg",
      "x-amz-meta-upload-id": "uuid"
    },
    "expires_at": "2026-01-15T11:00:00Z"
  }
}
```

### 16.2 Confirm Upload

```
POST /uploads/:upload_id/confirm
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "upload_id": "uuid",
    "url": "https://cdn.bridebook.de/...",
    "status": "confirmed",
    "content_type": "image/jpeg",
    "size_bytes": 245000
  }
}
```

### 16.3 Get Upload Status

```
GET /uploads/:upload_id
```

**Auth:** Required

**Response:** `200 OK`

### 16.4 Delete Upload

```
DELETE /uploads/:upload_id
```

**Auth:** Required

**Response:** `204 No Content`

Removes the file from storage.

---

## 17. Search

> Rate limit tier: **Relaxed** (120 req/min)

### 17.1 Global Search

```
GET /search
```

**Auth:** Optional

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| `q` | string | ✓ |
| `type` | enum | — | `vendors` \| `articles` \| `categories` |
| `limit` | integer | — | Default 10 |

**Response:** `200 OK`

```json
{
  "data": {
    "vendors": [
      {
        "id": "uuid",
        "business_name": "Schloss Biebrich",
        "category": "Locations",
        "city": "Wiesbaden",
        "cover_image_url": "...",
        "avg_rating": 4.7
      }
    ],
    "articles": [
      {
        "id": "uuid",
        "title": "Schloss-Hochzeiten in Hessen",
        "slug": "schloss-hochzeiten-hessen"
      }
    ],
    "categories": [
      {
        "id": "uuid",
        "name": "Locations",
        "slug": "locations"
      }
    ]
  }
}
```

### 17.2 Autocomplete / Suggestions

```
GET /search/suggest
```

**Auth:** Optional

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| `q` | string | ✓ |
| `limit` | integer | — | Default 5 |

**Response:** `200 OK`

```json
{
  "data": [
    { "type": "vendor", "text": "Schloss Biebrich", "slug": "schloss-biebrich" },
    { "type": "category", "text": "Locations", "slug": "locations" },
    { "type": "city", "text": "Wiesbaden", "slug": "wiesbaden" }
  ]
}
```

### 17.3 Recent Searches

```
GET /search/recent
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": [
    {
      "query": "Locations Wiesbaden",
      "searched_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

## 18. Analytics

> Rate limit tier: **Standard** (60 req/min)

### 18.1 Budget Stats

```
GET /weddings/:wedding_id/analytics/budget
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "total_budget": 25000,
    "total_spent": 8200,
    "total_remaining": 16800,
    "percentage_spent": 32.8,
    "by_category": [
      {
        "name": "Hochzeitslocation",
        "estimated": 7500,
        "actual": 7200,
        "percentage_of_total": 30
      }
    ],
    "monthly_spending": [
      { "month": "2026-01", "amount": 3600 },
      { "month": "2026-02", "amount": 4600 }
    ]
  }
}
```

### 18.2 Guest RSVP Stats

```
GET /weddings/:wedding_id/analytics/guests
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "total_invited": 120,
    "accepted": 85,
    "declined": 10,
    "maybe": 8,
    "pending": 17,
    "plus_ones": 30,
    "children": 5,
    "total_attending": 120,
    "response_rate": 85.8,
    "by_group": [
      {
        "group_name": "Els Gäste",
        "invited": 45,
        "accepted": 38,
        "declined": 3,
        "pending": 4
      }
    ],
    "dietary_summary": {
      "vegetarisch": 12,
      "vegan": 5,
      "glutenfrei": 3,
      "keine_angabe": 100
    }
  }
}
```

### 18.3 Task Completion Stats

```
GET /weddings/:wedding_id/analytics/tasks
```

**Auth:** Required (wedding member)

**Response:** `200 OK`

```json
{
  "data": {
    "total": 41,
    "done": 12,
    "in_progress": 3,
    "todo": 24,
    "skipped": 2,
    "completion_percentage": 29.3,
    "overdue": 5,
    "by_month": [
      {
        "months_before": 12,
        "label": "12 Monate vorher",
        "total": 8,
        "done": 6
      }
    ]
  }
}
```

### 18.4 Vendor View Tracking

```
POST /vendors/:vendor_id/track
```

**Auth:** Optional

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `event` | enum | ✓ | `view` \| `phone_click` \| `website_click` \| `enquiry_click` |
| `wedding_id` | uuid | — |
| `source` | string | — | `search` \| `favorites` \| `category` \| `direct` |

**Response:** `204 No Content`

---

## 19. Export

> Rate limit tier: **Heavy** (30 req/min)

### 19.1 Export Guest List (CSV)

```
POST /weddings/:wedding_id/export/guests
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `format` | enum | ✓ | `csv` |
| `filters` | object | — | Same filter params as guest list |
| `columns` | string[] | — | Specific columns to include |

**Response:** `202 Accepted`

```json
{
  "data": {
    "export_id": "uuid",
    "status": "processing",
    "download_url": null
  }
}
```

Poll `GET /exports/:export_id` for completion, or receive notification.

### 19.2 Export Budget (PDF/CSV)

```
POST /weddings/:wedding_id/export/budget
```

**Auth:** Required (wedding member)

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `format` | enum | ✓ | `pdf` \| `csv` |

**Response:** `202 Accepted` — Same async pattern.

### 19.3 Export All User Data (GDPR)

```
POST /users/me/export
```

**Auth:** Required

**Response:** `202 Accepted`

```json
{
  "data": {
    "export_id": "uuid",
    "status": "processing",
    "estimated_size_mb": 45,
    "download_url": null,
    "expires_at": null
  }
}
```

Generates a ZIP containing:
- `profile.json` — User profile data
- `weddings.json` — All wedding data
- `guests.json` — Guest lists
- `budget.json` — Budget data
- `tasks.json` — Task lists
- `messages.json` — All message history
- `favorites.json` — Saved vendors
- `enquiries.json` — All enquiries
- `homepage.json` — Wedding homepage data
- `photos/` — All uploaded images

Download link sent via email. Expires after 72 hours. GDPR Art. 20 compliant.

### 19.4 Get Export Status

```
GET /exports/:export_id
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "data": {
    "export_id": "uuid",
    "status": "completed",
    "download_url": "https://cdn.bridebook.de/exports/...",
    "expires_at": "2026-01-18T10:30:00Z",
    "size_bytes": 47185920
  }
}
```

---

## 20. Webhooks

> Outbound webhooks for platform integrations

### 20.1 Stripe Payment Events

```
POST {your_endpoint}
```

**Headers:**

```
Content-Type: application/json
X-Bridebook-Signature: sha256=abc123...
X-Bridebook-Event: payment.completed
X-Bridebook-Delivery: uuid
```

**Payload:**

```json
{
  "event": "payment.completed",
  "timestamp": "2026-01-15T10:30:00Z",
  "data": {
    "payment_id": "uuid",
    "amount": 5000,
    "currency": "EUR",
    "method": "credit_card",
    "vendor_id": "uuid",
    "wedding_id": "uuid",
    "budget_item_id": "uuid"
  }
}
```

**Events:**
- `payment.completed`
- `payment.failed`
- `payment.refunded`
- `subscription.created`
- `subscription.cancelled`

### 20.2 Email Delivery Status

```json
{
  "event": "email.delivered",
  "timestamp": "2026-01-15T10:30:00Z",
  "data": {
    "email_log_id": "uuid",
    "recipient": "user@example.com",
    "template": "enquiry_confirmation",
    "status": "delivered"
  }
}
```

**Events:**
- `email.delivered`
- `email.bounced`
- `email.failed`

### 20.3 Webhook Verification

All webhooks are signed with HMAC-SHA256. Verify by computing:

```
signature = HMAC-SHA256(webhook_secret, request_body)
```

Compare with `X-Bridebook-Signature` header value (after `sha256=` prefix).

**Retry policy:** 3 attempts with exponential backoff (1min, 5min, 30min). Expected response: `2xx` within 10 seconds.

---

## 21. Real-Time / WebSocket

> Connection: `wss://ws.bridebook.de/v1`

### 21.1 Connection Protocol

```
wss://ws.bridebook.de/v1?token=<jwt_access_token>
```

**Heartbeat:** Client sends `ping` every 30 seconds, server responds `pong`. Disconnect after 90 seconds without heartbeat.

**Reconnection:** Exponential backoff starting at 1 second, max 30 seconds. Resume with `last_event_id` to catch up on missed events.

### 21.2 Message Notifications

**Server → Client:**

```json
{
  "type": "message.new",
  "data": {
    "enquiry_id": "uuid",
    "message": {
      "id": "uuid",
      "sender_id": "uuid",
      "sender_type": "vendor",
      "content": "Vielen Dank für Ihre Anfrage...",
      "created_at": "2026-01-16T09:00:00Z"
    }
  },
  "event_id": "evt_abc123"
}
```

### 21.3 Typing Indicators

**Client → Server:**

```json
{
  "type": "typing.start",
  "data": {
    "enquiry_id": "uuid"
  }
}
```

**Server → Client (broadcast to other participants):**

```json
{
  "type": "typing.indicator",
  "data": {
    "enquiry_id": "uuid",
    "user_id": "uuid",
    "is_typing": true
  }
}
```

Typing indicator auto-expires after 5 seconds without refresh.

### 21.4 Notification Events

**Server → Client:**

```json
{
  "type": "notification.new",
  "data": {
    "id": "uuid",
    "type": "enquiry_reply",
    "title": "Neue Nachricht von Schloss Biebrich",
    "body": "...",
    "action_url": "/nachrichten/uuid"
  },
  "event_id": "evt_def456"
}
```

### 21.5 Event Types Summary

| Event | Direction | Description |
|-------|-----------|-------------|
| `message.new` | Server → Client | New message in conversation |
| `message.read` | Server → Client | Messages marked as read |
| `typing.start` | Client → Server | User started typing |
| `typing.stop` | Client → Server | User stopped typing |
| `typing.indicator` | Server → Client | Typing indicator broadcast |
| `notification.new` | Server → Client | New notification |
| `notification.read` | Server → Client | Notification marked read |
| `enquiry.status` | Server → Client | Enquiry status changed |
| `guest.rsvp` | Server → Client | Guest RSVP submitted |

---

## Appendix A: Endpoint Summary

| # | Method | Path | Auth | Rate Tier |
|---|--------|------|------|-----------|
| 1 | POST | `/auth/register` | — | Strict |
| 2 | POST | `/auth/login` | — | Strict |
| 3 | POST | `/auth/oauth` | — | Strict |
| 4 | POST | `/auth/refresh` | — | Strict |
| 5 | POST | `/auth/logout` | ✓ | Strict |
| 6 | POST | `/auth/password-reset` | — | Strict |
| 7 | POST | `/auth/password-reset/confirm` | — | Strict |
| 8 | POST | `/auth/email/verify` | — | Strict |
| 9 | POST | `/auth/email/resend` | ✓ | Strict |
| 10 | GET | `/auth/session` | ✓ | Strict |
| 11 | GET | `/users/me` | ✓ | Standard |
| 12 | PATCH | `/users/me` | ✓ | Standard |
| 13 | POST | `/users/me/avatar` | ✓ | Standard |
| 14 | DELETE | `/users/me/avatar` | ✓ | Standard |
| 15 | GET | `/users/me/preferences` | ✓ | Standard |
| 16 | PATCH | `/users/me/preferences` | ✓ | Standard |
| 17 | DELETE | `/users/me` | ✓ | Standard |
| 18 | GET | `/weddings` | ✓ | Standard |
| 19 | POST | `/weddings` | ✓ | Standard |
| 20 | GET | `/weddings/:id` | ✓ | Standard |
| 21 | PATCH | `/weddings/:id` | ✓ | Standard |
| 22 | DELETE | `/weddings/:id` | ✓ | Standard |
| 23 | GET | `/weddings/:id/settings` | ✓ | Standard |
| 24 | PATCH | `/weddings/:id/settings` | ✓ | Standard |
| 25 | POST | `/weddings/:id/team` | ✓ | Standard |
| 26 | GET | `/weddings/:id/team` | ✓ | Standard |
| 27 | DELETE | `/weddings/:id/team/:mid` | ✓ | Standard |
| 28 | GET | `/vendors` | — | Relaxed |
| 29 | GET | `/vendors/:id` | — | Standard |
| 30 | GET | `/vendors/:id/availability` | — | Standard |
| 31 | GET | `/vendors/:id/reviews` | — | Standard |
| 32 | POST | `/vendors/:id/reviews` | ✓ | Standard |
| 33 | PATCH | `/vendors/:id/reviews/:rid` | ✓ | Standard |
| 34 | DELETE | `/vendors/:id/reviews/:rid` | ✓ | Standard |
| 35 | GET | `/categories` | — | Relaxed |
| 36 | GET | `/categories/:slug` | — | Relaxed |
| 37 | GET | `/regions` | — | Relaxed |
| 38 | GET | `/regions/:slug/cities` | — | Relaxed |
| 39 | GET | `/cities/:slug` | — | Relaxed |
| 40 | GET | `/articles` | — | Relaxed |
| 41 | GET | `/articles/:slug` | — | Relaxed |
| 42 | GET | `/articles/search` | — | Relaxed |
| 43 | POST | `/articles/:id/views` | — | Relaxed |
| 44 | GET | `/weddings/:id/favorites` | ✓ | Standard |
| 45 | POST | `/weddings/:id/favorites` | ✓ | Standard |
| 46 | PATCH | `/weddings/:id/favorites/:fid` | ✓ | Standard |
| 47 | DELETE | `/weddings/:id/favorites/:fid` | ✓ | Standard |
| 48 | POST | `/weddings/:id/enquiries` | ✓ | Standard |
| 49 | GET | `/weddings/:id/enquiries` | ✓ | Standard |
| 50 | GET | `/weddings/:id/enquiries/:eid` | ✓ | Standard |
| 51 | PATCH | `/weddings/:id/enquiries/:eid` | ✓ | Standard |
| 52 | POST | `/weddings/:id/enquiries/:eid/archive` | ✓ | Standard |
| 53 | GET | `/weddings/:id/messages` | ✓ | Standard |
| 54 | GET | `/weddings/:id/messages/:eid` | ✓ | Standard |
| 55 | POST | `/weddings/:id/messages/:eid` | ✓ | Standard |
| 56 | POST | `/weddings/:id/messages/:eid/read` | ✓ | Standard |
| 57 | POST | `/weddings/:id/messages/:eid/archive` | ✓ | Standard |
| 58 | POST | `/weddings/:id/messages/:eid/unarchive` | ✓ | Standard |
| 59 | GET | `/weddings/:id/tasks` | ✓ | Standard |
| 60 | POST | `/weddings/:id/tasks` | ✓ | Standard |
| 61 | PATCH | `/weddings/:id/tasks/:tid` | ✓ | Standard |
| 62 | DELETE | `/weddings/:id/tasks/:tid` | ✓ | Standard |
| 63 | PATCH | `/weddings/:id/tasks/bulk` | ✓ | Heavy |
| 64 | GET | `/task-templates` | ✓ | Standard |
| 65 | POST | `/weddings/:id/tasks/from-template` | ✓ | Standard |
| 66 | POST | `/weddings/:id/budget/calculate` | ✓ | Standard |
| 67 | GET | `/weddings/:id/budget` | ✓ | Standard |
| 68 | GET | `/weddings/:id/budget/categories` | ✓ | Standard |
| 69 | POST | `/weddings/:id/budget/categories` | ✓ | Standard |
| 70 | PATCH | `/weddings/:id/budget/categories/:cid` | ✓ | Standard |
| 71 | DELETE | `/weddings/:id/budget/categories/:cid` | ✓ | Standard |
| 72 | GET | `/weddings/:id/budget/categories/:cid/items` | ✓ | Standard |
| 73 | POST | `/weddings/:id/budget/categories/:cid/items` | ✓ | Standard |
| 74 | PATCH | `/weddings/:id/budget/categories/:cid/items/:iid` | ✓ | Standard |
| 75 | DELETE | `/weddings/:id/budget/categories/:cid/items/:iid` | ✓ | Standard |
| 76 | POST | `/weddings/:id/budget/reset` | ✓ | Standard |
| 77 | GET | `/weddings/:id/guests` | ✓ | Standard |
| 78 | POST | `/weddings/:id/guests` | ✓ | Standard |
| 79 | POST | `/weddings/:id/guests/import` | ✓ | Heavy |
| 80 | PATCH | `/weddings/:id/guests/:gid` | ✓ | Standard |
| 81 | DELETE | `/weddings/:id/guests/:gid` | ✓ | Standard |
| 82 | GET | `/weddings/:id/guest-groups` | ✓ | Standard |
| 83 | POST | `/weddings/:id/guest-groups` | ✓ | Standard |
| 84 | PATCH | `/weddings/:id/guest-groups/:gid` | ✓ | Standard |
| 85 | DELETE | `/weddings/:id/guest-groups/:gid` | ✓ | Standard |
| 86 | POST | `/weddings/:id/rsvp` | — | Standard |
| 87 | GET | `/weddings/:id/homepage` | ✓ | Standard |
| 88 | GET | `/wedding-homepage/:slug` | — | Relaxed |
| 89 | POST | `/weddings/:id/homepage` | ✓ | Standard |
| 90 | PATCH | `/weddings/:id/homepage/content` | ✓ | Standard |
| 91 | PATCH | `/weddings/:id/homepage/design` | ✓ | Standard |
| 92 | PATCH | `/weddings/:id/homepage/settings` | ✓ | Standard |
| 93 | POST | `/weddings/:id/homepage/photos` | ✓ | Heavy |
| 94 | DELETE | `/weddings/:id/homepage/photos/:pid` | ✓ | Standard |
| 95 | POST | `/weddings/:id/homepage/publish` | ✓ | Standard |
| 96 | POST | `/weddings/:id/homepage/unpublish` | ✓ | Standard |
| 97 | DELETE | `/weddings/:id/homepage` | ✓ | Standard |
| 98 | GET | `/notifications` | ✓ | Relaxed |
| 99 | GET | `/notifications/:id` | ✓ | Relaxed |
| 100 | POST | `/notifications/:id/read` | ✓ | Relaxed |
| 101 | POST | `/notifications/read-all` | ✓ | Relaxed |
| 102 | DELETE | `/notifications/:id` | ✓ | Relaxed |
| 103 | GET | `/notifications/preferences` | ✓ | Relaxed |
| 104 | PATCH | `/notifications/preferences` | ✓ | Relaxed |
| 105 | POST | `/uploads/presign` | ✓ | Heavy |
| 106 | POST | `/uploads/:id/confirm` | ✓ | Heavy |
| 107 | GET | `/uploads/:id` | ✓ | Heavy |
| 108 | DELETE | `/uploads/:id` | ✓ | Heavy |
| 109 | GET | `/search` | — | Relaxed |
| 110 | GET | `/search/suggest` | — | Relaxed |
| 111 | GET | `/search/recent` | ✓ | Relaxed |
| 112 | GET | `/weddings/:id/analytics/budget` | ✓ | Standard |
| 113 | GET | `/weddings/:id/analytics/guests` | ✓ | Standard |
| 114 | GET | `/weddings/:id/analytics/tasks` | ✓ | Standard |
| 115 | POST | `/vendors/:id/track` | — | Relaxed |
| 116 | POST | `/weddings/:id/export/guests` | ✓ | Heavy |
| 117 | POST | `/weddings/:id/export/budget` | ✓ | Heavy |
| 118 | POST | `/users/me/export` | ✓ | Heavy |
| 119 | GET | `/exports/:id` | ✓ | Standard |

**Total: 119 REST endpoints + WebSocket connection + 3 webhook event groups**

---

## Appendix B: Cross-Reference Matrix

| API Section | Database Tables | Forms (08) | Routes (07) |
|-------------|----------------|------------|-------------|
| Auth | `users`, `user_sessions`, `password_resets` | §1 Login/Register | `/login`, `/register` |
| Users | `users` | §9 Settings | `/einstellungen` |
| Weddings | `weddings`, `wedding_settings` | §6 Wedding Details | `/hochzeitsdetails` |
| Vendors | `vendors`, `vendor_images`, `vendor_packages`, `vendor_availability`, `reviews` | §5 Search/Filters, §3 Enquiry | `/locations/*`, `/fotografen/*` |
| Categories | `categories`, `subcategories` | — | `/categories/*` |
| Geography | `regions`, `cities` | §5 Location filter | — |
| Articles | — | — | `/ratgeber/*` |
| Favorites | `favorites` | — | `/favoriten` |
| Enquiries | `enquiries` | §3 Enquiry form | `/nachrichten` |
| Messages | `messages`, `message_attachments` | — | `/nachrichten/:id` |
| Tasks | `tasks`, `task_templates` | — | `/planungs-tools/aufgaben` |
| Budget | `budget_categories`, `budget_items`, `payments` | §2 Budget Calculator | `/planungs-tools/budget` |
| Guests | `guests`, `guest_groups`, `seating_tables`, `seating_assignments` | §4 Guest forms | `/planungs-tools/gaeste` |
| Homepage | — | §7 Homepage forms | `/hochzeitshomepage` |
| Notifications | `notifications`, `email_logs` | — | — |

---

*Generated from 61 screenshots and docs 01–09. Cross-referenced with [01-DATABASE-SCHEMA.md](./01-DATABASE-SCHEMA.md), [07-SITEMAP-NAVIGATION.md](./07-SITEMAP-NAVIGATION.md), [08-FORMS-ANALYSIS.md](./08-FORMS-ANALYSIS.md), and [09-SETTINGS-PAGES.md](./09-SETTINGS-PAGES.md).*



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 11                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-11--RESPONSIVE-DESIGN"></a>

### Doc 11 — RESPONSIVE DESIGN

> Source: `docs/11-RESPONSIVE-DESIGN.md` ·      938 lines

# Responsive Design Specification — Bridebook

> Based on analysis of 61 desktop screenshots (~1200–1440px viewports).
> Mobile and tablet behaviors are **inferred and recommended** — no mobile screenshots exist.
> All Tailwind classes reference tokens from [05-DESIGN-TOKENS.md](./05-DESIGN-TOKENS.md).
> Component responsive notes from [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md).

---

## Table of Contents

1. [Breakpoint System](#1-breakpoint-system)
2. [Layout Grid & Containers](#2-layout-grid--containers)
3. [Navigation Patterns](#3-navigation-patterns)
4. [Typography Scaling](#4-typography-scaling)
5. [Component Adaptations](#5-component-adaptations)
6. [Image & Media Handling](#6-image--media-handling)
7. [Touch Target & Interaction](#7-touch-target--interaction)
8. [Spacing & Density](#8-spacing--density)
9. [Page-Specific Breakdowns](#9-page-specific-breakdowns)
10. [Map Behavior](#10-map-behavior)
11. [Data Table Patterns](#11-data-table-patterns)
12. [Sticky Elements](#12-sticky-elements)
13. [Orientation Handling](#13-orientation-handling)
14. [Print Styles](#14-print-styles)
15. [Mobile Performance](#15-mobile-performance)
16. [CSS Strategy](#16-css-strategy)

---

## 1. Breakpoint System

From `05-DESIGN-TOKENS.md` § Breakpoints:

| Token | Width | Tailwind Prefix | Target |
|-------|-------|-----------------|--------|
| `screen-sm` | 640px | `sm:` | Mobile landscape |
| `screen-md` | 768px | `md:` | Tablet portrait |
| `screen-lg` | 1024px | `lg:` | Desktop |
| `screen-xl` | 1280px | `xl:` | Large desktop |
| `screen-2xl` | 1536px | `2xl:` | Ultra-wide |

### Design Targets (4 primary)

| Device | Width | Columns | Container Max |
|--------|-------|---------|---------------|
| Mobile portrait | 375px | 4 | 100% (16px padding) |
| Tablet portrait | 768px | 8 | `container-md` (768px) |
| Desktop | 1200px | 12 | `container-xl` (1200px) |
| Large desktop | 1440px+ | 12 | `container-2xl` (1400px) |

### Approach: Mobile-First

All base styles target mobile (< 640px). Progressive enhancement via `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes.

```css
/* Base = mobile, then scale up */
.card-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5;
}
```

---

## 2. Layout Grid & Containers

### Container Strategy

```html
<div class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-container-xl 2xl:max-w-container-2xl">
  <!-- page content -->
</div>
```

| Breakpoint | Side Padding | Max Width |
|------------|-------------|-----------|
| < 640px | 16px (`px-4`) | 100% |
| 640–767px | 24px (`sm:px-6`) | 100% |
| 768–1023px | 24px (`md:px-6`) | 768px |
| 1024–1279px | 32px (`lg:px-8`) | 1200px |
| 1280+ | 32px (`xl:px-8`) | 1200px |
| 1536+ | 32px | 1400px |

### Column Grid

```html
<div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-6">
```

| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| Mobile | 4 | 16px (`gap-4`) |
| Tablet | 8 | 16px (`gap-4`) |
| Desktop | 12 | 24px (`lg:gap-6`) |

### Common Layout Patterns

**Full-width with sidebar (desktop):**
```html
<div class="flex flex-col lg:flex-row">
  <aside class="w-full lg:w-[280px] lg:flex-shrink-0"><!-- sidebar --></aside>
  <main class="flex-1 min-w-0"><!-- content --></main>
</div>
```

**Split layout (search results + map):**
```html
<div class="relative lg:flex lg:h-[calc(100vh-64px)]">
  <div class="w-full lg:w-1/2 xl:w-[55%] overflow-y-auto"><!-- results --></div>
  <div class="hidden lg:block lg:w-1/2 xl:w-[45%] sticky top-16"><!-- map --></div>
</div>
```

---

## 3. Navigation Patterns

### 3.1 Header / Navbar

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Logo + hamburger menu icon. Nav links hidden. Icons (heart, envelope) collapse into hamburger. Height: 56px. |
| 768–1023px | Logo + condensed nav links (text only, no icons beside them). Icon actions visible. Height: 56px. |
| 1024+ | Full nav: Logo, text links (Locations & Dienstleister, Planungs-Tools, Inspiration, Hochzeitshomepage), icon actions (envelope, heart, gear), avatar. Height: 64px. |

```html
<header class="sticky top-0 z-sticky h-14 lg:h-16 bg-bg-nav">
  <div class="flex items-center justify-between px-4 lg:px-8 h-full max-w-container-2xl mx-auto">
    <a href="/"><!-- Logo --></a>
    <nav class="hidden md:flex items-center gap-6"><!-- links --></nav>
    <div class="hidden md:flex items-center gap-3"><!-- icon actions --></div>
    <button class="md:hidden" aria-label="Menu"><!-- hamburger --></button>
  </div>
</header>
```

**Mobile menu (< 768px):** Full-screen overlay slide-in from right. `z-modal` (50). Close via X button or backdrop tap.

### 3.2 Tab Bar

| Breakpoint | Behavior |
|------------|----------|
| < 640px | Horizontally scrollable, no wrapping. Fade edges on overflow. `overflow-x-auto scrollbar-hide`. |
| 640+ | Static horizontal row, centered or left-aligned. No scroll needed. |

```html
<div class="flex overflow-x-auto sm:overflow-visible scrollbar-hide gap-6 sm:gap-8 border-b border-default">
  <!-- tab items -->
</div>
```

### 3.3 Sidebar Navigation

| Breakpoint | Behavior |
|------------|----------|
| < 1024px | Converts to horizontal scrollable tab bar at top of page. |
| 1024+ | Fixed left sidebar, 280px wide. |

### 3.4 Footer

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Single column, accordion-collapsible sections. App badges stacked. QR code hidden. |
| 768–1023px | 2-column grid. App badges inline. |
| 1024+ | 4-column grid as observed in screenshots. QR code visible. |

```html
<footer class="bg-gray-50 py-12 lg:py-16">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-container-xl mx-auto px-4 lg:px-8">
```

---

## 4. Typography Scaling

Fluid type scaling is not observed; use step-down at breakpoints instead.

### Heading Scale

| Element | Mobile (< 768px) | Tablet (768px) | Desktop (1024+) | Tailwind |
|---------|-------------------|----------------|-----------------|----------|
| h1 (hero) | 28px | 36px | 48px | `text-3xl md:text-4xl lg:text-5xl` |
| h2 (page title) | 22px | 26px | 32px | `text-2xl md:text-[26px] lg:text-3xl` |
| h3 (section) | 18px | 20px | 24px | `text-xl md:text-xl lg:text-2xl` |
| h4 (sub-section) | 16px | 18px | 20px | `text-lg lg:text-xl` |
| Body | 14px | 14px | 14–15px | `text-base` |
| Caption | 12px | 12px | 12px | `text-sm` |

### Font Family

No change across breakpoints. Sans (`Inter`) for UI, serif (`Playfair Display`) for display headings.

### Line Length

Constrain body text to `max-w-prose` (~65ch) on wide screens for readability:

```html
<p class="text-base leading-normal max-w-prose">...</p>
```

---

## 5. Component Adaptations

### 5.1 Venue Card Grid

| Breakpoint | Columns | Card Image Ratio |
|------------|---------|-----------------|
| < 640px | 1 | 16:9 |
| 640–1023px | 2 | 4:3 |
| 1024+ | 2 (with map) or 3 (no map) | 4:3 |

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-5">
```

### 5.2 Feature Cards (Dashboard)

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 (stacked) |
| 640–1023px | 2 |
| 1024+ | 4 |

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
```

### 5.3 Promo Cards

| Breakpoint | Layout |
|------------|--------|
| < 640px | Full-width stacked, 16:9 ratio |
| 640–1023px | 2-column grid |
| 1024+ | 3-column grid or carousel with arrows |

### 5.4 Filter Bar

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Collapsed behind "Filter" button. Opens as bottom sheet overlay. Chips scrollable. Result count badge at top. |
| 768–1023px | Horizontally scrollable chip row. Overflow fades. |
| 1024+ | Full sticky bar below header. All filter dropdowns visible inline. |

```html
<!-- Mobile: filter trigger -->
<button class="md:hidden flex items-center gap-2 px-4 py-2 rounded-pill border border-default">
  <FilterIcon class="w-5 h-5" /> Filter
</button>

<!-- Desktop: inline filter bar -->
<div class="hidden md:flex items-center gap-3 overflow-x-auto py-3 sticky top-14 lg:top-16 z-sticky bg-bg-page border-b border-default">
```

### 5.5 Modals / Dialogs

| Breakpoint | Behavior |
|------------|----------|
| < 640px | Full-screen sheet sliding up from bottom. `rounded-t-xl`. No backdrop visible. |
| 640–1023px | Centered dialog, `max-w-container-sm` (640px). |
| 1024+ | Centered dialog, size per prop (`sm`/`md`/`lg`). |

```html
<div class="fixed inset-0 sm:flex sm:items-center sm:justify-center z-modal">
  <div class="h-full sm:h-auto sm:max-h-[85vh] w-full sm:max-w-container-sm sm:rounded-xl rounded-t-xl bg-bg-card overflow-y-auto">
```

### 5.6 Carousel / Slider

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Free scroll (touch swipe). No arrows. Dot pagination below. Peek next card by 20px. |
| 768+ | Arrow navigation visible on hover. Dot or arrow pagination. `slidesPerView` as specified. |

### 5.7 Image Gallery

| Breakpoint | Columns |
|------------|---------|
| < 640px | 2 columns, `+N more` overlay on 4th image |
| 640–1023px | 3 columns |
| 1024+ | 3–4 columns as observed |

Lightbox: Full-screen on all breakpoints. Swipe gestures on touch devices, arrow keys on desktop.

### 5.8 Accordion

No significant change. Full-width on all breakpoints. Touch targets 48px minimum height on mobile.

### 5.9 Dreamteam Cards

Horizontal scroll carousel on all breakpoints (as noted in 03-UI-COMPONENTS.md). On desktop, arrows are visible alongside.

### 5.10 Device Preview (Homepage Editor)

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Preview hidden or simplified. Editor takes full width. Toggle to preview mode replaces editor. |
| 768–1023px | Stacked: editor on top, preview below at ~375px width centered. |
| 1024+ | Side-by-side: editor left, preview right with device frame toggle. |

---

## 6. Image & Media Handling

### Responsive Images

```html
<img
  src="venue-800.jpg"
  srcset="venue-400.jpg 400w, venue-800.jpg 800w, venue-1200.jpg 1200w"
  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
  alt="Venue name"
  class="w-full h-auto object-cover aspect-card rounded-lg"
  loading="lazy"
/>
```

### Aspect Ratios by Context

| Context | Mobile | Tablet | Desktop | Token |
|---------|--------|--------|---------|-------|
| Hero banner | 4:3 | 16:9 | 21:9 | `aspect-card` → `md:aspect-landscape` → `lg:aspect-wide` |
| Venue card | 16:9 | 4:3 | 4:3 | `aspect-landscape sm:aspect-card` |
| Promo card | 16:9 | 4:3 | 4:3 | `aspect-landscape sm:aspect-card` |
| Avatar | 1:1 | 1:1 | 1:1 | `aspect-square` |
| Vendor profile | 3:4 | 3:4 | 3:4 | `aspect-portrait` |

### Image Sizes by Breakpoint

| Breakpoint | Venue Card Thumb | Hero Image | Avatar |
|------------|-----------------|------------|--------|
| < 640px | 400px wide | 640px wide | 32–40px |
| 640–1023px | 400px wide | 1024px wide | 40px |
| 1024+ | 400px wide | 1440px wide | 40–48px |

---

## 7. Touch Target & Interaction

### Minimum Touch Targets

Per WCAG 2.5.8 and Apple HIG:

| Element | Minimum Size | Tailwind |
|---------|-------------|----------|
| Buttons | 44×44px | `min-h-[44px] min-w-[44px]` |
| Icon buttons | 44×44px (with padding) | `p-2.5` around 20px icon |
| Checkboxes | 44×44px tap area | `w-5 h-5` visual + padding |
| Links (inline) | 44px row height | `py-3` on list items |
| Nav items | 48px row height | `py-3 px-4` |

### Hover vs Touch

| Interaction | Desktop (hover) | Mobile (touch) |
|-------------|-----------------|----------------|
| Venue card heart | Appears on hover | Always visible |
| Carousel arrows | Visible on hover | Hidden (swipe) |
| Filter dropdown | Hover to open | Tap to open |
| Tooltip | Hover with 300ms delay | Long-press or hidden |
| Image gallery "+N" | Visible always | Visible always |

```css
/* Show heart icon on hover (desktop) or always (touch) */
.venue-card .heart-icon {
  @apply opacity-0 lg:group-hover:opacity-100;
  /* On touch devices, always show */
  @apply max-lg:opacity-100;
}
```

### Swipe Gestures (Mobile)

| Component | Gesture |
|-----------|---------|
| Carousel | Horizontal swipe |
| Lightbox | Horizontal swipe (prev/next), vertical swipe down (close) |
| Bottom sheet | Swipe down to dismiss |
| Guest list item | Swipe left for delete action |

---

## 8. Spacing & Density

### Section Spacing

| Context | Mobile | Tablet | Desktop | Tailwind |
|---------|--------|--------|---------|----------|
| Page top padding | 24px | 32px | 48px | `pt-6 md:pt-8 lg:pt-12` |
| Between sections | 32px | 40px | 48px | `mt-8 md:mt-10 lg:mt-12` |
| Card grid gap | 16px | 16px | 20px | `gap-4 lg:gap-5` |
| Card internal padding | 12px | 16px | 16–24px | `p-3 sm:p-4 lg:p-6` |
| Form field gap | 16px | 20px | 24px | `space-y-4 md:space-y-5 lg:space-y-6` |

### Density Modes

Mobile uses tighter spacing to maximize content visibility. Desktop has more breathing room.

| Token | Mobile Value | Desktop Value |
|-------|-------------|---------------|
| `space-between-cards` | 16px | 20px |
| `section-padding-y` | 24–32px | 32–48px |
| `page-padding-x` | 16px | 32px |

---

## 9. Page-Specific Breakdowns

### 9.1 Landing Page

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero | Full-bleed image, stacked text + search below | Image with overlaid text | Full-width 21:9 hero, centered overlay text + search bar |
| Search bar | Full-width, stacked inputs (category + location + button) | Inline row | Inline row within hero |
| Category chips | 2×3 grid | 3×2 grid | Horizontal row (6 items) |
| Promo cards | 1 column stacked | 2-column grid | 3-column grid |
| "How it works" | Stacked vertically (icon → text) | 2-column | 3-column |
| Testimonials | Carousel (1 per view, dots) | Carousel (2 per view) | 3-column static grid |

### 9.2 Vendor Search / Results

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Filter bar | "Filter" button → bottom sheet | Scrollable chip row | Full inline sticky bar |
| Results grid | 1 column, no map | 2 columns, no map (toggle) | 2 columns + map split view |
| Map | Hidden; "Karte anzeigen" FAB | Toggle button; replaces list | Always visible right panel |
| Sort dropdown | Full-width select | Inline dropdown | Inline dropdown |
| Pagination | Compact (prev/next + current) | Full numbered | Full numbered |

### 9.3 Vendor Detail

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Photo gallery | Horizontal scroll, 1 large + peek | 2-column masonry | 3-column grid + "+N more" |
| Name + rating | Full-width, stacked | Full-width | Left-aligned within container |
| Action buttons | Sticky bottom bar ("Anfrage senden") | Inline row | Inline row right-aligned |
| Tab content | Full-width tabs (scrollable) | Standard tab bar | Standard tab bar |
| Contact form | Full-screen modal | Side panel or modal | Inline sidebar or modal |

### 9.4 Dashboard / Planning Hub

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Countdown | Compact: 2×2 grid (Tage/Std/Min/Sek) | Full horizontal row | Horizontal row with icon |
| Quick actions | Scrollable horizontal row | Scrollable row | Full row, no scroll |
| Feature cards | 1 column stacked | 2 columns | 4 columns |
| Milestones | Horizontal scroll | Horizontal scroll | Full row or scroll |
| Partner invite | Full-width banner | Full-width banner | Full-width banner |

### 9.5 Budget Page

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Stats row | Stacked vertically (3 rows) | Horizontal row | Horizontal row |
| Budget list | Full-width stacked cards | Table-like rows | Full table with columns |
| Category detail | Full-screen sheet | Modal | Inline expand or modal |
| "Add item" | FAB (floating action button) | Inline button | Inline button |

### 9.6 Guest List

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Stats bar | Compact: invited / confirmed / declined | Full horizontal | Full horizontal |
| Guest rows | Swipeable cards (name + status) | Table with key columns | Full table: name, email, RSVP, meal, +1, notes |
| Add guest | Full-screen modal | Modal | Inline row or modal |
| Bulk actions | Bottom action bar | Top action bar | Top action bar |
| Search | Full-width search field | Inline with filters | Inline with filters |

### 9.7 Settings

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Horizontal tabs at top | Horizontal tabs | Left sidebar (280px) |
| Form layout | Single column, full-width inputs | Single column, max 640px | Single column, max 640px |
| Avatar upload | Centered above form | Left of name fields | Left of name fields |
| Save button | Sticky bottom bar | Bottom of form | Bottom of form |

### 9.8 Wedding Homepage Builder

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Editor/Preview | Single view; toggle between edit and preview | Stacked (editor top, preview bottom) | Side-by-side split |
| Theme selector | Horizontal scroll thumbnails | 3-column grid | 4-column grid |
| Font selector | 2-column grid | 3-column grid | 4-column grid |
| Section editor | Full-width accordion | Full-width accordion | Inline form fields |
| Device toggle | Hidden (always mobile-width preview) | Phone/desktop toggle | Phone/desktop toggle with frame |

---

## 10. Map Behavior

### Breakpoint Strategy

| Breakpoint | Map State | Interaction |
|------------|-----------|-------------|
| < 768px | Hidden by default. "Karte anzeigen" FAB at bottom-right. | Tap FAB → fullscreen map overlay with close X. List hidden. |
| 768–1023px | Hidden by default. Toggle button in toolbar. | Tap toggle → map replaces list (not split). |
| 1024+ | Always visible. Right panel, 50% width (or 45% on xl). | Pan, zoom, pin click → highlight in list. |

### Mobile Map Overlay

```html
<!-- FAB -->
<button class="lg:hidden fixed bottom-20 right-4 z-elevated bg-brand-primary text-text-on-primary rounded-pill px-4 py-3 shadow-lg">
  <MapPinIcon class="w-5 h-5 inline mr-2" /> Karte
</button>

<!-- Fullscreen overlay -->
<div class="fixed inset-0 z-modal bg-bg-page">
  <button class="absolute top-4 right-4 z-tooltip"><!-- close --></button>
  <div class="h-full w-full"><!-- map --></div>
  <!-- Optional: bottom card showing selected venue -->
  <div class="absolute bottom-0 left-0 right-0 p-4">
    <VenueCard compact />
  </div>
</div>
```

### Desktop Map

- Sticky to viewport height minus header: `h-[calc(100vh-64px)] sticky top-16`
- Pins use `brand-primary` (#5B4ED1) color
- Selected pin scales up and shows info popup
- List scroll syncs with map viewport (optional)

---

## 11. Data Table Patterns

### Budget Table

| Breakpoint | Rendering |
|------------|-----------|
| < 640px | Stacked cards. Each card: icon + category name (top), estimated vs actual (bottom row). Tap to expand. |
| 640–1023px | Simplified table: Category, Estimated, Actual columns. Icon hidden. |
| 1024+ | Full table: Icon, Category, Estimated, Actual, Difference, Status, Chevron. |

```html
<!-- Mobile: stacked card -->
<div class="sm:hidden p-4 border-b border-default">
  <div class="flex items-center gap-3 mb-2">
    <span><!-- icon --></span>
    <span class="font-semibold text-base">Hochzeitstorte</span>
  </div>
  <div class="flex justify-between text-sm text-text-secondary">
    <span>Geschätzt: €500</span>
    <span class="font-semibold text-text-primary">Kosten: €450</span>
  </div>
</div>

<!-- Desktop: table row -->
<tr class="hidden sm:table-row border-b border-default">
  <td><!-- icon --></td>
  <td>Hochzeitstorte</td>
  <td class="text-text-secondary">€500</td>
  <td class="font-semibold">€450</td>
  <td class="text-semantic-success">-€50</td>
  <td><!-- chevron --></td>
</tr>
```

### Guest List Table

| Breakpoint | Rendering |
|------------|-----------|
| < 640px | Cards with name + status badge. Swipe left for edit/delete. Tap to expand full details. |
| 640–1023px | Table: Name, RSVP Status, +1. Other columns hidden. Horizontal scroll for more. |
| 1024+ | Full table: Name, Email, RSVP, Meal Choice, +1, Table, Notes. |

**Priority columns** (always visible): Name, RSVP Status.

**Secondary columns** (hidden < lg): Email, Meal Choice, Table Assignment, Notes.

```html
<table class="w-full">
  <thead>
    <tr>
      <th>Name</th>
      <th>RSVP</th>
      <th class="hidden sm:table-cell">+1</th>
      <th class="hidden lg:table-cell">E-Mail</th>
      <th class="hidden lg:table-cell">Menü</th>
      <th class="hidden xl:table-cell">Tisch</th>
    </tr>
  </thead>
```

### Checklist Table

| Breakpoint | Rendering |
|------------|-----------|
| < 640px | Simple list: checkbox + task name. Due date below name in smaller text. |
| 640+ | Checkbox + Task + Due Date + Status columns. |

---

## 12. Sticky Elements

### Sticky Behavior by Breakpoint

| Element | Mobile | Tablet | Desktop | Z-Index |
|---------|--------|--------|---------|---------|
| Header/navbar | Sticky `top-0` | Sticky `top-0` | Sticky `top-0` | `z-sticky` (30) |
| Filter bar | Hidden (bottom sheet) | Sticky `top-14` | Sticky `top-16` | `z-sticky` (30) |
| Bottom nav | Fixed `bottom-0` (mobile nav) | Hidden | Hidden | `z-sticky` (30) |
| CTA button (vendor detail) | Sticky `bottom-0` full-width bar | Inline | Inline | `z-elevated` (10) |
| Map panel | N/A (overlay) | N/A | Sticky `top-16` | `z-base` (0) |
| Save button (settings) | Sticky `bottom-0` | Static | Static | `z-elevated` (10) |
| "Back to top" | Fixed `bottom-20 right-4` | Same | Same | `z-elevated` (10) |

### Mobile Bottom Navigation (Optional)

If native app-like navigation is desired:

```html
<nav class="md:hidden fixed bottom-0 inset-x-0 z-sticky bg-bg-card border-t border-default">
  <div class="flex justify-around py-2">
    <a class="flex flex-col items-center gap-1 py-1 text-xs">
      <HomeIcon class="w-6 h-6" />
      <span>Home</span>
    </a>
    <!-- Search, Plan, Favorites, Profile -->
  </div>
</nav>
```

Add `pb-16 md:pb-0` to `<main>` to account for bottom nav height.

### Sticky CTA (Vendor Detail, Mobile)

```html
<div class="md:hidden fixed bottom-0 inset-x-0 z-elevated bg-bg-card border-t border-default p-4">
  <button class="w-full bg-brand-primary text-text-on-primary rounded-pill py-3 font-semibold">
    Anfrage senden
  </button>
</div>
```

---

## 13. Orientation Handling

### Portrait vs Landscape

| Device + Orientation | Behavior |
|---------------------|----------|
| Phone portrait (375×667) | Default mobile layout. Single column. |
| Phone landscape (667×375) | Same as `sm:` breakpoint. 2-column grids possible. Reduce vertical padding. Hide large hero images. |
| Tablet portrait (768×1024) | `md:` breakpoint. Standard tablet layout. |
| Tablet landscape (1024×768) | `lg:` breakpoint. Treated as desktop layout. Sidebar visible. Map split-view active. |

### Landscape-Specific Adjustments

```css
@media (orientation: landscape) and (max-height: 500px) {
  /* Reduce hero height on phone landscape */
  .hero-banner { max-height: 40vh; }
  /* Reduce section spacing */
  .section-gap { @apply my-4; }
}
```

### Tablet Landscape = Desktop

At 1024px viewport width (tablet landscape), all desktop patterns activate: sidebar navigation, split map view, 12-column grid. No special handling needed — breakpoint system handles it naturally.

---

## 14. Print Styles

### General Print Reset

```css
@media print {
  /* Hide non-essential UI */
  header, footer, nav,
  .filter-bar, .map-container,
  .sticky-cta, .fab, .toast,
  button:not(.print-visible) {
    display: none !important;
  }

  /* Reset backgrounds */
  body { background: white !important; color: black !important; }
  * { box-shadow: none !important; }

  /* Prevent page break inside cards */
  .card, .budget-row, .guest-row {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Force single column */
  .grid { display: block !important; }
  .grid > * { margin-bottom: 1rem; }

  /* Show URLs for links */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #555;
  }
}
```

### Budget Report Print

```css
@media print {
  .budget-stats { display: flex !important; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 24px; }
  .budget-table { width: 100%; border-collapse: collapse; }
  .budget-table th, .budget-table td { border-bottom: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  .budget-total { font-weight: bold; border-top: 2px solid #333; }
}
```

### Guest List Print

```css
@media print {
  .guest-table { width: 100%; font-size: 11px; }
  .guest-table th { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; }
  /* Show all columns */
  .guest-table td, .guest-table th { display: table-cell !important; }
  /* Add table number header for seating chart */
  .table-group::before { content: attr(data-table-name); font-weight: bold; font-size: 14px; display: block; margin: 16px 0 8px; }
}
```

### Checklist Print

```css
@media print {
  .checklist-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
  .checklist-checkbox { width: 14px; height: 14px; border: 1.5px solid #333; border-radius: 2px; flex-shrink: 0; }
  .checklist-checkbox.completed::after { content: "✓"; font-size: 10px; display: flex; align-items: center; justify-content: center; }
}
```

---

## 15. Mobile Performance

### Lazy Loading

```html
<!-- Images below the fold -->
<img loading="lazy" decoding="async" src="..." />

<!-- Components below the fold -->
const VenueMap = lazy(() => import('./VenueMap'))
const ImageGallery = lazy(() => import('./ImageGallery'))
```

**Eager load:** Hero image, first 2 venue cards, navigation icons.

**Lazy load:** Map, gallery lightbox, footer, below-fold venue cards, carousel slides beyond viewport.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Image Optimization

| Strategy | Implementation |
|----------|---------------|
| Format | WebP with JPEG fallback via `<picture>` |
| Sizing | `srcset` with 400w, 800w, 1200w variants |
| Thumbnails | 20px blurred placeholder (LQIP) while loading |
| Lazy decode | `decoding="async"` on all images |
| Priority | `fetchpriority="high"` on hero and LCP image |

### Deferred JavaScript

```html
<!-- Critical: auth, nav, core interactivity -->
<script src="core.js"></script>

<!-- Deferred: map, analytics, chat widget -->
<script src="map.js" defer></script>
<script src="analytics.js" defer></script>

<!-- Idle: tooltips, animations, non-essential -->
<script>
  requestIdleCallback(() => import('./tooltips.js'))
</script>
```

### Performance Budget (Mobile)

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total bundle (gzipped) | < 200KB initial |
| Image per card | < 50KB (WebP) |

---

## 16. CSS Strategy

### Mobile-First Approach

All base styles are mobile. Use `sm:`, `md:`, `lg:`, `xl:`, `2xl:` for progressively wider viewports.

```css
/* Mobile base */
.card { @apply p-3 rounded-lg; }

/* Tablet up */
@screen md { .card { @apply p-4; } }

/* Desktop up */
@screen lg { .card { @apply p-6 rounded-xl; } }
```

### Container Queries (Component-Level Responsiveness)

For components that live in variable-width containers (sidebar vs main content), use CSS container queries:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .venue-card { display: grid; grid-template-columns: 200px 1fr; }
}

@container card (max-width: 399px) {
  .venue-card { display: flex; flex-direction: column; }
}
```

**Use cases for container queries:**
- Venue cards in search results (2-col) vs favorites sidebar (1-col)
- Budget line items in full page vs dashboard widget
- Feature cards in 4-col grid vs 2-col grid

### Tailwind Configuration

The breakpoint tokens are already configured in `tailwind.config.js` (see 05-DESIGN-TOKENS.md § 16):

```js
screens: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Ultra-wide
}
```

### Utility Patterns

```html
<!-- Responsive visibility -->
<div class="hidden lg:block">Desktop only</div>
<div class="lg:hidden">Mobile/tablet only</div>

<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row gap-4">

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

<!-- Responsive text alignment -->
<h2 class="text-center lg:text-left">

<!-- Responsive spacing -->
<section class="py-8 md:py-12 lg:py-16">
```

### CSS Layers (Organization)

```css
@layer base {
  /* Reset, typography defaults, focus-visible */
}

@layer components {
  /* .card, .btn, .badge, .modal — reusable patterns */
}

@layer utilities {
  /* .scrollbar-hide, .line-clamp-2, .aspect-card */
}
```

### Key Utilities

```css
/* Hide scrollbar but allow scroll */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Line clamp for card descriptions */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Safe area insets for notched devices */
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-top { padding-top: env(safe-area-inset-top); }
```

---

## Cross-Reference Summary

| Topic | Reference Document |
|-------|-------------------|
| Breakpoint values | [05-DESIGN-TOKENS.md § 6](./05-DESIGN-TOKENS.md#6-breakpoints) |
| Container max-widths | [05-DESIGN-TOKENS.md § 12](./05-DESIGN-TOKENS.md#12-container-max-widths) |
| Spacing scale | [05-DESIGN-TOKENS.md § 3](./05-DESIGN-TOKENS.md#3-spacing) |
| Typography scale | [05-DESIGN-TOKENS.md § 2](./05-DESIGN-TOKENS.md#2-typography) |
| Z-index scale | [05-DESIGN-TOKENS.md § 7](./05-DESIGN-TOKENS.md#7-z-index-scale) |
| Shadows | [05-DESIGN-TOKENS.md § 5](./05-DESIGN-TOKENS.md#5-shadows) |
| Transitions | [05-DESIGN-TOKENS.md § 8](./05-DESIGN-TOKENS.md#8-transitions) |
| Tailwind config | [05-DESIGN-TOKENS.md § 16](./05-DESIGN-TOKENS.md#16-tailwind-config) |
| Component responsive notes | [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md) (per-component "Responsive" notes) |
| Aspect ratios | [05-DESIGN-TOKENS.md § 13](./05-DESIGN-TOKENS.md#13-aspect-ratios) |



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 12                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-12--ACCESSIBILITY"></a>

### Doc 12 — ACCESSIBILITY

> Source: `docs/12-ACCESSIBILITY.md` ·     1239 lines

# Bridebook Accessibility Specification

> WCAG 2.1 AA + BITV 2.0 compliance specification.
> Based on 61 UI screenshots and cross-referenced with design tokens from [05-DESIGN-TOKENS.md](./05-DESIGN-TOKENS.md), components from [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md), animations from [06-MICRO-INTERACTIONS.md](./06-MICRO-INTERACTIONS.md), and responsive patterns from [11-RESPONSIVE-DESIGN.md](./11-RESPONSIVE-DESIGN.md).

---

## Table of Contents

1. [Color & Contrast](#1-color--contrast)
2. [Keyboard Navigation](#2-keyboard-navigation)
3. [Screen Reader](#3-screen-reader)
4. [Forms](#4-forms)
5. [Images & Media](#5-images--media)
6. [Motion & Animation](#6-motion--animation)
7. [Touch & Pointer](#7-touch--pointer)
8. [Component-Specific ARIA](#8-component-specific-aria)
9. [Testing Checklist](#9-testing-checklist)
10. [German Accessibility (BITV 2.0)](#10-german-accessibility-bitv-20)
11. [Cognitive Accessibility](#11-cognitive-accessibility)
12. [SPA-Specific](#12-spa-specific)
13. [Third-Party Components](#13-third-party-components)
14. [PDF/Export Accessibility](#14-pdfexport-accessibility)
15. [Accessibility Statement Page](#15-accessibility-statement-page)

---

## 1. Color & Contrast

### WCAG 2.1 AA Thresholds

- **Normal text** (< 18px or < 14px bold): minimum **4.5:1**
- **Large text** (≥ 18px or ≥ 14px bold): minimum **3:1**
- **UI components & graphical objects**: minimum **3:1**

### Contrast Ratio Audit — Text on Backgrounds

| Foreground | Background | Hex Pair | Ratio | AA Normal | AA Large | Status |
|------------|-----------|----------|-------|-----------|----------|--------|
| `text-primary` #1A1A1A | `bg-page` #FFFFFF | — | **16.2:1** | PASS | PASS | OK |
| `text-body` #333333 | `bg-page` #FFFFFF | — | **12.6:1** | PASS | PASS | OK |
| `text-secondary` #555555 | `bg-page` #FFFFFF | — | **7.5:1** | PASS | PASS | OK |
| `text-muted` #888888 | `bg-page` #FFFFFF | — | **3.5:1** | FAIL | PASS | Remediate |
| `text-tertiary` #999999 | `bg-page` #FFFFFF | — | **2.8:1** | FAIL | FAIL | Remediate |
| `brand-primary` #5B4ED1 | `bg-page` #FFFFFF | — | **4.6:1** | PASS | PASS | OK |
| `text-on-primary` #FFFFFF | `brand-primary` #5B4ED1 | — | **4.6:1** | PASS | PASS | OK |
| `text-on-nav` #FFFFFF | `bg-nav` #1E1B3A | — | **15.4:1** | PASS | PASS | OK |
| `error` #EF4444 | `bg-page` #FFFFFF | — | **4.6:1** | PASS | PASS | OK |
| `success` #22C55E | `bg-page` #FFFFFF | — | **2.8:1** | FAIL | FAIL | Remediate |
| `warning` #FFB800 | `bg-page` #FFFFFF | — | **1.9:1** | FAIL | FAIL | Remediate |
| `text-body` #333333 | `bg-secondary` #F5F5F5 | — | **11.4:1** | PASS | PASS | OK |
| `text-body` #333333 | `bg-warm` #F9F8F6 | — | **11.8:1** | PASS | PASS | OK |
| `text-muted` #888888 | `bg-secondary` #F5F5F5 | — | **3.2:1** | FAIL | PASS | Remediate |
| `brand-primary` #5B4ED1 | `bg-purple-wash` #E8E4F8 | — | **3.5:1** | FAIL | PASS | Remediate |
| `text-primary` #1A1A1A | `bg-purple-light` #F3F0FF | — | **14.9:1** | PASS | PASS | OK |
| `theme-burgundy` #722F37 | `bg-page` #FFFFFF | — | **8.3:1** | PASS | PASS | OK |
| `theme-forest` #3A5F1C | `bg-page` #FFFFFF | — | **6.5:1** | PASS | PASS | OK |

### Failing Pairs — Remediation

| Failing Token | Current Hex | Current Ratio | Remediated Hex | New Ratio | Usage Guidance |
|--------------|-------------|---------------|----------------|-----------|----------------|
| `text-muted` | #888888 | 3.5:1 | **#767676** | 4.5:1 | Use remediated value for all placeholder/helper text at normal sizes |
| `text-tertiary` | #999999 | 2.8:1 | **#757575** | 4.6:1 | Use remediated value; or restrict to large text (≥ 18px) only |
| `success` | #22C55E | 2.8:1 | **#16874A** | 4.6:1 | Use remediated value for success text; keep original for icons paired with text |
| `warning` / `brand-gold` | #FFB800 | 1.9:1 | **#926A00** | 4.6:1 | Use remediated value for warning text; original hex is OK for star icons with text labels |
| `brand-primary` on `bg-purple-wash` | #5B4ED1 on #E8E4F8 | 3.5:1 | **#4A3DB8** | 4.5:1 | Darken link text on purple backgrounds |
| `text-muted` on `bg-secondary` | #888888 on #F5F5F5 | 3.2:1 | **#767676** | 4.1:1 | Same remediation as above; or use `text-secondary` #555555 instead |

### Color-Blind Safe Patterns

Never use color alone to convey meaning. Pair with icons, text, or patterns:

| Status | Color | Required Companion |
|--------|-------|--------------------|
| Success | Green | Checkmark icon + "Gespeichert" text |
| Error | Red | Alert/exclamation icon + error message text |
| Warning | Yellow/Amber | Warning triangle icon + text |
| Favorite (active) | Red heart fill | Filled vs outlined heart shape distinction |
| Required field | Red asterisk | `*` character + `aria-required="true"` |
| Active tab | Purple underline | Bold weight + underline indicator (shape change) |
| Published/Unpublished | Green/Gray badge | Text label "Veröffentlicht" / "Nicht veröffentlicht" |

### Star Ratings

Star ratings (#FFB800) on white fail contrast. Solutions:
- Add a visible text label: "4.8 von 5 Sternen (124 Bewertungen)"
- Use a dark stroke (#926A00) around star shapes for 3:1 against white

---

## 2. Keyboard Navigation

### Focus Indicator Specification

From [05-DESIGN-TOKENS.md](./05-DESIGN-TOKENS.md) § Focus Ring:

```css
:focus-visible {
  outline: 2px solid #5B4ED1;
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

Focus ring contrast against white: **4.6:1** (passes 3:1 for UI components).

### Skip Links

```html
<a href="#main-content" class="skip-nav">
  Zum Hauptinhalt springen
</a>
<a href="#search-results" class="skip-nav">
  Zur Ergebnisliste springen
</a>
```

```css
.skip-nav {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 100;
  background: #5B4ED1;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 0 0 8px 8px;
  transition: top 150ms ease-out;
}
.skip-nav:focus {
  top: 0;
}
```

### Tab Order by Page Type

**Landing Page:**
1. Skip link → 2. Logo → 3. Nav links (Locations & Dienstleister, Planungs-Tools, Inspiration, Hochzeitshomepage) → 4. Icon actions (messages, favorites, settings) → 5. Hero search (category select → location input → search button) → 6. Category chips → 7. Promo cards → 8. Footer links

**Search Results:**
1. Skip link → 2. Header nav → 3. Filter bar (each filter dropdown L→R) → 4. Sort dropdown → 5. Result count → 6. Venue cards (top-to-bottom, each: card link → heart toggle) → 7. Pagination → 8. Footer

**Venue Detail:**
1. Skip link → 2. Header nav → 3. Photo gallery → 4. Venue name/rating → 5. Action buttons (Anfrage senden, Favorit) → 6. Tab bar (Details, Fotos, Bewertungen) → 7. Tab content → 8. Footer

**Dashboard:**
1. Skip link → 2. Header nav → 3. Countdown widget → 4. Quick action bar items → 5. Feature cards (Budget, Gästeliste, Homepage, Checkliste) → 6. Dreamteam carousel → 7. Milestones → 8. Partner invite banner → 9. Footer

**Budget:**
1. Skip link → 2. Header nav → 3. Stats row (max budget, estimated, actual) → 4. Budget line items (each row) → 5. Add item button → 6. Reset button → 7. Footer

**Guest List:**
1. Skip link → 2. Header nav → 3. Search field → 4. Add guest button → 5. Stats bar → 6. Guest table rows (each: name → RSVP status → actions) → 7. Footer

**Settings:**
1. Skip link → 2. Header nav → 3. Sidebar nav items → 4. Form fields in order → 5. Save button → 6. Delete account button → 7. Footer

**Homepage Builder:**
1. Skip link → 2. Header nav → 3. Tab bar (Details, Design, Einstellungen) → 4. Editor fields → 5. Publish toggle → 6. Device preview toggle → 7. Footer

### Modal Focus Trapping

When a modal opens:
1. Store the previously focused element
2. Move focus to the first focusable element inside the modal (or the close button)
3. Trap Tab/Shift+Tab within the modal
4. On Escape or close, return focus to the stored element
5. Set `aria-hidden="true"` on all content behind the modal

### Keyboard Shortcuts

| Action | Keys | Context |
|--------|------|---------|
| Close modal/dialog | `Escape` | Any open modal |
| Submit form | `Enter` | Focused on submit button or last field |
| Toggle favorite | `Enter` or `Space` | Focused on heart icon |
| Navigate tabs | `Arrow Left` / `Arrow Right` | Focused within tab bar |
| Navigate carousel | `Arrow Left` / `Arrow Right` | Focused within carousel |
| Open dropdown | `Enter`, `Space`, or `Arrow Down` | Focused on dropdown trigger |
| Close dropdown | `Escape` | Open dropdown |

---

## 3. Screen Reader

### Landmark Structure

Every page must include these ARIA landmarks:

```html
<body>
  <a href="#main-content" class="skip-nav">Zum Hauptinhalt springen</a>

  <header role="banner">
    <nav role="navigation" aria-label="Hauptnavigation">
      <!-- Primary nav links -->
    </nav>
  </header>

  <main id="main-content" role="main">
    <h1><!-- Page title --></h1>
    <!-- Page content -->
  </main>

  <aside role="complementary" aria-label="Seitenleiste">
    <!-- Sidebar content (settings, filters) -->
  </aside>

  <footer role="contentinfo">
    <!-- Footer links -->
  </footer>
</body>
```

### Heading Hierarchy

Maintain strict hierarchy with no skipped levels:

**Dashboard example:**
```
h1: Eure Hochzeitsplanung
  h2: Countdown
  h2: Schnellzugriff
  h2: Planungs-Tools
    h3: Budget
    h3: Gästeliste
    h3: Hochzeitshomepage
    h3: Checkliste
  h2: Euer Dreamteam
  h2: Meilensteine
```

**Search results example:**
```
h1: Hochzeitslocations in Wiesbaden
  h2: Filter
  h2: 10.694 Ergebnisse
    h3: [Venue Name] (repeated per card)
```

**Settings example:**
```
h1: Einstellungen
  h2: Meine Account-Daten
    h3: Profilbild
    h3: Persönliche Daten
  h2: Meine Hochzeitsdetails
```

### aria-live Regions

| Region | Politeness | Trigger |
|--------|-----------|---------|
| Toast notifications | `aria-live="polite"` | Save, delete, send confirmations |
| Form error summary | `aria-live="assertive"`, `role="alert"` | Form submission with errors |
| Loading states | `aria-live="polite"`, `role="status"`, `aria-busy="true"` | Budget calculation, page load |
| Filter result count | `aria-live="polite"` | Filter change updates "10.694 Ergebnisse" |
| Search results update | `aria-live="polite"` | New results loaded |
| Countdown timer | `aria-live="off"` (use `aria-label` on container instead) | Avoid announcing every second |

```html
<!-- Toast region (always in DOM) -->
<div id="toast-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<!-- Filter result count -->
<div aria-live="polite">
  <span>10.694 Ergebnisse anzeigen</span>
</div>

<!-- Loading state -->
<div aria-live="polite" aria-busy="true" role="status">
  Zahlenverarbeitung im Gange...
</div>

<!-- Error alert -->
<div aria-live="assertive" role="alert">
  Bitte korrigiere die markierten Felder.
</div>
```

### Visually Hidden Utility

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 4. Forms

### Label Association

Every form input must have a programmatically associated label:

```html
<!-- Explicit association -->
<label for="email">E-Mail *</label>
<input id="email" type="email" aria-required="true" aria-describedby="email-help email-error" />
<span id="email-help">Wir senden dir eine Bestätigung.</span>
<span id="email-error" role="alert" aria-live="assertive"></span>
```

### Error Handling

```html
<!-- Field in error state -->
<label for="name">Dein Name *</label>
<input
  id="name"
  type="text"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="name-error"
/>
<span id="name-error" role="alert" aria-live="assertive" style="color: #EF4444;">
  Dieses Feld ist ein Pflichtfeld
</span>
```

Rules:
- Set `aria-invalid="true"` when validation fails
- Connect error message via `aria-describedby`
- Use `role="alert"` on error containers so screen readers announce them
- Display error icon + text (never color alone)

### Required Fields

```html
<label for="field">
  Element
  <span aria-hidden="true" style="color: #EF4444;"> *</span>
  <span class="sr-only">(Pflichtfeld)</span>
</label>
<input id="field" aria-required="true" />
```

- Visual: red asterisk `*`
- Programmatic: `aria-required="true"`
- Screen reader: hidden "(Pflichtfeld)" text

### Help Text

```html
<label for="budget">Maximales Budget</label>
<input id="budget" type="number" aria-describedby="budget-help" />
<span id="budget-help">Gib euer geschätztes Gesamtbudget ein.</span>
```

### Validation Timing

| Event | Behavior |
|-------|----------|
| Field blur | Validate individual field; show inline error if invalid |
| Form submit | Validate all fields; focus first invalid field; announce error count |
| Field input (after error shown) | Clear error as soon as field becomes valid |

### Form Submit Error Summary

```html
<div role="alert" aria-live="assertive" tabindex="-1" id="error-summary">
  <h2>3 Fehler gefunden</h2>
  <ul>
    <li><a href="#name">Dein Name ist ein Pflichtfeld</a></li>
    <li><a href="#email">Bitte gib eine gültige E-Mail-Adresse ein</a></li>
    <li><a href="#date">Bitte wähle ein Datum</a></li>
  </ul>
</div>
```

On submit failure, focus moves to `#error-summary`.

---

## 5. Images & Media

### Alt Text by Image Type

| Image Type | Alt Text Strategy | Example |
|-----------|-------------------|---------|
| Venue photo | Descriptive: venue name + context | `alt="Schloss Biebrich — Festsaal mit Kronleuchtern"` |
| User avatar | Name or initials | `alt="Profilbild von Anna M."` |
| Decorative illustration | Empty alt + aria-hidden | `alt="" aria-hidden="true"` |
| Functional icon (standalone) | Action description | `alt="Zu Favoriten hinzufügen"` |
| Functional icon (with label) | Redundant — hide | `alt="" aria-hidden="true"` (label provides text) |
| Promo card background | Describe content, not decoration | `alt="Hochzeitsfotograf bei der Arbeit"` |
| Logo | Brand name | `alt="Bridebook"` |
| Star rating | Use text instead | `alt=""` + visible "4.8 von 5" text |
| Map screenshot | Describe area | `alt="Karte von Wiesbaden mit 24 Hochzeitslocations"` |
| QR code | Purpose | `alt="QR-Code zum Herunterladen der Bridebook-App"` |

### Decorative Images

```html
<img src="decoration.svg" alt="" aria-hidden="true" />
```

Applies to: empty state illustrations behind beige circles, gradient overlays, divider ornaments.

### Complex Images (Maps, Charts)

```html
<!-- Map -->
<div role="img" aria-label="Karte mit 24 Hochzeitslocations in Wiesbaden und Umgebung">
  <div id="google-map"><!-- Google Maps embed --></div>
</div>
<!-- Text alternative below -->
<details>
  <summary>Standortliste anzeigen</summary>
  <ul>
    <li>Schloss Biebrich — Rheingaustraße 140</li>
    <li>Kurhaus Wiesbaden — Kurhausplatz 1</li>
    <!-- ... -->
  </ul>
</details>
```

### SVG Icons

```html
<!-- Meaningful icon (standalone) -->
<svg role="img" aria-label="Nachrichten" focusable="false">
  <use href="#icon-envelope" />
</svg>

<!-- Decorative icon (next to text) -->
<svg aria-hidden="true" focusable="false">
  <use href="#icon-chevron" />
</svg>
<span>Alle anzeigen</span>
```

---

## 6. Motion & Animation

### prefers-reduced-motion

From [06-MICRO-INTERACTIONS.md](./06-MICRO-INTERACTIONS.md) § Accessibility:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Animation-to-Reduced-Motion Mapping

Every animation from [06-MICRO-INTERACTIONS.md](./06-MICRO-INTERACTIONS.md) with its alternative:

| Animation | Duration | Full Motion | Reduced Motion |
|-----------|----------|-------------|----------------|
| Processing dots (budget calc) | 500ms loop | Scale + opacity pulse | Static dots, no animation |
| Skeleton shimmer | 500ms loop | Background-position slide | Static gray placeholder |
| Image lazy-load fade | 300ms | Opacity 0→1 | Instant display (`opacity: 1`) |
| Map pin cluster load | 200ms | Scale + translate + opacity | Instant display |
| Button spinner | 600ms loop | Rotate 360° | Static spinner icon or "Laden..." text |
| Infinite scroll dots | 500ms loop | Bounce Y | Static dots |
| Empty state entrance | 300ms | Scale + opacity | Instant display |
| Dashboard card stagger | 300ms × n | Translate Y + opacity stagger | Instant display |
| Form validation shake | 150ms | Translate X shake | No shake; border color change only |
| Modal open/close | 300ms | Scale + translate Y + opacity | Opacity-only, instant |
| Dropdown expand | 200ms | Height animation | Instant show/hide |
| Tab underline slide | 200ms | Horizontal position transition | Instant position change |
| Card hover lift | 150ms | Translate Y + shadow | Shadow change only (no movement) |
| Toast slide-in | 300ms | Translate X slide | Opacity fade only |
| Heart pulse (favorite) | 100ms | Scale bounce | Color change only |
| Progress bar fill | 300ms | Width transition | Instant width change |
| Carousel slide | 300ms | Transform translate | Instant snap to slide |
| Milestone badge unlock | 300ms | Scale bounce + filter | Filter change only (instant) |
| Countdown digit tick | 200ms | Translate Y digit roll | Instant value change |
| Lightbox open | 300ms | Scale + opacity | Opacity-only |
| Notification badge bounce | 100ms | Scale from 0 | Instant display |
| Page section entrance | 300ms stagger | Translate Y + opacity | Instant display |
| Checkmark draw | 100ms | SVG path draw | Instant checkmark display |
| Pull to refresh | 300ms | Height expand | Instant indicator |
| Swipe to delete | 300ms | Translate X | Instant reveal of delete button |

### Framer Motion Integration

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Auto-Playing Content Rules

- **No auto-playing carousels.** Carousel movement only on user interaction (swipe, arrow click, arrow key).
- **Countdown timer:** Digits update silently. Do not auto-scroll or animate attention-grabbing effects. Provide a static `aria-label` on the container: `aria-label="Noch 142 Tage bis zur Hochzeit"`.
- **Infinite scroll indicator (bouncing dots):** Must stop when user is not scrolling. Provide a visible "Mehr laden" button as an alternative.

---

## 7. Touch & Pointer

### Minimum Touch Targets

From [11-RESPONSIVE-DESIGN.md](./11-RESPONSIVE-DESIGN.md) § Touch Target & Interaction:

| Element | Minimum Size | Implementation |
|---------|-------------|----------------|
| Buttons | 44×44px | `min-height: 44px; min-width: 44px;` |
| Icon buttons (heart, envelope, gear) | 44×44px including padding | 20px icon + `padding: 12px` |
| Checkboxes | 44×44px tap area | 20px visual + 12px padding per side |
| Inline links | 44px row height | `padding: 12px 0` on list items |
| Nav items | 48px row height | `padding: 12px 16px` |
| Close buttons (modal ×) | 44×44px | Generous padding around × icon |
| Carousel dots | 44×44px tap area | 8px visual dot + 18px padding |

### Pointer Cancellation (WCAG 2.5.2)

- Use `click` / `pointerup` events, **not** `mousedown` / `pointerdown` for actions
- User can move pointer off the target before releasing to cancel
- Exception: drag gestures (carousel swipe, swipe-to-delete) where down-move-up is the interaction

### Swipe Gesture Alternatives

Every swipe gesture must have a visible button alternative:

| Swipe Gesture | Visible Alternative |
|--------------|---------------------|
| Carousel horizontal swipe | Left/right arrow buttons (visible on desktop, tap-accessible on mobile) |
| Swipe left to delete (guest list) | Visible delete button in expanded row or context menu |
| Pull to refresh | "Aktualisieren" button in toolbar |
| Bottom sheet swipe down to dismiss | Close × button in sheet header |
| Lightbox swipe | Previous/Next arrow buttons + Close button |
| Pinch to zoom (map/photos) | Zoom +/− buttons overlay |

---

## 8. Component-Specific ARIA

### Modal / Dialog

From [03-UI-COMPONENTS.md](./03-UI-COMPONENTS.md) § 6.1:

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
  <h2 id="modal-title">Gäste hinzufügen</h2>
  <p id="modal-desc">Füge neue Gäste zu deiner Gästeliste hinzu.</p>
  <button aria-label="Dialog schließen">×</button>
  <!-- form content -->
</div>
```

Requirements:
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` pointing to heading
- Focus trap (Tab cycles within modal)
- `Escape` key closes
- Return focus to trigger element on close
- `aria-hidden="true"` on all background content

### Select / Dropdown

```html
<div role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="options-list">
  <input role="textbox" aria-autocomplete="list" aria-controls="options-list" />
</div>
<ul id="options-list" role="listbox" aria-label="Kategorie">
  <li role="option" id="opt-1" aria-selected="false">Hochzeitslocations</li>
  <li role="option" id="opt-2" aria-selected="true">Fotograf</li>
</ul>
```

- `aria-expanded` toggles with open/close
- `aria-activedescendant` tracks highlighted option during keyboard navigation
- `Arrow Up/Down` navigates options
- `Enter` selects; `Escape` closes

### Tab Bar

```html
<div role="tablist" aria-label="Seitennavigation">
  <button role="tab" id="tab-details" aria-selected="true" aria-controls="panel-details">
    Details
  </button>
  <button role="tab" id="tab-design" aria-selected="false" aria-controls="panel-design" tabindex="-1">
    Design
  </button>
  <button role="tab" id="tab-settings" aria-selected="false" aria-controls="panel-settings" tabindex="-1">
    Einstellungen
  </button>
</div>

<div role="tabpanel" id="panel-details" aria-labelledby="tab-details">
  <!-- Details content -->
</div>
```

- Only the active tab has `tabindex="0"`; others have `tabindex="-1"`
- `Arrow Left/Right` moves between tabs
- `Home/End` jumps to first/last tab

### Carousel / Slider

```html
<div role="region" aria-roledescription="Karussell" aria-label="Euer Dreamteam">
  <div aria-live="polite" class="sr-only">Folie 2 von 5</div>
  <button aria-label="Vorherige Folie">←</button>
  <div role="group" aria-roledescription="Folie" aria-label="Fotograf — 3 Favoriten">
    <!-- Card content -->
  </div>
  <button aria-label="Nächste Folie">→</button>
</div>
```

### Accordion

```html
<div>
  <h3>
    <button
      aria-expanded="true"
      aria-controls="section-names"
      id="heading-names"
    >
      Eure Namen
    </button>
  </h3>
  <div id="section-names" role="region" aria-labelledby="heading-names">
    <!-- Content -->
  </div>
</div>
```

- `Enter` or `Space` toggles expanded/collapsed
- `aria-expanded` reflects state

### Map

```html
<div role="application" aria-label="Interaktive Karte mit Hochzeitslocations in Wiesbaden">
  <a href="#after-map" class="skip-nav">Karte überspringen</a>
  <!-- Google Maps embed -->
</div>
<div id="after-map">
  <!-- Text alternative: venue address list -->
</div>
```

### Toggle Switch

```html
<button role="switch" aria-checked="true" aria-label="Veröffentlicht">
  <span class="toggle-track">
    <span class="toggle-thumb"></span>
  </span>
</button>
```

- `role="switch"` with `aria-checked="true/false"`
- `Enter` or `Space` toggles
- Label describes what is being toggled

### Toast / Snackbar

```html
<div role="status" aria-live="polite" aria-atomic="true">
  Änderungen gespeichert
</div>
```

- `role="status"` for informational
- `role="alert"` for errors
- Auto-dismiss toasts should remain long enough to read (minimum 4 seconds, per design: 4000ms)

### Filter Bar

```html
<div role="toolbar" aria-label="Suchergebnisse filtern">
  <button aria-haspopup="listbox" aria-expanded="false">Preiskategorie</button>
  <button aria-haspopup="listbox" aria-expanded="false">Gästeanzahl</button>
  <!-- Active filters as removable badges -->
  <span role="status" aria-live="polite">10.694 Ergebnisse</span>
  <button>Filter zurücksetzen</button>
</div>
```

### Image Gallery / Lightbox

```html
<!-- Gallery grid -->
<div role="group" aria-label="Fotogalerie — 12 Bilder">
  <button aria-label="Bild 1 von 12 vergrößern">
    <img src="..." alt="Festsaal bei Nacht" />
  </button>
  <!-- ... -->
</div>

<!-- Lightbox overlay -->
<div role="dialog" aria-modal="true" aria-label="Bildansicht">
  <img src="..." alt="Festsaal bei Nacht — Vollbild" />
  <button aria-label="Vorheriges Bild">←</button>
  <button aria-label="Nächstes Bild">→</button>
  <button aria-label="Schließen">×</button>
  <span aria-live="polite">Bild 3 von 12</span>
</div>
```

### Breadcrumbs

```html
<nav aria-label="Brotkrümelnavigation">
  <ol>
    <li><a href="/">Startseite</a></li>
    <li><a href="/inspiration">Allgemeine Ratschläge</a></li>
    <li aria-current="page">Expertberatung</li>
  </ol>
</nav>
```

### Pagination

```html
<nav aria-label="Seitennavigation">
  <button aria-label="Vorherige Seite" disabled>←</button>
  <button aria-label="Seite 1" aria-current="page">1</button>
  <button aria-label="Seite 2">2</button>
  <button aria-label="Seite 3">3</button>
  <button aria-label="Nächste Seite">→</button>
</nav>
```

### Progress Bar

```html
<div
  role="progressbar"
  aria-valuenow="65"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Checkliste 65% abgeschlossen"
>
  <div style="width: 65%"></div>
</div>
```

### Rating Stars

```html
<div role="img" aria-label="4,8 von 5 Sternen, 124 Bewertungen">
  <!-- Visual star SVGs with aria-hidden="true" -->
</div>
```

### Search Bar

```html
<div role="search">
  <label for="search-input" class="sr-only">Suche nach Dienstleister Namen</label>
  <input
    id="search-input"
    type="search"
    aria-label="Suche nach Dienstleister Namen"
    aria-autocomplete="list"
    aria-controls="search-suggestions"
  />
  <button type="submit" aria-label="Suche starten">
    <svg aria-hidden="true"><!-- magnifying glass --></svg>
  </button>
</div>
```

---

## 9. Testing Checklist

### Manual Testing Steps

| # | Test | How | Pass Criteria |
|---|------|-----|---------------|
| 1 | Keyboard-only navigation | Unplug mouse; Tab through every page | All interactive elements reachable; visible focus ring; logical order |
| 2 | Skip link | Press Tab on page load | "Zum Hauptinhalt springen" appears; activating it moves focus to `<main>` |
| 3 | Focus trap in modals | Open any modal; Tab repeatedly | Focus stays within modal; Escape closes it |
| 4 | Zoom to 200% | Browser zoom to 200% | No content clipped; no horizontal scroll; text reflows |
| 5 | Zoom to 400% | Browser zoom to 400% | Core content still readable; single-column reflow |
| 6 | High contrast mode | Windows High Contrast Mode / `forced-colors: active` | All text visible; focus rings visible; icons distinguishable |
| 7 | Reduced motion | OS: reduce motion preference | All animations replaced per mapping table in §6 |
| 8 | Color-only information | Grayscale browser filter | All status indicators understandable without color |
| 9 | Touch target sizes | Measure with DevTools | All targets ≥ 44×44px |
| 10 | Form errors | Submit empty required forms | Error messages announced; focus moves to first error |
| 11 | Text spacing override | Apply WCAG text spacing bookmarklet | No clipped or overlapping text |
| 12 | Print stylesheet | Ctrl+P on key pages | Readable output; no clipped content; sufficient contrast |

### Automated Testing

| Tool | Purpose | Integration |
|------|---------|-------------|
| axe-core | DOM-level accessibility violations | CI pipeline via `@axe-core/react` or `jest-axe` |
| Lighthouse | Accessibility audit score | CI pipeline; target score ≥ 95 |
| eslint-plugin-jsx-a11y | Catch ARIA issues at build time | ESLint config |
| Pa11y | Automated page crawl testing | CI on staging URLs |

### Screen Reader Test Matrix

| Screen Reader | OS | Browser | Priority |
|--------------|-----|---------|----------|
| VoiceOver | macOS | Safari | High |
| VoiceOver | iOS | Safari | High |
| NVDA | Windows | Chrome/Firefox | High |
| TalkBack | Android | Chrome | Medium |
| JAWS | Windows | Chrome | Medium |

### Regression Checklist

| Component | Test |
|-----------|------|
| Modal | Opens with focus; traps Tab; Escape closes; focus returns |
| Tab bar | Arrow keys navigate; correct `aria-selected`; panel shows |
| Dropdown | Escape closes; `aria-expanded` toggles; keyboard selection works |
| Carousel | Arrow buttons work; `aria-live` announces slide change |
| Accordion | Enter/Space toggles; `aria-expanded` correct |
| Toggle switch | Space toggles; `aria-checked` correct; label announced |
| Toast | Announced via `aria-live`; auto-dismisses; not blocking |
| Form | Label association; error announcement; required field indication |

---

## 10. German Accessibility (BITV 2.0)

### BITV 2.0 Overview

BITV 2.0 (Barrierefreie-Informationstechnik-Verordnung) is Germany's federal accessibility regulation. It mandates WCAG 2.1 AA conformance plus additional German-specific requirements.

### Language Declarations

```html
<html lang="de">
  <head>
    <title>Bridebook — Hochzeitsplanung</title>
  </head>
  <body>
    <!-- German content -->
    <p>Plane deine <span lang="en">Wedding Homepage</span> mit Bridebook.</p>
  </body>
</html>
```

Rules:
- `lang="de"` on `<html>` element
- `lang="en"` on any English fragments (brand names, English loan words where pronunciation matters)
- This ensures screen readers switch pronunciation engines correctly

### German Compound Word Hints

German compound words can be misread by screen readers. Use soft hyphens where needed:

```html
<!-- Screen reader may struggle with long compounds -->
<span aria-label="Hochzeits-Homepage-Einstellungen">Hochzeitshomepageeinstellungen</span>
```

Common compound words in Bridebook requiring attention:
- Hochzeitslocations → `Hochzeits&shy;locations`
- Dienstleistersuche → `Dienstleister&shy;suche`
- Gästeliste → clear enough; no intervention needed
- Budgetübersicht → `Budget&shy;übersicht`

### Date Format Announcements

```html
<!-- Numeric dates need aria-label for clear pronunciation -->
<time datetime="2025-03-15" aria-label="15. März 2025">15.03.2025</time>

<!-- Countdown -->
<div aria-label="Noch 142 Tage, 5 Stunden, 23 Minuten bis zur Hochzeit">
  <span>142</span> Tage
  <span>5</span> Std
  <span>23</span> Min
</div>
```

### Currency Announcements

```html
<!-- Ensure screen reader says "Euro" not "E" -->
<span aria-label="500 Euro">€500</span>
<span aria-label="30.000 Euro">€30.000</span>

<!-- Budget items -->
<td aria-label="Geschätzte Kosten: 2.500 Euro">€2.500</td>
```

### German Number Formatting

Germany uses period as thousands separator and comma as decimal:
- `€30.000` (thirty thousand)
- `4,8 Sterne` (four point eight)

Ensure `aria-label` uses full German number words where ambiguity exists.

---

## 11. Cognitive Accessibility

### Clear Language

- Target **B1 reading level** (Einfache Sprache) for all UI text
- Avoid jargon: use "Dienstleister" not "Vendor", "Hochzeitslocation" not "Venue"
- Short sentences in labels and descriptions
- Consistent terminology: always "Speichern" for save, "Löschen" for delete, "Abbrechen" for cancel

### Consistent Navigation

- Header navigation in the same position on every page
- Footer in the same structure on every page
- Tab bar position consistent within page types (always below page header)
- Sidebar navigation always on the left, same width (280px)

### Predictable Interactions

- No surprise behaviors: clicking a link navigates; clicking a button performs an action
- No automatic redirects or content changes without user initiation
- Dropdown opens on click, not hover (hover tooltips are supplementary only)
- Form auto-save: if implemented, provide visible "Gespeichert" confirmation

### Error Prevention

Confirmation dialogs required before destructive actions:

| Action | Confirmation Text |
|--------|-------------------|
| Konto löschen | "Dies kann nicht rückgängig gemacht werden. Möchtest du dein Konto wirklich löschen?" |
| Budget zurücksetzen | "Alle Budgetdaten werden gelöscht. Fortfahren?" |
| Gast löschen | "Gast [Name] wirklich entfernen?" |
| Element löschen (budget item) | "Dieses Element löschen?" |
| Nachricht archivieren | No confirmation needed (reversible) |

### Reading Order

- DOM order must match visual order
- CSS `order`, `flex-direction: row-reverse`, or absolute positioning must not reorder content in a way that confuses screen readers
- Test by disabling CSS and verifying content reads logically

### Session Timeouts

```html
<!-- Warning before session expiry -->
<div role="alertdialog" aria-modal="true" aria-labelledby="timeout-title">
  <h2 id="timeout-title">Sitzung läuft ab</h2>
  <p>Deine Sitzung läuft in 2 Minuten ab. Möchtest du sie verlängern?</p>
  <button>Sitzung verlängern</button>
  <button>Abmelden</button>
</div>
```

- Warn at least 2 minutes before expiry
- Allow extension with a single button press
- If timeout occurs, preserve form data where possible

---

## 12. SPA-Specific

### Focus Management on Route Change

```tsx
// On route change, move focus to the new page's <h1>
useEffect(() => {
  const heading = document.querySelector("h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }
}, [location.pathname]);
```

### Document Title Update

```tsx
// Update title on every route change
useEffect(() => {
  document.title = `${pageTitle} — Bridebook`;
}, [pageTitle]);
```

Title format: `[Page Name] — Bridebook`

Examples:
- "Dashboard — Bridebook"
- "Hochzeitslocations in Wiesbaden — Bridebook"
- "Budget — Bridebook"
- "Einstellungen — Bridebook"

### Page Transition Announcements

```html
<!-- Persistent live region in app shell -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="route-announcer"></div>
```

```tsx
useEffect(() => {
  const announcer = document.getElementById("route-announcer");
  if (announcer) {
    announcer.textContent = `Seite geladen: ${pageTitle}`;
  }
}, [pageTitle]);
```

### Loading States

```html
<main aria-busy="true">
  <div role="status" aria-live="polite">
    Seite wird geladen...
  </div>
</main>
```

Set `aria-busy="true"` on `<main>` while loading; remove when content is ready.

### History Navigation (Back/Forward)

- On browser back/forward, restore scroll position
- Restore focus to the element that triggered navigation (e.g., the venue card that was clicked)
- If the element no longer exists, focus the `<h1>`

---

## 13. Third-Party Components

### Google Maps

```html
<div role="application" aria-label="Interaktive Karte — Hochzeitslocations">
  <a href="#map-end" class="skip-nav">Karte überspringen</a>
  <iframe
    title="Google Maps — Hochzeitslocations in Wiesbaden"
    src="..."
    tabindex="0"
  ></iframe>
</div>
<div id="map-end">
  <!-- Text fallback: sortable venue address list -->
  <h3>Standorte als Liste</h3>
  <ul>
    <li>Schloss Biebrich — Rheingaustraße 140, 65203 Wiesbaden</li>
    <!-- ... -->
  </ul>
</div>
```

### Stripe Payment Form

```html
<div aria-label="Zahlungsinformationen">
  <iframe
    title="Sichere Zahlungseingabe — Stripe"
    src="..."
  ></iframe>
</div>
```

- Ensure Stripe Elements are configured with `locale: 'de'`
- Stripe handles internal keyboard nav; verify Tab enters and exits the iframe correctly
- Announce payment errors via `aria-live="assertive"` region outside the iframe

### Social Login Buttons

```html
<button type="button" aria-label="Mit Google anmelden">
  <svg aria-hidden="true"><!-- Google icon --></svg>
  <span>Mit Google anmelden</span>
</button>

<button type="button" aria-label="Mit Apple anmelden">
  <svg aria-hidden="true"><!-- Apple icon --></svg>
  <span>Mit Apple anmelden</span>
</button>
```

### Cookie Consent Dialog

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="cookie-title"
  aria-describedby="cookie-desc"
>
  <h2 id="cookie-title">Cookie-Einstellungen</h2>
  <p id="cookie-desc">Wir verwenden Cookies, um dein Erlebnis zu verbessern.</p>
  <button>Alle akzeptieren</button>
  <button>Nur notwendige</button>
  <button>Einstellungen anpassen</button>
</div>
```

Requirements:
- Focus trap while open
- Keyboard dismissible (`Escape` → accept necessary only)
- Must NOT block screen reader access to rest of page until interacted with (use `role="dialog"`, not `aria-modal` if page must remain readable)
- Tab order: heading → description → accept all → necessary only → customize

---

## 14. PDF/Export Accessibility

### Tagged PDFs (Budget Export)

Budget exports must produce tagged PDFs:
- Proper heading structure (`<H1>` for title, `<H2>` for sections)
- Table elements with `<TH>` for headers and `<TD>` for data
- Reading order matches visual layout
- Language tag set to `de`
- Alt text on any embedded images/charts

### Accessible CSV

```
"Kategorie";"Geschätzt";"Tatsächlich";"Differenz"
"Hochzeitstorte";"500";"450";"-50"
"Fotograf";"2500";"2500";"0"
```

Requirements:
- Header row as first row
- Consistent delimiter (semicolon for German locale)
- UTF-8 encoding with BOM (`\uFEFF`) for Excel compatibility
- No merged cells or empty rows

### Print Stylesheets

```css
@media print {
  /* Hide non-essential UI */
  header, footer, nav, .skip-nav, .toast,
  button:not(.print-btn), .map-container { display: none; }

  /* Ensure contrast */
  body { color: #000; background: #fff; }

  /* Prevent clipping */
  * { overflow: visible !important; }

  /* Show URLs for links */
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; }
}
```

---

## 15. Accessibility Statement Page

Required by BITV 2.0 §12(1). Must be reachable from every page (footer link).

### Required Content

```markdown
# Erklärung zur Barrierefreiheit

**Stand:** [Datum der letzten Überprüfung]

Bridebook GmbH bemüht sich, ihre Website im Einklang mit der
Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und der
EU-Richtlinie 2016/2102 barrierefrei zugänglich zu machen.

## Konformitätsstatus

Diese Website ist **teilweise konform** mit WCAG 2.1 Stufe AA.

## Nicht barrierefreie Inhalte

Die nachstehend aufgeführten Inhalte sind aus folgenden Gründen
nicht barrierefrei:

- [Bekannte Einschränkungen auflisten]
- Google Maps-Integration: Kartendarstellung ist nicht vollständig
  mit Screenreadern nutzbar. Eine Textliste der Standorte steht
  als Alternative zur Verfügung.
- Stripe-Zahlungsformular: Das eingebettete Zahlungsformular
  unterliegt der Barrierefreiheit des Drittanbieters.

## Feedback und Kontakt

Wenn Sie Barrieren auf unserer Website feststellen, kontaktieren
Sie uns bitte:

- **E-Mail:** barrierefreiheit@bridebook.de
- **Telefon:** +49 [Nummer]
- **Postanschrift:** [Adresse]

Wir bemühen uns, Ihre Anfrage innerhalb von 2 Wochen zu beantworten.

## Schlichtungsverfahren

Sollten wir auf Ihre Anfrage nicht zufriedenstellend reagieren,
können Sie sich an die Schlichtungsstelle nach § 16 BGG wenden:

**Schlichtungsstelle nach dem Behindertengleichstellungsgesetz**
bei dem Beauftragten der Bundesregierung für die Belange von
Menschen mit Behinderungen

- Website: www.schlichtungsstelle-bgg.de
- E-Mail: info@schlichtungsstelle-bgg.de
- Telefon: +49 (0)30 18 527-2805
```

### Implementation

- URL: `/barrierefreiheit` or `/accessibility`
- Linked from every page footer
- Updated at minimum annually or after major releases
- `lang="de"` on the page



---

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- DOC 13                                                       -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<a id="doc-13--MVP-PRIORITIES"></a>

### Doc 13 — MVP PRIORITIES

> Source: `docs/13-MVP-PRIORITIES.md` ·     1116 lines

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


---

## Part 4: Cross-Reference Index

### By Feature

| Feature | DB (01) | Flows (02) | UI (03) | Wireframes (04) | Forms (08) | API (10) | Priority (13) |
|---------|---------|-----------|---------|-----------------|-----------|---------|---------------|
| Authentication | §1 users | Flow 1 Onboarding | Modal, TextInput | Screen 1 | Form 1.1 | /auth/* | P0.1 |
| Wedding Setup | §2 weddings | Flow 2 Setup | ChipSelect, Select | Screen 2 | Form 7.6 | /weddings/* | P0.3 |
| Vendor Search | §3 vendors | Flow 3 Search | SearchBar, VenueCard | Screen 3-4 | Form 9.1-9.2 | /vendors/*, /search/* | P0.4 |
| Vendor Detail | §3 vendors | Flow 4 Detail | ImageGallery, TabBar | Screen 5 | — | /vendors/:id | P0.5 |
| Favorites | §5 favorites | Flow 5 Favorites | VenueCard, Modal | — | Form 9.3 | /favorites/* | P0.6 |
| Enquiry | §6 enquiries | Flow 6 Enquiry | Modal, Textarea | Screen 6 | Form 3.1-3.2 | /enquiries/* | P0.7 |
| Dashboard | read-only | Flow 7 Dashboard | Countdown, Cards | Screen 7 | Form 9.1 | analytics/* | P1.1 |
| Budget | §7 budget_* | Flow 8 Budget | BudgetLine, Stats | Screen 8 | Form 2.1, 5.1-5.2 | /budget/* | P1.2 |
| Guest List | §8 guests | Flow 9 Guests | Modal, Avatar | Screen 9 | Form 4.1-4.2 | /guests/* | P1.3 |
| Tasks | §9 tasks | Flow 10 Tasks | Checkbox, ProgressBar | Screen 10 | — | /tasks/* | P1.4 |
| Messaging | §6 messages | Flow 11 Messages | TabBar, Badge | Screen 11 | — | /messages/* | P1.5 |
| Homepage | §2 settings | Flow 12 Homepage | SplitLayout, Preview | Screen 12 | Form 8.1-8.12 | /homepage/* | P2.1 |
| Reviews | §10 reviews | Flow 13 Reviews | RatingStars | — | — | /reviews/* | P2.3 |
| Settings | §1 users | Flow 14 Settings | SidebarNav, Toggle | Screen 13 | Form 7.1-7.5 | /users/me/* | P0.2 |

### By Technical Concern

| Concern | Relevant Docs |
|---------|--------------|
| Database Design | 01, 10, 13 |
| Frontend Components | 03, 04, 05, 06, 11 |
| User Experience | 02, 04, 06, 07 |
| Forms & Validation | 08, 03, 12 |
| API Design | 10, 01, 13 |
| Styling & Theming | 05, 03, 11 |
| Accessibility | 12, 03, 06, 11 |
| German Market | 02, 07, 08, 12, 13 |
| Mobile/Responsive | 11, 03, 04 |
| Legal/Compliance | 12, 13 (§5 German Market) |
| Performance | 06, 10, 11 |
| Security | 01 (RLS), 10 (Auth), 12, 13 |

---

## Part 4b: Glossary

### German / English Translations

| German | English | Context |
|--------|---------|---------|
| Braut | Bride | User role |
| Bräutigam | Groom | User role |
| Hochzeit | Wedding | Core entity |
| Hochzeitsdatum | Wedding date | Form field |
| Hochzeitsort | Wedding location | Form field |
| Gästeliste | Guest list | Feature |
| Aufgaben | Tasks/Checklist | Feature |
| Budget | Budget | Feature (same) |
| Favoriten | Favorites | Feature |
| Nachrichten | Messages | Feature |
| Dienstleister | Service provider/Vendor | Vendor type |
| Veranstaltungsort | Venue | Vendor category |
| Fotograf | Photographer | Vendor category |
| Florist | Florist | Vendor category |
| Catering | Catering | Vendor category (same) |
| DJ / Band | DJ / Band | Vendor category |
| Einstellungen | Settings | Navigation |
| Anmelden | Sign in | Auth |
| Registrieren | Register/Sign up | Auth |
| Abmelden | Sign out | Auth |
| Suche | Search | Navigation |
| Filter | Filter | Feature (same) |
| Bewertungen | Reviews/Ratings | Feature |
| Anfrage | Enquiry/Inquiry | Feature |
| Buchung | Booking | Feature |
| Impressum | Legal notice/Imprint | Legal (required in DE) |
| Datenschutz | Privacy/Data protection | Legal (GDPR) |
| AGB | Terms & Conditions | Legal |
| Loslegen | Get started | CTA button |
| Kostenvoranschlag | Cost estimate/Quote | Budget |
| Trauung | Wedding ceremony | Event type |
| Empfang | Reception | Event type |
| Standesamt | Registry office | Venue type |
| Kirche | Church | Venue type |

### Abbreviations

| Abbreviation | Full Form |
|-------------|-----------|
| GDPR | General Data Protection Regulation (EU) |
| DSGVO | Datenschutz-Grundverordnung (GDPR in German) |
| BDSG | Bundesdatenschutzgesetz (German Federal Data Protection Act) |
| BITV | Barrierefreie-Informationstechnik-Verordnung (German Accessibility Regulation) |
| WCAG | Web Content Accessibility Guidelines |
| AGB | Allgemeine Geschäftsbedingungen (Terms & Conditions) |
| GoBD | Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern (German bookkeeping standard) |
| TSE | Technische Sicherheitseinrichtung (Technical Security Device — fiscal) |
| RLS | Row Level Security (PostgreSQL) |
| JWT | JSON Web Token |
| SSO | Single Sign-On |
| PWA | Progressive Web App |
| SSR | Server-Side Rendering |
| ISR | Incremental Static Regeneration |
| ERD | Entity-Relationship Diagram |
| CRUD | Create, Read, Update, Delete |
| MVP | Minimum Viable Product |
| SPA | Single Page Application |
| ARIA | Accessible Rich Internet Applications |
| SEPA | Single Euro Payments Area |
| PSD2 | Payment Services Directive 2 |
| SCA | Strong Customer Authentication |

### Domain Terms

| Term | Definition |
|------|-----------|
| Couple | The two people planning their wedding (primary users) |
| Vendor | A wedding service provider (venue, photographer, etc.) |
| Enquiry | A couple's initial contact/request to a vendor |
| Dreamteam | The couple's selected/booked vendor lineup |
| Wedding Homepage | A shareable mini-website for the wedding (invites, RSVP, info) |
| Shortlist | Saved/favorited vendors for comparison |
| Budget Calculator | Tool to estimate and track wedding costs by category |
| Task Template | Pre-built checklist of common wedding planning tasks |
| Guest Group | A logical grouping of guests (family, friends, colleagues) |

---

## Part 5: Next Steps Checklist

### Infrastructure Setup
- [ ] Set up Supabase project (database + auth + storage)
- [ ] Create database tables from Doc 01 schema
- [ ] Configure Row Level Security policies
- [ ] Set up Supabase Auth with email + OAuth providers (Google, Apple, Facebook)
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with design tokens from Doc 05
- [ ] Set up Vercel deployment (preview + production)
- [ ] Configure custom domain + SSL
- [ ] Set up CI/CD pipeline (GitHub Actions → Vercel)

### P0 Implementation (Core MVP)
- [ ] Implement authentication flows (Doc 02 Flow 1, Doc 10 /auth/*)
- [ ] Build user profile & settings pages (Doc 09)
- [ ] Create wedding setup wizard (Doc 02 Flow 2)
- [ ] Build vendor search with filters (Doc 03 SearchBar/FilterBar, Doc 08 Form 9.1-9.2)
- [ ] Build vendor detail page (Doc 03 ImageGallery/TabBar, Doc 04 Screen 5)
- [ ] Implement favorites system
- [ ] Build enquiry/contact flow (Doc 08 Form 3.1-3.2)
- [ ] Implement file upload service (Supabase Storage)
- [ ] Create legal pages (Impressum, Datenschutz, AGB)
- [ ] Implement GDPR compliance (cookie consent, data export, account deletion)
- [ ] Seed vendor categories, regions, cities data

### P1 Implementation (Planning Tools)
- [ ] Build couple dashboard with widgets (Doc 04 Screen 7)
- [ ] Implement budget calculator + wizard (Doc 08 Form 2.1, 5.1-5.2)
- [ ] Build guest list CRUD + CSV import (Doc 08 Form 4.1)
- [ ] Create task checklist with templates (Doc 13 P1.4)
- [ ] Build messaging interface (Doc 03 TabBar + Badge)
- [ ] Implement data export (CSV/PDF)

### Design & Quality
- [ ] Apply design tokens system-wide (Doc 05)
- [ ] Implement micro-interactions and loading states (Doc 06)
- [ ] Build responsive layouts for mobile/tablet (Doc 11)
- [ ] Conduct accessibility audit against WCAG 2.1 AA (Doc 12)
- [ ] Add ARIA labels and keyboard navigation (Doc 12)
- [ ] Test with German locale (de-DE) throughout

### Launch Prep
- [ ] Seed 50+ real vendor profiles for launch market
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Plausible/PostHog)
- [ ] Performance audit (Core Web Vitals targets)
- [ ] Security audit (OWASP top 10)
- [ ] Legal review of all compliance pages
- [ ] Beta testing with 10–20 real couples
- [ ] Launch 🚀

---

*Generated by Claude Code on 2026-02-03 · v1.0.0*
