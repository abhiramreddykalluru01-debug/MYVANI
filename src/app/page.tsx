import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: row } = await supabase
    .from("users")
    .select("name, language_from, language_to, city, profession")
    .eq("id", user.id)
    .maybeSingle();

  const profile = row as Pick<
    UserRow,
    "name" | "language_from" | "language_to" | "city" | "profession"
  > | null;

  const onboardingComplete = Boolean(
    profile?.name &&
      profile.language_from &&
      profile.language_to &&
      profile.city &&
      profile.profession,
  );

  if (!onboardingComplete) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
