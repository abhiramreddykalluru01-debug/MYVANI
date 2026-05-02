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
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-10">

      {/* Pain statement — above the card */}
      <div className="mb-6 w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999999] text-center">
          VANI
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black text-center leading-tight">
          You moved to a new city.<br />
          No one speaks your language.
        </h1>
        <p className="mt-3 text-sm text-[#555555] text-center leading-relaxed">
          Auto driver. Landlord. Doctor. Shopkeeper.<br />
          Every conversation feels like a wall.
        </p>
      </div>

      {/* 3 survival proof points */}
      <div className="mb-6 w-full max-w-sm flex flex-col gap-2">
        {[
          { icon: "⚡", text: "Say the right phrase in seconds — not after a 3-month course" },
          { icon: "🗣️", text: "Type anything. Hear it instantly in Kannada, Hindi or Telugu" },
          { icon: "🆘", text: "Emergency phrases always one tap away" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-3 rounded-xl border border-black bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
          >
            <span className="text-lg leading-none">{icon}</span>
            <p className="text-sm text-black leading-snug">{text}</p>
          </div>
        ))}
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm rounded-2xl border border-black bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.07)]">
        <p className="text-center text-sm font-semibold text-black">
          Start surviving in any city
        </p>
        <p className="mt-1 text-center text-xs text-[#888888]">
          Free to use · No course · Just phrases that work
        </p>
        {sp.error ? (
          <p className="mt-3 text-center text-sm text-red-600">
            Could not complete sign-in. Try again.
          </p>
        ) : null}
        <div className="mt-5">
          <GoogleSignInButton />
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-[#999999]">
        Built for India&apos;s migrants, travelers &amp; workers.
      </p>
    </div>
  );
}
