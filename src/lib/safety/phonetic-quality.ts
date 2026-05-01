/**
 * Heuristic quality scorer for generated Roman phonetic text.
 *
 * Gemini sometimes returns phonetics that are valid JSON but clearly wrong
 * (e.g. "elli elli elli-de"). This module flags those so the route can
 * fall back to a different source (Sarvam transliteration) instead of
 * showing the user junk.
 *
 * Not trying to be smart — trying to catch obvious failure modes.
 */

export type PhoneticScore = {
  score: number; // 0..1
  ok: boolean;
  reasons: string[]; // human-readable failure reasons
};

const GOOD_THRESHOLD = 0.6;

export function scorePhonetic(
  phonetic: string,
  sourceText: string,
): PhoneticScore {
  const reasons: string[] = [];
  let score = 1.0;

  const trimmed = phonetic.trim();

  if (!trimmed) {
    return { score: 0, ok: false, reasons: ["empty phonetic"] };
  }
  if (!/[a-z]/i.test(trimmed)) {
    return { score: 0, ok: false, reasons: ["no latin letters"] };
  }

  const tokens = trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z-]/g, ""))
    .filter(Boolean);

  // 1. Length sanity relative to source.
  const srcChars = sourceText.trim().length;
  if (srcChars > 0) {
    const ratio = trimmed.length / srcChars;
    // Typical English -> Roman phonetic ratio is ~0.6 - 2.5.
    if (ratio < 0.3) {
      score -= 0.35;
      reasons.push(`too short (ratio ${ratio.toFixed(2)})`);
    } else if (ratio > 4) {
      score -= 0.35;
      reasons.push(`too long (ratio ${ratio.toFixed(2)})`);
    }
  }

  // 2. Consecutive-token repetition (e.g. "elli elli elli-de").
  let run = 1;
  let maxRun = 1;
  for (let i = 1; i < tokens.length; i += 1) {
    if (tokens[i] === tokens[i - 1] && tokens[i].length >= 3) {
      run += 1;
      maxRun = Math.max(maxRun, run);
    } else {
      run = 1;
    }
  }
  if (maxRun >= 3) {
    score -= 0.7;
    reasons.push(`consecutive repetition x${maxRun}`);
  } else if (maxRun === 2) {
    score -= 0.25;
    reasons.push("adjacent duplicate token");
  }

  // 3. Distinct-token diversity (catch "ra ra ra ra").
  if (tokens.length >= 4) {
    const unique = new Set(tokens).size;
    const diversity = unique / tokens.length;
    if (diversity < 0.4) {
      score -= 0.35;
      reasons.push(`low diversity (${diversity.toFixed(2)})`);
    }
  }

  // 4. Vowel presence — real words almost always have vowels.
  const vowelTokens = tokens.filter((t) => /[aeiou]/.test(t)).length;
  if (tokens.length > 0) {
    const vowelRatio = vowelTokens / tokens.length;
    if (vowelRatio < 0.5) {
      score -= 0.3;
      reasons.push(`low vowel coverage (${vowelRatio.toFixed(2)})`);
    }
  }

  // 5. Punctuation / dash spam.
  const dashes = (trimmed.match(/-/g) ?? []).length;
  if (tokens.length > 0 && dashes / Math.max(trimmed.length, 1) > 0.2) {
    score -= 0.15;
    reasons.push("excessive dashes");
  }

  if (score < 0) score = 0;
  return { score, ok: score >= GOOD_THRESHOLD, reasons };
}
