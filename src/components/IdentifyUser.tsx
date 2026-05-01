"use client";

import { useEffect } from "react";
import { identify, track } from "@/lib/analytics/client";

/**
 * Once mounted in an authenticated layout, links the current PostHog
 * anonymous session to the user id. This is what lets the dashboard
 * compute funnels like signin → onboarding → first phrase open.
 */
export function IdentifyUser({
  userId,
  email,
  language,
}: {
  userId: string;
  email?: string | null;
  language?: string | null;
}) {
  useEffect(() => {
    if (!userId) return;
    identify(userId, {
      email: email ?? undefined,
      target_language: language ?? undefined,
    });
    track("session_identified");
  }, [userId, email, language]);

  return null;
}
