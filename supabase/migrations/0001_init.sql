-- Pulse initial schema (Phase 0 foundation).
-- Tables: users (profile), devices, raw_events, exclude_rules,
-- category_overrides, daily_aggregates, insights.
-- RLS is enabled here; policies live in 0002_rls_policies.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users — one profile row per auth user (timezone + notification prefs).
-- Keyed 1:1 to auth.users; auto-created by the handle_new_user trigger below.
-- ---------------------------------------------------------------------------
create table public.users (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  home_timezone      text        not null default 'UTC',
  notif_chrome       boolean     not null default true,
  notif_email_daily  boolean     not null default false,
  notif_email_weekly boolean     not null default true,
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- devices — each Chrome profile/machine reporting to an account (US-07/08).
-- client_id is a stable uuid the extension generates once and stores locally,
-- so re-auth on the same profile maps back to the same device row.
-- ---------------------------------------------------------------------------
create table public.devices (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  client_id      text not null,
  label          text not null,
  platform       text,
  is_paused      boolean not null default false,
  last_synced_at timestamptz,
  created_at     timestamptz not null default now(),
  unique (user_id, client_id)
);
create index devices_user_idx on public.devices (user_id);

-- ---------------------------------------------------------------------------
-- raw_events — one row per focused visit. category is resolved at ingest.
-- active_seconds (focused time) is distinct from ended_at-started_at because
-- idle detection (US-14) pauses counting. Pruned to aggregates after ~90d.
-- ---------------------------------------------------------------------------
create table public.raw_events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  device_id       uuid not null references public.devices (id) on delete cascade,
  url             text not null,
  domain          text not null,
  title           text,
  referrer_domain text,
  category        text not null default 'Uncategorized',
  started_at      timestamptz not null,
  ended_at        timestamptz not null,
  active_seconds  integer not null default 0 check (active_seconds >= 0),
  created_at      timestamptz not null default now()
);
create index raw_events_user_started_idx on public.raw_events (user_id, started_at desc);
create index raw_events_user_domain_idx on public.raw_events (user_id, domain);
create index raw_events_device_idx on public.raw_events (device_id);

-- ---------------------------------------------------------------------------
-- exclude_rules — domain patterns never captured (US-23/24/27/28/29).
-- device_id null = account-level (applies to every device).
-- ---------------------------------------------------------------------------
create table public.exclude_rules (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  device_id  uuid references public.devices (id) on delete cascade,
  pattern    text not null,
  created_at timestamptz not null default now()
);
create unique index exclude_rules_unique_idx
  on public.exclude_rules (user_id, coalesce(device_id, '00000000-0000-0000-0000-000000000000'::uuid), pattern);

-- ---------------------------------------------------------------------------
-- category_overrides — user domain→category overrides beat the built-in map
-- (US-32..35). device_id null = account-wide.
-- ---------------------------------------------------------------------------
create table public.category_overrides (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  device_id  uuid references public.devices (id) on delete cascade,
  domain     text not null,
  category   text not null,
  created_at timestamptz not null default now()
);
create unique index category_overrides_unique_idx
  on public.category_overrides (user_id, coalesce(device_id, '00000000-0000-0000-0000-000000000000'::uuid), domain);

-- ---------------------------------------------------------------------------
-- daily_aggregates — per device/day/category rollup (US-36..41/60).
-- Combined views sum across devices at query time.
-- ---------------------------------------------------------------------------
create table public.daily_aggregates (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  device_id      uuid not null references public.devices (id) on delete cascade,
  day            date not null,
  category       text not null,
  active_seconds integer not null default 0,
  created_at     timestamptz not null default now(),
  unique (user_id, device_id, day, category)
);
create index daily_aggregates_user_day_idx on public.daily_aggregates (user_id, day);

-- ---------------------------------------------------------------------------
-- insights — proactive observations (US-45/46/50/51). device_id null = combined.
-- payload holds the display chips ([{ k, v }]).
-- ---------------------------------------------------------------------------
create table public.insights (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  device_id  uuid references public.devices (id) on delete cascade,
  kind       text not null,
  title      text not null,
  body       text not null,
  payload    jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  read_at    timestamptz
);
create index insights_user_created_idx on public.insights (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS on every table (policies in 0002).
alter table public.users              enable row level security;
alter table public.devices            enable row level security;
alter table public.raw_events         enable row level security;
alter table public.exclude_rules      enable row level security;
alter table public.category_overrides enable row level security;
alter table public.daily_aggregates   enable row level security;
alter table public.insights           enable row level security;
