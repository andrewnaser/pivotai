-- Pivot AI (Instagram-only v1) — Supabase schema + RLS
-- Paste this entire file into Supabase SQL Editor and run.

-- Extensions
create extension if not exists "pgcrypto";

-- PROFILES (optional, but useful)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- BIO LINKS (Step 1)
create table if not exists public.bio_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  affiliate_url text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists bio_links_user_slug_unique on public.bio_links (user_id, slug);

-- Public bio pages (publicly readable by slug)
create table if not exists public.public_bio_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  affiliate_url text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists public_bio_pages_slug_unique on public.public_bio_pages (slug);

create table if not exists public.public_bio_clicks (
  id bigserial primary key,
  public_bio_page_id uuid not null references public.public_bio_pages (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  ip text
);

-- Click tracking (for later public bio pages)
create table if not exists public.bio_link_clicks (
  id bigserial primary key,
  bio_link_id uuid not null references public.bio_links (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  ip text
);

-- SAVED TARGETS (My Saved Targets + Step 2 saving)
create table if not exists public.saved_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null default 'instagram',
  kind text not null, -- 'hashtag' | 'user' | 'media'
  query text, -- what the user searched
  ig_media_id text,
  ig_shortcode text,
  ig_username text,
  caption text,
  thumbnail_url text,
  permalink text,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists saved_targets_user_created_idx on public.saved_targets (user_id, created_at desc);

-- GENERATED COMMENTS (Step 3)
create table if not exists public.generated_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  saved_target_id uuid references public.saved_targets (id) on delete set null,
  platform text not null default 'instagram',
  tone text not null,
  intent text not null,
  text text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists generated_comments_user_created_idx on public.generated_comments (user_id, created_at desc);

-- Basic usage/events (optional)
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- USER UPGRADES (for unlocking premium features)
create table if not exists public.user_upgrades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  upgrade_type text not null, -- 'infinite', 'automation', '10x', 'dfy'
  unlocked_at timestamptz not null default now()
);

create unique index if not exists user_upgrades_user_type_unique on public.user_upgrades (user_id, upgrade_type);
create index if not exists user_upgrades_user_idx on public.user_upgrades (user_id);

-- -----------------------
-- RLS
-- -----------------------
alter table public.profiles enable row level security;
alter table public.bio_links enable row level security;
alter table public.public_bio_pages enable row level security;
alter table public.public_bio_clicks enable row level security;
alter table public.bio_link_clicks enable row level security;
alter table public.saved_targets enable row level security;
alter table public.generated_comments enable row level security;
alter table public.usage_events enable row level security;
alter table public.user_upgrades enable row level security;

-- PROFILES
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- BIO LINKS
drop policy if exists "bio_links_select_own" on public.bio_links;
create policy "bio_links_select_own"
on public.bio_links for select
using (user_id = auth.uid());

drop policy if exists "bio_links_insert_own" on public.bio_links;
create policy "bio_links_insert_own"
on public.bio_links for insert
with check (user_id = auth.uid());

drop policy if exists "bio_links_update_own" on public.bio_links;
create policy "bio_links_update_own"
on public.bio_links for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "bio_links_delete_own" on public.bio_links;
create policy "bio_links_delete_own"
on public.bio_links for delete
using (user_id = auth.uid());

-- PUBLIC BIO PAGES
drop policy if exists "public_bio_pages_select_public" on public.public_bio_pages;
create policy "public_bio_pages_select_public"
on public.public_bio_pages for select
using (true);

drop policy if exists "public_bio_pages_insert_own" on public.public_bio_pages;
create policy "public_bio_pages_insert_own"
on public.public_bio_pages for insert
with check (user_id = auth.uid());

drop policy if exists "public_bio_pages_update_own" on public.public_bio_pages;
create policy "public_bio_pages_update_own"
on public.public_bio_pages for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "public_bio_pages_delete_own" on public.public_bio_pages;
create policy "public_bio_pages_delete_own"
on public.public_bio_pages for delete
using (user_id = auth.uid());

-- PUBLIC BIO CLICKS (public insert, owner can read)
drop policy if exists "public_bio_clicks_insert_public" on public.public_bio_clicks;
create policy "public_bio_clicks_insert_public"
on public.public_bio_clicks for insert
with check (true);

drop policy if exists "public_bio_clicks_select_owner" on public.public_bio_clicks;
create policy "public_bio_clicks_select_owner"
on public.public_bio_clicks for select
using (
  exists (
    select 1
    from public.public_bio_pages p
    where p.id = public_bio_clicks.public_bio_page_id
      and p.user_id = auth.uid()
  )
);

-- BIO LINK CLICKS:
-- - anyone can INSERT clicks (for public landing pages later)
-- - only owner can SELECT/DELETE
drop policy if exists "bio_link_clicks_insert_public" on public.bio_link_clicks;
create policy "bio_link_clicks_insert_public"
on public.bio_link_clicks for insert
with check (true);

drop policy if exists "bio_link_clicks_select_owner" on public.bio_link_clicks;
create policy "bio_link_clicks_select_owner"
on public.bio_link_clicks for select
using (
  exists (
    select 1
    from public.bio_links bl
    where bl.id = bio_link_clicks.bio_link_id
      and bl.user_id = auth.uid()
  )
);

-- SAVED TARGETS
drop policy if exists "saved_targets_select_own" on public.saved_targets;
create policy "saved_targets_select_own"
on public.saved_targets for select
using (user_id = auth.uid());

drop policy if exists "saved_targets_insert_own" on public.saved_targets;
create policy "saved_targets_insert_own"
on public.saved_targets for insert
with check (user_id = auth.uid());

drop policy if exists "saved_targets_update_own" on public.saved_targets;
create policy "saved_targets_update_own"
on public.saved_targets for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "saved_targets_delete_own" on public.saved_targets;
create policy "saved_targets_delete_own"
on public.saved_targets for delete
using (user_id = auth.uid());

-- GENERATED COMMENTS
drop policy if exists "generated_comments_select_own" on public.generated_comments;
create policy "generated_comments_select_own"
on public.generated_comments for select
using (user_id = auth.uid());

drop policy if exists "generated_comments_insert_own" on public.generated_comments;
create policy "generated_comments_insert_own"
on public.generated_comments for insert
with check (user_id = auth.uid());

drop policy if exists "generated_comments_delete_own" on public.generated_comments;
create policy "generated_comments_delete_own"
on public.generated_comments for delete
using (user_id = auth.uid());

-- USAGE EVENTS
drop policy if exists "usage_events_select_own" on public.usage_events;
create policy "usage_events_select_own"
on public.usage_events for select
using (user_id = auth.uid());

drop policy if exists "usage_events_insert_own" on public.usage_events;
create policy "usage_events_insert_own"
on public.usage_events for insert
with check (user_id = auth.uid());

-- USER UPGRADES
drop policy if exists "user_upgrades_select_own" on public.user_upgrades;
create policy "user_upgrades_select_own"
on public.user_upgrades for select
using (user_id = auth.uid());

drop policy if exists "user_upgrades_insert_own" on public.user_upgrades;
create policy "user_upgrades_insert_own"
on public.user_upgrades for insert
with check (user_id = auth.uid());


