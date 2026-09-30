-- Campus Fix AI - initial schema
-- Run this manually against your PostgreSQL database before starting the app,
-- e.g.: psql -U postgres -d campus_fix_ai -f V1__init.sql

CREATE TABLE IF NOT EXISTS tickets (
    id                      BIGSERIAL PRIMARY KEY,
    requester_name          VARCHAR(150) NOT NULL,
    requester_email         VARCHAR(150) NOT NULL,
    building                VARCHAR(100) NOT NULL,
    room                    VARCHAR(50),
    equipment_type          VARCHAR(50) NOT NULL,
    description             TEXT NOT NULL,

    ai_category             VARCHAR(50),
    ai_subcategory          VARCHAR(100),
    ai_priority             VARCHAR(20),
    ai_summary              TEXT,
    ai_suggested_response   TEXT,
    ai_analysis_failed      BOOLEAN NOT NULL DEFAULT FALSE,

    assigned_technician     VARCHAR(150),
    status                  VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolution_notes        TEXT,

    created_at              TIMESTAMP NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment (
    id           BIGSERIAL PRIMARY KEY,
    asset_id     VARCHAR(50) NOT NULL UNIQUE,
    name         VARCHAR(150) NOT NULL,
    type         VARCHAR(50) NOT NULL,
    building     VARCHAR(100) NOT NULL,
    room         VARCHAR(50),
    status       VARCHAR(30) NOT NULL DEFAULT 'OPERATIONAL',

    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_ai_priority ON tickets(ai_priority);
CREATE INDEX IF NOT EXISTS idx_tickets_ai_category ON tickets(ai_category);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
