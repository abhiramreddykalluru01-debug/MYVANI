"use client";

import { useState } from "react";
import { PracticeMoments } from "./PracticeMoments";
import { PatternLab } from "./PatternLab";
import type { PracticeLanguageCode } from "@/lib/data/moments";

type Tab = "moments" | "patterns";

export function PracticeHub({ languageCode }: { languageCode: PracticeLanguageCode }) {
  const [tab, setTab] = useState<Tab>("moments");

  return (
    <div className="flex flex-col gap-5">
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
        <PracticeMoments languageCode={languageCode} />
      ) : (
        <PatternLab languageCode={languageCode} />
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
