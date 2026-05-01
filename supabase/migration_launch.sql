-- VANI launch-day migration.
--
-- Run AFTER the i18n migration + all seed files. Idempotent — safe to re-run.
--
-- Adds:
--   1. bump_phrase_recent(p_phrase_id) — atomic upsert for recents
--      (replaces the read-then-write pattern that lost increments under
--      concurrent taps).
--   2. Coverage report queries you can run by hand to find missing
--      translations before launching.

-- ─── 1. Atomic recents bump ───────────────────────────────────────────────
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

-- Allow logged-in users to call it (it self-checks auth.uid()).
revoke all on function public.bump_phrase_recent(uuid) from public;
grant execute on function public.bump_phrase_recent(uuid) to authenticated;

-- ─── 2. Coverage sanity (run by hand, copy results to fix gaps) ───────────
-- Phrases missing a translation in any active language:
-- select p.id, p.english_text, l.code as missing_lang
-- from public.phrases p
-- cross join public.languages l
-- where l.is_active = true
--   and l.code in ('kn','hi','te')
--   and not exists (
--     select 1 from public.phrase_translations t
--     where t.phrase_id = p.id and t.language_code = l.code
--   )
-- order by l.code, p.english_text;

-- Replies missing a translation:
-- select r.id, r.english_text, l.code as missing_lang
-- from public.replies r
-- cross join public.languages l
-- where l.is_active = true
--   and l.code in ('kn','hi','te')
--   and not exists (
--     select 1 from public.reply_translations t
--     where t.reply_id = r.id and t.language_code = l.code
--   )
-- order by l.code, r.english_text;
