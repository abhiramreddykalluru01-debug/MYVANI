"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/phrases";

type Props = {
  phraseId: string;
  initialFavorited: boolean;
};

export function FavoriteButton({ phraseId, initialFavorited }: Props) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const fd = new FormData();
    fd.append("phrase_id", phraseId);
    startTransition(async () => {
      await toggleFavorite(fd);
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleToggle}
      aria-label={initialFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-black transition-all disabled:opacity-50 ${
        initialFavorited
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-[#F5F5F5]"
      }`}
    >
      <StarIcon filled={initialFavorited} />
    </button>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
