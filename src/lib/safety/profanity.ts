/**
 * Lightweight profanity / abuse detector for user input text.
 *
 * Goals:
 *  - Block obvious slurs / abuses in English + common Indic-in-Roman forms.
 *  - Be FAST (single pass over normalized input).
 *  - Be conservative: better to let a rare curse through than to block a
 *    legitimate sentence. We only catch the clear cases.
 *
 * Not goals:
 *  - Perfect. Safety is handled in layers: this blocks obvious abuse at the
 *    gate; the model + system prompt handle edge cases.
 */

// Normalized (lowercase, no leet) exact words or short phrases to block.
// Add sparingly. Use word boundaries — we do not substring-match.
const BANNED_WORDS = new Set<string>([
  // English core
  "fuck",
  "fucker",
  "fucking",
  "motherfucker",
  "mofo",
  "shit",
  "bullshit",
  "bitch",
  "bastard",
  "asshole",
  "dick",
  "pussy",
  "cunt",
  "slut",
  "whore",
  "retard",
  "faggot",

  // Hindi / Hindustani (Romanized) — common abuses
  "bhenchod",
  "behenchod",
  "bhen",
  "bhenchod",
  "bhosdike",
  "bhosdika",
  "madarchod",
  "maderchod",
  "chutiya",
  "chutia",
  "chutiye",
  "gandu",
  "gaandu",
  "randi",
  "lund",
  "laund",
  "lawde",
  "lauda",

  // Kannada (Romanized) — common abuses
  "boli",
  "bolimaga",
  "bolimaga",
  "sule",
  "sulemaga",

  // Tamil (Romanized) — common abuses
  "otha",
  "oomba",
  "pundai",
  "punda",
  "thevdiya",
  "thevidiya",

  // Telugu (Romanized) — common abuses
  "puka",
  "modda",
  "lanja",
  "lanjakoduku",
]);

// Short phrases (multi-word) to block as-is after normalization.
const BANNED_PHRASES: string[] = [
  "fuck you",
  "fuck your",
  "fuck off",
  "son of a bitch",
  "go to hell",
  "kill yourself",
];

/**
 * Normalize: lowercase, collapse whitespace, strip punctuation, and
 * convert the most common leetspeak substitutions.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[4]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type ProfanityResult = {
  blocked: boolean;
  reason?: string;
};

export function checkProfanity(text: string): ProfanityResult {
  const norm = normalize(text);
  if (!norm) return { blocked: false };

  for (const phrase of BANNED_PHRASES) {
    if (norm.includes(phrase)) {
      return { blocked: true, reason: `banned phrase: ${phrase}` };
    }
  }

  for (const token of norm.split(" ")) {
    if (BANNED_WORDS.has(token)) {
      return { blocked: true, reason: `banned word: ${token}` };
    }
  }

  return { blocked: false };
}
