# Research Files

> Analysis documents from the Bridebook wedding platform study, adapted for EA Platform.

## Source

These 14 documents were generated from analysis of 61 screenshots of the Bridebook.com wedding planning platform (German market, de-DE locale). The research provides a comprehensive reverse-engineering of a production marketplace platform.

## Domain Mapping

**IMPORTANT:** The research uses wedding industry terminology. Map these concepts to EA Platform:

| Bridebook Term | EA Platform Term | Description |
|----------------|------------------|-------------|
| **Vendors** | **Artists + Venues** | Service providers in the marketplace |
| **Couples** | **Organizers** | B2B users who book artists/venues |
| **Couples** | **Customers** | B2C users attending events |
| **Weddings** | **Events/Gigs** | The occasions being planned |
| **Wedding Date** | **Event Date** | Target date for the booking |
| **Budget Calculator** | **Budget Planner** | Financial planning tool |
| **Guest List** | **Attendee List** | Event attendance tracking |
| **Enquiries** | **Booking Requests** | Initial contact for bookings |
| **Favorites** | **Saved Items** | Shortlisted artists/venues |
| **Dream Team** | **Booked Roster** | Confirmed bookings |

## Document Overview

### Core Documents

| # | File | Lines | Key Content |
|---|------|-------|-------------|
| 00 | FULL-ANALYSIS.md | 16,000+ | Master reference combining all docs |
| 01 | DATABASE-SCHEMA.md | 561 | 30+ PostgreSQL tables with DDL |
| 02 | USER-FLOWS.md | 886 | 15+ user journeys |
| 10 | API-STRUCTURE.md | 3,422 | 119 REST endpoints |
| 13 | MVP-PRIORITIES.md | 1,116 | P0-P4 tiers with estimates |

### UI/UX Documents

| # | File | Lines | Key Content |
|---|------|-------|-------------|
| 03 | UI-COMPONENTS.md | 1,120 | 50+ React component specs |
| 04 | WIREFRAMES.md | 1,348 | ASCII box-drawing layouts |
| 05 | DESIGN-TOKENS.md | 840 | CSS variables, Tailwind config |
| 06 | MICRO-INTERACTIONS.md | 2,669 | Animations, transitions |
| 07 | SITEMAP-NAVIGATION.md | 658 | URL structure, nav hierarchy |
| 08 | FORMS-ANALYSIS.md | 739 | Form field specifications |
| 09 | SETTINGS-PAGES.md | 404 | Account settings |
| 11 | RESPONSIVE-DESIGN.md | 938 | Breakpoints, mobile adaptation |
| 12 | ACCESSIBILITY.md | 1,239 | WCAG 2.1 AA compliance |

## Usage Guidelines

### When Planning Features

1. Check the relevant research document first
2. Note the P-tier (P0=MVP, P1=Core, P2=Growth, P3=Scale, P4=Differentiation)
3. Adapt terminology for EA Platform domain
4. Reference the database schema for data modeling

### When Designing UI

1. Review wireframes (04) for layout patterns
2. Check UI components (03) for specifications
3. Use design tokens (05) for consistent styling
4. Follow micro-interactions (06) for animations
5. Ensure accessibility compliance (12)

### When Building APIs

1. Use API structure (10) as reference
2. Follow the endpoint naming conventions
3. Adapt request/response formats as needed
4. Reference database schema (01) for data models

## Key Adaptations for EA Platform

### Artist-Specific Features

- Portfolio/media gallery (beyond vendor photos)
- Genre/style categorization
- Technical requirements (sound, lighting)
- Availability calendar with recurring patterns
- Rate cards by event type

### Venue-Specific Features

- Capacity configurations
- Equipment inventory
- Booking calendar with time slots
- Pricing tiers (weekday/weekend, peak/off-peak)

### Organizer Features

- Multi-event management
- Vendor relationship management
- Contract templates
- Settlement tracking

### Customer Features

- Event discovery
- Ticket purchasing (future)
- Artist following
- Event reviews

## Priority Tiers (From Research)

| Tier | Scope | Endpoints | Tables |
|------|-------|-----------|--------|
| **P0** | Core MVP | 50 | 17 |
| **P1** | Planning Tools | 36 | 7 |
| **P2** | Engagement | 29 | 6 |
| **P3** | Content & Scale | 4 | 0 |
| **P4** | Differentiation | 20+ | 2+ |

## German Market Notes

The research includes German-specific requirements:

- **Legal:** Impressum, Datenschutz, AGB (GDPR compliance)
- **Regions:** Hessen focus with expansion paths
- **Content:** All user-facing content in German
- **Payments:** SEPA, Klarna support planned
