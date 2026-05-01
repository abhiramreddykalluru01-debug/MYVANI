"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageView } from "@/lib/analytics/client";

/**
 * Mounts once at root and emits a `$pageview` event on every route change.
 * Safe to import even when PostHog is not configured (events are no-ops).
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = search?.toString() ? `${pathname}?${search.toString()}` : pathname;
    pageView(url);
  }, [pathname, search]);

  return null;
}
