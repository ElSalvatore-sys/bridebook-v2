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
