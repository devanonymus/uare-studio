create table if not exists public.strategic_briefs (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid
    references public.organisations(id)
    on delete cascade,

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  brief_date date not null default current_date,

  status text not null default 'completed'
    check (
      status in (
        'generating',
        'completed',
        'failed',
        'archived'
      )
    ),

  executive_summary text not null,

  business_health_score integer not null default 0
    check (
      business_health_score >= 0
      and business_health_score <= 100
    ),

  confidence numeric(5,4) not null default 0,

  priorities jsonb not null default '[]'::jsonb,
  alerts jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  source_snapshot jsonb not null default '{}'::jsonb,

  generated_by text not null default 'uviq-strategic-advisor',

  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (business_id, brief_date)
);

create index if not exists strategic_briefs_business_idx
  on public.strategic_briefs (
    business_id,
    brief_date desc
  );

create index if not exists strategic_briefs_status_idx
  on public.strategic_briefs (status);

alter table public.strategic_briefs
  enable row level security;

drop policy if exists
  "strategic briefs service role access"
  on public.strategic_briefs;

create policy
  "strategic briefs service role access"
  on public.strategic_briefs
  for all
  using (true)
  with check (true);

comment on table public.strategic_briefs is
  'Brief strategici giornalieri generati dal Daily Strategic Advisor di UVIQ.';
