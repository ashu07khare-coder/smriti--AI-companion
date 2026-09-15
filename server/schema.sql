-- Smriti Backend Database Schema (PostgreSQL)
-- Platform: Cognitive gaming & memory assistance for elderly dementia patients in NER India
-- Supports: Offline-first delta sync, multi-language content, encrypted sensitive data, 
--           local-only photo references, and granular care circle permissions.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS & PROFILES
-- ============================================================================
CREATE TYPE user_role AS ENUM ('elder', 'caregiver', 'asha', 'family');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    hashed_pin VARCHAR(255), -- For Caregiver Mode quick PIN verification
    role user_role NOT NULL DEFAULT 'elder',
    name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100), -- e.g. "Aita", "Koka", "Maa"
    language_code VARCHAR(10) NOT NULL DEFAULT 'as', -- ISO-639-1 ('as', 'hi', 'bn', 'en')
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

-- ============================================================================
-- 2. CARE CIRCLE (Many-to-Many with granular permission levels)
-- ============================================================================
CREATE TYPE care_permission AS ENUM (
    'view_only', 
    'can_call', 
    'view_trends_and_alerts', 
    'full_manage'
);

CREATE TABLE care_circle_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL, -- e.g. 'Daughter', 'Son', 'ASHA Worker'
    permission_level care_permission NOT NULL DEFAULT 'view_trends_and_alerts',
    can_receive_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    call_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1,
    UNIQUE(patient_id, member_id)
);

-- ============================================================================
-- 3. DAILY PLAN & REMINDERS (With Timeliness Tracking)
-- ============================================================================
CREATE TYPE reminder_category AS ENUM ('medicine', 'activity', 'hydration', 'meal', 'voice');
CREATE TYPE reminder_status AS ENUM ('pending', 'on_time', 'late', 'missed');

CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    scheduled_time VARCHAR(20) NOT NULL, -- "09:30 AM" or "09:30"
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category reminder_category NOT NULL DEFAULT 'activity',
    recurrence VARCHAR(50) DEFAULT 'Daily',
    voice_prompt_text TEXT, -- Multilingual spoken prompt text
    local_audio_id VARCHAR(100), -- Reference ONLY to on-device audio / never cloud raw binary
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    completion_status reminder_status NOT NULL DEFAULT 'pending',
    response_delay_minutes INT, -- difference between completed_at and scheduled_time
    created_by_role VARCHAR(30) DEFAULT 'caregiver',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

-- ============================================================================
-- 4. COGNITIVE EXERCISES & SESSIONS (Flexible JSONB details)
-- ============================================================================
CREATE TABLE cognitive_exercises (
    id VARCHAR(50) PRIMARY KEY, -- 'image-card-matching', 'pattern-recall', etc.
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'memory', 'executive_function'
    supported_levels JSONB NOT NULL, -- e.g. ["gentle", "easy", "steady", "deeper"]
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exercise_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id VARCHAR(50) REFERENCES cognitive_exercises(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- 'as', 'en', 'bn', 'hi'
    title VARCHAR(100) NOT NULL,
    instruction_text TEXT NOT NULL,
    voice_prompt_text TEXT,
    UNIQUE(exercise_id, language_code)
);

CREATE TABLE exercise_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id VARCHAR(50) NOT NULL REFERENCES cognitive_exercises(id),
    level VARCHAR(30) NOT NULL,
    duration_seconds INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    session_score INT NOT NULL, -- 0-100 normalized score
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    -- Holds exercise-specific payloads without requiring schema migration for new games:
    -- For 'image-card-matching': { pairsTotal, movesTaken, hintsUsed }
    -- For 'pattern-recall': { gridSize, roundsCompleted, roundResults, totalMistakes }
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1
);

-- ============================================================================
-- 5. DAILY ACTIVITY LOGS (One row per patient per day)
-- ============================================================================
CREATE TABLE daily_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    reminders_scheduled INT NOT NULL DEFAULT 0,
    reminders_completed INT NOT NULL DEFAULT 0,
    reminders_on_time INT NOT NULL DEFAULT 0,
    reminders_late INT NOT NULL DEFAULT 0,
    reminders_missed INT NOT NULL DEFAULT 0,
    exercise_session_ids UUID[] DEFAULT ARRAY[]::UUID[],
    app_opened BOOLEAN NOT NULL DEFAULT FALSE,
    active_minutes INT NOT NULL DEFAULT 0,
    session_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 1,
    UNIQUE(patient_id, log_date)
);

-- ============================================================================
-- 6. DAILY SCORES (Computed nightly from Activity Logs)
-- ============================================================================
CREATE TABLE daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score_date DATE NOT NULL,
    adherence_score NUMERIC(5,2), -- NULL if 0 scheduled
    cognitive_score NUMERIC(5,2), -- NULL if 0 sessions completed
    engagement_score NUMERIC(5,2), -- App opens + active minutes
    composite_score NUMERIC(5,2) NOT NULL, -- Dynamic reweighted composite
    weights_used JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, score_date)
);

-- ============================================================================
-- 7. COGNITIVE TRENDS & PERSONAL BASELINE (Rolling 7d & 14d baseline)
-- ============================================================================
CREATE TYPE trend_direction AS ENUM ('rising', 'stable', 'declining');

CREATE TABLE cognitive_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trend_date DATE NOT NULL,
    rolling_7d_composite NUMERIC(5,2) NOT NULL,
    rolling_7d_adherence NUMERIC(5,2),
    rolling_7d_cognitive NUMERIC(5,2),
    rolling_7d_engagement NUMERIC(5,2),
    baseline_composite NUMERIC(5,2) NOT NULL, -- Computed from patient's first ~14 days
    baseline_days_counted INT NOT NULL DEFAULT 14,
    composite_trend trend_direction NOT NULL DEFAULT 'stable',
    adherence_trend trend_direction NOT NULL DEFAULT 'stable',
    cognitive_trend trend_direction NOT NULL DEFAULT 'stable',
    engagement_trend trend_direction NOT NULL DEFAULT 'stable',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, trend_date)
);

-- ============================================================================
-- 8. CAREGIVER ALERTS & NOTIFICATIONS (De-duplicated episodes)
-- ============================================================================
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');

CREATE TABLE caregiver_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_key VARCHAR(100) NOT NULL, -- e.g. "decline_cognitive_2026-09" or "inactivity_2026-09-14"
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'warning',
    trigger_metric VARCHAR(50) NOT NULL, -- 'no_activity_3d', 'cognitive_decline', 'adherence_drop'
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'resolved', 'acknowledged'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    UNIQUE(patient_id, episode_key)
);

-- ============================================================================
-- 9. CARE ACTIONS LOG
-- ============================================================================
CREATE TABLE care_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- 'CALL_ELDER', 'SHARE_WITH_ASHA'
    recipient_phone VARCHAR(20),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. SYNC CHANGELOG & DEVICE STATE (Incremental Delta Sync)
-- ============================================================================
CREATE TABLE sync_changelog (
    id BIGSERIAL PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'reminders', 'exercise_sessions', 'care_circle'
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    payload JSONB NOT NULL,
    server_version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE device_sync_states (
    device_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_synced_version BIGINT NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (device_id, user_id)
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE DELTA QUERIES & ANALYTICS
-- ============================================================================
CREATE INDEX idx_changelog_sync ON sync_changelog(patient_id, server_version);
CREATE INDEX idx_activity_patient_date ON daily_activity_logs(patient_id, log_date);
CREATE INDEX idx_daily_scores_patient_date ON daily_scores(patient_id, score_date);
CREATE INDEX idx_exercise_sessions_patient ON exercise_sessions(patient_id, started_at);
CREATE INDEX idx_reminders_patient_date ON reminders(patient_id, scheduled_date);
