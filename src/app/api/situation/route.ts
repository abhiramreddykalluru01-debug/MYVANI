/**
 * /api/situation — Situation Conversation Generator.
 *
 * Flow:
 *   1) auth + profanity + rate limit
 *   2) Gemini → full conversation script (user turns + other-person reply options)
 *   3) For each USER turn (parallel):
 *        Sarvam translate → native text
 *        Gemini phonetic (preferred) OR Sarvam transliterate (fallback)
 *        Sarvam TTS → WAV → upload
 *   4) For each OTHER turn reply (parallel):
 *        Sarvam translate → native text
 *        Sarvam transliterate → phonetic (no TTS needed — user only reads these)
 *   5) Return the full enriched conversation.
 */

import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import {
  geminiPhonetic,
  GeminiError,
  type PhoneticLanguage,
} from "@/lib/gemini/client";
import {
  geminiSituationConversation,
  GeminiSituationError,
  type ConversationTurn,
} from "@/lib/gemini/situation";
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

const MIN_INPUT_LEN = 8;
const MAX_INPUT_LEN = 220;

const SARVAM_LANGUAGE_BY_CODE: Record<LanguageCode, SarvamLanguage> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  ta: "ta-IN",
  te: "te-IN",
};

const PHONETIC_LANG_BY_SARVAM: Record<SarvamLanguage, PhoneticLanguage | null> = {
  "kn-IN": "Kannada",
  "hi-IN": "Hindi",
  "ml-IN": null,
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "en-IN": null,
};

const LANGUAGE_LABEL_BY_CODE: Record<LanguageCode, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
  ml: "Malayalam",
  ta: "Tamil",
  te: "Telugu",
};

// ── Output types ────────────────────────────────────────────────────────────

export type EnrichedUserTurn = {
  speaker: "user";
  english: string;
  native: string;
  phonetic: string;
  audioUrl: string | null;
};

export type EnrichedReply = {
  english: string;
  native: string;
  phonetic: string;
};

export type EnrichedOtherTurn = {
  speaker: "other";
  replies: EnrichedReply[];
};

export type EnrichedTurn = EnrichedUserTurn | EnrichedOtherTurn;

export type SituationPayload = {
  other_label: string;
  other_emoji: string;
  end_note: string;
  targetLanguage: SarvamLanguage;
  languageCode: LanguageCode;
  turns: EnrichedTurn[];
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeInput(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed.length < MIN_INPUT_LEN) return null;
  if (trimmed.length > MAX_INPUT_LEN) return null;
  return trimmed;
}

function deny(reason: string, rl: RateLimitResult) {
  return NextResponse.json(
    { error: reason, retryAfterMs: rl.retryAfterMs, limit: rl.limit },
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

async function resolvePhoneticGemini(
  nativeText: string,
  targetLanguage: SarvamLanguage,
): Promise<string | null> {
  const phoneticLang = PHONETIC_LANG_BY_SARVAM[targetLanguage];
  if (!phoneticLang || !process.env.GEMINI_API_KEY) return null;
  try {
    const { phonetic } = await geminiPhonetic({ nativeText, targetLanguage: phoneticLang });
    const q = scorePhonetic(phonetic, nativeText);
    if (q.ok) return phonetic;
    console.warn("[/api/situation] Gemini phonetic rejected:", q.reasons.join(", "));
  } catch (err) {
    console.warn("[/api/situation] Gemini phonetic failed:", (err as Error).message);
  }
  return null;
}

async function resolvePhoneticSarvam(
  nativeText: string,
  targetLanguage: SarvamLanguage,
): Promise<string> {
  const { transliterated } = await sarvamTransliterate({
    text: nativeText,
    sourceLanguage: targetLanguage,
    targetLanguage: "en-IN",
  });
  return transliterated ?? nativeText;
}

/** Full phonetic resolution — Gemini first, Sarvam fallback. */
async function resolvePhonetic(
  nativeText: string,
  targetLanguage: SarvamLanguage,
): Promise<string> {
  const gemini = await resolvePhoneticGemini(nativeText, targetLanguage);
  if (gemini) return gemini;
  return resolvePhoneticSarvam(nativeText, targetLanguage);
}

/** Build one enriched user turn (translate + phonetic + TTS + upload). */
async function buildUserTurn(
  english: string,
  targetLanguage: SarvamLanguage,
  languageCode: LanguageCode,
): Promise<EnrichedUserTurn | null> {
  try {
    const { translated } = await sarvamTranslate({
      text: english,
      sourceLanguage: "en-IN",
      targetLanguage,
    });
    if (!translated) return null;

    const [phonetic, ttsRes] = await Promise.all([
      resolvePhonetic(translated, targetLanguage),
      sarvamTts({ text: translated, targetLanguage }),
    ]);

    const cacheKey = createHash("sha256")
      .update(`situation::v2::${languageCode}::${translated}`)
      .digest("hex");

    const audioUrl = await uploadTypeSayAudio({
      cacheKey,
      audioBase64: ttsRes.audioBase64,
      mimeType: ttsRes.mimeType,
    });

    return { speaker: "user", english, native: translated, phonetic, audioUrl };
  } catch (err) {
    console.warn("[/api/situation] user turn failed:", english, (err as Error).message);
    return null;
  }
}

/** Build one enriched reply (translate + Sarvam transliterate; no TTS). */
async function buildReply(
  english: string,
  targetLanguage: SarvamLanguage,
): Promise<EnrichedReply | null> {
  try {
    const { translated } = await sarvamTranslate({
      text: english,
      sourceLanguage: "en-IN",
      targetLanguage,
    });
    if (!translated) return null;

    const phonetic = await resolvePhoneticSarvam(translated, targetLanguage);
    return { english, native: translated, phonetic };
  } catch (err) {
    console.warn("[/api/situation] reply failed:", english, (err as Error).message);
    return null;
  }
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const situation = normalizeInput((body as { situation?: unknown })?.situation);
  if (!situation) {
    return NextResponse.json(
      { error: `Describe the situation in ${MIN_INPUT_LEN}–${MAX_INPUT_LEN} characters.` },
      { status: 400 },
    );
  }

  const profanity = checkProfanity(situation);
  if (profanity.blocked) {
    return NextResponse.json(
      { error: "Please keep situations respectful. VANI is for everyday communication only.", blocked: true },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const languageCode = await getCurrentLanguageCode();
  const targetLanguage = SARVAM_LANGUAGE_BY_CODE[languageCode] ?? "kn-IN";
  const targetLanguageLabel = LANGUAGE_LABEL_BY_CODE[languageCode] ?? "Kannada";

  const ip = clientIp(req);
  const identity = callerIdentity({ userId: user.id, ip });

  const rl = await rateLimitMany([
    { key: `situation:ip-burst:${ip}`, limit: 5, windowMs: 60_000 },
    { key: `situation:user-burst:${identity}`, limit: 3, windowMs: 60_000 },
    { key: `situation:user-hour:${identity}`, limit: 8, windowMs: 60 * 60_000 },
    { key: `situation:user-day:${identity}`, limit: 25, windowMs: 24 * 60 * 60_000 },
    { key: "situation:global-minute", limit: 6, windowMs: 60_000 },
  ]);
  if (!rl.ok) {
    return deny(`Too many requests. Try again in ${Math.ceil(rl.retryAfterMs / 1000)}s.`, rl);
  }

  // 1) Gemini → conversation script
  let conv: Awaited<ReturnType<typeof geminiSituationConversation>>;
  try {
    conv = await geminiSituationConversation({ situation, targetLanguageLabel });
  } catch (err) {
    const status = err instanceof GeminiSituationError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown";
    console.error("[/api/situation] gemini failed:", message);
    return NextResponse.json(
      {
        error: status === 400
          ? "Could not understand the situation. Try simpler wording."
          : "Our language service is busy. Try again shortly.",
      },
      { status: status === 400 ? 400 : 502 },
    );
  }

  // 2) Enrich all turns in parallel (user: translate+phonetic+TTS, other: translate+phonetic)
  try {
    const enrichedTurns = await Promise.all(
      conv.turns.map(async (turn: ConversationTurn): Promise<EnrichedTurn | null> => {
        if (turn.speaker === "user") {
          return buildUserTurn(turn.english, targetLanguage, languageCode);
        } else {
          const enrichedReplies = await Promise.all(
            turn.replies.map((r) => buildReply(r, targetLanguage)),
          );
          const replies = enrichedReplies.filter((r): r is EnrichedReply => r !== null);
          if (replies.length === 0) return null;
          return { speaker: "other", replies };
        }
      }),
    );

    const turns = enrichedTurns.filter((t): t is EnrichedTurn => t !== null);

    if (turns.length < 2) {
      return NextResponse.json(
        { error: "Could not generate conversation for this situation. Try again." },
        { status: 502 },
      );
    }

    const payload: SituationPayload = {
      other_label: conv.other_label,
      other_emoji: conv.other_emoji,
      end_note: conv.end_note,
      targetLanguage,
      languageCode,
      turns,
    };
    return NextResponse.json(payload);
  } catch (err) {
    const status =
      err instanceof SarvamError ? err.status :
      err instanceof GeminiError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown";
    console.error("[/api/situation]", message);
    return NextResponse.json(
      {
        error: status === 429
          ? "Our language service is busy. Try again shortly."
          : "Could not generate speech. Try again.",
      },
      { status: status === 429 ? 503 : 502 },
    );
  }
}
