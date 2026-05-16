"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LAST_DONE_KEY = "vani_daily_last_done";
const STREAK_KEY = "vani_daily_streak";
const DONE_PREFIX = "vani_daily_done_";

// Local calendar date (YYYY-MM-DD). Using UTC would roll over at the wrong
// time for IST users (a tap at 5 AM IST is still "yesterday" in UTC).
function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayKey(): string {
  return localDateKey();
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

export function DailyChallengeCard({
  phraseId,
  englishText,
  phoneticText,
}: {
  phraseId: string;
  englishText: string;
  phoneticText: string;
}) {
  // Read localStorage state AFTER mount to avoid hydration mismatch. We also
  // wait one paint before showing real state via `ready` so the user doesn't
  // see "Mark done" flash for a frame on a day they've already completed.
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const today = todayKey();
      const doneToday = localStorage.getItem(`${DONE_PREFIX}${today}`) === "1";
      const storedStreak = Number(localStorage.getItem(STREAK_KEY) ?? "0");
      const safeStreak = Number.isFinite(storedStreak) ? storedStreak : 0;

      // If the most recent "done" is older than yesterday, the streak has
      // already lapsed — reset to 0 so the badge doesn't mislead the user.
      const lastDone = localStorage.getItem(LAST_DONE_KEY);
      const stale =
        lastDone && lastDone !== today && lastDone !== yesterdayKey();

      // Intentional single setState batch on mount. Safe (no loop) — the
      // effect has an empty dep array so this only runs once.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(doneToday);
      setStreak(stale ? 0 : safeStreak);
      setReady(true);
    } catch {
      /* ignore quota / disabled storage */
    }
  }, []);

  function markDone() {
    if (done) return;
    const today = todayKey();
    const yesterday = yesterdayKey();
    const prevLast = localStorage.getItem(LAST_DONE_KEY);
    const prevStreak = Number(localStorage.getItem(STREAK_KEY) ?? "0");
    const safePrev = Number.isFinite(prevStreak) ? prevStreak : 0;

    const nextStreak =
      prevLast === today ? safePrev : prevLast === yesterday ? safePrev + 1 : 1;

    localStorage.setItem(`${DONE_PREFIX}${today}`, "1");
    localStorage.setItem(LAST_DONE_KEY, today);
    localStorage.setItem(STREAK_KEY, String(nextStreak));
    setDone(true);
    setStreak(nextStreak);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
          Daily challenge
        </p>
        <p className="text-xs font-medium text-[#666666]">
          {ready ? (streak > 0 ? `${streak} day streak` : "Start streak today") : "\u00A0"}
        </p>
      </div>

      <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-xs uppercase tracking-wide text-[#999999]">
          {englishText}
        </p>
        <p className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-black">
          {phoneticText}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/phrases/${phraseId}`}
            className="rounded-xl border border-black bg-black px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#222222]"
          >
            Practice now
          </Link>
          <button
            type="button"
            onClick={markDone}
            disabled={done}
            className="rounded-xl border border-black bg-white px-3 py-2 text-sm font-medium text-black hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#777777]"
          >
            {done ? "Done today" : "Mark done"}
          </button>
        </div>
      </div>
    </section>
  );
}
