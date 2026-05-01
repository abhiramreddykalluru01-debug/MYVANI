"use client";

import { useState } from "react";

// ── Static data ───────────────────────────────────────────────────────────────

type Chip = { key: string; label: string; result: string; english: string };

type Intent = {
  id: string;
  label: string;
  subtitle: string;
  pattern: string;
  patternMeaning: string;
  chips: Chip[];
  contexts: string[];
  reply: { phonetic: string; meaning: string };
};

const INTENTS: Intent[] = [
  {
    id: "get",
    label: "Get something",
    subtitle: "Ask for what you need",
    pattern: "Nange [__] beku",
    patternMeaning: "(I want __)",
    chips: [
      { key: "water", label: "water", result: "Nange neeru beku", english: "I want water" },
      { key: "food", label: "food", result: "Nange oota beku", english: "I want food" },
      { key: "tea", label: "tea", result: "Nange tea beku", english: "I want tea" },
      { key: "help", label: "help", result: "Nange sahaaya beku", english: "I want help" },
    ],
    contexts: ["At a shop", "At a restaurant"],
    reply: { phonetic: "Sari, tilkotini", meaning: "Okay, I'll get it" },
  },
  {
    id: "ask",
    label: "Ask something",
    subtitle: "Find your way around",
    pattern: "[__] elli ide?",
    patternMeaning: "(Where is __?)",
    chips: [
      { key: "hospital", label: "hospital", result: "Aspatre elli ide?", english: "Where is the hospital?" },
      { key: "bus stand", label: "bus stand", result: "Bus stand elli ide?", english: "Where is the bus stand?" },
      { key: "hotel", label: "hotel", result: "Hotel elli ide?", english: "Where is the hotel?" },
      { key: "toilet", label: "toilet", result: "Toilet elli ide?", english: "Where is the toilet?" },
    ],
    contexts: ["On the street", "Asking a shopkeeper"],
    reply: { phonetic: "Mundakke hogi", meaning: "Go straight" },
  },
  {
    id: "reply",
    label: "Reply to someone",
    subtitle: "Respond naturally",
    pattern: "Houdhu, [__]",
    patternMeaning: "(Yes, __)",
    chips: [
      { key: "sari", label: "okay", result: "Houdhu, sari", english: "Yes, okay" },
      { key: "gottu", label: "I know", result: "Houdhu, gottu", english: "Yes, I know" },
      { key: "barta iddini", label: "I'm coming", result: "Houdhu, barta iddini", english: "Yes, I'm coming" },
      { key: "madtini", label: "I'll do it", result: "Houdhu, madtini", english: "Yes, I'll do it" },
    ],
    contexts: ["Responding to a request", "Agreeing with someone"],
    reply: { phonetic: "Dhanyavaadagalu", meaning: "Thank you" },
  },
  {
    id: "help",
    label: "Ask for help",
    subtitle: "Get help in any situation",
    pattern: "Nange [__] artha agalla",
    patternMeaning: "(I don't understand __)",
    chips: [
      { key: "this", label: "this", result: "Nange idu artha agalla", english: "I don't understand this" },
      { key: "Kannada", label: "Kannada", result: "Nange Kannada artha agalla", english: "I don't understand Kannada" },
      { key: "the price", label: "the price", result: "Nange bele artha agalla", english: "I don't understand the price" },
      { key: "the way", label: "the way", result: "Nange daari artha agalla", english: "I don't understand the way" },
    ],
    contexts: ["Meeting someone new", "When you're lost"],
    reply: { phonetic: "Naan help madtini", meaning: "I'll help you" },
  },
];

const DAILY_LIMIT = 3;

async function playAudio(url: string) {
  try {
    const a = new Audio(url);
    a.preload = "auto";
    await a.play();
  } catch { /* ignore autoplay restrictions */ }
}

// ── Screen 1: Intent picker ───────────────────────────────────────────────────

function IntentScreen({
  onSelect,
  completedIds,
}: {
  onSelect: (i: Intent) => void;
  completedIds: Set<string>;
}) {
  const doneCount = completedIds.size;
  const allDone = doneCount >= DAILY_LIMIT;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">Practice</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Daily drills
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          {allDone
            ? "All 3 drills done for today. Come back tomorrow!"
            : `Complete ${DAILY_LIMIT - doneCount} more drill${DAILY_LIMIT - doneCount === 1 ? "" : "s"} today.`}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E8E8E8]">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${Math.min((doneCount / DAILY_LIMIT) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#666666]">{doneCount} / {DAILY_LIMIT} done</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {INTENTS.map((intent) => {
          const done = completedIds.has(intent.id);
          return (
            <button
              key={intent.id}
              type="button"
              onClick={() => onSelect(intent)}
              className={`relative flex flex-col items-start gap-1.5 rounded-2xl border border-black p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_22px_rgba(0,0,0,0.10)] active:scale-[1.00] ${
                done ? "bg-[#F5F5F5]" : "bg-white"
              }`}
            >
              {done ? (
                <span className="absolute right-3 top-3 text-sm text-black">✓</span>
              ) : null}
              <span className="text-base font-semibold text-black">{intent.label}</span>
              <span className="text-xs text-[#888888]">{intent.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Screen 2: Practice detail ─────────────────────────────────────────────────

function DetailScreen({
  intent,
  onBack,
  onComplete,
  alreadyDone,
}: {
  intent: Intent;
  onBack: () => void;
  onComplete: (id: string) => void;
  alreadyDone: boolean;
}) {
  const [selected, setSelected] = useState<Chip | null>(null);
  const [confident, setConfident] = useState(false);

  function handleChip(chip: Chip) {
    setSelected(chip.key === selected?.key ? null : chip);
    setConfident(false);
  }

  function handleConfident() {
    setConfident(true);
    onComplete(intent.id);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:bg-black hover:text-white"
          aria-label="Back"
        >
          <BackIcon />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-black">{intent.label}</h2>
          <p className="text-xs text-[#888888]">Learn how to use this in real life</p>
        </div>
      </div>

      {/* Pattern card */}
      <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">Pattern</p>
        <p className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-black">
          {intent.pattern}
        </p>
        <p className="mt-2 text-sm text-[#888888]">{intent.patternMeaning}</p>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {intent.chips.map((chip) => {
            const active = selected?.key === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => handleChip(chip)}
                className={`rounded-full border border-black px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-black text-white"
                    : "bg-[#F5F5F5] text-black hover:bg-[#E8E8E8]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      <div
        className={`transition-all duration-300 ease-out ${
          selected
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {selected ? (
          <div className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <p className="text-xs uppercase tracking-wide text-[#999999]">{selected.english}</p>
            <p className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-black">
              {selected.result}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void playAudio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")}
                className="flex items-center gap-2 rounded-xl border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
              >
                <PlayIcon />
                Play
              </button>
              {!confident ? (
                <button
                  type="button"
                  onClick={handleConfident}
                  className="flex items-center gap-2 rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
                >
                  I can say this ✓
                </button>
              ) : (
                <span className="self-center text-sm font-medium text-black">
                  Great! Drill marked done.
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Context */}
      <div className="rounded-2xl border border-black bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">Use this when</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {intent.contexts.map((ctx) => (
            <span
              key={ctx}
              className="rounded-full border border-black bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-black"
            >
              {ctx}
            </span>
          ))}
        </div>
      </div>

      {/* Reply */}
      <div className="rounded-2xl border border-black bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">They might reply</p>
        <p className="mt-2 text-xl font-semibold text-black">{intent.reply.phonetic}</p>
        <p className="mt-0.5 text-sm text-[#888888]">{intent.reply.meaning}</p>
      </div>

      {alreadyDone ? (
        <p className="text-center text-xs text-[#888888]">
          This drill is already marked complete for today.
        </p>
      ) : null}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function PracticePatterns() {
  const [activeIntent, setActiveIntent] = useState<Intent | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  function markComplete(id: string) {
    setCompletedIds((prev) => new Set([...prev, id]));
  }

  if (activeIntent) {
    return (
      <DetailScreen
        intent={activeIntent}
        onBack={() => setActiveIntent(null)}
        onComplete={markComplete}
        alreadyDone={completedIds.has(activeIntent.id)}
      />
    );
  }

  return (
    <IntentScreen
      onSelect={setActiveIntent}
      completedIds={completedIds}
    />
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1L3 7l6 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <path d="M2.5 1.5l9 5-9 5V1.5z" />
    </svg>
  );
}
