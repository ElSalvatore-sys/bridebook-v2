-- Migration: 007_messaging_tables
-- Description: Create messaging system tables (message_threads, messages)
-- Dependencies: 003_core_tables (profiles), 006_booking_tables (booking_requests)

-- =============================================
-- MESSAGE_THREADS (Conversation container)
-- =============================================

CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Optional link to booking
  booking_request_id UUID REFERENCES booking_requests(id) ON DELETE SET NULL,

  -- Participants
  participant_one_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_two_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Metadata
  subject TEXT,
  last_message_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_threads_participant_one ON message_threads(participant_one_id);
CREATE INDEX idx_threads_participant_two ON message_threads(participant_two_id);
CREATE INDEX idx_threads_booking ON message_threads(booking_request_id) WHERE booking_request_id IS NOT NULL;

-- Unique constraint to prevent duplicate threads between same participants
CREATE UNIQUE INDEX idx_threads_unique_pair ON message_threads(
  LEAST(participant_one_id, participant_two_id),
  GREATEST(participant_one_id, participant_two_id)
);

-- RLS
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

-- Only participants can SELECT
CREATE POLICY "threads_select_participant" ON message_threads
  FOR SELECT USING (auth.uid() IN (participant_one_id, participant_two_id));

-- Any authenticated user can start a thread (must be a participant)
CREATE POLICY "threads_insert_participant" ON message_threads
  FOR INSERT WITH CHECK (auth.uid() IN (participant_one_id, participant_two_id));

-- Participants can UPDATE (last_message_at, subject)
CREATE POLICY "threads_update_participant" ON message_threads
  FOR UPDATE USING (auth.uid() IN (participant_one_id, participant_two_id));

-- Admin full access
CREATE POLICY "threads_admin_all" ON message_threads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- MESSAGES (Individual messages)
-- =============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- Nullable for deleted users

  -- Content
  content TEXT NOT NULL,

  -- Read status
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(thread_id) WHERE is_read = FALSE;

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Only thread participants can SELECT
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE id = messages.thread_id
      AND auth.uid() IN (participant_one_id, participant_two_id)
    )
  );

-- Only thread participants can INSERT (sender must = auth.uid())
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM message_threads
      WHERE id = messages.thread_id
      AND auth.uid() IN (participant_one_id, participant_two_id)
    )
  );

-- Only recipient can UPDATE (mark as read)
CREATE POLICY "messages_update_recipient" ON messages
  FOR UPDATE USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM message_threads
      WHERE id = messages.thread_id
      AND auth.uid() IN (participant_one_id, participant_two_id)
    )
  );

-- Admin full access
CREATE POLICY "messages_admin_all" ON messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =============================================
-- TRIGGER: Update thread.last_message_at
-- =============================================

-- SECURITY DEFINER bypasses RLS to allow trigger to update threads
-- SET search_path = public prevents search_path injection attacks
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE message_threads
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_thread_last_message();
