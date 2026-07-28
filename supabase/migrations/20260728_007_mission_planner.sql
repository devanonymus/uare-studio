begin;

create table if not exists mission_plans (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  mission_id uuid not null
    references missions(id)
    on delete cascade,

  idempotency_key text not null unique,

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'generated',
        'awaiting_approval',
        'approved',
        'rejected',
        'executing',
        'completed',
        'failed',
        'archived'
      )
    ),

  executive_summary text not null,

  operating_model jsonb not null default '{}'::jsonb,

  phases jsonb not null default '[]'::jsonb,

  required_inputs jsonb not null default '[]'::jsonb,

  risks jsonb not null default '[]'::jsonb,

  verification_checks jsonb not null default '[]'::jsonb,

  expected_kpis jsonb not null default '[]'::jsonb,

  limitations jsonb not null default '[]'::jsonb,

  confidence numeric(5,4) not null
    check (
      confidence >= 0
      and confidence <= 1
    ),

  generated_by text not null default 'uviq-mission-planner',

  approved_at timestamptz,
  approved_by text,

  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (mission_id)
);

create index if not exists mission_plans_business_idx
  on mission_plans(
    business_id,
    status,
    created_at desc
  );

create index if not exists mission_plans_mission_idx
  on mission_plans(mission_id);

drop trigger if exists mission_plans_updated_at
on mission_plans;

create trigger mission_plans_updated_at
before update on mission_plans
for each row
execute function set_uviq_updated_at();

alter table mission_plans
enable row level security;

commit;
