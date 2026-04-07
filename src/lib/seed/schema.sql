-- ═══════════════════════════════════════════════════════
-- COASTISCLEAR — Database Schema
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Rights holders (labels, publishers, administrators)
CREATE TABLE rights_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('publisher', 'label', 'independent', 'both')),
  parent_company TEXT,
  administrator TEXT,
  administered_by_id UUID REFERENCES rights_holders(id),
  email TEXT,
  phone TEXT,
  address TEXT,
  department TEXT,
  aliases TEXT[] DEFAULT '{}',
  no_sample_policy BOOLEAN DEFAULT false,
  deceased BOOLEAN DEFAULT false,
  estate_contact TEXT,
  contact_last_verified DATE,
  contact_verified_by TEXT,
  avg_fee_master TEXT,
  avg_fee_publishing TEXT,
  avg_response_weeks TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Song ownership lookup
CREATE TABLE song_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  publisher_id UUID REFERENCES rights_holders(id),
  label_id UUID REFERENCES rights_holders(id),
  writers JSONB DEFAULT '[]',
  pro TEXT,
  pro_id TEXT,
  confidence_score INT DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  source TEXT[] DEFAULT '{}',
  is_production_library BOOLEAN DEFAULT false,
  library_name TEXT,
  flat_buyout_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Distributors
CREATE TABLE distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_company TEXT,
  known_label_relationships TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects (artist + album grouping)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  project_title TEXT,
  record_label TEXT,
  distributor TEXT,
  planned_release_date DATE,
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'released', 'on_hold', 'cancelled')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clearance pipeline
CREATE TABLE clearance_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  new_song_title TEXT,
  sampled_song_title TEXT NOT NULL,
  original_artist TEXT NOT NULL,
  reference_url TEXT,
  reference_type TEXT CHECK (
    reference_type IN ('youtube', 'spotify', 'soundcloud', 'dropbox', 'upload', 'other')
  ),
  version_verified BOOLEAN DEFAULT false,
  original_timing_start TEXT,
  original_timing_end TEXT,
  new_timing_start TEXT,
  new_timing_end TEXT,
  prominence_signal TEXT CHECK (
    prominence_signal IN ('high', 'moderate', 'low')
  ),
  sample_use_description TEXT,
  sample_use_tags TEXT[] DEFAULT '{}',
  intended_use TEXT,
  release_context TEXT CHECK (
    release_context IN ('major_label', 'independent_label', 'self_released', 'distributor', 'unknown')
  ),
  releasing_label TEXT,
  distributor TEXT,
  master_holder TEXT,
  publishing_holder TEXT,
  status TEXT DEFAULT 'identifying' CHECK (
    status IN (
      'identifying', 'letter_sent', 'negotiating', 'cleared', 'blocked',
      'writer_unreachable', 'estate_required', 'reduction_requested',
      'reduction_denied', 'interpolating', 'master_replayed', 'retracted'
    )
  ),
  quote_expiration DATE,
  quote_amount TEXT,
  quote_terms TEXT,
  letter_drafted BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pipeline steps (nine-step system, per side)
CREATE TABLE pipeline_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES clearance_pipeline(id) ON DELETE CASCADE,
  rights_type TEXT NOT NULL CHECK (rights_type IN ('master', 'publishing')),
  step_number INT NOT NULL CHECK (step_number BETWEEN 0 AND 9),
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  writer_approval_required BOOLEAN DEFAULT false,
  writer_approval_obtained BOOLEAN DEFAULT false,
  writer_approval_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (pipeline_id, rights_type, step_number)
);

-- Pipeline activity log
CREATE TABLE pipeline_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES clearance_pipeline(id) ON DELETE CASCADE,
  step_number INT,
  rights_type TEXT,
  action TEXT NOT NULL,
  performed_by TEXT,
  performed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Generated letters
CREATE TABLE clearance_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES clearance_pipeline(id) ON DELETE CASCADE,
  letter_type TEXT CHECK (letter_type IN ('master', 'publishing', 'combined')),
  template_type TEXT CHECK (
    template_type IN ('request', 'confirmation', 'summary', 'payment', 'delivery')
  ),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NDA acceptances
CREATE TABLE nda_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Full-text search indexes
CREATE INDEX idx_song_ownership_title ON song_ownership
  USING gin (to_tsvector('english', song_title));
CREATE INDEX idx_song_ownership_artist ON song_ownership
  USING gin (to_tsvector('english', artist));
CREATE INDEX idx_rights_holders_name ON rights_holders
  USING gin (to_tsvector('english', name));
CREATE INDEX idx_pipeline_status ON clearance_pipeline(status);
CREATE INDEX idx_pipeline_steps_pipeline ON pipeline_steps(pipeline_id);
