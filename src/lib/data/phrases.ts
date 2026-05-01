import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/constants/languages";
import type {
  AnswerMode,
  CategoryRow,
  CategoryType,
  LanguageCode,
  PhraseFavoriteRow,
  PhraseRecentRow,
  ReplyKind,
} from "@/types/db";

// ── Public shapes (UI-friendly, language already merged in) ──────────────

export type LocalizedPhrase = {
  id: string;
  category_id: string;
  english_text: string;
  phonetic_text: string;
  native_text: string;
  audio_url: string | null;
  answer_mode: AnswerMode;
  is_active: boolean;
  sort_order: number;
};

export type LocalizedReply = {
  id: string;
  phrase_id: string;
  english_text: string;
  phonetic_text: string;
  native_text: string;
  audio_url: string | null;
  reply_kind: ReplyKind;
  sort_order: number;
};

export type PhraseWithCategory = LocalizedPhrase & { category: CategoryRow };
export type PhraseWithReplies = PhraseWithCategory & {
  replies: LocalizedReply[];
};

// ── Internal raw shapes (rows as Supabase returns them) ──────────────────

type RawTranslation = {
  phonetic_text: string;
  native_text: string;
  audio_url: string | null;
  language_code: LanguageCode;
};

type RawPhrase = {
  id: string;
  category_id: string;
  english_text: string;
  answer_mode: AnswerMode;
  is_active: boolean;
  sort_order: number;
  category?: CategoryRow;
  translations?: RawTranslation[];
  replies?: RawReply[];
};

type RawReply = {
  id: string;
  phrase_id: string;
  english_text: string;
  reply_kind: ReplyKind;
  sort_order: number;
  translations?: RawTranslation[];
};

/**
 * Pick the best translation for a target language with a graceful fallback.
 * If the requested language has no translation we use English text as the
 * phonetic/native fallback so the phrase never disappears from the UI.
 */
function pickTranslation(
  translations: RawTranslation[] | undefined,
  lang: LanguageCode,
  englishText: string,
): { phonetic_text: string; native_text: string; audio_url: string | null } {
  const target = translations?.find((t) => t.language_code === lang);
  if (target) {
    return {
      phonetic_text: target.phonetic_text || englishText,
      native_text: target.native_text || englishText,
      audio_url: target.audio_url ?? null,
    };
  }
  // last-resort fallback so the phrase stays visible (no audio).
  return {
    phonetic_text: englishText,
    native_text: englishText,
    audio_url: null,
  };
}

function localizePhrase(
  raw: RawPhrase,
  lang: LanguageCode,
): PhraseWithCategory | null {
  if (!raw.category) return null;
  return {
    id: raw.id,
    category_id: raw.category_id,
    english_text: raw.english_text,
    answer_mode: raw.answer_mode,
    is_active: raw.is_active,
    sort_order: raw.sort_order,
    category: raw.category,
    ...pickTranslation(raw.translations, lang, raw.english_text),
  };
}

function localizeReply(raw: RawReply, lang: LanguageCode): LocalizedReply {
  return {
    id: raw.id,
    phrase_id: raw.phrase_id,
    english_text: raw.english_text,
    reply_kind: raw.reply_kind,
    sort_order: raw.sort_order,
    ...pickTranslation(raw.translations, lang, raw.english_text),
  };
}

// ── Categories ───────────────────────────────────────────────────────────

export async function listCategoriesByType(
  type: CategoryType,
  opts: { professionKey?: string | null } = {},
): Promise<CategoryRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });

  if (type === "professional" && opts.professionKey) {
    query = query.eq("profession_key", opts.professionKey);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as CategoryRow[];
}

// ── Phrases (list) ───────────────────────────────────────────────────────

// NOTE: translations is intentionally NOT `!inner` — when the user's language
// has no translation row for a phrase we still want the phrase to appear with
// an English fallback. Same for reply_translations.
const PHRASE_SELECT = `
  id, category_id, english_text, answer_mode, is_active, sort_order,
  category:categories!inner(*),
  translations:phrase_translations(phonetic_text, native_text, audio_url, language_code)
`;

const PHRASE_WITH_REPLIES_SELECT = `
  id, category_id, english_text, answer_mode, is_active, sort_order,
  category:categories!inner(*),
  translations:phrase_translations(phonetic_text, native_text, audio_url, language_code),
  replies(id, phrase_id, english_text, reply_kind, sort_order,
    translations:reply_translations(phonetic_text, native_text, audio_url, language_code)
  )
`;

export async function listPhrasesByType(
  type: CategoryType,
  opts: {
    professionKey?: string | null;
    languageCode?: LanguageCode;
  } = {},
): Promise<PhraseWithCategory[]> {
  const supabase = await createClient();
  const lang = opts.languageCode ?? DEFAULT_LANGUAGE_CODE;

  let query = supabase
    .from("phrases")
    .select(PHRASE_SELECT)
    .eq("is_active", true)
    .eq("category.type", type)
    // Filter the embedded translations to the user's language only (the row
    // itself stays visible even if no translation exists).
    .eq("translations.language_code", lang)
    .order("sort_order", { ascending: true });

  if (type === "professional" && opts.professionKey) {
    query = query.eq("category.profession_key", opts.professionKey);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as unknown as RawPhrase[])
    .map((r) => localizePhrase(r, lang))
    .filter((p): p is PhraseWithCategory => p !== null);
}

// ── Phrase by id ─────────────────────────────────────────────────────────

export async function getPhraseById(
  id: string,
  opts: { languageCode?: LanguageCode } = {},
): Promise<PhraseWithReplies | null> {
  const supabase = await createClient();
  const lang = opts.languageCode ?? DEFAULT_LANGUAGE_CODE;

  const { data, error } = await supabase
    .from("phrases")
    .select(PHRASE_WITH_REPLIES_SELECT)
    .eq("id", id)
    .eq("is_active", true)
    .eq("translations.language_code", lang)
    .eq("replies.translations.language_code", lang)
    .maybeSingle();

  if (error || !data) return null;

  const raw = data as unknown as RawPhrase;
  const base = localizePhrase(raw, lang);
  if (!base) return null;

  const replies = (raw.replies ?? [])
    .map((r) => localizeReply(r, lang))
    .sort((a, b) => a.sort_order - b.sort_order);

  return { ...base, replies };
}

// ── Practice (general + profession phrases with replies) ─────────────────

export async function listPracticePhrases(
  professionKey: string | null,
  opts: { languageCode?: LanguageCode } = {},
): Promise<PhraseWithReplies[]> {
  const supabase = await createClient();
  const lang = opts.languageCode ?? DEFAULT_LANGUAGE_CODE;

  const general = await supabase
    .from("phrases")
    .select(PHRASE_WITH_REPLIES_SELECT)
    .eq("is_active", true)
    .eq("category.type", "general")
    .eq("translations.language_code", lang)
    .eq("replies.translations.language_code", lang)
    .order("sort_order", { ascending: true });

  const rows: PhraseWithReplies[] = [];

  for (const raw of (general.data ?? []) as unknown as RawPhrase[]) {
    const base = localizePhrase(raw, lang);
    if (!base) continue;
    const replies = (raw.replies ?? [])
      .map((r) => localizeReply(r, lang))
      .sort((a, b) => a.sort_order - b.sort_order);
    rows.push({ ...base, replies });
  }

  if (professionKey) {
    const prof = await supabase
      .from("phrases")
      .select(PHRASE_WITH_REPLIES_SELECT)
      .eq("is_active", true)
      .eq("category.type", "professional")
      .eq("category.profession_key", professionKey)
      .eq("translations.language_code", lang)
      .eq("replies.translations.language_code", lang)
      .order("sort_order", { ascending: true });

    for (const raw of (prof.data ?? []) as unknown as RawPhrase[]) {
      const base = localizePhrase(raw, lang);
      if (!base) continue;
      const replies = (raw.replies ?? [])
        .map((r) => localizeReply(r, lang))
        .sort((a, b) => a.sort_order - b.sort_order);
      rows.push({ ...base, replies });
    }
  }

  return rows;
}

// ── Favorites ────────────────────────────────────────────────────────────

export async function listFavoritePhraseIds(
  userId: string,
): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("phrase_favorites")
    .select("phrase_id")
    .eq("user_id", userId);
  if (error) return new Set();
  return new Set((data ?? []).map((r) => r.phrase_id));
}

export async function isPhraseFavorited(
  userId: string,
  phraseId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("phrase_favorites")
    .select("phrase_id")
    .eq("user_id", userId)
    .eq("phrase_id", phraseId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export async function listFavoritePhrases(
  userId: string,
  opts: { limit?: number; languageCode?: LanguageCode } = {},
): Promise<PhraseWithCategory[]> {
  const supabase = await createClient();
  const lang = opts.languageCode ?? DEFAULT_LANGUAGE_CODE;
  const limit = opts.limit ?? 12;

  const { data, error } = await supabase
    .from("phrase_favorites")
    .select(
      `created_at,
       phrase:phrases!inner(
         id, category_id, english_text, answer_mode, is_active, sort_order,
         category:categories!inner(*),
         translations:phrase_translations(phonetic_text, native_text, audio_url, language_code)
       )`,
    )
    .eq("user_id", userId)
    .eq("phrase.is_active", true)
    .eq("phrase.translations.language_code", lang)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data
    .map((r) => {
      const raw = (r as unknown as { phrase: RawPhrase | null }).phrase;
      if (!raw) return null;
      return localizePhrase(raw, lang);
    })
    .filter((p): p is PhraseWithCategory => p !== null);
}

export async function listRecentPhrases(
  userId: string,
  opts: { limit?: number; languageCode?: LanguageCode } = {},
): Promise<
  Array<PhraseWithCategory & { last_used_at: string; use_count: number }>
> {
  const supabase = await createClient();
  const lang = opts.languageCode ?? DEFAULT_LANGUAGE_CODE;
  const limit = opts.limit ?? 12;

  const { data, error } = await supabase
    .from("phrase_recents")
    .select(
      `last_used_at, use_count,
       phrase:phrases!inner(
         id, category_id, english_text, answer_mode, is_active, sort_order,
         category:categories!inner(*),
         translations:phrase_translations(phonetic_text, native_text, audio_url, language_code)
       )`,
    )
    .eq("user_id", userId)
    .eq("phrase.is_active", true)
    .eq("phrase.translations.language_code", lang)
    .order("last_used_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data
    .map((r) => {
      const row = r as unknown as {
        last_used_at: string;
        use_count: number;
        phrase: RawPhrase | null;
      };
      if (!row.phrase) return null;
      const localized = localizePhrase(row.phrase, lang);
      if (!localized) return null;
      return {
        ...localized,
        last_used_at: row.last_used_at,
        use_count: row.use_count,
      };
    })
    .filter(
      (
        v,
      ): v is PhraseWithCategory & {
        last_used_at: string;
        use_count: number;
      } => v !== null,
    );
}

export async function addPhraseRecent(
  userId: string,
  phraseId: string,
): Promise<void> {
  const supabase = await createClient();
  // Atomic via Postgres RPC: avoids the read-then-write race that loses
  // increments under concurrent taps. Falls back to non-atomic upsert if the
  // RPC isn't deployed yet (so existing installs keep working).
  const { error } = await supabase.rpc("bump_phrase_recent", {
    p_phrase_id: phraseId,
  });
  if (!error) return;

  // Fallback path (only triggered before the migration is run).
  const { data } = await supabase
    .from("phrase_recents")
    .select("use_count")
    .eq("user_id", userId)
    .eq("phrase_id", phraseId)
    .maybeSingle();
  const current =
    (data as Pick<PhraseRecentRow, "use_count"> | null)?.use_count ?? 0;
  await supabase.from("phrase_recents").upsert({
    user_id: userId,
    phrase_id: phraseId,
    use_count: current > 0 ? current + 1 : 1,
    last_used_at: new Date().toISOString(),
  } satisfies PhraseRecentRow);
}

export async function addPhraseFavorite(
  userId: string,
  phraseId: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("phrase_favorites").insert({
    user_id: userId,
    phrase_id: phraseId,
    created_at: new Date().toISOString(),
  } satisfies PhraseFavoriteRow);
}

export async function removePhraseFavorite(
  userId: string,
  phraseId: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("phrase_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("phrase_id", phraseId);
}
