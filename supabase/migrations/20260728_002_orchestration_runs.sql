begin;

create table if not exists orchestration_runs (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  idempotency_key text not null unique,

  status text not null default 'queued'
    check (
      status in (
        'queued',
        'collecting',
        'analysing',
        'validating',
        'persisting',
        'completed',
        'failed',
        'cancelled'
      )
    ),

  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb,

  confidence numeric(5,4)
    check (
      confidence is null
      or (
        confidence >= 0
        and confidence <= 1
      )
    ),

  mission_count integer not null default 0,
  automation_count integer not null default 0,
  evidence_count integer not null default 0,
  approval_count integer not null default 0,

  error_code text,
  error_message text,

  started_at timestamptz,
  finished_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orchestration_runs_business_idx
  on orchestration_runs(
    business_id,
    created_at desc
  );

create index if not exists orchestration_runs_status_idx
  on orchestration_runs(
    status,
    created_at desc
  );

drop trigger if exists orchestration_runs_updated_at
on orchestration_runs;

create trigger orchestration_runs_updated_at
before update on orchestration_runs
for each row
execute function set_uviq_updated_at();

alter table orchestration_runs
enable row level security;

commit;
