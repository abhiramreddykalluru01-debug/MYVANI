# VANI i18n Migration

## What changed

VANI now stores phrase content in **language-agnostic + per-language translation** tables. This unblocks Hindi, Tamil, Telugu, Malayalam without schema changes.

### New tables

- `languages` — supported language codes (`kn`, `hi`, `ta`, `te`, `ml`, `en`)
- `phrase_translations` — per-language phonetic/native/audio for each phrase
- `reply_translations` — per-language phonetic/native/audio for each reply

### Old columns dropped

These moved out of `phrases` / `replies` into the translation tables:

- `phonetic_text`
- `native_text`
- `audio_url`

### Users table

- Added `language_code` column (2-letter, default `kn`). The old `language_to` label is preserved for the UI.

---

## Run order (one-time)

In the Supabase SQL editor, in order:

1. **`migration_i18n.sql`** — creates new tables, backfills your existing Kannada data into `phrase_translations` / `reply_translations`, drops old columns. Safe to re-run.

2. (optional) **`seed_hindi.sql`** — adds Hindi translations for the standard phrases. Idempotent.

3. **`schema.sql`** is the new canonical schema for fresh installs. You don't need to run it on an existing DB; the migration script gets you to the same state.

---

## Generate audio per language

```bash
# Kannada (existing) — generate any missing audio
npm run audio:generate -- --include-replies

# Hindi — generate Hindi audio after seeding
npm run audio:generate -- --language hi --include-replies

# Other languages
npm run audio:generate -- --language ta --include-replies   # Tamil
npm run audio:generate -- --language te --include-replies   # Telugu
```

Audio is uploaded to `audio/<phrases|replies>/<id>-<lang>.wav` so files don't collide across languages.

---

## How the app picks a language

1. User profile holds `language_to` (label, e.g. "Hindi") and `language_code` (`hi`).
2. `getCurrentLanguageCode()` reads `language_code`, falls back to deriving from `language_to`.
3. All phrase/reply queries filter by that code via `phrase_translations.language_code`.

To add a new language:

1. Insert a row in `languages`.
2. Insert `phrase_translations` rows for each existing phrase (matched by `english_text` is easiest).
3. Run the audio generator with `--language <code>`.
4. That's it — the app will start serving content in the new language to users with `language_code = <code>`.

---

## Rollback (if something is wrong)

The migration is destructive in step 5 (drops columns). To undo:

1. Restore from your Supabase point-in-time backup, or
2. Re-add columns and copy back from `phrase_translations` where `language_code='kn'`:

```sql
alter table public.phrases  add column phonetic_text text;
alter table public.phrases  add column native_text   text;
alter table public.phrases  add column audio_url     text;

update public.phrases p
set phonetic_text = pt.phonetic_text,
    native_text   = pt.native_text,
    audio_url     = pt.audio_url
from public.phrase_translations pt
where pt.phrase_id = p.id and pt.language_code = 'kn';
```

(Same idea for replies.)
