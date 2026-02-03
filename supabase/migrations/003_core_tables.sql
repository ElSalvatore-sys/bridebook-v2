-- Migration: 003_core_tables
-- Description: Create core tables (profiles, artists, venues) with RLS and triggers
-- Note: profiles.id directly references auth.users(id) - same UUID

-- =============================================
-- PROFILES (Base user profile)
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role profile_role NOT NULL DEFAULT 'USER',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_active ON profiles(id) WHERE deleted_at IS NULL;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Own profile access
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id AND deleted_at IS NULL);

-- Admin full access
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- ARTISTS (Artist extension table)
-- =============================================

CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  bio TEXT,
  hourly_rate NUMERIC(10,2),
  website TEXT,
  instagram TEXT,
  spotify TEXT,
  soundcloud TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  has_equipment BOOLEAN NOT NULL DEFAULT FALSE,
  years_experience SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE UNIQUE INDEX idx_artists_profile_id ON artists(profile_id);
CREATE INDEX idx_artists_public ON artists(is_public, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_artists_stage_name_gin ON artists USING gin(stage_name gin_trgm_ops);
CREATE INDEX idx_artists_hourly_rate ON artists(hourly_rate) WHERE is_public = TRUE AND deleted_at IS NULL;

-- RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Public can view public artists
CREATE POLICY "artists_select_public" ON artists
  FOR SELECT USING (is_public = TRUE AND deleted_at IS NULL);

-- Own artist profile access
CREATE POLICY "artists_select_own" ON artists
  FOR SELECT USING (profile_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "artists_insert_own" ON artists
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "artists_update_own" ON artists
  FOR UPDATE USING (profile_id = auth.uid() AND deleted_at IS NULL);

-- Admin full access
CREATE POLICY "artists_admin_all" ON artists
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- VENUES (Venue extension table)
-- =============================================

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  venue_name TEXT NOT NULL,
  type venue_type NOT NULL DEFAULT 'OTHER',
  description TEXT,
  street TEXT,
  postal_code VARCHAR(10),
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  capacity_min INTEGER,
  capacity_max INTEGER,
  website TEXT,
  instagram TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE UNIQUE INDEX idx_venues_profile_id ON venues(profile_id);
CREATE INDEX idx_venues_public ON venues(is_public, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_venues_name_gin ON venues USING gin(venue_name gin_trgm_ops);
CREATE INDEX idx_venues_type ON venues(type) WHERE is_public = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_venues_city ON venues(city_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_venues_capacity ON venues(capacity_max) WHERE is_public = TRUE AND deleted_at IS NULL;

-- RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Public can view public venues
CREATE POLICY "venues_select_public" ON venues
  FOR SELECT USING (is_public = TRUE AND deleted_at IS NULL);

-- Own venue profile access
CREATE POLICY "venues_select_own" ON venues
  FOR SELECT USING (profile_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "venues_insert_own" ON venues
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "venues_update_own" ON venues
  FOR UPDATE USING (profile_id = auth.uid() AND deleted_at IS NULL);

-- Admin full access
CREATE POLICY "venues_admin_all" ON venues
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- TRIGGERS
-- =============================================

-- 1. Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- DEFERRED POLICIES (require all tables to exist)
-- =============================================

-- Public profile access (when linked artist/venue is public - for search results)
-- Note: Must be created after artists and venues tables exist
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (
    deleted_at IS NULL AND (
      EXISTS (SELECT 1 FROM artists WHERE profile_id = profiles.id AND is_public = true AND deleted_at IS NULL)
      OR
      EXISTS (SELECT 1 FROM venues WHERE profile_id = profiles.id AND is_public = true AND deleted_at IS NULL)
    )
  );
