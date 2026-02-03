-- Migration: 001_enums
-- Description: Create all enum types and enable required extensions
-- Enums: profile_role, booking_status, venue_type, media_type, favorite_type, category_type

-- =============================================
-- EXTENSIONS
-- =============================================

-- Enable trigram extension for fuzzy text search (GIN indexes)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- ENUM TYPES
-- =============================================

-- profile_role: Role-based access control
-- USER = Default role for new signups
-- ARTIST = Has associated artist record
-- VENUE = Has associated venue record
-- ADMIN = Platform administrator
CREATE TYPE profile_role AS ENUM ('USER', 'ARTIST', 'VENUE', 'ADMIN');

-- booking_status: Booking lifecycle states
-- PENDING = Initial request sent
-- ACCEPTED = Artist accepted the booking
-- DECLINED = Artist declined the booking
-- CANCELLED = Either party cancelled
-- COMPLETED = Event has occurred
CREATE TYPE booking_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'COMPLETED');

-- venue_type: Venue classification
CREATE TYPE venue_type AS ENUM ('BAR', 'CLUB', 'RESTAURANT', 'HOTEL', 'EVENT_SPACE', 'OTHER');

-- media_type: Media file types
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- favorite_type: What's being favorited
CREATE TYPE favorite_type AS ENUM ('ARTIST', 'VENUE');

-- category_type: Distinguish category purpose
-- EVENT_TYPE = e.g., Wedding, Corporate, Club Night
-- MUSIC_GENRE = e.g., House, Techno, Hip-Hop
CREATE TYPE category_type AS ENUM ('EVENT_TYPE', 'MUSIC_GENRE');

-- Note: day_of_week uses SMALLINT 0-6 (Sunday=0 through Saturday=6), not an enum
