import { listPhrasesByType } from "@/lib/data/phrases";
import type { LanguageCode } from "@/types/db";
import type { PhraseWithCategory } from "@/lib/data/phrases";

/**
 * Deterministic day-of-year integer in [0, 365].
 * Same value everywhere on the same calendar date in IST-ish terms;
 * good enough for picking a daily phrase.
 */
function dayOfYearKey(now = new Date()): number {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - start) / 86_400_000);
}

/**
 * Pick a single general phrase for "Phrase of the day".
 * Deterministic per language + date — refreshes once per calendar day.
 */
export async function getDailyPhrase(
  languageCode: LanguageCode,
): Promise<PhraseWithCategory | null> {
  const phrases = await listPhrasesByType("general", { languageCode });
  if (phrases.length === 0) return null;
  const idx = dayOfYearKey() % phrases.length;
  return phrases[idx] ?? null;
}
