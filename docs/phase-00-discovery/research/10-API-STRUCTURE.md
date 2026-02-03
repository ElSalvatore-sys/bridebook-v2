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
