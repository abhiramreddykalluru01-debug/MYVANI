"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` once after first paint.
 *
 *  * Runs in production AND development on purpose — we want to actually
 *    catch offline-only bugs locally. If you ever need to disable in dev,
 *    flip the early-return below.
 *  * The SW itself handles its own cache versioning; this component
 *    triggers `update()` on each page load so a redeployed worker is
 *    picked up promptly instead of waiting for the browser's 24h check.
 *  * Failure here is silent — the app must keep working without a SW.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // In development, SW caching can serve stale Next.js assets and trigger
    // hydration mismatches. Keep dev deterministic by force-cleaning workers
    // and VANI caches, then skip registration entirely.
    if (process.env.NODE_ENV !== "production") {
      void (async () => {
        try {
          const hadController = Boolean(navigator.serviceWorker.controller);
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));

          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(
              keys
                .filter((k) => k.startsWith("vani-"))
                .map((k) => caches.delete(k)),
            );
          }

          // One-time reload so the tab detaches from any previously
          // controlling worker immediately.
          if (
            hadController &&
            !sessionStorage.getItem("vani_sw_dev_cleanup_reloaded")
          ) {
            sessionStorage.setItem("vani_sw_dev_cleanup_reloaded", "1");
            window.location.reload();
          }
        } catch (err) {
          console.warn("[sw] dev cleanup failed:", (err as Error).message);
        }
      })();
      return;
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      // Service workers require https outside localhost — bail quietly.
      return;
    }

    const onLoad = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        // Pull the latest version on each visit so deploys propagate fast.
        void reg.update();
      } catch (err) {
        console.warn("[sw] registration failed:", (err as Error).message);
      }
    };

    if (document.readyState === "complete") {
      void onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}
