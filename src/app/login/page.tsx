import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
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
      profile.city,
    );

    redirect(onboardingComplete ? "/dashboard" : "/onboarding");
  }

  const sp = await searchParams;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-black bg-white p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#999999]">
          VANI
        </p>
        <h1 className="mt-3 text-center text-2xl font-semibold text-black">
          Start speaking instantly
        </h1>
        {sp.error ? (
          <p className="mt-3 text-center text-sm text-red-600">
            Could not complete sign-in. Try again.
          </p>
        ) : null}
        <div className="mt-8">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
