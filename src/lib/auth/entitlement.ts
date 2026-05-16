import { createClient } from "@/lib/supabase/server";
import type { UserEntitlementRow, VaniPlan } from "@/types/db";

/**
 * Resolved entitlement for the current user (or guest).
 *
 * Order of precedence inside `getUserEntitlement`:
 *   1. Env-based hand-allowlist  (TYPE_SAY_REPLY_UNLOCK_USER_IDS)
 *      — lets us comp ourselves / partners without a DB write.
 *   2. `user_entitlements` row written by the payments webhook
 *      (or by hand from the SQL editor for now).
 *   3. Default → free plan, replies locked.
 *
 * `valid_until` is honored: an entitlement past its expiry is treated as
 * `free` so we don't keep giving access to lapsed subscribers.
 */
export type Entitlement = {
  plan: VaniPlan;
  repliesUnlocked: boolean;
  source:
    | "env_allowlist"
    | "db_active"
    | "db_expired"
    | "db_missing"
    | "guest";
};

const REPLIES_FEATURE_ENABLED = process.env.TYPE_SAY_REPLIES_ENABLED === "1";
const REPLY_UNLOCK_USER_IDS = new Set(
  String(process.env.TYPE_SAY_REPLY_UNLOCK_USER_IDS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
);

function envAllowlistedUser(userId: string): boolean {
  if (!REPLIES_FEATURE_ENABLED) return false;
  if (REPLY_UNLOCK_USER_IDS.size === 0) return false;
  return REPLY_UNLOCK_USER_IDS.has(userId);
}

function freeFallback(source: Entitlement["source"]): Entitlement {
  return {
    plan: "free",
    repliesUnlocked: false,
    source,
  };
}

/**
 * Read the current user's entitlement, with env-based override on top.
 * Caller must pass a userId from a verified Supabase session.
 */
export async function getUserEntitlement(
  userId: string,
): Promise<Entitlement> {
  if (envAllowlistedUser(userId)) {
    return {
      plan: "confident",
      repliesUnlocked: true,
      source: "env_allowlist",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_entitlements")
    .select("plan, replies_unlocked, valid_until")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    // RLS will return 0 rows for users without an entry, which is fine —
    // a real error would log here but we still want the user to keep
    // using the free tier instead of seeing a hard failure.
    if (error && error.code !== "PGRST116") {
      console.warn(
        "[entitlement] user_entitlements read failed:",
        error.message,
      );
    }
    return freeFallback("db_missing");
  }

  const row = data as Pick<
    UserEntitlementRow,
    "plan" | "replies_unlocked" | "valid_until"
  >;

  if (row.valid_until) {
    const expired = new Date(row.valid_until).getTime() < Date.now();
    if (expired) {
      return freeFallback("db_expired");
    }
  }

  return {
    plan: row.plan,
    repliesUnlocked: Boolean(row.replies_unlocked),
    source: "db_active",
  };
}
