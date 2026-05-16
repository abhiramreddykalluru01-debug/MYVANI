import Link from "next/link";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RecentRecorder } from "@/components/RecentRecorder";
import { getPhraseById, isPhraseFavorited } from "@/lib/data/phrases";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";

type Params = Promise<{ id: string }>;

export default async function PhraseDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const supabase = await createClient();

  // Fetch phrase + user profile + favorite status all in parallel.
  const [phraseResult, profileResult] = await Promise.all([
    getPhraseById(id),
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { user: null, profession: null as string | null };
      const { data: row } = await supabase
        .from("users")
        .select("profession")
        .eq("id", user.id)
        .maybeSingle();
      return {
        user,
        profession:
          (row as Pick<UserRow, "profession"> | null)?.profession ?? null,
      };
    })(),
  ]);

  const phrase = phraseResult;
  if (!phrase) notFound();

  // Gate professional phrases against the user's saved profession.
  if (
    phrase.category.type === "professional" &&
    phrase.category.profession_key !== profileResult.profession
  ) {
    notFound();
  }

  const isFavorited = profileResult.user
    ? await isPhraseFavorited(profileResult.user.id, id)
    : false;

  const backHref =
    phrase.category.type === "professional"
      ? "/phrases?type=professional"
      : phrase.category.type === "quick_help"
        ? `/quick-help?cat=${phrase.category.slug}`
        : `/phrases?type=general&cat=${phrase.category.slug}`;

  // Order replies: for yes_no show yes → no → normal, else by sort_order.
  const orderedReplies = [...phrase.replies].sort((a, b) => {
    if (phrase.answer_mode === "yes_no") {
      const rank = (k: string) => (k === "yes" ? 0 : k === "no" ? 1 : 2);
      const diff = rank(a.reply_kind) - rank(b.reply_kind);
      if (diff !== 0) return diff;
    }
    return a.sort_order - b.sort_order;
  });

  const hasReplyAudio = orderedReplies.some((r) => r.audio_url);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Track recent usage on mount (client-side fire and forget) */}
      {profileResult.user ? (
        <RecentRecorder phraseId={id} />
      ) : null}

      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          className="text-sm font-medium text-[#666666] hover:text-black"
        >
          ← Back
        </Link>
        {profileResult.user ? (
          <FavoriteButton phraseId={id} initialFavorited={isFavorited} />
        ) : null}
      </div>

      <article className="rounded-2xl border border-black bg-white p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#999999]">
          {phrase.english_text}
        </p>
        <p className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
          {phrase.phonetic_text}
        </p>

        <div className="mt-6">
          {phrase.audio_url ? (
            <AudioPlayer src={phrase.audio_url} />
          ) : hasReplyAudio ? (
            <p className="text-sm text-[#666666]">
              No audio for this main line — use the player on each reply below.
            </p>
          ) : (
            <button
              type="button"
              disabled
              className="rounded-lg border border-black bg-[#F5F5F5] px-3 py-1.5 text-xs font-medium text-[#555555]"
            >
              Audio soon
            </button>
          )}
        </div>
      </article>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#666666]">
          {phrase.answer_mode === "yes_no" ? "Yes / No replies" : "Replies"}
        </h2>
        {orderedReplies.length > 0 ? (
          <p className="mt-1 text-xs text-[#999999]">
            Tap a reply row to expand audio (when available).
          </p>
        ) : null}
        {orderedReplies.length === 0 ? (
          <p className="mt-3 text-sm text-[#666666]">
            No replies for this phrase yet.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {orderedReplies.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-black bg-[#F5F5F5] p-4"
              >
                {r.reply_kind !== "normal" ? (
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
                    {r.reply_kind === "yes" ? "Yes" : "No"}
                  </p>
                ) : null}
                <p className="mt-0.5 text-xs uppercase tracking-wide text-[#999999]">
                  {r.english_text}
                </p>
                <p className="mt-1 text-xl font-semibold text-black">
                  {r.phonetic_text}
                </p>
                {r.audio_url ? (
                  <div className="mt-3">
                    <AudioPlayer src={r.audio_url} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
