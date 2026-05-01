-- =========================================================================
-- VANI i18n migration  (run ONCE in Supabase SQL Editor)
-- =========================================================================
-- Goal: split single-language phrase/reply rows into language-agnostic rows
--       + per-language translation rows so VANI can support many Indian
--       languages from one schema.
--
-- Safe to re-run: every step uses IF NOT EXISTS / ON CONFLICT guards, and
-- the destructive column drops at the end check column existence first.
-- All your existing Kannada data is preserved (backfilled into translations).
-- =========================================================================

begin;

-- 1. Languages reference table ------------------------------------------------
create table if not exists public.languages (
  code text primary key,
  name text not null,
  native_name text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.languages (code, name, native_name, sort_order) values
  ('kn', 'Kannada',   'ಕನ್ನಡ',     1),
  ('hi', 'Hindi',     'हिन्दी',     2),
  ('ta', 'Tamil',     'தமிழ்',    3),
  ('te', 'Telugu',    'తెలుగు',  4),
  ('ml', 'Malayalam', 'മലയാളം',  5),
  ('en', 'English',   'English',  6)
on conflict (code) do update set
  name = excluded.name,
  native_name = excluded.native_name,
  sort_order = excluded.sort_order;

-- 2. phrase_translations ------------------------------------------------------
create table if not exists public.phrase_translations (
  id uuid primary key default gen_random_uuid(),
  phrase_id uuid not null references public.phrases (id) on delete cascade,
  language_code text not null references public.languages (code),
  phonetic_text text not null,
  native_text   text not null,
  audio_url     text,
  created_at timestamptz not null default now(),
  unique (phrase_id, language_code)
);

create index if not exists phrase_translations_phrase_idx
  on public.phrase_translations (phrase_id);
create index if not exists phrase_translations_lang_idx
  on public.phrase_translations (language_code);

-- 3. reply_translations -------------------------------------------------------
create table if not exists public.reply_translations (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid not null references public.replies (id) on delete cascade,
  language_code text not null references public.languages (code),
  phonetic_text text not null,
  native_text   text not null,
  audio_url     text,
  created_at timestamptz not null default now(),
  unique (reply_id, language_code)
);

create index if not exists reply_translations_reply_idx
  on public.reply_translations (reply_id);
create index if not exists reply_translations_lang_idx
  on public.reply_translations (language_code);

-- 4. Backfill existing Kannada data into translation tables -------------------
-- Only runs if old columns still exist on phrases/replies.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'phrases'
      and column_name = 'phonetic_text'
  ) then
    insert into public.phrase_translations
      (phrase_id, language_code, phonetic_text, native_text, audio_url)
    select id, 'kn', phonetic_text, native_text, audio_url
    from public.phrases
    on conflict (phrase_id, language_code) do nothing;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'replies'
      and column_name = 'phonetic_text'
  ) then
    insert into public.reply_translations
      (reply_id, language_code, phonetic_text, native_text, audio_url)
    select id, 'kn', phonetic_text, native_text, audio_url
    from public.replies
    on conflict (reply_id, language_code) do nothing;
  end if;
end $$;

-- 5. Drop old language-specific columns from phrases/replies ------------------
alter table public.phrases  drop column if exists phonetic_text;
alter table public.phrases  drop column if exists native_text;
alter table public.phrases  drop column if exists audio_url;

alter table public.replies  drop column if exists phonetic_text;
alter table public.replies  drop column if exists native_text;
alter table public.replies  drop column if exists audio_url;

-- 6. Add language_code to users (optional convenience, keep label too) --------
alter table public.users
  add column if not exists language_code text default 'kn';

-- Best-effort backfill from name → code.
update public.users set language_code = case
  when language_to ilike 'kannada'   then 'kn'
  when language_to ilike 'hindi'     then 'hi'
  when language_to ilike 'tamil'     then 'ta'
  when language_to ilike 'telugu'    then 'te'
  when language_to ilike 'malayalam' then 'ml'
  when language_to ilike 'english'   then 'en'
  else 'kn'
end
where language_code is null or language_code = '';

-- 7. RLS for new tables -------------------------------------------------------
alter table public.languages              enable row level security;
alter table public.phrase_translations    enable row level security;
alter table public.reply_translations     enable row level security;

drop policy if exists "languages_select_all"                  on public.languages;
drop policy if exists "phrase_translations_select_authenticated" on public.phrase_translations;
drop policy if exists "reply_translations_select_authenticated"  on public.reply_translations;

create policy "languages_select_all"
  on public.languages for select
  using (is_active = true);

create policy "phrase_translations_select_authenticated"
  on public.phrase_translations for select
  to authenticated
  using (true);

create policy "reply_translations_select_authenticated"
  on public.reply_translations for select
  to authenticated
  using (true);

commit;

-- =========================================================================
-- Done. Your Kannada data is now in phrase_translations / reply_translations
-- with language_code='kn'. Add Hindi/Tamil/Telugu by inserting new rows.
-- =========================================================================
