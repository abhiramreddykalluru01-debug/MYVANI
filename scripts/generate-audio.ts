/**
 * VANI: one-click audio generator (i18n-aware).
 *
 * Generates Sarvam TTS audio for any phrase/reply translation rows whose
 * `audio_url` is NULL, uploads the WAV to Supabase Storage, and updates
 * the row.
 *
 * Run examples (PowerShell):
 *   npm run audio:generate                                 # all missing kn audio
 *   npm run audio:generate -- --language hi               # generate Hindi audio
 *   npm run audio:generate -- --dry-run
 *   npm run audio:generate -- --type quick_help
 *   npm run audio:generate -- --type general --slug greetings
 *   npm run audio:generate -- --type professional --profession Nurse
 *   npm run audio:generate -- --include-replies
 *   npm run audio:generate -- --max 10
 *   npm run audio:generate -- --concurrency 3
 *
 * Idempotent: skips rows that already have audio_url. Safe to rerun.
 */

import { Buffer } from "node:buffer";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sarvamTts, type SarvamLanguage } from "../src/lib/sarvam/client";

// ─── env ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
requireEnv("SARVAM_API_KEY");

const SPEAKER = process.env.SARVAM_DEFAULT_SPEAKER ?? "ritu";
const BUCKET = "audio";

// Map our 2-letter language codes to Sarvam's BCP-47 codes.
const SARVAM_CODE_BY_LANG: Record<string, SarvamLanguage> = {
  kn: "kn-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  en: "en-IN",
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}. Set it in .env.local`);
    process.exit(1);
  }
  return v;
}

// ─── args ───────────────────────────────────────────────────────────────────
type Args = {
  language: string; // 2-letter code, default 'kn'
  type?: "general" | "professional" | "quick_help";
  slug?: string;
  profession?: string;
  includeReplies: boolean;
  dryRun: boolean;
  max?: number;
  concurrency: number;
  retries: number;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = {
    language: "kn",
    includeReplies: false,
    dryRun: false,
    concurrency: 2,
    retries: 2,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];

    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--include-replies") out.includeReplies = true;
    else if (a === "--language") out.language = String(next()).toLowerCase();
    else if (a === "--type") out.type = next() as Args["type"];
    else if (a === "--slug") out.slug = next();
    else if (a === "--profession") out.profession = next();
    else if (a === "--max") out.max = Number(next());
    else if (a === "--concurrency")
      out.concurrency = Math.max(1, Number(next()));
    else if (a === "--retries") out.retries = Math.max(0, Number(next()));
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.warn(`Unknown arg: ${a}`);
    }
  }

  if (
    out.type &&
    !["general", "professional", "quick_help"].includes(out.type)
  ) {
    console.error(`Invalid --type: ${out.type}`);
    process.exit(1);
  }

  if (!SARVAM_CODE_BY_LANG[out.language]) {
    console.error(
      `Invalid --language: ${out.language}. Must be one of ${Object.keys(SARVAM_CODE_BY_LANG).join(", ")}`,
    );
    process.exit(1);
  }

  return out;
}

function printHelp() {
  console.log(`Usage: npm run audio:generate -- [flags]

Flags:
  --dry-run                 Preview only. No API calls, no DB writes.
  --language <code>         Language code: kn | hi | ta | te (default kn)
  --type <t>                general | professional | quick_help
  --slug <s>                category slug (e.g. greetings)
  --profession <p>          profession_key (e.g. Nurse) for type=professional
  --include-replies         Also generate audio for replies of matched phrases
  --max <n>                 Stop after n phrases (safety cap)
  --concurrency <n>         Parallel TTS calls (default 2)
  --retries <n>             Per-row retry count on failure (default 2)
  -h, --help                Show this help`);
}

// ─── types ──────────────────────────────────────────────────────────────────
type CategoryRow = {
  id: string;
  type: "general" | "professional" | "quick_help";
  slug: string;
  profession_key: string | null;
};

type PhraseTransRow = {
  id: string;             // translation row id
  phrase_id: string;
  english_text: string;   // joined from phrases
  native_text: string;
  audio_url: string | null;
};

type ReplyTransRow = {
  id: string;             // translation row id
  reply_id: string;
  english_text: string;   // joined from replies
  native_text: string;
  audio_url: string | null;
};

type Stats = {
  considered: number;
  alreadyDone: number;
  generated: number;
  failed: number;
  skipped: number;
};

// ─── main ───────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs();
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const sarvamCode = SARVAM_CODE_BY_LANG[args.language];

  console.log("VANI audio generator");
  console.log(`  language : ${args.language} (${sarvamCode})`);
  console.log(`  speaker  : ${SPEAKER}`);
  console.log(`  dryRun   : ${args.dryRun}`);
  console.log(`  bucket   : ${BUCKET}`);
  if (args.type) console.log(`  type     : ${args.type}`);
  if (args.slug) console.log(`  slug     : ${args.slug}`);
  if (args.profession) console.log(`  prof.    : ${args.profession}`);
  console.log("");

  const categories = await loadCategories(supabase, args);
  if (categories.length === 0) {
    console.log("No categories matched the given filters. Nothing to do.");
    return;
  }
  const categoryIds = categories.map((c) => c.id);

  // Load phrase ids in matched categories.
  const phraseIds = await loadPhraseIds(supabase, categoryIds);

  // Load phrase translations (only ones missing audio).
  const phrases = await loadPhraseTranslations(
    supabase,
    phraseIds,
    args.language,
    args.max,
  );
  console.log(`Found ${phrases.length} phrase translation row(s) needing audio.`);

  const phraseStats = await processRows({
    rows: phrases.map((p) => ({
      id: p.id,
      label: `phrase: ${trimEllipsis(p.english_text)}`,
      text: p.native_text,
      pathPrefix: "phrases",
      table: "phrase_translations",
      idColumn: "id",
      // Storage path uses phrase_id + lang for stable cache (idempotent uploads)
      storageKey: `${p.phrase_id}-${args.language}`,
    })),
    args,
    supabase,
    sarvamCode,
  });
  printStats("PHRASES", phraseStats);

  if (args.includeReplies) {
    const replies = await loadReplyTranslations(
      supabase,
      phraseIds,
      args.language,
      args.max,
    );
    console.log(`\nFound ${replies.length} reply translation row(s) needing audio.`);
    const replyStats = await processRows({
      rows: replies.map((r) => ({
        id: r.id,
        label: `reply : ${trimEllipsis(r.english_text)}`,
        text: r.native_text,
        pathPrefix: "replies",
        table: "reply_translations",
        idColumn: "id",
        storageKey: `${r.reply_id}-${args.language}`,
      })),
      args,
      supabase,
      sarvamCode,
    });
    printStats("REPLIES", replyStats);
  }
}

// ─── data loaders ───────────────────────────────────────────────────────────
async function loadCategories(
  supabase: SupabaseClient,
  args: Args,
): Promise<CategoryRow[]> {
  let q = supabase.from("categories").select("id, type, slug, profession_key");
  if (args.type) q = q.eq("type", args.type);
  if (args.slug) q = q.eq("slug", args.slug);
  if (args.profession) q = q.eq("profession_key", args.profession);

  const { data, error } = await q;
  if (error) {
    console.error("Failed to load categories:", error.message);
    process.exit(1);
  }
  return (data ?? []) as CategoryRow[];
}

async function loadPhraseIds(
  supabase: SupabaseClient,
  categoryIds: string[],
): Promise<string[]> {
  const { data, error } = await supabase
    .from("phrases")
    .select("id")
    .in("category_id", categoryIds)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to load phrase IDs:", error.message);
    process.exit(1);
  }
  return (data ?? []).map((r) => r.id as string);
}

async function loadPhraseTranslations(
  supabase: SupabaseClient,
  phraseIds: string[],
  langCode: string,
  max?: number,
): Promise<PhraseTransRow[]> {
  if (phraseIds.length === 0) return [];
  let q = supabase
    .from("phrase_translations")
    .select(
      `id, phrase_id, native_text, audio_url,
       phrase:phrases!inner(english_text)`,
    )
    .in("phrase_id", phraseIds)
    .eq("language_code", langCode)
    .is("audio_url", null);
  if (max) q = q.limit(max);

  const { data, error } = await q;
  if (error) {
    console.error("Failed to load phrase translations:", error.message);
    process.exit(1);
  }
  return (data ?? []).map((r) => {
    const row = r as unknown as {
      id: string;
      phrase_id: string;
      native_text: string;
      audio_url: string | null;
      phrase: { english_text: string } | null;
    };
    return {
      id: row.id,
      phrase_id: row.phrase_id,
      native_text: row.native_text,
      audio_url: row.audio_url,
      english_text: row.phrase?.english_text ?? "(untitled)",
    };
  });
}

async function loadReplyTranslations(
  supabase: SupabaseClient,
  phraseIds: string[],
  langCode: string,
  max?: number,
): Promise<ReplyTransRow[]> {
  if (phraseIds.length === 0) return [];
  // First grab reply ids belonging to these phrases.
  const { data: replyIdRows, error: idErr } = await supabase
    .from("replies")
    .select("id")
    .in("phrase_id", phraseIds);
  if (idErr) {
    console.error("Failed to load reply IDs:", idErr.message);
    process.exit(1);
  }
  const replyIds = (replyIdRows ?? []).map((r) => r.id as string);
  if (replyIds.length === 0) return [];

  let q = supabase
    .from("reply_translations")
    .select(
      `id, reply_id, native_text, audio_url,
       reply:replies!inner(english_text)`,
    )
    .in("reply_id", replyIds)
    .eq("language_code", langCode)
    .is("audio_url", null);
  if (max) q = q.limit(max);

  const { data, error } = await q;
  if (error) {
    console.error("Failed to load reply translations:", error.message);
    process.exit(1);
  }
  return (data ?? []).map((r) => {
    const row = r as unknown as {
      id: string;
      reply_id: string;
      native_text: string;
      audio_url: string | null;
      reply: { english_text: string } | null;
    };
    return {
      id: row.id,
      reply_id: row.reply_id,
      native_text: row.native_text,
      audio_url: row.audio_url,
      english_text: row.reply?.english_text ?? "(untitled)",
    };
  });
}

// ─── processing ─────────────────────────────────────────────────────────────
type RowJob = {
  id: string;
  label: string;
  text: string;
  pathPrefix: "phrases" | "replies";
  table: "phrase_translations" | "reply_translations";
  idColumn: "id";
  storageKey: string;
};

async function processRows(opts: {
  rows: RowJob[];
  args: Args;
  supabase: SupabaseClient;
  sarvamCode: SarvamLanguage;
}): Promise<Stats> {
  const stats: Stats = {
    considered: opts.rows.length,
    alreadyDone: 0,
    generated: 0,
    failed: 0,
    skipped: 0,
  };

  if (opts.rows.length === 0) return stats;
  if (opts.args.dryRun) {
    for (const r of opts.rows) {
      console.log(`[dry-run] would generate ${r.label}  (id=${r.id})`);
    }
    stats.skipped = opts.rows.length;
    return stats;
  }

  let cursor = 0;
  const workers = new Array(opts.args.concurrency).fill(0).map(async () => {
    while (cursor < opts.rows.length) {
      const idx = cursor++;
      const row = opts.rows[idx];
      const ok = await processOne(
        row,
        opts.args,
        opts.supabase,
        opts.sarvamCode,
      );
      if (ok) stats.generated += 1;
      else stats.failed += 1;
    }
  });

  await Promise.all(workers);
  return stats;
}

async function processOne(
  row: RowJob,
  args: Args,
  supabase: SupabaseClient,
  sarvamCode: SarvamLanguage,
): Promise<boolean> {
  const text = row.text?.trim();
  if (!text) {
    console.warn(`SKIP  ${row.label} (id=${row.id}) - empty native_text`);
    return false;
  }

  for (let attempt = 0; attempt <= args.retries; attempt += 1) {
    try {
      const { audioBase64, mimeType } = await sarvamTts({
        text,
        targetLanguage: sarvamCode,
        speaker: SPEAKER,
      });

      const buffer = Buffer.from(audioBase64, "base64");
      const path = `${row.pathPrefix}/${row.storageKey}.wav`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: mimeType || "audio/wav",
          upsert: true,
        });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const audioUrl = pub.publicUrl;
      if (!audioUrl) throw new Error("no public URL returned");

      const { error: updErr } = await supabase
        .from(row.table)
        .update({ audio_url: audioUrl })
        .eq(row.idColumn, row.id);
      if (updErr) throw new Error(`db update: ${updErr.message}`);

      console.log(`OK    ${row.label}`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const willRetry = attempt < args.retries;
      console.warn(
        `${willRetry ? "RETRY" : "FAIL "} ${row.label} (id=${row.id}) - ${msg}`,
      );
      if (willRetry) await sleep(600 * (attempt + 1));
    }
  }
  return false;
}

// ─── helpers ────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function trimEllipsis(s: string, n = 40) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function printStats(label: string, s: Stats) {
  console.log(`\n${label} summary`);
  console.log(`  considered : ${s.considered}`);
  console.log(`  generated  : ${s.generated}`);
  console.log(`  failed     : ${s.failed}`);
  console.log(`  skipped    : ${s.skipped}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
