-- VANI user entitlements / plan table.
--
-- Run AFTER schema.sql + migration_launch.sql + migration_i18n.sql.
-- Idempotent — safe to re-run.
--
-- Why this exists:
--   Type & Say currently gates paid replies via TYPE_SAY_REPLIES_ENABLED
--   and a comma-separated TYPE_SAY_REPLY_UNLOCK_USER_IDS env var. That
--   works for a tiny manual allowlist but cannot express:
--     • plan tiers (Survive / Confident / Tourist)
--     • expiry / renewal
--     • a payments webhook flipping a user on/off
--
--   This migration creates `user_entitlements` so the eventual Cashfree
--   webhook just upserts a row, and the API reads it instead of env.
--
-- What this migration does:
--   • Creates plan enum + entitlement table.
--   • RLS: each user can read ONLY their own row; writes are restricted
--     to service_role (webhooks). Anon has no access.
--   • Adds a touch trigger so `updated_at` stays accurate.
--   • Backfills nothing — all existing users default to plan='free' /
--     replies_unlocked=false the first time they sign in.

-- ─── enum ────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'vani_plan') then
    create type public.vani_plan as enum (
      'free',
      'survive',
      'confident',
      'tourist'
    );
  end if;
end$$;

-- ─── table ───────────────────────────────────────────────────────────────
create table if not exists public.user_entitlements (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  plan              public.vani_plan not null default 'free',
  replies_unlocked  boolean          not null default false,
  valid_until       timestamptz      null,
  source            text             null,  -- e.g. 'cashfree', 'manual', 'launch_promo'
  notes             text             null,
  updated_at        timestamptz      not null default now()
);

-- ─── touch trigger keeps updated_at honest on every upsert ───────────────
create or replace function public.touch_user_entitlements()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists trg_touch_user_entitlements on public.user_entitlements;
create trigger trg_touch_user_entitlements
  before update on public.user_entitlements
  for each row execute function public.touch_user_entitlements();

-- ─── RLS ─────────────────────────────────────────────────────────────────
alter table public.user_entitlements enable row level security;

-- Self-read: a logged-in user can see their own entitlement only.
drop policy if exists "user_entitlements_select_self" on public.user_entitlements;
create policy "user_entitlements_select_self"
  on public.user_entitlements
  for select
  to authenticated
  using (auth.uid() = user_id);

-- NO insert/update/delete policies for `authenticated` or `anon` on purpose.
-- Writes must come from service_role (Cashfree webhook / admin scripts),
-- which bypasses RLS. This prevents a malicious client from upgrading
-- themselves by hitting Supabase directly.

-- ─── helpful index for "is this entitlement still valid" lookups ────────
create index if not exists user_entitlements_valid_until_idx
  on public.user_entitlements (valid_until)
  where valid_until is not null;

-- ─── Quick verify (uncomment in SQL editor to test) ──────────────────────
-- select user_id, plan, replies_unlocked, valid_until from public.user_entitlements;
--
-- -- Hand-grant yourself paid replies until end of year:
-- insert into public.user_entitlements (user_id, plan, replies_unlocked, valid_until, source)
-- values ('<your-uuid>', 'confident', true, '2026-12-31', 'manual')
-- on conflict (user_id) do update
--   set plan = excluded.plan,
--       replies_unlocked = excluded.replies_unlocked,
--       valid_until = excluded.valid_until,
--       source = excluded.source;
