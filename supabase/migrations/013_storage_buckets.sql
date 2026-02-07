-- Migration: 013_storage_buckets
-- Description: Create storage buckets for avatars, artist media, and venue media
-- Buckets: avatars (5MB), artist-media (10MB), venue-media (10MB)
-- All public (portfolio/marketing images), RLS for write operations

-- =============================================
-- CREATE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('artist-media', 'artist-media', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('venue-media', 'venue-media', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']);

-- =============================================
-- AVATARS BUCKET POLICIES
-- =============================================

-- Public read
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Users can upload to their own folder (path: {userId}/avatar.webp)
CREATE POLICY "avatars_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar (upsert)
CREATE POLICY "avatars_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatar
CREATE POLICY "avatars_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================
-- ARTIST-MEDIA BUCKET POLICIES
-- =============================================

-- Public read
CREATE POLICY "artist_media_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artist-media');

-- Owner = profile that owns the artist (folder = artistId)
CREATE POLICY "artist_media_storage_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artist-media'
    AND EXISTS (
      SELECT 1 FROM artists
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );

CREATE POLICY "artist_media_storage_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'artist-media'
    AND EXISTS (
      SELECT 1 FROM artists
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );

CREATE POLICY "artist_media_storage_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'artist-media'
    AND EXISTS (
      SELECT 1 FROM artists
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );

-- =============================================
-- VENUE-MEDIA BUCKET POLICIES
-- =============================================

-- Public read
CREATE POLICY "venue_media_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'venue-media');

-- Owner = profile that owns the venue (folder = venueId)
CREATE POLICY "venue_media_storage_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'venue-media'
    AND EXISTS (
      SELECT 1 FROM venues
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );

CREATE POLICY "venue_media_storage_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'venue-media'
    AND EXISTS (
      SELECT 1 FROM venues
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );

CREATE POLICY "venue_media_storage_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'venue-media'
    AND EXISTS (
      SELECT 1 FROM venues
      WHERE id = (storage.foldername(name))[1]::uuid
        AND profile_id = auth.uid()
    )
  );
