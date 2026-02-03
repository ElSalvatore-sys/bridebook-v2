-- Migration: 004_junction_tables
-- Description: Create junction tables for many-to-many relationships
-- Tables: artist_genres, venue_amenities, artist_categories
-- Note: Uses UUID PKs with UNIQUE INDEX (not composite PKs), no soft delete (CASCADE from parent)

-- =============================================
-- ARTIST_GENRES (Links artists to genres)
-- =============================================

CREATE TABLE artist_genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_artist_genres_unique ON artist_genres(artist_id, genre_id);
CREATE INDEX idx_artist_genres_genre ON artist_genres(genre_id);
CREATE INDEX idx_artist_genres_primary ON artist_genres(artist_id) WHERE is_primary = TRUE;

-- RLS
ALTER TABLE artist_genres ENABLE ROW LEVEL SECURITY;

-- Anyone can view genres of public artists
CREATE POLICY "artist_genres_select_public" ON artist_genres
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_genres.artist_id AND is_public = TRUE AND deleted_at IS NULL)
  );

-- Artists can manage their own genre associations
CREATE POLICY "artist_genres_manage_own" ON artist_genres
  FOR ALL USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_genres.artist_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "artist_genres_admin_all" ON artist_genres
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- VENUE_AMENITIES (Links venues to amenities)
-- =============================================

CREATE TABLE venue_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_venue_amenities_unique ON venue_amenities(venue_id, amenity_id);
CREATE INDEX idx_venue_amenities_amenity ON venue_amenities(amenity_id);

-- RLS
ALTER TABLE venue_amenities ENABLE ROW LEVEL SECURITY;

-- Anyone can view amenities of public venues
CREATE POLICY "venue_amenities_select_public" ON venue_amenities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_amenities.venue_id AND is_public = TRUE AND deleted_at IS NULL)
  );

-- Venues can manage their own amenity associations
CREATE POLICY "venue_amenities_manage_own" ON venue_amenities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_amenities.venue_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "venue_amenities_admin_all" ON venue_amenities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- ARTIST_CATEGORIES (Links artists to categories)
-- =============================================

CREATE TABLE artist_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_artist_categories_unique ON artist_categories(artist_id, category_id);
CREATE INDEX idx_artist_categories_category ON artist_categories(category_id);

-- RLS
ALTER TABLE artist_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories of public artists
CREATE POLICY "artist_categories_select_public" ON artist_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_categories.artist_id AND is_public = TRUE AND deleted_at IS NULL)
  );

-- Artists can manage their own category associations
CREATE POLICY "artist_categories_manage_own" ON artist_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_categories.artist_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "artist_categories_admin_all" ON artist_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
