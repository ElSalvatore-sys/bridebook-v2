-- Migration: 010_dev_test_users
-- Description: Documentation for dev test user setup
-- Created: Phase 4 - Authentication Foundation
--
-- IMPORTANT: Test users CANNOT be created via direct SQL because auth.users
-- is managed by Supabase Auth. Users must be created through one of:
-- 1. Supabase Dashboard (Authentication > Users > Add user)
-- 2. Signup flow in the application
-- 3. Supabase CLI (supabase auth admin create-user)
--
-- Test Users to Create:
-- Email: dev-user@test.com    | Password: TestPassword123! | Role: USER
-- Email: dev-artist@test.com  | Password: TestPassword123! | Role: ARTIST
-- Email: dev-venue@test.com   | Password: TestPassword123! | Role: VENUE
-- Email: dev-admin@test.com   | Password: TestPassword123! | Role: ADMIN
--
-- After creating users via Dashboard, run these role updates:
-- (The profile trigger should auto-create profiles, but roles default to USER)

-- UPDATE profiles SET role = 'USER'::profile_role WHERE email = 'dev-user@test.com';
-- UPDATE profiles SET role = 'ARTIST'::profile_role WHERE email = 'dev-artist@test.com';
-- UPDATE profiles SET role = 'VENUE'::profile_role WHERE email = 'dev-venue@test.com';
-- UPDATE profiles SET role = 'ADMIN'::profile_role WHERE email = 'dev-admin@test.com';

-- This file intentionally contains no executable SQL.
-- It serves as documentation for the dev environment setup.
SELECT 'Dev test users documentation migration - no changes applied' AS message;
