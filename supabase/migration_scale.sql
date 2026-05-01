-- VANI scale-up migration.
--
-- Run AFTER migration_launch.sql. Idempotent — safe to re-run.
--
-- Adds:
--   1. type_say_cache  : durable cross-instance cache for /api/type-say
--      (replaces the in-process LRU which is wiped on every cold start
--      and not shared across multiple serverless instances).
--   2. analytics_events: append-only event log so we have a backup of
--      drop-off / funnel data even if external analytics fails.
--   3. type-say-audio storage bucket should be created (public read) via
--      the Supabase dashboard or the SQL below if your project allows it.

-- ─── 1. type_say_cache ────────────────────────────────────────────────────
create table if not exists public.type_say_cache (
  -- Cache key = sha-256 of `${language_code}::${normalized_input}`.
  cache_key text primary key,
  language_code text not null references public.languages (code),
  input_text   text not null,
  native_text  text not null,
  phonetic_text text not null,
  audio_url    text,                 -- public URL in storage bucket
  phonetic_source text not null,     -- 'gemini' | 'sarvam'
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now(),
  use_count int not null default 1
);

create index if not exists type_say_cache_lang_idx
  on public.type_say_cache (language_code);
create index if not exists type_say_cache_last_used_idx
  on public.type_say_cache (last_used_at desc);

alter table public.type_say_cache enable row level security;

drop policy if exists "type_say_cache_select_authenticated" on public.type_say_cache;
drop policy if exists "type_say_cache_insert_authenticated" on public.type_say_cache;
drop policy if exists "type_say_cache_update_authenticated" on public.type_say_cache;

-- The /api/type-say route runs server-side with the user's session.
-- Authenticated users may read AND write the shared cache (the API
-- route is the only writer in practice; rate limits gate misuse).
create policy "type_say_cache_select_authenticated"
  on public.type_say_cache for select
  to authenticated
  using (true);

create policy "type_say_cache_insert_authenticated"
  on public.type_say_cache for insert
  to authenticated
  with check (true);

create policy "type_say_cache_update_authenticated"
  on public.type_say_cache for update
  to authenticated
  using (true)
  with check (true);

-- ─── 2. analytics_events ──────────────────────────────────────────────────
create table if not exists public.analytics_events (
  id bigserial primary key,
  user_id uuid references auth.users (id) on delete set null,
  session_id text,
  name text not null,                -- e.g. 'login_success', 'phrase_open'
  props jsonb not null default '{}',
  ip text,
  user_agent text,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_idx
  on public.analytics_events (name);
create index if not exists analytics_events_user_idx
  on public.analytics_events (user_id);
create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events_insert_anyone"  on public.analytics_events;
drop policy if exists "analytics_events_select_owner"   on public.analytics_events;

-- Anyone (logged in or not) can insert their own event row. We never
-- expose reads to clients — analytics dashboards use the service role.
create policy "analytics_events_insert_anyone"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    user_id is null or user_id = auth.uid()
  );

-- ─── 3. RPC to update cache atomically ────────────────────────────────
-- security definer so it runs as the function owner (postgres) and
-- bypasses RLS. Without this, last_used_at/use_count never update
-- because the API route runs as the authenticated user.
create or replace function public.touch_type_say_cache(p_cache_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.type_say_cache
  set last_used_at = now(),
      use_count    = use_count + 1
  where cache_key = p_cache_key;
end;
$$;

revoke all on function public.touch_type_say_cache(text) from public;
grant execute on function public.touch_type_say_cache(text) to authenticated;

-- ─── 4. Storage bucket + policies for type-say-audio ────────────────────
-- Create the bucket (idempotent). PUBLIC read so we can serve audio
-- via getPublicUrl(). 5MB limit, only audio mime types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'type-say-audio',
  'type-say-audio',
  true,
  5 * 1024 * 1024,
  array['audio/wav', 'audio/mpeg', 'audio/x-wav']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "type_say_audio_read_public"   on storage.objects;
drop policy if exists "type_say_audio_write_authed"  on storage.objects;
drop policy if exists "type_say_audio_update_authed" on storage.objects;

-- Anyone can READ audio via the public URL.
create policy "type_say_audio_read_public"
  on storage.objects for select
  to public
  using (bucket_id = 'type-say-audio');

-- Authenticated users (i.e. the API route running with the user's
-- session) can INSERT new audio objects.
create policy "type_say_audio_write_authed"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'type-say-audio');

-- Allow upsert (which performs UPDATE on conflict).
create policy "type_say_audio_update_authed"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'type-say-audio')
  with check (bucket_id = 'type-say-audio');
