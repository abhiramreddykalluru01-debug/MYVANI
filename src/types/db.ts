// ── Languages ─────────────────────────────────────────────────────────────

export type LanguageCode = "kn" | "hi" | "ta" | "te" | "ml" | "en";

export type LanguageRow = {
  code: LanguageCode;
  name: string;
  native_name: string | null;
  is_active: boolean;
  sort_order: number;
};

// ── Categories ────────────────────────────────────────────────────────────

export type CategoryType = "general" | "professional" | "quick_help";

export type CategoryRow = {
  id: string;
  type: CategoryType;
  slug: string;
  title: string;
  profession_key: string | null;
  sort_order: number;
};

// ── Phrases (intent) + Translations ──────────────────────────────────────

export type AnswerMode = "normal" | "yes_no";

/** Language-agnostic phrase intent. */
export type PhraseRow = {
  id: string;
  category_id: string;
  english_text: string;
  answer_mode: AnswerMode;
  is_active: boolean;
  sort_order: number;
};

export type PhraseTranslationRow = {
  id: string;
  phrase_id: string;
  language_code: LanguageCode;
  phonetic_text: string;
  native_text: string;
  audio_url: string | null;
};

// ── Replies (intent) + Translations ──────────────────────────────────────

export type ReplyKind = "normal" | "yes" | "no";

/** Language-agnostic reply intent. */
export type ReplyRow = {
  id: string;
  phrase_id: string;
  english_text: string;
  reply_kind: ReplyKind;
  sort_order: number;
};

export type ReplyTranslationRow = {
  id: string;
  reply_id: string;
  language_code: LanguageCode;
  phonetic_text: string;
  native_text: string;
  audio_url: string | null;
};

// ── User-side state ──────────────────────────────────────────────────────

export type PhraseFavoriteRow = {
  user_id: string;
  phrase_id: string;
  created_at: string;
};

export type PhraseRecentRow = {
  user_id: string;
  phrase_id: string;
  last_used_at: string;
  use_count: number;
};

export type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  language_from: string;
  language_to: string;
  language_code: LanguageCode;
  city: string | null;
  profession: string | null;
};

export type FeedbackRow = {
  id: string;
  user_id: string | null;
  rating: number;
  message: string;
  contact: string | null;
  created_at: string;
};
