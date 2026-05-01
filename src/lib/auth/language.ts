import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANGUAGE_CODE,
  resolveLanguageCode,
} from "@/lib/constants/languages";
import type { LanguageCode, UserRow } from "@/types/db";

/**
 * Resolve the language code (`kn`, `hi`, ...) for the current request.
 *
 * Prefers `users.language_code` (set by the i18n migration).
 * Falls back to deriving from `users.language_to` (label) for legacy rows.
 * Returns the default if no user / no row.
 */
export async function getCurrentLanguageCode(): Promise<LanguageCode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEFAULT_LANGUAGE_CODE;

  const { data } = await supabase
    .from("users")
    .select("language_code, language_to")
    .eq("id", user.id)
    .maybeSingle();

  const row = data as
    | Pick<UserRow, "language_code" | "language_to">
    | null
    | undefined;

  if (row?.language_code) {
    return resolveLanguageCode(row.language_code);
  }
  if (row?.language_to) {
    return resolveLanguageCode(row.language_to);
  }
  return DEFAULT_LANGUAGE_CODE;
}
