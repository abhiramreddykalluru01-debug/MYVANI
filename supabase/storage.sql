-- VANI: one-time storage setup for phrase / reply audio.
-- Run this once in the Supabase SQL editor (safe to rerun).

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do update set public = excluded.public;

-- Anyone can read audio files (so the app can play them without auth).
drop policy if exists "audio_public_read" on storage.objects;
create policy "audio_public_read"
  on storage.objects for select
  using (bucket_id = 'audio');

-- Only the service role can write — keeps the bucket safe.
-- (No insert/update/delete policy is created on purpose. The script that
-- generates audio uses the service role key, which bypasses RLS.)
