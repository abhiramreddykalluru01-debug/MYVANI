"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toggleFavorite, markPhraseRecent } from "@/app/actions/phrases";

// ── Types ────────────────────────────────────────────────────────────────────

type ReplyKind = "normal" | "yes" | "no";

type ReplyData = {
  id: string;
  english_text: string;
  phonetic_text: string;
  audio_url: string | null;
  reply_kind: ReplyKind;
};

type PhraseData = {
  id: string;
  english_text: string;
  phonetic_text: string;
  audio_url: string | null;
  answer_mode: "normal" | "yes_no";
  category: { type: string; slug: string; title: string };
  replies: ReplyData[];
  is_favorited: boolean;
  is_authenticated: boolean;
};

type SheetState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: PhraseData }
  | { status: "error" };

// ── Sheet component ───────────────────────────────────────────────────────────

export function PhraseBottomSheet({
  phraseId,
  onClose,
}: {
  phraseId: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<SheetState>({ status: "loading" });
  const [isFavorited, setIsFavorited] = useState(false);
  const [favPending, startFavTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Fetch phrase data when opened.
  useEffect(() => {
    let cancelled = false;
    // Intentional: reset to loading whenever phraseId changes. This is the
    // canonical "derive state from prop on change" pattern; the lint rule
    // about setState-in-effect is overly conservative here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "loading" });

    fetch(`/api/phrases/${phraseId}`)
      .then((r) => r.json())
      .then((data: PhraseData | { error: string }) => {
        if (cancelled) return;
        if ("error" in data) {
          setState({ status: "error" });
          return;
        }
        setState({ status: "ready", data });
        setIsFavorited(data.is_favorited);

        // Record recent — fire and forget.
        if (data.is_authenticated) {
          const fd = new FormData();
          fd.append("phrase_id", phraseId);
          void markPhraseRecent(fd);
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => { cancelled = true; };
  }, [phraseId]);

  // Close on Escape key.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while sheet open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleFavorite() {
    if (state.status !== "ready") return;
    const next = !isFavorited;
    setIsFavorited(next);
    const fd = new FormData();
    fd.append("phrase_id", phraseId);
    startFavTransition(async () => {
      await toggleFavorite(fd);
    });
  }

  const playAudio = useCallback(async (url: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const a = new Audio(url);
      audioRef.current = a;
      a.preload = "auto";
      await a.play();
    } catch { /* autoplay blocked */ }
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-3xl border-t border-x border-black bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.18)] animate-slide-up"
        style={{ maxHeight: "88vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-[#CCCCCC]" />
        </div>

        <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: "calc(88vh - 28px)" }}>
          {state.status === "loading" ? (
            <div className="flex flex-col gap-4 py-6 animate-pulse">
              <div className="h-3 w-24 rounded bg-[#E5E5E5]" />
              <div className="h-12 w-3/4 rounded-lg bg-[#E5E5E5]" />
              <div className="h-10 w-full rounded-2xl bg-[#E5E5E5]" />
              <div className="h-24 rounded-2xl bg-[#E5E5E5]" />
              <div className="h-24 rounded-2xl bg-[#E5E5E5]" />
            </div>
          ) : state.status === "error" ? (
            <div className="py-8 text-center text-sm text-[#666666]">
              Could not load phrase. Try again.
            </div>
          ) : state.status === "ready" ? (
            <PhraseContent
              data={state.data}
              isFavorited={isFavorited}
              favPending={favPending}
              onFavorite={handleFavorite}
              onPlayAudio={playAudio}
              onClose={onClose}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

// ── Phrase content inside sheet ───────────────────────────────────────────────

function PhraseContent({
  data,
  isFavorited,
  favPending,
  onFavorite,
  onPlayAudio,
  onClose,
}: {
  data: PhraseData;
  isFavorited: boolean;
  favPending: boolean;
  onFavorite: () => void;
  onPlayAudio: (url: string) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Header row: close + favorite */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black bg-white text-black hover:bg-[#F5F5F5]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        {data.is_authenticated ? (
          <button
            type="button"
            disabled={favPending}
            onClick={onFavorite}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-black transition-all disabled:opacity-50 ${
              isFavorited ? "bg-black text-white" : "bg-white text-black hover:bg-[#F5F5F5]"
            }`}
          >
            <StarIcon filled={isFavorited} />
          </button>
        ) : null}
      </div>

      {/* Main phrase card */}
      <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#999999]">
          {data.english_text}
        </p>
        <p className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-black break-words sm:text-5xl">
          {data.phonetic_text}
        </p>

        <div className="mt-5">
          {data.audio_url ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onPlayAudio(data.audio_url!)}
                className="flex items-center gap-2 rounded-xl border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
              >
                <PlayIcon />
                Play
              </button>
              <button
                type="button"
                onClick={() => {
                  const a = new Audio(data.audio_url!);
                  a.playbackRate = 0.75;
                  void a.play();
                }}
                className="flex items-center gap-2 rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#F5F5F5]"
              >
                Slower
              </button>
            </div>
          ) : (
            <span className="rounded-lg border border-black bg-[#F5F5F5] px-3 py-1.5 text-xs font-medium text-[#555555]">
              Audio soon
            </span>
          )}
        </div>
      </div>

      {/* Replies */}
      {data.replies.length > 0 ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
            {data.answer_mode === "yes_no" ? "Yes / No replies" : "Replies"}
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {data.replies.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-black bg-[#F5F5F5] p-4"
              >
                {r.reply_kind !== "normal" ? (
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
                    {r.reply_kind === "yes" ? "Yes" : "No"}
                  </p>
                ) : null}
                <p className="mt-0.5 text-xs uppercase tracking-wide text-[#999999]">
                  {r.english_text}
                </p>
                <p className="mt-1 text-xl font-semibold text-black">
                  {r.phonetic_text}
                </p>
                {r.audio_url ? (
                  <button
                    type="button"
                    onClick={() => void onPlayAudio(r.audio_url!)}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-black bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-[#F5F5F5]"
                  >
                    <PlayIcon />
                    Play
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="currentColor">
      <path d="M2.5 1.5l9 5-9 5V1.5z" />
    </svg>
  );
}
