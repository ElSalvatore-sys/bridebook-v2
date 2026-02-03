-- Migration: 006_booking_tables
-- Description: Create booking workflow tables (booking_requests, booking_request_events)
-- Dependencies: 001_enums (booking_status), 003_core_tables (profiles, artists, venues, update_updated_at)

-- =============================================
-- BOOKING_REQUESTS (Core booking workflow)
-- =============================================

CREATE TABLE booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Status
  status booking_status NOT NULL DEFAULT 'PENDING',

  -- Event details
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Financial
  proposed_rate NUMERIC(10,2),
  agreed_rate NUMERIC(10,2),

  -- Notes
  venue_notes TEXT,
  artist_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_booking_requests_artist ON booking_requests(artist_id, status, event_date);
CREATE INDEX idx_booking_requests_venue ON booking_requests(venue_id, status, event_date);
CREATE INDEX idx_booking_requests_requester ON booking_requests(requester_id);
CREATE INDEX idx_booking_requests_date ON booking_requests(event_date) WHERE deleted_at IS NULL;

-- Trigger: Auto-update updated_at
CREATE TRIGGER booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Participants can SELECT (active bookings only)
CREATE POLICY "booking_requests_select_participant" ON booking_requests
  FOR SELECT USING (
    deleted_at IS NULL
    AND (
      EXISTS (SELECT 1 FROM artists WHERE id = booking_requests.artist_id AND profile_id = auth.uid())
      OR EXISTS (SELECT 1 FROM venues WHERE id = booking_requests.venue_id AND profile_id = auth.uid())
    )
  );

-- Profile owners of artist/venue can INSERT
CREATE POLICY "booking_requests_insert_own" ON booking_requests
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM artists WHERE id = booking_requests.artist_id AND profile_id = auth.uid())
    OR EXISTS (SELECT 1 FROM venues WHERE id = booking_requests.venue_id AND profile_id = auth.uid())
  );

-- Participants can UPDATE
CREATE POLICY "booking_requests_update_participant" ON booking_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM artists WHERE id = booking_requests.artist_id AND profile_id = auth.uid())
    OR EXISTS (SELECT 1 FROM venues WHERE id = booking_requests.venue_id AND profile_id = auth.uid())
  );

-- Admin full access
CREATE POLICY "booking_requests_admin_all" ON booking_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- BOOKING_REQUEST_EVENTS (Audit Log - IMMUTABLE)
-- =============================================

CREATE TABLE booking_request_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,  -- Audit logs must be preserved

  -- Status transition
  previous_status booking_status,
  new_status booking_status NOT NULL,

  -- Context
  note TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_booking_events_request ON booking_request_events(booking_request_id);
CREATE INDEX idx_booking_events_actor ON booking_request_events(actor_id);

-- RLS
ALTER TABLE booking_request_events ENABLE ROW LEVEL SECURITY;

-- Note: This table is IMMUTABLE - no UPDATE or DELETE policies for non-admins

-- Participants can view history
CREATE POLICY "booking_events_select_participant" ON booking_request_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM booking_requests br
      WHERE br.id = booking_request_events.booking_request_id
      AND (
        EXISTS (SELECT 1 FROM artists WHERE id = br.artist_id AND profile_id = auth.uid())
        OR EXISTS (SELECT 1 FROM venues WHERE id = br.venue_id AND profile_id = auth.uid())
      )
    )
  );

-- Participants can INSERT (log their actions)
CREATE POLICY "booking_events_insert_participant" ON booking_request_events
  FOR INSERT WITH CHECK (
    actor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM booking_requests br
      WHERE br.id = booking_request_events.booking_request_id
      AND (
        EXISTS (SELECT 1 FROM artists WHERE id = br.artist_id AND profile_id = auth.uid())
        OR EXISTS (SELECT 1 FROM venues WHERE id = br.venue_id AND profile_id = auth.uid())
      )
    )
  );

-- Admin full access
CREATE POLICY "booking_events_admin_all" ON booking_request_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
