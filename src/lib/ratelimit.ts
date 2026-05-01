/**
 * Distributed rate limiter for VANI.
 *
 * Production: Upstash Redis (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * Local / unset: falls back to in-process memory bucket.
 *
 * Public API stays sync-callable via the `await rateLimit(...)` /
 * `await rateLimitMany(...)` pattern. Callers that previously used the
 * synchronous version still work because they all `await` already.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Bucket = { count: number; windowStart: number; windowMs: number };

const memBuckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  limit: number;
  retryAfterMs: number;
};

export type RateLimitSpec = {
  /** Unique key — e.g. `type-say:ip:1.2.3.4`. Keep stable. */
  key: string;
  /** Max requests allowed in the window. */
  limit: number;
  /** Window size in ms. */
  windowMs: number;
};

// ── Upstash backend (singleton, lazy) ─────────────────────────────────────
let redis: Redis | null = null;
let upstashAvailable = false;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    redis = new Redis({ url, token });
    upstashAvailable = true;
    return redis;
  } catch {
    return null;
  }
}

const limiterCache = new Map<string, Ratelimit>();

function limiterFor(spec: RateLimitSpec): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const cacheKey = `${spec.limit}:${spec.windowMs}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;
  const seconds = Math.max(Math.ceil(spec.windowMs / 1000), 1);
  const limiter = new Ratelimit({
    redis: r,
    // Sliding window is fairer than fixed for bursty UX.
    limiter: Ratelimit.slidingWindow(spec.limit, `${seconds} s`),
    analytics: false,
    prefix: "vani-rl",
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

// ── Public API ────────────────────────────────────────────────────────────

export async function rateLimit(spec: RateLimitSpec): Promise<RateLimitResult> {
  const limiter = limiterFor(spec);
  if (limiter) {
    try {
      const out = await limiter.limit(spec.key);
      const retryAfterMs = Math.max(out.reset - Date.now(), 0);
      return {
        ok: out.success,
        remaining: out.remaining,
        limit: out.limit,
        retryAfterMs,
      };
    } catch (err) {
      // Network/Redis flake — degrade gracefully to memory rather than 500.
      console.warn("[ratelimit] redis error, falling back to memory", err);
    }
  }
  return memRateLimit(spec);
}

export async function rateLimitMany(
  specs: RateLimitSpec[],
): Promise<RateLimitResult> {
  let last: RateLimitResult = {
    ok: true,
    remaining: Number.POSITIVE_INFINITY,
    limit: Number.POSITIVE_INFINITY,
    retryAfterMs: 0,
  };
  for (const s of specs) {
    const r = await rateLimit(s);
    if (!r.ok) return r;
    last = r;
  }
  return last;
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export function callerIdentity(opts: {
  userId?: string | null;
  ip: string;
}): string {
  return opts.userId ? `u:${opts.userId}` : `ip:${opts.ip}`;
}

export function isDistributedRateLimit(): boolean {
  // Touch the lazy initializer.
  getRedis();
  return upstashAvailable;
}

// ── In-memory fallback (single-process only) ──────────────────────────────

function memRateLimit(spec: RateLimitSpec): RateLimitResult {
  cleanupIfNeeded();
  const now = Date.now();
  const b = memBuckets.get(spec.key);

  if (!b || now - b.windowStart >= b.windowMs) {
    memBuckets.set(spec.key, {
      count: 1,
      windowStart: now,
      windowMs: spec.windowMs,
    });
    return {
      ok: true,
      remaining: Math.max(spec.limit - 1, 0),
      limit: spec.limit,
      retryAfterMs: 0,
    };
  }

  if (b.count >= spec.limit) {
    return {
      ok: false,
      remaining: 0,
      limit: spec.limit,
      retryAfterMs: Math.max(b.windowMs - (now - b.windowStart), 0),
    };
  }

  b.count += 1;
  return {
    ok: true,
    remaining: Math.max(spec.limit - b.count, 0),
    limit: spec.limit,
    retryAfterMs: 0,
  };
}

function cleanupIfNeeded() {
  if (memBuckets.size < MAX_BUCKETS) return;
  const now = Date.now();
  for (const [key, b] of memBuckets) {
    if (now - b.windowStart >= b.windowMs) memBuckets.delete(key);
    if (memBuckets.size < MAX_BUCKETS / 2) break;
  }
}
