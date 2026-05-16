-- VANI guest-mode read access.
--
-- Run AFTER schema.sql / migration_launch.sql / migration_scale.sql.
-- Idempotent — safe to re-run.
--
-- Why this migration exists:
--   The app supports browsing phrases / categories / quick-help / practice
--   WITHOUT signing in ("Try without login"). The web middleware now
--   allows those routes for guests, but the existing RLS policies only
--   grant SELECT to the `authenticated` role. Result: guest reads return
--   ZERO rows and the UI looks empty.
--
-- What this migration does:
--   Replaces the `to authenticated` policies on public CONTENT tables with
--   `to anon, authenticated` policies (read-only). Writes / private tables
--   (favorites, recents, users, feedback) are untouched.
--
-- Safe to apply on prod:
--   * No data is changed.
--   * No new writes are unlocked.
--   * Only read access is widened on already-public catalogue tables that
--     ship with the app.

-- ─── categories ──────────────────────────────────────────────────────────
drop policy if exists "categories_select_authenticated" on public.categories;
drop policy if exists "categories_select_public"        on public.categories;

create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (true);

-- ─── phrases (only active rows are exposed) ──────────────────────────────
drop policy if exists "phrases_select_authenticated" on public.phrases;
drop policy if exists "phrases_select_public"        on public.phrases;

create policy "phrases_select_public"
  on public.phrases for select
  to anon, authenticated
  using (is_active = true);

-- ─── phrase translations ─────────────────────────────────────────────────
drop policy if exists "phrase_translations_select_authenticated"
  on public.phrase_translations;
drop policy if exists "phrase_translations_select_public"
  on public.phrase_translations;

create policy "phrase_translations_select_public"
  on public.phrase_translations for select
  to anon, authenticated
  using (true);

-- ─── replies ─────────────────────────────────────────────────────────────
drop policy if exists "replies_select_authenticated" on public.replies;
drop policy if exists "replies_select_public"        on public.replies;

create policy "replies_select_public"
  on public.replies for select
  to anon, authenticated
  using (true);

-- ─── reply translations ──────────────────────────────────────────────────
drop policy if exists "reply_translations_select_authenticated"
  on public.reply_translations;
drop policy if exists "reply_translations_select_public"
  on public.reply_translations;

create policy "reply_translations_select_public"
  on public.reply_translations for select
  to anon, authenticated
  using (true);

-- ─── Smoke test (uncomment in SQL editor to verify) ──────────────────────
-- set role anon;
-- select count(*) from public.phrases       where is_active = true;
-- select count(*) from public.categories;
-- select count(*) from public.phrase_translations;
-- select count(*) from public.replies;
-- select count(*) from public.reply_translations;
-- reset role;
