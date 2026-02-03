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
