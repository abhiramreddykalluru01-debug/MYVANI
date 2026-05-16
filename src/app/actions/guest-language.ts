"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { GUEST_LANGUAGE_COOKIE } from "@/lib/constants/guest-language";
import {
  LANGUAGE_NAME_TO_CODE,
  resolveLanguageCode,
} from "@/lib/constants/languages";
import type { LanguageCode } from "@/types/db";

const VALID_CODES = new Set<LanguageCode>(
  Object.values(LANGUAGE_NAME_TO_CODE),
);

/**
 * Set the guest's preferred target-language code in a long-lived cookie.
 * Used when the visitor isn't signed in — so phrases/quick-help/practice
 * can still render in their language.
 */
export async function setGuestLanguage(formData: FormData): Promise<void> {
  const raw = String(formData.get("language") ?? "").trim();
  const code = resolveLanguageCode(raw);
  if (!VALID_CODES.has(code)) return;

  const cookieStore = await cookies();
  cookieStore.set(GUEST_LANGUAGE_COOKIE, code, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/dashboard");
  revalidatePath("/phrases");
  revalidatePath("/quick-help");
  revalidatePath("/practice");
}
