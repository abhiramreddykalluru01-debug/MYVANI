import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/auth/ensure-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolvePublicOrigin(request: NextRequest): string {
  const url = request.nextUrl;
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (proto && host) {
    return `${proto}://${host}`;
  }
  if (host) {
    return `${url.protocol}//${host}`;
  }
  return url.origin;
}

/**
 * Google OAuth return handler.
 *
 * Critical: session cookies from `exchangeCodeForSession` MUST be written
 * onto the same `NextResponse` we return (see setAll → response.cookies).
 * Using only `cookies()` from `next/headers` in a Route Handler often does
 * not attach auth cookies to the redirect — users appear "signed out" right
 * after Google.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next");

  const origin = resolvePublicOrigin(request);

  const safeNext =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const response = NextResponse.redirect(`${origin}${safeNext}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.warn("[auth/callback] exchangeCodeForSession:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  try {
    await ensureUserProfile(supabase);
  } catch {
    /* best-effort; onboarding can still create the row */
  }

  return response;
}
