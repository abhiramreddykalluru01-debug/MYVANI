"use client";

import { useState } from "react";
import { PhraseBottomSheet } from "./PhraseBottomSheet";

type PhraseMini = {
  id: string;
  english_text: string;
  phonetic_text: string;
};

export function DashboardPhraseCards({ phrases }: { phrases: PhraseMini[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      {selectedId ? (
        <PhraseBottomSheet
          phraseId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      ) : null}

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {phrases.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className="flex-shrink-0 w-44 text-left rounded-2xl border border-black bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all hover:bg-[#F5F5F5] active:scale-[0.98]"
          >
            <p className="text-[10px] uppercase tracking-wide text-[#999999] truncate">
              {p.english_text}
            </p>
            <p className="mt-1 text-lg font-semibold leading-tight text-black line-clamp-2">
              {p.phonetic_text}
            </p>
            <p className="mt-2 text-[10px] font-medium text-[#888888]">
              Tap for replies &amp; audio
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
