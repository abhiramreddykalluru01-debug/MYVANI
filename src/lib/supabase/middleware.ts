import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages that should be reachable without a Supabase session.
// Guest mode: browse phrases/practice/quick-help without signing in.
// Locked routes (need auth): /type-say, /profile, /onboarding, /feedback,
// /api/type-say, /actions/*.
// Each entry is matched as either an exact path or `path` + `/` so that
// `/iconography` does NOT match the `/icon` allow-listed prefix.
const PUBLIC_PATHS: readonly string[] = [
  "/login",
  "/privacy",
  "/terms",
  "/auth",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  // PWA: manifest + icons + service worker must load without a session
  // (install / Lighthouse / offline boot).
  "/manifest.webmanifest",
  "/icon",
  "/apple-icon",
  "/sw.js",
  // Guest browse — no Supabase session required.
  "/dashboard",
  "/phrases",
  "/quick-help",
  "/practice",
  "/situation",
  "/api/phrases",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  for (const p of PUBLIC_PATHS) {
    if (pathname === p) return true;
    if (pathname.startsWith(p + "/")) return true;
  }
  // `/_next/*` is the only assets prefix we need wildcard-style; everything
  // else uses the strict `===` or `startsWith(p + "/")` rule above.
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth gate: send unauthenticated visitors to /login for any private page.
  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
