# Database Schema — Bridebook Wedding Planning Platform

> **Engine:** PostgreSQL 15+
> **Primary Keys:** UUID v4
> **Timestamps:** `TIMESTAMPTZ` everywhere
> **Naming:** `snake_case`, singular table names

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. USERS & AUTH
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('couple', 'vendor', 'admin')),
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    avatar_url      TEXT,
    phone           TEXT,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);
CREATE INDEX idx_users_role ON users (role);

CREATE TABLE user_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    ip_address      INET,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions (expires_at);

CREATE TABLE password_resets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    used            BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_resets_user_id ON password_resets (user_id);

-- ============================================================
-- 2. WEDDINGS
-- ============================================================

CREATE TABLE weddings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner1_name   TEXT NOT NULL,
    partner2_name   TEXT NOT NULL,
    wedding_date    DATE,
    venue_city      TEXT,
    estimated_guests INT CHECK (estimated_guests >= 0),
    total_budget    NUMERIC(12,2) CHECK (total_budget >= 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    status          TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weddings_user_id ON weddings (user_id);
CREATE INDEX idx_weddings_date ON weddings (wedding_date);

CREATE TABLE wedding_settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL UNIQUE REFERENCES weddings(id) ON DELETE CASCADE,
    preferences     JSONB NOT NULL DEFAULT '{}',
    privacy         TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('private', 'shared', 'public')),
    theme           TEXT,
    locale          TEXT NOT NULL DEFAULT 'de-DE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN wedding_settings.preferences IS 'Free-form couple preferences: style, colors, dietary, etc.';

-- ============================================================
-- 3. CATEGORIES & GEOGRAPHY
-- ============================================================

CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL UNIQUE,
    slug            TEXT NOT NULL UNIQUE,
    icon            TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subcategories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (category_id, slug)
);

CREATE INDEX idx_subcategories_category_id ON subcategories (category_id);

CREATE TABLE regions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL UNIQUE,
    slug            TEXT NOT NULL UNIQUE,
    country_code    TEXT NOT NULL DEFAULT 'DE' CHECK (char_length(country_code) = 2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id       UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (region_id, slug)
);

CREATE INDEX idx_cities_region_id ON cities (region_id);
CREATE INDEX idx_cities_name_trgm ON cities USING gin (name gin_trgm_ops);

-- ============================================================
-- 4. VENDORS
-- ============================================================

CREATE TABLE vendors (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id  UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    city_id         UUID REFERENCES cities(id) ON DELETE SET NULL,
    business_name   TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    cover_image_url TEXT,
    website         TEXT,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    min_price       NUMERIC(10,2) CHECK (min_price >= 0),
    max_price       NUMERIC(10,2) CHECK (max_price >= 0),
    avg_rating      NUMERIC(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    review_count    INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (max_price IS NULL OR min_price IS NULL OR max_price >= min_price)
);

CREATE INDEX idx_vendors_category_id ON vendors (category_id);
CREATE INDEX idx_vendors_subcategory_id ON vendors (subcategory_id);
CREATE INDEX idx_vendors_city_id ON vendors (city_id);
CREATE INDEX idx_vendors_status ON vendors (status);
CREATE INDEX idx_vendors_name_trgm ON vendors USING gin (business_name gin_trgm_ops);
CREATE INDEX idx_vendors_featured ON vendors (is_featured) WHERE is_featured = TRUE;

COMMENT ON COLUMN vendors.metadata IS 'Vendor-specific attributes: capacity, amenities, languages, etc.';

CREATE TABLE vendor_images (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_images_vendor_id ON vendor_images (vendor_id);

CREATE TABLE vendor_packages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_packages_vendor_id ON vendor_packages (vendor_id);

CREATE TABLE vendor_availability (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vendor_id, date)
);

CREATE INDEX idx_vendor_availability_lookup ON vendor_availability (vendor_id, date, status);

CREATE TABLE vendor_hours (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time       TIME NOT NULL,
    close_time      TIME NOT NULL,
    is_closed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vendor_id, day_of_week)
);

COMMENT ON COLUMN vendor_hours.day_of_week IS '0 = Monday, 6 = Sunday (ISO 8601)';

CREATE INDEX idx_vendor_hours_vendor_id ON vendor_hours (vendor_id);

-- ============================================================
-- 5. INTERACTIONS
-- ============================================================

CREATE TABLE enquiries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    subject         TEXT,
    wedding_date    DATE,
    guest_count     INT CHECK (guest_count >= 0),
    budget_range    TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'booked', 'declined', 'archived')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_enquiries_wedding_id ON enquiries (wedding_id);
CREATE INDEX idx_enquiries_vendor_id ON enquiries (vendor_id);
CREATE INDEX idx_enquiries_status ON enquiries (status);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id      UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body            TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_enquiry_id ON messages (enquiry_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);

CREATE TABLE message_attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id      UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_url        TEXT NOT NULL,
    file_name       TEXT NOT NULL,
    file_size       INT CHECK (file_size > 0),
    mime_type       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_attachments_message_id ON message_attachments (message_id);

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    overall_rating  SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    quality_rating  SMALLINT CHECK (quality_rating BETWEEN 1 AND 5),
    value_rating    SMALLINT CHECK (value_rating BETWEEN 1 AND 5),
    service_rating  SMALLINT CHECK (service_rating BETWEEN 1 AND 5),
    title           TEXT,
    body            TEXT,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    vendor_reply    TEXT,
    vendor_replied_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_reviews_vendor_id ON reviews (vendor_id);
CREATE INDEX idx_reviews_wedding_id ON reviews (wedding_id);
CREATE INDEX idx_reviews_published ON reviews (vendor_id, is_published) WHERE is_published = TRUE;

CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wedding_id, vendor_id)
);

CREATE INDEX idx_favorites_wedding_id ON favorites (wedding_id);
CREATE INDEX idx_favorites_vendor_id ON favorites (vendor_id);

-- ============================================================
-- 6. PLANNING
-- ============================================================

CREATE TABLE task_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    months_before   INT CHECK (months_before >= 0),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN task_templates.months_before IS 'Suggested months before wedding to complete this task';

CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    template_id     UUID REFERENCES task_templates(id) ON DELETE SET NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    due_date        DATE,
    status          TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'skipped')),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_wedding_id ON tasks (wedding_id);
CREATE INDEX idx_tasks_status ON tasks (wedding_id, status);

CREATE TABLE guest_groups (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guest_groups_wedding_id ON guest_groups (wedding_id);

CREATE TABLE guests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    group_id        UUID REFERENCES guest_groups(id) ON DELETE SET NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    rsvp_status     TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined', 'maybe')),
    dietary_notes   TEXT,
    plus_one        BOOLEAN NOT NULL DEFAULT FALSE,
    is_child        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_wedding_id ON guests (wedding_id);
CREATE INDEX idx_guests_group_id ON guests (group_id);
CREATE INDEX idx_guests_rsvp ON guests (wedding_id, rsvp_status);

CREATE TABLE seating_tables (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    capacity        INT NOT NULL CHECK (capacity > 0),
    table_type      TEXT NOT NULL DEFAULT 'round' CHECK (table_type IN ('round', 'rectangular', 'u_shape', 'custom')),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seating_tables_wedding_id ON seating_tables (wedding_id);

CREATE TABLE seating_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id        UUID NOT NULL REFERENCES seating_tables(id) ON DELETE CASCADE,
    guest_id        UUID NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
    seat_number     INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seating_assignments_table_id ON seating_assignments (table_id);

-- ============================================================
-- 7. BUDGET
-- ============================================================

CREATE TABLE budget_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    allocated       NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (allocated >= 0),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_categories_wedding_id ON budget_categories (wedding_id);

CREATE TABLE budget_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
    vendor_id       UUID REFERENCES vendors(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    estimated_cost  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
    actual_cost     NUMERIC(10,2) CHECK (actual_cost >= 0),
    status          TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'paid', 'cancelled')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_items_category_id ON budget_items (category_id);
CREATE INDEX idx_budget_items_vendor_id ON budget_items (vendor_id);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_item_id  UUID NOT NULL REFERENCES budget_items(id) ON DELETE CASCADE,
    amount          NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (char_length(currency) = 3),
    method          TEXT CHECK (method IN ('bank_transfer', 'credit_card', 'cash', 'paypal', 'other')),
    paid_at         DATE NOT NULL,
    reference       TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_budget_item_id ON payments (budget_item_id);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT,
    data            JSONB,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;

COMMENT ON COLUMN notifications.data IS 'Structured payload: entity type, entity id, action, deep link, etc.';

CREATE TABLE email_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    to_address      TEXT NOT NULL,
    template        TEXT NOT NULL,
    subject         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'bounced')),
    provider_id     TEXT,
    error           TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user_id ON email_logs (user_id);
CREATE INDEX idx_email_logs_status ON email_logs (status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
            t, t
        );
    END LOOP;
END;
$$;
```

## Table Summary

| # | Group | Table | Rows (est. year 1) |
|---|-------|-------|---------------------|
| 1 | Auth | `users` | 10k |
| 2 | Auth | `user_sessions` | 50k |
| 3 | Auth | `password_resets` | 2k |
| 4 | Weddings | `weddings` | 5k |
| 5 | Weddings | `wedding_settings` | 5k |
| 6 | Categories | `categories` | ~15 |
| 7 | Categories | `subcategories` | ~60 |
| 8 | Categories | `regions` | ~16 |
| 9 | Categories | `cities` | ~200 |
| 10 | Vendors | `vendors` | 3k |
| 11 | Vendors | `vendor_images` | 15k |
| 12 | Vendors | `vendor_packages` | 9k |
| 13 | Vendors | `vendor_availability` | 100k |
| 14 | Vendors | `vendor_hours` | 21k |
| 15 | Interactions | `enquiries` | 20k |
| 16 | Interactions | `messages` | 80k |
| 17 | Interactions | `message_attachments` | 10k |
| 18 | Interactions | `reviews` | 5k |
| 19 | Interactions | `favorites` | 25k |
| 20 | Planning | `task_templates` | ~100 |
| 21 | Planning | `tasks` | 50k |
| 22 | Planning | `guest_groups` | 15k |
| 23 | Planning | `guests` | 150k |
| 24 | Planning | `seating_tables` | 10k |
| 25 | Planning | `seating_assignments` | 100k |
| 26 | Budget | `budget_categories` | 25k |
| 27 | Budget | `budget_items` | 50k |
| 28 | Budget | `payments` | 30k |
| 29 | Notifications | `notifications` | 200k |
| 30 | Notifications | `email_logs` | 100k |

**Total: 30 tables**

## Key Design Decisions

1. **UUIDs over serial IDs** — safe for distributed systems, no enumeration attacks
2. **CHECK constraints for enums** — lightweight, no extra tables; easy to extend with `ALTER TABLE ... DROP/ADD CONSTRAINT`
3. **JSONB for flexible data** — `wedding_settings.preferences`, `vendors.metadata`, `notifications.data` avoid schema sprawl
4. **Trigram indexes** — `pg_trgm` on `users.email`, `vendors.business_name`, `cities.name` for fuzzy/typeahead search
5. **Partial indexes** — unread notifications, published reviews, featured vendors for hot-path queries
6. **One review per wedding×vendor** — UNIQUE constraint prevents duplicates
7. **Auto `updated_at`** — single trigger function applied dynamically to all tables with the column
8. **`vendor_availability` unique on (vendor_id, date)** — prevents double-booking at the DB level
9. **`seating_assignments.guest_id` UNIQUE** — a guest can only sit at one table
