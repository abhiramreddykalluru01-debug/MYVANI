import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";
import Link from "next/link";
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
    <div className="flex min-h-full flex-col bg-[#F5F5F5]">

      {/* Top section — stark white card with bold editorial headline */}
      <div className="mx-4 mt-10 rounded-3xl bg-black px-6 pt-10 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* tiny label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
          Survival · Language · India
        </p>

        {/* Big statement */}
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-white">
          New city.<br />Wrong language.<br />
          <span className="text-white/40">Now what?</span>
        </h1>

        {/* Ticker strip */}
        <div className="mt-6 flex gap-2 overflow-hidden">
          {["Auto driver", "Landlord", "Doctor", "Police", "Shopkeeper"].map((w) => (
            <span
              key={w}
              className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/50"
            >
              {w}
            </span>
          ))}
        </div>

        {/* Answer line */}
        <p className="mt-5 text-sm leading-relaxed text-white/60">
          VANI gives you the exact phrase you need — right now. No lessons. No apps to learn. Just speak.
        </p>
      </div>

      {/* 3 feature rows — floating white pills */}
      <div className="mx-4 mt-4 flex flex-col gap-3">
        {[
          { num: "01", title: "Phrases for every situation", desc: "Work · Emergency · Daily life" },
          { num: "02", title: "Type anything, hear it spoken", desc: "Powered by AI · In seconds" },
          { num: "03", title: "Emergency help, one tap", desc: "Police · Hospital · SOS" },
        ].map(({ num, title, desc }) => (
          <div
            key={num}
            className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <span className="text-[11px] font-bold text-[#CCCCCC]">{num}</span>
            <div className="h-8 w-px bg-[#EBEBEB]" />
            <div>
              <p className="text-sm font-semibold text-black">{title}</p>
              <p className="text-[11px] text-[#AAAAAA]">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mx-4 mt-5 rounded-3xl bg-white px-6 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-base font-semibold text-black">
          Start speaking today
        </p>
        <p className="mt-0.5 text-xs text-[#AAAAAA]">
          Free · Kannada · Hindi · Telugu
        </p>
        {sp.error ? (
          <p className="mt-3 text-sm text-red-600">
            Could not complete sign-in. Try again.
          </p>
        ) : null}
        <div className="mt-4">
          <GoogleSignInButton />
        </div>
        <p className="mt-3 text-center text-[11px] text-[#9A9A9A]">
          Secure sign-in powered by Supabase + Google.
        </p>
        <p className="mt-2 text-center text-[11px] text-[#9A9A9A]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <p className="mt-5 pb-8 text-center text-[11px] text-[#BBBBBB]">
        Built for India&apos;s migrants, travelers &amp; workers.
      </p>

    </div>
  );
}
