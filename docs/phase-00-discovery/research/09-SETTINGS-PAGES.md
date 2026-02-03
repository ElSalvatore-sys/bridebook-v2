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
