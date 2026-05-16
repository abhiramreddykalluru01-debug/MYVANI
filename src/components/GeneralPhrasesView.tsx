"use client";

import Link from "next/link";
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

export function GeneralPhrasesView({ categories, phrases, favoritedIds = [] }: Props) {
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
    if (fromUrl === "favorites") return "favorites";
    return fromUrl && slugSet.has(fromUrl) ? fromUrl : "all";
  })();

  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<string>(initialChip);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setChipAndUrl = useCallback(
    (next: string) => {
      setChip(next);
      setExpandedId(null);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("cat");
      else params.set("cat", next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return phrases.filter((p) => {
      if (chip === "favorites") {
        if (!favSet.has(p.id)) return false;
      } else {
        const inChip = chip === "all" ? true : p.category_slug === chip;
        if (!inChip) return false;
      }
      if (!q) return true;
      return (
        p.english_text.toLowerCase().includes(q) ||
        p.phonetic_text.toLowerCase().includes(q)
      );
    });
  }, [phrases, query, chip, favSet]);

  const hasFavorites = favSet.size > 0;

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-black">General phrases</h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#666666] hover:text-black"
        >
          Back
        </Link>
      </div>

      <div className="rounded-2xl border border-black bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phrases"
          className="w-full bg-transparent text-sm text-black placeholder:text-[#999999] outline-none"
        />
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <ChipButton
          active={chip === "all"}
          onClick={() => setChipAndUrl("all")}
          label="All"
        />
        {hasFavorites ? (
          <ChipButton
            active={chip === "favorites"}
            onClick={() => setChipAndUrl("favorites")}
            label="★ Favorites"
          />
        ) : null}
        {categories.map((c) => (
          <ChipButton
            key={c.id}
            active={chip === c.slug}
            onClick={() => setChipAndUrl(c.slug)}
            label={c.title}
          />
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((p, index) => (
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

      {filtered.length === 0 && chip === "favorites" ? (
        <p className="text-center text-sm text-[#666666]">
          No favorites yet. Star a phrase to save it here.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-[#666666]">
          No phrases match this search/filter.
        </p>
      ) : null}
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border border-black px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,0.14)]"
          : "bg-white text-black hover:bg-[#F5F5F5]"
      }`}
    >
      {label}
    </button>
  );
}
