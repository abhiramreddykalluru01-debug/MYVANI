import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/auth/ensure-user";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolvePublicOrigin(request: Request): string {
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (proto && host) {
    return `${proto}://${host}`;
  }
  if (host) {
    // Fallback when proxy doesn't send x-forwarded-proto.
    return `${url.protocol}//${host}`;
  }
  return url.origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = resolvePublicOrigin(request);
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
