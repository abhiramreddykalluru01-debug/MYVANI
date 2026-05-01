import { NextResponse } from "next/server";
import { getPhraseById, isPhraseFavorited } from "@/lib/data/phrases";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { createClient } from "@/lib/supabase/server";
import {
  callerIdentity,
  clientIp,
  rateLimitMany,
} from "@/lib/ratelimit";
import type { UserRow } from "@/types/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Basic UUID-ish guard — avoid hitting the DB with garbage path params.
  if (!/^[0-9a-f-]{8,}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ip = clientIp(req);
  const identity = callerIdentity({ userId: user?.id, ip });
  const rl = await rateLimitMany([
    { key: `phrase-get:ip:${ip}`, limit: 60, windowMs: 60_000 },
    { key: `phrase-get:caller:${identity}`, limit: 120, windowMs: 60_000 },
  ]);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString(),
        },
      },
    );
  }

  const languageCode = await getCurrentLanguageCode();

  const [phrase, profileRow] = await Promise.all([
    getPhraseById(id, { languageCode }),
    user
      ? supabase
          .from("users")
          .select("profession")
          .eq("id", user.id)
          .maybeSingle()
          .then(({ data }) => data as Pick<UserRow, "profession"> | null)
      : Promise.resolve(null),
  ]);

  if (!phrase) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Gate professional phrases.
  if (
    phrase.category.type === "professional" &&
    phrase.category.profession_key !== (profileRow?.profession ?? null)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const isFavorited = user ? await isPhraseFavorited(user.id, id) : false;

  // Sort replies: yes/no mode → yes first, then no, then normal; else sort_order.
  const replies = [...phrase.replies].sort((a, b) => {
    if (phrase.answer_mode === "yes_no") {
      const rank = (k: string) => (k === "yes" ? 0 : k === "no" ? 1 : 2);
      const diff = rank(a.reply_kind) - rank(b.reply_kind);
      if (diff !== 0) return diff;
    }
    return a.sort_order - b.sort_order;
  });

  return NextResponse.json({
    id: phrase.id,
    english_text: phrase.english_text,
    phonetic_text: phrase.phonetic_text,
    audio_url: phrase.audio_url,
    answer_mode: phrase.answer_mode,
    language_code: languageCode,
    category: {
      type: phrase.category.type,
      slug: phrase.category.slug,
      title: phrase.category.title,
    },
    replies: replies.map((r) => ({
      id: r.id,
      english_text: r.english_text,
      phonetic_text: r.phonetic_text,
      audio_url: r.audio_url,
      reply_kind: r.reply_kind,
    })),
    is_favorited: isFavorited,
    is_authenticated: Boolean(user),
  });
}
