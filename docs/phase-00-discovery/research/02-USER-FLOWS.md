# Bridebook Wedding Platform — User Flows

> Comprehensive documentation of all user-facing flows derived from 61 platform screenshots.
> German-language UI (locale: `de-DE`). All labels reflect the live platform text.

---

## Table of Contents

1. [Onboarding & Authentication](#1-onboarding--authentication)
2. [Vendor Discovery & Search](#2-vendor-discovery--search)
3. [Enquiry & Booking](#3-enquiry--booking)
4. [Favorites Management](#4-favorites-management)
5. [Planning Tools](#5-planning-tools)
6. [Settings & Account](#6-settings--account)
7. [Wedding Homepage (Hochzeitshomepage)](#7-wedding-homepage-hochzeitshomepage)
8. [Additional / Inferred Flows](#8-additional--inferred-flows)

---

## Screenshot → Flow Mapping

| # | Screenshot File | Flow Section |
|---|----------------|-------------|
| 1 | `landing page. .png` | 1 — Onboarding |
| 2 | `Sign up modal (Google:Apple:Email options).png` | 1 — Onboarding |
| 3 | `Main dashboard overview (countdown, progress, quick actions).png` | 1 — Onboarding |
| 4 | `homepage pt2.png` | 2 — Vendor Discovery |
| 5 | `homepage pt3.png` | 2 — Vendor Discovery |
| 6 | `homepaget pt4.png` | 2 — Vendor Discovery |
| 7 | `location und dienstleister.png` | 2 — Vendor Discovery |
| 8 | `location pt2 the map view and locations.png` | 2 — Vendor Discovery |
| 9 | `location pt3 budget firendly.png` | 2 — Vendor Discovery |
| 10 | `locaiton pt4.png` | 2 — Vendor Discovery |
| 11 | `location und dienstleister filters.png` | 2 — Vendor Discovery |
| 12 | `location und dienstleister filters pt2.png` | 2 — Vendor Discovery |
| 13 | `location und dienstleister filters pt3.png` | 2 — Vendor Discovery |
| 14 | `location und dienstleister filters pt4.png` | 2 — Vendor Discovery |
| 15 | `location und dienstleister filters PT 5.png` | 2 — Vendor Discovery |
| 16 | `location - catering.png` | 2 — Vendor Discovery |
| 17 | `location - florists.png` | 2 — Vendor Discovery |
| 18 | `location - photograph.png` | 2 — Vendor Discovery |
| 19 | `location - transport.png` | 2 — Vendor Discovery |
| 20 | `locatons when pressed and trying to book the email with template.png` | 3 — Enquiry |
| 21 | `location when venue is clicked email template and message pt 2.png` | 3 — Enquiry |
| 22 | `locaiton when venue is choosen the email template the edit button to edit information.png` | 3 — Enquiry |
| 23 | `messages pt1.png` | 3 — Enquiry |
| 24 | `messages pt2.png` | 3 — Enquiry |
| 25 | `messages pt3.png` | 3 — Enquiry |
| 26 | `messages pt4.png` | 3 — Enquiry |
| 27 | `favourites.png` | 4 — Favorites |
| 28 | `favourites when favourites hinzufugen is clicked.png` | 4 — Favorites |
| 29 | `planungs pic.png` | 5 — Planning Tools |
| 30 | `PLANUNGS tool pt2.png` | 5 — Planning Tools |
| 31 | `planungs tool pt3.png` | 5 — Planning Tools |
| 32 | `planungs tool pt4.png` | 5 — Planning Tools |
| 33 | `planungs tool pt5.png` | 5 — Planning Tools |
| 34 | `planungs tool budget icon pt 1 .png` | 5 — Budget |
| 35 | `planungs tool budget icon pt 2.png` | 5 — Budget |
| 36 | `planungs tool budget icon after budget inserted pt1.png` | 5 — Budget |
| 37 | `planungs tool budget icon after budget inserted pt2.png` | 5 — Budget |
| 38 | `planungs tool budget icon after budget inserted pt3.png` | 5 — Budget |
| 39 | `planungs tool budget icon after budget inserted pt4.png` | 5 — Budget |
| 40 | `planungs tool budget icon after budget inserted pt5.png` | 5 — Budget |
| 41 | `planungs tool budget icon after budget inserted and again hochzeit is pressed .png` | 5 — Budget |
| 42 | `planungs tool budget icon after budget inserted and hochzeit is clicked and the buttom look for venues is pressed.png` | 5 — Budget |
| 43 | `planungstool gästelist.png` | 5 — Guest List |
| 44 | `planungstool gäästelist when clciked.png` | 5 — Guest List |
| 45 | `planungstool ratschlag pt 1.png` | 5 — Advice |
| 46 | `planungstool ratschlag pt 2.png` | 5 — Advice |
| 47 | `planungstool ratschlag pt 3.png` | 5 — Advice |
| 48 | `settings pt1.png` | 6 — Settings |
| 49 | `settings pt2.png` | 6 — Settings |
| 50 | `settings pt3.png` | 6 — Settings |
| 51 | `settings pt4.png` | 6 — Settings |
| 52 | `settings pt5.png` | 6 — Settings |
| 53 | `hochzeit home page pt1.png` | 7 — Wedding Homepage |
| 54 | `hochzeit home page pt2.png` | 7 — Wedding Homepage |
| 55 | `hochzeit home page pt4.png` | 7 — Wedding Homepage |
| 56 | `hochzeit home page pt5.png` | 7 — Wedding Homepage |
| 57 | `hochzeit home page pt6.png` | 7 — Wedding Homepage |
| 58 | `hochzeit home page pt7.png` | 7 — Wedding Homepage |
| 59 | `hochzeit home page design pt1.png` | 7 — Wedding Homepage |
| 60 | `hochzeit home page design pt2.png` | 7 — Wedding Homepage |
| 61 | `hochzeit home page einstellung.png` | 7 — Wedding Homepage |

**All 61 screenshots accounted for.**

---

## 1. Onboarding & Authentication

**Screenshots:** `landing page. .png`, `Sign up modal (Google:Apple:Email options).png`, `Main dashboard overview (countdown, progress, quick actions).png`

### 1.1 First Visit (Unauthenticated)

```
Step 1: Landing Page → User arrives at bridebook.com → System displays:
  - Hero banner: "Finde deine Traumlocation" with "Los geht's" CTA
  - Right panel: "El & Eli" couple widget with countdown (Tage/Std/Min/Sek)
  - Search bar: Region (Deutschland) + Kategorie (Hochzeitslocations) + "Suche" button
  - "Suche nach Dienstleister Namen" text link below search
  - Quick-link cards: Checkliste, Hochzeitshomepage, Gästeliste, Favoriten, Gebucht
  - Top nav: Locations & Dienstleister ▼, Planungs-Tools ▼, Inspiration, Hochzeitshomepage
  → Step 2
```

```
Step 2: User Action Decision
  IF user clicks "Los geht's" or any authenticated feature → Step 3
  IF user clicks "Suche" → Flow 2 (Vendor Discovery), Step 1
  IF user clicks a quick-link card → Respective flow (each shows "Loslegen" for unconfigured items)
```

### 1.2 Sign Up / Login

```
Step 3: Sign-Up Modal → System displays "Einloggen" page with:
  - Email field (text input)
  - "Mit Apple einloggen" button
  - "Mit Google einloggen" button
  - "Mit E-mail einloggen" button
  - Right panel: QR code ("Scanne den QR Code um jederzeit und von überall auf
    Bridebook zuzugreifen") + wedding photo gallery
  → Step 4

Step 4: Authentication
  IF user selects Apple → System redirects to Apple OAuth → returns with session → Step 5
  IF user selects Google → System redirects to Google OAuth → returns with session → Step 5
  IF user selects Email → System shows email/password form → Step 5
  IF authentication fails → System shows error inline → remains on Step 3
```

### 1.3 Post-Login Dashboard

```
Step 5: Personalized Dashboard → System displays same layout as landing page but with:
  - Personalized couple names: "El & Eli"
  - Countdown widget: "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek"
  - "Klick auf mich" prompt on countdown (clickable to set wedding date)
  - Quick-links now show status counts: "Favoriten (4 gespeichert)", "Gebucht (0 Dienstleister)"
  - Top-right icons: 💬 (messages), ♡ (favorites), ⚙ (settings)
  → User proceeds to any flow
```

### 1.4 No Separate Profile Wizard

Profile data (names, partner name, wedding date, location, roles) is collected via **Settings > Meine Hochzeitsdetails** (see Flow 6). There is no onboarding wizard — the platform is immediately usable after authentication.

---

## 2. Vendor Discovery & Search

**Screenshots:** `homepage pt2–pt4`, `location und dienstleister*`, `location pt2–pt4`, `location - catering/florists/photograph/transport`

### 2.1 Entry Points

```
Step 1: Entry Decision
  IF user clicks "Suche" button on homepage search bar → Step 2 (Search Results)
  IF user clicks "Los geht's" hero CTA → Step 2 (Search Results for Hochzeitslocations)
  IF user clicks vendor category card on homepage → Step 2 (filtered by category)
  IF user clicks "Suche nach Dienstleister Namen" → Step 2 with name-search focus
  IF user clicks "Beliebte Locations in deiner Nähe" card → Step 3 (Vendor Detail)
```

### 2.2 Search Results (List + Map Split View)

```
Step 2: Search Results Page → System displays:
  - Header: "[count] Hochzeitslocations rundum Deutschland"
  - Left panel: Vendor cards with:
    - Photo thumbnail
    - Vendor name + location
    - Star rating (e.g., "5.0 ★ (20)")
    - "Broschüre anfragen" button (purple)
    - "Besichtigungstermine verfügbar" badge (where applicable)
  - Right panel: Interactive map with location pins
  - Top: Filter bar (see Step 4) + result count badge ("10694 Ergebnisse anzeigen")
  - Active filter chips shown inline (e.g., "Schlafbar ✕")
  → Step 3 (click vendor) OR Step 4 (apply filters) OR Step 5 (switch category)
```

### 2.3 Filter Panel

```
Step 4: Filter Panel → User clicks "Filter" or scrolls filter area → System shows:
  - Preiskategorie: Erschwinglich (€), Mäßig (€€), Luxuriös (€€€), Super Luxuriös (€€€€)
  - Gästeanzahl: Bis zu 30, 30+, 50+, 80+, 100+, 150+, 200+ Gäste
  - Deine Must-Haves: Exklusive Nutzung, Unterbringung vor Ort, Ausschankgenehmigung
  - Anzahl an Schlafzimmern (numeric)
  - Art von Location: 20+ checkboxes (Bauernhof, Burg/Schloss, Garten, Hotel, Scheune, etc.)
  - Location Stil: 18+ checkboxes (Bohemien, Glamourös, Historisch, Modern, Rustikal, etc.)
  - Location Features: 15+ checkboxes (Außenbereich, Brautsuite, Kamin, Tanzfläche, etc.)
  - Essen und Trinken (options)
  - Sonderangebot (toggle)
  - Besichtigungen (toggle)
  - Kulturspezialität (options)
  - Diversität & Inklusion (options)
  → User checks options → clicks "Ergebnisse anzeigen" → returns to Step 2 with filtered results
  → "Filter zurücksetzen" clears all → returns to Step 2 unfiltered
```

### 2.4 Category Switching

```
Step 5: Category Results → System displays category-specific results pages:
  - Catering → "location - catering.png"
  - Florists → "location - florists.png"
  - Fotografie → "location - photograph.png"
  - Transport → "location - transport.png"
  Each page has same list+map layout with category-specific vendor cards.
  Filters adapt to category (e.g., no "Schlafzimmer" for florists).
  → Step 3 (click vendor) OR Step 4 (filter) OR Step 5 (switch again)
```

### 2.5 Homepage Discovery Sections

```
Step 6: Homepage Scroll Sections (below search bar):
  - "Beliebte Locations in deiner Nähe": horizontal carousel of 4 venue cards
    (VONACHT, Die Edelscheune, ACHTWERK Events GmbH, Hofgut Maisenburg)
    Each card: photo, name, location, rating stars, review count
  - "Beliebte Location Arten in Deutschland": grid of location type cards
  - "Hochzeitslocations erkunden": worldwide destination grid
  - "Budget-friendly" filtered link
  → Click any card → Step 2 (filtered) or Step 3 (vendor detail)
```

### 2.6 Budget-Friendly Results

```
Step 7: Budget-Friendly Page → System shows search results pre-filtered for
  Preiskategorie: Erschwinglich (€)
  Same list+map layout as Step 2
  → User can further filter or click vendor → Step 3
```

---

## 3. Enquiry & Booking

**Screenshots:** `locatons when pressed and trying to book the email with template.png`, `location when venue is clicked email template and message pt 2.png`, `locaiton when venue is choosen the email template the edit button to edit information.png`, `messages pt1–pt4`

### 3.1 Enquiry Modal

```
Step 1: Vendor Card → User clicks "Broschüre anfragen" on any vendor card → System opens modal:
  "Nachricht an: [VENDOR NAME]"
  - Subtext: "Wir geben eure Daten weiter, damit der Dienstleister sich direkt an euch wenden kann.
    Paare schicken im Durchschnitt mindestens 7 Anfragen."
  - Pre-filled fields (read-only, pencil ✏ icon to edit):
    - E-Mail: [user email]
    - Tel. Nr.: [leer]
    - Vor- und Nachnamen: [couple names]
    - Ideales Datum: [leer]
    - Geschätzte Gästeanzahl: [leer]
  - Checkboxes "Welche Infos möchtet ihr erhalten?":
    ☑ Allgemeine Informationen
    ☐ Preise und Pakete
    ☐ Verfügbarkeit
    ☐ Termin zur Besichtigung
    ☐ Andere
  - "+ Persönliche Nachricht schreiben" expandable link
  - Purple CTA: "Broschüre anfragen"
  → Step 2 (edit data) OR Step 3 (send)
```

### 3.2 Edit Contact Data

```
Step 2: "Daten bearbeiten" Modal → User clicks pencil icon → System shows edit form:
  - E-Mail* (editable text field)
  - Tel. Nr.* with country flag picker (🇩🇪 +49)
  - Dein Name* (text field, pre-filled)
  - Name deines Partners / deiner Partnerin* (text field, pre-filled)
  - Geschätzte Gästeanzahl* (number input with stepper)
  - Ideales Datum* (date picker: "Hochzeitsdatum")
  - "Informationen speichern" purple CTA
  - "Speichern" text link top-right
  → User saves → returns to Step 1 with updated fields
  IF required fields empty → inline validation error → remains on Step 2
```

### 3.3 Send Enquiry

```
Step 3: User clicks "Broschüre anfragen" → System:
  - Sends enquiry to vendor via Bridebook messaging system
  - Shows success confirmation
  - Creates conversation thread in Messages (Flow 3.4)
  - Vendor added to "Gebucht" tracking if applicable
  → Messages inbox
```

### 3.4 Messages Inbox

```
Step 4: Messages Page ("Nachrichten") → System displays:
  - Tabs: Dienstleister | Gäste | Bridebook | Archiviert
  - IF no messages → Empty state: "Noch keine Nachrichten"
    Subtext: "Wenn ihr einer Location oder einem Dienstleister über Bridebook eine
    Nachricht schickt, wird eure Unterhaltung hier angezeigt."
  - IF messages exist → Conversation list with vendor name, last message preview, timestamp
  → User clicks conversation → Thread view with message history
```

### 3.5 Guest Messaging

```
Step 5: Messages > Gäste tab → System shows:
  - Instructions for collecting guest emails via unique shareable link
  - "Adresse anfordern" feature linked to Guest List
  → User shares link → Guests submit contact info → appears in guest list
```

---

## 4. Favorites Management

**Screenshots:** `favourites.png`, `favourites when favourites hinzufugen is clicked.png`

### 4.1 Favorites Page

```
Step 1: "Deine Dienstleister" Page → System displays:
  - Header: ♡ "Deine Dienstleister" + "+ Favorit hinzufügen" button (purple, top-right)
  - Tabs: Locations | Dienstleister | Gebucht
  - IF no favorites saved:
    - "Hochzeitslocations (0)"
    - Empty state icon (magnifying glass)
    - "Hier werden deine favorisierten Locations gespeichert!"
    - Purple CTA: "🔍 Locations entdecken"
    - Text link: "Neuen Favoriten hinzufügen +"
  - Bottom banner: "Teilt Favoriten mit einander, hinterlasst Kommentare und
    erhaltet sofortiges Feedback" + "Partner/in einladen" button (purple outline)
  → Step 2 (add favorite) OR click "Locations entdecken" → Flow 2 (Vendor Discovery)
```

### 4.2 Add Favorite Modal

```
Step 2: "Zu Favoriten hinzufügen" Modal → System displays:
  - Search field: "Gib den Namen eures Dienstleisters ein:" with "🔍 Dienstleister suchen" placeholder
  - Search results appear as user types (autocomplete from Bridebook database)
  - IF vendor not found:
    - "Du findest deinen Dienstleister nicht?"
    - "Manuell hinzufügen" link → manual entry form
    - "Auf Google suchen" link → Google search integration
  → User selects vendor → vendor added to favorites list → returns to Step 1
  → User clicks ✕ → modal closes → returns to Step 1
```

### 4.3 Favorites in Planning Tools

Favorites also appear on the Planning Tools page as "Dreamteam" cards:
- Hochzeitslocations, Fotograf, Florist cards with "Dienstleister hinzufügen" links
- These link directly to the Favorites system

---

## 5. Planning Tools

**Screenshots:** `planungs pic.png`, `PLANUNGS tool pt2–pt5`, `planungs tool budget icon*`, `planungstool gästelist*`, `planungstool ratschlag*`

### 5.1 Planning Hub

```
Step 1: Planungs-Tools Page → System displays:
  - Left panel: Couple card ("El & Eli", Deutschland, "Noch kein Hochzeitsdatum")
    - "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek" + "Los geht's" CTA
  - Center: "Beginnt mit eurer Checkliste" hero with phone mockup + "Loslegen" CTA
  - "Plane mit deinem Partner / deiner Partnerin" banner + "Partnerin einladen" button
  → Step 2 (Planning Grid)

Step 2: Planning Grid → 6 cards:
  | Card | Description | CTA |
  |------|-------------|-----|
  | Budget | "Behaltet euer Budget im Auge" | Loslegen |
  | Gästeliste | "Verwaltet eure Gästeliste – fügt eure Zu-/Absagen" | Loslegen |
  | Homepage | "Eure persönliche Website für Gäste" | Loslegen |
  | Gebucht | "Gebuchte Dienstleister hinzufügen" | Loslegen |
  | Inspiration | "Speichert Fotos, Notizen & Ideen" | Loslegen |
  | Ratschläge | "Nützliche & inspirierende Tipps für euren großen Tag" | Loslegen |
  → User clicks a card → respective sub-flow below
```

### 5.2 Planning Milestones

```
Step 3: Below the grid, system shows milestone tracker:
  - "Genau auf dem richtigen Weg" (on track)
  - "Dream Team" (vendor team assembled)
  - "Eure Favoriten" (favorites saved)
  - "Der erste Gast" (first guest added)
  - "Sieht gut aus" (looking good)
  - "Glückwunsch!" (congratulations)
  Milestones unlock progressively as user completes actions.
```

### 5.3 Vendor Discovery Cards (in Planning)

```
Step 4: "Findet die perfekten Dienstleister" section:
  - Cards: Beauty Team, Fotografie Stil, Traumtorte
  - Each card links to vendor search for that category → Flow 2
```

---

### 5A. Budget Tool

```
Step B1: Budget Wizard → User clicks "Budget" card → System displays:
  - Header: "Lass uns euer Hochzeitsbudget berechnen!"
  - Subtext: "Die Algorithmen von Bridebook berechnen euer Budget basierend auf euren
    Präferenzen und tausend anderen Brautpaaren. Seid ihr bereit?"
  - Fields:
    - "Gebt euer Hochzeitsbudget ein:" € input + "EUR - Euro" currency selector
    - "Wie viele Gäste werden am Hochzeitsempfang teilnehmen?"
      Chips: Unentschlossen | Weniger als 50 | 50-99 | 100-149 | 150-250 | Mehr als 250
    - "An welchem Wochentag findet eure Hochzeit statt?"
      Chips: Unentschlossen | Mo.-Do. | Freitag | Samstag | Sonntag
    - "Zu welcher Jahreszeit findet eure Hochzeit statt?"
      Chips: Unentschlossen | Hochsaison (Mai bis Sep) | Nebensaison (andere Monate) | Weihnachtszeit
    - "Für wann ist eure Hochzeit geplant?"
      Chips: Unentschlossen | 2026 | 2027 | 2028 | 2029 und später
    - "Wählt optionale Kategorien, die ihr im Budget DABEI haben wollt:"
      Toggles: Videograf, Planer, Live-Band, Versicherung, Entertainer, Papeterie
  - CTA: "Mein Hochzeitsbudget berechnen" (purple)
  → Step B2

Step B2: Loading Animation → System displays:
  - Camera icon animation
  - "Zahlenverarbeitung im Gange" text
  - Animated dots (blue, pink, green, yellow)
  → Calculation completes → Step B3

Step B3: Budget Breakdown ("Budgetaufschlüsselung") → System displays:
  - Header row: Maximales Budget (e.g., 50.000 €) | Geschätzte Kosten (50.000 €) | Kosten bisher (0 €)
  - "Budget zurücksetzen" button (outline) | "+ Neues Element hinzufügen" button (purple)
  - Edit icon (✏) next to Maximales Budget for quick adjustment

  Category: "Hochzeitslocations & Dienstleister"
    | Item | Estimated | Actual | Action |
    |------|-----------|--------|--------|
    | Hochzeitslocation | zirka 12.624 € | 0 € | > expand |
    | Florist | zirka 2.770 € | 0 € | > expand |
    | Fotograf | zirka 2.450 € | 0 € | > expand |
    | Catering (Essen und Trinken) | zirka 12.676 € | 0 € | > expand |
    | Musik | zirka 4.101 € | 0 € | > expand |
    | Torte | zirka 639 € | 0 € | > expand |
    | Transport | zirka [amount] | 0 € | > expand |
    | Dekoration | zirka [amount] | 0 € | > expand |
    | Festzelt | zirka [amount] | 0 € | > expand |
    | Planer | zirka [amount] | 0 € | > expand |
  Each row has "🔍 Dienstleister suchen" link → Flow 2 (Vendor Discovery)

  Category: "Hochzeitskleidung & Accessoires"
    - Brautmode, Herrenbekleidung, Ringe, Beauty

  Category: "Zusätzliches"
    - Heiratslizenz, Versicherung, Suite, Gastgeschenke, Flitterwochen, Bekanntmachungen

  Category: "Andere"
    - Extras
  → Step B4 (expand item) OR Step B5 (reset) OR Step B6 (add element)

Step B4: Item Detail Panel → User clicks expand arrow (>) → System shows:
  - Element name (editable)
  - "Zirka" estimated amount
  - "Gebucht" actual amount (editable)
  - Notes text field
  - "Speichern" button (purple)
  - "Dieses Element löschen" destructive link (red text)
  → User edits and saves → Kosten bisher updates → returns to Step B3
  IF user deletes → confirmation → item removed → returns to Step B3

Step B5: Budget Reset → User clicks "Budget zurücksetzen" →
  System shows confirmation dialog →
  IF confirmed → all budget data cleared → returns to Step B1
  IF cancelled → returns to Step B3

Step B6: Add New Element → User clicks "+ Neues Element hinzufügen" →
  System adds blank row to current category →
  User fills in name + amounts → saves → row persists in Step B3
```

### 5B. Guest List Tool

```
Step G1: Guest List Empty State → User clicks "Gästeliste" card → System displays:
  - Header: 👥 "Gästeliste"
  - Illustration: two hearts
  - "Lass uns ein paar Freunde zu deiner Gästeliste hinzufügen!"
  - Subtext: "Verwalte deine Zu-/Absagen, Adressen, Tischnummern und vieles mehr und
    exportiere sie später ganz einfach!"
  - Purple CTA: "Füge deine ersten Gäste hinzu ⊕"
  - Text link: "Oder sieh dir deine leere Gästeliste an"
  → Step G2 (add guests) OR click text link → empty table view

Step G2: Add Guests Modal → System displays:
  - "Füge mehrere Gäste gleichzeitig hinzu"
  - Kategorie dropdown: "Els Gäste" (group selector, e.g., Bride's guests, Groom's guests)
  - "Namen hinzufügen" text area with placeholder examples:
    "z.B. Monica & Chandler
     Rachel
     Phoebe
     Joey
     Ross"
  - Help text: "Gib jedem neuen Gast eine neue Zeile.
    Setze ein '&' Symbol zwischen die Namen der Gäste,
    um sie als Paar/Familie zu verknüpfen. z.B. Harry &
    Meghan & Archie"
  - "Speichern" button (purple)
  → User enters names → clicks Speichern → guests added to list → guest list table view
  → User clicks ✕ → returns to Step G1
```

### 5C. Checklist

```
Step C1: Checklist Entry → User clicks "Checkliste" from quick-links or planning hub →
  System displays: "Beginnt mit eurer Checkliste" hero with phone mockup
  - "Die To-Do-Liste voller Ratschläge erwartet euch"
  - "Loslegen" CTA (purple)
  → User clicks Loslegen → checklist task list (not captured in detail in screenshots)
```

### 5D. Advice / Inspiration (Ratschläge)

```
Step R1: Advice Page → User clicks "Ratschläge" or "Inspiration" nav item → System displays:
  - Header: "Lass dich inspirieren" (large serif font)
  - Subtext: "Von der Aufteilung eures Budgets zur Auswahl eurer Traumlocation, bringen wir
    Freude in eure Hochzeitsplanung..."
  - Category tabs: Alle | Allgemeine Ratschläge | Expertenberatung | Hochzeitsbudget |
    Gäste | Zeremonie | Nach der Hochzeit | Echte Hochzeit | Dienstleister
  - Article cards with:
    - Hero image
    - Title (e.g., "Erinnerungen für die Ewigkeit – mit Voicestories")
    - Category tags (e.g., "Allgemeine Ratschläge > Expertenberatung")
  → User clicks tab → filters articles by category
  → User clicks article card → full article page
```

---

## 6. Settings & Account

**Screenshots:** `settings pt1–pt5`

### 6.1 Settings Navigation

```
Step 1: Settings Page → User clicks ⚙ icon (top-right) → System displays:
  - Header: "Einstellungen"
  - Subtext: "Verwaltet hier alles, was mit eurem Account zu tun hat"
  - Left sidebar navigation:
    - 💻 Meine Account-Daten (default active)
    - 📋 Meine Hochzeitsdetails
    - 📡 Teilt eure Hochzeit
    - ❓ Kundenservice
    - [Ausloggen] button (bottom)
  → User clicks a section → respective step below
```

### 6.2 Account Data (Meine Account-Daten)

```
Step 2: Account Data Section → System displays:
  - "Dein Profilbild": circular upload area ("Füge ein Foto hinzu") + "Hochladen" button
  - "Meine Kontakt E-Mail Adresse":
    - Help text: "Die E-Mail-Adresse, über die unsere Dienstleister euch kontaktieren werden
      (Bitte gebt sie sorgfältig ein)"
    - E-Mail field (pre-filled) + "Speichern" button (purple)
  - "Meine Login-Methoden":
    - "E-Mail Login-Methode hinzufügen" button (purple)
    - "Deine sozialen Login-Methoden:"
      - "f Mit Facebook verbinden" button
      - "G Mit Google-Konto verbinden" button
  - "Sprache ändern": Dropdown → "Deutsch (Deutschland)" ▼
  - "Account löschen":
    - Warning: "Durch diese Aktion werden euer Konto und alle gespeicherten Inhalte
      endgültig gelöscht. Dies kann nicht rückgängig gemacht werden."
    - "Konto löschen" button (red outline, destructive)
  - Footer: "App Version: Bridebook bb-web | 33.39.0"
  → Step 2a (delete account)

Step 2a: Account Deletion
  IF user clicks "Konto löschen" → System shows confirmation dialog with warning →
  IF confirmed → Account and all data permanently deleted → redirect to landing page
  IF cancelled → returns to Step 2
```

### 6.3 Wedding Details (Meine Hochzeitsdetails)

```
Step 3: Wedding Details Section → System displays:
  - Name: text field (pre-filled, e.g., "El")
  - Partner/in Name: text field (e.g., "Eli")
  - Role checkboxes for each person: ☐ Braut ☐ Bräutigam ☐ Andere
  - Standort: text field (e.g., "Deutschland")
  - Hochzeitsdatum: date picker ("Datum auswählen") with calendar icon
  - Land auswählen: dropdown with flag (🇩🇪 Deutschland)
  - Währung: dropdown ("EUR - Euro")
  - "Meine Währung ändern" text link below currency
  → User edits any field → changes auto-save or explicit save
```

### 6.4 Share Wedding (Teilt eure Hochzeit)

```
Step 4: Share Wedding Section → System displays:
  - "Teammitglieder":
    - Help text: "Lade deine Partner:in, Freunde und Familie zur Planung ein.
      Sie können auf deine Hochzeitsinfos zugreifen / sie bearbeiten und
      erhalten auch E-Mail-Updates."
    - Partner/in Name field (pre-filled, e.g., "Eli")
    - Role checkboxes: ☐ Braut ☐ Bräutigam ☐ Andere
    - "Teammitglieder einladen" button (purple)
  - "Teilt eure Hochzeitsdetails":
    - Instructions about sharing via "Adresse anfordern" function
    - "Ladet die Bridebook-App herunter & erstellt eure Hochzeitshomepage!"
    - App Store badge + Google Play badge + QR code
  → User clicks "Teammitglieder einladen" → sends invite email to partner
```

### 6.5 Customer Service (Kundenservice)

```
Step 5: Customer Service Section → System displays:
  - "Hilfe":
    - "Das Support-Team ist hier, damit dein Bridebook reibungslos läuft.
      Brauchst du Hilfe? Kontaktiere uns bitte!"
    - "Hilfe holen" button (purple)
  - "Feedback":
    - "Wir freuen uns, von dir zu hören und wollen uns immer verbessern.
      Klicke unten, um dein Feedback zu senden!"
    - "Gib uns Feedback" button (purple)
  → "Hilfe holen" → opens support contact form / help center
  → "Gib uns Feedback" → opens feedback form
```

---

## 7. Wedding Homepage (Hochzeitshomepage)

**Screenshots:** `hochzeit home page pt1–pt7`, `hochzeit home page design pt1–pt2`, `hochzeit home page einstellung.png`

### 7.1 Homepage Editor — Details Tab

```
Step 1: Hochzeitshomepage → User clicks "Hochzeitshomepage" in nav → System displays:
  - Header: 🌐 "Hochzeitshomepage"
  - URL display: "bridebook.com/de/for/eure-einzigartige-Adresse" + copy icon
  - Status badge: "Nicht veröffentlicht"
  - Action buttons: "Teilen" (outline) + "Veröffentlichen" (purple, filled)
  - 3 tabs: Details | Design | Einstellungen
  - Right panel: Live preview with mobile/desktop toggle (📱 💻) + "Vorschau ▷" link

  Details tab sections (collapsible accordion):
  → Step 2 (edit sections)

Step 2: Details Tab Sections:

  2a. "Eure Namen*" (expanded by default):
    - "Dein Name*": text field (e.g., "El")
    - "Der Name deines Partners*": text field (e.g., "Eli")
    - "Speichern" button (purple)
    → Preview updates with couple names in chosen font

  2b. "Hochzeitsdatum" (collapsible):
    - Date field: "Hochzeitsdatum hinzufügen"
    - "Speichern" button
    → Preview shows "Datum wird noch bekannt gegeben" if empty

  2c. "Hochzeitslocation" (collapsible):
    - Location field: "Bitte gebt ein Hochzeitsdatum ein, um eure Location hinzuzufügen"
    - ☑ "Verwendet Fotos von eurer Hochzeitslocation" toggle
    - "Speichern" button
    → Preview shows "Location wird noch angegeben" if empty

  2d. "Fotos" (collapsible):
    - Photo upload area / gallery grid
    → User uploads photos → appear in preview gallery

  2e. "Zu-/Absagen" (RSVP) (collapsible):
    - Prompt to add guests first (links to Guest List tool)
    → Requires guests in guest list to enable RSVP

  2f. "Fragen" (FAQ) (collapsible):
    - FAQ entries for guests
    - Example entries visible in preview:
      "Gibt es einen Dresscode?" → "Stellt euch eine sommerliche Gartenparty vor..."
      "Gibt es Parkplätze vor Ort?" → "Ja, vor der Location stehen Parkplätze zur Verfügung."
    → User adds/edits FAQ items

  2g. "Unsere Geschichte" (collapsible):
    - Rich text area for couple's story
    → Preview shows story section with uploaded photo

  2h. "Zeitplan" (Timeline) (collapsible):
    - Event timeline entries (ceremony time, reception, etc.)
    → User adds timeline events

  2i. "Hochzeitswunschliste" (Registry) (collapsible):
    - Registry URL field
    - Amazon integration option
    → Preview shows registry link

  2j. "Nachricht an die Gäste" (collapsible):
    - Text area for a personal message to guests

  2k. "Unterkünfte" (Accommodations) (collapsible):
    - Nearby hotel suggestions
    - Preview shows: "Um eure Reise noch bequemer zu machen, empfehlen wir euch
      Unterkünfte in der Nähe unserer Location!" + "Lokale Hotels entdecken" button
```

### 7.2 Homepage Editor — Design Tab

```
Step 3: Design Tab → User clicks "Design" tab → System displays:
  - "Design" section (collapsible, expanded):
    - Theme grid: 6+ design templates arranged in 3 rows of 2
      - Each template shows couple names in different styles/fonts
      - Color dots below first row (blue, green, pink, teal) for color variants
      - Themes include: Modern minimalist, Floral watercolor, Botanical green,
        Script elegant, Bold serif, Deep red classic
    - Font selector: 6 font options (shown in different templates)
  - Right panel: Live preview updates in real-time as user selects theme
  → User clicks a theme → preview instantly updates
  → User clicks color dot → theme color variant changes
```

### 7.3 Homepage Editor — Einstellungen Tab

```
Step 4: Einstellungen (Settings) Tab → User clicks "Einstellungen" tab → System displays:
  - "URL der Website":
    - Text field: "eure-einzigartige-Adresse" (editable slug)
    - Help text: "Euer Link wird hier verfügbar sein, sobald ihr eure Homepage veröffentlicht habt"
  - "Veröffentlicht": Toggle switch (OFF by default)
  - "Homepage-Passwort": Toggle switch (OFF by default)
    → IF enabled → password field appears for setting guest access password
  - "Fertig" button (purple)
  → User customizes URL → toggles publish → clicks Fertig
```

### 7.4 Publish Flow

```
Step 5: Publishing → User clicks "Veröffentlichen" button (header) →
  IF all required fields filled (names) → Homepage goes live at custom URL
    Status badge changes from "Nicht veröffentlicht" → "Veröffentlicht"
    "Teilen" button becomes active for sharing URL
  IF required fields missing → System highlights missing sections
  → Published homepage visible to guests at bridebook.com/de/for/[custom-slug]
```

---

## 8. Additional / Inferred Flows

These flows are inferred from UI elements visible across screenshots but do not have dedicated screenshot coverage.

### 8.1 Logout

```
Step 1: User navigates to Settings (⚙) → sees "Ausloggen" button in left sidebar
Step 2: User clicks "Ausloggen" → System clears session/cookies
Step 3: System redirects to landing page (unauthenticated state)
  → All personalized data (countdown, favorites count) no longer visible
  → Quick-link cards reset to generic "Loslegen" state
```

### 8.2 Password Reset (Inferred)

```
Step 1: Sign-up/Login modal → User selects "Mit E-mail einloggen"
Step 2: Email/password form displayed → "Passwort vergessen?" link visible
Step 3: User clicks forgot password → System shows email input
Step 4: User enters registered email → clicks submit
Step 5: System sends password reset email with tokenized link
Step 6: User clicks link in email → System shows "Neues Passwort" form
Step 7: User enters new password + confirmation → submits
  IF passwords match and meet requirements → password updated → redirect to login
  IF passwords don't match → inline error → remains on form
  IF token expired → error message → "Erneut anfordern" link
```

### 8.3 Navigation Bar Interactions

Visible on every authenticated page in the top-right corner:

```
💬 Messages Icon:
  Step 1: User clicks 💬 → navigates to /messages (Nachrichten page, Flow 3.4)
  IF unread messages → badge count shown on icon

♡ Favorites Icon:
  Step 1: User clicks ♡ → navigates to /favorites (Deine Dienstleister page, Flow 4.1)

⚙ Settings Icon:
  Step 1: User clicks ⚙ → navigates to /settings (Einstellungen page, Flow 6.1)
```

### 8.4 Review / Rating Submission (Inferred)

Star ratings (e.g., "5.0 ★ (20)") appear on vendor cards in search results, indicating a review system exists.

```
Step 1: User books and interacts with a vendor (post-event)
Step 2: System prompts user to leave a review (likely via email or in-app notification)
Step 3: User clicks review prompt → review form:
  - Star rating (1-5 stars)
  - Written review text area
  - Optional photo upload
Step 4: User submits review → System:
  - Validates content (moderation)
  - Publishes review on vendor profile
  - Updates vendor's aggregate star rating and review count
```

### 8.5 Dienstleister Quiz (Inferred)

A "Dienstleister Quiz" CTA is referenced in vendor discovery entry points.

```
Step 1: User clicks "Dienstleister Quiz" → System presents guided questionnaire
Step 2: Questions about preferences (style, budget, guest count, priorities)
Step 3: System processes answers → generates personalized vendor recommendations
Step 4: Results page with matched vendors → user can browse or enquire
```

### 8.6 Partner Invitation Flow

Visible across multiple screens ("Partner/in einladen" button on Favorites, Planning Tools, Settings).

```
Step 1: User clicks "Partner/in einladen" (or "Teammitglieder einladen" in Settings)
Step 2: System pre-fills partner name from wedding details
Step 3: User confirms partner's email + role (Braut/Bräutigam/Andere)
Step 4: System sends invitation email with link
Step 5: Partner clicks link → creates own account or logs in
Step 6: Partner gains shared access to:
  - Wedding planning dashboard
  - Favorites (can comment and react)
  - Budget and guest list
  - Wedding homepage editor
```

---

## Global UI Elements (Present on All Authenticated Pages)

| Element | Location | Behavior |
|---------|----------|----------|
| Bridebook logo | Top-left | Links to dashboard/homepage |
| "Locations & Dienstleister ▼" | Top nav | Dropdown → category links |
| "Planungs-Tools ▼" | Top nav | Dropdown → Budget, Gästeliste, Checkliste, etc. |
| "Inspiration" | Top nav | Links to Ratschläge/advice page |
| "Hochzeitshomepage" | Top nav | Links to wedding homepage editor |
| 💬 Messages icon | Top-right | Links to messages inbox |
| ♡ Favorites icon | Top-right | Links to favorites page |
| ⚙ Settings icon | Top-right | Links to settings page |
| Footer | Bottom | Über uns, Bridebook Business, Planungstools, Dienstleister Verzeichnis, Ideen & Inspiration, App Store/Play Store links, QR code, Cookie Richtlinie, Datenschutzrichtlinie, AGB, social icons (YouTube, TikTok, Facebook, Pinterest, X, Instagram) |

---

## Error & Empty States Summary

| Screen | Empty/Error State | CTA |
|--------|------------------|-----|
| Favorites (Locations tab) | "Hier werden deine favorisierten Locations gespeichert!" | "Locations entdecken" |
| Messages (Dienstleister tab) | "Noch keine Nachrichten" | Implicit: send enquiry first |
| Guest List | "Lass uns ein paar Freunde zu deiner Gästeliste hinzufügen!" | "Füge deine ersten Gäste hinzu" |
| Budget | Wizard shown (no prior data) | "Mein Hochzeitsbudget berechnen" |
| Countdown | "Startet euren Countdown! 0 Tage 0 Std 0 Min 0 Sek" | "Klick auf mich" / "Los geht's" |
| Wedding Homepage | "Nicht veröffentlicht", placeholder text | "Veröffentlichen" |
| Enquiry edit modal | Required fields empty | Inline validation prevents submit |

---

*Document generated from analysis of 61 Bridebook platform screenshots (German locale, web version 33.39.0).*
