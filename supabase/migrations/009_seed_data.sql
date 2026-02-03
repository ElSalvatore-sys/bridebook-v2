-- Migration: 009_seed_data
-- Description: Seed lookup tables with initial data
-- All inserts use ON CONFLICT DO NOTHING for idempotency

-- =============================================
-- REGIONS (16 German Bundesländer)
-- =============================================

INSERT INTO regions (name, slug, country_code) VALUES
  ('Baden-Württemberg', 'baden-wuerttemberg', 'DE'),
  ('Bayern', 'bayern', 'DE'),
  ('Berlin', 'berlin', 'DE'),
  ('Brandenburg', 'brandenburg', 'DE'),
  ('Bremen', 'bremen', 'DE'),
  ('Hamburg', 'hamburg', 'DE'),
  ('Hessen', 'hessen', 'DE'),
  ('Mecklenburg-Vorpommern', 'mecklenburg-vorpommern', 'DE'),
  ('Niedersachsen', 'niedersachsen', 'DE'),
  ('Nordrhein-Westfalen', 'nordrhein-westfalen', 'DE'),
  ('Rheinland-Pfalz', 'rheinland-pfalz', 'DE'),
  ('Saarland', 'saarland', 'DE'),
  ('Sachsen', 'sachsen', 'DE'),
  ('Sachsen-Anhalt', 'sachsen-anhalt', 'DE'),
  ('Schleswig-Holstein', 'schleswig-holstein', 'DE'),
  ('Thüringen', 'thueringen', 'DE')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- CITIES (~25 Major German Cities)
-- =============================================

-- Hessen cities (primary focus)
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Wiesbaden', 'wiesbaden', '65' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Frankfurt am Main', 'frankfurt-am-main', '60' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Darmstadt', 'darmstadt', '64' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Kassel', 'kassel', '34' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Offenbach am Main', 'offenbach-am-main', '63' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Marburg', 'marburg', '35' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Gießen', 'giessen', '35' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Fulda', 'fulda', '36' FROM regions r WHERE r.slug = 'hessen'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Berlin (city-state)
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Berlin', 'berlin', '10' FROM regions r WHERE r.slug = 'berlin'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Hamburg (city-state)
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Hamburg', 'hamburg', '20' FROM regions r WHERE r.slug = 'hamburg'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Bremen (city-state)
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Bremen', 'bremen', '28' FROM regions r WHERE r.slug = 'bremen'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Bayern
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'München', 'muenchen', '80' FROM regions r WHERE r.slug = 'bayern'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Nürnberg', 'nuernberg', '90' FROM regions r WHERE r.slug = 'bayern'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Baden-Württemberg
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Stuttgart', 'stuttgart', '70' FROM regions r WHERE r.slug = 'baden-wuerttemberg'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Mannheim', 'mannheim', '68' FROM regions r WHERE r.slug = 'baden-wuerttemberg'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Karlsruhe', 'karlsruhe', '76' FROM regions r WHERE r.slug = 'baden-wuerttemberg'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Freiburg', 'freiburg', '79' FROM regions r WHERE r.slug = 'baden-wuerttemberg'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Nordrhein-Westfalen
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Köln', 'koeln', '50' FROM regions r WHERE r.slug = 'nordrhein-westfalen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Düsseldorf', 'duesseldorf', '40' FROM regions r WHERE r.slug = 'nordrhein-westfalen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Dortmund', 'dortmund', '44' FROM regions r WHERE r.slug = 'nordrhein-westfalen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Essen', 'essen', '45' FROM regions r WHERE r.slug = 'nordrhein-westfalen'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Niedersachsen
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Hannover', 'hannover', '30' FROM regions r WHERE r.slug = 'niedersachsen'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Sachsen
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Dresden', 'dresden', '01' FROM regions r WHERE r.slug = 'sachsen'
ON CONFLICT (region_id, slug) DO NOTHING;

INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Leipzig', 'leipzig', '04' FROM regions r WHERE r.slug = 'sachsen'
ON CONFLICT (region_id, slug) DO NOTHING;

-- Rheinland-Pfalz
INSERT INTO cities (region_id, name, slug, postal_code_prefix)
SELECT r.id, 'Mainz', 'mainz', '55' FROM regions r WHERE r.slug = 'rheinland-pfalz'
ON CONFLICT (region_id, slug) DO NOTHING;

-- =============================================
-- GENRES (Hierarchical - Two-Step Approach)
-- =============================================

-- Step 1: Parent genres (no parent_id)
INSERT INTO genres (name, slug, sort_order) VALUES
  ('Electronic', 'electronic', 1),
  ('Rock', 'rock', 2),
  ('Pop', 'pop', 3),
  ('Hip-Hop', 'hip-hop', 4),
  ('Jazz', 'jazz', 5),
  ('Classical', 'classical', 6),
  ('Folk', 'folk', 7),
  ('Latin', 'latin', 8),
  ('R&B', 'rnb', 9),
  ('Metal', 'metal', 10),
  ('Reggae', 'reggae', 11),
  ('Soul', 'soul', 12)
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Sub-genres with parent_id via subquery

-- Electronic sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'House', 'house', g.id, 1 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Techno', 'techno', g.id, 2 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Drum & Bass', 'drum-and-bass', g.id, 3 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Trance', 'trance', g.id, 4 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Dubstep', 'dubstep', g.id, 5 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Ambient', 'ambient', g.id, 6 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Deep House', 'deep-house', g.id, 7 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Progressive', 'progressive', g.id, 8 FROM genres g WHERE g.slug = 'electronic'
ON CONFLICT (slug) DO NOTHING;

-- Rock sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Alternative', 'alternative', g.id, 1 FROM genres g WHERE g.slug = 'rock'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Indie', 'indie', g.id, 2 FROM genres g WHERE g.slug = 'rock'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Punk', 'punk', g.id, 3 FROM genres g WHERE g.slug = 'rock'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Classic Rock', 'classic-rock', g.id, 4 FROM genres g WHERE g.slug = 'rock'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Hard Rock', 'hard-rock', g.id, 5 FROM genres g WHERE g.slug = 'rock'
ON CONFLICT (slug) DO NOTHING;

-- Pop sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Charts', 'charts', g.id, 1 FROM genres g WHERE g.slug = 'pop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Schlager', 'schlager', g.id, 2 FROM genres g WHERE g.slug = 'pop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Synth Pop', 'synth-pop', g.id, 3 FROM genres g WHERE g.slug = 'pop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Dance Pop', 'dance-pop', g.id, 4 FROM genres g WHERE g.slug = 'pop'
ON CONFLICT (slug) DO NOTHING;

-- Hip-Hop sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Trap', 'trap', g.id, 1 FROM genres g WHERE g.slug = 'hip-hop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Old School', 'old-school', g.id, 2 FROM genres g WHERE g.slug = 'hip-hop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Deutschrap', 'deutschrap', g.id, 3 FROM genres g WHERE g.slug = 'hip-hop'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Boom Bap', 'boom-bap', g.id, 4 FROM genres g WHERE g.slug = 'hip-hop'
ON CONFLICT (slug) DO NOTHING;

-- Jazz sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Smooth Jazz', 'smooth-jazz', g.id, 1 FROM genres g WHERE g.slug = 'jazz'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Bebop', 'bebop', g.id, 2 FROM genres g WHERE g.slug = 'jazz'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Swing', 'swing', g.id, 3 FROM genres g WHERE g.slug = 'jazz'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Fusion', 'fusion', g.id, 4 FROM genres g WHERE g.slug = 'jazz'
ON CONFLICT (slug) DO NOTHING;

-- Latin sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Salsa', 'salsa', g.id, 1 FROM genres g WHERE g.slug = 'latin'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Bachata', 'bachata', g.id, 2 FROM genres g WHERE g.slug = 'latin'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Reggaeton', 'reggaeton', g.id, 3 FROM genres g WHERE g.slug = 'latin'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Merengue', 'merengue', g.id, 4 FROM genres g WHERE g.slug = 'latin'
ON CONFLICT (slug) DO NOTHING;

-- Metal sub-genres
INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Heavy Metal', 'heavy-metal', g.id, 1 FROM genres g WHERE g.slug = 'metal'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Death Metal', 'death-metal', g.id, 2 FROM genres g WHERE g.slug = 'metal'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Black Metal', 'black-metal', g.id, 3 FROM genres g WHERE g.slug = 'metal'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO genres (name, slug, parent_id, sort_order)
SELECT 'Thrash Metal', 'thrash-metal', g.id, 4 FROM genres g WHERE g.slug = 'metal'
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- AMENITIES (~15 Venue Features)
-- =============================================

INSERT INTO amenities (name, slug, icon, sort_order) VALUES
  ('Stage', 'stage', 'stage', 1),
  ('Sound System', 'sound-system', 'speaker', 2),
  ('Lighting', 'lighting', 'lightbulb', 3),
  ('Backstage', 'backstage', 'door', 4),
  ('Parking', 'parking', 'car', 5),
  ('Wheelchair Access', 'wheelchair-access', 'wheelchair', 6),
  ('Coat Check', 'coat-check', 'hanger', 7),
  ('Kitchen', 'kitchen', 'utensils', 8),
  ('Bar', 'bar', 'glass', 9),
  ('Outdoor Area', 'outdoor-area', 'tree', 10),
  ('Private Room', 'private-room', 'lock', 11),
  ('WiFi', 'wifi', 'wifi', 12),
  ('Projector', 'projector', 'projector', 13),
  ('Piano', 'piano', 'music', 14),
  ('Dance Floor', 'dance-floor', 'users', 15),
  ('Green Room', 'green-room', 'sofa', 16),
  ('Smoking Area', 'smoking-area', 'cigarette', 17),
  ('Air Conditioning', 'air-conditioning', 'snowflake', 18)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- CATEGORIES (EVENT_TYPE only)
-- =============================================

INSERT INTO categories (type, name, slug, sort_order) VALUES
  ('EVENT_TYPE', 'Live Music', 'live-music', 1),
  ('EVENT_TYPE', 'DJ Set', 'dj-set', 2),
  ('EVENT_TYPE', 'Private Event', 'private-event', 3),
  ('EVENT_TYPE', 'Corporate Event', 'corporate-event', 4),
  ('EVENT_TYPE', 'Wedding', 'wedding', 5),
  ('EVENT_TYPE', 'Birthday', 'birthday', 6),
  ('EVENT_TYPE', 'Festival', 'festival', 7),
  ('EVENT_TYPE', 'Open Mic', 'open-mic', 8),
  ('EVENT_TYPE', 'Concert', 'concert', 9),
  ('EVENT_TYPE', 'Album Release', 'album-release', 10),
  ('EVENT_TYPE', 'Club Night', 'club-night', 11),
  ('EVENT_TYPE', 'Acoustic Session', 'acoustic-session', 12),
  ('EVENT_TYPE', 'After Party', 'after-party', 13),
  ('EVENT_TYPE', 'Showcase', 'showcase', 14)
ON CONFLICT (type, slug) DO NOTHING;
