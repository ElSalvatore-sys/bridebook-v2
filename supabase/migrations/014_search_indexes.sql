-- Phase 10: Search Infrastructure
-- Full-text search indexes and RPC functions for artists and venues
-- Uses 'simple' config (no stemming) for German proper nouns

-- pg_trgm already enabled in 001_enums.sql

-- Full-text search GIN indexes (alongside existing trigram indexes)
CREATE INDEX IF NOT EXISTS idx_artists_fts
  ON artists USING gin(to_tsvector('simple', coalesce(stage_name,'') || ' ' || coalesce(bio,'')));

CREATE INDEX IF NOT EXISTS idx_venues_fts
  ON venues USING gin(to_tsvector('simple', coalesce(venue_name,'') || ' ' || coalesce(description,'')));

-- search_artists: full-text + trigram fallback with JSONB filters
CREATE OR REPLACE FUNCTION search_artists(
  search_query text,
  filters jsonb DEFAULT '{}'::jsonb,
  result_limit int DEFAULT 20,
  result_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  stage_name text,
  bio text,
  hourly_rate numeric,
  years_experience int,
  has_equipment boolean,
  primary_image_url text,
  genre_names text[],
  rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tsq tsquery;
BEGIN
  -- Build tsquery from search input
  tsq := plainto_tsquery('simple', search_query);

  RETURN QUERY
  SELECT
    a.id,
    a.stage_name,
    a.bio,
    a.hourly_rate,
    a.years_experience,
    a.has_equipment,
    (
      SELECT am.url
      FROM artist_media am
      WHERE am.artist_id = a.id AND am.is_primary = true
      LIMIT 1
    ) AS primary_image_url,
    (
      SELECT coalesce(array_agg(g.name ORDER BY g.name), ARRAY[]::text[])
      FROM artist_genres ag
      JOIN genres g ON g.id = ag.genre_id
      WHERE ag.artist_id = a.id
    ) AS genre_names,
    CASE
      WHEN tsq::text <> '' AND to_tsvector('simple', coalesce(a.stage_name,'') || ' ' || coalesce(a.bio,'')) @@ tsq
      THEN ts_rank(to_tsvector('simple', coalesce(a.stage_name,'') || ' ' || coalesce(a.bio,'')), tsq)
      ELSE 0.1
    END AS rank
  FROM artists a
  WHERE
    a.is_public = true
    AND a.deleted_at IS NULL
    -- Full-text match OR trigram ILIKE fallback
    AND (
      (tsq::text <> '' AND to_tsvector('simple', coalesce(a.stage_name,'') || ' ' || coalesce(a.bio,'')) @@ tsq)
      OR a.stage_name ILIKE '%' || search_query || '%'
      OR a.bio ILIKE '%' || search_query || '%'
    )
    -- Optional genre filter
    AND (
      NOT (filters ? 'genre_id')
      OR EXISTS (
        SELECT 1 FROM artist_genres ag2
        WHERE ag2.artist_id = a.id AND ag2.genre_id = (filters->>'genre_id')::uuid
      )
    )
    -- Optional price range filters
    AND (
      NOT (filters ? 'price_min')
      OR a.hourly_rate >= (filters->>'price_min')::numeric
    )
    AND (
      NOT (filters ? 'price_max')
      OR a.hourly_rate <= (filters->>'price_max')::numeric
    )
  ORDER BY rank DESC, a.stage_name ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

-- search_venues: full-text + trigram fallback with JSONB filters
CREATE OR REPLACE FUNCTION search_venues(
  search_query text,
  filters jsonb DEFAULT '{}'::jsonb,
  result_limit int DEFAULT 20,
  result_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  venue_name text,
  description text,
  type venue_type,
  city_name text,
  capacity_min int,
  capacity_max int,
  primary_image_url text,
  amenity_names text[],
  rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tsq tsquery;
BEGIN
  tsq := plainto_tsquery('simple', search_query);

  RETURN QUERY
  SELECT
    v.id,
    v.venue_name,
    v.description,
    v.type,
    c.name AS city_name,
    v.capacity_min,
    v.capacity_max,
    (
      SELECT vm.url
      FROM venue_media vm
      WHERE vm.venue_id = v.id AND vm.is_primary = true
      LIMIT 1
    ) AS primary_image_url,
    (
      SELECT coalesce(array_agg(am.name ORDER BY am.name), ARRAY[]::text[])
      FROM venue_amenities va
      JOIN amenities am ON am.id = va.amenity_id
      WHERE va.venue_id = v.id
    ) AS amenity_names,
    CASE
      WHEN tsq::text <> '' AND to_tsvector('simple', coalesce(v.venue_name,'') || ' ' || coalesce(v.description,'')) @@ tsq
      THEN ts_rank(to_tsvector('simple', coalesce(v.venue_name,'') || ' ' || coalesce(v.description,'')), tsq)
      ELSE 0.1
    END AS rank
  FROM venues v
  LEFT JOIN cities c ON c.id = v.city_id
  WHERE
    v.is_public = true
    AND v.deleted_at IS NULL
    AND (
      (tsq::text <> '' AND to_tsvector('simple', coalesce(v.venue_name,'') || ' ' || coalesce(v.description,'')) @@ tsq)
      OR v.venue_name ILIKE '%' || search_query || '%'
      OR v.description ILIKE '%' || search_query || '%'
    )
    -- Optional venue type filter
    AND (
      NOT (filters ? 'venue_type')
      OR v.type = (filters->>'venue_type')::venue_type
    )
    -- Optional city filter
    AND (
      NOT (filters ? 'city_id')
      OR v.city_id = (filters->>'city_id')::uuid
    )
    -- Optional capacity filters
    AND (
      NOT (filters ? 'capacity_min')
      OR v.capacity_max >= (filters->>'capacity_min')::int
    )
    AND (
      NOT (filters ? 'capacity_max')
      OR v.capacity_min <= (filters->>'capacity_max')::int
    )
  ORDER BY rank DESC, v.venue_name ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;
