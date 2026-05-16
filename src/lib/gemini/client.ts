/**
 * Gemini server-only client.
 *
 * Used for generating speakable Roman phonetics from native-script text.
 * Never import this from client components — it reads GEMINI_API_KEY.
 *
 * Contract: caller gets a validated { phonetic } string or an Error.
 * Invalid / empty / oversized responses are rejected — callers should
 * fall back to Sarvam transliteration on failure.
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
// gemini-2.5-flash-lite: 15 RPM / 1000 RPD free, lowest latency, perfect for a
// short deterministic JSON task like phonetic romanization.
const DEFAULT_MODEL = "gemini-2.5-flash-lite";

const MAX_PHONETIC_LEN = 220;

export class GeminiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "GeminiError";
  }
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError(500, "GEMINI_API_KEY is not configured");
  return key;
}

export type PhoneticLanguage = "Kannada" | "Hindi" | "Tamil" | "Telugu";

const BASE_RULES = `You are a phonetic converter for an Indian language learning app.

Task:
Convert the given native-script sentence into easy-to-read Roman phonetics for Indian English speakers.

Rules:
1) Output MUST be valid JSON only. No markdown, no code fences, no extra text.
2) JSON schema:
   {"phonetic_text":"<string>"}
3) Keep phonetic_text concise, natural, and speakable.
4) Use syllable-friendly romanization: put ONE hyphen "-" between syllables inside a word (example: "na-na-ge sa-ha-ya be-ku").
5) Between spoken words, put a clear pause marker: space, two hyphens, space " -- " (example: "na-na-ge -- sa-ha-ya -- be-ku").
6) Do NOT include IPA symbols.
7) Do NOT translate meaning; only romanize what is written in the native line.
8) Do NOT add commas, quotes, or question marks unless they help reading; prefer hyphens only.
9) If uncertain, return best-effort phonetics; never return empty text.
10) Maximum length: 220 characters.`;

const LANGUAGE_RULES: Record<PhoneticLanguage, string> = {
  Kannada: `Language-specific (Kannada — mandatory):
- The native text is in Kannada script. Romanize as standard Kannada-to-English (common Bangalore / Karnataka learner style).
- NEVER use Hindi/Urdu spellings for Kannada words. Wrong examples to avoid: "kitni", "kitna", "kyaa/kya", "idhar/udhar", "yeh", "dikhao", "bhav" for Kannada equivalents — use Kannada pronunciations instead (e.g. ಎಷ್ಟು → "yeshtu", ಇದು → "idu", ಏನು → "enu", ನೀವು → "neevu", ದಯವಿಟ್ಟು → "daya-vit-tu").
- Loanwords that stay in Latin in the native line (e.g. airport, fare) may stay in Latin as in the source.
- Match the Kannada sentence sound-for-sound; do not drift into another Indian language.`,

  Hindi: `Language-specific (Hindi):
- Use clear Hindi-to-Roman style for Devanagari; keep syllable hyphens and " -- " between words as above.`,

  Tamil: `Language-specific (Tamil):
- Use Tamil-to-Roman style for Tamil script; do not use Hindi or Kannada spelling habits.`,

  Telugu: `Language-specific (Telugu):
- Use Telugu-to-Roman style for Telugu script; do not use Hindi or Kannada spelling habits.`,
};

function systemInstructionFor(lang: PhoneticLanguage): string {
  return `${BASE_RULES}\n\n${LANGUAGE_RULES[lang]}`;
}

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};

/**
 * Produce a speakable phonetic romanization of native-script text.
 * Throws GeminiError on network/API/validation failure — caller MUST handle.
 */
export async function geminiPhonetic(params: {
  nativeText: string;
  targetLanguage: PhoneticLanguage;
  model?: string;
}): Promise<{ phonetic: string }> {
  const model = params.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey()}`;

  const body = {
    systemInstruction: {
      role: "system",
      parts: [{ text: systemInstructionFor(params.targetLanguage) }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Target language: ${params.targetLanguage}\nNative text: "${params.nativeText}"\nReturn JSON only.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.12,
      topP: 0.8,
      maxOutputTokens: 256,
      responseMimeType: "application/json",
      // Disable thinking on 2.5 models — saves latency and tokens for a
      // simple, deterministic task like phonetic conversion.
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
      },
    ],
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });
  } catch (err) {
    throw new GeminiError(
      504,
      `Gemini request failed: ${(err as Error).message}`,
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GeminiError(
      res.status,
      `Gemini ${res.status} ${res.statusText} ${text}`.trim(),
    );
  }

  const data = (await res.json()) as GeminiResponse;

  const blocked = data.promptFeedback?.blockReason;
  if (blocked) {
    throw new GeminiError(400, `Gemini blocked prompt: ${blocked}`);
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const phonetic = extractAndValidatePhonetic(rawText);
  return { phonetic };
}

function extractAndValidatePhonetic(raw: string): string {
  if (!raw || typeof raw !== "string") {
    throw new GeminiError(502, "Gemini returned no text");
  }

  // Strip any accidental markdown fences, even though we asked it not to.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new GeminiError(502, "Gemini response was not valid JSON");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("phonetic_text" in parsed) ||
    typeof (parsed as { phonetic_text: unknown }).phonetic_text !== "string"
  ) {
    throw new GeminiError(502, "Gemini response missing phonetic_text");
  }

  let phonetic = (parsed as { phonetic_text: string }).phonetic_text;
  phonetic = phonetic.replace(/\s+/g, " ").trim();

  if (!phonetic) {
    throw new GeminiError(502, "Gemini returned empty phonetic_text");
  }
  if (phonetic.length > MAX_PHONETIC_LEN) {
    phonetic = phonetic.slice(0, MAX_PHONETIC_LEN).trim();
  }
  // Reject obvious garbage: must contain at least one ASCII letter.
  if (!/[a-zA-Z]/.test(phonetic)) {
    throw new GeminiError(502, "Gemini phonetic contained no letters");
  }

  return phonetic;
}
