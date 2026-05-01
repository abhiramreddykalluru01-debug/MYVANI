import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getVaLogoForLanguage } from "@/lib/branding/logo";
import { listFavoritePhrases, listRecentPhrases } from "@/lib/data/phrases";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { DashboardPhraseCards } from "@/components/DashboardPhraseCards";
import type { UserRow } from "@/types/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let languageFrom: string | null = null;
  let favorites: Awaited<ReturnType<typeof listFavoritePhrases>> = [];
  let recents: Awaited<ReturnType<typeof listRecentPhrases>> = [];

  if (user) {
    const languageCode = await getCurrentLanguageCode();
    const [row, favs, recs] = await Promise.all([
      supabase
        .from("users")
        .select("language_from")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => data as Pick<UserRow, "language_from"> | null),
      listFavoritePhrases(user.id, { limit: 5, languageCode }),
      listRecentPhrases(user.id, { limit: 5, languageCode }),
    ]);
    languageFrom = row?.language_from ?? null;
    favorites = favs;
    recents = recs;
  }

  const logoText = getVaLogoForLanguage(languageFrom);

  return (
    <div className="flex flex-col gap-8 pb-6">
      <header>
        <p className="text-sm font-medium text-[#666666]">{logoText}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Ready to speak
        </h1>
      </header>

      {/* Favorites */}
      {favorites.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
              Favorites
            </p>
            <Link
              href="/phrases?type=general&cat=favorites"
              className="text-xs font-medium text-[#666666] hover:text-black"
            >
              See all
            </Link>
          </div>
          <DashboardPhraseCards phrases={favorites} />
        </section>
      ) : null}

      {/* Recents */}
      {recents.length > 0 ? (
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
            Recently used
          </p>
          <DashboardPhraseCards phrases={recents} />
        </section>
      ) : null}

      <section className="grid gap-4">
        <Link
          href="/phrases?type=general"
          className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-[#F5F5F5] hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)] active:scale-[1.01]"
        >
          <h2 className="text-lg font-semibold text-black">General Phrases</h2>
          <p className="mt-1 text-sm text-[#666666]">
            Speak in daily situations.
          </p>
        </Link>

        <Link
          href="/phrases?type=profession"
          className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-[#F5F5F5] hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)] active:scale-[1.01]"
        >
          <h2 className="text-lg font-semibold text-black">
            Profession Phrases
          </h2>
          <p className="mt-1 text-sm text-[#666666]">Speak at work instantly.</p>
        </Link>

        <Link
          href="/quick-help"
          className="flex flex-col items-center rounded-2xl border border-black bg-[#ff1744] p-4 text-center shadow-[0_8px_22px_rgba(255,23,68,0.28)] transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-[#e30034] hover:shadow-[0_12px_28px_rgba(255,23,68,0.36)] active:scale-[1.01]"
        >
          <span className="text-base font-semibold text-white">Quick Help</span>
          <span className="mt-0.5 text-xs font-medium text-white/90">
            Help me &amp; emergency only
          </span>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-semibold text-black">Tourist phrases</p>
            <p className="mt-0.5 text-xs text-[#666666]">Coming soon</p>
          </div>
          <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-semibold text-black">Situational phrases</p>
            <p className="mt-0.5 text-xs text-[#666666]">Coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
