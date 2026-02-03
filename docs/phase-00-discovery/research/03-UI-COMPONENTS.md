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
