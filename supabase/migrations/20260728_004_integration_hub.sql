begin;

create table if not exists integration_connections (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid
    references businesses(id)
    on delete cascade,

  provider text not null
    check (
      provider in (
        'meta',
        'google',
        'whatsapp',
        'email',
        'wordpress'
      )
    ),

  display_name text not null,

  status text not null default 'not_configured'
    check (
      status in (
        'not_configured',
        'configuration_detected',
        'testing',
        'connected',
        'degraded',
        'error',
        'disabled'
      )
    ),

  environment text not null default 'development'
    check (
      environment in (
        'development',
        'staging',
        'production'
      )
    ),

  secret_reference text,

  external_account_id text,
  external_account_name text,

  capabilities jsonb not null default '[]'::jsonb,
  granted_scopes jsonb not null default '[]'::jsonb,

  metadata jsonb not null default '{}'::jsonb,

  last_tested_at timestamptz,
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error_message text,

  enabled boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    organisation_id,
    business_id,
    provider
  )
);

create index if not exists integration_connections_business_idx
  on integration_connections(
    business_id,
    provider,
    status
  );

drop trigger if exists integration_connections_updated_at
on integration_connections;

create trigger integration_connections_updated_at
before update on integration_connections
for each row
execute function set_uviq_updated_at();

create table if not exists integration_events (
  id uuid primary key default gen_random_uuid(),

  integration_id uuid
    references integration_connections(id)
    on delete cascade,

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid
    references businesses(id)
    on delete cascade,

  provider text not null,
  event_type text not null,

  status text not null
    check (
      status in (
        'success',
        'warning',
        'failed',
        'blocked'
      )
    ),

  message text not null,

  request_id text,
  trace_id text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists integration_events_business_idx
  on integration_events(
    business_id,
    provider,
    created_at desc
  );

alter table integration_connections
enable row level security;

alter table integration_events
enable row level security;

commit;
