"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics/client";

const EXAMPLES = [
  "Where is the nearest bus stop?",
  "Can I pay by card?",
  "I need help, please.",
  "How much does this cost?",
] as const;

const MAX_INPUT_LEN = 200;
const SPEED_OPTIONS = [0.75, 1.0, 1.25] as const;
type Speed = (typeof SPEED_OPTIONS)[number];

type TypeSayResult = {
  phonetic: string;
  native: string;
  audioUrl: string | null;
  targetLanguage: string;
  phoneticSource?: "gemini" | "sarvam";
  cached?: boolean;
};

type ApiError = {
  error: string;
  retryAfterMs?: number;
  blocked?: boolean;
};

export default function TypeSayPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TypeSayResult | null>(null);
  const [submittedText, setSubmittedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1.0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleaned = input.trim();
  const canSubmit = useMemo(
    () =>
      !loading &&
      cooldownMs <= 0 &&
      cleaned.length > 0 &&
      cleaned.length <= MAX_INPUT_LEN,
    [cleaned, cooldownMs, loading],
  );

  // Countdown for rate-limit cooldown.
  useEffect(() => {
    if (cooldownMs <= 0) return;
    const id = window.setInterval(() => {
      setCooldownMs((ms) => Math.max(ms - 1000, 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownMs]);

  // Abort in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);
    setCopied(false);
    const requested = cleaned;
    track("type_say_submit", { length: requested.length });

    try {
      const res = await fetch("/api/type-say", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: requested }),
        signal: ac.signal,
      });

      const data: TypeSayResult | ApiError = await res
        .json()
        .catch(() => ({ error: "Unexpected response from server." }));

      if (!res.ok) {
        const msg =
          "error" in data ? data.error : "Something went wrong. Try again.";
        setError(msg);
        if (res.status === 429 && "retryAfterMs" in data && data.retryAfterMs) {
          setCooldownMs(data.retryAfterMs);
        }
        track("type_say_error", { status: res.status });
        setResult(null);
        return;
      }

      const success = data as TypeSayResult;
      setSubmittedText(requested);
      setResult(success);
      track("type_say_success", {
        cached: Boolean(success.cached),
        target: success.targetLanguage,
        has_audio: Boolean(success.audioUrl),
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [canSubmit, cleaned]);

  const playAudio = useCallback(
    async (url: string, playSpeed: Speed) => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        const a = new Audio(url);
        a.preload = "auto";
        a.playbackRate = playSpeed;
        audioRef.current = a;
        setIsPlaying(true);
        a.onended = () => setIsPlaying(false);
        a.onerror = () => setIsPlaying(false);
        await a.play();
      } catch {
        setIsPlaying(false);
      }
    },
    [],
  );

  const copyPhonetic = useCallback(async (text: string) => {
    // Keep on-screen phonetic as-is, but copy a cleaner variant for sharing.
    const normalized = text
      .replace(/([A-Za-z])\-([A-Za-z])/g, "$1$2")
      .replace(/\s+/g, " ")
      .trim();
    try {
      await navigator.clipboard.writeText(normalized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Type anything. Speak instantly.
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          For respectful everyday communication. Limited daily usage.
        </p>
        <p className="mt-2 inline-flex rounded-full border border-black bg-white px-3 py-1 text-[11px] font-medium text-black">
          Free beta limits apply during launch week.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-3"
      >
        <div className="rounded-2xl border border-black bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value.slice(0, MAX_INPUT_LEN));
              setError(null);
            }}
            placeholder="Type something in English..."
            maxLength={MAX_INPUT_LEN}
            enterKeyHint="go"
            autoComplete="off"
            autoCorrect="on"
            className="w-full bg-transparent text-sm text-black placeholder:text-[#999999] outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[#999999]">
            {cleaned.length}/{MAX_INPUT_LEN}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl border border-black bg-black px-5 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#999999] disabled:border-[#999999]"
          >
            {loading
              ? "Generating..."
              : cooldownMs > 0
                ? `Wait ${Math.ceil(cooldownMs / 1000)}s`
                : "Generate"}
          </button>
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-black bg-[#FFF0F0] p-4 text-sm text-black"
        >
          {error}
        </div>
      ) : null}

      {!result && !error ? (
        <div className="rounded-2xl border border-black bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
            Try an example
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setInput(ex);
                  setError(null);
                }}
                className="rounded-full border border-black bg-[#F5F5F5] px-3 py-1.5 text-xs text-black transition-colors hover:bg-black hover:text-white"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={`transition-all duration-300 ease-out ${
          result
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {result ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs uppercase tracking-wide text-[#999999]">
                {submittedText}
              </p>
              <p className="mt-1 text-4xl font-semibold leading-tight text-black break-words">
                {result.phonetic}
              </p>

              {/* Speed controls */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-[#666666]">Speed</span>
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`rounded-full border border-black px-2.5 py-1 text-xs font-medium transition-all ${
                      speed === s
                        ? "bg-black text-white"
                        : "bg-[#F5F5F5] text-black hover:bg-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Action row */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!result.audioUrl}
                  onClick={() =>
                    result.audioUrl && void playAudio(result.audioUrl, speed)
                  }
                  className="flex items-center gap-2 rounded-xl border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlaying ? (
                    <>
                      <PauseIcon />
                      Playing…
                    </>
                  ) : (
                    <>
                      <PlayIcon />
                      {result.audioUrl ? "Play audio" : "Audio unavailable"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void copyPhonetic(result.phonetic)}
                  className="flex items-center gap-2 rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy"}
                </button>
                {result.cached ? (
                  <span className="self-center rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#666666]">
                    Cached
                  </span>
                ) : null}
              </div>

              {!result.audioUrl ? (
                <p className="mt-3 text-xs text-[#666666]">
                  Text generated, but audio could not be generated this time.
                  Please retry.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <path d="M2.5 1.5l9 5-9 5V1.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <rect x="2" y="2" width="3.5" height="9" rx="1" />
      <rect x="7.5" y="2" width="3.5" height="9" rx="1" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}
