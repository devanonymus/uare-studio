begin;

create extension if not exists pgcrypto;

-- =========================================================
-- ENUM TYPES
-- =========================================================

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'uviq_memory_status'
  ) then
    create type uviq_memory_status as enum (
      'verified',
      'inferred',
      'hypothesis',
      'missing',
      'conflicted',
      'archived'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'uviq_mission_status'
  ) then
    create type uviq_mission_status as enum (
      'created',
      'analysing',
      'insufficient_data',
      'ready',
      'awaiting_approval',
      'approved',
      'rejected',
      'executing',
      'completed',
      'measuring',
      'optimising',
      'failed',
      'cancelled',
      'archived'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'uviq_risk_level'
  ) then
    create type uviq_risk_level as enum (
      'low',
      'medium',
      'high',
      'critical'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'uviq_approval_status'
  ) then
    create type uviq_approval_status as enum (
      'not_required',
      'pending',
      'approved',
      'rejected',
      'expired',
      'cancelled'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'uviq_automation_status'
  ) then
    create type uviq_automation_status as enum (
      'draft',
      'ready',
      'awaiting_approval',
      'approved',
      'running',
      'paused',
      'completed',
      'failed',
      'cancelled',
      'archived'
    );
  end if;
end
$$;

-- =========================================================
-- SHARED UPDATED_AT TRIGGER
-- =========================================================

create or replace function set_uviq_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- ORGANISATIONS
-- =========================================================

create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  legal_name text,
  vat_number text,

  country_code char(2) not null default 'IT',
  timezone text not null default 'Europe/Rome',

  status text not null default 'active'
    check (
      status in (
        'active',
        'suspended',
        'archived'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists organisations_updated_at
on organisations;

create trigger organisations_updated_at
before update on organisations
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- BUSINESSES / CLIENT WORKSPACES
-- =========================================================

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  name text not null,
  sector text not null,
  city text,
  country_code char(2) not null default 'IT',

  website_url text,
  primary_goal text,

  lifecycle_stage text not null default 'prospect'
    check (
      lifecycle_stage in (
        'prospect',
        'qualified',
        'proposal',
        'client',
        'inactive',
        'archived'
      )
    ),

  status text not null default 'active'
    check (
      status in (
        'active',
        'paused',
        'archived'
      )
    ),

  settings jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_organisation_idx
  on businesses(organisation_id);

create index if not exists businesses_sector_idx
  on businesses(sector);

create index if not exists businesses_lifecycle_idx
  on businesses(lifecycle_stage);

drop trigger if exists businesses_updated_at
on businesses;

create trigger businesses_updated_at
before update on businesses
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- BUSINESS MEMORY
-- Each item is versionable and evidence-aware.
-- =========================================================

create table if not exists business_memory_entries (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  category text not null,
  memory_key text not null,

  value jsonb not null,

  status uviq_memory_status not null default 'hypothesis',

  confidence numeric(5,4) not null default 0
    check (
      confidence >= 0
      and confidence <= 1
    ),

  source_type text not null default 'system'
    check (
      source_type in (
        'user',
        'website',
        'document',
        'integration',
        'deterministic_check',
        'ai_inference',
        'system'
      )
    ),

  source_reference text,

  version integer not null default 1
    check (version >= 1),

  is_current boolean not null default true,

  verified_at timestamptz,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,

  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    business_id,
    category,
    memory_key,
    version
  )
);

create index if not exists business_memory_current_idx
  on business_memory_entries(
    business_id,
    category,
    memory_key
  )
  where is_current = true;

create index if not exists business_memory_status_idx
  on business_memory_entries(
    business_id,
    status
  );

drop trigger if exists business_memory_updated_at
on business_memory_entries;

create trigger business_memory_updated_at
before update on business_memory_entries
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- EVIDENCE SOURCES
-- =========================================================

create table if not exists evidence_sources (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  source_type text not null
    check (
      source_type in (
        'website',
        'web_search',
        'document',
        'image',
        'video',
        'google_business',
        'analytics',
        'search_console',
        'meta',
        'crm',
        'email',
        'whatsapp',
        'user_input',
        'deterministic_check',
        'other'
      )
    ),

  name text not null,
  uri text,

  content_hash text,

  retrieved_at timestamptz not null default now(),

  retrieval_status text not null default 'available'
    check (
      retrieval_status in (
        'available',
        'partial',
        'unavailable',
        'failed',
        'expired'
      )
    ),

  trust_score numeric(5,4) not null default 0.5
    check (
      trust_score >= 0
      and trust_score <= 1
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists evidence_sources_business_idx
  on evidence_sources(
    business_id,
    source_type
  );

-- =========================================================
-- EVIDENCE CLAIMS
-- Facts, inferences, hypotheses and conflicts.
-- =========================================================

create table if not exists evidence_claims (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  claim text not null,

  classification uviq_memory_status not null,

  confidence numeric(5,4) not null default 0
    check (
      confidence >= 0
      and confidence <= 1
    ),

  verification_note text not null,

  conflict_status text not null default 'none'
    check (
      conflict_status in (
        'none',
        'possible',
        'confirmed',
        'resolved'
      )
    ),

  verification_method text not null default 'ai_review'
    check (
      verification_method in (
        'deterministic',
        'single_source',
        'multi_source',
        'human_review',
        'ai_review'
      )
    ),

  verified_by text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evidence_claims_business_idx
  on evidence_claims(
    business_id,
    classification
  );

drop trigger if exists evidence_claims_updated_at
on evidence_claims;

create trigger evidence_claims_updated_at
before update on evidence_claims
for each row
execute function set_uviq_updated_at();

create table if not exists evidence_claim_sources (
  claim_id uuid not null
    references evidence_claims(id)
    on delete cascade,

  source_id uuid not null
    references evidence_sources(id)
    on delete cascade,

  relevance_score numeric(5,4) not null default 1
    check (
      relevance_score >= 0
      and relevance_score <= 1
    ),

  created_at timestamptz not null default now(),

  primary key (
    claim_id,
    source_id
  )
);

-- =========================================================
-- MISSIONS
-- =========================================================

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  title text not null,
  objective text not null,
  rationale text not null,

  status uviq_mission_status not null default 'created',

  priority integer not null default 3
    check (
      priority between 1 and 5
    ),

  impact text not null default 'medium'
    check (
      impact in (
        'low',
        'medium',
        'high',
        'critical'
      )
    ),

  effort text not null default 'medium'
    check (
      effort in (
        'small',
        'medium',
        'large'
      )
    ),

  risk_level uviq_risk_level not null default 'medium',

  owner_agent text not null,

  approval_required boolean not null default true,

  estimated_cost numeric(12,2),
  currency char(3) not null default 'EUR',

  estimated_start_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,

  dependencies jsonb not null default '[]'::jsonb,
  kpis jsonb not null default '[]'::jsonb,
  evidence_claim_ids jsonb not null default '[]'::jsonb,

  result_summary text,

  version integer not null default 1,

  created_by text not null default 'uviq-orchestrator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists missions_business_status_idx
  on missions(
    business_id,
    status
  );

create index if not exists missions_priority_idx
  on missions(
    business_id,
    priority desc
  );

drop trigger if exists missions_updated_at
on missions;

create trigger missions_updated_at
before update on missions
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- APPROVAL REQUESTS
-- =========================================================

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  resource_type text not null
    check (
      resource_type in (
        'mission',
        'automation',
        'content',
        'campaign',
        'message',
        'budget_change',
        'price_change',
        'integration_action'
      )
    ),

  resource_id uuid not null,

  action text not null,
  reason text not null,

  risk_level uviq_risk_level not null,

  status uviq_approval_status not null default 'pending',

  requested_by text not null,
  assigned_role text not null default 'owner',

  decision_note text,

  requested_at timestamptz not null default now(),
  expires_at timestamptz,
  decided_at timestamptz,
  decided_by uuid,

  metadata jsonb not null default '{}'::jsonb
);

create index if not exists approvals_pending_idx
  on approval_requests(
    organisation_id,
    status,
    requested_at desc
  );

create index if not exists approvals_resource_idx
  on approval_requests(
    resource_type,
    resource_id
  );

-- =========================================================
-- AUTOMATION BLUEPRINTS
-- Defines a workflow but does not execute it automatically.
-- =========================================================

create table if not exists automation_blueprints (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  name text not null,
  objective text not null,

  status uviq_automation_status not null default 'draft',

  risk_level uviq_risk_level not null default 'medium',
  approval_required boolean not null default true,

  trigger_definition jsonb not null,
  action_definition jsonb not null,
  safeguards jsonb not null default '[]'::jsonb,

  max_daily_executions integer not null default 10
    check (max_daily_executions >= 0),

  max_monthly_cost numeric(12,2),
  currency char(3) not null default 'EUR',

  version integer not null default 1,

  created_by text not null default 'uviq-orchestrator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists automation_blueprints_business_idx
  on automation_blueprints(
    business_id,
    status
  );

drop trigger if exists automation_blueprints_updated_at
on automation_blueprints;

create trigger automation_blueprints_updated_at
before update on automation_blueprints
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- AUTOMATION RUNS
-- One execution of an approved blueprint.
-- =========================================================

create table if not exists automation_runs (
  id uuid primary key default gen_random_uuid(),

  automation_id uuid not null
    references automation_blueprints(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  idempotency_key text not null unique,

  status uviq_automation_status not null default 'ready',

  triggered_by text not null,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb,

  error_code text,
  error_message text,

  attempt_count integer not null default 0
    check (attempt_count >= 0),

  started_at timestamptz,
  finished_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists automation_runs_business_idx
  on automation_runs(
    business_id,
    status,
    created_at desc
  );

drop trigger if exists automation_runs_updated_at
on automation_runs;

create trigger automation_runs_updated_at
before update on automation_runs
for each row
execute function set_uviq_updated_at();

-- =========================================================
-- IMMUTABLE AUDIT EVENTS
-- Append-only log of decisions and actions.
-- =========================================================

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid
    references organisations(id)
    on delete set null,

  business_id uuid
    references businesses(id)
    on delete set null,

  actor_type text not null
    check (
      actor_type in (
        'user',
        'agent',
        'automation',
        'system',
        'integration'
      )
    ),

  actor_id text not null,

  event_type text not null,
  resource_type text not null,
  resource_id text,

  action text not null,

  previous_state jsonb,
  next_state jsonb,

  evidence jsonb not null default '[]'::jsonb,

  ip_hash text,
  request_id text,
  trace_id text,

  created_at timestamptz not null default now()
);

create index if not exists audit_events_business_idx
  on audit_events(
    business_id,
    created_at desc
  );

create index if not exists audit_events_resource_idx
  on audit_events(
    resource_type,
    resource_id
  );

create index if not exists audit_events_trace_idx
  on audit_events(trace_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- No public policies yet.
-- Server service role can access the tables.
-- User policies will be added after authentication.
-- =========================================================

alter table organisations enable row level security;
alter table businesses enable row level security;
alter table business_memory_entries enable row level security;
alter table evidence_sources enable row level security;
alter table evidence_claims enable row level security;
alter table evidence_claim_sources enable row level security;
alter table missions enable row level security;
alter table approval_requests enable row level security;
alter table automation_blueprints enable row level security;
alter table automation_runs enable row level security;
alter table audit_events enable row level security;

commit;
