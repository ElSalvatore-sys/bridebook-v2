-- ============================================================
-- Migration 016: Security Hardening
-- Removes anon access to profiles (PII leak: email, phone)
-- Adds missing email_logs INSERT policy for EmailService.send()
-- ============================================================

-- Remove anon access to profiles (PII leak: email, phone exposed)
DROP POLICY IF EXISTS profiles_select_public ON profiles;

-- Only authenticated users can read profiles
CREATE POLICY profiles_select_authenticated ON profiles
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Allow authenticated users to INSERT email logs (for EmailService.send())
CREATE POLICY email_logs_insert_authenticated ON email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
