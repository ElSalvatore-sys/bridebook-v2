-- Migration: 002_lookup_tables
-- Description: Create lookup/reference tables with RLS
-- Tables: regions, cities, genres, amenities, categories

-- =============================================
-- REGIONS (German Bundesländer)
-- =============================================

CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'DE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_regions_slug ON regions(slug);
CREATE INDEX idx_regions_country ON regions(country_code);

-- RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions_select_all" ON regions
  FOR SELECT USING (true);

-- =============================================
-- CITIES
-- =============================================

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  postal_code_prefix VARCHAR(2),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_cities_region_slug ON cities(region_id, slug);
CREATE INDEX idx_cities_region ON cities(region_id);
CREATE INDEX idx_cities_name_gin ON cities USING gin(name gin_trgm_ops);
CREATE INDEX idx_cities_postal ON cities(postal_code_prefix);

-- RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cities_select_all" ON cities
  FOR SELECT USING (true);

-- =============================================
-- GENRES (Music genres with hierarchy)
-- =============================================

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES genres(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_genres_slug ON genres(slug);
CREATE INDEX idx_genres_parent ON genres(parent_id);
CREATE INDEX idx_genres_name_gin ON genres USING gin(name gin_trgm_ops);

-- RLS
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "genres_select_all" ON genres
  FOR SELECT USING (true);

-- =============================================
-- AMENITIES (Venue features)
-- =============================================

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_amenities_slug ON amenities(slug);

-- RLS
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "amenities_select_all" ON amenities
  FOR SELECT USING (true);

-- =============================================
-- CATEGORIES (Event/booking categories)
-- =============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type category_type NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_categories_type_slug ON categories(type, slug);
CREATE INDEX idx_categories_type ON categories(type);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);
