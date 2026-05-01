import { createClient } from "@/lib/supabase/server";

export async function ensureUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null as null };

  const { data: existing } = await supabase
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

  await supabase.from("users").insert({
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
