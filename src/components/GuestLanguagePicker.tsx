"use client";

import { useTransition } from "react";
import { setGuestLanguage } from "@/app/actions/guest-language";
import type { LanguageCode } from "@/types/db";

const OPTIONS: { code: LanguageCode; label: string; script: string }[] = [
  { code: "kn", label: "Kannada", script: "ವಾ" },
  { code: "hi", label: "Hindi", script: "वा" },
  { code: "te", label: "Telugu", script: "వా" },
  { code: "ta", label: "Tamil", script: "வா" },
  { code: "ml", label: "Malayalam", script: "വാ" },
];

export function GuestLanguagePicker({
  currentCode,
}: {
  currentCode: LanguageCode;
}) {
  const [pending, startTransition] = useTransition();

  function choose(code: LanguageCode) {
    if (code === currentCode || pending) return;
    const fd = new FormData();
    fd.append("language", code);
    startTransition(async () => {
      await setGuestLanguage(fd);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#999999]">
        Learning
      </p>
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {OPTIONS.map((o) => {
          const active = o.code === currentCode;
          return (
            <button
              key={o.code}
              type="button"
              disabled={pending}
              onClick={() => choose(o.code)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border border-black px-3 py-1 text-xs font-medium transition-all disabled:opacity-60 ${
                active
                  ? "bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                  : "bg-white text-black hover:bg-[#F5F5F5]"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  active ? "text-white" : "text-black"
                }`}
              >
                {o.script}
              </span>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
