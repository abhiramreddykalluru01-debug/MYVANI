-- VANI MVP schema (i18n) — run in Supabase SQL Editor
-- Enable: Authentication > Providers > Google
-- Optional: Storage > create public bucket "audio" for uploads
--
-- Content model (multi-language ready):
--   languages           : reference list of supported language codes
--   categories          : groups phrases by type (general / professional / quick_help)
--   phrases             : language-agnostic intent (english_text + answer_mode)
--   phrase_translations : per-language phonetic + native + audio for a phrase
--   replies             : language-agnostic reply intent linked to a phrase
--   reply_translations  : per-language phonetic + native + audio for a reply
--   users               : profile linked to auth.users (with language_code)
--   feedback            : validation input

-- ─── languages ───────────────────────────────────────────────────────────
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

-- ─── users ───────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  language_from text not null default 'English',
  language_to   text not null default 'Kannada',
  language_code text not null default 'kn' references public.languages (code),
  city text,
  profession text,
  updated_at timestamptz not null default now()
);

-- ─── categories ──────────────────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('general','professional','quick_help')),
  slug text not null,
  title text not null,
  profession_key text,               -- only used when type='professional'
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint categories_type_slug_uk unique (type, slug),
  constraint categories_profession_ck check (
    (type = 'professional' and profession_key is not null)
    or (type <> 'professional' and profession_key is null)
  )
);

create index if not exists categories_type_idx on public.categories (type);
create index if not exists categories_profession_idx on public.categories (profession_key);

-- ─── phrases (language-agnostic intent) ──────────────────────────────────
create table if not exists public.phrases (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  english_text text not null,             -- canonical name + UI fallback
  answer_mode text not null default 'normal' check (answer_mode in ('normal','yes_no')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists phrases_category_idx on public.phrases (category_id);
create index if not exists phrases_active_idx on public.phrases (is_active);

-- ─── phrase translations (per language) ──────────────────────────────────
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

-- ─── replies (language-agnostic, always 3 per phrase) ────────────────────
create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  phrase_id uuid not null references public.phrases (id) on delete cascade,
  english_text text not null,
  reply_kind text not null default 'normal' check (reply_kind in ('normal','yes','no')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists replies_phrase_idx on public.replies (phrase_id);

-- ─── reply translations (per language) ───────────────────────────────────
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

-- ─── user phrase favorites ───────────────────────────────────────────────
create table if not exists public.phrase_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  phrase_id uuid not null references public.phrases (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, phrase_id)
);

create index if not exists phrase_favorites_phrase_idx
  on public.phrase_favorites (phrase_id);
create index if not exists phrase_favorites_created_at_idx
  on public.phrase_favorites (created_at desc);

-- ─── user phrase recents ─────────────────────────────────────────────────
create table if not exists public.phrase_recents (
  user_id uuid not null references auth.users (id) on delete cascade,
  phrase_id uuid not null references public.phrases (id) on delete cascade,
  last_used_at timestamptz not null default now(),
  use_count int not null default 1 check (use_count > 0),
  primary key (user_id, phrase_id)
);

create index if not exists phrase_recents_last_used_at_idx
  on public.phrase_recents (user_id, last_used_at desc);
create index if not exists phrase_recents_phrase_idx
  on public.phrase_recents (phrase_id);

-- ─── feedback ────────────────────────────────────────────────────────────
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  message text not null,
  contact text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_user_id_idx on public.feedback (user_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────
alter table public.users                enable row level security;
alter table public.languages            enable row level security;
alter table public.categories           enable row level security;
alter table public.phrases              enable row level security;
alter table public.phrase_translations  enable row level security;
alter table public.replies              enable row level security;
alter table public.reply_translations   enable row level security;
alter table public.phrase_favorites     enable row level security;
alter table public.phrase_recents       enable row level security;
alter table public.feedback             enable row level security;

drop policy if exists "users_select_own"                          on public.users;
drop policy if exists "users_update_own"                          on public.users;
drop policy if exists "users_insert_own"                          on public.users;
drop policy if exists "languages_select_all"                      on public.languages;
drop policy if exists "categories_select_authenticated"           on public.categories;
drop policy if exists "phrases_select_authenticated"              on public.phrases;
drop policy if exists "phrase_translations_select_authenticated"  on public.phrase_translations;
drop policy if exists "replies_select_authenticated"              on public.replies;
drop policy if exists "reply_translations_select_authenticated"   on public.reply_translations;
drop policy if exists "phrase_favorites_select_own"               on public.phrase_favorites;
drop policy if exists "phrase_favorites_insert_own"               on public.phrase_favorites;
drop policy if exists "phrase_favorites_delete_own"               on public.phrase_favorites;
drop policy if exists "phrase_recents_select_own"                 on public.phrase_recents;
drop policy if exists "phrase_recents_insert_own"                 on public.phrase_recents;
drop policy if exists "phrase_recents_update_own"                 on public.phrase_recents;
drop policy if exists "phrase_recents_delete_own"                 on public.phrase_recents;
drop policy if exists "feedback_insert_authenticated"             on public.feedback;
drop policy if exists "feedback_insert_anon"                      on public.feedback;

create policy "users_select_own"
  on public.users for select using (auth.uid() = id);
create policy "users_update_own"
  on public.users for update using (auth.uid() = id);
create policy "users_insert_own"
  on public.users for insert with check (auth.uid() = id);

create policy "languages_select_all"
  on public.languages for select using (is_active = true);

create policy "categories_select_authenticated"
  on public.categories for select to authenticated using (true);

create policy "phrases_select_authenticated"
  on public.phrases for select to authenticated using (is_active = true);

create policy "phrase_translations_select_authenticated"
  on public.phrase_translations for select to authenticated using (true);

create policy "replies_select_authenticated"
  on public.replies for select to authenticated using (true);

create policy "reply_translations_select_authenticated"
  on public.reply_translations for select to authenticated using (true);

create policy "phrase_favorites_select_own"
  on public.phrase_favorites for select to authenticated using (auth.uid() = user_id);
create policy "phrase_favorites_insert_own"
  on public.phrase_favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "phrase_favorites_delete_own"
  on public.phrase_favorites for delete to authenticated using (auth.uid() = user_id);

create policy "phrase_recents_select_own"
  on public.phrase_recents for select to authenticated using (auth.uid() = user_id);
create policy "phrase_recents_insert_own"
  on public.phrase_recents for insert to authenticated with check (auth.uid() = user_id);
create policy "phrase_recents_update_own"
  on public.phrase_recents for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "phrase_recents_delete_own"
  on public.phrase_recents for delete to authenticated using (auth.uid() = user_id);

create policy "feedback_insert_authenticated"
  on public.feedback for insert to authenticated with check (user_id = auth.uid() or user_id is null);
create policy "feedback_insert_anon"
  on public.feedback for insert to anon with check (user_id is null);

-- ─── RPC: atomic recents bump ────────────────────────────────────────────
create or replace function public.bump_phrase_recent(p_phrase_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth required';
  end if;

  insert into public.phrase_recents (user_id, phrase_id, use_count, last_used_at)
  values (auth.uid(), p_phrase_id, 1, now())
  on conflict (user_id, phrase_id) do update
    set use_count    = public.phrase_recents.use_count + 1,
        last_used_at = now();
end;
$$;

revoke all on function public.bump_phrase_recent(uuid) from public;
grant execute on function public.bump_phrase_recent(uuid) to authenticated;
