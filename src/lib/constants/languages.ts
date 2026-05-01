import type { LanguageCode } from "@/types/db";

/**
 * Friendly language names shown in onboarding & profile screens.
 * Matches `users.language_to` values.
 */
export const LANGUAGE_OPTIONS = [
  "Kannada",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "English",
] as const;

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

/** Languages intentionally shown as "Upcoming" in target-language UX. */
export const UPCOMING_LANGUAGE_OPTIONS = [
  "Telugu",
  "Tamil",
  "Malayalam",
] as const;

/** Map from friendly name (UI) → 2-letter code stored on rows. */
export const LANGUAGE_NAME_TO_CODE: Record<string, LanguageCode> = {
  Kannada: "kn",
  Hindi: "hi",
  Tamil: "ta",
  Telugu: "te",
  Malayalam: "ml",
  English: "en",
};

/** Reverse map for displaying names from a code. */
export const LANGUAGE_CODE_TO_NAME: Record<LanguageCode, string> = {
  kn: "Kannada",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  en: "English",
};

/** Default language for new users / unauthenticated visitors. */
export const DEFAULT_LANGUAGE_CODE: LanguageCode = "kn";

/**
 * Best-effort name → code resolver. Falls back to `kn`.
 * Use when a row has only `language_to` (legacy) and no `language_code`.
 */
export function resolveLanguageCode(
  nameOrCode: string | null | undefined,
): LanguageCode {
  if (!nameOrCode) return DEFAULT_LANGUAGE_CODE;
  const v = nameOrCode.trim();
  if (v.length === 2 && v.toLowerCase() in LANGUAGE_CODE_TO_NAME) {
    return v.toLowerCase() as LanguageCode;
  }
  const byName = LANGUAGE_NAME_TO_CODE[v];
  if (byName) return byName;
  // Case-insensitive fallback.
  const lowered = v.toLowerCase();
  for (const [name, code] of Object.entries(LANGUAGE_NAME_TO_CODE)) {
    if (name.toLowerCase() === lowered) return code;
  }
  return DEFAULT_LANGUAGE_CODE;
}
