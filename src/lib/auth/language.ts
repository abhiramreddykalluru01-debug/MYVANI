import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANGUAGE_CODE,
  resolveLanguageCode,
} from "@/lib/constants/languages";
import { GUEST_LANGUAGE_COOKIE } from "@/lib/constants/guest-language";
import type { LanguageCode, UserRow } from "@/types/db";

/**
 * Resolve the language code (`kn`, `hi`, ...) for the current request.
 *
 * Order of precedence:
 *   1. Logged-in user's `users.language_code` (set by the i18n migration)
 *   2. Logged-in user's `users.language_to` label (legacy rows)
 *   3. Guest's `vani_guest_lang` cookie (set via the dashboard picker)
 *   4. Project default.
 */
export async function getCurrentLanguageCode(): Promise<LanguageCode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get(GUEST_LANGUAGE_COOKIE)?.value;
    if (cookieLang) return resolveLanguageCode(cookieLang);
    return DEFAULT_LANGUAGE_CODE;
  }

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
