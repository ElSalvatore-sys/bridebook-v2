-- Migration: 008_discovery_calendar
-- Description: Create discovery and calendar tables (favorites, availability, availability_exceptions)
-- Note: favorites is polymorphic (artist OR venue), availability is weekly recurring

-- =============================================
-- FAVORITES (Polymorphic - Artist OR Venue)
-- =============================================

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Polymorphic: either artist OR venue (not both)
  favorite_type favorite_type NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure exactly one target is set based on favorite_type
  CONSTRAINT favorites_target_check CHECK (
    (favorite_type = 'ARTIST' AND artist_id IS NOT NULL AND venue_id IS NULL)
    OR (favorite_type = 'VENUE' AND venue_id IS NOT NULL AND artist_id IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_favorites_profile ON favorites(profile_id);
CREATE INDEX idx_favorites_artist ON favorites(artist_id) WHERE artist_id IS NOT NULL;
CREATE INDEX idx_favorites_venue ON favorites(venue_id) WHERE venue_id IS NOT NULL;

-- Unique partial indexes to prevent duplicate favorites
CREATE UNIQUE INDEX idx_favorites_unique_artist ON favorites(profile_id, artist_id) WHERE artist_id IS NOT NULL;
CREATE UNIQUE INDEX idx_favorites_unique_venue ON favorites(profile_id, venue_id) WHERE venue_id IS NOT NULL;

-- RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT USING (profile_id = auth.uid());

-- Users can add favorites to their own profile
CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Users can remove their own favorites (NO UPDATE - add/remove only)
CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE USING (profile_id = auth.uid());

-- Admin full access
CREATE POLICY "favorites_admin_all" ON favorites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- AVAILABILITY (Weekly Recurring Schedule)
-- =============================================

CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

  -- day_of_week: 0=Sunday, 1=Monday, ..., 6=Saturday
  day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure end_time is after start_time
  CONSTRAINT availability_time_check CHECK (end_time > start_time)
);

-- Indexes
CREATE INDEX idx_availability_artist ON availability(artist_id, day_of_week);
CREATE UNIQUE INDEX idx_availability_unique ON availability(artist_id, day_of_week, start_time);

-- RLS
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Public can view availability for public artists (respects soft delete)
CREATE POLICY "availability_select_public" ON availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE id = availability.artist_id
      AND is_public = TRUE
      AND deleted_at IS NULL
    )
  );

-- Artist owners can view their own availability
CREATE POLICY "availability_select_own" ON availability
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can create availability slots
CREATE POLICY "availability_insert_own" ON availability
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM artists WHERE id = availability.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can update their availability
CREATE POLICY "availability_update_own" ON availability
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can delete their availability
CREATE POLICY "availability_delete_own" ON availability
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability.artist_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "availability_admin_all" ON availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- AVAILABILITY_EXCEPTIONS (Date-Specific Overrides)
-- =============================================

CREATE TABLE availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

  exception_date DATE NOT NULL,
  start_time TIME,  -- NULL = entire day is affected
  end_time TIME,    -- NULL = entire day is affected
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Either both times are NULL (full day) or both are set with end > start
  CONSTRAINT exception_time_check CHECK (
    (start_time IS NULL AND end_time IS NULL)
    OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

-- Indexes
CREATE INDEX idx_exceptions_artist_date ON availability_exceptions(artist_id, exception_date);
-- Note: NOT using partial index with CURRENT_DATE as it's evaluated once at creation, not dynamically

-- RLS
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- Public can view exceptions for public artists (respects soft delete)
CREATE POLICY "exceptions_select_public" ON availability_exceptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE id = availability_exceptions.artist_id
      AND is_public = TRUE
      AND deleted_at IS NULL
    )
  );

-- Artist owners can view their own exceptions
CREATE POLICY "exceptions_select_own" ON availability_exceptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability_exceptions.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can create exceptions
CREATE POLICY "exceptions_insert_own" ON availability_exceptions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM artists WHERE id = availability_exceptions.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can update their exceptions
CREATE POLICY "exceptions_update_own" ON availability_exceptions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability_exceptions.artist_id AND profile_id = auth.uid())
  );

-- Artist owners can delete their exceptions
CREATE POLICY "exceptions_delete_own" ON availability_exceptions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = availability_exceptions.artist_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "exceptions_admin_all" ON availability_exceptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
