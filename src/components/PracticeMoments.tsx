"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMoments,
  type Moment,
  type MomentOption,
  type PracticeLanguageCode,
} from "@/lib/data/moments";

// ── Types & constants ─────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "scene"
  | "reflex"
  | "feedback1"
  | "reply"
  | "followup"
  | "feedback2"
  | "moment-score"
  | "summary";

type AttemptScore = {
  momentId: string;
  clarity: boolean; // first phrase correct
  flow: boolean;    // follow-up correct
  speed: boolean;   // first phrase picked under time limit
};

const REFLEX_SECONDS = 12;

// ── Component ────────────────────────────────────────────────────────────────

export function PracticeMoments({
  languageCode,
}: {
  languageCode: PracticeLanguageCode;
}) {
  const moments = useMemo(() => getMoments(languageCode), [languageCode]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<AttemptScore[]>([]);
  const [pickedMain, setPickedMain] = useState<number | null>(null);
  const [pickedFollow, setPickedFollow] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(REFLEX_SECONDS);
  const [paused, setPaused] = useState(false);

  const moment: Moment = moments[index];

  function start() {
    setIndex(0);
    setScores([]);
    setPickedMain(null);
    setPickedFollow(null);
    setPhase("scene");
  }

  function finalizeMain(pickIdx: number | null) {
    setPickedMain(pickIdx);
    setPhase("feedback1");
  }

  function finalizeFollow(pickIdx: number | null) {
    setPickedFollow(pickIdx);
    setPhase("feedback2");
  }

  function enterTimedPhase(next: "reflex" | "followup") {
    setTimeLeft(REFLEX_SECONDS);
    setPaused(false);
    setPhase(next);
  }

  function commitMomentScore() {
    const mainOk = pickedMain !== null && moment.options[pickedMain]?.isCorrect === true;
    const followOk =
      pickedFollow !== null && moment.followupOptions[pickedFollow]?.isCorrect === true;
    const speedOk = pickedMain !== null && timeLeft > 0; // they picked something before timeout
    const score: AttemptScore = {
      momentId: moment.id,
      clarity: !!mainOk,
      flow: !!followOk,
      speed: !!speedOk,
    };
    setScores((prev) => [...prev, score]);
    setPhase("moment-score");
  }

  function nextMoment() {
    const nextIdx = index + 1;
    setPickedMain(null);
    setPickedFollow(null);
    if (nextIdx >= moments.length) {
      setPhase("summary");
      return;
    }
    setIndex(nextIdx);
    setPhase("scene");
  }

  function quitToIntro() {
    setPhase("intro");
    setIndex(0);
    setScores([]);
    setPickedMain(null);
    setPickedFollow(null);
  }

  // Reflex countdown — runs only during reflex/followup phases.
  useEffect(() => {
    const counting = (phase === "reflex" || phase === "followup") && !paused;
    if (!counting) return;

    if (timeLeft <= 0) {
      // Time ran out — auto-advance with no pick.
      const id = window.setTimeout(() => {
        if (phase === "reflex") finalizeMain(null);
        else finalizeFollow(null);
      }, 0);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, paused, timeLeft]);

  // ── Renderers ───────────────────────────────────────────────────────────────

  if (phase === "intro") {
    return <IntroScreen totalMoments={moments.length} onStart={start} />;
  }

  if (phase === "summary") {
    return <SummaryScreen scores={scores} onRestart={start} onQuit={quitToIntro} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <TopBar
        index={index}
        total={moments.length}
        onQuit={quitToIntro}
        showFreeze={phase === "reflex" || phase === "followup"}
        paused={paused}
        onFreeze={() => setPaused((v) => !v)}
      />

      {phase === "scene" ? (
        <SceneCard moment={moment} onContinue={() => enterTimedPhase("reflex")} />
      ) : null}

      {phase === "reflex" ? (
        <ReflexPhase
          prompt={moment.prompt}
          options={moment.options}
          timeLeft={timeLeft}
          paused={paused}
          freezeHint={moment.freezeHint}
          onPick={(i) => finalizeMain(i)}
        />
      ) : null}

      {phase === "feedback1" ? (
        <FeedbackPhase
          options={moment.options}
          picked={pickedMain}
          onContinue={() => setPhase("reply")}
          continueLabel="Hear their reply"
        />
      ) : null}

      {phase === "reply" ? (
        <ReplyCard
          reply={moment.reply}
          onContinue={() => enterTimedPhase("followup")}
        />
      ) : null}

      {phase === "followup" ? (
        <ReflexPhase
          prompt={moment.followupPrompt}
          options={moment.followupOptions}
          timeLeft={timeLeft}
          paused={paused}
          freezeHint={moment.freezeHint}
          onPick={(i) => finalizeFollow(i)}
        />
      ) : null}

      {phase === "feedback2" ? (
        <FeedbackPhase
          options={moment.followupOptions}
          picked={pickedFollow}
          onContinue={commitMomentScore}
          continueLabel="See score"
        />
      ) : null}

      {phase === "moment-score" ? (
        <MomentScoreCard
          score={scores[scores.length - 1]}
          isLast={index >= moments.length - 1}
          onNext={nextMoment}
        />
      ) : null}
    </div>
  );
}

// ── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({
  index,
  total,
  onQuit,
  showFreeze,
  paused,
  onFreeze,
}: {
  index: number;
  total: number;
  onQuit: () => void;
  showFreeze: boolean;
  paused: boolean;
  onFreeze: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onQuit}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black bg-white text-black hover:bg-[#F5F5F5]"
        aria-label="Quit practice"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < index
                ? "bg-black"
                : i === index
                  ? "bg-[#888888]"
                  : "bg-[#E5E5E5]"
            }`}
          />
        ))}
      </div>

      {showFreeze ? (
        <button
          type="button"
          onClick={onFreeze}
          className={`rounded-xl border border-black px-3 py-1.5 text-xs font-medium transition-colors ${
            paused ? "bg-black text-white" : "bg-white text-black hover:bg-[#F5F5F5]"
          }`}
        >
          {paused ? "Resume" : "Freeze"}
        </button>
      ) : null}
    </div>
  );
}

// ── Screens / phases ─────────────────────────────────────────────────────────

function IntroScreen({
  totalMoments,
  onStart,
}: {
  totalMoments: number;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
          Practice
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Real-life moments
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          Quick reflex. Two-turn conversations. Survive {totalMoments} situations.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-black">How it works</p>
        <ul className="flex flex-col gap-2 text-sm text-[#444444]">
          <li>• You see the situation</li>
          <li>• You pick the right line in {REFLEX_SECONDS}s</li>
          <li>• You hear their reply</li>
          <li>• You pick the right follow-up</li>
          <li>• Stuck? Tap <span className="font-semibold text-black">Freeze</span> any time</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-2xl border border-black bg-black px-5 py-4 text-base font-semibold text-white shadow-[0_8px_22px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#222222]"
      >
        Start training
      </button>
    </div>
  );
}

function SceneCard({ moment, onContinue }: { moment: Moment; onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-black bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{moment.emoji}</span>
          <h2 className="text-lg font-semibold text-black">{moment.title}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#444444]">
          {moment.context}
        </p>
      </div>

      {moment.incoming ? (
        <div className="rounded-2xl border border-black bg-[#F5F5F5] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
            They say
          </p>
          <p className="mt-1 text-2xl font-semibold leading-tight text-black">
            {moment.incoming.phonetic}
          </p>
          <p className="mt-1 text-xs italic text-[#666666]">
            {moment.incoming.english}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        className="rounded-2xl border border-black bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]"
      >
        Continue →
      </button>
    </div>
  );
}

function ReflexPhase({
  prompt,
  options,
  timeLeft,
  paused,
  freezeHint,
  onPick,
}: {
  prompt: string;
  options: readonly MomentOption[];
  timeLeft: number;
  paused: boolean;
  freezeHint: string;
  onPick: (i: number) => void;
}) {
  const pct = Math.max(0, (timeLeft / REFLEX_SECONDS) * 100);
  const danger = timeLeft <= 4 && !paused;

  return (
    <div className="flex flex-col gap-4">
      {/* Timer bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              danger ? "bg-[#ff1744]" : "bg-black"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${danger ? "text-[#ff1744]" : "text-[#666666]"}`}>
          {paused ? "paused" : `${timeLeft}s`}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#888888]">
          Your line
        </p>
        <h2 className="mt-1 text-xl font-semibold leading-tight text-black">
          {prompt}
        </h2>
      </div>

      {paused ? (
        <div className="rounded-2xl border border-black bg-[#FFF8E1] p-4 text-sm text-black">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
            Hint
          </p>
          <p className="mt-1">{freezeHint}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className="rounded-2xl border border-black bg-white p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-150 hover:scale-[1.01] hover:bg-[#F5F5F5] hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)] active:scale-[0.99]"
          >
            <p className="text-2xl font-semibold leading-tight text-black break-words">
              {opt.phonetic}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-[#999999]">
              {opt.english}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackPhase({
  options,
  picked,
  onContinue,
  continueLabel,
}: {
  options: readonly MomentOption[];
  picked: number | null;
  onContinue: () => void;
  continueLabel: string;
}) {
  const correctIdx = options.findIndex((o) => o.isCorrect);
  const correct = options[correctIdx];
  const isRight = picked !== null && options[picked]?.isCorrect === true;
  const timedOut = picked === null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-2xl border p-5 ${
          isRight
            ? "border-black bg-[#E8F5E9]"
            : "border-black bg-[#FFEBEE]"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-black">
          {isRight ? "✓ Correct" : timedOut ? "⏱ Time up" : "✗ Not quite"}
        </p>
        <p className="mt-2 text-3xl font-semibold leading-tight text-black break-words">
          {correct.phonetic}
        </p>
        <p className="mt-1 text-xs italic text-[#444444]">
          {correct.english}
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-2xl border border-black bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]"
      >
        {continueLabel} →
      </button>
    </div>
  );
}

function ReplyCard({
  reply,
  onContinue,
}: {
  reply: { english: string; phonetic: string };
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-black bg-[#F5F5F5] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          They reply
        </p>
        <p className="mt-2 text-3xl font-semibold leading-tight text-black break-words">
          {reply.phonetic}
        </p>
        <p className="mt-1 text-xs italic text-[#666666]">{reply.english}</p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-2xl border border-black bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]"
      >
        Reply now →
      </button>
    </div>
  );
}

function MomentScoreCard({
  score,
  isLast,
  onNext,
}: {
  score: AttemptScore;
  isLast: boolean;
  onNext: () => void;
}) {
  const total =
    (score.clarity ? 1 : 0) + (score.flow ? 1 : 0) + (score.speed ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-black bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          Moment score
        </p>
        <p className="mt-1 text-5xl font-semibold tracking-tight text-black">
          {total}<span className="text-2xl text-[#888888]">/3</span>
        </p>

        <ul className="mt-5 flex flex-col gap-2.5 text-sm">
          <ScoreRow ok={score.clarity} label="Clarity" hint="Picked the right line" />
          <ScoreRow ok={score.speed} label="Speed" hint={`Replied in under ${REFLEX_SECONDS}s`} />
          <ScoreRow ok={score.flow} label="Flow" hint="Handled their follow-up" />
        </ul>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="rounded-2xl border border-black bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]"
      >
        {isLast ? "Finish session" : "Next moment"} →
      </button>
    </div>
  );
}

function ScoreRow({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black text-xs font-semibold ${
          ok ? "bg-black text-white" : "bg-[#FFEBEE] text-[#cc0000]"
        }`}
        aria-hidden
      >
        {ok ? "✓" : "✗"}
      </span>
      <div>
        <p className="text-sm font-semibold text-black">{label}</p>
        <p className="text-xs text-[#666666]">{hint}</p>
      </div>
    </li>
  );
}

function SummaryScreen({
  scores,
  onRestart,
  onQuit,
}: {
  scores: AttemptScore[];
  onRestart: () => void;
  onQuit: () => void;
}) {
  const total = scores.reduce(
    (acc, s) => acc + (s.clarity ? 1 : 0) + (s.flow ? 1 : 0) + (s.speed ? 1 : 0),
    0,
  );
  const max = scores.length * 3;
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;

  const verdict =
    pct >= 80
      ? "Strong. You can hold real conversations."
      : pct >= 50
        ? "Solid start. A few more rounds will lock it in."
        : "Keep going. Real fluency comes from repetition.";

  const dimensions = useMemo(
    () => ({
      clarity: scores.filter((s) => s.clarity).length,
      speed: scores.filter((s) => s.speed).length,
      flow: scores.filter((s) => s.flow).length,
    }),
    [scores],
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
          Session complete
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          {pct}% mastery
        </h1>
        <p className="mt-1 text-sm text-[#666666]">{verdict}</p>
      </header>

      <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          Your strengths
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Clarity" value={dimensions.clarity} max={scores.length} />
          <Stat label="Speed" value={dimensions.speed} max={scores.length} />
          <Stat label="Flow" value={dimensions.flow} max={scores.length} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-2xl border border-black bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]"
        >
          Practice again
        </button>
        <button
          type="button"
          onClick={onQuit}
          className="rounded-2xl border border-black bg-white px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#F5F5F5]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] p-3 text-center">
      <p className="text-2xl font-semibold text-black">
        {value}<span className="text-sm text-[#888888]">/{max}</span>
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#666666]">
        {label}
      </p>
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
