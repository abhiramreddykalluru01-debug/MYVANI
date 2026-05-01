"use server";

import { createClient } from "@/lib/supabase/server";
import {
  LANGUAGE_OPTIONS,
  resolveLanguageCode,
} from "@/lib/constants/languages";
import { PROFESSION_OPTIONS } from "@/lib/constants/professions";
import { revalidatePath } from "next/cache";

function isLanguage(v: string): boolean {
  return (LANGUAGE_OPTIONS as readonly string[]).includes(v);
}

function isProfession(v: string): boolean {
  return (PROFESSION_OPTIONS as readonly string[]).includes(v);
}

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const languageFrom = String(formData.get("language_from") ?? "");
  const languageTo = String(formData.get("language_to") ?? "");
  const city = String(formData.get("city") ?? "").trim() || null;
  const profession = String(formData.get("profession") ?? "").trim();

  if (!isLanguage(languageFrom) || !isLanguage(languageTo)) return;

  const professionValue =
    profession && isProfession(profession) ? profession : null;

  const { error } = await supabase
    .from("users")
    .update({
      language_from: languageFrom,
      language_to: languageTo,
      language_code: resolveLanguageCode(languageTo),
      city: city,
      profession: professionValue,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return;

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/phrases");
  revalidatePath("/quick-help");
  revalidatePath("/practice");
  revalidatePath("/type-say");
}

/** Quick-set just the user's display name (used by onboarding). */
export async function setName(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const raw = String(formData.get("name") ?? "").trim();
  if (!raw) return;

  // Sanitize: collapse whitespace, cap length, drop control chars.
  const name = raw.replace(/\s+/g, " ").replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 80);
  if (!name) return;

  const { error } = await supabase
    .from("users")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) return;

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

/** Quick-set just the profession (used by the inline picker on the phrases page). */
export async function setProfession(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const profession = String(formData.get("profession") ?? "").trim();
  if (!isProfession(profession)) return;

  const { error } = await supabase
    .from("users")
    .update({
      profession,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return;

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/phrases");
  revalidatePath("/quick-help");
  revalidatePath("/practice");
  revalidatePath("/type-say");
}
