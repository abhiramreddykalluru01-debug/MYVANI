"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { callerIdentity, rateLimitMany } from "@/lib/ratelimit";

function ipFromHeaders(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function submitFeedback(input: {
  rating: number;
  message: string;
  contact?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const rating = Number(input.rating);
  const message = String(input.message ?? "").trim();
  const contact = String(input.contact ?? "").trim() || null;

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please select a valid rating." };
  }
  if (!message) {
    return { ok: false, error: "Please add feedback before sending." };
  }
  if (message.length > 1200) {
    return { ok: false, error: "Feedback is too long." };
  }
  if (contact && contact.length > 200) {
    return { ok: false, error: "Contact is too long." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rate limit so spam scripts can't fill the feedback table.
  const ip = ipFromHeaders(await headers());
  const identity = callerIdentity({ userId: user?.id, ip });
  const rl = await rateLimitMany([
    { key: `feedback:ip:${ip}`, limit: 5, windowMs: 60 * 60_000 },
    { key: `feedback:caller:${identity}`, limit: 10, windowMs: 24 * 60 * 60_000 },
  ]);
  if (!rl.ok) {
    return {
      ok: false,
      error: "Too many feedbacks. Please try again later.",
    };
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user?.id ?? null,
    rating,
    message,
    contact,
  });

  if (error) {
    return { ok: false, error: "Could not save feedback right now." };
  }

  return { ok: true };
}
