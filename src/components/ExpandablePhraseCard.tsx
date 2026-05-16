"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { markPhraseRecent, toggleFavorite } from "@/app/actions/phrases";

// ── Types ────────────────────────────────────────────────────────────────────

type PhraseLite = {
  id: string;
  english_text: string;
  phonetic_text: string;
  has_audio: boolean;
};

type ReplyKind = "normal" | "yes" | "no";

type ReplyData = {
  id: string;
  english_text: string;
  phonetic_text: string;
  audio_url: string | null;
  reply_kind: ReplyKind;
};

type FullPhrase = {
  id: string;
  english_text: string;
  phonetic_text: string;
  audio_url: string | null;
  answer_mode: "normal" | "yes_no";
  replies: ReplyData[];
  is_favorited: boolean;
  is_authenticated: boolean;
};

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: FullPhrase }
  | { status: "error" };

// ── Component ────────────────────────────────────────────────────────────────

export function ExpandablePhraseCard({
  phrase,
  isExpanded,
  isFavorited,
  prefetchRank = null,
  onToggle,
}: {
  phrase: PhraseLite;
  isExpanded: boolean;
  isFavorited: boolean;
  prefetchRank?: number | null;
  onToggle: () => void;
}) {
  const [state, setState] = useState<FetchState>({ status: "idle" });
  const [favOptimistic, setFavOptimistic] = useState(isFavorited);
  const [favPending, startFavTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fetchedRef = useRef(false);
  const recentMarkedRef = useRef(false);

  // New phrase row — reset fetch state (list keys by id but this guards HMR / reorder).
  useEffect(() => {
    fetchedRef.current = false;
    recentMarkedRef.current = false;
    setState({ status: "idle" });
  }, [phrase.id]);

  // List payload only knows about *phrase* audio_url. Many rows have no main
  // line TTS but *replies* still have audio — treat that as "has audio" once
  // the detail fetch returns so we do not flash misleading "Audio soon".
  const detailHasAnyAudio =
    state.status === "ready" &&
    (Boolean(state.data.audio_url) ||
      state.data.replies.some((r) => r.audio_url));
  const effectiveHasAudio = phrase.has_audio || detailHasAnyAudio;

  // Sync optimistic state with server-provided initial value when prop changes.
  useEffect(() => {
    setFavOptimistic(isFavorited);
  }, [isFavorited]);

  // Fetch phrase data either on first expand, or via limited staggered prefetch.
  useEffect(() => {
    if (fetchedRef.current) return;
    const shouldPrefetch = typeof prefetchRank === "number" && prefetchRank >= 0;
    if (!isExpanded && !shouldPrefetch) return;

    const delayMs = shouldPrefetch ? Math.min(prefetchRank * 40, 480) : 0;
    const timer = window.setTimeout(() => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      setState({ status: "loading" });

      fetch(`/api/phrases/${phrase.id}`)
        .then((r) => r.json())
        .then((data: FullPhrase | { error: string }) => {
          if ("error" in data) {
            setState({ status: "error" });
            return;
          }
          setState({ status: "ready", data });
          setFavOptimistic(data.is_favorited);

        })
        .catch(() => setState({ status: "error" }));
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [isExpanded, phrase.id, prefetchRank]);

  useEffect(() => {
    if (!isExpanded || recentMarkedRef.current) return;
    if (state.status !== "ready" || !state.data.is_authenticated) return;
    recentMarkedRef.current = true;
    const fd = new FormData();
    fd.append("phrase_id", phrase.id);
    void markPhraseRecent(fd);
  }, [isExpanded, phrase.id, state]);

  function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    setFavOptimistic((v) => !v);
    const fd = new FormData();
    fd.append("phrase_id", phrase.id);
    startFavTransition(async () => {
      await toggleFavorite(fd);
    });
  }

  const playAudio = useCallback(async (url: string, rate = 1) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const a = new Audio(url);
      audioRef.current = a;
      a.preload = "auto";
      a.playbackRate = rate;
      await a.play();
    } catch { /* autoplay blocked */ }
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      aria-expanded={isExpanded}
      className={`group block w-full text-left rounded-2xl border border-black bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out cursor-pointer ${
        isExpanded
          ? "scale-[1.005] shadow-[0_14px_32px_rgba(0,0,0,0.14)]"
          : "hover:scale-[1.01] hover:bg-[#F5F5F5] hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)] active:scale-[0.99]"
      }`}
    >
      {/* Always-visible header row */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-[#999999]">
            {phrase.english_text}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {favOptimistic ? (
              <span className="text-xs text-black">★</span>
            ) : null}
            {!effectiveHasAudio ? (
              <span className="rounded-full border border-black bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-medium text-[#555555]">
                Audio soon
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-1 text-4xl font-semibold leading-tight text-black break-words">
          {phrase.phonetic_text}
        </p>
        {!isExpanded ? (
          <div className="mt-3 flex items-center gap-2">
            <p className="text-xs font-medium text-[#888888]">
              Tap for replies
            </p>
            {effectiveHasAudio ? (
              <span
                className="flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-medium text-[#555555]"
                aria-label="Audio available"
                title="Audio available"
              >
                <SpeakerIcon />
                Audio
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Expandable section — uses grid-rows trick for smooth height animation */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#EEEEEE] px-4 pb-4 pt-3">
            {state.status === "loading" || state.status === "idle" ? (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-9 w-32 rounded-xl bg-[#E5E5E5]" />
                <div className="h-16 rounded-xl bg-[#EEEEEE]" />
                <div className="h-16 rounded-xl bg-[#EEEEEE]" />
              </div>
            ) : state.status === "error" ? (
              <p className="py-2 text-sm text-[#666666]">
                Could not load details.
              </p>
            ) : (
              <ExpandedContent
                data={state.data}
                isFavorited={favOptimistic}
                favPending={favPending}
                onFavorite={handleFavorite}
                onPlayAudio={playAudio}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Expanded panel content ────────────────────────────────────────────────────

function ExpandedContent({
  data,
  isFavorited,
  favPending,
  onFavorite,
  onPlayAudio,
}: {
  data: FullPhrase;
  isFavorited: boolean;
  favPending: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onPlayAudio: (url: string, rate?: number) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2">
        {data.audio_url ? (
          <>
            <button
              type="button"
              onClick={() => void onPlayAudio(data.audio_url!, 1)}
              className="flex items-center gap-1.5 rounded-xl border border-black bg-black px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#222222]"
            >
              <PlayIcon />
              Play
            </button>
            <button
              type="button"
              onClick={() => void onPlayAudio(data.audio_url!, 0.75)}
              className="rounded-xl border border-black bg-white px-3 py-2 text-xs font-medium text-black hover:bg-[#F5F5F5]"
            >
              Slower
            </button>
          </>
        ) : data.replies.some((r) => r.audio_url) ? (
          <p className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2 text-[11px] text-[#555555]">
            Main line has no audio — use{" "}
            <span className="font-semibold text-black">Play</span> on a reply
            below.
          </p>
        ) : (
          <span className="rounded-lg border border-black bg-[#F5F5F5] px-3 py-1.5 text-[11px] font-medium text-[#555555]">
            Audio soon
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {data.is_authenticated ? (
            <button
              type="button"
              disabled={favPending}
              onClick={onFavorite}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border border-black transition-colors disabled:opacity-50 ${
                isFavorited
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#F5F5F5]"
              }`}
            >
              <StarIcon filled={isFavorited} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Replies */}
      {data.replies.length > 0 ? (
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
            {data.answer_mode === "yes_no" ? "Yes / No replies" : "Replies"}
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {data.replies.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {r.reply_kind !== "normal" ? (
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#888888]">
                        {r.reply_kind === "yes" ? "Yes" : "No"}
                      </p>
                    ) : null}
                    <p className="text-[10px] uppercase tracking-wide text-[#999999]">
                      {r.english_text}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-black break-words">
                      {r.phonetic_text}
                    </p>
                  </div>
                  {r.audio_url ? (
                    <button
                      type="button"
                      onClick={() => void onPlayAudio(r.audio_url!, 1)}
                      className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-black bg-white text-black hover:bg-[#F5F5F5]"
                      aria-label="Play reply"
                    >
                      <PlayIcon />
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 13 13" fill="currentColor">
      <path d="M2.5 1.5l9 5-9 5V1.5z" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 00-2.5-4.03v8.05A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
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
