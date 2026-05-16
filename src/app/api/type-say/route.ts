import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlement } from "@/lib/auth/entitlement";
import { resolveLanguageCode } from "@/lib/constants/languages";
import { geminiPhonetic, GeminiError } from "@/lib/gemini/client";
import {
  callerIdentity,
  clientIp,
  rateLimitMany,
  type RateLimitResult,
} from "@/lib/ratelimit";
import { checkProfanity } from "@/lib/safety/profanity";
import { scorePhonetic } from "@/lib/safety/phonetic-quality";
import {
  sarvamTranslate,
  sarvamTransliterate,
  sarvamTts,
  SarvamError,
  type SarvamLanguage,
} from "@/lib/sarvam/client";
import { uploadTypeSayAudio } from "@/lib/storage/type-say-audio";
import type { LanguageCode } from "@/types/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_INPUT_LEN = 200;
const MIN_INPUT_LEN = 1;

const LANGUAGE_CODE_BY_NAME: Record<string, SarvamLanguage> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
};

const SARVAM_LANGUAGE_BY_CODE: Record<LanguageCode, SarvamLanguage> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  ta: "ta-IN",
  te: "te-IN",
};

const PHONETIC_LANG_BY_SARVAM: Record<
  SarvamLanguage,
  "Kannada" | "Hindi" | "Tamil" | "Telugu" | null
> = {
  "kn-IN": "Kannada",
  "hi-IN": "Hindi",
  "ml-IN": null,
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "en-IN": null,
};

type PhoneticSource = "gemini" | "sarvam";
type ReplyAccess = "granted" | "locked";

type ExpectedReply = {
  english: string;
  native: string;
  phonetic: string;
};

type TypeSayPayload = {
  phonetic: string;
  native: string;
  audioUrl: string | null;
  targetLanguage: SarvamLanguage;
  phoneticSource: PhoneticSource;
  replyAccess: ReplyAccess;
  expectedReplies: ExpectedReply[];
  upgradeMessage?: string;
  cached?: boolean;
};

const REPLY_TEMPLATES_QUESTION = [
  "Yes, I understand.",
  "No, please explain once more.",
  "Please wait, I am checking.",
] as const;

const REPLY_TEMPLATES_DEFAULT = [
  "Okay, understood.",
  "Please repeat slowly.",
  "I can help with that.",
] as const;

function pickReplyTemplates(input: string): readonly string[] {
  return input.trim().endsWith("?")
    ? REPLY_TEMPLATES_QUESTION
    : REPLY_TEMPLATES_DEFAULT;
}

async function buildExpectedReplies(
  input: string,
  targetLanguage: SarvamLanguage,
): Promise<ExpectedReply[]> {
  const templates = pickReplyTemplates(input);
  const rows = await Promise.all(
    templates.map(async (english) => {
      const { translated } = await sarvamTranslate({
        text: english,
        sourceLanguage: "en-IN",
        targetLanguage,
      });
      if (!translated) {
        return null;
      }
      const { phonetic } = await resolvePhonetic(translated, targetLanguage);
      return {
        english,
        native: translated,
        phonetic,
      } satisfies ExpectedReply;
    }),
  );

  return rows.filter((v): v is ExpectedReply => Boolean(v));
}

function normalizeInput(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed.length < MIN_INPUT_LEN) return null;
  if (trimmed.length > MAX_INPUT_LEN) return null;
  return trimmed;
}

function buildCacheKey(input: string, lang: LanguageCode): string {
  // Bump prefix when phonetic rules/prompts change so stale rows are not
  // served forever (e.g. bad Kannada romanization cached earlier).
  return createHash("sha256")
    .update(`phonetic_v2::${lang}::${input.toLowerCase()}`)
    .digest("hex");
}

function deny(reason: string, rl: RateLimitResult) {
  return NextResponse.json(
    {
      error: reason,
      retryAfterMs: rl.retryAfterMs,
      limit: rl.limit,
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString(),
        "X-RateLimit-Limit": String(rl.limit),
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    },
  );
}

async function resolvePhonetic(
  nativeText: string,
  targetLanguage: SarvamLanguage,
): Promise<{ phonetic: string; source: PhoneticSource }> {
  const phoneticLang = PHONETIC_LANG_BY_SARVAM[targetLanguage];

  if (phoneticLang && process.env.GEMINI_API_KEY) {
    try {
      const { phonetic } = await geminiPhonetic({
        nativeText,
        targetLanguage: phoneticLang,
      });
      const q = scorePhonetic(phonetic, nativeText);
      if (q.ok) return { phonetic, source: "gemini" };
      console.warn(
        "[type-say] Gemini phonetic rejected:",
        q.reasons.join(", "),
      );
    } catch (err) {
      console.warn("[type-say] Gemini failed:", (err as Error).message);
    }
  }

  const { transliterated } = await sarvamTransliterate({
    text: nativeText,
    sourceLanguage: targetLanguage,
    targetLanguage: "en-IN",
  });
  if (!transliterated) {
    throw new Error("No phonetic available from any source");
  }
  return { phonetic: transliterated, source: "sarvam" };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = normalizeInput((body as { text?: unknown })?.text);
  if (!input) {
    return NextResponse.json(
      {
        error: `Text must be ${MIN_INPUT_LEN}–${MAX_INPUT_LEN} characters.`,
      },
      { status: 400 },
    );
  }

  const profanity = checkProfanity(input);
  if (profanity.blocked) {
    return NextResponse.json(
      {
        error:
          "Please keep phrases respectful. VANI is for everyday communication only.",
        blocked: true,
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Entitlement is read once, here, and used for both the cache-hit path
  // and the fresh-generation path below. DB → env-allowlist fallback is
  // handled inside `getUserEntitlement`.
  const entitlement = await getUserEntitlement(user.id);
  const repliesUnlocked = entitlement.repliesUnlocked;

  const { data: profile } = await supabase
    .from("users")
    .select("language_code, language_to")
    .eq("id", user.id)
    .maybeSingle();

  const languageCode = resolveLanguageCode(
    profile?.language_code ?? profile?.language_to,
  );
  const targetLanguage: SarvamLanguage =
    SARVAM_LANGUAGE_BY_CODE[languageCode] ??
    LANGUAGE_CODE_BY_NAME[profile?.language_to ?? ""] ??
    "kn-IN";

  const ip = clientIp(req);
  const identity = callerIdentity({ userId: user.id, ip });

  const cacheKey = buildCacheKey(input, languageCode);

  // ── 1. DB cache hit (zero AI cost, shared across all instances) ────────
  const { data: cached } = await supabase
    .from("type_say_cache")
    .select(
      "native_text, phonetic_text, audio_url, phonetic_source, language_code",
    )
    .eq("cache_key", cacheKey)
    .maybeSingle();

  if (cached) {
    // Touch last_used_at for future cache-eviction policies. Fire-and-forget;
    // we don't block the response on it. Errors logged for visibility.
    void supabase
      .rpc("touch_type_say_cache", { p_cache_key: cacheKey })
      .then(({ error }) => {
        if (error) {
          console.warn(
            "[/api/type-say] touch_type_say_cache failed:",
            error.message,
          );
        }
      });

    let expectedReplies: ExpectedReply[] = [];
    if (repliesUnlocked) {
      try {
        expectedReplies = await buildExpectedReplies(input, targetLanguage);
      } catch (err) {
        console.warn(
          "[/api/type-say] expected replies generation failed:",
          (err as Error).message,
        );
      }
    }

    const payload: TypeSayPayload = {
      phonetic: cached.phonetic_text as string,
      native: cached.native_text as string,
      audioUrl: (cached.audio_url as string | null) ?? null,
      targetLanguage,
      phoneticSource: cached.phonetic_source as PhoneticSource,
      replyAccess: repliesUnlocked ? "granted" : "locked",
      expectedReplies,
      upgradeMessage: repliesUnlocked
        ? undefined
        : "Expected replies are available on paid plans.",
      cached: true,
    };
    return NextResponse.json(payload);
  }

  // ── 2. Rate limit ONLY for cache misses (cheap reads stay free) ────────
  //
  // Budget maths (Sarvam Starter, ₹955 credits):
  //   Cost per uncached request ≈ ₹0.025 (translate ~50ch + TTS ~50ch)
  //   ₹955 ÷ ₹0.025 ≈ 38,200 uncached requests before credits run out.
  //   At 100 users × 10 unique/day = 1,000 uncached/day → ~38 days runway.
  //
  //   The real throttle point is Sarvam's provider limit:
  //   bulbul:v3 Starter = 30 req/min. We cap globally at 25/min so we
  //   never burst into provider 429s.
  const rl = await rateLimitMany([
    // Per-IP burst — stops a single device hammering.
    { key: `type-say:ip-burst:${ip}`, limit: 20, windowMs: 60_000 },
    // Per-user burst — stops one account hogging the minute window.
    { key: `type-say:user-burst:${identity}`, limit: 8, windowMs: 60_000 },
    // Per-user hourly — comfortable for genuine daily use.
    { key: `type-say:user-hour:${identity}`, limit: 50, windowMs: 60 * 60_000 },
    // Per-user daily — generous for launch data collection.
    {
      key: `type-say:user-day:${identity}`,
      limit: 200,
      windowMs: 24 * 60 * 60_000,
    },
    // Global per-minute — CRITICAL: keeps us under Sarvam bulbul:v3
    // Starter cap of 30 req/min. Stay at 25 to leave headroom.
    {
      key: "type-say:global-minute",
      limit: 25,
      windowMs: 60_000,
    },
    // Global hourly ceiling — additional cost guardrail.
    {
      key: "type-say:global-hour",
      limit: 400,
      windowMs: 60 * 60_000,
    },
  ]);
  if (!rl.ok) {
    const seconds = Math.ceil(rl.retryAfterMs / 1000);
    return deny(`Too many requests. Try again in ${seconds}s.`, rl);
  }

  // ── 3. Generate (Sarvam translate + TTS, Gemini phonetic in parallel) ──
  try {
    const { translated } = await sarvamTranslate({
      text: input,
      sourceLanguage: "en-IN",
      targetLanguage,
    });
    if (!translated) {
      return NextResponse.json(
        { error: "Could not translate that. Try simpler wording." },
        { status: 502 },
      );
    }

    const [phoneticRes, ttsRes] = await Promise.all([
      resolvePhonetic(translated, targetLanguage),
      sarvamTts({ text: translated, targetLanguage }),
    ]);

    // ── 4. Upload audio to storage (returns public URL, not base64) ──────
    const audioUrl = await uploadTypeSayAudio({
      cacheKey,
      audioBase64: ttsRes.audioBase64,
      mimeType: ttsRes.mimeType,
    });

    if (!audioUrl) {
      // Keep this explicit so failures are visible in Sentry/railway logs.
      console.warn("[/api/type-say] audio upload failed, returning text only");
    }

    // ── 5. Persist cache row. We MUST await + log errors here.
    //    If this silently fails, every request keeps hitting Sarvam
    //    and our credits burn. Visible logs let us catch RLS regressions.
    const { error: cacheErr } = await supabase.from("type_say_cache").upsert(
      {
        cache_key: cacheKey,
        language_code: languageCode,
        input_text: input,
        native_text: translated,
        phonetic_text: phoneticRes.phonetic,
        audio_url: audioUrl,
        phonetic_source: phoneticRes.source,
      },
      { onConflict: "cache_key" },
    );
    if (cacheErr) {
      console.error(
        "[/api/type-say] cache upsert failed:",
        cacheErr.message,
        "→ next identical request will re-hit Sarvam. Check RLS on type_say_cache.",
      );
    }

    const payload: TypeSayPayload = {
      phonetic: phoneticRes.phonetic,
      native: translated,
      audioUrl,
      targetLanguage,
      phoneticSource: phoneticRes.source,
      replyAccess: repliesUnlocked ? "granted" : "locked",
      expectedReplies: [],
      upgradeMessage: repliesUnlocked
        ? undefined
        : "Expected replies are available on paid plans.",
    };

    if (repliesUnlocked) {
      try {
        payload.expectedReplies = await buildExpectedReplies(input, targetLanguage);
      } catch (err) {
        console.warn(
          "[/api/type-say] expected replies generation failed:",
          (err as Error).message,
        );
      }
    }

    return NextResponse.json(payload);
  } catch (err) {
    const status =
      err instanceof SarvamError
        ? err.status
        : err instanceof GeminiError
          ? err.status
          : 500;
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    console.error("[/api/type-say]", message);
    return NextResponse.json(
      {
        error:
          status === 429
            ? "Our language service is busy. Try again shortly."
            : "Could not generate speech. Try again.",
      },
      { status: status === 429 ? 503 : 502 },
    );
  }
}
