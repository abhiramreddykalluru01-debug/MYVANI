"use client";

import { setName as saveName, updateProfile } from "@/app/actions/profile";
import {
  LANGUAGE_OPTIONS,
  UPCOMING_LANGUAGE_OPTIONS,
} from "@/lib/constants/languages";
import { PROFESSION_OPTIONS } from "@/lib/constants/professions";
import { track } from "@/lib/analytics/client";
import { useEffect, useMemo, useState } from "react";

const ROLE_OPTIONS = PROFESSION_OPTIONS;
const CITY_OPTIONS = ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"] as const;
const STORAGE_KEY = "vani_onboarding";

type Step = 0 | 1 | 2 | 3 | 4;

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("Kannada");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return nativeLanguage.length > 0;
    if (step === 2) return targetLanguage.length > 0;
    if (step === 3) return city.trim().length > 0;
    // Profession is optional for launch; users can complete onboarding
    // even if none of the listed roles match them yet.
    return true;
  }, [city, name, nativeLanguage, role, step, targetLanguage]);

  useEffect(() => {
    track("onboarding_step_view", { step });
  }, [step]);

  const progress = ((step + 1) / 5) * 100;

  async function complete() {
    if (!canContinue || busy) return;
    setBusy(true);

    const data = {
      name: name.trim(),
      nativeLanguage,
      targetLanguage,
      city: city.trim(),
      profession: role,
    };

    track("onboarding_finish_attempt", {
      target_language: data.targetLanguage,
      profession: data.profession,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    try {
      // Profile update — runs server-side, does its own auth check + RLS,
      // and revalidates dashboard / phrases / quick-help / practice / type-say.
      const profileFd = new FormData();
      profileFd.append("language_from", data.nativeLanguage);
      profileFd.append("language_to", data.targetLanguage);
      profileFd.append("city", data.city);
      profileFd.append("profession", data.profession);
      await updateProfile(profileFd);

      const nameFd = new FormData();
      nameFd.append("name", data.name);
      await saveName(nameFd);

      track("onboarding_completed", {
        target_language: data.targetLanguage,
        profession: data.profession,
        city: data.city,
      });
    } finally {
      setBusy(false);
      // Hard reload (not router.push) so the entire client-side router cache
      // is cleared. This ensures phrases, quick-help, practice, type-say all
      // refetch with the new target language on the very next navigation.
      window.location.href = "/profile";
    }
  }

  return (
    <div className="mx-auto flex min-h-[72vh] w-full max-w-md flex-col justify-center">
      <div className="rounded-2xl border border-black bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-300 ease-out">
        <div className="mb-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E8E8E8]">
            <div
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-[#666666]">Step {step + 1} of 5</p>
        </div>

        {step === 0 ? (
          <StepBlock title="What should we call you?">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-black bg-[#F5F5F5] px-3 py-2.5 text-sm text-black placeholder:text-[#999999] outline-none"
            />
          </StepBlock>
        ) : null}

        {step === 1 ? (
          <StepBlock title="Your native language?">
            <OptionGrid
              options={LANGUAGE_OPTIONS}
              value={nativeLanguage}
              onSelect={setNativeLanguage}
            />
          </StepBlock>
        ) : null}

        {step === 2 ? (
          <StepBlock title="Which language do you want to speak?">
            <OptionGrid
              options={LANGUAGE_OPTIONS}
              value={targetLanguage}
              onSelect={setTargetLanguage}
              upcoming={UPCOMING_LANGUAGE_OPTIONS}
            />
          </StepBlock>
        ) : null}

        {step === 3 ? (
          <StepBlock title="Which city are you in?">
            <OptionGrid options={CITY_OPTIONS} value={city} onSelect={setCity} />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Or type city"
              className="mt-3 w-full rounded-xl border border-black bg-[#F5F5F5] px-3 py-2.5 text-sm text-black placeholder:text-[#999999] outline-none"
            />
          </StepBlock>
        ) : null}

        {step === 4 ? (
          <StepBlock title="What is your profession? (optional)">
            <OptionGrid options={ROLE_OPTIONS} value={role} onSelect={setRole} />
            <p className="mt-3 text-xs text-[#666666]">
              Don&apos;t see your profession? Skip for now - more professions are coming
              soon.
            </p>
          </StepBlock>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
            className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#F5F5F5]"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={!canContinue || busy}
              onClick={() => void complete()}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {busy ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="transition-all duration-300 ease-out">
      <h1 className="text-2xl font-semibold tracking-tight text-black">{title}</h1>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onSelect,
  upcoming = [],
}: {
  options: readonly string[];
  value: string;
  onSelect: (v: string) => void;
  upcoming?: readonly string[];
}) {
  const upcomingSet = new Set(upcoming);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        const isUpcoming = upcomingSet.has(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => {
              if (!isUpcoming) onSelect(opt);
            }}
            disabled={isUpcoming}
            className={`rounded-full border border-black px-3 py-1.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              active
                ? "bg-black text-white"
                : "bg-[#F5F5F5] text-black hover:bg-white"
            }`}
          >
            {opt}
            {isUpcoming ? " (Upcoming)" : ""}
          </button>
        );
      })}
    </div>
  );
}
