"use client";

import { useState } from "react";
import { PracticeMoments } from "./PracticeMoments";
import { PatternLab } from "./PatternLab";
import type { LanguageCode } from "@/types/db";
import type { PracticeLanguageCode } from "@/lib/data/moments";

type Tab = "moments" | "patterns";

export function PracticeHub({
  learningLanguageCode,
  practiceLanguageCode,
}: {
  learningLanguageCode: LanguageCode;
  practiceLanguageCode: PracticeLanguageCode;
}) {
  const [tab, setTab] = useState<Tab>("moments");

  const practiceMismatch =
    learningLanguageCode === "ta" || learningLanguageCode === "ml";

  return (
    <div className="flex flex-col gap-5">
      {practiceMismatch ? (
        <div className="rounded-2xl border border-black bg-[#FFF8E1] px-4 py-3 text-sm text-black">
          <p className="font-semibold">Practice mode</p>
          <p className="mt-1 text-xs leading-relaxed text-[#555555]">
            You are learning{" "}
            <span className="font-medium text-black">
              {learningLanguageCode === "ta" ? "Tamil" : "Malayalam"}
            </span>
            . Moments &amp; patterns here are still built for{" "}
            <span className="font-medium text-black">Kannada</span>,{" "}
            <span className="font-medium text-black">Hindi</span>, and{" "}
            <span className="font-medium text-black">Telugu</span> only — full
            Tamil &amp; Malayalam practice is coming soon. Phrases &amp; Quick
            Help already follow your language above.
          </p>
        </div>
      ) : null}

      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-black bg-[#F5F5F5] p-1">
        <TabButton
          active={tab === "moments"}
          onClick={() => setTab("moments")}
          label="Moments"
          subLabel="Real situations"
        />
        <TabButton
          active={tab === "patterns"}
          onClick={() => setTab("patterns")}
          label="Patterns"
          subLabel="Build sentences"
        />
      </div>

      {/* Active panel */}
      {tab === "moments" ? (
        <PracticeMoments languageCode={practiceLanguageCode} />
      ) : (
        <PatternLab languageCode={practiceLanguageCode} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  subLabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  subLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center rounded-xl px-3 py-2 transition-all duration-200 ${
        active
          ? "bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
          : "text-[#444444] hover:bg-white"
      }`}
    >
      <span
        className={`text-sm font-semibold ${active ? "text-white" : "text-black"}`}
      >
        {label}
      </span>
      <span
        className={`text-[10px] ${active ? "text-white/70" : "text-[#888888]"}`}
      >
        {subLabel}
      </span>
    </button>
  );
}
