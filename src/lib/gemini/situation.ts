/**
 * Gemini "situation conversation" generator — server only.
 *
 * Given a free-text situation the user is about to walk into, returns a
 * realistic start-to-end conversation script:
 *   - alternating user turns (one sentence each) and other-person turns
 *     (2-4 realistic reply options each)
 *   - emoji + label for the other person
 *   - a short end-note (what happens at the end)
 *
 * The /api/situation route then translates + speaks user turns via Sarvam,
 * and translates + transliterates other-person replies for reading.
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";

export class GeminiSituationError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "GeminiSituationError";
  }
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiSituationError(500, "GEMINI_API_KEY is not configured");
  return key;
}

const SYSTEM_INSTRUCTION = `You are a survival-language coach helping someone new to an Indian city.

The user describes a real everyday situation they are about to walk into. Generate a realistic, short, start-to-end conversation between the user and one other person (auto driver, shopkeeper, receptionist, etc.).

Rules:
1) Output MUST be valid JSON only. No markdown, no fences, no extra text.
2) JSON schema:
   {
     "other_label": "<who the other person is, 2-4 words>",
     "other_emoji": "<one emoji>",
     "turns": [
       {"speaker":"user","english":"<one sentence>"},
       {"speaker":"other","replies":["<reply>","<reply>","<reply>"]},
       ...
     ],
     "end_note": "<one short English sentence: what happens at the end>"
   }
3) Turns MUST strictly alternate: user → other → user → other → ... and MUST end on other.
4) Total turns: between 6 and 10 (3 to 5 user+other pairs).
5) User turns: ONE English sentence, 3-14 words. Plain, respectful, ready-to-speak. Start with a natural greeting like "Anna" or "Excuse me" where appropriate.
6) Other turns: 2 to 4 short realistic reply options (what they might actually say), 3-10 words each. Include yes/no/price numbers/short questions — real conversational responses.
7) Cover the natural flow: greeting/opening → core request → practical details (price, location, quantity, confirmation) → close.
8) other_emoji: use 🚗 for auto/taxi/cab, 💊 for pharmacy/medical shop, 🏥 for hospital/clinic/reception, 🛒 for grocery/market/general shop, 🍽️ for restaurant/hotel/dhaba, 🏠 for landlord/house owner, 👮 for police/security guard, 🏦 for bank/ATM helper, 👤 for anyone else.
9) Replies must feel real. Include exact prices (numbers), short confirmations, or follow-up questions exactly as that person would say them in everyday Indian English.
10) Do NOT include translations, phonetics, or native script anywhere — plain English only.`;

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};

export type UserTurn = {
  speaker: "user";
  english: string;
};

export type OtherTurn = {
  speaker: "other";
  replies: string[];
};

export type ConversationTurn = UserTurn | OtherTurn;

export type SituationConversation = {
  other_label: string;
  other_emoji: string;
  turns: ConversationTurn[];
  end_note: string;
};

export async function geminiSituationConversation(params: {
  situation: string;
  targetLanguageLabel: string;
  model?: string;
}): Promise<SituationConversation> {
  const model = params.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey()}`;

  const body = {
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Target language for translation later: ${params.targetLanguageLabel}.
Situation (English):
"""${params.situation}"""

Return JSON only.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(18_000),
    });
  } catch (err) {
    throw new GeminiSituationError(504, `Gemini request failed: ${(err as Error).message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GeminiSituationError(res.status, `Gemini ${res.status} ${res.statusText} ${text}`.trim());
  }

  const data = (await res.json()) as GeminiResponse;
  const blocked = data.promptFeedback?.blockReason;
  if (blocked) throw new GeminiSituationError(400, `Gemini blocked prompt: ${blocked}`);

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return parseAndValidate(rawText);
}

const VALID_EMOJIS = new Set(["🚗","💊","🏥","🛒","🍽️","🏠","👮","🏦","👤"]);

function parseAndValidate(raw: string): SituationConversation {
  if (!raw) throw new GeminiSituationError(502, "Gemini returned no text");

  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new GeminiSituationError(502, "Gemini response was not valid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new GeminiSituationError(502, "Gemini response is not an object");
  }

  const p = parsed as Record<string, unknown>;

  const other_label =
    typeof p.other_label === "string" && p.other_label.trim()
      ? p.other_label.trim().slice(0, 40)
      : "Other person";

  const other_emoji =
    typeof p.other_emoji === "string" && VALID_EMOJIS.has(p.other_emoji.trim())
      ? p.other_emoji.trim()
      : "👤";

  const end_note =
    typeof p.end_note === "string" && p.end_note.trim()
      ? p.end_note.trim().slice(0, 120)
      : "";

  if (!Array.isArray(p.turns) || p.turns.length < 4) {
    throw new GeminiSituationError(502, "Gemini returned too few turns");
  }

  const turns: ConversationTurn[] = [];
  for (const t of p.turns as unknown[]) {
    if (!t || typeof t !== "object") continue;
    const turn = t as Record<string, unknown>;

    if (turn.speaker === "user") {
      const english = typeof turn.english === "string" ? turn.english.trim() : "";
      if (english.length < 2) continue;
      turns.push({ speaker: "user", english: english.slice(0, 120) });
    } else if (turn.speaker === "other") {
      const raw = Array.isArray(turn.replies) ? (turn.replies as unknown[]) : [];
      const replies = raw
        .map((r) => (typeof r === "string" ? r.trim() : ""))
        .filter((r) => r.length >= 2)
        .map((r) => r.slice(0, 80))
        .slice(0, 4);
      if (replies.length === 0) continue;
      turns.push({ speaker: "other", replies });
    }
  }

  if (turns.length < 4) {
    throw new GeminiSituationError(502, "Not enough valid turns in Gemini response");
  }

  return { other_label, other_emoji, turns, end_note };
}
