import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/auth/ensure-user";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");

  // Guard against open-redirect: only allow same-origin relative paths.
  const safeNext =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Make sure the public.users profile row exists. First-time Google
      // sign-ins land here with only an auth.users row; the rest of the app
      // assumes a profile row, so create it now (idempotent).
      try {
        await ensureUserProfile();
      } catch {
        // Best-effort; UI will still work with a missing row, OnboardingFlow
        // / updateProfile will create/upsert later.
      }
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
