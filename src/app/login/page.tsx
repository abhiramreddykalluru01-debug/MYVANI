import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { InstallAppPrompt } from "@/components/InstallAppPrompt";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";
import Link from "next/link";
import { redirect } from "next/navigation";

const NEXT_REASONS: Record<string, { title: string; body: string }> = {
  "/type-say": {
    title: "Sign in to use Type & Say",
    body: "Type any English sentence — we'll translate it and speak it for you.",
  },
  "/situation": {
    title: "Sign in to read Situations",
    body: "Real conversations — auto, hospital, bus, kirana and more in Kannada and Hindi.",
  },
  "/profile": {
    title: "Sign in to view your profile",
    body: "Save your language, city and profession across devices.",
  },
  "/feedback": {
    title: "Sign in to share feedback",
    body: "We use your account to follow up if needed.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
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
  const reason = sp.next ? NEXT_REASONS[sp.next] : null;

  return (
    <div className="flex min-h-full flex-col bg-[#F5F5F5]">

      {/* Top section — stark white card with bold editorial headline */}
      <div className="mx-4 mt-10 rounded-3xl bg-black px-6 pt-10 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
          MyVani
        </p>
        {/* tiny label */}
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
          Survival · Language · India
        </p>

        {/* Big statement */}
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-white">
          New place.<br />New people.<br />
          <span className="text-white">New language.</span>
          <br />
          <span className="text-white/75">Speak with confidence.</span>
        </h1>

        {/* Ticker strip */}
        <div className="mt-6 flex gap-2 overflow-hidden">
          {["Auto", "Landlord", "Doctor", "Shopkeeper", "Police", "Nurse"].map((w) => (
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
          Moved to Bengaluru, Delhi or Mumbai? Get the exact phrase you need — in Kannada, Hindi or Telugu. No lessons. No fluff. Just speak.
        </p>
      </div>

      {/* Social proof — three real stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { value: "Free", label: "Always" },
          { value: "6+", label: "Situations" },
          { value: "2", label: "Languages" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-2xl bg-white px-3 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <p className="text-2xl font-semibold tracking-tight text-black">
              {value}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#999999]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mx-4 mt-5 rounded-3xl bg-white px-6 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-base font-semibold text-black">
          {reason ? reason.title : "Start speaking today"}
        </p>
        <p className="mt-0.5 text-xs text-[#AAAAAA]">
          {reason ? reason.body : "Free · Kannada · Hindi · Telugu"}
        </p>
        {sp.error ? (
          <p className="mt-3 text-sm text-red-600">
            Could not complete sign-in. Try again.
          </p>
        ) : null}
        <div className="mt-4">
          <GoogleSignInButton />
          <p className="mt-2 text-center text-[11px] text-[#AAAAAA]">
            Next screen is Google — just pick your account.
          </p>
        </div>
        <Link
          href="/phrases"
          className="mt-3 block w-full rounded-xl border border-black bg-white px-4 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
        >
          Try without login →
        </Link>
        <InstallAppPrompt />
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
        Built for migrants, workers &amp; travelers in India.
      </p>

    </div>
  );
}
