"use client";

import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vani_onboarding";

type ProfileData = {
  name: string | null;
  email: string | null;
  language_from: string | null;
  language_to: string | null;
  city: string | null;
  profession: string | null;
};

export function ProfileSummary({
  initial,
  signedIn,
}: {
  initial: ProfileData;
  signedIn: boolean;
}) {
  // Read localStorage AFTER mount to avoid SSR/CSR hydration mismatch.
  const [local, setLocal] = useState<Partial<ProfileData> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        name?: string;
        nativeLanguage?: string;
        targetLanguage?: string;
        city?: string;
        profession?: string;
      };
      // Intentional: reading localStorage on mount to avoid SSR/CSR hydration
      // mismatch is a legitimate one-shot setState in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal({
        name: parsed.name ?? null,
        language_from: parsed.nativeLanguage ?? null,
        language_to: parsed.targetLanguage ?? null,
        city: parsed.city ?? null,
        profession: parsed.profession ?? null,
      });
    } catch {
      /* ignore */
    }
  }, []);

  // Server (initial) always wins when it has a value — localStorage is only
  // used as fallback for fields the DB hasn't saved yet (e.g. mid-onboarding).
  const view = useMemo(
    () => ({
      name: initial.name ?? local?.name ?? null,
      email: initial.email,
      language_from: initial.language_from ?? local?.language_from ?? null,
      language_to: initial.language_to ?? local?.language_to ?? null,
      city: initial.city ?? local?.city ?? null,
      profession: initial.profession ?? local?.profession ?? null,
    }),
    [initial, local],
  );

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Profile</h1>
        <Link
          href="/onboarding"
          className="rounded-lg border border-black bg-[#F5F5F5] px-3 py-1.5 text-xs font-medium text-black hover:bg-black hover:text-white"
        >
          Edit
        </Link>
      </div>

      <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <Field label="Name" value={view.name} />
        <Field label="Native language" value={view.language_from} />
        <Field label="Target language" value={view.language_to} />
        <Field label="City" value={view.city} />
        <Field label="Role" value={view.profession} />
        <Field label="Email" value={view.email} />
      </div>

      {!view.name ? (
        <Link
          href="/onboarding"
          className="rounded-xl border border-black bg-black px-4 py-3 text-center text-sm font-medium text-white"
        >
          Start onboarding
        </Link>
      ) : null}

      <Link
        href="/feedback"
        className="rounded-xl border border-black bg-white px-4 py-3 text-center text-sm font-medium text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#F5F5F5]"
      >
        Share feedback
      </Link>

      {signedIn ? (
        <SignOutButton />
      ) : (
        <Link
          href="/login"
          className="rounded-xl border border-black bg-black px-4 py-3 text-center text-sm font-medium text-white"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-b border-[#EAEAEA] py-2 last:border-b-0">
      <p className="text-xs uppercase tracking-wide text-[#999999]">{label}</p>
      <p className="mt-1 text-base font-medium text-black">{value || "—"}</p>
    </div>
  );
}
