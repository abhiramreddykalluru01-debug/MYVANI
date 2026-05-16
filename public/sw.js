/**
 * VANI service worker.
 *
 * Three caches, three strategies:
 *
 *   vani-static-v1  → cache-first
 *       Next.js static assets (/_next/static/*), icons, manifest.
 *       These are immutable per build (hashed URLs) — cache forever.
 *
 *   vani-runtime-v1 → network-first (with cache fallback)
 *       HTML pages and /api/phrases/* JSON. Always try network first so
 *       users get fresh data; if offline, fall back to last good copy.
 *
 *   vani-audio-v1   → cache-first
 *       Supabase Storage WAV files (phrase audio + type-say audio).
 *       Per-URL content is immutable (storage path is content-hashed),
 *       so once cached the audio plays offline immediately.
 *
 * Update flow:
 *   * Bumping the prefix below (e.g. v1 → v2) drops all old caches on
 *     activate. We don't auto-bump — it's a manual decision per release
 *     when the asset URL scheme actually changes.
 */

const VERSION = "v1";
const STATIC_CACHE = `vani-static-${VERSION}`;
const RUNTIME_CACHE = `vani-runtime-${VERSION}`;
const AUDIO_CACHE = `vani-audio-${VERSION}`;

const PRECACHE_URLS = [
  "/dashboard",
  "/phrases",
  "/phrases?type=general",
  "/quick-help",
  "/practice",
  "/manifest.webmanifest",
  "/icon",
  "/apple-icon",
];

const MAX_RUNTIME_ENTRIES = 50;
const MAX_AUDIO_ENTRIES = 200;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Don't fail install if one URL 404s — best-effort.
      await Promise.all(
        PRECACHE_URLS.map((u) =>
          cache.add(u).catch((err) => {
            console.warn("[sw] precache miss:", u, err.message);
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const allowed = new Set([STATIC_CACHE, RUNTIME_CACHE, AUDIO_CACHE]);
      await Promise.all(
        keys.map((k) => (allowed.has(k) ? null : caches.delete(k))),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // We never cache non-GET (would mask state mutations).
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 1) Static assets → cache-first (immutable build artifacts).
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // 2) Audio (Supabase Storage WAVs) → cache-first with LRU cap.
  if (isAudio(url)) {
    event.respondWith(cacheFirstLru(req, AUDIO_CACHE, MAX_AUDIO_ENTRIES));
    return;
  }

  // 3) Phrase detail JSON → network-first.
  if (url.pathname.startsWith("/api/phrases/")) {
    event.respondWith(
      networkFirst(req, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES),
    );
    return;
  }

  // 4) Same-origin HTML (page navigations) → network-first.
  if (req.mode === "navigate" || acceptsHtml(req)) {
    event.respondWith(
      networkFirst(req, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES),
    );
    return;
  }

  // Everything else: don't intercept — let the browser handle it.
});

// ── strategies ──────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    return new Response("Offline", { status: 503 });
  }
}

async function cacheFirstLru(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok || res.type === "opaque") {
      cache.put(request, res.clone());
      void trimCache(cacheName, max);
    }
    return res;
  } catch (err) {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) {
      cache.put(request, res.clone());
      void trimCache(cacheName, max);
    }
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Final fallback for navigations: serve cached /dashboard so the user
    // sees the app shell instead of the browser offline page.
    if (request.mode === "navigate") {
      const shell = await cache.match("/dashboard");
      if (shell) return shell;
    }
    return new Response("Offline", { status: 503 });
  }
}

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  // Evict oldest first (insertion order).
  for (let i = 0; i < keys.length - max; i++) {
    await cache.delete(keys[i]);
  }
}

// ── classifiers ─────────────────────────────────────────────────────────

function isStaticAsset(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (url.pathname === "/manifest.webmanifest") return true;
  if (url.pathname === "/icon" || url.pathname === "/apple-icon") return true;
  if (url.pathname === "/favicon.ico") return true;
  if (/\.(?:png|jpg|jpeg|svg|webp|woff2?)$/.test(url.pathname)) return true;
  return false;
}

function isAudio(url) {
  // Supabase storage public objects live under /storage/v1/object/public/...
  if (url.pathname.includes("/storage/v1/object/public/")) return true;
  if (/\.(?:wav|mp3|ogg|m4a)$/i.test(url.pathname)) return true;
  return false;
}

function acceptsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}
