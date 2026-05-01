"use client";

/**
 * PostHog client wrapper.
 *
 * - No-ops if NEXT_PUBLIC_POSTHOG_KEY is not set.
 * - Lazy-initialized so we don't pull the SDK on first paint.
 * - Tracks page views automatically; call `track()` for explicit events.
 */

import posthog from "posthog-js";

let initialized = false;

function ensureInit() {
  if (initialized) return true;
  if (typeof window === "undefined") return false;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // we capture manually after route changes
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage",
    loaded: () => {
      initialized = true;
    },
  });
  initialized = true;
  return true;
}

export function track(name: string, props?: Record<string, unknown>) {
  if (!ensureInit()) return;
  try {
    posthog.capture(name, props);
  } catch {
    /* analytics failures must never break UX */
  }
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (!ensureInit()) return;
  try {
    posthog.identify(userId, traits);
  } catch {
    /* ignore */
  }
}

export function resetAnalytics() {
  if (!ensureInit()) return;
  try {
    posthog.reset();
  } catch {
    /* ignore */
  }
}

export function pageView(path: string) {
  if (!ensureInit()) return;
  try {
    posthog.capture("$pageview", { $current_url: path });
  } catch {
    /* ignore */
  }
}
