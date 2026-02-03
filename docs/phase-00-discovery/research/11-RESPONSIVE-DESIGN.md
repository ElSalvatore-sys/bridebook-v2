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
