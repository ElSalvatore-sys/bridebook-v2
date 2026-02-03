# 08 - FORMS ANALYSIS (Bridebook.com)

Complete field-level specification of every form visible in the Bridebook screenshot corpus.

---

## Table of Contents

1. [Auth Forms](#1-auth-forms)
2. [Wedding Setup / Budget Calculator](#2-wedding-setup--budget-calculator)
3. [Vendor Enquiry Forms](#3-vendor-enquiry-forms)
4. [Guest Forms](#4-guest-forms)
5. [Budget Management Forms](#5-budget-management-forms)
6. [Task / Checklist Forms](#6-task--checklist-forms)
7. [Settings Forms](#7-settings-forms)
8. [Wedding Homepage Forms](#8-wedding-homepage-forms)
9. [Search & Filter Forms](#9-search--filter-forms)
10. [Miscellaneous Forms](#10-miscellaneous-forms)
11. [Form Behavior Patterns](#11-form-behavior-patterns)
12. [Input Specifications](#12-input-specifications)
13. [File Uploads](#13-file-uploads)
14. [Form Accessibility](#14-form-accessibility)
15. [Form Analytics](#15-form-analytics)

---

## 1. AUTH FORMS

### 1.1 Login / Signup Modal (Einloggen)

**Route:** Modal overlay on any page
**Source:** `Sign up modal (Google:Apple:Email options).png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Email | email input | E-Mail | — | Yes | Email format |
| Password | password input | Passwort | — | Yes | Min length (unknown) |

**SSO Buttons (3 options, displayed before email fields):**

| Button | Style | Icon |
|--------|-------|------|
| Mit Apple einloggen | Dark/black filled | Apple logo |
| Mit Google einloggen | Outlined | Google logo |
| Per E-mail einloggen | Outlined | Email icon |

**Submit:** Varies by method (SSO redirects, email shows fields then submit)
**Secondary:** QR code on right side — "Scanne den QR Code um jederzeit und von überall auf dein Bridebook zuzugreifen"
**Success:** Redirect to main dashboard
**Notes:** Email login reveals email + password fields. SSO buttons trigger OAuth flows.

---

## 2. WEDDING SETUP / BUDGET CALCULATOR

### 2.1 Hochzeitsbudget berechnen (Wedding Budget Calculator)

**Route:** Planungs-Tools > Budget
**Source:** `planungs tool budget icon pt 1.png`, `planungs tool budget icon pt 2.png`

| Field | Type | Label | Placeholder/Default | Required | Validation |
|-------|------|-------|---------------------|----------|------------|
| Geschätztes Budget | Number input (currency, stepper arrows) | "Gebt euer Hochzeitsbudget ein:" | "Geschätztes Budget" (EUR prefix) | Expected | Numeric only |
| Currency | Dropdown select | (inline with budget) | "EUR - Euro" | Pre-filled | — |
| Gästezahl | Single-select chip/pill group | "Wie viele Gäste werden am Hochzeitsempfang teilnehmen?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Wochentag | Single-select chip/pill group | "An welchem Wochentag findet eure Hochzeit statt?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Jahreszeit | Single-select chip/pill group | "Zu welcher Jahreszeit findet eure Hochzeit statt?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Hochzeitsjahr | Single-select chip/pill group | "Für wann ist eure Hochzeit geplant?" | "Unentschlossen" (pre-selected) | Yes | Single selection |
| Optionale Kategorien | Checkbox group (multi-select) | "Wählt optionale Kategorien, die ihr im Budget DABEI haben wollt:" | All unchecked | No | — |

**Gästezahl Options:**

| Option |
|--------|
| Unentschlossen |
| Weniger als 50 |
| 50 - 99 |
| 100 - 149 |
| 150 - 250 |
| Mehr als 250 |

**Wochentag Options:**

| Option |
|--------|
| Unentschlossen |
| Mo. - Do. |
| Freitag |
| Samstag |
| Sonntag |

**Jahreszeit Options:**

| Option |
|--------|
| Unentschlossen |
| Hochsaison (Mai bis Sep) |
| Nebensaison (andere Monate) |
| Weihnachtszeit |

**Hochzeitsjahr Options:**

| Option |
|--------|
| Unentschlossen |
| 2026 |
| 2027 |
| 2028 |
| 2029 und später |

**Optionale Kategorien Checkboxes:**

| Checkbox Label | Default |
|----------------|---------|
| Videograf | Unchecked |
| Planer, Redner | Unchecked |
| Live-Band | Unchecked |
| Versicherung | Unchecked |
| Entertainer (z.B. Zauberer) | Unchecked |
| Papeterie & Einladungen | Unchecked |

**Submit:** "Mein Hochzeitsbudget berechnen" — purple filled pill button
**Success:** Loading screen ("Zahlenverarbeitung im Gange" with animated dots) → redirects to Budget Breakdown page
**Helper tips per field:**
- Gästezahl: "Kleiner Tipp: Mehr Gäste = höhere Kosten für Catering, Papeterie, usw."
- Wochentag: "Kleiner Tipp: Wer nicht am Samstag feiert, spart Kosten für Caterer, Location, etc."
- Jahreszeit: "Kleiner Tipp: Feiert außerhalb der Hauptsaison und spart Kosten für Dienstleister"

---

## 3. VENDOR ENQUIRY FORMS

### 3.1 Venue Inquiry / Brochure Request (Nachricht an Dienstleister)

**Route:** Modal on venue detail page
**Source:** `locatons when pressed and trying to book the email with template.png`, `location when venue is clicked email template and message pt 2.png`

**Pre-filled Read-Only Info (editable via pencil icon):**

| Field | Display Value | Editable | Missing State |
|-------|---------------|----------|---------------|
| E-Mail | user@email.com | Via edit button | — |
| Tel. Nr. | phone number | Via edit button | Red "[fehlt]" tag |
| Vor- und Nachname | "El & Eli" | Via edit button | — |
| Ideales Datum | date | Via edit button | Red "[fehlt]" tag |
| Geschätzte Gästeanzahl | count | Via edit button | Red "[fehlt]" tag |

**Checkbox Group: "Welche Infos möchtet ihr erhalten?"**

| Option | Type | Default |
|--------|------|---------|
| Allgemeine Informationen | Checkbox | Checked (purple) |
| Preis und Pakete | Checkbox | Unchecked |
| Verfügbarkeit | Checkbox | Unchecked |
| Termin zur Besichtigung | Checkbox | Unchecked |
| Andere | Checkbox | Unchecked |

**Expandable Message Section:** "+ Persönliche Nachricht schreiben"

| Field | Type | Label | Default Content |
|-------|------|-------|-----------------|
| Nachricht bearbeiten | Textarea | "Nachricht bearbeiten" | "Hi, wir suchen gerade nach einer Location für unsere Hochzeit und würden gerne mehr über die deine erfahren. Könntest du uns die Details zuschicken, wenn du einen Moment Zeit hast? Vielen Dank!" |

**Submit:** "Broschüre anfragen" — purple button with download icon
**Cancel:** X (close modal)
**Success:** Confirmation (message sent to vendor)

### 3.2 Edit Contact Information (Daten bearbeiten)

**Route:** Sub-modal within venue inquiry
**Source:** `locaiton when venue is choosen the email template the edit button to edit information.png`

| Field | Type | Label | Placeholder | Required | Notes |
|-------|------|-------|-------------|----------|-------|
| E-Mail | Text input | "E-Mail*" | (pre-filled) | Yes | — |
| Tel. Nr. | Phone input | "Tel. Nr.*" | "+49 Telefonnummer eingeben" | Yes | Country flag selector (DE default) |
| Dein Name | Text input | "Dein Name*" | (pre-filled) | Yes | — |
| Partner Name | Text input | "Name deines Partners / deiner Partnerin*" | (pre-filled) | Yes | — |
| Geschätzte Gästeanzahl | Number input (stepper +/-) | "Geschätzte Gästeanzahl*" | "Wie viele Gäste?" | Yes | Increment/decrement controls |
| Ideales Datum | Date picker | "Ideales Datum*" | "Hochzeitsdatum" | Yes | Calendar icon |

**Submit:** "Informationen speichern" — purple button
**Cancel:** Back arrow (<) top left
**Note:** Red info text: "Wir geben eure Daten weiter, damit der Dienstleister euch direkt an euch wenden kann."

---

## 4. GUEST FORMS

### 4.1 Add Multiple Guests (Gästeliste Modal)

**Route:** Planungstool > Gästeliste > "Gäste hinzufügen"
**Source:** `planungstool gäästelist when clciked.png`
**Modal Title:** "Füge mehrere Gäste gleichzeitig hinzu"

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Kategorie | Dropdown select | "Kategorie" | "Els Gäste" (pre-selected) | Yes | Must select a category |
| Namen hinzufügen | Textarea (multi-line) | "Namen hinzufügen" | "z.B. Monica & Chandler" | Yes | One name per line; "&" links couples/families |

**Submit:** "Speichern" — purple button
**Cancel:** X (close modal)
**Helper text:** "Gib jedem neuen Gast eine neue Zeile. Setze ein '&' Symbol zwischen die Namen der Gäste, um sie als Paar/Familie zu verknüpfen. z.B. Harry & Meghan & Archie"

### 4.2 Guest List Empty State

**Source:** `planungstool gastelist.png`
**No form fields** — displays CTA button: "Füge deine ersten Gäste hinzu" which opens Form 4.1.

---

## 5. BUDGET MANAGEMENT FORMS

### 5.1 Budget Line Item Editor (Modal)

**Route:** Budget Breakdown > click any line item row
**Source:** `planungs tool budget icon after budget inserted and again hochzeit is pressed.png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| Element | Text input | "Element*" | (pre-filled category name, e.g. "Hochzeitslocation") | Yes | — |
| zirka (Estimated) | Number/currency input (stepper) | "zirka" | (pre-filled, e.g. "EUR 12624") | No | Numeric/currency |
| Gebucht (Booked) | Number/currency input (stepper) | "Gebucht" | (pre-filled, e.g. "EUR 0") | No | Numeric/currency |
| Notizen zu Zahlungen | Textarea | "Notizen zu Zahlungen und Anzahlungen" | "z.B. Wann ist die Anzahlung/Zahlung fällig? Wer zahlt?" | No | — |

**Submit:** "Speichern" — purple filled full-width button
**Delete:** "Dieses Element löschen" — red outlined text with trash icon
**Cancel:** X (close modal)

### 5.2 Maximales Budget Inline Edit

**Route:** Budget Breakdown page header
**Source:** `planungs tool budget icon after budget inserted pt2.png`

| Field | Type | Label | Current Value | Notes |
|-------|------|-------|---------------|-------|
| Maximales Budget | Inline editable (pencil icon toggle) | "Maximales Budget" | "50.000 EUR" | Pencil icon converts display to input |

**Actions in header:**

| Button | Text | Style |
|--------|------|-------|
| Reset | "Budget zurücksetzen" | Outlined |
| Add item | "+ Neues Element hinzufügen" | Purple filled |

### 5.3 Budget Breakdown Categories (Interactive Table)

**Source:** `planungs tool budget icon after budget inserted pt2-pt5.png`

Not a form, but each row is clickable and opens Form 5.1. Categories include:

**Hochzeitslocations & Dienstleister (10 items):** Hochzeitslocation, Florist, Fotograf, Catering, Musik, Torte, Transport, Dekoration und Verleih, Festzelt, Planer/Redner

**Hochzeitskleidung & Accessoires (4 items):** Brautmode, Herrenbekleidung, Ringe und Schmuck, Beauty/Haare/Make-Up

**Zusätzliches (6 items):** Heiratslizenz Gebühren, Versicherung, Suite für Hochzeitsnacht, Gastgeschenke, Flitterwochen, Bekanntmachungen

**Andere (1 item):** Extras

Each row shows: Icon | Item name | zirka (estimated) | Gebucht (booked) | Action link | Chevron >

---

## 6. TASK / CHECKLIST FORMS

No dedicated task creation or edit forms were visible in the screenshots. The Checkliste section shows CTA cards ("Loslegen" buttons) but no inline task editing UI was captured.

---

## 7. SETTINGS FORMS

### 7.1 Contact Email (Meine Kontakt E-Mail Adresse)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Placeholder | Required | Validation |
|-------|------|-------|-------------|----------|------------|
| E-Mail | Email input | "E-Mail" (floating label) | Pre-filled current email | Yes | Email format |

**Submit:** "Speichern" — purple button
**Helper:** "Die E-Mail-Adresse, über die unsere Dienstleister euch kontaktieren werden (Bitte gebt sie sorgfältig ein)"

### 7.2 Profile Photo Upload

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Photo | File upload (image) | "Dein Profilbild" | "Füge ein Foto hinzu" (inside circle) | No |

**Submit:** "Hochladen" — outline button

### 7.3 Login Methods (Meine Login-Methoden)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`, `settings pt2.png`

No input fields — action buttons only:

| Button | Style | Icon |
|--------|-------|------|
| E-Mail Login-Methode hinzufügen | Purple filled | — |
| Mit Facebook verbinden | Outlined | Facebook |
| Mit Google-Konto verbinden | Outlined | Google |

### 7.4 Language Change (Sprache ändern)

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt1.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Sprache ändern | Dropdown select | "Sprache ändern" (floating label) | "Deutsch (Deutschland)" | Yes |

**Behavior:** Likely auto-saves on change.

### 7.5 Account Deletion

**Route:** Settings > Meine Account-Daten
**Source:** `settings pt2.png`

No input fields.
**Button:** "Konto löschen" — red/outline destructive button
**Warning:** "Durch diese Aktion werden euer Konto und alle gespeicherten Inhalte endgültig gelöscht. Dies kann nicht rückgängig gemacht werden."
**Behavior:** Likely triggers confirmation dialog.

### 7.6 Wedding Details (Hochzeitsdetails)

**Route:** Settings > Meine Hochzeitsdetails
**Source:** `settings pt3.png`

| Field | Type | Label | Placeholder/Default | Required | Validation |
|-------|------|-------|---------------------|----------|------------|
| Name | Text input | "Name" (floating) | Pre-filled "El" | Yes | Text |
| Partner/in Name | Text input | "Partner/in Name" (floating) | Pre-filled "Eli" | Yes | Text |
| Role (Person 1) | Radio-like checkbox group | — | — | No | One of 3 options |
| Role (Person 2) | Radio-like checkbox group | — | — | No | One of 3 options |
| Standort | Text input | "Standort" (floating) | Pre-filled "Deutschland" | No | Text/location |
| Hochzeitsdatum | Date picker | "Hochzeitsdatum" (floating) | "Datum auswählen" | No | Valid date |
| Land auswählen | Dropdown select | "Land auswählen" (floating) | "Deutschland" (with flag) | Yes | Country list |
| Währung | Dropdown select | "Währung" (floating) | "EUR - Euro" | Yes | Currency list |

**Role Options:** Braut, Bräutigam, Andere

### 7.7 Team Members Invite

**Route:** Settings > Teilt eure Hochzeit
**Source:** `settings pt4.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Partner/in Name | Text input | "Partner/in Name" (floating) | Pre-filled "Eli" | Yes |
| Role | Checkbox group | — | — | No |

**Role Options:** Braut, Bräutigam, Andere
**Submit:** "Teammitglieder einladen" — purple filled button
**Description:** "Lade deine Partner:in, Freunde und Familie zur Planung ein."

### 7.8 Customer Service

**Route:** Settings > Kundenservice
**Source:** `settings pt5.png`

No input fields. Two action buttons:

| Button | Style |
|--------|-------|
| Hilfe holen | Purple filled |
| Gib uns Feedback | Purple filled |

---

## 8. WEDDING HOMEPAGE FORMS

### 8.1 Details Tab — Eure Namen (Your Names)

**Route:** Hochzeitshomepage > Details > Eure Namen
**Source:** `hochzeit home page pt1.png`

| Field | Type | Label | Default | Required |
|-------|------|-------|---------|----------|
| Dein Name | Text input | "Dein Name*" | Pre-filled "El" | Yes |
| Partner Name | Text input | "Der Name deines Partners*" | Pre-filled "Eli" | Yes |

**Submit:** "Speichern" — small purple button

### 8.2 Details Tab — Hochzeitsdatum

**Route:** Hochzeitshomepage > Details > Hochzeitsdatum
**Source:** `hochzeit home page pt2.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Hochzeitsdatum | Date/text input | "Hochzeitsdatum" | "Hochzeitsdatum hinzufügen" | No |

**Submit:** "Speichern"

### 8.3 Details Tab — Hochzeitslocation

**Route:** Hochzeitshomepage > Details > Hochzeitslocation
**Source:** `hochzeit home page pt2.png`

| Field | Type | Label | Placeholder | Required |
|-------|------|-------|-------------|----------|
| Location | Text input | — | "Location hinzufügen" | No |
| Use location photos | Checkbox | "Verwendet Fotos von eurer Hochzeitslocation" | Checked by default | No |

**Submit:** "Speichern"

### 8.4 Details Tab — Fotos

**Route:** Hochzeitshomepage > Details > Fotos
**Source:** `hochzeit home page pt4.png`

| Field | Type | Label | Notes |
|-------|------|-------|-------|
| Photo upload | File upload (image grid) | — | Thumbnail grid of uploaded photos |

**Buttons:** "Fotos hinzufügen" (outlined), "Speichern" (purple)

### 8.5 Details Tab — Zu-/Absagen (RSVP)

**Route:** Hochzeitshomepage > Details > Zu-/Absagen
**Source:** `hochzeit home page pt4.png`

No form fields. Info banner: "Fügt zuerst Gäste zu Events hinzu" — directs to Gästeliste.

### 8.6 Details Tab — Fragen (FAQs)

**Route:** Hochzeitshomepage > Details > Fragen
**Source:** `hochzeit home page pt4.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Question | Text input | — | "Wirst du teilnehmen?" (example) |

**Button:** "Frage hinzufügen+" — text link

### 8.7 Details Tab — Unsere Geschichte (Our Story)

**Route:** Hochzeitshomepage > Details > Unsere Geschichte
**Source:** `hochzeit home page pt5.png`

| Field | Type | Label | Default |
|-------|------|-------|---------|
| Story text | Textarea | "Erzählt euren Gästen ein bisschen was über euch!" | "Wir haben uns getroffen, gelacht und uns verliebt. Irgendwann wurde uns dann klar, dass wir nicht ohne einander leben wollen. Jetzt heiraten wir!" |

**Submit:** "Speichern"

### 8.8 Details Tab — Zeitplan (Timeline)

**Route:** Hochzeitshomepage > Details > Zeitplan
**Source:** `hochzeit home page pt5.png`

| Field | Type | Label | Notes |
|-------|------|-------|-------|
| Datum hinzufügen | Date/time link | — | Red text link to add date |
| Event name | Text display | — | "Hochzeit" (shown) |

**Buttons:** "Event hinzufügen" (outlined purple), "Fertig" (small purple)
**Note:** "Sichtbarkeit für Gäste" — Events visible on homepage.

### 8.9 Details Tab — Hochzeitswünschliste (Gift Registry)

**Route:** Hochzeitshomepage > Details > Hochzeitswünschliste
**Source:** `hochzeit home page pt6.png`

| Field | Type | Label | Placeholder/Default |
|-------|------|-------|---------------------|
| Wishlist URL | URL input | "Verbindet eure Wünschliste mit eurer Homepage" | "URL eurer Wünschliste hinzufügen" |
| Nachricht an die Gäste | Textarea | "Nachricht an die Gäste" | "Euch dabei zu haben, ist das beste Geschenk von allen. Wenn ihr noch mehr beitragen möchtet, ist hier unsere Liste." |

**Buttons:** "Löschen" (outlined), "Speichern" (purple)
**Additional:** Amazon wedding registry partner option.

### 8.10 Details Tab — Unterkünfte (Accommodation)

**Route:** Hochzeitshomepage > Details > Unterkünfte
**Source:** `hochzeit home page pt7.png`

| Field | Type | Label | Placeholder/Default |
|-------|------|-------|---------------------|
| Gebuchte Location | Search/text input | — | "Gebuchte Location hinzufügen" |
| Nachricht an die Gäste | Textarea | "Nachricht an die Gäste" | "Um eure Reise noch bequemer zu machen, empfehlen wir euch Unterkünfte in der Nähe unserer Location!" |

**Buttons:** "Vorschau-Link" (outlined), "Speichern" (purple)

### 8.11 Design Tab (Theme & Font Picker)

**Route:** Hochzeitshomepage > Design
**Source:** `hochzeit home page design pt1.png`, `hochzeit home page design pt2.png`

| Field | Type | Label | Options |
|-------|------|-------|---------|
| Design template | Visual card selector (grid) | "Design" | ~8 theme cards (floral, minimal, elegant, etc.) with color variant dots |
| Schriftarten (Fonts) | Visual tile selector (grid) | "Schriftarten" | 6 font options ("Ag" preview tiles — serif, sans-serif, script, etc.) |

**Behavior:** Click to apply. Live preview on the right side. Color dots switch palette within a theme. No explicit save button (auto-applies).

### 8.12 Einstellungen Tab (Settings)

**Route:** Hochzeitshomepage > Einstellungen
**Source:** `hochzeit home page einstellung.png`

| Field | Type | Label | Placeholder/Default | Required |
|-------|------|-------|---------------------|----------|
| URL der Website | Text input | "URL der Website" | "eure-einzigartige-Adresse" | Yes |
| Veröffentlicht | Toggle switch | "Veröffentlicht" | Off (grey) | — |
| Homepage-Passwort | Toggle switch | "Homepage-Passwort" | Off (grey) | — |

**Submit:** "Fertig" — small purple button
**Helper:** "Euer Link wird hier verfügbar sein, sobald ihr eure Homepage veröffentlicht habt"

**Global Homepage Actions (visible across all tabs):**

| Button | Style | Position |
|--------|-------|----------|
| Teilen (Share) | Outlined | Top bar |
| Veröffentlichen (Publish) | Purple filled | Top bar |
| Mobile/Desktop preview toggle | Icon buttons | Top bar |
| Vorschau (Preview) | Text link | Top bar |

---

## 9. SEARCH & FILTER FORMS

### 9.1 Main Dashboard Search

**Route:** Dashboard / Landing page
**Source:** `Main dashboard overview.png`, `landing page. .png`

| Field | Type | Label | Default |
|-------|------|-------|---------|
| Standort | Dropdown select | "Standort" | "Deutschland" (with pin icon) |
| Kategorie | Dropdown select | "Kategorie" | "Hochzeitslocations" |
| Dienstleister Name | Text input | (below main search) | "Suche nach Dienstleister Namen" |

**Submit:** "Suche" — purple button
**Additional CTA:** "Los geht's" on hero banner

### 9.2 Venue & Vendor Filters (Comprehensive Filter Panel)

**Route:** Location search results page
**Source:** `location und dienstleister filters.png` through `filters PT 5.png`

**Location search field:**

| Field | Type | Placeholder |
|-------|------|-------------|
| Location | Text input | "Deutschland" (pre-filled) |

**Submit:** "[count] Ergebnisse anzeigen" — purple button
**Reset:** "Filter zurücksetzen" — text link
**Close:** "Schließen X"

#### Filter Sections (all checkboxes):

**Preiskategorie (Price, 4 options):**
Erschwinglich ($) | Mäßig ($$) | Luxuriös ($$$) | Super Luxuriös ($$$$)

**Gästeanzahl (Guest Count, 7 options):**
Bis zu 30 | 30+ | 50+ | 80+ | 100+ | 150+ | 200+

**Deine Must-Haves (3 options):**
Exklusive Nutzung | Unterbringung vor Ort | Ausschankgenehmigung

**Anzahl an Schlafzimmern (4 options):**
Bis zu 10 | 20+ | 30+ | 50+

**Art von Location (17 options):**
Landhaus | Scheune | Im Freien | Schloss | Hotel | Eventlocation | Lager/Fabrik | Attraktion | Restaurant | Golfplatz | Auf dem Wasser | Sportlocation | Konferenzzentrum | Rathaus | Andere | Dachterrasse | Weinberg/Weingut

**Location Stil (21 options):**
Klassisch | Intern | Alternativ | Romantisch | Schöne Anlagen/Garten | Ungewöhnlich | Erschwinglich | Außenbereich | Luxus | Rustikal | Wasserblick | Modern | Einzigartig | Stadt | Leere Leinwand | Schöne Aussicht | Historisch | Asiatisch | Lässig | Formell | Cool

**Location Features (13 options):**
Parkplätze vor Ort | Barrierefrei | Hauseigener Hochzeits-Koordinator | Tanzfläche verfügbar | Soundsystem verfügbar | Ballsaal | Konfetti erlaubt | Feuerwerk erlaubt | Festzelt gestattet | Wasserblick | Landschaftsgarten | Tiere erlaubt | Kirche zu Fuß erreichbar

**Essen und Trinken (4 options):**
Hausinternes Catering | Externes Catering erlaubt | Keine Korkgebühr für eigenen Alkohol | Veganes Catering möglich

**Bridebook Sonderangebot (1 option):**
Last Minute

**Besichtigungen und Veranstaltungen (2 options):**
Hat verfügbare Besichtigungstermine | Hat anstehende Hochzeitsmesse

**Kulturspezialist (4 options):**
Asiatischer Hochzeitsspezialist | Jüdischer Hochzeitsspezialist | Muslimischer Hochzeitsspezialist | Andere

**Diversität und Inklusion (2 options):**
LGBTQ+-freundlich | Neurodivers-freundlich

**Total filter checkboxes: ~82 across 11 sections**

### 9.3 Add to Favorites Modal

**Route:** Favoriten > "Neuen Favoriten hinzufügen+"
**Source:** `favourites when favourites hinzufugen is clicked.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Dienstleister search | Search text input | "Gib den Namen eures Dienstleisters ein:" | "Dienstleister suchen" (with search icon) |

**Cancel:** X (close modal)
**Fallback links:** "Du findest deinen Dienstleister nicht?" → "Manuell hinzufügen" or "Auf Google suchen"

### 9.4 Inspiration Search

**Route:** Homepage inspiration section
**Source:** `homepaget pt4.png`

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| Vision search | Search text input | "Hochzeitsvision und Inspiration" | "Suche nach Inspiration, z.B. Freudig" |

### 9.5 Inspiration Tab Filter (Ratschlag)

**Route:** Planungstool > Ratschläge
**Source:** `planungstool ratschlag pt 1.png`

Tab pill navigation (not a traditional form):

| Tab |
|-----|
| Alle |
| Allgemeine Ratschläge |
| Expertenberatung |
| Hochzeitsbudget |
| Gäste |
| Zeremonie |
| Nach der Hochzeit |
| Echte Hochzeit |
| Dienstleister |

---

## 10. MISCELLANEOUS FORMS

### 10.1 Messages Section

**Route:** Nachrichten
**Source:** `messages pt1-pt4.png`

No input forms visible. Contains 4 tabs (Dienstleister, Gäste, Bridebook, Archiviert) — all empty states. CTA button "Nachricht schreiben" on Gäste tab.

### 10.2 Venue Search (Map View)

**Route:** Location search via budget tool
**Source:** `planungs tool budget icon after budget inserted and hochzeit is clicked and the buttom look for venues is pressed.png`

| Field | Type | Placeholder |
|-------|------|-------------|
| Location/Venue search | Text/search input | "Städte, Hochzeitslocation, Suchort, Deutschland" |

Each venue card has an "Anfrage senden" (Send inquiry) button.

---

## FORM COUNT SUMMARY

| Category | Form Count | Total Fields |
|----------|-----------|--------------|
| Auth | 1 | 2 + 3 SSO buttons |
| Wedding Setup / Budget Calculator | 1 | 7 fields (~20 options) |
| Vendor Enquiry | 2 | 12 fields + 5 checkboxes |
| Guest | 1 | 2 |
| Budget Management | 2 | 5 |
| Task/Checklist | 0 (not captured) | — |
| Settings | 8 | ~15 |
| Wedding Homepage | 12 | ~20 |
| Search & Filter | 5 | ~90 (mostly filter checkboxes) |
| Miscellaneous | 2 | 2 |
| **TOTAL** | **34 forms** | **~155+ fields** |

---

## GLOBAL UI PATTERNS

| Pattern | Detail |
|---------|--------|
| Primary button color | Purple/violet (#7C3AED or similar) |
| Destructive button style | Red outlined text |
| Save button text | "Speichern" (most forms) or "Fertig" (done) |
| Required field indicator | Asterisk (*) after label |
| Floating labels | Used on all text inputs in Settings |
| Missing data indicator | Red "[fehlt]" tag |
| Chip/pill selectors | Used for single-select groups (budget calculator) |
| Accordion sections | Used in Wedding Homepage Details tab |
| Modal pattern | White modal with dark overlay, X close button top-right |
| Auto-save | Design tab (theme/font selection) |
| Language | All UI in German (Deutsch) |

---

## 11. FORM BEHAVIOR PATTERNS

- Auto-save forms: Settings, Wedding Homepage Details
- Manual save forms: Budget items, Guest entries
- Dirty state detection: Show "unsaved changes" warning
- Multi-step wizard: Budget calculator (5 steps)
- Conditional fields: Show/hide logic

---

## 12. INPUT SPECIFICATIONS

- Character limits: Name (100), Description (500), Message (2000)
- Input masks: Phone (+49 XXX XXXXXXX), Date (DD.MM.YYYY)
- Autocomplete attributes: name, email, tel, street-address
- Mobile keyboards: inputmode="email|tel|numeric|url"
- Datepicker locale: German (DD.MM.YYYY), week starts Monday

---

## 13. FILE UPLOADS

- Avatar: JPG/PNG, max 5MB, 1:1 crop
- Wedding photos: JPG/PNG/WEBP, max 10MB each, multi-select
- Drag & drop zones

---

## 14. FORM ACCESSIBILITY

- Label associations (for/id pairs)
- Error announcements (aria-live="polite")
- Required indicators (aria-required="true")
- Tab order per form

---

## 15. FORM ANALYTICS

- Submission events: form_submit_{form_name}
- Field interaction: field_focus, field_blur
- Abandonment tracking: form_abandon_{form_name}
