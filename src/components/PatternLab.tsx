"use client";

import { useMemo, useState } from "react";
import {
  getPatternIntents,
  type PatternIntent,
  type Tense,
} from "@/lib/data/patterns";
import type { PracticeLanguageCode } from "@/lib/data/moments";

const TENSE_ORDER: Tense[] = ["past", "present", "future"];
const TENSE_LABEL: Record<Tense, string> = {
  past: "Past",
  present: "Present",
  future: "Future",
};

export function PatternLab({
  languageCode,
}: {
  languageCode: PracticeLanguageCode;
}) {
  const patternIntents = useMemo(
    () => getPatternIntents(languageCode),
    [languageCode],
  );
  const [intentId, setIntentId] = useState<PatternIntent["id"]>("get");
  const [nounIdx, setNounIdx] = useState(0);
  const [tense, setTense] = useState<Tense>("present");
  const [animKey, setAnimKey] = useState(0); // bumps to retrigger animation

  const intent = useMemo(
    () => patternIntents.find((i) => i.id === intentId) ?? patternIntents[0],
    [intentId, patternIntents],
  );

  if (!intent) return null;

  const noun = intent.nouns[nounIdx] ?? intent.nouns[0];
  const t = intent.templates[tense];

  const phoneticSentence = t.template.replace("[SLOT]", noun.phonetic);
  const englishSentence = t.englishTemplate.replace("[SLOT]", noun.english);

  function pickIntent(id: PatternIntent["id"]) {
    if (id === intentId) return;
    setIntentId(id);
    setNounIdx(0);
    setAnimKey((k) => k + 1);
  }

  function pickNoun(i: number) {
    if (i === nounIdx) return;
    setNounIdx(i);
    setAnimKey((k) => k + 1);
  }

  function pickTense(next: Tense) {
    if (next === tense) return;
    setTense(next);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
          Pattern Lab
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Build any sentence
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          Pick an intent. Drop in a word. Switch the tense.
        </p>
      </header>

      {/* Intent picker */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {patternIntents.map((it) => {
          const active = it.id === intentId;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => pickIntent(it.id)}
              className={`flex flex-col items-start gap-1 rounded-2xl border border-black p-3 text-left transition-all duration-200 ${
                active
                  ? "bg-black text-white shadow-[0_8px_22px_rgba(0,0,0,0.18)]"
                  : "bg-white text-black hover:scale-[1.02] hover:bg-[#F5F5F5] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
              }`}
            >
              <span className="text-xl leading-none">{it.emoji}</span>
              <span
                className={`text-sm font-bold tracking-tight ${active ? "text-white" : "text-black"}`}
              >
                {it.label}
              </span>
              <span
                className={`text-[10px] leading-tight ${active ? "text-white/80" : "text-[#888888]"}`}
              >
                {it.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Master card */}
      <div className="rounded-2xl border border-black bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          {intent.slotLabel}: <span className="text-black">{noun.english}</span>
        </p>
        <p
          key={`s-${animKey}`}
          className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-black break-words animate-fade-in"
        >
          {renderWithSlot(t.template, noun.phonetic)}
        </p>
        <p
          key={`e-${animKey}`}
          className="mt-2 text-sm italic text-[#666666] animate-fade-in"
        >
          {englishSentence}
        </p>
        <p className="mt-3 text-[11px] text-[#888888]">{t.note}</p>
      </div>

      {/* Noun pills */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          Swap the {intent.slotLabel.toLowerCase()}
        </p>
        <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
          {intent.nouns.map((n, i) => {
            const active = i === nounIdx;
            return (
              <button
                key={n.english}
                type="button"
                onClick={() => pickNoun(i)}
                className={`flex shrink-0 flex-col items-start rounded-2xl border border-black px-3.5 py-2 transition-all duration-150 ${
                  active
                    ? "bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,0.18)]"
                    : "bg-white text-black hover:bg-[#F5F5F5]"
                }`}
              >
                <span
                  className={`text-[10px] uppercase tracking-wide ${
                    active ? "text-white/70" : "text-[#999999]"
                  }`}
                >
                  {n.english}
                </span>
                <span
                  className={`text-base font-semibold ${active ? "text-white" : "text-black"}`}
                >
                  {n.phonetic}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tense slider */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
          Tense
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-black bg-[#F5F5F5] p-1">
          {TENSE_ORDER.map((tn) => {
            const active = tn === tense;
            return (
              <button
                key={tn}
                type="button"
                onClick={() => pickTense(tn)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                    : "text-[#444444] hover:bg-white"
                }`}
              >
                {TENSE_LABEL[tn]}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-[#888888]">
          Same pattern, different time. Try switching while reading aloud.
        </p>
      </section>

      {/* Hidden helper — copy button row */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(phoneticSentence).catch(() => {});
          }}
          className="rounded-xl border border-black bg-white px-3.5 py-2 text-xs font-medium text-black hover:bg-[#F5F5F5]"
        >
          Copy line
        </button>
      </div>
    </div>
  );
}

/**
 * Render a template like "Nange [SLOT] beku" with the slot value visually
 * highlighted (black box) so the formula structure is obvious.
 */
function renderWithSlot(template: string, slotValue: string) {
  const parts = template.split("[SLOT]");
  if (parts.length < 2) return <>{template}</>;
  return (
    <>
      {parts[0]}
      <span className="mx-0.5 inline-flex items-center rounded-lg bg-black px-2 py-0.5 align-baseline text-[0.85em] font-semibold text-white">
        {slotValue}
      </span>
      {parts.slice(1).join("[SLOT]")}
    </>
  );
}
