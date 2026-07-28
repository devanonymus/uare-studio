begin;

create table if not exists knowledge_nodes (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  node_type text not null
    check (
      node_type in (
        'business',
        'memory',
        'evidence',
        'mission',
        'automation',
        'artifact',
        'integration',
        'goal',
        'audience',
        'offer',
        'channel',
        'competitor',
        'kpi',
        'unknown'
      )
    ),

  external_key text not null,

  label text not null,
  description text,

  status text not null default 'active'
    check (
      status in (
        'active',
        'draft',
        'verified',
        'inferred',
        'missing',
        'approved',
        'rejected',
        'completed',
        'archived'
      )
    ),

  confidence numeric(5,4)
    check (
      confidence is null
      or (
        confidence >= 0
        and confidence <= 1
      )
    ),

  source_table text,
  source_record_id text,

  attributes jsonb not null default '{}'::jsonb,

  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    business_id,
    node_type,
    external_key
  )
);

create index if not exists knowledge_nodes_business_idx
  on knowledge_nodes(
    business_id,
    node_type,
    status
  );

create index if not exists knowledge_nodes_source_idx
  on knowledge_nodes(
    source_table,
    source_record_id
  );

drop trigger if exists knowledge_nodes_updated_at
on knowledge_nodes;

create trigger knowledge_nodes_updated_at
before update on knowledge_nodes
for each row
execute function set_uviq_updated_at();

create table if not exists knowledge_edges (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  source_node_id uuid not null
    references knowledge_nodes(id)
    on delete cascade,

  target_node_id uuid not null
    references knowledge_nodes(id)
    on delete cascade,

  relation_type text not null
    check (
      relation_type in (
        'has_memory',
        'supported_by',
        'generates',
        'requires',
        'produces',
        'belongs_to',
        'uses_channel',
        'targets',
        'measures',
        'depends_on',
        'connected_to',
        'blocks',
        'approves',
        'contradicts',
        'relates_to'
      )
    ),

  direction text not null default 'directed'
    check (
      direction in (
        'directed',
        'bidirectional'
      )
    ),

  confidence numeric(5,4) not null default 1
    check (
      confidence >= 0
      and confidence <= 1
    ),

  evidence jsonb not null default '[]'::jsonb,

  attributes jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    business_id,
    source_node_id,
    target_node_id,
    relation_type
  )
);

create index if not exists knowledge_edges_business_idx
  on knowledge_edges(
    business_id,
    relation_type
  );

create index if not exists knowledge_edges_source_idx
  on knowledge_edges(source_node_id);

create index if not exists knowledge_edges_target_idx
  on knowledge_edges(target_node_id);

drop trigger if exists knowledge_edges_updated_at
on knowledge_edges;

create trigger knowledge_edges_updated_at
before update on knowledge_edges
for each row
execute function set_uviq_updated_at();

create table if not exists knowledge_graph_snapshots (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null
    references organisations(id)
    on delete cascade,

  business_id uuid not null
    references businesses(id)
    on delete cascade,

  status text not null default 'completed'
    check (
      status in (
        'building',
        'completed',
        'failed'
      )
    ),

  node_count integer not null default 0,
  edge_count integer not null default 0,

  source_counts jsonb not null default '{}'::jsonb,

  build_version text not null default '1.0.0',

  error_message text,

  started_at timestamptz not null default now(),
  finished_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists knowledge_graph_snapshots_business_idx
  on knowledge_graph_snapshots(
    business_id,
    created_at desc
  );

alter table knowledge_nodes
enable row level security;

alter table knowledge_edges
enable row level security;

alter table knowledge_graph_snapshots
enable row level security;

commit;
