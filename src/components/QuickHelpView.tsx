"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ExpandablePhraseCard } from "./ExpandablePhraseCard";

type PhraseLite = {
  id: string;
  english_text: string;
  phonetic_text: string;
  category_slug: string;
  has_audio: boolean;
};

type CategoryLite = {
  id: string;
  slug: string;
  title: string;
};

type Props = {
  categories: CategoryLite[];
  phrases: PhraseLite[];
  favoritedIds?: string[];
};

export function QuickHelpView({ categories, phrases, favoritedIds = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const favSet = useMemo(() => new Set(favoritedIds), [favoritedIds]);

  const slugSet = useMemo(
    () => new Set(categories.map((c) => c.slug)),
    [categories],
  );

  const initialChip = (() => {
    const fromUrl = searchParams.get("cat");
    if (fromUrl && slugSet.has(fromUrl)) return fromUrl;
    return categories[0]?.slug ?? "";
  })();

  const [chip, setChip] = useState<string>(initialChip);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setChipAndUrl = useCallback(
    (next: string) => {
      setChip(next);
      setExpandedId(null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("cat", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === chip) ?? categories[0] ?? null,
    [categories, chip],
  );

  const visible = useMemo(
    () => phrases.filter((p) => p.category_slug === (activeCategory?.slug ?? "")),
    [phrases, activeCategory],
  );

  const emergencyPhrases = useMemo(
    () => phrases.filter((p) => p.category_slug === "emergency").slice(0, 3),
    [phrases],
  );

  return (
    <div className="flex flex-col gap-5 pb-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
          Quick Help
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Help &amp; emergency only
        </h1>
        <p className="mt-1 text-sm text-[#888888]">
          Tap any phrase to hear the audio.
        </p>
      </header>

      {/* Emergency quick actions — always visible at top */}
      {emergencyPhrases.length > 0 ? (
        <div className="rounded-2xl border border-[#ff1744] bg-[#fff5f5] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc0000]">
            Emergency
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {emergencyPhrases.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  // Switch to emergency category and expand the phrase
                  if (chip !== "emergency") setChipAndUrl("emergency");
                  setExpandedId(p.id);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[#ff1744] bg-white px-3 py-2.5 text-left transition-all hover:bg-[#fff0f0] active:scale-[0.99]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#999999]">
                    {p.english_text}
                  </p>
                  <p className="text-base font-semibold text-black">
                    {p.phonetic_text}
                  </p>
                </div>
                <span className="ml-2 text-[#ff1744]">→</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((cat) => {
          const selected = activeCategory?.slug === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setChipAndUrl(cat.slug)}
              className={`whitespace-nowrap rounded-full border border-black px-3 py-1.5 text-xs font-medium transition-colors ${
                selected
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#F5F5F5]"
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col gap-3">
        {visible.map((p, index) => (
          <li key={p.id}>
            <ExpandablePhraseCard
              phrase={p}
              isExpanded={expandedId === p.id}
              isFavorited={favSet.has(p.id)}
              prefetchRank={index < 12 ? index : null}
              onToggle={() =>
                setExpandedId((cur) => (cur === p.id ? null : p.id))
              }
            />
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="text-center text-sm text-[#666666]">
          No phrases in this category yet.
        </p>
      ) : null}
    </div>
  );
}
