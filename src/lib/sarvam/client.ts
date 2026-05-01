/**
 * Sarvam AI server-only client.
 *
 * Used for two things:
 *  1. Pre-generating audio for curated phrases (offline script).
 *  2. Powering the live "Type & Say" feature via /api/type-say,
 *     protected by strict rate limits + a result cache.
 *
 * Never import this from client components — it reads SARVAM_API_KEY.
 */

const SARVAM_BASE = "https://api.sarvam.ai";

export const SUPPORTED_LANGUAGES = [
  { code: "kn-IN", label: "Kannada" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "ml-IN", label: "Malayalam" },
  { code: "en-IN", label: "English" },
] as const;

export type SarvamLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

function apiKey(): string {
  const key = process.env.SARVAM_API_KEY;
  if (!key) throw new Error("SARVAM_API_KEY is not configured");
  return key;
}

function defaultTarget(): SarvamLanguage {
  const v = process.env.SARVAM_DEFAULT_TARGET_LANGUAGE;
  return (v && v.includes("-") ? (v as SarvamLanguage) : "kn-IN");
}

async function sarvamFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${SARVAM_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey(),
    },
    body: JSON.stringify(body),
    // short-circuit hanging upstream so rate-limit UX stays snappy
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SarvamError(
      res.status,
      `Sarvam ${path} failed: ${res.status} ${res.statusText} ${text}`.trim(),
    );
  }

  return (await res.json()) as T;
}

export class SarvamError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "SarvamError";
  }
}

/** Translate English → target Indian language (native script). */
export async function sarvamTranslate(params: {
  text: string;
  sourceLanguage?: SarvamLanguage;
  targetLanguage?: SarvamLanguage;
}): Promise<{ translated: string; detectedSource?: string }> {
  const out = await sarvamFetch<{
    translated_text?: string;
    source_language_code?: string;
  }>("/translate", {
    input: params.text,
    source_language_code: params.sourceLanguage ?? "en-IN",
    target_language_code: params.targetLanguage ?? defaultTarget(),
    speaker_gender: "Female",
    mode: "classic-colloquial",
    model: "mayura:v1",
    enable_preprocessing: true,
  });
  return {
    translated: out.translated_text ?? "",
    detectedSource: out.source_language_code,
  };
}

/** Transliterate native script → Roman (used as phonetic). */
export async function sarvamTransliterate(params: {
  text: string;
  sourceLanguage: SarvamLanguage;
  targetLanguage?: SarvamLanguage;
}): Promise<{ transliterated: string }> {
  const out = await sarvamFetch<{ transliterated_text?: string }>(
    "/transliterate",
    {
      input: params.text,
      source_language_code: params.sourceLanguage,
      target_language_code: params.targetLanguage ?? "en-IN",
    },
  );
  return { transliterated: out.transliterated_text ?? "" };
}

/**
 * Returns base64-encoded WAV audio from Sarvam Bulbul v3.
 * NOTE: Bulbul v3 does NOT accept pitch/loudness params — do not add them.
 */
export async function sarvamTts(params: {
  text: string;
  targetLanguage: SarvamLanguage;
  speaker?: string;
  model?: string;
}): Promise<{ audioBase64: string; mimeType: string }> {
  const model = params.model ?? process.env.SARVAM_TTS_MODEL ?? "bulbul:v3";
  const speaker = params.speaker ?? process.env.SARVAM_DEFAULT_SPEAKER ?? "ritu";

  let data: { audios?: string[] };
  try {
    data = await sarvamFetch<{ audios?: string[] }>("/text-to-speech", {
      text: params.text,
      target_language_code: params.targetLanguage,
      speaker,
      pace: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model,
    });
  } catch (err) {
    // If env speaker is incompatible with model (common on Bulbul v3),
    // retry once with a known compatible fallback.
    if (
      err instanceof SarvamError &&
      /not compatible with model/i.test(err.message) &&
      speaker !== "ritu"
    ) {
      data = await sarvamFetch<{ audios?: string[] }>("/text-to-speech", {
        text: params.text,
        target_language_code: params.targetLanguage,
        speaker: "ritu",
        pace: 1,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model,
      });
    } else {
      throw err;
    }
  }
  const audio = data.audios?.[0] ?? "";
  if (!audio) throw new SarvamError(502, "Sarvam returned no audio");
  return { audioBase64: audio, mimeType: "audio/wav" };
}
