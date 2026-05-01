"use client";

import { useMemo, useState } from "react";
import type { PhraseWithReplies } from "@/lib/data/phrases";
import { AudioPlayer } from "@/components/AudioPlayer";

type Msg = { role: "user" | "assistant"; text: string; audioUrl?: string };

export function PracticeChat({ phrases }: { phrases: PhraseWithReplies[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  const phrase = phrases[phraseIndex];

  const canSend = useMemo(
    () => Boolean(phrase?.replies?.length && input.trim()),
    [phrase, input],
  );

  if (!phrases.length) {
    return (
      <p className="rounded-2xl border border-black bg-white p-6 text-center text-sm text-[#666666]">
        No phrases in the database yet. Add rows in Supabase or run
        supabase/seed.sql.
      </p>
    );
  }

  function send() {
    if (!phrase?.replies?.length || !input.trim()) return;
    const userText = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);

    const pool = phrase.replies;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: pick.phonetic_text,
        audioUrl: pick.audio_url ?? undefined,
      },
    ]);
  }

  function nextPhrase() {
    setPhraseIndex((i) => (i + 1) % phrases.length);
    setMessages([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-black bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#999999]">
          Current phrase
        </p>
        <p className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
          {phrase.phonetic_text}
        </p>
        <p className="mt-2 text-sm text-[#666666]">{phrase.english_text}</p>
        {phrase.audio_url ? (
          <div className="mt-4">
            <AudioPlayer src={phrase.audio_url} />
          </div>
        ) : null}
        <button
          type="button"
          onClick={nextPhrase}
          className="mt-4 w-full rounded-xl border border-black bg-[#F5F5F5] py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white"
        >
          Next phrase
        </button>
      </div>

      <div className="flex min-h-[200px] flex-col gap-2 rounded-2xl border border-black bg-[#F5F5F5] p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[#666666]">
            Type a message — a random stored reply appears (no AI).
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[90%] rounded-xl border px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "ml-auto border-black bg-black text-white"
                  : "border-black bg-white text-black"
              }`}
            >
              {msg.text}
              {msg.role === "assistant" && msg.audioUrl ? (
                <div className="mt-2">
                  <AudioPlayer src={msg.audioUrl} />
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSend && send()}
          placeholder="Say something…"
          className="min-w-0 flex-1 rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="button"
          disabled={!canSend}
          onClick={send}
          className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
