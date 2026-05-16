import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Ensure `public.users` has a row for the signed-in user.
 * Pass the same `supabase` instance used in `/auth/callback` after
 * `exchangeCodeForSession` so reads see the session cookies that were
 * written onto the redirect response.
 */
export async function ensureUserProfile(supabase?: SupabaseClient) {
  const client = supabase ?? (await createClient());
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { user: null as null };

  const { data: existing } = await client
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { user };

  const meta = user.user_metadata as Record<string, string | undefined>;
  const name =
    meta?.full_name ??
    meta?.name ??
    user.email?.split("@")[0] ??
    "User";

  await client.from("users").insert({
    id: user.id,
    email: user.email ?? "",
    name,
    language_from: "English",
    language_to: "Kannada",
    language_code: "kn",
    city: null,
    profession: null,
  });

  return { user };
}
