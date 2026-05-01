"use server";

import {
  addPhraseFavorite,
  addPhraseRecent,
  isPhraseFavorited,
  removePhraseFavorite,
} from "@/lib/data/phrases";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/ratelimit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function toggleFavorite(formData: FormData): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const phraseId = String(formData.get("phrase_id") ?? "").trim();
  if (!UUID_RE.test(phraseId)) return { ok: false };

  // Per-user write throttle so a runaway client can't hammer the DB.
  const rl = await rateLimit({
    key: `favorite:${user.id}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!rl.ok) return { ok: false };

  const liked = await isPhraseFavorited(user.id, phraseId);
  if (liked) await removePhraseFavorite(user.id, phraseId);
  else await addPhraseFavorite(user.id, phraseId);

  revalidatePath("/dashboard");
  revalidatePath("/phrases");
  revalidatePath(`/phrases/${phraseId}`);
  revalidatePath("/quick-help");
  return { ok: true };
}

export async function markPhraseRecent(formData: FormData): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const phraseId = String(formData.get("phrase_id") ?? "").trim();
  if (!UUID_RE.test(phraseId)) return { ok: false };

  const rl = await rateLimit({
    key: `recent:${user.id}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!rl.ok) return { ok: false };

  await addPhraseRecent(user.id, phraseId);
  revalidatePath("/dashboard");
  return { ok: true };
}
