import { ProfileSummary } from "@/components/ProfileSummary";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let u: UserRow | null = null;
  if (user) {
    const { data: row } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    u = row as UserRow | null;
  }

  return (
    <ProfileSummary
      signedIn={Boolean(user)}
      initial={{
        name: u?.name ?? null,
        email: u?.email ?? user?.email ?? null,
        language_from: u?.language_from ?? null,
        language_to: u?.language_to ?? null,
        city: u?.city ?? null,
        profession: u?.profession ?? null,
      }}
    />
  );
}
