-- Supabase Migration & Setup Script for Smriti Cognitive Care Platform
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- It will create all tables, indexes, Row Level Security (RLS) policies, and seed sample data.

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('elder', 'caregiver', 'asha', 'family');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'care_permission') THEN
        CREATE TYPE care_permission AS ENUM ('view_only', 'can_call', 'view_trends_and_alerts', 'full_manage');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_category') THEN
        CREATE TYPE reminder_category AS ENUM ('medicine', 'activity', 'hydration', 'meal', 'voice');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_status') THEN
        CREATE TYPE reminder_status AS ENUM ('pending', 'on_time', 'late', 'missed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trend_direction') THEN
        CREATE TYPE trend_direction AS ENUM ('rising', 'stable', 'declining');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
        CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
    END IF;
END $$;

-- 3. Tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    phone VARCHAR(20) UNIQUE NOT NULL,
    hashed_pin VARCHAR(255),
    role user_role NOT NULL DEFAULT 'elder',
    name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    language_code VARCHAR(10) NOT NULL DEFAULT 'as',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS care_circle_links (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL,
    permission_level care_permission NOT NULL DEFAULT 'view_trends_and_alerts',
    can_receive_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    call_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1,
    UNIQUE(patient_id, member_id)
);

CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category reminder_category NOT NULL DEFAULT 'medicine',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    completion_status reminder_status NOT NULL DEFAULT 'pending',
    response_delay_minutes INT DEFAULT 0,
    audio_prompt_url TEXT,
    local_audio_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS exercise_catalog (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'easy',
    supported_locales VARCHAR(10)[] NOT NULL DEFAULT ARRAY['as', 'en', 'hi', 'bn'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercise_sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'steady',
    duration_seconds INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    session_score INT NOT NULL DEFAULT 80,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS daily_activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    reminders_scheduled INT NOT NULL DEFAULT 0,
    reminders_completed INT NOT NULL DEFAULT 0,
    reminders_on_time INT NOT NULL DEFAULT 0,
    reminders_late INT NOT NULL DEFAULT 0,
    reminders_missed INT NOT NULL DEFAULT 0,
    exercise_session_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    app_opened BOOLEAN NOT NULL DEFAULT FALSE,
    active_minutes INT NOT NULL DEFAULT 0,
    session_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1,
    UNIQUE(patient_id, log_date)
);

CREATE TABLE IF NOT EXISTS daily_scores (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score_date DATE NOT NULL,
    adherence_score NUMERIC(5,2),
    cognitive_score NUMERIC(5,2),
    engagement_score NUMERIC(5,2),
    composite_score NUMERIC(5,2) NOT NULL,
    weights_used JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, score_date)
);

CREATE TABLE IF NOT EXISTS cognitive_trends (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trend_date DATE NOT NULL,
    rolling_7d_composite NUMERIC(5,2) NOT NULL,
    rolling_7d_adherence NUMERIC(5,2),
    rolling_7d_cognitive NUMERIC(5,2),
    rolling_7d_engagement NUMERIC(5,2),
    baseline_composite NUMERIC(5,2) NOT NULL,
    baseline_days_counted INT NOT NULL DEFAULT 14,
    composite_trend trend_direction NOT NULL DEFAULT 'stable',
    adherence_trend trend_direction NOT NULL DEFAULT 'stable',
    cognitive_trend trend_direction NOT NULL DEFAULT 'stable',
    engagement_trend trend_direction NOT NULL DEFAULT 'stable',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, trend_date)
);

CREATE TABLE IF NOT EXISTS caregiver_alerts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_key VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'warning',
    trigger_metric VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    UNIQUE(patient_id, episode_key)
);

CREATE TABLE IF NOT EXISTS care_actions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id TEXT NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    recipient_phone VARCHAR(20),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_changelog (
    id BIGSERIAL PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL,
    payload JSONB NOT NULL,
    server_version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_circle_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_changelog ENABLE ROW LEVEL SECURITY;

-- 5. Permissive Policies for App Access (Allows authenticated or server role service keys)
CREATE POLICY "Allow public read/write for Smriti App" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON exercise_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON daily_activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON daily_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON cognitive_trends FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON caregiver_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON care_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for Smriti App" ON sync_changelog FOR ALL USING (true) WITH CHECK (true);

-- 6. Initial Seed Data
INSERT INTO users (id, phone, role, name, preferred_name, language_code) VALUES
('patient-aita-001', '+919876543210', 'elder', 'Bonti Khound', 'Aita', 'as'),
('caregiver-ananya-002', '+919876543211', 'caregiver', 'Ananya Bora', 'Anu', 'as'),
('asha-rina-003', '+919876543212', 'asha', 'Rina Das', 'Rina Baideo', 'as')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exercise_catalog (id, title, description, category, difficulty, supported_locales) VALUES
('image-card-matching', 'Cultural Memory Cards', 'Match familiar Assamese cultural tokens with gentle audio', 'memory', 'easy', ARRAY['as', 'en', 'hi', 'bn']),
('pattern-recall', 'Bihu Rhythm Pattern Recall', 'Memorize and tap sequence of traditional instruments', 'working_memory', 'medium', ARRAY['as', 'en', 'hi', 'bn'])
ON CONFLICT (id) DO NOTHING;
