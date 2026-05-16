"use client";

import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)");
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return mq.matches || nav.standalone === true;
}

/**
 * Chrome / Edge / Android: uses beforeinstallprompt when the browser offers it.
 * iOS Safari: no API — shows short instructions for Share → Add to Home Screen.
 */
export function InstallAppPrompt() {
  const [mounted, setMounted] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mounted) return;
    if (isStandalonePwa() || isIos()) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [mounted]);

  const onInstallClick = useCallback(async () => {
    if (!deferred) return;
    setBusy(true);
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* user dismissed or prompt failed */
    } finally {
      setDeferred(null);
      setBusy(false);
    }
  }, [deferred]);

  if (!mounted) return null;

  if (isStandalonePwa()) return null;

  if (isIos()) {
    return (
      <div className="mt-3 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
        <p className="text-xs font-semibold text-black">Add to Home Screen</p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#666666]">
          On iPhone: tap{" "}
          <span className="font-semibold text-black">Share</span>{" "}
          <span className="opacity-60">(□↑)</span>, then{" "}
          <span className="font-semibold text-black">Add to Home Screen</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {deferred ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onInstallClick()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-[#F5F5F5] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
        >
          {busy ? "Opening…" : "Add VANI to Home Screen"}
        </button>
      ) : null}
      <p className="text-center text-[11px] leading-relaxed text-[#9A9A9A]">
        {deferred
          ? "Or use your browser menu: ⋮ → Install app / Add to Home screen."
          : "Android / Chrome: open the menu (⋮) and tap Install app or Add to Home screen when you see it."}
      </p>
    </div>
  );
}
