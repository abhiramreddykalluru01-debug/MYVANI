"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { setProfession } from "@/app/actions/profile";
import { PROFESSION_OPTIONS } from "@/lib/constants/professions";
import { ExpandablePhraseCard } from "./ExpandablePhraseCard";

type PhraseLite = {
  id: string;
  english_text: string;
  phonetic_text: string;
  has_audio: boolean;
};

type Props = {
  phrases: PhraseLite[];
  hasProfession: boolean;
  profession: string | null;
  favoritedIds?: string[];
};

export function ProfessionalPhrasesView({
  phrases,
  hasProfession,
  profession,
  favoritedIds = [],
}: Props) {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<"all" | "favorites">("all");
  const [pending, startTransition] = useTransition();
  const [picking, setPicking] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const favSet = useMemo(() => new Set(favoritedIds), [favoritedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return phrases.filter((p) => {
      if (chip === "favorites" && !favSet.has(p.id)) return false;
      if (!q) return true;
      return (
        p.english_text.toLowerCase().includes(q) ||
        p.phonetic_text.toLowerCase().includes(q)
      );
    });
  }, [phrases, query, chip, favSet]);

  const knownProfession =
    profession && (PROFESSION_OPTIONS as readonly string[]).includes(profession);

  const needsPicker =
    !hasProfession || !knownProfession || (knownProfession && phrases.length === 0);

  function choose(p: string) {
    setPicking(p);
    const fd = new FormData();
    fd.append("profession", p);
    startTransition(async () => {
      await setProfession(fd);
      setPicking(null);
    });
  }

  const hasFavorites = favSet.size > 0;

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Profession phrases
          </h1>
          {profession ? (
            <p className="mt-0.5 text-xs text-[#666666]">{profession}</p>
          ) : null}
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#666666] hover:text-black"
        >
          Back
        </Link>
      </div>

      {needsPicker ? (
        <div className="rounded-2xl border border-black bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
          <p className="text-sm font-semibold text-black">
            Pick your profession
          </p>
          <p className="mt-1 text-xs text-[#666666]">
            We&apos;ll show phrases tailored to your work.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROFESSION_OPTIONS.map((p) => {
              const active = profession === p;
              const busy = pending && picking === p;
              return (
                <button
                  key={p}
                  type="button"
                  disabled={pending}
                  onClick={() => choose(p)}
                  className={`rounded-full border border-black px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-60 ${
                    active
                      ? "bg-black text-white"
                      : "bg-[#F5F5F5] text-black hover:bg-white"
                  }`}
                >
                  {busy ? "Saving…" : p}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {!needsPicker ? (
        <>
          <div className="rounded-2xl border border-black bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phrases"
              className="w-full bg-transparent text-sm text-black placeholder:text-[#999999] outline-none"
            />
          </div>

          {hasFavorites ? (
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <button
                type="button"
                onClick={() => {
                  setChip("all");
                  setExpandedId(null);
                }}
                className={`whitespace-nowrap rounded-full border border-black px-3 py-1.5 text-xs font-medium transition-all ${
                  chip === "all"
                    ? "bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,0.14)]"
                    : "bg-white text-black hover:bg-[#F5F5F5]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setChip("favorites");
                  setExpandedId(null);
                }}
                className={`whitespace-nowrap rounded-full border border-black px-3 py-1.5 text-xs font-medium transition-all ${
                  chip === "favorites"
                    ? "bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,0.14)]"
                    : "bg-white text-black hover:bg-[#F5F5F5]"
                }`}
              >
                ★ Favorites
              </button>
            </div>
          ) : null}

          <ul className="flex flex-col gap-3">
            {filtered.map((p) => (
              <li key={p.id}>
                <ExpandablePhraseCard
                  phrase={p}
                  isExpanded={expandedId === p.id}
                  isFavorited={favSet.has(p.id)}
                  onToggle={() =>
                    setExpandedId((cur) => (cur === p.id ? null : p.id))
                  }
                />
              </li>
            ))}
          </ul>

          {filtered.length === 0 && chip === "favorites" ? (
            <p className="text-center text-sm text-[#666666]">
              No favorites yet. Star a phrase to save it here.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-[#666666]">
              No phrases match this search.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
