begin;

create table if not exists business_opportunities (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  snapshot_id uuid
    references knowledge_graph_snapshots(id)
    on delete set null,

  title text not null,
  summary text not null,
  rationale text not null,

  opportunity_type text not null
    check (
      opportunity_type in (
        'seo',
        'social',
        'advertising',
        'website',
        'conversion',
        'offer',
        'competitor',
        'reputation',
        'crm',
        'content',
        'automation',
        'data_gap',
        'strategic'
      )
    ),

  status text not null default 'proposed'
    check (
      status in (
        'proposed',
        'under_review',
        'approved',
        'rejected',
        'converted_to_mission',
        'completed',
        'archived'
      )
    ),

  priority integer not null default 3
    check (priority between 1 and 5),

  impact text not null
    check (
      impact in (
        'low',
        'medium',
        'high',
        'critical'
      )
    ),

  effort text not null
    check (
      effort in (
        'small',
        'medium',
        'large'
      )
    ),

  risk_level text not null
    check (
      risk_level in (
        'low',
        'medium',
        'high',
        'critical'
      )
    ),

  confidence numeric(5,4) not null
    check (
      confidence >= 0
      and confidence <= 1
    ),

  estimated_cost_min numeric(12,2),
  estimated_cost_max numeric(12,2),
  currency char(3) not null default 'EUR',

  estimated_time text,

  supporting_node_ids jsonb not null default '[]'::jsonb,
  supporting_evidence_ids jsonb not null default '[]'::jsonb,
  missing_data jsonb not null default '[]'::jsonb,

  proposed_actions jsonb not null default '[]'::jsonb,
  expected_kpis jsonb not null default '[]'::jsonb,

  limitations jsonb not null default '[]'::jsonb,

  generated_by text not null default 'uviq-opportunity-engine',

  approved_at timestamptz,
  approved_by text,

  rejected_at timestamptz,
  rejected_by text,
  decision_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_opportunities_business_idx
  on business_opportunities(
    business_id,
    status,
    priority desc,
    created_at desc
  );

create index if not exists business_opportunities_type_idx
  on business_opportunities(
    business_id,
    opportunity_type
  );

drop trigger if exists business_opportunities_updated_at
on business_opportunities;

create trigger business_opportunities_updated_at
before update on business_opportunities
for each row
execute function set_uviq_updated_at();

create table if not exists opportunity_runs (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  snapshot_id uuid
    references knowledge_graph_snapshots(id)
    on delete set null,

  idempotency_key text not null unique,

  status text not null default 'queued'
    check (
      status in (
        'queued',
        'analysing',
        'validating',
        'persisting',
        'completed',
        'failed'
      )
    ),

  opportunity_count integer not null default 0,

  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb,

  error_message text,

  started_at timestamptz,
  finished_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunity_runs_business_idx
  on opportunity_runs(
    business_id,
    created_at desc
  );

drop trigger if exists opportunity_runs_updated_at
on opportunity_runs;

create trigger opportunity_runs_updated_at
before update on opportunity_runs
for each row
execute function set_uviq_updated_at();

alter table business_opportunities
enable row level security;

alter table opportunity_runs
enable row level security;

commit;
