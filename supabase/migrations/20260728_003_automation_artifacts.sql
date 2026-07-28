begin;

create table if not exists automation_artifacts (
  id uuid primary key default gen_random_uuid(),

  run_id uuid not null
    references automation_runs(id)
    on delete cascade,

  automation_id uuid not null
    references automation_blueprints(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  artifact_key text not null,

  artifact_type text not null,

  title text not null,
  description text not null,
  content text not null,

  channel text not null,

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'approved',
        'rejected',
        'queued',
        'archived'
      )
    ),

  approval_required boolean not null default true,

  external_execution_blocked boolean not null default true,

  version integer not null default 1
    check (version >= 1),

  approved_at timestamptz,
  approved_by text,

  rejected_at timestamptz,
  rejected_by text,
  decision_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    run_id,
    artifact_key
  )
);

create index if not exists automation_artifacts_business_idx
  on automation_artifacts(
    business_id,
    status,
    created_at desc
  );

create index if not exists automation_artifacts_run_idx
  on automation_artifacts(
    run_id,
    artifact_type
  );

drop trigger if exists automation_artifacts_updated_at
on automation_artifacts;

create trigger automation_artifacts_updated_at
before update on automation_artifacts
for each row
execute function set_uviq_updated_at();

create table if not exists execution_queue (
  id uuid primary key default gen_random_uuid(),

  artifact_id uuid not null
    references automation_artifacts(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  target_channel text not null,

  status text not null default 'blocked'
    check (
      status in (
        'blocked',
        'ready',
        'queued',
        'running',
        'completed',
        'failed',
        'cancelled'
      )
    ),

  external_execution_allowed boolean not null default false,

  block_reason text,

  idempotency_key text not null unique,

  requested_by text not null,

  scheduled_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,

  result_payload jsonb,
  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (artifact_id)
);

create index if not exists execution_queue_business_idx
  on execution_queue(
    business_id,
    status,
    created_at desc
  );

drop trigger if exists execution_queue_updated_at
on execution_queue;

create trigger execution_queue_updated_at
before update on execution_queue
for each row
execute function set_uviq_updated_at();

alter table automation_artifacts
enable row level security;

alter table execution_queue
enable row level security;

commit;
