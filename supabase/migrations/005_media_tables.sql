-- Migration: 005_media_tables
-- Description: Create media tables for artists and venues
-- Tables: artist_media, venue_media
-- Note: Uses UUID PKs, no soft delete (CASCADE from parent), no updated_at (per schema)

-- =============================================
-- ARTIST_MEDIA (Artist photos, videos, audio)
-- =============================================

CREATE TABLE artist_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  type media_type NOT NULL DEFAULT 'IMAGE',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_artist_media_artist ON artist_media(artist_id, sort_order);
CREATE UNIQUE INDEX idx_artist_media_primary ON artist_media(artist_id) WHERE is_primary = TRUE;

-- RLS
ALTER TABLE artist_media ENABLE ROW LEVEL SECURITY;

-- Anyone can view media of public artists
CREATE POLICY "artist_media_select_public" ON artist_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_media.artist_id AND is_public = TRUE AND deleted_at IS NULL)
  );

-- Artists can view their own media (including when artist is not public)
CREATE POLICY "artist_media_select_own" ON artist_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_media.artist_id AND profile_id = auth.uid())
  );

-- Artists can add their own media
CREATE POLICY "artist_media_insert_own" ON artist_media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_media.artist_id AND profile_id = auth.uid())
  );

-- Artists can update their own media
CREATE POLICY "artist_media_update_own" ON artist_media
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_media.artist_id AND profile_id = auth.uid())
  );

-- Artists can delete their own media
CREATE POLICY "artist_media_delete_own" ON artist_media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = artist_media.artist_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "artist_media_admin_all" ON artist_media
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- VENUE_MEDIA (Venue photos, videos)
-- =============================================

CREATE TABLE venue_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  type media_type NOT NULL DEFAULT 'IMAGE',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_venue_media_venue ON venue_media(venue_id, sort_order);
CREATE UNIQUE INDEX idx_venue_media_primary ON venue_media(venue_id) WHERE is_primary = TRUE;

-- RLS
ALTER TABLE venue_media ENABLE ROW LEVEL SECURITY;

-- Anyone can view media of public venues
CREATE POLICY "venue_media_select_public" ON venue_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_media.venue_id AND is_public = TRUE AND deleted_at IS NULL)
  );

-- Venues can view their own media (including when venue is not public)
CREATE POLICY "venue_media_select_own" ON venue_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_media.venue_id AND profile_id = auth.uid())
  );

-- Venues can add their own media
CREATE POLICY "venue_media_insert_own" ON venue_media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_media.venue_id AND profile_id = auth.uid())
  );

-- Venues can update their own media
CREATE POLICY "venue_media_update_own" ON venue_media
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_media.venue_id AND profile_id = auth.uid())
  );

-- Venues can delete their own media
CREATE POLICY "venue_media_delete_own" ON venue_media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM venues WHERE id = venue_media.venue_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "venue_media_admin_all" ON venue_media
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
