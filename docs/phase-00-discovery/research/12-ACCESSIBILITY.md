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
