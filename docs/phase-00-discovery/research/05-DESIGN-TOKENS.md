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
