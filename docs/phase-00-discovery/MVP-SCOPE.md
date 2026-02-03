# MVP Scope (P0 Features)

> Minimum Viable Product features required for initial launch of EA Platform.

---

## MVP Definition

The MVP enables:
1. **Artists** to create profiles and receive booking requests
2. **Venues** to create profiles and receive booking requests
3. **Organizers** to search, save favorites, and send booking requests
4. **All users** to communicate through threaded messaging

The MVP does NOT include:
- Payment processing
- Reviews/ratings
- Public event pages
- Advanced analytics
- Mobile app

---

## P0 Features

### 1. Authentication

| Feature | Description | Complexity |
|---------|-------------|------------|
| Email signup | Register with email + password | M |
| Email login | Login with email + password | S |
| Google OAuth | Login/signup with Google | M |
| Email verification | Verify email before full access | M |
| Password reset | Reset via email link | M |
| Session management | JWT refresh, logout | M |

**Dependencies:** Supabase Auth setup, email service (Resend)

**Tables:** `users`, `user_sessions`, `password_resets`

**Endpoints:** 10

---

### 2. User Profiles

| Feature | Description | Complexity |
|---------|-------------|------------|
| Profile view | View own profile | S |
| Profile edit | Update name, email, avatar | M |
| Account settings | Email preferences, password change | M |
| Account deletion | GDPR-compliant deletion with grace period | M |

**Tables:** `users` (extended)

**Endpoints:** 7

---

### 3. Artist Profiles

| Feature | Description | Complexity |
|---------|-------------|------------|
| Create artist profile | Bio, genres, experience | M |
| Portfolio media | Upload photos, link audio/video | L |
| Service offerings | Event types, rate ranges | M |
| Location/coverage | Service area | S |
| Contact preferences | Booking inquiry preferences | S |

**Tables:** `artists`, `artist_media`, `artist_genres`

**Endpoints:** 8

---

### 4. Venue Profiles

| Feature | Description | Complexity |
|---------|-------------|------------|
| Create venue profile | Name, description, address | M |
| Venue media | Upload photos | M |
| Capacity & features | Size, equipment, amenities | M |
| Operating hours | Regular hours | S |
| Contact preferences | Booking inquiry preferences | S |

**Tables:** `venues`, `venue_media`, `venue_features`

**Endpoints:** 8

---

### 5. Search & Discovery

| Feature | Description | Complexity |
|---------|-------------|------------|
| Artist search | Search artists by criteria | L |
| Venue search | Search venues by criteria | L |
| Category filter | Filter by genre/event type | M |
| Location filter | Filter by city/region | M |
| Price range filter | Filter by rate range | S |
| Search results | Paginated grid/list view | M |
| Artist detail page | Full profile view | L |
| Venue detail page | Full profile view | L |

**Tables:** `categories`, `subcategories`, `regions`, `cities`

**Endpoints:** 12

---

### 6. Favorites

| Feature | Description | Complexity |
|---------|-------------|------------|
| Add to favorites | Save artist/venue | S |
| Remove from favorites | Remove from list | S |
| View favorites | List saved items | S |
| Favorites organization | Notes on saved items | S |

**Tables:** `favorites`

**Endpoints:** 4

---

### 7. Booking Requests

| Feature | Description | Complexity |
|---------|-------------|------------|
| Send booking request | Request to book artist/venue | M |
| View requests received | Artists/venues see incoming | M |
| View requests sent | Organizers see outgoing | M |
| Respond to request | Accept/decline/negotiate | M |
| Request status tracking | Track request lifecycle | M |

**Tables:** `booking_requests`, `booking_request_events`

**Endpoints:** 8

---

### 8. Messaging

| Feature | Description | Complexity |
|---------|-------------|------------|
| Message thread | Conversation per booking request | M |
| Send message | Text message in thread | S |
| Message list | View all conversations | M |
| Unread indicators | Show unread count | S |
| Archive thread | Hide inactive conversations | S |

**Tables:** `messages`, `message_threads`

**Endpoints:** 6

---

### 9. Basic Calendar

| Feature | Description | Complexity |
|---------|-------------|------------|
| Set availability | Mark dates as available/busy | M |
| View availability | Calendar view of status | M |
| Availability in search | Filter by date availability | M |

**Tables:** `availability_slots`

**Endpoints:** 5

---

### 10. File Uploads

| Feature | Description | Complexity |
|---------|-------------|------------|
| Avatar upload | Profile picture | M |
| Media upload | Portfolio images | M |
| File management | View, delete uploads | S |

**Storage:** Supabase Storage

**Endpoints:** 4

---

### 11. Legal & Compliance

| Feature | Description | Complexity |
|---------|-------------|------------|
| Impressum | Legal company info page | S |
| Datenschutz | Privacy policy page | S |
| AGB | Terms of service page | S |
| Cookie consent | Granular cookie banner | M |
| Data export | Download user data (GDPR Art. 20) | M |
| Account deletion | Full data removal (GDPR Art. 17) | M |

**Endpoints:** 2 (export, deletion)

---

## P0 Summary

### Tables (Estimated: 18)

| Category | Tables |
|----------|--------|
| Auth | `users`, `user_sessions`, `password_resets` |
| Profiles | `artists`, `artist_media`, `artist_genres`, `venues`, `venue_media`, `venue_features` |
| Discovery | `categories`, `subcategories`, `regions`, `cities` |
| Booking | `booking_requests`, `booking_request_events`, `favorites` |
| Communication | `messages`, `message_threads` |
| Calendar | `availability_slots` |

### Endpoints (Estimated: 74)

| Category | Count |
|----------|-------|
| Auth | 10 |
| Users | 7 |
| Artists | 8 |
| Venues | 8 |
| Search | 12 |
| Favorites | 4 |
| Booking Requests | 8 |
| Messages | 6 |
| Calendar | 5 |
| Files | 4 |
| Legal/GDPR | 2 |

### UI Components (Estimated: 40+)

| Category | Components |
|----------|------------|
| Layout | Header, Footer, Sidebar, Page layouts |
| Navigation | Tabs, Breadcrumb, Pagination |
| Forms | Input, Select, Textarea, Checkbox, Button |
| Display | Card, Badge, Avatar, Rating (display only) |
| Feedback | Modal, Toast, Loading, Empty state |
| Search | SearchBar, FilterPanel, ResultsGrid |
| Calendar | CalendarView, DatePicker |

---

## Development Timeline (Solo Developer)

| Week | Focus |
|------|-------|
| 1 | Project setup, design system, layout components |
| 2 | Auth flow, user profiles |
| 3 | Artist profiles, media uploads |
| 4 | Venue profiles, categories |
| 5 | Search, filters, detail pages |
| 6 | Booking requests, messaging |
| 7 | Calendar, availability |
| 8 | Legal pages, GDPR, polish |

**Total: ~8 weeks for P0**

---

## Out of Scope for P0

| Feature | Reason | Target Phase |
|---------|--------|--------------|
| Ratings/reviews | Requires completed bookings | P1 |
| Advanced analytics | Need usage data first | P1 |
| Team accounts | Complex permissions | P2 |
| Public event pages | Growth feature | P2 |
| Payment processing | Requires legal/compliance | P3 |
| AI recommendations | Needs data for ML | P4 |

---

## Launch Criteria

### Must Have

- [ ] 50+ artist profiles (can be seeded)
- [ ] 20+ venue profiles (can be seeded)
- [ ] End-to-end booking request flow working
- [ ] Email notifications for booking requests
- [ ] All legal pages live and lawyer-reviewed
- [ ] Cookie consent functioning
- [ ] Core Web Vitals passing
- [ ] Error monitoring active (Sentry)
- [ ] Mobile responsive

### Should Have

- [ ] Google OAuth working
- [ ] 5+ categories with subcategories
- [ ] Search filters working
- [ ] Favorites functionality
- [ ] Message threading

### Nice to Have

- [ ] Calendar availability filtering
- [ ] Rich media in profiles (video embeds)
- [ ] Search suggestions/autocomplete
